/**
 * Types & Configuration Contract for the Chemistry Club Unified Donation Module
 * Designed as a zero-coupling, portable contract so clubs can pass custom data or sync via API.
 */

export interface FundAllocationItem {
  id: string;
  code: string;
  title: string;
  percentage: number;
  allocatedVnd: number;
  description: string;
  deliverables: string[];
  specificationNote: string;
}

export interface UpcomingClubEvent {
  id: string;
  code: string;
  title: string;
  dateRange: string;
  location: string;
  categoryLabel: string;
  summary: string;
  expectedParticipants: string;
  imageUrl: string;
  imageCaption: string;
  highlightDeliverable: string;
}

export interface DonorRecord {
  id: string;
  name: string;
  affiliation: string;
  amountVnd: number;
  message: string;
  timestampIso: string;
  isAnonymous?: boolean;
  verifiedReceiptCode: string;
}

export interface GoldSponsor {
  id: string;
  organizationName: string;
  chemicalSymbol: string;
  atomicNumber: number;
  atomicMass: string;
  tierLabel: 'Kim Cương (Pt-78)' | 'Vàng (Au-79)' | 'Đồng Hành Học Thuật (Ag-47)';
  annualCommitmentVnd: number;
  sinceYear: number;
  supportedInitiative: string;
  quote: string;
  representativeName: string;
  representativeRole: string;
  websiteUrl: string;
}

export interface RoadmapMilestone {
  id: string;
  phaseIndex: string;
  period: string;
  title: string;
  subtitle: string;
  description: string;
  keyDeliverables: string[];
  requiredBudgetVnd: number;
  status: 'completed' | 'in_progress' | 'upcoming';
}

export interface BankTransferConfig {
  bankName: string;
  bankShortCode: string;
  accountNumber: string;
  accountHolder: string;
  branchName: string;
  transferPrefix: string;
  /**
   * Optional custom QR URL template or resolver.
   * Placeholders supported: {AMOUNT}, {MEMO}, {ACCOUNT_NO}, {BANK_CODE}, {ACCOUNT_NAME}
   */
  qrTemplateUrl?: string;
}

export interface QrCodeRequestParams {
  amountVnd: number;
  transferMemo: string;
  receiptCode: string;
  donorName: string;
  bankConfig: BankTransferConfig;
}

export interface ChemDonationModuleConfig {
  clubName: string;
  clubShortName: string;
  clubLogoUrl: string;
  institutionName: string;
  foundedYear: number;
  primaryColorHex: string;
  missionHeadline: string;
  missionSubheadline: string;
  heroImageUrl: string;
  heroImageCaption: string;
  campaignCode: string;
  campaignTitle: string;
  totalTargetVnd: number;
  initialRaisedVnd: number;
  initialSupportersCount: number;
  bankConfig: BankTransferConfig;
  presetAmountsVnd: number[];
  fundAllocations: FundAllocationItem[];
  upcomingEvents: UpcomingClubEvent[];
  initialDonors: DonorRecord[];
  goldSponsors: GoldSponsor[];
  roadmap: RoadmapMilestone[];
}

export interface DonationSubmissionPayload {
  donorName: string;
  affiliation: string;
  amountVnd: number;
  message: string;
  isAnonymous: boolean;
}
