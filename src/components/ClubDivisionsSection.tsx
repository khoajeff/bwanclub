import React, { useState } from 'react';
import {
  CLUB_DEPARTMENTS,
  BWAN_GEN6_CO_PRESIDENTS,
  BWAN_GEN6_ORG_BRANCHES,
} from '../utils/chemistryEngine';
import { Check, ArrowRight, Network, Users, Crown, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppLanguage } from './Navbar';

interface ClubDivisionsSectionProps {
  onSelectDivision: (deptName: string) => void;
  lang: AppLanguage;
}

export const ClubDivisionsSection: React.FC<ClubDivisionsSectionProps> = ({
  onSelectDivision,
  lang,
}) => {
  const isEn = lang === 'en';
  const [orgViewMode, setOrgViewMode] = useState<
    'combined' | 'roles' | 'personnel'
  >('combined');

  return (
    <div className="space-y-0">
      {/* SECTION A: PIXEL-ALIGNED "CƠ CẤU NHÀ NƯỚC" BWAN CLUB GEN 6 ORG CHART */}
      <section
        id="co-cau-nha-nuoc-gen6"
        data-testid="gen6-org-chart-section"
        className="google-one-chem-section-wash py-16 sm:py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header & View Mode Switcher */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F1F0FF] dark:bg-[#6C63FF]/25 border border-[#6C63FF]/30 text-xs font-mono font-bold text-[#6C63FF] dark:text-[#A39DFF]">
                <Network className="w-3.5 h-3.5" />
                <span>
                  {isEn
                    ? 'BWAN CLUB GEN 6 EXECUTIVE BOARD ORG CHART'
                    : 'SƠ ĐỒ TỔ CHỨC BAN QUẢN LÝ BWAN CLUB GEN 6'}
                </span>
              </div>

              <h2 className="mt-3 font-display text-3xl sm:text-4xl font-extrabold text-[#1F1F2E] dark:text-white tracking-tight text-balance">
                {isEn ? 'GOVERNANCE STRUCTURE · ' : '“CƠ CẤU NHÀ NƯỚC” '}
                <span className="google-one-chem-gradient-text">
                  BWAN CLUB GEN 6
                </span>
              </h2>

              <p className="mt-2.5 text-sm sm:text-base text-[#4A4A68] dark:text-[#CBD5E1] leading-relaxed">
                {isEn ? (
                  <>
                    The Generation 6 (2026 – 2027) governance framework at Le
                    Quy Don High School for the Gifted, Da Nang comprises 2
                    Co-Presidents and 4 specialized divisions:{' '}
                    <strong>Technical Division</strong> (Communications, Media,
                    Design Sub-units), <strong>Content Division</strong>,{' '}
                    <strong>External Relations Division</strong>, and{' '}
                    <strong>Logistics Division</strong> (HR & Finance
                    Sub-units).
                  </>
                ) : (
                  <>
                    Hệ thống quản trị điều hành thế hệ Gen 6 (2026 – 2027) tại
                    Trường THPT chuyên Lê Quý Đôn Đà Nẵng gồm 2 Đồng Chủ Nhiệm
                    và 4 ban chuyên môn: <strong>Ban Kỹ Thuật</strong> (Tiểu
                    ban Truyền thông, Tiểu ban Media, Tiểu ban Design),{' '}
                    <strong>Ban Nội Dung</strong>,{' '}
                    <strong>Ban Đối Ngoại</strong> và{' '}
                    <strong>Ban Hậu Cần</strong> (Tiểu ban Nhân sự, Tiểu ban Tài
                    chính).
                  </>
                )}
              </p>
            </div>

            {/* Interactive Switcher */}
            <div
              role="group"
              aria-label={
                isEn
                  ? 'Gen 6 Org Chart view mode'
                  : 'Chế độ xem Sơ đồ Cơ cấu Nhà nước Gen 6'
              }
              className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-[#EAE7E0] dark:bg-[#191632] shrink-0"
            >
              {[
                {
                  id: 'combined',
                  label: isEn
                    ? 'Full (Divisions + Leads)'
                    : 'Đầy đủ (Ban + Nhân sự)',
                },
                {
                  id: 'roles',
                  label: isEn ? 'Division Structure' : 'Sơ đồ Phân ban',
                },
                {
                  id: 'personnel',
                  label: isEn ? 'Personnel Directory' : 'Sơ đồ Nhân sự',
                },
              ].map((tab) => {
                const isSelected = orgViewMode === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() =>
                      setOrgViewMode(tab.id as typeof orgViewMode)
                    }
                    className={`relative px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      isSelected
                        ? 'text-white'
                        : 'text-[#4A4A68] dark:text-[#CBD5E1] hover:text-[#1F1F2E] dark:hover:text-white'
                    }`}
                  >
                    {isSelected && (
                      <motion.span
                        layoutId="org-chart-mode-pill"
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

          <AnimatePresence mode="wait">
            <motion.div
              key={`org-tree-${orgViewMode}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mt-9 rounded-[32px] p-6 sm:p-10 bg-gradient-to-b from-[#2B266D] via-[#221E5B] to-[#1A1648] text-white border border-[#6C63FF]/45 shadow-xl relative overflow-hidden"
            >
              {/* Top Pill */}
              <div className="text-center mb-8">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-mono font-bold tracking-wider uppercase text-[#C4B5FD]">
                  <Crown className="w-3.5 h-3.5 text-[#FBBF24]" />
                  <span>
                    {isEn
                      ? 'OFFICIAL EXECUTIVE BOARD CHART · BWAN CLUB GEN 6 (2026 – 2027)'
                      : 'SƠ ĐỒ BAN QUẢN LÝ CHÍNH THỨC · BWAN CLUB GEN 6 (2026 – 2027)'}
                  </span>
                </span>
              </div>

              {/* LEVEL 1: 2 ĐỒNG CHỦ NHIỆM CONNECTED WITH T-JUNCTION */}
              <div className="max-w-3xl mx-auto">
                <div className="flex flex-col sm:flex-row items-stretch justify-center">
                  {/* Co-President 1 */}
                  <div className="flex-1 rounded-3xl bg-[#6C63FF] px-6 py-4 text-center border-2 border-white/30 shadow-lg flex flex-col justify-center">
                    <span className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#E0E7FF]">
                      {orgViewMode === 'roles'
                        ? isEn
                          ? 'Top Executive Tier'
                          : 'Cấp Điều Hành Cao Nhất'
                        : isEn
                        ? BWAN_GEN6_CO_PRESIDENTS[0].roleTitleEn
                        : 'Đồng Chủ Nhiệm Gen 6'}
                    </span>
                    <p className="mt-1 font-display text-lg sm:text-xl font-extrabold text-white">
                      {orgViewMode === 'roles'
                        ? isEn
                          ? 'Co-President'
                          : 'Đồng chủ nhiệm'
                        : BWAN_GEN6_CO_PRESIDENTS[0].name}
                    </p>
                    {orgViewMode === 'combined' && (
                      <span className="mt-1 inline-block text-xs font-medium text-[#E0E7FF]">
                        {isEn
                          ? BWAN_GEN6_CO_PRESIDENTS[0].concurrentRoleEn
                          : BWAN_GEN6_CO_PRESIDENTS[0].concurrentRole}
                      </span>
                    )}
                  </div>

                  {/* Seamless T-Junction Bridge between the 2 Co-Presidents */}
                  <div className="hidden sm:flex items-center justify-center relative w-12 shrink-0">
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#A5B4FC]" />
                    <div className="absolute left-1/2 -translate-x-1/2 top-1/2 bottom-0 w-[2px] bg-[#A5B4FC]" />
                    <div className="relative z-10 w-3 h-3 rounded-full bg-[#A5B4FC] border-2 border-[#221E5B]" />
                  </div>
                  <div className="sm:hidden mx-auto w-[2px] h-4 bg-[#A5B4FC]" />

                  {/* Co-President 2 */}
                  <div className="flex-1 rounded-3xl bg-[#6C63FF] px-6 py-4 text-center border-2 border-white/30 shadow-lg flex flex-col justify-center">
                    <span className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#E0E7FF]">
                      {orgViewMode === 'roles'
                        ? isEn
                          ? 'Top Executive Tier'
                          : 'Cấp Điều Hành Cao Nhất'
                        : isEn
                        ? BWAN_GEN6_CO_PRESIDENTS[1].roleTitleEn
                        : 'Đồng Chủ Nhiệm Gen 6'}
                    </span>
                    <p className="mt-1 font-display text-lg sm:text-xl font-extrabold text-white">
                      {orgViewMode === 'roles'
                        ? isEn
                          ? 'Co-President'
                          : 'Đồng chủ nhiệm'
                        : BWAN_GEN6_CO_PRESIDENTS[1].name}
                    </p>
                    {orgViewMode === 'combined' && (
                      <span className="mt-1 inline-block text-xs font-medium text-[#E0E7FF]">
                        {isEn
                          ? BWAN_GEN6_CO_PRESIDENTS[1].concurrentRoleEn
                          : BWAN_GEN6_CO_PRESIDENTS[1].concurrentRole}
                      </span>
                    )}
                  </div>
                </div>

                {/* Vertical stem continuing down to main 4-branch bus */}
                <div className="flex justify-center">
                  <div className="w-[2px] h-7 bg-[#A5B4FC]" />
                </div>
              </div>

              {/* MAIN 4-BRANCH BUS BAR */}
              <div className="relative">
                <div className="hidden lg:block absolute top-0 left-[12.5%] right-[12.5%] h-[2px] bg-[#A5B4FC]" />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0">
                  {BWAN_GEN6_ORG_BRANCHES.map((branch) => {
                    const subCount = branch.subUnits.length;
                    const deptDisplayName = isEn
                      ? branch.departmentNameEn
                      : branch.departmentName;
                    const headRoleDisplay = isEn
                      ? branch.headRoleLabelEn
                      : branch.headRoleLabel;

                    return (
                      <div
                        key={branch.id}
                        className="lg:px-2.5 flex flex-col items-center"
                      >
                        <div className="hidden lg:block w-[2px] h-6 bg-[#A5B4FC]" />

                        {/* LEVEL 2: BAN BOX */}
                        <div className="w-full rounded-3xl bg-[#5B54E8] px-4 py-4 text-center border-2 border-white/25 shadow-md">
                          <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#C4B5FD]">
                            {branch.elementBadge}
                          </span>
                          <h3 className="mt-0.5 font-display text-base sm:text-lg font-extrabold text-white">
                            {orgViewMode === 'personnel' &&
                            (branch.id === 'branch-ky-thuat' ||
                              branch.id === 'branch-doi-ngoai')
                              ? branch.headName
                              : deptDisplayName}
                          </h3>
                          <p className="mt-1 text-xs font-semibold text-[#E0E7FF]">
                            {orgViewMode === 'roles'
                              ? headRoleDisplay
                              : branch.id === 'branch-ky-thuat' ||
                                branch.id === 'branch-doi-ngoai'
                              ? isEn
                                ? `Head: ${branch.headName}`
                                : `Trưởng ban: ${branch.headName}`
                              : headRoleDisplay}
                          </p>
                        </div>

                        {/* Connector from Level 2 Ban box to Level 3 Sub-units */}
                        <div className="w-[2px] h-5 bg-[#A5B4FC]/85" />

                        {/* LEVEL 3 SUB-UNITS WITH EXACT BRACKET LINES */}
                        <div className="w-full relative">
                          {subCount === 2 && (
                            <div className="hidden sm:block absolute top-0 left-[25%] right-[25%] h-[2px] bg-[#A5B4FC]/85" />
                          )}
                          {subCount === 3 && (
                            <div className="hidden sm:block absolute top-0 left-[16.666%] right-[16.666%] h-[2px] bg-[#A5B4FC]/85" />
                          )}

                          <div
                            className={`grid gap-2 sm:gap-0 ${
                              subCount === 3
                                ? 'grid-cols-1 sm:grid-cols-3'
                                : subCount === 2
                                ? 'grid-cols-1 sm:grid-cols-2'
                                : 'grid-cols-1'
                            }`}
                          >
                            {branch.subUnits.map((sub) => {
                              const subUnitDisplay = isEn
                                ? sub.unitNameEn
                                : sub.unitName;
                              const subRoleDisplay = isEn
                                ? sub.roleLabelEn
                                : sub.roleLabel;
                              return (
                                <div
                                  key={sub.id}
                                  className="sm:px-1 flex flex-col items-center"
                                >
                                  {subCount > 1 && (
                                    <div className="hidden sm:block w-[2px] h-4 bg-[#A5B4FC]/85" />
                                  )}
                                  <div className="w-full h-full rounded-2xl bg-white/14 hover:bg-white/20 transition-colors px-2.5 py-3 text-center border border-white/25 flex flex-col justify-center min-h-[82px]">
                                    {orgViewMode === 'roles' ? (
                                      <>
                                        <span className="font-display text-xs sm:text-[13px] font-extrabold text-white leading-snug">
                                          {subUnitDisplay}
                                        </span>
                                        <span className="text-[10px] text-[#CBD5E1] mt-1">
                                          {subRoleDisplay}
                                        </span>
                                      </>
                                    ) : orgViewMode === 'personnel' ? (
                                      <>
                                        <span className="font-display text-xs sm:text-[13px] font-extrabold text-white leading-snug">
                                          {sub.leadName}
                                        </span>
                                        <span className="text-[10px] text-[#A5F3FC] mt-1 font-mono font-semibold">
                                          {subUnitDisplay}
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <span className="text-[10px] font-mono font-bold text-[#A5F3FC] uppercase leading-tight">
                                          {subUnitDisplay}
                                        </span>
                                        <span className="mt-1 font-display text-xs sm:text-[13px] font-extrabold text-white leading-snug">
                                          {sub.leadName}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Summary Footer inside Org Chart */}
              <div className="mt-8 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4 text-xs text-[#E2E8F0]">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#A5F3FC]" />
                  <span>
                    {isEn ? (
                      <>
                        Official BWAN CLUB Gen 6 Structure:{' '}
                        <strong>2 Co-Presidents</strong> ·{' '}
                        <strong>Logistics Division</strong> (HR, Finance) ·{' '}
                        <strong>Content Division</strong> ·{' '}
                        <strong>Technical Division</strong> (PR, Media, Design) ·{' '}
                        <strong>External Relations Division</strong>
                      </>
                    ) : (
                      <>
                        Cơ cấu chuẩn BWAN CLUB Gen 6:{' '}
                        <strong>2 Đồng Chủ Nhiệm</strong> ·{' '}
                        <strong>Ban Hậu Cần</strong> (Nhân sự, Tài chính) ·{' '}
                        <strong>Ban Nội Dung</strong> ·{' '}
                        <strong>Ban Kỹ Thuật</strong> (Truyền thông, Media,
                        Design) · <strong>Ban Đối Ngoại</strong>
                      </>
                    )}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* SECTION B: ALL 4 FULL DIVISIONS OF BWAN CLUB GEN 6 */}
      <section
        id="ve-clb"
        data-testid="four-divisions-section"
        className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#0D0C1D] transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto">
          {/* Centered Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-3xl mx-auto"
          >
            <p className="text-xs font-mono font-semibold text-[#6C63FF] dark:text-[#A39DFF] tracking-wide">
              {lang === 'vi'
                ? 'HỆ THỐNG 4 BAN & CÁC TIỂU BAN CHUYÊN TRÁCH GEN 6'
                : '4 CORE DIVISIONS & SUB-COMMITTEES OF GEN 6'}
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-[#1F1F2E] dark:text-white tracking-tight text-balance">
              {lang === 'vi'
                ? '4 Phân Ban Chính Thức Của BWAN CLUB'
                : 'The 4 Official Divisions of BWAN CLUB'}
            </h2>
            <p className="mt-3 text-base text-[#4A4A68] dark:text-[#CBD5E1]">
              {lang === 'vi'
                ? 'Ban Hậu Cần (Tiểu ban Nhân sự & Tiểu ban Tài chính) · Ban Nội Dung · Ban Kỹ Thuật (Tiểu ban Truyền thông, Tiểu ban Media & Tiểu ban Design) · Ban Đối Ngoại.'
                : 'Logistics (HR & Finance), Content, Technical (Communications, Media & Design), and External Relations.'}
            </p>
          </motion.div>

          {/* Region / Semester Marker */}
          <div className="mt-6 flex justify-end items-center gap-2 text-xs text-[#5F6368] dark:text-[#94A3B8]">
            <span
              aria-hidden="true"
              className="inline-flex items-center justify-center w-5 h-3.5 bg-[#DA251D] rounded-[2px] text-[#FFFF00] text-[9px] font-bold leading-none"
            >
              ★
            </span>
            <span>
              {isEn
                ? 'Le Quy Don High School for the Gifted, Da Nang · BWAN CLUB Gen 6 (2026–2027)'
                : 'THPT Chuyên Lê Quý Đôn Đà Nẵng · BWAN CLUB Gen 6 (2026–2027)'}
            </span>
          </div>

          {/* 4 Full Division Cards in a Clean 2x2 Grid */}
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {CLUB_DEPARTMENTS.map((dept, index) => {
              const displayName = isEn ? dept.nameEn : dept.name;
              const displaySubs = isEn
                ? dept.subDivisionsListEn
                : dept.subDivisionsList;
              const displayLeadSummary = isEn
                ? dept.leadSummaryEn
                : dept.leadSummary;
              const displayRoleDesc = isEn
                ? dept.roleDescriptionEn
                : dept.roleDescription;
              const displayActivities = isEn
                ? dept.keyActivitiesEn
                : dept.keyActivities;

              return (
                <motion.article
                  key={dept.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.45,
                    delay: index * 0.06,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{ y: -5 }}
                  className="google-one-tonal-card rounded-[28px] p-7 sm:p-8 flex flex-col justify-between"
                >
                  <div>
                    {/* Top Element Callout & Domain Label */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                      <span className="inline-block bg-[#1F1F2E] dark:bg-[#6C63FF]/30 text-white text-xs font-semibold px-3.5 py-1 rounded-full">
                        {lang === 'vi' ? 'Nguyên tố đại diện' : 'Element'}:{' '}
                        {dept.elementSymbol} · {dept.atomicNumber}
                      </span>

                      <span className="text-[11px] font-bold text-[#5F6368] dark:text-[#94A3B8]">
                        BWAN CLUB · Gen 6
                      </span>
                    </div>

                    {/* Department Title */}
                    <h3
                      className={`font-display text-2xl sm:text-[26px] font-extrabold leading-snug ${
                        index === 0
                          ? 'text-[#0D9488] dark:text-[#34D399]'
                          : index === 1
                          ? 'text-[#0284C7] dark:text-[#38BDF8]'
                          : index === 2
                          ? 'text-[#6C63FF] dark:text-[#A39DFF]'
                          : 'text-[#D97706] dark:text-[#FBBF24]'
                      }`}
                    >
                      {displayName}
                    </h3>

                    {/* Explicit Sub-Committees Badges */}
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-[#4A4A68] dark:text-[#CBD5E1]">
                        <Layers className="w-3.5 h-3.5 text-[#6C63FF] dark:text-[#A39DFF]" />
                        <span>
                          {isEn ? 'Division structure:' : 'Cấu trúc ban:'}
                        </span>
                      </span>
                      {displaySubs.map((subName) => (
                        <span
                          key={subName}
                          className="google-one-subcard-pill px-3 py-1 rounded-full text-xs font-display font-bold text-[#1F1F2E] dark:text-white"
                        >
                          {subName}
                        </span>
                      ))}
                    </div>

                    {/* Leads Summary Box */}
                    <div className="mt-4">
                      <p className="google-one-subcard text-xs font-semibold text-[#1F1F2E] dark:text-white px-3.5 py-2.5 rounded-xl">
                        {displayLeadSummary}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="mt-4 text-sm text-[#4A4A68] dark:text-[#CBD5E1] leading-relaxed">
                      {displayRoleDesc}
                    </p>
                  </div>

                  {/* Bottom Feature Checklist + Apply Button */}
                  <div className="mt-6 pt-5 border-t border-[#DFDBD2] dark:border-[#6C63FF]/20 space-y-4">
                    <div className="space-y-2.5">
                      {displayActivities.map((act, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 text-xs sm:text-sm text-[#3C4043] dark:text-[#E2E8F0]"
                        >
                          <Check className="w-4 h-4 text-[#6C63FF] dark:text-[#A39DFF] shrink-0 mt-0.5" />
                          <span>{act}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => onSelectDivision(displayName)}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full google-one-chem-btn text-sm font-semibold cursor-pointer whitespace-nowrap shrink-0"
                      >
                        <span>
                          {lang === 'vi'
                            ? 'Ứng tuyển phân ban'
                            : 'Apply for Division'}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
