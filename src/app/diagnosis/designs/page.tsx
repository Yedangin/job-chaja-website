'use client';

// KOR: 비자 진단 디자인 갤러리 — 100개 시안 인덱스 페이지
// ENG: Visa Diagnosis Design Gallery — 100 Designs Index Page

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MessageCircle,
  FileText,
  Gamepad2,
  BarChart3,
  Plane,
  GraduationCap,
  Users,
  ShoppingCart,
  Palette,
  Rocket,
  Search,
  Grid3X3,
  List,
  Star,
} from 'lucide-react';

// KOR: 카테고리 정의 / ENG: Category definitions
const categories = [
  { id: 'all', name: '전체', nameEn: 'All', icon: Grid3X3, color: 'bg-gray-500' },
  { id: 'chat', name: '대화형', nameEn: 'Conversational', icon: MessageCircle, color: 'bg-blue-500', range: [1, 10] },
  { id: 'form', name: '폼/위자드', nameEn: 'Form & Wizard', icon: FileText, color: 'bg-indigo-500', range: [11, 20] },
  { id: 'game', name: '게임/인터랙티브', nameEn: 'Gamified', icon: Gamepad2, color: 'bg-purple-500', range: [21, 30] },
  { id: 'dashboard', name: '대시보드/분석', nameEn: 'Dashboard', icon: BarChart3, color: 'bg-emerald-500', range: [31, 40] },
  { id: 'travel', name: '여행/탐색', nameEn: 'Travel', icon: Plane, color: 'bg-sky-500', range: [41, 50] },
  { id: 'edu', name: '교육/학습', nameEn: 'Education', icon: GraduationCap, color: 'bg-amber-500', range: [51, 60] },
  { id: 'social', name: '소셜/커뮤니티', nameEn: 'Social', icon: Users, color: 'bg-pink-500', range: [61, 70] },
  { id: 'shop', name: '쇼핑/커머스', nameEn: 'Shopping', icon: ShoppingCart, color: 'bg-orange-500', range: [71, 80] },
  { id: 'art', name: '크리에이티브', nameEn: 'Creative', icon: Palette, color: 'bg-rose-500', range: [81, 90] },
  { id: 'future', name: '미래/혁신', nameEn: 'Futuristic', icon: Rocket, color: 'bg-cyan-500', range: [91, 100] },
];

// KOR: 100개 디자인 목록 / ENG: 100 design entries
const designs: Array<{
  id: number;
  name: string;
  nameEn: string;
  colorTheme: string;
  references: string[];
}> = [
  { id: 1, name: '친구처럼 대화', nameEn: 'Friendly Chat', colorTheme: '화이트+블루', references: ['ChatGPT', 'Intercom'] },
  { id: 2, name: '음성 인터뷰', nameEn: 'Voice Interview', colorTheme: '다크+네온 퍼플', references: ['Siri', 'Google Assistant'] },
  { id: 3, name: 'AI 상담사', nameEn: 'AI Counselor', colorTheme: '네이비+골드', references: ['Calendly', 'Zoom'] },
  { id: 4, name: '스토리 대화', nameEn: 'Story Dialogue', colorTheme: '핑크~퍼플', references: ['Instagram Stories', 'TikTok'] },
  { id: 5, name: '메신저 봇', nameEn: 'Messenger Bot', colorTheme: '카카오 옐로우', references: ['KakaoTalk', 'LINE'] },
  { id: 6, name: '터미널 CLI', nameEn: 'Terminal CLI', colorTheme: '다크+그린', references: ['Vercel', 'Warp'] },
  { id: 7, name: 'SMS 문자', nameEn: 'SMS Thread', colorTheme: 'iOS 블루', references: ['iMessage', 'Signal'] },
  { id: 8, name: '이메일 스레드', nameEn: 'Email Thread', colorTheme: '화이트+레드', references: ['Gmail', 'Outlook'] },
  { id: 9, name: 'RPG 대화', nameEn: 'RPG Dialogue', colorTheme: '다크 판타지+골드', references: ['Genshin Impact', 'FF'] },
  { id: 10, name: '인터뷰 영상', nameEn: 'Video Interview', colorTheme: '블랙+블루', references: ['HireVue', 'Zoom'] },
  { id: 11, name: '원페이지 폼', nameEn: 'One-Page Form', colorTheme: '화이트+인디고', references: ['Stripe', 'Linear'] },
  { id: 12, name: '카드 위자드', nameEn: 'Card Wizard', colorTheme: '코랄+웜 화이트', references: ['Airbnb', 'Booking'] },
  { id: 13, name: '타임라인 폼', nameEn: 'Timeline Form', colorTheme: '화이트+그린', references: ['Asana', 'Jira'] },
  { id: 14, name: '슬라이더 폼', nameEn: 'Slider Form', colorTheme: '다크+그린', references: ['Spotify', 'Figma'] },
  { id: 15, name: '모바일 퍼스트', nameEn: 'Mobile-First Steps', colorTheme: '토스 블루', references: ['Toss', 'Revolut'] },
  { id: 16, name: '설문조사', nameEn: 'Survey Style', colorTheme: '화이트+블루', references: ['Typeform', 'Google Forms'] },
  { id: 17, name: '체크리스트', nameEn: 'Checklist', colorTheme: '레드+화이트', references: ['Todoist', 'Things 3'] },
  { id: 18, name: '마인드맵', nameEn: 'Mind Map Input', colorTheme: '캔버스+컬러풀', references: ['Miro', 'FigJam'] },
  { id: 19, name: '캘린더 기반', nameEn: 'Calendar Based', colorTheme: '화이트+구글 블루', references: ['Google Calendar', 'Calendly'] },
  { id: 20, name: '프로필 빌더', nameEn: 'Profile Builder', colorTheme: 'LinkedIn 블루', references: ['LinkedIn', 'Dribbble'] },
  { id: 21, name: '퀴즈쇼', nameEn: 'Quiz Show', colorTheme: '퍼플+옐로우', references: ['Kahoot', 'Duolingo'] },
  { id: 22, name: 'RPG 캐릭터', nameEn: 'RPG Character', colorTheme: '다크+오렌지', references: ['Diablo', 'WoW'] },
  { id: 23, name: '보드게임', nameEn: 'Board Game', colorTheme: '파스텔+우드', references: ['Monopoly', 'Catan'] },
  { id: 24, name: '타로 카드', nameEn: 'Tarot Card', colorTheme: '네이비+골드', references: ['Co-Star', 'Sanctuary'] },
  { id: 25, name: '미로 탈출', nameEn: 'Maze Runner', colorTheme: '파스텔+골드', references: ['Monument Valley', 'Journey'] },
  { id: 26, name: '슬롯머신', nameEn: 'Slot Machine', colorTheme: '골드+레드', references: ['Coinbase', 'Robinhood'] },
  { id: 27, name: '퍼즐 맞추기', nameEn: 'Puzzle Piece', colorTheme: '화이트+멀티', references: ['Canva', 'Figma'] },
  { id: 28, name: '레이싱 트랙', nameEn: 'Racing Track', colorTheme: '블랙+레드', references: ['F1', 'Mario Kart'] },
  { id: 29, name: '탐험 지도', nameEn: 'Explorer Map', colorTheme: '세피아+네이비', references: ['Google Maps', 'Strava'] },
  { id: 30, name: '우주 탐사', nameEn: 'Space Explorer', colorTheme: '다크+네온 시안', references: ['SpaceX', 'NASA'] },
  { id: 31, name: '금융 대시보드', nameEn: 'Finance Dashboard', colorTheme: '다크+그린', references: ['Bloomberg', 'TradingView'] },
  { id: 32, name: '건강 진단서', nameEn: 'Health Report', colorTheme: '화이트+헬스', references: ['Apple Health', 'Fitbit'] },
  { id: 33, name: 'CRM 파이프라인', nameEn: 'CRM Pipeline', colorTheme: '화이트+블루', references: ['Salesforce', 'HubSpot'] },
  { id: 34, name: '코드 에디터', nameEn: 'Code Editor', colorTheme: '다크+블루', references: ['VS Code', 'GitHub'] },
  { id: 35, name: '프로젝트 관리', nameEn: 'Project Manager', colorTheme: '화이트+퍼플', references: ['Linear', 'Notion'] },
  { id: 36, name: 'CI/CD', nameEn: 'CI/CD Pipeline', colorTheme: '다크+그린', references: ['GitHub Actions', 'Vercel'] },
  { id: 37, name: '데이터 시각화', nameEn: 'Data Visualization', colorTheme: '다크+비비드', references: ['Tableau', 'Grafana'] },
  { id: 38, name: '신용 점수', nameEn: 'Credit Score', colorTheme: '그린+화이트', references: ['Credit Karma', 'NerdWallet'] },
  { id: 39, name: '과학 실험실', nameEn: 'Science Lab', colorTheme: '화이트+블루', references: ['Wolfram Alpha', 'Brilliant'] },
  { id: 40, name: '날씨 예보', nameEn: 'Weather Forecast', colorTheme: '스카이 블루', references: ['Apple Weather', 'Dark Sky'] },
  { id: 41, name: '항공편 검색', nameEn: 'Flight Search', colorTheme: '화이트+스카이', references: ['Google Flights', 'Skyscanner'] },
  { id: 42, name: '여행 일정표', nameEn: 'Travel Itinerary', colorTheme: '오렌지+화이트', references: ['TripIt', 'Wanderlog'] },
  { id: 43, name: '호텔 예약', nameEn: 'Hotel Booking', colorTheme: 'Airbnb 코랄', references: ['Airbnb', 'Booking.com'] },
  { id: 44, name: '지하철 노선도', nameEn: 'Subway Map', colorTheme: '멀티컬러 노선', references: ['Citymapper', 'Moovit'] },
  { id: 45, name: 'GPS 내비', nameEn: 'GPS Navigation', colorTheme: '다크+블루', references: ['Waze', 'Google Maps'] },
  { id: 46, name: '배낭여행', nameEn: 'Backpacker', colorTheme: '어스+그린', references: ['Hostelworld', 'Nomadlist'] },
  { id: 47, name: '크루즈 항해', nameEn: 'Cruise Voyage', colorTheme: '오션 블루', references: ['Royal Caribbean', 'Viking'] },
  { id: 48, name: '등산 코스', nameEn: 'Hiking Trail', colorTheme: '그린+브라운', references: ['AllTrails', 'Strava'] },
  { id: 49, name: '우편 배송', nameEn: 'Package Tracking', colorTheme: '퍼플+오렌지', references: ['FedEx', 'Coupang'] },
  { id: 50, name: '기차 시간표', nameEn: 'Train Timetable', colorTheme: '레드+화이트', references: ['DB', 'Trainline'] },
  { id: 51, name: '온라인 수업', nameEn: 'Online Course', colorTheme: '퍼플+화이트', references: ['Udemy', 'Coursera'] },
  { id: 52, name: '플래시카드', nameEn: 'Flashcard', colorTheme: '블루+화이트', references: ['Anki', 'Quizlet'] },
  { id: 53, name: '언어 학습', nameEn: 'Language Learning', colorTheme: '듀오링고 그린', references: ['Duolingo', 'Babbel'] },
  { id: 54, name: '시험 답안지', nameEn: 'Exam Sheet', colorTheme: '화이트+블랙', references: ['SAT', 'TOEFL'] },
  { id: 55, name: '연구 논문', nameEn: 'Research Paper', colorTheme: '아이보리+블랙', references: ['Google Scholar', 'arXiv'] },
  { id: 56, name: '독서 클럽', nameEn: 'Book Club', colorTheme: '크림+브라운', references: ['Kindle', 'Goodreads'] },
  { id: 57, name: '과학 키트', nameEn: 'Science Kit', colorTheme: '화이트+그린', references: ['KiwiCo', 'Brilliant'] },
  { id: 58, name: '코딩 튜토리얼', nameEn: 'Coding Tutorial', colorTheme: '다크+네이비', references: ['freeCodeCamp', 'Codecademy'] },
  { id: 59, name: '요리 레시피', nameEn: 'Cooking Recipe', colorTheme: '오렌지+크림', references: ['Tasty', 'Allrecipes'] },
  { id: 60, name: '박물관 투어', nameEn: 'Museum Tour', colorTheme: '화이트+골드', references: ['Google Arts', 'MoMA'] },
  { id: 61, name: 'SNS 피드', nameEn: 'Social Feed', colorTheme: '인스타 그라데이션', references: ['Instagram', 'Twitter/X'] },
  { id: 62, name: '매칭 앱', nameEn: 'Matching App', colorTheme: '핑크+화이트', references: ['Tinder', 'Bumble'] },
  { id: 63, name: '레딧 스레드', nameEn: 'Reddit Thread', colorTheme: '오렌지+다크', references: ['Reddit', 'Stack Overflow'] },
  { id: 64, name: '틱톡 릴스', nameEn: 'TikTok Reels', colorTheme: '다크+시안/핑크', references: ['TikTok', 'YouTube Shorts'] },
  { id: 65, name: '디스코드 서버', nameEn: 'Discord Server', colorTheme: '보라+다크', references: ['Discord', 'Slack'] },
  { id: 66, name: '핀터레스트 보드', nameEn: 'Pinterest Board', colorTheme: '레드+화이트', references: ['Pinterest', 'Are.na'] },
  { id: 67, name: '유튜브 학습', nameEn: 'YouTube Academy', colorTheme: '레드+화이트', references: ['YouTube', 'Vimeo'] },
  { id: 68, name: '클럽하우스', nameEn: 'Clubhouse Room', colorTheme: '크림+브라운', references: ['Clubhouse', 'Twitter Spaces'] },
  { id: 69, name: '네이버 카페', nameEn: 'Naver Cafe', colorTheme: '그린+화이트', references: ['Naver Cafe', 'Blind'] },
  { id: 70, name: '위키백과', nameEn: 'Wikipedia', colorTheme: '화이트+블루', references: ['Wikipedia', 'GitBook'] },
  { id: 71, name: '상품 비교', nameEn: 'Product Compare', colorTheme: '오렌지+화이트', references: ['Amazon', 'Coupang'] },
  { id: 72, name: '구독 플랜', nameEn: 'Subscription Plan', colorTheme: '인디고+화이트', references: ['Stripe', 'Notion'] },
  { id: 73, name: '경매 입찰', nameEn: 'Auction Bidding', colorTheme: 'eBay 멀티', references: ['eBay', 'StockX'] },
  { id: 74, name: '장바구니', nameEn: 'Shopping Cart', colorTheme: '그린+화이트', references: ['Shopify', 'Gumroad'] },
  { id: 75, name: '음식 배달', nameEn: 'Food Delivery', colorTheme: '민트+화이트', references: ['Uber Eats', 'Baemin'] },
  { id: 76, name: '부동산 매물', nameEn: 'Real Estate', colorTheme: '블루+화이트', references: ['Zillow', 'Zigbang'] },
  { id: 77, name: '패션 코디', nameEn: 'Fashion Styling', colorTheme: '블랙+화이트', references: ['ZARA', 'ASOS'] },
  { id: 78, name: '중고거래', nameEn: 'Marketplace', colorTheme: '오렌지+화이트', references: ['Karrot', 'Mercari'] },
  { id: 79, name: '렌탈 서비스', nameEn: 'Rental Service', colorTheme: '퍼플+화이트', references: ['Zipcar', 'Turo'] },
  { id: 80, name: '보험 비교', nameEn: 'Insurance Compare', colorTheme: '핑크+화이트', references: ['Lemonade', 'Oscar'] },
  { id: 81, name: '포토 에디터', nameEn: 'Photo Editor', colorTheme: '다크+블루', references: ['Photoshop', 'Lightroom'] },
  { id: 82, name: '음악 프로듀싱', nameEn: 'Music Producer', colorTheme: '다크+네온', references: ['Ableton', 'FL Studio'] },
  { id: 83, name: '건축 설계', nameEn: 'Architecture', colorTheme: '화이트+블루', references: ['AutoCAD', 'SketchUp'] },
  { id: 84, name: '영화 시나리오', nameEn: 'Movie Script', colorTheme: '화이트+블랙', references: ['Final Draft', 'Celtx'] },
  { id: 85, name: '만화 스토리보드', nameEn: 'Comic Storyboard', colorTheme: '화이트+잉크', references: ['Webtoon', 'Procreate'] },
  { id: 86, name: '패션쇼 런웨이', nameEn: 'Fashion Runway', colorTheme: '블랙+골드', references: ['Vogue', 'SSENSE'] },
  { id: 87, name: '갤러리 전시', nameEn: 'Art Gallery', colorTheme: '화이트+아트', references: ['Artsy', 'ArtStation'] },
  { id: 88, name: 'DJ 믹싱', nameEn: 'DJ Mixing', colorTheme: '다크+네온', references: ['Serato', 'Traktor'] },
  { id: 89, name: '인테리어', nameEn: 'Interior Design', colorTheme: '베이지+그레이', references: ['Houzz', 'IKEA'] },
  { id: 90, name: '네온사인', nameEn: 'Neon Sign', colorTheme: '다크+네온', references: ['Custom Neon', 'Canva'] },
  { id: 91, name: 'AR 카메라', nameEn: 'AR Camera', colorTheme: '화이트 AR', references: ['Vision Pro', 'Google Lens'] },
  { id: 92, name: '홀로그램', nameEn: 'Hologram', colorTheme: '다크+시안', references: ['HoloLens', 'Magic Leap'] },
  { id: 93, name: '블록체인 지갑', nameEn: 'Blockchain Wallet', colorTheme: '다크+퍼플', references: ['MetaMask', 'OpenSea'] },
  { id: 94, name: 'AI 어시스턴트', nameEn: 'AI Assistant', colorTheme: '화이트+퍼플', references: ['Claude', 'Perplexity'] },
  { id: 95, name: '스마트워치', nameEn: 'Smartwatch', colorTheme: '블랙 OLED', references: ['Apple Watch', 'Galaxy Watch'] },
  { id: 96, name: '스마트홈', nameEn: 'Smart Home', colorTheme: '다크+그린', references: ['HomeKit', 'SmartThings'] },
  { id: 97, name: '로봇 팩토리', nameEn: 'Robot Factory', colorTheme: '메탈릭+블루', references: ['Boston Dynamics', 'Tesla Bot'] },
  { id: 98, name: 'DNA 분석', nameEn: 'DNA Analysis', colorTheme: '화이트+바이오', references: ['23andMe', 'Ancestry'] },
  { id: 99, name: '타임머신', nameEn: 'Time Machine', colorTheme: '다크+골드/시안', references: ['Time Machine', 'Wayback'] },
  { id: 100, name: '잡차자 올인원', nameEn: 'JobChaja All-in-One', colorTheme: '인디고~퍼플', references: ['JobChaja', 'Toss'] },
];

// KOR: 카테고리 색상 매핑 / ENG: Category color mapping
const getCategoryColor = (id: number): string => {
  if (id <= 10) return 'from-blue-500 to-blue-600';
  if (id <= 20) return 'from-indigo-500 to-indigo-600';
  if (id <= 30) return 'from-purple-500 to-purple-600';
  if (id <= 40) return 'from-emerald-500 to-emerald-600';
  if (id <= 50) return 'from-sky-500 to-sky-600';
  if (id <= 60) return 'from-amber-500 to-amber-600';
  if (id <= 70) return 'from-pink-500 to-pink-600';
  if (id <= 80) return 'from-orange-500 to-orange-600';
  if (id <= 90) return 'from-rose-500 to-rose-600';
  return 'from-cyan-500 to-cyan-600';
};

const getCategoryBorder = (id: number): string => {
  if (id <= 10) return 'border-blue-200 hover:border-blue-400';
  if (id <= 20) return 'border-indigo-200 hover:border-indigo-400';
  if (id <= 30) return 'border-purple-200 hover:border-purple-400';
  if (id <= 40) return 'border-emerald-200 hover:border-emerald-400';
  if (id <= 50) return 'border-sky-200 hover:border-sky-400';
  if (id <= 60) return 'border-amber-200 hover:border-amber-400';
  if (id <= 70) return 'border-pink-200 hover:border-pink-400';
  if (id <= 80) return 'border-orange-200 hover:border-orange-400';
  if (id <= 90) return 'border-rose-200 hover:border-rose-400';
  return 'border-cyan-200 hover:border-cyan-400';
};

export default function DiagnosisDesignsIndex() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // KOR: 필터링된 디자인 목록 / ENG: Filtered design list
  const filteredDesigns = designs.filter((d) => {
    const matchesCategory =
      activeCategory === 'all' ||
      categories.find((c) => c.id === activeCategory && 'range' in c && d.id >= (c as { range: [number, number] }).range[0] && d.id <= (c as { range: [number, number] }).range[1]);
    const matchesSearch =
      searchQuery === '' ||
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.references.some((r) => r.toLowerCase().includes(searchQuery.toLowerCase())) ||
      String(d.id).includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* KOR: 헤더 / ENG: Header */}
      <div className="bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              비자 진단 디자인 갤러리
            </h1>
            <p className="mt-3 text-lg sm:text-xl text-white/80">
              Visa Diagnosis Design Gallery — 100 Unique Concepts
            </p>
            <div className="mt-4 flex items-center justify-center gap-3 text-sm text-white/70">
              <span className="px-3 py-1 bg-white/10 rounded-full">100개 시안</span>
              <span className="px-3 py-1 bg-white/10 rounded-full">10개 카테고리</span>
              <span className="px-3 py-1 bg-white/10 rounded-full">500+ SaaS 레퍼런스</span>
            </div>
          </div>

          {/* KOR: 검색 바 / ENG: Search bar */}
          <div className="mt-8 max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="text"
                placeholder="디자인 검색... (이름, 번호, 레퍼런스)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>
          </div>
        </div>
      </div>

      {/* KOR: 카테고리 필터 / ENG: Category filter */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gray-900 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{cat.name}</span>
                  {'range' in cat && (
                    <span className={`text-xs ${isActive ? 'text-white/60' : 'text-gray-400'}`}>
                      {(cat as { range: [number, number] }).range[0]}-{(cat as { range: [number, number] }).range[1]}
                    </span>
                  )}
                </button>
              );
            })}

            {/* KOR: 뷰 모드 토글 / ENG: View mode toggle */}
            <div className="ml-auto shrink-0 flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* KOR: 디자인 그리드 / ENG: Design grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* KOR: 결과 카운트 / ENG: Result count */}
        <div className="mb-4 text-sm text-gray-500">
          {filteredDesigns.length}개 디자인 표시 중 / Showing {filteredDesigns.length} designs
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredDesigns.map((design) => (
              <Link
                key={design.id}
                href={`/diagnosis/designs/diagnosis${design.id}`}
                className={`group relative bg-white rounded-xl border-2 ${getCategoryBorder(design.id)} overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1`}
              >
                {/* KOR: 번호 배지 / ENG: Number badge */}
                <div className={`bg-linear-to-br ${getCategoryColor(design.id)} p-4 text-white`}>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">#{design.id}</span>
                    {design.id === 100 && <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />}
                  </div>
                </div>

                {/* KOR: 디자인 정보 / ENG: Design info */}
                <div className="p-3">
                  <h3 className="font-bold text-gray-900 text-sm truncate">{design.name}</h3>
                  <p className="text-xs text-gray-500 truncate">{design.nameEn}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {design.references.slice(0, 2).map((ref) => (
                      <span
                        key={ref}
                        className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded"
                      >
                        {ref}
                      </span>
                    ))}
                  </div>
                </div>

                {/* KOR: 호버 오버레이 / ENG: Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="px-3 py-1.5 bg-white rounded-full shadow-md text-sm font-medium text-gray-700">
                    시안 보기 →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredDesigns.map((design) => (
              <Link
                key={design.id}
                href={`/diagnosis/designs/diagnosis${design.id}`}
                className={`flex items-center gap-4 p-4 bg-white rounded-xl border-2 ${getCategoryBorder(design.id)} transition-all hover:shadow-md`}
              >
                <div className={`shrink-0 w-12 h-12 rounded-lg bg-linear-to-br ${getCategoryColor(design.id)} flex items-center justify-center text-white font-bold`}>
                  {design.id}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900 truncate">{design.name}</h3>
                    <span className="text-sm text-gray-400">·</span>
                    <span className="text-sm text-gray-500 truncate">{design.nameEn}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-xs text-gray-400">{design.colorTheme}</span>
                    <span className="text-xs text-gray-300">|</span>
                    {design.references.map((ref) => (
                      <span key={ref} className="text-xs text-gray-500">{ref}</span>
                    ))}
                  </div>
                </div>
                <span className="shrink-0 text-sm text-gray-400 group-hover:text-gray-600">→</span>
              </Link>
            ))}
          </div>
        )}

        {/* KOR: 결과 없음 / ENG: No results */}
        {filteredDesigns.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">검색 결과가 없습니다</p>
            <p className="text-gray-300 text-sm mt-1">No designs found</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
              className="mt-4 px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-600 hover:bg-gray-200"
            >
              필터 초기화
            </button>
          </div>
        )}
      </div>

      {/* KOR: 푸터 / ENG: Footer */}
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <p className="text-sm text-gray-400">
            100개 비자 진단 UI/UX 디자인 시안 · JobChaja Design System
          </p>
          <p className="text-xs text-gray-300 mt-1">
            Each design is a unique approach to visa diagnosis with different SaaS references
          </p>
        </div>
      </div>
    </div>
  );
}
