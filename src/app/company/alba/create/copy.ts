import type { LaunchLocale as AlbaLocale } from '@/i18n/locales';
import type { Benefit, ExperienceLevel, KoreanLevel } from './components/alba-types';

type Copy = {
  headerTitle: string;
  progressLabel: string;
  steps: [string, string, string];
  next: string;
  previous: string;
  submit: string;
  submitting: string;
  back: string;
  completionTitle: string;
  completionBody: (eligible: number, conditional: number) => string;
  manageJobs: string;
  newJob: string;
  basic: {
    category: string;
    loadingCategories: string;
    categoriesError: string;
    retry: string;
    selectCategory: string;
    wage: string;
    wagePlaceholder: (wage: string) => string;
    currency: string;
    wageError: (wage: string) => string;
    wageAbove: (percent: number) => string;
    recruitCount: string;
    recruitCountPlaceholder: string;
    schedule: string;
    startDate: string;
    endDate: string;
    optional: string;
  };
  details: {
    title: string;
    titlePlaceholder: string;
    location: string;
    province: string;
    district: string;
    address: string;
    requirements: string;
    language: string;
    experience: string;
    preferred: string;
    preferredPlaceholder: string;
    benefits: string;
    description: string;
    descriptionPlaceholder: string;
  };
  schedule: {
    days: Record<string, string>;
    selectedSummary: (hours: number, days: number) => string;
    hours: string;
    startTime: string;
    endTime: string;
  };
  options: {
    language: Record<KoreanLevel, string>;
    experience: Record<ExperienceLevel, string>;
    benefits: Record<Benefit, string>;
  };
  validation: {
    category: string;
    wage: string;
    schedule: string;
    startDate: string;
    title: string;
    address: string;
  };
  preview: {
    title: string;
    edit: string;
    emptyTitle: string;
    hourly: string;
    recruit: (count: number | string) => string;
    weekly: (hours: number, days: number) => string;
    until: string;
    visaTitle: string;
    loadingTitle: string;
    loadingBody: string;
    availableVisaTypes: string;
    count: (count: number) => string;
    eligible: (count: number) => string;
    conditional: (count: number) => string;
    blocked: (count: number) => string;
    show: string;
    hide: string;
    inputJob: string;
    ksic: string;
    weekendOnly: string;
    depopulation: string;
    permit: string;
    conditions: string;
    blockReasons: string;
    notes: string;
    employerNotes: string;
    matchingError: string;
    beforeMatch: string;
    manualMatch: string;
    retry: string;
  };
  errors: {
    matching: string;
    submit: string;
    auth: string;
  };
};

const ko: Copy = {
  headerTitle: '알바 공고 작성', progressLabel: '공고 작성 진행 단계', steps: ['기본 정보', '상세 조건', '미리보기'], next: '다음', previous: '이전', submit: '심사 요청하기', submitting: '심사 요청 중...', back: '알바 관리',
  completionTitle: '심사 요청이 접수되었습니다', completionBody: (e, c) => `관리자 검토 후 게시 여부를 알려드립니다. 비자 결과: ${e}개 가능, ${c}개 조건부`, manageJobs: '공고 관리로 이동', newJob: '새 공고 작성',
  basic: { category: '직종 선택', loadingCategories: '직종 목록을 불러오는 중입니다', categoriesError: '직종 목록을 불러오지 못했습니다', retry: '다시 시도', selectCategory: '직종을 선택하세요', wage: '시급', wagePlaceholder: w => `최저시급 ${w}원 이상`, currency: '원', wageError: w => `최저시급(${w}원) 이상이어야 합니다`, wageAbove: p => `최저시급보다 ${p}% 높습니다`, recruitCount: '모집 인원', recruitCountPlaceholder: '모집할 인원 수', schedule: '근무 일정', startDate: '시작일', endDate: '종료일', optional: '선택 사항' },
  details: { title: '공고 제목', titlePlaceholder: '예: 주말 바리스타를 모집합니다', location: '근무지', province: '시/도', district: '시/군/구', address: '상세 주소', requirements: '자격 요건', language: '한국어 수준', experience: '경력', preferred: '우대 조건', preferredPlaceholder: '관련 경험, 자격증 등 우대 조건을 입력하세요', benefits: '복리후생', description: '상세 설명', descriptionPlaceholder: '근무 내용, 환경, 지원 방법을 입력하세요' },
  schedule: { days: { MON: '월', TUE: '화', WED: '수', THU: '목', FRI: '금', SAT: '토', SUN: '일' }, selectedSummary: (h, d) => `주 ${h}시간 · ${d}일`, hours: '시간', startTime: '시작 시간', endTime: '종료 시간' },
  options: { language: { NONE: '무관', BASIC: '기초', DAILY: '일상 회화', BUSINESS: '업무 가능' }, experience: { NONE: '경력 무관', UNDER_1Y: '1년 미만', ONE_TO_THREE_Y: '1~3년', OVER_3Y: '3년 이상' }, benefits: { MEAL: '식사 제공', TRANSPORT: '교통비 지원', INSURANCE: '4대보험', HOUSING: '숙소 제공', UNIFORM: '유니폼 제공', STAFF_DISCOUNT: '직원 할인', BONUS: '상여금', FLEXIBLE_HOURS: '유연 근무' } },
  validation: { category: '직종을 선택해 주세요', wage: '최저시급 이상을 입력해 주세요', schedule: '근무일을 선택해 주세요', startDate: '시작일을 입력해 주세요', title: '공고 제목을 입력해 주세요', address: '시/도를 입력해 주세요' },
  preview: { title: '공고 미리보기', edit: '수정하기', emptyTitle: '공고 제목을 입력해 주세요', hourly: '/시간', recruit: n => `모집 ${n}명`, weekly: (h, d) => `주 ${h}시간 · ${d}일`, until: '채용 시까지', visaTitle: '비자 매칭 결과', loadingTitle: '비자 매칭을 분석하는 중입니다', loadingBody: '입력한 조건에 맞는 채용 가능 비자를 확인하고 있습니다', availableVisaTypes: '채용 가능한 비자 유형', count: n => `${n}개`, eligible: n => `가능 ${n}개`, conditional: n => `조건부 ${n}개`, blocked: n => `불가 ${n}개`, show: '보기', hide: '접기', inputJob: '직종', ksic: '업종 코드', weekendOnly: '주말 전용', depopulation: '인구감소지역', permit: '허가 필요', conditions: '채용 조건', blockReasons: '불가 사유', notes: '참고 사항', employerNotes: '고용주 확인 사항', matchingError: '비자 매칭 분석에 실패했습니다', beforeMatch: '공고 조건을 입력하면 비자 매칭 결과가 표시됩니다', manualMatch: '다시 분석하기', retry: '다시 시도' },
  errors: { matching: '비자 매칭을 완료하지 못했습니다. 다시 시도해 주세요.', submit: '공고를 제출하지 못했습니다. 잠시 후 다시 시도해 주세요.', auth: '로그인 후 다시 시도해 주세요.' }
};

const en: Copy = {
  headerTitle: 'Create a part-time job', progressLabel: 'Job creation progress', steps: ['Basic information', 'Job details', 'Preview'], next: 'Continue', previous: 'Back', submit: 'Submit for review', submitting: 'Submitting...', back: 'Part-time jobs', completionTitle: 'Your review request was submitted', completionBody: (e, c) => `We will notify you after review. Visa results: ${e} eligible, ${c} conditional`, manageJobs: 'Go to job management', newJob: 'Create another job',
  basic: { category: 'Job category', loadingCategories: 'Loading job categories', categoriesError: 'We could not load job categories', retry: 'Try again', selectCategory: 'Select a job category', wage: 'Hourly wage', wagePlaceholder: w => `At least ${w} KRW per hour`, currency: 'KRW', wageError: w => `The wage must be at least ${w} KRW`, wageAbove: p => `${p}% above the minimum wage`, recruitCount: 'Openings', recruitCountPlaceholder: 'Number of people to hire', schedule: 'Work schedule', startDate: 'Start date', endDate: 'End date', optional: 'Optional' },
  details: { title: 'Job title', titlePlaceholder: 'e.g. Weekend barista wanted', location: 'Workplace', province: 'Province / city', district: 'District', address: 'Address details', requirements: 'Requirements', language: 'Korean level', experience: 'Experience', preferred: 'Preferred qualifications', preferredPlaceholder: 'Add relevant experience or certificates', benefits: 'Benefits', description: 'Job description', descriptionPlaceholder: 'Describe the work, workplace, and how to apply' },
  schedule: { days: { MON: 'Mon', TUE: 'Tue', WED: 'Wed', THU: 'Thu', FRI: 'Fri', SAT: 'Sat', SUN: 'Sun' }, selectedSummary: (h, d) => `${h} hours/week · ${d} days`, hours: 'hours', startTime: 'Start time', endTime: 'End time' },
  options: { language: { NONE: 'Any level', BASIC: 'Basic', DAILY: 'Conversational', BUSINESS: 'Business' }, experience: { NONE: 'No experience required', UNDER_1Y: 'Less than 1 year', ONE_TO_THREE_Y: '1–3 years', OVER_3Y: '3+ years' }, benefits: { MEAL: 'Meals provided', TRANSPORT: 'Transport support', INSURANCE: 'Social insurance', HOUSING: 'Housing provided', UNIFORM: 'Uniform provided', STAFF_DISCOUNT: 'Staff discount', BONUS: 'Bonus', FLEXIBLE_HOURS: 'Flexible hours' } },
  validation: { category: 'Select a job category', wage: 'Enter at least the minimum wage', schedule: 'Select at least one workday', startDate: 'Enter a start date', title: 'Enter a job title', address: 'Enter a province or city' },
  preview: { title: 'Job preview', edit: 'Edit', emptyTitle: 'Enter a job title', hourly: '/hour', recruit: n => `${n} opening(s)`, weekly: (h, d) => `${h} hours/week · ${d} days`, until: 'Until filled', visaTitle: 'Visa matching results', loadingTitle: 'Analyzing visa eligibility', loadingBody: 'Checking which visas may work with these job conditions', availableVisaTypes: 'Visa types that may work', count: n => `${n}`, eligible: n => `Eligible ${n}`, conditional: n => `Conditional ${n}`, blocked: n => `Not eligible ${n}`, show: 'Show', hide: 'Hide', inputJob: 'Job', ksic: 'Industry code', weekendOnly: 'Weekend only', depopulation: 'Population-decrease area', permit: 'Permit required', conditions: 'Hiring conditions', blockReasons: 'Why it is not eligible', notes: 'Notes', employerNotes: 'Employer checks', matchingError: 'Visa matching failed', beforeMatch: 'Visa results will appear after you enter the job conditions', manualMatch: 'Analyze now', retry: 'Try again' },
  errors: { matching: 'Visa matching could not be completed. Please try again.', submit: 'The job could not be submitted. Please try again shortly.', auth: 'Please sign in and try again.' }
};

const vi: Copy = {
  headerTitle: 'Tạo tin việc làm bán thời gian', progressLabel: 'Tiến độ tạo tin', steps: ['Thông tin cơ bản', 'Điều kiện công việc', 'Xem trước'], next: 'Tiếp tục', previous: 'Quay lại', submit: 'Gửi duyệt', submitting: 'Đang gửi...', back: 'Việc bán thời gian', completionTitle: 'Đã gửi yêu cầu duyệt', completionBody: (e, c) => `Chúng tôi sẽ thông báo sau khi duyệt. Kết quả visa: ${e} đủ điều kiện, ${c} có điều kiện`, manageJobs: 'Quản lý tin tuyển dụng', newJob: 'Tạo tin khác',
  basic: { category: 'Ngành nghề', loadingCategories: 'Đang tải danh sách ngành nghề', categoriesError: 'Không thể tải danh sách ngành nghề', retry: 'Thử lại', selectCategory: 'Chọn ngành nghề', wage: 'Lương theo giờ', wagePlaceholder: w => `Tối thiểu ${w} KRW mỗi giờ`, currency: 'KRW', wageError: w => `Mức lương phải từ ${w} KRW mỗi giờ`, wageAbove: p => `Cao hơn mức lương tối thiểu ${p}%`, recruitCount: 'Số người cần tuyển', recruitCountPlaceholder: 'Nhập số người cần tuyển', schedule: 'Lịch làm việc', startDate: 'Ngày bắt đầu', endDate: 'Ngày kết thúc', optional: 'Không bắt buộc' },
  details: { title: 'Tiêu đề tin', titlePlaceholder: 'Ví dụ: Tuyển nhân viên pha chế cuối tuần', location: 'Nơi làm việc', province: 'Tỉnh / thành phố', district: 'Quận / huyện', address: 'Địa chỉ chi tiết', requirements: 'Yêu cầu', language: 'Trình độ tiếng Hàn', experience: 'Kinh nghiệm', preferred: 'Ưu tiên', preferredPlaceholder: 'Nhập kinh nghiệm hoặc chứng chỉ liên quan', benefits: 'Phúc lợi', description: 'Mô tả công việc', descriptionPlaceholder: 'Mô tả công việc, môi trường và cách ứng tuyển' },
  schedule: { days: { MON: 'T2', TUE: 'T3', WED: 'T4', THU: 'T5', FRI: 'T6', SAT: 'T7', SUN: 'CN' }, selectedSummary: (h, d) => `${h} giờ/tuần · ${d} ngày`, hours: 'giờ', startTime: 'Giờ bắt đầu', endTime: 'Giờ kết thúc' },
  options: { language: { NONE: 'Không yêu cầu', BASIC: 'Cơ bản', DAILY: 'Giao tiếp hằng ngày', BUSINESS: 'Có thể dùng trong công việc' }, experience: { NONE: 'Không yêu cầu kinh nghiệm', UNDER_1Y: 'Dưới 1 năm', ONE_TO_THREE_Y: '1–3 năm', OVER_3Y: 'Từ 3 năm' }, benefits: { MEAL: 'Hỗ trợ bữa ăn', TRANSPORT: 'Hỗ trợ đi lại', INSURANCE: 'Bảo hiểm xã hội', HOUSING: 'Hỗ trợ chỗ ở', UNIFORM: 'Cấp đồng phục', STAFF_DISCOUNT: 'Giảm giá nhân viên', BONUS: 'Thưởng', FLEXIBLE_HOURS: 'Giờ làm linh hoạt' } },
  validation: { category: 'Hãy chọn ngành nghề', wage: 'Nhập mức lương tối thiểu', schedule: 'Hãy chọn ngày làm việc', startDate: 'Nhập ngày bắt đầu', title: 'Nhập tiêu đề tin', address: 'Nhập tỉnh hoặc thành phố' },
  preview: { title: 'Xem trước tin tuyển dụng', edit: 'Chỉnh sửa', emptyTitle: 'Hãy nhập tiêu đề tin', hourly: '/giờ', recruit: n => `${n} vị trí`, weekly: (h, d) => `${h} giờ/tuần · ${d} ngày`, until: 'Đến khi tuyển đủ', visaTitle: 'Kết quả đối chiếu visa', loadingTitle: 'Đang phân tích điều kiện visa', loadingBody: 'Đang kiểm tra các loại visa phù hợp với điều kiện công việc', availableVisaTypes: 'Loại visa có thể tuyển dụng', count: n => `${n}`, eligible: n => `Có thể tuyển ${n}`, conditional: n => `Có điều kiện ${n}`, blocked: n => `Không thể tuyển ${n}`, show: 'Xem', hide: 'Thu gọn', inputJob: 'Ngành nghề', ksic: 'Mã ngành', weekendOnly: 'Chỉ cuối tuần', depopulation: 'Khu vực suy giảm dân số', permit: 'Cần giấy phép', conditions: 'Điều kiện tuyển dụng', blockReasons: 'Lý do không phù hợp', notes: 'Lưu ý', employerNotes: 'Nội dung chủ tuyển dụng cần kiểm tra', matchingError: 'Đối chiếu visa thất bại', beforeMatch: 'Kết quả visa sẽ hiển thị sau khi nhập điều kiện công việc', manualMatch: 'Phân tích ngay', retry: 'Thử lại' },
  errors: { matching: 'Không thể hoàn tất đối chiếu visa. Vui lòng thử lại.', submit: 'Không thể gửi tin. Vui lòng thử lại sau.', auth: 'Vui lòng đăng nhập rồi thử lại.' }
};
const th: Copy = {
  headerTitle: 'สร้างประกาศงานพาร์ตไทม์', progressLabel: 'ขั้นตอนการสร้างประกาศ', steps: ['ข้อมูลพื้นฐาน', 'รายละเอียดงาน', 'ดูตัวอย่าง'], next: 'ดำเนินการต่อ', previous: 'ย้อนกลับ', submit: 'ส่งตรวจสอบ', submitting: 'กำลังส่ง...', back: 'งานพาร์ตไทม์', completionTitle: 'ส่งคำขอตรวจสอบแล้ว', completionBody: (e, c) => `จะแจ้งผลหลังตรวจสอบ ผลวีซา: ผ่าน ${e} รายการ มีเงื่อนไข ${c} รายการ`, manageJobs: 'ไปที่จัดการประกาศ', newJob: 'สร้างประกาศใหม่',
  basic: { category: 'ประเภทงาน', loadingCategories: 'กำลังโหลดประเภทงาน', categoriesError: 'โหลดประเภทงานไม่สำเร็จ', retry: 'ลองอีกครั้ง', selectCategory: 'เลือกประเภทงาน', wage: 'ค่าจ้างรายชั่วโมง', wagePlaceholder: w => `อย่างน้อย ${w} KRW ต่อชั่วโมง`, currency: 'KRW', wageError: w => `ค่าจ้างต้องไม่น้อยกว่า ${w} KRW ต่อชั่วโมง`, wageAbove: p => `สูงกว่าค่าจ้างขั้นต่ำ ${p}%`, recruitCount: 'จำนวนที่รับ', recruitCountPlaceholder: 'ระบุจำนวนผู้สมัครที่ต้องการ', schedule: 'ตารางงาน', startDate: 'วันเริ่มงาน', endDate: 'วันสิ้นสุด', optional: 'ไม่บังคับ' },
  details: { title: 'ชื่องาน', titlePlaceholder: 'เช่น รับสมัครบาริสต้าช่วงสุดสัปดาห์', location: 'สถานที่ทำงาน', province: 'จังหวัด / เมือง', district: 'เขต / อำเภอ', address: 'ที่อยู่โดยละเอียด', requirements: 'คุณสมบัติ', language: 'ระดับภาษาเกาหลี', experience: 'ประสบการณ์', preferred: 'คุณสมบัติที่ต้องการ', preferredPlaceholder: 'ระบุประสบการณ์หรือใบรับรองที่ต้องการ', benefits: 'สวัสดิการ', description: 'รายละเอียดงาน', descriptionPlaceholder: 'อธิบายงาน สถานที่ทำงาน และวิธีสมัคร' },
  schedule: { days: { MON: 'จ.', TUE: 'อ.', WED: 'พ.', THU: 'พฤ.', FRI: 'ศ.', SAT: 'ส.', SUN: 'อา.' }, selectedSummary: (h, d) => `${h} ชั่วโมง/สัปดาห์ · ${d} วัน`, hours: 'ชม.', startTime: 'เวลาเริ่มงาน', endTime: 'เวลาเลิกงาน' },
  options: { language: { NONE: 'ไม่จำกัด', BASIC: 'ระดับพื้นฐาน', DAILY: 'สนทนาในชีวิตประจำวัน', BUSINESS: 'ใช้ในงานได้' }, experience: { NONE: 'ไม่จำกัดประสบการณ์', UNDER_1Y: 'น้อยกว่า 1 ปี', ONE_TO_THREE_Y: '1–3 ปี', OVER_3Y: 'มากกว่า 3 ปี' }, benefits: { MEAL: 'มีอาหารให้', TRANSPORT: 'สนับสนุนค่าเดินทาง', INSURANCE: 'ประกันสังคม', HOUSING: 'มีที่พักให้', UNIFORM: 'มีเครื่องแบบให้', STAFF_DISCOUNT: 'ส่วนลดพนักงาน', BONUS: 'โบนัส', FLEXIBLE_HOURS: 'เวลาทำงานยืดหยุ่น' } },
  validation: { category: 'กรุณาเลือกประเภทงาน', wage: 'กรุณาระบุค่าจ้างขั้นต่ำ', schedule: 'กรุณาเลือกวันทำงาน', startDate: 'กรุณาระบุวันเริ่มงาน', title: 'กรุณาระบุชื่องาน', address: 'กรุณาระบุจังหวัดหรือเมือง' },
  preview: { title: 'ดูตัวอย่างประกาศ', edit: 'แก้ไข', emptyTitle: 'กรุณาระบุชื่องาน', hourly: '/ชม.', recruit: n => `รับ ${n} คน`, weekly: (h, d) => `${h} ชั่วโมง/สัปดาห์ · ${d} วัน`, until: 'จนกว่าจะรับครบ', visaTitle: 'ผลการจับคู่วีซา', loadingTitle: 'กำลังวิเคราะห์เงื่อนไขวีซา', loadingBody: 'กำลังตรวจสอบประเภทวีซาที่เหมาะกับเงื่อนไขงานนี้', availableVisaTypes: 'ประเภทวีซาที่อาจรับได้', count: n => `${n} รายการ`, eligible: n => `รับได้ ${n}`, conditional: n => `มีเงื่อนไข ${n}`, blocked: n => `รับไม่ได้ ${n}`, show: 'ดู', hide: 'ย่อ', inputJob: 'งาน', ksic: 'รหัสอุตสาหกรรม', weekendOnly: 'เฉพาะสุดสัปดาห์', depopulation: 'พื้นที่ประชากรลดลง', permit: 'ต้องมีใบอนุญาต', conditions: 'เงื่อนไขการจ้าง', blockReasons: 'เหตุผลที่ไม่เข้าเกณฑ์', notes: 'หมายเหตุ', employerNotes: 'สิ่งที่นายจ้างต้องตรวจสอบ', matchingError: 'จับคู่วีซาไม่สำเร็จ', beforeMatch: 'ผลวีซาจะแสดงเมื่อกรอกเงื่อนไขงานแล้ว', manualMatch: 'วิเคราะห์ตอนนี้', retry: 'ลองอีกครั้ง' },
  errors: { matching: 'ไม่สามารถจับคู่วีซาได้ กรุณาลองอีกครั้ง', submit: 'ส่งประกาศไม่สำเร็จ กรุณาลองใหม่ภายหลัง', auth: 'กรุณาเข้าสู่ระบบแล้วลองอีกครั้ง' }
};
const fil: Copy = {
  headerTitle: 'Gumawa ng part-time na trabaho', progressLabel: 'Progreso sa paggawa ng trabaho', steps: ['Pangunahing impormasyon', 'Mga detalye ng trabaho', 'Preview'], next: 'Magpatuloy', previous: 'Bumalik', submit: 'Ipadala para sa pagsusuri', submitting: 'Ipinapadala...', back: 'Mga part-time na trabaho', completionTitle: 'Naipadala ang kahilingan sa pagsusuri', completionBody: (e, c) => `Ipapaalam namin ang resulta pagkatapos ng pagsusuri. Visa: ${e} eligible, ${c} may kondisyon`, manageJobs: 'Pamahalaan ang mga trabaho', newJob: 'Gumawa ng isa pa',
  basic: { category: 'Kategorya ng trabaho', loadingCategories: 'Nilo-load ang mga kategorya ng trabaho', categoriesError: 'Hindi ma-load ang mga kategorya ng trabaho', retry: 'Subukan muli', selectCategory: 'Pumili ng kategorya ng trabaho', wage: 'Sahod kada oras', wagePlaceholder: w => `Hindi bababa sa ${w} KRW kada oras`, currency: 'KRW', wageError: w => `Dapat hindi bababa sa ${w} KRW kada oras ang sahod`, wageAbove: p => `${p}% na mas mataas sa minimum na sahod`, recruitCount: 'Bilang ng kukunin', recruitCountPlaceholder: 'Ilagay ang bilang ng kukunin', schedule: 'Iskedyul ng trabaho', startDate: 'Petsa ng simula', endDate: 'Petsa ng pagtatapos', optional: 'Opsyonal' },
  details: { title: 'Pamagat ng trabaho', titlePlaceholder: 'Halimbawa: Kailangan ng weekend barista', location: 'Lugar ng trabaho', province: 'Lalawigan / lungsod', district: 'Distrito', address: 'Detalye ng address', requirements: 'Mga kinakailangan', language: 'Antas ng Korean', experience: 'Karanasan', preferred: 'Mas gustong kwalipikasyon', preferredPlaceholder: 'Ilagay ang kaugnay na karanasan o sertipiko', benefits: 'Mga benepisyo', description: 'Deskripsyon ng trabaho', descriptionPlaceholder: 'Ilarawan ang trabaho, lugar, at paraan ng pag-apply' },
  schedule: { days: { MON: 'Lun', TUE: 'Mar', WED: 'Miy', THU: 'Huw', FRI: 'Biy', SAT: 'Sab', SUN: 'Lin' }, selectedSummary: (h, d) => `${h} oras/linggo · ${d} araw`, hours: 'oras', startTime: 'Oras ng simula', endTime: 'Oras ng pagtatapos' },
  options: { language: { NONE: 'Anumang antas', BASIC: 'Batayan', DAILY: 'Pang-araw-araw na usapan', BUSINESS: 'Maaaring gamitin sa trabaho' }, experience: { NONE: 'Hindi kailangan ng karanasan', UNDER_1Y: 'Mas mababa sa 1 taon', ONE_TO_THREE_Y: '1–3 taon', OVER_3Y: '3 taon o higit pa' }, benefits: { MEAL: 'May pagkain', TRANSPORT: 'Tulong sa pamasahe', INSURANCE: 'Social insurance', HOUSING: 'May tirahan', UNIFORM: 'May uniporme', STAFF_DISCOUNT: 'Diskwento para sa staff', BONUS: 'Bonus', FLEXIBLE_HOURS: 'Flexible na oras' } },
  validation: { category: 'Pumili ng kategorya ng trabaho', wage: 'Ilagay ang minimum na sahod', schedule: 'Pumili ng araw ng trabaho', startDate: 'Ilagay ang petsa ng simula', title: 'Ilagay ang pamagat ng trabaho', address: 'Ilagay ang lalawigan o lungsod' },
  preview: { title: 'Preview ng trabaho', edit: 'I-edit', emptyTitle: 'Ilagay ang pamagat ng trabaho', hourly: '/oras', recruit: n => `${n} posisyon`, weekly: (h, d) => `${h} oras/linggo · ${d} araw`, until: 'Hanggang mapunan', visaTitle: 'Mga resulta ng visa matching', loadingTitle: 'Sinusuri ang eligibility ng visa', loadingBody: 'Tinitingnan kung aling visa ang maaaring tumugma sa mga kondisyon ng trabaho', availableVisaTypes: 'Mga visa na maaaring gamitin', count: n => `${n}`, eligible: n => `Eligible ${n}`, conditional: n => `May kondisyon ${n}`, blocked: n => `Hindi eligible ${n}`, show: 'Ipakita', hide: 'Itago', inputJob: 'Trabaho', ksic: 'Industry code', weekendOnly: 'Weekend lamang', depopulation: 'Lugar na bumababa ang populasyon', permit: 'Kailangan ng permit', conditions: 'Mga kondisyon sa pagkuha', blockReasons: 'Dahilan kung bakit hindi eligible', notes: 'Mga tala', employerNotes: 'Dapat suriin ng employer', matchingError: 'Hindi nagawa ang visa matching', beforeMatch: 'Lalabas ang visa result pagkatapos ilagay ang kondisyon ng trabaho', manualMatch: 'Suriin ngayon', retry: 'Subukan muli' },
  errors: { matching: 'Hindi makumpleto ang visa matching. Subukan muli.', submit: 'Hindi maipadala ang trabaho. Subukan muli mamaya.', auth: 'Mag-sign in at subukan muli.' }
};

const copies: Record<AlbaLocale, Copy> = { ko, en, vi, th, fil };
export function getAlbaCopy(locale: string): Copy {
  const normalized = locale === 'kr' ? 'ko' : locale === 'tl' ? 'fil' : locale;
  return copies[normalized as AlbaLocale] || copies.en;
}
