import React, { useState } from 'react';
import { Menu, X, Sun, Moon, Globe, HeartHandshake } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BwanHexLogo } from './BwanHexLogo';

export type AppLanguage = 'vi' | 'en';
export type AppRoute =
  | '/'
  | '/phan-ban'
  | '/du-an'
  | '/su-kien'
  | '/donate'
  | '/quyen-gop'
  | '/leaderboard'
  | '/bxh';

interface NavbarProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  onOpenJoinModal: (defaultDept?: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  lang: AppLanguage;
  onToggleLang: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onNavigate,
  onOpenJoinModal,
  isDark,
  onToggleTheme,
  lang,
  onToggleLang,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const labels = {
    overview: lang === 'vi' ? 'Tổng quan' : 'Overview',
    divisions: lang === 'vi' ? 'Phân ban' : 'Divisions',
    projects: lang === 'vi' ? 'Dự án' : 'Projects',
    events: lang === 'vi' ? 'Sự kiện' : 'Events',
    donate: lang === 'vi' ? 'Quyên góp' : 'Donate',
    themeLabel:
      lang === 'vi'
        ? isDark
          ? 'Sáng'
          : 'Tối'
        : isDark
        ? 'Light'
        : 'Dark',
    langLabel: lang === 'vi' ? 'VI' : 'EN',
    register: lang === 'vi' ? 'Đăng ký' : 'Join Club',
  };

  const navItems: {
    path: AppRoute;
    label: string;
    isDonate?: boolean;
    scrollTargetId?: string;
  }[] = [
    { path: '/', label: labels.overview },
    { path: '/phan-ban', label: labels.divisions },
    { path: '/du-an', label: labels.projects },
    { path: '/su-kien', label: labels.events },
    {
      path: '/donate',
      label: labels.donate,
      isDonate: true,
      scrollTargetId: 'quyen-gop',
    },
  ];

  const isDonateRouteActive =
    currentRoute === '/donate' ||
    currentRoute === '/quyen-gop' ||
    currentRoute === '/leaderboard' ||
    currentRoute === '/bxh';

  const handleLinkClick = (
    e: React.MouseEvent,
    route: AppRoute,
    scrollTargetId?: string
  ) => {
    e.preventDefault();
    const isSameRoute = currentRoute === route;
    if (window.location.pathname !== route) {
      window.history.pushState({}, '', route);
    }
    onNavigate(route);
    setMobileMenuOpen(false);

    if (isSameRoute && scrollTargetId) {
      const targetEl = document.getElementById(scrollTargetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#0D0C1D]/90 backdrop-blur-xl border-b border-[#E5E7EB]/60 dark:border-[#6C63FF]/20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex items-stretch justify-between gap-6 px-4 sm:px-6 lg:px-8 h-16">
        {/* Zone 1: Transparent Hexagonal Club Logo + Balanced Google One Style BWAN CLUB Wordmark */}
        <a
          href="/"
          onClick={(e) => handleLinkClick(e, '/')}
          className="group inline-flex items-center gap-2.5 sm:gap-3 pt-2 pb-1 font-bold tracking-tight text-[#1F1F2E] dark:text-white whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#6C63FF] rounded-lg"
        >
          <motion.div
            whileHover={{ rotate: 10, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 380, damping: 22 }}
            className="flex items-center justify-center"
          >
            <BwanHexLogo className="w-10 h-10 sm:w-11 sm:h-11" />
          </motion.div>
          <span className="font-display text-xl sm:text-[22px] font-extrabold tracking-tight leading-none text-[#1F1F2E] dark:text-white inline-flex items-center">
            <span>BWAN</span>
            <span className="ml-1.5 text-[#6C63FF] dark:text-[#8B84FF]">
              CLUB
            </span>
          </span>
        </a>

        {/* Zone 2: Uniform Google One Navigation Links + Theme & Language items */}
        <nav
          aria-label="Điều hướng chính"
          className="hidden lg:flex items-stretch gap-3 xl:gap-4 text-base sm:text-[17px] font-bold text-[#4A4A68] dark:text-[#CBD5E1]"
        >
          {navItems.map((item) => {
            const isActive = item.isDonate
              ? isDonateRouteActive
              : currentRoute === item.path;
            return (
              <a
                key={item.path}
                href={item.path}
                data-testid={`nav-route-${item.path.replace(/\//g, '-')}`}
                onClick={(e) =>
                  handleLinkClick(e, item.path, item.scrollTargetId)
                }
                aria-current={isActive ? 'page' : undefined}
                className={`relative px-3.5 pt-3.5 pb-1.5 transition-colors whitespace-nowrap shrink-0 inline-flex items-center gap-2 ${
                  isActive
                    ? 'text-[#6C63FF] dark:text-[#A39DFF] font-extrabold'
                    : 'text-[#4A4A68] dark:text-[#CBD5E1] hover:text-[#1F1F2E] dark:hover:text-white'
                }`}
              >
                {item.isDonate && <HeartHandshake className="w-[18px] h-[18px]" />}
                <span>{item.label}</span>
                {isActive && (
                  <motion.span
                    layoutId="navbar-active-indicator"
                    className="absolute bottom-0 left-2 right-2 h-[3px] rounded-t-full bg-gradient-to-r from-[#6C63FF] to-[#38BDF8]"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  />
                )}
              </a>
            );
          })}

          <div className="flex items-center pt-2 pb-1 gap-2">
            <div className="h-4 w-[1px] bg-[#E5E7EB] dark:bg-[#6C63FF]/25 mx-1.5" />

            {/* Light / Dark Mode Switch */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              onClick={onToggleTheme}
              aria-label={
                isDark
                  ? 'Chuyển sang giao diện Sáng'
                  : 'Chuyển sang giao diện Tối'
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F4F2EE] dark:bg-[#191632] text-[#1F1F2E] dark:text-white hover:text-[#6C63FF] dark:hover:text-[#A39DFF] border border-transparent hover:border-[#6C63FF]/30 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <motion.span
                key={isDark ? 'sun' : 'moon'}
                initial={{ rotate: -45, opacity: 0, scale: 0.7 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {isDark ? (
                  <Sun className="w-4 h-4 text-[#F59E0B]" />
                ) : (
                  <Moon className="w-4 h-4 text-[#6C63FF]" />
                )}
              </motion.span>
              <span className="text-xs font-semibold">{labels.themeLabel}</span>
            </motion.button>

            {/* Language Selector (VI / EN) */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              onClick={onToggleLang}
              aria-label="Chuyển đổi ngôn ngữ Tiếng Việt hoặc Tiếng Anh"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F4F2EE] dark:bg-[#191632] text-[#1F1F2E] dark:text-white hover:text-[#6C63FF] dark:hover:text-[#A39DFF] border border-transparent hover:border-[#6C63FF]/30 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Globe className="w-3.5 h-3.5 text-[#6C63FF] dark:text-[#A39DFF]" />
              <span className="text-xs font-semibold">{labels.langLabel}</span>
            </motion.button>
          </div>
        </nav>

        {/* Zone 3: Capsule actions */}
        <div className="flex items-center pt-2 pb-1 gap-2.5 shrink-0">
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onOpenJoinModal('BWAN CLUB Gen 6')}
            className="px-5 py-2 text-sm font-semibold google-one-chem-btn rounded-full whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6C63FF]"
          >
            {labels.register}
          </motion.button>

          <button
            type="button"
            aria-label={
              mobileMenuOpen ? 'Đóng menu điều hướng' : 'Mở menu điều hướng'
            }
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden p-2 rounded-lg text-[#5F6368] dark:text-[#CBD5E1] hover:text-[#1F1F2E] dark:hover:text-white hover:bg-[#F3F4F6] dark:hover:bg-[#191632] transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Điều hướng di động"
            className="lg:hidden overflow-hidden bg-white dark:bg-[#121026] border-b border-[#E5E7EB] dark:border-[#6C63FF]/30 px-4 pt-2 pb-4 space-y-1"
          >
            {navItems.map((item) => {
              const isActive = item.isDonate
                ? isDonateRouteActive
                : currentRoute === item.path;
              return (
                <a
                  key={item.path}
                  href={item.path}
                  onClick={(e) =>
                    handleLinkClick(e, item.path, item.scrollTargetId)
                  }
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-colors ${
                    isActive
                      ? 'font-bold text-[#6C63FF] dark:text-[#A39DFF] bg-[#F1F0FF] dark:bg-[#6C63FF]/20'
                      : 'font-medium text-[#4A4A68] dark:text-[#CBD5E1] hover:bg-[#F3F4F6] dark:hover:bg-[#191632]'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="text-xs font-mono text-[#6C63FF] dark:text-[#A39DFF]">
                      ●
                    </span>
                  )}
                </a>
              );
            })}

            <div className="pt-2 mt-2 border-t border-[#E5E7EB] dark:border-[#6C63FF]/20 flex items-center gap-3 px-2">
              <button
                type="button"
                onClick={onToggleTheme}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#F4F2EE] dark:bg-[#191632] text-xs font-semibold text-[#1F1F2E] dark:text-white cursor-pointer"
              >
                {isDark ? (
                  <Sun className="w-4 h-4 text-[#F59E0B]" />
                ) : (
                  <Moon className="w-4 h-4 text-[#6C63FF]" />
                )}
                <span>{labels.themeLabel}</span>
              </button>

              <button
                type="button"
                onClick={onToggleLang}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#F4F2EE] dark:bg-[#191632] text-xs font-semibold text-[#1F1F2E] dark:text-white cursor-pointer"
              >
                <Globe className="w-4 h-4 text-[#6C63FF]" />
                <span>{labels.langLabel}</span>
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};
