'use client';

import Header from '@/components/header';
import Footer from '@/components/footer';
import { useState } from 'react';
import { FileText, Globe, BookOpen, Shield } from 'lucide-react';

export default function RecruitInfoPage() {
  const [isCompanyMode, setIsCompanyMode] = useState(false);

  const infoCategories = [
    {
      icon: Globe,
      title: '비자 가이드',
      description: '한국 취업비자 종류와 신청 방법 안내',
      items: ['E-7 특정활동 비자', 'E-9 비전문취업 비자', 'H-2 방문취업 비자', 'F-2 거주비자'],
      color: 'sky',
    },
    {
      icon: FileText,
      title: '이력서 작성 가이드',
      description: '한국 기업 이력서 작성 팁',
      items: ['한국식 이력서 양식', '자기소개서 작성법', '면접 준비 가이드', '포트폴리오 작성'],
      color: 'emerald',
    },
    {
      icon: Shield,
      title: '근로자 권리',
      description: '외국인 근로자가 알아야 할 법적 권리',
      items: ['최저임금 안내', '근로계약서 체크리스트', '산업재해 보상', '퇴직금 규정'],
      color: 'amber',
    },
    {
      icon: BookOpen,
      title: '생활 정보',
      description: '한국 생활 적응을 위한 유용한 정보',
      items: ['외국인 등록 절차', '건강보험 가입', '은행 계좌 개설', '주거지 찾기'],
      color: 'purple',
    },
  ];

  const colorMap: Record<string, { bg: string; text: string; iconBg: string }> = {
    sky: { bg: 'bg-sky-50', text: 'text-sky-700', iconBg: 'bg-sky-100' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', iconBg: 'bg-emerald-100' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-700', iconBg: 'bg-amber-100' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-700', iconBg: 'bg-purple-100' },
  };

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Header
        isCompanyMode={isCompanyMode}
        onToggleMode={() => setIsCompanyMode(!isCompanyMode)}
        onLogoClick={() => setIsCompanyMode(false)}
      />

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">채용정보</h1>
          <p className="text-gray-500 mt-1">외국인 취업에 필요한 정보를 제공합니다</p>
        </div>

        {/* Info Notice */}
        <div className="bg-sky-50 border border-sky-200 rounded-xl p-6 mb-8 text-center">
          <BookOpen className="w-10 h-10 text-sky-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-sky-700">채용 정보 콘텐츠 준비중</h3>
          <p className="text-sky-600 mt-1 text-sm">더 알찬 정보로 곧 찾아뵙겠습니다.</p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {infoCategories.map((cat, idx) => {
            const colors = colorMap[cat.color];
            const Icon = cat.icon;
            return (
              <div key={idx} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 ${colors.iconBg} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${colors.text}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{cat.title}</h3>
                    <p className="text-xs text-gray-500">{cat.description}</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {cat.items.map((item, i) => (
                    <li key={i} className={`${colors.bg} rounded-lg px-4 py-2.5 text-sm ${colors.text} opacity-70`}>
                      {item}
                      <span className="text-xs opacity-60 ml-2">(준비중)</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
