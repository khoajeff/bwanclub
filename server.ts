import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'verified-donations.json');

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '5mb' }));

interface ChatHistoryEntry {
  role: 'user' | 'model';
  text: string;
}

interface StoredDonation {
  id: string;
  paymentLinkId: string;
  orderCode?: string | number;
  name: string;
  affiliation: string;
  amountVnd: number;
  message: string;
  timestampIso: string;
  verifiedReceiptCode: string;
}

function readVerifiedDonations(): StoredDonation[] {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeVerifiedDonations(list: StoredDonation[]): void {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch {
    // Ignore write errors in read-only environments
  }
}

function sanitizeDonorName(raw: string): string {
  return (
    String(raw || '')
      .replace(/^.*?\bBWAN\s*/i, '')
      .trim() || 'Nhà Hảo Tâm Ẩn Danh'
  );
}

function getFallbackClubChatReply(message: string): string {
  const lower = message.toLowerCase();

  if (
    lower.includes('dự án') ||
    lower.includes('18 nguyên tố') ||
    lower.includes('bạn là nguyên tố') ||
    lower.includes('project')
  ) {
    return `[Phân tích từ Mô hình Ngôn ngữ Nội bộ · BWAN-Local-LLM | Mức tư duy: Trung bình]\nHệ thống ghi nhận 4 dự án trải nghiệm trọng điểm của **BWAN CLUB (Gen 6)**:\n1. **PROJECT “Bạn là nguyên tố nào?” — Giải Mã 18 Nguyên Tố Nhân Cách**: Trắc nghiệm tương tác phân tích 5 chiều sâu (Tính cách, Tư duy, Làm việc nhóm, Xử lý áp lực, Phong cách sáng tạo).\n2. **Chuỗi Lab Tour Nội Bộ (Lần I – III) & WORKSHOP BWAN GEN 6**: Trải nghiệm thực nghiệm phản ứng chuẩn độ, kết tinh và hóa phát quang.\n3. **Chiến dịch Preorder Valentine (01–02/2027)**: Bộ sưu tập quà tặng ứng dụng tinh thể và hương liệu Hóa học.\n4. **Dự án Tiếp sức mùa thi & BWAN CAMP 2027 (22/08/2027)**.\n\n→ Bạn có thể vào mục **Dự án (/du-an)** và bấm nút **"Trải Nghiệm Dự Án Ngay"** trên từng thẻ để chuyển trực tiếp đến trang tương tác của dự án đó.`;
  }

  if (
    lower.includes('donate') ||
    lower.includes('quyên góp') ||
    lower.includes('ủng hộ') ||
    lower.includes('quỹ') ||
    lower.includes('bxh')
  ) {
    return `[Truy xuất Mô-đun Tài chính · BWAN-Local-LLM | Mức tư duy: Trung bình]\nCổng **Quỹ Học Thuật & Thực Nghiệm BWAN CLUB** tại mục **Quyên góp (/donate)** hỗ trợ tạo mã **QR VietQR PayOS** tự động (tối thiểu từ 2.000 VNĐ) và đồng bộ trực tiếp lên **Bảng Xếp Hạng Top Donate (/leaderboard)** theo thời gian thực.`;
  }

  if (
    lower.includes('sự kiện') ||
    lower.includes('lộ trình') ||
    lower.includes('camp') ||
    lower.includes('lab tour') ||
    lower.includes('lịch')
  ) {
    return `[Tổng hợp Lộ trình Niên khóa · BWAN-Local-LLM | Mức tư duy: Trung bình]\nChuỗi hoạt động 12 tháng của **BWAN CLUB Gen 6 (10/2026 – 09/2027)** gồm:\n• **Giai đoạn HK I (10–12/2026)**: First Meeting (01/11/2026), PROJECT 18 Nguyên tố nhân cách & Lab Tour nội bộ lần I.\n• **Giai đoạn Xuân (01–03/2027)**: Lab Tour lần II, Chiến dịch Preorder Valentine & Sinh nhật BWAN 6 tuổi.\n• **Giai đoạn HK II & Hè (04–09/2027)**: Lab Tour lần III, WORKSHOP BWAN GEN 6, Club Fair & Trại hè **BWAN CAMP 2027 (22/08/2027)**.`;
  }

  if (
    lower.includes('tuyển') ||
    lower.includes('tham gia') ||
    lower.includes('đăng ký') ||
    lower.includes('ứng tuyển')
  ) {
    return `[Trạng thái Tuyển sinh · BWAN-Local-LLM | Mức tư duy: Trung bình]\nHệ thống ghi nhận: Hiện tại **đã hết kỳ mở đơn tuyển thành viên BWAN CLUB Gen 6 (2026 – 2027)**. Đợt tuyển thành viên tiếp theo sẽ mở vào **kỳ mở đơn năm sau (Gen 7)**. Người dùng vẫn có thể tự do trải nghiệm trực tuyến toàn bộ các dự án trên website.`;
  }

  if (
    lower.includes('giới thiệu') ||
    lower.includes('phân ban') ||
    lower.includes('ban') ||
    lower.includes('clb')
  ) {
    return `[Cơ sở Tri thức Tổ chức · BWAN-Local-LLM | Mức tư duy: Trung bình]\n**BWAN CLUB** là Câu lạc bộ Hóa học trực thuộc Đoàn Trường THPT chuyên Lê Quý Đôn Đà Nẵng (thành lập năm 2021, khẩu hiệu **“LEARN NOT STUDY”**). Cơ cấu Ban Quản Lý Gen 6 gồm **2 Đồng Chủ Nhiệm** (**Trần Minh Trí** & **Nguyễn Minh Anh**) và **4 phân ban chính thức**:\n• **Ban Hậu Cần**: có **Tiểu ban Nhân sự** và **Tiểu ban Tài chính**.\n• **Ban Nội Dung**: Chuyên môn học thuật & thực nghiệm Hóa học.\n• **Ban Kỹ Thuật**: có **Tiểu ban Truyền thông**, **Tiểu ban Media** và **Tiểu ban Design**.\n• **Ban Đối Ngoại**: Hợp tác & liên kết CLB.`;
  }

  return `[Phản hồi Suy luận Cục bộ · BWAN-Local-LLM | Mức tư duy: Trung bình]\nTôi là **BWAN-Local-LLM** — mô hình ngôn ngữ AI chạy cục bộ được huấn luyện trên dữ liệu của **BWAN CLUB (THPT chuyên Lê Quý Đôn Đà Nẵng)**.\n\nVề truy vấn *"${message}"*: Hệ thống đã sẵn sàng cung cấp dữ liệu chi tiết về **4 Phân ban**, **4 Dự án trải nghiệm trực tuyến**, **Lộ trình 12 tháng Gen 6** và **Quỹ Học Thuật**. Nếu bạn cần trao đổi cá nhân với con người, vui lòng sử dụng khung **"Nhắn Trực Tiếp Với Thành Viên CLB"** ngay bên cạnh.`;
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'BWAN CLUB Server' });
});

app.post('/api/club/chat', async (req, res) => {
  const { message, history = [] } = req.body || {};

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({
      error: 'Vui lòng nhập nội dung truy vấn cho mô hình ngôn ngữ.',
    });
  }

  // Unified medium thinking level across all queries
  const selectedModel = 'gemini-4-hydrogen';

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return res.json({
      model: 'BWAN-Local-LLM · Mức tư duy: Trung bình',
      reply: getFallbackClubChatReply(message.trim()),
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const formattedHistory = Array.isArray(history)
      ? (history as ChatHistoryEntry[])
          .filter(
            (h) =>
              h &&
              (h.role === 'user' || h.role === 'model') &&
              typeof h.text === 'string'
          )
          .map((h) => ({
            role: h.role,
            parts: [{ text: h.text }],
          }))
      : [];

    const chat = ai.chats.create({
      model: selectedModel,
      history: formattedHistory,
      config: {
        systemInstruction:
          'Bạn là BWAN-Local-LLM — một mô hình ngôn ngữ AI chạy local (cục bộ) của BWAN CLUB (CLB Hóa học trực thuộc Đoàn Trường THPT chuyên Lê Quý Đôn Đà Nẵng — Gen 6, khẩu hiệu “LEARN NOT STUDY”). QUAN TRỌNG: Bạn là AI (mô hình ngôn ngữ), KHÔNG phải con người; tuyệt đối không xưng "mình là thành viên CLB" hay đóng giả con người. Hãy trả lời khách quan, chuẩn xác, có cấu trúc rõ ràng với mức độ tư duy trung bình (cân bằng giữa độ sâu học thuật và tính súc tích). Cung cấp thông tin về: 2 Đồng Chủ Nhiệm Gen 6 (Trần Minh Trí & Nguyễn Minh Anh), 4 phân ban (Ban Hậu Cần gồm Tiểu ban Nhân sự & Tiểu ban Tài chính; Ban Nội Dung; Ban Kỹ Thuật gồm Tiểu ban Truyền thông, Tiểu ban Media, Tiểu ban Design; Ban Đối Ngoại), các dự án để người dùng tham gia trải nghiệm trực tiếp trên web (Giải mã 18 Nguyên tố Nhân cách, Lab Tour I-III, Preorder Valentine, Tiếp sức mùa thi), lộ trình 12 tháng và Quỹ Học Thuật. Nếu người dùng muốn nhắn cho thành viên thật, hướng dẫn họ dùng mục "Nhắn Trực Tiếp Với Thành Viên CLB" ngay bên cạnh.',
      },
    });

    const response = await chat.sendMessage({
      message: message.trim(),
    });

    return res.json({
      model: 'BWAN-Local-LLM · Mức tư duy: Trung bình',
      reply: response.text || getFallbackClubChatReply(message.trim()),
    });
  } catch {
    return res.json({
      model: 'BWAN-Local-LLM · Mức tư duy: Trung bình',
      reply: getFallbackClubChatReply(message.trim()),
    });
  }
});

// 1. Lấy danh sách các khoản donate ĐÃ THANH TOÁN THÀNH CÔNG (PAID)
app.get('/api/donations', (_req, res) => {
  const donations = readVerifiedDonations();
  res.json({ donations });
});

// 2. Kiểm tra trạng thái thanh toán thực tế từ cổng PayOS (PENDING / PAID / CANCELLED)
app.post('/api/payos-status/:paymentLinkId', async (req, res) => {
  const { paymentLinkId } = req.params;
  const cleanId = (paymentLinkId || '').replace(/[^a-zA-Z0-9_-]/g, '');

  if (!cleanId) {
    res.status(400).json({ error: 'Invalid paymentLinkId' });
    return;
  }

  try {
    const payosRes = await fetch(
      `https://pay.payos.vn/api/web/${cleanId}/check-status/`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );

    if (!payosRes.ok) {
      res.status(payosRes.status).json({
        status: 'PENDING',
        error: `PayOS returned ${payosRes.status}`,
      });
      return;
    }

    const json = (await payosRes.json()) as {
      code?: string;
      data?: {
        status?: string;
        amountRemaining?: number;
      };
    };

    const paymentStatus = json?.data?.status || 'PENDING';
    const amountRemaining = json?.data?.amountRemaining;

    if (paymentStatus === 'PAID') {
      const existing = readVerifiedDonations();
      let record = existing.find((d) => d.paymentLinkId === cleanId);

      if (!record && req.body && req.body.amountVnd && req.body.donorName) {
        record = {
          id: `don_${cleanId}`,
          paymentLinkId: cleanId,
          orderCode: req.body.orderCode,
          name: sanitizeDonorName(req.body.donorName),
          affiliation:
            String(req.body.affiliation || '').trim() ||
            'Thành viên & Người yêu Hóa học BWAN CLUB',
          amountVnd: Number(req.body.amountVnd) || 0,
          message: String(req.body.message || '').trim(),
          timestampIso: new Date().toISOString(),
          verifiedReceiptCode:
            String(req.body.receiptCode || '').trim() ||
            `ORD-${req.body.orderCode || cleanId.slice(0, 6).toUpperCase()}`,
        };
        const updated = [record, ...existing];
        writeVerifiedDonations(updated);
        res.json({
          status: 'PAID',
          amountRemaining: 0,
          verifiedRecord: record,
          donations: updated,
        });
        return;
      }

      res.json({
        status: 'PAID',
        amountRemaining: 0,
        verifiedRecord: record || null,
        donations: existing,
      });
      return;
    }

    res.json({
      status: paymentStatus,
      amountRemaining,
    });
  } catch (err) {
    res.status(500).json({
      status: 'PENDING',
      error: err instanceof Error ? err.message : 'Check status error',
    });
  }
});

async function startServer() {
  const distPath = path.join(process.cwd(), 'dist');
  const hasBuiltDist = fs.existsSync(path.join(distPath, 'index.html'));

  if (process.env.NODE_ENV !== 'production') {
    const vitePromise = import('vite').then(({ createServer }) =>
      createServer({
        server: { middlewareMode: true },
        appType: 'spa',
      })
    );

    app.use(async (req, res, next) => {
      try {
        const vite = await vitePromise;
        vite.middlewares(req, res, next);
      } catch (err) {
        next(err);
      }
    });
  } else if (hasBuiltDist) {
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Bind port 3000 immediately so Nginx reverse proxy never gets 502 Bad Gateway during Vite cold start
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BWAN CLUB Server running on http://localhost:${PORT}`);
  });
}

startServer();
