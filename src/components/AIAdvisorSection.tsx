import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  RotateCcw,
  Sparkles,
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
  roleEn: string;
  division: string;
  divisionEn: string;
  elementBadge: string;
  statusText: string;
  statusTextEn: string;
  welcomeNote: string;
  welcomeNoteEn: string;
  autoAckTemplate: (
    senderName: string,
    userMessage: string,
    lang: AppLanguage
  ) => string;
}

interface DirectThreadMessage {
  id: string;
  from: 'visitor' | 'member';
  senderName: string;
  text: string;
  textEn?: string;
  timestamp: string;
  timestampEn?: string;
}

const QUICK_CLUB_QUESTIONS_VI = [
  'Giới thiệu các dự án trải nghiệm trực tuyến của BWAN CLUB Gen 6',
  'Lộ trình 12 tháng sự kiện của BWAN CLUB có những gì?',
  'Cơ cấu 4 phân ban và thông tin mở đơn của CLB?',
];

const QUICK_CLUB_QUESTIONS_EN = [
  'Introduce BWAN CLUB Gen 6 interactive online projects',
  'What is in the 12-month event roadmap of BWAN CLUB?',
  'Tell me about the 4 divisions and recruitment status',
];

const CLUB_MEMBER_CONTACTS: DirectMemberContact[] = [
  {
    id: 'tran-minh-tri',
    name: 'Trần Minh Trí',
    role: 'Đồng Chủ Nhiệm Gen 6 · Trưởng Ban Đối Ngoại',
    roleEn: 'Gen 6 Co-President · Head of External Relations',
    division: 'Ban Chủ Nhiệm & Đối Ngoại',
    divisionEn: 'Executive Board & External Relations',
    elementBadge: 'Au · 79',
    statusText: 'Đang trực tuyến · Phản hồi trực tiếp',
    statusTextEn: 'Online · Direct response',
    welcomeNote:
      'Chào bạn! Mình là Trần Minh Trí — Đồng Chủ Nhiệm BWAN CLUB Gen 6. Bạn cần trao đổi về hợp tác CLB, sự kiện BWAN CAMP 2027 hay hoạt động chung của CLB thì nhắn trực tiếp cho mình tại đây nhé!',
    welcomeNoteEn:
      'Hello! I am Trần Minh Trí — Co-President of BWAN CLUB Gen 6. Feel free to message me directly here about club partnerships, BWAN CAMP 2027, or general club activities!',
    autoAckTemplate: (senderName, userMessage, lang) =>
      lang === 'en'
        ? `Hi ${senderName}! I (Trần Minh Trí — Gen 6 Co-President) received your message: "${userMessage}". I have logged it in the BWAN CLUB executive inbox and will get back to you shortly!`
        : `Chào ${senderName}! Mình (Trần Minh Trí — Đồng Chủ Nhiệm Gen 6) đã nhận được tin nhắn của bạn: "${userMessage}". Mình đã ghi nhận vào hộp thư điều hành BWAN CLUB và sẽ phản hồi chi tiết cho bạn sớm nhất nhé!`,
  },
  {
    id: 'nguyen-minh-anh',
    name: 'Nguyễn Minh Anh',
    role: 'Đồng Chủ Nhiệm Gen 6 · Tiểu Ban Truyền Thông',
    roleEn: 'Gen 6 Co-President · Communications Sub-unit',
    division: 'Ban Chủ Nhiệm & Truyền Thông',
    divisionEn: 'Executive Board & Communications',
    elementBadge: 'Ne · 10',
    statusText: 'Đang trực tuyến · Phản hồi trực tiếp',
    statusTextEn: 'Online · Direct response',
    welcomeNote:
      'Xin chào! Mình là Nguyễn Minh Anh — Đồng Chủ Nhiệm BWAN CLUB Gen 6. Nếu bạn có câu hỏi về chiến dịch truyền thông, PROJECT “Bạn là nguyên tố nào?” hay nội dung fanpage CLB, hãy nhắn cho mình nhé!',
    welcomeNoteEn:
      'Hi there! I am Nguyễn Minh Anh — Co-President of BWAN CLUB Gen 6. If you have questions about our media campaigns, PROJECT “Which Element Are You?”, or club communications, send me a message!',
    autoAckTemplate: (senderName, userMessage, lang) =>
      lang === 'en'
        ? `Thank you for messaging me, ${senderName}! I (Nguyễn Minh Anh) received "${userMessage}" and am coordinating with the BWAN CLUB Communications team to assist you.`
        : `Cảm ơn ${senderName} đã nhắn cho mình! Mình (Nguyễn Minh Anh) đã nhận được nội dung "${userMessage}" và đang trao đổi cùng Tiểu ban Truyền thông BWAN CLUB để hỗ trợ bạn ngay.`,
  },
  {
    id: 'mai-tran-anh-khoa',
    name: 'Mai Trần Anh Khoa',
    role: 'Trưởng Ban Kỹ Thuật Gen 6',
    roleEn: 'Head of Technical Division Gen 6',
    division: 'Ban Kỹ Thuật (Truyền thông, Media, Design)',
    divisionEn: 'Technical Division (PR, Media, Design)',
    elementBadge: 'Si · 14',
    statusText: 'Đang trực tuyến · Phản hồi trực tiếp',
    statusTextEn: 'Online · Direct response',
    welcomeNote:
      'Chào bạn! Mình là Mai Trần Anh Khoa — Trưởng Ban Kỹ Thuật BWAN CLUB Gen 6. Bạn muốn góp ý về trải nghiệm các dự án trực tuyến, kỹ thuật, Media hay Design của CLB thì nhắn trực tiếp cho mình nha!',
    welcomeNoteEn:
      'Hello! I am Mai Trần Anh Khoa — Head of Technical Division at BWAN CLUB Gen 6. Message me directly if you have feedback on our interactive web projects, 3D Molecular Studio, Media, or Design!',
    autoAckTemplate: (senderName, userMessage, lang) =>
      lang === 'en'
        ? `Hi ${senderName}! I (Mai Trần Anh Khoa — Technical Division) received your message "${userMessage}". Thank you for connecting with the BWAN CLUB Technical team!`
        : `Chào ${senderName}! Mình (Mai Trần Anh Khoa — Ban Kỹ Thuật) đã nhận được tin nhắn "${userMessage}" của bạn. Cảm ơn bạn đã kết nối trực tiếp với Ban Kỹ Thuật BWAN CLUB!`,
  },
  {
    id: 'thai-viet-duc-phan-nhat-nam',
    name: 'Thái Việt Đức & Phan Nhật Nam',
    role: 'Điều Phối Ban Nội Dung Gen 6',
    roleEn: 'Coordinators of Content & Lab Division Gen 6',
    division: 'Ban Nội Dung & Học Thuật Hóa Học',
    divisionEn: 'Content & Experimental Chemistry Division',
    elementBadge: 'Pt · 78',
    statusText: 'Đang trực tuyến · Phản hồi trực tiếp',
    statusTextEn: 'Online · Direct response',
    welcomeNote:
      'Chào bạn! Tụi mình là Thái Việt Đức & Phan Nhật Nam phụ trách Ban Nội Dung BWAN CLUB Gen 6. Bạn muốn trao đổi về thí nghiệm Lab Tour I–III, cơ chế phản ứng Hóa học hay chuyên đề “LEARN NOT STUDY” thì nhắn ngay nhé!',
    welcomeNoteEn:
      'Hello! We are Thái Việt Đức & Phan Nhật Nam from the BWAN CLUB Gen 6 Content Division. Message us anytime about Lab Tours I–III, chemical reaction mechanisms, or “LEARN NOT STUDY” topics!',
    autoAckTemplate: (senderName, userMessage, lang) =>
      lang === 'en'
        ? `Hi ${senderName}! The Content Division (Thái Việt Đức & Phan Nhật Nam) received your question: "${userMessage}". We will review it with our Le Quy Don lab protocols and reply shortly!`
        : `Chào ${senderName}! Ban Nội Dung (Thái Việt Đức & Phan Nhật Nam) đã nhận được câu hỏi/tin nhắn của bạn: "${userMessage}". Tụi mình sẽ đối chiếu quy trình phòng Lab THPT chuyên Lê Quý Đôn và phản hồi bạn ngay!`,
  },
  {
    id: 'nguyen-thy-anh-thu',
    name: 'Dương Phạm Nguyên Thy & Nguyễn Anh Thư',
    role: 'Điều Phối Ban Hậu Cần (Nhân Sự & Tài Chính)',
    roleEn: 'Coordinators of Logistics (HR & Finance)',
    division: 'Ban Hậu Cần',
    divisionEn: 'Logistics Division',
    elementBadge: 'Fe · 26',
    statusText: 'Đang trực tuyến · Phản hồi trực tiếp',
    statusTextEn: 'Online · Direct response',
    welcomeNote:
      'Xin chào! Tụi mình là Nguyên Thy (Tiểu ban Nhân sự) và Anh Thư (Tiểu ban Tài chính) thuộc Ban Hậu Cần BWAN CLUB Gen 6. Bạn cần hỗ trợ về đơn hàng Preorder Valentine, Quỹ Học Thuật hay công tác hậu cần sự kiện thì nhắn tụi mình nhé!',
    welcomeNoteEn:
      'Hello! We are Nguyên Thy (HR Sub-unit) and Anh Thư (Finance Sub-unit) from the BWAN CLUB Gen 6 Logistics Division. Reach out if you need help with Valentine Preorders, the Academic Fund, or event logistics!',
    autoAckTemplate: (senderName, userMessage, lang) =>
      lang === 'en'
        ? `Hi ${senderName}! The Logistics Division (Nguyên Thy & Anh Thư) has recorded your message "${userMessage}" in the BWAN CLUB Gen 6 HR & Finance log!`
        : `Chào ${senderName}! Ban Hậu Cần (Nguyên Thy & Anh Thư) đã ghi nhận tin nhắn "${userMessage}" của bạn vào sổ theo dõi Nhân sự – Tài chính BWAN CLUB Gen 6 rồi nhé!`,
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

function getWelcomeMessageText(lang: AppLanguage): string {
  if (lang === 'en') {
    return 'Hello! I am the **BWAN CLUB** Assistant (Le Quy Don High School for the Gifted, Da Nang).\n\nFeel free to ask me anything about our **5 interactive projects** (including the 18 Personality Elements Test & 3D Molecular Studio), **the 12-month Gen 6 roadmap**, **our 4 club divisions**, **Gen 1–6 history**, or **chemistry topics**. If you would like to speak with a board member directly, use the **Direct Club Member Chat** panel on the right!';
  }
  return 'Xin chào! Mình là Trợ lý thông tin của **BWAN CLUB** — Trường THPT chuyên Lê Quý Đôn Đà Nẵng.\n\nBạn có thể hỏi mình bất kỳ điều gì về **5 dự án trải nghiệm trực tuyến** (Trắc nghiệm 18 Nguyên tố Nhân cách, Phòng thí nghiệm Phân tử 3D...), **lộ trình 12 tháng Gen 6**, **cơ cấu 4 phân ban**, **lịch sử Gen 1–6** hoặc **kiến thức Hóa học thú vị**. Nếu muốn trò chuyện với thành viên Ban Quản Lý, bạn có thể nhắn trực tiếp ở khung bên phải nhé!';
}

export const AIAdvisorSection: React.FC<AIAdvisorSectionProps> = ({ lang }) => {
  const isEn = lang === 'en';
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-msg',
      role: 'model',
      text: getWelcomeMessageText(lang),
      senderBadge: isEn ? 'BWAN CLUB Assistant' : 'Trợ lý BWAN CLUB',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const threadContainerRef = useRef<HTMLDivElement>(null);

  // Sync the welcome/reset message language when the user toggles VI <-> EN
  useEffect(() => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === 'welcome-msg' || m.id === 'welcome-reset') {
          return {
            ...m,
            text: getWelcomeMessageText(lang),
            senderBadge: isEn ? 'BWAN CLUB Assistant' : 'Trợ lý BWAN CLUB',
          };
        }
        return m;
      })
    );
  }, [lang, isEn]);

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
          textEn: member.welcomeNoteEn,
          timestamp: 'Trực tuyến · BWAN Gen 6',
          timestampEn: 'Online · BWAN Gen 6',
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

  const sendMessageToAssistant = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed) {
      setChatError(
        isEn
          ? 'Please enter a question before sending.'
          : 'Vui lòng nhập câu hỏi trước khi gửi.'
      );
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
          lang,
        }),
      });

      const contentType = response.headers.get('content-type') || '';
      if (response.ok && contentType.includes('application/json')) {
        const data = await response.json();
        const replyText =
          typeof data?.reply === 'string' && data.reply.trim()
            ? data.reply
            : generateBwanClubAdvisorReply(trimmed, lang);

        const botMsg: ChatMessage = {
          id: `model-${Date.now()}`,
          role: 'model',
          text: replyText,
          senderBadge: isEn ? 'BWAN CLUB Assistant' : 'Trợ lý BWAN CLUB',
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 220));
        const fallbackReply = generateBwanClubAdvisorReply(trimmed, lang);
        const botMsg: ChatMessage = {
          id: `model-${Date.now()}`,
          role: 'model',
          text: fallbackReply,
          senderBadge: isEn ? 'BWAN CLUB Assistant' : 'Trợ lý BWAN CLUB',
        };
        setMessages((prev) => [...prev, botMsg]);
      }
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 220));
      const fallbackReply = generateBwanClubAdvisorReply(trimmed, lang);
      const botMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: fallbackReply,
        senderBadge: isEn ? 'BWAN CLUB Assistant' : 'Trợ lý BWAN CLUB',
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleAIFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessageToAssistant(input);
  };

  const handleDirectMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanText = directInput.trim();
    const cleanSender =
      visitorName.trim() ||
      (isEn ? 'Chemistry Enthusiast' : 'Bạn đọc yêu Hóa học');

    if (!cleanText) {
      setDirectError(
        isEn
          ? `Please enter a message to send directly to ${activeMember.name}.`
          : `Vui lòng nhập lời nhắn để gửi trực tiếp cho ${activeMember.name}.`
      );
      return;
    }

    setDirectError(null);
    const nowTime = new Date().toLocaleTimeString(isEn ? 'en-US' : 'vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const visitorMsg: DirectThreadMessage = {
      id: `vis-${Date.now()}`,
      from: 'visitor',
      senderName: cleanSender,
      text: cleanText,
      timestamp: isEn ? `Just now (${nowTime})` : `Vừa xong (${nowTime})`,
    };

    const memberReplyMsg: DirectThreadMessage = {
      id: `mem-${Date.now() + 1}`,
      from: 'member',
      senderName: activeMember.name,
      text: activeMember.autoAckTemplate(cleanSender, cleanText, 'vi'),
      textEn: activeMember.autoAckTemplate(cleanSender, cleanText, 'en'),
      timestamp: `Phản hồi trực tiếp (${nowTime})`,
      timestampEn: `Direct reply (${nowTime})`,
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
      isEn
        ? `Direct message sent to ${activeMember.name} (${activeMember.divisionEn}).`
        : `Đã chuyển tin nhắn trực tiếp tới ${activeMember.name} (${activeMember.division}).`
    );
  };

  const quickQuestions = isEn
    ? QUICK_CLUB_QUESTIONS_EN
    : QUICK_CLUB_QUESTIONS_VI;

  return (
    <section
      id="tro-ly-clb"
      className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-transparent transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl">
          <p className="text-xs font-mono font-bold text-[#6C63FF] dark:text-[#A39DFF] uppercase tracking-wider">
            {isEn
              ? 'SMART CLUB ASSISTANT & DIRECT BOARD MEMBER MESSAGING'
              : 'TRỢ LÝ THÔNG TIN & KẾT NỐI TRỰC TIẾP THÀNH VIÊN CLB'}
          </p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-[#1F1F2E] dark:text-white tracking-tight text-balance">
            {isEn ? 'BWAN CLUB Assistant & ' : 'Trợ Lý BWAN CLUB & '}
            <span className="google-one-chem-gradient-text">
              {isEn
                ? 'Direct Board Member Chat'
                : 'Nhắn Trực Tiếp Thành Viên CLB'}
            </span>
          </h2>
          <p className="mt-2.5 text-sm sm:text-base text-[#4A4A68] dark:text-[#CBD5E1] leading-relaxed">
            {isEn
              ? 'Ask any question about BWAN CLUB projects, the 12-month roadmap, club divisions, or chemistry topics, or message BWAN CLUB Gen 6 board members directly alongside it.'
              : 'Giải đáp nhanh chóng mọi thông tin về dự án trải nghiệm, lộ trình 12 tháng, cơ cấu 4 phân ban và kiến thức Hóa học, hoặc nhắn tin trực tiếp với từng thành viên Ban Quản Lý BWAN CLUB Gen 6.'}
          </p>
        </div>

        {/* Side-by-Side Dual Communication Grid: Left = BWAN Assistant | Right = Direct Club Member Messaging */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* COLUMN 1 (7 Cols): BWAN CLUB ASSISTANT CHATBOX */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 bg-white/95 dark:bg-[#16142E]/95 backdrop-blur-md rounded-[32px] border border-[#E5E2DC] dark:border-[#6C63FF]/35 overflow-hidden shadow-sm flex flex-col justify-between"
          >
            {/* Top Bar */}
            <div className="px-6 py-4 bg-white dark:bg-[#121026] border-b border-[#E5E2DC] dark:border-[#6C63FF]/25 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1F0FF] dark:bg-[#6C63FF]/25 text-[#6C63FF] dark:text-[#A39DFF]">
                  <Sparkles className="w-5 h-5" />
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-sm sm:text-base font-bold text-[#1F1F2E] dark:text-white">
                      {isEn ? 'BWAN CLUB Assistant' : 'Trợ Lý BWAN CLUB'}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#F1F0FF] dark:bg-[#6C63FF]/25 text-[#6C63FF] dark:text-[#A39DFF] font-mono text-[10px] font-bold">
                      {isEn ? '24/7 Support' : 'Hỗ trợ 24/7'}
                    </span>
                  </div>
                  <p className="text-xs text-[#5F6368] dark:text-[#94A3B8]">
                    {isEn
                      ? 'Official club information, chemistry insights & interactive guides'
                      : 'Tư vấn thông tin CLB, dự án trải nghiệm & kiến thức Hóa học'}
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
                      text: getWelcomeMessageText(lang),
                      senderBadge: isEn
                        ? 'BWAN CLUB Assistant'
                        : 'Trợ lý BWAN CLUB',
                    },
                  ]);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F1F0FF] dark:bg-[#6C63FF]/25 hover:bg-[#E5E3FF] text-xs font-semibold text-[#6C63FF] dark:text-[#A39DFF] cursor-pointer whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isEn ? 'New chat' : 'Cuộc trò chuyện mới'}</span>
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
                      ? isEn
                        ? 'You'
                        : 'Bạn'
                      : isEn
                      ? 'BWAN CLUB Assistant'
                      : 'Trợ lý BWAN CLUB'}
                  </span>
                </motion.div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#6C63FF] dark:text-[#A39DFF]">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>
                    {isEn
                      ? 'BWAN CLUB Assistant is responding...'
                      : 'Trợ lý BWAN CLUB đang phản hồi...'}
                  </span>
                </div>
              )}
            </div>

            {/* Quick Question Prompts + AI Input Form */}
            <div className="p-5 bg-white dark:bg-[#121026] border-t border-[#E5E2DC] dark:border-[#6C63FF]/25 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                {quickQuestions.map((q) => (
                  <motion.button
                    key={q}
                    type="button"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => sendMessageToAssistant(q)}
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
                  {isEn
                    ? 'Ask BWAN CLUB Assistant a question'
                    : 'Nhập câu hỏi cho Trợ lý BWAN CLUB'}
                </label>
                <input
                  id="club-chat-input"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    isEn
                      ? 'Ask about BWAN CLUB projects, events, divisions, or chemistry...'
                      : 'Nhập câu hỏi về dự án, sự kiện, phân ban hoặc Hóa học...'
                  }
                  className="flex-1 px-4 py-3 rounded-full bg-[#F8F9FA] dark:bg-[#0D0C1D] border border-[#DBD8D0] dark:border-[#6C63FF]/35 text-sm text-[#1F1F2E] dark:text-white placeholder-[#9CA3AF] focus:outline-none focus:border-[#6C63FF] transition-colors"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full google-one-chem-btn text-sm font-semibold disabled:opacity-60 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span>{isEn ? 'Send' : 'Gửi tin nhắn'}</span>
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
                      {isEn
                        ? 'Direct Club Member Chat'
                        : 'Nhắn Trực Tiếp Với Thành Viên CLB'}
                    </h3>
                    <p className="text-xs text-[#5F6368] dark:text-[#94A3B8]">
                      {isEn
                        ? 'Connect directly with BWAN CLUB Gen 6 Board Members'
                        : 'Kết nối trực tiếp với Ban Quản Lý BWAN CLUB Gen 6'}
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ECFDF5] dark:bg-[#064E3B]/50 text-[#0D9488] dark:text-[#34D399] font-mono text-[10px] font-bold shrink-0">
                  {isEn ? '● Real Member' : '● Con người thật'}
                </span>
              </div>

              {/* Member Selector Pills */}
              <div>
                <label
                  htmlFor="direct-member-select"
                  className="block text-[11px] font-mono font-semibold text-[#5F6368] dark:text-[#94A3B8] mb-1.5"
                >
                  {isEn
                    ? 'Select a BWAN CLUB member to message directly:'
                    : 'Chọn thành viên BWAN CLUB bạn muốn nhắn trực tiếp:'}
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
                      {member.name} — {isEn ? member.roleEn : member.role} (
                      {member.elementBadge})
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
                      {isEn
                        ? activeMember.statusTextEn
                        : activeMember.statusText}
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
                    {isEn && dm.textEn ? dm.textEn : dm.text}
                  </div>
                  <span className="mt-1 text-[10px] font-mono text-[#5F6368] dark:text-[#94A3B8]">
                    {dm.senderName} ·{' '}
                    {isEn && dm.timestampEn ? dm.timestampEn : dm.timestamp}
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
                  {isEn ? 'Your name or class' : 'Tên hoặc lớp của bạn'}
                </label>
                <input
                  id="visitor-direct-name"
                  type="text"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  placeholder={
                    isEn
                      ? 'Your Name / Class (e.g., Minh Khoa - 10A2)...'
                      : 'Tên / Lớp của bạn (VD: Minh Khoa - 10A2)...'
                  }
                  className="w-full px-3.5 py-2.5 rounded-full bg-[#F8F9FA] dark:bg-[#0D0C1D] border border-[#DBD8D0] dark:border-[#6C63FF]/35 text-xs sm:text-sm text-[#1F1F2E] dark:text-white placeholder-[#9CA3AF] focus:outline-none focus:border-[#6C63FF]"
                />
              </div>

              <div className="flex items-center gap-3">
                <label htmlFor="direct-member-input" className="sr-only">
                  {isEn
                    ? 'Direct message content for club member'
                    : 'Nội dung nhắn trực tiếp cho thành viên CLB'}
                </label>
                <input
                  id="direct-member-input"
                  data-testid="direct-member-input"
                  type="text"
                  value={directInput}
                  onChange={(e) => setDirectInput(e.target.value)}
                  placeholder={
                    isEn
                      ? `Message ${activeMember.name} directly...`
                      : `Nhắn trực tiếp cho ${activeMember.name}...`
                  }
                  className="flex-1 px-4 py-3 rounded-full bg-[#F8F9FA] dark:bg-[#0D0C1D] border border-[#DBD8D0] dark:border-[#6C63FF]/35 text-sm text-[#1F1F2E] dark:text-white placeholder-[#9CA3AF] focus:outline-none focus:border-[#6C63FF]"
                />
                <motion.button
                  type="submit"
                  data-testid="direct-member-send-btn"
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full google-one-chem-btn text-sm font-semibold cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span>{isEn ? 'Send' : 'Gửi tin nhắn'}</span>
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
