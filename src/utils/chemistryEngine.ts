export interface ClubProjectItem {
  id: string;
  slug: string;
  code: string;
  title: string;
  category: 'du-an' | 'su-kien' | 'nghien-cuu' | 'ung-dung';
  categoryLabel: string;
  semester: string;
  highlightMetric: string;
  chemicalTheme: string;
  summary: string;
  status: 'ACTIVE' | 'UPCOMING' | 'COMPLETED';
  statusLabel: string;
  previewImage?: string;
}

export interface BwanVisionFlow {
  id: string;
  sourceTitle: string;
  targetTitle: string;
  description: string;
  formulaTag: string;
  accentHex: string;
}

export interface BwanCoreValue {
  id: string;
  code: string;
  title: string;
  description: string;
  elementBadge: string;
}

export interface BwanGenerationLeader {
  id: string;
  genNumber: number;
  genLabel: string;
  period: string;
  roleTitle: string;
  leaders: string[];
  slideImage: string;
  elementTag: string;
  summary: string;
}

export interface Gen6OrgSubUnit {
  id: string;
  unitName: string;
  leadName: string;
  roleLabel: string;
}

export interface Gen6OrgBranch {
  id: string;
  departmentName: string;
  headName: string;
  headRoleLabel: string;
  elementBadge: string;
  accentHex: string;
  description: string;
  subUnits: Gen6OrgSubUnit[];
}

export interface Gen6RoadmapMonth {
  id: string;
  monthLabel: string;
  phase: 'hk1-2026' | 'xuan-2027' | 'hk2-2027' | 'he-camp-2027';
  phaseLabel: string;
  highlightBadge?: string;
  items: {
    title: string;
    dateNote?: string;
    type: 'meeting' | 'online' | 'lab' | 'fund' | 'event' | 'camp';
  }[];
}

export const BWAN_CLUB_BACKGROUND = {
  clubName: 'BWAN CLUB',
  schoolAffiliation: 'CLB Hóa học trực thuộc Đoàn Trường THPT chuyên Lê Quý Đôn Đà Nẵng',
  foundedYear: 2021,
  yearsActive: 5,
  currentGen: 'Gen 6 (2026 – 2027)',
  slogan: 'LEARN NOT STUDY',
  backgroundDescription:
    'Là một CLB trẻ được thành lập vào năm 2021, đại diện cho thế hệ “LEARN NOT STUDY”, một thế hệ học Hóa và tiếp cận Khoa học chủ động, sáng tạo.',
  milestoneBanner: 'BWAN đã trải qua 5 năm hoạt động thành công',
  timelineYears: ['2022', '2023', '2024', '2025', '2026'],
};

export const BWAN_VISION_FLOWS: BwanVisionFlow[] = [
  {
    id: 'vision-flow-1',
    sourceTitle: 'Hóa học thuần túy, hóa học thực tiễn',
    targetTitle: 'Bứt phá năng lực cá nhân',
    description:
      'Đi sâu vào bản chất phân tử và thực nghiệm phòng Lab để mỗi thành viên tự tin làm chủ tư duy khoa học độc lập.',
    formulaTag: 'Pt · 78 → Eₐ giảm · Tăng tốc phản ứng',
    accentHex: '#6C63FF',
  },
  {
    id: 'vision-flow-2',
    sourceTitle: 'Kết nối các mảng khoa học với nhau',
    targetTitle: 'Tạo và lan tỏa giá trị đến cộng đồng',
    description:
      'Giao thoa Hóa học với Công nghệ, Thiết kế, Truyền thông và Hoạt động ngoại khóa để mang khoa học đến gần học sinh toàn trường.',
    formulaTag: 'Luminol + H₂O₂ → Ánh sáng 425 nm',
    accentHex: '#0284C7',
  },
];

export const BWAN_CORE_VALUES: BwanCoreValue[] = [
  {
    id: 'core-val-1',
    code: 'GIÁ TRỊ 01',
    title: 'Hóa bản chất, ứng dụng và thực tiễn',
    description:
      'Tiếp cận Hóa học từ gốc rễ bản chất phản ứng đến các ứng dụng thực tế sống động trong đời sống và phòng thí nghiệm.',
    elementBadge: 'Pt · 78',
  },
  {
    id: 'core-val-2',
    code: 'GIÁ TRỊ 02',
    title: 'Kết nối các mảng khoa học',
    description:
      'Liên kết Hóa học với STEM, nghệ thuật thị giác, truyền thông số và tâm lý học nguyên tố trong một hệ sinh thái đa chiều.',
    elementBadge: 'Si · 14',
  },
  {
    id: 'core-val-3',
    code: 'GIÁ TRỊ 03',
    title: '“Hoạt động ngoại khóa”',
    description:
      'Tạo sân chơi trải nghiệm sôi nổi qua chuỗi Lab Tour nội bộ, Workshop thực nghiệm, Club Fair và trại hè BWAN CAMP.',
    elementBadge: 'Ne · 10',
  },
  {
    id: 'core-val-4',
    code: 'GIÁ TRỊ 04',
    title: '“Lan tỏa”',
    description:
      'Chia sẻ nguồn cảm hứng “LEARN NOT STUDY” và giá trị tích cực của thế hệ chuyên Lê Quý Đôn Đà Nẵng đến cộng đồng.',
    elementBadge: 'Au · 79',
  },
];

export const BWAN_GENERATIONS_HISTORY: BwanGenerationLeader[] = [
  {
    id: 'gen-1-founder',
    genNumber: 1,
    genLabel: 'THẾ HỆ KHỞI NGUỒN · GEN 1',
    period: '2021 – 2022',
    roleTitle: 'Co-Founder BWAN CLUB',
    leaders: ['Đỗ Vĩnh Phúc'],
    slideImage: '/assets/aistudio/image_545c3019.png',
    elementTag: 'H · 01 (Nguyên tố Khởi nguyên)',
    summary:
      'Người đồng sáng lập đặt nền móng cho BWAN CLUB vào năm 2021 tại Trường THPT chuyên Lê Quý Đôn Đà Nẵng, mở đầu tinh thần “LEARN NOT STUDY”.',
  },
  {
    id: 'gen-2-bcn',
    genNumber: 2,
    genLabel: 'BAN CHỦ NHIỆM GEN 2',
    period: '2022 – 2023',
    roleTitle: 'Ban Chủ Nhiệm Gen 2',
    leaders: ['Yến Nhi', 'Thục Trinh'],
    slideImage: '/assets/aistudio/image_174c59a1.png',
    elementTag: 'O · 08 (Nguồn sống Lan tỏa)',
    summary:
      'Định hình văn hóa gắn kết học thuật và phát triển các hoạt động ngoại khóa Hóa học đầu tiên tại trường.',
  },
  {
    id: 'gen-3-bcn',
    genNumber: 3,
    genLabel: 'BAN CHỦ NHIỆM GEN 3',
    period: '2023 – 2024',
    roleTitle: 'Ban Chủ Nhiệm Gen 3',
    leaders: ['Hoàng Quyên', 'Như Khuê'],
    slideImage: '/assets/aistudio/image_7bf239d7.png',
    elementTag: 'Ne · 10 (Ánh sáng Sáng tạo)',
    summary:
      'Đẩy mạnh nhận diện truyền thông, chuỗi sự kiện thực nghiệm và lan tỏa hình ảnh năng động của BWAN CLUB.',
  },
  {
    id: 'gen-4-bcn',
    genNumber: 4,
    genLabel: 'BAN CHỦ NHIỆM GEN 4',
    period: '2024 – 2025',
    roleTitle: 'Ban Chủ Nhiệm Gen 4',
    leaders: ['Công Vinh'],
    slideImage: '/assets/aistudio/image_88e16e91.png',
    elementTag: 'Fe · 26 (Ngọn lửa Thực nghiệm)',
    summary:
      'Dấu ấn thực nghiệm bùng nổ với những màn trình diễn phản ứng hóa học rực lửa và chuỗi Lab Tour chuyên sâu.',
  },
  {
    id: 'gen-5-bcn',
    genNumber: 5,
    genLabel: 'BAN CHỦ NHIỆM GEN 5',
    period: '2025 – 2026',
    roleTitle: 'Ban Chủ Nhiệm Gen 5',
    leaders: ['Văn Thoại', 'Minh Khuê'],
    slideImage: '/assets/aistudio/image_4478e8bb.png',
    elementTag: 'Au · 79 (Bền vững & Tiếp nối)',
    summary:
      'Khép lại chặng đường 5 năm đầu tiên đầy tự hào và chuyển giao ngọn lửa nhiệt huyết sang thế hệ Gen 6.',
  },
];

export const BWAN_GEN6_CO_PRESIDENTS = [
  {
    id: 'copres-1',
    name: 'Trần Minh Trí',
    roleTitle: 'Đồng Chủ Nhiệm',
    concurrentRole: 'Kiêm Trưởng Ban Đối Ngoại',
    elementBadge: 'Au · 79',
  },
  {
    id: 'copres-2',
    name: 'Nguyễn Minh Anh',
    roleTitle: 'Đồng Chủ Nhiệm',
    concurrentRole: 'Kiêm Quản Lý Tiểu Ban Truyền Thông',
    elementBadge: 'Ne · 10',
  },
];

export const BWAN_GEN6_ORG_BRANCHES: Gen6OrgBranch[] = [
  {
    id: 'branch-ky-thuat',
    departmentName: 'Ban Kỹ Thuật',
    headName: 'Mai Trần Anh Khoa',
    headRoleLabel: 'Trưởng Ban Kỹ Thuật',
    elementBadge: 'Si · 14 / Ne · 10',
    accentHex: '#6C63FF',
    description:
      'Phụ trách hạ tầng công nghệ, kỹ thuật số và gồm 3 tiểu ban chuyên trách: Tiểu ban Truyền thông, Tiểu ban Media và Tiểu ban Design.',
    subUnits: [
      {
        id: 'sub-truyen-thong',
        unitName: 'Tiểu ban Truyền thông',
        leadName: 'Nguyễn Minh Anh',
        roleLabel: 'Quản lý Tiểu ban Truyền thông',
      },
      {
        id: 'sub-media',
        unitName: 'Tiểu ban Media',
        leadName: 'Nguyễn Lương Minh Đức',
        roleLabel: 'Quản lý Tiểu ban Media (Me-Des)',
      },
      {
        id: 'sub-design',
        unitName: 'Tiểu ban Design',
        leadName: 'Nguyễn Lương Minh Đức',
        roleLabel: 'Quản lý Tiểu ban Design (Me-Des)',
      },
    ],
  },
  {
    id: 'branch-noi-dung',
    departmentName: 'Ban Nội Dung',
    headName: 'Thái Việt Đức & Phan Nhật Nam',
    headRoleLabel: 'Quản Lý Ban Nội Dung',
    elementBadge: 'Pt · 78',
    accentHex: '#0284C7',
    description:
      'Xây dựng nội dung học thuật Hóa học, kịch bản chuyên môn cho Lab Tour, Workshop, dự án “Bạn là nguyên tố nào?” và các ấn phẩm khoa học.',
    subUnits: [
      {
        id: 'sub-noi-dung-1',
        unitName: 'Ban Nội Dung',
        leadName: 'Thái Việt Đức',
        roleLabel: 'Quản lý Ban Nội dung',
      },
      {
        id: 'sub-noi-dung-2',
        unitName: 'Ban Nội Dung',
        leadName: 'Phan Nhật Nam',
        roleLabel: 'Quản lý Ban Nội dung',
      },
    ],
  },
  {
    id: 'branch-doi-ngoai',
    departmentName: 'Ban Đối Ngoại',
    headName: 'Trần Minh Trí',
    headRoleLabel: 'Trưởng Ban Đối Ngoại',
    elementBadge: 'Au · 79',
    accentHex: '#D97706',
    description:
      'Đại diện kết nối đối tác, liên kết các câu lạc bộ trong và ngoài trường THPT chuyên Lê Quý Đôn, điều phối truyền thông đối ngoại và tài trợ.',
    subUnits: [
      {
        id: 'sub-doi-ngoai-main',
        unitName: 'Ban Đối Ngoại',
        leadName: 'Trần Minh Trí',
        roleLabel: 'Trưởng ban Đối ngoại',
      },
    ],
  },
  {
    id: 'branch-hau-can',
    departmentName: 'Ban Hậu Cần',
    headName: 'Dương Phạm Nguyên Thy & Nguyễn Anh Thư',
    headRoleLabel: 'Quản Lý Ban Hậu Cần',
    elementBadge: 'Fe · 26',
    accentHex: '#0D9488',
    description:
      'Gồm 2 tiểu ban trực thuộc: Tiểu ban Nhân sự và Tiểu ban Tài chính, đảm bảo vận hành nội bộ, thu chi quỹ CLB và chuẩn bị hậu cần sự kiện.',
    subUnits: [
      {
        id: 'sub-nhan-su',
        unitName: 'Tiểu ban Nhân sự',
        leadName: 'Dương Phạm Nguyên Thy',
        roleLabel: 'Quản lý Tiểu ban Nhân sự',
      },
      {
        id: 'sub-tai-chinh',
        unitName: 'Tiểu ban Tài chính',
        leadName: 'Nguyễn Anh Thư',
        roleLabel: 'Quản lý Tiểu ban Tài chính',
      },
    ],
  },
];

export const BWAN_GEN6_ROADMAP: Gen6RoadmapMonth[] = [
  {
    id: 'rm-2026-10',
    monthLabel: '27/10 – Đầu tháng 11/2026',
    phase: 'hk1-2026',
    phaseLabel: 'Học Kỳ I · Khởi Động Gen 6',
    highlightBadge: 'KHỞI ĐỘNG GEN 6',
    items: [
      {
        title: 'First Meeting Gen 6',
        dateNote: '01/11/2026',
        type: 'meeting',
      },
      {
        title: 'Online: PROJECT “Bạn là nguyên tố nào?”',
        dateNote: 'Cuối tháng 10 – Đầu tháng 11',
        type: 'online',
      },
    ],
  },
  {
    id: 'rm-2026-11',
    monthLabel: 'Tháng 11 – 2026',
    phase: 'hk1-2026',
    phaseLabel: 'Học Kỳ I · Thực Nghiệm & Tri Ân',
    highlightBadge: 'LAB TOUR I & 20/11',
    items: [
      {
        title: 'Lab Tour nội bộ lần I',
        dateNote: 'Dự tính 29/11/2026',
        type: 'lab',
      },
      {
        title: 'Thu quỹ toàn CLB lần 1 – HK I',
        dateNote: 'Giữa tháng 11/2026',
        type: 'fund',
      },
      {
        title: 'Online: Tri ân ngày Nhà Giáo Việt Nam 20/11 & PROJECT “Bạn là nguyên tố nào?”',
        dateNote: '20/11/2026',
        type: 'online',
      },
    ],
  },
  {
    id: 'rm-2026-12',
    monthLabel: 'Tháng 12 – 2026',
    phase: 'hk1-2026',
    phaseLabel: 'Học Kỳ I · Ra Mắt Website & Giáng Sinh',
    highlightBadge: 'RA MẮT WEBSITE',
    items: [
      {
        title: 'Training ban Nội Dung',
        dateNote: 'Tháng 12/2026',
        type: 'meeting',
      },
      {
        title: 'Online: Ra mắt Website BWAN CLUB',
        dateNote: 'Tháng 12/2026',
        type: 'online',
      },
      {
        title: 'Bài đăng Giáng Sinh',
        dateNote: '25/12/2026',
        type: 'online',
      },
    ],
  },
  {
    id: 'rm-2027-01',
    monthLabel: 'Tháng 01 – 2027',
    phase: 'xuan-2027',
    phaseLabel: 'Học Kỳ II · Chiến Dịch Mùa Xuân & Valentine',
    highlightBadge: 'PREORDER VALENTINE',
    items: [
      {
        title: 'Bài đăng Tết Dương lịch',
        dateNote: '01/01/2027',
        type: 'online',
      },
      {
        title: 'Truyền thông bán hàng Valentine',
        dateNote: '17/01/2027',
        type: 'event',
      },
      {
        title: 'Mở đơn Preorder Valentine',
        dateNote: '24/01/2027',
        type: 'event',
      },
      {
        title: 'Bài đăng sản phẩm Valentine',
        dateNote: '25/01 – 31/01/2027',
        type: 'online',
      },
    ],
  },
  {
    id: 'rm-2027-02',
    monthLabel: 'Tháng 02 – 2027',
    phase: 'xuan-2027',
    phaseLabel: 'Học Kỳ II · Tết Nguyên Đán & Valentine',
    highlightBadge: 'TẾT & VALENTINE',
    items: [
      {
        title: 'Bài đăng Tết Nguyên đán',
        dateNote: '06/02/2027',
        type: 'online',
      },
      {
        title: 'Đóng đơn Preorder Valentine',
        dateNote: '10/02/2027',
        type: 'event',
      },
      {
        title: 'Chuẩn bị và giao hàng Valentine',
        dateNote: '11 – 13/02/2027',
        type: 'event',
      },
    ],
  },
  {
    id: 'rm-2027-03',
    monthLabel: 'Tháng 03 – 2027',
    phase: 'xuan-2027',
    phaseLabel: 'Học Kỳ II · Kỷ Niệm Sinh Nhật BWAN',
    highlightBadge: 'SINH NHẬT 6 TUỔI',
    items: [
      {
        title: 'Sinh nhật BWAN 6 tuổi (2021 – 2027)',
        dateNote: 'Tháng 03/2027',
        type: 'event',
      },
      {
        title: 'Khảo sát ý kiến tổ chức BChTo Gen 6',
        dateNote: 'Tháng 03/2027',
        type: 'meeting',
      },
    ],
  },
  {
    id: 'rm-2027-04',
    monthLabel: 'Tháng 04 – 2027',
    phase: 'hk2-2027',
    phaseLabel: 'Học Kỳ II · Lab Tour III & Kỷ Niệm 30/04',
    highlightBadge: 'LAB TOUR III',
    items: [
      {
        title: 'Thu quỹ toàn CLB lần 2 – HK2',
        dateNote: 'Đầu tháng 04/2027',
        type: 'fund',
      },
      {
        title: 'Lab Tour nội bộ lần III',
        dateNote: 'Giữa tháng 04/2027',
        type: 'lab',
      },
      {
        title: 'Online: Bài đăng kỉ niệm 30/04/1975',
        dateNote: '30/04/2027',
        type: 'online',
      },
    ],
  },
  {
    id: 'rm-2027-05',
    monthLabel: 'Tháng 05 – 2027',
    phase: 'hk2-2027',
    phaseLabel: 'Học Kỳ II · Workshop & Tiếp Sức Mùa Thi',
    highlightBadge: 'WORKSHOP GEN 6',
    items: [
      {
        title: 'WORKSHOP BWAN GEN 6',
        dateNote: 'Tháng 05/2027',
        type: 'lab',
      },
      {
        title: 'Triển khai dự án “Tiếp sức mùa thi 2026”',
        dateNote: 'Tháng 05/2027',
        type: 'event',
      },
    ],
  },
  {
    id: 'rm-2027-06',
    monthLabel: 'Tháng 06 – 2027',
    phase: 'hk2-2027',
    phaseLabel: 'Hè · Chuẩn Bị BQL Gen 7 & Club Fair',
    highlightBadge: 'CLUB FAIR',
    items: [
      {
        title: 'Chốt danh sách Dự trù BQL Gen 7',
        dateNote: 'Tháng 06/2027',
        type: 'meeting',
      },
      {
        title: 'Lên kế hoạch và chuẩn bị cho Club Fair',
        dateNote: 'Tháng 06/2027',
        type: 'event',
      },
      {
        title: 'Club Fair',
        dateNote: 'Cuối tháng 6 – Đầu tháng 7/2027',
        type: 'event',
      },
    ],
  },
  {
    id: 'rm-2027-07',
    monthLabel: 'Tháng 07 – 2027',
    phase: 'he-camp-2027',
    phaseLabel: 'Chiến Dịch Hè · Khởi Động BWAN CAMP',
    highlightBadge: 'TRAINING DESIGN',
    items: [
      {
        title: 'Lên ý tưởng và chuẩn bị cho BWAN CAMP',
        dateNote: 'Tháng 07/2027',
        type: 'camp',
      },
      {
        title: 'Chương trình Training design',
        dateNote: 'Tháng 07/2027',
        type: 'meeting',
      },
    ],
  },
  {
    id: 'rm-2027-08',
    monthLabel: 'Tháng 08 – 2027',
    phase: 'he-camp-2027',
    phaseLabel: 'Chiến Dịch Hè · Trường Hè & BWAN CAMP 2027',
    highlightBadge: 'BWAN CAMP 22/08',
    items: [
      {
        title: 'Trường hè Hóa học',
        dateNote: 'Giữa tháng 08/2027',
        type: 'lab',
      },
      {
        title: 'Mở đơn đăng kí tham gia BWAN CAMP',
        dateNote: 'Tháng 08/2027',
        type: 'camp',
      },
      {
        title: 'Đăng bài mô tả, vid teaser BWAN CAMP',
        dateNote: 'Tháng 08/2027',
        type: 'online',
      },
      {
        title: 'Chuẩn bị và trang trí cho BWAN CAMP',
        dateNote: 'Tháng 08/2027',
        type: 'camp',
      },
      {
        title: 'BWAN CAMP 2027',
        dateNote: '22/08/2027',
        type: 'camp',
      },
    ],
  },
  {
    id: 'rm-2027-09',
    monthLabel: 'Tháng 09 – 2027',
    phase: 'he-camp-2027',
    phaseLabel: 'Tổng Kết Nhiệm Kỳ Gen 6 & Chuyển Giao Gen 7',
    highlightBadge: 'CHUYỂN GIAO GEN 7',
    items: [
      {
        title: 'Last Meeting Gen 6 và công bố BQL Gen 7',
        dateNote: 'Tháng 09/2027',
        type: 'meeting',
      },
    ],
  },
];

export const INITIAL_CLUB_PROJECTS: ClubProjectItem[] = [
  {
    id: 'proj-element-personality',
    slug: 'giai-ma-18-nguyen-to-nhan-cach',
    code: 'BWAN-GEN6-01',
    title: 'PROJECT “Bạn là nguyên tố nào?” — Giải Mã 18 Nguyên Tố Nhân Cách',
    category: 'ung-dung',
    categoryLabel: 'Dự Án Số 1 · Trọng Điểm Gen 6',
    semester: 'Tháng 10 – 11/2026',
    highlightMetric: '1.850+ lượt giải mã',
    chemicalTheme: 'Ne · 10 / Si · 14 / Fe · 26 / Au · 79',
    summary:
      'Chiến dịch trực tuyến mở màn Gen 6 & chuỗi tri ân 20/11: phản ánh thói quen, bản năng và nguồn năng lượng tự nhiên qua 5 chiều sâu tính cách hóa học.',
    status: 'ACTIVE',
    statusLabel: 'Đang mở trải nghiệm',
    previewImage: '/assets/aistudio/image_f5fb4f1c.png',
  },
  {
    id: 'proj-3d-molecular-studio',
    slug: '3d-molecular-studio',
    code: 'BWAN-3D-STUDIO',
    title:
      'BWAN 3D Organic Molecular Studio — Phòng Thí Nghiệm Phân Tử Hữu Cơ 3D',
    category: 'ung-dung',
    categoryLabel: 'Dự Án Số 2 · Mô Phỏng 3D',
    semester: 'Gen 6 · 2026–2027',
    highlightMetric: '25+ phân tử & 4 Cloud APIs (PubChem, PDB)',
    chemicalTheme: 'Three.js 3D · Lai hóa sp/sp²/sp³ · Đo độ dài & góc liên kết',
    summary:
      'Không gian mô phỏng cấu trúc phân tử hữu cơ & phức chất 3D thời gian thực: xoay tự do 360° Quaternion, tra cứu hàng triệu chất từ PubChem/RCSB PDB/ChEMBL, đo góc liên kết trực tiếp và nhập/xuất .SDF/.MOL/.XYZ.',
    status: 'ACTIVE',
    statusLabel: 'Đang mở trải nghiệm',
  },
  {
    id: 'proj-lab-tour-series',
    slug: 'chuoi-lab-tour-noi-bo-va-workshop-gen-6',
    code: 'BWAN-LAB-02',
    title: 'Chuỗi Lab Tour Nội Bộ (Lần I – III) & WORKSHOP BWAN GEN 6',
    category: 'du-an',
    categoryLabel: 'Thực Nghiệm Phòng Lab',
    semester: '11/2026 – 05/2027',
    highlightMetric: '3 kỳ Lab Tour & Workshop',
    chemicalTheme: 'Luminol · Tinh thể CuSO₄ · Phản ứng Nhiệt nhôm',
    summary:
      'Chuỗi thực nghiệm phòng thí nghiệm đặc trưng của BWAN CLUB tại THPT chuyên Lê Quý Đôn Đà Nẵng: Lab Tour nội bộ lần I (29/11/2026), lần III (04/2027) và Workshop Gen 6 (05/2027).',
    status: 'ACTIVE',
    statusLabel: 'Đang triển khai',
  },
  {
    id: 'proj-valentine-chem',
    slug: 'du-an-preorder-valentine-va-san-pham-hoa-hoc',
    code: 'BWAN-PRJ-03',
    title: 'Dự Án Preorder Valentine & Sản Phẩm Sáng Tạo BWAN CLUB',
    category: 'du-an',
    categoryLabel: 'Dự Án Gây Quỹ & Sáng Tạo',
    semester: 'Tháng 01 – 02/2027',
    highlightMetric: '17/01 – 13/02/2027',
    chemicalTheme: 'C₈H₁₁NO₂ (Dopamine) · Tinh thể & Ấn phẩm Hóa học',
    summary:
      'Chiến dịch truyền thông và mở đơn Preorder sản phẩm mùa Valentine (24/01 – 10/02/2027), chuẩn bị và trao gửi quà tặng Hóa học đặc sắc ngày 11–13/02/2027.',
    status: 'UPCOMING',
    statusLabel: 'Sắp diễn ra',
  },
  {
    id: 'proj-tiep-suc-va-bwan-camp',
    slug: 'tiep-suc-mua-thi-truong-he-hoa-hoc-bwan-camp-2027',
    code: 'BWAN-CAMP-04',
    title: 'Dự Án “Tiếp Sức Mùa Thi”, Trường Hè Hóa Học & BWAN CAMP 2027',
    category: 'su-kien',
    categoryLabel: 'Chiến Dịch Lớn & Cộng Đồng',
    semester: 'Tháng 05 – 08/2027',
    highlightMetric: 'BWAN CAMP 22/08/2027',
    chemicalTheme: 'Học bản chất · Kết nối · Lan tỏa',
    summary:
      'Chuỗi hoạt động cộng đồng trọng điểm: Tiếp sức mùa thi (05/2027), Club Fair (cuối tháng 6), Trường hè Hóa học và đại sự kiện BWAN CAMP 2027 (22/08/2027).',
    status: 'UPCOMING',
    statusLabel: 'Sắp diễn ra',
  },
];

export interface ClubEventItem {
  id: string;
  dateLabel: string;
  title: string;
  location: string;
  category: string;
  formulaTag: string;
  description: string;
  spotsRemaining: number;
}

export const INITIAL_CLUB_EVENTS: ClubEventItem[] = [
  {
    id: 'evt-first-meeting-labtour1',
    dateLabel: '01/11 & 29/11/2026',
    title: 'First Meeting Gen 6 & Lab Tour Nội Bộ Lần I — THPT Chuyên Lê Quý Đôn',
    location: 'Phòng Lab Hóa Học · THPT Chuyên Lê Quý Đôn Đà Nẵng',
    category: 'Hoạt động Trọng tâm HK I',
    formulaTag: 'Pt · 78 / Fe · 26',
    description:
      'Buổi gặp mặt đầu tiên của toàn thể thành viên BWAN CLUB Gen 6 (01/11/2026) và trải nghiệm thực nghiệm phòng thí nghiệm Lab Tour nội bộ lần I (dự tính 29/11/2026).',
    spotsRemaining: 35,
  },
  {
    id: 'evt-website-launch-valentine',
    dateLabel: '25/12/2026 – 13/02/2027',
    title: 'Ra Mắt Website BWAN CLUB, Giáng Sinh & Chiến Dịch Preorder Valentine',
    location: 'Trực tuyến & Khuôn viên THPT Chuyên Lê Quý Đôn',
    category: 'Truyền thông & Dự án Gây quỹ',
    formulaTag: 'Ne · 10 / Au · 79',
    description:
      'Chính thức ra mắt nền tảng Website BWAN CLUB dịp Giáng Sinh (12/2026), nối tiếp bằng chiến dịch mở đơn Preorder và giao quà Valentine (17/01 – 13/02/2027).',
    spotsRemaining: 50,
  },
  {
    id: 'evt-workshop-clubfair-camp',
    dateLabel: '05/2027 – 22/08/2027',
    title: 'WORKSHOP BWAN GEN 6, Club Fair, Trường Hè Hóa Học & BWAN CAMP 2027',
    location: 'THPT Chuyên Lê Quý Đôn Đà Nẵng & Khu Trại Hè BWAN CAMP',
    category: 'Sự kiện Lớn & Trại hè Khoa học',
    formulaTag: 'LEARN NOT STUDY',
    description:
      'Chuỗi sự kiện bùng nổ nửa cuối nhiệm kỳ Gen 6: Workshop thực nghiệm (05/2027), Tiếp sức mùa thi, Club Fair (cuối tháng 6), Trường hè Hóa học và BWAN CAMP (22/08/2027).',
    spotsRemaining: 60,
  },
];

export interface ClubDepartment {
  id: string;
  code: string;
  elementSymbol: string;
  atomicNumber: number;
  name: string;
  subDivisionsList: string[];
  leadSummary: string;
  roleDescription: string;
  keyActivities: string[];
  accentHex: string;
}

export const CLUB_DEPARTMENTS: ClubDepartment[] = [
  {
    id: 'dept-hau-can',
    code: 'BAN HẬU CẦN · TIỂU BAN NHÂN SỰ & TIỂU BAN TÀI CHÍNH',
    elementSymbol: 'Fe',
    atomicNumber: 26,
    name: 'Ban Hậu Cần',
    subDivisionsList: ['Tiểu ban Nhân sự', 'Tiểu ban Tài chính'],
    leadSummary:
      'Tiểu ban Nhân sự: Dương Phạm Nguyên Thy · Tiểu ban Tài chính: Nguyễn Anh Thư',
    roleDescription:
      'Ban Hậu Cần có Tiểu ban Nhân sự và Tiểu ban Tài chính: phụ trách gắn kết thành viên nội bộ, quản lý thu chi quỹ hoạt động CLB, chuẩn bị hóa chất, dụng cụ phòng Lab và hậu cần sự kiện.',
    keyActivities: [
      'Tiểu ban Nhân sự: Quản trị thành viên, tổ chức First Meeting, Sinh nhật BWAN 6 tuổi & Last Meeting',
      'Tiểu ban Tài chính: Quản lý ngân sách, thu quỹ toàn CLB 2 học kỳ & đơn hàng Preorder Valentine',
      'Chuẩn bị cơ sở vật chất, hóa chất và hậu cần cho Lab Tour, Workshop & BWAN CAMP 2027',
    ],
    accentHex: '#0D9488',
  },
  {
    id: 'dept-noi-dung',
    code: 'BAN NỘI DUNG · HỌC THUẬT & THỰC NGHIỆM',
    elementSymbol: 'Pt',
    atomicNumber: 78,
    name: 'Ban Nội Dung',
    subDivisionsList: ['Chuyên môn Học thuật & Thực nghiệm Hóa học'],
    leadSummary: 'Quản lý Ban Nội dung: Thái Việt Đức & Phan Nhật Nam',
    roleDescription:
      'Trái tim học thuật của BWAN CLUB theo tinh thần “LEARN NOT STUDY”: biên soạn nội dung chuyên môn Hóa bản chất – ứng dụng và thiết kế quy trình thí nghiệm phòng Lab.',
    keyActivities: [
      'Xây dựng quy trình thí nghiệm cho chuỗi Lab Tour nội bộ lần I, II, III & WORKSHOP BWAN GEN 6',
      'Biên soạn nội dung chuyên môn cho PROJECT “Bạn là nguyên tố nào?” & các bài đăng học thuật',
      'Phát triển học liệu dự án “Tiếp sức mùa thi 2026” và chương trình Trường hè Hóa học',
    ],
    accentHex: '#0284C7',
  },
  {
    id: 'dept-ky-thuat',
    code: 'BAN KỸ THUẬT · TRUYỀN THÔNG · MEDIA · DESIGN',
    elementSymbol: 'Ne',
    atomicNumber: 10,
    name: 'Ban Kỹ Thuật',
    subDivisionsList: [
      'Tiểu ban Truyền thông',
      'Tiểu ban Media',
      'Tiểu ban Design',
    ],
    leadSummary:
      'Trưởng ban: Mai Trần Anh Khoa · Tiểu ban Truyền thông: Nguyễn Minh Anh · Tiểu ban Media & Design: Nguyễn Lương Minh Đức',
    roleDescription:
      'Ban Kỹ Thuật có Tiểu ban Truyền thông, Tiểu ban Media và Tiểu ban Design: đứng sau toàn bộ chiến dịch truyền thông mạng xã hội, nhiếp ảnh – quay dựng (Media), thiết kế đồ họa (Design) và hạ tầng kỹ thuật.',
    keyActivities: [
      'Tiểu ban Truyền thông: Lên kế hoạch nội dung truyền thông, vận hành chiến dịch Online & fanpage CLB',
      'Tiểu ban Media: Quay dựng video teaser BWAN CAMP, ghi hình Lab Tour, Workshop & sự kiện CLB',
      'Tiểu ban Design: Thiết kế bộ nhận diện sự kiện, ấn phẩm số, Preorder Valentine & Training Design',
    ],
    accentHex: '#6C63FF',
  },
  {
    id: 'dept-doi-ngoai',
    code: 'BAN ĐỐI NGOẠI · HỢP TÁC & LIÊN KẾT CLB',
    elementSymbol: 'Au',
    atomicNumber: 79,
    name: 'Ban Đối Ngoại',
    subDivisionsList: ['Đối ngoại & Hợp tác Liên kết CLB'],
    leadSummary: 'Trưởng ban Đối ngoại: Trần Minh Trí',
    roleDescription:
      'Đại diện kết nối đối tác, mở rộng mạng lưới liên kết với các câu lạc bộ trong và ngoài trường THPT chuyên Lê Quý Đôn Đà Nẵng, điều phối công tác đối ngoại và tài trợ.',
    keyActivities: [
      'Đại diện BWAN CLUB giao lưu, hợp tác liên CLB và kết nối mạng lưới học sinh toàn thành phố',
      'Điều phối công tác đối ngoại cho sự kiện Club Fair và trại hè khoa học BWAN CAMP 2027',
      'Vận động nguồn lực đồng hành và lan tỏa hình ảnh BWAN CLUB đến cộng đồng',
    ],
    accentHex: '#D97706',
  },
];

/**
 * Generates an analytical, structured Vietnamese response in the style of a local language model (BWAN-Local-LLM)
 * trained on BWAN CLUB (Gen 6) knowledge, using a unified medium reasoning depth.
 */
export function generateBwanClubAdvisorReply(message: string): string {
  const lower = message.toLowerCase();

  if (
    lower.includes('dự án') ||
    lower.includes('18 nguyên tố') ||
    lower.includes('bạn là nguyên tố') ||
    lower.includes('project')
  ) {
    return `[Phân tích từ Cơ sở dữ liệu BWAN-Local-LLM]:\nHệ thống ghi nhận **4 dự án trọng điểm** của **BWAN CLUB (Gen 6)** dành cho người tham gia trải nghiệm:\n1. **PROJECT “Bạn là nguyên tố nào?” — Giải Mã 18 Nguyên Tố Nhân Cách**: Trắc nghiệm tương tác phân tích 5 chiều sâu (Tính cách, Tư duy, Làm việc nhóm, Xử lý áp lực, Phong cách sáng tạo). Bạn có thể bấm nút **"Trải Nghiệm Dự Án Ngay"** tại mục **Dự án** để mở trực tiếp trang giải mã.\n2. **Chuỗi Lab Tour Nội Bộ (Lần I – III) & WORKSHOP BWAN GEN 6**: Trải nghiệm thực nghiệm phản ứng phát quang Luminol, nuôi tinh thể CuSO₄ và nhiệt nhôm.\n3. **Dự Án Preorder Valentine & Sản Phẩm Sáng Tạo**: Bộ ấn phẩm và quà tặng lấy cảm hứng từ cấu trúc phân tử hóa học.\n4. **Dự Án “Tiếp Sức Mùa Thi”, Trường Hè Hóa Học & BWAN CAMP 2027**.`;
  }

  if (
    lower.includes('donate') ||
    lower.includes('quyên góp') ||
    lower.includes('ủng hộ') ||
    lower.includes('quỹ') ||
    lower.includes('bxh') ||
    lower.includes('bảng xếp hạng')
  ) {
    return `[Truy xuất Mô-đun Tài chính & Quỹ Học Thuật]:\nHệ thống **Quỹ Học Thuật & Bảo Trợ Thực Nghiệm BWAN CLUB** tại đường dẫn **/donate** hỗ trợ tạo mã **QR VietQR PayOS** tự động (mức ủng hộ tối thiểu từ **2.000 VNĐ**).\n\nSau khi hệ thống xác thực giao dịch thành công, dữ liệu sẽ được cộng dồn theo thời gian thực lên **Bảng Xếp Hạng Top Donate** (**/leaderboard**) với 3 hạng mục dẫn đầu: **Top 1 Vương Miện Vàng**, **Top 2 Hạng Bạc** và **Top 3 Hạng Đồng**.`;
  }

  if (
    lower.includes('lịch sử') ||
    lower.includes('thế hệ') ||
    lower.includes('gen 1') ||
    lower.includes('gen 2') ||
    lower.includes('gen 3') ||
    lower.includes('gen 4') ||
    lower.includes('gen 5') ||
    lower.includes('sáng lập') ||
    lower.includes('founder')
  ) {
    return `[Dữ liệu Lịch sử Các Thế hệ BWAN CLUB (2021 – 2027)]:\n**BWAN CLUB** được thành lập năm **2021** trực thuộc Đoàn Trường THPT chuyên Lê Quý Đôn Đà Nẵng với khẩu hiệu **“LEARN NOT STUDY”**.\n• **Gen 1 (2021–2022)**: Co-Founder CLB **Đỗ Vĩnh Phúc**\n• **Gen 2 (2022–2023)**: Ban Chủ Nhiệm **Yến Nhi & Thục Trinh**\n• **Gen 3 (2023–2024)**: Ban Chủ Nhiệm **Hoàng Quyên & Như Khuê**\n• **Gen 4 (2024–2025)**: Ban Chủ Nhiệm **Công Vinh**\n• **Gen 5 (2025–2026)**: Ban Chủ Nhiệm **Văn Thoại & Minh Khuê**\n• **Gen 6 (2026–2027)**: Đồng Chủ Nhiệm **Trần Minh Trí & Nguyễn Minh Anh**.\n\n*(Ghi chú hệ thống: Nền tảng Website được xây dựng bởi **Mai Trần Anh Khoa — Founder**, **Phan Nhật Nam — Co-Founder** & **Trần Minh Trí — CMO**)*.`;
  }

  if (
    lower.includes('sự kiện') ||
    lower.includes('lộ trình') ||
    lower.includes('camp') ||
    lower.includes('lab tour') ||
    lower.includes('lịch')
  ) {
    return `[Truy xuất Lộ trình 12 Tháng Gen 6 (10/2026 – 09/2027)]:\nDữ liệu kế hoạch hoạt động của **BWAN CLUB Gen 6** được chia thành 4 giai đoạn:\n• **Học kỳ I (10–12/2026)**: First Meeting Gen 6 (01/11), PROJECT “Bạn là nguyên tố nào?”, Lab Tour nội bộ lần I (29/11) & Ra mắt Website CLB.\n• **Mùa Xuân (01–03/2027)**: Chiến dịch Preorder Valentine (24/01 – 13/02) & Kỷ niệm Sinh nhật BWAN 6 tuổi (03/2027).\n• **Học kỳ II (04–06/2027)**: Lab Tour lần III (04/2027), WORKSHOP BWAN GEN 6 & Tiếp sức mùa thi (05/2027), Club Fair (cuối tháng 6).\n• **Chiến dịch Hè (07–09/2027)**: Training Design, Trường hè Hóa học, **BWAN CAMP 2027 (22/08/2027)** và chuyển giao Gen 7.`;
  }

  if (
    lower.includes('tuyển') ||
    lower.includes('tham gia') ||
    lower.includes('đăng ký') ||
    lower.includes('ứng tuyển') ||
    lower.includes('mở đơn')
  ) {
    return `[Trạng thái Tuyển Thành Viên Gen 6]:\nTheo dữ liệu hệ thống, hiện tại **đã hết kỳ mở đơn ứng tuyển thành viên BWAN CLUB nhiệm kỳ Gen 6 (2026 – 2027)**. Hệ thống sẽ mở lại biểu mẫu tuyển quân vào **kỳ mở đơn năm sau (Gen 7)**.\n\nNgười dùng vẫn có thể tự do trải nghiệm trực tiếp các dự án tương tác tại mục **Dự án** hoặc nhắn tin trực tiếp với thành viên CLB ở khung bên cạnh.`;
  }

  if (
    lower.includes('phân ban') ||
    lower.includes('cơ cấu') ||
    lower.includes('ban') ||
    lower.includes('giới thiệu') ||
    lower.includes('clb')
  ) {
    return `[Tổng hợp Cơ cấu Tổ chức BWAN CLUB Gen 6]:\n**BWAN CLUB** (CLB Hóa học Trường THPT chuyên Lê Quý Đôn Đà Nẵng) vận hành theo sơ đồ gồm **2 Đồng Chủ Nhiệm** (**Trần Minh Trí** & **Nguyễn Minh Anh**) và **4 phân ban chuyên môn**:\n• **Ban Hậu Cần**: gồm **Tiểu ban Nhân sự** (Dương Phạm Nguyên Thy) và **Tiểu ban Tài chính** (Nguyễn Anh Thư).\n• **Ban Nội Dung**: Chuyên môn học thuật & thực nghiệm Hóa học (Thái Việt Đức & Phan Nhật Nam).\n• **Ban Kỹ Thuật** (Trưởng ban Mai Trần Anh Khoa): gồm **Tiểu ban Truyền thông** (Nguyễn Minh Anh), **Tiểu ban Media** và **Tiểu ban Design** (Nguyễn Lương Minh Đức).\n• **Ban Đối Ngoại**: Hợp tác & liên kết CLB (Trần Minh Trí).`;
  }

  return `[Phản hồi từ Mô hình Ngôn ngữ Nội bộ BWAN-Local-LLM]:\nĐã tiếp nhận truy vấn: *"${message}"*.\n\nMô hình AI nội bộ này được huấn luyện chuyên biệt trên dữ liệu của **BWAN CLUB (Gen 6)** với mức độ tư duy tiêu chuẩn. Bạn có thể yêu cầu mô hình trích xuất thông tin về **4 Dự án trải nghiệm**, **Cơ cấu 4 Phân ban**, **Lộ trình 12 tháng**, hoặc sử dụng bảng **"Nhắn Trực Tiếp Với Thành Viên CLB"** ngay bên cạnh để gửi tin nhắn tới Ban Quản Lý.`;
}

/**
 * Validates and parses a new category/project/event payload to synchronize into the club website
 */
export function parseAndSyncClubProject(
  rawInput: string,
  fallbackTitle?: string,
  fallbackCategory: 'du-an' | 'su-kien' | 'nghien-cuu' | 'ung-dung' = 'du-an'
): { valid: boolean; item?: ClubProjectItem; error?: string } {
  const trimmed = rawInput.trim();
  if (!trimmed && !fallbackTitle?.trim()) {
    return {
      valid: false,
      error: 'Vui lòng nhập tên danh mục/dự án hoặc dán mã JSON để đồng bộ vào website CLB.',
    };
  }

  const categoryLabels: Record<'du-an' | 'su-kien' | 'nghien-cuu' | 'ung-dung', string> = {
    'du-an': 'Dự Án Thực Nghiệm',
    'su-kien': 'Sự Kiện Thường Niên',
    'nghien-cuu': 'Nghiên Cứu Khoa Học',
    'ung-dung': 'Ứng Dụng Hóa Học',
  };

  if (trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (!parsed.title || typeof parsed.title !== 'string') {
        return {
          valid: false,
          error: 'Mã JSON thiếu trường bắt buộc "title" (Tên dự án hoặc danh mục).',
        };
      }

      const cat: 'du-an' | 'su-kien' | 'nghien-cuu' | 'ung-dung' = [
        'du-an',
        'su-kien',
        'nghien-cuu',
        'ung-dung',
      ].includes(parsed.category)
        ? parsed.category
        : fallbackCategory;

      const slug = (parsed.slug || parsed.title)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      return {
        valid: true,
        item: {
          id: `proj-${Date.now()}`,
          slug,
          code: parsed.code || 'BWAN-SYNC',
          title: parsed.title,
          category: cat,
          categoryLabel: categoryLabels[cat],
          semester: parsed.semester || 'Gen 6 · 2026–2027',
          highlightMetric: parsed.highlightMetric || 'Đã đồng bộ mã nguồn',
          chemicalTheme: parsed.chemicalTheme || 'C₆H₆ · Liên kết cộng hóa trị',
          summary:
            parsed.summary ||
            'Danh mục mới đã được đồng bộ thành công vào kiến trúc nền của Câu lạc bộ Hóa Học.',
          status: 'ACTIVE',
          statusLabel: 'Đang triển khai',
        },
      };
    } catch {
      return {
        valid: false,
        error: 'Cú pháp JSON không hợp lệ. Vui lòng kiểm tra lại dấu ngoặc kép hoặc dấu phẩy.',
      };
    }
  }

  const finalTitle = fallbackTitle?.trim() || trimmed.split('\n')[0].slice(0, 70);
  if (finalTitle.length < 3) {
    return {
      valid: false,
      error: 'Tên danh mục hoặc dự án phải có ít nhất 3 ký tự.',
    };
  }

  const slug = finalTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return {
    valid: true,
    item: {
      id: `proj-${Date.now()}`,
      slug,
      code: 'BWAN-MOD',
      title: finalTitle,
      category: fallbackCategory,
      categoryLabel: categoryLabels[fallbackCategory],
      semester: 'Gen 6 · 2026–2027',
      highlightMetric: 'Module mở rộng CLB',
      chemicalTheme: 'Fe · 26 / Cu · 29',
      summary:
        trimmed.length > 10
          ? trimmed.slice(0, 200)
          : 'Danh mục hoạt động mới của CLB Hóa Học đã được chuẩn hóa theo tông màu #6c63ff.',
      status: 'ACTIVE',
      statusLabel: 'Đang triển khai',
    },
  };
}

