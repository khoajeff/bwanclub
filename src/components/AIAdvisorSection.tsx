import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  RotateCcw,
  Sparkles,
  Cpu,
  UserCheck,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { motion } from 'motion/react';
import { AppLanguage } from './Navbar';
import { generateBwanClubAdvisorReply } from '../utils/chemistryEngine';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  senderBadge?: string;
}

interface DirectMemberContact {
  id: string;
  name: string;
  role: string;
  division: string;
  elementBadge: string;
  statusText: string;
  welcomeNote: string;
  autoAckTemplate: (senderName: string, userMessage: string) => string;
}

interface DirectThreadMessage {
  id: string;
  from: 'visitor' | 'member';
  senderName: string;
  text: string;
  timestamp: string;
}

const QUICK_CLUB_QUESTIONS = [
  'Giới thiệu dự án 18 Nguyên Tố Nhân Cách Gen 6',
  'Lộ trình 12 tháng sự kiện của BWAN CLUB?',
  'Cơ cấu 4 phân ban và trạng thái mở đơn?',
];

const CLUB_MEMBER_CONTACTS: DirectMemberContact[] = [
  {
    id: 'tran-minh-tri',
    name: 'Trần Minh Trí',
    role: 'Đồng Chủ Nhiệm Gen 6 · Trưởng Ban Đối Ngoại',
    division: 'Ban Chủ Nhiệm & Đối Ngoại',
    elementBadge: 'Au · 79',
    statusText: 'Đang trực tuyến · Phản hồi trực tiếp',
    welcomeNote:
      'Chào bạn! Mình là Trần Minh Trí — Đồng Chủ Nhiệm BWAN CLUB Gen 6. Bạn cần trao đổi về hợp tác CLB, sự kiện BWAN CAMP 2027 hay hoạt động chung của CLB thì nhắn trực tiếp cho mình tại đây nhé!',
    autoAckTemplate: (senderName, userMessage) =>
      `Chào ${senderName}! Mình (Trần Minh Trí — Đồng Chủ Nhiệm Gen 6) đã nhận được tin nhắn của bạn: "${userMessage}". Mình đã ghi nhận vào hộp thư điều hành BWAN CLUB và sẽ phản hồi chi tiết cho bạn sớm nhất nhé!`,
  },
  {
    id: 'nguyen-minh-anh',
    name: 'Nguyễn Minh Anh',
    role: 'Đồng Chủ Nhiệm Gen 6 · Tiểu Ban Truyền Thông',
    division: 'Ban Chủ Nhiệm & Truyền Thông',
    elementBadge: 'Ne · 10',
    statusText: 'Đang trực tuyến · Phản hồi trực tiếp',
    welcomeNote:
      'Xin chào! Mình là Nguyễn Minh Anh — Đồng Chủ Nhiệm BWAN CLUB Gen 6. Nếu bạn có câu hỏi về chiến dịch truyền thông, PROJECT “Bạn là nguyên tố nào?” hay nội dung fanpage CLB, hãy nhắn cho mình nhé!',
    autoAckTemplate: (senderName, userMessage) =>
      `Cảm ơn ${senderName} đã nhắn cho mình! Mình (Nguyễn Minh Anh) đã nhận được nội dung "${userMessage}" và đang trao đổi cùng Tiểu ban Truyền thông BWAN CLUB để hỗ trợ bạn ngay.`,
  },
  {
    id: 'mai-tran-anh-khoa',
    name: 'Mai Trần Anh Khoa',
    role: 'Trưởng Ban Kỹ Thuật Gen 6',
    division: 'Ban Kỹ Thuật (Truyền thông, Media, Design)',
    elementBadge: 'Si · 14',
    statusText: 'Đang trực tuyến · Phản hồi trực tiếp',
    welcomeNote:
      'Chào bạn! Mình là Mai Trần Anh Khoa — Trưởng Ban Kỹ Thuật BWAN CLUB Gen 6. Bạn muốn góp ý về trải nghiệm các dự án trực tuyến, kỹ thuật, Media hay Design của CLB thì nhắn trực tiếp cho mình nha!',
    autoAckTemplate: (senderName, userMessage) =>
      `Chào ${senderName}! Mình (Mai Trần Anh Khoa — Ban Kỹ Thuật) đã nhận được tin nhắn "${userMessage}" của bạn. Cảm ơn bạn đã kết nối trực tiếp với Ban Kỹ Thuật BWAN CLUB!`,
  },
  {
    id: 'thai-viet-duc-phan-nhat-nam',
    name: 'Thái Việt Đức & Phan Nhật Nam',
    role: 'Điều Phối Ban Nội Dung Gen 6',
    division: 'Ban Nội Dung & Học Thuật Hóa Học',
    elementBadge: 'Pt · 78',
    statusText: 'Đang trực tuyến · Phản hồi trực tiếp',
    welcomeNote:
      'Chào bạn! Tụi mình là Thái Việt Đức & Phan Nhật Nam phụ trách Ban Nội Dung BWAN CLUB Gen 6. Bạn muốn trao đổi về thí nghiệm Lab Tour I–III, cơ chế phản ứng Hóa học hay chuyên đề “LEARN NOT STUDY” thì nhắn ngay nhé!',
    autoAckTemplate: (senderName, userMessage) =>
      `Chào ${senderName}! Ban Nội Dung (Thái Việt Đức & Phan Nhật Nam) đã nhận được câu hỏi/tin nhắn của bạn: "${userMessage}". Tụi mình sẽ đối chiếu quy trình phòng Lab THPT chuyên Lê Quý Đôn và phản hồi bạn ngay!`,
  },
  {
    id: 'nguyen-thy-anh-thu',
    name: 'Dương Phạm Nguyên Thy & Nguyễn Anh Thư',
    role: 'Điều Phối Ban Hậu Cần (Nhân Sự & Tài Chính)',
    division: 'Ban Hậu Cần',
    elementBadge: 'Fe · 26',
    statusText: 'Đang trực tuyến · Phản hồi trực tiếp',
    welcomeNote:
      'Xin chào! Tụi mình là Nguyên Thy (Tiểu ban Nhân sự) và Anh Thư (Tiểu ban Tài chính) thuộc Ban Hậu Cần BWAN CLUB Gen 6. Bạn cần hỗ trợ về đơn hàng Preorder Valentine, Quỹ Học Thuật hay công tác hậu cần sự kiện thì nhắn tụi mình nhé!',
    autoAckTemplate: (senderName, userMessage) =>
      `Chào ${senderName}! Ban Hậu Cần (Nguyên Thy & Anh Thư) đã ghi nhận tin nhắn "${userMessage}" của bạn vào sổ theo dõi Nhân sự – Tài chính BWAN CLUB Gen 6 rồi nhé!`,
  },
];

interface AIAdvisorSectionProps {
  lang: AppLanguage;
}

/**
 * Formats **bold** segments into clean <strong> elements so raw asterisks never appear in the UI.
 */
function renderFormattedMessage(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={idx} className="font-bold text-[#1F1F2E] dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

export const AIAdvisorSection: React.FC<AIAdvisorSectionProps> = ({ lang }) => {
  // 1. Local AI Language Model State (Unified Medium Thinking Level — No Model Hierarchy Selector)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'model',
      text: '[Khởi tạo Mô hình Ngôn ngữ Cục bộ · BWAN-Local-LLM | Mức tư duy: Trung bình]\nTôi là mô hình ngôn ngữ AI chạy local được huấn luyện trên cơ sở dữ liệu chính thức của **BWAN CLUB (Gen 6)** — Trường THPT chuyên Lê Quý Đôn Đà Nẵng (tôi là hệ thống AI tự động, không phải con người).\n\nBạn có thể đặt câu hỏi để tôi truy xuất dữ liệu về **4 dự án trải nghiệm trực tuyến**, **lộ trình 12 tháng**, **cơ cấu 4 phân ban** và **Quỹ Học Thuật**. Nếu muốn trò chuyện với người thật, hãy dùng khung **Nhắn Trực Tiếp Với Thành Viên CLB** ngay bên phải.',
      senderBadge: 'BWAN-Local-LLM · Mức tư duy: Trung bình',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const threadContainerRef = useRef<HTMLDivElement>(null);

  // 2. Direct Club Member Messaging State (Human-to-Human Direct Channel alongside AI)
  const [selectedMemberId, setSelectedMemberId] = useState<string>(
    CLUB_MEMBER_CONTACTS[0].id
  );
  const [visitorName, setVisitorName] = useState('');
  const [directInput, setDirectInput] = useState('');
  const [directError, setDirectError] = useState<string | null>(null);
  const [directSuccessBanner, setDirectSuccessBanner] = useState<string | null>(
    null
  );
  const [memberThreads, setMemberThreads] = useState<
    Record<string, DirectThreadMessage[]>
  >(() => {
    const initial: Record<string, DirectThreadMessage[]> = {};
    for (const member of CLUB_MEMBER_CONTACTS) {
      initial[member.id] = [
        {
          id: `init-${member.id}`,
          from: 'member',
          senderName: member.name,
          text: member.welcomeNote,
          timestamp: 'Trực tuyến · BWAN Gen 6',
        },
      ];
    }
    return initial;
  });
  const directThreadRef = useRef<HTMLDivElement>(null);

  const activeMember =
    CLUB_MEMBER_CONTACTS.find((m) => m.id === selectedMemberId) ||
    CLUB_MEMBER_CONTACTS[0];
  const currentDirectMessages = memberThreads[activeMember.id] || [];

  useEffect(() => {
    if (messages.length > 1 && threadContainerRef.current) {
      threadContainerRef.current.scrollTo({
        top: threadContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  useEffect(() => {
    if (currentDirectMessages.length > 1 && directThreadRef.current) {
      directThreadRef.current.scrollTo({
        top: directThreadRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [currentDirectMessages.length, selectedMemberId]);

  const sendMessageToLocalLLM = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed) {
      setChatError('Vui lòng nhập truy vấn trước khi gửi cho mô hình ngôn ngữ.');
      return;
    }

    setChatError(null);
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
    };

    const historyPayload = messages.map((m) => ({
      role: m.role,
      text: m.text,
    }));

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/club/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: historyPayload,
        }),
      });

      const contentType = response.headers.get('content-type') || '';
      if (response.ok && contentType.includes('application/json')) {
        const data = await response.json();
        const replyText =
          typeof data?.reply === 'string' && data.reply.trim()
            ? data.reply
            : generateBwanClubAdvisorReply(trimmed);

        const botMsg: ChatMessage = {
          id: `model-${Date.now()}`,
          role: 'model',
          text: replyText,
          senderBadge: 'BWAN-Local-LLM · Mức tư duy: Trung bình',
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 240));
        const fallbackReply = generateBwanClubAdvisorReply(trimmed);
        const botMsg: ChatMessage = {
          id: `model-${Date.now()}`,
          role: 'model',
          text: fallbackReply,
          senderBadge: 'BWAN-Local-LLM · Mức tư duy: Trung bình',
        };
        setMessages((prev) => [...prev, botMsg]);
      }
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 240));
      const fallbackReply = generateBwanClubAdvisorReply(trimmed);
      const botMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: fallbackReply,
        senderBadge: 'BWAN-Local-LLM · Mức tư duy: Trung bình',
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleAIFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessageToLocalLLM(input);
  };

  const handleDirectMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanText = directInput.trim();
    const cleanSender = visitorName.trim() || 'Bạn đọc yêu Hóa học';

    if (!cleanText) {
      setDirectError(
        `Vui lòng nhập lời nhắn để gửi trực tiếp cho ${activeMember.name}.`
      );
      return;
    }

    setDirectError(null);
    const nowTime = new Date().toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const visitorMsg: DirectThreadMessage = {
      id: `vis-${Date.now()}`,
      from: 'visitor',
      senderName: cleanSender,
      text: cleanText,
      timestamp: `Vừa xong (${nowTime})`,
    };

    const memberReplyMsg: DirectThreadMessage = {
      id: `mem-${Date.now() + 1}`,
      from: 'member',
      senderName: activeMember.name,
      text: activeMember.autoAckTemplate(cleanSender, cleanText),
      timestamp: `Phản hồi trực tiếp (${nowTime})`,
    };

    setMemberThreads((prev) => ({
      ...prev,
      [activeMember.id]: [
        ...(prev[activeMember.id] || []),
        visitorMsg,
        memberReplyMsg,
      ],
    }));

    setDirectInput('');
    setDirectSuccessBanner(
      `Đã chuyển tin nhắn trực tiếp tới ${activeMember.name} (${activeMember.division}).`
    );
  };

  return (
    <section
      id="tro-ly-clb"
      className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-transparent transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl">
          <p className="text-xs font-mono font-bold text-[#6C63FF] dark:text-[#A39DFF] uppercase tracking-wider">
            {lang === 'vi'
              ? 'TRUNG TÂM TRUY VẤN AI LOCAL & KẾT NỐI TRỰC TIẾP THÀNH VIÊN CLB'
              : 'LOCAL AI LANGUAGE MODEL & DIRECT CLUB MEMBER MESSAGING'}
          </p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-[#1F1F2E] dark:text-white tracking-tight text-balance">
            {lang === 'vi'
              ? 'Chat Với Mô Hình AI Local & '
              : 'Local AI Model & '}
            <span className="google-one-chem-gradient-text">
              {lang === 'vi'
                ? 'Nhắn Trực Tiếp Thành Viên BWAN CLUB'
                : 'Direct BWAN CLUB Member Chat'}
            </span>
          </h2>
          <p className="mt-2.5 text-sm sm:text-base text-[#4A4A68] dark:text-[#CBD5E1] leading-relaxed">
            {lang === 'vi'
              ? 'Tra cứu tức thì dữ liệu câu lạc bộ thông qua mô hình ngôn ngữ chạy local BWAN-Local-LLM (vận hành thống nhất ở mức độ tư duy trung bình), hoặc chuyển sang khung bên cạnh để nhắn tin trực tiếp với từng thành viên Ban Quản Lý BWAN CLUB Gen 6.'
              : 'Query club data via our local language model BWAN-Local-LLM (unified medium thinking level), or message BWAN CLUB Gen 6 board members directly alongside it.'}
          </p>
        </div>

        {/* Side-by-Side Dual Communication Grid: Left = Local LLM AI Chatbox | Right = Direct Club Member Messaging */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* COLUMN 1 (7 Cols): LOCAL AI LANGUAGE MODEL CHATBOX */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 bg-white/95 dark:bg-[#16142E]/95 backdrop-blur-md rounded-[32px] border border-[#E5E2DC] dark:border-[#6C63FF]/35 overflow-hidden shadow-sm flex flex-col justify-between"
          >
            {/* Top Bar — Local LLM Identity & Unified Medium Thinking Indicator */}
            <div className="px-6 py-4 bg-white dark:bg-[#121026] border-b border-[#E5E2DC] dark:border-[#6C63FF]/25 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1F0FF] dark:bg-[#6C63FF]/25 text-[#6C63FF] dark:text-[#A39DFF]">
                  <Cpu className="w-5 h-5" />
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-sm sm:text-base font-bold text-[#1F1F2E] dark:text-white">
                      BWAN-Local-LLM (Mô Hình Ngôn Ngữ AI)
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#F1F0FF] dark:bg-[#6C63FF]/25 text-[#6C63FF] dark:text-[#A39DFF] font-mono text-[10px] font-bold">
                      Mức tư duy: Trung bình
                    </span>
                  </div>
                  <p className="text-xs text-[#5F6368] dark:text-[#94A3B8]">
                    Mô hình ngôn ngữ chạy local · Trả lời tự động dựa trên dữ liệu BWAN CLUB
                  </p>
                </div>
              </div>

              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  setChatError(null);
                  setMessages([
                    {
                      id: 'welcome-reset',
                      role: 'model',
                      text: '[Làm mới Bộ nhớ Ngữ cảnh · BWAN-Local-LLM | Mức tư duy: Trung bình]\nBộ nhớ ngữ cảnh cục bộ đã được đặt lại. Hãy nhập câu hỏi về dự án trải nghiệm, lộ trình 12 tháng hoặc cơ cấu 4 phân ban của **BWAN CLUB**.',
                      senderBadge: 'BWAN-Local-LLM · Mức tư duy: Trung bình',
                    },
                  ]);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F1F0FF] dark:bg-[#6C63FF]/25 hover:bg-[#E5E3FF] text-xs font-semibold text-[#6C63FF] dark:text-[#A39DFF] cursor-pointer whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Đặt lại ngữ cảnh</span>
              </motion.button>
            </div>

            {/* Scrollable AI Message Thread */}
            <div
              ref={threadContainerRef}
              data-testid="club-chat-thread"
              className="p-6 space-y-4 max-h-[380px] min-h-[320px] overflow-y-auto flex-1"
            >
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className={`flex flex-col ${
                    msg.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-xl rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                      msg.role === 'user'
                        ? 'bg-[#6C63FF] text-white font-medium shadow-xs'
                        : 'bg-[#F4F2EE] dark:bg-[#1E1B3D] text-[#1F1F2E] dark:text-white border border-[#E5E2DC] dark:border-[#6C63FF]/25 shadow-2xs'
                    }`}
                  >
                    {msg.role === 'user'
                      ? msg.text
                      : renderFormattedMessage(msg.text)}
                  </div>
                  <span className="mt-1 text-[11px] font-mono font-medium text-[#5F6368] dark:text-[#94A3B8]">
                    {msg.role === 'user'
                      ? 'Truy vấn của bạn'
                      : msg.senderBadge ||
                        'BWAN-Local-LLM · Mức tư duy: Trung bình'}
                  </span>
                </motion.div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#6C63FF] dark:text-[#A39DFF]">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>
                    BWAN-Local-LLM đang suy luận (Mức tư duy: Trung bình)...
                  </span>
                </div>
              )}
            </div>

            {/* Quick Question Prompts + AI Input Form */}
            <div className="p-5 bg-white dark:bg-[#121026] border-t border-[#E5E2DC] dark:border-[#6C63FF]/25 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                {QUICK_CLUB_QUESTIONS.map((q) => (
                  <motion.button
                    key={q}
                    type="button"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => sendMessageToLocalLLM(q)}
                    className="text-xs px-3.5 py-1.5 rounded-full bg-[#F1F0FF] dark:bg-[#6C63FF]/20 hover:bg-[#6C63FF] hover:text-white text-[#6C63FF] dark:text-[#A39DFF] font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    {q}
                  </motion.button>
                ))}
              </div>

              {chatError && (
                <p
                  role="alert"
                  className="text-xs text-[#DC2626] dark:text-[#F87171] font-semibold"
                >
                  {chatError}
                </p>
              )}

              <form
                onSubmit={handleAIFormSubmit}
                className="flex items-center gap-3"
              >
                <label htmlFor="club-chat-input" className="sr-only">
                  Nhập truy vấn cho mô hình ngôn ngữ BWAN-Local-LLM
                </label>
                <input
                  id="club-chat-input"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Nhập câu hỏi cho mô hình ngôn ngữ local BWAN-Local-LLM..."
                  className="flex-1 px-4 py-3 rounded-full bg-[#F8F9FA] dark:bg-[#0D0C1D] border border-[#DBD8D0] dark:border-[#6C63FF]/35 text-sm text-[#1F1F2E] dark:text-white placeholder-[#9CA3AF] focus:outline-none focus:border-[#6C63FF] transition-colors"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full google-one-chem-btn text-sm font-semibold disabled:opacity-60 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span>Gửi tin nhắn</span>
                  <Send className="w-4 h-4" />
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* COLUMN 2 (5 Cols): DIRECT MESSAGING WITH REAL BWAN CLUB MEMBERS */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.45,
              delay: 0.06,
              ease: [0.22, 1, 0.36, 1],
            }}
            data-testid="direct-member-chat-panel"
            className="lg:col-span-5 bg-white/95 dark:bg-[#16142E]/95 backdrop-blur-md rounded-[32px] border border-[#E5E2DC] dark:border-[#6C63FF]/35 overflow-hidden shadow-sm flex flex-col justify-between"
          >
            {/* Header — Direct Human Member Connection */}
            <div className="px-6 py-4 bg-white dark:bg-[#121026] border-b border-[#E5E2DC] dark:border-[#6C63FF]/25 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1F0FF] dark:bg-[#6C63FF]/25 text-[#6C63FF] dark:text-[#A39DFF]">
                    <Users className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-sm sm:text-base font-bold text-[#1F1F2E] dark:text-white">
                      Nhắn Trực Tiếp Với Thành Viên CLB
                    </h3>
                    <p className="text-xs text-[#5F6368] dark:text-[#94A3B8]">
                      Kết nối trực tiếp với Ban Quản Lý BWAN CLUB Gen 6
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ECFDF5] dark:bg-[#064E3B]/50 text-[#0D9488] dark:text-[#34D399] font-mono text-[10px] font-bold shrink-0">
                  ● Con người thật
                </span>
              </div>

              {/* Member Selector Pills */}
              <div>
                <label
                  htmlFor="direct-member-select"
                  className="block text-[11px] font-mono font-semibold text-[#5F6368] dark:text-[#94A3B8] mb-1.5"
                >
                  Chọn thành viên BWAN CLUB bạn muốn nhắn trực tiếp:
                </label>
                <select
                  id="direct-member-select"
                  data-testid="direct-member-select"
                  value={selectedMemberId}
                  onChange={(e) => {
                    setSelectedMemberId(e.target.value);
                    setDirectSuccessBanner(null);
                    setDirectError(null);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F9FA] dark:bg-[#0D0C1D] border border-[#DBD8D0] dark:border-[#6C63FF]/35 text-xs sm:text-sm font-semibold text-[#1F1F2E] dark:text-white focus:outline-none focus:border-[#6C63FF]"
                >
                  {CLUB_MEMBER_CONTACTS.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name} — {member.role} ({member.elementBadge})
                    </option>
                  ))}
                </select>
              </div>

              {/* Active Member Mini Card */}
              <div className="flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-[#F4F2EE] dark:bg-[#1E1B3D] border border-[#E5E2DC] dark:border-[#6C63FF]/20">
                <div className="flex items-center gap-2 min-w-0">
                  <UserCheck className="w-4 h-4 text-[#0D9488] dark:text-[#34D399] shrink-0" />
                  <div className="truncate">
                    <span className="text-xs font-bold text-[#1F1F2E] dark:text-white block truncate">
                      {activeMember.name}
                    </span>
                    <span className="text-[11px] text-[#5F6368] dark:text-[#94A3B8] block truncate">
                      {activeMember.statusText}
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-[#6C63FF]/15 dark:bg-[#6C63FF]/30 text-[#6C63FF] dark:text-[#A39DFF] font-mono text-[10px] font-bold shrink-0">
                  {activeMember.elementBadge}
                </span>
              </div>
            </div>

            {/* Direct Member Conversation Thread */}
            <div
              ref={directThreadRef}
              data-testid="direct-member-thread"
              className="p-5 space-y-3.5 max-h-[290px] min-h-[240px] overflow-y-auto flex-1"
            >
              {currentDirectMessages.map((dm) => (
                <div
                  key={dm.id}
                  className={`flex flex-col ${
                    dm.from === 'visitor' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-md rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                      dm.from === 'visitor'
                        ? 'bg-[#6C63FF] text-white font-medium shadow-xs'
                        : 'bg-[#F4F2EE] dark:bg-[#1E1B3D] text-[#1F1F2E] dark:text-white border border-[#E5E2DC] dark:border-[#6C63FF]/25'
                    }`}
                  >
                    {dm.text}
                  </div>
                  <span className="mt-1 text-[10px] font-mono text-[#5F6368] dark:text-[#94A3B8]">
                    {dm.senderName} · {dm.timestamp}
                  </span>
                </div>
              ))}
            </div>

            {/* Direct Member Input Form */}
            <form
              onSubmit={handleDirectMemberSubmit}
              className="p-5 bg-white dark:bg-[#121026] border-t border-[#E5E2DC] dark:border-[#6C63FF]/25 space-y-2.5"
            >
              {directSuccessBanner && (
                <div
                  role="status"
                  className="flex items-center gap-2 text-xs text-[#0D9488] dark:text-[#34D399] bg-[#F0FDFA] dark:bg-[#064E3B]/40 border border-[#99F6E4] dark:border-[#34D399]/30 px-3 py-2 rounded-xl font-semibold"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{directSuccessBanner}</span>
                </div>
              )}

              {directError && (
                <p
                  role="alert"
                  className="text-xs text-[#DC2626] dark:text-[#F87171] font-semibold"
                >
                  {directError}
                </p>
              )}

              <div>
                <label htmlFor="visitor-direct-name" className="sr-only">
                  Tên hoặc lớp của bạn
                </label>
                <input
                  id="visitor-direct-name"
                  type="text"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  placeholder="Tên / Lớp của bạn (VD: Minh Khoa - 10A2)..."
                  className="w-full px-3.5 py-2.5 rounded-full bg-[#F8F9FA] dark:bg-[#0D0C1D] border border-[#DBD8D0] dark:border-[#6C63FF]/35 text-xs sm:text-sm text-[#1F1F2E] dark:text-white placeholder-[#9CA3AF] focus:outline-none focus:border-[#6C63FF]"
                />
              </div>

              <div className="flex items-center gap-3">
                <label htmlFor="direct-member-input" className="sr-only">
                  Nội dung nhắn trực tiếp cho thành viên CLB
                </label>
                <input
                  id="direct-member-input"
                  data-testid="direct-member-input"
                  type="text"
                  value={directInput}
                  onChange={(e) => setDirectInput(e.target.value)}
                  placeholder={`Nhắn trực tiếp cho ${activeMember.name}...`}
                  className="flex-1 px-4 py-3 rounded-full bg-[#F8F9FA] dark:bg-[#0D0C1D] border border-[#DBD8D0] dark:border-[#6C63FF]/35 text-sm text-[#1F1F2E] dark:text-white placeholder-[#9CA3AF] focus:outline-none focus:border-[#6C63FF]"
                />
                <motion.button
                  type="submit"
                  data-testid="direct-member-send-btn"
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full google-one-chem-btn text-sm font-semibold cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span>Gửi tin nhắn</span>
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
