'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PenTool, Users, Calendar, Zap, CheckCircle2 } from 'lucide-react';

type NavTab = 'posting' | 'applicants' | 'schedule';

export default function CompanyDashboard() {
  const [activeTab, setActiveTab] = useState<NavTab>('posting');

  const navItems = [
    { id: 'posting', label: '공고 등록', icon: PenTool },
    { id: 'applicants', label: '지원자 관리', icon: Users },
    { id: 'schedule', label: '면접 일정', icon: Calendar },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 fade-in-up">
      {/* Sidebar */}
      <div className="lg:col-span-3 space-y-6">
        {/* Company Profile Card */}
        <Card className="rounded-3xl p-6 border border-gray-100 shadow-soft text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
              alt="Company"
              className="w-full h-full rounded-2xl object-cover shadow-md"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <h3 className="text-lg font-bold text-slate-900">삼성전자 평택</h3>
          <p className="text-sm text-slate-500 mb-4">기업회원</p>
          <div className="bg-slate-50 rounded-xl p-3">
            <span className="text-xs text-slate-400 block mb-1">잔여 포인트</span>
            <span className="text-xl font-bold text-slate-800">150,000 P</span>
          </div>
        </Card>

        {/* Navigation */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as NavTab)}
                className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-left font-medium transition ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-200'
                    : 'text-slate-600 hover:bg-white hover:shadow-soft'
                }`}
              >
                <Icon size={20} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content Area */}
      <div className="lg:col-span-9">
        {activeTab === 'posting' && <PostingForm />}
        {activeTab === 'applicants' && <ApplicantsTab />}
        {activeTab === 'schedule' && <ScheduleTab />}
      </div>
    </div>
  );
}

function PostingForm() {
  return (
    <Card className="rounded-3xl shadow-soft border border-gray-100 p-8 md:p-10">
      <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">새 채용공고 등록</h2>
          <p className="text-slate-500 mt-1">상세 조건을 입력할수록 적합한 인재 매칭률이 올라갑니다.</p>
        </div>
        <div className="hidden md:block text-right">
          <span className="text-xs font-bold text-[#0284c7] bg-blue-50 px-2 py-1 rounded">TIP</span>
          <span className="text-xs text-slate-400 ml-1">사진이 포함된 공고는 조회수가 1.5배 높습니다.</span>
        </div>
      </div>

      <form className="space-y-8">
        {/* Section 1: Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-full">
            <label className="block text-sm font-bold text-slate-700 mb-2">
              공고 제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="예: [평택] 반도체 생산라인 오퍼레이터 모집 (기숙사 제공)"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#0ea5e9] focus:border-transparent transition bg-gray-50 hover:bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">모집 직무</label>
            <select className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-[#0ea5e9]">
              <option>제조/생산</option>
              <option>건설/현장</option>
              <option>서비스/식음료</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">근무 지역</label>
            <select className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-[#0ea5e9]">
              <option>경기 평택시</option>
              <option>서울 강남구</option>
            </select>
          </div>
        </div>

        {/* Section 2: Details */}
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
          <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Zap size={18} className="text-[#0ea5e9]" /> 상세 근무 조건
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">급여 정보</label>
              <div className="flex gap-2">
                <select className="w-1/3 border border-gray-200 rounded-lg text-sm py-2">
                  <option>월급</option>
                  <option>연봉</option>
                </select>
                <input
                  type="text"
                  placeholder="예: 300만원 이상"
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">근무 시간</label>
              <input
                type="text"
                placeholder="예: 09:00 - 18:00 (주 5일)"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* Visa & Language */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-slate-500 mb-2">지원 자격 (비자/언어)</label>
            <div className="flex flex-wrap gap-3">
              {['E-9 가능', 'D-2 가능', 'F-4 가능'].map((visa) => (
                <label key={visa} className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200 cursor-pointer hover:border-[#0ea5e9]">
                  <input type="checkbox" className="text-[#0ea5e9] rounded focus:ring-0" />
                  <span className="text-sm">{visa}</span>
                </label>
              ))}
              <div className="h-8 w-px bg-gray-300 mx-1"></div>
              <select className="border border-gray-200 rounded-lg text-sm py-2">
                <option>한국어 무관</option>
                <option>기초 가능자</option>
                <option>중급 이상(필수)</option>
              </select>
            </div>
          </div>

          {/* Benefits */}
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2">복리후생 및 근무환경</label>
            <div className="flex flex-wrap gap-2">
              {['🛏️ 기숙사 제공', '🍚 식사 제공', '🚌 통근버스'].map((benefit) => (
                <span
                  key={benefit}
                  className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-sm text-slate-600 cursor-pointer hover:bg-blue-50 hover:text-[#0284c7] hover:border-blue-200 transition"
                >
                  {benefit}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3">
          <Button className="flex-1 bg-[#0ea5e9] text-white font-bold py-3 rounded-xl hover:bg-[#0284c7]">
            공고 등록하기
          </Button>
          <Button variant="outline" className="flex-1 border border-gray-200 text-slate-600 font-bold py-3 rounded-xl bg-transparent">
            임시 저장
          </Button>
        </div>
      </form>
    </Card>
  );
}

function ApplicantsTab() {
  return (
    <Card className="rounded-3xl shadow-soft border border-gray-100 p-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">지원자 관리</h2>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {String.fromCharCode(64 + i)}
              </div>
              <div>
                <p className="font-semibold text-slate-900">지원자 {i}</p>
                <p className="text-sm text-slate-500">반도체 생산라인 오퍼레이터</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="bg-[#0ea5e9] text-white hover:bg-[#0284c7]">
                서류 검토
              </Button>
              <Button size="sm" variant="outline">
                거절
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function ScheduleTab() {
  return (
    <Card className="rounded-3xl shadow-soft border border-gray-100 p-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">면접 일정</h2>
      <div className="space-y-4">
        {[
          { date: '2024-01-25', time: '14:00', candidate: '이순신', position: '생산라인 오퍼레이터' },
          { date: '2024-01-26', time: '10:00', candidate: '세종대왕', position: '안전관리자' },
          { date: '2024-01-27', time: '15:30', candidate: '김홍도', position: '주방 스태프' },
        ].map((schedule, i) => (
          <div key={i} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-blue-50 hover:bg-blue-100 transition">
            <div>
              <p className="font-semibold text-slate-900">{schedule.candidate}</p>
              <p className="text-sm text-slate-600">{schedule.position}</p>
              <p className="text-xs text-slate-500 mt-1">
                {schedule.date} {schedule.time}
              </p>
            </div>
            <CheckCircle2 size={24} className="text-green-500" />
          </div>
        ))}
      </div>
    </Card>
  );
}
