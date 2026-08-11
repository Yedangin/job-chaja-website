export type CompanyJobsLocale = 'ko' | 'en' | 'vi' | 'th' | 'fil';

export type CompanyJobsCopy = {
  title: string;
  create: string;
  all: string;
  draft: string;
  review: string;
  rejected: string;
  active: string;
  closed: string;
  expired: string;
  suspended: string;
  loading: string;
  empty: string;
  submit: string;
  resubmit: string;
  edit: string;
  retry: string;
  login: string;
  forbidden: string;
  conflict: string;
  server: string;
  rejection: string;
  submitted: string;
  submitting: string;
  partTime: string;
  fullTime: string;
  applications: string;
  dateLocale: string;
  validationError: string;
  requiredFields: string;
  draftRestored: string;
  copyFailed: string;
  saveFailed: string;
  reviewSubmitted: string;
};

export const companyJobsCopy: Record<CompanyJobsLocale, CompanyJobsCopy> = {
  ko: {
    title: '채용공고 관리', create: '공고 작성', all: '전체', draft: '임시저장', review: '심사 중', rejected: '반려', active: '게시 중', closed: '마감', expired: '만료됨', suspended: '중지됨',
    loading: '채용공고를 불러오는 중입니다.', empty: '이 상태의 채용공고가 없습니다.', submit: '심사 요청', resubmit: '수정 후 재심사 요청', edit: '수정', retry: '다시 시도',
    login: '공고를 관리하려면 로그인해 주세요.', forbidden: '이 공고에 접근할 권한이 없습니다.', conflict: '다른 변경사항이 먼저 반영되었습니다. 목록을 새로고침한 후 다시 시도해 주세요.', server: '채용공고를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.',
    rejection: '반려 사유', submitted: '심사 요청이 접수되었습니다.', submitting: '심사 요청 중...', partTime: '파트타임', fullTime: '정규직', applications: '{count}명 지원', dateLocale: 'ko-KR',
    validationError: '입력 내용을 확인해 주세요.', requiredFields: '필수 항목을 확인해 주세요.', draftRestored: '이전에 작성한 임시저장 내용을 불러왔습니다.', copyFailed: '공고 복사에 실패했습니다.', saveFailed: '공고를 저장하거나 심사 요청하지 못했습니다.', reviewSubmitted: '심사 요청이 접수되었습니다. 검토 결과를 알려드리겠습니다.',
  },
  en: {
    title: 'Job postings', create: 'Create job', all: 'All', draft: 'Draft', review: 'Under review', rejected: 'Rejected', active: 'Live', closed: 'Closed', expired: 'Expired', suspended: 'Suspended',
    loading: 'Loading job postings.', empty: 'There are no job postings in this status.', submit: 'Submit for review', resubmit: 'Edit and resubmit', edit: 'Edit', retry: 'Try again',
    login: 'Please sign in to manage postings.', forbidden: 'You do not have permission to access this posting.', conflict: 'This posting changed elsewhere. Refresh the list and try again.', server: 'We could not load job postings. Please try again shortly.',
    rejection: 'Review note', submitted: 'Your posting was submitted for review.', submitting: 'Submitting...', partTime: 'Part-time', fullTime: 'Full-time', applications: '{count} applications', dateLocale: 'en-US',
    validationError: 'Please check this field.', requiredFields: 'Please check the required fields.', draftRestored: 'Your saved draft has been restored.', copyFailed: 'We could not copy this posting.', saveFailed: 'We could not save the posting or submit it for review.', reviewSubmitted: 'Your review request was submitted. We will notify you of the result.',
  },
  vi: {
    title: 'Quản lý tin tuyển dụng', create: 'Tạo tin tuyển dụng', all: 'Tất cả', draft: 'Bản nháp', review: 'Đang xét duyệt', rejected: 'Bị từ chối', active: 'Đang hiển thị', closed: 'Đã đóng', expired: 'Đã hết hạn', suspended: 'Đã tạm dừng',
    loading: 'Đang tải tin tuyển dụng.', empty: 'Không có tin tuyển dụng ở trạng thái này.', submit: 'Gửi xét duyệt', resubmit: 'Chỉnh sửa và gửi lại', edit: 'Chỉnh sửa', retry: 'Thử lại',
    login: 'Vui lòng đăng nhập để quản lý tin tuyển dụng.', forbidden: 'Bạn không có quyền truy cập tin tuyển dụng này.', conflict: 'Tin tuyển dụng đã được thay đổi ở nơi khác. Hãy tải lại danh sách và thử lại.', server: 'Không thể tải tin tuyển dụng. Vui lòng thử lại sau.',
    rejection: 'Ghi chú xét duyệt', submitted: 'Yêu cầu xét duyệt của bạn đã được gửi.', submitting: 'Đang gửi...', partTime: 'Bán thời gian', fullTime: 'Toàn thời gian', applications: '{count} đơn ứng tuyển', dateLocale: 'vi-VN',
    validationError: 'Vui lòng kiểm tra trường này.', requiredFields: 'Vui lòng kiểm tra các trường bắt buộc.', draftRestored: 'Bản nháp đã lưu đã được khôi phục.', copyFailed: 'Không thể sao chép tin tuyển dụng này.', saveFailed: 'Không thể lưu tin tuyển dụng hoặc gửi xét duyệt.', reviewSubmitted: 'Yêu cầu xét duyệt đã được gửi. Chúng tôi sẽ thông báo kết quả cho bạn.',
  },
  th: {
    title: 'จัดการประกาศงาน', create: 'สร้างประกาศงาน', all: 'ทั้งหมด', draft: 'ฉบับร่าง', review: 'กำลังตรวจสอบ', rejected: 'ไม่ผ่านการอนุมัติ', active: 'เผยแพร่แล้ว', closed: 'ปิดรับแล้ว', expired: 'หมดอายุแล้ว', suspended: 'ระงับแล้ว',
    loading: 'กำลังโหลดประกาศงาน', empty: 'ไม่มีประกาศงานในสถานะนี้', submit: 'ส่งเพื่อตรวจสอบ', resubmit: 'แก้ไขและส่งใหม่', edit: 'แก้ไข', retry: 'ลองอีกครั้ง',
    login: 'กรุณาเข้าสู่ระบบเพื่อจัดการประกาศงาน', forbidden: 'คุณไม่มีสิทธิ์เข้าถึงประกาศงานนี้', conflict: 'ประกาศงานนี้มีการเปลี่ยนแปลงแล้ว กรุณารีเฟรชรายการและลองอีกครั้ง', server: 'ไม่สามารถโหลดประกาศงานได้ กรุณาลองใหม่อีกครั้งภายหลัง',
    rejection: 'หมายเหตุจากการตรวจสอบ', submitted: 'ส่งคำขอตรวจสอบแล้ว', submitting: 'กำลังส่ง...', partTime: 'พาร์ตไทม์', fullTime: 'งานประจำ', applications: 'ผู้สมัคร {count} คน', dateLocale: 'th-TH',
    validationError: 'กรุณาตรวจสอบช่องนี้', requiredFields: 'กรุณาตรวจสอบช่องที่ต้องกรอก', draftRestored: 'กู้คืนฉบับร่างที่บันทึกไว้แล้ว', copyFailed: 'ไม่สามารถคัดลอกประกาศงานนี้ได้', saveFailed: 'ไม่สามารถบันทึกประกาศงานหรือส่งเพื่อตรวจสอบได้', reviewSubmitted: 'ส่งคำขอตรวจสอบแล้ว เราจะแจ้งผลให้คุณทราบ',
  },
  fil: {
    title: 'Pamahalaan ang mga anunsyo ng trabaho', create: 'Gumawa ng anunsyo', all: 'Lahat', draft: 'Draft', review: 'Sinusuri', rejected: 'Hindi naaprubahan', active: 'Naka-publish', closed: 'Sarado na', expired: 'Nag-expire na', suspended: 'Sinuspinde',
    loading: 'Nilo-load ang mga anunsyo ng trabaho.', empty: 'Walang anunsyo ng trabaho sa status na ito.', submit: 'Isumite para sa pagsusuri', resubmit: 'I-edit at isumiteng muli', edit: 'I-edit', retry: 'Subukan muli',
    login: 'Mag-sign in upang pamahalaan ang mga anunsyo.', forbidden: 'Wala kang pahintulot na buksan ang anunsyong ito.', conflict: 'May bagong pagbabago sa anunsyo. I-refresh ang listahan at subukan muli.', server: 'Hindi ma-load ang mga anunsyo ng trabaho. Subukan muli mamaya.',
    rejection: 'Tala ng pagsusuri', submitted: 'Naipasa na ang iyong kahilingan para sa pagsusuri.', submitting: 'Isinusumite...', partTime: 'Part-time', fullTime: 'Full-time', applications: '{count} aplikante', dateLocale: 'fil-PH',
    validationError: 'Pakisuri ang field na ito.', requiredFields: 'Pakisuri ang mga kinakailangang field.', draftRestored: 'Naibalik na ang iyong naka-save na draft.', copyFailed: 'Hindi makopya ang anunsyong ito.', saveFailed: 'Hindi nai-save ang anunsyo o naipasa para sa pagsusuri.', reviewSubmitted: 'Naipasa ang kahilingan para sa pagsusuri. Ipapaalam namin sa iyo ang resulta.',
  },
};

export function getCompanyJobsLocale(language?: string): CompanyJobsLocale {
  const prefix = (language || 'en').toLowerCase().split('-')[0];
  if (prefix === 'ko' || prefix === 'vi' || prefix === 'th') return prefix;
  if (prefix === 'tl' || prefix === 'fil') return 'fil';
  return 'en';
}
