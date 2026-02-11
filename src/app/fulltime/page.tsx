'use client';

import Header from '@/components/header';
import Footer from '@/components/footer';
import { useState } from 'react';
import { Search, MapPin, Building2, Briefcase } from 'lucide-react';

export default function FulltimePage() {
  const [isCompanyMode, setIsCompanyMode] = useState(false);

  const exampleJobs = [
    { id: 1, title: 'IT 개발자 (외국인 채용)', company: '테크스타트업', location: '서울 강남구', salary: '연봉 3,500~5,000만원', tag: 'E-7 비자' },
    { id: 2, title: '무역 사무원', company: '글로벌트레이드', location: '서울 중구', salary: '연봉 3,000~3,500만원', tag: '한국어 필수' },
    { id: 3, title: '제조업 생산직', company: '삼성전기 협력사', location: '경기 수원시', salary: '월급 280~320만원', tag: 'E-9 비자' },
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
          <h1 className="text-2xl font-bold text-gray-900">정규직 채용관</h1>
          <p className="text-gray-500 mt-1">외국인 정규직 채용 공고를 확인하세요</p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-8">
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="직종, 회사명으로 검색"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                disabled
              />
            </div>
            <select className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-500" disabled>
              <option>지역 선택</option>
            </select>
            <select className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-500" disabled>
              <option>비자 유형</option>
            </select>
            <button className="px-6 py-2.5 bg-sky-500 text-white rounded-lg text-sm font-medium opacity-50 cursor-not-allowed">
              검색
            </button>
          </div>
        </div>

        {/* Preparing Notice */}
        <div className="bg-sky-50 border border-sky-200 rounded-xl p-6 mb-8 text-center">
          <Building2 className="w-10 h-10 text-sky-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-sky-700">정규직 채용 서비스 준비중</h3>
          <p className="text-sky-600 mt-1 text-sm">곧 외국인 정규직 채용 공고들이 업데이트됩니다.</p>
        </div>

        {/* Example Cards */}
        <h2 className="text-lg font-semibold text-gray-900 mb-4">공고 예시</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {exampleJobs.map((job) => (
            <div key={job.id} className="bg-white rounded-xl border border-gray-200 p-5 opacity-60">
              <div className="flex items-start justify-between mb-3">
                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded">{job.tag}</span>
                <span className="text-xs text-gray-400">정규직</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{job.title}</h3>
              <p className="text-sm text-gray-500 mb-3">{job.company}</p>
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{job.salary}</span>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
