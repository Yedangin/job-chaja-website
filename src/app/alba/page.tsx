'use client';

import Header from '@/components/header';
import Footer from '@/components/footer';
import { useState } from 'react';
import { Search, MapPin, Clock, Briefcase } from 'lucide-react';

export default function AlbaPage() {
  const [isCompanyMode, setIsCompanyMode] = useState(false);

  const exampleJobs = [
    { id: 1, title: '편의점 야간 알바', company: 'CU 강남역점', location: '서울 강남구', pay: '시급 12,000원', type: '야간', tag: '즉시채용' },
    { id: 2, title: '음식점 서빙 알바', company: '이자카야 신촌점', location: '서울 마포구', pay: '시급 11,500원', type: '주말', tag: '외국인 가능' },
    { id: 3, title: '물류센터 포장 알바', company: '쿠팡 로지스틱스', location: '경기 이천시', pay: '시급 13,000원', type: '단기', tag: '숙소제공' },
  ];

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
          <h1 className="text-2xl font-bold text-gray-900">알바채용관</h1>
          <p className="text-gray-500 mt-1">외국인이 지원 가능한 알바 공고를 모아봤어요</p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-8">
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="검색어를 입력하세요"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                disabled
              />
            </div>
            <select className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-500" disabled>
              <option>지역 선택</option>
            </select>
            <select className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-500" disabled>
              <option>업종 선택</option>
            </select>
            <button className="px-6 py-2.5 bg-sky-500 text-white rounded-lg text-sm font-medium opacity-50 cursor-not-allowed">
              검색
            </button>
          </div>
        </div>

        {/* Preparing Notice */}
        <div className="bg-sky-50 border border-sky-200 rounded-xl p-6 mb-8 text-center">
          <Briefcase className="w-10 h-10 text-sky-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-sky-700">알바 공고 서비스 준비중</h3>
          <p className="text-sky-600 mt-1 text-sm">곧 외국인이 지원 가능한 알바 공고들이 업데이트됩니다.</p>
        </div>

        {/* Example Cards */}
        <h2 className="text-lg font-semibold text-gray-900 mb-4">공고 예시</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {exampleJobs.map((job) => (
            <div key={job.id} className="bg-white rounded-xl border border-gray-200 p-5 opacity-60">
              <div className="flex items-start justify-between mb-3">
                <span className="px-2 py-1 bg-sky-100 text-sky-700 text-xs font-medium rounded">{job.tag}</span>
                <span className="text-xs text-gray-400">{job.type}</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{job.title}</h3>
              <p className="text-sm text-gray-500 mb-3">{job.company}</p>
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{job.pay}</span>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
