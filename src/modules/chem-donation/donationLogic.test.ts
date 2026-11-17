import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatVnd,
  formatCompactVnd,
  calculateFundingProgress,
  validateDonationPayload,
  generateTransferSyntax,
  buildAppsScriptCreateUrl,
  buildAppsScriptLeaderboardUrl,
  parseAppsScriptLeaderboardResponse,
  buildDynamicQrPayload,
  rankDonors,
  applyNewDonation,
  donorNamesMatch,
  enrichAndMergeDonors,
} from './donationLogic';
import { DonorRecord } from './types';

test('formatVnd formats currency with dot thousand separators', () => {
  assert.equal(formatVnd(500000), '500.000 ₫');
  assert.equal(formatVnd(12500000, false), '12.500.000');
  assert.equal(formatCompactVnd(215400000), '215,4 Tr ₫');
});

test('calculateFundingProgress computes exact and clamped percentages', () => {
  const res = calculateFundingProgress(45000000, 60000000);
  assert.equal(res.exactPercent, 75.0);
  assert.equal(res.clampedBarPercent, 75.0);
  assert.equal(res.remainingVnd, 15000000);
});

test('validateDonationPayload enforces minimum 2000 VND and required donor name', () => {
  const belowMin = validateDonationPayload({
    donorName: 'Nguyễn Văn A',
    affiliation: 'K65',
    amountVnd: 1500,
    message: '',
    isAnonymous: false,
  });
  assert.equal(belowMin.valid, false);
  assert.ok(belowMin.errors.amountVnd);

  const exactMin = validateDonationPayload({
    donorName: 'Nguyễn Văn A',
    affiliation: 'K65',
    amountVnd: 2000,
    message: 'Ủng hộ CLB BWAN',
    isAnonymous: false,
  });
  assert.equal(exactMin.valid, true);
});

test('buildAppsScriptCreateUrl and buildAppsScriptLeaderboardUrl format exact Apps Script GET URLs', () => {
  const createUrl = buildAppsScriptCreateUrl(50000, 'Nguyễn Minh Khôi');
  assert.equal(
    createUrl,
    'https://script.google.com/macros/s/AKfycbz3dnC7cD8im5BWN-Vx4ZjwKep1qgK7ttWf1QLyxU-MQNXeMKzFPXvCy6v3Ul8gKN12/exec?action=create&amount=50000&name=Nguy%E1%BB%85n%20Minh%20Kh%C3%B4i'
  );

  const leaderboardUrl = buildAppsScriptLeaderboardUrl();
  assert.equal(
    leaderboardUrl,
    'https://script.google.com/macros/s/AKfycbz3dnC7cD8im5BWN-Vx4ZjwKep1qgK7ttWf1QLyxU-MQNXeMKzFPXvCy6v3Ul8gKN12/exec?action=leaderboard'
  );
});

test('parseAppsScriptLeaderboardResponse parses { status: "success", data: [{ time, name, amount }] } and rankDonors sums duplicate names', () => {
  const rawJson = {
    status: 'success',
    data: [
      { time: '2026-11-08T07:20:00.000Z', name: 'VQRIO123', amount: 1000 },
      { time: '2026-11-08T07:28:33.169Z', name: 'BWAN Minh', amount: 3000 },
      { time: '2026-11-08T07:39:48.961Z', name: 'BWAN Jeff', amount: 30000 },
      { time: '2026-11-08T07:45:00.000Z', name: 'bwan jeff', amount: 20000 },
    ],
  };

  const parsed = parseAppsScriptLeaderboardResponse(rawJson);
  assert.equal(parsed.length, 3);
  // Sorted newest first for real-time feed
  assert.equal(parsed[0].amountVnd, 20000);
  assert.equal(parsed[1].amountVnd, 30000);
  assert.equal(parsed[2].amountVnd, 3000);

  // Aggregated by matching name (case-insensitive) for Top Donate ranking
  const ranked = rankDonors(parsed);
  assert.equal(ranked.length, 2);
  assert.equal(ranked[0].donorName, 'jeff');
  assert.equal(ranked[0].totalAmountVnd, 50000);
  assert.equal(ranked[0].donationsCount, 2);
  assert.equal(ranked[1].donorName, 'Minh');
  assert.equal(ranked[1].totalAmountVnd, 3000);
});

test('buildDynamicQrPayload returns amount-specific EMV payload and deterministic QR matrix', () => {
  const bankConfig = {
    bankName: 'Vietcombank',
    bankShortCode: 'VCB',
    accountNumber: '0451000892468',
    accountHolder: 'QUY CLB HOA HOC BWAN',
    branchName: 'Hà Nội',
    transferPrefix: 'BWANCHEM',
  };

  const qr1 = buildDynamicQrPayload({
    amountVnd: 125000,
    transferMemo: 'BWANCHEM QUY2026 AN',
    receiptCode: 'REC-01',
    donorName: 'An',
    bankConfig,
  });

  const qr2 = buildDynamicQrPayload({
    amountVnd: 500000,
    transferMemo: 'BWANCHEM QUY2026 AN',
    receiptCode: 'REC-02',
    donorName: 'An',
    bankConfig,
  });

  assert.equal(qr1.matrixCells.length, 81);
  assert.notDeepEqual(qr1.matrixCells, qr2.matrixCells);
});

test('rankDonors aggregates multiple donations by same patron and assigns periodic badges', () => {
  const sampleDonors: DonorRecord[] = [
    {
      id: 'd1',
      name: 'TS. Nguyễn Minh Hoàng',
      affiliation: 'Cựu SV K54',
      amountVnd: 6000000,
      message: 'Đợt 1',
      timestampIso: '2026-10-01T10:00:00Z',
      verifiedReceiptCode: 'REC-01',
    },
    {
      id: 'd2',
      name: 'TS. Nguyễn Minh Hoàng',
      affiliation: 'Cựu SV K60',
      amountVnd: 5000000,
      message: 'Đợt 2',
      timestampIso: '2026-10-15T10:00:00Z',
      verifiedReceiptCode: 'REC-02',
    },
  ];

  const ranked = rankDonors(sampleDonors);
  assert.equal(ranked.length, 1);
  assert.equal(ranked[0].totalAmountVnd, 11000000);
  assert.equal(ranked[0].chemicalBadge.symbol, 'Pt');
});

test('applyNewDonation increments unified fund raised amount and prepends donor record', () => {
  const result = applyNewDonation(
    208500000,
    203,
    [],
    {
      donorName: 'Phạm Quốc Bảo',
      affiliation: 'Cựu SV K60',
      amountVnd: 1500000,
      message: 'Góp viên gạch nhỏ cho CLB',
      isAnonymous: false,
    },
    'BWANCHEM',
    'QUY2026'
  );

  assert.equal(result.updatedRaisedVnd, 210000000);
  assert.equal(result.updatedSupportersCount, 204);
  assert.equal(result.updatedDonors.length, 1);
});

test('generateTransferSyntax strips Vietnamese diacritics cleanly', () => {
  const syntax = generateTransferSyntax('BWANCHEM', 'QUY2026', 'Nguyễn Đặng Hoàng', 250000);
  assert.equal(syntax.transferMemo, 'BWANCHEM QUY2026 DANGHOANG');
});

test('donorNamesMatch and enrichAndMergeDonors attach donor messages across remote Apps Script refreshes', () => {
  assert.equal(donorNamesMatch('Nguyễn Minh Khôi', 'NGUYEN MINH KHOI'), true);
  assert.equal(donorNamesMatch('BWAN Trần Minh Trí', 'Tran Minh Tri'), true);

  const remoteRecords: DonorRecord[] = [
    {
      id: 'sheet-1',
      name: 'NGUYEN MINH KHOI',
      affiliation: 'Nhà hảo tâm BWAN CLUB',
      amountVnd: 50000,
      message: '',
      timestampIso: '2026-11-08T08:00:00.000Z',
      verifiedReceiptCode: 'BWAN-0001',
    },
  ];

  const enriched = enrichAndMergeDonors(
    remoteRecords,
    [],
    [
      {
        id: 'intent-1',
        name: 'Nguyễn Minh Khôi',
        affiliation: 'Cựu học sinh Chuyên Hóa Lê Quý Đôn',
        amountVnd: 50000,
        message: 'Chúc BWAN CLUB Gen 6 rực rỡ!',
        timestampIso: '2026-11-08T07:59:00.000Z',
      },
    ],
    []
  );

  assert.equal(enriched.length, 1);
  assert.equal(enriched[0].name, 'Nguyễn Minh Khôi');
  assert.equal(enriched[0].affiliation, 'Cựu học sinh Chuyên Hóa Lê Quý Đôn');
  assert.equal(enriched[0].message, 'Chúc BWAN CLUB Gen 6 rực rỡ!');
});

