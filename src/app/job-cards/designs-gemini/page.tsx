'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Sparkles, ExternalLink, Layers, Filter, Hash, ArrowLeft, Gem } from 'lucide-react';
import { designSpecs, categoryStats, refStats } from './_mock/design-spec';
import type { DesignSpec } from './_mock/design-spec';

// 카테고리 설정 / Category configuration
const categoryConfig: Record<string, { label: string; labelEn: string; color: string; bg: string; border: string; hoverBorder: string; dot: string }> = {
  minimal: { label: '미니멀', labelEn: 'Minimal', color: 'text-gray-700', bg: 'bg-gray-100', border: 'border-gray-200', hoverBorder: 'hover:border-gray-400', dot: 'bg-gray-400' },
  premium: { label: '프리미엄', labelEn: 'Premium', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', hoverBorder: 'hover:border-amber-400', dot: 'bg-amber-400' },
  creative: { label: '크리에이티브', labelEn: 'Creative', color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200', hoverBorder: 'hover:border-purple-400', dot: 'bg-purple-400' },
  platform: { label: '플랫폼', labelEn: 'Platform', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', hoverBorder: 'hover:border-blue-400', dot: 'bg-blue-400' },
  interactive: { label: '인터랙티브', labelEn: 'Interactive', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200', hoverBorder: 'hover:border-green-400', dot: 'bg-green-400' },
  unique: { label: '유니크', labelEn: 'Unique', color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200', hoverBorder: 'hover:border-rose-400', dot: 'bg-rose-400' },
};

// 레퍼런스 그룹 정의 / Reference group definitions
const refGroups = [
  { key: 'single', label: '단일 레퍼런스', labelEn: 'Single Reference', range: 'g-001 ~ g-030', count: refStats.single, filter: (d: DesignSpec) => d.references.length === 1 },
  { key: 'double', label: '듀얼 레퍼런스', labelEn: 'Dual Reference', range: 'g-031 ~ g-070', count: refStats.double, filter: (d: DesignSpec) => d.references.length === 2 },
  { key: 'triple', label: '트리플 레퍼런스', labelEn: 'Triple Reference', range: 'g-071 ~ g-100', count: refStats.triple, filter: (d: DesignSpec) => d.references.length === 3 },
];

export default function GeminiDesignIndexPage() {
  // 카테고리 필터 상태 / Category filter state
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // 필터링된 시안 목록 / Filtered design list
  const filteredSpecs = useMemo(() => {
    if (!activeCategory) return designSpecs;
    return designSpecs.filter(d => d.category === activeCategory);
  }, [activeCategory]);

  // 필터링된 목록 내 그룹별 시안 / Grouped filtered specs
  const groupedSpecs = useMemo(() => {
    return refGroups.map(group => ({
      ...group,
      specs: filteredSpecs.filter(group.filter),
    }));
  }, [filteredSpecs]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 / Header — 인디고-퍼플 그라데이션 (Gemini 브랜딩) */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* 상단 네비게이션 / Top navigation */}
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/job-cards"
              className="flex items-center gap-2 text-indigo-200 hover:text-white transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>디자인 시안 목록 / Design Index</span>
            </Link>
            <Link
              href="/job-cards/designs"
              className="text-indigo-200 hover:text-white transition-colors text-sm"
            >
              Claude 시안 보기 / View Claude Designs
            </Link>
          </div>

          {/* 타이틀 / Title */}
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-white/15 rounded-xl backdrop-blur-sm">
              <Gem className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Gemini 시안 갤러리
              </h1>
              <p className="text-indigo-200 text-sm mt-0.5">
                Gemini Design Gallery
              </p>
            </div>
          </div>
          <p className="text-indigo-100 mt-3 text-sm leading-relaxed max-w-2xl">
            100개 디자인 시안 -- 클로드가 기획, 제미나이가 구현
            <br />
            <span className="text-indigo-200">
              100 Designs -- Planned by Claude, Built by Gemini
            </span>
          </p>

          {/* 통계 요약 / Stats summary */}
          <div className="flex flex-wrap gap-3 mt-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-lg">
              <Layers className="w-4 h-4 text-white" />
              <span className="text-sm font-semibold text-white">
                총 {designSpecs.length}개 시안 / {designSpecs.length} Total
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-lg">
              <Hash className="w-3.5 h-3.5 text-indigo-200" />
              <span className="text-xs text-indigo-100">
                단일 {refStats.single} + 듀얼 {refStats.double} + 트리플 {refStats.triple}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 필터 바 / Filter bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
            {/* 전체 버튼 / All button */}
            <button
              onClick={() => setActiveCategory(null)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                activeCategory === null
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              전체 / All ({designSpecs.length})
            </button>
            {/* 카테고리 필터 버튼 / Category filter buttons */}
            {Object.entries(categoryConfig).map(([key, config]) => {
              const count = categoryStats[key as keyof typeof categoryStats] || 0;
              const isActive = activeCategory === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveCategory(isActive ? null : key)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    isActive
                      ? `${config.bg} ${config.color} ${config.border} shadow-sm`
                      : `bg-white text-gray-600 border-gray-200 hover:bg-gray-50 ${config.hoverBorder}`
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${config.dot}`} />
                  {config.label} ({count})
                </button>
              );
            })}
          </div>

          {/* 필터 상태 표시 / Filter status */}
          {activeCategory && (
            <div className="mt-2 text-xs text-gray-500">
              {filteredSpecs.length}개 시안 표시 중 / Showing {filteredSpecs.length} designs
            </div>
          )}
        </div>
      </div>

      {/* 메인 콘텐츠 / Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {groupedSpecs.map((group) => {
          if (group.specs.length === 0) return null;
          return (
            <section key={group.key} className="mb-12">
              {/* 그룹 헤더 / Group header */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-8 rounded-full ${
                    group.key === 'single' ? 'bg-indigo-400' :
                    group.key === 'double' ? 'bg-purple-400' :
                    'bg-fuchsia-400'
                  }`} />
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      {group.label}
                      <span className="text-gray-400 font-normal text-sm ml-2">
                        {group.labelEn}
                      </span>
                    </h2>
                    <p className="text-xs text-gray-500">
                      {group.range} -- {group.specs.length}개
                      {activeCategory && ` (필터 적용 / filtered)`}
                    </p>
                  </div>
                </div>
              </div>

              {/* 카드 그리드 / Card grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {group.specs.map((spec) => {
                  const cat = categoryConfig[spec.category];
                  return (
                    <Link
                      key={spec.id}
                      href={`/job-cards/designs-gemini/${spec.id}`}
                      className="group bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-200 overflow-hidden"
                    >
                      {/* 상단 그라데이션 바 / Top gradient bar */}
                      <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:from-indigo-600 group-hover:to-purple-600 transition-colors" />

                      <div className="p-4">
                        {/* ID + 이름 + 링크 아이콘 / ID + Name + Link icon */}
                        <div className="flex items-start justify-between mb-2.5">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-2xl font-bold text-gray-200 group-hover:text-indigo-300 transition-colors flex-shrink-0">
                              {spec.id.replace('g-', '')}
                            </span>
                            <div className="min-w-0">
                              <h3 className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors leading-tight truncate">
                                {spec.name}
                              </h3>
                              <p className="text-xs text-gray-500 truncate">{spec.nameEn}</p>
                            </div>
                          </div>
                          <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-indigo-500 transition-colors flex-shrink-0 mt-0.5" />
                        </div>

                        {/* 카테고리 배지 / Category badge */}
                        <div className="mb-2.5">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full ${cat.bg} ${cat.color} border ${cat.border}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cat.dot}`} />
                            {cat.label} / {cat.labelEn}
                          </span>
                        </div>

                        {/* 레퍼런스 목록 / References list */}
                        <div className="flex items-center gap-1.5 mb-3">
                          <Sparkles className="w-3 h-3 text-indigo-400 flex-shrink-0" />
                          <span className="text-xs text-gray-600 truncate">
                            {spec.references.join(' + ')}
                          </span>
                          {spec.references.length > 1 && (
                            <span className="flex-shrink-0 text-[9px] px-1.5 py-0.5 bg-indigo-50 text-indigo-500 rounded font-medium">
                              x{spec.references.length}
                            </span>
                          )}
                        </div>

                        {/* 핵심 기능 태그 / Key feature tags */}
                        <div className="flex flex-wrap gap-1">
                          {spec.keyFeatures.slice(0, 4).map((feature, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 text-[10px] bg-gray-100 text-gray-600 rounded-full group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors"
                            >
                              {feature}
                            </span>
                          ))}
                          {spec.keyFeatures.length > 4 && (
                            <span className="px-2 py-0.5 text-[10px] bg-gray-50 text-gray-400 rounded-full">
                              +{spec.keyFeatures.length - 4}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}

        {/* 카테고리 가이드 / Category guide */}
        <div className="mt-12 p-6 bg-white rounded-xl border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            카테고리 설명 / Category Guide
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(categoryConfig).map(([key, config]) => (
              <div key={key} className={`p-3 rounded-lg ${config.bg} border ${config.border}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-2.5 h-2.5 rounded-full ${config.dot}`} />
                  <span className={`font-semibold text-sm ${config.color}`}>
                    {config.label} / {config.labelEn}
                  </span>
                  <span className="text-xs text-gray-400 ml-auto">
                    {categoryStats[key as keyof typeof categoryStats] || 0}개
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  {key === 'minimal' && '깔끔하고 심플한 디자인. 콘텐츠 중심의 레이아웃. / Clean and simple. Content-focused layout.'}
                  {key === 'premium' && '고급스러운 그라데이션과 강조 요소. 기업 브랜딩 중심. / Elegant gradients with emphasis on branding.'}
                  {key === 'creative' && '독창적인 비주얼 효과와 색상 조합. 시각적 임팩트. / Creative visuals and bold color combos.'}
                  {key === 'platform' && '실제 플랫폼 UI를 참고한 친숙한 디자인. / Familiar designs inspired by real platform UIs.'}
                  {key === 'interactive' && '호버, 스와이프, 탭 등 인터랙션 중심 디자인. / Interaction-focused with hover, swipe, and tap.'}
                  {key === 'unique' && '특수 목적 또는 독특한 컨셉의 실험적 디자인. / Experimental designs with unique concepts.'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 레퍼런스 통계 / Reference statistics */}
        <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200 text-sm text-indigo-800">
          <p className="font-semibold mb-2">레퍼런스 조합 구조 / Reference Combination Structure</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-5 rounded-full bg-indigo-400" />
              <div>
                <span className="font-medium">단일 레퍼런스</span>
                <span className="text-indigo-500 ml-1">g-001 ~ g-030 ({refStats.single}개)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-5 rounded-full bg-purple-400" />
              <div>
                <span className="font-medium">듀얼 레퍼런스</span>
                <span className="text-indigo-500 ml-1">g-031 ~ g-070 ({refStats.double}개)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-5 rounded-full bg-fuchsia-400" />
              <div>
                <span className="font-medium">트리플 레퍼런스</span>
                <span className="text-indigo-500 ml-1">g-071 ~ g-100 ({refStats.triple}개)</span>
              </div>
            </div>
          </div>
        </div>

        {/* 목데이터 안내 / Mock data info */}
        <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200 text-sm text-purple-800">
          <p className="font-semibold mb-1">공유 목데이터 / Shared Mock Data</p>
          <p>모든 시안은 동일한 6개의 샘플 채용공고 데이터를 사용합니다.</p>
          <p className="text-xs text-purple-600 mt-1">
            _mock/design-spec.ts -- DesignSpec interface + designSpecs (100 entries) + categoryStats + refStats
          </p>
        </div>
      </div>
    </div>
  );
}
