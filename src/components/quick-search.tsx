'use client';

import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export default function QuickSearch() {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-soft flex flex-col justify-center border border-gray-100">
      <h3 className="text-xl font-bold text-slate-800 mb-6">맞춤 일자리 검색</h3>
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search size={18} className="absolute left-4 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="직무, 회사명 검색"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-slate-800 focus:ring-2 focus:ring-[#0ea5e9] focus:border-transparent transition"
          />
        </div>

        {/* Selects */}
        <div className="grid grid-cols-2 gap-3">
          <select className="bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-slate-600 text-sm focus:ring-2 focus:ring-[#0ea5e9] cursor-pointer">
            <option>전국</option>
            <option>서울</option>
            <option>경기/인천</option>
          </select>
          <select className="bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-slate-600 text-sm focus:ring-2 focus:ring-[#0ea5e9] cursor-pointer">
            <option>비자 무관</option>
            <option>E-9 (비전문)</option>
            <option>E-7 (전문)</option>
            <option>D-2 (유학)</option>
          </select>
        </div>

        {/* Search Button */}
        <Button className="w-full bg-[#0284c7] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 hover:bg-[#0369a1] transition">
          일자리 찾기
        </Button>
      </div>
    </div>
  );
}
