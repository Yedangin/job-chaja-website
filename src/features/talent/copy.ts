import { INTL_LOCALE_MAP, type LaunchLocale } from '@/i18n/locales';

type TalentCopy = {
  common: {
    close: string;
    login: string;
    retry: string;
    previousPage: string;
    nextPage: string;
    page: (current: number, total: number) => string;
    bookmark: string;
    removeBookmark: string;
    checkBeforeView: string;
    details: string;
    cancel: string;
    view: string;
    searchTalents: string;
    noJob: string;
    noRegion: string;
    experience: (count: number) => string;
    topikAtLeast: (level: number) => string;
    koreanLevel: (topik: number | null, kiip: number | null) => string;
    creditBalance: (count: number | null) => string;
    remainingCredits: (count: number) => string;
    viewedOn: (date: string) => string;
  };
  errors: Record<401 | 402 | 403 | 404 | 409 | 500, string> & {
    network: string;
    fallback: string;
  };
  search: {
    title: string;
    subtitle: string;
    bookmarks: string;
    filters: string;
    nationality: string;
    korean: string;
    job: string;
    region: string;
    all: string;
    resultCount: (count: number) => string;
    empty: string;
    apply: string;
    confirmTitle: string;
    confirmBody: string;
    noCredits: string;
    checkCredits: string;
  };
  bookmarks: {
    title: string;
    subtitle: string;
    empty: string;
    confirmTitle: string;
    confirmBody: string;
  };
  viewed: {
    title: string;
    subtitle: string;
    emptyTitle: string;
    emptyBody: string;
    historyConflict: string;
  };
  detail: {
    title: string;
    subtitle: string;
    nationality: string;
    birthDate: string;
    korean: string;
    education: string;
    noEducation: string;
    work: string;
    noWork: string;
    jobs: string;
    regions: string;
  };
};

export const TALENT_COPY: Record<LaunchLocale, TalentCopy> = {
  ko: {
    common: {
      close: '닫기', login: '로그인', retry: '다시 시도', previousPage: '이전 페이지', nextPage: '다음 페이지',
      page: (current, total) => `${current} / ${total}`, bookmark: '북마크', removeBookmark: '북마크 해제',
      checkBeforeView: '열람 전 확인', details: '상세 보기', cancel: '취소', view: '열람', searchTalents: '인재 검색',
      noJob: '희망 직종 미입력', noRegion: '희망 지역 미입력', experience: (count) => `경력 ${count}건`,
      topikAtLeast: (level) => `TOPIK ${level}급 이상`, koreanLevel: (topik, kiip) => `TOPIK ${topik ?? '-'} · KIIP ${kiip ?? '-'}`,
      creditBalance: (count) => `잔여 ${count ?? '-'}건`, remainingCredits: (count) => `잔여 열람권 ${count}건`, viewedOn: (date) => `${date} 열람`,
    },
    errors: {
      401: '로그인이 필요합니다.', 402: '사용 가능한 열람권이 없습니다.', 403: '기업 인증이 승인된 계정만 인재채용관을 이용할 수 있습니다.',
      404: '구직자가 공개를 철회했거나 이력서가 더 이상 존재하지 않습니다.', 409: '요청 상태가 변경되었습니다. 목록을 새로고침해 주세요.',
      500: '인재채용관을 불러오지 못했습니다.', network: '네트워크 연결을 확인한 뒤 다시 시도해 주세요.', fallback: '요청을 처리하지 못했습니다.',
    },
    search: {
      title: '인재 검색', subtitle: '공개에 동의한 완성 이력서만 표시됩니다.', bookmarks: '북마크', filters: '필터', nationality: '국적', korean: '한국어', job: '희망 직종', region: '희망 지역', all: '전체',
      resultCount: (count) => `검색 결과 ${count}명`, empty: '조건에 맞는 공개 이력서가 없습니다.', apply: '적용', confirmTitle: '이력서 열람 확인',
      confirmBody: '열람권 1건을 사용해 상세 이력서를 엽니다. 같은 이력서는 다시 차감되지 않습니다.', noCredits: '사용 가능한 열람권이 없습니다.', checkCredits: '열람권 확인',
    },
    bookmarks: { title: '인재 북마크', subtitle: '현재도 공개 중인 이력서만 표시됩니다.', empty: '저장한 공개 이력서가 없습니다.', confirmTitle: '이력서 열람 확인', confirmBody: '열람권 1건을 사용합니다. 같은 이력서는 다시 차감되지 않습니다.' },
    viewed: { title: '최근 열람한 인재', subtitle: '열람 기록 중 현재도 공개 중인 이력서만 표시됩니다.', emptyTitle: '표시할 열람 기록이 없습니다.', emptyBody: '열람 이력 기능은 활성화되어 있으며, 공개가 유지되는 이력서만 여기에 나타납니다.', historyConflict: '기존 열람 기록을 확인할 수 없습니다.' },
    detail: { title: '이력서 상세', subtitle: '열람이 승인된 이력서 정보입니다.', nationality: '국적', birthDate: '생년월일', korean: '한국어', education: '학력', noEducation: '등록된 학력이 없습니다.', work: '경력', noWork: '등록된 경력이 없습니다.', jobs: '희망 직종', regions: '희망 지역' },
  },
  en: {
    common: {
      close: 'Close', login: 'Log in', retry: 'Try again', previousPage: 'Previous page', nextPage: 'Next page',
      page: (current, total) => `${current} / ${total}`, bookmark: 'Bookmark', removeBookmark: 'Remove bookmark',
      checkBeforeView: 'Check before viewing', details: 'View details', cancel: 'Cancel', view: 'View', searchTalents: 'Search talent',
      noJob: 'No preferred role', noRegion: 'No preferred region', experience: (count) => `${count} work record${count === 1 ? '' : 's'}`,
      topikAtLeast: (level) => `TOPIK level ${level}+`, koreanLevel: (topik, kiip) => `TOPIK ${topik ?? '-'} · KIIP ${kiip ?? '-'}`,
      creditBalance: (count) => `${count ?? '-'} credits left`, remainingCredits: (count) => `${count} viewing credits left`, viewedOn: (date) => `Viewed ${date}`,
    },
    errors: {
      401: 'Please log in.', 402: 'No viewing credits are available.', 403: 'Only approved corporate accounts can use the talent pool.',
      404: 'The worker withdrew disclosure or the resume is no longer available.', 409: 'The request state changed. Refresh the list and try again.',
      500: 'The talent pool could not be loaded.', network: 'Check your network connection and try again.', fallback: 'The request could not be completed.',
    },
    search: {
      title: 'Talent search', subtitle: 'Only complete resumes with active disclosure consent are shown.', bookmarks: 'Bookmarks', filters: 'Filters', nationality: 'Nationality', korean: 'Korean proficiency', job: 'Preferred role', region: 'Preferred region', all: 'All',
      resultCount: (count) => `${count} result${count === 1 ? '' : 's'}`, empty: 'No public resumes match these filters.', apply: 'Apply', confirmTitle: 'Confirm resume view',
      confirmBody: 'One viewing credit will be used to open the full resume. Viewing it again will not use another credit.', noCredits: 'No viewing credits are available.', checkCredits: 'Check credits',
    },
    bookmarks: { title: 'Talent bookmarks', subtitle: 'Only resumes that are still public are shown.', empty: 'No public resumes are bookmarked.', confirmTitle: 'Confirm resume view', confirmBody: 'One viewing credit will be used. Viewing the same resume again will not use another credit.' },
    viewed: { title: 'Recently viewed talent', subtitle: 'Only previously viewed resumes that are still public are shown.', emptyTitle: 'No viewing history to display.', emptyBody: 'Viewing history is active. Resumes appear here only while their disclosure remains active.', historyConflict: 'The previous viewing record could not be confirmed.' },
    detail: { title: 'Resume details', subtitle: 'This resume is available through an approved view.', nationality: 'Nationality', birthDate: 'Date of birth', korean: 'Korean proficiency', education: 'Education', noEducation: 'No education history provided.', work: 'Work experience', noWork: 'No work experience provided.', jobs: 'Preferred roles', regions: 'Preferred regions' },
  },
  vi: {
    common: {
      close: 'Đóng', login: 'Đăng nhập', retry: 'Thử lại', previousPage: 'Trang trước', nextPage: 'Trang sau',
      page: (current, total) => `${current} / ${total}`, bookmark: 'Lưu hồ sơ', removeBookmark: 'Bỏ lưu hồ sơ',
      checkBeforeView: 'Kiểm tra trước khi xem', details: 'Xem chi tiết', cancel: 'Hủy', view: 'Xem', searchTalents: 'Tìm ứng viên',
      noJob: 'Chưa nhập công việc mong muốn', noRegion: 'Chưa nhập khu vực mong muốn', experience: (count) => `${count} mục kinh nghiệm`,
      topikAtLeast: (level) => `TOPIK cấp ${level} trở lên`, koreanLevel: (topik, kiip) => `TOPIK ${topik ?? '-'} · KIIP ${kiip ?? '-'}`,
      creditBalance: (count) => `Còn ${count ?? '-'} lượt xem`, remainingCredits: (count) => `Còn ${count} lượt xem`, viewedOn: (date) => `Đã xem ${date}`,
    },
    errors: {
      401: 'Vui lòng đăng nhập.', 402: 'Không còn lượt xem hồ sơ.', 403: 'Chỉ tài khoản doanh nghiệp đã được phê duyệt mới có thể dùng kho ứng viên.',
      404: 'Ứng viên đã rút quyền công khai hoặc hồ sơ không còn tồn tại.', 409: 'Trạng thái yêu cầu đã thay đổi. Hãy tải lại danh sách.',
      500: 'Không thể tải kho ứng viên.', network: 'Hãy kiểm tra kết nối mạng rồi thử lại.', fallback: 'Không thể xử lý yêu cầu.',
    },
    search: {
      title: 'Tìm ứng viên', subtitle: 'Chỉ hiển thị hồ sơ hoàn chỉnh còn hiệu lực đồng ý công khai.', bookmarks: 'Hồ sơ đã lưu', filters: 'Bộ lọc', nationality: 'Quốc tịch', korean: 'Trình độ tiếng Hàn', job: 'Công việc mong muốn', region: 'Khu vực mong muốn', all: 'Tất cả',
      resultCount: (count) => `${count} kết quả`, empty: 'Không có hồ sơ công khai phù hợp.', apply: 'Áp dụng', confirmTitle: 'Xác nhận xem hồ sơ',
      confirmBody: 'Sử dụng 1 lượt xem để mở hồ sơ đầy đủ. Xem lại cùng hồ sơ sẽ không bị trừ thêm.', noCredits: 'Không còn lượt xem hồ sơ.', checkCredits: 'Kiểm tra lượt xem',
    },
    bookmarks: { title: 'Hồ sơ ứng viên đã lưu', subtitle: 'Chỉ hiển thị hồ sơ vẫn đang công khai.', empty: 'Chưa lưu hồ sơ công khai nào.', confirmTitle: 'Xác nhận xem hồ sơ', confirmBody: 'Sử dụng 1 lượt xem. Xem lại cùng hồ sơ sẽ không bị trừ thêm.' },
    viewed: { title: 'Ứng viên đã xem gần đây', subtitle: 'Chỉ hiển thị hồ sơ đã xem và vẫn đang công khai.', emptyTitle: 'Không có lịch sử xem để hiển thị.', emptyBody: 'Lịch sử xem đang hoạt động. Hồ sơ chỉ xuất hiện khi quyền công khai còn hiệu lực.', historyConflict: 'Không thể xác nhận lịch sử xem trước đó.' },
    detail: { title: 'Chi tiết hồ sơ', subtitle: 'Hồ sơ này đã được phép xem.', nationality: 'Quốc tịch', birthDate: 'Ngày sinh', korean: 'Trình độ tiếng Hàn', education: 'Học vấn', noEducation: 'Chưa cung cấp học vấn.', work: 'Kinh nghiệm làm việc', noWork: 'Chưa cung cấp kinh nghiệm làm việc.', jobs: 'Công việc mong muốn', regions: 'Khu vực mong muốn' },
  },
  th: {
    common: {
      close: 'ปิด', login: 'เข้าสู่ระบบ', retry: 'ลองอีกครั้ง', previousPage: 'หน้าก่อน', nextPage: 'หน้าถัดไป',
      page: (current, total) => `${current} / ${total}`, bookmark: 'บันทึก', removeBookmark: 'ยกเลิกการบันทึก',
      checkBeforeView: 'ตรวจสอบก่อนดู', details: 'ดูรายละเอียด', cancel: 'ยกเลิก', view: 'ดู', searchTalents: 'ค้นหาผู้สมัคร',
      noJob: 'ยังไม่ระบุงานที่ต้องการ', noRegion: 'ยังไม่ระบุพื้นที่ที่ต้องการ', experience: (count) => `ประสบการณ์ ${count} รายการ`,
      topikAtLeast: (level) => `TOPIK ระดับ ${level} ขึ้นไป`, koreanLevel: (topik, kiip) => `TOPIK ${topik ?? '-'} · KIIP ${kiip ?? '-'}`,
      creditBalance: (count) => `เหลือสิทธิ์ดู ${count ?? '-'} ครั้ง`, remainingCredits: (count) => `เหลือสิทธิ์ดู ${count} ครั้ง`, viewedOn: (date) => `ดูเมื่อ ${date}`,
    },
    errors: {
      401: 'กรุณาเข้าสู่ระบบ', 402: 'ไม่มีสิทธิ์ดูประวัติคงเหลือ', 403: 'เฉพาะบัญชีบริษัทที่ได้รับอนุมัติเท่านั้นที่ใช้คลังผู้สมัครได้',
      404: 'ผู้สมัครถอนการเปิดเผยหรือไม่มีเรซูเม่นี้แล้ว', 409: 'สถานะคำขอเปลี่ยนไปแล้ว กรุณารีเฟรชรายการ',
      500: 'ไม่สามารถโหลดคลังผู้สมัครได้', network: 'ตรวจสอบการเชื่อมต่อเครือข่ายแล้วลองอีกครั้ง', fallback: 'ไม่สามารถดำเนินการตามคำขอได้',
    },
    search: {
      title: 'ค้นหาผู้สมัคร', subtitle: 'แสดงเฉพาะเรซูเม่ที่สมบูรณ์และยังยินยอมเปิดเผยอยู่', bookmarks: 'ที่บันทึกไว้', filters: 'ตัวกรอง', nationality: 'สัญชาติ', korean: 'ระดับภาษาเกาหลี', job: 'งานที่ต้องการ', region: 'พื้นที่ที่ต้องการ', all: 'ทั้งหมด',
      resultCount: (count) => `${count} ผลลัพธ์`, empty: 'ไม่มีเรซูเม่สาธารณะที่ตรงกับตัวกรอง', apply: 'นำไปใช้', confirmTitle: 'ยืนยันการดูเรซูเม่',
      confirmBody: 'ใช้สิทธิ์ดู 1 ครั้งเพื่อเปิดเรซูเม่ฉบับเต็ม การดูเรซูเม่เดิมอีกครั้งจะไม่หักสิทธิ์เพิ่ม', noCredits: 'ไม่มีสิทธิ์ดูประวัติคงเหลือ', checkCredits: 'ตรวจสอบสิทธิ์ดู',
    },
    bookmarks: { title: 'ผู้สมัครที่บันทึกไว้', subtitle: 'แสดงเฉพาะเรซูเม่ที่ยังเปิดเผยอยู่', empty: 'ยังไม่มีเรซูเม่สาธารณะที่บันทึกไว้', confirmTitle: 'ยืนยันการดูเรซูเม่', confirmBody: 'ใช้สิทธิ์ดู 1 ครั้ง การดูเรซูเม่เดิมอีกครั้งจะไม่หักสิทธิ์เพิ่ม' },
    viewed: { title: 'ผู้สมัครที่ดูล่าสุด', subtitle: 'แสดงเฉพาะเรซูเม่ที่เคยดูและยังเปิดเผยอยู่', emptyTitle: 'ไม่มีประวัติการดูที่แสดงได้', emptyBody: 'ระบบประวัติการดูเปิดใช้งานแล้ว เรซูเม่จะแสดงเมื่อการยินยอมเปิดเผยยังมีผลเท่านั้น', historyConflict: 'ไม่สามารถยืนยันประวัติการดูก่อนหน้าได้' },
    detail: { title: 'รายละเอียดเรซูเม่', subtitle: 'เรซูเม่นี้ได้รับอนุญาตให้ดูแล้ว', nationality: 'สัญชาติ', birthDate: 'วันเกิด', korean: 'ระดับภาษาเกาหลี', education: 'การศึกษา', noEducation: 'ไม่ได้ระบุประวัติการศึกษา', work: 'ประสบการณ์ทำงาน', noWork: 'ไม่ได้ระบุประสบการณ์ทำงาน', jobs: 'งานที่ต้องการ', regions: 'พื้นที่ที่ต้องการ' },
  },
  fil: {
    common: {
      close: 'Isara', login: 'Mag-log in', retry: 'Subukan muli', previousPage: 'Nakaraang pahina', nextPage: 'Susunod na pahina',
      page: (current, total) => `${current} / ${total}`, bookmark: 'I-bookmark', removeBookmark: 'Alisin sa bookmark',
      checkBeforeView: 'Suriin bago tingnan', details: 'Tingnan ang detalye', cancel: 'Kanselahin', view: 'Tingnan', searchTalents: 'Maghanap ng kandidato',
      noJob: 'Walang gustong tungkulin', noRegion: 'Walang gustong lugar', experience: (count) => `${count} tala ng karanasan`,
      topikAtLeast: (level) => `TOPIK level ${level} pataas`, koreanLevel: (topik, kiip) => `TOPIK ${topik ?? '-'} · KIIP ${kiip ?? '-'}`,
      creditBalance: (count) => `${count ?? '-'} viewing credit ang natitira`, remainingCredits: (count) => `${count} viewing credit ang natitira`, viewedOn: (date) => `Tiningnan ${date}`,
    },
    errors: {
      401: 'Mag-log in muna.', 402: 'Walang viewing credit na magagamit.', 403: 'Aprubadong corporate account lamang ang maaaring gumamit ng talent pool.',
      404: 'Binawi ng aplikante ang disclosure o wala na ang resume.', 409: 'Nagbago ang estado ng request. I-refresh ang listahan.',
      500: 'Hindi ma-load ang talent pool.', network: 'Suriin ang network connection at subukan muli.', fallback: 'Hindi makumpleto ang request.',
    },
    search: {
      title: 'Maghanap ng kandidato', subtitle: 'Kumpletong resume na may aktibong pahintulot sa disclosure lamang ang ipinapakita.', bookmarks: 'Mga bookmark', filters: 'Mga filter', nationality: 'Nasyonalidad', korean: 'Kakayahan sa Korean', job: 'Gustong tungkulin', region: 'Gustong lugar', all: 'Lahat',
      resultCount: (count) => `${count} resulta`, empty: 'Walang public resume na tugma sa mga filter.', apply: 'Ilapat', confirmTitle: 'Kumpirmahin ang pagtingin',
      confirmBody: 'Gagamit ng 1 viewing credit para buksan ang buong resume. Walang dagdag na bawas kapag tiningnan muli ang parehong resume.', noCredits: 'Walang viewing credit na magagamit.', checkCredits: 'Tingnan ang credits',
    },
    bookmarks: { title: 'Mga naka-bookmark na kandidato', subtitle: 'Mga resume na public pa rin lamang ang ipinapakita.', empty: 'Wala pang naka-bookmark na public resume.', confirmTitle: 'Kumpirmahin ang pagtingin', confirmBody: 'Gagamit ng 1 viewing credit. Walang dagdag na bawas para sa parehong resume.' },
    viewed: { title: 'Mga kandidatong tiningnan kamakailan', subtitle: 'Mga dating tiningnan na resume na public pa rin lamang ang ipinapakita.', emptyTitle: 'Walang viewing history na maipapakita.', emptyBody: 'Aktibo ang viewing history. Lalabas lamang dito ang resume habang aktibo ang disclosure.', historyConflict: 'Hindi makumpirma ang dating viewing record.' },
    detail: { title: 'Detalye ng resume', subtitle: 'Available ang resume na ito sa aprubadong pagtingin.', nationality: 'Nasyonalidad', birthDate: 'Petsa ng kapanganakan', korean: 'Kakayahan sa Korean', education: 'Edukasyon', noEducation: 'Walang ibinigay na kasaysayan ng edukasyon.', work: 'Karanasan sa trabaho', noWork: 'Walang ibinigay na karanasan sa trabaho.', jobs: 'Gustong mga tungkulin', regions: 'Gustong mga lugar' },
  },
};

type LocalizedOption = {
  value: string;
  labels: Record<LaunchLocale, string>;
};

export const NATIONALITY_OPTIONS: LocalizedOption[] = [
  ['VN', '베트남', 'Vietnam', 'Việt Nam', 'เวียดนาม', 'Vietnam'],
  ['PH', '필리핀', 'Philippines', 'Philippines', 'ฟิลิปปินส์', 'Pilipinas'],
  ['TH', '태국', 'Thailand', 'Thái Lan', 'ไทย', 'Thailand'],
  ['ID', '인도네시아', 'Indonesia', 'Indonesia', 'อินโดนีเซีย', 'Indonesia'],
  ['CN', '중국', 'China', 'Trung Quốc', 'จีน', 'China'],
  ['KH', '캄보디아', 'Cambodia', 'Campuchia', 'กัมพูชา', 'Cambodia'],
  ['MM', '미얀마', 'Myanmar', 'Myanmar', 'เมียนมา', 'Myanmar'],
  ['NP', '네팔', 'Nepal', 'Nepal', 'เนปาล', 'Nepal'],
  ['UZ', '우즈베키스탄', 'Uzbekistan', 'Uzbekistan', 'อุซเบกิสถาน', 'Uzbekistan'],
  ['MN', '몽골', 'Mongolia', 'Mông Cổ', 'มองโกเลีย', 'Mongolia'],
].map(([value, koLabel, en, vi, th, fil]) => ({ value, labels: { ko: koLabel, en, vi, th, fil } }));

export const REGION_OPTIONS: LocalizedOption[] = [
  ['서울', '서울', 'Seoul', 'Seoul', 'โซล', 'Seoul'], ['경기', '경기', 'Gyeonggi', 'Gyeonggi', 'คยองกี', 'Gyeonggi'],
  ['인천', '인천', 'Incheon', 'Incheon', 'อินชอน', 'Incheon'], ['부산', '부산', 'Busan', 'Busan', 'ปูซาน', 'Busan'],
  ['대구', '대구', 'Daegu', 'Daegu', 'แทกู', 'Daegu'], ['광주', '광주', 'Gwangju', 'Gwangju', 'ควังจู', 'Gwangju'],
  ['대전', '대전', 'Daejeon', 'Daejeon', 'แทจอน', 'Daejeon'], ['울산', '울산', 'Ulsan', 'Ulsan', 'อุลซาน', 'Ulsan'],
  ['세종', '세종', 'Sejong', 'Sejong', 'เซจง', 'Sejong'], ['강원', '강원', 'Gangwon', 'Gangwon', 'คังวอน', 'Gangwon'],
  ['충북', '충북', 'North Chungcheong', 'Bắc Chungcheong', 'ชุงชองเหนือ', 'North Chungcheong'], ['충남', '충남', 'South Chungcheong', 'Nam Chungcheong', 'ชุงชองใต้', 'South Chungcheong'],
  ['전북', '전북', 'North Jeolla', 'Bắc Jeolla', 'ชอลลาเหนือ', 'North Jeolla'], ['전남', '전남', 'South Jeolla', 'Nam Jeolla', 'ชอลลาใต้', 'South Jeolla'],
  ['경북', '경북', 'North Gyeongsang', 'Bắc Gyeongsang', 'คยองซังเหนือ', 'North Gyeongsang'], ['경남', '경남', 'South Gyeongsang', 'Nam Gyeongsang', 'คยองซังใต้', 'South Gyeongsang'],
  ['제주', '제주', 'Jeju', 'Jeju', 'เชจู', 'Jeju'],
].map(([value, koLabel, en, vi, th, fil]) => ({ value, labels: { ko: koLabel, en, vi, th, fil } }));

export const JOB_OPTIONS: LocalizedOption[] = [
  ['제조/생산', '제조/생산', 'Manufacturing / Production', 'Sản xuất', 'การผลิต', 'Manufacturing / Production'],
  ['건설/토목', '건설/토목', 'Construction / Civil', 'Xây dựng', 'ก่อสร้าง / โยธา', 'Construction / Civil'],
  ['음식/서비스', '음식/서비스', 'Food / Service', 'Ẩm thực / Dịch vụ', 'อาหาร / บริการ', 'Food / Service'],
  ['농업/축산', '농업/축산', 'Agriculture / Livestock', 'Nông nghiệp / Chăn nuôi', 'เกษตร / ปศุสัตว์', 'Agriculture / Livestock'],
  ['IT/소프트웨어', 'IT/소프트웨어', 'IT / Software', 'IT / Phần mềm', 'IT / ซอฟต์แวร์', 'IT / Software'],
  ['사무/행정', '사무/행정', 'Office / Administration', 'Văn phòng / Hành chính', 'สำนักงาน / ธุรการ', 'Office / Administration'],
  ['판매/유통', '판매/유통', 'Sales / Distribution', 'Bán hàng / Phân phối', 'ขาย / จัดจำหน่าย', 'Sales / Distribution'],
  ['교육/강사', '교육/강사', 'Education / Instructor', 'Giáo dục / Giảng dạy', 'การศึกษา / ผู้สอน', 'Education / Instructor'],
  ['운송/물류', '운송/물류', 'Transport / Logistics', 'Vận tải / Logistics', 'ขนส่ง / โลจิสติกส์', 'Transport / Logistics'],
].map(([value, koLabel, en, vi, th, fil]) => ({ value, labels: { ko: koLabel, en, vi, th, fil } }));

export function optionLabel(options: LocalizedOption[], value: string, locale: LaunchLocale) {
  return options.find((option) => option.value === value)?.labels[locale] ?? value;
}

export function localizedList(options: LocalizedOption[], values: string[] | undefined, locale: LaunchLocale) {
  return values?.map((value) => optionLabel(options, value, locale)).join(', ') ?? '';
}

export function talentErrorMessage(error: unknown, copy: TalentCopy) {
  if (typeof error === 'object' && error && 'status' in error) {
    const status = Number((error as { status: unknown }).status);
    if (status === 401 || status === 402 || status === 403 || status === 404 || status === 409 || status === 500) return copy.errors[status];
  }
  if (error instanceof TypeError) return copy.errors.network;
  return copy.errors.fallback;
}

export function formatTalentDate(value: string, locale: LaunchLocale) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(INTL_LOCALE_MAP[locale], { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
}

export function formatTalentMonth(value: string, locale: LaunchLocale) {
  const date = new Date(value.length === 7 ? `${value}-01T00:00:00` : value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(INTL_LOCALE_MAP[locale], { year: 'numeric', month: 'short' }).format(date);
}
