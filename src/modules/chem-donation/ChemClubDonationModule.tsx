import React, { useState, useEffect, useCallback } from 'react';
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
  onDonationCreated,
  resolveCustomQrUrl,
  embeddedMode = false,
  viewMode = 'all',
  onNavigateToLeaderboard,
  onNavigateToDonate,
}) => {
  const [raisedVnd, setRaisedVnd] = useState<number>(config.initialRaisedVnd);
  const [supportersCount, setSupportersCount] = useState<number>(
    config.initialSupportersCount
  );
  const [donors, setDonors] = useState<DonorRecord[]>(config.initialDonors);
  const [latestDonorName, setLatestDonorName] = useState<string | null>(null);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] =
    useState<boolean>(true);

  const fetchLeaderboardData = useCallback(async () => {
    try {
      setIsLoadingLeaderboard(true);
      const leaderboardUrl = buildAppsScriptLeaderboardUrl();
      const response = await fetch(leaderboardUrl, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) return;

      const json = await response.json();
      const remoteRecords = parseAppsScriptLeaderboardResponse(json);

      let localVerified: DonorRecord[] = [];
      try {
        const localRes = await fetch('/api/donations');
        if (localRes.ok) {
          const localData = (await localRes.json()) as {
            donations?: DonorRecord[];
          };
          if (Array.isArray(localData.donations)) {
            localVerified = localData.donations;
          }
        }
      } catch {
        // Ignore if running in static environment
      }

      const merged = [...remoteRecords];
      for (const localItem of localVerified) {
        const alreadyInRemote = remoteRecords.some(
          (r) =>
            r.amountVnd === localItem.amountVnd &&
            r.name.toLowerCase().includes(localItem.name.toLowerCase())
        );
        if (!alreadyInRemote) {
          merged.unshift(localItem);
        }
      }

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
      aria-label="Quỹ Học Thuật & Bảng Xếp Hạng Top Donate BWAN CLUB"
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
                  <span>QUỸ HỌC THUẬT & BẢO TRỢ THỰC NGHIỆM BWAN CLUB</span>
                </div>
                <h2 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-[#1F1F2E] dark:text-white tracking-tight text-balance">
                  Đồng Hành Cùng{' '}
                  <span className="google-one-chem-gradient-text">
                    Phản Ứng Sáng Tạo BWAN CLUB
                  </span>
                </h2>
                <p className="mt-3 text-sm sm:text-base text-[#4A4A68] dark:text-[#CBD5E1] leading-relaxed">
                  Mọi khoản đóng góp đều được xác thực tự động 100% qua cổng QR
                  PayOS và vinh danh trực tiếp theo thời gian thực lên Bảng Xếp
                  Hạng Top Donate của BWAN CLUB.
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
                  onDonationVerified={handleDonationVerified}
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
                      <span>Tiến Độ Quỹ Thực Tế Thời Gian Thực</span>
                    </span>
                    <span className="font-mono-tabular font-bold text-[#181826] dark:text-white">
                      Đạt {overallProgress.exactPercent}%
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
                        Mục tiêu chiến dịch: {formatVnd(config.totalTargetVnd)}
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
                        lượt đã thanh toán
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
                    aria-label="Tiến độ quỹ học thuật BWAN CLUB"
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
                          Vị trí Top 1 Bảng xếp hạng
                        </span>
                        <span className="text-xs font-extrabold text-[#181826] dark:text-white">
                          {currentTop1
                            ? currentTop1.donorName
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
                      <span>Xem Bảng Xếp Hạng Top Donate BWAN CLUB</span>
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
                        Lượt Ủng Hộ Mới Nhất Theo Thời Gian Thực
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={fetchLeaderboardData}
                      disabled={isLoadingLeaderboard}
                      aria-label="Làm mới lượt ủng hộ mới nhất"
                      className="inline-flex items-center gap-1 rounded-full border border-slate-200 dark:border-[#6C63FF]/35 bg-[#F8F8FB] dark:bg-[#0D0C1D] px-2.5 py-1 text-[11px] font-semibold text-[#5D50FE] dark:text-[#A39DFF] transition-colors hover:border-[#5D50FE] disabled:opacity-50 cursor-pointer"
                    >
                      <RefreshCw
                        className={`h-3 w-3 ${
                          isLoadingLeaderboard ? 'animate-spin' : ''
                        }`}
                      />
                      <span>Làm mới</span>
                    </button>
                  </div>

                  <div data-testid="realtime-donation-feed" className="mt-4">
                    {recentDonations.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-slate-200 dark:border-[#6C63FF]/30 bg-[#F8F8FB] dark:bg-[#0D0C1D] p-6 text-center">
                        <p className="text-xs font-bold text-[#181826] dark:text-white">
                          {isLoadingLeaderboard
                            ? 'Đang tải dữ liệu lượt ủng hộ...'
                            : 'Chưa có giao dịch thanh toán nào'}
                        </p>
                        <p className="mt-1 text-[11px] leading-relaxed text-[#525866] dark:text-[#94A3B8]">
                          Khi người dùng quét mã QR và hoàn tất chuyển khoản,
                          khoản ủng hộ sẽ tự động cập nhật tại đây và cộng dồn
                          lên Bảng xếp hạng.
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
                                      <span>Mới nhất</span>
                                    </span>
                                  )}
                                </div>
                                <p className="truncate font-mono-tabular text-[11px] text-[#525866] dark:text-[#94A3B8]">
                                  {formatDonationTimestamp(item.timestampIso)}
                                </p>
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
                  Tổng quỹ đã huy động
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
                  Số lượt ủng hộ xác thực
                </span>
                <span
                  data-testid="live-supporters-count"
                  className="font-mono-tabular text-xl font-extrabold text-[#1F1F2E] dark:text-white"
                >
                  {supportersCount} lượt
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
                <span>Ủng hộ Quỹ BWAN CLUB ngay</span>
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            )}
          </motion.div>
        )}

        {/* BẢNG XẾP HẠNG TOP DONATE (KHUNG VÀNG + VƯƠNG MIỆN, BẠC, ĐỒNG & LỜI NHẮN) */}
        {showLeaderboard && (
          <TopDonorsSection
            donors={donors}
            latestDonorName={latestDonorName}
            isLoadingLeaderboard={isLoadingLeaderboard}
            onRefreshLeaderboard={fetchLeaderboardData}
            onScrollToDonate={scrollToQuickDonate}
          />
        )}
      </div>
    </section>
  );
};
