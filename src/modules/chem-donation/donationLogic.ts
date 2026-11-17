import {
  DonorRecord,
  DonationSubmissionPayload,
  QrCodeRequestParams,
} from './types';

export interface DonationIntentItem {
  id: string;
  paymentLinkId?: string;
  orderCode?: string | number;
  name: string;
  affiliation: string;
  amountVnd: number;
  message: string;
  receiptCode?: string;
  timestampIso: string;
}

const LOCAL_DONATION_INTENTS_KEY = 'bwan_donation_messages_v2';

/**
 * Normalizes a Vietnamese donor name for accent-insensitive, case-insensitive matching
 * between form inputs ("Trần Minh Trí") and bank/Apps Script leaderboard records ("TRAN MINH TRI").
 */
export function normalizeDonorKey(rawName: string): string {
  return (rawName || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/gi, 'd')
    .replace(/^.*?\bBWAN\s*/i, '')
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

export function donorNamesMatch(nameA: string, nameB: string): boolean {
  const normA = normalizeDonorKey(nameA);
  const normB = normalizeDonorKey(nameB);
  if (!normA || !normB) return false;
  if (normA === normB) return true;
  if (normA.length >= 3 && normB.includes(normA)) return true;
  if (normB.length >= 3 && normA.includes(normB)) return true;
  return false;
}

export function loadLocalDonationIntents(): DonationIntentItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_DONATION_INTENTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveLocalDonationIntent(intent: DonationIntentItem): DonationIntentItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const existing = loadLocalDonationIntents();
    const filtered = existing.filter(
      (item) =>
        !(
          (intent.paymentLinkId && item.paymentLinkId === intent.paymentLinkId) ||
          (donorNamesMatch(item.name, intent.name) &&
            Math.round(item.amountVnd) === Math.round(intent.amountVnd) &&
            item.message === intent.message)
        )
    );
    const updated = [intent, ...filtered].slice(0, 200);
    window.localStorage.setItem(LOCAL_DONATION_INTENTS_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

/**
 * Enriches remote Google Apps Script leaderboard records (which only contain time, name, amount)
 * with donor messages and affiliations persisted in server verified donations, server donation intents,
 * browser localStorage intents, and current in-memory donor records.
 */
export function enrichAndMergeDonors(
  remoteRecords: DonorRecord[],
  localVerified: DonorRecord[] = [],
  serverIntents: DonationIntentItem[] = [],
  localIntents: DonationIntentItem[] = [],
  previousDonors: DonorRecord[] = []
): DonorRecord[] {
  // Collect all known metadata sources that have a message or custom affiliation
  const metadataSources: Array<{
    name: string;
    amountVnd: number;
    message: string;
    affiliation: string;
    receiptCode?: string;
    used?: boolean;
  }> = [];

  const pushSource = (src: {
    name: string;
    amountVnd: number;
    message?: string;
    affiliation?: string;
    receiptCode?: string;
  }) => {
    const cleanMsg = (src.message || '').trim();
    const cleanAff = (src.affiliation || '').trim();
    if (!cleanMsg && !cleanAff) return;
    metadataSources.push({
      name: src.name,
      amountVnd: Math.round(Number(src.amountVnd) || 0),
      message: cleanMsg,
      affiliation: cleanAff,
      receiptCode: src.receiptCode,
      used: false,
    });
  };

  for (const v of localVerified) {
    pushSource({
      name: v.name,
      amountVnd: v.amountVnd,
      message: v.message,
      affiliation: v.affiliation,
      receiptCode: v.verifiedReceiptCode,
    });
  }
  for (const li of localIntents) {
    pushSource(li);
  }
  for (const si of serverIntents) {
    pushSource(si);
  }
  for (const prev of previousDonors) {
    if (prev.message && prev.message.trim().length > 0) {
      pushSource({
        name: prev.name,
        amountVnd: prev.amountVnd,
        message: prev.message,
        affiliation: prev.affiliation,
        receiptCode: prev.verifiedReceiptCode,
      });
    }
  }

  const enrichedRemote = remoteRecords.map((remote) => {
    // 1. Try exact name + amount match with a non-empty message first
    let matched = metadataSources.find(
      (src) =>
        !src.used &&
        src.message.length > 0 &&
        src.amountVnd === Math.round(remote.amountVnd) &&
        donorNamesMatch(src.name, remote.name)
    );

    // 2. Fallback: match by donor name with a non-empty message (e.g. if donor attached a message to their name)
    if (!matched) {
      matched = metadataSources.find(
        (src) =>
          !src.used &&
          src.message.length > 0 &&
          donorNamesMatch(src.name, remote.name)
      );
    }

    // 3. Fallback: match by name + amount for custom affiliation even if no message
    if (!matched) {
      matched = metadataSources.find(
        (src) =>
          !src.used &&
          src.amountVnd === Math.round(remote.amountVnd) &&
          donorNamesMatch(src.name, remote.name)
      );
    }

    if (matched) {
      matched.used = true;
      return {
        ...remote,
        name: matched.name || remote.name,
        message: remote.message?.trim() || matched.message || '',
        affiliation:
          matched.affiliation &&
          matched.affiliation !== 'Người ủng hộ qua cổng QR CLB BWAN'
            ? matched.affiliation
            : remote.affiliation,
      };
    }

    return remote;
  });

  // Also preserve any verified local records not yet reflected in remoteRecords
  const merged = [...enrichedRemote];
  for (const localItem of localVerified) {
    const alreadyInRemote = enrichedRemote.some(
      (r) =>
        Math.round(r.amountVnd) === Math.round(localItem.amountVnd) &&
        donorNamesMatch(r.name, localItem.name)
    );
    if (!alreadyInRemote) {
      merged.unshift(localItem);
    }
  }

  return merged;
}

/**
 * Formats an integer amount in VND with standard dot separators and tabular precision.
 * Example: 1500000 -> "1.500.000 ₫"
 */
export function formatVnd(amount: number, includeSymbol = true): string {
  const safeAmount = Math.max(0, Math.round(amount || 0));
  const formatted = safeAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return includeSymbol ? `${formatted} ₫` : formatted;
}

/**
 * Formats large VND amounts in compact millions (Triệu) for clean KPI readouts.
 * Example: 185000000 -> "185,0 Tr ₫"
 */
export function formatCompactVnd(amount: number): string {
  const safeAmount = Math.max(0, Math.round(amount || 0));
  if (safeAmount >= 1_000_000_000) {
    const billions = (safeAmount / 1_000_000_000).toFixed(2).replace('.', ',');
    return `${billions} Tỷ ₫`;
  }
  if (safeAmount >= 1_000_000) {
    const millions = (safeAmount / 1_000_000).toFixed(1).replace('.', ',');
    return `${millions} Tr ₫`;
  }
  return formatVnd(safeAmount);
}

/**
 * Calculates percentage progress of the club's unified funding goal (clamped 0..100 for bar width,
 * and exact percentage to 1 decimal place for scientific accuracy).
 */
export function calculateFundingProgress(raisedVnd: number, targetVnd: number): {
  exactPercent: number;
  clampedBarPercent: number;
  remainingVnd: number;
} {
  if (targetVnd <= 0) {
    return { exactPercent: 0, clampedBarPercent: 0, remainingVnd: 0 };
  }
  const safeRaised = Math.max(0, raisedVnd);
  const exactPercent = Number(((safeRaised / targetVnd) * 100).toFixed(1));
  const clampedBarPercent = Math.min(100, Math.max(0, exactPercent));
  const remainingVnd = Math.max(0, targetVnd - safeRaised);

  return {
    exactPercent,
    clampedBarPercent,
    remainingVnd,
  };
}

export const APPS_SCRIPT_QR_ENDPOINT =
  'https://script.google.com/macros/s/AKfycbz3dnC7cD8im5BWN-Vx4ZjwKep1qgK7ttWf1QLyxU-MQNXeMKzFPXvCy6v3Ul8gKN12/exec';

/**
 * Builds the exact Google Apps Script GET URL to create a QR payment checkout link.
 */
export function buildAppsScriptCreateUrl(
  amount: number,
  name: string,
  baseUrl: string = APPS_SCRIPT_QR_ENDPOINT
): string {
  const safeAmount = Math.max(0, Math.round(amount || 0));
  const cleanName = (name || '').trim() || 'Nhà Hảo Tâm';
  return `${baseUrl}?action=create&amount=${safeAmount}&name=${encodeURIComponent(cleanName)}`;
}

/**
 * Builds the exact Google Apps Script GET URL to fetch the real-time leaderboard data.
 */
export function buildAppsScriptLeaderboardUrl(
  baseUrl: string = APPS_SCRIPT_QR_ENDPOINT
): string {
  return `${baseUrl}?action=leaderboard`;
}

export interface AppsScriptLeaderboardItem {
  time?: string | number;
  name?: string;
  amount?: number | string;
  message?: string;
}

export interface AppsScriptLeaderboardResponse {
  status?: string;
  data?: AppsScriptLeaderboardItem[];
}

/**
 * Parses the JSON response `{ status: "success", data: [{ time, name, amount }] }`
 * from the Google Apps Script `?action=leaderboard` endpoint into normalized DonorRecord items
 * sorted from newest to oldest.
 */
export function parseAppsScriptLeaderboardResponse(
  payload: unknown
): DonorRecord[] {
  if (!payload || typeof payload !== 'object') {
    return [];
  }

  const responseObj = payload as AppsScriptLeaderboardResponse;
  if (!Array.isArray(responseObj.data)) {
    return [];
  }

  const parsedRecords: DonorRecord[] = [];

  responseObj.data.forEach((rawItem, idx) => {
    if (!rawItem || typeof rawItem !== 'object') return;
    const rawAmount = Number(rawItem.amount);
    if (!Number.isFinite(rawAmount) || rawAmount <= 0) return;

    const rawNameStr = String(rawItem.name ?? '').trim();
    if (rawNameStr.toUpperCase() === 'VQRIO123') return;
    const cleanName =
      rawNameStr.replace(/^.*?\bBWAN\s*/i, '').trim() ||
      'Nhà Hảo Tâm Ẩn Danh';
    const rawTimeStr = rawItem.time ? String(rawItem.time).trim() : '';
    const parsedDate = rawTimeStr ? new Date(rawTimeStr) : null;
    const timestampIso =
      parsedDate && !Number.isNaN(parsedDate.getTime())
        ? parsedDate.toISOString()
        : rawTimeStr || new Date(0).toISOString();

    const { receiptCode } = generateTransferSyntax(
      'BWANCHEM',
      'QUY2026',
      cleanName,
      rawAmount
    );

    parsedRecords.push({
      id: `gs_${idx}_${timestampIso}_${Math.round(rawAmount)}`,
      name: cleanName,
      affiliation: 'Người ủng hộ qua cổng QR CLB BWAN',
      amountVnd: Math.round(rawAmount),
      message: rawItem.message ? String(rawItem.message).trim() : '',
      timestampIso,
      isAnonymous: false,
      verifiedReceiptCode: receiptCode,
    });
  });

  // Sắp xếp các lượt ủng hộ mới nhất lên đầu theo thời gian thực
  return parsedRecords.sort((a, b) =>
    b.timestampIso.localeCompare(a.timestampIso)
  );
}

/**
 * Formats an ISO timestamp into a concise date-time string for the real-time feed.
 */
export function formatDonationTimestamp(
  timestampIso: string,
  lang: 'vi' | 'en' = 'vi'
): string {
  if (!timestampIso) return lang === 'en' ? 'Just now' : 'Vừa xong';
  const date = new Date(timestampIso);
  if (Number.isNaN(date.getTime())) {
    return timestampIso;
  }
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(date.getHours())}:${pad(date.getMinutes())} · ${pad(
    date.getDate()
  )}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
}

/**
 * Validates a unified "Tùy Tâm" donation submission payload.
 * Requires name (unless anonymous) and minimum 2.000 VNĐ as required by the QR payment gateway.
 */
export function validateDonationPayload(
  payload: DonationSubmissionPayload,
  lang: 'vi' | 'en' = 'vi'
): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!payload.isAnonymous && (!payload.donorName || payload.donorName.trim().length < 2)) {
    errors.donorName =
      lang === 'en'
        ? 'Please enter the supporter name (minimum 2 characters).'
        : 'Vui lòng nhập Tên người ủng hộ (tối thiểu 2 ký tự).';
  }

  if (!Number.isFinite(payload.amountVnd) || payload.amountVnd < 2_000) {
    errors.amountVnd =
      lang === 'en'
        ? 'Minimum donation amount is 2,000 VND.'
        : 'Số tiền muốn ủng hộ tối thiểu là 2.000 VNĐ.';
  } else if (payload.amountVnd > 10_000_000_000) {
    errors.amountVnd =
      lang === 'en'
        ? 'Amount exceeds automated QR limit. Please contact the Executive Board.'
        : 'Số tiền vượt hạn mức tạo mã QR tự động. Vui lòng liên hệ Ban Chủ Nhiệm.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Generates a deterministic academic receipt code and VietQR transfer syntax for the unified fund.
 * Includes the amount signature so each custom amount generates a distinct receipt & QR signature.
 */
export function generateTransferSyntax(
  prefix: string,
  campaignCode: string,
  donorName: string,
  amountVnd: number = 0
): {
  transferMemo: string;
  receiptCode: string;
} {
  const cleanCampaign = campaignCode.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 8);
  const cleanName = (donorName || 'TUYTAM')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .trim()
    .toUpperCase()
    .split(/\s+/)
    .slice(-2)
    .join('');

  const shortHash = Math.abs(
    Array.from(`${cleanCampaign}${cleanName}${Math.round(amountVnd || 0)}`).reduce(
      (acc, char) => (acc * 31 + char.charCodeAt(0)) | 0,
      79
    )
  )
    .toString(16)
    .toUpperCase()
    .slice(0, 4)
    .padStart(4, '0');

  return {
    transferMemo: `${prefix} ${cleanCampaign} ${cleanName || 'TUYTAM'}`.trim(),
    receiptCode: `REC-2026-${shortHash}`,
  };
}

/**
 * Pluggable QR Code Resolver ("Đoạn trả lại mã QR tương ứng với số tiền"):
 * Replace the body of this function or pass `resolveQrCodeUrl` prop when integrating your custom QR API / VietQR URL.
 * Also generates a deterministic 9x9 boolean matrix seeded by `amountVnd` and `transferMemo` for instant visual preview.
 */
export function buildDynamicQrPayload(params: QrCodeRequestParams): {
  qrImageUrl: string | null;
  emvPayloadString: string;
  matrixCells: boolean[];
} {
  const { amountVnd, transferMemo, bankConfig } = params;
  const safeAmount = Math.max(0, Math.round(amountVnd || 0));

  let qrImageUrl: string | null = null;
  if (bankConfig.qrTemplateUrl) {
    qrImageUrl = bankConfig.qrTemplateUrl
      .replace('{AMOUNT}', encodeURIComponent(String(safeAmount)))
      .replace('{MEMO}', encodeURIComponent(transferMemo))
      .replace('{ACCOUNT_NO}', encodeURIComponent(bankConfig.accountNumber))
      .replace('{BANK_CODE}', encodeURIComponent(bankConfig.bankShortCode))
      .replace('{ACCOUNT_NAME}', encodeURIComponent(bankConfig.accountHolder));
  }

  const emvPayloadString = `VIETQR|BANK:${bankConfig.bankShortCode}|ACC:${bankConfig.accountNumber}|AMOUNT:${safeAmount}|MEMO:${transferMemo}`;

  let seed = (safeAmount ^ 0x5a5a5a5a) >>> 0;
  for (let i = 0; i < emvPayloadString.length; i++) {
    seed = (Math.imul(seed, 31) + emvPayloadString.charCodeAt(i)) >>> 0;
  }

  const matrixCells: boolean[] = [];
  for (let idx = 0; idx < 81; idx++) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    matrixCells.push(((seed >>> 16) & 1) === 1);
  }

  return {
    qrImageUrl,
    emvPayloadString,
    matrixCells,
  };
}

/**
 * Aggregates top donors by total contribution across one or multiple donations
 * with matching names (case-insensitive), sorted descending by totalAmountVnd.
 */
export interface RankedDonorSummary {
  rank: number;
  donorName: string;
  affiliation: string;
  totalAmountVnd: number;
  donationsCount: number;
  latestMessage: string;
  latestReceiptCode: string;
  latestTimestamp: string;
  chemicalBadge: {
    symbol: string;
    atomicNumber: number;
    name: string;
  };
}

const CHEMICAL_HONOR_TIERS = [
  { minVnd: 10_000_000, symbol: 'Pt', atomicNumber: 78, name: 'Platinum Patron' },
  { minVnd: 5_000_000, symbol: 'Au', atomicNumber: 79, name: 'Aurum Fellow' },
  { minVnd: 1_000_000, symbol: 'Ag', atomicNumber: 47, name: 'Argentum Scholar' },
  { minVnd: 0, symbol: 'Cu', atomicNumber: 29, name: 'Cuprum Supporter' },
];

export function getChemicalBadgeForAmount(amountVnd: number) {
  for (const tier of CHEMICAL_HONOR_TIERS) {
    if (amountVnd >= tier.minVnd) {
      return {
        symbol: tier.symbol,
        atomicNumber: tier.atomicNumber,
        name: tier.name,
      };
    }
  }
  return CHEMICAL_HONOR_TIERS[CHEMICAL_HONOR_TIERS.length - 1];
}

export function rankDonors(donors: DonorRecord[]): RankedDonorSummary[] {
  const map = new Map<
    string,
    {
      donorName: string;
      affiliation: string;
      totalAmountVnd: number;
      donationsCount: number;
      latestMessage: string;
      latestTimestamp: string;
      latestReceiptCode: string;
    }
  >();

  for (const record of donors) {
    const displayName = record.isAnonymous
      ? 'Nhà Hảo Tâm Ẩn Danh'
      : record.name.trim() || 'Nhà Hảo Tâm Ẩn Danh';
    const normalizedNameKey = record.isAnonymous
      ? `anon_${record.id}`
      : displayName.toLowerCase().replace(/\s+/g, ' ');

    const existing = map.get(normalizedNameKey);
    if (!existing) {
      map.set(normalizedNameKey, {
        donorName: displayName,
        affiliation: record.affiliation,
        totalAmountVnd: record.amountVnd,
        donationsCount: 1,
        latestMessage: record.message,
        latestTimestamp: record.timestampIso,
        latestReceiptCode: record.verifiedReceiptCode,
      });
    } else {
      existing.totalAmountVnd += record.amountVnd;
      existing.donationsCount += 1;
      if (record.message && !existing.latestMessage) {
        existing.latestMessage = record.message;
      }
      if (record.timestampIso >= existing.latestTimestamp) {
        existing.latestTimestamp = record.timestampIso;
        if (record.message) existing.latestMessage = record.message;
        if (record.affiliation) existing.affiliation = record.affiliation;
        existing.latestReceiptCode = record.verifiedReceiptCode;
      }
    }
  }

  const sorted = Array.from(map.values()).sort((a, b) => {
    if (b.totalAmountVnd !== a.totalAmountVnd) {
      return b.totalAmountVnd - a.totalAmountVnd;
    }
    return b.latestTimestamp.localeCompare(a.latestTimestamp);
  });

  return sorted.map((item, idx) => ({
    rank: idx + 1,
    donorName: item.donorName,
    affiliation: item.affiliation,
    totalAmountVnd: item.totalAmountVnd,
    donationsCount: item.donationsCount,
    latestMessage: item.latestMessage,
    latestReceiptCode: item.latestReceiptCode,
    latestTimestamp: item.latestTimestamp,
    chemicalBadge: getChemicalBadgeForAmount(item.totalAmountVnd),
  }));
}

/**
 * Immutable state transition when a new unified donation is submitted:
 * updates total raisedVnd, supportersCount, and prepends the new donor record (with message).
 */
export function applyNewDonation(
  currentRaisedVnd: number,
  currentSupportersCount: number,
  donors: DonorRecord[],
  payload: DonationSubmissionPayload,
  transferPrefix = 'BWANCHEM',
  campaignCode = 'QUY2026'
): {
  updatedRaisedVnd: number;
  updatedSupportersCount: number;
  updatedDonors: DonorRecord[];
  createdRecord: DonorRecord;
} {
  const { receiptCode } = generateTransferSyntax(
    transferPrefix,
    campaignCode,
    payload.isAnonymous ? 'ANDANH' : payload.donorName,
    payload.amountVnd
  );

  const createdRecord: DonorRecord = {
    id: `don_${Date.now()}`,
    name: payload.isAnonymous ? 'Nhà Hảo Tâm Ẩn Danh' : payload.donorName.trim(),
    affiliation: payload.affiliation.trim() || 'Cộng đồng yêu Hóa học',
    amountVnd: payload.amountVnd,
    message: payload.message.trim(),
    timestampIso: new Date().toISOString(),
    isAnonymous: payload.isAnonymous,
    verifiedReceiptCode: receiptCode,
  };

  return {
    updatedRaisedVnd: currentRaisedVnd + payload.amountVnd,
    updatedSupportersCount: currentSupportersCount + 1,
    updatedDonors: [createdRecord, ...donors],
    createdRecord,
  };
}
