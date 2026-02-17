'use client';

// KOR: 디스코드 서버 스타일 비자 진단 페이지 (디자인 #65)
// ENG: Discord Server-style visa diagnosis page (Design #65)

import React, { useState } from 'react';
import {
  popularCountries, educationOptions, goalOptions, priorityOptions, fundOptions,
  mockDiagnosisResult, mockInput, DiagnosisInput, DiagnosisResult, RecommendedPathway,
  getScoreColor, getFeasibilityEmoji, mockPathways, CompatPathway,
} from '../_mock/diagnosis-mock-data';
import {
  Hash, Volume2, ChevronDown, ChevronRight, Pin, Users, Bell, Settings, Search,
  Plus, Mic, Headphones, Shield, Star, Globe, BookOpen, Briefcase, Award,
  MessageCircle, Send, CheckCircle, ArrowRight, Sparkles, Lock,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// KOR: 채널 카테고리 및 스텝 정의
//      디스코드 서버 채널 목록처럼 카테고리 구조로 단계 구성
// ENG: Channel categories and step definitions
//      Steps organized in Discord-like channel category structure
// ─────────────────────────────────────────────────────────────
const CHANNEL_CATEGORIES = [
  {
    id: 'cat-info',
    name: '정보 입력 / INPUT',
    channels: [
      { id: 'ch-nationality', name: '국적-선택', icon: Globe, step: 1 },
      { id: 'ch-profile', name: '기본-프로필', icon: Users, step: 2 },
      { id: 'ch-education', name: '학력-정보', icon: BookOpen, step: 3 },
      { id: 'ch-fund', name: '자금-계획', icon: Award, step: 4 },
    ],
  },
  {
    id: 'cat-goals',
    name: '목표 설정 / GOALS',
    channels: [
      { id: 'ch-goal', name: '최종-목표', icon: Star, step: 5 },
      { id: 'ch-priority', name: '우선순위', icon: Shield, step: 6 },
    ],
  },
  {
    id: 'cat-results',
    name: '비자 결과 / RESULTS',
    channels: [
      { id: 'ch-analysis', name: '매칭-분석', icon: Sparkles, step: 7 },
      { id: 'ch-paths', name: '비자-경로', icon: Briefcase, step: 8 },
    ],
  },
];

// KOR: 서버 멤버 (데코레이션) / ENG: Server members (decoration)
const SERVER_MEMBERS = [
  { name: 'VisaBot', role: '관리자', color: 'text-purple-400', online: true },
  { name: 'JobChaJa', role: '서버주인', color: 'text-yellow-400', online: true },
  { name: '비자전문가', role: '멘토', color: 'text-green-400', online: true },
  { name: 'E7-Expert', role: '전문인력팀', color: 'text-blue-400', online: false },
  { name: 'F2Guide', role: '거주비자팀', color: 'text-pink-400', online: false },
];

// KOR: 실현가능성 배지 스타일 / ENG: Feasibility badge styles
const FEASIBILITY_BADGE: Record<string, string> = {
  '높음': 'text-green-400 bg-green-900/40 border-green-600',
  '보통': 'text-yellow-400 bg-yellow-900/40 border-yellow-600',
  '낮음': 'text-orange-400 bg-orange-900/40 border-orange-600',
  '매우낮음': 'text-red-400 bg-red-900/40 border-red-600',
};

export default function Diagnosis65Page() {
  // KOR: 페이지 상태 / ENG: Page state
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [activeChannel, setActiveChannel] = useState<string>('ch-nationality');
  const [collapsedCats, setCollapsedCats] = useState<Set<string>>(new Set());
  const [expandedPath, setExpandedPath] = useState<string | null>(null);
  const [pinnedMsg, setPinnedMsg] = useState<boolean>(true);
  const [input, setInput] = useState<Partial<DiagnosisInput>>({});
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  const toggleCat = (id: string) => setCollapsedCats(prev => {
    const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n;
  });

  const goToNext = () => {
    const next = currentStep + 1;
    setCurrentStep(next);
    for (const cat of CHANNEL_CATEGORIES)
      for (const ch of cat.channels)
        if (ch.step === next) { setActiveChannel(ch.id); return; }
  };

  const runDiagnosis = () => { setResult(mockDiagnosisResult); setCurrentStep(8); setActiveChannel('ch-paths'); };
  const updateInput = (field: keyof DiagnosisInput, value: string | number) =>
    setInput(prev => ({ ...prev, [field]: value }));

  const getCurrentChannelName = (): string => {
    for (const cat of CHANNEL_CATEGORIES)
      for (const ch of cat.channels)
        if (ch.id === activeChannel) return ch.name;
    return 'welcome';
  };

  const renderContent = () => {
    if (activeChannel === 'ch-nationality') return <NationalityChannel input={input} updateInput={updateInput} onNext={goToNext} />;
    if (activeChannel === 'ch-profile') return <ProfileChannel input={input} updateInput={updateInput} onNext={goToNext} />;
    if (activeChannel === 'ch-education') return <EducationChannel input={input} updateInput={updateInput} onNext={goToNext} />;
    if (activeChannel === 'ch-fund') return <FundChannel input={input} updateInput={updateInput} onNext={goToNext} />;
    if (activeChannel === 'ch-goal') return <GoalChannel input={input} updateInput={updateInput} onNext={goToNext} />;
    if (activeChannel === 'ch-priority') return <PriorityChannel input={input} updateInput={updateInput} onNext={runDiagnosis} />;
    if (activeChannel === 'ch-analysis') return result ? <AnalysisChannel result={result} /> : <LockedChannel />;
    if (activeChannel === 'ch-paths') return result ? <PathsChannel result={result} expandedPath={expandedPath} setExpandedPath={setExpandedPath} /> : <LockedChannel />;
    return <LockedChannel />;
  };

  return (
    // KOR: 전체 디스코드 3단 레이아웃 / ENG: Discord 3-column layout
    <div className="flex h-screen bg-[#202225] text-gray-100 font-sans overflow-hidden">

      {/* 서버 아이콘 사이드바 / Server icon sidebar */}
      <div className="w-[72px] bg-[#202225] flex flex-col items-center py-3 gap-2 shrink-0">
        <div className="w-12 h-12 rounded-2xl bg-[#5865F2] flex items-center justify-center cursor-pointer hover:rounded-xl transition-all shrink-0">
          <span className="text-white font-bold text-lg">JC</span>
        </div>
        <div className="w-8 h-0.5 bg-[#36393F] rounded-full shrink-0" />
        {['🎓', '💼', '🌏'].map((e, i) => (
          <div key={i} className="w-12 h-12 rounded-full bg-[#36393F] flex items-center justify-center cursor-pointer hover:rounded-xl hover:bg-[#5865F2] transition-all text-lg shrink-0">{e}</div>
        ))}
        <div className="w-12 h-12 rounded-full bg-[#36393F] flex items-center justify-center cursor-pointer hover:rounded-xl hover:bg-green-500 transition-all shrink-0">
          <Plus size={24} className="text-green-400" />
        </div>
      </div>

      {/* 채널 사이드바 / Channel sidebar */}
      <div className="w-60 bg-[#2F3136] flex flex-col shrink-0">
        <div className="h-12 px-4 flex items-center justify-between border-b border-[#202225] hover:bg-[#34373C] cursor-pointer shrink-0">
          <span className="text-white font-bold text-sm truncate">잡차자 비자 서버</span>
          <ChevronDown size={16} className="text-gray-400" />
        </div>
        <div className="flex-1 overflow-y-auto py-2 px-2">
          {CHANNEL_CATEGORIES.map(cat => (
            <div key={cat.id} className="mb-1">
              <button onClick={() => toggleCat(cat.id)} className="w-full flex items-center gap-1 px-1 py-1 text-xs font-semibold text-gray-400 hover:text-gray-200 uppercase tracking-wider">
                {collapsedCats.has(cat.id) ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
                {cat.name}
              </button>
              {!collapsedCats.has(cat.id) && (
                <div className="space-y-0.5 mt-1">
                  {cat.channels.map(ch => {
                    const locked = ch.step > currentStep + 1;
                    const isActive = activeChannel === ch.id;
                    return (
                      <button key={ch.id} onClick={() => !locked && setActiveChannel(ch.id)}
                        className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors ${isActive ? 'bg-[#393C43] text-white' : locked ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:bg-[#34373C] hover:text-gray-200 cursor-pointer'}`}>
                        {locked ? <Lock size={14} className="text-gray-600 shrink-0" /> : <Hash size={14} className="shrink-0" />}
                        <span className="truncate flex-1 text-left">{ch.name}</span>
                        {ch.step <= currentStep && !locked && <CheckCircle size={12} className="text-green-500 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
          <div className="mt-4">
            <div className="flex items-center gap-1 px-1 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              <ChevronDown size={12} /> 음성 / VOICE
            </div>
            <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm text-gray-400 hover:bg-[#34373C]">
              <Volume2 size={14} className="shrink-0" /><span className="truncate">비자상담실</span>
            </button>
          </div>
        </div>
        {/* 유저 패널 / User panel */}
        <div className="h-14 bg-[#292B2F] flex items-center px-2 gap-2 shrink-0">
          <div className="w-8 h-8 rounded-full bg-[#5865F2] flex items-center justify-center shrink-0">
            <span className="text-xs text-white font-bold">나</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-white truncate">구직자#1234</div>
            <div className="text-xs text-green-400">온라인</div>
          </div>
          <div className="flex gap-1 shrink-0">
            <button className="p-1 text-gray-400 hover:text-gray-200"><Mic size={14} /></button>
            <button className="p-1 text-gray-400 hover:text-gray-200"><Headphones size={14} /></button>
            <button className="p-1 text-gray-400 hover:text-gray-200"><Settings size={14} /></button>
          </div>
        </div>
      </div>

      {/* 메인 채팅 영역 / Main chat area */}
      <div className="flex-1 flex flex-col bg-[#36393F] overflow-hidden min-w-0">
        <div className="h-12 px-4 flex items-center justify-between border-b border-[#202225] shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <Hash size={20} className="text-gray-400 shrink-0" />
            <span className="text-white font-semibold text-sm truncate">{getCurrentChannelName()}</span>
            <span className="text-gray-400 text-xs hidden md:block shrink-0">| 비자 경로 자동 분석</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400 shrink-0">
            <button className="hover:text-gray-200 hidden sm:block"><Bell size={18} /></button>
            <button className="hover:text-gray-200 hidden sm:block"><Pin size={18} /></button>
            <button className="hover:text-gray-200"><Users size={18} /></button>
            <div className="flex items-center gap-1 bg-[#202225] rounded px-2 py-1">
              <Search size={14} />
              <input readOnly placeholder="검색" className="bg-transparent text-xs text-gray-300 outline-none w-16 placeholder-gray-500" />
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* 핀 메시지 / Pinned message */}
          {pinnedMsg && activeChannel === 'ch-nationality' && (
            <div className="bg-[#2F3136] border-l-4 border-[#5865F2] rounded p-3 flex items-start gap-3">
              <Pin size={16} className="text-[#5865F2] mt-0.5 shrink-0" />
              <div className="flex-1">
                <div className="text-xs text-[#5865F2] font-semibold mb-1">📌 고정 메시지 | Pinned</div>
                <p className="text-sm text-gray-300">잡차자 비자 진단 서버에 오신 것을 환영합니다! 채널을 순서대로 작성하시면 최적 비자 경로를 자동 분석합니다. 🎉</p>
              </div>
              <button onClick={() => setPinnedMsg(false)} className="text-gray-500 hover:text-gray-300 text-xs shrink-0">✕</button>
            </div>
          )}
          {/* 채널 환영 / Channel welcome */}
          <div className="flex items-center gap-3 py-4 border-b border-[#40444B]">
            <div className="w-14 h-14 rounded-full bg-[#5865F2] flex items-center justify-center shrink-0">
              <Hash size={26} className="text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">#{getCurrentChannelName()} 에 오신 것을 환영합니다!</h2>
              <p className="text-gray-400 text-sm">아래 양식을 채워 다음 채널로 이동하세요.</p>
            </div>
          </div>
          {renderContent()}
        </div>
        <div className="px-4 pb-4 shrink-0">
          <div className="bg-[#40444B] rounded-lg flex items-center gap-2 px-4 py-3">
            <Plus size={20} className="text-gray-400 shrink-0" />
            <span className="flex-1 text-sm text-gray-500">#{getCurrentChannelName()} 채널에 메시지 보내기</span>
            <div className="flex gap-2 text-gray-400 shrink-0"><MessageCircle size={18} /><Send size={18} /></div>
          </div>
        </div>
      </div>

      {/* 멤버 사이드바 / Member sidebar */}
      <div className="w-60 bg-[#2F3136] hidden lg:flex flex-col shrink-0">
        <div className="p-3 flex-1 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">온라인 — {SERVER_MEMBERS.filter(m => m.online).length}명</p>
          {SERVER_MEMBERS.filter(m => m.online).map((m, i) => (
            <div key={i} className="flex items-center gap-2 py-1.5 px-1 rounded hover:bg-[#34373C] cursor-pointer">
              <div className="relative shrink-0">
                <div className="w-8 h-8 rounded-full bg-[#202225] flex items-center justify-center text-sm text-white">{m.name[0]}</div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#2F3136]" />
              </div>
              <div className="min-w-0">
                <div className={`text-sm font-medium truncate ${m.color}`}>{m.name}</div>
                <div className="text-xs text-gray-500 truncate">{m.role}</div>
              </div>
            </div>
          ))}
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-4">오프라인 — {SERVER_MEMBERS.filter(m => !m.online).length}명</p>
          {SERVER_MEMBERS.filter(m => !m.online).map((m, i) => (
            <div key={i} className="flex items-center gap-2 py-1.5 px-1 rounded hover:bg-[#34373C] cursor-pointer opacity-50">
              <div className="relative shrink-0">
                <div className="w-8 h-8 rounded-full bg-[#202225] flex items-center justify-center text-sm text-white">{m.name[0]}</div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-gray-600 rounded-full border-2 border-[#2F3136]" />
              </div>
              <div className="min-w-0">
                <div className={`text-sm font-medium truncate ${m.color}`}>{m.name}</div>
                <div className="text-xs text-gray-500 truncate">{m.role}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-3 border-t border-[#202225] shrink-0">
          <p className="text-xs text-gray-400 mb-2">진단 진행률 / Progress</p>
          <div className="w-full bg-[#202225] rounded-full h-2">
            <div className="bg-[#5865F2] h-2 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (Math.min(currentStep, 6) / 6) * 100)}%` }} />
          </div>
          <p className="text-xs text-gray-500 mt-1">{Math.min(6, currentStep)}/6 단계 완료</p>
        </div>
      </div>
    </div>
  );
}

// KOR: 잠긴 채널 / ENG: Locked channel
function LockedChannel() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Lock size={48} className="text-gray-600 mb-4" />
      <p className="text-gray-400 font-semibold">이 채널은 잠겨 있습니다</p>
      <p className="text-gray-600 text-sm mt-1">이전 단계를 먼저 완료해주세요.</p>
    </div>
  );
}

// KOR: 봇 메시지 래퍼 / ENG: Bot message wrapper
function BotMessage({ children, label = 'VisaBot' }: { children: React.ReactNode; label?: string }) {
  return (
    <div className="flex gap-3 mb-4">
      <div className="w-10 h-10 rounded-full bg-[#5865F2] flex items-center justify-center shrink-0 mt-0.5">
        <span className="text-white text-xs font-bold">VB</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1 flex-wrap">
          <span className="text-[#5865F2] font-semibold text-sm">{label}</span>
          <span className="text-gray-500 text-xs">오늘</span>
          <span className="text-xs text-[#5865F2] bg-[#5865F2]/10 px-1.5 py-0.5 rounded font-medium">봇</span>
        </div>
        {children}
      </div>
    </div>
  );
}

// KOR: 다음 버튼 공통 / ENG: Common next button
function NextBtn({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className="flex items-center gap-2 px-4 py-2 bg-[#5865F2] hover:bg-[#4752C4] disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded text-sm font-medium transition-colors mt-4">
      다음 채널로 <ArrowRight size={14} />
    </button>
  );
}

// KOR: 국적 선택 채널 / ENG: Nationality selection channel
function NationalityChannel({ input, updateInput, onNext }: { input: Partial<DiagnosisInput>; updateInput: (f: keyof DiagnosisInput, v: string | number) => void; onNext: () => void }) {
  return (
    <BotMessage>
      <p className="text-gray-300 text-sm mb-4"><strong className="text-white">국적</strong>을 선택해주세요. 국가별 비자 쿼터와 협정이 다릅니다.</p>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
        {popularCountries.map(c => (
          <button key={c.code} onClick={() => updateInput('nationality', c.code)}
            className={`flex items-center gap-2 px-3 py-2 rounded text-sm border transition-colors ${input.nationality === c.code ? 'bg-[#5865F2] border-[#5865F2] text-white' : 'bg-[#2F3136] border-[#40444B] text-gray-300 hover:border-[#5865F2]'}`}>
            <span className="text-base">{c.flag}</span>
            <span className="truncate text-xs">{c.nameKo}</span>
          </button>
        ))}
      </div>
      {input.nationality && (
        <div className="bg-[#2F3136] border border-[#5865F2]/30 rounded p-3 mb-2 flex items-center gap-2">
          <CheckCircle size={16} className="text-[#5865F2] shrink-0" />
          <span className="text-sm text-gray-300">선택: <strong className="text-white">{popularCountries.find(c => c.code === input.nationality)?.nameKo ?? input.nationality}</strong></span>
        </div>
      )}
      <NextBtn disabled={!input.nationality} onClick={onNext} />
    </BotMessage>
  );
}

// KOR: 기본 프로필 채널 (나이) / ENG: Profile channel (age)
function ProfileChannel({ input, updateInput, onNext }: { input: Partial<DiagnosisInput>; updateInput: (f: keyof DiagnosisInput, v: string | number) => void; onNext: () => void }) {
  return (
    <BotMessage>
      <p className="text-gray-300 text-sm mb-4"><strong className="text-white">만 나이</strong>를 입력해주세요. 청년 특례 비자 여부에 영향을 줍니다.</p>
      <div className="bg-[#2F3136] rounded-lg p-4 mb-2">
        <label className="text-xs text-gray-400 uppercase tracking-wider mb-3 block">나이 / Age</label>
        <div className="flex items-center gap-3 mb-4">
          <input type="number" min={18} max={65} value={input.age ?? ''} onChange={e => updateInput('age', parseInt(e.target.value) || 0)} placeholder="예: 24"
            className="w-28 bg-[#202225] text-white px-3 py-2 rounded text-sm outline-none focus:ring-1 focus:ring-[#5865F2]" />
          <span className="text-gray-400 text-sm">세</span>
          {input.age && input.age <= 30 && <span className="px-2 py-1 bg-blue-900/40 border border-blue-600 text-blue-400 rounded text-xs">청년 특례</span>}
        </div>
        <input type="range" min={18} max={65} value={input.age ?? 24} onChange={e => updateInput('age', parseInt(e.target.value))} className="w-full accent-[#5865F2]" />
        <div className="flex justify-between text-xs text-gray-500 mt-1"><span>18세</span><span className="text-[#5865F2] font-semibold">{input.age ?? 24}세</span><span>65세</span></div>
      </div>
      <NextBtn disabled={!input.age} onClick={onNext} />
    </BotMessage>
  );
}

// KOR: 학력 채널 / ENG: Education channel
function EducationChannel({ input, updateInput, onNext }: { input: Partial<DiagnosisInput>; updateInput: (f: keyof DiagnosisInput, v: string | number) => void; onNext: () => void }) {
  return (
    <BotMessage>
      <p className="text-gray-300 text-sm mb-4"><strong className="text-white">학력</strong>을 선택해주세요. E-7 전문직 비자는 학사 이상을 요구합니다.</p>
      <div className="space-y-2 mb-2">
        {educationOptions.map(edu => (
          <button key={edu.value} onClick={() => updateInput('educationLevel', edu.value)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-left border transition-colors ${input.educationLevel === edu.value ? 'bg-[#5865F2]/20 border-[#5865F2] text-white' : 'bg-[#2F3136] border-[#40444B] text-gray-300 hover:border-[#5865F2]/50'}`}>
            <span className="text-lg shrink-0">{edu.emoji}</span>
            <div className="flex-1 min-w-0"><div className="font-medium">{edu.labelKo}</div><div className="text-xs text-gray-400">{edu.labelEn}</div></div>
            {edu.value === 'bachelor' && <span className="px-2 py-0.5 bg-blue-900/40 border border-blue-600 text-blue-400 rounded text-xs shrink-0">E-7</span>}
            {edu.value === 'master' && <span className="px-2 py-0.5 bg-purple-900/40 border border-purple-600 text-purple-400 rounded text-xs shrink-0">E-3</span>}
            {input.educationLevel === edu.value && <CheckCircle size={16} className="text-[#5865F2] shrink-0" />}
          </button>
        ))}
      </div>
      <NextBtn disabled={!input.educationLevel} onClick={onNext} />
    </BotMessage>
  );
}

// KOR: 자금 채널 / ENG: Fund channel
function FundChannel({ input, updateInput, onNext }: { input: Partial<DiagnosisInput>; updateInput: (f: keyof DiagnosisInput, v: string | number) => void; onNext: () => void }) {
  return (
    <BotMessage>
      <p className="text-gray-300 text-sm mb-4">연간 <strong className="text-white">가용 자금</strong>을 선택해주세요. 유학비·생활비·비자수수료 포함 총 예산입니다.</p>
      <div className="space-y-2 mb-2">
        {fundOptions.map(f => (
          <button key={f.value} onClick={() => updateInput('availableAnnualFund', f.value)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm border transition-colors ${input.availableAnnualFund === f.value ? 'bg-[#5865F2]/20 border-[#5865F2] text-white' : 'bg-[#2F3136] border-[#40444B] text-gray-300 hover:border-[#5865F2]/50'}`}>
            <div><div className="font-medium">{f.labelKo}</div><div className="text-xs text-gray-400">{f.labelEn}</div></div>
            {input.availableAnnualFund === f.value && <CheckCircle size={16} className="text-[#5865F2]" />}
          </button>
        ))}
      </div>
      <NextBtn disabled={input.availableAnnualFund === undefined} onClick={onNext} />
    </BotMessage>
  );
}

// KOR: 목표 채널 / ENG: Goal channel
function GoalChannel({ input, updateInput, onNext }: { input: Partial<DiagnosisInput>; updateInput: (f: keyof DiagnosisInput, v: string | number) => void; onNext: () => void }) {
  return (
    <BotMessage>
      <p className="text-gray-300 text-sm mb-4">한국에서의 <strong className="text-white">최종 목표</strong>를 선택해주세요.</p>
      <div className="space-y-2 mb-2">
        {goalOptions.map(g => (
          <button key={g.value} onClick={() => updateInput('finalGoal', g.value)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-left border transition-colors ${input.finalGoal === g.value ? 'bg-[#5865F2]/20 border-[#5865F2] text-white' : 'bg-[#2F3136] border-[#40444B] text-gray-300 hover:border-[#5865F2]/50'}`}>
            <span className="text-xl shrink-0">{g.emoji}</span>
            <div className="flex-1 min-w-0"><div className="font-medium">{g.labelKo}</div><div className="text-xs text-gray-400">{g.descKo}</div></div>
            {input.finalGoal === g.value && <CheckCircle size={16} className="text-[#5865F2] shrink-0" />}
          </button>
        ))}
      </div>
      <NextBtn disabled={!input.finalGoal} onClick={onNext} />
    </BotMessage>
  );
}

// KOR: 우선순위 채널 (마지막 입력) / ENG: Priority channel (final input)
function PriorityChannel({ input, updateInput, onNext }: { input: Partial<DiagnosisInput>; updateInput: (f: keyof DiagnosisInput, v: string | number) => void; onNext: () => void }) {
  return (
    <BotMessage>
      <p className="text-gray-300 text-sm mb-4">마지막 질문입니다! <strong className="text-white">우선순위</strong>를 선택해주세요.</p>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {priorityOptions.map(p => (
          <button key={p.value} onClick={() => updateInput('priorityPreference', p.value)}
            className={`flex flex-col items-center gap-2 p-4 rounded-lg text-sm border transition-colors ${input.priorityPreference === p.value ? 'bg-[#5865F2]/20 border-[#5865F2] text-white' : 'bg-[#2F3136] border-[#40444B] text-gray-300 hover:border-[#5865F2]/50'}`}>
            <span className="text-2xl">{p.emoji}</span>
            <div className="text-center"><div className="font-medium text-xs">{p.labelKo}</div><div className="text-xs text-gray-500">{p.descKo}</div></div>
          </button>
        ))}
      </div>
      {input.priorityPreference && (
        <div className="bg-[#5865F2]/10 border border-[#5865F2]/30 rounded p-3 mb-2">
          <p className="text-sm text-gray-300">✅ 모든 정보 입력 완료! AI 비자 매칭 분석을 시작할 준비가 되었습니다.</p>
        </div>
      )}
      <button onClick={onNext} disabled={!input.priorityPreference}
        className="flex items-center gap-2 px-6 py-3 bg-[#5865F2] hover:bg-[#4752C4] disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold transition-colors mt-2">
        <Sparkles size={16} /> 비자 경로 분석 시작
      </button>
    </BotMessage>
  );
}

// KOR: 분석 요약 채널 / ENG: Analysis summary channel
function AnalysisChannel({ result }: { result: DiagnosisResult }) {
  return (
    <BotMessage label="VisaBot ⚡">
      <p className="text-gray-300 text-sm mb-3">
        분석 완료! <strong className="text-white">{result.pathways.length}개</strong>의 경로 발견 (평가 {result.meta.totalPathwaysEvaluated}개 중 {result.meta.hardFilteredOut}개 필터 제외)
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {result.pathways.map(pw => (
          <div key={pw.pathwayId} className="bg-[#2F3136] rounded-lg p-3 border border-[#40444B]">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span>{getFeasibilityEmoji(pw.feasibilityLabel)}</span>
              <span className={`text-xs px-2 py-0.5 rounded border ${FEASIBILITY_BADGE[pw.feasibilityLabel] ?? 'text-gray-400 bg-gray-800 border-gray-600'}`}>{pw.feasibilityLabel}</span>
            </div>
            <p className="text-sm text-white font-semibold">{pw.nameKo}</p>
            <p className="text-xs text-gray-400 mb-2">{pw.nameEn}</p>
            <div className="flex gap-1 flex-wrap mb-2">
              {pw.visaChain.split(' → ').map((v, i) => <span key={i} className="px-1.5 py-0.5 bg-[#202225] text-[#5865F2] text-xs rounded font-mono">{v}</span>)}
            </div>
            <div className="flex gap-3 text-xs text-gray-500">
              <span>⏱ {pw.estimatedMonths}개월</span>
              <span>💰 {pw.estimatedCostWon === 0 ? '무료' : `${pw.estimatedCostWon.toLocaleString()}만원`}</span>
            </div>
            <div className="mt-2 w-full bg-[#202225] rounded-full h-1.5">
              <div className="h-1.5 rounded-full" style={{ width: `${pw.finalScore}%`, backgroundColor: getScoreColor(pw.finalScore) }} />
            </div>
            <p className="text-xs text-gray-500 mt-1">점수: {pw.finalScore}</p>
          </div>
        ))}
      </div>
    </BotMessage>
  );
}

// KOR: 비자 경로 상세 채널 / ENG: Visa paths detail channel
function PathsChannel({ result, expandedPath, setExpandedPath }: { result: DiagnosisResult; expandedPath: string | null; setExpandedPath: (id: string | null) => void }) {
  return (
    <div className="space-y-3">
      <BotMessage label="VisaBot ⚡">
        <p className="text-gray-300 text-sm mb-4">상세 비자 경로입니다. 각 경로를 클릭해 마일스톤을 확인하세요.</p>
        {result.pathways.map((pw, idx) => (
          <div key={pw.pathwayId} className="bg-[#2F3136] rounded-lg overflow-hidden mb-3">
            {/* 경로 헤더 버튼 / Path header button */}
            <button onClick={() => setExpandedPath(expandedPath === pw.pathwayId ? null : pw.pathwayId)}
              className="w-full flex items-start gap-3 p-4 hover:bg-[#34373C] transition-colors text-left">
              <div className="w-8 h-8 rounded-full bg-[#5865F2] flex items-center justify-center shrink-0 text-white text-sm font-bold">{idx + 1}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-white font-semibold text-sm">{pw.nameKo}</span>
                  <span className={`text-xs px-2 py-0.5 rounded border ${FEASIBILITY_BADGE[pw.feasibilityLabel] ?? 'text-gray-400 bg-gray-800 border-gray-600'}`}>
                    {getFeasibilityEmoji(pw.feasibilityLabel)} {pw.feasibilityLabel}
                  </span>
                </div>
                <p className="text-gray-400 text-xs mb-2 line-clamp-1">{pw.note}</p>
                <div className="flex items-center gap-1 flex-wrap">
                  {pw.visaChain.split(' → ').map((v, i) => (
                    <React.Fragment key={i}>
                      <span className="px-1.5 py-0.5 bg-[#202225] text-[#5865F2] text-xs rounded font-mono">{v}</span>
                      {i < pw.visaChain.split(' → ').length - 1 && <ArrowRight size={10} className="text-gray-600" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="font-bold text-lg" style={{ color: getScoreColor(pw.finalScore) }}>{pw.finalScore}</span>
                <span className="text-gray-500 text-xs">점수</span>
                {expandedPath === pw.pathwayId ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />}
              </div>
            </button>
            {/* 확장 상세 / Expanded detail */}
            {expandedPath === pw.pathwayId && (
              <div className="px-4 pb-4 border-t border-[#40444B]">
                <div className="grid grid-cols-3 gap-3 mt-4 mb-4">
                  <div className="bg-[#202225] rounded p-3 text-center">
                    <p className="text-xs text-gray-400 mb-1">기간</p>
                    <p className="text-white font-bold text-sm">{pw.estimatedMonths}개월</p>
                  </div>
                  <div className="bg-[#202225] rounded p-3 text-center">
                    <p className="text-xs text-gray-400 mb-1">비용</p>
                    <p className="text-white font-bold text-sm">{pw.estimatedCostWon === 0 ? '무료' : `${pw.estimatedCostWon}만원`}</p>
                  </div>
                  <div className="bg-[#202225] rounded p-3 text-center">
                    <p className="text-xs text-gray-400 mb-1">지원</p>
                    <p className="text-white font-bold text-xs">{pw.platformSupport}</p>
                  </div>
                </div>
                {/* 마일스톤 핀 스타일 / Milestone pin style */}
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1"><Pin size={12} /> 마일스톤 / Milestones</p>
                <div className="space-y-2 mb-4">
                  {pw.milestones.map((ms, mi) => (
                    <div key={mi} className="flex items-start gap-3 bg-[#202225] rounded p-3 border-l-2 border-[#5865F2]">
                      <div className="w-6 h-6 rounded-full bg-[#5865F2]/20 flex items-center justify-center text-[#5865F2] text-xs font-bold shrink-0">{ms.order}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <p className="text-white text-sm font-medium">{ms.nameKo}</p>
                          {ms.visaStatus && ms.visaStatus !== 'none' && (
                            <span className="px-1.5 py-0.5 bg-[#5865F2]/20 text-[#5865F2] text-xs rounded font-mono">{ms.visaStatus}</span>
                          )}
                        </div>
                        <p className="text-gray-400 text-xs">{ms.requirements}</p>
                        <div className="flex gap-3 mt-1 text-xs text-gray-500">
                          <span>+{ms.monthFromStart}개월</span>
                          {ms.canWorkPartTime && <span className="text-green-400">✓ 파트타임 ({ms.weeklyHours}h/주)</span>}
                          {ms.estimatedMonthlyIncome > 0 && <span className="text-yellow-400">월 ~{ms.estimatedMonthlyIncome}만원</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* 다음 단계 / Next steps */}
                {pw.nextSteps.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">다음 단계 / Next Steps</p>
                    <div className="space-y-2">
                      {pw.nextSteps.map((s, si) => (
                        <div key={si} className="flex items-start gap-2 bg-[#202225] rounded p-2">
                          <ArrowRight size={14} className="text-[#5865F2] mt-0.5 shrink-0" />
                          <div><p className="text-white text-xs font-medium">{s.nameKo}</p><p className="text-gray-400 text-xs">{s.description}</p></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </BotMessage>
    </div>
  );
}
