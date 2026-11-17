import React, { useState, useEffect, useRef } from 'react';
import {
  BankTransferConfig,
  DonationSubmissionPayload,
  DonorRecord,
  QrCodeRequestParams,
} from '../types';
import {
  formatVnd,
  validateDonationPayload,
  generateTransferSyntax,
  buildAppsScriptCreateUrl,
  saveLocalDonationIntent,
  donorNamesMatch,
  DonationIntentItem,
} from '../donationLogic';
import {
  QrCode,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Loader2,
  ExternalLink,
  AlertCircle,
  ArrowRight,
  Clock,
  RefreshCw,
} from 'lucide-react';
import { motion } from 'motion/react';

interface QuickDonatePanelProps {
  campaignCode: string;
  campaignTitle: string;
  presetAmounts: number[];
  bankConfig: BankTransferConfig;
  donors?: DonorRecord[];
  lang?: 'vi' | 'en';
  /**
   * Chỉ được gọi KHI VÀ CHỈ KHI cổng PayOS hoặc Bảng xếp hạng xác nhận trạng thái thanh toán là PAID.
   */
  onDonationVerified: (
    payload: DonationSubmissionPayload,
    orderMeta?: { paymentLinkId?: string; orderCode?: string | number }
  ) => DonorRecord;
  onIntentSaved?: (intent: DonationIntentItem) => void;
  resolveCustomQrUrl?: (params: QrCodeRequestParams) => string | null;
}

interface PendingOrderState {
  paymentLinkId: string;
  orderCode?: string | number;
  checkoutUrl: string;
  payload: DonationSubmissionPayload;
  receiptCode: string;
  baselineMatchCount: number;
  status: 'PENDING' | 'PAID' | 'CANCELLED' | 'EXPIRED';
}

export const QuickDonatePanel: React.FC<QuickDonatePanelProps> = ({
  campaignCode,
  bankConfig,
  donors = [],
  lang = 'vi',
  onDonationVerified,
  onIntentSaved,
}) => {
  const isEn = lang === 'en';
  const [amountInput, setAmountInput] = useState<string>('50000');
  const [donorName, setDonorName] = useState<string>('');
  const [affiliation, setAffiliation] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isCreatingQr, setIsCreatingQr] = useState<boolean>(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState<boolean>(false);
  const [pendingOrder, setPendingOrder] = useState<PendingOrderState | null>(
    null
  );
  const [verifiedRecord, setVerifiedRecord] = useState<DonorRecord | null>(
    null
  );

  const confirmedPaymentIdsRef = useRef<Set<string>>(new Set());

  const parsedAmount = Number(amountInput.replace(/[^0-9]/g, ''));
  const amountVnd = Number.isFinite(parsedAmount) ? parsedAmount : 0;

  const { receiptCode } = generateTransferSyntax(
    bankConfig.transferPrefix,
    campaignCode,
    donorName || 'BWAN',
    amountVnd
  );

  const persistIntent = async (intent: DonationIntentItem) => {
    saveLocalDonationIntent(intent);
    onIntentSaved?.(intent);
    try {
      await fetch('/api/donation-intents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(intent),
      });
    } catch {
      // Saved in localStorage as fallback
    }
  };

  // Khi bảng xếp hạng Google Apps Script cập nhật giao dịch mới khớp tên + số tiền của đơn đang chờ
  useEffect(() => {
    if (!pendingOrder || pendingOrder.status !== 'PENDING') return;
    if (confirmedPaymentIdsRef.current.has(pendingOrder.paymentLinkId)) return;

    const currentMatches = donors.filter(
      (d) =>
        Math.round(d.amountVnd) === Math.round(pendingOrder.payload.amountVnd) &&
        donorNamesMatch(d.name, pendingOrder.payload.donorName)
    ).length;

    if (currentMatches > pendingOrder.baselineMatchCount) {
      confirmedPaymentIdsRef.current.add(pendingOrder.paymentLinkId);
      setPendingOrder((prev) => (prev ? { ...prev, status: 'PAID' } : null));
      const created = onDonationVerified(pendingOrder.payload, {
        paymentLinkId: pendingOrder.paymentLinkId,
        orderCode: pendingOrder.orderCode,
      });
      setVerifiedRecord(created);
    }
  }, [donors, pendingOrder, onDonationVerified]);

  // Hàm kiểm tra trạng thái thực tế của mã QR trên PayOS (PENDING vs PAID)
  const checkOrderPaymentStatus = async (order: PendingOrderState) => {
    if (!order.paymentLinkId || order.status !== 'PENDING') return;
    if (confirmedPaymentIdsRef.current.has(order.paymentLinkId)) return;

    try {
      setIsCheckingStatus(true);
      const res = await fetch(`/api/payos-status/${order.paymentLinkId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          donorName: order.payload.donorName,
          affiliation: order.payload.affiliation,
          amountVnd: order.payload.amountVnd,
          message: order.payload.message,
          receiptCode: order.receiptCode,
          orderCode: order.orderCode,
        }),
      });

      if (!res.ok) return;

      const data = (await res.json()) as {
        status?: string;
        verifiedRecord?: DonorRecord;
      };

      if (data.status === 'PAID') {
        if (!confirmedPaymentIdsRef.current.has(order.paymentLinkId)) {
          confirmedPaymentIdsRef.current.add(order.paymentLinkId);
          setPendingOrder((prev) =>
            prev ? { ...prev, status: 'PAID' } : null
          );
          const created = onDonationVerified(order.payload, {
            paymentLinkId: order.paymentLinkId,
            orderCode: order.orderCode,
          });
          setVerifiedRecord(created);
        }
      } else if (data.status === 'CANCELLED' || data.status === 'EXPIRED') {
        setPendingOrder((prev) =>
          prev
            ? { ...prev, status: data.status as 'CANCELLED' | 'EXPIRED' }
            : null
        );
      }
    } catch {
      // Giữ trạng thái chờ để chu kỳ tiếp theo kiểm tra lại
    } finally {
      setIsCheckingStatus(false);
    }
  };

  // Tự động kiểm tra trạng thái thanh toán mỗi 2.5 giây khi đang có đơn PENDING
  useEffect(() => {
    if (!pendingOrder || pendingOrder.status !== 'PENDING') return;

    const timer = window.setInterval(() => {
      checkOrderPaymentStatus(pendingOrder);
    }, 2500);

    return () => window.clearInterval(timer);
  }, [pendingOrder]);

  const handleAmountChange = (rawVal: string) => {
    const digitsOnly = rawVal.replace(/[^0-9]/g, '');
    setAmountInput(digitsOnly);
    setApiError(null);
    if (errors.amountVnd) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.amountVnd;
        return next;
      });
    }
  };

  const handleQuickChipSelect = (val: number) => {
    setAmountInput(String(val));
    setApiError(null);
    if (errors.amountVnd) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.amountVnd;
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    const payload: DonationSubmissionPayload = {
      donorName: donorName.trim(),
      affiliation:
        affiliation.trim() ||
        (isEn
          ? 'BWAN CLUB Member & Chemistry Enthusiast'
          : 'Thành viên & Người yêu Hóa học BWAN CLUB'),
      amountVnd,
      message: message.trim(),
      isAnonymous: false,
    };

    const validation = validateDonationPayload(payload, lang);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setIsCreatingQr(true);
    setPendingOrder(null);
    setVerifiedRecord(null);

    const baselineMatchCount = donors.filter(
      (d) =>
        Math.round(d.amountVnd) === Math.round(payload.amountVnd) &&
        donorNamesMatch(d.name, payload.donorName)
    ).length;

    // Lưu trước lời chúc & thông tin người ủng hộ để khi quét mã QR xong sẽ tự động khớp vào Bảng xếp hạng & Khung Lời Chúc
    const preIntent: DonationIntentItem = {
      id: `intent_${Date.now()}`,
      name: payload.donorName,
      affiliation: payload.affiliation,
      amountVnd: payload.amountVnd,
      message: payload.message,
      receiptCode,
      timestampIso: new Date().toISOString(),
    };
    await persistIntent(preIntent);

    const requestUrl = buildAppsScriptCreateUrl(amountVnd, payload.donorName);

    try {
      const response = await fetch(requestUrl, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(
          isEn
            ? `Server returned status ${response.status}`
            : `Máy chủ trả về mã trạng thái ${response.status}`
        );
      }

      const json = await response.json();
      const targetCheckoutUrl: string | undefined =
        json?.data?.checkoutUrl || json?.checkoutUrl;

      if (!targetCheckoutUrl) {
        throw new Error(
          isEn
            ? 'System response did not contain data.checkoutUrl.'
            : 'Phản hồi từ hệ thống không chứa đường dẫn data.checkoutUrl.'
        );
      }

      // Trích xuất paymentLinkId để kiểm tra trạng thái thanh toán thực tế (PENDING vs PAID)
      const extractedLinkId: string =
        json?.data?.paymentLinkId ||
        targetCheckoutUrl.split('/web/')[1]?.split(/[/?#]/)[0] ||
        `qr_${Date.now()}`;
      const orderCode = json?.data?.orderCode;
      const finalReceiptCode = orderCode ? `ORD-${orderCode}` : receiptCode;

      await persistIntent({
        ...preIntent,
        paymentLinkId: extractedLinkId,
        orderCode,
        receiptCode: finalReceiptCode,
      });

      const newPendingOrder: PendingOrderState = {
        paymentLinkId: extractedLinkId,
        orderCode,
        checkoutUrl: targetCheckoutUrl,
        payload,
        receiptCode: finalReceiptCode,
        baselineMatchCount,
        status: 'PENDING',
      };

      setPendingOrder(newPendingOrder);

      // Tự động mở trang quét mã QR thanh toán trong tab mới
      const anchor = document.createElement('a');
      anchor.href = targetCheckoutUrl;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : isEn
          ? 'Could not connect to the QR payment gateway. Please try again.'
          : 'Không thể kết nối tới cổng tạo mã QR. Vui lòng thử lại.';
      setApiError(msg);
    } finally {
      setIsCreatingQr(false);
    }
  };

  const formattedDisplayInput = amountInput
    ? amountVnd.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    : '';

  const quickSuggestions = [2_000, 20_000, 50_000, 100_000, 200_000, 500_000];

  return (
    <div
      id="quick-donate-panel"
      className="scroll-mt-24 rounded-3xl border border-slate-200/90 dark:border-[#6C63FF]/35 bg-white dark:bg-[#16142E] p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-black/30 transition-colors duration-300"
    >
      {/* Header Khu vực Quyên góp */}
      <div className="border-b border-slate-100 dark:border-[#6C63FF]/20 pb-5">
        <div className="flex items-center justify-between text-xs font-semibold text-[#5D50FE] dark:text-[#A39DFF]">
          <span>
            {isEn
              ? 'Online Donation Gateway · BWAN CLUB'
              : 'Cổng Quyên Góp Trực Tuyến · BWAN CLUB'}
          </span>
          <span className="font-mono-tabular text-slate-400 dark:text-slate-500">
            {isEn ? `FUND CODE: ${campaignCode}` : `MÃ QUỸ: ${campaignCode}`}
          </span>
        </div>
        <h3 className="mt-1.5 font-display text-2xl font-extrabold tracking-tight text-[#181826] dark:text-white">
          {isEn ? 'Support BWAN CLUB' : 'Quyên Góp Ủng Hộ BWAN CLUB'}
        </h3>
        <p className="mt-1.5 text-xs leading-relaxed text-[#525866] dark:text-[#CBD5E1] sm:text-sm">
          {isEn
            ? 'Thank you for visiting our website. Every contribution is a tremendous motivation for BWAN CLUB to grow further and spread the passion for experimental chemistry to the community!'
            : 'Cảm ơn bạn đã dành thời gian để đọc trang web này. Mọi số tiền câu lạc bộ nhận được đều là nguồn động lực to lớn để chúng mình có thể phát triển hơn nữa và lan tỏa ngọn lửa đam mê Hóa học đến cộng đồng!'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
        {/* 1. Ô nhập Tên người ủng hộ (name) */}
        <div>
          <label
            htmlFor="donate-patron-name"
            className="block text-xs font-bold text-[#181826] dark:text-white"
          >
            {isEn ? '1. Supporter Name' : '1. Tên người ủng hộ'}{' '}
            <span className="text-[#5D50FE] dark:text-[#A39DFF]">*</span>
          </label>
          <input
            id="donate-patron-name"
            name="name"
            type="text"
            value={donorName}
            onChange={(e) => {
              setDonorName(e.target.value);
              if (errors.donorName) {
                setErrors((prev) => {
                  const next = { ...prev };
                  delete next.donorName;
                  return next;
                });
              }
            }}
            placeholder={
              isEn
                ? 'Enter your name to be honored on the Leaderboard'
                : 'Nhập tên của bạn để vinh danh lên Bảng xếp hạng'
            }
            disabled={isCreatingQr}
            className="mt-2 w-full rounded-2xl border border-slate-200 dark:border-[#6C63FF]/35 bg-[#F8F8FB] dark:bg-[#0D0C1D] px-4 py-3 text-sm font-medium text-[#181826] dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors focus:border-[#5D50FE] focus:bg-white dark:focus:bg-[#121026] focus:outline-none disabled:opacity-60"
          />
          {errors.donorName && (
            <p
              role="alert"
              className="mt-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400"
            >
              {errors.donorName}
            </p>
          )}
        </div>

        {/* 2. Ô nhập Số tiền muốn ủng hộ (amount - tối thiểu 2000 VNĐ) */}
        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="donate-custom-amount"
              className="text-xs font-bold text-[#181826] dark:text-white"
            >
              {isEn
                ? '2. Donation Amount (minimum 2,000 VND)'
                : '2. Số tiền muốn ủng hộ (tối thiểu 2.000 VNĐ)'}{' '}
              <span className="text-[#5D50FE] dark:text-[#A39DFF]">*</span>
            </label>
            <span className="font-mono-tabular text-xs font-bold text-[#5D50FE] dark:text-[#A39DFF]">
              {amountVnd >= 2_000
                ? formatVnd(amountVnd)
                : isEn
                ? 'Min 2.000 ₫'
                : 'Tối thiểu 2.000 ₫'}
            </span>
          </div>

          <div className="relative mt-2 flex items-center rounded-2xl border-2 border-[#5D50FE]/40 dark:border-[#6C63FF]/50 bg-[#F8F8FB] dark:bg-[#0D0C1D] transition-colors focus-within:border-[#5D50FE] focus-within:bg-white dark:focus-within:bg-[#121026]">
            <input
              id="donate-custom-amount"
              name="amount"
              type="text"
              inputMode="numeric"
              value={formattedDisplayInput}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder={
                isEn
                  ? 'Enter amount (minimum 2,000)'
                  : 'Nhập số tiền (tối thiểu 2.000)'
              }
              aria-label={
                isEn
                  ? 'Donation amount (minimum 2,000 VND)'
                  : 'Số tiền muốn ủng hộ (tối thiểu 2000 VNĐ)'
              }
              disabled={isCreatingQr}
              className="w-full bg-transparent py-3.5 pl-4 pr-16 font-mono-tabular text-xl font-extrabold text-[#181826] dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none disabled:opacity-60"
            />
            <span className="pointer-events-none absolute right-4 font-mono-tabular text-xs font-bold text-[#5D50FE] dark:text-[#A39DFF]">
              VNĐ
            </span>
          </div>

          {/* Gợi ý chọn nhanh số tiền */}
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-[11px] font-medium text-[#525866] dark:text-[#94A3B8]">
              {isEn ? 'Quick select:' : 'Chọn nhanh:'}
            </span>
            {quickSuggestions.map((amt) => {
              const isSelected = amountVnd === amt;
              return (
                <motion.button
                  key={amt}
                  type="button"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isCreatingQr}
                  onClick={() => handleQuickChipSelect(amt)}
                  className={`rounded-full px-3 py-1 font-mono-tabular text-xs font-bold transition-all cursor-pointer whitespace-nowrap disabled:opacity-50 ${
                    isSelected
                      ? 'bg-[#5D50FE] text-white shadow-xs shadow-[#5D50FE]/25'
                      : 'border border-slate-200 dark:border-[#6C63FF]/30 bg-white dark:bg-[#0D0C1D] text-[#525866] dark:text-[#CBD5E1] hover:border-[#5D50FE] dark:hover:border-[#A39DFF] hover:text-[#5D50FE] dark:hover:text-[#A39DFF]'
                  }`}
                >
                  {formatVnd(amt)}
                </motion.button>
              );
            })}
          </div>

          {errors.amountVnd && (
            <p
              role="alert"
              className="mt-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400"
            >
              {errors.amountVnd}
            </p>
          )}
        </div>

        {/* Phân ban / Đơn vị & Lời nhắn tùy chọn */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label
              htmlFor="donate-affiliation"
              className="block text-xs font-semibold text-[#525866] dark:text-[#CBD5E1]"
            >
              {isEn ? 'Division / Cohort (Optional)' : 'Phân ban / Khóa (Tùy chọn)'}
            </label>
            <input
              id="donate-affiliation"
              type="text"
              value={affiliation}
              onChange={(e) => setAffiliation(e.target.value)}
              placeholder={
                isEn ? 'e.g., Content & Lab Division' : 'VD: Phân ban Thực nghiệm'
              }
              disabled={isCreatingQr}
              className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-[#6C63FF]/35 bg-[#F8F8FB] dark:bg-[#0D0C1D] px-3.5 py-2.5 text-xs text-[#181826] dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-[#5D50FE] focus:bg-white dark:focus:bg-[#121026] focus:outline-none disabled:opacity-60"
            />
          </div>

          <div>
            <label
              htmlFor="donate-message"
              className="block text-xs font-semibold text-[#525866] dark:text-[#CBD5E1]"
            >
              {isEn ? 'Wish / Message to Club (Optional)' : 'Lời nhắn gửi CLB (Tùy chọn)'}
            </label>
            <input
              id="donate-message"
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                isEn
                  ? 'Enter your wish for BWAN CLUB (optional)'
                  : 'Nhập lời chúc gửi tới CLB (nếu có)'
              }
              disabled={isCreatingQr}
              className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-[#6C63FF]/35 bg-[#F8F8FB] dark:bg-[#0D0C1D] px-3.5 py-2.5 text-xs text-[#181826] dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-[#5D50FE] focus:bg-white dark:focus:bg-[#121026] focus:outline-none disabled:opacity-60"
            />
          </div>
        </div>

        {/* 3. Nút bấm "Tạo mã QR Ủng hộ" */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          disabled={isCreatingQr}
          className="flex w-full items-center justify-center gap-2.5 rounded-full google-one-chem-btn px-6 py-4 text-sm font-bold text-white disabled:cursor-wait disabled:opacity-80 cursor-pointer whitespace-nowrap"
        >
          {isCreatingQr ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{isEn ? 'Generating QR code...' : 'Đang tạo mã QR...'}</span>
            </>
          ) : (
            <>
              <QrCode className="h-4 w-4" />
              <span>{isEn ? 'Create Donation QR Code' : 'Tạo mã QR Ủng hộ'}</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </motion.button>

        {/* Thông báo lỗi kết nối nếu có */}
        {apiError && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-2xl border border-rose-200 dark:border-rose-500/40 bg-rose-50 dark:bg-rose-950/40 p-3.5 text-xs text-rose-900 dark:text-rose-200"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
            <div>
              <p className="font-bold">
                {isEn
                  ? 'Unable to generate payment QR code'
                  : 'Không thể tạo mã QR thanh toán'}
              </p>
              <p className="mt-0.5 text-rose-800/90 dark:text-rose-300">
                {apiError}
              </p>
            </div>
          </div>
        )}

        {/* Trạng thái 1: ĐANG CHỜ QUÉT MÃ QR THANH TOÁN */}
        {pendingOrder && pendingOrder.status === 'PENDING' && !isCreatingQr && (
          <div
            role="status"
            data-testid="donation-pending-payment"
            className="space-y-3 rounded-2xl border border-indigo-200 dark:border-[#6C63FF]/40 bg-indigo-50/70 dark:bg-[#1E1B3D] p-4 text-xs text-slate-800 dark:text-slate-100"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-bold text-[#5D50FE] dark:text-[#A39DFF]">
                <Clock className="h-4 w-4 shrink-0 animate-spin" />
                <span>
                  {isEn
                    ? `Waiting for ${pendingOrder.payload.donorName} to scan QR (${formatVnd(pendingOrder.payload.amountVnd)})`
                    : `Đang chờ ${pendingOrder.payload.donorName} quét mã QR thanh toán (${formatVnd(pendingOrder.payload.amountVnd)})`}
                </span>
              </div>
              <span className="font-mono-tabular text-[11px] font-semibold text-amber-700 dark:text-amber-300">
                {isEn ? 'PENDING PAYMENT' : 'CHỜ THANH TOÁN'}
              </span>
            </div>

            <p className="leading-relaxed text-slate-600 dark:text-slate-300">
              {isEn ? (
                <>
                  Your contribution and wish will automatically appear on the{' '}
                  <strong>Top Donate Leaderboard</strong> and{' '}
                  <strong>Community Wishes</strong> section once your QR transfer
                  is completed on PayOS.
                </>
              ) : (
                <>
                  Hệ thống chỉ ghi nhận lên{' '}
                  <strong>Bảng xếp hạng Top Donate</strong>,{' '}
                  <strong>Khung Lời Chúc</strong> và cộng vào{' '}
                  <strong>Tổng quỹ</strong> sau khi bạn quét mã QR chuyển khoản
                  thành công trên trang PayOS.
                </>
              )}
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <a
                href={pendingOrder.checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#5D50FE] px-4 py-2 text-xs font-bold text-white shadow-xs transition-colors hover:bg-[#4B3FE8]"
              >
                <span>
                  {isEn
                    ? 'Open QR Payment Page'
                    : 'Mở Trang Quét Mã QR Thanh Toán'}
                </span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>

              <button
                type="button"
                disabled={isCheckingStatus}
                onClick={() => checkOrderPaymentStatus(pendingOrder)}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 dark:border-[#6C63FF]/40 bg-white dark:bg-[#0D0C1D] px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-[#5D50FE] hover:text-[#5D50FE] dark:hover:text-[#A39DFF] cursor-pointer"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${
                    isCheckingStatus ? 'animate-spin' : ''
                  }`}
                />
                <span>
                  {isEn ? 'Check payment status' : 'Kiểm tra trạng thái thanh toán'}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Trạng thái 2: ĐÃ THANH TOÁN THÀNH CÔNG */}
        {pendingOrder && pendingOrder.status === 'PAID' && verifiedRecord && (
          <div
            role="status"
            data-testid="donation-realtime-success"
            className="space-y-2 rounded-2xl border border-emerald-200 dark:border-emerald-500/40 bg-emerald-50/80 dark:bg-emerald-950/40 p-4 text-xs text-slate-800 dark:text-slate-100"
          >
            <div className="flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>
                {isEn
                  ? `Payment confirmed! ${verifiedRecord.name} (${formatVnd(verifiedRecord.amountVnd)}) has been honored on the Leaderboard!`
                  : `Thanh toán thành công! Đã vinh danh ${verifiedRecord.name} (${formatVnd(verifiedRecord.amountVnd)}) lên Bảng xếp hạng!`}
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              {isEn
                ? 'Thank you for supporting BWAN CLUB. Verified receipt code: '
                : 'Cảm ơn bạn đã đồng hành cùng BWAN CLUB. Mã biên lai xác thực: '}
              <strong className="font-mono-tabular">
                {verifiedRecord.verifiedReceiptCode}
              </strong>
            </p>
          </div>
        )}

        {/* Trạng thái 3: ĐÃ HỦY HOẶC HẾT HẠN */}
        {pendingOrder &&
          (pendingOrder.status === 'CANCELLED' ||
            pendingOrder.status === 'EXPIRED') && (
            <div
              role="alert"
              className="rounded-2xl border border-amber-200 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-950/40 p-4 text-xs text-amber-900 dark:text-amber-200"
            >
              <p className="font-bold">
                {isEn
                  ? 'The QR payment session was cancelled or expired.'
                  : 'Giao dịch mã QR đã bị hủy hoặc hết hạn thanh toán.'}
              </p>
              <p className="mt-0.5 text-amber-800 dark:text-amber-300">
                {isEn
                  ? 'This donation has not been recorded yet. Click "Create Donation QR Code" to generate a new code.'
                  : 'Khoản quyên góp chưa được ghi nhận lên Bảng xếp hạng. Bạn có thể bấm “Tạo mã QR Ủng hộ” để tạo mã mới.'}
              </p>
            </div>
          )}

        <div className="flex items-center justify-between border-t border-slate-100 dark:border-[#6C63FF]/20 pt-3 text-[11px] text-slate-400 dark:text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-[#5D50FE] dark:text-[#A39DFF]" />
            <span>
              {isEn
                ? 'Automated payment verification via PayOS'
                : 'Xác thực thanh toán tự động qua PayOS'}
            </span>
          </span>
          <span className="inline-flex items-center gap-1 font-mono-tabular text-[#5D50FE] dark:text-[#A39DFF]">
            <Sparkles className="h-3 w-3" />
            <span>
              {isEn ? 'Updates upon payment' : 'Cập nhật khi đã thanh toán'}
            </span>
          </span>
        </div>
      </form>
    </div>
  );
};
