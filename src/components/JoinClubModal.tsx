import React from 'react';
import { X, CalendarClock, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BwanHexLogo } from './BwanHexLogo';

export interface MemberRegistration {
  id: string;
  fullName: string;
  email: string;
  gradeClass: string;
  division: string;
  favoriteElement: string;
  registeredAt: string;
}

interface JoinClubModalProps {
  isOpen: boolean;
  defaultDivision: string;
  onClose: () => void;
  onRegisterMember?: (member: MemberRegistration) => void;
  registeredMembers?: MemberRegistration[];
}

export const JoinClubModal: React.FC<JoinClubModalProps> = ({
  isOpen,
  defaultDivision,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="join-club-modal-title"
          data-testid="closed-recruitment-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-[#16142E] rounded-[32px] max-w-lg w-full p-6 sm:p-8 border border-[#E5E2DC] dark:border-[#6C63FF]/45 shadow-2xl text-[#1F1F2E] dark:text-white"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#EFECE6] dark:border-[#6C63FF]/25">
              <div className="flex items-center gap-3">
                <BwanHexLogo className="w-9 h-9" />
                <div>
                  <h2
                    id="join-club-modal-title"
                    className="font-display text-lg sm:text-xl font-bold text-[#1F1F2E] dark:text-white"
                  >
                    Thông Báo Tuyển Thành Viên BWAN CLUB
                  </h2>
                  <p className="text-xs text-[#6C63FF] dark:text-[#A39DFF] font-medium mt-0.5">
                    Đoàn Trường THPT Chuyên Lê Quý Đôn Đà Nẵng · “LEARN NOT STUDY”
                  </p>
                </div>
              </div>

              <button
                type="button"
                aria-label="Đóng thông báo"
                onClick={onClose}
                className="p-2 rounded-full text-[#5F6368] dark:text-[#CBD5E1] hover:text-[#1F1F2E] dark:hover:text-white hover:bg-[#F3F4F6] dark:hover:bg-[#231F44] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Closed Recruitment Notice Body */}
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#F1F0FF] dark:bg-[#6C63FF]/25 text-[#6C63FF] dark:text-[#A39DFF] border border-[#6C63FF]/30 flex items-center justify-center mx-auto shadow-xs">
                <CalendarClock className="w-7 h-7" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FEF3C7] dark:bg-[#D97706]/25 text-[#D97706] dark:text-[#FBBF24] text-xs font-mono font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ĐÃ ĐÓNG ĐƠN TUYỂN THÀNH VIÊN MÙA NÀY</span>
              </div>

              <h3 className="font-display text-2xl font-extrabold text-[#1F1F2E] dark:text-white leading-snug">
                Đã hết kỳ mở đơn tuyển thành viên!
              </h3>

              <p className="text-sm sm:text-base text-[#4A4A68] dark:text-[#CBD5E1] leading-relaxed max-w-md mx-auto">
                Hiện tại kỳ mở đơn ứng tuyển vào{' '}
                <strong className="text-[#6C63FF] dark:text-[#A39DFF]">
                  {defaultDivision || 'BWAN CLUB'}
                </strong>{' '}
                đã chính thức kết thúc. Cảm ơn bạn đã quan tâm và dành tình cảm
                cho <strong>BWAN CLUB</strong> — hẹn gặp lại bạn và{' '}
                <strong className="text-[#1F1F2E] dark:text-white">
                  đợi quay lại vào kỳ mở đơn năm sau
                </strong>{' '}
                nhé!
              </p>

              {/* 4 Divisions Reference Box for Next Year */}
              <div className="mt-4 text-left rounded-2xl p-4 bg-[#F4F2EE] dark:bg-[#0D0C1D] border border-[#E5E2DC] dark:border-[#6C63FF]/30 space-y-2">
                <p className="text-xs font-mono font-bold text-[#6C63FF] dark:text-[#A39DFF] uppercase">
                  Các phân ban mở đơn vào kỳ tuyển quân năm sau:
                </p>
                <div className="grid grid-cols-1 gap-1.5 text-xs text-[#3C4043] dark:text-[#E2E8F0]">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0D9488] dark:text-[#34D399] shrink-0 mt-0.5" />
                    <span>
                      <strong>Ban Hậu Cần:</strong> Tiểu ban Nhân sự & Tiểu ban Tài chính
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0284C7] dark:text-[#38BDF8] shrink-0 mt-0.5" />
                    <span>
                      <strong>Ban Nội Dung:</strong> Chuyên môn Học thuật & Thực nghiệm
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#6C63FF] dark:text-[#A39DFF] shrink-0 mt-0.5" />
                    <span>
                      <strong>Ban Kỹ Thuật:</strong> Tiểu ban Truyền thông, Tiểu ban Media & Tiểu ban Design
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#D97706] dark:text-[#FBBF24] shrink-0 mt-0.5" />
                    <span>
                      <strong>Ban Đối Ngoại:</strong> Hợp tác & Liên kết CLB
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={onClose}
                  className="w-full py-3.5 px-6 rounded-full google-one-chem-btn text-sm font-semibold cursor-pointer"
                >
                  Đã hiểu · Hẹn gặp lại vào kỳ mở đơn năm sau
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
