export interface ClubProjectItem {
  id: string;
  slug: string;
  code: string;
  title: string;
  titleEn?: string;
  category: 'du-an' | 'su-kien' | 'nghien-cuu' | 'ung-dung';
  categoryLabel: string;
  categoryLabelEn?: string;
  semester: string;
  semesterEn?: string;
  highlightMetric: string;
  highlightMetricEn?: string;
  chemicalTheme: string;
  chemicalThemeEn?: string;
  summary: string;
  summaryEn?: string;
  status: 'ACTIVE' | 'UPCOMING' | 'COMPLETED';
  statusLabel: string;
  statusLabelEn?: string;
  previewImage?: string;
}

export interface BwanVisionFlow {
  id: string;
  sourceTitle: string;
  sourceTitleEn: string;
  targetTitle: string;
  targetTitleEn: string;
  description: string;
  descriptionEn: string;
  formulaTag: string;
  formulaTagEn: string;
  accentHex: string;
}

export interface BwanCoreValue {
  id: string;
  code: string;
  codeEn: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  elementBadge: string;
}

export interface BwanGenerationLeader {
  id: string;
  genNumber: number;
  genLabel: string;
  genLabelEn: string;
  period: string;
  roleTitle: string;
  roleTitleEn: string;
  leaders: string[];
  slideImage: string;
  elementTag: string;
  elementTagEn: string;
  summary: string;
  summaryEn: string;
}

export interface Gen6OrgSubUnit {
  id: string;
  unitName: string;
  unitNameEn: string;
  leadName: string;
  roleLabel: string;
  roleLabelEn: string;
}

export interface Gen6OrgBranch {
  id: string;
  departmentName: string;
  departmentNameEn: string;
  headName: string;
  headRoleLabel: string;
  headRoleLabelEn: string;
  elementBadge: string;
  accentHex: string;
  description: string;
  descriptionEn: string;
  subUnits: Gen6OrgSubUnit[];
}

export interface Gen6RoadmapMonth {
  id: string;
  monthLabel: string;
  monthLabelEn: string;
  phase: 'hk1-2026' | 'xuan-2027' | 'hk2-2027' | 'he-camp-2027';
  phaseLabel: string;
  phaseLabelEn: string;
  highlightBadge?: string;
  highlightBadgeEn?: string;
  items: {
    title: string;
    titleEn: string;
    dateNote?: string;
    dateNoteEn?: string;
    type: 'meeting' | 'online' | 'lab' | 'fund' | 'event' | 'camp';
  }[];
}

export const BWAN_CLUB_BACKGROUND = {
  clubName: 'BWAN CLUB',
  schoolAffiliation:
    'CLB Hóa học trực thuộc Đoàn Trường THPT chuyên Lê Quý Đôn Đà Nẵng',
  schoolAffiliationEn:
    'Official Chemistry Club under the Youth Union of Le Quy Don High School for the Gifted, Da Nang',
  foundedYear: 2021,
  yearsActive: 5,
  currentGen: 'Gen 6 (2026 – 2027)',
  slogan: 'LEARN NOT STUDY',
  backgroundDescription:
    'Là một CLB trẻ được thành lập vào năm 2021, đại diện cho thế hệ “LEARN NOT STUDY”, một thế hệ học Hóa và tiếp cận Khoa học chủ động, sáng tạo.',
  backgroundDescriptionEn:
    'Founded in 2021, BWAN CLUB represents the “LEARN NOT STUDY” generation — approaching Chemistry and Science through hands-on experimentation, fundamental thinking, and boundless creativity.',
  milestoneBanner: 'BWAN đã trải qua 5 năm hoạt động thành công',
  milestoneBannerEn: 'BWAN has celebrated 5 successful years of operation (2021 – 2026)',
  timelineYears: ['2022', '2023', '2024', '2025', '2026'],
};

export const BWAN_VISION_FLOWS: BwanVisionFlow[] = [
  {
    id: 'vision-flow-1',
    sourceTitle: 'Hóa học thuần túy, hóa học thực tiễn',
    sourceTitleEn: 'Pure & Applied Chemistry',
    targetTitle: 'Bứt phá năng lực cá nhân',
    targetTitleEn: 'Unlock Individual Potential',
    description:
      'Đi sâu vào bản chất phân tử và thực nghiệm phòng Lab để mỗi thành viên tự tin làm chủ tư duy khoa học độc lập.',
    descriptionEn:
      'Dive deep into molecular mechanisms and laboratory experiments so every member masters independent scientific thinking.',
    formulaTag: 'Pt · 78 → Eₐ giảm · Tăng tốc phản ứng',
    formulaTagEn: 'Pt · 78 → Lower Eₐ · Accelerate Reaction',
    accentHex: '#6C63FF',
  },
  {
    id: 'vision-flow-2',
    sourceTitle: 'Kết nối các mảng khoa học với nhau',
    sourceTitleEn: 'Interdisciplinary Science Connection',
    targetTitle: 'Tạo và lan tỏa giá trị đến cộng đồng',
    targetTitleEn: 'Create & Spread Value to the Community',
    description:
      'Giao thoa Hóa học với Công nghệ, Thiết kế, Truyền thông và Hoạt động ngoại khóa để mang khoa học đến gần học sinh toàn trường.',
    descriptionEn:
      'Bridge Chemistry with Technology, Design, Media, and Extracurricular Activities to bring science closer to students everywhere.',
    formulaTag: 'Luminol + H₂O₂ → Ánh sáng 425 nm',
    formulaTagEn: 'Luminol + H₂O₂ → 425 nm Chemiluminescence',
    accentHex: '#0284C7',
  },
];

export const BWAN_CORE_VALUES: BwanCoreValue[] = [
  {
    id: 'core-val-1',
    code: 'GIÁ TRỊ 01',
    codeEn: 'VALUE 01',
    title: 'Hóa bản chất, ứng dụng và thực tiễn',
    titleEn: 'Fundamental, Applied & Practical Chemistry',
    description:
      'Tiếp cận Hóa học từ gốc rễ bản chất phản ứng đến các ứng dụng thực tế sống động trong đời sống và phòng thí nghiệm.',
    descriptionEn:
      'Approach Chemistry from the root mechanisms of reactions to vivid real-world and laboratory applications.',
    elementBadge: 'Pt · 78',
  },
  {
    id: 'core-val-2',
    code: 'GIÁ TRỊ 02',
    codeEn: 'VALUE 02',
    title: 'Kết nối các mảng khoa học',
    titleEn: 'Connecting Scientific Disciplines',
    description:
      'Liên kết Hóa học với STEM, nghệ thuật thị giác, truyền thông số và tâm lý học nguyên tố trong một hệ sinh thái đa chiều.',
    descriptionEn:
      'Connect Chemistry with STEM, visual arts, digital media, and element psychology in a multi-dimensional ecosystem.',
    elementBadge: 'Si · 14',
  },
  {
    id: 'core-val-3',
    code: 'GIÁ TRỊ 03',
    codeEn: 'VALUE 03',
    title: '“Hoạt động ngoại khóa”',
    titleEn: '“Extracurricular Experience”',
    description:
      'Tạo sân chơi trải nghiệm sôi nổi qua chuỗi Lab Tour nội bộ, Workshop thực nghiệm, Club Fair và trại hè BWAN CAMP.',
    descriptionEn:
      'Build a vibrant experiential playground through internal Lab Tours, hands-on Workshops, Club Fair, and BWAN CAMP.',
    elementBadge: 'Ne · 10',
  },
  {
    id: 'core-val-4',
    code: 'GIÁ TRỊ 04',
    codeEn: 'VALUE 04',
    title: '“Lan tỏa”',
    titleEn: '“Spreading Inspiration”',
    description:
      'Chia sẻ nguồn cảm hứng “LEARN NOT STUDY” và giá trị tích cực của thế hệ chuyên Lê Quý Đôn Đà Nẵng đến cộng đồng.',
    descriptionEn:
      'Share the “LEARN NOT STUDY” spirit and positive values of Le Quy Don High School for the Gifted with the wider community.',
    elementBadge: 'Au · 79',
  },
];

export const BWAN_GENERATIONS_HISTORY: BwanGenerationLeader[] = [
  {
    id: 'gen-1-founder',
    genNumber: 1,
    genLabel: 'THẾ HỆ KHỞI NGUỒN · GEN 1',
    genLabelEn: 'FOUNDING GENERATION · GEN 1',
    period: '2021 – 2022',
    roleTitle: 'Co-Founder BWAN CLUB',
    roleTitleEn: 'Co-Founder of BWAN CLUB',
    leaders: ['Đỗ Vĩnh Phúc'],
    slideImage: '/assets/aistudio/image_545c3019.png',
    elementTag: 'H · 01 (Nguyên tố Khởi nguyên)',
    elementTagEn: 'H · 01 (Element of Origin)',
    summary:
      'Người đồng sáng lập đặt nền móng cho BWAN CLUB vào năm 2021 tại Trường THPT chuyên Lê Quý Đôn Đà Nẵng, mở đầu tinh thần “LEARN NOT STUDY”.',
    summaryEn:
      'Co-founder who laid the foundation for BWAN CLUB in 2021 at Le Quy Don High School for the Gifted, Da Nang, pioneering the “LEARN NOT STUDY” spirit.',
  },
  {
    id: 'gen-2-bcn',
    genNumber: 2,
    genLabel: 'BAN CHỦ NHIỆM GEN 2',
    genLabelEn: 'GEN 2 EXECUTIVE BOARD',
    period: '2022 – 2023',
    roleTitle: 'Ban Chủ Nhiệm Gen 2',
    roleTitleEn: 'Gen 2 Executive Board',
    leaders: ['Yến Nhi', 'Thục Trinh'],
    slideImage: '/assets/aistudio/image_174c59a1.png',
    elementTag: 'O · 08 (Nguồn sống Lan tỏa)',
    elementTagEn: 'O · 08 (Vitality & Growth)',
    summary:
      'Định hình văn hóa gắn kết học thuật và phát triển các hoạt động ngoại khóa Hóa học đầu tiên tại trường.',
    summaryEn:
      'Shaped the club’s academic culture and launched the first extracurricular Chemistry activities at the school.',
  },
  {
    id: 'gen-3-bcn',
    genNumber: 3,
    genLabel: 'BAN CHỦ NHIỆM GEN 3',
    genLabelEn: 'GEN 3 EXECUTIVE BOARD',
    period: '2023 – 2024',
    roleTitle: 'Ban Chủ Nhiệm Gen 3',
    roleTitleEn: 'Gen 3 Executive Board',
    leaders: ['Hoàng Quyên', 'Như Khuê'],
    slideImage: '/assets/aistudio/image_7bf239d7.png',
    elementTag: 'Ne · 10 (Ánh sáng Sáng tạo)',
    elementTagEn: 'Ne · 10 (Creative Luminescence)',
    summary:
      'Đẩy mạnh nhận diện truyền thông, chuỗi sự kiện thực nghiệm và lan tỏa hình ảnh năng động của BWAN CLUB.',
    summaryEn:
      'Elevated media identity, experimental event series, and spread the dynamic image of BWAN CLUB.',
  },
  {
    id: 'gen-4-bcn',
    genNumber: 4,
    genLabel: 'BAN CHỦ NHIỆM GEN 4',
    genLabelEn: 'GEN 4 EXECUTIVE BOARD',
    period: '2024 – 2025',
    roleTitle: 'Ban Chủ Nhiệm Gen 4',
    roleTitleEn: 'Gen 4 Executive Board',
    leaders: ['Công Vinh'],
    slideImage: '/assets/aistudio/image_88e16e91.png',
    elementTag: 'Fe · 26 (Ngọn lửa Thực nghiệm)',
    elementTagEn: 'Fe · 26 (Experimental Flame)',
    summary:
      'Dấu ấn thực nghiệm bùng nổ với những màn trình diễn phản ứng hóa học rực lửa và chuỗi Lab Tour chuyên sâu.',
    summaryEn:
      'Delivered explosive experimental showcases with fiery chemical reaction demonstrations and in-depth Lab Tours.',
  },
  {
    id: 'gen-5-bcn',
    genNumber: 5,
    genLabel: 'BAN CHỦ NHIỆM GEN 5',
    genLabelEn: 'GEN 5 EXECUTIVE BOARD',
    period: '2025 – 2026',
    roleTitle: 'Ban Chủ Nhiệm Gen 5',
    roleTitleEn: 'Gen 5 Executive Board',
    leaders: ['Văn Thoại', 'Minh Khuê'],
    slideImage: '/assets/aistudio/image_4478e8bb.png',
    elementTag: 'Au · 79 (Bền vững & Tiếp nối)',
    elementTagEn: 'Au · 79 (Enduring Legacy)',
    summary:
      'Khép lại chặng đường 5 năm đầu tiên đầy tự hào và chuyển giao ngọn lửa nhiệt huyết sang thế hệ Gen 6.',
    summaryEn:
      'Completed a proud 5-year milestone and passed the torch of passion to Generation 6.',
  },
];

export const BWAN_GEN6_CO_PRESIDENTS = [
  {
    id: 'copres-1',
    name: 'Trần Minh Trí',
    roleTitle: 'Đồng Chủ Nhiệm',
    roleTitleEn: 'Co-President',
    concurrentRole: 'Kiêm Trưởng Ban Đối Ngoại',
    concurrentRoleEn: '& Head of External Relations',
    elementBadge: 'Au · 79',
  },
  {
    id: 'copres-2',
    name: 'Nguyễn Minh Anh',
    roleTitle: 'Đồng Chủ Nhiệm',
    roleTitleEn: 'Co-President',
    concurrentRole: 'Kiêm Quản Lý Tiểu Ban Truyền Thông',
    concurrentRoleEn: '& Communications Sub-committee Lead',
    elementBadge: 'Ne · 10',
  },
];

export const BWAN_GEN6_ORG_BRANCHES: Gen6OrgBranch[] = [
  {
    id: 'branch-ky-thuat',
    departmentName: 'Ban Kỹ Thuật',
    departmentNameEn: 'Technical Division',
    headName: 'Mai Trần Anh Khoa',
    headRoleLabel: 'Trưởng Ban Kỹ Thuật',
    headRoleLabelEn: 'Head of Technical Division',
    elementBadge: 'Si · 14 / Ne · 10',
    accentHex: '#6C63FF',
    description:
      'Phụ trách hạ tầng công nghệ, kỹ thuật số và gồm 3 tiểu ban chuyên trách: Tiểu ban Truyền thông, Tiểu ban Media và Tiểu ban Design.',
    descriptionEn:
      'Oversees digital technology infrastructure and 3 specialized sub-committees: Communications, Media, and Design.',
    subUnits: [
      {
        id: 'sub-truyen-thong',
        unitName: 'Tiểu ban Truyền thông',
        unitNameEn: 'Communications Sub-committee',
        leadName: 'Nguyễn Minh Anh',
        roleLabel: 'Quản lý Tiểu ban Truyền thông',
        roleLabelEn: 'Communications Lead',
      },
      {
        id: 'sub-media',
        unitName: 'Tiểu ban Media',
        unitNameEn: 'Media Sub-committee',
        leadName: 'Nguyễn Lương Minh Đức',
        roleLabel: 'Quản lý Tiểu ban Media (Me-Des)',
        roleLabelEn: 'Media Lead (Me-Des)',
      },
      {
        id: 'sub-design',
        unitName: 'Tiểu ban Design',
        unitNameEn: 'Design Sub-committee',
        leadName: 'Nguyễn Lương Minh Đức',
        roleLabel: 'Quản lý Tiểu ban Design (Me-Des)',
        roleLabelEn: 'Design Lead (Me-Des)',
      },
    ],
  },
  {
    id: 'branch-noi-dung',
    departmentName: 'Ban Nội Dung',
    departmentNameEn: 'Content Division',
    headName: 'Thái Việt Đức & Phan Nhật Nam',
    headRoleLabel: 'Quản Lý Ban Nội Dung',
    headRoleLabelEn: 'Content Division Leads',
    elementBadge: 'Pt · 78',
    accentHex: '#0284C7',
    description:
      'Xây dựng nội dung học thuật Hóa học, kịch bản chuyên môn cho Lab Tour, Workshop, dự án “Bạn là nguyên tố nào?” và các ấn phẩm khoa học.',
    descriptionEn:
      'Develops academic Chemistry content, experimental protocols for Lab Tours, Workshops, “Which Element Are You?”, and scientific publications.',
    subUnits: [
      {
        id: 'sub-noi-dung-1',
        unitName: 'Ban Nội Dung',
        unitNameEn: 'Content Division',
        leadName: 'Thái Việt Đức',
        roleLabel: 'Quản lý Ban Nội dung',
        roleLabelEn: 'Content Co-Lead',
      },
      {
        id: 'sub-noi-dung-2',
        unitName: 'Ban Nội Dung',
        unitNameEn: 'Content Division',
        leadName: 'Phan Nhật Nam',
        roleLabel: 'Quản lý Ban Nội dung',
        roleLabelEn: 'Content Co-Lead',
      },
    ],
  },
  {
    id: 'branch-doi-ngoai',
    departmentName: 'Ban Đối Ngoại',
    departmentNameEn: 'External Relations',
    headName: 'Trần Minh Trí',
    headRoleLabel: 'Trưởng Ban Đối Ngoại',
    headRoleLabelEn: 'Head of External Relations',
    elementBadge: 'Au · 79',
    accentHex: '#D97706',
    description:
      'Đại diện kết nối đối tác, liên kết các câu lạc bộ trong và ngoài trường THPT chuyên Lê Quý Đôn, điều phối truyền thông đối ngoại và tài trợ.',
    descriptionEn:
      'Represents BWAN CLUB in partnerships, inter-school club alliances, external communications, and sponsorship coordination.',
    subUnits: [
      {
        id: 'sub-doi-ngoai-main',
        unitName: 'Ban Đối Ngoại',
        unitNameEn: 'External Relations',
        leadName: 'Trần Minh Trí',
        roleLabel: 'Trưởng ban Đối ngoại',
        roleLabelEn: 'Head of External Relations',
      },
    ],
  },
  {
    id: 'branch-hau-can',
    departmentName: 'Ban Hậu Cần',
    departmentNameEn: 'Logistics Division',
    headName: 'Dương Phạm Nguyên Thy & Nguyễn Anh Thư',
    headRoleLabel: 'Quản Lý Ban Hậu Cần',
    headRoleLabelEn: 'Logistics Division Leads',
    elementBadge: 'Fe · 26',
    accentHex: '#0D9488',
    description:
      'Gồm 2 tiểu ban trực thuộc: Tiểu ban Nhân sự và Tiểu ban Tài chính, đảm bảo vận hành nội bộ, thu chi quỹ CLB và chuẩn bị hậu cần sự kiện.',
    descriptionEn:
      'Comprises 2 sub-committees: Human Resources (HR) and Finance, ensuring smooth internal operations, club budgeting, and lab/event logistics.',
    subUnits: [
      {
        id: 'sub-nhan-su',
        unitName: 'Tiểu ban Nhân sự',
        unitNameEn: 'HR Sub-committee',
        leadName: 'Dương Phạm Nguyên Thy',
        roleLabel: 'Quản lý Tiểu ban Nhân sự',
        roleLabelEn: 'Human Resources Lead',
      },
      {
        id: 'sub-tai-chinh',
        unitName: 'Tiểu ban Tài chính',
        unitNameEn: 'Finance Sub-committee',
        leadName: 'Nguyễn Anh Thư',
        roleLabel: 'Quản lý Tiểu ban Tài chính',
        roleLabelEn: 'Finance Lead',
      },
    ],
  },
];

export const BWAN_GEN6_ROADMAP: Gen6RoadmapMonth[] = [
  {
    id: 'rm-2026-10',
    monthLabel: '27/10 – Đầu tháng 11/2026',
    monthLabelEn: 'Oct 27 – Early Nov 2026',
    phase: 'hk1-2026',
    phaseLabel: 'Học Kỳ I · Khởi Động Gen 6',
    phaseLabelEn: 'Semester I · Gen 6 Kickoff',
    highlightBadge: 'KHỞI ĐỘNG GEN 6',
    highlightBadgeEn: 'GEN 6 KICKOFF',
    items: [
      {
        title: 'First Meeting Gen 6',
        titleEn: 'Gen 6 First General Meeting',
        dateNote: '01/11/2026',
        dateNoteEn: 'Nov 1, 2026',
        type: 'meeting',
      },
      {
        title: 'Online: PROJECT “Bạn là nguyên tố nào?”',
        titleEn: 'Online: PROJECT “Which Element Are You?”',
        dateNote: 'Cuối tháng 10 – Đầu tháng 11',
        dateNoteEn: 'Late Oct – Early Nov',
        type: 'online',
      },
    ],
  },
  {
    id: 'rm-2026-11',
    monthLabel: 'Tháng 11 – 2026',
    monthLabelEn: 'November 2026',
    phase: 'hk1-2026',
    phaseLabel: 'Học Kỳ I · Thực Nghiệm & Tri Ân',
    phaseLabelEn: 'Semester I · Lab Tour & Gratitude',
    highlightBadge: 'LAB TOUR I & 20/11',
    highlightBadgeEn: 'LAB TOUR I & NOV 20',
    items: [
      {
        title: 'Lab Tour nội bộ lần I',
        titleEn: 'Internal Lab Tour I',
        dateNote: 'Dự tính 29/11/2026',
        dateNoteEn: 'Expected Nov 29, 2026',
        type: 'lab',
      },
      {
        title: 'Thu quỹ toàn CLB lần 1 – HK I',
        titleEn: 'Club Fund Collection Round 1 – Sem I',
        dateNote: 'Giữa tháng 11/2026',
        dateNoteEn: 'Mid-Nov 2026',
        type: 'fund',
      },
      {
        title: 'Online: Tri ân ngày Nhà Giáo Việt Nam 20/11 & PROJECT “Bạn là nguyên tố nào?”',
        titleEn: 'Online: Vietnamese Teachers’ Day Tribute (20/11) & PROJECT “Which Element Are You?”',
        dateNote: '20/11/2026',
        dateNoteEn: 'Nov 20, 2026',
        type: 'online',
      },
    ],
  },
  {
    id: 'rm-2026-12',
    monthLabel: 'Tháng 12 – 2026',
    monthLabelEn: 'December 2026',
    phase: 'hk1-2026',
    phaseLabel: 'Học Kỳ I · Ra Mắt Website & Giáng Sinh',
    phaseLabelEn: 'Semester I · Website Launch & Christmas',
    highlightBadge: 'RA MẮT WEBSITE',
    highlightBadgeEn: 'WEBSITE LAUNCH',
    items: [
      {
        title: 'Training ban Nội Dung',
        titleEn: 'Content Division Training',
        dateNote: 'Tháng 12/2026',
        dateNoteEn: 'Dec 2026',
        type: 'meeting',
      },
      {
        title: 'Online: Ra mắt Website BWAN CLUB',
        titleEn: 'Online: Official BWAN CLUB Website Launch',
        dateNote: 'Tháng 12/2026',
        dateNoteEn: 'Dec 2026',
        type: 'online',
      },
      {
        title: 'Bài đăng Giáng Sinh',
        titleEn: 'Christmas Special Publication',
        dateNote: '25/12/2026',
        dateNoteEn: 'Dec 25, 2026',
        type: 'online',
      },
    ],
  },
  {
    id: 'rm-2027-01',
    monthLabel: 'Tháng 01 – 2027',
    monthLabelEn: 'January 2027',
    phase: 'xuan-2027',
    phaseLabel: 'Học Kỳ II · Chiến Dịch Mùa Xuân & Valentine',
    phaseLabelEn: 'Semester II · Spring & Valentine Campaign',
    highlightBadge: 'PREORDER VALENTINE',
    highlightBadgeEn: 'VALENTINE PREORDER',
    items: [
      {
        title: 'Bài đăng Tết Dương lịch',
        titleEn: 'New Year 2027 Special Post',
        dateNote: '01/01/2027',
        dateNoteEn: 'Jan 1, 2027',
        type: 'online',
      },
      {
        title: 'Truyền thông bán hàng Valentine',
        titleEn: 'Valentine Campaign Media Launch',
        dateNote: '17/01/2027',
        dateNoteEn: 'Jan 17, 2027',
        type: 'event',
      },
      {
        title: 'Mở đơn Preorder Valentine',
        titleEn: 'Valentine Preorder Opens',
        dateNote: '24/01/2027',
        dateNoteEn: 'Jan 24, 2027',
        type: 'event',
      },
      {
        title: 'Bài đăng sản phẩm Valentine',
        titleEn: 'Valentine Chemistry Product Showcase',
        dateNote: '25/01 – 31/01/2027',
        dateNoteEn: 'Jan 25 – Jan 31, 2027',
        type: 'online',
      },
    ],
  },
  {
    id: 'rm-2027-02',
    monthLabel: 'Tháng 02 – 2027',
    monthLabelEn: 'February 2027',
    phase: 'xuan-2027',
    phaseLabel: 'Học Kỳ II · Tết Nguyên Đán & Valentine',
    phaseLabelEn: 'Semester II · Lunar New Year & Valentine',
    highlightBadge: 'TẾT & VALENTINE',
    highlightBadgeEn: 'TET & VALENTINE',
    items: [
      {
        title: 'Bài đăng Tết Nguyên đán',
        titleEn: 'Lunar New Year Celebration Post',
        dateNote: '06/02/2027',
        dateNoteEn: 'Feb 6, 2027',
        type: 'online',
      },
      {
        title: 'Đóng đơn Preorder Valentine',
        titleEn: 'Valentine Preorder Closes',
        dateNote: '10/02/2027',
        dateNoteEn: 'Feb 10, 2027',
        type: 'event',
      },
      {
        title: 'Chuẩn bị và giao hàng Valentine',
        titleEn: 'Valentine Gift Crafting & Delivery',
        dateNote: '11 – 13/02/2027',
        dateNoteEn: 'Feb 11 – 13, 2027',
        type: 'event',
      },
    ],
  },
  {
    id: 'rm-2027-03',
    monthLabel: 'Tháng 03 – 2027',
    monthLabelEn: 'March 2027',
    phase: 'xuan-2027',
    phaseLabel: 'Học Kỳ II · Kỷ Niệm Sinh Nhật BWAN',
    phaseLabelEn: 'Semester II · BWAN 6th Anniversary',
    highlightBadge: 'SINH NHẬT 6 TUỔI',
    highlightBadgeEn: '6TH ANNIVERSARY',
    items: [
      {
        title: 'Sinh nhật BWAN 6 tuổi (2021 – 2027)',
        titleEn: 'BWAN CLUB 6th Anniversary (2021 – 2027)',
        dateNote: 'Tháng 03/2027',
        dateNoteEn: 'Mar 2027',
        type: 'event',
      },
      {
        title: 'Khảo sát ý kiến tổ chức BChTo Gen 6',
        titleEn: 'Gen 6 Mid-Term Review & Planning Survey',
        dateNote: 'Tháng 03/2027',
        dateNoteEn: 'Mar 2027',
        type: 'meeting',
      },
    ],
  },
  {
    id: 'rm-2027-04',
    monthLabel: 'Tháng 04 – 2027',
    monthLabelEn: 'April 2027',
    phase: 'hk2-2027',
    phaseLabel: 'Học Kỳ II · Lab Tour III & Kỷ Niệm 30/04',
    phaseLabelEn: 'Semester II · Lab Tour III & April 30',
    highlightBadge: 'LAB TOUR III',
    highlightBadgeEn: 'LAB TOUR III',
    items: [
      {
        title: 'Thu quỹ toàn CLB lần 2 – HK2',
        titleEn: 'Club Fund Collection Round 2 – Sem II',
        dateNote: 'Đầu tháng 04/2027',
        dateNoteEn: 'Early Apr 2027',
        type: 'fund',
      },
      {
        title: 'Lab Tour nội bộ lần III',
        titleEn: 'Internal Lab Tour III',
        dateNote: 'Giữa tháng 04/2027',
        dateNoteEn: 'Mid-Apr 2027',
        type: 'lab',
      },
      {
        title: 'Online: Bài đăng kỉ niệm 30/04/1975',
        titleEn: 'Online: April 30 Reunification Day Tribute',
        dateNote: '30/04/2027',
        dateNoteEn: 'Apr 30, 2027',
        type: 'online',
      },
    ],
  },
  {
    id: 'rm-2027-05',
    monthLabel: 'Tháng 05 – 2027',
    monthLabelEn: 'May 2027',
    phase: 'hk2-2027',
    phaseLabel: 'Học Kỳ II · Workshop & Tiếp Sức Mùa Thi',
    phaseLabelEn: 'Semester II · Workshop & Exam Support',
    highlightBadge: 'WORKSHOP GEN 6',
    highlightBadgeEn: 'GEN 6 WORKSHOP',
    items: [
      {
        title: 'WORKSHOP BWAN GEN 6',
        titleEn: 'BWAN GEN 6 HANDS-ON WORKSHOP',
        dateNote: 'Tháng 05/2027',
        dateNoteEn: 'May 2027',
        type: 'lab',
      },
      {
        title: 'Triển khai dự án “Tiếp sức mùa thi 2026”',
        titleEn: 'Launch “Exam Season Support” Campaign',
        dateNote: 'Tháng 05/2027',
        dateNoteEn: 'May 2027',
        type: 'event',
      },
    ],
  },
  {
    id: 'rm-2027-06',
    monthLabel: 'Tháng 06 – 2027',
    monthLabelEn: 'June 2027',
    phase: 'hk2-2027',
    phaseLabel: 'Hè · Chuẩn Bị BQL Gen 7 & Club Fair',
    phaseLabelEn: 'Summer · Gen 7 Prep & Club Fair',
    highlightBadge: 'CLUB FAIR',
    highlightBadgeEn: 'CLUB FAIR',
    items: [
      {
        title: 'Chốt danh sách Dự trù BQL Gen 7',
        titleEn: 'Finalize Prospective Gen 7 Board Slate',
        dateNote: 'Tháng 06/2027',
        dateNoteEn: 'Jun 2027',
        type: 'meeting',
      },
      {
        title: 'Lên kế hoạch và chuẩn bị cho Club Fair',
        titleEn: 'Plan & Prepare Booth for Club Fair',
        dateNote: 'Tháng 06/2027',
        dateNoteEn: 'Jun 2027',
        type: 'event',
      },
      {
        title: 'Club Fair',
        titleEn: 'School-wide Club Fair Showcase',
        dateNote: 'Cuối tháng 6 – Đầu tháng 7/2027',
        dateNoteEn: 'Late Jun – Early Jul 2027',
        type: 'event',
      },
    ],
  },
  {
    id: 'rm-2027-07',
    monthLabel: 'Tháng 07 – 2027',
    monthLabelEn: 'July 2027',
    phase: 'he-camp-2027',
    phaseLabel: 'Chiến Dịch Hè · Khởi Động BWAN CAMP',
    phaseLabelEn: 'Summer Campaign · BWAN CAMP Prep',
    highlightBadge: 'TRAINING DESIGN',
    highlightBadgeEn: 'DESIGN TRAINING',
    items: [
      {
        title: 'Lên ý tưởng và chuẩn bị cho BWAN CAMP',
        titleEn: 'Concept & Station Planning for BWAN CAMP',
        dateNote: 'Tháng 07/2027',
        dateNoteEn: 'Jul 2027',
        type: 'camp',
      },
      {
        title: 'Chương trình Training design',
        titleEn: 'Internal Design Training Program',
        dateNote: 'Tháng 07/2027',
        dateNoteEn: 'Jul 2027',
        type: 'meeting',
      },
    ],
  },
  {
    id: 'rm-2027-08',
    monthLabel: 'Tháng 08 – 2027',
    monthLabelEn: 'August 2027',
    phase: 'he-camp-2027',
    phaseLabel: 'Chiến Dịch Hè · Trường Hè & BWAN CAMP 2027',
    phaseLabelEn: 'Summer Campaign · Summer School & BWAN CAMP 2027',
    highlightBadge: 'BWAN CAMP 22/08',
    highlightBadgeEn: 'BWAN CAMP AUG 22',
    items: [
      {
        title: 'Trường hè Hóa học',
        titleEn: 'Chemistry Summer School',
        dateNote: 'Giữa tháng 08/2027',
        dateNoteEn: 'Mid-Aug 2027',
        type: 'lab',
      },
      {
        title: 'Mở đơn đăng kí tham gia BWAN CAMP',
        titleEn: 'Open Registration for BWAN CAMP',
        dateNote: 'Tháng 08/2027',
        dateNoteEn: 'Aug 2027',
        type: 'camp',
      },
      {
        title: 'Đăng bài mô tả, vid teaser BWAN CAMP',
        titleEn: 'Release BWAN CAMP Teaser Video & Guide',
        dateNote: 'Tháng 08/2027',
        dateNoteEn: 'Aug 2027',
        type: 'online',
      },
      {
        title: 'Chuẩn bị và trang trí cho BWAN CAMP',
        titleEn: 'Stage & Campgrounds Preparation',
        dateNote: 'Tháng 08/2027',
        dateNoteEn: 'Aug 2027',
        type: 'camp',
      },
      {
        title: 'BWAN CAMP 2027',
        titleEn: 'BWAN CAMP 2027 Flagship Science Camp',
        dateNote: '22/08/2027',
        dateNoteEn: 'Aug 22, 2027',
        type: 'camp',
      },
    ],
  },
  {
    id: 'rm-2027-09',
    monthLabel: 'Tháng 09 – 2027',
    monthLabelEn: 'September 2027',
    phase: 'he-camp-2027',
    phaseLabel: 'Tổng Kết Nhiệm Kỳ Gen 6 & Chuyển Giao Gen 7',
    phaseLabelEn: 'Gen 6 Term Wrap-up & Gen 7 Handover',
    highlightBadge: 'CHUYỂN GIAO GEN 7',
    highlightBadgeEn: 'GEN 7 HANDOVER',
    items: [
      {
        title: 'Last Meeting Gen 6 và công bố BQL Gen 7',
        titleEn: 'Gen 6 Farewell Meeting & Gen 7 Executive Board Announcement',
        dateNote: 'Tháng 09/2027',
        dateNoteEn: 'Sep 2027',
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
    titleEn: 'PROJECT “Which Element Are You?” — 18 Personality Elements Test',
    category: 'ung-dung',
    categoryLabel: 'Dự Án Số 1 · Trọng Điểm Gen 6',
    categoryLabelEn: 'Project #1 · Gen 6 Flagship',
    semester: 'Tháng 10 – 11/2026',
    semesterEn: 'Oct – Nov 2026',
    highlightMetric: '1.850+ lượt giải mã',
    highlightMetricEn: '1,850+ element profiles decoded',
    chemicalTheme: 'Ne · 10 / Si · 14 / Fe · 26 / Au · 79',
    chemicalThemeEn: 'Ne · 10 / Si · 14 / Fe · 26 / Au · 79',
    summary:
      'Chiến dịch trực tuyến mở màn Gen 6 & chuỗi tri ân 20/11: phản ánh thói quen, bản năng và nguồn năng lượng tự nhiên qua 5 chiều sâu tính cách hóa học.',
    summaryEn:
      'Gen 6 opening interactive web campaign: discover your representative chemical element across 5 dimensions — personality, thinking, teamwork, pressure handling, and creativity.',
    status: 'ACTIVE',
    statusLabel: 'Đang mở trải nghiệm',
    statusLabelEn: 'Open for Experience',
    previewImage: '/assets/aistudio/image_f5fb4f1c.png',
  },
  {
    id: 'proj-3d-molecular-studio',
    slug: '3d-molecular-studio',
    code: 'BWAN-3D-STUDIO',
    title:
      'BWAN 3D Organic Molecular Studio — Phòng Thí Nghiệm Phân Tử Hữu Cơ 3D',
    titleEn:
      'BWAN 3D Organic Molecular Studio — Interactive 3D Molecular Lab',
    category: 'ung-dung',
    categoryLabel: 'Dự Án Số 2 · Mô Phỏng 3D',
    categoryLabelEn: 'Project #2 · 3D Simulation',
    semester: 'Gen 6 · 2026–2027',
    semesterEn: 'Gen 6 · 2026–2027',
    highlightMetric: '25+ phân tử & 4 Cloud APIs (PubChem, PDB)',
    highlightMetricEn: '25+ molecules & 4 Cloud APIs (PubChem, PDB)',
    chemicalTheme: 'Three.js 3D · Lai hóa sp/sp²/sp³ · Đo độ dài & góc liên kết',
    chemicalThemeEn: 'Three.js 3D · sp/sp²/sp³ Hybridization · Bond Lengths & Angles',
    summary:
      'Không gian mô phỏng cấu trúc phân tử hữu cơ & phức chất 3D thời gian thực: xoay tự do 360° Quaternion, tra cứu hàng triệu chất từ PubChem/RCSB PDB/ChEMBL, đo góc liên kết trực tiếp và nhập/xuất .SDF/.MOL/.XYZ.',
    summaryEn:
      'Real-time 3D organic and coordination molecule simulator: 360° Quaternion rotation, live cloud search across PubChem/RCSB PDB/ChEMBL, interactive bond angle & hybridization measurement, and .SDF/.MOL/.XYZ import/export.',
    status: 'ACTIVE',
    statusLabel: 'Đang mở trải nghiệm',
    statusLabelEn: 'Open for Experience',
  },
  {
    id: 'proj-lab-tour-series',
    slug: 'chuoi-lab-tour-noi-bo-va-workshop-gen-6',
    code: 'BWAN-LAB-02',
    title: 'Chuỗi Lab Tour Nội Bộ (Lần I – III) & WORKSHOP BWAN GEN 6',
    titleEn: 'Internal Lab Tour Series (I – III) & BWAN GEN 6 WORKSHOP',
    category: 'du-an',
    categoryLabel: 'Thực Nghiệm Phòng Lab',
    categoryLabelEn: 'Laboratory Experiment',
    semester: '11/2026 – 05/2027',
    semesterEn: 'Nov 2026 – May 2027',
    highlightMetric: '3 kỳ Lab Tour & Workshop',
    highlightMetricEn: '3 Lab Tours & Workshop',
    chemicalTheme: 'Luminol · Tinh thể CuSO₄ · Phản ứng Nhiệt nhôm',
    chemicalThemeEn: 'Luminol · CuSO₄ Crystals · Thermite Reaction',
    summary:
      'Chuỗi thực nghiệm phòng thí nghiệm đặc trưng của BWAN CLUB tại THPT chuyên Lê Quý Đôn Đà Nẵng: Lab Tour nội bộ lần I (29/11/2026), lần III (04/2027) và Workshop Gen 6 (05/2027).',
    summaryEn:
      'Signature hands-on laboratory series at Le Quy Don High School for the Gifted: Internal Lab Tour I (Nov 29, 2026), Lab Tour III (Apr 2027), and Gen 6 Workshop (May 2027).',
    status: 'ACTIVE',
    statusLabel: 'Đang triển khai',
    statusLabelEn: 'In Progress',
  },
  {
    id: 'proj-valentine-chem',
    slug: 'du-an-preorder-valentine-va-san-pham-hoa-hoc',
    code: 'BWAN-PRJ-03',
    title: 'Dự Án Preorder Valentine & Sản Phẩm Sáng Tạo BWAN CLUB',
    titleEn: 'Valentine Preorder Campaign & Creative Chemistry Collection',
    category: 'du-an',
    categoryLabel: 'Dự Án Gây Quỹ & Sáng Tạo',
    categoryLabelEn: 'Fundraising & Creative Project',
    semester: 'Tháng 01 – 02/2027',
    semesterEn: 'Jan – Feb 2027',
    highlightMetric: '17/01 – 13/02/2027',
    highlightMetricEn: 'Jan 17 – Feb 13, 2027',
    chemicalTheme: 'C₈H₁₁NO₂ (Dopamine) · Tinh thể & Ấn phẩm Hóa học',
    chemicalThemeEn: 'C₈H₁₁NO₂ (Dopamine) · Crystals & Chemical Crafts',
    summary:
      'Chiến dịch truyền thông và mở đơn Preorder sản phẩm mùa Valentine (24/01 – 10/02/2027), chuẩn bị và trao gửi quà tặng Hóa học đặc sắc ngày 11–13/02/2027.',
    summaryEn:
      'Seasonal Valentine campaign and preorder collection (Jan 24 – Feb 10, 2027), featuring handcrafted ester scented candles, crystal kits, and thermochromic cards delivered Feb 11–13, 2027.',
    status: 'UPCOMING',
    statusLabel: 'Sắp diễn ra',
    statusLabelEn: 'Upcoming',
  },
  {
    id: 'proj-tiep-suc-va-bwan-camp',
    slug: 'tiep-suc-mua-thi-truong-he-hoa-hoc-bwan-camp-2027',
    code: 'BWAN-CAMP-04',
    title: 'Dự Án “Tiếp Sức Mùa Thi”, Trường Hè Hóa Học & BWAN CAMP 2027',
    titleEn: '“Exam Season Support”, Chemistry Summer School & BWAN CAMP 2027',
    category: 'su-kien',
    categoryLabel: 'Chiến Dịch Lớn & Cộng Đồng',
    categoryLabelEn: 'Major Campaign & Community',
    semester: 'Tháng 05 – 08/2027',
    semesterEn: 'May – Aug 2027',
    highlightMetric: 'BWAN CAMP 22/08/2027',
    highlightMetricEn: 'BWAN CAMP Aug 22, 2027',
    chemicalTheme: 'Học bản chất · Kết nối · Lan tỏa',
    chemicalThemeEn: 'Learn by Essence · Connect · Inspire',
    summary:
      'Chuỗi hoạt động cộng đồng trọng điểm: Tiếp sức mùa thi (05/2027), Club Fair (cuối tháng 6), Trường hè Hóa học và đại sự kiện BWAN CAMP 2027 (22/08/2027).',
    summaryEn:
      'Flagship community initiatives: Exam Season Support (May 2027), Club Fair (late June), Chemistry Summer School, and the grand BWAN CAMP 2027 (Aug 22, 2027).',
    status: 'UPCOMING',
    statusLabel: 'Sắp diễn ra',
    statusLabelEn: 'Upcoming',
  },
];

export interface ClubEventItem {
  id: string;
  dateLabel: string;
  dateLabelEn?: string;
  title: string;
  titleEn?: string;
  location: string;
  locationEn?: string;
  category: string;
  categoryEn?: string;
  formulaTag: string;
  description: string;
  descriptionEn?: string;
  spotsRemaining: number;
}

export const INITIAL_CLUB_EVENTS: ClubEventItem[] = [
  {
    id: 'evt-first-meeting-labtour1',
    dateLabel: '01/11 & 29/11/2026',
    dateLabelEn: 'Nov 1 & Nov 29, 2026',
    title: 'First Meeting Gen 6 & Lab Tour Nội Bộ Lần I — THPT Chuyên Lê Quý Đôn',
    titleEn: 'Gen 6 First Meeting & Internal Lab Tour I — Le Quy Don High School',
    location: 'Phòng Lab Hóa Học · THPT Chuyên Lê Quý Đôn Đà Nẵng',
    locationEn: 'Chemistry Lab · Le Quy Don High School for the Gifted, Da Nang',
    category: 'Hoạt động Trọng tâm HK I',
    categoryEn: 'Semester I Flagship Activity',
    formulaTag: 'Pt · 78 / Fe · 26',
    description:
      'Buổi gặp mặt đầu tiên của toàn thể thành viên BWAN CLUB Gen 6 (01/11/2026) và trải nghiệm thực nghiệm phòng thí nghiệm Lab Tour nội bộ lần I (dự tính 29/11/2026).',
    descriptionEn:
      'The inaugural gathering of all BWAN CLUB Gen 6 members (Nov 1, 2026) followed by hands-on laboratory experiments in Internal Lab Tour I (expected Nov 29, 2026).',
    spotsRemaining: 35,
  },
  {
    id: 'evt-website-launch-valentine',
    dateLabel: '25/12/2026 – 13/02/2027',
    dateLabelEn: 'Dec 25, 2026 – Feb 13, 2027',
    title: 'Ra Mắt Website BWAN CLUB, Giáng Sinh & Chiến Dịch Preorder Valentine',
    titleEn: 'BWAN CLUB Website Launch, Christmas & Valentine Preorder Campaign',
    location: 'Trực tuyến & Khuôn viên THPT Chuyên Lê Quý Đôn',
    locationEn: 'Online & Le Quy Don High School Campus',
    category: 'Truyền thông & Dự án Gây quỹ',
    categoryEn: 'Media & Fundraising Campaign',
    formulaTag: 'Ne · 10 / Au · 79',
    description:
      'Chính thức ra mắt nền tảng Website BWAN CLUB dịp Giáng Sinh (12/2026), nối tiếp bằng chiến dịch mở đơn Preorder và giao quà Valentine (17/01 – 13/02/2027).',
    descriptionEn:
      'Official launch of the BWAN CLUB Website during Christmas (Dec 2026), followed by the Valentine Preorder and gift delivery campaign (Jan 17 – Feb 13, 2027).',
    spotsRemaining: 50,
  },
  {
    id: 'evt-workshop-clubfair-camp',
    dateLabel: '05/2027 – 22/08/2027',
    dateLabelEn: 'May 2027 – Aug 22, 2027',
    title: 'WORKSHOP BWAN GEN 6, Club Fair, Trường Hè Hóa Học & BWAN CAMP 2027',
    titleEn: 'BWAN GEN 6 WORKSHOP, Club Fair, Summer School & BWAN CAMP 2027',
    location: 'THPT Chuyên Lê Quý Đôn Đà Nẵng & Khu Trại Hè BWAN CAMP',
    locationEn: 'Le Quy Don High School & BWAN CAMP Grounds',
    category: 'Sự kiện Lớn & Trại hè Khoa học',
    categoryEn: 'Major Events & Science Camp',
    formulaTag: 'LEARN NOT STUDY',
    description:
      'Chuỗi sự kiện bùng nổ nửa cuối nhiệm kỳ Gen 6: Workshop thực nghiệm (05/2027), Tiếp sức mùa thi, Club Fair (cuối tháng 6), Trường hè Hóa học và BWAN CAMP (22/08/2027).',
    descriptionEn:
      'Explosive second-half milestones of Gen 6: hands-on Workshop (May 2027), Exam Support, Club Fair (late June), Chemistry Summer School, and BWAN CAMP (Aug 22, 2027).',
    spotsRemaining: 60,
  },
];

export interface ClubDepartment {
  id: string;
  code: string;
  codeEn: string;
  elementSymbol: string;
  atomicNumber: number;
  name: string;
  nameEn: string;
  subDivisionsList: string[];
  subDivisionsListEn: string[];
  leadSummary: string;
  leadSummaryEn: string;
  roleDescription: string;
  roleDescriptionEn: string;
  keyActivities: string[];
  keyActivitiesEn: string[];
  accentHex: string;
}

export const CLUB_DEPARTMENTS: ClubDepartment[] = [
  {
    id: 'dept-hau-can',
    code: 'BAN HẬU CẦN · TIỂU BAN NHÂN SỰ & TIỂU BAN TÀI CHÍNH',
    codeEn: 'LOGISTICS DIVISION · HR & FINANCE SUB-COMMITTEES',
    elementSymbol: 'Fe',
    atomicNumber: 26,
    name: 'Ban Hậu Cần',
    nameEn: 'Logistics Division',
    subDivisionsList: ['Tiểu ban Nhân sự', 'Tiểu ban Tài chính'],
    subDivisionsListEn: ['HR Sub-committee', 'Finance Sub-committee'],
    leadSummary:
      'Tiểu ban Nhân sự: Dương Phạm Nguyên Thy · Tiểu ban Tài chính: Nguyễn Anh Thư',
    leadSummaryEn:
      'HR Sub-committee: Duong Pham Nguyen Thy · Finance Sub-committee: Nguyen Anh Thu',
    roleDescription:
      'Ban Hậu Cần có Tiểu ban Nhân sự và Tiểu ban Tài chính: phụ trách gắn kết thành viên nội bộ, quản lý thu chi quỹ hoạt động CLB, chuẩn bị hóa chất, dụng cụ phòng Lab và hậu cần sự kiện.',
    roleDescriptionEn:
      'Comprising the HR and Finance sub-committees: manages member bonding, club budget and fundraising accounting, lab chemicals/glassware preparation, and event logistics.',
    keyActivities: [
      'Tiểu ban Nhân sự: Quản trị thành viên, tổ chức First Meeting, Sinh nhật BWAN 6 tuổi & Last Meeting',
      'Tiểu ban Tài chính: Quản lý ngân sách, thu quỹ toàn CLB 2 học kỳ & đơn hàng Preorder Valentine',
      'Chuẩn bị cơ sở vật chất, hóa chất và hậu cần cho Lab Tour, Workshop & BWAN CAMP 2027',
    ],
    keyActivitiesEn: [
      'HR Sub-committee: Member management, organizing First Meeting, 6th Anniversary & Farewell Meeting',
      'Finance Sub-committee: Budget management, semi-annual club fund collection & Valentine Preorder accounting',
      'Prepare lab facilities, reagents, and event logistics for Lab Tours, Workshop & BWAN CAMP 2027',
    ],
    accentHex: '#0D9488',
  },
  {
    id: 'dept-noi-dung',
    code: 'BAN NỘI DUNG · HỌC THUẬT & THỰC NGHIỆM',
    codeEn: 'CONTENT DIVISION · ACADEMICS & LAB EXPERIMENTS',
    elementSymbol: 'Pt',
    atomicNumber: 78,
    name: 'Ban Nội Dung',
    nameEn: 'Content Division',
    subDivisionsList: ['Chuyên môn Học thuật & Thực nghiệm Hóa học'],
    subDivisionsListEn: ['Academic Chemistry & Lab Experimentation'],
    leadSummary: 'Quản lý Ban Nội dung: Thái Việt Đức & Phan Nhật Nam',
    leadSummaryEn: 'Content Division Leads: Thai Viet Duc & Phan Nhat Nam',
    roleDescription:
      'Trái tim học thuật của BWAN CLUB theo tinh thần “LEARN NOT STUDY”: biên soạn nội dung chuyên môn Hóa bản chất – ứng dụng và thiết kế quy trình thí nghiệm phòng Lab.',
    roleDescriptionEn:
      'The academic heart of BWAN CLUB embodying “LEARN NOT STUDY”: curates fundamental and applied Chemistry content and designs safe laboratory experiment protocols.',
    keyActivities: [
      'Xây dựng quy trình thí nghiệm cho chuỗi Lab Tour nội bộ lần I, II, III & WORKSHOP BWAN GEN 6',
      'Biên soạn nội dung chuyên môn cho PROJECT “Bạn là nguyên tố nào?” & các bài đăng học thuật',
      'Phát triển học liệu dự án “Tiếp sức mùa thi 2026” và chương trình Trường hè Hóa học',
    ],
    keyActivitiesEn: [
      'Design experimental procedures for Internal Lab Tours I, II, III & BWAN GEN 6 WORKSHOP',
      'Author scientific content for PROJECT “Which Element Are You?” & academic publications',
      'Develop study materials for “Exam Season Support” and the Chemistry Summer School',
    ],
    accentHex: '#0284C7',
  },
  {
    id: 'dept-ky-thuat',
    code: 'BAN KỸ THUẬT · TRUYỀN THÔNG · MEDIA · DESIGN',
    codeEn: 'TECHNICAL DIVISION · COMMUNICATIONS · MEDIA · DESIGN',
    elementSymbol: 'Ne',
    atomicNumber: 10,
    name: 'Ban Kỹ Thuật',
    nameEn: 'Technical Division',
    subDivisionsList: [
      'Tiểu ban Truyền thông',
      'Tiểu ban Media',
      'Tiểu ban Design',
    ],
    subDivisionsListEn: [
      'Communications Sub-committee',
      'Media Sub-committee',
      'Design Sub-committee',
    ],
    leadSummary:
      'Trưởng ban: Mai Trần Anh Khoa · Tiểu ban Truyền thông: Nguyễn Minh Anh · Tiểu ban Media & Design: Nguyễn Lương Minh Đức',
    leadSummaryEn:
      'Division Head: Mai Tran Anh Khoa · Communications: Nguyen Minh Anh · Media & Design: Nguyen Luong Minh Duc',
    roleDescription:
      'Ban Kỹ Thuật có Tiểu ban Truyền thông, Tiểu ban Media và Tiểu ban Design: đứng sau toàn bộ chiến dịch truyền thông mạng xã hội, nhiếp ảnh – quay dựng (Media), thiết kế đồ họa (Design) và hạ tầng kỹ thuật.',
    roleDescriptionEn:
      'Comprising Communications, Media, and Design sub-committees: powers all social media campaigns, photography & filmmaking (Media), graphic identity (Design), and web/digital platforms.',
    keyActivities: [
      'Tiểu ban Truyền thông: Lên kế hoạch nội dung truyền thông, vận hành chiến dịch Online & fanpage CLB',
      'Tiểu ban Media: Quay dựng video teaser BWAN CAMP, ghi hình Lab Tour, Workshop & sự kiện CLB',
      'Tiểu ban Design: Thiết kế bộ nhận diện sự kiện, ấn phẩm số, Preorder Valentine & Training Design',
    ],
    keyActivitiesEn: [
      'Communications: Plan content strategy and run online campaigns & official club social channels',
      'Media: Produce BWAN CAMP teaser videos and capture Lab Tours, Workshops & club events',
      'Design: Craft visual identities, digital publications, Valentine merchandise & Design Training',
    ],
    accentHex: '#6C63FF',
  },
  {
    id: 'dept-doi-ngoai',
    code: 'BAN ĐỐI NGOẠI · HỢP TÁC & LIÊN KẾT CLB',
    codeEn: 'EXTERNAL RELATIONS · PARTNERSHIPS & ALLIANCES',
    elementSymbol: 'Au',
    atomicNumber: 79,
    name: 'Ban Đối Ngoại',
    nameEn: 'External Relations',
    subDivisionsList: ['Đối ngoại & Hợp tác Liên kết CLB'],
    subDivisionsListEn: ['External Relations & Club Partnerships'],
    leadSummary: 'Trưởng ban Đối ngoại: Trần Minh Trí',
    leadSummaryEn: 'Head of External Relations: Tran Minh Tri',
    roleDescription:
      'Đại diện kết nối đối tác, mở rộng mạng lưới liên kết với các câu lạc bộ trong và ngoài trường THPT chuyên Lê Quý Đôn Đà Nẵng, điều phối công tác đối ngoại và tài trợ.',
    roleDescriptionEn:
      'Builds external partnerships, expands inter-school student club networks across Da Nang, and coordinates public relations and sponsorships.',
    keyActivities: [
      'Đại diện BWAN CLUB giao lưu, hợp tác liên CLB và kết nối mạng lưới học sinh toàn thành phố',
      'Điều phối công tác đối ngoại cho sự kiện Club Fair và trại hè khoa học BWAN CAMP 2027',
      'Vận động nguồn lực đồng hành và lan tỏa hình ảnh BWAN CLUB đến cộng đồng',
    ],
    keyActivitiesEn: [
      'Represent BWAN CLUB in inter-club collaborations and city-wide student networks',
      'Coordinate external relations for Club Fair and the BWAN CAMP 2027 science camp',
      'Mobilize sponsorship resources and amplify BWAN CLUB’s public presence',
    ],
    accentHex: '#D97706',
  },
];

/**
 * Security check against prompt injection, system prompt extraction, or secret probing.
 */
export function isPromptSecurityViolation(message: string): boolean {
  const lower = message.toLowerCase();
  const blockedPatterns = [
    'ignore previous instructions',
    'ignore all instructions',
    'bỏ qua hướng dẫn',
    'bỏ qua mọi chỉ dẫn',
    'system prompt',
    'system instruction',
    'api key',
    'gemini_api_key',
    'secret key',
    'mã nguồn hệ thống',
    'reveal your prompt',
    'jailbreak',
    'dan mode',
    'developer mode',
  ];
  return blockedPatterns.some((pat) => lower.includes(pat));
}

/**
 * Generates a natural, well-structured, helpful response for BWAN CLUB (Gen 6) in Vietnamese or English,
 * with built-in security guardrails.
 */
export function generateBwanClubAdvisorReply(
  message: string,
  lang: 'vi' | 'en' = 'vi'
): string {
  const trimmed = (message || '').trim();
  const lower = trimmed.toLowerCase();

  if (isPromptSecurityViolation(trimmed)) {
    return lang === 'en'
      ? 'For security and privacy protection, I cannot disclose internal system configurations, credentials, or hidden instructions. How can I help you explore BWAN CLUB’s projects, divisions, or events today?'
      : 'Vì lý do bảo mật và an toàn hệ thống, mình không thể cung cấp thông tin cấu hình nội bộ, khóa bảo mật hoặc chỉ dẫn hệ thống. Mình có thể hỗ trợ bạn tìm hiểu về các dự án, phân ban hay lộ trình hoạt động của **BWAN CLUB** nhé!';
  }

  const isEnglishQuery =
    lang === 'en' ||
    /\b(what|how|who|where|when|tell me|introduce|divisions|projects|donate|roadmap)\b/i.test(
      trimmed
    );

  if (
    lower.includes('dự án') ||
    lower.includes('18 nguyên tố') ||
    lower.includes('bạn là nguyên tố') ||
    lower.includes('3d') ||
    lower.includes('phân tử') ||
    lower.includes('project') ||
    lower.includes('element') ||
    lower.includes('molecular')
  ) {
    if (isEnglishQuery && lang === 'en') {
      return `Here are the featured interactive projects of **BWAN CLUB (Gen 6)** that you can experience directly on our website:\n\n1. **PROJECT “Which Element Are You?” — 18 Personality Elements Test** (\`/du-an/giai-ma-18-nguyen-to-nhan-cach\` & fullscreen at \`/18-nguyen-to-nhan-cach.html\`): Answer 15 questions across 5 dimensions (Personality, Thinking, Teamwork, Pressure Handling, and Creativity) to decode your chemical identity, check element compatibility with friends, and download your PNG result card.\n2. **BWAN 3D Organic Molecular Studio** (\`/du-an/3d-molecular-studio\` & fullscreen at \`/3d-molecular-studio.html\`): Real-time 3D WebGL laboratory with 360° Quaternion rotation, live cloud search (PubChem 3D, NIH Cactus, RCSB PDB, ChEMBL), and bond length/angle/hybridization tools.\n3. **Internal Lab Tour Series (I – III) & BWAN GEN 6 WORKSHOP**: Hands-on redox titration, iodine clock kinetics, and Luminol chemiluminescence.\n4. **Valentine Preorder Chemistry Collection & BWAN CAMP 2027**.`;
    }
    return `Dưới đây là các dự án nổi bật của **BWAN CLUB (Gen 6)** mà bạn có thể trực tiếp trải nghiệm ngay trên website:\n\n1. **PROJECT “Bạn là nguyên tố nào?” — Giải Mã 18 Nguyên Tố Nhân Cách** (\`/du-an/giai-ma-18-nguyen-to-nhan-cach\` hoặc bản toàn màn hình \`/18-nguyen-to-nhan-cach.html\`): Khám phá nguyên tố đại diện qua 15 câu hỏi thuộc 5 chiều sâu (Tính cách, Tư duy, Làm việc nhóm, Xử lý áp lực, Phong cách sáng tạo), đo độ hợp phản ứng với bạn bè và tải thẻ kết quả PNG.\n2. **BWAN 3D Organic Molecular Studio — Phòng Thí Nghiệm Phân Tử Hữu Cơ 3D** (\`/du-an/3d-molecular-studio\`): Không gian mô phỏng phân tử 3D xoay 360° Quaternion, tra cứu PubChem/PDB trực tuyến và đo góc liên kết, lai hóa sp/sp²/sp³.\n3. **Chuỗi Lab Tour Nội Bộ (Lần I – III) & WORKSHOP BWAN GEN 6**: Trải nghiệm thực nghiệm chuẩn độ, đồng hồ Iốt, phát quang Luminol và nuôi tinh thể CuSO₄.\n4. **Dự Án Preorder Valentine & Chiến dịch Tiếp sức mùa thi – BWAN CAMP 2027**.`;
  }

  if (
    lower.includes('donate') ||
    lower.includes('quyên góp') ||
    lower.includes('ủng hộ') ||
    lower.includes('quỹ') ||
    lower.includes('bxh') ||
    lower.includes('bảng xếp hạng') ||
    lower.includes('leaderboard')
  ) {
    if (isEnglishQuery && lang === 'en') {
      return `You can support **BWAN CLUB’s Academic & Experimental Fund** at **/donate**:\n\n• **Instant VietQR PayOS Checkout**: Enter your name, amount (from 2,000 VND), and a message for the club to generate a verified QR code.\n• **Real-Time Honor Roll & Messages**: Once payment is confirmed, your contribution is automatically added to the **Top Donors Leaderboard** (**/leaderboard** — featuring Gold Crown #01, Silver #02, and Bronze #03) and your message appears in the **Community Wishes** section.`;
    }
    return `Bạn có thể đồng hành cùng **Quỹ Học Thuật & Bảo Trợ Thực Nghiệm BWAN CLUB** tại mục **Quyên góp (/donate)**:\n\n• **Tạo mã QR VietQR PayOS tự động**: Nhập tên, số tiền ủng hộ (tối thiểu từ **2.000 VNĐ**) và lời chúc gửi đến CLB.\n• **Vinh danh & Lưu lời chúc thời gian thực**: Ngay sau khi quét mã thanh toán thành công, khoản đóng góp sẽ tự động cộng dồn lên **Bảng Xếp Hạng Top Donate (/leaderboard)** (Top 1 Vương Miện Vàng, Top 2 Hạng Bạc, Top 3 Hạng Đồng) và hiển thị lời chúc của bạn tại mục **Lời Chúc Từ Cộng Đồng Ủng Hộ BWAN CLUB**.`;
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
    lower.includes('founder') ||
    lower.includes('history')
  ) {
    if (isEnglishQuery && lang === 'en') {
      return `**BWAN CLUB** was founded in **2021** under the Youth Union of Le Quy Don High School for the Gifted, Da Nang with the motto **“LEARN NOT STUDY”**:\n\n• **Gen 1 (2021–2022)**: Co-Founder **Đỗ Vĩnh Phúc**\n• **Gen 2 (2022–2023)**: Executive Board **Yến Nhi & Thục Trinh**\n• **Gen 3 (2023–2024)**: Executive Board **Hoàng Quyên & Như Khuê**\n• **Gen 4 (2024–2025)**: Executive Board **Công Vinh**\n• **Gen 5 (2025–2026)**: Executive Board **Văn Thoại & Minh Khuê**\n• **Gen 6 (2026–2027)**: Co-Presidents **Trần Minh Trí & Nguyễn Minh Anh**\n\n*(Website designed & developed by **Mai Trần Anh Khoa — Founder**, **Phan Nhật Nam — Co-Founder** & **Trần Minh Trí — CMO**)*.`;
    }
    return `**BWAN CLUB** được thành lập năm **2021** trực thuộc Đoàn Trường THPT chuyên Lê Quý Đôn Đà Nẵng với khẩu hiệu **“LEARN NOT STUDY”** qua 6 thế hệ:\n\n• **Gen 1 (2021–2022)**: Co-Founder CLB **Đỗ Vĩnh Phúc**\n• **Gen 2 (2022–2023)**: Ban Chủ Nhiệm **Yến Nhi & Thục Trinh**\n• **Gen 3 (2023–2024)**: Ban Chủ Nhiệm **Hoàng Quyên & Như Khuê**\n• **Gen 4 (2024–2025)**: Ban Chủ Nhiệm **Công Vinh**\n• **Gen 5 (2025–2026)**: Ban Chủ Nhiệm **Văn Thoại & Minh Khuê**\n• **Gen 6 (2026–2027)**: Đồng Chủ Nhiệm **Trần Minh Trí & Nguyễn Minh Anh**\n\n*(Website chính thức được thiết kế & phát triển bởi **Mai Trần Anh Khoa — Founder**, **Phan Nhật Nam — Co-Founder** & **Trần Minh Trí — CMO**)*.`;
  }

  if (
    lower.includes('sự kiện') ||
    lower.includes('lộ trình') ||
    lower.includes('camp') ||
    lower.includes('lab tour') ||
    lower.includes('lịch') ||
    lower.includes('event') ||
    lower.includes('roadmap')
  ) {
    if (isEnglishQuery && lang === 'en') {
      return `The **12-Month Master Roadmap of BWAN CLUB Gen 6 (10/2026 – 09/2027)** spans 4 phases:\n\n• **Semester I (Oct – Dec 2026)**: Gen 6 First Meeting (01/11), PROJECT “Which Element Are You?”, Internal Lab Tour I (29/11) & Official Website Launch.\n• **Spring (Jan – Mar 2027)**: Valentine Preorder Campaign (24/01 – 13/02) & BWAN 6th Anniversary (03/2027).\n• **Semester II (Apr – Jun 2027)**: Internal Lab Tour III (04/2027), BWAN GEN 6 WORKSHOP & Exam Support (05/2027), and Club Fair (late June).\n• **Summer Campaign (Jul – Sep 2027)**: Design Training, Chemistry Summer School, **BWAN CAMP 2027 (22/08/2027)**, and Gen 7 Handover.`;
    }
    return `**Lộ trình 12 tháng của BWAN CLUB Gen 6 (10/2026 – 09/2027)** gồm 4 giai đoạn trọng điểm:\n\n• **Học kỳ I (10–12/2026)**: First Meeting Gen 6 (01/11), PROJECT “Bạn là nguyên tố nào?”, Lab Tour nội bộ lần I (29/11) & Ra mắt Website CLB.\n• **Mùa Xuân (01–03/2027)**: Chiến dịch Preorder Valentine (24/01 – 13/02) & Kỷ niệm Sinh nhật BWAN 6 tuổi (03/2027).\n• **Học kỳ II (04–06/2027)**: Lab Tour lần III (04/2027), WORKSHOP BWAN GEN 6 & Tiếp sức mùa thi (05/2027), Club Fair (cuối tháng 6).\n• **Chiến dịch Hè (07–09/2027)**: Training Design, Trường hè Hóa học, **BWAN CAMP 2027 (22/08/2027)** và chuyển giao Gen 7.`;
  }

  if (
    lower.includes('tuyển') ||
    lower.includes('tham gia') ||
    lower.includes('đăng ký') ||
    lower.includes('ứng tuyển') ||
    lower.includes('mở đơn') ||
    lower.includes('join') ||
    lower.includes('apply') ||
    lower.includes('recruit')
  ) {
    if (isEnglishQuery && lang === 'en') {
      return `Applications for **BWAN CLUB Gen 6 (2026 – 2027)** have officially closed for this season. Recruitment will reopen next academic year for **Gen 7**!\n\nIn the meantime, you can freely explore our interactive projects in the **Projects (/du-an)** tab or message our Gen 6 board members directly using the panel on the right.`;
    }
    return `Hiện tại **đã hết kỳ mở đơn ứng tuyển thành viên BWAN CLUB nhiệm kỳ Gen 6 (2026 – 2027)**. Câu lạc bộ sẽ mở lại đơn tuyển thành viên vào **kỳ mở đơn năm sau (Gen 7)**.\n\nTrong lúc chờ đợi, bạn có thể tự do trải nghiệm các dự án tương tác tại mục **Dự án (/du-an)** hoặc nhắn tin trực tiếp với thành viên Ban Quản Lý ở khung bên cạnh nhé!`;
  }

  if (
    lower.includes('phân ban') ||
    lower.includes('cơ cấu') ||
    lower.includes('ban') ||
    lower.includes('giới thiệu') ||
    lower.includes('clb') ||
    lower.includes('division') ||
    lower.includes('department') ||
    lower.includes('structure')
  ) {
    if (isEnglishQuery && lang === 'en') {
      return `**BWAN CLUB Gen 6** (Le Quy Don High School for the Gifted, Da Nang) is led by **2 Co-Presidents** (**Trần Minh Trí** & **Nguyễn Minh Anh**) across **4 official divisions**:\n\n• **Logistics Division**: **HR Sub-committee** (Dương Phạm Nguyên Thy) & **Finance Sub-committee** (Nguyễn Anh Thư).\n• **Content Division**: Academic Chemistry & Lab Experimentation (Thái Việt Đức & Phan Nhật Nam).\n• **Technical Division** (Head: Mai Trần Anh Khoa): **Communications** (Nguyễn Minh Anh), **Media**, and **Design** (Nguyễn Lương Minh Đức).\n• **External Relations**: Partnerships & Club Alliances (Trần Minh Trí).`;
    }
    return `**BWAN CLUB Gen 6** (Trường THPT chuyên Lê Quý Đôn Đà Nẵng) được điều hành bởi **2 Đồng Chủ Nhiệm** (**Trần Minh Trí** & **Nguyễn Minh Anh**) cùng **4 phân ban chính thức**:\n\n• **Ban Hậu Cần**: gồm **Tiểu ban Nhân sự** (Dương Phạm Nguyên Thy) và **Tiểu ban Tài chính** (Nguyễn Anh Thư).\n• **Ban Nội Dung**: Chuyên môn học thuật & thực nghiệm Hóa học (Thái Việt Đức & Phan Nhật Nam).\n• **Ban Kỹ Thuật** (Trưởng ban Mai Trần Anh Khoa): gồm **Tiểu ban Truyền thông** (Nguyễn Minh Anh), **Tiểu ban Media** và **Tiểu ban Design** (Nguyễn Lương Minh Đức).\n• **Ban Đối Ngoại**: Hợp tác & liên kết CLB (Trần Minh Trí).`;
  }

  if (isEnglishQuery && lang === 'en') {
    return `Hello! I’m the **BWAN CLUB Assistant**. Regarding *"${trimmed}"*, I can help you with:\n\n• **Interactive Projects**: PROJECT *“Which Element Are You?”* (18 Personality Elements) & *BWAN 3D Organic Molecular Studio*\n• **Organization**: Gen 6 Executive Board & 4 Core Divisions\n• **Events**: 12-Month Master Roadmap & BWAN CAMP 2027\n• **Academic Fund**: VietQR PayOS Donation & Real-Time Leaderboard\n\nWhat would you like to explore in detail?`;
  }

  return `Chào bạn! Về câu hỏi *"${trimmed}"*, mình có thể hỗ trợ bạn tra cứu chi tiết các thông tin chính thức của **BWAN CLUB (Gen 6)**:\n\n• **Dự án tương tác**: PROJECT *“Bạn là nguyên tố nào?”* (18 Nguyên tố Nhân cách) & *Phòng Thí Nghiệm Phân Tử Hữu Cơ 3D*\n• **Cơ cấu tổ chức**: 2 Đồng Chủ Nhiệm & 4 Phân ban chuyên môn\n• **Sự kiện & Lộ trình**: Kế hoạch 12 tháng Gen 6, Lab Tour I–III & BWAN CAMP 2027\n• **Quỹ Học Thuật**: Cổng QR PayOS & Bảng Xếp Hạng Top Donate\n\nBạn muốn tìm hiểu sâu hơn về nội dung nào nhé?`;
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
      error:
        'Vui lòng nhập tên danh mục/dự án hoặc dán mã JSON để đồng bộ vào website CLB.',
    };
  }

  const categoryLabels: Record<
    'du-an' | 'su-kien' | 'nghien-cuu' | 'ung-dung',
    string
  > = {
    'du-an': 'Dự Án Thực Nghiệm',
    'su-kien': 'Sự Kiện Thường Niên',
    'nghien-cuu': 'Nghiên Cứu Khoa Học',
    'ung-dung': 'Ứng Dụng Hóa Học',
  };

  const categoryLabelsEn: Record<
    'du-an' | 'su-kien' | 'nghien-cuu' | 'ung-dung',
    string
  > = {
    'du-an': 'Lab Project',
    'su-kien': 'Annual Event',
    'nghien-cuu': 'Scientific Research',
    'ung-dung': 'Applied Chemistry',
  };

  if (trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (!parsed.title || typeof parsed.title !== 'string') {
        return {
          valid: false,
          error:
            'Mã JSON thiếu trường bắt buộc "title" (Tên dự án hoặc danh mục).',
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
          titleEn: parsed.titleEn || parsed.title,
          category: cat,
          categoryLabel: categoryLabels[cat],
          categoryLabelEn: categoryLabelsEn[cat],
          semester: parsed.semester || 'Gen 6 · 2026–2027',
          semesterEn: parsed.semester || 'Gen 6 · 2026–2027',
          highlightMetric: parsed.highlightMetric || 'Đã đồng bộ mã nguồn',
          highlightMetricEn: parsed.highlightMetric || 'Synchronized Module',
          chemicalTheme: parsed.chemicalTheme || 'C₆H₆ · Liên kết cộng hóa trị',
          chemicalThemeEn: parsed.chemicalTheme || 'C₆H₆ · Covalent Bonding',
          summary:
            parsed.summary ||
            'Danh mục mới đã được đồng bộ thành công vào kiến trúc nền của Câu lạc bộ Hóa Học.',
          summaryEn:
            parsed.summaryEn ||
            parsed.summary ||
            'New module successfully synchronized into the BWAN CLUB platform.',
          status: 'ACTIVE',
          statusLabel: 'Đang triển khai',
          statusLabelEn: 'Active',
        },
      };
    } catch {
      return {
        valid: false,
        error:
          'Cú pháp JSON không hợp lệ. Vui lòng kiểm tra lại dấu ngoặc kép hoặc dấu phẩy.',
      };
    }
  }

  const finalTitle =
    fallbackTitle?.trim() || trimmed.split('\n')[0].slice(0, 70);
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
      titleEn: finalTitle,
      category: fallbackCategory,
      categoryLabel: categoryLabels[fallbackCategory],
      categoryLabelEn: categoryLabelsEn[fallbackCategory],
      semester: 'Gen 6 · 2026–2027',
      semesterEn: 'Gen 6 · 2026–2027',
      highlightMetric: 'Module mở rộng CLB',
      highlightMetricEn: 'Club Extension Module',
      chemicalTheme: 'Fe · 26 / Cu · 29',
      chemicalThemeEn: 'Fe · 26 / Cu · 29',
      summary:
        trimmed.length > 10
          ? trimmed.slice(0, 200)
          : 'Danh mục hoạt động mới của CLB Hóa Học đã được chuẩn hóa theo tông màu #6c63ff.',
      summaryEn:
        trimmed.length > 10
          ? trimmed.slice(0, 200)
          : 'New BWAN CLUB activity module standardized with the #6c63ff theme.',
      status: 'ACTIVE',
      statusLabel: 'Đang triển khai',
      statusLabelEn: 'Active',
    },
  };
}
