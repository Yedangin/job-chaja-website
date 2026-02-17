'use client';

import Link from 'next/link';
import { Palette, ExternalLink, Layers, Sparkles } from 'lucide-react';

// 전체 카드 디자인 시안 인덱스 / Card Design Variant Index Page
// 32개 시안을 한눈에 볼 수 있는 갤러리 / Gallery of all 32 design variants

interface DesignVariant {
  id: number;
  name: string;
  nameEn: string;
  reference: string;
  category: 'minimal' | 'premium' | 'creative' | 'platform' | 'interactive' | 'unique';
  tags: string[];
}

const variants: DesignVariant[] = [
  // === Batch 1 (01-10) ===
  { id: 1, name: '미니멀 클린', nameEn: 'Minimal Clean', reference: '사람인 스타일', category: 'minimal', tags: ['얇은 테두리', '그림자 없음', '콘텐츠 중심'] },
  { id: 2, name: '프리미엄 그라데이션', nameEn: 'Premium Gradient Header', reference: '잡코리아 스타일', category: 'premium', tags: ['그라데이션 헤더', '로고 오버랩', '비자 컬러 코딩'] },
  { id: 3, name: '기업 로고 포커스', nameEn: 'Company Logo Focus', reference: '원티드 스타일', category: 'premium', tags: ['산업별 컬러 헤더', '로고 중심', '북마크'] },
  { id: 4, name: '비자 배지 히어로', nameEn: 'Visa Badge Hero', reference: '잡차자 오리지널', category: 'creative', tags: ['비자 최상단', '매칭 점수 바', '비자 컬러 레전드'] },
  { id: 5, name: '다크 모드', nameEn: 'Dark Mode Card', reference: '다크 테마', category: 'creative', tags: ['네온 컬러', '골드 링', '호버 글로우'] },
  { id: 6, name: '이미지 오버레이', nameEn: 'Image Overlay', reference: '에어비앤비/야놀자', category: 'creative', tags: ['그라데이션 이미지', '리본', '하트 북마크'] },
  { id: 7, name: '수평 리스트', nameEn: 'Horizontal List', reference: '링크드인 스타일', category: 'platform', tags: ['가로 카드', '좌측 블루 보더', '정렬 옵션'] },
  { id: 8, name: '태그 클라우드/칩', nameEn: 'Tag Cloud / Chip', reference: '카카오워크 스타일', category: 'creative', tags: ['모든 정보가 칩', '파스텔 배경', '매칭 점수 바'] },
  { id: 9, name: '마감일 포커스', nameEn: 'Deadline / Urgency', reference: '알바몬 스타일', category: 'unique', tags: ['SVG 원형 프로그레스', '긴급 펄스', '컬러 코딩'] },
  { id: 10, name: '컴팩트 리스트', nameEn: 'Compact List Item', reference: '인크루트 스타일', category: 'minimal', tags: ['테이블 레이아웃', '고밀도', 'AD 배지'] },

  // === Batch 2 (11-20) ===
  { id: 11, name: '글라스모피즘', nameEn: 'Glassmorphism', reference: '프로스트 글라스', category: 'creative', tags: ['backdrop-blur', '반투명', '레인보우 보더'] },
  { id: 12, name: '뉴모피즘', nameEn: 'Neumorphism', reference: '소프트 UI', category: 'creative', tags: ['인셋/아웃셋 그림자', '원형 게이지', '골든 링'] },
  { id: 13, name: '매거진 에디토리얼', nameEn: 'Magazine Editorial', reference: '모노클/블룸버그', category: 'unique', tags: ['세리프 폰트', '풀쿼트 급여', '흑백 기반'] },
  { id: 14, name: '소셜 미디어', nameEn: 'Social Media (Instagram)', reference: '인스타그램', category: 'platform', tags: ['스토리 행', '좋아요/공유', '해시태그 비자'] },
  { id: 15, name: '칸반 보드', nameEn: 'Kanban Board', reference: '트렐로/노션 보드', category: 'platform', tags: ['컬럼 그룹핑', '드래그 핸들', '아바타 원형'] },
  { id: 16, name: 'Material Design 3', nameEn: 'Material Design 3', reference: 'Google Material You', category: 'platform', tags: ['rounded-3xl', '토널 서피스', 'FAB 버튼'] },
  { id: 17, name: 'iOS 네이티브', nameEn: 'iOS Native Feel', reference: 'Apple iOS', category: 'platform', tags: ['세그먼트 컨트롤', '그룹 테이블', '시스템 블루'] },
  { id: 18, name: '노션 데이터베이스', nameEn: 'Notion Database', reference: '노션 DB 뷰', category: 'platform', tags: ['갤러리/테이블 토글', '필터 바', '체크박스'] },
  { id: 19, name: '트위터/X 포스트', nameEn: 'Twitter/X Post', reference: '트위터/X', category: 'platform', tags: ['다크 테마', '인용 트윗', '인증 배지'] },
  { id: 20, name: '대시보드 위젯', nameEn: 'Dashboard Widget', reference: '어드민 대시보드', category: 'unique', tags: ['미니 차트', '스파크라인', '트렌드 화살표'] },

  // === Batch 3 (21-32) ===
  { id: 21, name: '지도 핀/위치', nameEn: 'Map Pin / Location', reference: '구글맵/카카오맵', category: 'unique', tags: ['말풍선 카드', '미니 맵', '지역 그룹핑'] },
  { id: 22, name: '공장/산업', nameEn: 'Factory / Industrial', reference: '산업 안전 포스터', category: 'unique', tags: ['안전 스트라이프', '스텐실 폰트', 'HIRING 스탬프'] },
  { id: 23, name: '그라데이션 보더', nameEn: 'Gradient Border', reference: 'Apple 제품 페이지', category: 'creative', tags: ['그라데이션 테두리', '애니메이션 보더', '호버 필'] },
  { id: 24, name: '이모지 헤더', nameEn: 'Emoji Header', reference: 'Gen-Z 스타일', category: 'creative', tags: ['큰 이모지', '파스텔 배경', '이모지 복리후생'] },
  { id: 25, name: '매칭 점수 포커스', nameEn: 'Match Score Focus', reference: '피트니스 앱', category: 'unique', tags: ['SVG 도넛 차트', '기준별 분석 바', '순위 배지'] },
  { id: 26, name: '투톤 스플릿', nameEn: 'Two-Tone Split', reference: '패션 룩북', category: 'creative', tags: ['대각선 분할', '다크/라이트 존', 'clip-path'] },
  { id: 27, name: '오버레이 액션', nameEn: 'Overlay Action (Hover)', reference: '넷플릭스', category: 'interactive', tags: ['호버 오버레이', '액션 버튼 공개', '3:4 비율'] },
  { id: 28, name: '스와이프 카드', nameEn: 'Swipeable (Tinder)', reference: '틴더/데이팅앱', category: 'interactive', tags: ['단일 카드 뷰', '좌우 스와이프', '터치 지원'] },
  { id: 29, name: '보딩패스/티켓', nameEn: 'Boarding Pass', reference: '항공 탑승권', category: 'unique', tags: ['출발→도착', '바코드', '절취선'] },
  { id: 30, name: '리본/배너', nameEn: 'Ribbon / Banner', reference: '인증서/선물포장', category: 'creative', tags: ['대각선 리본', '스탬프 도장', '세로 비자 텍스트'] },
  { id: 31, name: '원형 버블', nameEn: 'Circular Bubble', reference: '버블/풍선', category: 'creative', tags: ['rounded-[32px]', '도넛 링', '메이슨리 레이아웃'] },
  { id: 32, name: '메가 카드', nameEn: 'Mega Card (Full Detail)', reference: '상세 상품 페이지', category: 'interactive', tags: ['탭 내비게이션', '전체 필드 표시', '최대 정보 밀도'] },
];

// 카테고리 설정 / Category configuration
const categoryConfig: Record<string, { label: string; labelEn: string; color: string; bg: string; border: string }> = {
  minimal: { label: '미니멀', labelEn: 'Minimal', color: 'text-gray-700', bg: 'bg-gray-100', border: 'border-gray-200' },
  premium: { label: '프리미엄', labelEn: 'Premium', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
  creative: { label: '크리에이티브', labelEn: 'Creative', color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200' },
  platform: { label: '플랫폼', labelEn: 'Platform', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
  interactive: { label: '인터랙티브', labelEn: 'Interactive', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' },
  unique: { label: '유니크', labelEn: 'Unique', color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200' },
};

export default function DesignIndexPage() {
  // 카테고리별 카운트 / Count per category
  const categoryCounts = variants.reduce<Record<string, number>>((acc, v) => {
    acc[v.category] = (acc[v.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 / Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Palette className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              채용공고 카드 디자인 시안
            </h1>
          </div>
          <p className="text-gray-600 mt-2">
            Job Posting Card Design Variants — 32 unique designs for JobChaja platform
          </p>

          {/* 통계 / Stats */}
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
              <Layers className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">총 {variants.length}개 시안</span>
            </div>
            {Object.entries(categoryConfig).map(([key, config]) => (
              <div key={key} className={`flex items-center gap-2 px-3 py-1.5 ${config.bg} rounded-lg border ${config.border}`}>
                <span className={`text-xs font-medium ${config.color}`}>
                  {config.label} ({categoryCounts[key] || 0})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 카드 그리드 / Card Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {variants.map((variant) => {
            const cat = categoryConfig[variant.category];
            return (
              <Link
                key={variant.id}
                href={`/job-cards/designs/variant-${String(variant.id).padStart(2, '0')}`}
                className="group bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 overflow-hidden"
              >
                {/* 상단 번호 바 / Top number bar */}
                <div className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 group-hover:from-blue-600 group-hover:to-indigo-600 transition-colors" />

                <div className="p-4">
                  {/* 번호 + 카테고리 / Number + Category */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-gray-300 group-hover:text-blue-400 transition-colors">
                        {String(variant.id).padStart(2, '0')}
                      </span>
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                          {variant.name}
                        </h3>
                        <p className="text-xs text-gray-500">{variant.nameEn}</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
                  </div>

                  {/* 레퍼런스 / Reference */}
                  <div className="flex items-center gap-1.5 mb-3">
                    <Sparkles className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">{variant.reference}</span>
                  </div>

                  {/* 카테고리 배지 / Category badge */}
                  <div className="mb-3">
                    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${cat.bg} ${cat.color} border ${cat.border}`}>
                      {cat.label} / {cat.labelEn}
                    </span>
                  </div>

                  {/* 태그 / Tags */}
                  <div className="flex flex-wrap gap-1">
                    {variant.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-[10px] bg-gray-100 text-gray-600 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* 범례 / Legend */}
        <div className="mt-12 p-6 bg-white rounded-xl border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">카테고리 설명 / Category Guide</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(categoryConfig).map(([key, config]) => (
              <div key={key} className={`p-3 rounded-lg ${config.bg} border ${config.border}`}>
                <span className={`font-semibold text-sm ${config.color}`}>{config.label} / {config.labelEn}</span>
                <p className="text-xs text-gray-600 mt-1">
                  {key === 'minimal' && '깔끔하고 심플한 디자인. 콘텐츠 중심의 레이아웃.'}
                  {key === 'premium' && '고급스러운 그라데이션과 강조 요소. 기업 브랜딩 중심.'}
                  {key === 'creative' && '독창적인 비주얼 효과와 색상 조합. 시각적 임팩트.'}
                  {key === 'platform' && '실제 플랫폼 UI를 참고한 친숙한 디자인.'}
                  {key === 'interactive' && '호버, 스와이프, 탭 등 인터랙션이 있는 디자인.'}
                  {key === 'unique' && '특수 목적 또는 독특한 컨셉의 실험적 디자인.'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 공유 목데이터 안내 / Shared mock data info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 text-sm text-blue-800">
          <p className="font-semibold mb-1">공유 목데이터 / Shared Mock Data</p>
          <p>모든 시안은 동일한 6개의 샘플 채용공고 데이터를 사용합니다.</p>
          <p className="text-xs text-blue-600 mt-1">
            _mock/job-mock-data.ts — MockJobPosting interface + sampleJobs + getDDay/formatSalary/getTimeAgo utilities
          </p>
        </div>
      </div>
    </div>
  );
}
