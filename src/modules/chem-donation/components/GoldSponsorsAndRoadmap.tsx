import React from 'react';
import { GoldSponsor, RoadmapMilestone } from '../types';
import { formatVnd } from '../donationLogic';
import { CheckCircle2, Clock } from 'lucide-react';

interface GoldSponsorsAndRoadmapProps {
  sponsors: GoldSponsor[];
  roadmap: RoadmapMilestone[];
  onOpenSponsorInquiry: () => void;
}

export const GoldSponsorsAndRoadmap: React.FC<GoldSponsorsAndRoadmapProps> = ({
  sponsors,
  roadmap,
  onOpenSponsorInquiry,
}) => {
  return (
    <>
      {/* 1. Gold Sponsors Hall of Honor (Bảng Vinh Danh Nhà Tài Trợ Vàng) */}
      <section id="gold-sponsors-section" className="border-t border-[#232338] py-16">
        <div className="flex flex-col justify-between gap-6 border-b border-[#232338] pb-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#A59DFF]">
              <span>Bảng Vinh Danh Đối Tác Chiến Lược</span>
              <span aria-hidden="true">·</span>
              <span>Bảo Trợ Học Thuật Dài Hạn</span>
            </div>
            <h2
              style={{ textWrap: 'balance' }}
              className="mt-2 font-editorial text-3xl font-semibold tracking-tight text-[#F4F4F9] sm:text-4xl"
            >
              Bảng Vinh Danh Những Nhà Tài Trợ Vàng Đồng Hành Cùng Hoạt Động Học Thuật
            </h2>
            <p className="mt-3 text-base leading-relaxed text-[#9E9CB8]">
              Sự đồng hành bền bỉ của các viện nghiên cứu, doanh nghiệp hóa chất — thiết bị phân tích và mạng lưới cựu sinh viên là trụ cột giúp CLB duy trì chuẩn mực khoa học suốt gần hai thập kỷ.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenSponsorInquiry}
            className="border border-[#6c63ff] bg-[#6c63ff] px-5 py-3 text-xs font-semibold text-white transition-colors hover:bg-[#5A52E0] whitespace-nowrap shrink-0 self-start lg:self-auto"
          >
            Đăng Ký Trở Thành Đối Tác Học Thuật
          </button>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {sponsors.map((sponsor) => (
            <article
              key={sponsor.id}
              className="flex flex-col justify-between border border-[#26263E] bg-[#131322] p-6 sm:p-8"
            >
              <div>
                {/* Top Header with Periodic Element Monogram */}
                <div className="flex items-start justify-between gap-4 border-b border-[#232338] pb-5">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-[#A59DFF]">
                      <span className="font-semibold uppercase tracking-wider">
                        {sponsor.tierLabel}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono-tabular text-[#9E9CB8]">
                        Đồng hành từ {sponsor.sinceYear}
                      </span>
                    </div>
                    <h3 className="mt-1.5 font-editorial text-xl font-semibold leading-snug text-[#F4F4F9]">
                      {sponsor.organizationName}
                    </h3>
                  </div>

                  {/* Periodic Table Element Plaque */}
                  <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center border border-[#6c63ff] bg-[#0B0B13] p-1.5 text-center">
                    <div className="flex w-full items-center justify-between font-mono-tabular text-[9px] text-[#9E9CB8]">
                      <span>{sponsor.atomicNumber}</span>
                      <span>{sponsor.atomicMass.split(' ')[0]}</span>
                    </div>
                    <span className="font-editorial text-2xl font-bold leading-none text-[#6c63ff]">
                      {sponsor.chemicalSymbol}
                    </span>
                    <span className="mt-0.5 font-mono-tabular text-[9px] uppercase tracking-wider text-[#C8C6DC]">
                      PATRON
                    </span>
                  </div>
                </div>

                {/* Supported Academic Program */}
                <div className="mt-4">
                  <span className="text-[11px] uppercase tracking-wider text-[#9E9CB8]">
                    Chương trình học thuật bảo trợ chính:
                  </span>
                  <p className="mt-1 text-sm font-semibold text-[#C4B5FD]">
                    {sponsor.supportedInitiative}
                  </p>
                </div>

                {/* Attributable Testimonial Quote */}
                <blockquote className="mt-4 border-y border-[#232338] py-3.5 font-serif text-sm italic leading-relaxed text-[#E2E0F5]">
                  “{sponsor.quote}”
                </blockquote>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-4 pt-2 text-xs">
                <div>
                  <p className="font-semibold text-[#F4F4F9]">
                    {sponsor.representativeName}
                  </p>
                  <p className="text-[#9E9CB8]">{sponsor.representativeRole}</p>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-[#9E9CB8]">Cam kết tài trợ thường niên</span>
                  <p className="font-mono-tabular text-sm font-bold text-[#A59DFF]">
                    {formatVnd(sponsor.annualCommitmentVnd)} / năm
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 2. Strategic Vision & Roadmap (Mục Tiêu & Định Hướng Phát Triển CLB) */}
      <section id="vision-roadmap-section" className="border-t border-[#232338] py-16">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#A59DFF]">
            <span>Mục Tiêu & Định Hướng Chiến Lược</span>
            <span aria-hidden="true">·</span>
            <span>Tầm Nhìn 2026 — 2030</span>
          </div>
          <h2
            style={{ textWrap: 'balance' }}
            className="mt-2 font-editorial text-3xl font-semibold tracking-tight text-[#F4F4F9] sm:text-4xl"
          >
            Định Hướng Phát Triển Dài Hạn Của Câu Lạc Bộ
          </h2>
          <p className="mt-3 text-base leading-relaxed text-[#9E9CB8]">
            BWAN Chemistry Club định hướng chuyển mình từ một câu lạc bộ sinh viên truyền thống thành Tổ chức Học thuật & Thực nghiệm Mở tự chủ, kết nối chặt chẽ giữa phòng lab đại học, trường phổ thông và doanh nghiệp R&D.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {roadmap.map((milestone) => {
            const isCurrent = milestone.status === 'in_progress';
            return (
              <div
                key={milestone.id}
                className={`flex flex-col justify-between border p-6 sm:p-8 ${
                  isCurrent
                    ? 'border-[#6c63ff] bg-[#16152B]'
                    : 'border-[#26263E] bg-[#131322]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 border-b border-[#232338] pb-3.5 text-xs">
                    <span className="font-mono-tabular font-bold text-[#A59DFF] whitespace-nowrap shrink-0">
                      {milestone.phaseIndex}
                    </span>
                    <span className="font-mono-tabular text-[11px] text-[#9E9CB8] whitespace-nowrap shrink-0">
                      {milestone.period}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold">
                    {isCurrent ? (
                      <>
                        <Clock className="h-3.5 w-3.5 text-[#6c63ff]" />
                        <span className="text-[#A59DFF]">Đang triển khai trọng điểm</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#9E9CB8]" />
                        <span className="text-[#9E9CB8]">Kế hoạch trung & dài hạn</span>
                      </>
                    )}
                  </div>

                  <h3 className="mt-2 font-editorial text-xl font-semibold leading-snug text-[#F4F4F9]">
                    {milestone.title}
                  </h3>
                  <p className="mt-1 text-xs font-medium text-[#9E9CB8]">
                    {milestone.subtitle}
                  </p>

                  <p className="mt-3 text-sm leading-relaxed text-[#C8C6DC]">
                    {milestone.description}
                  </p>

                  <div className="mt-5 border-t border-[#232338] pt-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#C8C6DC]">
                      Chỉ tiêu đầu ra cam kết:
                    </span>
                    <ul className="mt-2.5 space-y-2 text-xs leading-relaxed text-[#E2E0F5]">
                      {milestone.keyDeliverables.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="font-mono-tabular font-bold text-[#6c63ff]">
                            —
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 flex items-baseline justify-between border-t border-[#232338] pt-4">
                  <span className="text-xs text-[#9E9CB8]">Ngân sách dự kiến giai đoạn:</span>
                  <span className="font-mono-tabular text-sm font-bold text-[#A59DFF]">
                    {formatVnd(milestone.requiredBudgetVnd)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};
