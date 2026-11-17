import React, { useState } from 'react';
import {
  ArrowLeft,
  FlaskConical,
  Sparkles,
  CheckCircle2,
  Atom,
  Flame,
  Gift,
  Compass,
  Box,
  Link2,
  Check,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { motion } from 'motion/react';
import { ClubProjectItem } from '../utils/chemistryEngine';
import { AppLanguage } from './Navbar';

interface ProjectExperiencePageProps {
  project: ClubProjectItem;
  onBackToProjects: () => void;
  lang: AppLanguage;
  standaloneFullscreen?: boolean;
}

const LAB_TOUR_SIMULATIONS = [
  {
    id: 'lab-1',
    title: 'Lab Tour I (15/11/2026): Chuẩn Độ Oxy Hóa – Khử & Sắc Màu Ion Kim Loại Chuyển Tiếp',
    titleEn: 'Lab Tour I (15/11/2026): Redox Titration & Transition Metal Ion Colors',
    equation: '5Fe²⁺ + MnO₄⁻ + 8H⁺ → 5Fe³⁺ + Mn²⁺ + 4H₂O',
    colorTransition: 'Không màu / Lục nhạt → Hồng tím bền (Điểm tương đương chuẩn độ)',
    colorTransitionEn: 'Colorless / Pale Green → Persistent Pink-Violet (Equivalence Point)',
    observation:
      'Khi nhỏ từng giọt dung dịch KMnO₄ 0.02M từ buret xuống bình tam giác chứa FeSO₄ trong môi trường H₂SO₄ loãng, màu tím của MnO₄⁻ mất đi tức thì do bị khử thành Mn²⁺. Tại đúng điểm tương đương, chỉ 1 giọt dư KMnO₄ làm dung dịch chuyển sang sắc hồng nhạt bền trong 30 giây.',
    observationEn:
      'As 0.02M KMnO₄ is added drop by drop from the burette into the Erlenmeyer flask containing acidified FeSO₄, the deep purple permanganate color disappears immediately as MnO₄⁻ is reduced to Mn²⁺. At the exact equivalence point, a single excess drop turns the solution a persistent pale pink for 30 seconds.',
    safetyTip: 'Sử dụng kính bảo hộ phòng Lab THPT chuyên Lê Quý Đôn, đọc vạch mặt khum trên đối với dung dịch KMnO₄ sẫm màu.',
    safetyTipEn: 'Wear safety goggles in the Le Quy Don Lab and read the upper meniscus for dark KMnO₄ solutions.',
  },
  {
    id: 'lab-2',
    title: 'Lab Tour II (17/01/2027): Phản Ứng Đồng Hồ Iốt (Iodine Clock Reaction) — Động Hóa Học',
    titleEn: 'Lab Tour II (17/01/2027): Iodine Clock Reaction — Chemical Kinetics',
    equation: 'H₂O₂ + 2I⁻ + 2H⁺ → I₂ + 2H₂O (Kết hợp S₂O₃²⁻ & Hồ tinh bột)',
    colorTransition: 'Trong suốt hoàn toàn → Đổi màu Xanh Đen đột ngột sau đúng Δt giây',
    colorTransitionEn: 'Crystal Clear → Sudden Deep Blue-Black Flash after Δt seconds',
    observation:
      'Dung dịch giữ trạng thái trong suốt hoàn toàn trong suốt thời gian ion Thiosulfate (S₂O₃²⁻) tiêu thụ I₂ vừa sinh ra. Ngay tại khoảnh khắc S₂O₃²⁻ vừa hết, phân tử I₂ tự do lập tức tạo phức bao với Amylose trong tinh bột, làm toàn bộ cốc phản ứng chuyển sang màu xanh tím sẫm chỉ trong chớp mắt!',
    observationEn:
      'The solution remains completely colorless while thiosulfate ions (S₂O₃²⁻) consume the generated iodine (I₂). The instant S₂O₃²⁻ is depleted, free I₂ forms a starch-amylose inclusion complex, turning the entire beaker deep blue-black in the blink of an eye!',
    safetyTip: 'Bấm đồng hồ bấm giây chính xác khi trộn 2 cốc dung dịch để vẽ đồ thị tốc độ phản ứng theo nồng độ.',
    safetyTipEn: 'Start the stopwatch immediately upon mixing the two solutions to plot reaction rate vs. concentration.',
  },
  {
    id: 'lab-3',
    title: 'Lab Tour III & WORKSHOP GEN 6 (04–05/2027): Nuôi Đơn Tinh Thể & Hóa Phát Quang Luminol',
    titleEn: 'Lab Tour III & GEN 6 WORKSHOP (04–05/2027): Single-Crystal Growth & Luminol Chemiluminescence',
    equation: 'C₈H₇N₃O₂ (Luminol) + H₂O₂ —([Fe(CN)₆]³⁻)→ 3-APA* → 3-APA + hν (425 nm)',
    colorTransition: 'Dung dịch trong bóng tối → Phát ánh sáng Xanh Lam lạnh (Chemiluminescence)',
    colorTransitionEn: 'Dark Solution → Cool Blue Glow Emission (Chemiluminescence at 425 nm)',
    observation:
      'Năng lượng hóa học giải phóng từ quá trình oxy hóa Luminol không tỏa ra dưới dạng nhiệt mà chuyển thẳng thành photon ánh sáng bước sóng 425 nm, tạo nên hiệu ứng dòng chảy phát quang rực rỡ trong phòng tối.',
    observationEn:
      'Chemical energy released during Luminol oxidation is emitted directly as 425 nm light photons rather than heat, producing a vivid glowing blue stream in the dark lab.',
    safetyTip: 'Thực hiện trong khu vực chắn sáng của phòng Lab dưới sự hướng dẫn của Ban Nội Dung Gen 6.',
    safetyTipEn: 'Conducted in the darkened lab zone under the supervision of the Gen 6 Content Division.',
  },
];

const VALENTINE_CHEM_PRODUCTS = [
  {
    id: 'val-1',
    name: 'Nến Thơm Tinh Dầu Ester Tự Nhiên (Isoamyl Acetate & Linalool)',
    nameEn: 'Natural Ester Essential Oil Scented Candle (Isoamyl Acetate & Linalool)',
    formula: 'CH₃COOCH₂CH₂CH(CH₃)₂ · C₁₀H₁₈O',
    highlight: 'Phối hương tầng đầu – tầng giữa – tầng cuối theo nhiệt độ nóng chảy sáp đậu nành',
    highlightEn: 'Top, heart, and base fragrance notes balanced with soy wax melting point',
    detail:
      'Ứng dụng nguyên lý áp suất hơi bão hòa và điểm chớp cháy của các hợp chất Ester và Terpene tự nhiên để tỏa hương dịu nhẹ, an toàn trong không gian học tập.',
    detailEn:
      'Applies vapor pressure and flash-point principles of natural esters and terpenes for a gentle, safe aroma in study spaces.',
  },
  {
    id: 'val-2',
    name: 'Bộ Kit Nuôi Tinh Thể CuSO₄·5H₂O & Phèn Nhôm KAl(SO₄)₂·12H₂O',
    nameEn: 'CuSO₄·5H₂O & Alum KAl(SO₄)₂·12H₂O Crystal Growing Kit',
    formula: '[Cu(H₂O)₄]SO₄·H₂O (Triclinic Sapphire-Blue Crystal System)',
    highlight: 'Tự tay nuôi đơn tinh thể bát diện & tam tà từ dung dịch quá bão hòa',
    highlightEn: 'Grow octahedral and triclinic single crystals from supersaturated solutions',
    detail:
      'Kèm cẩm nang giải thích đường cong độ tan theo nhiệt độ và kỹ thuật treo mầm tinh thể do Ban Nội Dung & Ban Kỹ Thuật BWAN CLUB biên soạn.',
    detailEn:
      'Includes a solubility-curve handbook and seed-crystal suspension guide authored by BWAN CLUB Content & Technical Divisions.',
  },
  {
    id: 'val-3',
    name: 'Thiệp Hóa Học Đổi Màu Nhiệt Sắc (Thermochromic & Phức Chất Cobalt)',
    nameEn: 'Thermochromic Color-Changing Chemistry Card (Cobalt Complex)',
    formula: '[Co(H₂O)₆]²⁺ (Soft Pink) ⇌ [CoCl₄]²⁻ (Deep Ocean Blue) + 6H₂O',
    highlight: 'Đổi màu tức thì khi chạm tay hoặc hơ nhẹ ấm, hiện thông điệp ẩn mùa Valentine',
    highlightEn: 'Changes color on warm touch to reveal hidden Valentine messages',
    detail:
      'Dựa trên nguyên lý chuyển dịch cân bằng Le Chatelier của phức chất kim loại chuyển tiếp theo nhiệt độ và độ ẩm.',
    detailEn:
      'Based on Le Chatelier’s equilibrium shift of transition metal coordination complexes with temperature and humidity.',
  },
];

export const ProjectExperiencePage: React.FC<ProjectExperiencePageProps> = ({
  project,
  onBackToProjects,
  lang,
  standaloneFullscreen = false,
}) => {
  const isEn = lang === 'en';
  const displayTitle = isEn && project.titleEn ? project.titleEn : project.title;
  const displaySummary =
    isEn && project.summaryEn ? project.summaryEn : project.summary;
  const displayTheme =
    isEn && project.chemicalThemeEn
      ? project.chemicalThemeEn
      : project.chemicalTheme;
  const displayMetric =
    isEn && project.highlightMetricEn
      ? project.highlightMetricEn
      : project.highlightMetric;

  // Interactive state for Project 03: Lab Tour Reaction Simulator
  const [activeLabIdx, setActiveLabIdx] = useState(0);
  const [reactionTriggered, setReactionTriggered] = useState(false);

  // Interactive state for Project 04: Valentine Chemistry Collection
  const [selectedProductIdx, setSelectedProductIdx] = useState(0);

  // Interactive state for Project 01 & Project 02 frame expansion & link copying
  const [copiedProjectLink, setCopiedProjectLink] = useState(false);
  const [isStudioExpanded, setIsStudioExpanded] = useState(false);

  const handleCopyCurrentProjectLink = () => {
    const url = `${window.location.origin}/du-an/${project.slug}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).catch(() => {});
    }
    setCopiedProjectLink(true);
    window.setTimeout(() => setCopiedProjectLink(false), 2200);
  };

  const isExpandableProject =
    project.slug === 'giai-ma-18-nguyen-to-nhan-cach' ||
    project.slug === '3d-molecular-studio';

  if (
    standaloneFullscreen &&
    project.slug === 'giai-ma-18-nguyen-to-nhan-cach'
  ) {
    return (
      <div
        data-testid="experience-18-elements"
        className="w-full h-screen bg-[#0D0B18] overflow-hidden"
      >
        <iframe
          src="/18-nguyen-to-nhan-cach.html"
          title="Which Element Are You? — BWAN Gen 6"
          className="w-full h-screen border-0 block"
        />
      </div>
    );
  }

  return (
    <section
      data-testid="project-experience-page"
      className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 transition-colors duration-300"
    >
      <div
        className={`${
          isExpandableProject && isStudioExpanded
            ? 'max-w-[96vw]'
            : isExpandableProject
            ? 'max-w-7xl'
            : 'max-w-6xl'
        } mx-auto space-y-6 transition-all duration-300`}
      >
        {/* Top Navigation Bar back to Projects list */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <motion.button
            type="button"
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.96 }}
            onClick={onBackToProjects}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#F1F0FF] dark:bg-[#191632] hover:bg-[#6C63FF] hover:text-white text-xs sm:text-sm font-semibold text-[#6C63FF] dark:text-[#A39DFF] border border-[#6C63FF]/30 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>
              {lang === 'vi'
                ? 'Quay lại danh sách Dự án (/du-an)'
                : 'Back to All Projects (/du-an)'}
            </span>
          </motion.button>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-semibold">
            <button
              type="button"
              onClick={handleCopyCurrentProjectLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full google-one-subcard-pill text-[#1F1F2E] dark:text-white hover:border-[#6C63FF] transition-colors cursor-pointer"
            >
              {copiedProjectLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#0D9488] dark:text-[#34D399]" />
                  <span className="text-[#0D9488] dark:text-[#34D399]">
                    {isEn
                      ? `Copied: /du-an/${project.slug}`
                      : `Đã sao chép: /du-an/${project.slug}`}
                  </span>
                </>
              ) : (
                <>
                  <Link2 className="w-3.5 h-3.5 text-[#6C63FF] dark:text-[#A39DFF]" />
                  <span>
                    {isEn
                      ? `Direct link: /du-an/${project.slug}`
                      : `Link riêng: /du-an/${project.slug}`}
                  </span>
                </>
              )}
            </button>
            <span className="px-3 py-1 rounded-full bg-[#F1F0FF] dark:bg-[#6C63FF]/25 text-[#6C63FF] dark:text-[#A39DFF]">
              {project.code}
            </span>
            <span className="px-3 py-1 rounded-full bg-[#ECFDF5] dark:bg-[#064E3B]/50 text-[#0D9488] dark:text-[#34D399]">
              {isEn
                ? '● INTERACTIVE PARTICIPANT PORTAL'
                : '● CỔNG TRẢI NGHIỆM DÀNH CHO NGƯỜI THAM GIA'}
            </span>
          </div>
        </div>

        {/* CASE 1 (DỰ ÁN SỐ 1): PROJECT "BẠN LÀ NGUYÊN TỐ NÀO?" — 100% UNTOUCHED ORIGINAL SOURCE CODE */}
        {project.slug === 'giai-ma-18-nguyen-to-nhan-cach' ? (
          <div
            data-testid="experience-18-elements"
            className="google-one-tonal-card rounded-[32px] p-4 sm:p-6 lg:p-8 space-y-5"
          >
            {/* Project 1 Top Control Bar matching Project 2 */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#DFDBD2] dark:border-[#6C63FF]/25">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#6C63FF] dark:text-[#A39DFF]">
                  <Atom className="w-4 h-4" />
                  <span>
                    {isEn
                      ? 'BWAN GEN 6 — CHEMISTRY LAB · WHICH ELEMENT ARE YOU? · 18 PERSONALITY ELEMENTS'
                      : 'BWAN GEN 6 — CHEMISTRY LAB · WHICH ELEMENT ARE YOU? · 18 NGUYÊN TỐ NHÂN CÁCH'}
                  </span>
                </div>
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1F1F2E] dark:text-white">
                  {displayTitle}
                </h1>
                <p className="text-xs sm:text-sm text-[#4A4A68] dark:text-[#CBD5E1]">
                  {isEn
                    ? 'The original 18 Personality Elements Decoding System of BWAN CLUB Gen 6: 15 questions across 5 dimensions (Personality, Thinking, Teamwork, Pressure Handling, Creative Style), element compatibility, and PNG card export.'
                    : 'Hệ thống giải mã 18 Nguyên tố Nhân cách nguyên bản của BWAN CLUB Gen 6: 15 câu hỏi qua 5 chiều sâu (Tính cách, Tư duy, Làm việc nhóm, Xử lý áp lực, Phong cách sáng tạo), đo độ hợp nguyên tố & xuất thẻ PNG.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyCurrentProjectLink}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full google-one-subcard-pill text-xs font-semibold text-[#1F1F2E] dark:text-white hover:border-[#6C63FF] transition-colors cursor-pointer"
                >
                  {copiedProjectLink ? (
                    <>
                      <Check className="w-4 h-4 text-[#0D9488] dark:text-[#34D399]" />
                      <span className="text-[#0D9488] dark:text-[#34D399]">
                        {isEn ? 'Project link copied!' : 'Đã sao chép link dự án!'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Link2 className="w-4 h-4 text-[#6C63FF] dark:text-[#A39DFF]" />
                      <span>
                        {isEn
                          ? 'Copy link (/du-an/giai-ma-18-nguyen-to-nhan-cach)'
                          : 'Sao chép link (/du-an/giai-ma-18-nguyen-to-nhan-cach)'}
                      </span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsStudioExpanded((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#F1F0FF] dark:bg-[#1E1B3D] hover:bg-[#6C63FF] hover:text-white text-xs font-semibold text-[#6C63FF] dark:text-[#A39DFF] border border-[#6C63FF]/35 transition-colors cursor-pointer"
                >
                  {isStudioExpanded ? (
                    <>
                      <Minimize2 className="w-4 h-4" />
                      <span>{isEn ? 'Collapse frame' : 'Thu gọn khung'}</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="w-4 h-4" />
                      <span>{isEn ? 'Expand frame' : 'Mở rộng khung'}</span>
                    </>
                  )}
                </button>

                <a
                  href="/18-nguyen-to-nhan-cach.html"
                  data-testid="open-standalone-18-elements-btn"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full google-one-chem-btn text-xs font-semibold text-white whitespace-nowrap"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>
                    {isEn
                      ? 'Open Standalone Fullscreen'
                      : 'Mở Link Độc Lập Toàn Màn Hình'}
                  </span>
                </a>
              </div>
            </div>

            {/* 100% Untouched Original HTML Application Embedded */}
            <div className="rounded-2xl overflow-hidden border border-[#D5D0EA] dark:border-[#6C63FF]/40 bg-[#0D0B18] shadow-lg">
              <iframe
                src="/18-nguyen-to-nhan-cach.html"
                title="Which Element Are You? — BWAN Gen 6"
                className={`w-full border-0 transition-all duration-300 ${
                  isStudioExpanded ? 'h-[92vh] min-h-[860px]' : 'h-[860px]'
                }`}
              />
            </div>
          </div>
        ) : project.slug === '3d-molecular-studio' ? (
          /* CASE 2 (DỰ ÁN SỐ 2): BWAN 3D ORGANIC MOLECULAR STUDIO */
          <div
            data-testid="experience-3d-molecular-studio"
            className="google-one-tonal-card rounded-[32px] p-4 sm:p-6 lg:p-8 space-y-5"
          >
            {/* Studio Top Control Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#DFDBD2] dark:border-[#6C63FF]/25">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#6C63FF] dark:text-[#A39DFF]">
                  <Box className="w-4 h-4" />
                  <span>
                    BWAN CLUB · 3D ORGANIC MOLECULAR STUDIO · WEBGL THREE.JS R128
                  </span>
                </div>
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1F1F2E] dark:text-white">
                  {displayTitle}
                </h1>
                <p className="text-xs sm:text-sm text-[#4A4A68] dark:text-[#CBD5E1]">
                  {isEn
                    ? 'Free 360° Quaternion rotation · 25+ organic molecules & coordination complexes · Live cloud lookup via PubChem 3D, NIH Cactus, RCSB PDB & ChEMBL · Measure bond lengths (Å), bond angles (°), and sp/sp²/sp³ hybridization.'
                    : 'Xoay tự do 360° Quaternion · 25+ phân tử hữu cơ & phức chất sinh học · Tra cứu trực tuyến PubChem 3D, NIH Cactus, RCSB PDB & ChEMBL · Đo độ dài (Å), góc liên kết (°) và lai hóa sp/sp²/sp³.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyCurrentProjectLink}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full google-one-subcard-pill text-xs font-semibold text-[#1F1F2E] dark:text-white hover:border-[#6C63FF] transition-colors cursor-pointer"
                >
                  {copiedProjectLink ? (
                    <>
                      <Check className="w-4 h-4 text-[#0D9488] dark:text-[#34D399]" />
                      <span className="text-[#0D9488] dark:text-[#34D399]">
                        {isEn ? 'Project link copied!' : 'Đã sao chép link dự án!'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Link2 className="w-4 h-4 text-[#6C63FF] dark:text-[#A39DFF]" />
                      <span>
                        {isEn
                          ? 'Copy link (/du-an/3d-molecular-studio)'
                          : 'Sao chép link (/du-an/3d-molecular-studio)'}
                      </span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsStudioExpanded((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#F1F0FF] dark:bg-[#1E1B3D] hover:bg-[#6C63FF] hover:text-white text-xs font-semibold text-[#6C63FF] dark:text-[#A39DFF] border border-[#6C63FF]/35 transition-colors cursor-pointer"
                >
                  {isStudioExpanded ? (
                    <>
                      <Minimize2 className="w-4 h-4" />
                      <span>
                        {isEn ? 'Collapse 3D frame' : 'Thu gọn khung 3D'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="w-4 h-4" />
                      <span>
                        {isEn ? 'Expand 3D frame' : 'Mở rộng khung 3D'}
                      </span>
                    </>
                  )}
                </button>

                <a
                  href="/3d-molecular-studio.html"
                  data-testid="open-standalone-3d-studio-link"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full google-one-chem-btn text-xs font-semibold text-white whitespace-nowrap"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>
                    {isEn
                      ? 'Open Standalone Fullscreen'
                      : 'Mở Link Độc Lập Toàn Màn Hình'}
                  </span>
                </a>
              </div>
            </div>

            {/* Interactive Embedded 3D Molecular Studio Workbench */}
            <div className="rounded-2xl overflow-hidden border border-[#D5D0EA] dark:border-[#6C63FF]/40 bg-[#0F1322] shadow-lg">
              <iframe
                src="/3d-molecular-studio.html"
                title="BWAN CLUB - 3D Organic Molecular Studio"
                className={`w-full border-0 transition-all duration-300 ${
                  isStudioExpanded ? 'h-[86vh] min-h-[760px]' : 'h-[740px]'
                }`}
              />
            </div>

            {/* Quick Guide Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="google-one-subcard p-3.5 text-xs">
                <span className="font-mono font-bold text-[#6C63FF] dark:text-[#A39DFF] block">
                  {isEn
                    ? '01 · FREE 360° 3D CAMERA CONTROL'
                    : '01 · ĐIỀU KHIỂN CAMERA 3D TỰ DO 360°'}
                </span>
                <p className="mt-1 text-[#4A4A68] dark:text-[#CBD5E1]">
                  {isEn
                    ? 'Hold left click to orbit 360° in any direction (Quaternion), scroll wheel to zoom, hold right click to pan the molecule center.'
                    : 'Giữ chuột trái để xoay tự do 360° mọi hướng (Quaternion), cuộn con lăn để thu phóng, giữ chuột phải để di chuyển tâm phân tử.'}
                </p>
              </div>
              <div className="google-one-subcard p-3.5 text-xs">
                <span className="font-mono font-bold text-[#0284C7] dark:text-[#38BDF8] block">
                  {isEn
                    ? '02 · HYBRIDIZATION, DISTANCE & ANGLE'
                    : '02 · ĐO LAI HÓA, ĐỘ DÀI & GÓC LIÊN KẾT'}
                </span>
                <p className="mt-1 text-[#4A4A68] dark:text-[#CBD5E1]">
                  {isEn
                    ? 'Click 1 atom to inspect hybridization (sp/sp²/sp³), click 2 atoms to measure bond length (Å), click 3 atoms to draw the bond angle arc (°).'
                    : 'Click 1 nguyên tử để xem lai hóa (sp/sp²/sp³), click 2 nguyên tử để đo khoảng cách (Å), click 3 nguyên tử để vẽ cung góc liên kết (°).'}
                </p>
              </div>
              <div className="google-one-subcard p-3.5 text-xs">
                <span className="font-mono font-bold text-[#0D9488] dark:text-[#34D399] block">
                  {isEn
                    ? '03 · DEDICATED SHAREABLE LINK'
                    : '03 · ĐƯỜNG LINK RIÊNG CHIA SẺ TRỰC TIẾP'}
                </span>
                <p className="mt-1 text-[#4A4A68] dark:text-[#CBD5E1]">
                  {isEn ? 'Access directly via ' : 'Truy cập trực tiếp qua '}
                  <code className="font-mono font-semibold text-[#6C63FF] dark:text-[#A39DFF]">
                    /du-an/3d-molecular-studio
                  </code>{' '}
                  {isEn ? 'or fullscreen at ' : 'hoặc bản toàn màn hình '}
                  <code className="font-mono font-semibold text-[#0284C7] dark:text-[#38BDF8]">
                    /3d-molecular-studio.html
                  </code>
                  .
                </p>
              </div>
            </div>
          </div>
        ) : project.slug === 'chuoi-lab-tour-noi-bo-va-workshop-gen-6' ? (
          /* CASE 3: INTERACTIVE VIRTUAL LAB TOUR & REACTION SIMULATOR */
          <div className="bg-white dark:bg-[#16142E] rounded-[32px] p-6 sm:p-10 border border-[#E5E2DC] dark:border-[#6C63FF]/35 shadow-sm space-y-8">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#0284C7] dark:text-[#38BDF8]">
                <FlaskConical className="w-4 h-4" />
                <span>
                  {isEn
                    ? 'VIRTUAL LAB EXPERIENCE STATION · BWAN LAB TOURS I–III'
                    : 'TRẠM TRẢI NGHIỆM PHÒNG THÍ NGHIỆM ẢO · BWAN LAB TOUR I–III'}
                </span>
              </div>
              <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-[#1F1F2E] dark:text-white">
                {displayTitle}
              </h1>
              <p className="text-sm sm:text-base text-[#4A4A68] dark:text-[#CBD5E1] leading-relaxed">
                {isEn
                  ? 'Select one of the 3 internal Lab Tour sessions to simulate reaction equations, observe color transitions, and review safety protocols at Le Quy Don High School for the Gifted, Da Nang.'
                  : 'Chọn một trong 3 đợt thực nghiệm Lab Tour nội bộ để kích hoạt mô phỏng phương trình phản ứng, quan sát sự chuyển đổi màu sắc và quy trình an toàn tại phòng Lab Trường THPT chuyên Lê Quý Đôn Đà Nẵng.'}
              </p>
            </div>

            {/* Experiment Selector Tabs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {LAB_TOUR_SIMULATIONS.map((lab, idx) => {
                const isSelected = activeLabIdx === idx;
                return (
                  <button
                    key={lab.id}
                    type="button"
                    onClick={() => {
                      setActiveLabIdx(idx);
                      setReactionTriggered(false);
                    }}
                    className={`text-left p-5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#F1F0FF] dark:bg-[#1E1B3D] border-[#6C63FF] shadow-xs'
                        : 'bg-[#F8F9FA] dark:bg-[#0D0C1D] border-[#E5E2DC] dark:border-[#6C63FF]/20 hover:border-[#6C63FF]/50'
                    }`}
                  >
                    <span className="font-mono text-xs font-bold text-[#6C63FF] dark:text-[#A39DFF] block">
                      {isEn ? `EXPERIMENT 0${idx + 1}` : `THÍ NGHIỆM 0{idx + 1}`}
                    </span>
                    <span className="font-display text-sm sm:text-base font-bold text-[#1F1F2E] dark:text-white mt-1 block">
                      {isEn ? lab.titleEn : lab.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Simulation Panel */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#F4F2EE] dark:bg-[#0D0C1D] border border-[#E5E2DC] dark:border-[#6C63FF]/30 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono font-bold text-[#0284C7] dark:text-[#38BDF8] block">
                    {isEn
                      ? 'CORE CHEMICAL REACTION EQUATION:'
                      : 'PHƯƠNG TRÌNH HÓA HỌC TRỌNG TÂM:'}
                  </span>
                  <code className="font-mono text-sm sm:text-base font-bold text-[#1F1F2E] dark:text-white mt-1 block">
                    {LAB_TOUR_SIMULATIONS[activeLabIdx].equation}
                  </code>
                </div>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setReactionTriggered(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full google-one-chem-btn text-xs sm:text-sm font-semibold text-white cursor-pointer"
                >
                  <Flame className="w-4 h-4" />
                  <span>
                    {reactionTriggered
                      ? isEn
                        ? 'Experimental Reaction Triggered'
                        : 'Đã Kích Hoạt Phản Ứng Thực Nghiệm'
                      : isEn
                      ? 'Trigger Experimental Reaction'
                      : 'Kích Hoạt Phản Ứng Thử Nghiệm'}
                  </span>
                </motion.button>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-[#16142E] border border-[#E5E2DC] dark:border-[#6C63FF]/25 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#0D9488] dark:text-[#34D399]">
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {isEn ? 'COLOR TRANSITION: ' : 'HIỆN TƯỢNG CHUYỂN MÀU: '}
                    {isEn
                      ? LAB_TOUR_SIMULATIONS[activeLabIdx].colorTransitionEn
                      : LAB_TOUR_SIMULATIONS[activeLabIdx].colorTransition}
                  </span>
                </div>
                <p className="text-sm text-[#4A4A68] dark:text-[#CBD5E1] leading-relaxed">
                  {isEn
                    ? LAB_TOUR_SIMULATIONS[activeLabIdx].observationEn
                    : LAB_TOUR_SIMULATIONS[activeLabIdx].observation}
                </p>
                <p className="text-xs font-mono text-[#6C63FF] dark:text-[#A39DFF] pt-1">
                  {isEn ? 'Lab Safety Note: ' : 'Lưu ý an toàn Lab: '}
                  {isEn
                    ? LAB_TOUR_SIMULATIONS[activeLabIdx].safetyTipEn
                    : LAB_TOUR_SIMULATIONS[activeLabIdx].safetyTip}
                </p>
              </div>
            </div>
          </div>
        ) : project.slug ===
          'du-an-preorder-valentine-va-san-pham-hoa-hoc' ? (
          /* CASE 4: PREORDER VALENTINE MOLECULAR COLLECTION EXPLORER */
          <div className="bg-white dark:bg-[#16142E] rounded-[32px] p-6 sm:p-10 border border-[#E5E2DC] dark:border-[#6C63FF]/35 shadow-sm space-y-8">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#E11D48] dark:text-[#FB7185]">
                <Gift className="w-4 h-4" />
                <span>
                  {isEn
                    ? 'EXPLORE APPLIED CHEMISTRY COLLECTION · VALENTINE GEN 6'
                    : 'KHÁM PHÁ BỘ SƯU TẬP HÓA HỌC ỨNG DỤNG · VALENTINE GEN 6'}
                </span>
              </div>
              <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-[#1F1F2E] dark:text-white">
                {displayTitle}
              </h1>
              <p className="text-sm sm:text-base text-[#4A4A68] dark:text-[#CBD5E1] leading-relaxed">
                {isEn
                  ? 'Explore the molecular structures and chemical principles behind each handcrafted item in the BWAN CLUB Valentine Preorder campaign (Jan – Feb 2027).'
                  : 'Khám phá cấu trúc phân tử và nguyên lý Hóa học đằng sau từng sản phẩm thủ công trong chiến dịch Preorder Valentine (Tháng 01 – 02/2027) của BWAN CLUB.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {VALENTINE_CHEM_PRODUCTS.map((item, idx) => {
                const isSelected = selectedProductIdx === idx;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedProductIdx(idx)}
                    className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#F1F0FF] dark:bg-[#1E1B3D] border-[#6C63FF] shadow-sm'
                        : 'bg-[#F8F9FA] dark:bg-[#0D0C1D] border-[#E5E2DC] dark:border-[#6C63FF]/25'
                    }`}
                  >
                    <div className="space-y-2.5">
                      <span className="text-xs font-mono font-bold text-[#6C63FF] dark:text-[#A39DFF] block">
                        {isEn ? `PRODUCT 0${idx + 1}` : `SẢN PHẨM 0${idx + 1}`}
                      </span>
                      <h3 className="font-display text-lg font-bold text-[#1F1F2E] dark:text-white">
                        {isEn ? item.nameEn : item.name}
                      </h3>
                      <code className="text-xs font-mono font-semibold text-[#0284C7] dark:text-[#38BDF8] block">
                        {item.formula}
                      </code>
                      <p className="text-xs sm:text-sm text-[#4A4A68] dark:text-[#CBD5E1] leading-relaxed">
                        {isEn ? item.detailEn : item.detail}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#DFDBD2] dark:border-[#6C63FF]/20 text-xs font-mono font-bold text-[#0D9488] dark:text-[#34D399]">
                      ✦ {isEn ? item.highlightEn : item.highlight}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* CASE 5: TIẾP SỨC MÙA THI & BWAN CAMP 2027 / GENERAL PROJECT INTERACTIVE VIEW */
          <div className="bg-white dark:bg-[#16142E] rounded-[32px] p-6 sm:p-10 border border-[#E5E2DC] dark:border-[#6C63FF]/35 shadow-sm space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#6C63FF] dark:text-[#A39DFF]">
              <Compass className="w-4 h-4" />
              <span>
                {isEn
                  ? 'ONLINE PROJECT EXPERIENCE PORTAL · BWAN CLUB GEN 6'
                  : 'KHÔNG GIAN TRẢI NGHIỆM DỰ ÁN TRỰC TUYẾN · BWAN CLUB GEN 6'}
              </span>
            </div>

            <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-[#1F1F2E] dark:text-white">
              {displayTitle}
            </h1>

            <p className="text-sm sm:text-base text-[#4A4A68] dark:text-[#CBD5E1] leading-relaxed">
              {displaySummary}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-5 rounded-2xl bg-[#F4F2EE] dark:bg-[#0D0C1D] border border-[#E5E2DC] dark:border-[#6C63FF]/25">
                <span className="text-xs font-mono font-bold text-[#0284C7] dark:text-[#38BDF8] block">
                  {isEn
                    ? 'CORE CHEMICAL THEME & EQUATION'
                    : 'CHỦ ĐỀ HÓA HỌC & PHƯƠNG TRÌNH TRỌNG TÂM'}
                </span>
                <p className="font-mono text-sm sm:text-base font-bold text-[#1F1F2E] dark:text-white mt-1">
                  {displayTheme}
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-[#F4F2EE] dark:bg-[#0D0C1D] border border-[#E5E2DC] dark:border-[#6C63FF]/25">
                <span className="text-xs font-mono font-bold text-[#D97706] dark:text-[#FBBF24] block">
                  {isEn
                    ? 'PARTICIPANT EXPERIENCE HIGHLIGHT'
                    : 'DẤU ẤN TRẢI NGHIỆM DÀNH CHO NGƯỜI THAM GIA'}
                </span>
                <p className="font-mono text-sm sm:text-base font-bold text-[#1F1F2E] dark:text-white mt-1">
                  {displayMetric} · {project.semester}
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#ECFDF5] dark:bg-[#064E3B]/30 border border-[#99F6E4] dark:border-[#34D399]/30 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#0D9488] dark:text-[#34D399] shrink-0" />
              <p className="text-xs sm:text-sm text-[#065F46] dark:text-[#A7F3D0] font-medium">
                {isEn ? (
                  <>
                    You are viewing the participant experience portal for{' '}
                    <strong>{displayTitle}</strong>. You can also explore{' '}
                    <strong>
                      “Which Element Are You?” (18 Personality Elements)
                    </strong>{' '}
                    and the <strong>3D Molecular Studio</strong> from the
                    Projects list!
                  </>
                ) : (
                  <>
                    Bạn đang ở trang trải nghiệm trực tuyến dành cho người tham
                    gia của dự án <strong>{displayTitle}</strong>. Bạn cũng có
                    thể thử nghiệm ngay bài trắc nghiệm{' '}
                    <strong>
                      “Bạn là nguyên tố nào?” (18 Nguyên tố nhân cách)
                    </strong>{' '}
                    tại danh sách Dự án!
                  </>
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
