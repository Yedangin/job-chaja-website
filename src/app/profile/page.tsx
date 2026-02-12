'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Menu, Bell, ChevronRight,
  LayoutDashboard, FileText, Send, Bookmark,
  Settings, User, CheckCircle,
  Briefcase, BookOpen, MoreHorizontal,
  Calendar, Clock, ShieldCheck, ExternalLink,
  ChevronDown, AlertTriangle, Star, Search,
  Eye, Lock, HelpCircle, LogOut, ChevronLeft,
  MessageSquare, Trash2, ArrowLeft, Loader2
} from 'lucide-react';
import { authApi } from '@/features/auth/api/auth.api';

// --- Types ---

type InterviewStatus =
  | 'CONFIRMED'
  | 'REVIEWING'
  | 'RESCHEDULE'
  | 'REJECTED'
  | 'APPLIED'
  | 'CANCELED'
  | 'INTERVIEW_REQUESTED'
  | 'COORDINATION_NEEDED';

interface DashboardStats {
  applied: number;
  interviews: number;
  scraps: number;
  resumeViews: number;
}

interface ApplicationItem {
  id: string;
  jobTitle: string;
  boardType?: string;
  location?: string;
  status: string;
  appliedAt: string;
}

interface InterviewItem {
  id: string;
  jobTitle: string;
  location?: string;
  interviewMethod?: string;
  status: string;
  interviewDate: string | null;
  interviewEndTime: string | null;
}

interface ProfileDetail {
  id: string;
  email: string;
  userType: string;
  socialProvider: string;
  isActive: boolean;
  joinedAt: string;
  individual?: {
    realName: string;
    nationality: string;
    gender: string;
    visaType: string;
    visaExpiryDate?: string;
    isProfileCompleted: boolean;
    profileImageUrl?: string;
  } | null;
  corporate?: {
    companyNameOfficial: string;
    brandName?: string;
    logoImageUrl?: string;
    verificationStatus: string;
  } | null;
}

interface SupportTicket {
  id: string;
  title: string;
  content: string;
  status: string;
  answer: string | null;
  answeredAt: string | null;
  createdAt: string;
}

// --- Mock Data (for sections not yet DB-connected) ---

const RECOMMENDED_JOBS = [
  { id: '1', company: 'SK하이닉스', title: '생산직 신입 사원 모집 (기숙사 제공)', location: '경기 이천', matchRate: 98, tags: ['기숙사', '식사제공'], salary: '월 300만원' },
  { id: '2', company: '쿠팡', title: '풀필먼트 센터 관리자 (신입/경력)', location: '경기 동탄', matchRate: 92, tags: ['셔틀버스'], salary: '월 280만원' },
  { id: '3', company: 'LG화학', title: '배터리 제조 공정 신입', location: '충북 청주', matchRate: 88, tags: ['정규직'], salary: '연 3,800만원' },
];

const VISA_GUIDES = [
  { id: 1, title: "D-2 비자 시간제 취업 허가 받는 법", tag: "필독" },
  { id: 2, title: "구직 비자(D-10) 변경 조건 체크리스트", tag: "TIP" },
];

// --- Components ---

const StatusBadge = ({ status }: { status: string }) => {
  const config: Record<string, { label: string; style: string }> = {
    CONFIRMED: { label: '면접확정', style: 'bg-blue-100 text-blue-700' },
    REVIEWING: { label: '검토중', style: 'bg-gray-100 text-gray-600' },
    RESCHEDULE: { label: '일정변경', style: 'bg-orange-100 text-orange-700' },
    REJECTED: { label: '불합격', style: 'bg-red-50 text-red-600' },
    APPLIED: { label: '지원완료', style: 'bg-green-50 text-green-600' },
    CANCELED: { label: '취소됨', style: 'bg-gray-100 text-gray-400' },
    INTERVIEW_REQUESTED: { label: '면접요청', style: 'bg-blue-50 text-blue-600' },
    COORDINATION_NEEDED: { label: '조율필요', style: 'bg-orange-50 text-orange-600' },
    PENDING: { label: '대기중', style: 'bg-gray-100 text-gray-500' },
    OPEN: { label: '답변대기', style: 'bg-yellow-50 text-yellow-600' },
    ANSWERED: { label: '답변완료', style: 'bg-green-50 text-green-600' },
    CLOSED: { label: '종료', style: 'bg-gray-100 text-gray-400' },
  };
  const { label, style } = config[status] || { label: status, style: 'bg-gray-100 text-gray-500' };
  return (
    <span className={`px-2 py-1 text-[11px] font-bold rounded ${style}`}>
      {label}
    </span>
  );
};

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
  </button>
);

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

const EmptyState = ({ icon: Icon, message }: { icon: any; message: string }) => (
  <div className="flex flex-col items-center justify-center py-16 text-gray-400">
    <Icon className="w-12 h-12 mb-4 text-gray-200" />
    <p className="text-sm font-medium">{message}</p>
  </div>
);

// --- Page Views ---

const DashboardView = ({ stats, interviews, setActiveMenu }: {
  stats: DashboardStats;
  interviews: InterviewItem[];
  setActiveMenu: (menu: string) => void;
}) => (
  <>
    {/* Stats */}
    <section className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-8 overflow-hidden">
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
        <StatItem label="지원 현황" count={stats.applied} icon={Send} bgClass="bg-red-50" colorClass="text-red-500" onClick={() => setActiveMenu('applications')} />
        <StatItem label="면접 일정" count={stats.interviews} icon={Briefcase} bgClass="bg-blue-50" colorClass="text-[#0085E5]" onClick={() => setActiveMenu('interviews')} />
        <StatItem label="스크랩" count={stats.scraps} icon={Bookmark} bgClass="bg-yellow-50" colorClass="text-yellow-500 fill-yellow-500" onClick={() => setActiveMenu('scraps')} />
        <StatItem label="이력서 열람" count={stats.resumeViews} icon={FileText} bgClass="bg-purple-50" colorClass="text-purple-500" onClick={() => setActiveMenu('resume')} />
      </div>
    </section>

    {/* Split Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left: Job Recommendations */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm h-full">
          <WidgetTitle title="지원할 만한 공고" linkText="더보기" />
          <div className="space-y-4">
            {RECOMMENDED_JOBS.map((job) => (
              <div key={job.id} className="group flex gap-4 p-4 rounded-xl border border-gray-100 bg-white hover:border-[#0085E5] hover:shadow-md transition-all cursor-pointer relative">
                <div className="w-14 h-14 bg-gray-50 rounded-lg flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-gray-400 border border-gray-100">LOGO</div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-[#0085E5] transition-colors pr-2">{job.title}</h4>
                    <span className="flex-shrink-0 text-[10px] text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded-full">{job.matchRate}% 일치</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <span className="font-medium text-gray-700">{job.company}</span>
                    <span className="w-[1px] h-2 bg-gray-300"></span>
                    <span>{job.location}</span>
                    {job.salary && (<><span className="w-[1px] h-2 bg-gray-300"></span><span className="text-gray-600 font-medium">{job.salary}</span></>)}
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {job.tags.map(tag => (
                      <span key={tag} className="text-[10px] bg-gray-50 text-gray-500 px-2 py-0.5 rounded border border-gray-200 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100 transition-colors">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 bg-gradient-to-r from-[#0085E5] to-blue-600 rounded-xl p-5 text-white flex justify-between items-center shadow-md">
            <div>
              <div className="flex items-center gap-2 mb-1"><FileText className="w-4 h-4 text-white/80" /><p className="text-xs font-medium opacity-90">이력서를 완성해서 합격률을 높이세요!</p></div>
              <p className="text-sm font-bold">이력서 작성 기능 업데이트 예정</p>
            </div>
            <button className="text-xs font-bold bg-white text-[#0085E5] px-4 py-2.5 rounded-lg shadow-sm hover:bg-blue-50 transition-colors">이력서 수정</button>
          </div>
        </div>
      </div>

      {/* Right: Interview & Info */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <WidgetTitle title="면접 일정 관리" linkText="일정관리 이동" onLinkClick={() => setActiveMenu('interviews')} />
          <div className="space-y-3">
            {interviews.length > 0 ? (
              interviews.slice(0, 3).map((interview) => (
                <div key={interview.id} onClick={() => setActiveMenu('interviews')} className="bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-[#0085E5] hover:shadow-md transition-all group">
                  <div className="flex justify-between items-start mb-3">
                    <StatusBadge status={interview.status} />
                    {interview.interviewDate && (
                      <span className="text-xs font-bold text-red-500">
                        {new Date(interview.interviewDate).toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit', weekday: 'short' })}
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 mb-1 group-hover:text-[#0085E5] transition-colors">{interview.jobTitle}</h4>
                  <p className="text-xs text-gray-500 mb-3 truncate">{interview.location || '위치 정보 없음'}</p>
                  {interview.interviewDate && (
                    <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {new Date(interview.interviewDate).toLocaleDateString('ko-KR')}
                      </div>
                      <div className="w-[1px] h-3 bg-gray-200"></div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {new Date(interview.interviewDate).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  )}
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
              <li key={idx} className="text-xs group cursor-pointer flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-blue-50/50 hover:border-blue-100 transition-all">
                <div className="flex items-center gap-3">
                  <span className={`flex-shrink-0 px-2 py-1 ${guide.tag === '필독' ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-600'} text-[10px] font-bold rounded-md`}>{guide.tag}</span>
                  <span className="text-gray-700 font-medium group-hover:text-[#0085E5] transition-colors line-clamp-1">{guide.title}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </>
);

const ApplicationsView = ({ applications }: { applications: ApplicationItem[] }) => (
  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[600px]">
    <div className="p-6 border-b border-gray-200 flex justify-between items-center">
      <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
        <Send className="w-5 h-5 text-[#0085E5]" /> 지원 내역
      </h2>
      <span className="px-3 py-1 bg-blue-50 text-[#0085E5] font-bold rounded-lg text-sm">{applications.length}건</span>
    </div>

    {applications.length > 0 ? (
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
            <tr>
              <th className="px-6 py-4">직무</th>
              <th className="px-6 py-4">지역</th>
              <th className="px-6 py-4">지원일</th>
              <th className="px-6 py-4">진행상태</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {applications.map((item) => (
              <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900">{item.jobTitle}</div>
                  {item.boardType && <div className="text-xs text-gray-500">{item.boardType}</div>}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{item.location || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(item.appliedAt).toLocaleDateString('ko-KR')}
                </td>
                <td className="px-6 py-4"><StatusBadge status={item.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <EmptyState icon={Send} message="아직 지원한 내역이 없습니다." />
    )}
  </div>
);

const InterviewsView = ({ interviews }: { interviews: InterviewItem[] }) => (
  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[600px]">
    <div className="p-6 border-b border-gray-200">
      <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-[#0085E5]" /> 면접 일정
      </h2>
    </div>

    {interviews.length > 0 ? (
      <div className="p-6 space-y-4">
        {interviews.map((interview) => (
          <div key={interview.id} className="border border-gray-200 rounded-xl p-5 hover:border-[#0085E5] hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-3">
              <StatusBadge status={interview.status} />
              {interview.interviewMethod && (
                <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">{interview.interviewMethod}</span>
              )}
            </div>
            <h3 className="font-bold text-gray-900 mb-2">{interview.jobTitle}</h3>
            <p className="text-sm text-gray-500 mb-3">{interview.location || '위치 정보 없음'}</p>
            {interview.interviewDate && (
              <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1.5 text-sm text-gray-700 font-medium">
                  <Calendar className="w-4 h-4 text-[#0085E5]" />
                  {new Date(interview.interviewDate).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
                </div>
                <div className="flex items-center gap-1.5 text-sm text-gray-700 font-medium">
                  <Clock className="w-4 h-4 text-[#0085E5]" />
                  {new Date(interview.interviewDate).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                  {interview.interviewEndTime && ` ~ ${new Date(interview.interviewEndTime).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}`}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    ) : (
      <EmptyState icon={Calendar} message="잡혀있는 면접 일정이 없습니다." />
    )}
  </div>
);

const ScrapsView = () => (
  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[600px]">
    <div className="p-6 border-b border-gray-200">
      <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
        <Bookmark className="w-5 h-5 text-yellow-500" /> 스크랩 공고
      </h2>
    </div>
    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
      <Bookmark className="w-12 h-12 mb-4 text-gray-200" />
      <p className="text-sm font-medium">스크랩 기능이 곧 업데이트됩니다.</p>
      <p className="text-xs text-gray-300 mt-1">서비스 준비중</p>
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
    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
      <Eye className="w-12 h-12 mb-4 text-gray-200" />
      <p className="text-sm font-medium">이력서 열람 기능이 곧 업데이트됩니다.</p>
      <p className="text-xs text-gray-300 mt-1">서비스 준비중</p>
    </div>
  </div>
);

// --- Settings Sub-Views ---

const SettingsMainView = ({ onNavigate, profileDetail }: { onNavigate: (sub: string) => void; profileDetail: ProfileDetail | null }) => {
  const isEmailAccount = profileDetail?.socialProvider === 'NONE';

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[600px]">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Settings className="w-5 h-5 text-gray-700" /> 계정 설정
        </h2>
      </div>
      <div className="p-6 space-y-2">
        {/* Password (email accounts only) */}
        {isEmailAccount && (
          <button onClick={() => onNavigate('settings-password')} className="w-full p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors cursor-pointer group text-left">
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
          </button>
        )}

        {/* Support */}
        <button onClick={() => onNavigate('settings-support')} className="w-full p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors cursor-pointer group text-left">
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
        </button>

        {/* Notifications */}
        <button onClick={() => onNavigate('settings-notifications')} className="w-full p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors cursor-pointer group text-left">
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
        </button>

        {/* Account Info */}
        <button onClick={() => onNavigate('settings-account')} className="w-full p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors cursor-pointer group text-left">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 group-hover:bg-blue-50 group-hover:text-[#0085E5] transition-colors">
              <User className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">계정 정보 / 회원탈퇴</h3>
              <p className="text-xs text-gray-500">가입 정보 확인 및 회원탈퇴</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#0085E5]" />
          </div>
        </button>

        <div className="h-4"></div>

        {/* Social Login Info */}
        {profileDetail?.socialProvider && profileDetail.socialProvider !== 'NONE' && (
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-sm text-blue-700 font-medium">
              {profileDetail.socialProvider} 소셜 계정으로 로그인중입니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const PasswordChangeView = ({ onBack }: { onBack: () => void }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: '새 비밀번호가 일치하지 않습니다.' });
      return;
    }
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: '비밀번호는 6자 이상이어야 합니다.' });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      await authApi.changePassword(oldPassword, newPassword);
      setMessage({ type: 'success', text: '비밀번호가 변경되었습니다.' });
      setOldPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || '비밀번호 변경에 실패했습니다.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex items-center gap-3">
        <button onClick={onBack} className="p-1 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5 text-gray-500" /></button>
        <h2 className="text-lg font-bold text-gray-900">비밀번호 변경</h2>
      </div>
      <div className="p-6 max-w-md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">현재 비밀번호</label>
            <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="현재 비밀번호 입력" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">새 비밀번호</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="새 비밀번호 입력 (6자 이상)" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">새 비밀번호 확인</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="새 비밀번호 다시 입력" />
          </div>
          {message && (
            <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message.text}
            </div>
          )}
          <button onClick={handleSubmit} disabled={loading || !oldPassword || !newPassword || !confirmPassword} className="w-full py-3 bg-[#0085E5] text-white font-bold rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            비밀번호 변경
          </button>
        </div>
      </div>
    </div>
  );
};

const SupportView = ({ onBack }: { onBack: () => void }) => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingTickets, setLoadingTickets] = useState(true);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    setLoadingTickets(true);
    try {
      const data = await authApi.getMySupportTickets();
      setTickets(data);
    } catch { }
    finally { setLoadingTickets(false); }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return;
    setLoading(true);
    try {
      await authApi.createSupportTicket(title, content);
      setTitle(''); setContent(''); setShowForm(false);
      loadTickets();
    } catch { }
    finally { setLoading(false); }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[600px]">
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5 text-gray-500" /></button>
          <h2 className="text-lg font-bold text-gray-900">고객센터 / 도움말</h2>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-[#0085E5] text-white text-sm font-bold rounded-lg hover:bg-blue-600 transition-colors">
          {showForm ? '취소' : '문의 작성'}
        </button>
      </div>

      {showForm && (
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="space-y-3 max-w-lg">
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white" placeholder="문의 제목" />
            <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={4} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white resize-none" placeholder="문의 내용을 입력해주세요" />
            <button onClick={handleSubmit} disabled={loading || !title.trim() || !content.trim()} className="px-6 py-2.5 bg-[#0085E5] text-white text-sm font-bold rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}문의 등록
            </button>
          </div>
        </div>
      )}

      <div className="divide-y divide-gray-100">
        {loadingTickets ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-gray-300" /></div>
        ) : tickets.length > 0 ? (
          tickets.map((ticket) => (
            <div key={ticket.id} className="p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-gray-900">{ticket.title}</h3>
                <StatusBadge status={ticket.status} />
              </div>
              <p className="text-sm text-gray-600 mb-2">{ticket.content}</p>
              <p className="text-xs text-gray-400">{new Date(ticket.createdAt).toLocaleDateString('ko-KR')} 작성</p>
              {ticket.answer && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-xs font-bold text-blue-700 mb-1">관리자 답변</p>
                  <p className="text-sm text-blue-800">{ticket.answer}</p>
                  {ticket.answeredAt && <p className="text-xs text-blue-500 mt-1">{new Date(ticket.answeredAt).toLocaleDateString('ko-KR')}</p>}
                </div>
              )}
            </div>
          ))
        ) : (
          <EmptyState icon={MessageSquare} message="문의 내역이 없습니다." />
        )}
      </div>
    </div>
  );
};

const NotificationsView = ({ onBack }: { onBack: () => void }) => {
  const [sms, setSms] = useState(false);
  const [email, setEmail] = useState(false);
  const [kakao, setKakao] = useState(false);
  const [enabledAt, setEnabledAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await authApi.getNotificationSettings();
      setSms(data.notifSms);
      setEmail(data.notifEmail);
      setKakao(data.notifKakao);
      setEnabledAt(data.notifEnabledAt);
    } catch { }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await authApi.updateNotificationSettings({ sms, email, kakao });
      loadSettings();
    } catch { }
    finally { setSaving(false); }
  };

  const Toggle = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) => (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
      <span className="font-medium text-gray-900">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-6 rounded-full transition-colors ${checked ? 'bg-[#0085E5]' : 'bg-gray-300'}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-6' : ''}`} />
      </button>
    </div>
  );

  if (loading) return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 flex justify-center">
      <Loader2 className="w-6 h-6 animate-spin text-gray-300" />
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex items-center gap-3">
        <button onClick={onBack} className="p-1 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5 text-gray-500" /></button>
        <h2 className="text-lg font-bold text-gray-900">알림 설정</h2>
      </div>
      <div className="p-6 max-w-md space-y-3">
        <Toggle label="SMS 알림" checked={sms} onChange={setSms} />
        <Toggle label="이메일 알림" checked={email} onChange={setEmail} />
        <Toggle label="카카오톡 알림" checked={kakao} onChange={setKakao} />

        {enabledAt && (
          <p className="text-xs text-gray-400 mt-2">마지막 설정 변경: {new Date(enabledAt).toLocaleString('ko-KR')}</p>
        )}

        <button onClick={handleSave} disabled={saving} className="w-full py-3 bg-[#0085E5] text-white font-bold rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-4">
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}저장
        </button>
      </div>
    </div>
  );
};

const AccountView = ({ onBack, profileDetail }: { onBack: () => void; profileDetail: ProfileDetail | null }) => {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      await authApi.deleteAccount();
      localStorage.removeItem('sessionId');
      router.push('/login');
    } catch { }
    finally { setLoading(false); }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex items-center gap-3">
        <button onClick={onBack} className="p-1 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5 text-gray-500" /></button>
        <h2 className="text-lg font-bold text-gray-900">계정 정보</h2>
      </div>
      <div className="p-6 space-y-4">
        {profileDetail && (
          <div className="space-y-3">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
              <span className="text-sm text-gray-500">이메일</span>
              <span className="text-sm font-bold text-gray-900">{profileDetail.email}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
              <span className="text-sm text-gray-500">회원 유형</span>
              <span className="text-sm font-bold text-gray-900">{profileDetail.userType === 'INDIVIDUAL' ? '개인회원' : profileDetail.userType === 'CORPORATE' ? '기업회원' : profileDetail.userType}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
              <span className="text-sm text-gray-500">로그인 방식</span>
              <span className="text-sm font-bold text-gray-900">{profileDetail.socialProvider === 'NONE' ? '이메일' : profileDetail.socialProvider}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
              <span className="text-sm text-gray-500">가입일</span>
              <span className="text-sm font-bold text-gray-900">{new Date(profileDetail.joinedAt).toLocaleDateString('ko-KR')}</span>
            </div>
          </div>
        )}

        <div className="h-6"></div>

        {/* Delete Account */}
        <div className="border border-red-200 rounded-xl p-5 bg-red-50/50">
          <h3 className="font-bold text-red-700 mb-2 flex items-center gap-2"><Trash2 className="w-4 h-4" /> 회원탈퇴</h3>
          <p className="text-sm text-red-600 mb-4">
            탈퇴 요청 후 90일간 데이터가 보관되며, 이후 완전히 삭제됩니다.
            탈퇴 후 같은 이메일로 재가입할 수 없습니다.
          </p>
          {!showConfirm ? (
            <button onClick={() => setShowConfirm(true)} className="px-5 py-2.5 bg-white text-red-600 border border-red-300 text-sm font-bold rounded-lg hover:bg-red-50 transition-colors">
              회원탈퇴 요청
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-bold text-red-700">정말 탈퇴하시겠습니까?</p>
              <div className="flex gap-2">
                <button onClick={handleDeleteAccount} disabled={loading} className="px-5 py-2.5 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2">
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}확인, 탈퇴합니다
                </button>
                <button onClick={() => setShowConfirm(false)} className="px-5 py-2.5 bg-gray-200 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-300 transition-colors">
                  취소
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Main Page ---

export default function JobchajaProfile() {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [settingsSubView, setSettingsSubView] = useState<string | null>(null);

  // DB data states
  const [profileDetail, setProfileDetail] = useState<ProfileDetail | null>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({ applied: 0, interviews: 0, scraps: 0, resumeViews: 0 });
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [interviews, setInterviews] = useState<InterviewItem[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Load data from DB
  useEffect(() => {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      router.push('/login');
      return;
    }

    const loadData = async () => {
      try {
        const [profile, stats, apps, intv] = await Promise.allSettled([
          authApi.getProfileDetail(),
          authApi.getMyDashboardStats(),
          authApi.getMyApplications(),
          authApi.getMyInterviews(),
        ]);

        if (profile.status === 'fulfilled') setProfileDetail(profile.value);
        if (stats.status === 'fulfilled') setDashboardStats(stats.value);
        if (apps.status === 'fulfilled') setApplications(apps.value);
        if (intv.status === 'fulfilled') setInterviews(intv.value);
      } catch (error) {
        console.error('[Profile] Data loading failed:', error);
      } finally {
        setDataLoaded(true);
      }
    };

    loadData();
  }, [router]);

  const handleLogout = async () => {
    try {
      const sessionId = localStorage.getItem('sessionId');
      if (sessionId) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionId}` },
        });
      }
    } catch { }
    localStorage.removeItem('sessionId');
    router.push('/login');
  };

  const displayName = profileDetail?.individual?.realName || profileDetail?.corporate?.companyNameOfficial || profileDetail?.email?.split('@')[0] || '사용자';
  const avatarUrl = profileDetail?.individual?.profileImageUrl || null;
  const visaType = profileDetail?.individual?.visaType || null;
  const isVisaVerified = visaType ? visaType !== 'PENDING' : false;

  const renderContent = () => {
    // Settings sub-views
    if (activeMenu === 'settings' && settingsSubView) {
      switch (settingsSubView) {
        case 'settings-password': return <PasswordChangeView onBack={() => setSettingsSubView(null)} />;
        case 'settings-support': return <SupportView onBack={() => setSettingsSubView(null)} />;
        case 'settings-notifications': return <NotificationsView onBack={() => setSettingsSubView(null)} />;
        case 'settings-account': return <AccountView onBack={() => setSettingsSubView(null)} profileDetail={profileDetail} />;
      }
    }

    switch (activeMenu) {
      case 'dashboard': return <DashboardView stats={dashboardStats} interviews={interviews} setActiveMenu={setActiveMenu} />;
      case 'applications': return <ApplicationsView applications={applications} />;
      case 'interviews': return <InterviewsView interviews={interviews} />;
      case 'scraps': return <ScrapsView />;
      case 'resume': return <ResumeViewsView />;
      case 'settings': return <SettingsMainView onNavigate={setSettingsSubView} profileDetail={profileDetail} />;
      case 'visa': return (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center min-h-[600px] flex flex-col items-center justify-center">
          <ShieldCheck className="w-16 h-16 text-blue-200 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">비자 가이드 페이지</h2>
          <p className="text-gray-500">비자 관련 콘텐츠가 준비중입니다.</p>
        </div>
      );
      default: return <DashboardView stats={dashboardStats} interviews={interviews} setActiveMenu={setActiveMenu} />;
    }
  };

  const handleMenuChange = (menu: string) => {
    setActiveMenu(menu);
    setSettingsSubView(null);
  };

  return (
    <div className="min-h-screen bg-[#FAFBFC] font-sans text-slate-800">

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto px-6 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-2 cursor-pointer">
              <div className="w-9 h-9 bg-[#0085E5] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-sm">J</div>
              <span className="text-2xl font-bold text-slate-900 tracking-tight">JobChaja</span>
            </Link>
            <nav className="hidden md:flex space-x-2 text-[16px] font-bold text-gray-500">
              <Link href="/alba" className="hover:text-[#0085E5] hover:bg-blue-50 px-4 py-2 rounded-lg transition-all">알바채용관</Link>
              <Link href="/fulltime" className="hover:text-[#0085E5] hover:bg-blue-50 px-4 py-2 rounded-lg transition-all">정규직채용관</Link>
              <Link href="/recruit-info" className="hover:text-[#0085E5] hover:bg-blue-50 px-4 py-2 rounded-lg transition-all">채용정보</Link>
            </nav>
          </div>

          <div className="flex items-center gap-5">
            <div className="hidden md:flex items-center relative group">
              <input type="text" placeholder="기업, 채용공고 검색" className="bg-gray-50 border border-gray-200 rounded-full py-2.5 pl-5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 w-72 transition-all" disabled />
              <Search className="w-4 h-4 text-gray-400 absolute right-4" />
            </div>
            <div className="flex items-center gap-3 pl-2 border-l border-gray-200">
              <button className="relative p-2 text-gray-400 hover:text-gray-900 transition-colors">
                <Bell className="w-6 h-6" />
              </button>
              <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-200 cursor-pointer hover:ring-2 hover:ring-blue-100 transition-all bg-gray-100 flex items-center justify-center">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <span className="hidden md:block text-sm font-bold text-gray-700 cursor-pointer">{displayName}님</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row py-8 px-6 gap-8">

        {/* Sidebar */}
        <aside className="w-full lg:w-[240px] flex-shrink-0">
          <div className="sticky top-24">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-6 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-16 bg-blue-50 z-0"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 mx-auto rounded-full p-1 bg-white border border-gray-200 mb-3 shadow-sm flex items-center justify-center overflow-hidden">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="User" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
                      <User className="w-8 h-8 text-gray-300" />
                    </div>
                  )}
                </div>
                <h2 className="text-lg font-bold text-gray-900 leading-tight">{displayName}</h2>
                <p className="text-xs text-gray-500 mb-4 font-medium">{profileDetail?.email || ''}</p>

                {isVisaVerified ? (
                  <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-[#0085E5] text-xs font-bold rounded-full border border-blue-100">
                    <CheckCircle className="w-3.5 h-3.5" /> 비자: {visaType}
                  </div>
                ) : (
                  <button className="w-full py-2 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-gray-800 transition-colors shadow-sm">
                    비자 인증하기
                  </button>
                )}
              </div>
            </div>

            {/* Menu */}
            <div className="space-y-1 pl-1">
              <div className="px-3 py-2 text-[11px] font-bold text-gray-400 mb-1 uppercase tracking-wider">My Activity</div>
              <NavItem label="MY 홈" icon={LayoutDashboard} active={activeMenu === 'dashboard'} onClick={() => handleMenuChange('dashboard')} />
              <NavItem label="지원 내역" icon={Send} active={activeMenu === 'applications'} onClick={() => handleMenuChange('applications')} hasSub />
              <NavItem label="면접 일정" icon={Calendar} active={activeMenu === 'interviews'} onClick={() => handleMenuChange('interviews')} />
              <NavItem label="스크랩" icon={Bookmark} active={activeMenu === 'scraps'} onClick={() => handleMenuChange('scraps')} />
              <NavItem label="내 이력서" icon={FileText} active={activeMenu === 'resume'} onClick={() => handleMenuChange('resume')} />

              <div className="h-4"></div>

              <div className="px-3 py-2 text-[11px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Settings</div>
              <NavItem label="비자 가이드" icon={BookOpen} active={activeMenu === 'visa'} onClick={() => handleMenuChange('visa')} />
              <NavItem label="계정 설정" icon={Settings} active={activeMenu === 'settings'} onClick={() => handleMenuChange('settings')} />
            </div>

            <div className="mt-6 px-4">
              <button onClick={handleLogout} className="w-full py-2.5 text-red-500 font-bold bg-red-50 rounded-xl flex items-center justify-center gap-2 hover:bg-red-100 transition-colors text-sm">
                <LogOut className="w-4 h-4" /> 로그아웃
              </button>
            </div>

            <div className="mt-6 px-4 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-gray-400 font-medium">
              <Link href="/terms-and-conditions" className="hover:text-gray-600">이용약관</Link>
              <Link href="/privacy-policy" className="hover:text-gray-600">개인정보처리방침</Link>
              <span className="block w-full mt-2 text-gray-300">&copy; JobChaja Corp.</span>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          {/* Corporate Verification Banner */}
          {profileDetail?.userType === 'CORPORATE' && activeMenu === 'dashboard' && (
            <div className={`rounded-2xl p-5 mb-8 flex flex-col sm:flex-row sm:items-center justify-between shadow-sm ${
              profileDetail.corporate?.verificationStatus === 'APPROVED'
                ? 'bg-emerald-50 border border-emerald-200'
                : profileDetail.corporate?.verificationStatus === 'SUBMITTED'
                ? 'bg-sky-50 border border-sky-200'
                : 'bg-amber-50 border border-amber-200'
            }`}>
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  profileDetail.corporate?.verificationStatus === 'APPROVED'
                    ? 'bg-emerald-100 text-emerald-600'
                    : profileDetail.corporate?.verificationStatus === 'SUBMITTED'
                    ? 'bg-sky-100 text-sky-600'
                    : 'bg-amber-100 text-amber-600'
                }`}>
                  {profileDetail.corporate?.verificationStatus === 'APPROVED' ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : profileDetail.corporate?.verificationStatus === 'SUBMITTED' ? (
                    <Clock className="w-5 h-5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    {profileDetail.corporate?.verificationStatus === 'APPROVED'
                      ? '기업 인증 완료'
                      : profileDetail.corporate?.verificationStatus === 'SUBMITTED'
                      ? '기업 인증 심사 중'
                      : '기업 인증이 필요합니다'}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    {profileDetail.corporate?.verificationStatus === 'APPROVED'
                      ? '공고 등록 및 기업 서비스를 이용하실 수 있습니다.'
                      : profileDetail.corporate?.verificationStatus === 'SUBMITTED'
                      ? '관리자가 제출 정보를 검토 중입니다. 승인 후 서비스를 이용하실 수 있습니다.'
                      : '기업 인증을 완료하면 공고 등록 및 기업 서비스를 이용할 수 있습니다.'}
                  </p>
                </div>
              </div>
              {profileDetail.corporate?.verificationStatus !== 'APPROVED' && profileDetail.corporate?.verificationStatus !== 'SUBMITTED' && (
                <div className="mt-4 sm:mt-0">
                  <Link href="/register" className="px-5 py-2.5 bg-white text-amber-600 border border-amber-200 text-xs font-bold rounded-xl hover:bg-amber-50 transition-colors shadow-sm">
                    인증하기
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Top Banner */}
          {!isVisaVerified && activeMenu === 'dashboard' && profileDetail?.userType !== 'CORPORATE' && (
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

          {!dataLoaded ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
            </div>
          ) : (
            renderContent()
          )}
        </main>
      </div>
    </div>
  );
}
