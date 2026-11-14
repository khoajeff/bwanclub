import React from 'react';
import { FundAllocationItem, UpcomingClubEvent } from '../types';
import { ResilientImage } from './ResilientImage';
import { Calendar, MapPin, Users, Sparkles } from 'lucide-react';

interface ProjectCatalogSectionProps {
  allocations: FundAllocationItem[];
  upcomingEvents: UpcomingClubEvent[];
  totalRaisedVnd: number;
  totalTargetVnd: number;
  supportersCount: number;
  onScrollToDonate: () => void;
}

export const ProjectCatalogSection: React.FC<ProjectCatalogSectionProps> = ({
  upcomingEvents,
}) => {
  return (
    <>
      {/* DỰ ÁN & SỰ KIỆN SẮP TỚI CỦA CLB */}
      <section
        id="upcoming-events-section"
        className="scroll-mt-24 border-t border-slate-200/80 py-14 sm:py-16"
      >
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#5D50FE]">
            <Sparkles className="h-4 w-4" />
            <span>Hoạt Động Trọng Điểm</span>
          </div>
          <h2
            style={{ textWrap: 'balance' }}
            className="mt-2 text-2xl font-extrabold tracking-tight text-[#181826] sm:text-3xl"
          >
            Dự Án & Sự Kiện Sắp Tới Của BWAN Chemistry
          </h2>
          <p className="mt-2.5 text-sm leading-relaxed text-[#525866] sm:text-base">
            Các sự kiện thực nghiệm, đêm hội Hóa phát quang và dự án cộng đồng được tài trợ trực tiếp từ Quỹ chung CLB.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-7 lg:grid-cols-3">
          {upcomingEvents.map((evt) => (
            <article
              key={evt.id}
              className="flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xs transition-shadow hover:shadow-md"
            >
              <div>
                <ResilientImage
                  src={evt.imageUrl}
                  alt={evt.title}
                  accessionBadge={evt.code}
                  aspectClassName="aspect-[16/10]"
                />

                <div className="p-6">
                  <span className="text-xs font-bold text-[#5D50FE]">
                    {evt.categoryLabel}
                  </span>

                  <h3 className="mt-1.5 text-lg font-extrabold leading-snug text-[#181826]">
                    {evt.title}
                  </h3>

                  <p className="mt-2.5 text-xs leading-relaxed text-[#525866] sm:text-sm">
                    {evt.summary}
                  </p>

                  <dl className="mt-4 space-y-1.5 border-t border-slate-100 pt-3.5 text-xs text-[#334155]">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 shrink-0 text-[#5D50FE]" />
                      <dt className="sr-only">Thời gian</dt>
                      <dd className="font-mono-tabular font-medium">{evt.dateRange}</dd>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-[#5D50FE]" />
                      <dt className="sr-only">Địa điểm</dt>
                      <dd>{evt.location}</dd>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-3.5 w-3.5 shrink-0 text-[#5D50FE]" />
                      <dt className="sr-only">Quy mô</dt>
                      <dd>{evt.expectedParticipants}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="border-t border-slate-100 bg-[#F8F8FB] px-6 py-3 text-xs text-[#525866]">
                <strong className="font-bold text-[#181826]">Điểm nhấn: </strong>
                {evt.highlightDeliverable}
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
};
