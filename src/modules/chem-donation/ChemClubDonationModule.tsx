import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ChemDonationModuleConfig,
  DonationSubmissionPayload,
  DonorRecord,
  QrCodeRequestParams,
} from './types';
import { DEFAULT_CHEM_DONATION_CONFIG } from './defaultData';
import {
  formatVnd,
  calculateFundingProgress,
  applyNewDonation,
  rankDonors,
  buildAppsScriptLeaderboardUrl,
  parseAppsScriptLeaderboardResponse,
  formatDonationTimestamp,
  loadLocalDonationIntents,
  saveLocalDonationIntent,
  enrichAndMergeDonors,
  donorNamesMatch,
  DonationIntentItem,
} from './donationLogic';
import { QuickDonatePanel } from './components/QuickDonatePanel';
import { TopDonorsSection } from './components/TopDonorsSection';
import {
  Crown,
  Sparkles,
  TrendingUp,
  Users,
  Clock,
  RefreshCw,
  HeartHandshake,
  ArrowRight,
} from 'lucide-react';
import { motion } from 'motion/react';

export interface ChemClubDonationModuleProps {
  config?: ChemDonationModuleConfig;
  lang?: 'vi' | 'en';
  onDonationCreated?: (
    record: DonorRecord,
    updatedConfig: ChemDonationModuleConfig
  ) => void;
  resolveCustomQrUrl?: (params: QrCodeRequestParams) => string | null;
  embeddedMode?: boolean;
  viewMode?: 'donate' | 'leaderboard' | 'all';
  onNavigateToLeaderboard?: () => void;
  onNavigateToDonate?: () => void;
}

export const ChemClubDonationModule: React.FC<ChemClubDonationModuleProps> = ({
  config = DEFAULT_CHEM_DONATION_CONFIG,
  lang = 'vi',
  onDonationCreated,
  resolveCustomQrUrl,
  embeddedMode = false,
  viewMode = 'all',
  onNavigateToLeaderboard,
  onNavigateToDonate,
}) => {
  const isEn = lang === 'en';
  const [raisedVnd, setRaisedVnd] = useState<number>(config.initialRaisedVnd);
  const [supportersCount, setSupportersCount] = useState<number>(
    config.initialSupportersCount
  );
  const [donors, setDonors] = useState<DonorRecord[]>(config.initialDonors);
  const donorsRef = useRef<DonorRecord[]>(config.initialDonors);
  donorsRef.current = donors;

  const [wishIntents, setWishIntents] = useState<DonationIntentItem[]>(() =>
    loadLocalDonationIntents()
  );

  const [latestDonorName, setLatestDonorName] = useState<string | null>(null);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] =
    useState<boolean>(true);

  const fetchLeaderboardData = useCallback(async () => {
    try {
      setIsLoadingLeaderboard(true);
      const leaderboardUrl = buildAppsScriptLeaderboardUrl();

      const [remoteSettled, localSettled] = await Promise.allSettled([
        fetch(leaderboardUrl, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        }),
        fetch('/api/donations'),
      ]);

      let localVerified: DonorRecord[] = [];
      let serverIntents: DonationIntentItem[] = [];
      if (localSettled.status === 'fulfilled' && localSettled.value.ok) {
        try {
          const localData = (await localSettled.value.json()) as {
            donations?: DonorRecord[];
            intents?: DonationIntentItem[];
          };
          if (Array.isArray(localData.donations)) {
            localVerified = localData.donations;
          }
          if (Array.isArray(localData.intents)) {
            serverIntents = localData.intents;
          }
        } catch {
          // Ignore malformed JSON
        }
      }

      const localIntents = loadLocalDonationIntents();
      const combinedIntentsMap = new Map<string, DonationIntentItem>();
      for (const item of [...localIntents, ...serverIntents]) {
        if (item && item.name) {
          const key = `${item.name.trim().toLowerCase()}|${(item.message || '').trim()}`;
          if (!combinedIntentsMap.has(key)) {
            combinedIntentsMap.set(key, item);
          }
        }
      }
      setWishIntents(Array.from(combinedIntentsMap.values()));

      let remoteRecords = donorsRef.current;
      if (remoteSettled.status === 'fulfilled' && remoteSettled.value.ok) {
        try {
          const json = await remoteSettled.value.json();
          remoteRecords = parseAppsScriptLeaderboardResponse(json);
        } catch {
          // Keep current records if remote JSON fails
        }
      }

      const merged = enrichAndMergeDonors(
        remoteRecords,
        localVerified,
        serverIntents,
        localIntents,
        donorsRef.current
      );

      setDonors(merged);
      const total = merged.reduce(
        (sum, item) => sum + (Number(item.amountVnd) || 0),
        0
      );
      setRaisedVnd(total);
      setSupportersCount(merged.length);
    } catch {
      // Preserve current data on intermittent network failure
    } finally {
      setIsLoadingLeaderboard(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboardData();
    const interval = window.setInterval(fetchLeaderboardData, 8000);
    return () => {
      window.clearInterval(interval);
    };
  }, [fetchLeaderboardData]);

  const overallProgress = calculateFundingProgress(
    raisedVnd,
    config.totalTargetVnd
  );
  const rankedDonors = rankDonors(donors);
  const currentTop1 = rankedDonors[0] || null;

  const handleIntentSaved = useCallback((intent: DonationIntentItem) => {
    setWishIntents((prev) => [
      intent,
      ...prev.filter((item) => item.id !== intent.id),
    ]);
    // Nếu trên bảng xếp hạng đã có giao dịch khớp tên + số tiền thì gắn lời chúc ngay
    setDonors((prev) =>
      enrichAndMergeDonors(prev, [], [intent], [intent], prev)
    );
  }, []);

  const handleAttachWishToDonor = useCallback(
    async (
      donorName: string,
      message: string,
      affiliation?: string
    ): Promise<{ ok: boolean; matchedName?: string }> => {
      const targetDonor = donorsRef.current.find((d) =>
        donorNamesMatch(d.name, donorName)
      );

      const displayName = targetDonor ? targetDonor.name : donorName.trim();
      const intent: DonationIntentItem = {
        id: `wish_${Date.now()}`,
        name: displayName,
        affiliation:
          affiliation && affiliation.trim().length > 0
            ? affiliation.trim()
            : targetDonor?.affiliation || 'Nhà hảo tâm BWAN CLUB',
        amountVnd: targetDonor ? targetDonor.amountVnd : 0,
        message: message.trim(),
        receiptCode: targetDonor?.verifiedReceiptCode || 'BWAN-WISH',
        timestampIso: new Date().toISOString(),
      };

      saveLocalDonationIntent(intent);
      setWishIntents((prev) => [intent, ...prev]);
      try {
        await fetch('/api/donation-intents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(intent),
        });
      } catch {
        // Ignore network error, saved in localStorage
      }

      if (targetDonor) {
        setDonors((prev) => {
          let attached = false;
          return prev.map((d) => {
            if (!attached && donorNamesMatch(d.name, targetDonor.name)) {
              attached = true;
              return {
                ...d,
                message: intent.message,
                affiliation: intent.affiliation,
              };
            }
            return d;
          });
        });
      }

      return { ok: true, matchedName: displayName };
    },
    []
  );

  const handleDonationVerified = (
    payload: DonationSubmissionPayload,
    orderMeta?: { paymentLinkId?: string; orderCode?: string | number }
  ): DonorRecord => {
    const result = applyNewDonation(
      raisedVnd,
      supportersCount,
      donors,
      payload,
      config.bankConfig.transferPrefix,
      config.campaignCode
    );

    if (orderMeta?.orderCode) {
      result.createdRecord.verifiedReceiptCode = `ORD-${orderMeta.orderCode}`;
    }

    saveLocalDonationIntent({
      id: result.createdRecord.id,
      paymentLinkId: orderMeta?.paymentLinkId,
      orderCode: orderMeta?.orderCode,
      name: result.createdRecord.name,
      affiliation: result.createdRecord.affiliation,
      amountVnd: result.createdRecord.amountVnd,
      message: result.createdRecord.message,
      receiptCode: result.createdRecord.verifiedReceiptCode,
      timestampIso: result.createdRecord.timestampIso,
    });

    setRaisedVnd(result.updatedRaisedVnd);
    setSupportersCount(result.updatedSupportersCount);
    setDonors(result.updatedDonors);
    setLatestDonorName(result.createdRecord.name);

    window.setTimeout(() => {
      fetchLeaderboardData();
    }, 1500);

    if (onDonationCreated) {
      onDonationCreated(result.createdRecord, {
        ...config,
        initialRaisedVnd: result.updatedRaisedVnd,
        initialSupportersCount: result.updatedSupportersCount,
        initialDonors: result.updatedDonors,
      });
    }

    return result.createdRecord;
  };

  const scrollToQuickDonate = () => {
    if (viewMode === 'leaderboard' && onNavigateToDonate) {
      onNavigateToDonate();
      return;
    }
    const el = document.getElementById('quick-donate-panel');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const recentDonations = donors.slice(0, 6);
  const showDonateForm = viewMode === 'donate' || viewMode === 'all';
  const showLeaderboard = viewMode === 'leaderboard' || viewMode === 'all';

  return (
    <section
      id="quyen-gop-section"
      aria-label={
        isEn
          ? 'Academic Fund & Top Donate Leaderboard BWAN CLUB'
          : 'Quỹ Học Thuật & Bảng Xếp Hạng Top Donate BWAN CLUB'
      }
      className={`google-one-chem-section-wash ${
        embeddedMode ? 'pt-6 pb-16 sm:pt-8 sm:pb-20' : 'py-16 sm:py-20'
      } px-4 sm:px-6 lg:px-8 transition-colors duration-300`}
    >
      <div className="mx-auto max-w-7xl">
        {showDonateForm && (
          <>
            {/* Section Header (only shown when standalone, since PageBannerHeader is above in embeddedMode) */}
            {!embeddedMode && (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="mx-auto max-w-3xl text-center mb-12"
              >
                <div className="inline-flex items-center gap-2 text-xs font-bold text-[#6C63FF] dark:text-[#A39DFF] uppercase tracking-wider">
                  <HeartHandshake className="h-4 w-4" />
                  <span>
                    {isEn
                      ? 'BWAN CLUB ACADEMIC & EXPERIMENTAL SPONSORSHIP FUND'
                      : 'QUỸ HỌC THUẬT & BẢO TRỢ THỰC NGHIỆM BWAN CLUB'}
                  </span>
                </div>
                <h2 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-[#1F1F2E] dark:text-white tracking-tight text-balance">
                  {isEn ? 'Fuel the ' : 'Đồng Hành Cùng '}
                  <span className="google-one-chem-gradient-text">
                    {isEn
                      ? 'BWAN CLUB Creative Reaction'
                      : 'Phản Ứng Sáng Tạo BWAN CLUB'}
                  </span>
                </h2>
                <p className="mt-3 text-sm sm:text-base text-[#4A4A68] dark:text-[#CBD5E1] leading-relaxed">
                  {isEn
                    ? 'Every contribution is 100% automatically verified via the PayOS QR gateway and honored in real time on the BWAN CLUB Top Donate Leaderboard.'
                    : 'Mọi khoản đóng góp đều được xác thực tự động 100% qua cổng QR PayOS và vinh danh trực tiếp theo thời gian thực lên Bảng Xếp Hạng Top Donate của BWAN CLUB.'}
                </p>
              </motion.div>
            )}

            {/* Khu vực Quyên góp & Cập nhật thời gian thực */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
              {/* Cột trái (7 cột): Form Quyên Góp Tạo Mã QR */}
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-7"
              >
                <QuickDonatePanel
                  campaignCode={config.campaignCode}
                  campaignTitle={config.campaignTitle}
                  presetAmounts={config.presetAmountsVnd}
                  bankConfig={config.bankConfig}
                  donors={donors}
                  lang={lang}
                  onDonationVerified={handleDonationVerified}
                  onIntentSaved={handleIntentSaved}
                  resolveCustomQrUrl={resolveCustomQrUrl}
                />
              </motion.div>

              {/* Cột phải (5 cột): Tiến Độ Quỹ & Luồng Ủng Hộ Thời Gian Thực */}
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.42,
                  delay: 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="space-y-6 lg:col-span-5"
              >
                {/* Thẻ Tiến Độ Quỹ Thời Gian Thực */}
                <div className="rounded-3xl border border-slate-200/90 dark:border-[#6C63FF]/30 bg-white dark:bg-[#16142E] p-6 sm:p-7 shadow-sm text-[#181826] dark:text-white transition-colors">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#5D50FE] dark:text-[#A39DFF]">
                    <span className="inline-flex items-center gap-1.5">
                      <TrendingUp className="h-4 w-4" />
                      <span>
                        {isEn
                          ? 'Real-Time Live Fund Progress'
                          : 'Tiến Độ Quỹ Thực Tế Thời Gian Thực'}
                      </span>
                    </span>
                    <span className="font-mono-tabular font-bold text-[#181826] dark:text-white">
                      {isEn
                        ? `${overallProgress.exactPercent}% Reached`
                        : `Đạt ${overallProgress.exactPercent}%`}
                    </span>
                  </div>

                  <div className="mt-3 flex items-baseline justify-between gap-2">
                    <div>
                      <span
                        data-testid="live-total-raised"
                        className="font-mono-tabular text-3xl font-extrabold text-[#5D50FE] dark:text-[#A39DFF]"
                      >
                        {formatVnd(raisedVnd)}
                      </span>
                      <span className="mt-0.5 block text-xs text-[#525866] dark:text-[#94A3B8]">
                        {isEn
                          ? `Campaign Goal: ${formatVnd(config.totalTargetVnd)}`
                          : `Mục tiêu chiến dịch: ${formatVnd(config.totalTargetVnd)}`}
                      </span>
                    </div>

                    <div className="text-right">
                      <span
                        data-testid="live-supporters-count"
                        className="inline-flex items-center gap-1 font-mono-tabular text-lg font-extrabold text-[#181826] dark:text-white"
                      >
                        <Users className="h-4 w-4 text-[#5D50FE] dark:text-[#A39DFF]" />
                        <span>{supportersCount}</span>
                      </span>
                      <span className="block text-[11px] text-[#525866] dark:text-[#94A3B8]">
                        {isEn ? 'verified donations' : 'lượt đã thanh toán'}
                      </span>
                    </div>
                  </div>

                  {/* Thanh tiến độ */}
                  <div
                    className="mt-4 h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-[#0D0C1D]"
                    role="progressbar"
                    aria-valuenow={overallProgress.exactPercent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={
                      isEn
                        ? 'BWAN CLUB academic fund progress'
                        : 'Tiến độ quỹ học thuật BWAN CLUB'
                    }
                  >
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#5D50FE] to-[#0EA5E9] transition-all duration-300"
                      style={{ width: `${overallProgress.clampedBarPercent}%` }}
                    />
                  </div>

                  {/* Mini Spotlight: Người đang dẫn đầu Top 1 hiện tại */}
                  <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-amber-300/80 dark:border-amber-500/40 bg-amber-50/70 dark:bg-amber-950/35 px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-slate-950">
                        <Crown className="h-4 w-4 fill-slate-950" />
                      </span>
                      <div>
                        <span className="block text-[11px] font-bold text-amber-800 dark:text-amber-300">
                          {isEn
                            ? 'Top 1 Leaderboard Position'
                            : 'Vị trí Top 1 Bảng xếp hạng'}
                        </span>
                        <span className="text-xs font-extrabold text-[#181826] dark:text-white">
                          {currentTop1
                            ? currentTop1.donorName
                            : isEn
                            ? 'Awaiting first supporter'
                            : 'Đang chờ người ủng hộ đầu tiên'}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono-tabular text-xs font-extrabold text-amber-700 dark:text-amber-400 whitespace-nowrap">
                      {currentTop1
                        ? formatVnd(currentTop1.totalAmountVnd)
                        : '0 ₫'}
                    </span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-[#6C63FF]/20">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        if (window.location.pathname !== '/leaderboard') {
                          window.history.pushState({}, '', '/leaderboard');
                        }
                        if (onNavigateToLeaderboard) {
                          onNavigateToLeaderboard();
                        }
                        const lbEl = document.getElementById(
                          'leaderboard-section'
                        );
                        if (lbEl) {
                          lbEl.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start',
                          });
                        }
                      }}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#F1F0FF] dark:bg-[#6C63FF]/25 hover:bg-[#E5E3FF] dark:hover:bg-[#6C63FF]/35 px-4 py-3 text-xs font-bold text-[#5D50FE] dark:text-[#A39DFF] transition-colors cursor-pointer"
                    >
                      <Crown className="h-4 w-4 text-amber-500" />
                      <span>
                        {isEn
                          ? 'View BWAN CLUB Top Donate Leaderboard'
                          : 'Xem Bảng Xếp Hạng Top Donate BWAN CLUB'}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </motion.button>
                  </div>
                </div>

                {/* Khung nhỏ hiển thị các lượt ủng hộ mới nhất theo thời gian thực */}
                <div className="rounded-3xl border border-slate-200/90 dark:border-[#6C63FF]/30 bg-white dark:bg-[#16142E] p-6 sm:p-7 shadow-sm text-[#181826] dark:text-white transition-colors">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#6C63FF]/20 pb-3.5">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[#5D50FE] dark:text-[#A39DFF]" />
                      <h3 className="text-sm font-extrabold text-[#181826] dark:text-white">
                        {isEn
                          ? 'Real-Time Latest Donations'
                          : 'Lượt Ủng Hộ Mới Nhất Theo Thời Gian Thực'}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={fetchLeaderboardData}
                      disabled={isLoadingLeaderboard}
                      aria-label={
                        isEn
                          ? 'Refresh latest donations'
                          : 'Làm mới lượt ủng hộ mới nhất'
                      }
                      className="inline-flex items-center gap-1 rounded-full border border-slate-200 dark:border-[#6C63FF]/35 bg-[#F8F8FB] dark:bg-[#0D0C1D] px-2.5 py-1 text-[11px] font-semibold text-[#5D50FE] dark:text-[#A39DFF] transition-colors hover:border-[#5D50FE] disabled:opacity-50 cursor-pointer"
                    >
                      <RefreshCw
                        className={`h-3 w-3 ${
                          isLoadingLeaderboard ? 'animate-spin' : ''
                        }`}
                      />
                      <span>{isEn ? 'Refresh' : 'Làm mới'}</span>
                    </button>
                  </div>

                  <div data-testid="realtime-donation-feed" className="mt-4">
                    {recentDonations.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-slate-200 dark:border-[#6C63FF]/30 bg-[#F8F8FB] dark:bg-[#0D0C1D] p-6 text-center">
                        <p className="text-xs font-bold text-[#181826] dark:text-white">
                          {isLoadingLeaderboard
                            ? isEn
                              ? 'Loading donation data...'
                              : 'Đang tải dữ liệu lượt ủng hộ...'
                            : isEn
                            ? 'No verified transactions yet'
                            : 'Chưa có giao dịch thanh toán nào'}
                        </p>
                        <p className="mt-1 text-[11px] leading-relaxed text-[#525866] dark:text-[#94A3B8]">
                          {isEn
                            ? 'Once a supporter scans the QR code and completes the transfer, their donation automatically updates here and on the Leaderboard.'
                            : 'Khi người dùng quét mã QR và hoàn tất chuyển khoản, khoản ủng hộ sẽ tự động cập nhật tại đây và cộng dồn lên Bảng xếp hạng.'}
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100 dark:divide-[#6C63FF]/20">
                        {recentDonations.map((item, index) => {
                          const isNewest =
                            latestDonorName &&
                            index === 0 &&
                            item.name === latestDonorName;
                          return (
                            <div
                              key={item.id}
                              className={`flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0 ${
                                isNewest
                                  ? 'rounded-xl bg-[#5D50FE]/10 dark:bg-[#6C63FF]/20 px-3 -mx-2'
                                  : ''
                              }`}
                            >
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <p className="truncate text-xs font-bold text-[#181826] dark:text-white">
                                    {item.name}
                                  </p>
                                  {isNewest && (
                                    <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold text-[#5D50FE] dark:text-[#A39DFF]">
                                      <Sparkles className="h-2.5 w-2.5" />
                                      <span>{isEn ? 'Newest' : 'Mới nhất'}</span>
                                    </span>
                                  )}
                                </div>
                                <p className="truncate font-mono-tabular text-[11px] text-[#525866] dark:text-[#94A3B8]">
                                  {formatDonationTimestamp(
                                    item.timestampIso,
                                    lang
                                  )}
                                </p>
                                {item.message && (
                                  <p className="mt-0.5 truncate text-[11px] italic text-[#5D50FE] dark:text-[#A39DFF]">
                                    “{item.message}”
                                  </p>
                                )}
                              </div>

                              <span className="font-mono-tabular text-xs font-extrabold text-[#5D50FE] dark:text-[#A39DFF] whitespace-nowrap">
                                +{formatVnd(item.amountVnd)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}

        {/* Summary KPI Strip when viewing Leaderboard route directly */}
        {viewMode === 'leaderboard' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38 }}
            className="mb-4 rounded-3xl border border-slate-200/90 dark:border-[#6C63FF]/30 bg-white dark:bg-[#16142E] p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex flex-wrap items-center gap-6">
              <div>
                <span className="block text-xs font-semibold text-[#525866] dark:text-[#94A3B8]">
                  {isEn ? 'Total Fund Raised' : 'Tổng quỹ đã huy động'}
                </span>
                <span
                  data-testid="live-total-raised"
                  className="font-mono-tabular text-2xl sm:text-3xl font-extrabold text-[#5D50FE] dark:text-[#A39DFF]"
                >
                  {formatVnd(raisedVnd)}
                </span>
              </div>
              <div className="h-8 w-[1px] bg-slate-200 dark:bg-[#6C63FF]/25 hidden sm:block" />
              <div>
                <span className="block text-xs font-semibold text-[#525866] dark:text-[#94A3B8]">
                  {isEn ? 'Verified Donations' : 'Số lượt ủng hộ xác thực'}
                </span>
                <span
                  data-testid="live-supporters-count"
                  className="font-mono-tabular text-xl font-extrabold text-[#1F1F2E] dark:text-white"
                >
                  {isEn ? `${supportersCount} donations` : `${supportersCount} lượt`}
                </span>
              </div>
            </div>

            {onNavigateToDonate && (
              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={onNavigateToDonate}
                className="inline-flex items-center gap-2 rounded-full google-one-chem-btn px-6 py-3 text-xs sm:text-sm font-bold text-white cursor-pointer whitespace-nowrap"
              >
                <HeartHandshake className="h-4 w-4" />
                <span>
                  {isEn ? 'Support BWAN CLUB Fund Now' : 'Ủng hộ Quỹ BWAN CLUB ngay'}
                </span>
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            )}
          </motion.div>
        )}

        {/* BẢNG XẾP HẠNG TOP DONATE (KHUNG VÀNG + VƯƠNG MIỆN, BẠC, ĐỒNG & LỜI NHẮN) */}
        {showLeaderboard && (
          <TopDonorsSection
            donors={donors}
            wishIntents={wishIntents}
            latestDonorName={latestDonorName}
            isLoadingLeaderboard={isLoadingLeaderboard}
            lang={lang}
            onRefreshLeaderboard={fetchLeaderboardData}
            onScrollToDonate={scrollToQuickDonate}
            onAttachWishToDonor={handleAttachWishToDonor}
          />
        )}
      </div>
    </section>
  );
};
