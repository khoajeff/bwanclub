import React, { useState } from 'react';
import {
  BWAN_CLUB_BACKGROUND,
  BWAN_VISION_FLOWS,
  BWAN_CORE_VALUES,
  BWAN_GENERATIONS_HISTORY,
} from '../utils/chemistryEngine';
import {
  Flame,
  Sparkles,
  ArrowRight,
  Compass,
  Award,
  Users,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppLanguage, AppRoute } from './Navbar';

interface BwanHeritageAndVisionSectionProps {
  lang: AppLanguage;
  onNavigate: (route: AppRoute) => void;
}

export const BwanHeritageAndVisionSection: React.FC<
  BwanHeritageAndVisionSectionProps
> = ({ lang, onNavigate }) => {
  const [selectedGenId, setSelectedGenId] = useState<string>('all');

  const visibleGenerations =
    selectedGenId === 'all'
      ? BWAN_GENERATIONS_HISTORY
      : BWAN_GENERATIONS_HISTORY.filter((g) => g.id === selectedGenId);

  return (
    <div className="space-y-0">
      {/* PART 1: 02. BACKGROUND, VISION ("LEARN NOT STUDY") & 4 CORE VALUES */}
      <section
        id="background-tam-nhin"
        data-testid="bwan-heritage-section"
        className="google-one-chem-section-wash py-16 sm:py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Top Section Header */}
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F1F0FF] dark:bg-[#6C63FF]/25 border border-[#6C63FF]/30 text-xs font-bold text-[#6C63FF] dark:text-[#A39DFF]">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>
                CÂU CHUYỆN KHỞI NGUỒN · TẦM NHÌN · GIÁ TRỊ CỐT LÕI BWAN CLUB
              </span>
            </div>

            <h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#1F1F2E] dark:text-white tracking-tight leading-[1.15] text-balance">
              {lang === 'vi' ? (
                <>
                  Thế Hệ Hóa Học Chủ Động{' '}
                  <span className="google-one-chem-gradient-text">
                    “LEARN NOT STUDY”
                  </span>
                </>
              ) : (
                <>
                  The Proactive Chemistry Generation:{' '}
                  <span className="google-one-chem-gradient-text">
                    “LEARN NOT STUDY”
                  </span>
                </>
              )}
            </h2>

            <p className="mt-3 text-base sm:text-[17px] text-[#4A4A68] dark:text-[#CBD5E1] leading-relaxed">
              <strong className="text-[#1F1F2E] dark:text-white">
                BWAN CLUB
              </strong>{' '}
              — {BWAN_CLUB_BACKGROUND.schoolAffiliation}.{' '}
              {BWAN_CLUB_BACKGROUND.backgroundDescription}
            </p>
          </div>

          {/* BACKGROUND CARD + 5-YEAR TIMELINE (2022 - 2026) */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="google-one-tonal-card rounded-[32px] p-6 sm:p-9"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#6C63FF] dark:text-[#A39DFF]">
                  <Flame className="w-4 h-4 text-[#F59E0B]" />
                  <span>HÀNH TRÌNH THÀNH LẬP TỪ NĂM 2021</span>
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1F1F2E] dark:text-white leading-tight">
                  BWAN CLUB — Đoàn Trường THPT Chuyên Lê Quý Đôn Đà Nẵng
                </h3>
                <p className="text-sm sm:text-base text-[#4A4A68] dark:text-[#CBD5E1] leading-relaxed">
                  Được thành lập vào năm <strong>2021</strong>, đại diện cho thế
                  hệ <strong>“LEARN NOT STUDY”</strong> — nơi học sinh tiếp cận
                  Hóa học bằng thực nghiệm trực quan, tư duy bản chất và sáng
                  tạo không giới hạn.
                </p>
              </div>

              <div className="lg:col-span-7 bg-white/80 dark:bg-[#1E1A3E]/90 rounded-2xl p-5 sm:p-6 border border-[#DCD9F2] dark:border-[#8B84FF]/30 shadow-xs">
                <div className="flex items-center justify-between gap-2 mb-5">
                  <span className="font-display text-sm sm:text-base font-bold text-[#1F1F2E] dark:text-white flex items-center gap-2">
                    <Flame className="w-4 h-4 text-[#F59E0B] shrink-0" />
                    <span>
                      BWAN đã trải qua 5 năm hoạt động thành công (2021 – 2026)
                    </span>
                  </span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#6C63FF] text-white shadow-2xs">
                    Gen 1 → Gen 6
                  </span>
                </div>

                {/* 2022 - 2023 - 2024 - 2025 - 2026 Timeline Bar */}
                <div className="relative pt-2 pb-1">
                  <div className="hidden sm:block absolute top-[26px] left-6 right-6 h-[2px] bg-gradient-to-r from-[#6C63FF] via-[#8B5CF6] to-[#38BDF8]" />
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 relative z-10">
                    {[
                      {
                        year: '2022',
                        gen: 'Gen 1 – 2',
                        note: 'Khởi nguồn CLB',
                      },
                      {
                        year: '2023',
                        gen: 'Gen 2 – 3',
                        note: 'Mở rộng thực nghiệm',
                      },
                      {
                        year: '2024',
                        gen: 'Gen 3 – 4',
                        note: 'Bùng nổ sự kiện',
                      },
                      {
                        year: '2025',
                        gen: 'Gen 4 – 5',
                        note: 'Lan tỏa học thuật',
                      },
                      {
                        year: '2026',
                        gen: 'Gen 5 – 6',
                        note: 'Đột phá Gen 6',
                      },
                    ].map((milestone, idx) => (
                      <div
                        key={milestone.year}
                        className="google-one-subcard flex flex-col items-center text-center p-3 rounded-xl hover:-translate-y-0.5"
                      >
                        <span
                          className={`w-3.5 h-3.5 rounded-full border-2 border-white dark:border-[#1E1A3E] shadow-xs mb-1.5 ${
                            idx === 4 ? 'bg-[#38BDF8]' : 'bg-[#8B84FF]'
                          }`}
                        />
                        <span className="font-display text-lg font-extrabold text-[#1F1F2E] dark:text-white tabular-nums">
                          {milestone.year}
                        </span>
                        <span className="text-[11px] font-bold text-[#6C63FF] dark:text-[#B4AEFF]">
                          {milestone.gen}
                        </span>
                        <span className="text-[11px] text-[#4A4A68] dark:text-[#CBD5E1] mt-0.5">
                          {milestone.note}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* TẦM NHÌN (VISION FLOWS) & GIÁ TRỊ CỐT LÕI (4 PILLARS) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left 6 Cols: TẦM NHÌN */}
            <div className="lg:col-span-6 google-one-tonal-card rounded-[28px] p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#6C63FF] dark:text-[#A39DFF] uppercase tracking-wider flex items-center gap-1.5">
                    <Compass className="w-4 h-4" />
                    <span>TẦM NHÌN BWAN CLUB</span>
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#6C63FF]/15 dark:bg-[#6C63FF]/30 text-[#6C63FF] dark:text-[#C4B5FD] font-display text-xs font-extrabold tracking-wide">
                    LEARN NOT STUDY
                  </span>
                </div>

                <h3 className="mt-3 font-display text-2xl font-extrabold text-[#1F1F2E] dark:text-white">
                  Chuyển Hóa Tri Thức Thành Giá Trị Thực Tiễn
                </h3>

                <div className="mt-6 space-y-5">
                  {BWAN_VISION_FLOWS.map((flow) => (
                    <div
                      key={flow.id}
                      className="google-one-subcard rounded-2xl p-5 space-y-3.5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="google-one-subcard-pill px-3.5 py-2.5 rounded-xl font-display text-sm font-bold">
                          {flow.sourceTitle}
                        </div>
                        <ArrowRight className="w-5 h-5 text-[#6C63FF] dark:text-[#A39DFF] shrink-0 hidden sm:block" />
                        <div className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#564CE0] text-white font-display text-sm font-bold shadow-xs">
                          {flow.targetTitle}
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-[#4A4A68] dark:text-[#E2E8F0] leading-relaxed">
                        {flow.description}
                      </p>
                      <div className="text-xs font-semibold text-[#0284C7] dark:text-[#38BDF8]">
                        {flow.formulaTag}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#DFDCF2] dark:border-[#8B84FF]/25 flex items-center justify-between text-xs text-[#5F6368] dark:text-[#CBD5E1]">
                <span>Kim chỉ nam xuyên suốt 6 thế hệ</span>
                <span className="font-bold text-[#6C63FF] dark:text-[#A39DFF]">
                  “LEARN NOT STUDY”
                </span>
              </div>
            </div>

            {/* Right 6 Cols: GIÁ TRỊ CỐT LÕI */}
            <div className="lg:col-span-6 google-one-tonal-card rounded-[28px] p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#0284C7] dark:text-[#38BDF8] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>GIÁ TRỊ CỐT LÕI</span>
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#E0F2FE] dark:bg-[#0284C7]/30 text-[#0284C7] dark:text-[#7DD3FC] text-xs font-bold">
                    4 Trụ Cột Văn Hóa
                  </span>
                </div>

                <h3 className="mt-3 font-display text-2xl font-extrabold text-[#1F1F2E] dark:text-white">
                  4 Giá Trị Cốt Lõi Của BWAN CLUB
                </h3>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {BWAN_CORE_VALUES.map((val) => (
                    <div
                      key={val.id}
                      className="google-one-subcard rounded-2xl p-5 flex flex-col justify-between hover:-translate-y-0.5"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="text-xs font-mono font-bold text-[#6C63FF] dark:text-[#B4AEFF]">
                            {val.code}
                          </span>
                          <span className="google-one-subcard-pill px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold">
                            {val.elementBadge}
                          </span>
                        </div>
                        <h4 className="font-display text-base font-bold text-[#1F1F2E] dark:text-white leading-snug">
                          {val.title}
                        </h4>
                        <p className="mt-2 text-xs sm:text-[13px] text-[#4A4A68] dark:text-[#E2E8F0] leading-relaxed">
                          {val.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#DFDCF2] dark:border-[#8B84FF]/25 flex items-center justify-between text-xs text-[#5F6368] dark:text-[#CBD5E1]">
                <span>Hóa bản chất · Kết nối khoa học · Ngoại khóa · Lan tỏa</span>
                <button
                  type="button"
                  onClick={() => onNavigate('/su-kien')}
                  className="font-semibold text-[#6C63FF] dark:text-[#A39DFF] hover:underline cursor-pointer"
                >
                  Xem lộ trình Gen 6 →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PART 2: HALL OF GENERATIONS (CO-FOUNDER ĐỖ VĨNH PHÚC & BCN GEN 2 - GEN 5) */}
      <section
        id="cac-the-he-bwan"
        data-testid="bwan-generations-section"
        className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#0D0C1D] transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#D97706] dark:text-[#FBBF24] uppercase tracking-wider">
                <Award className="w-4 h-4" />
                <span>LỊCH SỬ BAN CHỦ NHIỆM QUA CÁC THẾ HỆ (GEN 1 – GEN 5)</span>
              </div>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-[#1F1F2E] dark:text-white tracking-tight text-balance">
                Những Người Truyền Lửa{' '}
                <span className="google-one-chem-gradient-text">
                  BWAN CLUB (2021 – 2026)
                </span>
              </h2>
              <p className="mt-2.5 text-sm sm:text-base text-[#4A4A68] dark:text-[#CBD5E1] leading-relaxed">
                Tri ân nhà đồng sáng lập CLB{' '}
                <strong className="text-[#1F1F2E] dark:text-white">
                  Đỗ Vĩnh Phúc (Co-Founder BWAN CLUB)
                </strong>{' '}
                và các thế hệ Ban Chủ Nhiệm từ Gen 2 đến Gen 5 đã kiến tạo nên
                hành trình 5 năm rực rỡ tại Trường THPT chuyên Lê Quý Đôn Đà
                Nẵng.
              </p>
            </div>

            {/* Generation Filter Pills */}
            <div
              role="group"
              aria-label="Chọn thế hệ Ban Chủ Nhiệm"
              className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-[#EAE7E0] dark:bg-[#191632] shrink-0"
            >
              {[
                { id: 'all', label: 'Tất cả (Gen 1–5)' },
                { id: 'gen-1-founder', label: 'Co-Founder (Gen 1)' },
                { id: 'gen-2-bcn', label: 'Gen 2' },
                { id: 'gen-3-bcn', label: 'Gen 3' },
                { id: 'gen-4-bcn', label: 'Gen 4' },
                { id: 'gen-5-bcn', label: 'Gen 5' },
              ].map((tab) => {
                const isSelected = selectedGenId === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSelectedGenId(tab.id)}
                    className={`relative px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      isSelected
                        ? 'text-white'
                        : 'text-[#4A4A68] dark:text-[#CBD5E1] hover:text-[#1F1F2E] dark:hover:text-white'
                    }`}
                  >
                    {isSelected && (
                      <motion.span
                        layoutId="gen-history-pill"
                        className="absolute inset-0 rounded-xl bg-[#6C63FF]"
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Generations Visual Cards Grid */}
          <motion.div
            layout
            className="mt-9 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch"
          >
            <AnimatePresence mode="popLayout">
              {visibleGenerations.map((gen, idx) => (
                <motion.article
                  layout
                  key={gen.id}
                  initial={{ opacity: 0, y: 18, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.32, delay: idx * 0.05 }}
                  whileHover={{ y: -5 }}
                  className={`google-one-tonal-card rounded-[28px] overflow-hidden flex flex-col justify-between ${
                    gen.genNumber === 1
                      ? 'md:col-span-2 lg:col-span-1 ring-2 ring-[#6C63FF]/50'
                      : ''
                  }`}
                >
                  <div>
                    {/* Authentic Slide Portrait Image — Unobstructed Full View */}
                    <div className="relative aspect-[16/9] w-full bg-[#121026] overflow-hidden border-b border-[#E5E2DC] dark:border-[#6C63FF]/25">
                      <img
                        src={gen.slideImage}
                        alt={`${gen.roleTitle} — ${gen.leaders.join(', ')}`}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="p-6">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono font-bold text-[#6C63FF] dark:text-[#A39DFF]">
                        <span>{gen.genLabel}</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#F1F0FF] dark:bg-[#6C63FF]/25 text-[#6C63FF] dark:text-[#A39DFF]">
                          {gen.period}
                        </span>
                      </div>

                      <h3 className="mt-2.5 font-display text-xl font-extrabold text-[#1F1F2E] dark:text-white">
                        {gen.leaders.join(' & ')}
                      </h3>

                      <p className="text-xs font-semibold text-[#0284C7] dark:text-[#38BDF8] mt-0.5">
                        {gen.roleTitle} · {gen.elementTag}
                      </p>

                      <p className="mt-3 text-xs sm:text-sm text-[#4A4A68] dark:text-[#CBD5E1] leading-relaxed">
                        {gen.summary}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-5 pt-3 border-t border-[#DFDBD2] dark:border-[#6C63FF]/20 flex items-center justify-between text-xs font-mono text-[#5F6368] dark:text-[#94A3B8]">
                    <span>THPT Chuyên Lê Quý Đôn</span>
                    <span className="font-bold text-[#1F1F2E] dark:text-white">
                      BWAN CLUB
                    </span>
                  </div>
                </motion.article>
              ))}

              {/* 6th Card: Bridge to Gen 6 Current Leadership & State Structure */}
              <motion.article
                layout
                key="gen-6-current-bridge"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className="rounded-[28px] p-6 sm:p-7 bg-gradient-to-br from-[#6C63FF] via-[#574EE2] to-[#0284C7] text-white flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-mono font-bold">
                    <Users className="w-3.5 h-3.5" />
                    <span>THẾ HỆ HIỆN TẠI · GEN 6 (2026 – 2027)</span>
                  </div>

                  <h3 className="mt-4 font-display text-2xl font-extrabold leading-snug">
                    Ban Quản Lý & “Cơ Cấu Nhà Nước” BWAN CLUB Gen 6
                  </h3>

                  <p className="mt-2.5 text-xs sm:text-sm text-white/90 leading-relaxed">
                    Tiếp nối 5 thế hệ đi trước, BWAN CLUB Gen 6 được điều hành
                    bởi hai Đồng Chủ Nhiệm{' '}
                    <strong>Trần Minh Trí</strong> &{' '}
                    <strong>Nguyễn Minh Anh</strong> cùng 4 ban chuyên môn.
                  </p>

                  <div className="mt-4 space-y-2.5 rounded-2xl bg-black/20 p-4 text-xs">
                    <div>
                      <span className="block font-mono text-[10px] uppercase tracking-wider text-white/70">
                        Đồng Chủ Nhiệm Gen 6
                      </span>
                      <span className="font-display font-bold text-white">
                        Trần Minh Trí · Nguyễn Minh Anh
                      </span>
                    </div>
                    <div className="border-t border-white/10 pt-2">
                      <span className="block font-mono text-[10px] uppercase tracking-wider text-white/70">
                        Ban Kỹ Thuật (Tiểu ban Truyền thông · Media · Design)
                      </span>
                      <span className="font-display font-bold text-white">
                        Mai Trần Anh Khoa · Nguyễn Minh Anh · Nguyễn Lương Minh Đức
                      </span>
                    </div>
                    <div className="border-t border-white/10 pt-2">
                      <span className="block font-mono text-[10px] uppercase tracking-wider text-white/70">
                        Ban Nội Dung · Ban Đối Ngoại · Ban Hậu Cần (Nhân sự & Tài chính)
                      </span>
                      <span className="font-display font-bold text-white">
                        Thái Việt Đức · Phan Nhật Nam · Dương Phạm Nguyên Thy · Nguyễn Anh Thư
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/20 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => onNavigate('/phan-ban')}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white text-[#6C63FF] font-display text-xs font-bold hover:bg-[#F4F2EE] transition-colors cursor-pointer"
                  >
                    <span>Xem Sơ Đồ Cơ Cấu Gen 6</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate('/su-kien')}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-white hover:underline cursor-pointer"
                  >
                    <span>Lộ trình Gen 6 (2026–2027) →</span>
                  </button>
                </div>
              </motion.article>
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
