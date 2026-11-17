import React, { useState, useEffect, useCallback } from 'react';
import { Navbar, AppLanguage, AppRoute } from './components/Navbar';
import { HeroSection, PageBannerHeader } from './components/HeroSection';
import { BwanHeritageAndVisionSection } from './components/BwanHeritageAndVisionSection';
import { ClubDivisionsSection } from './components/ClubDivisionsSection';
import { CategorySyncHubSection } from './components/CategorySyncHubSection';
import { ProjectExperiencePage } from './components/ProjectExperiencePage';
import { ChemClubDonationModule } from './modules/chem-donation';
import { AIAdvisorSection } from './components/AIAdvisorSection';
import { JoinClubModal, MemberRegistration } from './components/JoinClubModal';
import { BwanHexLogo } from './components/BwanHexLogo';
import {
  INITIAL_CLUB_PROJECTS,
  INITIAL_CLUB_EVENTS,
  ClubProjectItem,
} from './utils/chemistryEngine';
import { ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const INITIAL_MEMBERS: MemberRegistration[] = [
  {
    id: 'mem-1',
    fullName: 'Trần Hoàng Bảo Ngọc',
    email: 'baongoc@bwanclub.edu.vn',
    gradeClass: 'Lớp 12 Chuyên Hóa · THPT Chuyên Lê Quý Đôn',
    division: 'Ban Nội Dung',
    favoriteElement: 'Pt · 78 (Xúc tác Bạch kim)',
    registeredAt: 'Gen 6 · 2026',
  },
  {
    id: 'mem-2',
    fullName: 'Lê Nguyễn Minh Quân',
    email: 'minhquan@bwanclub.edu.vn',
    gradeClass: 'Lớp 11A1 Hóa · THPT Chuyên Lê Quý Đôn',
    division: 'Ban Kỹ Thuật',
    favoriteElement: 'Ne · 10 (Ánh sáng Neon)',
    registeredAt: 'Gen 6 · 2026',
  },
  {
    id: 'mem-3',
    fullName: 'Vũ Hà Phương Anh',
    email: 'phuonganh@bwanclub.edu.vn',
    gradeClass: 'Lớp 11 Chuyên Hóa · THPT Chuyên Lê Quý Đôn',
    division: 'Ban Hậu Cần',
    favoriteElement: 'Fe · 26 (Nền tảng Sắt)',
    registeredAt: 'Gen 6 · 2026',
  },
];

function resolveRouteFromPathname(pathname: string): AppRoute {
  const clean = pathname.replace(/\/+$/, '') || '/';
  if (clean === '/phan-ban') return '/phan-ban';
  if (
    clean === '/du-an' ||
    clean.startsWith('/du-an/') ||
    clean === '/3d-molecular-studio' ||
    clean === '/molecular-studio'
  ) {
    return '/du-an';
  }
  if (clean === '/su-kien') return '/su-kien';
  if (clean === '/donate' || clean === '/quyen-gop') {
    return '/donate';
  }
  if (
    clean === '/leaderboard' ||
    clean === '/bxh' ||
    clean === '/bxh-top-donate'
  ) {
    return '/leaderboard';
  }
  return '/';
}

function extractProjectSlugFromPathname(pathname: string): string | null {
  const clean = pathname.replace(/\/+$/, '') || '/';
  if (clean === '/3d-molecular-studio' || clean === '/molecular-studio') {
    return '3d-molecular-studio';
  }
  if (clean === '/18-nguyen-to-nhan-cach' || clean === '/giai-ma-18-nguyen-to-nhan-cach') {
    return 'giai-ma-18-nguyen-to-nhan-cach';
  }
  const match = clean.match(/^\/du-an\/([^/]+)$/);
  return match ? decodeURIComponent(match[1]) : null;
}

function isStandaloneFullscreenUrl(): boolean {
  const searchParams = new URLSearchParams(window.location.search);
  const cleanPath = window.location.pathname.replace(/\/+$/, '') || '/';
  return (
    searchParams.get('fullscreen') === '1' ||
    cleanPath === '/18-nguyen-to-nhan-cach' ||
    cleanPath === '/giai-ma-18-nguyen-to-nhan-cach'
  );
}

const TAB_TRANSITION = {
  duration: 0.36,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
};

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(() =>
    resolveRouteFromPathname(window.location.pathname)
  );
  const [activeProjectSlug, setActiveProjectSlug] = useState<string | null>(
    () => extractProjectSlugFromPathname(window.location.pathname)
  );
  const [standaloneFullscreen, setStandaloneFullscreen] = useState<boolean>(
    () => isStandaloneFullscreenUrl()
  );
  const [isDark, setIsDark] = useState(false);
  const [lang, setLang] = useState<AppLanguage>(() => {
    try {
      const saved = window.localStorage.getItem('bwan_club_lang_v1');
      if (saved === 'en' || saved === 'vi') return saved;
    } catch {
      // Ignore storage access errors
    }
    return 'vi';
  });
  const [projects, setProjects] = useState<ClubProjectItem[]>(
    INITIAL_CLUB_PROJECTS
  );
  const [events] = useState(INITIAL_CLUB_EVENTS);
  const [members, setMembers] = useState<MemberRegistration[]>(INITIAL_MEMBERS);

  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState('Ban Kỹ Thuật');

  useEffect(() => {
    try {
      window.localStorage.setItem('bwan_club_lang_v1', lang);
    } catch {
      // Ignore storage access errors
    }
  }, [lang]);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(resolveRouteFromPathname(window.location.pathname));
      setActiveProjectSlug(
        extractProjectSlugFromPathname(window.location.pathname)
      );
      setStandaloneFullscreen(isStandaloneFullscreenUrl());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Tự động kiểm tra window.location.pathname khi tải trang trực tiếp để cuộn mượt xuống #quyen-gop hoặc #leaderboard-section
  useEffect(() => {
    const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
    if (pathname === '/donate' || pathname === '/quyen-gop') {
      const timer = window.setTimeout(() => {
        const el = document.getElementById('quyen-gop');
        if (el && window.scrollY > 120) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 400);
      return () => window.clearTimeout(timer);
    }
    if (
      pathname === '/leaderboard' ||
      pathname === '/bxh' ||
      pathname === '/bxh-top-donate'
    ) {
      const timer = window.setTimeout(() => {
        const el = document.getElementById('leaderboard-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 420);
      return () => window.clearTimeout(timer);
    }
  }, []);

  const handleNavigate = useCallback((route: AppRoute) => {
    if (window.location.pathname !== route || window.location.search) {
      window.history.pushState({}, '', route);
    }
    setActiveProjectSlug(null);
    setStandaloneFullscreen(false);
    setCurrentRoute(route);

    if (route === '/leaderboard' || route === '/bxh') {
      window.setTimeout(() => {
        const el = document.getElementById('leaderboard-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 420);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleOpenProjectExperience = useCallback((slug: string) => {
    const targetPath = `/du-an/${slug}`;
    if (window.location.pathname !== targetPath || window.location.search) {
      window.history.pushState({}, '', targetPath);
    }
    setCurrentRoute('/du-an');
    setActiveProjectSlug(slug);
    setStandaloneFullscreen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleOpenJoinModal = (dept = 'Ban Kỹ Thuật') => {
    setSelectedDivision(dept);
    setJoinModalOpen(true);
  };

  const handleAddProject = (newProj: ClubProjectItem) => {
    setProjects((prev) => [newProj, ...prev]);
  };

  const handleRegisterMember = (newMember: MemberRegistration) => {
    setMembers((prev) => [newMember, ...prev]);
  };

  const matchedProject = activeProjectSlug
    ? projects.find((p) => p.slug === activeProjectSlug) || projects[0]
    : null;

  if (standaloneFullscreen && matchedProject) {
    return (
      <ProjectExperiencePage
        project={matchedProject}
        onBackToProjects={() => handleNavigate('/du-an')}
        lang={lang}
        standaloneFullscreen={true}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0D0C1D] text-[#1F1F2E] dark:text-[#F8FAFC] transition-colors duration-300">
      {/* Top Navigation Bar with Multi-Route Navigation + Theme & Language Controls */}
      <Navbar
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        onOpenJoinModal={handleOpenJoinModal}
        isDark={isDark}
        onToggleTheme={() => setIsDark((prev) => !prev)}
        lang={lang}
        onToggleLang={() => setLang((prev) => (prev === 'vi' ? 'en' : 'vi'))}
      />

      {/* Main Content — Dedicated Page per Route with Graceful Wait-Mode Page Transitions */}
      <main className="flex-1 min-h-[82vh]">
        <AnimatePresence mode="wait">
          {currentRoute === '/' && (
            <motion.div
              key="route-overview"
              initial={{ opacity: 0, y: 18, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -14, filter: 'blur(4px)' }}
              transition={TAB_TRANSITION}
            >
              <HeroSection
                onOpenJoinModal={handleOpenJoinModal}
                onNavigate={handleNavigate}
                totalProjectsCount={projects.length}
                totalEventsCount={events.length}
                lang={lang}
              />

              {/* Background (2021-2026), Vision ("LEARN NOT STUDY"), 4 Core Values & Gen 1-5 Leadership History */}
              <BwanHeritageAndVisionSection
                lang={lang}
                onNavigate={handleNavigate}
              />

              <AIAdvisorSection lang={lang} />
            </motion.div>
          )}

          {currentRoute === '/phan-ban' && (
            <motion.div
              key="route-divisions"
              initial={{ opacity: 0, y: 18, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -14, filter: 'blur(4px)' }}
              transition={TAB_TRANSITION}
            >
              <PageBannerHeader
                kicker={
                  lang === 'vi'
                    ? 'CƠ CẤU NHÀ NƯỚC & PHÂN BAN GEN 6'
                    : 'GEN 6 ORG CHART & DIVISIONS'
                }
                titlePrefix={
                  lang === 'vi'
                    ? 'Cơ Cấu Tổ Chức & 4 Phân Ban'
                    : 'Organizational Structure of'
                }
                titleHighlight="BWAN CLUB GEN 6"
                subtitle={
                  lang === 'vi'
                    ? 'Khám phá sơ đồ “Cơ cấu nhà nước” Ban Quản Lý BWAN CLUB Gen 6 (Đồng chủ nhiệm: Trần Minh Trí & Nguyễn Minh Anh) cùng 4 ban chính thức: Ban Hậu Cần (Tiểu ban Nhân sự & Tiểu ban Tài chính), Ban Nội Dung, Ban Kỹ Thuật (Tiểu ban Truyền thông, Tiểu ban Media & Tiểu ban Design) và Ban Đối Ngoại.'
                    : 'Explore the official BWAN CLUB Gen 6 governance structure led by Co-Presidents Tran Minh Tri & Nguyen Minh Anh across Logistics, Content, Technical, and External Relations divisions.'
                }
                lang={lang}
                onNavigate={handleNavigate}
              />

              <ClubDivisionsSection
                onSelectDivision={handleOpenJoinModal}
                lang={lang}
              />
            </motion.div>
          )}

          {currentRoute === '/du-an' && (
            <motion.div
              key={
                matchedProject
                  ? `route-project-exp-${matchedProject.slug}`
                  : 'route-projects'
              }
              initial={{ opacity: 0, y: 18, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -14, filter: 'blur(4px)' }}
              transition={TAB_TRANSITION}
            >
              {matchedProject ? (
                <ProjectExperiencePage
                  project={matchedProject}
                  onBackToProjects={() => handleNavigate('/du-an')}
                  lang={lang}
                />
              ) : (
                <>
                  <PageBannerHeader
                    kicker={
                      lang === 'vi'
                        ? 'DỰ ÁN & KHÔNG GIAN TRẢI NGHIỆM GEN 6'
                        : 'GEN 6 INTERACTIVE PROJECTS'
                    }
                    titlePrefix={
                      lang === 'vi'
                        ? 'Chuỗi Dự Án Thực Nghiệm &'
                        : 'Experimental Projects &'
                    }
                    titleHighlight={
                      lang === 'vi'
                        ? '18 Nguyên Tố BWAN CLUB'
                        : 'BWAN CLUB Innovations'
                    }
                    subtitle={
                      lang === 'vi'
                        ? 'Khám phá và trực tiếp trải nghiệm PROJECT “Bạn là nguyên tố nào?”, chuỗi Lab Tour nội bộ I–III, chiến dịch Preorder Valentine và dự án “Tiếp sức mùa thi” của BWAN CLUB.'
                        : 'Explore and directly experience PROJECT “Which Element Are You?”, 3D Organic Molecular Studio, internal Lab Tours I–III, Valentine Preorder campaigns, and the live project synchronization hub.'
                    }
                    lang={lang}
                    onNavigate={handleNavigate}
                  />

                  <CategorySyncHubSection
                    projects={projects}
                    events={events}
                    onAddProject={handleAddProject}
                    onOpenJoinModal={handleOpenJoinModal}
                    onOpenProjectExperience={handleOpenProjectExperience}
                    lang={lang}
                    sectionMode="projects"
                  />
                </>
              )}
            </motion.div>
          )}

          {currentRoute === '/su-kien' && (
            <motion.div
              key="route-events"
              initial={{ opacity: 0, y: 18, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -14, filter: 'blur(4px)' }}
              transition={TAB_TRANSITION}
            >
              <PageBannerHeader
                kicker={
                  lang === 'vi'
                    ? 'LỘ TRÌNH 12 THÁNG GEN 6 (10/2026 – 09/2027)'
                    : 'GEN 6 MASTER ROADMAP (10/2026 – 09/2027)'
                }
                titlePrefix={
                  lang === 'vi'
                    ? '“GEN 6 SẼ CÓ GÌ??” &'
                    : 'Gen 6 Master Roadmap &'
                }
                titleHighlight={
                  lang === 'vi'
                    ? 'Sự Kiện BWAN CLUB'
                    : 'BWAN CLUB Events'
                }
                subtitle={
                  lang === 'vi'
                    ? 'Theo dõi trọn vẹn kế hoạch hoạt động từ tháng 10/2026 đến tháng 09/2027 của BWAN CLUB Gen 6: First Meeting, Lab Tour I–III, Preorder Valentine, Sinh nhật BWAN 6 tuổi, Workshop Gen 6, Club Fair và BWAN CAMP 2027 (22/08).'
                    : 'Follow the complete October 2026 – September 2027 roadmap of BWAN CLUB Gen 6 including Lab Tours, Valentine Preorder, 6th Anniversary, Club Fair, and BWAN CAMP 2027.'
                }
                lang={lang}
                onNavigate={handleNavigate}
              />

              <CategorySyncHubSection
                projects={projects}
                events={events}
                onAddProject={handleAddProject}
                onOpenJoinModal={handleOpenJoinModal}
                lang={lang}
                sectionMode="events"
              />
            </motion.div>
          )}

          {(currentRoute === '/donate' ||
            currentRoute === '/quyen-gop' ||
            currentRoute === '/leaderboard' ||
            currentRoute === '/bxh') && (
            <motion.div
              id="quyen-gop"
              key="route-donate-and-leaderboard"
              initial={{ opacity: 0, y: 18, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -14, filter: 'blur(4px)' }}
              transition={TAB_TRANSITION}
              className="scroll-mt-20"
            >
              <PageBannerHeader
                kicker={
                  lang === 'vi'
                    ? 'CỔNG QUYÊN GÓP & BẢNG VINH DANH THỜI GIAN THỰC'
                    : 'ACADEMIC ENDOWMENT & REAL-TIME HONOR ROLL'
                }
                titlePrefix={
                  lang === 'vi'
                    ? 'Quỹ Học Thuật & Top Donate'
                    : 'Endowment Fund & Top Donors of'
                }
                titleHighlight="BWAN CLUB"
                subtitle={
                  lang === 'vi'
                    ? 'Ủng hộ trực tiếp cho các dự án thực nghiệm, hóa chất phòng Lab của BWAN CLUB qua cổng QR PayOS tự động xác thực và vinh danh ngay lập tức trên Bảng Xếp Hạng Top Donate.'
                    : 'Support BWAN CLUB laboratory experiments and academic initiatives with instant PayOS QR verification and real-time cumulative leaderboard recognition.'
                }
                lang={lang}
                onNavigate={handleNavigate}
              />

              <ChemClubDonationModule
                embeddedMode
                viewMode="all"
                lang={lang}
                onNavigateToLeaderboard={() => handleNavigate('/leaderboard')}
                onNavigateToDonate={() => handleNavigate('/donate')}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Ambient Glow Wrapper (Google One Style Closing Banner + Uniformly Proportioned Footer) */}
        <div className="gemini-bottom-glow">
          {/* Closing Club Invitation Banner — Google One Large Uniform Proportions */}
          <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center justify-center gap-3.5 mb-6">
                <BwanHexLogo className="w-12 h-12 sm:w-14 sm:h-14" />
                <span className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight leading-none inline-flex items-center">
                  <span className="text-[#1F1F2E] dark:text-white">BWAN</span>
                  <span className="ml-1.5 text-[#6C63FF] dark:text-[#8B84FF]">
                    CLUB
                  </span>
                </span>
              </div>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-[#1F1F2E] dark:text-white tracking-tight leading-[1.16] text-balance">
                {lang === 'vi' ? (
                  <>
                    Sẵn sàng khởi tạo{' '}
                    <span className="google-one-chem-gradient-text">
                      phản ứng “LEARN NOT STUDY”
                    </span>{' '}
                    cùng BWAN CLUB?
                  </>
                ) : (
                  <>
                    Ready to spark{' '}
                    <span className="google-one-chem-gradient-text">
                      your “LEARN NOT STUDY” reaction
                    </span>{' '}
                    with BWAN CLUB?
                  </>
                )}
              </h2>
              <p className="mt-5 text-base sm:text-lg lg:text-xl text-[#4A4A68] dark:text-[#CBD5E1] max-w-2xl mx-auto leading-relaxed">
                {lang === 'vi'
                  ? 'Gia nhập cộng đồng yêu Hóa Học BWAN CLUB Gen 6 (Đoàn Trường THPT chuyên Lê Quý Đôn Đà Nẵng) để cùng thực hiện chuỗi Lab Tour, Workshop và BWAN CAMP 2027.'
                  : 'Join BWAN CLUB Gen 6 at Le Quy Don High School for the Gifted Da Nang for Lab Tours, Workshops, and BWAN CAMP 2027.'}
              </p>
              <div className="mt-9">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() =>
                    handleOpenJoinModal(
                      lang === 'vi' ? 'Ban Kỹ Thuật' : 'Technical Division'
                    )
                  }
                  className="inline-flex items-center justify-center gap-3 px-9 py-4 sm:px-11 sm:py-4.5 rounded-full google-one-chem-btn font-bold text-base sm:text-lg cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span>
                    {lang === 'vi'
                      ? 'Đăng ký thành viên BWAN CLUB Gen 6'
                      : 'Apply for BWAN CLUB Gen 6'}
                  </span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </section>

          {/* Human-Crafted Editorial Footer: Prominent Balanced Logo & Brand Lockup */}
          <footer className="py-14 sm:py-18 px-4 sm:px-6 lg:px-8 bg-transparent">
            <div className="max-w-7xl mx-auto">
              {/* TIER 1: OFFICIAL BWAN CLUB IDENTITY & CLEAN TYPOGRAPHIC NAVIGATION */}
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 pb-10 border-b border-[#E5E2DC]/80 dark:border-white/10">
                <div className="max-w-2xl space-y-3.5">
                  {/* Top Row: Balanced Club Logo + BWAN CLUB Wordmark */}
                  <div className="flex flex-wrap items-center gap-3.5">
                    <BwanHexLogo className="w-12 h-12 sm:w-14 sm:h-14 shrink-0" />
                    <span className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight leading-none text-[#1F1F2E] dark:text-white inline-flex items-center">
                      <span>BWAN</span>
                      <span className="ml-1.5 text-[#6C63FF] dark:text-[#8B84FF]">
                        CLUB
                      </span>
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#F1F0FF] dark:bg-[#1E1A3E] border border-[#DCD9F2] dark:border-[#6C63FF]/35 text-xs font-mono font-semibold text-[#6C63FF] dark:text-[#A39DFF]">
                      {lang === 'vi'
                        ? 'Thành lập 2021 · Thế hệ Gen 6 (2026–2027)'
                        : 'Est. 2021 · Generation 6 (2026–2027)'}
                    </span>
                  </div>

                  {/* Club Full Title & Slogan */}
                  <div className="space-y-1.5">
                    <p className="text-base sm:text-[17px] font-semibold text-[#1F1F2E] dark:text-[#F1F5F9] leading-relaxed">
                      {lang === 'vi'
                        ? 'Câu lạc bộ Hóa học trực thuộc Đoàn Trường THPT chuyên Lê Quý Đôn Đà Nẵng — Tinh thần “LEARN NOT STUDY”.'
                        : 'Official Chemistry Club of Le Quy Don High School for the Gifted, Da Nang — Driven by the “LEARN NOT STUDY” spirit.'}
                    </p>
                    <p className="text-sm text-[#5F6368] dark:text-[#94A3B8] leading-relaxed">
                      {lang === 'vi'
                        ? 'Sáng lập CLB (2021): '
                        : 'Club Co-Founder (2021): '}
                      <span className="font-semibold text-[#1F1F2E] dark:text-[#E2E8F0]">
                        Đỗ Vĩnh Phúc
                      </span>{' '}
                      <span aria-hidden="true" className="mx-1.5">
                        ·
                      </span>{' '}
                      {lang === 'vi'
                        ? 'Đồng Chủ Nhiệm Gen 6: '
                        : 'Gen 6 Co-Presidents: '}
                      <span className="font-semibold text-[#1F1F2E] dark:text-[#E2E8F0]">
                        Trần Minh Trí & Nguyễn Minh Anh
                      </span>
                    </p>
                  </div>
                </div>

                {/* Clean Human Editorial Navigation Links (Unified Quyên góp) */}
                <nav
                  aria-label={
                    lang === 'vi' ? 'Liên kết cuối trang' : 'Footer navigation'
                  }
                  className="flex flex-wrap items-center gap-x-7 gap-y-3 text-sm sm:text-base font-medium"
                >
                  {[
                    {
                      path: '/' as AppRoute,
                      label: lang === 'vi' ? 'Tổng quan' : 'Overview',
                    },
                    {
                      path: '/phan-ban' as AppRoute,
                      label: lang === 'vi' ? 'Phân ban' : 'Divisions',
                    },
                    {
                      path: '/du-an' as AppRoute,
                      label: lang === 'vi' ? 'Dự án' : 'Projects',
                    },
                    {
                      path: '/su-kien' as AppRoute,
                      label: lang === 'vi' ? 'Sự kiện' : 'Events',
                    },
                    {
                      path: '/donate' as AppRoute,
                      label: lang === 'vi' ? 'Quyên góp' : 'Donate',
                    },
                  ].map((item) => {
                    const isDonateItem = item.path === '/donate';
                    const isActive = isDonateItem
                      ? currentRoute === '/donate' ||
                        currentRoute === '/quyen-gop' ||
                        currentRoute === '/leaderboard' ||
                        currentRoute === '/bxh'
                      : currentRoute === item.path;
                    return (
                      <a
                        key={item.path}
                        href={item.path}
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavigate(item.path);
                        }}
                        className={`transition-colors cursor-pointer whitespace-nowrap underline-offset-8 hover:underline ${
                          isActive
                            ? 'font-bold text-[#6C63FF] dark:text-[#A39DFF] underline'
                            : 'text-[#4A4A68] dark:text-[#CBD5E1] hover:text-[#1F1F2E] dark:hover:text-white'
                        }`}
                      >
                        {item.label}
                      </a>
                    );
                  })}
                </nav>
              </div>

              {/* TIER 2: HUMAN-CRAFTED EDITORIAL CREDIT LINE FOR WEBSITE CREATORS */}
              <div
                data-testid="cofounders-credit"
                className="pt-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 text-xs sm:text-sm text-[#5F6368] dark:text-[#94A3B8]"
              >
                <p className="sm:whitespace-nowrap">
                  © 2026{' '}
                  <strong className="font-semibold text-[#1F1F2E] dark:text-white">
                    BWAN CLUB
                  </strong>{' '}
                  ·{' '}
                  {lang === 'vi'
                    ? 'Trường THPT chuyên Lê Quý Đôn Đà Nẵng.'
                    : 'Le Quy Don High School for the Gifted, Da Nang.'}
                </p>

                <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 sm:whitespace-nowrap">
                  <span>
                    {lang === 'vi'
                      ? 'Thiết kế & phát triển website:'
                      : 'Website design & development:'}
                  </span>
                  <span className="font-semibold text-[#1F1F2E] dark:text-white">
                    Mai Trần Anh Khoa
                  </span>
                  <span className="text-[#6C63FF] dark:text-[#A39DFF] font-medium">
                    (Founder)
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-[#9CA3AF] dark:text-white/30 px-0.5"
                  >
                    &
                  </span>
                  <span className="font-semibold text-[#1F1F2E] dark:text-white">
                    Phan Nhật Nam
                  </span>
                  <span className="text-[#6C63FF] dark:text-[#A39DFF] font-medium">
                    (Co-Founder)
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-[#9CA3AF] dark:text-white/30 px-0.5"
                  >
                    &
                  </span>
                  <span className="font-semibold text-[#1F1F2E] dark:text-white">
                    Trần Minh Trí
                  </span>
                  <span className="text-[#6C63FF] dark:text-[#A39DFF] font-medium">
                    (CMO)
                  </span>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </main>

      {/* Closed Recruitment Notification Modal */}
      <JoinClubModal
        isOpen={joinModalOpen}
        defaultDivision={selectedDivision}
        lang={lang}
        onClose={() => setJoinModalOpen(false)}
        onRegisterMember={handleRegisterMember}
        registeredMembers={members}
      />
    </div>
  );
}
