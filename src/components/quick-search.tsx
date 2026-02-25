'use client';

import { Search } from 'lucide-react';

/**
 * 사라민 스타일 가로형 검색바
 * 로그인 폼과 동일한 입력 스타일 (rounded-xl, border-slate-200, focus:border-sky-500)
 */
export default function QuickSearch() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-3 flex flex-col sm:flex-row gap-2">
      {/* Search text input */}
      <div className="relative flex-1 min-w-0">
        <Search size={15} className="absolute left-3 top-3.5 text-slate-400" />
        <input
          type="text"
          placeholder="직무, 회사명 검색"
          className="w-full pl-9 pr-3 py-3 text-sm border border-slate-200 rounded-xl focus:border-sky-500 outline-none transition text-slate-800 bg-slate-50 focus:bg-white"
        />
      </div>

      {/* Region */}
      <select className="px-3 py-3 text-sm border border-slate-200 rounded-xl focus:border-sky-500 outline-none bg-slate-50 focus:bg-white text-slate-600 cursor-pointer transition min-w-[110px]">
        <option value="">전국</option>
        <option value="서울">서울</option>
        <option value="경기/인천">경기/인천</option>
        <option value="부산">부산</option>
        <option value="대구">대구</option>
      </select>

      {/* Visa type */}
      <select className="px-3 py-3 text-sm border border-slate-200 rounded-xl focus:border-sky-500 outline-none bg-slate-50 focus:bg-white text-slate-600 cursor-pointer transition min-w-[140px]">
        <option value="">비자 무관</option>
        <option value="E-9">E-9 (비전문취업)</option>
        <option value="E-7">E-7 (특정활동)</option>
        <option value="D-2">D-2 (유학)</option>
        <option value="F-2">F-2 (거주)</option>
        <option value="F-4">F-4 (재외동포)</option>
      </select>

      {/* CTA */}
      <button className="px-7 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition text-sm shadow-sm whitespace-nowrap">
        일자리 찾기
      </button>
    </div>
  );
}
