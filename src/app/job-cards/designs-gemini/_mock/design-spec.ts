// 100개 Gemini 디자인 시안 기획서 / 100 Gemini Design Variant Specifications
// 클로드가 기획, 재미나이가 디자인 / Planned by Claude, Designed by Gemini

export interface DesignSpec {
  id: string; // g-001 ~ g-100
  name: string;
  nameEn: string;
  category: 'minimal' | 'premium' | 'creative' | 'platform' | 'interactive' | 'unique';
  references: string[]; // 1~3개 레퍼런스 / 1-3 references
  hoverEffect: string; // 마우스오버 효과 설명 / Hover effect description
  keyFeatures: string[]; // 핵심 디자인 요소 / Key design elements
  useImages: boolean; // 산업 이미지 사용 여부 / Whether to use industry images
  useLogos: boolean; // 회사 로고 사용 여부 / Whether to use company logos
}

export const designSpecs: DesignSpec[] = [
  // ============================================================
  // 단일 레퍼런스 (g-001 ~ g-030) / Single Reference
  // ============================================================

  // --- 미니멀 (Minimal) ---
  { id: 'g-001', name: '사람인 라이트', nameEn: 'Saramin Light', category: 'minimal', references: ['사람인'], hoverEffect: '카드 테두리 색상 변경 + 그림자 추가', keyFeatures: ['초경량 디자인', '텍스트 위주', '그레이 팔레트', '로고 소형 표시'], useImages: false, useLogos: true },
  { id: 'g-002', name: '잡코리아 라인', nameEn: 'JobKorea Line', category: 'minimal', references: ['잡코리아'], hoverEffect: '좌측 컬러 보더 확장', keyFeatures: ['라인형 카드', '좌측 산업 컬러 바', '한줄 요약'], useImages: false, useLogos: true },
  { id: 'g-003', name: '인크루트 테이블', nameEn: 'Incruit Table', category: 'minimal', references: ['인크루트'], hoverEffect: '행 배경색 하이라이트', keyFeatures: ['표 형태', '컬럼 정렬', '정렬 기능', '페이지네이션'], useImages: false, useLogos: true },
  { id: 'g-004', name: '리멤버 명함', nameEn: 'Remember Namecard', category: 'minimal', references: ['리멤버'], hoverEffect: '카드 뒤집기 효과 (3D)', keyFeatures: ['명함 사이즈', '앞면=회사정보', '뒷면=상세', '로고 중앙'], useImages: false, useLogos: true },
  { id: 'g-005', name: '토스 클린', nameEn: 'Toss Clean', category: 'minimal', references: ['토스'], hoverEffect: '스케일 업 + 그림자 확대', keyFeatures: ['숫자 중심', '큰 급여 표시', '토스 블루', '깔끔한 구분선'], useImages: false, useLogos: true },

  // --- 프리미엄 (Premium) ---
  { id: 'g-006', name: '원티드 엘레강스', nameEn: 'Wanted Elegance', category: 'premium', references: ['원티드'], hoverEffect: '골드 보더 + 반짝임 애니메이션', keyFeatures: ['로고 대형 표시', '프리미엄 골드 배지', '산업 이미지 상단'], useImages: true, useLogos: true },
  { id: 'g-007', name: '잡플래닛 신뢰', nameEn: 'JobPlanet Trust', category: 'premium', references: ['잡플래닛'], hoverEffect: '평점 별점 확대 + 디테일 패널', keyFeatures: ['기업 평점', '별점 표시', '리뷰 미리보기', '신뢰도 배지'], useImages: false, useLogos: true },
  { id: 'g-008', name: 'Glassdoor 인사이트', nameEn: 'Glassdoor Insight', category: 'premium', references: ['Glassdoor'], hoverEffect: '카드 확장 + 연봉 차트 노출', keyFeatures: ['연봉 그래프', '기업 평점', '면접 난이도', '추천율'], useImages: false, useLogos: true },
  { id: 'g-009', name: 'Indeed 심플', nameEn: 'Indeed Simple', category: 'premium', references: ['Indeed'], hoverEffect: '체크마크 표시 + 북마크 아이콘', keyFeatures: ['큰 제목', '급여 강조', '원클릭 지원', '저장 버튼'], useImages: false, useLogos: true },
  { id: 'g-010', name: 'AngelList 스타트업', nameEn: 'AngelList Startup', category: 'premium', references: ['AngelList'], hoverEffect: '네온 그린 보더 글로우', keyFeatures: ['스타트업 감성', '투자 라운드', '팀 크기', '기술 스택 태그'], useImages: false, useLogos: true },

  // --- 크리에이티브 (Creative) ---
  { id: 'g-011', name: '당근마켓 동네', nameEn: 'Karrot Local', category: 'creative', references: ['당근마켓'], hoverEffect: '거리 정보 표시 + 지도 핀 애니메이션', keyFeatures: ['동네 기반', '거리 표시', '주황색 강조', '따뜻한 톤'], useImages: true, useLogos: true },
  { id: 'g-012', name: '배민 플레이풀', nameEn: 'Baemin Playful', category: 'creative', references: ['배달의민족'], hoverEffect: '카드 흔들림 + 이모지 팝업', keyFeatures: ['배민 폰트 감성', '큰 이모지', '민트+블랙', '유머러스 문구'], useImages: true, useLogos: true },
  { id: 'g-013', name: 'Dribbble 아트', nameEn: 'Dribbble Art', category: 'creative', references: ['Dribbble'], hoverEffect: '좋아요 하트 애니메이션 + 카운트 업', keyFeatures: ['둥근 카드', '핑크 악센트', '크리에이터 스타일', '포트폴리오 느낌'], useImages: true, useLogos: false },
  { id: 'g-014', name: 'Behance 포트폴리오', nameEn: 'Behance Portfolio', category: 'creative', references: ['Behance'], hoverEffect: '이미지 줌 + 오버레이 정보', keyFeatures: ['이미지 히어로', '블루 악센트', '프로젝트 카드', '소유자 아바타'], useImages: true, useLogos: true },
  { id: 'g-015', name: 'Pinterest 핀', nameEn: 'Pinterest Pin', category: 'creative', references: ['Pinterest'], hoverEffect: '어둡게 + 저장 버튼 + 링크 표시', keyFeatures: ['메이슨리', '이미지 중심', '비율 다양', '핀 버튼'], useImages: true, useLogos: false },

  // --- 플랫폼 (Platform) ---
  { id: 'g-016', name: 'Spotify 뮤직', nameEn: 'Spotify Music', category: 'platform', references: ['Spotify'], hoverEffect: '재생 버튼 표시 + 그린 악센트', keyFeatures: ['다크 배경', '그린 포인트', '앨범 아트 = 산업이미지', '텍스트 애니메이션'], useImages: true, useLogos: true },
  { id: 'g-017', name: 'Uber 라이드', nameEn: 'Uber Ride', category: 'platform', references: ['Uber'], hoverEffect: '도착 시간 카운트다운 표시', keyFeatures: ['블랙+화이트', '미니맵', '예상 도착시간=마감일', '가격=급여'], useImages: false, useLogos: true },
  { id: 'g-018', name: 'Slack 메시지', nameEn: 'Slack Message', category: 'platform', references: ['Slack'], hoverEffect: '이모지 리액션 바 표시', keyFeatures: ['채널형 구조', '타임스탬프', '이모지 리액션', '스레드 카운트'], useImages: false, useLogos: true },
  { id: 'g-019', name: 'Discord 서버', nameEn: 'Discord Server', category: 'platform', references: ['Discord'], hoverEffect: '온라인 멤버 수 표시 + 참여 버튼', keyFeatures: ['다크 테마', '보라색 포인트', '서버 카드', '멤버 아바타'], useImages: false, useLogos: true },
  { id: 'g-020', name: 'Figma 컴포넌트', nameEn: 'Figma Component', category: 'platform', references: ['Figma'], hoverEffect: '선택 아웃라인 표시 (피그마 선택 스타일)', keyFeatures: ['4색 로고 컬러', '컴포넌트 프레임', '속성 패널', '레이어 구조'], useImages: false, useLogos: true },

  // --- 인터랙티브 (Interactive) ---
  { id: 'g-021', name: 'TikTok 피드', nameEn: 'TikTok Feed', category: 'interactive', references: ['TikTok'], hoverEffect: '자동 스크롤 텍스트 + 음악 노트 아이콘', keyFeatures: ['풀스크린 세로형', '좋아요/댓글/공유', '해시태그', '프로필 아바타'], useImages: true, useLogos: true },
  { id: 'g-022', name: '카카오톡 채팅', nameEn: 'KakaoTalk Chat', category: 'interactive', references: ['카카오톡'], hoverEffect: '읽음 표시 + 타이핑 인디케이터', keyFeatures: ['말풍선 형태', '노란 배경', '이모티콘', '시간 표시', '카카오 브라운'], useImages: false, useLogos: true },
  { id: 'g-023', name: 'Stripe 대시보드', nameEn: 'Stripe Dashboard', category: 'interactive', references: ['Stripe'], hoverEffect: '차트 툴팁 표시 + 데이터 하이라이트', keyFeatures: ['보라색 그라데이션', '클린 차트', '거래 내역 스타일', '통계 카드'], useImages: false, useLogos: true },
  { id: 'g-024', name: 'Airbnb 숙소', nameEn: 'Airbnb Stay', category: 'interactive', references: ['에어비앤비'], hoverEffect: '이미지 슬라이드 캐러셀 (여러 장)', keyFeatures: ['이미지 캐러셀', '별점', '슈퍼호스트 배지', '가격/박', '하트'], useImages: true, useLogos: true },
  { id: 'g-025', name: '네이버 쇼핑', nameEn: 'Naver Shopping', category: 'interactive', references: ['네이버'], hoverEffect: '찜 하트 채움 + 가격 비교 팝업', keyFeatures: ['녹색 포인트', '가격 비교', '리뷰 수', '무료배송 배지', '광고 표시'], useImages: true, useLogos: true },

  // --- 유니크 (Unique) ---
  { id: 'g-026', name: '블라인드 익명', nameEn: 'Blind Anonymous', category: 'unique', references: ['블라인드'], hoverEffect: '블러 해제 (기업명 일부 공개)', keyFeatures: ['익명 카드', '기업명 블러', '현직자 댓글', '연봉 범위'], useImages: false, useLogos: false },
  { id: 'g-027', name: '크몽 프리랜서', nameEn: 'Kmong Freelancer', category: 'unique', references: ['크몽'], hoverEffect: '가격 옵션 드롭다운 표시', keyFeatures: ['서비스 가격형', '패키지 3종', '평점', '배달 일수=마감일'], useImages: true, useLogos: false },
  { id: 'g-028', name: 'ZipRecruiter 매칭', nameEn: 'ZipRecruiter Match', category: 'unique', references: ['ZipRecruiter'], hoverEffect: '매칭 % 원형 게이지 채워짐', keyFeatures: ['매칭 점수 히어로', '그린 악센트', '원클릭 지원', '추천 배지'], useImages: false, useLogos: true },
  { id: 'g-029', name: '카카오뱅크 카드', nameEn: 'KakaoBank Card', category: 'unique', references: ['카카오뱅크'], hoverEffect: '카드 기울기 효과 (perspective)', keyFeatures: ['신용카드 형태', '노란+회색', '라운드 사각', '핵심 수치 3개'], useImages: false, useLogos: true },
  { id: 'g-030', name: '점핏 개발자', nameEn: 'Jumpit Dev', category: 'unique', references: ['점핏'], hoverEffect: '기술 스택 배지 확대', keyFeatures: ['기술 스택 중심', '그린 포인트', '경력 요구 강조', '개발자 타겟'], useImages: false, useLogos: true },

  // ============================================================
  // 2개 레퍼런스 조합 (g-031 ~ g-070) / Two-Reference Combos
  // ============================================================

  // --- 미니멀 콤보 ---
  { id: 'g-031', name: '사람인×토스', nameEn: 'Saramin×Toss', category: 'minimal', references: ['사람인', '토스'], hoverEffect: '급여 금액 카운트 업 애니메이션', keyFeatures: ['토스 숫자 강조 + 사람인 레이아웃', '깔끔한 구분선', '큰 급여'], useImages: false, useLogos: true },
  { id: 'g-032', name: '인크루트×리멤버', nameEn: 'Incruit×Remember', category: 'minimal', references: ['인크루트', '리멤버'], hoverEffect: '카드 슬라이드 확장 (상세 표시)', keyFeatures: ['테이블+명함 하이브리드', '접이식 상세', '로고 좌측'], useImages: false, useLogos: true },
  { id: 'g-033', name: '토스×Indeed', nameEn: 'Toss×Indeed', category: 'minimal', references: ['토스', 'Indeed'], hoverEffect: '원클릭 지원 버튼 슬라이드 인', keyFeatures: ['급여 히어로 + 원클릭 지원', '클린 레이아웃', '블루 CTA'], useImages: false, useLogos: true },

  // --- 프리미엄 콤보 ---
  { id: 'g-034', name: '원티드×Glassdoor', nameEn: 'Wanted×Glassdoor', category: 'premium', references: ['원티드', 'Glassdoor'], hoverEffect: '기업 평점 + 연봉 차트 동시 노출', keyFeatures: ['로고 + 평점 + 연봉 그래프', '프리미엄 배지', '신뢰도 스코어'], useImages: true, useLogos: true },
  { id: 'g-035', name: '잡코리아×잡플래닛', nameEn: 'JobKorea×JobPlanet', category: 'premium', references: ['잡코리아', '잡플래닛'], hoverEffect: '리뷰 미리보기 슬라이드', keyFeatures: ['그라데이션 헤더 + 기업 평점', '리뷰 한줄', '별점 바'], useImages: false, useLogos: true },
  { id: 'g-036', name: 'AngelList×Stripe', nameEn: 'AngelList×Stripe', category: 'premium', references: ['AngelList', 'Stripe'], hoverEffect: '데이터 시각화 확장', keyFeatures: ['스타트업 + 데이터 대시보드', '보라 그라데이션', '메트릭 카드'], useImages: false, useLogos: true },

  // --- 크리에이티브 콤보 ---
  { id: 'g-037', name: '배민×당근', nameEn: 'Baemin×Karrot', category: 'creative', references: ['배달의민족', '당근마켓'], hoverEffect: '이모지 비 효과 + 거리 표시', keyFeatures: ['플레이풀 + 로컬', '오렌지 톤', '동네 감성', '유머 카피'], useImages: true, useLogos: true },
  { id: 'g-038', name: 'Dribbble×Pinterest', nameEn: 'Dribbble×Pinterest', category: 'creative', references: ['Dribbble', 'Pinterest'], hoverEffect: '이미지 줌 + 핀 저장 버튼', keyFeatures: ['메이슨리 + 핑크', '이미지 중심', '크리에이티브 레이아웃'], useImages: true, useLogos: false },
  { id: 'g-039', name: 'Behance×Figma', nameEn: 'Behance×Figma', category: 'creative', references: ['Behance', 'Figma'], hoverEffect: '프레임 선택 아웃라인 + 줌', keyFeatures: ['포트폴리오 + 컴포넌트', '4색 악센트', '속성 패널'], useImages: true, useLogos: true },
  { id: 'g-040', name: 'Spotify×Discord', nameEn: 'Spotify×Discord', category: 'creative', references: ['Spotify', 'Discord'], hoverEffect: '재생 버튼 + 참여 버튼 동시', keyFeatures: ['다크 테마', '그린+보라', '뮤직 플레이어 UI', '멤버 리스트'], useImages: true, useLogos: true },
  { id: 'g-041', name: '카카오톡×배민', nameEn: 'KakaoTalk×Baemin', category: 'creative', references: ['카카오톡', '배달의민족'], hoverEffect: '말풍선 확장 + 이모티콘', keyFeatures: ['채팅 + 유머', '노란+민트', '말풍선 카드', '이모티콘 배지'], useImages: false, useLogos: true },
  { id: 'g-042', name: '네이버×당근', nameEn: 'Naver×Karrot', category: 'creative', references: ['네이버', '당근마켓'], hoverEffect: '찜 + 거리 정보 표시', keyFeatures: ['녹색+오렌지', '로컬 쇼핑', '가격 비교 + 동네'], useImages: true, useLogos: true },

  // --- 플랫폼 콤보 ---
  { id: 'g-043', name: 'Uber×토스', nameEn: 'Uber×Toss', category: 'platform', references: ['Uber', '토스'], hoverEffect: '카운트다운 + 금액 애니메이션', keyFeatures: ['블랙+블루', '도착시간 = 마감일', '금액 중심'], useImages: false, useLogos: true },
  { id: 'g-044', name: 'Slack×Discord', nameEn: 'Slack×Discord', category: 'platform', references: ['Slack', 'Discord'], hoverEffect: '리액션 이모지 바 + 멤버 표시', keyFeatures: ['채널+서버', '메시지형 카드', '이모지 리액션', '다크/라이트'], useImages: false, useLogos: true },
  { id: 'g-045', name: 'Notion×Figma', nameEn: 'Notion×Figma', category: 'platform', references: ['노션', 'Figma'], hoverEffect: '속성 편집 인라인 + 프레임 표시', keyFeatures: ['DB뷰 + 컴포넌트', '프로퍼티 라벨', '4색'], useImages: false, useLogos: true },
  { id: 'g-046', name: 'iOS×MD3', nameEn: 'iOS×MD3', category: 'platform', references: ['Apple iOS', 'Google MD3'], hoverEffect: '탭 전환 애니메이션 (세그먼트)', keyFeatures: ['시스템 UI 하이브리드', '둥근+토널', 'FAB+세그먼트'], useImages: false, useLogos: true },
  { id: 'g-047', name: 'LinkedIn×Indeed', nameEn: 'LinkedIn×Indeed', category: 'platform', references: ['링크드인', 'Indeed'], hoverEffect: '원클릭 지원 + 프로필 매칭 표시', keyFeatures: ['프로페셔널 + 간결', '블루 톤', '큰 지원 버튼'], useImages: false, useLogos: true },
  { id: 'g-048', name: 'Twitter×TikTok', nameEn: 'Twitter×TikTok', category: 'platform', references: ['트위터/X', 'TikTok'], hoverEffect: '좋아요+공유 카운트 업 + 자동스크롤', keyFeatures: ['소셜 피드', '인게이지먼트 메트릭', '해시태그'], useImages: true, useLogos: true },

  // --- 인터랙티브 콤보 ---
  { id: 'g-049', name: 'Airbnb×당근', nameEn: 'Airbnb×Karrot', category: 'interactive', references: ['에어비앤비', '당근마켓'], hoverEffect: '이미지 캐러셀 + 거리 표시', keyFeatures: ['숙소카드 + 로컬', '이미지 슬라이드', '별점+거리', '따뜻한 톤'], useImages: true, useLogos: true },
  { id: 'g-050', name: 'Netflix×Spotify', nameEn: 'Netflix×Spotify', category: 'interactive', references: ['넷플릭스', 'Spotify'], hoverEffect: '카드 확장 + 사운드 이퀄라이저 바', keyFeatures: ['다크 스트리밍', '자동 재생 느낌', '레드+그린 포인트'], useImages: true, useLogos: true },
  { id: 'g-051', name: '틴더×블라인드', nameEn: 'Tinder×Blind', category: 'interactive', references: ['틴더', '블라인드'], hoverEffect: '스와이프 제스처 + 블러 해제', keyFeatures: ['스와이프 + 익명', '매칭 카드', '블러 기업명', '좌우 스와이프'], useImages: false, useLogos: false },
  { id: 'g-052', name: '카카오톡×Stripe', nameEn: 'KakaoTalk×Stripe', category: 'interactive', references: ['카카오톡', 'Stripe'], hoverEffect: '말풍선 확장 + 결제 정보 슬라이드', keyFeatures: ['채팅형 + 대시보드', '노란+보라', '급여 차트 말풍선'], useImages: false, useLogos: true },
  { id: 'g-053', name: 'TikTok×인스타', nameEn: 'TikTok×Instagram', category: 'interactive', references: ['TikTok', '인스타그램'], hoverEffect: '릴스형 세로 스크롤 + 좋아요 더블탭', keyFeatures: ['숏폼 피드', '풀스크린', '좋아요/댓글/공유', '스토리'], useImages: true, useLogos: true },

  // --- 유니크 콤보 ---
  { id: 'g-054', name: '블라인드×잡플래닛', nameEn: 'Blind×JobPlanet', category: 'unique', references: ['블라인드', '잡플래닛'], hoverEffect: '블러 해제 + 별점 채워짐', keyFeatures: ['익명+평점', '현직자 리뷰', '기업 블라인드 평가'], useImages: false, useLogos: false },
  { id: 'g-055', name: '크몽×AngelList', nameEn: 'Kmong×AngelList', category: 'unique', references: ['크몽', 'AngelList'], hoverEffect: '패키지 가격 비교 슬라이드', keyFeatures: ['프리랜서+스타트업', '가격 패키지', '기술 스택'], useImages: true, useLogos: false },
  { id: 'g-056', name: '카카오뱅크×토스', nameEn: 'KakaoBank×Toss', category: 'unique', references: ['카카오뱅크', '토스'], hoverEffect: '카드 기울기 + 금액 카운트 업', keyFeatures: ['핀테크 카드형', '큰 숫자', '노란+블루', '미니멀 수치'], useImages: false, useLogos: true },
  { id: 'g-057', name: '점핏×ZipRecruiter', nameEn: 'Jumpit×ZipRecruiter', category: 'unique', references: ['점핏', 'ZipRecruiter'], hoverEffect: '매칭 점수 게이지 채움 + 스택 확대', keyFeatures: ['개발자+매칭', '기술 스택 매칭', '그린 포인트'], useImages: false, useLogos: true },
  { id: 'g-058', name: 'Uber×Airbnb', nameEn: 'Uber×Airbnb', category: 'unique', references: ['Uber', '에어비앤비'], hoverEffect: '미니맵 줌 + 이미지 슬라이드', keyFeatures: ['여행+라이드', '맵 + 이미지', '블랙+산호', '도착 시간'], useImages: true, useLogos: true },
  { id: 'g-059', name: '알바몬×알바천국', nameEn: 'Albamon×Alba', category: 'unique', references: ['알바몬', '알바천국'], hoverEffect: 'D-day 카운트다운 + 시급 비교', keyFeatures: ['알바 전문', 'D-day 히어로', '시급 강조', '빠른 지원'], useImages: false, useLogos: true },
  { id: 'g-060', name: 'Glassdoor×LinkedIn', nameEn: 'Glassdoor×LinkedIn', category: 'unique', references: ['Glassdoor', '링크드인'], hoverEffect: '프로필 매칭 + 연봉 비교', keyFeatures: ['프로페셔널+인사이트', '연봉 벤치마크', '매칭 %'], useImages: false, useLogos: true },

  // 추가 2개 조합들 ---
  { id: 'g-061', name: 'Notion×블라인드', nameEn: 'Notion×Blind', category: 'platform', references: ['노션', '블라인드'], hoverEffect: '블러 토글 + DB 필터 확장', keyFeatures: ['데이터베이스 + 익명', 'DB뷰에서 블러', '필터 조합'], useImages: false, useLogos: false },
  { id: 'g-062', name: 'Pinterest×Airbnb', nameEn: 'Pinterest×Airbnb', category: 'creative', references: ['Pinterest', '에어비앤비'], hoverEffect: '핀 + 이미지 캐러셀', keyFeatures: ['메이슨리 + 숙소카드', '이미지 중심', '저장+공유'], useImages: true, useLogos: true },
  { id: 'g-063', name: 'Figma×Stripe', nameEn: 'Figma×Stripe', category: 'premium', references: ['Figma', 'Stripe'], hoverEffect: '데이터 차트 + 컴포넌트 프레임', keyFeatures: ['디자인 시스템 + 결제', '4색+보라', '메트릭 위젯'], useImages: false, useLogos: true },
  { id: 'g-064', name: 'Spotify×카카오톡', nameEn: 'Spotify×KakaoTalk', category: 'creative', references: ['Spotify', '카카오톡'], hoverEffect: '재생바 + 말풍선 확장', keyFeatures: ['뮤직+채팅', '그린+노란', '플레이어 말풍선'], useImages: true, useLogos: true },
  { id: 'g-065', name: 'MD3×Stripe', nameEn: 'MD3×Stripe', category: 'platform', references: ['Google MD3', 'Stripe'], hoverEffect: 'FAB 확장 + 데이터 툴팁', keyFeatures: ['머티리얼+대시보드', '토널 서피스', '차트 위젯'], useImages: false, useLogos: true },
  { id: 'g-066', name: 'Discord×TikTok', nameEn: 'Discord×TikTok', category: 'interactive', references: ['Discord', 'TikTok'], hoverEffect: '멤버 온라인 + 숏폼 자동재생', keyFeatures: ['다크+숏폼', '보라+블랙', '서버 피드'], useImages: true, useLogos: true },
  { id: 'g-067', name: '네이버×잡코리아', nameEn: 'Naver×JobKorea', category: 'platform', references: ['네이버', '잡코리아'], hoverEffect: '검색 자동완성 + 그라데이션 헤더', keyFeatures: ['녹색+그라데이션', '검색 바 통합', 'AD 라벨'], useImages: false, useLogos: true },
  { id: 'g-068', name: '리멤버×점핏', nameEn: 'Remember×Jumpit', category: 'minimal', references: ['리멤버', '점핏'], hoverEffect: '명함 뒤집기 + 스택 배지 확대', keyFeatures: ['명함+개발자', '기술스택 명함', '깔끔한 뒷면'], useImages: false, useLogos: true },
  { id: 'g-069', name: 'Airbnb×Dribbble', nameEn: 'Airbnb×Dribbble', category: 'creative', references: ['에어비앤비', 'Dribbble'], hoverEffect: '이미지 캐러셀 + 하트 애니메이션', keyFeatures: ['이미지+크리에이티브', '별점+좋아요', '핑크+산호'], useImages: true, useLogos: true },
  { id: 'g-070', name: '알바몬×토스', nameEn: 'Albamon×Toss', category: 'unique', references: ['알바몬', '토스'], hoverEffect: 'D-day 카운트다운 + 시급 금액 카운트업', keyFeatures: ['D-day + 숫자 강조', '빨강+블루', '알바 전문 핀테크'], useImages: false, useLogos: true },

  // ============================================================
  // 3개 레퍼런스 조합 (g-071 ~ g-100) / Three-Reference Combos
  // ============================================================

  { id: 'g-071', name: '사람인×토스×Indeed', nameEn: 'Saramin×Toss×Indeed', category: 'minimal', references: ['사람인', '토스', 'Indeed'], hoverEffect: '급여 카운트업 + 원클릭 지원 슬라이드', keyFeatures: ['3사 미니멀 합체', '큰 급여', '원클릭', '그레이 팔레트'], useImages: false, useLogos: true },
  { id: 'g-072', name: '원티드×Glassdoor×잡플래닛', nameEn: 'Wanted×Glassdoor×JobPlanet', category: 'premium', references: ['원티드', 'Glassdoor', '잡플래닛'], hoverEffect: '로고 확대 + 평점 차트 + 리뷰 슬라이드', keyFeatures: ['3대 평가 합체', '로고+별점+그래프', '신뢰도 종합'], useImages: true, useLogos: true },
  { id: 'g-073', name: '배민×당근×카카오톡', nameEn: 'Baemin×Karrot×KakaoTalk', category: 'creative', references: ['배달의민족', '당근마켓', '카카오톡'], hoverEffect: '이모지+거리+말풍선 동시 효과', keyFeatures: ['한국 3대 앱 합체', '오렌지+노란', '로컬+유머+채팅'], useImages: true, useLogos: true },
  { id: 'g-074', name: 'Spotify×Netflix×Discord', nameEn: 'Spotify×Netflix×Discord', category: 'creative', references: ['Spotify', '넷플릭스', 'Discord'], hoverEffect: '재생+확장+멤버 복합 효과', keyFeatures: ['3대 스트리밍 합체', '다크 테마', '그린+레드+보라'], useImages: true, useLogos: true },
  { id: 'g-075', name: 'Notion×Figma×Stripe', nameEn: 'Notion×Figma×Stripe', category: 'platform', references: ['노션', 'Figma', 'Stripe'], hoverEffect: 'DB 필터 + 프레임 + 차트 복합', keyFeatures: ['3대 SaaS 합체', '프로퍼티+4색+보라', 'DB+디자인+대시보드'], useImages: false, useLogos: true },
  { id: 'g-076', name: 'iOS×MD3×토스', nameEn: 'iOS×MD3×Toss', category: 'platform', references: ['Apple iOS', 'Google MD3', '토스'], hoverEffect: '세그먼트 전환 + FAB + 금액 카운트', keyFeatures: ['3대 UI 프레임워크', '시스템 UI+토널+숫자'], useImages: false, useLogos: true },
  { id: 'g-077', name: 'LinkedIn×Indeed×Glassdoor', nameEn: 'LinkedIn×Indeed×Glassdoor', category: 'premium', references: ['링크드인', 'Indeed', 'Glassdoor'], hoverEffect: '프로필 매칭+원클릭+연봉차트', keyFeatures: ['3대 글로벌 채용', '블루 톤', '프로페셔널 종합'], useImages: false, useLogos: true },
  { id: 'g-078', name: 'Airbnb×Pinterest×Dribbble', nameEn: 'Airbnb×Pinterest×Dribbble', category: 'creative', references: ['에어비앤비', 'Pinterest', 'Dribbble'], hoverEffect: '캐러셀+핀+하트 복합', keyFeatures: ['3대 비주얼 플랫폼', '이미지 히어로', '메이슨리+슬라이드'], useImages: true, useLogos: true },
  { id: 'g-079', name: '블라인드×잡플래닛×점핏', nameEn: 'Blind×JobPlanet×Jumpit', category: 'unique', references: ['블라인드', '잡플래닛', '점핏'], hoverEffect: '블러해제+별점+스택배지 연쇄', keyFeatures: ['한국 3대 평가 합체', '익명+평점+기술', '종합 기업 카드'], useImages: false, useLogos: false },
  { id: 'g-080', name: '카카오뱅크×토스×Stripe', nameEn: 'KakaoBank×Toss×Stripe', category: 'unique', references: ['카카오뱅크', '토스', 'Stripe'], hoverEffect: '카드기울기+카운트업+차트 복합', keyFeatures: ['3대 핀테크 합체', '노란+블루+보라', '금융 카드형'], useImages: false, useLogos: true },

  { id: 'g-081', name: 'TikTok×인스타×트위터', nameEn: 'TikTok×Insta×Twitter', category: 'interactive', references: ['TikTok', '인스타그램', '트위터/X'], hoverEffect: '릴스+스토리+트윗 복합 피드', keyFeatures: ['3대 소셜 합체', '숏폼+피드+트윗', '인게이지먼트 종합'], useImages: true, useLogos: true },
  { id: 'g-082', name: '당근×Uber×Airbnb', nameEn: 'Karrot×Uber×Airbnb', category: 'interactive', references: ['당근마켓', 'Uber', '에어비앤비'], hoverEffect: '거리+카운트다운+캐러셀 복합', keyFeatures: ['로컬+이동+숙박', '맵 통합', '오렌지+블랙+산호'], useImages: true, useLogos: true },
  { id: 'g-083', name: 'Slack×카카오톡×Discord', nameEn: 'Slack×KakaoTalk×Discord', category: 'platform', references: ['Slack', '카카오톡', 'Discord'], hoverEffect: '리액션+타이핑+멤버 복합', keyFeatures: ['3대 메신저 합체', '채널+말풍선+서버', '컬러풀'], useImages: false, useLogos: true },
  { id: 'g-084', name: '알바몬×사람인×인크루트', nameEn: 'Albamon×Saramin×Incruit', category: 'minimal', references: ['알바몬', '사람인', '인크루트'], hoverEffect: 'D-day+보더+행 하이라이트 복합', keyFeatures: ['한국 3대 채용 합체', 'D-day+미니멀+테이블', '전통 UI 개선'], useImages: false, useLogos: true },
  { id: 'g-085', name: '네이버×카카오톡×토스', nameEn: 'Naver×KakaoTalk×Toss', category: 'creative', references: ['네이버', '카카오톡', '토스'], hoverEffect: '찜+말풍선+카운트업 복합', keyFeatures: ['한국 3대 앱 합체', '녹색+노란+블루', '슈퍼앱 카드'], useImages: true, useLogos: true },
  { id: 'g-086', name: 'Behance×Figma×Dribbble', nameEn: 'Behance×Figma×Dribbble', category: 'creative', references: ['Behance', 'Figma', 'Dribbble'], hoverEffect: '줌+프레임+하트 복합', keyFeatures: ['3대 디자인 합체', '크리에이티브 카드', '이미지+프레임+핑크'], useImages: true, useLogos: false },
  { id: 'g-087', name: 'ZipRecruiter×Indeed×LinkedIn', nameEn: 'ZipRecruiter×Indeed×LinkedIn', category: 'premium', references: ['ZipRecruiter', 'Indeed', '링크드인'], hoverEffect: '매칭게이지+원클릭+프로필 복합', keyFeatures: ['글로벌 채용 올인원', '매칭+지원+프로필', '블루+그린'], useImages: false, useLogos: true },
  { id: 'g-088', name: '크몽×AngelList×점핏', nameEn: 'Kmong×AngelList×Jumpit', category: 'unique', references: ['크몽', 'AngelList', '점핏'], hoverEffect: '패키지+네온+스택 복합', keyFeatures: ['프리랜서+스타트업+개발자', '기술 매칭 서비스'], useImages: true, useLogos: false },
  { id: 'g-089', name: '원티드×토스×Figma', nameEn: 'Wanted×Toss×Figma', category: 'premium', references: ['원티드', '토스', 'Figma'], hoverEffect: '골드+카운트+프레임 복합', keyFeatures: ['프리미엄+숫자+디자인', '로고+급여+4색'], useImages: true, useLogos: true },
  { id: 'g-090', name: '잡코리아×알바몬×당근', nameEn: 'JobKorea×Albamon×Karrot', category: 'creative', references: ['잡코리아', '알바몬', '당근마켓'], hoverEffect: '그라데이션+D-day+거리 복합', keyFeatures: ['한국 채용+로컬', '그라데이션+카운트다운+동네'], useImages: true, useLogos: true },

  { id: 'g-091', name: 'Airbnb×Spotify×TikTok', nameEn: 'Airbnb×Spotify×TikTok', category: 'interactive', references: ['에어비앤비', 'Spotify', 'TikTok'], hoverEffect: '캐러셀+이퀄라이저+자동스크롤', keyFeatures: ['엔터테인먼트 통합', '이미지+사운드+숏폼'], useImages: true, useLogos: true },
  { id: 'g-092', name: 'Netflix×블라인드×Glassdoor', nameEn: 'Netflix×Blind×Glassdoor', category: 'unique', references: ['넷플릭스', '블라인드', 'Glassdoor'], hoverEffect: '확장+블러해제+차트 복합', keyFeatures: ['스트리밍+익명+인사이트', '다크+블러+그래프'], useImages: true, useLogos: false },
  { id: 'g-093', name: 'Uber×Stripe×카카오뱅크', nameEn: 'Uber×Stripe×KakaoBank', category: 'unique', references: ['Uber', 'Stripe', '카카오뱅크'], hoverEffect: '맵+차트+카드기울기 복합', keyFeatures: ['이동+결제+금융', '블랙+보라+노란'], useImages: false, useLogos: true },
  { id: 'g-094', name: 'Pinterest×배민×카카오톡', nameEn: 'Pinterest×Baemin×KakaoTalk', category: 'creative', references: ['Pinterest', '배달의민족', '카카오톡'], hoverEffect: '핀+이모지+말풍선 복합', keyFeatures: ['비주얼+유머+채팅', '이미지+이모지+말풍선'], useImages: true, useLogos: true },
  { id: 'g-095', name: 'Discord×점핏×AngelList', nameEn: 'Discord×Jumpit×AngelList', category: 'platform', references: ['Discord', '점핏', 'AngelList'], hoverEffect: '서버참여+스택+투자 복합', keyFeatures: ['커뮤니티+개발자+스타트업', '보라+그린+네온'], useImages: false, useLogos: true },
  { id: 'g-096', name: '잡플래닛×리멤버×인크루트', nameEn: 'JobPlanet×Remember×Incruit', category: 'minimal', references: ['잡플래닛', '리멤버', '인크루트'], hoverEffect: '별점+뒤집기+행 하이라이트', keyFeatures: ['한국 평가+명함+테이블', '평점 명함 리스트'], useImages: false, useLogos: true },
  { id: 'g-097', name: 'Figma×iOS×Discord', nameEn: 'Figma×iOS×Discord', category: 'platform', references: ['Figma', 'Apple iOS', 'Discord'], hoverEffect: '프레임+세그먼트+서버 복합', keyFeatures: ['디자인+시스템+커뮤니티', '4색+시스템블루+보라'], useImages: false, useLogos: true },
  { id: 'g-098', name: 'Dribbble×TikTok×배민', nameEn: 'Dribbble×TikTok×Baemin', category: 'creative', references: ['Dribbble', 'TikTok', '배달의민족'], hoverEffect: '하트+자동스크롤+이모지 복합', keyFeatures: ['크리에이티브+숏폼+유머', '핑크+블랙+민트'], useImages: true, useLogos: false },
  { id: 'g-099', name: 'Glassdoor×Stripe×Notion', nameEn: 'Glassdoor×Stripe×Notion', category: 'premium', references: ['Glassdoor', 'Stripe', '노션'], hoverEffect: '차트+대시보드+DB필터 복합', keyFeatures: ['인사이트+결제+데이터', '차트+위젯+프로퍼티'], useImages: false, useLogos: true },
  { id: 'g-100', name: '잡차자 올인원', nameEn: 'JobChaja All-in-One', category: 'premium', references: ['잡차자', '토스', '원티드'], hoverEffect: '비자매칭 게이지 + 로고확대 + 금액 카운트업', keyFeatures: ['잡차자 최종 시안', '비자매칭 히어로', '로고+급여+매칭점수', '종합 프리미엄'], useImages: true, useLogos: true },
];

// 카테고리별 통계 / Category statistics
export const categoryStats = {
  minimal: designSpecs.filter(d => d.category === 'minimal').length,
  premium: designSpecs.filter(d => d.category === 'premium').length,
  creative: designSpecs.filter(d => d.category === 'creative').length,
  platform: designSpecs.filter(d => d.category === 'platform').length,
  interactive: designSpecs.filter(d => d.category === 'interactive').length,
  unique: designSpecs.filter(d => d.category === 'unique').length,
};

// 레퍼런스 수별 통계 / Reference count statistics
export const refStats = {
  single: designSpecs.filter(d => d.references.length === 1).length,
  double: designSpecs.filter(d => d.references.length === 2).length,
  triple: designSpecs.filter(d => d.references.length === 3).length,
};
