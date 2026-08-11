import type { PlannerDifficulty, PlannerLang } from './planner-types';

type PlannerCopy = {
  brand: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  noLogin: string;
  leftTitle: string;
  leftBody: string;
  progress: string;
  confidence: string;
  verifiedSources: string;
  expertReview: string;
  privateByDefault: string;
  next: string;
  back: string;
  submit: string;
  submitting: string;
  resultTitle: string;
  resultSubtitle: string;
  savePlan: string;
  saved: string;
  saving: string;
  loginToSave: string;
  detail: string;
  restart: string;
  premium: string;
  trustPanel: string;
  policyVersion: string;
  lastVerified: string;
  profileConfidence: string;
  legalNotice: string;
  emptyTitle: string;
  emptyBody: string;
  errorTitle: string;
};

const en: PlannerCopy = {
  brand: 'JobChaja',
  eyebrow: 'Korea Visa Planner',
  title: 'Find your realistic path to Korea',
  subtitle:
    'Check study, work, and settlement routes with a profile-based planner. No login required for the first result.',
  noLogin: 'Free preview first. Save after login.',
  leftTitle: 'Built for overseas users',
  leftBody:
    'Your route is scored by suitability, readiness, policy confidence, and the need for expert review.',
  progress: 'Progress',
  confidence: 'Profile confidence',
  verifiedSources: 'Policy source versioning',
  expertReview: 'Expert review ready',
  privateByDefault: 'Talent pool sharing stays off until you choose it.',
  next: 'Next',
  back: 'Back',
  submit: 'Check my routes',
  submitting: 'Checking routes...',
  resultTitle: 'Your Korea pathways',
  resultSubtitle:
    'This is preparation guidance, not a visa issuance guarantee. Save the result to continue with documents and expert review.',
  savePlan: 'Save my plan',
  saved: 'Saved to your account',
  saving: 'Saving...',
  loginToSave: 'Log in to save',
  detail: 'View details',
  restart: 'Start again',
  premium: 'Get detailed roadmap',
  trustPanel: 'Trust panel',
  policyVersion: 'Policy version',
  lastVerified: 'Last verified',
  profileConfidence: 'Profile confidence',
  legalNotice: 'Legal notice',
  emptyTitle: 'No matching route yet',
  emptyBody: 'Change your conditions or request a human review.',
  errorTitle: 'Planner failed',
};

const ko: PlannerCopy = {
  brand: 'JobChaja',
  eyebrow: '한국 비자 플래너',
  title: '한국으로 들어올 현실적인 경로를 찾아보세요',
  subtitle:
    '학업, 취업, 정착 경로를 프로필 기반으로 확인합니다. 첫 결과는 로그인 없이 볼 수 있습니다.',
  noLogin: '무료 결과 먼저 확인하고, 로그인 후 저장하세요.',
  leftTitle: '해외 거주 사용자를 위한 설계',
  leftBody:
    '적합도, 준비도, 정책 신뢰도, 전문가 검토 필요 여부를 함께 판단합니다.',
  progress: '진행률',
  confidence: '프로필 신뢰도',
  verifiedSources: '정책 버전 관리',
  expertReview: '전문가 검토 연결',
  privateByDefault: '기업 공개는 사용자가 선택하기 전까지 꺼져 있습니다.',
  next: '다음',
  back: '이전',
  submit: '내 경로 확인',
  submitting: '경로 확인 중...',
  resultTitle: '추천 한국 진입 경로',
  resultSubtitle:
    '이 결과는 준비도 안내이며 비자 발급 보장이 아닙니다. 저장하면 서류와 전문가 검토로 이어갈 수 있습니다.',
  savePlan: '내 경로 저장',
  saved: '계정에 저장됨',
  saving: '저장 중...',
  loginToSave: '로그인 후 저장',
  detail: '상세 보기',
  restart: '다시 진단',
  premium: '상세 로드맵 보기',
  trustPanel: '신뢰도 패널',
  policyVersion: '정책 버전',
  lastVerified: '검증일',
  profileConfidence: '프로필 신뢰도',
  legalNotice: '법적 안내',
  emptyTitle: '아직 맞는 경로가 없습니다',
  emptyBody: '조건을 바꾸거나 사람 검토를 요청해 주세요.',
  errorTitle: '플래너 실행 실패',
};

const ja: PlannerCopy = {
  ...en,
  eyebrow: '韓国ビザプランナー',
  title: '韓国へ進む現実的なルートを確認',
  subtitle:
    '留学、就労、定住ルートをプロフィールに基づいて確認します。最初の結果はログイン不要です。',
  next: '次へ',
  back: '戻る',
  submit: 'ルートを確認',
  loginToSave: 'ログインして保存',
  saved: 'アカウントに保存済み',
  restart: 'もう一度',
};

const vi: PlannerCopy = {
  ...en,
  eyebrow: 'Công cụ lập kế hoạch visa Hàn Quốc',
  title: 'Tìm lộ trình thực tế để đến Hàn Quốc',
  subtitle:
    'Kiểm tra lộ trình học tập, làm việc và định cư dựa trên hồ sơ của bạn. Kết quả đầu tiên không cần đăng nhập.',
  next: 'Tiếp tục',
  back: 'Quay lại',
  submit: 'Kiểm tra lộ trình',
  loginToSave: 'Đăng nhập để lưu',
  saved: 'Đã lưu vào tài khoản',
  restart: 'Làm lại',
};

const th: PlannerCopy = {
  ...en,
  eyebrow: 'เครื่องมือวางแผนวีซ่าเกาหลี',
  title: 'ค้นหาเส้นทางที่เหมาะสมสู่เกาหลี',
  subtitle:
    'ตรวจสอบเส้นทางเรียน ทำงาน และพำนักจากโปรไฟล์ของคุณ ผลลัพธ์แรกไม่ต้องเข้าสู่ระบบ',
  next: 'ถัดไป',
  back: 'ย้อนกลับ',
  submit: 'ตรวจสอบเส้นทาง',
  loginToSave: 'เข้าสู่ระบบเพื่อบันทึก',
  saved: 'บันทึกในบัญชีแล้ว',
  restart: 'เริ่มใหม่',
};

const fil: PlannerCopy = {
  ...en,
  eyebrow: 'Korea Visa Planner',
  title: 'Hanapin ang praktikal na path mo papuntang Korea',
  subtitle:
    'Tingnan ang study, work, at settlement routes batay sa profile mo. Walang login para sa unang result.',
  next: 'Susunod',
  back: 'Bumalik',
  submit: 'I-check ang routes',
  loginToSave: 'Mag-log in para i-save',
  saved: 'Na-save sa account',
  restart: 'Ulitin',
};

export const plannerCopy: Record<PlannerLang, PlannerCopy> = {
  en,
  ko,
  vi,
  th,
  fil,
};

type LocalizedOption = {
  en: string;
  ko: string;
  vi: string;
  th: string;
  fil: string;
};

export const countries = [
  { code: 'VNM', flag: '🇻🇳', en: 'Vietnam', ko: '베트남', vi: 'Việt Nam', th: 'เวียดนาม', fil: 'Vietnam' },
  { code: 'PHL', flag: '🇵🇭', en: 'Philippines', ko: '필리핀', vi: 'Philippines', th: 'ฟิลิปปินส์', fil: 'Pilipinas' },
  { code: 'IDN', flag: '🇮🇩', en: 'Indonesia', ko: '인도네시아', vi: 'Indonesia', th: 'อินโดนีเซีย', fil: 'Indonesia' },
  { code: 'THA', flag: '🇹🇭', en: 'Thailand', ko: '태국', vi: 'Thái Lan', th: 'ไทย', fil: 'Thailand' },
  { code: 'NPL', flag: '🇳🇵', en: 'Nepal', ko: '네팔', vi: 'Nepal', th: 'เนปาล', fil: 'Nepal' },
  { code: 'UZB', flag: '🇺🇿', en: 'Uzbekistan', ko: '우즈베키스탄', vi: 'Uzbekistan', th: 'อุซเบกิสถาน', fil: 'Uzbekistan' },
  { code: 'MNG', flag: '🇲🇳', en: 'Mongolia', ko: '몽골', vi: 'Mông Cổ', th: 'มองโกเลีย', fil: 'Mongolia' },
  { code: 'CHN', flag: '🇨🇳', en: 'China', ko: '중국', vi: 'Trung Quốc', th: 'จีน', fil: 'Tsina' },
  { code: 'JPN', flag: '🇯🇵', en: 'Japan', ko: '일본', vi: 'Nhật Bản', th: 'ญี่ปุ่น', fil: 'Japan' },
  { code: 'USA', flag: '🇺🇸', en: 'United States', ko: '미국', vi: 'Hoa Kỳ', th: 'สหรัฐอเมริกา', fil: 'Estados Unidos' },
  { code: 'AND', flag: '🇦🇩', en: 'Andorra', ko: '안도라', vi: 'Andorra', th: 'อันดอร์รา', fil: 'Andorra' },
  { code: 'ARG', flag: '🇦🇷', en: 'Argentina', ko: '아르헨티나', vi: 'Argentina', th: 'อาร์เจนตินา', fil: 'Argentina' },
  { code: 'AUS', flag: '🇦🇺', en: 'Australia', ko: '호주', vi: 'Úc', th: 'ออสเตรเลีย', fil: 'Australia' },
  { code: 'AUT', flag: '🇦🇹', en: 'Austria', ko: '오스트리아', vi: 'Áo', th: 'ออสเตรีย', fil: 'Austria' },
  { code: 'BEL', flag: '🇧🇪', en: 'Belgium', ko: '벨기에', vi: 'Bỉ', th: 'เบลเยียม', fil: 'Belgium' },
  { code: 'BRA', flag: '🇧🇷', en: 'Brazil', ko: '브라질', vi: 'Brazil', th: 'บราซิล', fil: 'Brazil' },
  { code: 'CAN', flag: '🇨🇦', en: 'Canada', ko: '캐나다', vi: 'Canada', th: 'แคนาดา', fil: 'Canada' },
  { code: 'CHL', flag: '🇨🇱', en: 'Chile', ko: '칠레', vi: 'Chile', th: 'ชิลี', fil: 'Chile' },
  { code: 'CZE', flag: '🇨🇿', en: 'Czech Republic', ko: '체코', vi: 'Cộng hòa Séc', th: 'สาธารณรัฐเช็ก', fil: 'Czech Republic' },
  { code: 'DNK', flag: '🇩🇰', en: 'Denmark', ko: '덴마크', vi: 'Đan Mạch', th: 'เดนมาร์ก', fil: 'Denmark' },
  { code: 'FIN', flag: '🇫🇮', en: 'Finland', ko: '핀란드', vi: 'Phần Lan', th: 'ฟินแลนด์', fil: 'Finland' },
  { code: 'FRA', flag: '🇫🇷', en: 'France', ko: '프랑스', vi: 'Pháp', th: 'ฝรั่งเศส', fil: 'France' },
  { code: 'DEU', flag: '🇩🇪', en: 'Germany', ko: '독일', vi: 'Đức', th: 'เยอรมนี', fil: 'Germany' },
  { code: 'HKG', flag: '🇭🇰', en: 'Hong Kong', ko: '홍콩', vi: 'Hồng Kông', th: 'ฮ่องกง', fil: 'Hong Kong' },
  { code: 'HUN', flag: '🇭🇺', en: 'Hungary', ko: '헝가리', vi: 'Hungary', th: 'ฮังการี', fil: 'Hungary' },
  { code: 'IRL', flag: '🇮🇪', en: 'Ireland', ko: '아일랜드', vi: 'Ireland', th: 'ไอร์แลนด์', fil: 'Ireland' },
  { code: 'ISR', flag: '🇮🇱', en: 'Israel', ko: '이스라엘', vi: 'Israel', th: 'อิสราเอล', fil: 'Israel' },
  { code: 'ITA', flag: '🇮🇹', en: 'Italy', ko: '이탈리아', vi: 'Ý', th: 'อิตาลี', fil: 'Italy' },
  { code: 'LVA', flag: '🇱🇻', en: 'Latvia', ko: '라트비아', vi: 'Latvia', th: 'ลัตเวีย', fil: 'Latvia' },
  { code: 'LUX', flag: '🇱🇺', en: 'Luxembourg', ko: '룩셈부르크', vi: 'Luxembourg', th: 'ลักเซมเบิร์ก', fil: 'Luxembourg' },
  { code: 'NLD', flag: '🇳🇱', en: 'Netherlands', ko: '네덜란드', vi: 'Hà Lan', th: 'เนเธอร์แลนด์', fil: 'Netherlands' },
  { code: 'NZL', flag: '🇳🇿', en: 'New Zealand', ko: '뉴질랜드', vi: 'New Zealand', th: 'นิวซีแลนด์', fil: 'New Zealand' },
  { code: 'POL', flag: '🇵🇱', en: 'Poland', ko: '폴란드', vi: 'Ba Lan', th: 'โปแลนด์', fil: 'Poland' },
  { code: 'PRT', flag: '🇵🇹', en: 'Portugal', ko: '포르투갈', vi: 'Bồ Đào Nha', th: 'โปรตุเกส', fil: 'Portugal' },
  { code: 'ESP', flag: '🇪🇸', en: 'Spain', ko: '스페인', vi: 'Tây Ban Nha', th: 'สเปน', fil: 'Spain' },
  { code: 'SWE', flag: '🇸🇪', en: 'Sweden', ko: '스웨덴', vi: 'Thụy Điển', th: 'สวีเดน', fil: 'Sweden' },
  { code: 'TWN', flag: '🇹🇼', en: 'Taiwan', ko: '대만', vi: 'Đài Loan', th: 'ไต้หวัน', fil: 'Taiwan' },
  { code: 'GBR', flag: '🇬🇧', en: 'United Kingdom', ko: '영국', vi: 'Vương quốc Anh', th: 'สหราชอาณาจักร', fil: 'United Kingdom' },
  { code: 'IND', flag: '🇮🇳', en: 'India', ko: '인도', vi: 'Ấn Độ', th: 'อินเดีย', fil: 'India' },
  { code: 'KAZ', flag: '🇰🇿', en: 'Kazakhstan', ko: '카자흐스탄', vi: 'Kazakhstan', th: 'คาซัคสถาน', fil: 'Kazakhstan' },
  { code: 'RUS', flag: '🇷🇺', en: 'Russia', ko: '러시아', vi: 'Nga', th: 'รัสเซีย', fil: 'Russia' },
  { code: 'KHM', flag: '🇰🇭', en: 'Cambodia', ko: '캄보디아', vi: 'Campuchia', th: 'กัมพูชา', fil: 'Cambodia' },
  { code: 'MMR', flag: '🇲🇲', en: 'Myanmar', ko: '미얀마', vi: 'Myanmar', th: 'เมียนมา', fil: 'Myanmar' },
  { code: 'LKA', flag: '🇱🇰', en: 'Sri Lanka', ko: '스리랑카', vi: 'Sri Lanka', th: 'ศรีลังกา', fil: 'Sri Lanka' },
  { code: 'PAK', flag: '🇵🇰', en: 'Pakistan', ko: '파키스탄', vi: 'Pakistan', th: 'ปากีสถาน', fil: 'Pakistan' },
  { code: 'BGD', flag: '🇧🇩', en: 'Bangladesh', ko: '방글라데시', vi: 'Bangladesh', th: 'บังกลาเทศ', fil: 'Bangladesh' },
  { code: 'KGZ', flag: '🇰🇬', en: 'Kyrgyzstan', ko: '키르기스스탄', vi: 'Kyrgyzstan', th: 'คีร์กีซสถาน', fil: 'Kyrgyzstan' },
  { code: 'LAO', flag: '🇱🇦', en: 'Laos', ko: '라오스', vi: 'Lào', th: 'ลาว', fil: 'Laos' },
  { code: 'TJK', flag: '🇹🇯', en: 'Tajikistan', ko: '타지키스탄', vi: 'Tajikistan', th: 'ทาจิกิสถาน', fil: 'Tajikistan' },
  { code: 'TMP', flag: '🇹🇱', en: 'Timor-Leste', ko: '동티모르', vi: 'Đông Timor', th: 'ติมอร์-เลสเต', fil: 'Timor-Leste' },
];

export const educationOptions: Array<LocalizedOption & { value: string }> = [
  { value: 'high_school', en: 'High school', ko: '고등학교', vi: 'Trung học phổ thông', th: 'มัธยมปลาย', fil: 'High school' },
  { value: 'associate', en: 'Associate degree', ko: '전문학사', vi: 'Cao đẳng', th: 'อนุปริญญา', fil: 'Associate degree' },
  { value: 'bachelor', en: "Bachelor's degree", ko: '학사', vi: 'Cử nhân', th: 'ปริญญาตรี', fil: "Bachelor's degree" },
  { value: 'master', en: "Master's degree", ko: '석사', vi: 'Thạc sĩ', th: 'ปริญญาโท', fil: "Master's degree" },
  { value: 'doctor', en: 'Doctoral degree', ko: '박사', vi: 'Tiến sĩ', th: 'ปริญญาเอก', fil: 'Doctoral degree' },
  { value: 'middle', en: 'Middle school or below', ko: '중학교 이하', vi: 'Trung học cơ sở trở xuống', th: 'มัธยมต้นหรือต่ำกว่า', fil: 'Middle school o mas mababa' },
  { value: 'none', en: 'No formal education', ko: '학력 없음', vi: 'Không có bằng cấp chính quy', th: 'ไม่มีวุฒิการศึกษา', fil: 'Walang pormal na edukasyon' },
];

export const fundOptions = [
  { value: 100, en: 'Under 3M KRW', ko: '300만원 미만', vi: 'Dưới 3 triệu KRW', th: 'ต่ำกว่า 3 ล้าน KRW', fil: 'Mas mababa sa 3M KRW' },
  { value: 400, en: '3M-5M KRW', ko: '300만-500만원', vi: '3-5 triệu KRW', th: '3-5 ล้าน KRW', fil: '3M-5M KRW' },
  { value: 700, en: '5M-10M KRW', ko: '500만-1,000만원', vi: '5-10 triệu KRW', th: '5-10 ล้าน KRW', fil: '5M-10M KRW' },
  { value: 1500, en: '10M-20M KRW', ko: '1,000만-2,000만원', vi: '10-20 triệu KRW', th: '10-20 ล้าน KRW', fil: '10M-20M KRW' },
  { value: 2500, en: '20M-30M KRW', ko: '2,000만-3,000만원', vi: '20-30 triệu KRW', th: '20-30 ล้าน KRW', fil: '20M-30M KRW' },
  { value: 3500, en: '30M+ KRW', ko: '3,000만원 이상', vi: 'Từ 30 triệu KRW', th: '30 ล้าน KRW ขึ้นไป', fil: '30M+ KRW' },
];

export const goalOptions = [
  { value: 'employment', en: 'Work in Korea', ko: '한국에서 취업', vi: 'Làm việc tại Hàn Quốc', th: 'ทำงานในเกาหลี', fil: 'Magtrabaho sa Korea' },
  { value: 'degree', en: 'Study, then work', ko: '유학 후 취업', vi: 'Học rồi làm việc', th: 'เรียนแล้วทำงาน', fil: 'Mag-aral, pagkatapos ay magtrabaho' },
  { value: 'permanent_residence', en: 'Build a long-term life in Korea', ko: '장기 체류와 정착', vi: 'Xây dựng cuộc sống lâu dài tại Hàn Quốc', th: 'สร้างชีวิตระยะยาวในเกาหลี', fil: 'Manirahan nang pangmatagalan sa Korea' },
  { value: 'explore', en: 'Explore what is possible', ko: '가능한 선택지 탐색', vi: 'Tìm hiểu các lựa chọn', th: 'สำรวจทางเลือก', fil: 'Tingnan ang mga pagpipilian' },
];

export const priorityOptions = [
  { value: 'speed', en: 'Fast entry', ko: '빠른 입국', vi: 'Nhập cảnh nhanh', th: 'เข้าประเทศได้เร็ว', fil: 'Mas mabilis na pagpasok' },
  { value: 'stability', en: 'Stable route', ko: '안정적인 경로', vi: 'Lộ trình ổn định', th: 'เส้นทางที่มั่นคง', fil: 'Mas matatag na ruta' },
  { value: 'cost', en: 'Lower cost', ko: '준비 비용 절감', vi: 'Chi phí thấp hơn', th: 'ค่าใช้จ่ายต่ำกว่า', fil: 'Mas mababang gastos' },
  { value: 'income', en: 'Higher income potential', ko: '소득 가능성 높이기', vi: 'Tiềm năng thu nhập cao hơn', th: 'โอกาสรายได้สูงกว่า', fil: 'Mas mataas na potensyal na kita' },
];

export const majorCategories = [
  { value: 'tech', en: 'IT / Engineering', ko: 'IT / 공학', vi: 'CNTT / Kỹ thuật', th: 'IT / วิศวกรรม', fil: 'IT / Engineering' },
  { value: 'manufacturing', en: 'Manufacturing / Skilled trade', ko: '제조 / 기능직', vi: 'Sản xuất / Nghề kỹ thuật', th: 'การผลิต / งานช่าง', fil: 'Manufacturing / Skilled trade' },
  { value: 'hospitality', en: 'Hospitality / Service', ko: '숙박 / 서비스', vi: 'Khách sạn / Dịch vụ', th: 'โรงแรม / บริการ', fil: 'Hospitality / Service' },
  { value: 'business', en: 'Business / Management', ko: '경영 / 사무', vi: 'Kinh doanh / Quản lý', th: 'ธุรกิจ / บริหาร', fil: 'Business / Management' },
  { value: 'education', en: 'Education / Language', ko: '교육 / 언어', vi: 'Giáo dục / Ngôn ngữ', th: 'การศึกษา / ภาษา', fil: 'Education / Language' },
  { value: 'healthcare', en: 'Healthcare', ko: '보건 / 의료', vi: 'Y tế', th: 'สาธารณสุข', fil: 'Healthcare' },
  { value: 'other', en: 'Other', ko: '기타', vi: 'Khác', th: 'อื่นๆ', fil: 'Iba pa' },
];

export const difficultyTone: Record<PlannerDifficulty, string> = {
  easy: 'bg-sky-50 text-sky-700 border-sky-200',
  moderate: 'bg-sky-50 text-sky-700 border-sky-200',
  hard: 'bg-amber-50 text-amber-700 border-amber-200',
  expert_review: 'bg-rose-50 text-rose-700 border-rose-200',
};

export const signalLabels: Record<string, { en: string; ko: string }> = {
  education_match: { en: 'Your education supports this route', ko: '학력이 이 경로에 도움이 됩니다' },
  language_ready: { en: 'Your Korean level is helpful', ko: '한국어 능력이 이 경로에 도움이 됩니다' },
  fund_ready: { en: 'Your available funds support this route', ko: '준비 자금이 경로 조건에 맞습니다' },
  eps_country: { en: 'Your nationality may use the EPS process', ko: '국적에 따라 EPS 절차를 검토할 수 있습니다' },
  ethnic_korean_match: { en: 'Overseas Korean routes may be available', ko: '재외동포 경로를 검토할 수 있습니다' },
  fund_gap: { en: 'You may need stronger proof of funds', ko: '재정 증빙을 더 준비해야 할 수 있습니다' },
  topik_gap: { en: 'A higher TOPIK level would improve this route', ko: 'TOPIK 급수를 높이면 가능성이 좋아집니다' },
  degree_document_check: { en: 'Your degree documents must be confirmed', ko: '학위·졸업 서류 확인이 필요합니다' },
  career_evidence_needed: { en: 'You will need proof of relevant work experience', ko: '관련 경력을 증명할 서류가 필요합니다' },
  official_process_only: { en: 'Use the official application process only', ko: '반드시 공식 신청 절차를 이용해야 합니다' },
  points_must_be_verified: { en: 'Your points need a case-by-case check', ko: '개인별 점수 계산을 확인해야 합니다' },
  regional_quota_changes: { en: 'Regional places and conditions can change', ko: '지역별 인원과 조건은 바뀔 수 있습니다' },
  investment_document_review: { en: 'Investment and business documents need review', ko: '투자금과 사업 서류 검토가 필요합니다' },
  consular_scrutiny_possible: { en: 'The embassy may request additional evidence', ko: '공관에서 추가 증빙을 요청할 수 있습니다' },
  status_change_rules_must_be_checked: { en: 'Check whether status change is allowed in your case', ko: '현재 상황에서 체류자격 변경이 가능한지 확인해야 합니다' },
  policy_evidence_missing: { en: 'JobChaja must review and link the official policy evidence', ko: '잡차자가 최신 공식 정책 근거를 검토·연결해야 합니다' },
};

const translatedSignalLabels: Record<'vi' | 'th' | 'fil', Record<string, string>> = {
  vi: {
    education_match: 'Học vấn hỗ trợ việc so sánh này',
    language_ready: 'Trình độ tiếng Hàn hỗ trợ việc so sánh',
    fund_ready: 'Ngân sách hỗ trợ việc so sánh',
    eps_country: 'Hãy kiểm tra quy trình EPS chính thức',
    ethnic_korean_match: 'Hãy kiểm tra điều kiện chính thức cho người Hàn ở nước ngoài',
    fund_gap: 'Có thể cần thêm chứng minh tài chính',
    topik_gap: 'TOPIK cao hơn có thể giúp chuẩn bị tốt hơn',
    degree_document_check: 'Cần xác nhận giấy tờ bằng cấp',
    career_evidence_needed: 'Có thể cần chứng minh kinh nghiệm liên quan',
    official_process_only: 'Chỉ sử dụng quy trình chính thức',
    points_must_be_verified: 'Cần kiểm tra điểm riêng',
    regional_quota_changes: 'Chỉ tiêu và điều kiện có thể thay đổi',
    investment_document_review: 'Cần xem xét giấy tờ đầu tư',
    consular_scrutiny_possible: 'Cơ quan đại diện có thể yêu cầu thêm chứng cứ',
    status_change_rules_must_be_checked: 'Kiểm tra quy định hiện hành về chuyển đổi tư cách',
    policy_evidence_missing: 'JobChaja cần kiểm tra và liên kết căn cứ chính sách chính thức',
  },
  th: {
    education_match: 'วุฒิการศึกษาช่วยในการเปรียบเทียบนี้',
    language_ready: 'ระดับภาษาเกาหลีช่วยในการเปรียบเทียบ',
    fund_ready: 'เงินที่เตรียมไว้ช่วยในการเปรียบเทียบ',
    eps_country: 'ตรวจสอบกระบวนการ EPS ทางการ',
    ethnic_korean_match: 'ตรวจสอบเงื่อนไขทางการสำหรับชาวเกาหลีในต่างประเทศ',
    fund_gap: 'อาจต้องมีหลักฐานทางการเงินเพิ่ม',
    topik_gap: 'TOPIK ที่สูงขึ้นอาจช่วยในการเตรียมตัว',
    degree_document_check: 'ต้องตรวจสอบเอกสารวุฒิการศึกษา',
    career_evidence_needed: 'อาจต้องมีหลักฐานประสบการณ์ทำงาน',
    official_process_only: 'ใช้กระบวนการสมัครทางการเท่านั้น',
    points_must_be_verified: 'ต้องตรวจคะแนนเป็นรายกรณี',
    regional_quota_changes: 'จำนวนและเงื่อนไขอาจเปลี่ยนได้',
    investment_document_review: 'ต้องตรวจสอบเอกสารการลงทุน',
    consular_scrutiny_possible: 'สถานทูตอาจขอหลักฐานเพิ่ม',
    status_change_rules_must_be_checked: 'ตรวจสอบกฎปัจจุบันสำหรับการเปลี่ยนสถานะ',
    policy_evidence_missing: 'JobChaja ต้องตรวจสอบและเชื่อมโยงหลักฐานนโยบายทางการ',
  },
  fil: {
    education_match: 'Nakatutulong ang edukasyon mo sa paghahambing na ito',
    language_ready: 'Nakatutulong ang Korean level mo sa paghahambing',
    fund_ready: 'Nakatutulong ang pondo mo sa paghahambing',
    eps_country: 'Suriin ang opisyal na proseso ng EPS',
    ethnic_korean_match: 'Suriin ang opisyal na overseas Korean conditions',
    fund_gap: 'Maaaring kailangan ng mas matibay na patunay ng pondo',
    topik_gap: 'Maaaring makatulong ang mas mataas na TOPIK level',
    degree_document_check: 'Kailangang kumpirmahin ang degree documents',
    career_evidence_needed: 'Maaaring kailangan ang patunay ng work experience',
    official_process_only: 'Gamitin lamang ang opisyal na proseso',
    points_must_be_verified: 'Kailangang suriin ang points ayon sa kaso',
    regional_quota_changes: 'Maaaring magbago ang regional slots at conditions',
    investment_document_review: 'Kailangang suriin ang investment documents',
    consular_scrutiny_possible: 'Maaaring humingi ng dagdag na ebidensya ang overseas mission',
    status_change_rules_must_be_checked: 'Suriin ang kasalukuyang rules sa status change',
    policy_evidence_missing: 'Kailangang suriin at i-link ng JobChaja ang opisyal na policy evidence',
  },
};

export function localizedOptionLabel(option: LocalizedOption, lang: PlannerLang) {
  return option[lang] || option.en;
}

export function signalLabel(key: string, lang: PlannerLang) {
  const label = signalLabels[key];
  if (!label) return key.replaceAll('_', ' ');
  if (lang === 'ko') return label.ko;
  if (lang === 'vi' || lang === 'th' || lang === 'fil') {
    return translatedSignalLabels[lang][key] || label.en;
  }
  return label.en;
}
