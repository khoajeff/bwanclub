import {
  DonorRecord,
  DonationSubmissionPayload,
  QrCodeRequestParams,
} from './types';

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
      message: '',
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
 * Formats an ISO timestamp into a concise Vietnamese date-time string for the real-time feed.
 */
export function formatDonationTimestamp(timestampIso: string): string {
  if (!timestampIso) return 'Vừa xong';
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
export function validateDonationPayload(payload: DonationSubmissionPayload): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!payload.isAnonymous && (!payload.donorName || payload.donorName.trim().length < 2)) {
    errors.donorName = 'Vui lòng nhập Tên người ủng hộ (tối thiểu 2 ký tự).';
  }

  if (!Number.isFinite(payload.amountVnd) || payload.amountVnd < 2_000) {
    errors.amountVnd = 'Số tiền muốn ủng hộ tối thiểu là 2.000 VNĐ.';
  } else if (payload.amountVnd > 10_000_000_000) {
    errors.amountVnd = 'Số tiền vượt hạn mức tạo mã QR tự động. Vui lòng liên hệ Ban Chủ Nhiệm.';
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

  // Generate 81 deterministic cells (9x9 inner data grid) so the QR visually responds to the exact amount entered
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
    message:
      payload.message.trim() ||
      'Chúc Câu lạc bộ Hóa học ngày càng phát triển vững mạnh và lan tỏa đam mê thực nghiệm!',
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
