import type { LaunchLocale } from '@/i18n/locales';

type ForeignLabels = Record<Exclude<LaunchLocale, 'ko'>, string>;

const LABELS: Record<string, ForeignLabels> = {
  '비자진단': { en: 'Visa planner', vi: 'Lập kế hoạch visa', th: 'วางแผนวีซา', fil: 'Visa planner' },
  '알바채용관': { en: 'Part-time jobs', vi: 'Việc làm bán thời gian', th: 'งานพาร์ตไทม์', fil: 'Part-time jobs' },
  '정규채용관': { en: 'Full-time jobs', vi: 'Việc làm toàn thời gian', th: 'งานประจำ', fil: 'Full-time jobs' },
  '대시보드': { en: 'Dashboard', vi: 'Bảng điều khiển', th: 'แดชบอร์ด', fil: 'Dashboard' },
  '구직 활동': { en: 'Job search', vi: 'Tìm việc', th: 'การหางาน', fil: 'Paghahanap ng trabaho' },
  '공고 탐색': { en: 'Browse jobs', vi: 'Tìm việc làm', th: 'ค้นหางาน', fil: 'Maghanap ng trabaho' },
  '공고탐색': { en: 'Jobs', vi: 'Việc làm', th: 'งาน', fil: 'Mga trabaho' },
  '스크랩한 공고': { en: 'Saved jobs', vi: 'Việc làm đã lưu', th: 'งานที่บันทึกไว้', fil: 'Mga naka-save na trabaho' },
  '지원 현황': { en: 'Applications', vi: 'Đơn ứng tuyển', th: 'ใบสมัคร', fil: 'Mga aplikasyon' },
  '지원현황': { en: 'Applications', vi: 'Ứng tuyển', th: 'การสมัคร', fil: 'Aplikasyon' },
  '면접 일정': { en: 'Interviews', vi: 'Lịch phỏng vấn', th: 'กำหนดการสัมภาษณ์', fil: 'Mga panayam' },
  '내 채용 프로필': { en: 'My hiring profile', vi: 'Hồ sơ tuyển dụng của tôi', th: 'โปรไฟล์สมัครงานของฉัน', fil: 'Aking hiring profile' },
  '이력서 관리': { en: 'Resume', vi: 'Hồ sơ xin việc', th: 'เรซูเม่', fil: 'Resume' },
  '비자 정보 수정': { en: 'Visa information', vi: 'Thông tin visa', th: 'ข้อมูลวีซา', fil: 'Impormasyon sa visa' },
  '계정 설정': { en: 'Account settings', vi: 'Cài đặt tài khoản', th: 'การตั้งค่าบัญชี', fil: 'Mga setting ng account' },
  '알림 설정': { en: 'Notification settings', vi: 'Cài đặt thông báo', th: 'การตั้งค่าการแจ้งเตือน', fil: 'Mga setting ng notification' },
  '비밀번호 변경': { en: 'Change password', vi: 'Đổi mật khẩu', th: 'เปลี่ยนรหัสผ่าน', fil: 'Palitan ang password' },
  '회원 탈퇴': { en: 'Delete account', vi: 'Xóa tài khoản', th: 'ลบบัญชี', fil: 'I-delete ang account' },
  '고객지원': { en: 'Support', vi: 'Hỗ trợ', th: 'ช่วยเหลือ', fil: 'Suporta' },
  '1:1 고객 문의': { en: 'Contact support', vi: 'Liên hệ hỗ trợ', th: 'ติดต่อฝ่ายช่วยเหลือ', fil: 'Makipag-ugnayan sa suporta' },
  '약관 및 정책': { en: 'Terms and policies', vi: 'Điều khoản và chính sách', th: 'ข้อกำหนดและนโยบาย', fil: 'Mga tuntunin at patakaran' },
  '홈': { en: 'Home', vi: 'Trang chủ', th: 'หน้าหลัก', fil: 'Home' },
  '알림': { en: 'Alerts', vi: 'Thông báo', th: 'แจ้งเตือน', fil: 'Mga alerto' },
  '공고관리': { en: 'Job posts', vi: 'Tin tuyển dụng', th: 'ประกาศงาน', fil: 'Mga job post' },
  '인재검색': { en: 'Talent search', vi: 'Tìm ứng viên', th: 'ค้นหาผู้สมัคร', fil: 'Maghanap ng kandidato' },
  '비자가이드': { en: 'Visa guide', vi: 'Hướng dẫn visa', th: 'คู่มือวีซา', fil: 'Gabay sa visa' },
  '요금안내': { en: 'Pricing', vi: 'Bảng giá', th: 'ราคา', fil: 'Presyo' },
  '마이페이지': { en: 'My page', vi: 'Trang của tôi', th: 'หน้าของฉัน', fil: 'Aking pahina' },
  '기업 관리': { en: 'Company', vi: 'Doanh nghiệp', th: 'บริษัท', fil: 'Kumpanya' },
  '기업 프로필': { en: 'Company profile', vi: 'Hồ sơ doanh nghiệp', th: 'โปรไฟล์บริษัท', fil: 'Profile ng kumpanya' },
  '기업 인증': { en: 'Company verification', vi: 'Xác minh doanh nghiệp', th: 'ยืนยันบริษัท', fil: 'Pag-verify ng kumpanya' },
  '담당자 정보': { en: 'Manager details', vi: 'Thông tin người phụ trách', th: 'ข้อมูลผู้ดูแล', fil: 'Detalye ng manager' },
  '팀원/계정 관리': { en: 'Team and accounts', vi: 'Nhóm và tài khoản', th: 'ทีมและบัญชี', fil: 'Team at mga account' },
  '채용공고': { en: 'Recruitment', vi: 'Tuyển dụng', th: 'การรับสมัคร', fil: 'Recruitment' },
  '공고 작성': { en: 'Create job post', vi: 'Tạo tin tuyển dụng', th: 'สร้างประกาศงาน', fil: 'Gumawa ng job post' },
  '정규 채용관': { en: 'Full-time post', vi: 'Tin toàn thời gian', th: 'ประกาศงานประจำ', fil: 'Full-time post' },
  '알바 채용관': { en: 'Part-time post', vi: 'Tin bán thời gian', th: 'ประกาศพาร์ตไทม์', fil: 'Part-time post' },
  '공고 관리': { en: 'Manage job posts', vi: 'Quản lý tin tuyển dụng', th: 'จัดการประกาศงาน', fil: 'Pamahalaan ang job posts' },
  '지원자 관리': { en: 'Applicants', vi: 'Ứng viên', th: 'ผู้สมัคร', fil: 'Mga aplikante' },
  '인재채용관': { en: 'Talent pool', vi: 'Kho ứng viên', th: 'ฐานผู้สมัคร', fil: 'Talent pool' },
  '인재 탐색': { en: 'Find talent', vi: 'Tìm ứng viên', th: 'ค้นหาผู้สมัคร', fil: 'Maghanap ng kandidato' },
  '열람 내역': { en: 'Viewed talent', vi: 'Hồ sơ đã xem', th: 'โปรไฟล์ที่ดูแล้ว', fil: 'Mga natingnang profile' },
  '즐겨찾기': { en: 'Bookmarks', vi: 'Đã lưu', th: 'บุ๊กมาร์ก', fil: 'Mga bookmark' },
  '연락내역': { en: 'Messages', vi: 'Tin nhắn', th: 'ข้อความ', fil: 'Mga mensahe' },
  '결제 / 정산': { en: 'Billing', vi: 'Thanh toán', th: 'การชำระเงิน', fil: 'Billing' },
  '결제 내역': { en: 'Payment history', vi: 'Lịch sử thanh toán', th: 'ประวัติการชำระเงิน', fil: 'Kasaysayan ng bayad' },
  '열람권 현황': { en: 'Viewing credits', vi: 'Lượt xem hồ sơ', th: 'เครดิตดูโปรไฟล์', fil: 'Viewing credits' },
  '쿠폰함': { en: 'Coupons', vi: 'Phiếu giảm giá', th: 'คูปอง', fil: 'Mga coupon' },
  '세금계산서': { en: 'Tax invoices', vi: 'Hóa đơn thuế', th: 'ใบกำกับภาษี', fil: 'Mga tax invoice' },
  '보안 설정': { en: 'Security', vi: 'Bảo mật', th: 'ความปลอดภัย', fil: 'Seguridad' },
  '연결된 소셜 계정': { en: 'Linked accounts', vi: 'Tài khoản đã liên kết', th: 'บัญชีที่เชื่อมต่อ', fil: 'Mga naka-link na account' },
  '마케팅 수신 동의': { en: 'Marketing consent', vi: 'Đồng ý tiếp thị', th: 'ความยินยอมด้านการตลาด', fil: 'Pahintulot sa marketing' },
  '공지사항': { en: 'Notices', vi: 'Thông báo', th: 'ประกาศ', fil: 'Mga abiso' },
  '자주 묻는 질문': { en: 'FAQ', vi: 'Câu hỏi thường gặp', th: 'คำถามที่พบบ่อย', fil: 'FAQ' },
  '이용 가이드': { en: 'User guide', vi: 'Hướng dẫn sử dụng', th: 'คู่มือการใช้งาน', fil: 'Gabay sa paggamit' },
  '등록': { en: 'Create', vi: 'Tạo tin', th: 'สร้าง', fil: 'Gumawa' },
};

type LayoutCopy = {
  menuOpen: string;
  menuClose: string;
  profile: string;
  user: string;
  company: string;
  myPage: string;
  editCompany: string;
  logout: string;
  completeWorkerProfile: string;
  registerProfile: string;
  verifyCompany: string;
  startVerification: string;
  verificationReview: string;
  viewSubmission: string;
  verificationRejected: string;
  resubmit: string;
  finishVerification: string;
};

export const LAYOUT_COPY: Record<LaunchLocale, LayoutCopy> = {
  ko: { menuOpen: '메뉴 열기', menuClose: '메뉴 닫기', profile: '프로필', user: '사용자', company: '기업', myPage: 'MY 페이지', editCompany: '기업정보 수정', logout: '로그아웃', completeWorkerProfile: '프로필을 완성하여 나에게 맞는 공고를 만나보세요', registerProfile: '프로필 등록', verifyCompany: '기업인증을 완료하고 모든 서비스를 이용하세요', startVerification: '인증 시작', verificationReview: '기업인증 심사 중입니다 (영업일 1~2일 소요)', viewSubmission: '제출 내역 확인', verificationRejected: '기업인증이 반려되었습니다. 서류를 다시 제출해 주세요.', resubmit: '재제출하기', finishVerification: '기업인증 완료하기' },
  en: { menuOpen: 'Open menu', menuClose: 'Close menu', profile: 'Profile', user: 'User', company: 'Company', myPage: 'My page', editCompany: 'Edit company details', logout: 'Log out', completeWorkerProfile: 'Complete your profile to find jobs that fit you.', registerProfile: 'Complete profile', verifyCompany: 'Verify your company to use all employer services.', startVerification: 'Start verification', verificationReview: 'Your company verification is under review (1-2 business days).', viewSubmission: 'View submission', verificationRejected: 'Company verification was rejected. Please submit the documents again.', resubmit: 'Resubmit', finishVerification: 'Complete verification' },
  vi: { menuOpen: 'Mở menu', menuClose: 'Đóng menu', profile: 'Hồ sơ', user: 'Người dùng', company: 'Doanh nghiệp', myPage: 'Trang của tôi', editCompany: 'Sửa thông tin doanh nghiệp', logout: 'Đăng xuất', completeWorkerProfile: 'Hoàn thiện hồ sơ để tìm việc phù hợp với bạn.', registerProfile: 'Hoàn thiện hồ sơ', verifyCompany: 'Xác minh doanh nghiệp để sử dụng đầy đủ dịch vụ tuyển dụng.', startVerification: 'Bắt đầu xác minh', verificationReview: 'Hồ sơ doanh nghiệp đang được xét duyệt (1-2 ngày làm việc).', viewSubmission: 'Xem hồ sơ đã nộp', verificationRejected: 'Xác minh doanh nghiệp bị từ chối. Vui lòng nộp lại tài liệu.', resubmit: 'Nộp lại', finishVerification: 'Hoàn tất xác minh' },
  th: { menuOpen: 'เปิดเมนู', menuClose: 'ปิดเมนู', profile: 'โปรไฟล์', user: 'ผู้ใช้', company: 'บริษัท', myPage: 'หน้าของฉัน', editCompany: 'แก้ไขข้อมูลบริษัท', logout: 'ออกจากระบบ', completeWorkerProfile: 'กรอกโปรไฟล์ให้ครบเพื่อค้นหางานที่เหมาะกับคุณ', registerProfile: 'กรอกโปรไฟล์', verifyCompany: 'ยืนยันบริษัทเพื่อใช้บริการนายจ้างทั้งหมด', startVerification: 'เริ่มยืนยัน', verificationReview: 'กำลังตรวจสอบบริษัท (1-2 วันทำการ)', viewSubmission: 'ดูเอกสารที่ส่ง', verificationRejected: 'การยืนยันบริษัทถูกปฏิเสธ โปรดส่งเอกสารอีกครั้ง', resubmit: 'ส่งอีกครั้ง', finishVerification: 'ยืนยันบริษัทให้เสร็จ' },
  fil: { menuOpen: 'Buksan ang menu', menuClose: 'Isara ang menu', profile: 'Profile', user: 'User', company: 'Kumpanya', myPage: 'Aking pahina', editCompany: 'I-edit ang detalye ng kumpanya', logout: 'Mag-log out', completeWorkerProfile: 'Kumpletuhin ang profile para makahanap ng trabahong akma sa iyo.', registerProfile: 'Kumpletuhin ang profile', verifyCompany: 'I-verify ang kumpanya para magamit ang lahat ng employer service.', startVerification: 'Simulan ang verification', verificationReview: 'Sinusuri ang company verification (1-2 araw ng negosyo).', viewSubmission: 'Tingnan ang isinumite', verificationRejected: 'Tinanggihan ang company verification. Isumite muli ang mga dokumento.', resubmit: 'Isumite muli', finishVerification: 'Kumpletuhin ang verification' },
};

export function layoutLabel(locale: LaunchLocale, koreanLabel: string): string {
  if (locale === 'ko') return koreanLabel;
  return LABELS[koreanLabel]?.[locale] ?? koreanLabel;
}
