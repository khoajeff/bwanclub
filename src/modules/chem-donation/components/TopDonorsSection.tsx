import React, { useState, useEffect } from 'react';
import { DonorRecord } from '../types';
import {
  rankDonors,
  formatVnd,
  formatDonationTimestamp,
  DonationIntentItem,
  donorNamesMatch,
} from '../donationLogic';
import {
  Crown,
  Medal,
  Award,
  ChevronDown,
  ChevronUp,
  Search,
  MessageSquareHeart,
  Sparkles,
  Clock,
  RefreshCw,
  Send,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TopDonorsSectionProps {
  donors: DonorRecord[];
  wishIntents?: DonationIntentItem[];
  latestDonorName?: string | null;
  isLoadingLeaderboard?: boolean;
  lang?: 'vi' | 'en';
  onRefreshLeaderboard?: () => void;
  onScrollToDonate: () => void;
  onAttachWishToDonor?: (
    donorName: string,
    message: string,
    affiliation?: string
  ) => Promise<{ ok: boolean; matchedName?: string }>;
}

export const TopDonorsSection: React.FC<TopDonorsSectionProps> = ({
  donors,
  wishIntents = [],
  latestDonorName,
  isLoadingLeaderboard = false,
  lang = 'vi',
  onRefreshLeaderboard,
  onScrollToDonate,
  onAttachWishToDonor,
}) => {
  const isEn = lang === 'en';
  const [activeTab, setActiveTab] = useState<'ranking' | 'recent'>('ranking');
  const [showAllRanks, setShowAllRanks] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Form gửi / bổ sung lời chúc cho người đã ủng hộ trên bảng xếp hạng
  const [showWishForm, setShowWishForm] = useState<boolean>(false);
  const [wishDonorName, setWishDonorName] = useState<string>('');
  const [wishAffiliation, setWishAffiliation] = useState<string>('');
  const [wishText, setWishText] = useState<string>('');
  const [wishFeedback, setWishFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [isSubmittingWish, setIsSubmittingWish] = useState<boolean>(false);

  const allRanked = rankDonors(donors);

  useEffect(() => {
    if (!latestDonorName) return;
    const found = allRanked.find(
      (item) =>
        item.donorName.toLowerCase() === latestDonorName.trim().toLowerCase()
    );
    if (found && found.rank > 3) {
      setShowAllRanks(true);
    }
  }, [latestDonorName, allRanked.length]);

  const top1 = allRanked[0] || null;
  const top2 = allRanked[1] || null;
  const top3 = allRanked[2] || null;

  const lowerRanks = allRanked.slice(3).filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.donorName.toLowerCase().includes(q) ||
      item.affiliation.toLowerCase().includes(q) ||
      item.latestReceiptCode.toLowerCase().includes(q)
    );
  });

  const donorMessages: DonorRecord[] = React.useMemo(() => {
    const base = donors.filter(
      (d) => d.message && d.message.trim().length > 0
    );
    const extra: DonorRecord[] = [];
    for (const intent of wishIntents) {
      const msg = (intent.message || '').trim();
      if (!msg) continue;
      const alreadyShown =
        base.some(
          (d) =>
            donorNamesMatch(d.name, intent.name) &&
            d.message.trim().toLowerCase() === msg.toLowerCase()
        ) ||
        extra.some(
          (d) =>
            donorNamesMatch(d.name, intent.name) &&
            d.message.trim().toLowerCase() === msg.toLowerCase()
        );
      if (!alreadyShown) {
        const matchedDonor = donors.find((d) =>
          donorNamesMatch(d.name, intent.name)
        );
        extra.push({
          id: intent.id || `wish-${intent.timestampIso}`,
          name: matchedDonor ? matchedDonor.name : intent.name,
          affiliation:
            intent.affiliation ||
            matchedDonor?.affiliation ||
            'Nhà hảo tâm BWAN CLUB',
          amountVnd: matchedDonor
            ? matchedDonor.amountVnd
            : Number(intent.amountVnd) || 0,
          message: msg,
          timestampIso: intent.timestampIso || new Date().toISOString(),
          verifiedReceiptCode:
            matchedDonor?.verifiedReceiptCode ||
            intent.receiptCode ||
            'BWAN-WISH',
        });
      }
    }
    return [...extra, ...base];
  }, [donors, wishIntents]);

  const isHighlightedDonor = (name?: string) =>
    Boolean(
      name &&
        latestDonorName &&
        name.trim().toLowerCase() === latestDonorName.trim().toLowerCase()
    );

  const translateAffiliation = (aff: string) => {
    if (!isEn) return aff;
    if (aff === 'Nhà hảo tâm BWAN CLUB') {
      return 'BWAN CLUB Supporter';
    }
    if (aff === 'Người ủng hộ qua cổng QR CLB BWAN') {
      return 'Supporter via BWAN CLUB QR Gateway';
    }
    if (aff === 'Thành viên & Người yêu Hóa học BWAN CLUB') {
      return 'BWAN CLUB Member & Chemistry Enthusiast';
    }
    if (aff === 'Cộng đồng yêu Hóa học') {
      return 'Chemistry Enthusiast Community';
    }
    return aff;
  };

  const handleWishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setWishFeedback(null);
    const cleanName = wishDonorName.trim();
    const cleanMsg = wishText.trim();

    if (cleanName.length < 2) {
      setWishFeedback({
        type: 'error',
        text: isEn
          ? 'Please enter the supporter name as shown on the Leaderboard.'
          : 'Vui lòng nhập tên người ủng hộ đã có trên Bảng xếp hạng.',
      });
      return;
    }
    if (cleanMsg.length < 2) {
      setWishFeedback({
        type: 'error',
        text: isEn
          ? 'Please enter your wish or message for BWAN CLUB.'
          : 'Vui lòng nhập nội dung lời chúc gửi tới BWAN CLUB.',
      });
      return;
    }

    if (!onAttachWishToDonor) return;
    setIsSubmittingWish(true);
    try {
      const res = await onAttachWishToDonor(
        cleanName,
        cleanMsg,
        wishAffiliation.trim()
      );
      if (res.ok) {
        setWishFeedback({
          type: 'success',
          text: isEn
            ? `Your wish has been linked to ${res.matchedName || cleanName} and displayed below!`
            : `Đã cập nhật lời chúc của ${res.matchedName || cleanName} lên khung Lời Chúc thành công!`,
        });
        setWishText('');
        setTimeout(() => {
          setShowWishForm(false);
          setWishFeedback(null);
        }, 1800);
      } else {
        setWishFeedback({
          type: 'error',
          text: isEn
            ? 'No completed donation found under this name yet. Please use the Donate form above or enter the exact name on the Leaderboard.'
            : 'Chưa tìm thấy giao dịch ủng hộ trùng tên trên Bảng xếp hạng. Vui lòng nhập đúng tên trên Bảng xếp hạng hoặc tạo mã QR ủng hộ ở phía trên.',
        });
      }
    } finally {
      setIsSubmittingWish(false);
    }
  };

  return (
    <>
      {/* BẢNG XẾP HẠNG TOP DONATE (PODIUM VÀNG - BẠC - ĐỒNG & TAB LƯỢT ỦNG HỘ MỚI NHẤT) */}
      <section
        id="leaderboard-section"
        className="scroll-mt-24 py-12 sm:py-16"
      >
        {/* Tiêu đề khu vực */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#5D50FE] dark:text-[#A39DFF]">
            <Crown className="h-4 w-4 text-amber-500" />
            <span>
              {isEn
                ? 'Real-Time Live Honor Roll'
                : 'Bảng Vinh Danh Thực Tế Thời Gian Thực'}
            </span>
            <span aria-hidden="true">·</span>
            <span>BWAN CLUB</span>
          </div>
          <h2
            style={{ textWrap: 'balance' }}
            className="mt-2.5 font-display text-3xl font-extrabold tracking-tight text-[#1F1F2E] dark:text-white sm:text-4xl"
          >
            {isEn ? 'Top Donate ' : 'Bảng Xếp Hạng '}
            <span className="google-one-chem-gradient-text">
              {isEn ? 'Leaderboard · BWAN CLUB' : 'Top Donate BWAN CLUB'}
            </span>
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#525866] dark:text-[#CBD5E1] sm:text-base">
            {isEn
              ? 'Automatically synchronizes verified donation data from the club gateway and aggregates contributions by supporter name from highest to lowest.'
              : 'Tự động đồng bộ dữ liệu thực tế từ hệ thống CLB và cộng dồn số tiền của những người trùng tên để xếp hạng từ cao xuống thấp.'}
          </p>

          {/* Thanh chuyển đổi Tab: Xếp hạng Top Donate (Cộng dồn) & Lượt ủng hộ mới nhất */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <div
              role="tablist"
              aria-label={
                isEn ? 'Leaderboard view mode' : 'Chế độ xem bảng xếp hạng'
              }
              className="inline-flex items-center rounded-full border border-slate-200/90 dark:border-[#6C63FF]/35 bg-white dark:bg-[#16142E] p-1.5 shadow-xs"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'ranking'}
                onClick={() => setActiveTab('ranking')}
                className={`relative inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'ranking'
                    ? 'text-white'
                    : 'text-[#525866] dark:text-[#CBD5E1] hover:text-[#5D50FE] dark:hover:text-[#A39DFF]'
                }`}
              >
                {activeTab === 'ranking' && (
                  <motion.span
                    layoutId="leaderboard-tab-pill"
                    className="absolute inset-0 rounded-full bg-[#5D50FE] shadow-xs"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Crown className="relative z-10 h-3.5 w-3.5" />
                <span className="relative z-10">
                  {isEn
                    ? `Cumulative Top Donors (${allRanked.length})`
                    : `Top Donate Cộng Dồn (${allRanked.length})`}
                </span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'recent'}
                onClick={() => setActiveTab('recent')}
                className={`relative inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'recent'
                    ? 'text-white'
                    : 'text-[#525866] dark:text-[#CBD5E1] hover:text-[#5D50FE] dark:hover:text-[#A39DFF]'
                }`}
              >
                {activeTab === 'recent' && (
                  <motion.span
                    layoutId="leaderboard-tab-pill"
                    className="absolute inset-0 rounded-full bg-[#5D50FE] shadow-xs"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Clock className="relative z-10 h-3.5 w-3.5" />
                <span className="relative z-10">
                  {isEn
                    ? `Latest Donations (${donors.length})`
                    : `Lượt Ủng Hộ Mới Nhất (${donors.length})`}
                </span>
              </button>
            </div>

            {onRefreshLeaderboard && (
              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={onRefreshLeaderboard}
                disabled={isLoadingLeaderboard}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-[#6C63FF]/35 bg-white dark:bg-[#16142E] px-4 py-2.5 text-xs font-semibold text-[#525866] dark:text-[#CBD5E1] shadow-xs transition-colors hover:border-[#5D50FE] hover:text-[#5D50FE] dark:hover:text-[#A39DFF] disabled:opacity-60 cursor-pointer whitespace-nowrap"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 text-[#5D50FE] dark:text-[#A39DFF] ${
                    isLoadingLeaderboard ? 'animate-spin' : ''
                  }`}
                />
                <span>
                  {isLoadingLeaderboard
                    ? isEn
                      ? 'Loading...'
                      : 'Đang tải...'
                    : isEn
                    ? 'Refresh Data'
                    : 'Cập nhật dữ liệu'}
                </span>
              </motion.button>
            )}
          </div>
        </motion.div>

        {activeTab === 'recent' ? (
          /* TAB HIỂN THỊ CÁC LƯỢT ỦNG HỘ MỚI NHẤT THEO THỜI GIAN THỰC */
          <motion.div
            key="recent-panel"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            data-testid="leaderboard-recent-tab-panel"
            className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-3xl border border-slate-200/90 dark:border-[#6C63FF]/35 bg-white dark:bg-[#16142E] shadow-sm"
          >
            <div className="flex flex-col justify-between gap-2 border-b border-slate-100 dark:border-[#6C63FF]/20 px-6 py-5 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-base font-extrabold text-[#181826] dark:text-white">
                  {isEn
                    ? 'Real-Time Latest Donation Log'
                    : 'Nhật Ký Các Lượt Ủng Hộ Mới Nhất Theo Thời Gian Thực'}
                </h3>
                <p className="mt-0.5 text-xs text-[#525866] dark:text-[#94A3B8]">
                  {isEn
                    ? 'Displays every verified transaction from the BWAN CLUB QR payment gateway'
                    : 'Hiển thị chi tiết từng giao dịch ủng hộ mới nhất từ cổng thanh toán QR của BWAN CLUB'}
                </p>
              </div>
              <span className="font-mono-tabular text-xs font-bold text-[#5D50FE] dark:text-[#A39DFF]">
                {isEn
                  ? `Total: ${donors.length} donations`
                  : `Tổng cộng: ${donors.length} lượt ủng hộ`}
              </span>
            </div>

            {donors.length === 0 ? (
              <div className="px-6 py-12 text-center text-sm text-[#525866] dark:text-[#94A3B8]">
                {isLoadingLeaderboard
                  ? isEn
                    ? 'Loading latest donations...'
                    : 'Đang tải danh sách lượt ủng hộ mới nhất...'
                  : isEn
                  ? 'No donations recorded yet.'
                  : 'Chưa có lượt ủng hộ nào được ghi nhận.'}
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-[#6C63FF]/20">
                {donors.map((item, idx) => (
                  <div
                    key={item.id || `${item.name}_${item.timestampIso}_${idx}`}
                    className="flex flex-col justify-between gap-2 px-6 py-4 transition-colors hover:bg-slate-50/80 dark:hover:bg-[#1E1B3D]/60 sm:flex-row sm:items-center"
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#5D50FE]/10 dark:bg-[#6C63FF]/25 font-mono-tabular text-xs font-extrabold text-[#5D50FE] dark:text-[#A39DFF]">
                        #{idx + 1}
                      </span>
                      <div>
                        <p className="text-sm font-bold text-[#181826] dark:text-white">
                          {item.name}
                        </p>
                        <p className="mt-0.5 font-mono-tabular text-xs text-[#525866] dark:text-[#94A3B8]">
                          {isEn ? 'Time: ' : 'Thời gian: '}
                          {formatDonationTimestamp(item.timestampIso, lang)}
                        </p>
                        {item.message && (
                          <p className="mt-1 text-xs italic text-[#5D50FE] dark:text-[#A39DFF]">
                            “{item.message}”
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 pl-12 sm:justify-end sm:pl-0">
                      <span className="font-mono-tabular text-base font-extrabold text-[#5D50FE] dark:text-[#A39DFF]">
                        +{formatVnd(item.amountVnd)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <>
            {/* TOP 1 - 2 - 3 PODIUM: VÀNG (VƯƠNG MIỆN) · BẠC · ĐỒNG */}
            <div className="mt-12 grid grid-cols-1 items-end gap-6 lg:grid-cols-3 lg:gap-7">
              {/* TOP 2: KHUNG BẠC (SILVER) */}
              <motion.article
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.42, delay: 0.08 }}
                whileHover={{ y: -5 }}
                data-testid="leaderboard-top-2"
                className={`relative flex flex-col justify-between rounded-3xl border-2 border-slate-300 dark:border-slate-600/80 bg-gradient-to-b from-slate-100/95 via-white to-white dark:from-[#1E2238] dark:via-[#16142E] dark:to-[#16142E] p-6 sm:p-7 shadow-lg shadow-slate-300/35 dark:shadow-black/30 transition-colors lg:order-1 ${
                  isHighlightedDonor(top2?.donorName)
                    ? 'ring-4 ring-[#6c63ff]/40'
                    : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-2">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 dark:border-slate-500 bg-gradient-to-br from-slate-100 to-slate-300 dark:from-slate-700 dark:to-slate-500 text-slate-700 dark:text-white shadow-xs">
                        <Medal className="h-4 w-4" />
                      </span>
                      <div>
                        <span className="block text-xs font-extrabold tracking-wider text-slate-600 dark:text-slate-200">
                          {isEn ? 'TOP 2 · SILVER TIER' : 'TOP 2 · HẠNG BẠC'}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {isEn ? 'Club Runner-Up Patron' : 'Á quân ủng hộ CLB'}
                        </span>
                      </div>
                    </div>

                    <span className="font-mono-tabular text-2xl font-black text-slate-400 dark:text-slate-400">
                      #02
                    </span>
                  </div>

                  <div className="mt-5 border-t border-slate-200/80 dark:border-slate-700/80 pt-5">
                    {top2 ? (
                      <>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-extrabold text-[#181826] dark:text-white">
                            {top2.donorName}
                          </h3>
                          {isHighlightedDonor(top2.donorName) && (
                            <span className="text-xs font-bold text-[#5D50FE] dark:text-[#A39DFF]">
                              {isEn ? '· Just updated' : '· Mới cập nhật'}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs font-medium text-[#525866] dark:text-[#94A3B8]">
                          {translateAffiliation(top2.affiliation)}
                        </p>
                      </>
                    ) : (
                      <>
                        <h3 className="text-lg font-bold text-slate-500 dark:text-slate-300">
                          {isEn
                            ? 'Awaiting Top 2 Supporter'
                            : 'Đang chờ nhà hảo tâm Top 2'}
                        </h3>
                        <p className="mt-1 text-xs text-slate-400 dark:text-slate-400">
                          {isEn
                            ? 'Silver Runner-Up position is open'
                            : 'Vị trí Á quân Hạng Bạc đang rộng mở'}
                        </p>
                      </>
                    )}
                  </div>

                  <div className="mt-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/90 dark:bg-[#0D0C1D]/80 px-4 py-3.5">
                    <span className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      {isEn ? 'Total Donated Amount' : 'Tổng số tiền đã ủng hộ'}
                    </span>
                    <span className="mt-0.5 block font-mono-tabular text-2xl font-extrabold text-slate-800 dark:text-white">
                      {top2 ? formatVnd(top2.totalAmountVnd) : '0 ₫'}
                    </span>
                  </div>

                  {top2?.latestMessage && (
                    <p className="mt-4 line-clamp-2 text-xs italic leading-relaxed text-[#525866] dark:text-[#CBD5E1]">
                      “{top2.latestMessage}”
                    </p>
                  )}
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3.5 text-[11px] text-slate-500 dark:text-slate-400">
                  <span>
                    {top2
                      ? isEn
                        ? `Donations: ${top2.donationsCount}`
                        : `Số lượt ủng hộ: ${top2.donationsCount} lần`
                      : isEn
                      ? 'No transactions yet'
                      : 'Chưa có giao dịch'}
                  </span>
                  <span className="font-mono-tabular font-medium text-slate-600 dark:text-slate-300">
                    {top2 ? top2.latestReceiptCode : '—'}
                  </span>
                </div>
              </motion.article>

              {/* TOP 1: KHUNG VÀNG & VƯƠNG MIỆN (GOLD CROWN CHAMPION) */}
              <motion.article
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.44 }}
                whileHover={{ y: -6 }}
                data-testid="leaderboard-top-1"
                className={`relative flex flex-col justify-between rounded-3xl border-2 border-amber-400 dark:border-amber-400/80 bg-gradient-to-b from-amber-50/95 via-white to-white dark:from-[#2B2212] dark:via-[#18152E] dark:to-[#16142E] p-7 sm:p-8 shadow-xl shadow-amber-500/15 dark:shadow-amber-500/10 transition-colors lg:order-2 lg:-translate-y-4 ${
                  isHighlightedDonor(top1?.donorName)
                    ? 'ring-4 ring-amber-400/50'
                    : ''
                }`}
              >
                {/* Biểu tượng Vương Miện Vàng nổi bật trên đỉnh khung */}
                <div className="-mt-11 mb-3 flex justify-center">
                  <div className="inline-flex items-center gap-2 rounded-full border-2 border-amber-400 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 px-4 py-1.5 text-xs font-extrabold text-slate-950 shadow-md shadow-amber-500/25">
                    <Crown className="h-4 w-4 fill-slate-950 text-slate-950" />
                    <span>
                      {isEn ? 'TOP 1 · GOLDEN CROWN' : 'TOP 1 · VƯƠNG MIỆN VÀNG'}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-3">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-amber-400 bg-gradient-to-br from-amber-100 via-yellow-200 to-amber-300 text-amber-800 shadow-sm">
                        <Crown className="h-6 w-6 fill-amber-600 text-amber-700" />
                      </span>
                      <div>
                        <span className="block text-xs font-extrabold tracking-wider text-amber-700 dark:text-amber-300">
                          {isEn ? 'CHAMPION PATRON' : 'QUÁN QUÂN DONATE'}
                        </span>
                        <span className="text-xs text-amber-800/80 dark:text-amber-200/80">
                          {isEn
                            ? 'Highest Club Contributor'
                            : 'Người ủng hộ cao nhất CLB'}
                        </span>
                      </div>
                    </div>

                    <span className="font-mono-tabular text-3xl font-black text-amber-500 dark:text-amber-400">
                      #01
                    </span>
                  </div>

                  <div className="mt-5 border-t border-amber-200/80 dark:border-amber-500/30 pt-5">
                    {top1 ? (
                      <>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-2xl font-extrabold text-[#181826] dark:text-white">
                            {top1.donorName}
                          </h3>
                          {isHighlightedDonor(top1.donorName) && (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-300">
                              <Sparkles className="h-3.5 w-3.5" />
                              <span>
                                {isEn ? 'New Top 1!' : 'Vừa lên Top 1!'}
                              </span>
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs font-medium text-[#525866] dark:text-[#CBD5E1]">
                          {translateAffiliation(top1.affiliation)}
                        </p>
                      </>
                    ) : (
                      <>
                        <h3 className="text-xl font-extrabold text-[#181826] dark:text-white">
                          {isEn
                            ? 'Awaiting First Champion'
                            : 'Đang chờ Quán Quân đầu tiên'}
                        </h3>
                        <p className="mt-1 text-xs text-[#525866] dark:text-[#CBD5E1]">
                          {isEn
                            ? 'Be the first to scan the QR code and claim the Golden Crown!'
                            : 'Hãy là người đầu tiên quét mã QR ủng hộ để giữ Vương Miện Vàng!'}
                        </p>
                      </>
                    )}
                  </div>

                  <div className="mt-5 rounded-2xl border-2 border-amber-300/90 dark:border-amber-500/45 bg-gradient-to-r from-amber-50 via-yellow-50/70 to-amber-50 dark:from-amber-950/45 dark:via-yellow-950/30 dark:to-amber-950/45 px-5 py-4">
                    <span className="block text-xs font-bold text-amber-800 dark:text-amber-300">
                      {isEn
                        ? 'Highest Cumulative Contribution'
                        : 'Tổng số tiền ủng hộ cao nhất'}
                    </span>
                    <span className="mt-1 block font-mono-tabular text-3xl font-black text-amber-600 dark:text-amber-400">
                      {top1 ? formatVnd(top1.totalAmountVnd) : '0 ₫'}
                    </span>
                  </div>

                  {top1?.latestMessage && (
                    <p className="mt-4 line-clamp-3 text-xs italic leading-relaxed text-[#525866] dark:text-[#CBD5E1]">
                      “{top1.latestMessage}”
                    </p>
                  )}
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-amber-200/60 dark:border-amber-500/25 pt-4 text-xs text-amber-900/70 dark:text-amber-200/80">
                  <span className="font-medium">
                    {top1
                      ? isEn
                        ? `Donations: ${top1.donationsCount}`
                        : `Số lượt ủng hộ: ${top1.donationsCount} lần`
                      : isEn
                      ? 'Verified automatically via PayOS'
                      : 'Xác thực tự động qua PayOS'}
                  </span>
                  <span className="font-mono-tabular font-semibold text-amber-700 dark:text-amber-300">
                    {top1 ? top1.latestReceiptCode : 'TOP #01'}
                  </span>
                </div>
              </motion.article>

              {/* TOP 3: KHUNG ĐỒNG (BRONZE) */}
              <motion.article
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.42, delay: 0.14 }}
                whileHover={{ y: -5 }}
                data-testid="leaderboard-top-3"
                className={`relative flex flex-col justify-between rounded-3xl border-2 border-amber-700/40 dark:border-amber-600/55 bg-gradient-to-b from-orange-50/90 via-white to-white dark:from-[#291B17] dark:via-[#16142E] dark:to-[#16142E] p-6 sm:p-7 shadow-lg shadow-orange-500/10 dark:shadow-black/30 transition-colors lg:order-3 ${
                  isHighlightedDonor(top3?.donorName)
                    ? 'ring-4 ring-[#6c63ff]/40'
                    : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-2">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-amber-700/40 dark:border-amber-500/50 bg-gradient-to-br from-orange-100 to-amber-200 dark:from-amber-800 dark:to-amber-600 text-amber-900 dark:text-white shadow-xs">
                        <Award className="h-4 w-4" />
                      </span>
                      <div>
                        <span className="block text-xs font-extrabold tracking-wider text-amber-800 dark:text-amber-300">
                          {isEn ? 'TOP 3 · BRONZE TIER' : 'TOP 3 · HẠNG ĐỒNG'}
                        </span>
                        <span className="text-[11px] text-amber-900/70 dark:text-amber-200/75">
                          {isEn ? 'Third-Place Patron' : 'Quý quân ủng hộ CLB'}
                        </span>
                      </div>
                    </div>

                    <span className="font-mono-tabular text-2xl font-black text-amber-700/60 dark:text-amber-400/80">
                      #03
                    </span>
                  </div>

                  <div className="mt-5 border-t border-orange-200/70 dark:border-amber-700/40 pt-5">
                    {top3 ? (
                      <>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-extrabold text-[#181826] dark:text-white">
                            {top3.donorName}
                          </h3>
                          {isHighlightedDonor(top3.donorName) && (
                            <span className="text-xs font-bold text-[#5D50FE] dark:text-[#A39DFF]">
                              {isEn ? '· Just updated' : '· Mới cập nhật'}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs font-medium text-[#525866] dark:text-[#94A3B8]">
                          {translateAffiliation(top3.affiliation)}
                        </p>
                      </>
                    ) : (
                      <>
                        <h3 className="text-lg font-bold text-slate-500 dark:text-slate-300">
                          {isEn
                            ? 'Awaiting Top 3 Supporter'
                            : 'Đang chờ nhà hảo tâm Top 3'}
                        </h3>
                        <p className="mt-1 text-xs text-slate-400 dark:text-slate-400">
                          {isEn
                            ? 'Bronze tier position is open'
                            : 'Vị trí Quý quân Hạng Đồng đang rộng mở'}
                        </p>
                      </>
                    )}
                  </div>

                  <div className="mt-5 rounded-2xl border border-orange-200/80 dark:border-amber-700/45 bg-orange-50/60 dark:bg-amber-950/35 px-4 py-3.5">
                    <span className="block text-[11px] font-semibold text-amber-900/70 dark:text-amber-300">
                      {isEn ? 'Total Donated Amount' : 'Tổng số tiền đã ủng hộ'}
                    </span>
                    <span className="mt-0.5 block font-mono-tabular text-2xl font-extrabold text-amber-800 dark:text-amber-300">
                      {top3 ? formatVnd(top3.totalAmountVnd) : '0 ₫'}
                    </span>
                  </div>

                  {top3?.latestMessage && (
                    <p className="mt-4 line-clamp-2 text-xs italic leading-relaxed text-[#525866] dark:text-[#CBD5E1]">
                      “{top3.latestMessage}”
                    </p>
                  )}
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-orange-100 dark:border-amber-800/40 pt-3.5 text-[11px] text-amber-900/60 dark:text-amber-200/70">
                  <span>
                    {top3
                      ? isEn
                        ? `Donations: ${top3.donationsCount}`
                        : `Số lượt ủng hộ: ${top3.donationsCount} lần`
                      : isEn
                      ? 'No transactions yet'
                      : 'Chưa có giao dịch'}
                  </span>
                  <span className="font-mono-tabular font-medium text-amber-800 dark:text-amber-300">
                    {top3 ? top3.latestReceiptCode : '—'}
                  </span>
                </div>
              </motion.article>
            </div>

            {/* NÚT BẤM "HIỆN TẤT CẢ CÁC TOP" */}
            <div className="mt-10 flex flex-col items-center">
              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                id="toggle-all-ranks-btn"
                onClick={() => setShowAllRanks((prev) => !prev)}
                className="inline-flex items-center gap-2.5 rounded-full border border-slate-200 dark:border-[#6C63FF]/35 bg-white dark:bg-[#16142E] px-7 py-3.5 text-sm font-bold text-[#5D50FE] dark:text-[#A39DFF] shadow-sm transition-all hover:border-[#6c63ff] hover:bg-[#6c63ff]/5 dark:hover:bg-[#6C63FF]/20 cursor-pointer whitespace-nowrap"
              >
                <span>
                  {showAllRanks
                    ? isEn
                      ? 'Hide lower rankings'
                      : 'Thu gọn danh sách các Top dưới'
                    : allRanked.length > 3
                    ? isEn
                      ? `Show all rankings (View ${allRanked.length - 3} more supporters)`
                      : `Hiện tất cả các Top (Xem thêm ${allRanked.length - 3} nhà hảo tâm)`
                    : isEn
                    ? 'Show all rankings'
                    : 'Hiện tất cả các Top'}
                </span>
                {showAllRanks ? (
                  <ChevronUp className="h-4 w-4 text-[#5D50FE] dark:text-[#A39DFF]" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-[#5D50FE] dark:text-[#A39DFF]" />
                )}
              </motion.button>
            </div>

            {/* DANH SÁCH CÁC TOP DƯỚI (TOP 4 TRỞ ĐI - HIỆN KHI BẤM NÚT) */}
            <AnimatePresence>
              {showAllRanks && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  data-testid="lower-ranks-container"
                  className="mt-8 overflow-hidden rounded-3xl border border-slate-200/90 dark:border-[#6C63FF]/35 bg-white dark:bg-[#16142E] shadow-sm"
                >
                  <div className="flex flex-col justify-between gap-4 border-b border-slate-100 dark:border-[#6C63FF]/20 px-6 py-5 sm:flex-row sm:items-center">
                    <div>
                      <h3 className="text-base font-bold text-[#181826] dark:text-white">
                        {isEn
                          ? 'Full Leaderboard Rankings (From Top #04)'
                          : 'Danh Sách Toàn Bộ Bảng Xếp Hạng (Từ Top #04)'}
                      </h3>
                      <p className="mt-0.5 text-xs text-[#525866] dark:text-[#94A3B8]">
                        {isEn
                          ? 'Aggregated verified donations ordered by total contribution'
                          : 'Tổng hợp các lượt ủng hộ đã thanh toán thành công theo thứ tự số tiền đóng góp'}
                      </p>
                    </div>

                    {allRanked.length > 3 && (
                      <div className="relative w-full sm:w-72">
                        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          type="search"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder={
                            isEn
                              ? 'Search supporter name...'
                              : 'Tìm tên người ủng hộ...'
                          }
                          aria-label={
                            isEn
                              ? 'Search supporter name in leaderboard'
                              : 'Tìm tên người ủng hộ trong bảng xếp hạng'
                          }
                          className="w-full rounded-full border border-slate-200 dark:border-[#6C63FF]/35 bg-[#F8F8FB] dark:bg-[#0D0C1D] py-2 pl-10 pr-4 text-xs text-[#181826] dark:text-white placeholder-slate-400 focus:border-[#6c63ff] focus:bg-white dark:focus:bg-[#121026] focus:outline-none"
                        />
                      </div>
                    )}
                  </div>

                  {lowerRanks.length === 0 ? (
                    <div className="px-6 py-10 text-center text-sm text-[#525866] dark:text-[#94A3B8]">
                      {allRanked.length <= 3
                        ? isEn
                          ? 'No supporters in ranks #04 and below yet.'
                          : 'Hiện chưa có nhà hảo tâm ở các hạng từ #04 trở xuống.'
                        : isEn
                        ? 'No matching supporters found.'
                        : 'Không tìm thấy nhà hảo tâm phù hợp với từ khóa tìm kiếm.'}
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 dark:divide-[#6C63FF]/20">
                      {lowerRanks.map((row) => {
                        const isJustUpdated = isHighlightedDonor(row.donorName);
                        return (
                          <div
                            key={`${row.rank}_${row.donorName}`}
                            className={`flex flex-col justify-between gap-3 px-6 py-4 transition-colors sm:flex-row sm:items-center ${
                              isJustUpdated
                                ? 'bg-[#6c63ff]/10 dark:bg-[#6C63FF]/25'
                                : 'hover:bg-slate-50/80 dark:hover:bg-[#1E1B3D]/60'
                            }`}
                          >
                            <div className="flex items-start gap-4 sm:items-center">
                              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 dark:border-[#6C63FF]/35 bg-[#F8F8FB] dark:bg-[#0D0C1D] font-mono-tabular text-xs font-extrabold text-[#5D50FE] dark:text-[#A39DFF]">
                                #{String(row.rank).padStart(2, '0')}
                              </span>
                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-sm font-bold text-[#181826] dark:text-white">
                                    {row.donorName}
                                  </span>
                                  {isJustUpdated && (
                                    <span className="text-xs font-bold text-[#5D50FE] dark:text-[#A39DFF]">
                                      {isEn
                                        ? '· Just verified'
                                        : '· Vừa thanh toán thành công'}
                                    </span>
                                  )}
                                </div>
                                <p className="mt-0.5 text-xs text-[#525866] dark:text-[#94A3B8]">
                                  {translateAffiliation(row.affiliation)}
                                </p>
                                {row.latestMessage && (
                                  <p className="mt-1 text-xs italic text-slate-500 dark:text-slate-300">
                                    “{row.latestMessage}”
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center justify-between gap-4 pl-13 sm:justify-end sm:pl-0">
                              <span className="font-mono-tabular text-xs text-slate-400">
                                {row.latestReceiptCode}
                              </span>
                              <span className="font-mono-tabular text-base font-extrabold text-[#5D50FE] dark:text-[#A39DFF]">
                                {formatVnd(row.totalAmountVnd)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </section>

      {/* LỜI NHẮN GỬI TỪ NGƯỜI ỦNG HỘ THỰC TẾ */}
      <section
        id="donor-messages-section"
        className="scroll-mt-24 border-t border-slate-200/80 dark:border-[#6C63FF]/25 py-12 sm:py-16"
      >
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#5D50FE] dark:text-[#A39DFF]">
              <MessageSquareHeart className="h-4 w-4" />
              <span>
                {isEn ? 'Verified Supporter Wishes' : 'Lời Nhắn Gửi Thực Tế'}
              </span>
            </div>
            <h2 className="mt-1.5 font-display text-2xl font-extrabold tracking-tight text-[#1F1F2E] dark:text-white sm:text-3xl">
              {isEn
                ? 'Community Wishes for BWAN CLUB'
                : 'Lời Chúc Từ Cộng Đồng Ủng Hộ BWAN CLUB'}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
            {onAttachWishToDonor && (
              <motion.button
                type="button"
                data-testid="toggle-attach-wish-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  setShowWishForm((prev) => !prev);
                  setWishFeedback(null);
                }}
                className="inline-flex items-center gap-2 rounded-full border border-[#5D50FE]/40 dark:border-[#6C63FF]/45 bg-white dark:bg-[#16142E] px-4 py-2.5 text-xs font-bold text-[#5D50FE] dark:text-[#A39DFF] hover:bg-[#5D50FE]/5 dark:hover:bg-[#6C63FF]/20 transition-colors cursor-pointer whitespace-nowrap"
              >
                <MessageSquareHeart className="h-3.5 w-3.5" />
                <span>
                  {isEn
                    ? 'Add Wish for Completed Donation'
                    : 'Bổ sung lời chúc đã donate'}
                </span>
              </motion.button>
            )}

            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={onScrollToDonate}
              className="inline-flex items-center gap-2 rounded-full google-one-chem-btn px-5 py-2.5 text-xs font-bold text-white cursor-pointer whitespace-nowrap"
            >
              <span>
                {isEn
                  ? 'Send a Wish & Donate Now'
                  : 'Gửi lời nhắn & Ủng hộ ngay'}
              </span>
            </motion.button>
          </div>
        </div>

        {/* Khung bổ sung lời chúc cho người đã donate trên bảng xếp hạng */}
        <AnimatePresence>
          {showWishForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleWishSubmit}
              className="mt-6 overflow-hidden rounded-3xl border border-[#5D50FE]/30 dark:border-[#6C63FF]/40 bg-white dark:bg-[#16142E] p-6 shadow-md"
            >
              <div className="flex items-center justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-sm font-extrabold text-[#181826] dark:text-white">
                    {isEn
                      ? 'Attach or Update Your Wish on the Leaderboard'
                      : 'Gửi / Cập nhật Lời Chúc cho giao dịch đã ủng hộ'}
                  </h3>
                  <p className="mt-0.5 text-xs text-[#525866] dark:text-[#94A3B8]">
                    {isEn
                      ? 'If you already completed a QR donation, enter your name as shown on the Leaderboard and your wish below.'
                      : 'Nếu bạn đã hoàn tất quét mã QR ủng hộ, hãy nhập đúng tên trên Bảng xếp hạng để hiển thị lời chúc của bạn ngay lập tức.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label
                    htmlFor="wish-donor-name"
                    className="block text-xs font-bold text-[#181826] dark:text-white"
                  >
                    {isEn
                      ? 'Your Name on Leaderboard *'
                      : 'Tên trên Bảng xếp hạng *'}
                  </label>
                  <input
                    id="wish-donor-name"
                    data-testid="attach-wish-name-input"
                    type="text"
                    value={wishDonorName}
                    onChange={(e) => setWishDonorName(e.target.value)}
                    placeholder={
                      top1?.donorName
                        ? `${isEn ? 'e.g.,' : 'VD:'} ${top1.donorName}`
                        : isEn
                        ? 'Enter your name'
                        : 'Nhập tên của bạn'
                    }
                    className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-[#6C63FF]/35 bg-[#F8F8FB] dark:bg-[#0D0C1D] px-3.5 py-2.5 text-xs text-[#181826] dark:text-white placeholder-slate-400 focus:border-[#5D50FE] focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="wish-affiliation"
                    className="block text-xs font-bold text-[#181826] dark:text-white"
                  >
                    {isEn
                      ? 'Division / Cohort (Optional)'
                      : 'Phân ban / Khóa (Tùy chọn)'}
                  </label>
                  <input
                    id="wish-affiliation"
                    type="text"
                    value={wishAffiliation}
                    onChange={(e) => setWishAffiliation(e.target.value)}
                    placeholder={
                      isEn
                        ? 'e.g., BWAN Gen 6'
                        : 'VD: Thành viên BWAN Gen 6'
                    }
                    className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-[#6C63FF]/35 bg-[#F8F8FB] dark:bg-[#0D0C1D] px-3.5 py-2.5 text-xs text-[#181826] dark:text-white placeholder-slate-400 focus:border-[#5D50FE] focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="wish-message-input"
                    className="block text-xs font-bold text-[#181826] dark:text-white"
                  >
                    {isEn ? 'Wish for BWAN CLUB *' : 'Lời chúc gửi BWAN CLUB *'}
                  </label>
                  <div className="mt-1.5 flex items-center gap-2">
                    <input
                      id="wish-message-input"
                      data-testid="attach-wish-message-input"
                      type="text"
                      value={wishText}
                      onChange={(e) => setWishText(e.target.value)}
                      placeholder={
                        isEn
                          ? 'Write your wish here...'
                          : 'Nhập lời chúc của bạn...'
                      }
                      className="w-full rounded-xl border border-slate-200 dark:border-[#6C63FF]/35 bg-[#F8F8FB] dark:bg-[#0D0C1D] px-3.5 py-2.5 text-xs text-[#181826] dark:text-white placeholder-slate-400 focus:border-[#5D50FE] focus:outline-none"
                    />
                    <button
                      type="submit"
                      data-testid="submit-attach-wish-btn"
                      disabled={isSubmittingWish}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-[#5D50FE] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#4B3FE8] disabled:opacity-60 cursor-pointer"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>{isEn ? 'Post Wish' : 'Gửi lời chúc'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {wishFeedback && (
                <div
                  role="status"
                  className={`mt-3 flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-semibold ${
                    wishFeedback.type === 'success'
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/40'
                      : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/40'
                  }`}
                >
                  {wishFeedback.type === 'success' ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                  ) : (
                    <AlertCircle className="h-4 w-4 shrink-0" />
                  )}
                  <span>{wishFeedback.text}</span>
                </div>
              )}
            </motion.form>
          )}
        </AnimatePresence>

        {donorMessages.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-slate-300 dark:border-[#6C63FF]/35 bg-white/80 dark:bg-[#16142E]/80 p-10 text-center">
            <MessageSquareHeart className="mx-auto h-8 w-8 text-[#5D50FE]/60 dark:text-[#A39DFF]/70" />
            <p className="mt-3 text-base font-bold text-[#181826] dark:text-white">
              {isEn ? 'No donation wishes yet' : 'Chưa có lời nhắn quyên góp nào'}
            </p>
            <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-[#525866] dark:text-[#CBD5E1]">
              {isEn
                ? 'Supporters’ wishes will automatically appear here as soon as their QR payment is completed, or you can click "Add Wish for Completed Donation" above.'
                : 'Các lời chúc thực tế của người ủng hộ sẽ tự động xuất hiện tại đây ngay sau khi hoàn tất quét mã QR thanh toán, hoặc bấm “Bổ sung lời chúc đã donate” ở trên.'}
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {donorMessages.map((record) => {
              const dateStr = record.timestampIso
                .slice(0, 10)
                .split('-')
                .reverse()
                .join('/');
              return (
                <motion.article
                  key={record.id}
                  whileHover={{ y: -4 }}
                  data-testid="donor-wish-card"
                  className="flex flex-col justify-between rounded-2xl border border-slate-200/80 dark:border-[#6C63FF]/30 bg-white dark:bg-[#16142E] p-6 shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-mono-tabular font-semibold text-[#5D50FE] dark:text-[#A39DFF]">
                        {record.verifiedReceiptCode}
                      </span>
                      <span className="font-mono-tabular">{dateStr}</span>
                    </div>
                    <blockquote className="mt-3 text-sm leading-relaxed text-[#334155] dark:text-[#E2E8F0]">
                      “{record.message}”
                    </blockquote>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 dark:border-[#6C63FF]/20 pt-4">
                    <div>
                      <p className="text-sm font-bold text-[#181826] dark:text-white">
                        {record.isAnonymous
                          ? isEn
                            ? 'Anonymous Supporter'
                            : 'Nhà Hảo Tâm Ẩn Danh'
                          : record.name}
                      </p>
                      <p className="text-xs text-[#525866] dark:text-[#94A3B8]">
                        {translateAffiliation(record.affiliation)}
                      </p>
                    </div>
                    <span className="font-mono-tabular text-sm font-extrabold text-[#5D50FE] dark:text-[#A39DFF]">
                      {record.amountVnd > 0
                        ? formatVnd(record.amountVnd)
                        : isEn
                        ? 'Verified Supporter'
                        : 'Đã ủng hộ CLB'}
                    </span>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
};
