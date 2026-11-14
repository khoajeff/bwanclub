import React, { useState } from 'react';
import { ChemDonationModuleConfig } from '../types';
import { Check, Copy, Code2, Download, Terminal, X } from 'lucide-react';

interface EmbedSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ChemDonationModuleConfig;
}

export const EmbedSyncModal: React.FC<EmbedSyncModalProps> = ({
  isOpen,
  onClose,
  config,
}) => {
  const [activeTab, setActiveTab] = useState<'react' | 'iframe' | 'json'>('react');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const reactSnippet = `// 1. Copy thư mục "src/modules/chem-donation" vào dự án Website CLB của bạn
import { ChemClubDonationModule } from '@/modules/chem-donation';
import customClubData from './chem-club-config.json';

export default function ClubPatronagePage() {
  return (
    <ChemClubDonationModule
      config={customClubData}
      onDonationCreated={async (record) => {
        // Đồng bộ hóa trực tiếp với Backend / Google Sheets / Firebase của CLB
        await fetch('/api/club-donations/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(record),
        });
      }}
    />
  );
}`;

  const iframeSnippet = `<!-- Nhúng trực tiếp danh mục Quỹ Học Thuật vào bất kỳ Website CLB sẵn có (WordPress, Next.js, HTML thuần) -->
<section id="clb-hoa-hoc-donate-container" style="width: 100%; max-width: 1440px; margin: 0 auto;">
  <iframe
    src="https://your-club-domain.edu.vn/embed/chem-donation"
    title="Quỹ Học Thuật & Bảo Trợ Khoa Học - ${config.clubShortName}"
    style="width: 100%; min-height: 1150px; border: 1px solid #26263E; background: #0B0B13;"
    loading="lazy"
    referrerpolicy="no-referrer"
  ></iframe>
</section>`;

  const jsonExportString = JSON.stringify(config, null, 2);

  const handleCopy = (text: string, key: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([jsonExportString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chem-club-donation-config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="embed-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs"
    >
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto border border-[#2A2A45] bg-[#131322] p-6 sm:p-8 text-[#F4F4F9] shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-[#232338] pb-4">
          <div>
            <span className="font-mono-tabular text-xs font-semibold uppercase tracking-widest text-[#A59DFF]">
              KIẾN TRÚC MODULE ĐỘC LẬP · ZERO-COUPLING SDK
            </span>
            <h3
              id="embed-modal-title"
              className="mt-1 font-editorial text-2xl font-semibold text-[#F4F4F9]"
            >
              Tải Code & Đồng Bộ Hóa Vào Website CLB Hóa Học
            </h3>
            <p className="mt-1 text-xs text-[#9E9CB8]">
              Module được đóng gói hoàn toàn độc lập tại{' '}
              <code className="font-mono-tabular font-semibold text-[#C4B5FD]">
                src/modules/chem-donation/
              </code>
              . Bạn có thể import trực tiếp như 1 React Component, nhúng qua Web Iframe hoặc xuất file cấu hình JSON để đồng bộ dữ liệu.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng hộp thoại tích hợp mã nguồn"
            className="border border-[#2A2A45] bg-[#0B0B13] p-2 text-[#F4F4F9] hover:border-[#6c63ff]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="mt-5 flex items-center gap-2 overflow-x-auto border-b border-[#232338] pb-4">
          <button
            type="button"
            onClick={() => setActiveTab('react')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'react'
                ? 'bg-[#6c63ff] text-white'
                : 'border border-[#2A2A45] bg-[#0B0B13] text-[#9E9CB8] hover:text-white'
            }`}
          >
            <Code2 className="h-3.5 w-3.5" />
            <span>1. Nhúng React / Next.js Module</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('iframe')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'iframe'
                ? 'bg-[#6c63ff] text-white'
                : 'border border-[#2A2A45] bg-[#0B0B13] text-[#9E9CB8] hover:text-white'
            }`}
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>2. Mã Nhúng HTML / WordPress</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('json')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'json'
                ? 'bg-[#6c63ff] text-white'
                : 'border border-[#2A2A45] bg-[#0B0B13] text-[#9E9CB8] hover:text-white'
            }`}
          >
            <Download className="h-3.5 w-3.5" />
            <span>3. Dữ Liệu JSON Đồng Bộ ({config.initialDonors.length} Lượt Donate)</span>
          </button>
        </div>

        {/* Code Output Panel */}
        <div className="mt-5">
          {activeTab === 'react' && (
            <div>
              <div className="flex items-center justify-between text-xs text-[#9E9CB8]">
                <span>
                  Tích hợp trực tiếp vào dự án React / TypeScript sẵn có chỉ với 1 lệnh import:
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(reactSnippet, 'react')}
                  className="inline-flex items-center gap-1.5 border border-[#2A2A45] bg-[#0B0B13] px-3 py-1.5 font-semibold text-[#F4F4F9] hover:border-[#6c63ff] whitespace-nowrap shrink-0"
                >
                  {copiedKey === 'react' ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-[#A59DFF]" />
                      <span>Đã sao chép mã React</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Sao chép đoạn mã</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="mt-2.5 overflow-x-auto border border-[#2A2A45] bg-[#0B0B13] p-4 font-mono-tabular text-xs leading-relaxed text-[#E2E0F5]">
                <code>{reactSnippet}</code>
              </pre>
            </div>
          )}

          {activeTab === 'iframe' && (
            <div>
              <div className="flex items-center justify-between text-xs text-[#9E9CB8]">
                <span>
                  Dành cho Website CLB sử dụng CMS (WordPress, Webflow, Joomla) hoặc HTML tĩnh:
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(iframeSnippet, 'iframe')}
                  className="inline-flex items-center gap-1.5 border border-[#2A2A45] bg-[#0B0B13] px-3 py-1.5 font-semibold text-[#F4F4F9] hover:border-[#6c63ff] whitespace-nowrap shrink-0"
                >
                  {copiedKey === 'iframe' ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-[#A59DFF]" />
                      <span>Đã sao chép mã HTML</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Sao chép mã HTML</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="mt-2.5 overflow-x-auto border border-[#2A2A45] bg-[#0B0B13] p-4 font-mono-tabular text-xs leading-relaxed text-[#E2E0F5]">
                <code>{iframeSnippet}</code>
              </pre>
            </div>
          )}

          {activeTab === 'json' && (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#9E9CB8]">
                <span>
                  Toàn bộ trạng thái quỹ hiện tại (bao gồm cả các lượt ủng hộ và lời nhắn mới) theo chuẩn JSON:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(jsonExportString, 'json')}
                    className="inline-flex items-center gap-1.5 border border-[#2A2A45] bg-[#0B0B13] px-3 py-1.5 font-semibold text-[#F4F4F9] hover:border-[#6c63ff] whitespace-nowrap shrink-0"
                  >
                    {copiedKey === 'json' ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-[#A59DFF]" />
                        <span>Đã chép JSON</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Sao chép JSON</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadJson}
                    className="inline-flex items-center gap-1.5 bg-[#6c63ff] px-3 py-1.5 font-semibold text-white hover:bg-[#5A52E0] whitespace-nowrap shrink-0"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Tải file chem-club-config.json</span>
                  </button>
                </div>
              </div>
              <pre className="mt-2.5 max-h-64 overflow-y-auto border border-[#2A2A45] bg-[#0B0B13] p-4 font-mono-tabular text-[11px] leading-relaxed text-[#E2E0F5]">
                <code>{jsonExportString}</code>
              </pre>
            </div>
          )}
        </div>

        {/* Module File Tree Reference */}
        <div className="mt-6 border-t border-[#232338] pt-4 text-xs text-[#9E9CB8]">
          <p className="font-semibold text-[#F4F4F9]">
            Cấu trúc thư mục độc lập (Zero External Global State):
          </p>
          <p className="mt-1 font-mono-tabular text-[11px] text-[#C4B5FD]">
            src/modules/chem-donation/ → index.ts · ChemClubDonationModule.tsx · types.ts · donationLogic.ts · defaultData.ts
          </p>
        </div>
      </div>
    </div>
  );
};
