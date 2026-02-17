'use client';

import Link from 'next/link';
import {
  Palette,
  ArrowRight,
  Layers,
  Sparkles,
  Cpu,
  Gem,
  BarChart3,
  Grid3X3,
  Globe,
  Zap,
} from 'lucide-react';

// 잡차자 채용 카드 디자인 시안 랜딩 페이지 / JobChaja Job Card Designs Landing Page
// Claude(32개) + Gemini(100개) 컬렉션 통합 갤러리 입구 / Combined gallery entry for both collections

// 카테고리 설정 / Category configuration
const categories = [
  { key: 'minimal', label: '미니멀', labelEn: 'Minimal', color: 'text-gray-700', bg: 'bg-gray-100', border: 'border-gray-300' },
  { key: 'premium', label: '프리미엄', labelEn: 'Premium', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-300' },
  { key: 'creative', label: '크리에이티브', labelEn: 'Creative', color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-300' },
  { key: 'platform', label: '플랫폼', labelEn: 'Platform', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-300' },
  { key: 'interactive', label: '인터랙티브', labelEn: 'Interactive', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-300' },
  { key: 'unique', label: '유니크', labelEn: 'Unique', color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-300' },
];

// Claude 시안 카테고리별 카운트 / Claude designs category counts
const claudeCategoryCounts: Record<string, number> = {
  minimal: 2,
  premium: 2,
  creative: 11,
  platform: 7,
  interactive: 3,
  unique: 7,
};

// Gemini 시안 카테고리별 카운트 / Gemini designs category counts
const geminiCategoryCounts: Record<string, number> = {
  minimal: 12,
  premium: 15,
  creative: 22,
  platform: 19,
  interactive: 14,
  unique: 18,
};

export default function JobCardsLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* 히어로 섹션 / Hero Section */}
      <div className="relative overflow-hidden">
        {/* 배경 그라데이션 / Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-100/40 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-indigo-100/40 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
          <div className="text-center">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full mb-8 shadow-sm">
              <Palette className="w-5 h-5 text-indigo-600" />
              <span className="text-sm font-medium text-gray-700">Design Gallery</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-4">
              잡차자 채용 카드 디자인 시안
            </h1>
            <p className="text-lg sm:text-xl text-gray-500 mb-3">
              JobChaja Job Card Designs
            </p>
            <p className="text-base text-gray-400 max-w-2xl mx-auto">
              132개의 고유한 채용공고 카드 디자인을 두 컬렉션에서 탐색하세요.
              <br className="hidden sm:block" />
              Explore 132 unique job card designs across two curated collections.
            </p>
          </div>
        </div>
      </div>

      {/* 컬렉션 카드 섹션 / Collection Cards Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">

          {/* Card 1: Claude 시안 / Claude Collection */}
          <Link
            href="/job-cards/designs"
            className="group relative bg-white rounded-2xl border border-gray-200 hover:border-cyan-300 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
          >
            {/* 상단 그라데이션 바 / Top gradient bar */}
            <div className="h-1.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-600" />

            <div className="p-6 sm:p-8">
              {/* 아이콘 + 제목 / Icon + Title */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-cyan-50 to-blue-100 rounded-2xl flex items-center justify-center border border-cyan-200 group-hover:scale-110 transition-transform duration-300">
                    <Cpu className="w-7 h-7 text-cyan-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 group-hover:text-cyan-700 transition-colors">
                      Claude 시안
                    </h2>
                    <p className="text-sm text-gray-400 mt-0.5">Collection A</p>
                  </div>
                </div>
                <span className="inline-flex items-center justify-center w-12 h-12 bg-cyan-50 text-cyan-700 font-bold text-lg rounded-xl border border-cyan-200 group-hover:bg-cyan-100 transition-colors">
                  32
                </span>
              </div>

              {/* 설명 / Description */}
              <p className="text-sm text-gray-600 mb-1 font-medium">
                Claude가 기획 & 구현
              </p>
              <p className="text-xs text-gray-400 mb-5">
                Designed & Built by Claude
              </p>

              {/* 메타 정보 / Meta info */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg text-xs text-gray-600 border border-gray-100">
                  <Layers className="w-3.5 h-3.5 text-gray-400" />
                  32 designs across 6 categories
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg text-xs text-gray-600 border border-gray-100">
                  <Grid3X3 className="w-3.5 h-3.5 text-gray-400" />
                  Batch 1-3, 10개씩
                </span>
              </div>

              {/* 카테고리 분포 / Category breakdown */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                {categories.map((cat) => (
                  <div
                    key={cat.key}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg ${cat.bg} border ${cat.border}/50`}
                  >
                    <span className={`text-xs font-medium ${cat.color}`}>{cat.label}</span>
                    <span className={`text-xs font-bold ${cat.color}`}>{claudeCategoryCounts[cat.key]}</span>
                  </div>
                ))}
              </div>

              {/* CTA / Call to action */}
              <div className="flex items-center gap-2 text-cyan-600 font-semibold text-sm group-hover:gap-3 transition-all">
                <span>컬렉션 보기 / View Collection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Card 2: Gemini 시안 / Gemini Collection */}
          <Link
            href="/job-cards/designs-gemini"
            className="group relative bg-white rounded-2xl border border-gray-200 hover:border-purple-300 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
          >
            {/* 상단 그라데이션 바 / Top gradient bar */}
            <div className="h-1.5 bg-gradient-to-r from-indigo-400 via-purple-500 to-violet-600" />

            <div className="p-6 sm:p-8">
              {/* 아이콘 + 제목 / Icon + Title */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-50 to-purple-100 rounded-2xl flex items-center justify-center border border-purple-200 group-hover:scale-110 transition-transform duration-300">
                    <Gem className="w-7 h-7 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors">
                      Gemini 시안
                    </h2>
                    <p className="text-sm text-gray-400 mt-0.5">Collection B</p>
                  </div>
                </div>
                <span className="inline-flex items-center justify-center w-12 h-12 bg-purple-50 text-purple-700 font-bold text-lg rounded-xl border border-purple-200 group-hover:bg-purple-100 transition-colors">
                  100
                </span>
              </div>

              {/* 설명 / Description */}
              <p className="text-sm text-gray-600 mb-1 font-medium">
                클로드가 기획, 제미나이가 구현
              </p>
              <p className="text-xs text-gray-400 mb-5">
                Planned by Claude, Built by Gemini
              </p>

              {/* 메타 정보 / Meta info */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg text-xs text-gray-600 border border-gray-100">
                  <Layers className="w-3.5 h-3.5 text-gray-400" />
                  100 designs across 6 categories
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg text-xs text-gray-600 border border-gray-100">
                  <Sparkles className="w-3.5 h-3.5 text-gray-400" />
                  단일(30) + 듀얼(40) + 트리플(30)
                </span>
              </div>

              {/* 카테고리 분포 / Category breakdown */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                {categories.map((cat) => (
                  <div
                    key={cat.key}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg ${cat.bg} border ${cat.border}/50`}
                  >
                    <span className={`text-xs font-medium ${cat.color}`}>{cat.label}</span>
                    <span className={`text-xs font-bold ${cat.color}`}>{geminiCategoryCounts[cat.key]}</span>
                  </div>
                ))}
              </div>

              {/* CTA / Call to action */}
              <div className="flex items-center gap-2 text-purple-600 font-semibold text-sm group-hover:gap-3 transition-all">
                <span>컬렉션 보기 / View Collection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>

        {/* 통합 통계 섹션 / Combined Stats Section */}
        <div className="mt-12">
          <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl border border-gray-200 p-6 sm:p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              전체 통계 / Combined Statistics
            </h3>

            {/* 주요 지표 / Key metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
                <p className="text-3xl font-bold text-gray-900">132</p>
                <p className="text-xs text-gray-500 mt-1">Total Designs</p>
                <p className="text-xs text-gray-400">전체 시안</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
                <p className="text-3xl font-bold text-gray-900">6</p>
                <p className="text-xs text-gray-500 mt-1">Categories</p>
                <p className="text-xs text-gray-400">카테고리</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
                <p className="text-3xl font-bold text-gray-900">30+</p>
                <p className="text-xs text-gray-500 mt-1">Unique References</p>
                <p className="text-xs text-gray-400">고유 레퍼런스</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
                <p className="text-3xl font-bold text-gray-900">2</p>
                <p className="text-xs text-gray-500 mt-1">AI Engines</p>
                <p className="text-xs text-gray-400">AI 엔진</p>
              </div>
            </div>

            {/* 카테고리별 비교 바 / Category comparison bars */}
            <h4 className="text-sm font-semibold text-gray-700 mb-4">
              카테고리별 비교 / Category Comparison
            </h4>
            <div className="space-y-3">
              {categories.map((cat) => {
                const claudeCount = claudeCategoryCounts[cat.key];
                const geminiCount = geminiCategoryCounts[cat.key];
                const total = claudeCount + geminiCount;
                const maxTotal = 33; // 크리에이티브가 최대 (11+22=33) / creative is the max
                const claudeWidth = (claudeCount / maxTotal) * 100;
                const geminiWidth = (geminiCount / maxTotal) * 100;

                return (
                  <div key={cat.key} className="flex items-center gap-3">
                    <div className="w-24 sm:w-28 shrink-0">
                      <span className={`text-xs font-semibold ${cat.color}`}>
                        {cat.label}
                      </span>
                      <span className="text-[10px] text-gray-400 ml-1">{cat.labelEn}</span>
                    </div>
                    <div className="flex-1 flex items-center gap-1 h-7 bg-white rounded-lg border border-gray-100 overflow-hidden px-1">
                      {/* Claude 바 / Claude bar */}
                      <div
                        className="h-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded transition-all duration-500"
                        style={{ width: `${claudeWidth}%`, minWidth: claudeCount > 0 ? '16px' : '0px' }}
                        title={`Claude: ${claudeCount}`}
                      />
                      {/* Gemini 바 / Gemini bar */}
                      <div
                        className="h-4 bg-gradient-to-r from-indigo-400 to-purple-500 rounded transition-all duration-500"
                        style={{ width: `${geminiWidth}%`, minWidth: geminiCount > 0 ? '16px' : '0px' }}
                        title={`Gemini: ${geminiCount}`}
                      />
                    </div>
                    <div className="w-16 sm:w-20 shrink-0 text-right">
                      <span className="text-xs font-bold text-gray-700">{total}</span>
                      <span className="text-[10px] text-gray-400 ml-1">
                        ({claudeCount}+{geminiCount})
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 범례 / Legend */}
            <div className="flex items-center gap-6 mt-5 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-4 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-sm" />
                <span className="text-xs text-gray-500">Claude (32)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-3 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-sm" />
                <span className="text-xs text-gray-500">Gemini (100)</span>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 레퍼런스 요약 / Bottom reference summary */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-3">
            <div className="w-10 h-10 bg-cyan-50 rounded-xl flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-cyan-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-1">Batch 구성 / Batch Structure</p>
              <p className="text-xs text-gray-500">
                Claude: 3개 배치 (10+10+12)
                <br />
                Gemini: 단일(30) + 듀얼(40) + 트리플(30)
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
              <Globe className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-1">레퍼런스 / References</p>
              <p className="text-xs text-gray-500">
                국내외 30+ 플랫폼 레퍼런스
                <br />
                사람인, 토스, Airbnb, Spotify 등
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-1">공유 데이터 / Shared Data</p>
              <p className="text-xs text-gray-500">
                동일한 6개 샘플 채용공고 사용
                <br />
                MockJobPosting 인터페이스 기반
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
