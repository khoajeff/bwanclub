import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  FlaskConical,
  Sparkles,
  CheckCircle2,
  RotateCcw,
  Atom,
  Flame,
  Gift,
  Compass,
  Grid,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ClubProjectItem } from '../utils/chemistryEngine';
import { BwanHexLogo } from './BwanHexLogo';
import { AppLanguage } from './Navbar';

interface ProjectExperiencePageProps {
  project: ClubProjectItem;
  onBackToProjects: () => void;
  lang: AppLanguage;
}

interface PersonalityElementProfile {
  symbol: string;
  atomicNumber: number;
  name: string;
  archetype: string;
  divisionMatch: string;
  colorClass: string;
  formulaReaction: string;
  traits: string[];
  description: string;
}

const EIGHTEEN_ELEMENTS_CATALOG: PersonalityElementProfile[] = [
  {
    symbol: 'Ne',
    atomicNumber: 10,
    name: 'Neon (Khí Hiếm Sáng Tạo)',
    archetype: 'Người Truyền Cảm Hứng Thị Giác & Ý Tưởng Mới',
    divisionMatch: 'Ban Kỹ Thuật (Truyền thông, Media, Design)',
    colorClass: 'from-[#6C63FF] to-[#38BDF8]',
    formulaReaction: 'Ne* (Kích thích quang học) → Ne + hν (Ánh sáng Đỏ-Cam rực rỡ)',
    traits: ['Sáng tạo đột phá', 'Tư duy thẩm mỹ', 'Tỏa sáng độc lập'],
    description:
      'Giống như khí hiếm Neon phát sáng rực rỡ trong ống phóng điện, bạn sở hữu nguồn năng lượng sáng tạo độc bản, nhạy bén với hình ảnh, ngôn từ và luôn tạo ra dấu ấn khác biệt trong mọi dự án của BWAN CLUB.',
  },
  {
    symbol: 'Pt',
    atomicNumber: 78,
    name: 'Platinum (Xúc Tác Bạch Kim)',
    archetype: 'Nhà Tư Duy Học Thuật & Thực Nghiệm Chuẩn Xác',
    divisionMatch: 'Ban Nội Dung & Học Thuật Hóa Học',
    colorClass: 'from-[#0284C7] to-[#6366F1]',
    formulaReaction: '2H₂ + O₂ —(Pt xúc tác)→ 2H₂O + ΔH (Tối ưu hóa năng lượng hoạt hóa)',
    traits: ['Tư duy logic sâu', 'Chuẩn xác thực nghiệm', 'Bền bỉ trước áp lực'],
    description:
      'Như chất xúc tác Bạch kim quý giá làm giảm năng lượng hoạt hóa cho những phản ứng khó nhằn nhất, bạn là trái tim học thuật của tinh thần “LEARN NOT STUDY” — luôn tìm kiếm bản chất thật sự phía sau mọi hiện tượng.',
  },
  {
    symbol: 'Au',
    atomicNumber: 79,
    name: 'Aurum (Vàng Kết Nối Bền Vững)',
    archetype: 'Nhà Lãnh Đạo Ngoại Giao & Gắn Kết Tập Thể',
    divisionMatch: 'Ban Đối Ngoại & Ban Chủ Nhiệm',
    colorClass: 'from-[#D97706] to-[#F59E0B]',
    formulaReaction: '[Au(CN)₂]⁻ + e⁻ → Au (Bền vững tuyệt đối trước mọi tác nhân oxy hóa)',
    traits: ['Giao tiếp thuyết phục', 'Bản lĩnh dẫn dắt', 'Kết nối bền vững'],
    description:
      'Mang bản chất của kim loại Vàng (Au · 79) không bị oxy hóa theo thời gian, bạn có khả năng kết nối con người, dẫn dắt tập thể vượt qua thử thách và xây dựng những mối quan hệ đối tác vững chắc.',
  },
  {
    symbol: 'Fe',
    atomicNumber: 26,
    name: 'Ferrum (Nền Tảng Bản Lĩnh Thép)',
    archetype: 'Người Kiến Tạo Hệ Thống & Hậu Cần Vững Chắc',
    divisionMatch: 'Ban Hậu Cần (Tiểu ban Nhân sự & Tiểu ban Tài chính)',
    colorClass: 'from-[#0D9488] to-[#10B981]',
    formulaReaction: 'Fe₃O₄ + 4CO → 3Fe + 4CO₂ (Tôi luyện khung xương thép kiên cố)',
    traits: ['Kỷ luật & chu toàn', 'Quản trị nguồn lực', 'Điểm tựa đáng tin cậy'],
    description:
      'Sắt (Fe · 26) là nguyên tố có độ bền liên kết hạt nhân cao bậc nhất vũ trụ. Bạn chính là trụ cột vận hành thầm lặng nhưng không thể thay thế, giúp mọi sự kiện lớn nhỏ diễn ra trơn tru và chuẩn xác.',
  },
  {
    symbol: 'Si',
    atomicNumber: 14,
    name: 'Silicon (Bán Dẫn Công Nghệ Số)',
    archetype: 'Kiến Trúc Sư Hệ Thống & Đổi Mới Số Hóa',
    divisionMatch: 'Ban Kỹ Thuật · Nền Tảng Số',
    colorClass: 'from-[#4F46E5] to-[#06B6D4]',
    formulaReaction: 'SiO₂ + 2C → Si (Tinh khiết bán dẫn 99.9999%) + 2CO',
    traits: ['Tư duy cấu trúc', 'Nhạy bén công nghệ', 'Giải quyết vấn đề nhanh'],
    description:
      'Với 4 electron hóa trị tạo mạng tinh thể kim cương bền vững, bạn kết hợp hoàn hảo giữa tư duy khoa học tự nhiên và công nghệ hiện đại để hiện thực hóa các ý tưởng số hóa của BWAN CLUB Gen 6.',
  },
  {
    symbol: 'Cu',
    atomicNumber: 29,
    name: 'Cuprum (Dẫn Truyền Nhiệt Huyết)',
    archetype: 'Người Khuấy Động Không Khí & Truyền Lửa Thực Nghiệm',
    divisionMatch: 'Ban Nội Dung & Sự Kiện BWAN CAMP',
    colorClass: 'from-[#E11D48] to-[#F97316]',
    formulaReaction: '[Cu(NH₃)₄]²⁺ (Sắc xanh Schweizer đặc trưng lan tỏa năng lượng)',
    traits: ['Nhiệt huyết bùng nổ', 'Thân thiện & cởi mở', 'Dẫn truyền năng lượng'],
    description:
      'Đồng (Cu · 29) dẫn điện và dẫn nhiệt xuất sắc, tạo nên những phức chất có màu sắc tuyệt đẹp. Bạn luôn mang lại sự ấm áp, gắn kết mọi thành viên trong các buổi Lab Tour và BWAN CAMP.',
  },
];

const EXTRA_PERIODIC_BADGES = [
  { symbol: 'H · 1', label: 'Khởi nguyên Năng lượng' },
  { symbol: 'He · 2', label: 'Điềm tĩnh Thanh cao' },
  { symbol: 'C · 6', label: 'Đa dạng Liên kết' },
  { symbol: 'N · 7', label: 'Cân bằng Nội tại' },
  { symbol: 'O · 8', label: 'Ngọn lửa Nhiệt huyết' },
  { symbol: 'Na · 11', label: 'Phản ứng Nhạy bén' },
  { symbol: 'Mg · 12', label: 'Ánh sáng Bùng nổ' },
  { symbol: 'Al · 13', label: 'Linh hoạt Bền nhẹ' },
  { symbol: 'P · 15', label: 'Phát quang Đêm tối' },
  { symbol: 'S · 16', label: 'Cá tính Độc đáo' },
  { symbol: 'Ti · 22', label: 'Ý chí Titan' },
  { symbol: 'Ag · 47', label: 'Phản chiếu Tinh tế' },
];

const PERSONALITY_QUIZ_STEPS = [
  {
    stepCode: '01 Tính cách',
    question:
      'Khi bước vào một buổi thực nghiệm Hóa học hoặc dự án mới tại BWAN CLUB, phản xạ tự nhiên đầu tiên của bạn là gì?',
    options: [
      {
        label: 'Quan sát sắc thái màu sắc, góc máy và nghĩ ngay cách biến buổi thí nghiệm thành câu chuyện thị giác ấn tượng.',
        elementIdx: 0, // Ne
      },
      {
        label: 'Đọc kỹ cơ chế phản ứng, kiểm tra nồng độ hóa chất và đặt câu hỏi “Tại sao hiện tượng này xảy ra?”.',
        elementIdx: 1, // Pt
      },
      {
        label: 'Bắt chuyện, kết nối mọi người trong nhóm và khuấy động tinh thần làm việc chung.',
        elementIdx: 2, // Au
      },
      {
        label: 'Kiểm tra danh sách dụng cụ, phân chia thời gian và đảm bảo an toàn phòng Lab cho cả đội.',
        elementIdx: 3, // Fe
      },
    ],
  },
  {
    stepCode: '02 Tư duy',
    question:
      'Khi gặp một phản ứng thực nghiệm không ra kết quả như lý thuyết, bạn thường xử lý theo hướng nào?',
    options: [
      {
        label: 'Thử nghiệm một góc tiếp cận sáng tạo mới hoặc thay đổi cách trình bày để tìm điểm đột phá.',
        elementIdx: 0, // Ne
      },
      {
        label: 'Phân tích từng biến số (nhiệt độ, pH, chất xúc tác) một cách khoa học để tìm ra nguyên nhân gốc rễ.',
        elementIdx: 1, // Pt
      },
      {
        label: 'Trao đổi với các anh chị cố vấn và điều phối các thành viên cùng thảo luận giải pháp.',
        elementIdx: 2, // Au
      },
      {
        label: 'Rà soát lại quy trình chuẩn bị, định lượng hóa chất và sổ ghi chép để khắc phục có hệ thống.',
        elementIdx: 3, // Fe
      },
    ],
  },
  {
    stepCode: '03 Làm việc nhóm',
    question:
      'Trong một chiến dịch lớn như BWAN CAMP 2027 hay Preorder Valentine, đồng đội thường nhớ đến bạn với vai trò gì?',
    options: [
      {
        label: 'Người thổi hồn cho bộ nhận diện, poster, media và giao diện số hóa của chiến dịch.',
        elementIdx: 4, // Si
      },
      {
        label: 'Chuyên gia thiết kế nội dung trạm game Hóa học và câu đố học thuật “LEARN NOT STUDY”.',
        elementIdx: 1, // Pt
      },
      {
        label: 'Đại sứ kết nối khách mời, truyền lửa nhiệt huyết và giữ kết nối giữa các phân ban.',
        elementIdx: 5, // Cu
      },
      {
        label: 'Người giữ nhịp tiến độ, quản lý ngân sách – nhân sự và hậu cần chu đáo từ A đến Z.',
        elementIdx: 3, // Fe
      },
    ],
  },
  {
    stepCode: '04 Xử lý áp lực',
    question:
      'Khi thời hạn (deadline) sự kiện đang đến rất gần, nguồn năng lượng nào giúp bạn vượt qua áp lực?',
    options: [
      {
        label: 'Cảm hứng sáng tạo bùng nổ vào giờ chót giúp tạo ra những sản phẩm vượt mong đợi.',
        elementIdx: 0, // Ne
      },
      {
        label: 'Sự bình tĩnh, tập trung cao độ và chia nhỏ từng đầu việc theo tư duy hệ thống.',
        elementIdx: 4, // Si
      },
      {
        label: 'Sự đồng hành, động viên lẫn nhau và tinh thần đoàn kết của cả đại gia đình BWAN CLUB.',
        elementIdx: 2, // Au
      },
      {
        label: 'Kế hoạch dự phòng đã được chuẩn bị kỹ lưỡng từ trước cùng kỷ luật thép.',
        elementIdx: 3, // Fe
      },
    ],
  },
  {
    stepCode: '05 Phong cách sáng tạo',
    question:
      'Nếu chọn một dấu ấn cá nhân muốn để lại trong hành trình trải nghiệm cùng BWAN CLUB Gen 6, bạn sẽ chọn gì?',
    options: [
      {
        label: 'Những ấn phẩm truyền thông, thiết kế và nền tảng tương tác khiến ai nhìn vào cũng nhớ đến BWAN.',
        elementIdx: 0, // Ne
      },
      {
        label: 'Những thí nghiệm Hóa học mãn nhãn, giúp mọi người yêu Hóa bản chất thay vì học vẹt.',
        elementIdx: 1, // Pt
      },
      {
        label: 'Một cộng đồng học sinh gắn kết, nơi mọi thế hệ Gen 1 – Gen 6 luôn tự hào hướng về.',
        elementIdx: 2, // Au
      },
      {
        label: 'Một hệ thống vận hành chuyên nghiệp, minh bạch và vững mạnh cho câu lạc bộ.',
        elementIdx: 3, // Fe
      },
    ],
  },
];

const LAB_TOUR_SIMULATIONS = [
  {
    id: 'lab-1',
    title: 'Lab Tour I (15/11/2026): Chuẩn Độ Oxy Hóa – Khử & Sắc Màu Ion Kim Loại Chuyển Tiếp',
    equation: '5Fe²⁺ + MnO₄⁻ + 8H⁺ → 5Fe³⁺ + Mn²⁺ + 4H₂O',
    colorTransition: 'Không màu / Lục nhạt → Hồng tím bền (Điểm tương đương chuẩn độ)',
    observation:
      'Khi nhỏ từng giọt dung dịch KMnO₄ 0.02M từ buret xuống bình tam giác chứa FeSO₄ trong môi trường H₂SO₄ loãng, màu tím của MnO₄⁻ mất đi tức thì do bị khử thành Mn²⁺. Tại đúng điểm tương đương, chỉ 1 giọt dư KMnO₄ làm dung dịch chuyển sang sắc hồng nhạt bền trong 30 giây.',
    safetyTip: 'Sử dụng kính bảo hộ phòng Lab THPT chuyên Lê Quý Đôn, đọc vạch mặt khum trên đối với dung dịch KMnO₄ sẫm màu.',
  },
  {
    id: 'lab-2',
    title: 'Lab Tour II (17/01/2027): Phản Ứng Đồng Hồ Iốt (Iodine Clock Reaction) — Động Hóa Học',
    equation: 'H₂O₂ + 2I⁻ + 2H⁺ → I₂ + 2H₂O (Kết hợp S₂O₃²⁻ & Hồ tinh bột)',
    colorTransition: 'Trong suốt hoàn toàn → Đổi màu Xanh Đen đột ngột sau đúng Δt giây',
    observation:
      'Dung dịch giữ trạng thái trong suốt hoàn toàn trong suốt thời gian ion Thiosulfate (S₂O₃²⁻) tiêu thụ I₂ vừa sinh ra. Ngay tại khoảnh khắc S₂O₃²⁻ vừa hết, phân tử I₂ tự do lập tức tạo phức bao với Amylose trong tinh bột, làm toàn bộ cốc phản ứng chuyển sang màu xanh tím sẫm chỉ trong chớp mắt!',
    safetyTip: 'Bấm đồng hồ bấm giây chính xác khi trộn 2 cốc dung dịch để vẽ đồ thị tốc độ phản ứng theo nồng độ.',
  },
  {
    id: 'lab-3',
    title: 'Lab Tour III & WORKSHOP GEN 6 (04–05/2027): Nuôi Đơn Tinh Thể & Hóa Phát Quang Luminol',
    equation: 'C₈H₇N₃O₂ (Luminol) + H₂O₂ —([Fe(CN)₆]³⁻)→ 3-APA* → 3-APA + hν (425 nm)',
    colorTransition: 'Dung dịch trong bóng tối → Phát ánh sáng Xanh Lam lạnh (Chemiluminescence)',
    observation:
      'Năng lượng hóa học giải phóng từ quá trình oxy hóa Luminol không tỏa ra dưới dạng nhiệt mà chuyển thẳng thành photon ánh sáng bước sóng 425 nm, tạo nên hiệu ứng dòng chảy phát quang rực rỡ trong phòng tối.',
    safetyTip: 'Thực hiện trong khu vực chắn sáng của phòng Lab dưới sự hướng dẫn của Ban Nội Dung Gen 6.',
  },
];

const VALENTINE_CHEM_PRODUCTS = [
  {
    id: 'val-1',
    name: 'Nến Thơm Tinh Dầu Ester Tự Nhiên (Isoamyl Acetate & Linalool)',
    formula: 'CH₃COOCH₂CH₂CH(CH₃)₂ · C₁₀H₁₈O',
    highlight: 'Phối hương tầng đầu – tầng giữa – tầng cuối theo nhiệt độ nóng chảy sáp đậu nành',
    detail:
      'Ứng dụng nguyên lý áp suất hơi bão hòa và điểm chớp cháy của các hợp chất Ester và Terpene tự nhiên để tỏa hương dịu nhẹ, an toàn trong không gian học tập.',
  },
  {
    id: 'val-2',
    name: 'Bộ Kit Nuôi Tinh Thể CuSO₄·5H₂O & Phèn Nhôm KAl(SO₄)₂·12H₂O',
    formula: '[Cu(H₂O)₄]SO₄·H₂O (Hệ tinh thể Tam tà xanh lam bảo ngọc)',
    highlight: 'Tự tay nuôi đơn tinh thể bát diện & tam tà từ dung dịch quá bão hòa',
    detail:
      'Kèm cẩm nang giải thích đường cong độ tan theo nhiệt độ và kỹ thuật treo mầm tinh thể do Ban Nội Dung & Ban Kỹ Thuật BWAN CLUB biên soạn.',
  },
  {
    id: 'val-3',
    name: 'Thiệp Hóa Học Đổi Màu Nhiệt Sắc (Thermochromic & Phức Chất Cobalt)',
    formula: '[Co(H₂O)₆]²⁺ (Hồng dịu) ⇌ [CoCl₄]²⁻ (Xanh biển đậm) + 6H₂O',
    highlight: 'Đổi màu tức thì khi chạm tay hoặc hơ nhẹ ấm, hiện thông điệp ẩn mùa Valentine',
    detail:
      'Dựa trên nguyên lý chuyển dịch cân bằng Le Chatelier của phức chất kim loại chuyển tiếp theo nhiệt độ và độ ẩm.',
  },
];

export const ProjectExperiencePage: React.FC<ProjectExperiencePageProps> = ({
  project,
  onBackToProjects,
  lang,
}) => {
  // Interactive state for Project 01: 18 Personality Elements Test
  const [participantName, setParticipantName] = useState('');
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showPeriodicModal, setShowPeriodicModal] = useState(false);

  // Interactive state for Project 02: Lab Tour Reaction Simulator
  const [activeLabIdx, setActiveLabIdx] = useState(0);
  const [reactionTriggered, setReactionTriggered] = useState(false);

  // Interactive state for Project 03: Valentine Chemistry Collection
  const [selectedProductIdx, setSelectedProductIdx] = useState(0);

  const handleStartQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    setSelectedAnswers([]);
    setCurrentQuestionIdx(0);
    setQuizStarted(true);
  };

  const handleSelectOption = (elementIdx: number) => {
    const updated = [...selectedAnswers, elementIdx];
    setSelectedAnswers(updated);
    if (currentQuestionIdx + 1 < PERSONALITY_QUIZ_STEPS.length) {
      setCurrentQuestionIdx((prev) => prev + 1);
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers([]);
    setCurrentQuestionIdx(0);
    setQuizStarted(false);
  };

  // Compute matched element from answers
  const getMatchedElement = (): PersonalityElementProfile => {
    if (selectedAnswers.length === 0) return EIGHTEEN_ELEMENTS_CATALOG[0];
    const counts: Record<number, number> = {};
    let bestIdx = selectedAnswers[0];
    let maxCount = 0;
    for (const idx of selectedAnswers) {
      counts[idx] = (counts[idx] || 0) + 1;
      if (counts[idx] > maxCount) {
        maxCount = counts[idx];
        bestIdx = idx;
      }
    }
    return (
      EIGHTEEN_ELEMENTS_CATALOG[bestIdx] || EIGHTEEN_ELEMENTS_CATALOG[0]
    );
  };

  const isQuizCompleted =
    quizStarted && selectedAnswers.length >= PERSONALITY_QUIZ_STEPS.length;
  const matchedElement = getMatchedElement();

  return (
    <section
      data-testid="project-experience-page"
      className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto space-y-8">
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
            <span className="px-3 py-1 rounded-full bg-[#F1F0FF] dark:bg-[#6C63FF]/25 text-[#6C63FF] dark:text-[#A39DFF]">
              {project.code}
            </span>
            <span className="px-3 py-1 rounded-full bg-[#ECFDF5] dark:bg-[#064E3B]/50 text-[#0D9488] dark:text-[#34D399]">
              ● CỔNG TRẢI NGHIỆM DÀNH CHO NGƯỜI THAM GIA
            </span>
          </div>
        </div>

        {/* CASE 1: FLAGSHIP 18 PERSONALITY ELEMENTS INTERACTIVE EXPERIENCE */}
        {project.slug === 'giai-ma-18-nguyen-to-nhan-cach' ? (
          <div className="rounded-[32px] bg-[#0B0A18] text-white border border-[#6C63FF]/40 shadow-xl overflow-hidden relative">
            {/* Subtle Chemistry Grid Background */}
            <div className="px-6 py-4 bg-[#121026] border-b border-[#6C63FF]/30 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <BwanHexLogo className="w-9 h-9" />
                <div>
                  <span className="font-display text-sm sm:text-base font-extrabold tracking-tight text-white block">
                    BWAN GEN 6 — CHEMISTRY LAB
                  </span>
                  <span className="font-mono text-[11px] text-[#A39DFF] block">
                    Which Element Are You? · Interactive Personality Test
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowPeriodicModal((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#1E1B3D] hover:bg-[#6C63FF] text-xs font-mono font-bold text-[#CBD5E1] hover:text-white border border-[#6C63FF]/35 transition-colors cursor-pointer"
              >
                <Grid className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>
                  {showPeriodicModal
                    ? 'Đóng Bảng 18 Nguyên Tố'
                    : 'Bảng 18 Nguyên Tố'}
                </span>
              </button>
            </div>

            {/* Optional Collapsible 18-Element Catalog Drawer */}
            <AnimatePresence>
              {showPeriodicModal && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-[#15122E] border-b border-[#6C63FF]/30 px-6 py-6 overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-display text-sm sm:text-base font-bold text-white">
                      Danh Mục 18 Nguyên Tố Nhân Cách — BWAN CLUB Gen 6
                    </h4>
                    <span className="text-xs font-mono text-[#A39DFF]">
                      6 nhóm tính cách chủ đạo & 12 nguyên tố mở rộng
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {EIGHTEEN_ELEMENTS_CATALOG.map((el) => (
                      <div
                        key={el.symbol}
                        className="p-3.5 rounded-2xl bg-[#0D0C1D] border border-[#6C63FF]/30 space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-[#38BDF8]">
                            {el.symbol} · {el.atomicNumber}
                          </span>
                          <span className="text-[11px] font-mono text-[#A39DFF]">
                            {el.divisionMatch.split('(')[0]}
                          </span>
                        </div>
                        <p className="font-display text-sm font-bold text-white">
                          {el.name}
                        </p>
                        <p className="text-xs text-[#CBD5E1] leading-relaxed">
                          {el.archetype}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {EXTRA_PERIODIC_BADGES.map((b) => (
                      <span
                        key={b.symbol}
                        className="px-2.5 py-1 rounded-lg bg-[#0D0C1D] border border-[#6C63FF]/25 text-[11px] font-mono text-[#CBD5E1]"
                      >
                        <strong className="text-[#A39DFF]">{b.symbol}</strong>:{' '}
                        {b.label}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Interactive Card Container */}
            <div className="p-6 sm:p-10 lg:p-14 max-w-3xl mx-auto">
              {!quizStarted && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-[28px] bg-[#131129]/95 border border-[#6C63FF]/35 p-6 sm:p-10 text-center space-y-6 shadow-lg"
                >
                  <div className="flex justify-center">
                    <BwanHexLogo className="w-14 h-14" />
                  </div>

                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1E1B3D] border border-[#6C63FF]/40 text-xs font-mono font-bold text-[#A39DFF]">
                    <Atom className="w-3.5 h-3.5" />
                    <span>
                      Hệ thống giải mã 18 Nguyên tố Nhân cách — BWAN GEN 6
                    </span>
                  </div>

                  <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                    Nguyên Tố Hóa Học Nào{' '}
                    <span className="block mt-1 google-one-chem-gradient-text">
                      Đại Diện Cho Bạn?
                    </span>
                  </h1>

                  <p className="text-sm sm:text-base text-[#CBD5E1] max-w-xl mx-auto leading-relaxed">
                    Không có đáp án đúng hay sai — mỗi lựa chọn phản ánh thói
                    quen, bản năng và nguồn năng lượng tự nhiên nhất của bạn qua
                    5 chiều sâu: tính cách, tư duy, làm việc nhóm, xử lý áp lực
                    và phong cách sáng tạo.
                  </p>

                  {/* 5 Dimension Pills matching the screenshot */}
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {[
                      '01 Tính cách',
                      '02 Tư duy',
                      '03 Làm việc nhóm',
                      '04 Xử lý áp lực',
                      '05 Phong cách sáng tạo',
                    ].map((dim) => (
                      <span
                        key={dim}
                        className="px-3 py-1.5 rounded-full bg-[#1E1B3D] border border-[#6C63FF]/30 text-xs font-mono font-semibold text-[#E2E8F0]"
                      >
                        <strong className="text-[#A39DFF]">
                          {dim.slice(0, 2)}
                        </strong>
                        {dim.slice(2)}
                      </span>
                    ))}
                  </div>

                  {/* Start Form */}
                  <form
                    onSubmit={handleStartQuiz}
                    className="max-w-md mx-auto space-y-4 pt-2"
                  >
                    <div className="text-left">
                      <label
                        htmlFor="element-quiz-name"
                        className="block text-xs font-semibold text-[#CBD5E1] mb-1.5 text-center"
                      >
                        Nhập tên hoặc biệt danh của bạn (in lên thẻ kết quả):
                      </label>
                      <input
                        id="element-quiz-name"
                        data-testid="element-quiz-name-input"
                        type="text"
                        value={participantName}
                        onChange={(e) => setParticipantName(e.target.value)}
                        placeholder="VD: Minh Anh — BWAN Gen 6..."
                        className="w-full px-4 py-3 rounded-xl bg-[#0B0A18] border border-[#6C63FF]/40 text-sm text-white placeholder-[#64748B] text-center focus:outline-none focus:border-[#A39DFF]"
                      />
                    </div>

                    <motion.button
                      type="submit"
                      data-testid="start-element-quiz-btn"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.96 }}
                      className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full google-one-chem-btn text-sm sm:text-base font-bold text-white shadow-md cursor-pointer"
                    >
                      <span>Bắt Đầu Phản Ứng</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </form>
                </motion.div>
              )}

              {/* Active 5-Question Quiz Flow */}
              {quizStarted && !isQuizCompleted && (
                <motion.div
                  key={`question-${currentQuestionIdx}`}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="rounded-[28px] bg-[#131129]/95 border border-[#6C63FF]/40 p-6 sm:p-10 space-y-6"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3.5 py-1 rounded-full bg-[#6C63FF]/25 text-[#A39DFF] font-mono text-xs font-bold">
                      Chiều sâu {PERSONALITY_QUIZ_STEPS[currentQuestionIdx].stepCode}
                    </span>
                    <span className="font-mono text-xs font-bold text-[#38BDF8]">
                      Câu hỏi {currentQuestionIdx + 1} /{' '}
                      {PERSONALITY_QUIZ_STEPS.length}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-[#1E1B3D] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#6C63FF] to-[#38BDF8] transition-all duration-300"
                      style={{
                        width: `${
                          ((currentQuestionIdx + 1) /
                            PERSONALITY_QUIZ_STEPS.length) *
                          100
                        }%`,
                      }}
                    />
                  </div>

                  <h2 className="font-display text-xl sm:text-2xl font-bold text-white leading-snug">
                    {PERSONALITY_QUIZ_STEPS[currentQuestionIdx].question}
                  </h2>

                  <div className="space-y-3">
                    {PERSONALITY_QUIZ_STEPS[currentQuestionIdx].options.map(
                      (opt, idx) => (
                        <motion.button
                          key={idx}
                          type="button"
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => handleSelectOption(opt.elementIdx)}
                          className="w-full text-left p-4 rounded-2xl bg-[#1A1736] hover:bg-[#6C63FF]/25 border border-[#6C63FF]/30 hover:border-[#A39DFF] transition-all flex items-start gap-3.5 cursor-pointer"
                        >
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#6C63FF]/30 font-mono text-xs font-bold text-[#A39DFF]">
                            0{idx + 1}
                          </span>
                          <span className="text-sm sm:text-base text-[#E2E8F0] leading-relaxed">
                            {opt.label}
                          </span>
                        </motion.button>
                      )
                    )}
                  </div>
                </motion.div>
              )}

              {/* Quiz Result Card */}
              {isQuizCompleted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  data-testid="element-quiz-result-card"
                  className="rounded-[28px] bg-[#131129] border-2 border-[#6C63FF] p-6 sm:p-10 space-y-6 shadow-xl"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#6C63FF]/30 pb-4">
                    <div>
                      <span className="text-xs font-mono font-bold text-[#34D399] block">
                        ✓ HOÀN TẤT GIẢI MÃ BẢN SẮC HÓA HỌC · BWAN GEN 6
                      </span>
                      <h2 className="font-display text-xl sm:text-2xl font-extrabold text-white mt-0.5">
                        Thẻ Nguyên Tố Của:{' '}
                        <span className="text-[#A39DFF]">
                          {participantName.trim() || 'Nhà Thực Nghiệm BWAN'}
                        </span>
                      </h2>
                    </div>

                    <div className="flex h-16 w-16 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-[#6C63FF] to-[#0284C7] text-white shadow-md">
                      <span className="font-mono text-[10px] font-bold">
                        {matchedElement.atomicNumber}
                      </span>
                      <span className="font-display text-2xl font-extrabold leading-none">
                        {matchedElement.symbol}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-xs font-mono font-bold text-[#38BDF8] uppercase tracking-wider">
                      {matchedElement.archetype}
                    </div>
                    <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                      {matchedElement.name}
                    </h3>
                    <p className="text-sm sm:text-base text-[#CBD5E1] leading-relaxed">
                      {matchedElement.description}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#0B0A18] border border-[#6C63FF]/30 space-y-2">
                    <span className="text-[11px] font-mono font-bold text-[#A39DFF] block">
                      PHƯƠNG TRÌNH PHẢN ỨNG ĐẶC TRƯNG:
                    </span>
                    <code className="text-xs sm:text-sm font-mono font-bold text-[#38BDF8] block">
                      {matchedElement.formulaReaction}
                    </code>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {matchedElement.traits.map((trait) => (
                      <span
                        key={trait}
                        className="px-3.5 py-1.5 rounded-full bg-[#1E1B3D] border border-[#6C63FF]/40 text-xs font-semibold text-white"
                      >
                        ✦ {trait}
                      </span>
                    ))}
                    <span className="px-3.5 py-1.5 rounded-full bg-[#0D9488]/25 border border-[#34D399]/40 text-xs font-mono font-bold text-[#34D399]">
                      Phân ban đồng điệu: {matchedElement.divisionMatch}
                    </span>
                  </div>

                  <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-[#6C63FF]/30">
                    <button
                      type="button"
                      onClick={handleResetQuiz}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1E1B3D] hover:bg-[#6C63FF] text-xs sm:text-sm font-semibold text-white transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Thực hiện lại bài trắc nghiệm</span>
                    </button>

                    <button
                      type="button"
                      onClick={onBackToProjects}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full google-one-chem-btn text-xs sm:text-sm font-semibold text-white cursor-pointer"
                    >
                      <span>Khám phá các dự án khác</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        ) : project.slug === 'chuoi-lab-tour-noi-bo-va-workshop-gen-6' ? (
          /* CASE 2: INTERACTIVE VIRTUAL LAB TOUR & REACTION SIMULATOR */
          <div className="bg-white dark:bg-[#16142E] rounded-[32px] p-6 sm:p-10 border border-[#E5E2DC] dark:border-[#6C63FF]/35 shadow-sm space-y-8">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#0284C7] dark:text-[#38BDF8]">
                <FlaskConical className="w-4 h-4" />
                <span>TRẠM TRẢI NGHIỆM PHÒNG THÍ NGHIỆM ẢO · BWAN LAB TOUR I–III</span>
              </div>
              <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-[#1F1F2E] dark:text-white">
                {project.title}
              </h1>
              <p className="text-sm sm:text-base text-[#4A4A68] dark:text-[#CBD5E1] leading-relaxed">
                Chọn một trong 3 đợt thực nghiệm Lab Tour nội bộ để kích hoạt mô phỏng phương trình phản ứng, quan sát sự chuyển đổi màu sắc và quy trình an toàn tại phòng Lab Trường THPT chuyên Lê Quý Đôn Đà Nẵng.
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
                      THÍ NGHIỆM 0{idx + 1}
                    </span>
                    <span className="font-display text-sm sm:text-base font-bold text-[#1F1F2E] dark:text-white mt-1 block">
                      {lab.title}
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
                    PHƯƠNG TRÌNH HÓA HỌC TRỌNG TÂM:
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
                      ? 'Đã Kích Hoạt Phản Ứng Thực Nghiệm'
                      : 'Kích Hoạt Phản Ứng Thử Nghiệm'}
                  </span>
                </motion.button>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-[#16142E] border border-[#E5E2DC] dark:border-[#6C63FF]/25 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#0D9488] dark:text-[#34D399]">
                  <Sparkles className="w-4 h-4" />
                  <span>
                    HIỆN TƯỢNG CHUYỂN MÀU:{' '}
                    {LAB_TOUR_SIMULATIONS[activeLabIdx].colorTransition}
                  </span>
                </div>
                <p className="text-sm text-[#4A4A68] dark:text-[#CBD5E1] leading-relaxed">
                  {LAB_TOUR_SIMULATIONS[activeLabIdx].observation}
                </p>
                <p className="text-xs font-mono text-[#6C63FF] dark:text-[#A39DFF] pt-1">
                  Lưu ý an toàn Lab: {LAB_TOUR_SIMULATIONS[activeLabIdx].safetyTip}
                </p>
              </div>
            </div>
          </div>
        ) : project.slug ===
          'du-an-preorder-valentine-va-san-pham-hoa-hoc' ? (
          /* CASE 3: PREORDER VALENTINE MOLECULAR COLLECTION EXPLORER */
          <div className="bg-white dark:bg-[#16142E] rounded-[32px] p-6 sm:p-10 border border-[#E5E2DC] dark:border-[#6C63FF]/35 shadow-sm space-y-8">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#E11D48] dark:text-[#FB7185]">
                <Gift className="w-4 h-4" />
                <span>KHÁM PHÁ BỘ SƯU TẬP HÓA HỌC ỨNG DỤNG · VALENTINE GEN 6</span>
              </div>
              <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-[#1F1F2E] dark:text-white">
                {project.title}
              </h1>
              <p className="text-sm sm:text-base text-[#4A4A68] dark:text-[#CBD5E1] leading-relaxed">
                Khám phá cấu trúc phân tử và nguyên lý Hóa học đằng sau từng sản phẩm thủ công trong chiến dịch Preorder Valentine (Tháng 01 – 02/2027) của BWAN CLUB.
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
                        SẢN PHẨM 0{idx + 1}
                      </span>
                      <h3 className="font-display text-lg font-bold text-[#1F1F2E] dark:text-white">
                        {item.name}
                      </h3>
                      <code className="text-xs font-mono font-semibold text-[#0284C7] dark:text-[#38BDF8] block">
                        {item.formula}
                      </code>
                      <p className="text-xs sm:text-sm text-[#4A4A68] dark:text-[#CBD5E1] leading-relaxed">
                        {item.detail}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#DFDBD2] dark:border-[#6C63FF]/20 text-xs font-mono font-bold text-[#0D9488] dark:text-[#34D399]">
                      ✦ {item.highlight}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* CASE 4: TIẾP SỨC MÙA THI & BWAN CAMP 2027 / GENERAL PROJECT INTERACTIVE VIEW */
          <div className="bg-white dark:bg-[#16142E] rounded-[32px] p-6 sm:p-10 border border-[#E5E2DC] dark:border-[#6C63FF]/35 shadow-sm space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#6C63FF] dark:text-[#A39DFF]">
              <Compass className="w-4 h-4" />
              <span>KHÔNG GIAN TRẢI NGHIỆM DỰ ÁN TRỰC TUYẾN · BWAN CLUB GEN 6</span>
            </div>

            <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-[#1F1F2E] dark:text-white">
              {project.title}
            </h1>

            <p className="text-sm sm:text-base text-[#4A4A68] dark:text-[#CBD5E1] leading-relaxed">
              {project.summary}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-5 rounded-2xl bg-[#F4F2EE] dark:bg-[#0D0C1D] border border-[#E5E2DC] dark:border-[#6C63FF]/25">
                <span className="text-xs font-mono font-bold text-[#0284C7] dark:text-[#38BDF8] block">
                  CHỦ ĐỀ HÓA HỌC & PHƯƠNG TRÌNH TRỌNG TÂM
                </span>
                <p className="font-mono text-sm sm:text-base font-bold text-[#1F1F2E] dark:text-white mt-1">
                  {project.chemicalTheme}
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-[#F4F2EE] dark:bg-[#0D0C1D] border border-[#E5E2DC] dark:border-[#6C63FF]/25">
                <span className="text-xs font-mono font-bold text-[#D97706] dark:text-[#FBBF24] block">
                  DẤU ẤN TRẢI NGHIỆM DÀNH CHO NGƯỜI THAM GIA
                </span>
                <p className="font-mono text-sm sm:text-base font-bold text-[#1F1F2E] dark:text-white mt-1">
                  {project.highlightMetric} · {project.semester}
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#ECFDF5] dark:bg-[#064E3B]/30 border border-[#99F6E4] dark:border-[#34D399]/30 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#0D9488] dark:text-[#34D399] shrink-0" />
              <p className="text-xs sm:text-sm text-[#065F46] dark:text-[#A7F3D0] font-medium">
                Bạn đang ở trang trải nghiệm trực tuyến dành cho người tham gia của dự án{' '}
                <strong>{project.title}</strong>. Bạn cũng có thể thử nghiệm ngay bài trắc nghiệm{' '}
                <strong>“Bạn là nguyên tố nào?” (18 Nguyên tố nhân cách)</strong> tại danh sách Dự án!
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
