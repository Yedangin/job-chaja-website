'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus, MoreHorizontal, Star, Clock, Users, Copy, Edit3,
  XCircle, Zap, Trash2, AlertTriangle, Loader2, Briefcase,
  ChevronDown, RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';

/** 공고 정보 / Job posting data */
interface JobPosting {
  id: number;
  title: string;
  status: string;          // ACTIVE, CLOSED, DRAFT, SUSPENDED
  boardType: string;       // FULL_TIME, PART_TIME
  tierType?: string;       // STANDARD, PREMIUM
  allowedVisas?: string[];
  applicantCount?: number;
  closingDate?: string;
  createdAt: string;
  updatedAt?: string;
}

type TabKey = 'active' | 'closed' | 'draft';
type SortKey = 'latest' | 'deadline' | 'applicants';

/**
 * 공고관리 페이지 / Job management page
 * 채용중/마감/임시저장 탭, 정렬, ⋯ 메뉴 (수정/복사/마감/프리미엄/삭제)
 */
export default function CompanyJobsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>('active');
  const [sortBy, setSortBy] = useState<SortKey>('latest');
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // 탭 → 백엔드 status 매핑 / Map tabs to backend status
  const statusMap: Record<TabKey, string> = { active: 'ACTIVE', closed: 'CLOSED', draft: 'DRAFT' };

  // 공고 목록 가져오기 / Fetch job list
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem('accessToken');
      const res = await fetch(`/api/jobs/my/list?status=${statusMap[activeTab]}&page=1&limit=50`, {
        credentials: 'include',
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setJobs(Array.isArray(data) ? data : data.jobs || data.data || []);
      } else { setJobs([]); }
    } catch { setJobs([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchJobs(); }, [activeTab]);

  // 메뉴 바깥 클릭 닫기 / Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenMenu(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // 정렬 / Sort jobs
  const sortedJobs = [...jobs].sort((a, b) => {
    if (sortBy === 'deadline') {
      if (!a.closingDate) return 1;
      if (!b.closingDate) return -1;
      return new Date(a.closingDate).getTime() - new Date(b.closingDate).getTime();
    }
    if (sortBy === 'applicants') return (b.applicantCount || 0) - (a.applicantCount || 0);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // D-day 계산 / Calculate days until deadline
  const getDday = (dateStr?: string): string | null => {
    if (!dateStr) return null;
    const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return '만료';
    if (diff === 0) return 'D-Day';
    return `D-${diff}`;
  };

  // 공고 마감 / Close job
  const handleClose = async (jobId: number) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const res = await fetch(`/api/jobs/${jobId}/close`, {
        method: 'POST', credentials: 'include',
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });
      if (res.ok) { toast.success('공고가 마감되었습니다.'); fetchJobs(); }
      else { toast.error('마감 처리에 실패했습니다.'); }
    } catch { toast.error('네트워크 오류'); }
    setOpenMenu(null);
  };

  // 공고 복사 / Copy job → create page with prefill
  const handleCopy = (jobId: number) => {
    setOpenMenu(null);
    router.push(`/company/jobs/create?copy=${jobId}`);
  };

  // 임시저장 불러오기 / Load draft jobs from localStorage
  const getDraftJobs = (): JobPosting[] => {
    try {
      const draft = localStorage.getItem('jobDraft');
      if (!draft) return [];
      const parsed = JSON.parse(draft);
      if (parsed.form?.title) {
        return [{
          id: -1, title: parsed.form.title, status: 'DRAFT',
          boardType: parsed.form.employmentType === 'PART_TIME' ? 'PART_TIME' : 'FULL_TIME',
          createdAt: parsed.savedAt || new Date().toISOString(),
        }];
      }
    } catch { /* ignore */ }
    return [];
  };

  // 임시저장 탭일 때 localStorage draft 병합 / Merge local drafts for draft tab
  const displayJobs = activeTab === 'draft' ? [...getDraftJobs(), ...sortedJobs] : sortedJobs;

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'active', label: '채용중' },
    { key: 'closed', label: '마감' },
    { key: 'draft', label: '임시저장' },
  ];

  const sortOptions: { key: SortKey; label: string }[] = [
    { key: 'latest', label: '등록일순' },
    { key: 'deadline', label: '마감임박순' },
    { key: 'applicants', label: '지원자수순' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* 헤더 / Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">공고 관리</h1>
        <Link href="/company/jobs/create"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
          <Plus className="w-4 h-4" /> 공고 등록
        </Link>
      </div>

      {/* 탭 + 정렬 / Tabs + Sort */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-1 border-b border-gray-200">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition ${
                activeTab === tab.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <select value={sortBy} onChange={e => setSortBy(e.target.value as SortKey)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 text-gray-600 appearance-none pr-8 bg-white">
            {sortOptions.map(opt => <option key={opt.key} value={opt.key}>{opt.label}</option>)}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* 공고 목록 / Job list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : displayJobs.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 text-sm mb-4">
            {activeTab === 'active' && '채용 중인 공고가 없습니다.'}
            {activeTab === 'closed' && '마감된 공고가 없습니다.'}
            {activeTab === 'draft' && '임시저장된 공고가 없습니다.'}
          </p>
          <Link href="/company/jobs/create"
            className="inline-flex items-center gap-2 text-blue-600 text-sm font-medium hover:text-blue-700">
            <Plus className="w-4 h-4" /> 첫 공고 등록하기
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {displayJobs.map((job) => {
            const dday = getDday(job.closingDate);
            const isExpired = dday === '만료';
            const isUrgent = dday && !isExpired && parseInt(dday.replace('D-', '')) <= 3;
            const isPremium = job.tierType === 'PREMIUM';
            const isDraft = job.status === 'DRAFT';

            return (
              <div key={job.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition relative">
                {/* 카드 본문 (클릭 → 지원자 관리) / Card body */}
                <div
                  onClick={() => {
                    if (isDraft && job.id === -1) { router.push('/company/jobs/create'); return; }
                    if (isDraft) { router.push(`/company/jobs/create?copy=${job.id}`); return; }
                    router.push(`/company/jobs/${job.id}/applicants`);
                  }}
                  className="cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                      <Briefcase className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-gray-900 text-sm truncate">{job.title || '(제목 없음)'}</h3>
                        {isPremium && (
                          <span className="inline-flex items-center gap-0.5 bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-medium">
                            <Star className="w-3 h-3" /> 프리미엄
                          </span>
                        )}
                        {isDraft && (
                          <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">임시저장</span>
                        )}
                      </div>

                      {/* 비자 매칭 배지 / Visa match badges */}
                      {job.allowedVisas && job.allowedVisas.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {job.allowedVisas.slice(0, 5).map(v => (
                            <span key={v} className="inline-flex items-center gap-0.5 text-xs px-2 py-0.5 bg-green-50 text-green-700 rounded-full">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />{v}
                            </span>
                          ))}
                          {job.allowedVisas.length > 5 && (
                            <span className="text-xs text-gray-400">+{job.allowedVisas.length - 5}</span>
                          )}
                        </div>
                      )}

                      {/* 메타 정보 / Meta */}
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" /> 지원자 {job.applicantCount || 0}명
                        </span>
                        {dday && (
                          <span className={`flex items-center gap-1 ${isExpired ? 'text-red-500' : isUrgent ? 'text-orange-500 font-medium' : ''}`}>
                            <Clock className="w-3 h-3" />
                            {isExpired ? '노출 종료' : isUrgent ? `${dday} 곧 만료` : `마감 ${dday}`}
                          </span>
                        )}
                        <span>{job.boardType === 'PART_TIME' ? '아르바이트' : '정규직'}</span>
                        {!isPremium && job.status === 'ACTIVE' && (
                          <span className="text-blue-600 font-medium">일반</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 상태별 CTA / Status-specific CTAs */}
                  {!isPremium && job.status === 'ACTIVE' && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <button type="button"
                        onClick={(e) => { e.stopPropagation(); router.push(`/company/payments?upgrade=${job.id}`); }}
                        className="text-xs text-amber-600 font-medium hover:text-amber-700 flex items-center gap-1">
                        <Zap className="w-3 h-3" /> 프리미엄 업그레이드
                      </button>
                    </div>
                  )}
                  {isExpired && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <button type="button"
                        onClick={(e) => { e.stopPropagation(); handleCopy(job.id); }}
                        className="text-xs text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
                        <RefreshCw className="w-3 h-3" /> 재등록
                      </button>
                    </div>
                  )}
                </div>

                {/* ⋯ 메뉴 / More menu */}
                {!isDraft && (
                  <div className="absolute top-4 right-4" ref={openMenu === job.id ? menuRef : null}>
                    <button type="button" onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === job.id ? null : job.id); }}
                      className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    {openMenu === job.id && (
                      <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-lg shadow-lg border py-1 z-20">
                        <button onClick={() => { setOpenMenu(null); router.push(`/company/jobs/${job.id}`); }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                          <Edit3 className="w-3.5 h-3.5" /> 수정
                        </button>
                        <button onClick={() => handleCopy(job.id)}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                          <Copy className="w-3.5 h-3.5" /> 복사
                        </button>
                        {job.status === 'ACTIVE' && (
                          <>
                            <button onClick={() => handleClose(job.id)}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                              <XCircle className="w-3.5 h-3.5" /> 마감
                            </button>
                            <button onClick={() => { setOpenMenu(null); router.push(`/company/payments?upgrade=${job.id}`); }}
                              className="w-full text-left px-4 py-2 text-sm text-amber-600 hover:bg-amber-50 flex items-center gap-2">
                              <Zap className="w-3.5 h-3.5" /> 프리미엄 업그레이드
                            </button>
                          </>
                        )}
                        <hr className="my-1" />
                        <button onClick={() => { setOpenMenu(null); toast.error('삭제 기능은 준비 중입니다.'); }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                          <Trash2 className="w-3.5 h-3.5" /> 삭제
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
