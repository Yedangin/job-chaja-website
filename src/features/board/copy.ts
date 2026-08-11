import type {
  InfoBoardAudience,
  InfoBoardCategory,
  InfoBoardLocale,
  InfoBoardStatus,
} from './types';

type BoardCopy = {
  boardTitle: string;
  boardDescription: string;
  searchPlaceholder: string;
  allCategories: string;
  loading: string;
  loadError: string;
  retry: string;
  empty: string;
  noSearchResults: string;
  previous: string;
  next: string;
  backToList: string;
  published: string;
  attachment: string;
  companyTitle: string;
  companyDescription: string;
  informationEyebrow: string;
  search: string;
  categories: string;
  loadingAria: string;
  pinned: string;
  pagination: string;
  expandNotice: string;
  downloadAttachment: string;
  networkError: string;
  authRequired: string;
  forbidden: string;
  unsupportedContract: string;
  invalidResponse: string;
  requestError: string;
  uploadFailed: string;
  uploadCancelled: string;
  noticeTitle: string;
  noticeDescription: string;
  guideTitle: string;
  guideDescription: string;
  workerGuideTitle: string;
  workerGuideDescription: string;
  companyGuideTitle: string;
  companyGuideDescription: string;
  authChecking: string;
  notFound: string;
  notFoundDescription: string;
  openPost: string;
};

export const BOARD_COPY: Record<InfoBoardLocale, BoardCopy> = {
  ko: {
    boardTitle: '한국 생활 정보',
    boardDescription: '한국에서 일하고 생활하는 데 필요한 공식 안내와 최신 소식을 확인하세요.',
    searchPlaceholder: '비자, 취업, 생활 정보를 검색하세요',
    allCategories: '전체',
    loading: '정보를 불러오는 중입니다.',
    loadError: '정보를 불러오지 못했습니다.',
    retry: '다시 시도',
    empty: '아직 게시된 정보가 없습니다.',
    noSearchResults: '검색 조건에 맞는 정보가 없습니다.',
    previous: '이전',
    next: '다음',
    backToList: '목록으로',
    published: '게시일',
    attachment: '첨부파일',
    companyTitle: '기업 공지',
    companyDescription: '채용공고 운영과 기업 계정에 필요한 안내를 확인하세요.',
    informationEyebrow: '잡차자 정보',
    search: '검색',
    categories: '정보 카테고리',
    loadingAria: '게시판을 불러오는 중',
    pinned: '고정',
    pagination: '게시판 페이지',
    expandNotice: '공지 내용 열기',
    downloadAttachment: '첨부파일 다운로드',
    networkError: '공지 서버에 연결할 수 없습니다. 잠시 후 다시 시도하세요.',
    authRequired: '로그인 후 확인할 수 있습니다.',
    forbidden: '이 정보를 볼 권한이 없습니다.',
    unsupportedContract: '현재 서버에서 이 게시판 기능을 지원하지 않습니다.',
    invalidResponse: '서버 응답 형식을 확인할 수 없습니다.',
    requestError: '요청을 처리하지 못했습니다. 다시 시도하세요.',
    uploadFailed: '첨부파일 업로드에 실패했습니다.',
    uploadCancelled: '첨부파일 업로드를 취소했습니다.',
    noticeTitle: '공지사항',
    noticeDescription: '잡차자 서비스 이용과 한국 체류에 필요한 공식 공지를 확인하세요.',
    guideTitle: '한국 생활 가이드',
    guideDescription: '비자, 취업, 교육과 생활에 필요한 검증된 정보를 확인하세요.',
    workerGuideTitle: '외국인 근로자 가이드',
    workerGuideDescription: '내 계정으로 확인할 수 있는 한국 생활과 근로 정보를 제공합니다.',
    companyGuideTitle: '외국인 고용 기업 가이드',
    companyGuideDescription: '외국인 채용과 체류 지원에 필요한 기업 대상 정보를 확인하세요.',
    authChecking: '로그인 상태를 확인하는 중입니다.',
    notFound: '정보를 찾을 수 없습니다.',
    notFoundDescription: '삭제되었거나 현재 계정에서 볼 수 없는 정보입니다.',
    openPost: '상세 정보 열기',
  },
  en: {
    boardTitle: 'Living and working in Korea',
    boardDescription: 'Find practical guidance and verified updates for your life and work in Korea.',
    searchPlaceholder: 'Search visas, jobs, and life in Korea',
    allCategories: 'All',
    loading: 'Loading information.',
    loadError: 'We could not load the information.',
    retry: 'Try again',
    empty: 'There is no published information yet.',
    noSearchResults: 'No information matches your search.',
    previous: 'Previous',
    next: 'Next',
    backToList: 'Back to list',
    published: 'Published',
    attachment: 'Attachments',
    companyTitle: 'Employer notices',
    companyDescription: 'Updates for job postings and your employer account.',
    informationEyebrow: 'JobChaja information',
    search: 'Search',
    categories: 'Information categories',
    loadingAria: 'Loading the information board',
    pinned: 'Pinned',
    pagination: 'Information board pages',
    expandNotice: 'Open notice details',
    downloadAttachment: 'Download attachment',
    networkError: 'The notice service is not reachable. Please try again shortly.',
    authRequired: 'Please sign in to view this information.',
    forbidden: 'You do not have permission to view this information.',
    unsupportedContract: 'This board feature is not supported by the current server.',
    invalidResponse: 'The server returned an invalid response.',
    requestError: 'We could not complete the request. Please try again.',
    uploadFailed: 'The attachment upload failed.',
    uploadCancelled: 'The attachment upload was cancelled.',
    noticeTitle: 'Notices',
    noticeDescription: 'Read official updates about JobChaja services and living in Korea.',
    guideTitle: 'Guide to life in Korea',
    guideDescription: 'Find verified guidance on visas, work, education, and daily life.',
    workerGuideTitle: 'Foreign worker guide',
    workerGuideDescription: 'Guidance on working and living in Korea available to your account.',
    companyGuideTitle: 'Foreign employment guide',
    companyGuideDescription: 'Information for employers hiring and supporting foreign workers.',
    authChecking: 'Checking your sign-in status.',
    notFound: 'The information could not be found.',
    notFoundDescription: 'It may have been removed or may not be available to this account.',
    openPost: 'Open details',
  },
  vi: {
    boardTitle: 'Sống và làm việc tại Hàn Quốc',
    boardDescription: 'Xem hướng dẫn thiết thực và thông tin mới nhất cho cuộc sống và công việc tại Hàn Quốc.',
    searchPlaceholder: 'Tìm kiếm visa, việc làm và cuộc sống',
    allCategories: 'Tất cả',
    loading: 'Đang tải thông tin.',
    loadError: 'Không thể tải thông tin.',
    retry: 'Thử lại',
    empty: 'Chưa có thông tin được đăng.',
    noSearchResults: 'Không có kết quả phù hợp.',
    previous: 'Trước',
    next: 'Sau',
    backToList: 'Quay lại danh sách',
    published: 'Ngày đăng',
    attachment: 'Tệp đính kèm',
    companyTitle: 'Thông báo cho doanh nghiệp',
    companyDescription: 'Thông tin về tin tuyển dụng và tài khoản doanh nghiệp.',
    informationEyebrow: 'Thông tin JobChaja',
    search: 'Tìm kiếm',
    categories: 'Danh mục thông tin',
    loadingAria: 'Đang tải bảng thông tin',
    pinned: 'Đã ghim',
    pagination: 'Các trang thông tin',
    expandNotice: 'Mở nội dung thông báo',
    downloadAttachment: 'Tải tệp đính kèm',
    networkError: 'Không thể kết nối với máy chủ thông báo. Vui lòng thử lại sau.',
    authRequired: 'Vui lòng đăng nhập để xem thông tin này.',
    forbidden: 'Bạn không có quyền xem thông tin này.',
    unsupportedContract: 'Máy chủ hiện tại chưa hỗ trợ chức năng bảng tin này.',
    invalidResponse: 'Phản hồi từ máy chủ không hợp lệ.',
    requestError: 'Không thể xử lý yêu cầu. Vui lòng thử lại.',
    uploadFailed: 'Không thể tải tệp đính kèm lên.',
    uploadCancelled: 'Đã hủy tải tệp đính kèm.',
    noticeTitle: 'Thông báo',
    noticeDescription: 'Xem thông báo chính thức về dịch vụ JobChaja và cuộc sống tại Hàn Quốc.',
    guideTitle: 'Hướng dẫn cuộc sống tại Hàn Quốc',
    guideDescription: 'Xem thông tin đã được xác minh về visa, việc làm, giáo dục và cuộc sống.',
    workerGuideTitle: 'Hướng dẫn cho người lao động nước ngoài',
    workerGuideDescription: 'Thông tin về làm việc và sinh sống tại Hàn Quốc dành cho tài khoản của bạn.',
    companyGuideTitle: 'Hướng dẫn tuyển dụng người nước ngoài',
    companyGuideDescription: 'Thông tin dành cho doanh nghiệp tuyển dụng và hỗ trợ lao động nước ngoài.',
    authChecking: 'Đang kiểm tra trạng thái đăng nhập.',
    notFound: 'Không tìm thấy thông tin.',
    notFoundDescription: 'Thông tin có thể đã bị xóa hoặc tài khoản này không thể xem.',
    openPost: 'Mở thông tin chi tiết',
  },
  th: {
    boardTitle: 'การใช้ชีวิตและทำงานในเกาหลี',
    boardDescription: 'ดูคำแนะนำที่จำเป็นและข้อมูลล่าสุดสำหรับการใช้ชีวิตและทำงานในเกาหลี',
    searchPlaceholder: 'ค้นหาวีซ่า งาน และการใช้ชีวิต',
    allCategories: 'ทั้งหมด',
    loading: 'กำลังโหลดข้อมูล',
    loadError: 'ไม่สามารถโหลดข้อมูลได้',
    retry: 'ลองอีกครั้ง',
    empty: 'ยังไม่มีข้อมูลที่เผยแพร่',
    noSearchResults: 'ไม่พบข้อมูลที่ตรงกับการค้นหา',
    previous: 'ก่อนหน้า',
    next: 'ถัดไป',
    backToList: 'กลับไปยังรายการ',
    published: 'วันที่เผยแพร่',
    attachment: 'ไฟล์แนบ',
    companyTitle: 'ประกาศสำหรับนายจ้าง',
    companyDescription: 'ข้อมูลเกี่ยวกับประกาศงานและบัญชีนายจ้าง',
    informationEyebrow: 'ข้อมูล JobChaja',
    search: 'ค้นหา',
    categories: 'หมวดหมู่ข้อมูล',
    loadingAria: 'กำลังโหลดกระดานข้อมูล',
    pinned: 'ปักหมุด',
    pagination: 'หน้ากระดานข้อมูล',
    expandNotice: 'เปิดรายละเอียดประกาศ',
    downloadAttachment: 'ดาวน์โหลดไฟล์แนบ',
    networkError: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ประกาศได้ โปรดลองอีกครั้งในภายหลัง',
    authRequired: 'กรุณาเข้าสู่ระบบเพื่อดูข้อมูลนี้',
    forbidden: 'คุณไม่มีสิทธิ์ดูข้อมูลนี้',
    unsupportedContract: 'เซิร์ฟเวอร์ปัจจุบันยังไม่รองรับฟังก์ชันนี้',
    invalidResponse: 'การตอบกลับจากเซิร์ฟเวอร์ไม่ถูกต้อง',
    requestError: 'ไม่สามารถดำเนินการตามคำขอได้ โปรดลองอีกครั้ง',
    uploadFailed: 'อัปโหลดไฟล์แนบไม่สำเร็จ',
    uploadCancelled: 'ยกเลิกการอัปโหลดไฟล์แนบแล้ว',
    noticeTitle: 'ประกาศ',
    noticeDescription: 'ดูประกาศอย่างเป็นทางการเกี่ยวกับบริการ JobChaja และการใช้ชีวิตในเกาหลี',
    guideTitle: 'คู่มือการใช้ชีวิตในเกาหลี',
    guideDescription: 'ดูข้อมูลที่ผ่านการตรวจสอบเกี่ยวกับวีซ่า งาน การศึกษา และชีวิตประจำวัน',
    workerGuideTitle: 'คู่มือแรงงานต่างชาติ',
    workerGuideDescription: 'ข้อมูลการทำงานและใช้ชีวิตในเกาหลีที่บัญชีของคุณเข้าถึงได้',
    companyGuideTitle: 'คู่มือการจ้างงานชาวต่างชาติ',
    companyGuideDescription: 'ข้อมูลสำหรับนายจ้างที่จ้างและดูแลแรงงานต่างชาติ',
    authChecking: 'กำลังตรวจสอบสถานะการเข้าสู่ระบบ',
    notFound: 'ไม่พบข้อมูล',
    notFoundDescription: 'ข้อมูลอาจถูกลบหรือบัญชีนี้ไม่มีสิทธิ์ดู',
    openPost: 'เปิดรายละเอียด',
  },
  fil: {
    boardTitle: 'Pamumuhay at pagtatrabaho sa Korea',
    boardDescription: 'Tingnan ang praktikal na gabay at mga bagong impormasyon para sa buhay at trabaho sa Korea.',
    searchPlaceholder: 'Maghanap ng visa, trabaho, at gabay',
    allCategories: 'Lahat',
    loading: 'Kinukuha ang impormasyon.',
    loadError: 'Hindi makuha ang impormasyon.',
    retry: 'Subukan muli',
    empty: 'Wala pang nailathalang impormasyon.',
    noSearchResults: 'Walang tumutugma sa iyong paghahanap.',
    previous: 'Nakaraan',
    next: 'Susunod',
    backToList: 'Bumalik sa listahan',
    published: 'Inilathala',
    attachment: 'Mga kalakip',
    companyTitle: 'Mga abiso sa employer',
    companyDescription: 'Mga update para sa job posting at employer account.',
    informationEyebrow: 'Impormasyon ng JobChaja',
    search: 'Maghanap',
    categories: 'Mga kategorya ng impormasyon',
    loadingAria: 'Nilo-load ang information board',
    pinned: 'Naka-pin',
    pagination: 'Mga pahina ng information board',
    expandNotice: 'Buksan ang detalye ng abiso',
    downloadAttachment: 'I-download ang kalakip',
    networkError: 'Hindi makakonekta sa notice server. Subukan muli pagkalipas ng ilang sandali.',
    authRequired: 'Mag-sign in upang makita ang impormasyong ito.',
    forbidden: 'Wala kang pahintulot na makita ang impormasyong ito.',
    unsupportedContract: 'Hindi sinusuportahan ng kasalukuyang server ang board feature na ito.',
    invalidResponse: 'Hindi wasto ang tugon mula sa server.',
    requestError: 'Hindi makumpleto ang kahilingan. Subukan muli.',
    uploadFailed: 'Hindi na-upload ang kalakip.',
    uploadCancelled: 'Kinansela ang pag-upload ng kalakip.',
    noticeTitle: 'Mga abiso',
    noticeDescription: 'Basahin ang opisyal na updates tungkol sa JobChaja at pamumuhay sa Korea.',
    guideTitle: 'Gabay sa buhay sa Korea',
    guideDescription: 'Tingnan ang beripikadong gabay sa visa, trabaho, edukasyon, at araw-araw na buhay.',
    workerGuideTitle: 'Gabay para sa dayuhang manggagawa',
    workerGuideDescription: 'Gabay sa pagtatrabaho at pamumuhay sa Korea na available sa iyong account.',
    companyGuideTitle: 'Gabay sa pag-empleyo ng dayuhan',
    companyGuideDescription: 'Impormasyon para sa mga employer na kumukuha at sumusuporta sa dayuhang manggagawa.',
    authChecking: 'Sinusuri ang iyong sign-in status.',
    notFound: 'Hindi makita ang impormasyon.',
    notFoundDescription: 'Maaaring nabura ito o hindi available sa account na ito.',
    openPost: 'Buksan ang detalye',
  },
};

type BoardLabels = {
  categories: Record<InfoBoardCategory, string>;
  statuses: Record<InfoBoardStatus, string>;
  audiences: Record<InfoBoardAudience, string>;
  locales: Record<InfoBoardLocale, string>;
};

const LOCALE_NAMES: Record<InfoBoardLocale, string> = {
  ko: '한국어',
  en: 'English',
  vi: 'Tiếng Việt',
  th: 'ไทย',
  fil: 'Filipino',
};

export const BOARD_LABELS: Record<InfoBoardLocale, BoardLabels> = {
  ko: {
    categories: {
      VISA_INFO: '비자·체류', EDUCATION: '교육·언어', EXAM: '시험', TRAINING: '직업훈련', EVENTS: '행사', LIVING_TIPS: '한국 생활',
      POLICY_LAW: '정책·법률', ANNOUNCEMENTS: '공지',
    },
    statuses: { DRAFT: '초안', SCHEDULED: '예약', PUBLISHED: '게시', ARCHIVED: '보관' },
    audiences: { ALL: '전체', WORKER: '외국인 구직자', COMPANY: '기업' },
    locales: LOCALE_NAMES,
  },
  en: {
    categories: {
      VISA_INFO: 'Visa and stay', EDUCATION: 'Study and language', EXAM: 'Exams', TRAINING: 'Training', EVENTS: 'Events', LIVING_TIPS: 'Life in Korea',
      POLICY_LAW: 'Policy updates', ANNOUNCEMENTS: 'Notices',
    },
    statuses: { DRAFT: 'Draft', SCHEDULED: 'Scheduled', PUBLISHED: 'Published', ARCHIVED: 'Archived' },
    audiences: { ALL: 'Everyone', WORKER: 'Foreign workers', COMPANY: 'Employers' },
    locales: LOCALE_NAMES,
  },
  vi: {
    categories: {
      VISA_INFO: 'Visa và lưu trú', EDUCATION: 'Học tập và ngôn ngữ', EXAM: 'Kỳ thi', TRAINING: 'Đào tạo nghề', EVENTS: 'Sự kiện', LIVING_TIPS: 'Cuộc sống tại Hàn Quốc',
      POLICY_LAW: 'Chính sách và pháp luật', ANNOUNCEMENTS: 'Thông báo',
    },
    statuses: { DRAFT: 'Bản nháp', SCHEDULED: 'Đã lên lịch', PUBLISHED: 'Đã đăng', ARCHIVED: 'Đã lưu trữ' },
    audiences: { ALL: 'Tất cả', WORKER: 'Người lao động nước ngoài', COMPANY: 'Doanh nghiệp' },
    locales: LOCALE_NAMES,
  },
  th: {
    categories: {
      VISA_INFO: 'วีซ่าและการพำนัก', EDUCATION: 'การศึกษาและภาษา', EXAM: 'การสอบ', TRAINING: 'การฝึกอาชีพ', EVENTS: 'กิจกรรม', LIVING_TIPS: 'ชีวิตในเกาหลี',
      POLICY_LAW: 'นโยบายและกฎหมาย', ANNOUNCEMENTS: 'ประกาศ',
    },
    statuses: { DRAFT: 'ฉบับร่าง', SCHEDULED: 'ตั้งเวลาแล้ว', PUBLISHED: 'เผยแพร่แล้ว', ARCHIVED: 'เก็บถาวร' },
    audiences: { ALL: 'ทุกคน', WORKER: 'แรงงานต่างชาติ', COMPANY: 'นายจ้าง' },
    locales: LOCALE_NAMES,
  },
  fil: {
    categories: {
      VISA_INFO: 'Visa at pananatili', EDUCATION: 'Pag-aaral at wika', EXAM: 'Mga pagsusulit', TRAINING: 'Pagsasanay', EVENTS: 'Mga event', LIVING_TIPS: 'Buhay sa Korea',
      POLICY_LAW: 'Patakaran at batas', ANNOUNCEMENTS: 'Mga abiso',
    },
    statuses: { DRAFT: 'Draft', SCHEDULED: 'Naka-iskedyul', PUBLISHED: 'Nailathala', ARCHIVED: 'Naka-archive' },
    audiences: { ALL: 'Lahat', WORKER: 'Mga dayuhang manggagawa', COMPANY: 'Mga employer' },
    locales: LOCALE_NAMES,
  },
};

export type AdminBoardCopy = {
  eyebrow: string;
  title: string;
  description: string;
  publicView: string;
  contractTitle: string;
  legacyListWarning: string;
  legacySaveWarning: string;
  legacySaved: string;
  primaryRequired: string;
  scheduleRequired: string;
  created: string;
  updated: string;
  deleted: string;
  deleteConfirm: string;
  formEdit: string;
  formCreate: string;
  cancelEdit: string;
  category: string;
  status: string;
  audience: string;
  pinned: string;
  scheduleTime: string;
  translationLanguages: string;
  titleField: string;
  contentField: string;
  titlePlaceholder: string;
  contentPlaceholder: string;
  previewAria: string;
  previewLabel: string;
  previewTitle: string;
  previewContent: string;
  attachments: string;
  attachmentHelp: string;
  selectFile: string;
  cancelUpload: string;
  invalidFileType: string;
  fileTooLarge: string;
  attachmentError: string;
  deleteAttachment: string;
  reset: string;
  saveEdit: string;
  saveCreate: string;
  registered: string;
  total: string;
  refresh: string;
  empty: string;
  tableTitle: string;
  tableCategory: string;
  tableStatus: string;
  tableAudience: string;
  tableLanguages: string;
  tableActions: string;
  edit: string;
  delete: string;
  pagination: string;
  concurrentConflict: string;
  reloadLatest: string;
  versionRequired: string;
};

export const ADMIN_BOARD_COPY: Record<InfoBoardLocale, AdminBoardCopy> = {
  ko: {
    eyebrow: '콘텐츠 운영', title: '공지·정보게시판 관리',
    description: '외국인 구직자와 기업에 제공할 정보를 작성하고 게시 상태를 관리합니다.',
    publicView: '공개 화면', contractTitle: 'API 계약 확인 필요',
    legacyListWarning: '현재 서버가 구형 응답을 반환했습니다. 상태, 대상, 고정, 번역과 첨부 저장을 확인할 수 없습니다.',
    legacySaveWarning: '서버가 구형 응답을 반환했습니다. 확장 필드 저장 여부를 확인할 수 없으므로 목록을 확인하세요.',
    legacySaved: '기본 게시글 응답은 받았지만 확장 필드는 확인되지 않았습니다.',
    primaryRequired: '한국어 또는 영어의 제목과 본문을 모두 입력하세요.', scheduleRequired: '예약 게시 시각을 입력하세요.',
    created: '공지를 작성했습니다.', updated: '공지를 수정했습니다.', deleted: '공지를 삭제했습니다.',
    deleteConfirm: '"{title}" 공지를 삭제하시겠습니까?', formEdit: '공지 #{id} 수정', formCreate: '새 공지 작성',
    cancelEdit: '수정 취소', category: '카테고리', status: '게시 상태', audience: '공개 대상', pinned: '상단 고정',
    scheduleTime: '예약 게시 시각', translationLanguages: '번역 언어', titleField: '제목', contentField: '본문',
    titlePlaceholder: '외국인 사용자가 바로 이해할 수 있는 제목을 입력하세요.',
    contentPlaceholder: '공식 출처, 적용일과 사용자가 해야 할 일을 일반 텍스트로 작성하세요.',
    previewAria: '공지 미리보기', previewLabel: '안전한 일반 텍스트 미리보기', previewTitle: '제목 미리보기',
    previewContent: '본문은 HTML로 해석되지 않고 입력한 줄바꿈만 유지됩니다.', attachments: '이미지·첨부파일',
    attachmentHelp: 'JPEG, PNG, WebP, PDF · 파일당 최대 5MB', selectFile: '파일 선택', cancelUpload: '업로드 취소',
    invalidFileType: 'JPEG, PNG, WebP, PDF 파일만 업로드할 수 있습니다.', fileTooLarge: '첨부파일은 5MB 이하여야 합니다.',
    attachmentError: '첨부 API 오류', deleteAttachment: '{name} 삭제', reset: '초기화', saveEdit: '수정 저장', saveCreate: '공지 저장',
    registered: '등록 공지', total: '총 {count}건', refresh: '새로고침', empty: '등록된 공지가 없습니다.',
    tableTitle: '제목', tableCategory: '카테고리', tableStatus: '상태', tableAudience: '대상', tableLanguages: '언어',
    tableActions: '관리', edit: '수정', delete: '삭제', pagination: '관리자 공지 페이지',
    concurrentConflict: '다른 관리자가 이 공지를 수정했습니다. 최신본을 불러온 뒤 다시 수정하세요.',
    reloadLatest: '최신본 다시 불러오기', versionRequired: '수정 버전을 확인할 수 없습니다. 최신본을 다시 불러오세요.',
  },
  en: {
    eyebrow: 'Content operations', title: 'Notice and information management',
    description: 'Create information for foreign workers and employers and manage its publication status.',
    publicView: 'Public view', contractTitle: 'API contract check required',
    legacyListWarning: 'The server returned a legacy response. Status, audience, pinning, translations, and attachments cannot be verified.',
    legacySaveWarning: 'The server returned a legacy response. Check the list because extended fields could not be verified.',
    legacySaved: 'The basic post was returned, but extended fields were not verified.',
    primaryRequired: 'Enter both a title and content in Korean or English.', scheduleRequired: 'Enter the scheduled publication time.',
    created: 'The notice was created.', updated: 'The notice was updated.', deleted: 'The notice was deleted.',
    deleteConfirm: 'Delete the notice "{title}"?', formEdit: 'Edit notice #{id}', formCreate: 'Create notice',
    cancelEdit: 'Cancel editing', category: 'Category', status: 'Publication status', audience: 'Audience', pinned: 'Pin to top',
    scheduleTime: 'Scheduled publication time', translationLanguages: 'Translation languages', titleField: 'Title', contentField: 'Content',
    titlePlaceholder: 'Enter a title that foreign users can understand immediately.',
    contentPlaceholder: 'Write the official source, effective date, and required actions in plain text.',
    previewAria: 'Notice preview', previewLabel: 'Safe plain-text preview', previewTitle: 'Title preview',
    previewContent: 'The content is not interpreted as HTML. Only your line breaks are preserved.', attachments: 'Images and attachments',
    attachmentHelp: 'JPEG, PNG, WebP, PDF · up to 5MB per file', selectFile: 'Choose file', cancelUpload: 'Cancel upload',
    invalidFileType: 'Only JPEG, PNG, WebP, and PDF files can be uploaded.', fileTooLarge: 'Attachments must be 5MB or smaller.',
    attachmentError: 'Attachment API error', deleteAttachment: 'Delete {name}', reset: 'Reset', saveEdit: 'Save changes', saveCreate: 'Save notice',
    registered: 'Registered notices', total: '{count} total', refresh: 'Refresh', empty: 'There are no registered notices.',
    tableTitle: 'Title', tableCategory: 'Category', tableStatus: 'Status', tableAudience: 'Audience', tableLanguages: 'Languages',
    tableActions: 'Actions', edit: 'Edit', delete: 'Delete', pagination: 'Admin notice pages',
    concurrentConflict: 'Another administrator changed this notice. Load the latest version before editing again.',
    reloadLatest: 'Load latest version', versionRequired: 'The edit version is unavailable. Load the latest version.',
  },
  vi: {
    eyebrow: 'Vận hành nội dung', title: 'Quản lý thông báo và thông tin',
    description: 'Tạo thông tin cho người lao động nước ngoài và doanh nghiệp, đồng thời quản lý trạng thái đăng.',
    publicView: 'Trang công khai', contractTitle: 'Cần kiểm tra hợp đồng API',
    legacyListWarning: 'Máy chủ trả về dữ liệu cũ. Không thể xác minh trạng thái, đối tượng, ghim, bản dịch và tệp đính kèm.',
    legacySaveWarning: 'Máy chủ trả về dữ liệu cũ. Hãy kiểm tra danh sách vì chưa thể xác minh các trường mở rộng.',
    legacySaved: 'Đã nhận dữ liệu bài viết cơ bản nhưng chưa xác minh được các trường mở rộng.',
    primaryRequired: 'Nhập đầy đủ tiêu đề và nội dung bằng tiếng Hàn hoặc tiếng Anh.', scheduleRequired: 'Nhập thời gian đăng theo lịch.',
    created: 'Đã tạo thông báo.', updated: 'Đã sửa thông báo.', deleted: 'Đã xóa thông báo.',
    deleteConfirm: 'Xóa thông báo "{title}"?', formEdit: 'Sửa thông báo #{id}', formCreate: 'Tạo thông báo mới',
    cancelEdit: 'Hủy chỉnh sửa', category: 'Danh mục', status: 'Trạng thái đăng', audience: 'Đối tượng', pinned: 'Ghim lên đầu',
    scheduleTime: 'Thời gian đăng theo lịch', translationLanguages: 'Ngôn ngữ dịch', titleField: 'Tiêu đề', contentField: 'Nội dung',
    titlePlaceholder: 'Nhập tiêu đề mà người dùng nước ngoài có thể hiểu ngay.',
    contentPlaceholder: 'Viết nguồn chính thức, ngày áp dụng và việc cần làm dưới dạng văn bản thuần.',
    previewAria: 'Xem trước thông báo', previewLabel: 'Xem trước văn bản thuần an toàn', previewTitle: 'Xem trước tiêu đề',
    previewContent: 'Nội dung không được diễn giải là HTML; chỉ giữ nguyên ngắt dòng.', attachments: 'Hình ảnh và tệp đính kèm',
    attachmentHelp: 'JPEG, PNG, WebP, PDF · tối đa 5MB mỗi tệp', selectFile: 'Chọn tệp', cancelUpload: 'Hủy tải lên',
    invalidFileType: 'Chỉ có thể tải lên tệp JPEG, PNG, WebP và PDF.', fileTooLarge: 'Tệp đính kèm phải không quá 5MB.',
    attachmentError: 'Lỗi API tệp đính kèm', deleteAttachment: 'Xóa {name}', reset: 'Đặt lại', saveEdit: 'Lưu thay đổi', saveCreate: 'Lưu thông báo',
    registered: 'Thông báo đã đăng ký', total: 'Tổng {count}', refresh: 'Làm mới', empty: 'Không có thông báo đã đăng ký.',
    tableTitle: 'Tiêu đề', tableCategory: 'Danh mục', tableStatus: 'Trạng thái', tableAudience: 'Đối tượng', tableLanguages: 'Ngôn ngữ',
    tableActions: 'Quản lý', edit: 'Sửa', delete: 'Xóa', pagination: 'Các trang quản trị thông báo',
    concurrentConflict: 'Một quản trị viên khác đã sửa thông báo này. Hãy tải bản mới nhất trước khi sửa lại.',
    reloadLatest: 'Tải bản mới nhất', versionRequired: 'Không xác định được phiên bản chỉnh sửa. Hãy tải bản mới nhất.',
  },
  th: {
    eyebrow: 'การจัดการเนื้อหา', title: 'จัดการประกาศและข้อมูล',
    description: 'สร้างข้อมูลสำหรับแรงงานต่างชาติและนายจ้าง พร้อมจัดการสถานะการเผยแพร่',
    publicView: 'หน้าสาธารณะ', contractTitle: 'ต้องตรวจสอบสัญญา API',
    legacyListWarning: 'เซิร์ฟเวอร์ส่งข้อมูลรูปแบบเก่า จึงตรวจสอบสถานะ กลุ่มเป้าหมาย การปักหมุด คำแปล และไฟล์แนบไม่ได้',
    legacySaveWarning: 'เซิร์ฟเวอร์ส่งข้อมูลรูปแบบเก่า โปรดตรวจสอบรายการเนื่องจากยืนยันฟิลด์เพิ่มเติมไม่ได้',
    legacySaved: 'ได้รับข้อมูลโพสต์พื้นฐานแล้ว แต่ยังยืนยันฟิลด์เพิ่มเติมไม่ได้',
    primaryRequired: 'กรอกชื่อเรื่องและเนื้อหาภาษาเกาหลีหรืออังกฤษให้ครบ', scheduleRequired: 'กรอกเวลาที่ต้องการเผยแพร่',
    created: 'สร้างประกาศแล้ว', updated: 'แก้ไขประกาศแล้ว', deleted: 'ลบประกาศแล้ว',
    deleteConfirm: 'ลบประกาศ "{title}" หรือไม่?', formEdit: 'แก้ไขประกาศ #{id}', formCreate: 'สร้างประกาศใหม่',
    cancelEdit: 'ยกเลิกการแก้ไข', category: 'หมวดหมู่', status: 'สถานะการเผยแพร่', audience: 'กลุ่มเป้าหมาย', pinned: 'ปักหมุดด้านบน',
    scheduleTime: 'เวลาที่กำหนดเผยแพร่', translationLanguages: 'ภาษาที่แปล', titleField: 'ชื่อเรื่อง', contentField: 'เนื้อหา',
    titlePlaceholder: 'ใส่ชื่อเรื่องที่ผู้ใช้ต่างชาติเข้าใจได้ทันที',
    contentPlaceholder: 'เขียนแหล่งข้อมูลทางการ วันที่มีผล และสิ่งที่ต้องทำเป็นข้อความธรรมดา',
    previewAria: 'ตัวอย่างประกาศ', previewLabel: 'ตัวอย่างข้อความธรรมดาที่ปลอดภัย', previewTitle: 'ตัวอย่างชื่อเรื่อง',
    previewContent: 'เนื้อหาจะไม่ถูกตีความเป็น HTML และจะคงไว้เฉพาะการขึ้นบรรทัดใหม่', attachments: 'รูปภาพและไฟล์แนบ',
    attachmentHelp: 'JPEG, PNG, WebP, PDF · ไม่เกิน 5MB ต่อไฟล์', selectFile: 'เลือกไฟล์', cancelUpload: 'ยกเลิกการอัปโหลด',
    invalidFileType: 'อัปโหลดได้เฉพาะไฟล์ JPEG, PNG, WebP และ PDF', fileTooLarge: 'ไฟล์แนบต้องมีขนาดไม่เกิน 5MB',
    attachmentError: 'ข้อผิดพลาด API ไฟล์แนบ', deleteAttachment: 'ลบ {name}', reset: 'รีเซ็ต', saveEdit: 'บันทึกการแก้ไข', saveCreate: 'บันทึกประกาศ',
    registered: 'ประกาศที่ลงทะเบียน', total: 'ทั้งหมด {count}', refresh: 'รีเฟรช', empty: 'ยังไม่มีประกาศที่ลงทะเบียน',
    tableTitle: 'ชื่อเรื่อง', tableCategory: 'หมวดหมู่', tableStatus: 'สถานะ', tableAudience: 'กลุ่มเป้าหมาย', tableLanguages: 'ภาษา',
    tableActions: 'จัดการ', edit: 'แก้ไข', delete: 'ลบ', pagination: 'หน้าจัดการประกาศ',
    concurrentConflict: 'ผู้ดูแลระบบคนอื่นแก้ไขประกาศนี้แล้ว โปรดโหลดเวอร์ชันล่าสุดก่อนแก้ไขอีกครั้ง',
    reloadLatest: 'โหลดเวอร์ชันล่าสุด', versionRequired: 'ไม่พบเวอร์ชันสำหรับแก้ไข โปรดโหลดเวอร์ชันล่าสุด',
  },
  fil: {
    eyebrow: 'Pamamahala ng content', title: 'Pamamahala ng mga abiso at impormasyon',
    description: 'Gumawa ng impormasyon para sa mga dayuhang manggagawa at employer at pamahalaan ang publication status.',
    publicView: 'Public view', contractTitle: 'Kailangang suriin ang API contract',
    legacyListWarning: 'Lumang response ang ibinalik ng server. Hindi makumpirma ang status, audience, pin, translations, at attachments.',
    legacySaveWarning: 'Lumang response ang ibinalik ng server. Tingnan ang listahan dahil hindi nakumpirma ang extended fields.',
    legacySaved: 'Natanggap ang basic post ngunit hindi nakumpirma ang extended fields.',
    primaryRequired: 'Ilagay ang kumpletong title at content sa Korean o English.', scheduleRequired: 'Ilagay ang nakatakdang oras ng publication.',
    created: 'Nagawa ang abiso.', updated: 'Na-update ang abiso.', deleted: 'Nabura ang abiso.',
    deleteConfirm: 'Burahin ang abisong "{title}"?', formEdit: 'I-edit ang abiso #{id}', formCreate: 'Gumawa ng abiso',
    cancelEdit: 'Kanselahin ang pag-edit', category: 'Kategorya', status: 'Publication status', audience: 'Audience', pinned: 'I-pin sa itaas',
    scheduleTime: 'Nakatakdang publication time', translationLanguages: 'Mga wika ng salin', titleField: 'Title', contentField: 'Content',
    titlePlaceholder: 'Maglagay ng title na madaling maunawaan ng mga dayuhang user.',
    contentPlaceholder: 'Isulat ang opisyal na source, effectivity date, at kailangang gawin bilang plain text.',
    previewAria: 'Preview ng abiso', previewLabel: 'Ligtas na plain-text preview', previewTitle: 'Preview ng title',
    previewContent: 'Hindi ituturing na HTML ang content; line breaks lamang ang pananatilihin.', attachments: 'Mga larawan at kalakip',
    attachmentHelp: 'JPEG, PNG, WebP, PDF · hanggang 5MB bawat file', selectFile: 'Pumili ng file', cancelUpload: 'Kanselahin ang upload',
    invalidFileType: 'JPEG, PNG, WebP, at PDF lamang ang maaaring i-upload.', fileTooLarge: 'Dapat 5MB o mas maliit ang kalakip.',
    attachmentError: 'Attachment API error', deleteAttachment: 'Burahin ang {name}', reset: 'I-reset', saveEdit: 'I-save ang pagbabago', saveCreate: 'I-save ang abiso',
    registered: 'Mga rehistradong abiso', total: '{count} lahat', refresh: 'I-refresh', empty: 'Walang rehistradong abiso.',
    tableTitle: 'Title', tableCategory: 'Kategorya', tableStatus: 'Status', tableAudience: 'Audience', tableLanguages: 'Mga wika',
    tableActions: 'Mga aksyon', edit: 'I-edit', delete: 'Burahin', pagination: 'Mga admin notice page',
    concurrentConflict: 'Binago ng ibang administrator ang abisong ito. I-load ang pinakabagong bersyon bago muling mag-edit.',
    reloadLatest: 'I-load ang latest version', versionRequired: 'Hindi available ang edit version. I-load ang pinakabagong bersyon.',
  },
};

export function getBoardErrorMessage(
  reason: unknown,
  copy: BoardCopy,
  fallback = copy.requestError,
) {
  const code =
    typeof reason === 'object' && reason !== null && 'code' in reason
      ? String(reason.code)
      : '';
  const status =
    typeof reason === 'object' && reason !== null && 'status' in reason
      ? Number(reason.status)
      : 0;
  if (code === 'NETWORK_ERROR') return copy.networkError;
  if (code === 'ABORTED') return copy.uploadCancelled;
  if (code === 'INVALID_RESPONSE') return copy.invalidResponse;
  if (code === 'UNSUPPORTED_CONTRACT') return copy.unsupportedContract;
  if (code === 'NOT_FOUND' || status === 404) return copy.notFound;
  if (code === 'AUTH_REQUIRED' || status === 401) return copy.authRequired;
  if (code === 'FORBIDDEN' || status === 403) return copy.forbidden;
  return fallback;
}

export function resolveBoardLocale(lang: string): InfoBoardLocale {
  if (lang === 'tl' || lang === 'fil') return 'fil';
  if (lang === 'ko' || lang === 'vi' || lang === 'th') return lang;
  return 'en';
}
