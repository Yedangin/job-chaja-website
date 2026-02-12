'use client';

import { Search } from 'lucide-react';

export default function QuickSearch() {
  return (
    <div className="dashboard-card p-5 flex flex-col justify-center">
      <h3 className="text-base font-bold text-gray-900 mb-4">맞춤 일자리 검색</h3>
      <div className="space-y-3">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="직무, 회사명 검색"
            className="w-full border border-gray-200 rounded-md py-2.5 pl-9 pr-3 text-sm text-gray-800 focus:border-blue-500 outline-none transition"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <select className="border border-gray-200 rounded-md py-2.5 px-3 text-gray-600 text-sm focus:border-blue-500 outline-none cursor-pointer">
            <option>전국</option>
            <option>서울</option>
            <option>경기/인천</option>
          </select>
          <select className="border border-gray-200 rounded-md py-2.5 px-3 text-gray-600 text-sm focus:border-blue-500 outline-none cursor-pointer">
            <option>비자 무관</option>
            <option>E-9 (비전문)</option>
            <option>E-7 (전문)</option>
            <option>D-2 (유학)</option>
          </select>
        </div>
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-md transition">
          일자리 찾기
        </button>
      </div>
    </div>
  );
}
