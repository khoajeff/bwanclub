import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INITIAL_CLUB_PROJECTS,
  INITIAL_CLUB_EVENTS,
  CLUB_DEPARTMENTS,
  BWAN_CLUB_BACKGROUND,
  BWAN_VISION_FLOWS,
  BWAN_CORE_VALUES,
  BWAN_GENERATIONS_HISTORY,
  BWAN_GEN6_CO_PRESIDENTS,
  BWAN_GEN6_ORG_BRANCHES,
  BWAN_GEN6_ROADMAP,
  parseAndSyncClubProject,
  generateBwanClubAdvisorReply,
} from './chemistryEngine';

test('INITIAL_CLUB_PROJECTS contains BWAN Gen 6 showcase projects and events', () => {
  assert.ok(INITIAL_CLUB_PROJECTS.length >= 5);
  assert.equal(INITIAL_CLUB_PROJECTS[0].code, 'BWAN-GEN6-01');
  assert.equal(
    INITIAL_CLUB_PROJECTS[0].previewImage,
    '/assets/aistudio/image_f5fb4f1c.png'
  );
  assert.equal(INITIAL_CLUB_PROJECTS[1].code, 'BWAN-3D-STUDIO');
  assert.equal(INITIAL_CLUB_PROJECTS[1].slug, '3d-molecular-studio');
});

test('BWAN_CLUB_BACKGROUND, VISION, CORE VALUES, and GENERATIONS match official Gen 6 slides', () => {
  assert.equal(BWAN_CLUB_BACKGROUND.foundedYear, 2021);
  assert.equal(BWAN_CLUB_BACKGROUND.slogan, 'LEARN NOT STUDY');
  assert.ok(
    BWAN_CLUB_BACKGROUND.schoolAffiliation.includes(
      'THPT chuyên Lê Quý Đôn Đà Nẵng'
    )
  );
  assert.equal(BWAN_VISION_FLOWS.length, 2);
  assert.equal(BWAN_CORE_VALUES.length, 4);
  assert.equal(BWAN_GENERATIONS_HISTORY.length, 5);
  assert.equal(BWAN_GENERATIONS_HISTORY[0].leaders[0], 'Đỗ Vĩnh Phúc');
  assert.equal(BWAN_GENERATIONS_HISTORY[0].roleTitle, 'Co-Founder BWAN CLUB');
});

test('BWAN_GEN6_ORG_BRANCHES and BWAN_GEN6_ROADMAP contain complete Gen 6 structure and 12-month plan', () => {
  assert.equal(BWAN_GEN6_CO_PRESIDENTS.length, 2);
  assert.equal(BWAN_GEN6_CO_PRESIDENTS[0].name, 'Trần Minh Trí');
  assert.equal(BWAN_GEN6_CO_PRESIDENTS[1].name, 'Nguyễn Minh Anh');
  assert.equal(BWAN_GEN6_ORG_BRANCHES.length, 4);
  assert.equal(BWAN_GEN6_ROADMAP.length, 12);
});

test('CLUB_DEPARTMENTS has all 4 full divisions with exact sub-committees', () => {
  assert.equal(CLUB_DEPARTMENTS.length, 4);
  assert.equal(CLUB_DEPARTMENTS[0].name, 'Ban Hậu Cần');
  assert.deepEqual(CLUB_DEPARTMENTS[0].subDivisionsList, [
    'Tiểu ban Nhân sự',
    'Tiểu ban Tài chính',
  ]);
  assert.equal(CLUB_DEPARTMENTS[1].name, 'Ban Nội Dung');
  assert.equal(CLUB_DEPARTMENTS[2].name, 'Ban Kỹ Thuật');
  assert.deepEqual(CLUB_DEPARTMENTS[2].subDivisionsList, [
    'Tiểu ban Truyền thông',
    'Tiểu ban Media',
    'Tiểu ban Design',
  ]);
  assert.equal(CLUB_DEPARTMENTS[3].name, 'Ban Đối Ngoại');
  assert.ok(INITIAL_CLUB_EVENTS.length >= 3);
});

test('generateBwanClubAdvisorReply returns accurate Vietnamese answers as a local LLM', () => {
  const projectReply = generateBwanClubAdvisorReply('Giới thiệu về dự án 18 Nguyên Tố Nhân Cách Gen 6');
  assert.ok(projectReply.includes('18 Nguyên Tố Nhân Cách'));
  assert.ok(projectReply.includes('BWAN-Local-LLM'));

  const divisionReply = generateBwanClubAdvisorReply('CLB có những phân ban nào?');
  assert.ok(divisionReply.includes('Ban Hậu Cần'));
  assert.ok(divisionReply.includes('Ban Kỹ Thuật'));

  const applyReply = generateBwanClubAdvisorReply('Cách đăng ký tham gia CLB?');
  assert.ok(applyReply.includes('đã hết kỳ mở đơn'));
});

test('parseAndSyncClubProject validates empty input and parses JSON or text category modules', () => {
  const empty = parseAndSyncClubProject('', '');
  assert.equal(empty.valid, false);
  assert.ok(empty.error);

  const jsonInput = JSON.stringify({
    title: 'Triển lãm Nhiếp ảnh Vi tinh thể Hóa Học',
    category: 'su-kien',
    code: 'BWAN-EVT-05',
    highlightMetric: '30 tác phẩm kính hiển vi',
    chemicalTheme: 'AgNO₃ + Cu → Tinh thể Bạc',
    summary:
      'Ghi lại vẻ đẹp của phản ứng kết tinh bạc dưới kính hiển vi quang học.',
  });

  const parsed = parseAndSyncClubProject(jsonInput);
  assert.equal(parsed.valid, true);
  assert.equal(
    parsed.item?.title,
    'Triển lãm Nhiếp ảnh Vi tinh thể Hóa Học'
  );
  assert.equal(parsed.item?.category, 'su-kien');
});

