/**
 * E-7 비자 매칭 직종 목록 (90개)
 * E-7 visa matching job categories (90 items)
 *
 * 법무부 고시 기준 E-7 비자 허용 직종 (2026.01 기준)
 * Based on Ministry of Justice designated E-7 visa occupations (as of Jan 2026)
 */

export interface E7JobCategory {
  code: string;           // 법무부 직종 코드 (Ministry occupation code)
  nameKo: string;         // 한글 명칭 (Korean name)
  nameEn: string;         // 영문 명칭 (English name)
  e7Type: 'E-7-1' | 'E-7-2' | 'E-7-3'; // E-7 서브타입 (E-7 subtype)
  categoryGroup: string;  // 카테고리 그룹 (Category group)
}

/**
 * E-7 매칭 직종 90개 (2026.01 기준)
 * 90 E-7 matching occupations (as of Jan 2026)
 */
export const E7_JOB_CATEGORIES: E7JobCategory[] = [
  // ========================================
  // E-7-1 전문인력 (67개)
  // E-7-1 Professional Personnel (67 occupations)
  // ========================================

  // ========== 관리자 (15개) / Managers (15) ==========
  { code: 'S110', nameKo: '경제이익단체 고위임원', nameEn: 'Senior Executive of Economic Interest Group', e7Type: 'E-7-1', categoryGroup: '관리자' },
  { code: '1120', nameKo: '기업 고위임원', nameEn: 'Senior Corporate Executive', e7Type: 'E-7-1', categoryGroup: '관리자' },
  { code: '1212', nameKo: '경영지원 관리자', nameEn: 'Management Support Manager', e7Type: 'E-7-1', categoryGroup: '관리자' },
  { code: '1312', nameKo: '교육 관리자', nameEn: 'Education Manager', e7Type: 'E-7-1', categoryGroup: '관리자' },
  { code: '1320', nameKo: '보험 및 금융관리자', nameEn: 'Insurance and Finance Manager', e7Type: 'E-7-1', categoryGroup: '관리자' },
  { code: '1340', nameKo: '문화·예술·디자인 및 영상관련 관리자', nameEn: 'Culture, Arts, Design and Media Manager', e7Type: 'E-7-1', categoryGroup: '관리자' },
  { code: '1350', nameKo: '정보통신관련 관리자', nameEn: 'IT and Communications Manager', e7Type: 'E-7-1', categoryGroup: '관리자' },
  { code: '1390', nameKo: '기타 전문서비스 관리자', nameEn: 'Other Professional Services Manager', e7Type: 'E-7-1', categoryGroup: '관리자' },
  { code: '1411', nameKo: '건설 및 광업 관련 관리자', nameEn: 'Construction and Mining Manager', e7Type: 'E-7-1', categoryGroup: '관리자' },
  { code: '1413', nameKo: '제품 생산관련 관리자', nameEn: 'Product Manufacturing Manager', e7Type: 'E-7-1', categoryGroup: '관리자' },
  { code: '1490', nameKo: '농림·어업관련 관리자', nameEn: 'Agriculture, Forestry and Fisheries Manager', e7Type: 'E-7-1', categoryGroup: '관리자' },
  { code: '1511', nameKo: '영업 및 판매 관련 관리자', nameEn: 'Sales and Marketing Manager', e7Type: 'E-7-1', categoryGroup: '관리자' },
  { code: '1512', nameKo: '운송관련 관리자', nameEn: 'Transportation Manager', e7Type: 'E-7-1', categoryGroup: '관리자' },
  { code: '1521', nameKo: '숙박·여행·오락 및 스포츠 관련 관리자', nameEn: 'Accommodation, Travel, Entertainment and Sports Manager', e7Type: 'E-7-1', categoryGroup: '관리자' },
  { code: '1522', nameKo: '음식서비스관련 관리자', nameEn: 'Food Service Manager', e7Type: 'E-7-1', categoryGroup: '관리자' },

  // ========== 전문가 및 관련종사자 (52개) / Professionals and Related Workers (52) ==========
  { code: '2111', nameKo: '생명과학 전문가', nameEn: 'Life Science Professional', e7Type: 'E-7-1', categoryGroup: '전문가' },
  { code: '2112', nameKo: '자연과학 전문가', nameEn: 'Natural Science Professional', e7Type: 'E-7-1', categoryGroup: '전문가' },
  { code: '2122', nameKo: '사회과학 연구원', nameEn: 'Social Science Researcher', e7Type: 'E-7-1', categoryGroup: '전문가' },
  { code: '2211', nameKo: '컴퓨터 하드웨어 기술자', nameEn: 'Computer Hardware Engineer', e7Type: 'E-7-1', categoryGroup: '전문가' },
  { code: '2212', nameKo: '통신공학 기술자', nameEn: 'Communications Engineer', e7Type: 'E-7-1', categoryGroup: '전문가' },
  { code: '2221', nameKo: '컴퓨터시스템 설계 및 분석가', nameEn: 'Computer System Designer and Analyst', e7Type: 'E-7-1', categoryGroup: '전문가' },
  { code: '2222', nameKo: '시스템 소프트웨어 개발자', nameEn: 'System Software Developer', e7Type: 'E-7-1', categoryGroup: '전문가' },
  { code: '2223', nameKo: '응용 소프트웨어 개발자', nameEn: 'Application Software Developer', e7Type: 'E-7-1', categoryGroup: '전문가' },
  { code: '2224', nameKo: '웹 개발자', nameEn: 'Web Developer', e7Type: 'E-7-1', categoryGroup: '전문가' },
  { code: '2231', nameKo: '데이터 전문가', nameEn: 'Data Specialist', e7Type: 'E-7-1', categoryGroup: '전문가' },
  { code: '2232', nameKo: '네트워크시스템 개발자', nameEn: 'Network System Developer', e7Type: 'E-7-1', categoryGroup: '전문가' },
  { code: '2233', nameKo: '정보 보안 전문가', nameEn: 'Information Security Specialist', e7Type: 'E-7-1', categoryGroup: '전문가' },
  { code: '2311', nameKo: '건축가', nameEn: 'Architect', e7Type: 'E-7-1', categoryGroup: '전문가' },
  { code: '2312', nameKo: '건축공학 기술자', nameEn: 'Architectural Engineer', e7Type: 'E-7-1', categoryGroup: '전문가' },
  { code: '2313', nameKo: '토목공학 전문가', nameEn: 'Civil Engineer', e7Type: 'E-7-1', categoryGroup: '전문가' },
  { code: '2314', nameKo: '조경 기술자', nameEn: 'Landscape Architect', e7Type: 'E-7-1', categoryGroup: '전문가' },
  { code: '2315', nameKo: '도시 및 교통관련 전문가', nameEn: 'Urban and Transportation Planner', e7Type: 'E-7-1', categoryGroup: '전문가' },
  { code: '2321', nameKo: '화학공학 기술자', nameEn: 'Chemical Engineer', e7Type: 'E-7-1', categoryGroup: '전문가' },
  { code: '2331', nameKo: '금속·재료 공학 기술자', nameEn: 'Metal and Materials Engineer', e7Type: 'E-7-1', categoryGroup: '전문가' },
  { code: '2341', nameKo: '전기공학 기술자', nameEn: 'Electrical Engineer', e7Type: 'E-7-1', categoryGroup: '전문가' },
  { code: '2342', nameKo: '전자공학 기술자', nameEn: 'Electronics Engineer', e7Type: 'E-7-1', categoryGroup: '전문가' },
  { code: '2351', nameKo: '기계공학 기술자', nameEn: 'Mechanical Engineer', e7Type: 'E-7-1', categoryGroup: '전문가' },
  { code: '23512', nameKo: '플랜트공학 기술자', nameEn: 'Plant Engineer', e7Type: 'E-7-1', categoryGroup: '전문가' },
  { code: '2352', nameKo: '로봇공학 전문가', nameEn: 'Robotics Specialist', e7Type: 'E-7-1', categoryGroup: '전문가' },
  { code: 'S2353', nameKo: '자동차·조선·비행기·철도차량공학 전문가', nameEn: 'Automotive, Shipbuilding, Aircraft and Railway Engineer', e7Type: 'E-7-1', categoryGroup: '전문가' },
  { code: '2364', nameKo: '산업안전 및 위험 전문가', nameEn: 'Occupational Safety and Health Specialist', e7Type: 'E-7-1', categoryGroup: '전문가' },
  { code: '2371', nameKo: '환경공학 기술자', nameEn: 'Environmental Engineer', e7Type: 'E-7-1', categoryGroup: '전문가' },
  { code: '2372', nameKo: '가스·에너지 기술자', nameEn: 'Gas and Energy Engineer', e7Type: 'E-7-1', categoryGroup: '전문가' },
  { code: '2392', nameKo: '섬유공학 기술자', nameEn: 'Textile Engineer', e7Type: 'E-7-1', categoryGroup: '전문가' },
  { code: '2395', nameKo: '제도사', nameEn: 'Drafting Technician', e7Type: 'E-7-1', categoryGroup: '전문가' },
  { code: '2430', nameKo: '간호사', nameEn: 'Nurse', e7Type: 'E-7-1', categoryGroup: '전문가' },
  { code: '2512', nameKo: '대학 강사', nameEn: 'University Lecturer', e7Type: 'E-7-1', categoryGroup: '전문가' },
  { code: '2543', nameKo: '해외기술전문학교 기술강사', nameEn: 'Overseas Technical School Instructor', e7Type: 'E-7-1', categoryGroup: '전문가' },
  { code: '2591', nameKo: '교육관련 전문가', nameEn: 'Education Professional', e7Type: 'E-7-1', categoryGroup: '전문가' },
  { code: '2599', nameKo: '외국인학교·국제학교 등의 교사', nameEn: 'Teacher at Foreign/International School', e7Type: 'E-7-1', categoryGroup: '전문가' },
  { code: '261', nameKo: '법률 전문가', nameEn: 'Legal Professional', e7Type: 'E-7-1', categoryGroup: '전문가' },
  { code: '2620', nameKo: '정부 및 공공 행정 전문가', nameEn: 'Government and Public Administration Professional', e7Type: 'E-7-1', categoryGroup: '전문가' },
  { code: 'S2620', nameKo: '특수기관 행정요원', nameEn: 'Special Agency Administrator', e7Type: 'E-7-1', categoryGroup: '전문가' },
  { code: '2715', nameKo: '경영 및 진단 전문가', nameEn: 'Management and Business Consultant', e7Type: 'E-7-1', categoryGroup: '전문가' },
  { code: '272', nameKo: '금융 및 보험 전문가', nameEn: 'Finance and Insurance Professional', e7Type: 'E-7-1', categoryGroup: '전문가' },
  { code: '2731', nameKo: '상품기획 전문가', nameEn: 'Product Planner', e7Type: 'E-7-1', categoryGroup: '전문가' },
  { code: '2732', nameKo: '여행상품 개발자', nameEn: 'Travel Product Developer', e7Type: 'E-7-1', categoryGroup: '전문가' },
  { code: '2733', nameKo: '광고 및 홍보 전문가', nameEn: 'Advertising and PR Specialist', e7Type: 'E-7-1', categoryGroup: '전문가' },
  { code: '2734', nameKo: '조사 전문가', nameEn: 'Research Specialist', e7Type: 'E-7-1', categoryGroup: '전문가' },
  { code: '2735', nameKo: '행사 기획자', nameEn: 'Event Planner', e7Type: 'E-7-1', categoryGroup: '전문가' },
  { code: '2742', nameKo: '해외 영업원', nameEn: 'Overseas Sales Representative', e7Type: 'E-7-1', categoryGroup: '전문가' },
  { code: '2743', nameKo: '기술 영업원', nameEn: 'Technical Sales Representative', e7Type: 'E-7-1', categoryGroup: '전문가' },
  { code: 'S2743', nameKo: '기술경영 전문가', nameEn: 'Technology Management Specialist', e7Type: 'E-7-1', categoryGroup: '전문가' },
  { code: '2814', nameKo: '번역가·통역가', nameEn: 'Translator/Interpreter', e7Type: 'E-7-1', categoryGroup: '전문가' },
  { code: '28331', nameKo: '아나운서', nameEn: 'Announcer', e7Type: 'E-7-1', categoryGroup: '전문가' },
  { code: '285', nameKo: '디자이너', nameEn: 'Designer', e7Type: 'E-7-1', categoryGroup: '전문가' },
  { code: 'S2855', nameKo: '영상관련 디자이너', nameEn: 'Media Designer', e7Type: 'E-7-1', categoryGroup: '전문가' },

  // ========================================
  // E-7-2 준전문인력 (10개)
  // E-7-2 Semi-Professional Personnel (10 occupations)
  // ========================================

  // ========== 사무종사자 (5개) / Office Workers (5) ==========
  { code: '31215', nameKo: '면세점/제주영어교육도시 내 판매 사무원', nameEn: 'Duty-Free/Jeju Global Education City Sales Clerk', e7Type: 'E-7-2', categoryGroup: '사무종사자' },
  { code: '31264', nameKo: '항공운송 사무원', nameEn: 'Air Transport Clerk', e7Type: 'E-7-2', categoryGroup: '사무종사자' },
  { code: '3922', nameKo: '호텔 접수 사무원', nameEn: 'Hotel Receptionist', e7Type: 'E-7-2', categoryGroup: '사무종사자' },
  { code: 'S3922', nameKo: '의료 코디네이터', nameEn: 'Medical Coordinator', e7Type: 'E-7-2', categoryGroup: '사무종사자' },
  { code: '3991', nameKo: '고객상담 사무원', nameEn: 'Customer Service Representative', e7Type: 'E-7-2', categoryGroup: '사무종사자' },

  // ========== 서비스종사자 (5개) / Service Workers (5) ==========
  { code: '431', nameKo: '운송 서비스 종사자 (선박·비행기 승무원)', nameEn: 'Transportation Service Worker (Ship/Aircraft Crew)', e7Type: 'E-7-2', categoryGroup: '서비스종사자' },
  { code: '4321', nameKo: '관광 통역 안내원', nameEn: 'Tour Guide Interpreter', e7Type: 'E-7-2', categoryGroup: '서비스종사자' },
  { code: '4329', nameKo: '카지노 딜러', nameEn: 'Casino Dealer', e7Type: 'E-7-2', categoryGroup: '서비스종사자' },
  { code: '441', nameKo: '주방장 및 조리사', nameEn: 'Chef and Cook', e7Type: 'E-7-2', categoryGroup: '서비스종사자' },
  { code: '42111', nameKo: '요양보호사', nameEn: 'Care Worker', e7Type: 'E-7-2', categoryGroup: '서비스종사자' },

  // ========================================
  // E-7-3 일반기능인력 (13개)
  // E-7-3 General Skilled Workers (13 occupations)
  // ========================================
  { code: '6139', nameKo: '동물 사육사', nameEn: 'Animal Breeder', e7Type: 'E-7-3', categoryGroup: '기능인력' },
  { code: '6301', nameKo: '양식 기술자', nameEn: 'Aquaculture Technician', e7Type: 'E-7-3', categoryGroup: '기능인력' },
  { code: '7103', nameKo: '할랄 도축원', nameEn: 'Halal Slaughterer', e7Type: 'E-7-3', categoryGroup: '기능인력' },
  { code: '7303', nameKo: '악기 제조 및 조율사', nameEn: 'Musical Instrument Maker and Tuner', e7Type: 'E-7-3', categoryGroup: '기능인력' },
  { code: '7430', nameKo: '조선 용접공', nameEn: 'Shipbuilding Welder', e7Type: 'E-7-3', categoryGroup: '기능인력' },
  { code: '76212', nameKo: '선박 전기원', nameEn: 'Marine Electrician', e7Type: 'E-7-3', categoryGroup: '기능인력' },
  { code: '7836', nameKo: '선박 도장공', nameEn: 'Marine Painter', e7Type: 'E-7-3', categoryGroup: '기능인력' },
  { code: '7521', nameKo: '항공기 정비원', nameEn: 'Aircraft Maintenance Technician', e7Type: 'E-7-3', categoryGroup: '기능인력' },
  { code: 'S8417', nameKo: '항공기(부품) 제조원', nameEn: 'Aircraft (Parts) Manufacturer', e7Type: 'E-7-3', categoryGroup: '기능인력' },
  { code: '76231', nameKo: '송전 전기원', nameEn: 'Transmission Electrician', e7Type: 'E-7-3', categoryGroup: '기능인력' },
  { code: 'S8541', nameKo: '자동차 부품제조원', nameEn: 'Auto Parts Manufacturer', e7Type: 'E-7-3', categoryGroup: '기능인력' },
  { code: 'S75104', nameKo: '자동차 판금도장원', nameEn: 'Auto Body Repair and Paint Technician', e7Type: 'E-7-3', categoryGroup: '기능인력' },
  { code: 'S71032', nameKo: '도축원', nameEn: 'Slaughterer', e7Type: 'E-7-3', categoryGroup: '기능인력' },
];

/**
 * 직종 코드로 E-7 타입 조회
 * Get E-7 type by job code
 */
export function getE7TypeByJobCode(jobCode: string): 'E-7-1' | 'E-7-2' | 'E-7-3' | null {
  const job = E7_JOB_CATEGORIES.find((j) => j.code === jobCode);
  return job ? job.e7Type : null;
}

/**
 * E-7 타입별 허용 직종 코드 목록 조회
 * Get allowed job codes by E-7 type
 */
export function getAllowedJobCodesByE7Type(e7Type: 'E-7-1' | 'E-7-2' | 'E-7-3'): string[] {
  return E7_JOB_CATEGORIES.filter((j) => j.e7Type === e7Type).map((j) => j.code);
}

/**
 * 카테고리 그룹별 직종 목록 조회
 * Get job categories by group
 */
export function getJobCategoriesByGroup(): Record<string, E7JobCategory[]> {
  const groups: Record<string, E7JobCategory[]> = {};
  E7_JOB_CATEGORIES.forEach((job) => {
    if (!groups[job.categoryGroup]) {
      groups[job.categoryGroup] = [];
    }
    groups[job.categoryGroup].push(job);
  });
  return groups;
}

/**
 * 전체 직종 수 통계
 * Total occupation statistics
 */
export const E7_STATS = {
  'E-7-1': E7_JOB_CATEGORIES.filter((j) => j.e7Type === 'E-7-1').length, // 67개
  'E-7-2': E7_JOB_CATEGORIES.filter((j) => j.e7Type === 'E-7-2').length, // 10개
  'E-7-3': E7_JOB_CATEGORIES.filter((j) => j.e7Type === 'E-7-3').length, // 13개
  total: E7_JOB_CATEGORIES.length, // 90개
};

// OTHER category for F-visa holders (not E-7 eligible occupations)
export const OTHER_CATEGORY: E7JobCategory = {
  code: 'OTHER',
  nameKo: '기타 (E-7 비해당 직종)',
  nameEn: 'Other (Non-E-7 Occupation)',
  e7Type: 'E-7-1', // Will be filtered out by backend, only for F-visas
  categoryGroup: '기타',
};

// Append OTHER category to the list
E7_JOB_CATEGORIES.push(OTHER_CATEGORY);
