import React, { useState } from 'react';
import {
  ClubProjectItem,
  ClubEventItem,
  BWAN_GEN6_ROADMAP,
  parseAndSyncClubProject,
} from '../utils/chemistryEngine';
import {
  Calendar,
  MapPin,
  Sparkles,
  UploadCloud,
  CheckCircle,
  FolderGit2,
  ArrowUpRight,
  Clock,
  FlaskConical,
  Tent,
  Users,
  Globe,
  Wallet,
  Box,
  Link2,
  Check,
  Maximize2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppLanguage } from './Navbar';

interface CategorySyncHubSectionProps {
  projects: ClubProjectItem[];
  events: ClubEventItem[];
  onAddProject: (newProj: ClubProjectItem) => void;
  onOpenJoinModal: (defaultTopic?: string) => void;
  onOpenProjectExperience?: (slug: string) => void;
  lang: AppLanguage;
  sectionMode?: 'projects' | 'events' | 'all';
}

const SAMPLE_SYNC_JSON = JSON.stringify(
  {
    title: 'Triển Lãm Nhiếp Ảnh Vi Tinh Thể Hóa Học (Micro-Crystal Art)',
    category: 'su-kien',
    code: 'BWAN-EVT-05',
    semester: 'Gen 6 · 2026–2027',
    highlightMetric: '30 tác phẩm kính hiển vi phân cực',
    chemicalTheme: 'AgNO₃ + Cu → Tinh thể Bạc nhánh dương xỉ',
    summary:
      'Ghi lại quá trình hình thành mạng tinh thể kim loại và muối vô cơ dưới kính hiển vi quang học độ phóng đại 400x do chính thành viên BWAN CLUB thực hiện.',
  },
  null,
  2
);

export const CategorySyncHubSection: React.FC<CategorySyncHubSectionProps> = ({
  projects,
  events,
  onAddProject,
  onOpenJoinModal,
  onOpenProjectExperience,
  lang,
  sectionMode = 'all',
}) => {
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'du-an' | 'su-kien' | 'nghien-cuu' | 'ung-dung'
  >('all');
  const [roadmapPhase, setRoadmapPhase] = useState<
    'all' | 'hk1-2026' | 'xuan-2027' | 'hk2-2027' | 'he-camp-2027'
  >('all');

  const [customTitle, setCustomTitle] = useState('');
  const [customCategory, setCustomCategory] = useState<
    'du-an' | 'su-kien' | 'nghien-cuu' | 'ung-dung'
  >('du-an');
  const [payloadText, setPayloadText] = useState('');
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncSuccess, setSyncSuccess] = useState<string | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const handleCopyProjectLink = (slug: string, customPath?: string) => {
    const relativePath = customPath || `/du-an/${slug}`;
    const fullUrl = `${window.location.origin}${relativePath}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(fullUrl).catch(() => {});
    }
    setCopiedSlug(slug);
    window.setTimeout(() => {
      setCopiedSlug((prev) => (prev === slug ? null : prev));
    }, 2200);
  };

  const filteredProjects =
    activeFilter === 'all'
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  const filteredRoadmap =
    roadmapPhase === 'all'
      ? BWAN_GEN6_ROADMAP
      : BWAN_GEN6_ROADMAP.filter((m) => m.phase === roadmapPhase);

  const handleSyncSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSyncError(null);
    setSyncSuccess(null);

    const validation = parseAndSyncClubProject(
      payloadText,
      customTitle,
      customCategory
    );
    if (!validation.valid || !validation.item) {
      setSyncError(validation.error || 'Dữ liệu danh mục không hợp lệ.');
      return;
    }

    onAddProject(validation.item);
    setCustomTitle('');
    setPayloadText('');
    setSyncSuccess(
      `Đã đồng bộ danh mục "${validation.item.title}" vào hệ thống BWAN CLUB!`
    );
  };

  const showProjects = sectionMode === 'projects' || sectionMode === 'all';
  const showEvents = sectionMode === 'events' || sectionMode === 'all';

  const getRoadmapItemBadge = (
    type: 'meeting' | 'online' | 'lab' | 'fund' | 'event' | 'camp'
  ) => {
    switch (type) {
      case 'lab':
        return {
          icon: <FlaskConical className="w-3.5 h-3.5 text-[#0284C7] dark:text-[#38BDF8]" />,
          tag: 'Lab & Workshop',
          color: 'text-[#0284C7] dark:text-[#38BDF8] bg-[#E0F2FE] dark:bg-[#0284C7]/25',
        };
      case 'camp':
        return {
          icon: <Tent className="w-3.5 h-3.5 text-[#D97706] dark:text-[#FBBF24]" />,
          tag: 'BWAN CAMP',
          color: 'text-[#D97706] dark:text-[#FBBF24] bg-[#FEF3C7] dark:bg-[#D97706]/25',
        };
      case 'online':
        return {
          icon: <Globe className="w-3.5 h-3.5 text-[#6C63FF] dark:text-[#A39DFF]" />,
          tag: 'Online & Media',
          color: 'text-[#6C63FF] dark:text-[#A39DFF] bg-[#F1F0FF] dark:bg-[#6C63FF]/25',
        };
      case 'fund':
        return {
          icon: <Wallet className="w-3.5 h-3.5 text-[#0D9488] dark:text-[#34D399]" />,
          tag: 'Quỹ CLB',
          color: 'text-[#0D9488] dark:text-[#34D399] bg-[#CCFBF1] dark:bg-[#0D9488]/25',
        };
      case 'meeting':
        return {
          icon: <Users className="w-3.5 h-3.5 text-[#7C3AED] dark:text-[#C4B5FD]" />,
          tag: 'Nội bộ & Training',
          color: 'text-[#7C3AED] dark:text-[#C4B5FD] bg-[#EDE9FE] dark:bg-[#7C3AED]/25',
        };
      default:
        return {
          icon: <Sparkles className="w-3.5 h-3.5 text-[#E11D48] dark:text-[#FB7185]" />,
          tag: 'Chiến dịch & Sự kiện',
          color: 'text-[#E11D48] dark:text-[#FB7185] bg-[#FFE4E6] dark:bg-[#E11D48]/25',
        };
    }
  };

  return (
    <>
      {/* SECTION: PROJECTS SHOWCASE */}
      {showProjects && (
        <>
          <section
            id="du-an"
            className="google-one-chem-section-wash py-16 sm:py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300"
          >
            <div className="max-w-7xl mx-auto">
              {/* Header & Filter Bar */}
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="max-w-3xl">
                  <p className="text-xs font-bold text-[#6C63FF] dark:text-[#A39DFF] uppercase tracking-wider">
                    {lang === 'vi'
                      ? 'DỰ ÁN & KHÔNG GIAN TRẢI NGHIỆM DÀNH CHO NGƯỜI THAM GIA'
                      : 'INTERACTIVE PROJECTS FOR PARTICIPANTS · BWAN CLUB GEN 6'}
                  </p>
                  <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-[#1F1F2E] dark:text-white tracking-tight text-balance">
                    {lang === 'vi'
                      ? 'Trải Nghiệm Trực Tiếp '
                      : 'Interactive Experience: '}
                    <span className="google-one-chem-gradient-text">
                      {lang === 'vi'
                        ? 'Các Dự Án Của BWAN CLUB'
                        : 'BWAN CLUB Projects'}
                    </span>
                  </h2>
                  <p className="mt-3 text-base text-[#4A4A68] dark:text-[#CBD5E1] leading-relaxed">
                    {lang === 'vi'
                      ? 'Mỗi dự án là một không gian tương tác dành riêng cho người tham gia trải nghiệm. Hãy bấm vào nút trên từng dự án hoặc truy cập đường link riêng để khám phá ngay!'
                      : 'Each project is an interactive experience built for participants. Click any project button below or open its dedicated link.'}
                  </p>
                </div>

                {/* Interactive Category Filter Buttons */}
                <div
                  role="group"
                  aria-label="Lọc dự án theo danh mục"
                  className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#EAE7E0] dark:bg-[#191632] rounded-2xl shrink-0"
                >
                  {[
                    { id: 'all', label: lang === 'vi' ? 'Tất cả' : 'All' },
                    {
                      id: 'ung-dung',
                      label: lang === 'vi' ? 'Ứng dụng số' : 'Digital App',
                    },
                    {
                      id: 'du-an',
                      label: lang === 'vi' ? 'Thực nghiệm' : 'Lab Project',
                    },
                    {
                      id: 'nghien-cuu',
                      label: lang === 'vi' ? 'Nghiên cứu' : 'Research',
                    },
                    {
                      id: 'su-kien',
                      label: lang === 'vi' ? 'Chiến dịch lớn' : 'Campaign',
                    },
                  ].map((tab) => {
                    const isSelected = activeFilter === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() =>
                          setActiveFilter(tab.id as typeof activeFilter)
                        }
                        className={`relative px-4 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                          isSelected
                            ? 'text-white'
                            : 'text-[#4A4A68] dark:text-[#CBD5E1] hover:text-[#1F1F2E] dark:hover:text-white hover:bg-white/60 dark:hover:bg-[#231F44]'
                        }`}
                      >
                        {isSelected && (
                          <motion.span
                            layoutId="project-filter-pill"
                            className="absolute inset-0 rounded-xl bg-[#6C63FF] shadow-xs"
                            transition={{
                              type: 'spring',
                              stiffness: 380,
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

              {/* NEW PROJECT SPOTLIGHT: BWAN 3D ORGANIC MOLECULAR STUDIO */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                data-testid="spotlight-3d-molecular-studio"
                className="mt-10 google-one-tonal-card rounded-[32px] p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-semibold">
                    <span className="px-3 py-1 rounded-full bg-[#6C63FF]/15 dark:bg-[#6C63FF]/25 text-[#6C63FF] dark:text-[#A39DFF] border border-[#6C63FF]/30">
                      ★ DỰ ÁN MỚI RA MẮT · 3D LAB WORKBENCH
                    </span>
                    <span className="text-[#0284C7] dark:text-[#38BDF8]">
                      Three.js r128 · 60 FPS
                    </span>
                    <span aria-hidden="true" className="text-[#9CA3AF]">
                      ·
                    </span>
                    <span className="text-[#0D9488] dark:text-[#34D399]">
                      ● LINK RIÊNG TRỰC TUYẾN
                    </span>
                  </div>

                  <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1F1F2E] dark:text-white leading-tight text-balance">
                    BWAN 3D Organic Molecular Studio —{' '}
                    <span className="google-one-chem-gradient-text">
                      {lang === 'vi'
                        ? 'Phòng Thí Nghiệm Phân Tử Hữu Cơ 3D'
                        : 'Interactive 3D Organic Molecular Lab'}
                    </span>
                  </h3>

                  <p className="text-sm sm:text-base text-[#4A4A68] dark:text-[#CBD5E1] leading-relaxed">
                    Khám phá không gian mô phỏng cấu trúc phân tử 3D tương tác
                    thời gian thực của{' '}
                    <strong className="text-[#1F1F2E] dark:text-white">
                      BWAN CLUB
                    </strong>
                    : xoay tự do 360° Quaternion không khóa trục, tích hợp 25+
                    hợp chất hữu cơ &amp; đại phân tử sinh học (Chlorophyll a/b,
                    Heme B, Benzene, Glycine...), tìm kiếm trực tuyến qua{' '}
                    <strong className="text-[#0284C7] dark:text-[#38BDF8]">
                      PubChem 3D, NIH Cactus, RCSB PDB &amp; ChEMBL
                    </strong>
                    , đo lai hóa sp/sp²/sp³, độ dài (Å) và góc liên kết (°).
                  </p>

                  {/* Dedicated Project URL Bar */}
                  <div className="google-one-subcard p-3.5 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-[#6C63FF]/15 dark:bg-[#6C63FF]/25 flex items-center justify-center text-[#6C63FF] dark:text-[#A39DFF] shrink-0">
                        <Link2 className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="block text-[11px] font-mono font-bold text-[#6C63FF] dark:text-[#A39DFF] uppercase">
                          Link Liên Kết Riêng Của Dự Án
                        </span>
                        <code className="block text-xs sm:text-sm font-mono font-bold text-[#1F1F2E] dark:text-white truncate">
                          /du-an/3d-molecular-studio · /3d-molecular-studio.html
                        </code>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        data-testid="copy-link-3d-studio-btn"
                        onClick={() =>
                          handleCopyProjectLink('3d-molecular-studio')
                        }
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#191736] hover:bg-[#F1F0FF] dark:hover:bg-[#2A2656] border border-[#D5D0EA] dark:border-[#6C63FF]/35 text-xs font-semibold text-[#1F1F2E] dark:text-white transition-colors cursor-pointer"
                      >
                        {copiedSlug === '3d-molecular-studio' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#0D9488] dark:text-[#34D399]" />
                            <span className="text-[#0D9488] dark:text-[#34D399]">
                              Đã sao chép link!
                            </span>
                          </>
                        ) : (
                          <>
                            <Link2 className="w-3.5 h-3.5 text-[#6C63FF] dark:text-[#A39DFF]" />
                            <span>Sao chép link</span>
                          </>
                        )}
                      </button>

                      <a
                        href="/3d-molecular-studio.html"
                        data-testid="standalone-link-3d-studio"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0284C7]/15 dark:bg-[#38BDF8]/20 hover:bg-[#0284C7]/25 border border-[#0284C7]/35 text-xs font-semibold text-[#0284C7] dark:text-[#38BDF8] transition-colors whitespace-nowrap"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>Mở Toàn Màn Hình</span>
                      </a>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <motion.button
                      type="button"
                      data-testid="open-3d-molecular-studio-btn"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() =>
                        onOpenProjectExperience?.('3d-molecular-studio')
                      }
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full google-one-chem-btn text-sm font-semibold text-white cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <Box className="w-4 h-4" />
                      <span>
                        {lang === 'vi'
                          ? 'Mở Phòng Thí Nghiệm 3D Ngay'
                          : 'Launch 3D Molecular Studio'}
                      </span>
                      <ArrowUpRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                {/* Right Interactive Preview Card for 3D Studio */}
                <div className="lg:col-span-5">
                  <div
                    onClick={() =>
                      onOpenProjectExperience?.('3d-molecular-studio')
                    }
                    className="google-one-subcard p-6 rounded-3xl cursor-pointer group space-y-5 relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#6C63FF] dark:text-[#A39DFF]">
                        <Box className="w-4 h-4" />
                        <span>3D MOLECULAR ENGINE · CPK &amp; ORBIT</span>
                      </span>
                      <span className="px-2.5 py-1 rounded-md bg-[#0D9488]/15 text-[#0D9488] dark:text-[#34D399] font-mono text-[11px] font-bold">
                        WebGL 60FPS
                      </span>
                    </div>

                    {/* Visual 3D Atom/Bond CPK Schematic */}
                    <div className="rounded-2xl bg-[#0F1322] border border-[#6C63FF]/30 p-5 flex flex-col items-center justify-center relative min-h-[190px]">
                      <svg
                        viewBox="0 0 320 150"
                        className="w-full max-w-[290px] h-auto transition-transform duration-500 group-hover:scale-105"
                      >
                        <defs>
                          <radialGradient id="cpk-c" cx="35%" cy="30%" r="65%">
                            <stop offset="0%" stopColor="#94A3B8" />
                            <stop offset="55%" stopColor="#475569" />
                            <stop offset="100%" stopColor="#1E293B" />
                          </radialGradient>
                          <radialGradient id="cpk-o" cx="35%" cy="30%" r="65%">
                            <stop offset="0%" stopColor="#FCA5A5" />
                            <stop offset="55%" stopColor="#EF4444" />
                            <stop offset="100%" stopColor="#991B1B" />
                          </radialGradient>
                          <radialGradient id="cpk-n" cx="35%" cy="30%" r="65%">
                            <stop offset="0%" stopColor="#93C5FD" />
                            <stop offset="55%" stopColor="#3B82F6" />
                            <stop offset="100%" stopColor="#1D4ED8" />
                          </radialGradient>
                          <radialGradient id="cpk-h" cx="35%" cy="30%" r="65%">
                            <stop offset="0%" stopColor="#FFFFFF" />
                            <stop offset="70%" stopColor="#E2E8F0" />
                            <stop offset="100%" stopColor="#94A3B8" />
                          </radialGradient>
                        </defs>
                        {/* Angle arc */}
                        <path
                          d="M 132 68 A 32 32 0 0 1 188 68"
                          fill="none"
                          stroke="#F59E0B"
                          strokeWidth="2"
                          strokeDasharray="4 3"
                        />
                        <text
                          x="160"
                          y="46"
                          textAnchor="middle"
                          fill="#FBBF24"
                          fontSize="11"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          109.5° · sp³
                        </text>
                        {/* Bonds */}
                        <line
                          x1="105"
                          y1="95"
                          x2="160"
                          y2="68"
                          stroke="#94A3B8"
                          strokeWidth="7"
                          strokeLinecap="round"
                        />
                        <line
                          x1="160"
                          y1="68"
                          x2="215"
                          y2="95"
                          stroke="#94A3B8"
                          strokeWidth="7"
                          strokeLinecap="round"
                        />
                        <line
                          x1="215"
                          y1="91"
                          x2="262"
                          y2="66"
                          stroke="#CBD5E1"
                          strokeWidth="4"
                          strokeLinecap="round"
                        />
                        <line
                          x1="215"
                          y1="99"
                          x2="262"
                          y2="74"
                          stroke="#CBD5E1"
                          strokeWidth="4"
                          strokeLinecap="round"
                        />
                        <line
                          x1="105"
                          y1="95"
                          x2="60"
                          y2="70"
                          stroke="#94A3B8"
                          strokeWidth="5"
                          strokeLinecap="round"
                        />
                        <line
                          x1="105"
                          y1="95"
                          x2="82"
                          y2="130"
                          stroke="#CBD5E1"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                        />
                        {/* Atoms */}
                        <circle cx="60" cy="70" r="14" fill="url(#cpk-n)" />
                        <circle cx="105" cy="95" r="17" fill="url(#cpk-c)" />
                        <circle cx="160" cy="68" r="17" fill="url(#cpk-c)" />
                        <circle cx="215" cy="95" r="17" fill="url(#cpk-c)" />
                        <circle cx="262" cy="70" r="15" fill="url(#cpk-o)" />
                        <circle cx="82" cy="130" r="10" fill="url(#cpk-h)" />
                      </svg>
                      <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono text-[#CBD5E1]">
                        <span className="px-2 py-0.5 rounded bg-white/10">
                          C₆H₆ Benzene
                        </span>
                        <span className="px-2 py-0.5 rounded bg-white/10">
                          C₅₅H₇₂MgN₄O₅ Chlorophyll a
                        </span>
                        <span className="px-2 py-0.5 rounded bg-white/10">
                          C₃₄H₃₂FeN₄O₄ Heme B
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
                      <div className="google-one-subcard-pill px-3 py-2 font-semibold text-[#1F1F2E] dark:text-white">
                        ✦ Xoay 360° Quaternion
                      </div>
                      <div className="google-one-subcard-pill px-3 py-2 font-semibold text-[#1F1F2E] dark:text-white">
                        ✦ PubChem &amp; PDB Cloud
                      </div>
                      <div className="google-one-subcard-pill px-3 py-2 font-semibold text-[#1F1F2E] dark:text-white">
                        ✦ Đo góc &amp; Lai hóa
                      </div>
                      <div className="google-one-subcard-pill px-3 py-2 font-semibold text-[#1F1F2E] dark:text-white">
                        ✦ Nhập/Xuất .SDF .MOL
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Featured Flagship Project Spotlight */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="mt-8 bg-white dark:bg-[#16142E] rounded-[32px] p-6 sm:p-8 lg:p-10 border border-[#E5E2DC] dark:border-[#6C63FF]/35 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-6 space-y-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-semibold">
                    <span className="text-[#6C63FF] dark:text-[#A39DFF]">
                      {lang === 'vi'
                        ? 'PROJECT MỞ MÀN GEN 6 (10 – 11/2026)'
                        : 'GEN 6 OPENING PROJECT'}
                    </span>
                    <span aria-hidden="true" className="text-[#9CA3AF]">
                      ·
                    </span>
                    <span className="text-[#0284C7] dark:text-[#38BDF8]">
                      {lang === 'vi'
                        ? '18 NGUYÊN TỐ NHÂN CÁCH'
                        : '18 PERSONALITY ELEMENTS'}
                    </span>
                    <span aria-hidden="true" className="text-[#9CA3AF]">
                      ·
                    </span>
                    <span className="text-[#0D9488] dark:text-[#34D399]">
                      ● ĐANG MỞ CỔNG TRẢI NGHIỆM
                    </span>
                  </div>

                  <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1F1F2E] dark:text-white leading-tight text-balance">
                    {lang === 'vi'
                      ? 'PROJECT “Bạn là nguyên tố nào?” — '
                      : 'PROJECT “Which Element Are You?” — '}
                    <span className="google-one-chem-gradient-text">
                      {lang === 'vi'
                        ? 'Giải Mã Bản Sắc Hóa Học'
                        : 'Decode Your Chemical Identity'}
                    </span>
                  </h3>

                  <p className="text-sm sm:text-base text-[#4A4A68] dark:text-[#CBD5E1] leading-relaxed">
                    Chiến dịch trực tuyến mở đầu nhiệm kỳ{' '}
                    <strong className="text-[#1F1F2E] dark:text-white">
                      BWAN CLUB Gen 6
                    </strong>{' '}
                    dành cho người tham gia trải nghiệm trực tiếp: khám phá
                    nguyên tố đại diện của chính bạn qua 5 chiều sâu tính cách,
                    tư duy, làm việc nhóm, xử lý áp lực và phong cách sáng tạo.
                  </p>

                  <div className="pt-1 flex flex-wrap items-center gap-3 text-xs font-mono font-semibold text-[#D97706] dark:text-[#FBBF24]">
                    <span>Ne · 10 (Khí hiếm Sáng tạo)</span>
                    <span>·</span>
                    <span>Fe · 26 (Bản lĩnh Thép)</span>
                    <span>·</span>
                    <span>Au · 79 (Kết nối Bền vững)</span>
                  </div>

                  <div className="pt-3 flex flex-wrap items-center gap-3">
                    <motion.button
                      type="button"
                      data-testid="flagship-project-experience-btn"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() =>
                        onOpenProjectExperience?.(
                          'giai-ma-18-nguyen-to-nhan-cach'
                        )
                      }
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full google-one-chem-btn text-sm font-semibold cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <span>
                        {lang === 'vi'
                          ? 'Trải Nghiệm Dự Án Ngay'
                          : 'Experience Project Now'}
                      </span>
                      <ArrowUpRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                <div className="lg:col-span-6">
                  <div
                    onClick={() =>
                      onOpenProjectExperience?.(
                        'giai-ma-18-nguyen-to-nhan-cach'
                      )
                    }
                    title="Bấm để mở trang trải nghiệm PROJECT Bạn là nguyên tố nào?"
                    className="rounded-2xl overflow-hidden border border-[#E5E2DC] dark:border-[#6C63FF]/40 shadow-md bg-[#0B0A16] cursor-pointer group relative"
                  >
                    <img
                      src="/assets/aistudio/image_f5fb4f1c.png"
                      alt="Giao diện Hệ thống giải mã 18 Nguyên tố Nhân cách — BWAN CLUB Gen 6"
                      referrerPolicy="no-referrer"
                      className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  </div>
                </div>
              </motion.div>

              {/* All Registered Projects Grid */}
              <motion.div
                layout
                data-testid="club-projects-grid"
                className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch"
              >
                <AnimatePresence mode="popLayout">
                  {filteredProjects.map((proj, index) => (
                    <motion.article
                      layout
                      key={proj.id}
                      initial={{ opacity: 0, y: 16, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{
                        duration: 0.32,
                        delay: index * 0.04,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      whileHover={{ y: -4 }}
                      className="google-one-tonal-card rounded-[28px] p-6 sm:p-7 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-semibold">
                          <span className="text-[#6C63FF] dark:text-[#A39DFF]">
                            {proj.categoryLabel}
                          </span>
                          <span aria-hidden="true" className="text-[#9CA3AF]">
                            ·
                          </span>
                          <span className="text-[#5F6368] dark:text-[#94A3B8]">
                            {proj.semester}
                          </span>
                          <span aria-hidden="true" className="text-[#9CA3AF]">
                            ·
                          </span>
                          <span
                            className={
                              proj.status === 'ACTIVE'
                                ? 'text-[#0D9488] dark:text-[#34D399]'
                                : proj.status === 'UPCOMING'
                                ? 'text-[#D97706] dark:text-[#FBBF24]'
                                : 'text-[#0284C7] dark:text-[#38BDF8]'
                            }
                          >
                            {proj.statusLabel}
                          </span>
                        </div>

                        <h3 className="mt-3 font-display text-xl font-bold text-[#1F1F2E] dark:text-white leading-snug">
                          {proj.title}
                        </h3>

                        <p className="mt-2.5 text-sm text-[#4A4A68] dark:text-[#CBD5E1] leading-relaxed">
                          {proj.summary}
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-[#DFDBD2] dark:border-[#6C63FF]/20 space-y-3.5">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono font-semibold">
                          <span className="text-[#0284C7] dark:text-[#38BDF8]">
                            {proj.chemicalTheme}
                          </span>
                          <span className="text-[#D97706] dark:text-[#FBBF24] tabular-nums">
                            {proj.highlightMetric}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleCopyProjectLink(proj.slug)}
                              title={`Sao chép link riêng: /du-an/${proj.slug}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full google-one-subcard-pill text-[11px] font-mono font-semibold text-[#4A4A68] dark:text-[#CBD5E1] hover:text-[#6C63FF] dark:hover:text-white transition-colors cursor-pointer"
                            >
                              {copiedSlug === proj.slug ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-[#0D9488] dark:text-[#34D399]" />
                                  <span className="text-[#0D9488] dark:text-[#34D399]">
                                    Đã chép link
                                  </span>
                                </>
                              ) : (
                                <>
                                  <Link2 className="w-3.5 h-3.5 text-[#6C63FF] dark:text-[#A39DFF]" />
                                  <span>/du-an/{proj.slug}</span>
                                </>
                              )}
                            </button>

                            {proj.slug === '3d-molecular-studio' && (
                              <a
                                href="/3d-molecular-studio.html"
                                title="Mở link độc lập toàn màn hình"
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#0284C7]/15 dark:bg-[#38BDF8]/20 text-[11px] font-mono font-semibold text-[#0284C7] dark:text-[#38BDF8] hover:bg-[#0284C7]/25 transition-colors"
                              >
                                <Maximize2 className="w-3 h-3" />
                                <span>Full 3D</span>
                              </a>
                            )}
                          </div>

                          <motion.button
                            type="button"
                            data-testid={`open-project-btn-${proj.slug}`}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => onOpenProjectExperience?.(proj.slug)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full google-one-chem-btn text-xs font-semibold text-white cursor-pointer whitespace-nowrap shrink-0"
                          >
                            <span>
                              {lang === 'vi'
                                ? 'Trải Nghiệm Dự Án'
                                : 'Experience Project'}
                            </span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          </section>

          {/* SECTION 04: DYNAMIC CATEGORY / MODULE SYNC ARCHITECTURE */}
          <section
            id="danh-muc"
            className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#0D0C1D] transition-colors duration-300"
          >
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white dark:bg-[#16142E] rounded-[32px] p-6 sm:p-10 border border-[#E5E2DC] dark:border-[#6C63FF]/35 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EFECE6] dark:border-[#6C63FF]/20">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#6C63FF] dark:text-[#A39DFF]">
                      <FolderGit2 className="w-4 h-4 text-[#6C63FF] dark:text-[#A39DFF]" />
                      <span>CỔNG ĐỒNG BỘ MÃ NỀN DANH MỤC MỞ RỘNG</span>
                    </div>
                    <h2 className="mt-1.5 font-display text-2xl sm:text-3xl font-bold text-[#1F1F2E] dark:text-white text-balance">
                      {lang === 'vi'
                        ? 'Đồng Bộ Hóa Danh Mục & Dự Án Mới Của BWAN CLUB'
                        : 'Synchronize New BWAN CLUB Categories & Projects'}
                    </h2>
                    <p className="mt-1 text-sm text-[#4A4A68] dark:text-[#CBD5E1]">
                      Khi bạn tải mã JSON hoặc nội dung của các danh mục tiếp
                      theo lên, hệ thống sẽ tự động chuẩn hóa theo tông màu Hóa
                      Học chủ đạo (
                      <code className="font-mono font-semibold text-[#6C63FF] dark:text-[#A39DFF]">
                        #6c63ff
                      </code>
                      ) và hiển thị tức thì.
                    </p>
                  </div>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setPayloadText(SAMPLE_SYNC_JSON);
                      setCustomTitle(
                        '05. Triển Lãm Nhiếp Ảnh Vi Tinh Thể Hóa Học (Micro-Crystal Art)'
                      );
                      setSyncError(null);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#F1F0FF] dark:bg-[#6C63FF]/25 hover:bg-[#E5E3FF] dark:hover:bg-[#6C63FF]/40 text-xs font-semibold text-[#6C63FF] dark:text-[#A39DFF] cursor-pointer whitespace-nowrap shrink-0 self-start sm:self-auto"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Nạp mã JSON danh mục mẫu</span>
                  </motion.button>
                </div>

                <form onSubmit={handleSyncSubmit} className="mt-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="sync-category-title"
                        className="block text-xs font-semibold text-[#3C4043] dark:text-[#E2E8F0] mb-1.5"
                      >
                        Tên danh mục / Dự án bổ sung
                      </label>
                      <input
                        id="sync-category-title"
                        type="text"
                        value={customTitle}
                        onChange={(e) => setCustomTitle(e.target.value)}
                        placeholder="VD: 05. Chuyên đề Tinh thể học..."
                        className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] dark:bg-[#0D0C1D] border border-[#DBD8D0] dark:border-[#6C63FF]/35 text-sm text-[#1F1F2E] dark:text-white placeholder-[#9CA3AF] focus:outline-none focus:border-[#6C63FF]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="sync-category-group"
                        className="block text-xs font-semibold text-[#3C4043] dark:text-[#E2E8F0] mb-1.5"
                      >
                        Nhóm danh mục hiển thị
                      </label>
                      <select
                        id="sync-category-group"
                        value={customCategory}
                        onChange={(e) =>
                          setCustomCategory(
                            e.target.value as typeof customCategory
                          )
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] dark:bg-[#0D0C1D] border border-[#DBD8D0] dark:border-[#6C63FF]/35 text-sm text-[#1F1F2E] dark:text-white focus:outline-none focus:border-[#6C63FF]"
                      >
                        <option value="du-an">Dự Án Thực Nghiệm</option>
                        <option value="su-kien">Sự Kiện Thường Niên</option>
                        <option value="nghien-cuu">Nghiên Cứu Khoa Học</option>
                        <option value="ung-dung">Ứng Dụng Hóa Học</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="sync-code-payload"
                      className="block text-xs font-semibold text-[#3C4043] dark:text-[#E2E8F0] mb-1.5"
                    >
                      Mã cấu hình JSON hoặc mô tả chi tiết danh mục
                    </label>
                    <textarea
                      id="sync-code-payload"
                      rows={4}
                      value={payloadText}
                      onChange={(e) => setPayloadText(e.target.value)}
                      placeholder="Dán mã JSON hoặc nội dung mô tả danh mục mới của BWAN CLUB vào đây để đồng bộ..."
                      className="w-full rounded-2xl bg-[#F8F9FA] dark:bg-[#0D0C1D] border border-[#DBD8D0] dark:border-[#6C63FF]/35 p-3.5 font-mono text-xs text-[#1F1F2E] dark:text-white placeholder-[#9CA3AF] focus:outline-none focus:border-[#6C63FF]"
                    />
                  </div>

                  {syncError && (
                    <p
                      role="alert"
                      className="text-xs text-[#DC2626] dark:text-[#F87171] font-semibold"
                    >
                      {syncError}
                    </p>
                  )}

                  {syncSuccess && (
                    <div
                      role="status"
                      className="flex items-center gap-2 text-xs text-[#0D9488] dark:text-[#34D399] bg-[#F0FDFA] dark:bg-[#064E3B]/40 border border-[#99F6E4] dark:border-[#34D399]/40 px-4 py-3 rounded-xl font-semibold"
                    >
                      <CheckCircle className="w-4 h-4 shrink-0" />
                      <span>{syncSuccess}</span>
                    </div>
                  )}

                  <div className="pt-2">
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                      className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full google-one-chem-btn text-sm font-semibold cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <UploadCloud className="w-4 h-4" />
                      <span>Đồng Bộ Danh Mục Lên Website</span>
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </div>
          </section>
        </>
      )}

      {/* SECTION 03: "GEN 6 SẼ CÓ GÌ??" FULL 12-MONTH MASTER ROADMAP + FEATURED EVENTS */}
      {showEvents && (
        <>
          <section
            id="lo-trinh-gen6"
            data-testid="gen6-roadmap-section"
            className="google-one-chem-section-wash py-16 sm:py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300"
          >
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F1F0FF] dark:bg-[#6C63FF]/25 border border-[#6C63FF]/30 text-xs font-mono font-bold text-[#6C63FF] dark:text-[#A39DFF]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>KẾ HOẠCH HOẠT ĐỘNG TOÀN NIÊN KHÓA (10/2026 – 09/2027)</span>
                </div>

                <h2 className="mt-3 font-display text-3xl sm:text-4xl font-extrabold text-[#1F1F2E] dark:text-white tracking-tight text-balance">
                  “GEN 6 SẼ CÓ GÌ??” —{' '}
                  <span className="google-one-chem-gradient-text">
                    Lộ Trình 12 Tháng BWAN CLUB
                  </span>
                </h2>

                <p className="mt-2.5 text-sm sm:text-base text-[#4A4A68] dark:text-[#CBD5E1] leading-relaxed">
                  Toàn cảnh chuỗi hoạt động xuyên suốt nhiệm kỳ Gen 6 tại THPT
                  chuyên Lê Quý Đôn Đà Nẵng: từ First Meeting (01/11/2026),
                  chuỗi Lab Tour nội bộ, Ra mắt Website, Preorder Valentine,
                  Sinh nhật BWAN 6 tuổi, Workshop Gen 6, Club Fair đến đại sự
                  kiện <strong>BWAN CAMP 2027 (22/08)</strong>.
                </p>
              </div>

              {/* Phase Filter Bar */}
              <div
                role="group"
                aria-label="Lọc lộ trình theo học kỳ và giai đoạn"
                className="mt-7 flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-[#EAE7E0] dark:bg-[#191632] w-fit"
              >
                {[
                  { id: 'all', label: 'Tất cả 12 mốc tháng' },
                  { id: 'hk1-2026', label: 'HK I (10 – 12/2026)' },
                  { id: 'xuan-2027', label: 'Xuân & Valentine (01 – 03/2027)' },
                  { id: 'hk2-2027', label: 'HK II & Club Fair (04 – 06/2027)' },
                  { id: 'he-camp-2027', label: 'Hè & BWAN CAMP (07 – 09/2027)' },
                ].map((tab) => {
                  const isSelected = roadmapPhase === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() =>
                        setRoadmapPhase(tab.id as typeof roadmapPhase)
                      }
                      className={`relative px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                        isSelected
                          ? 'text-white'
                          : 'text-[#4A4A68] dark:text-[#CBD5E1] hover:text-[#1F1F2E] dark:hover:text-white'
                      }`}
                    >
                      {isSelected && (
                        <motion.span
                          layoutId="roadmap-phase-pill"
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

              {/* 12-Month Timeline Cards Grid */}
              <motion.div
                layout
                className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch"
              >
                <AnimatePresence mode="popLayout">
                  {filteredRoadmap.map((month, idx) => (
                    <motion.article
                      layout
                      key={month.id}
                      initial={{ opacity: 0, y: 16, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: idx * 0.03 }}
                      whileHover={{ y: -4 }}
                      className="google-one-tonal-card rounded-[28px] p-6 flex flex-col justify-between relative overflow-hidden"
                    >
                      <div>
                        {/* Top Month Header */}
                        <div className="flex items-center justify-between gap-2 pb-3.5 border-b border-[#DFDBD2] dark:border-[#6C63FF]/25">
                          <div>
                            <span className="block text-[11px] font-mono font-semibold text-[#5F6368] dark:text-[#94A3B8]">
                              {month.phaseLabel}
                            </span>
                            <h3 className="font-display text-lg sm:text-xl font-extrabold text-[#1F1F2E] dark:text-white mt-0.5">
                              {month.monthLabel}
                            </h3>
                          </div>

                          {month.highlightBadge && (
                            <span className="px-2.5 py-1 rounded-full bg-[#6C63FF]/15 dark:bg-[#6C63FF]/30 text-[#6C63FF] dark:text-[#A39DFF] font-mono text-[10px] font-bold shrink-0">
                              {month.highlightBadge}
                            </span>
                          )}
                        </div>

                        {/* Monthly Bullet Items */}
                        <div className="mt-4 space-y-3">
                          {month.items.map((item, itemIdx) => {
                            const badge = getRoadmapItemBadge(item.type);
                            return (
                              <div
                                key={itemIdx}
                                className="google-one-subcard rounded-2xl p-3.5 space-y-1.5"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${badge.color}`}
                                  >
                                    {badge.icon}
                                    <span>{badge.tag}</span>
                                  </span>

                                  {item.dateNote && (
                                    <span className="text-[11px] font-mono font-semibold text-[#5F6368] dark:text-[#94A3B8]">
                                      {item.dateNote}
                                    </span>
                                  )}
                                </div>

                                <p className="font-display text-sm font-bold text-[#1F1F2E] dark:text-white leading-snug">
                                  {item.title}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="mt-5 pt-3 border-t border-[#DFDBD2] dark:border-[#6C63FF]/20 flex items-center justify-between text-[11px] font-mono text-[#5F6368] dark:text-[#94A3B8]">
                        <span>BWAN CLUB Gen 6</span>
                        <span className="font-bold text-[#6C63FF] dark:text-[#A39DFF]">
                          {month.items.length} đầu việc trọng tâm
                        </span>
                      </div>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          </section>

          {/* FEATURED EVENTS REGISTRATION CARDS */}
          <section
            id="su-kien"
            className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#0D0C1D] transition-colors duration-300"
          >
            <div className="max-w-7xl mx-auto">
              <div className="text-center max-w-3xl mx-auto">
                <p className="text-xs font-mono font-semibold text-[#D97706] dark:text-[#FBBF24] tracking-wide">
                  {lang === 'vi'
                    ? 'ĐĂNG KÝ THAM DỰ CÁC HOẠT ĐỘNG TRỌNG TÂM'
                    : 'REGISTER FOR FEATURED GEN 6 EVENTS'}
                </p>
                <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-[#1F1F2E] dark:text-white tracking-tight text-balance">
                  {lang === 'vi'
                    ? 'Tiêu Điểm Sự Kiện Tại '
                    : 'Featured Events at '}
                  <span className="text-[#6C63FF] dark:text-[#A39DFF]">
                    BWAN CLUB
                  </span>
                </h2>
                <p className="mt-3 text-base text-[#4A4A68] dark:text-[#CBD5E1] leading-relaxed">
                  {lang === 'vi'
                    ? 'Đăng ký tham gia trực tiếp các chuỗi hoạt động nổi bật của BWAN CLUB Gen 6 tại Trường THPT chuyên Lê Quý Đôn Đà Nẵng.'
                    : 'Register for BWAN CLUB Gen 6 flagship activities at Le Quy Don High School for the Gifted, Da Nang.'}
                </p>
              </div>

              <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                {events.map((evt, index) => (
                  <motion.article
                    key={evt.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.08,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    whileHover={{ y: -5 }}
                    className="google-one-tonal-card rounded-[28px] p-6 sm:p-7 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 text-xs font-mono font-semibold">
                        <span className="inline-flex items-center gap-1.5 text-[#D97706] dark:text-[#FBBF24]">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{evt.dateLabel}</span>
                        </span>
                        <span className="text-[#0284C7] dark:text-[#38BDF8]">
                          {evt.formulaTag}
                        </span>
                      </div>

                      <h3 className="mt-3 font-display text-xl font-bold text-[#1F1F2E] dark:text-white leading-snug">
                        {evt.title}
                      </h3>

                      <p className="mt-2.5 text-sm text-[#4A4A68] dark:text-[#CBD5E1] leading-relaxed">
                        {evt.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#DFDBD2] dark:border-[#6C63FF]/20 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-medium text-[#3C4043] dark:text-[#E2E8F0]">
                        <MapPin className="w-4 h-4 text-[#6C63FF] dark:text-[#A39DFF] shrink-0" />
                        <span>{evt.location}</span>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs font-mono font-semibold text-[#0D9488] dark:text-[#34D399] tabular-nums">
                          Còn {evt.spotsRemaining} suất tham dự
                        </span>
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onOpenJoinModal('Ban Đối Ngoại')}
                          className="px-4 py-2 rounded-full google-one-chem-btn text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0"
                        >
                          {lang === 'vi' ? 'Đăng ký tham dự' : 'Register'}
                        </motion.button>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
};
