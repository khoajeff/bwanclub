import React from 'react';
import {
  ArrowRight,
  Atom,
  FlaskConical,
  Calendar,
  HeartHandshake,
  Crown,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { motion } from 'motion/react';
import { BwanHexLogo } from './BwanHexLogo';
import { AppLanguage, AppRoute } from './Navbar';

interface HeroSectionProps {
  onOpenJoinModal: (defaultDept?: string) => void;
  onNavigate: (route: AppRoute) => void;
  totalProjectsCount: number;
  totalEventsCount: number;
  lang: AppLanguage;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenJoinModal,
  onNavigate,
  totalProjectsCount,
  totalEventsCount,
  lang,
}) => {
  return (
    <section
      id="gioi-thieu"
      className="google-one-chem-hero pt-14 pb-20 sm:pt-20 sm:pb-24 px-4 sm:px-6 lg:px-8 transition-colors duration-300"
    >
      <div className="max-w-5xl mx-auto text-center">
        {/* School Affiliation & Slogan Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-4"
        >
          <span className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-white/85 dark:bg-[#16142E]/90 border border-[#6C63FF]/30 text-xs font-mono font-bold text-[#6C63FF] dark:text-[#A39DFF] shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              ĐOÀN TRƯỜNG THPT CHUYÊN LÊ QUÝ ĐÔN ĐÀ NẴNG · EST. 2021 · “LEARN
              NOT STUDY”
            </span>
          </span>
        </motion.div>

        {/* Clean Transparent Hexagonal Logo + BWAN CLUB Title (Balanced) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center justify-center gap-3.5 mb-6"
        >
          <BwanHexLogo className="w-12 h-12 sm:w-14 sm:h-14" />
          <span className="font-display text-2xl sm:text-3xl lg:text-[34px] font-extrabold tracking-tight leading-none inline-flex items-center">
            <span className="text-[#1F1F2E] dark:text-white">BWAN</span>
            <span className="ml-1.5 text-[#6C63FF] dark:text-[#8B84FF]">
              CLUB
            </span>
          </span>
        </motion.div>

        {/* Main Display Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-extrabold text-[#1F1F2E] dark:text-white tracking-tight text-balance mx-auto max-w-4xl text-4xl sm:text-5xl lg:text-[54px] leading-[1.16]"
        >
          {lang === 'vi' ? (
            <>
              Đam mê lớn hơn và{' '}
              <span className="google-one-chem-gradient-text">
                Phản ứng Sáng tạo
              </span>{' '}
              trong một Câu lạc bộ Hóa Học
            </>
          ) : (
            <>
              Greater Passion and{' '}
              <span className="google-one-chem-gradient-text">
                Creative Reactions
              </span>{' '}
              in One Chemistry Club
            </>
          )}
        </motion.h1>

        {/* Clean Centered Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 text-base sm:text-[17px] font-normal text-[#4A4A68] dark:text-[#CBD5E1] max-w-2xl mx-auto leading-[1.65]"
        >
          {lang === 'vi'
            ? 'Không gian chính thức của BWAN CLUB (THPT chuyên Lê Quý Đôn Đà Nẵng) — đại diện cho thế hệ “LEARN NOT STUDY” qua 5 năm hoạt động rực rỡ (2021 – 2026) và hành trình bứt phá của thế hệ Gen 6 (2026 – 2027).'
            : 'The official portal of BWAN CLUB (Le Quy Don High School for the Gifted, Da Nang) — representing the “LEARN NOT STUDY” generation across 5 successful years and Gen 6 (2026 – 2027).'}
        </motion.p>

        {/* Primary & Secondary Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <motion.button
            type="button"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onOpenJoinModal('BWAN CLUB Gen 6')}
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full google-one-chem-btn font-semibold text-sm sm:text-base cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>
              {lang === 'vi' ? 'Đăng ký tham gia ngay' : 'Join the Club Now'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>

          <motion.a
            href="/phan-ban"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/phan-ban');
            }}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white dark:bg-[#16142E] hover:bg-[#F4F2EE] dark:hover:bg-[#1E1B3D] text-[#6C63FF] dark:text-[#A39DFF] border border-[#DBD8D0] dark:border-[#6C63FF]/40 font-semibold text-sm sm:text-base transition-colors whitespace-nowrap shrink-0"
          >
            <span>
              {lang === 'vi'
                ? 'Xem Cơ Cấu Nhà Nước Gen 6'
                : 'View Gen 6 Org Chart'}
            </span>
          </motion.a>
        </motion.div>

        {/* 3 Interactive Tonal Proof & Quick Route Cards */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left max-w-4xl mx-auto">
          <motion.a
            href="/phan-ban"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/phan-ban');
            }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.18 }}
            whileHover={{ y: -4 }}
            className="group bg-white/90 dark:bg-[#16142E]/90 backdrop-blur-xs rounded-2xl p-6 border border-[#E5E2DC] dark:border-[#6C63FF]/30 shadow-2xs transition-all hover:border-[#6C63FF]/60 dark:hover:border-[#A39DFF]/60 cursor-pointer block"
          >
            <div className="flex items-center justify-between text-xs font-semibold tracking-wide text-[#6C63FF] dark:text-[#A39DFF]">
              <span className="bg-[#F1F0FF] dark:bg-[#6C63FF]/25 px-2.5 py-1 rounded-md">
                2021 – 2027 · Gen 1–6
              </span>
              <Atom className="w-4 h-4 text-[#6C63FF] dark:text-[#A39DFF] group-hover:rotate-45 transition-transform duration-300" />
            </div>
            <p className="mt-3.5 font-display text-lg sm:text-[19px] font-bold text-[#1F1F2E] dark:text-white tracking-tight tabular-nums flex items-center justify-between">
              <span>
                {lang === 'vi'
                  ? 'Cơ Cấu Nhà Nước Gen 6'
                  : 'Gen 6 Org Structure'}
              </span>
              <ChevronRight className="w-4 h-4 text-[#6C63FF] dark:text-[#A39DFF] opacity-70 group-hover:translate-x-1 transition-transform" />
            </p>
            <p className="mt-1.5 text-[13.5px] sm:text-sm font-normal text-[#4A4A68] dark:text-[#CBD5E1] leading-relaxed">
              {lang === 'vi'
                ? '2 Đồng chủ nhiệm & 4 ban: Hậu Cần, Nội Dung, Kỹ Thuật, Đối Ngoại'
                : '2 Co-Presidents & 4 Core Divisions'}
            </p>
          </motion.a>

          <motion.a
            href="/du-an"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/du-an');
            }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.24 }}
            whileHover={{ y: -4 }}
            className="group bg-white/90 dark:bg-[#16142E]/90 backdrop-blur-xs rounded-2xl p-6 border border-[#E5E2DC] dark:border-[#6C63FF]/30 shadow-2xs transition-all hover:border-[#0284C7]/60 dark:hover:border-[#38BDF8]/60 cursor-pointer block"
          >
            <div className="flex items-center justify-between text-xs font-semibold tracking-wide text-[#0284C7] dark:text-[#38BDF8]">
              <span className="bg-[#E0F2FE] dark:bg-[#0284C7]/25 px-2.5 py-1 rounded-md">
                LEARN NOT STUDY
              </span>
              <FlaskConical className="w-4 h-4 text-[#0284C7] dark:text-[#38BDF8] group-hover:scale-110 transition-transform duration-300" />
            </div>
            <p
              data-testid="hero-projects-count"
              className="mt-3.5 font-display text-lg sm:text-[19px] font-bold text-[#1F1F2E] dark:text-white tracking-tight tabular-nums flex items-center justify-between"
            >
              <span>
                {totalProjectsCount}{' '}
                {lang === 'vi' ? 'Dự Án & Danh Mục' : 'Projects & Modules'}
              </span>
              <ChevronRight className="w-4 h-4 text-[#0284C7] dark:text-[#38BDF8] opacity-70 group-hover:translate-x-1 transition-transform" />
            </p>
            <p className="mt-1.5 text-[13.5px] sm:text-sm font-normal text-[#4A4A68] dark:text-[#CBD5E1] leading-relaxed">
              {lang === 'vi'
                ? 'PROJECT “Bạn là nguyên tố nào?”, Lab Tour I–III, Preorder Valentine'
                : '“Which Element Are You?”, Lab Tours I–III & Valentine Preorder'}
            </p>
          </motion.a>

          <motion.a
            href="/su-kien"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/su-kien');
            }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            whileHover={{ y: -4 }}
            className="group bg-white/90 dark:bg-[#16142E]/90 backdrop-blur-xs rounded-2xl p-6 border border-[#E5E2DC] dark:border-[#6C63FF]/30 shadow-2xs transition-all hover:border-[#D97706]/60 dark:hover:border-[#FBBF24]/60 cursor-pointer block"
          >
            <div className="flex items-center justify-between text-xs font-semibold tracking-wide text-[#D97706] dark:text-[#FBBF24]">
              <span className="bg-[#FEF3C7] dark:bg-[#D97706]/25 px-2.5 py-1 rounded-md">
                10/2026 – 09/2027
              </span>
              <Calendar className="w-4 h-4 text-[#D97706] dark:text-[#FBBF24] group-hover:scale-110 transition-transform duration-300" />
            </div>
            <p className="mt-3.5 font-display text-lg sm:text-[19px] font-bold text-[#1F1F2E] dark:text-white tracking-tight tabular-nums flex items-center justify-between">
              <span>
                12 Tháng & {totalEventsCount}{' '}
                {lang === 'vi' ? 'Chuỗi Sự Kiện' : 'Event Series'}
              </span>
              <ChevronRight className="w-4 h-4 text-[#D97706] dark:text-[#FBBF24] opacity-70 group-hover:translate-x-1 transition-transform" />
            </p>
            <p className="mt-1.5 text-[13.5px] sm:text-sm font-normal text-[#4A4A68] dark:text-[#CBD5E1] leading-relaxed">
              {lang === 'vi'
                ? 'Lộ trình “GEN 6 SẼ CÓ GÌ??”, Workshop, Club Fair & BWAN CAMP 2027'
                : 'Full Gen 6 Roadmap, Workshop, Club Fair & BWAN CAMP 2027'}
            </p>
          </motion.a>
        </div>

        {/* Unified Quick Link to Donate & Top Donate Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.35 }}
          className="mt-6 max-w-4xl mx-auto text-left"
        >
          <a
            href="/donate"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/donate');
            }}
            className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white/90 dark:bg-[#16142E]/90 px-6 py-4 border border-[#E5E2DC] dark:border-[#6C63FF]/30 hover:border-[#6C63FF] dark:hover:border-[#A39DFF] transition-all"
          >
            <div className="flex items-center gap-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F1F0FF] dark:bg-[#6C63FF]/25 text-[#6C63FF] dark:text-[#A39DFF]">
                <HeartHandshake className="w-5 h-5" />
              </span>
              <div>
                <p className="font-display text-sm sm:text-base font-bold text-[#1F1F2E] dark:text-white flex items-center gap-2">
                  <span>
                    {lang === 'vi'
                      ? 'Cổng Quyên Góp & Bảng Xếp Hạng Top Donate BWAN CLUB'
                      : 'BWAN CLUB Academic Fund & Top Donors Leaderboard'}
                  </span>
                  <Crown className="w-4 h-4 text-[#D97706] dark:text-[#FBBF24]" />
                </p>
                <p className="text-xs text-[#4A4A68] dark:text-[#CBD5E1]">
                  {lang === 'vi'
                    ? 'Tạo mã QR PayOS tự động · Vinh danh Quán Quân Vương Miện Vàng, Hạng Bạc & Hạng Đồng thời gian thực'
                    : 'Instant PayOS QR generation · Real-time Gold, Silver & Bronze Honor Roll'}
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#6C63FF] dark:text-[#A39DFF] group-hover:translate-x-1 transition-transform shrink-0" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

interface PageBannerHeaderProps {
  kicker: string;
  titlePrefix: string;
  titleHighlight: string;
  subtitle: string;
  lang: AppLanguage;
  onNavigate: (route: AppRoute) => void;
}

/**
 * Dedicated BWAN CLUB Hero Banner shown at the top of each route (/phan-ban, /du-an, /su-kien, /quyen-gop)
 * so every route displays BWAN CLUB branding + luminous top gradient in both Light & Dark modes.
 */
export const PageBannerHeader: React.FC<PageBannerHeaderProps> = ({
  kicker,
  titlePrefix,
  titleHighlight,
  subtitle,
  lang,
  onNavigate,
}) => {
  return (
    <section className="google-one-chem-hero pt-12 pb-14 sm:pt-16 sm:pb-18 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-5xl mx-auto text-center">
        {/* Kicker Badge */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-4"
        >
          <span className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-white/85 dark:bg-[#16142E]/90 border border-[#6C63FF]/30 text-xs font-mono font-bold text-[#6C63FF] dark:text-[#A39DFF] shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>{kicker}</span>
          </span>
        </motion.div>

        {/* Centered Balanced Club Logo + BWAN CLUB Wordmark */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.03 }}
          className="inline-flex items-center justify-center gap-3.5 mb-5"
        >
          <BwanHexLogo className="w-12 h-12 sm:w-14 sm:h-14" />
          <span className="font-display text-2xl sm:text-3xl lg:text-[32px] font-extrabold tracking-tight leading-none inline-flex items-center">
            <span className="text-[#1F1F2E] dark:text-white">BWAN</span>
            <span className="ml-1.5 text-[#6C63FF] dark:text-[#8B84FF]">
              CLUB
            </span>
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, delay: 0.06 }}
          className="font-display font-extrabold text-[#1F1F2E] dark:text-white tracking-tight text-balance mx-auto max-w-4xl text-3xl sm:text-5xl lg:text-[52px] leading-[1.16]"
        >
          {titlePrefix}{' '}
          <span className="google-one-chem-gradient-text">
            {titleHighlight}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, delay: 0.1 }}
          className="mt-5 text-base sm:text-[17px] text-[#4A4A68] dark:text-[#CBD5E1] max-w-2xl mx-auto leading-[1.65]"
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.38, delay: 0.14 }}
          className="mt-6 flex items-center justify-center gap-3 text-xs sm:text-sm font-semibold text-[#5F6368] dark:text-[#94A3B8]"
        >
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/');
            }}
            className="text-[#6C63FF] dark:text-[#A39DFF] hover:underline"
          >
            {lang === 'vi'
              ? '← Về trang Tổng quan BWAN CLUB'
              : '← Back to BWAN CLUB Overview'}
          </a>
        </motion.div>
      </div>
    </section>
  );
};
