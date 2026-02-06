'use client';

import React, { useState } from 'react';
import { 
  Menu, Bell, ChevronRight, 
  LayoutDashboard, FileText, Send, Bookmark, 
  Settings, User, CheckCircle, 
  Briefcase, BookOpen, MoreHorizontal, 
  Calendar, Clock, ShieldCheck, ExternalLink,
  ChevronDown, AlertTriangle, Star, Search,
  Eye, Lock, HelpCircle, LogOut, ChevronLeft
} from 'lucide-react';

// --- Types ---

type InterviewStatus = 
  | 'CONFIRMED'   // 면접 확정
  | 'REVIEWING'   // 검토중
  | 'RESCHEDULE'  // 변경 요청
  | 'REJECTED'    // 불합격
  | 'APPLIED'     // 지원완료
  | 'CANCELED';   // 취소됨

interface InterviewSchedule {
  id: string;
  companyName: string;
  jobTitle: string;
  interviewDate: string;
  interviewTime: string;
  status: InterviewStatus;
  dDay: string;
}

interface UserProfile {
  name: string;
  engName: string;
  visaType: string;
  isVisaVerified: boolean;
  avatarUrl: string;
  completionRate: number;
}

interface RecommendedJob {
  id: string;
  company: string;
  title: string;
  location: string;
  matchRate: number;
  tags: string[];
  salary?: string;
  deadline?: string;
}

interface ResumeViewHistory {
  id: string;
  company: string;
  date: string;
  location: string;
}

// --- Mock Data ---

const USER: UserProfile = {
  name: "박찬호",
  engName: "Chan-ho Park",
  visaType: "D-2",
  isVisaVerified: false,
  avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
  completionRate: 70
};

const DASHBOARD_STATS = {
  applied: 12,
  interviewScheduled: 3,
  scraps: 8,
  resumeViews: 24
};

const INTERVIEW_SCHEDULES: InterviewSchedule[] = [
  { 
    id: '1', 
    companyName: '삼성전자 평택사업장', 
    jobTitle: '반도체 생산라인 오퍼레이터', 
    interviewDate: '03.20 (수)', 
    interviewTime: '14:00', 
    status: 'CONFIRMED',
    dDay: 'D-3'
  },
  { 
    id: '2', 
    companyName: '현대건설', 
    jobTitle: '현장 안전 관리자', 
    interviewDate: '03.25 (월)', 
    interviewTime: '10:00', 
    status: 'RESCHEDULE',
    dDay: 'D-8'
  },
];

const RECOMMENDED_JOBS: RecommendedJob[] = [
  { id: '1', company: 'SK하이닉스', title: '생산직 신입 사원 모집 (기숙사 제공)', location: '경기 이천', matchRate: 98, tags: ['기숙사', '식사제공'], salary: '월 300만원' },
  { id: '2', company: '쿠팡', title: '풀필먼트 센터 관리자 (신입/경력)', location: '경기 동탄', matchRate: 92, tags: ['셔틀버스'], salary: '월 280만원' },
  { id: '3', company: 'LG화학', title: '배터리 제조 공정 신입', location: '충북 청주', matchRate: 88, tags: ['정규직'], salary: '연 3,800만원' },
];

const VISA_GUIDES = [
  { id: 1, title: "D-2 비자 시간제 취업 허가 받는 법", tag: "필독" },
  { id: 2, title: "구직 비자(D-10) 변경 조건 체크리스트", tag: "TIP" },
];

// New Mock Data for Pages
const APPLIED_HISTORY = [
  { id: 1, company: '삼성전자', title: '반도체 생산라인 오퍼레이터', date: '2024.03.10', status: 'CONFIRMED' },
  { id: 2, company: '현대건설', title: '현장 안전 관리자', date: '2024.03.08', status: 'RESCHEDULE' },
  { id: 3, company: 'LG에너지솔루션', title: '배터리 품질 관리', date: '2024.03.05', status: 'REJECTED' },
  { id: 4, company: '롯데호텔', title: '프론트 데스크 (영어 가능자)', date: '2024.03.01', status: 'APPLIED' },
  { id: 5, company: '스타벅스 코리아', title: '바리스타 신입', date: '2024.02.28', status: 'APPLIED' },
];

const SCRAPPED_JOBS = [
  { id: '1', company: '네이버', title: '데이터 센터 관제 오퍼레이터', location: '강원 춘천', deadline: 'D-5', tags: ['IT', '교대근무'] },
  { id: '2', company: '카카오모빌리티', title: '서비스 운영 지원', location: '경기 판교', deadline: 'D-2', tags: ['사무보조', '인턴'] },
  { id: '3', company: 'GS25', title: '직영점 매니저 모집', location: '서울 강남', deadline: '오늘마감', tags: ['유통', '매장관리'] },
  ...RECOMMENDED_JOBS // reusing for demo
];

const RESUME_VIEWERS: ResumeViewHistory[] = [
  { id: '1', company: '현대자동차', date: '2024.03.12 14:30', location: '서울 서초구' },
  { id: '2', company: 'CJ제일제당', date: '2024.03.11 09:15', location: '서울 중구' },
  { id: '3', company: '아모레퍼시픽', date: '2024.03.10 18:20', location: '서울 용산구' },
  { id: '4', company: '쿠팡', date: '2024.03.09 11:00', location: '경기 성남시' },
];

// --- Components ---

// 상태 뱃지
const StatusBadge = ({ status }: { status: string }) => {
  const config: any = {
    CONFIRMED: { label: '면접확정', style: 'bg-blue-100 text-blue-700' },
    REVIEWING: { label: '검토중', style: 'bg-gray-100 text-gray-600' },
    RESCHEDULE: { label: '일정변경', style: 'bg-orange-100 text-orange-700' },
    REJECTED: { label: '불합격', style: 'bg-red-50 text-red-600' },
    APPLIED: { label: '지원완료', style: 'bg-green-50 text-green-600' },
    CANCELED: { label: '취소됨', style: 'bg-gray-100 text-gray-400' },
  };
  const { label, style } = config[status] || config.APPLIED;
  return (
    <span className={`px-2 py-1 text-[11px] font-bold rounded ${style}`}>
      {label}
    </span>
  );
};

// 대시보드 통계 아이템
const StatItem = ({ label, count, icon: Icon, colorClass, bgClass, onClick }: any) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center justify-center p-6 hover:bg-gray-50 transition-colors group w-full text-center relative"
  >
    <div className={`mb-3 p-3.5 rounded-2xl ${bgClass} group-hover:scale-110 transition-transform duration-200 shadow-sm`}>
      <Icon className={`w-6 h-6 ${colorClass}`} />
    </div>
    <span className="text-2xl font-bold text-gray-900 mb-1">{count}</span>
    <span className="text-sm text-gray-500 font-medium group-hover:text-gray-800">{label}</span>
    
    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-12 bg-gray-100 hidden md:block last:hidden"></div>
  </button>
);

// 사이드바 메뉴 아이템
const NavItem = ({ label, icon: Icon, active, onClick, hasSub = false }: any) => (
  <button 
    onClick={onClick}
    className={`
      w-full flex items-center justify-between px-4 py-3 text-sm transition-all rounded-xl mb-1.5 group border
      ${active 
        ? 'text-[#0085E5] font-bold bg-white border-blue-100 shadow-sm' 
        : 'text-gray-500 hover:bg-white hover:text-gray-900 hover:shadow-sm border-transparent hover:border-gray-100 font-medium'
      }
    `}
  >
    <div className="flex items-center gap-3">
      <Icon className={`w-4.5 h-4.5 ${active ? 'text-[#0085E5]' : 'text-gray-400 group-hover:text-gray-600'}`} />
      <span>{label}</span>
    </div>
    {hasSub && <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500" />}
  </button>
);

const WidgetTitle = ({ title, linkText, onLinkClick }: any) => (
  <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-100">
    <div className="flex items-center gap-2">
      <div className="w-1 h-5 bg-[#0085E5] rounded-full"></div>
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
    </div>
    {linkText && (
      <button 
        onClick={onLinkClick}
        className="text-xs text-gray-400 hover:text-[#0085E5] flex items-center gap-0.5 font-medium transition-colors"
      >
        {linkText} <ChevronRight className="w-3 h-3" />
      </button>
    )}
  </div>
);

// --- Page Views ---

const DashboardView = ({ setActiveMenu }: { setActiveMenu: (menu: string) => void }) => (
  <>
    {/* Section 1: Dashboard Stats */}
    <section className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-8 overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
          <StatItem 
            label="지원 현황" 
            count={DASHBOARD_STATS.applied} 
            icon={Send} 
            bgClass="bg-red-50" 
            colorClass="text-red-500" 
            onClick={() => setActiveMenu('applications')}
          />
          <StatItem 
            label="받은 제안" 
            count="0" 
            icon={Briefcase} 
            bgClass="bg-blue-50" 
            colorClass="text-[#0085E5]" 
            onClick={() => setActiveMenu('applications')}
          />
          <StatItem 
            label="스크랩" 
            count={DASHBOARD_STATS.scraps} 
            icon={Bookmark} 
            bgClass="bg-yellow-50" 
            colorClass="text-yellow-500 fill-yellow-500" 
            onClick={() => setActiveMenu('scraps')}
          />
          <StatItem 
            label="내 이력서" 
            count={DASHBOARD_STATS.resumeViews} 
            icon={FileText} 
            bgClass="bg-purple-50" 
            colorClass="text-purple-500" 
            onClick={() => setActiveMenu('resume')}
          />
        </div>
    </section>

    {/* Section 2: Split Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Job Recommendations */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm h-full">
              <WidgetTitle title="지원할 만한 공고" linkText="더보기" />
              
              <div className="space-y-4">
                {RECOMMENDED_JOBS.map((job) => (
                    <div 
                      key={job.id} 
                      className="group flex gap-4 p-4 rounded-xl border border-gray-100 bg-white hover:border-[#0085E5] hover:shadow-md transition-all cursor-pointer relative"
                    >
                        <div className="w-14 h-14 bg-gray-50 rounded-lg flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-gray-400 border border-gray-100">
                          LOGO
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                              <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-[#0085E5] transition-colors pr-2">
                                {job.title}
                              </h4>
                              <span className="flex-shrink-0 text-[10px] text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded-full">
                                {job.matchRate}% 일치
                              </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                              <span className="font-medium text-gray-700">{job.company}</span>
                              <span className="w-[1px] h-2 bg-gray-300"></span>
                              <span>{job.location}</span>
                              {job.salary && (
                                <>
                                  <span className="w-[1px] h-2 bg-gray-300"></span>
                                  <span className="text-gray-600 font-medium">{job.salary}</span>
                                </>
                              )}
                          </div>
                          <div className="flex gap-1.5 flex-wrap">
                              {job.tags.map(tag => (
                                <span key={tag} className="text-[10px] bg-gray-50 text-gray-500 px-2 py-0.5 rounded border border-gray-200 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100 transition-colors">
                                  {tag}
                                </span>
                              ))}
                          </div>
                        </div>
                    </div>
                ))}
              </div>
              
              <div className="mt-6 bg-gradient-to-r from-[#0085E5] to-blue-600 rounded-xl p-5 text-white flex justify-between items-center shadow-md">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="w-4 h-4 text-white/80" />
                      <p className="text-xs font-medium opacity-90">이력서 완성도가 70%입니다</p>
                    </div>
                    <p className="text-sm font-bold">나머지 30% 채우고 합격률 높이기!</p>
                </div>
                <button className="text-xs font-bold bg-white text-[#0085E5] px-4 py-2.5 rounded-lg shadow-sm hover:bg-blue-50 transition-colors">
                  이력서 수정
                </button>
              </div>
          </div>
        </div>

        {/* Right Column: Interview & Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <WidgetTitle title="면접 일정 관리" linkText="일정관리 이동" onLinkClick={() => setActiveMenu('interviews')} />
              <div className="space-y-3">
                {INTERVIEW_SCHEDULES.length > 0 ? (
                  INTERVIEW_SCHEDULES.map((interview) => (
                    <div 
                      key={interview.id} 
                      onClick={() => setActiveMenu('interviews')}
                      className="bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-[#0085E5] hover:shadow-md transition-all group"
                    >
                        <div className="flex justify-between items-start mb-3">
                          <StatusBadge status={interview.status} />
                          <span className={`text-xs font-bold ${interview.dDay.includes('D-') ? 'text-red-500' : 'text-gray-400'}`}>
                            {interview.dDay}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-gray-900 mb-1 group-hover:text-[#0085E5] transition-colors">{interview.companyName}</h4>
                        <p className="text-xs text-gray-500 mb-3 truncate">{interview.jobTitle}</p>
                        
                        <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" /> {interview.interviewDate}
                          </div>
                          <div className="w-[1px] h-3 bg-gray-200"></div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                            <Clock className="w-3.5 h-3.5 text-gray-400" /> {interview.interviewTime}
                          </div>
                        </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                      <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <span className="text-gray-400 text-xs font-medium">잡혀있는 면접 일정이 없습니다.</span>
                  </div>
                )}
              </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <WidgetTitle title="비자 가이드 & 꿀팁" />
              <ul className="space-y-2">
                {VISA_GUIDES.map((guide, idx) => (
                    <li 
                      key={idx} 
                      className="text-xs group cursor-pointer flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-blue-50/50 hover:border-blue-100 transition-all"
                    >
                        <div className="flex items-center gap-3">
                          <span className={`flex-shrink-0 px-2 py-1 ${guide.tag === '필독' ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-600'} text-[10px] font-bold rounded-md`}>
                            {guide.tag}
                          </span>
                          <span className="text-gray-700 font-medium group-hover:text-[#0085E5] transition-colors line-clamp-1">
                            {guide.title}
                          </span>
                        </div>
                    </li>
                ))}
              </ul>
          </div>
        </div>
    </div>
  </>
);

const ApplicationsView = () => (
  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[600px]">
    <div className="p-6 border-b border-gray-200 flex justify-between items-center">
      <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
        <Send className="w-5 h-5 text-[#0085E5]" /> 지원 내역
      </h2>
      <div className="flex gap-2 text-sm">
         <span className="px-3 py-1 bg-blue-50 text-[#0085E5] font-bold rounded-lg">전체 {APPLIED_HISTORY.length}</span>
      </div>
    </div>
    
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
          <tr>
            <th className="px-6 py-4">기업/직무</th>
            <th className="px-6 py-4">지원일</th>
            <th className="px-6 py-4">진행상태</th>
            <th className="px-6 py-4 text-right">관리</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {APPLIED_HISTORY.map((item) => (
            <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
              <td className="px-6 py-4">
                <div className="font-bold text-gray-900">{item.company}</div>
                <div className="text-xs text-gray-500">{item.title}</div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">{item.date}</td>
              <td className="px-6 py-4">
                <StatusBadge status={item.status} />
              </td>
              <td className="px-6 py-4 text-right">
                <button className="text-xs font-medium text-gray-400 hover:text-gray-900 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-white transition-all">
                  상세보기
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    
    {/* Empty state example if needed */}
    {APPLIED_HISTORY.length === 0 && (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <Send className="w-12 h-12 mb-4 text-gray-200" />
        <p className="text-sm font-medium">아직 지원한 내역이 없습니다.</p>
      </div>
    )}
  </div>
);

const InterviewsView = () => {
  // Simple calendar mock for March 2024
  const days = Array.from({ length: 35 }, (_, i) => {
    const day = i - 3; // start from prev month end
    return day > 0 && day <= 31 ? day : null;
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden h-full">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#0085E5]" /> 면접 일정 (3월)
        </h2>
        <div className="flex gap-2">
          <button className="p-1 hover:bg-gray-100 rounded"><ChevronLeft className="w-5 h-5 text-gray-400" /></button>
          <span className="font-bold text-gray-700">2024.03</span>
          <button className="p-1 hover:bg-gray-100 rounded"><ChevronRight className="w-5 h-5 text-gray-400" /></button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-7 gap-4 mb-4 text-center">
          {['일', '월', '화', '수', '목', '금', '토'].map((d, i) => (
            <div key={d} className={`text-xs font-bold ${i === 0 ? 'text-red-500' : 'text-gray-500'}`}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-4">
          {days.map((day, idx) => {
            // Find interviews for this day
            const schedules = INTERVIEW_SCHEDULES.filter(s => s.interviewDate.startsWith(`03.${day < 10 ? '0' + day : day}`));
            
            return (
              <div key={idx} className={`min-h-[100px] border border-gray-100 rounded-xl p-2 relative ${day ? 'hover:border-blue-200' : 'bg-gray-50/50'}`}>
                {day && (
                  <>
                    <span className={`text-sm font-bold ${idx % 7 === 0 ? 'text-red-500' : 'text-gray-700'}`}>{day}</span>
                    <div className="mt-2 space-y-1">
                      {schedules.map(sch => (
                        <div key={sch.id} className="text-[10px] bg-blue-50 text-[#0085E5] px-1.5 py-1 rounded font-bold truncate cursor-pointer hover:bg-blue-100">
                           {sch.interviewTime} {sch.companyName}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="px-6 pb-6">
         <div className="bg-gray-50 rounded-xl p-4 flex gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
               <div className="w-3 h-3 bg-blue-100 rounded-full"></div> 면접확정
            </div>
            <div className="flex items-center gap-2">
               <div className="w-3 h-3 bg-orange-100 rounded-full"></div> 일정변경
            </div>
         </div>
      </div>
    </div>
  );
};

const ScrapsView = () => (
  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[600px]">
    <div className="p-6 border-b border-gray-200">
      <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
        <Bookmark className="w-5 h-5 text-yellow-500" /> 스크랩 공고
      </h2>
    </div>
    
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      {SCRAPPED_JOBS.map((job) => (
        <div key={job.id} className="border border-gray-200 rounded-xl p-5 hover:border-[#0085E5] hover:shadow-md transition-all cursor-pointer bg-white relative group">
           <div className="absolute top-4 right-4 text-yellow-400">
              <Star className="w-5 h-5 fill-yellow-400" />
           </div>
           
           <div className="flex items-start gap-4 mb-3">
              <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center text-[10px] font-bold text-gray-400 border border-gray-100">LOGO</div>
              <div>
                 <h3 className="font-bold text-gray-900 group-hover:text-[#0085E5] transition-colors">{job.title}</h3>
                 <p className="text-sm text-gray-600">{job.company}</p>
              </div>
           </div>
           
           <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
              <span>{job.location}</span>
              <span className="w-[1px] h-3 bg-gray-200"></span>
              <span className="text-red-500 font-bold">{job.deadline || '상시채용'}</span>
           </div>
           
           <div className="flex gap-1.5">
              {job.tags.map(tag => (
                 <span key={tag} className="text-[10px] px-2 py-1 bg-gray-50 text-gray-500 rounded border border-gray-100">{tag}</span>
              ))}
           </div>
        </div>
      ))}
    </div>
  </div>
);

const ResumeViewsView = () => (
  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[600px]">
    <div className="p-6 border-b border-gray-200">
      <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
        <Eye className="w-5 h-5 text-purple-500" /> 내 이력서 열람 기업
      </h2>
      <p className="text-sm text-gray-500 mt-1">최근 30일 동안 내 이력서를 열람한 기업 목록입니다.</p>
    </div>

    <div className="divide-y divide-gray-100">
       {RESUME_VIEWERS.map((view) => (
         <div key={view.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600">
                  <Briefcase className="w-5 h-5" />
               </div>
               <div>
                  <h3 className="font-bold text-gray-900 text-lg">{view.company}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                     <span>{view.date} 열람</span>
                     <span className="w-[1px] h-3 bg-gray-200"></span>
                     <span>{view.location}</span>
                  </div>
               </div>
            </div>
            <button className="px-4 py-2 border border-purple-200 text-purple-600 rounded-lg text-sm font-bold hover:bg-purple-50 transition-colors">
               기업정보 보기
            </button>
         </div>
       ))}
    </div>
  </div>
);

const SettingsView = () => (
  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[600px]">
    <div className="p-6 border-b border-gray-200">
      <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
        <Settings className="w-5 h-5 text-gray-700" /> 계정 설정
      </h2>
    </div>
    
    <div className="p-6 space-y-2">
       {/* Security */}
       <div className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors cursor-pointer group">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 group-hover:bg-blue-50 group-hover:text-[#0085E5] transition-colors">
                <Lock className="w-5 h-5" />
             </div>
             <div className="flex-1">
                <h3 className="font-bold text-gray-900">비밀번호 변경</h3>
                <p className="text-xs text-gray-500">주기적인 비밀번호 변경으로 계정을 보호하세요.</p>
             </div>
             <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#0085E5]" />
          </div>
       </div>

       {/* Support */}
       <div className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors cursor-pointer group">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 group-hover:bg-blue-50 group-hover:text-[#0085E5] transition-colors">
                <HelpCircle className="w-5 h-5" />
             </div>
             <div className="flex-1">
                <h3 className="font-bold text-gray-900">고객센터 / 도움말</h3>
                <p className="text-xs text-gray-500">궁금한 점이나 불편한 사항이 있으신가요?</p>
             </div>
             <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#0085E5]" />
          </div>
       </div>

       {/* Notifications */}
       <div className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors cursor-pointer group">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 group-hover:bg-blue-50 group-hover:text-[#0085E5] transition-colors">
                <Bell className="w-5 h-5" />
             </div>
             <div className="flex-1">
                <h3 className="font-bold text-gray-900">알림 설정</h3>
                <p className="text-xs text-gray-500">채용 제안, 면접 일정 등 알림 수신 여부 설정</p>
             </div>
             <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#0085E5]" />
          </div>
       </div>
       
       <div className="h-4"></div>
       
       <button className="w-full py-3 text-red-500 font-bold bg-red-50 rounded-xl flex items-center justify-center gap-2 hover:bg-red-100 transition-colors">
          <LogOut className="w-4 h-4" /> 로그아웃
       </button>
    </div>
  </div>
);

export default function JobchajaProfile() {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <DashboardView setActiveMenu={setActiveMenu} />;
      case 'applications':
        return <ApplicationsView />;
      case 'interviews':
        return <InterviewsView />;
      case 'scraps':
        return <ScrapsView />;
      case 'resume':
        return <ResumeViewsView />;
      case 'settings':
        return <SettingsView />;
      case 'visa':
         return (
           <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center min-h-[600px] flex flex-col items-center justify-center">
              <ShieldCheck className="w-16 h-16 text-blue-200 mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">비자 가이드 페이지</h2>
              <p className="text-gray-500">비자 관련 콘텐츠가 준비중입니다.</p>
           </div>
         );
      default:
        return <DashboardView setActiveMenu={setActiveMenu} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFBFC] font-sans text-slate-800">
      
      {/* --- Header --- */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto px-6 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-10">
            {/* Logo */}
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setActiveMenu('dashboard')}
            >
              <div className="w-9 h-9 bg-[#0085E5] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-sm">J</div>
              <span className="text-2xl font-bold text-slate-900 tracking-tight">JobChaja</span>
            </div>
            {/* Main Menu */}
            <nav className="hidden md:flex space-x-2 text-[16px] font-bold text-gray-500">
              <a href="#" className="hover:text-[#0085E5] hover:bg-blue-50 px-4 py-2 rounded-lg transition-all">알바채용관</a>
              <a href="#" className="hover:text-[#0085E5] hover:bg-blue-50 px-4 py-2 rounded-lg transition-all">정규직채용관</a>
              <a href="#" className="text-[#0085E5] bg-blue-50 px-4 py-2 rounded-lg transition-all">채용정보</a>
            </nav>
          </div>

          <div className="flex items-center gap-5">
             <div className="hidden md:flex items-center relative group">
               <input 
                 type="text" 
                 placeholder="기업, 채용공고 검색" 
                 className="bg-gray-50 border border-gray-200 rounded-full py-2.5 pl-5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 w-72 transition-all"
               />
               <Search className="w-4 h-4 text-gray-400 absolute right-4 cursor-pointer group-hover:text-[#0085E5]" />
             </div>
             <div className="flex items-center gap-3 pl-2 border-l border-gray-200">
                <button className="relative p-2 text-gray-400 hover:text-gray-900 transition-colors">
                  <Bell className="w-6 h-6" />
                  <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></span>
                </button>
                <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-200 cursor-pointer hover:ring-2 hover:ring-blue-100 transition-all">
                    <img src={USER.avatarUrl} alt="User" className="w-full h-full object-cover" />
                </div>
                <span className="hidden md:block text-sm font-bold text-gray-700 cursor-pointer">{USER.name}님</span>
             </div>
          </div>
        </div>
      </header>

      {/* --- Main Layout --- */}
      <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row py-8 px-6 gap-8">
        
        {/* === 1. Left Sidebar (Navigation) === */}
        <aside className="w-full lg:w-[240px] flex-shrink-0">
          <div className="sticky top-24">
             
             {/* 1-1. Profile Card */}
             <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-6 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-16 bg-blue-50 z-0"></div>
                <div className="relative z-10">
                    <div className="w-20 h-20 mx-auto rounded-full p-1 bg-white border border-gray-200 mb-3 shadow-sm">
                      <img src={USER.avatarUrl} alt="User" className="w-full h-full rounded-full object-cover" />
                    </div>
                    
                    <h2 className="text-lg font-bold text-gray-900 leading-tight">{USER.name}</h2>
                    <p className="text-xs text-gray-500 mb-4 font-medium">{USER.engName}</p>

                    {USER.isVisaVerified ? (
                      <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-[#0085E5] text-xs font-bold rounded-full border border-blue-100">
                        <CheckCircle className="w-3.5 h-3.5" /> 비자 인증 완료
                      </div>
                    ) : (
                      <button className="w-full py-2 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-gray-800 transition-colors shadow-sm">
                        비자 인증하기
                      </button>
                    )}
                </div>
             </div>

             {/* 1-2. Menu List */}
             <div className="space-y-1 pl-1">
                <div className="px-3 py-2 text-[11px] font-bold text-gray-400 mb-1 uppercase tracking-wider">My Activity</div>
                <NavItem label="MY 홈" icon={LayoutDashboard} active={activeMenu === 'dashboard'} onClick={() => setActiveMenu('dashboard')} />
                <NavItem label="지원 내역" icon={Send} active={activeMenu === 'applications'} onClick={() => setActiveMenu('applications')} hasSub={true} />
                <NavItem label="면접 일정" icon={Calendar} active={activeMenu === 'interviews'} onClick={() => setActiveMenu('interviews')} />
                <NavItem label="스크랩" icon={Bookmark} active={activeMenu === 'scraps'} onClick={() => setActiveMenu('scraps')} />
                <NavItem label="내 이력서" icon={FileText} active={activeMenu === 'resume'} onClick={() => setActiveMenu('resume')} />
                
                <div className="h-4"></div>
                
                <div className="px-3 py-2 text-[11px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Settings</div>
                <NavItem label="비자 가이드" icon={BookOpen} active={activeMenu === 'visa'} onClick={() => setActiveMenu('visa')} />
                <NavItem label="계정 설정" icon={Settings} active={activeMenu === 'settings'} onClick={() => setActiveMenu('settings')} />
             </div>

             <div className="mt-8 px-4 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-gray-400 font-medium">
               <a href="#" className="hover:text-gray-600">이용약관</a>
               <a href="#" className="hover:text-gray-600">개인정보처리방침</a>
               <span className="block w-full mt-2 text-gray-300">© JobChaja Corp.</span>
             </div>

          </div>
        </aside>


        {/* === 2. Right Content Area === */}
        <main className="flex-1 min-w-0">
          
          {/* Top Banner (Only on Dashboard for cleanliness, or keep always) */}
          {!USER.isVisaVerified && activeMenu === 'dashboard' && (
            <div className="bg-[#FFF8F0] border border-[#FFE0B2] rounded-2xl p-5 mb-8 flex flex-col sm:flex-row sm:items-center justify-between shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-4 z-10">
                <div className="w-10 h-10 bg-[#FFECB3] rounded-full flex items-center justify-center flex-shrink-0 text-orange-600">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">비자 정보를 완성해주세요!</h3>
                  <p className="text-xs text-gray-600 mt-1">인증된 인재는 기업의 채용 제안을 받을 확률이 <span className="font-bold text-orange-600">2배</span> 높습니다.</p>
                </div>
              </div>
              <div className="mt-4 sm:mt-0 z-10">
                 <button className="w-full sm:w-auto px-5 py-2.5 bg-white text-orange-600 border border-orange-200 text-xs font-bold rounded-xl hover:bg-orange-50 transition-colors shadow-sm">
                   지금 인증하기
                 </button>
              </div>
              <div className="absolute -right-6 -top-10 w-32 h-32 bg-orange-100 rounded-full opacity-50 z-0"></div>
            </div>
          )}

          {renderContent()}

        </main>

      </div>
    </div>
  );
}
