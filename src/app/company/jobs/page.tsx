'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus, MoreHorizontal, Star, Clock, Users, Copy, Edit3,
  XCircle, Zap, Trash2, AlertTriangle, Loader2, Briefcase,
  ChevronDown, RefreshCw, Crown,
} from 'lucide-react';
import { toast } from 'sonner';

/** 공고 정보 / Job posting data */
interface JobPosting {
  id: number;
  title: string;
  status: string;          // ACTIVE, CLOSED, DRAFT, SUSPENDED
  boardType: string;       // FULL_TIME, PART_TIME
  tierType?: string;       // STANDARD, PREMIUM
  premiumSource?: string | null; // PAID, ADMIN_GRANT, PROMOTION
  allowedVisas?: string[];
  applicantCount?: number;
  closingDate?: string;
  expiresAt?: string;       // 공고 노출 만료일 / Posting expiry date
  premiumStartAt?: string;  // 프리미엄 시작일 / Premium start date
  premiumEndAt?: string;    // 프리미엄 종료일 / Premium end date
  createdAt: string;
  updatedAt?: string;
}

// 프리미엄 소스별 배지 표시 / Premium source badge labels
const PREMIUM_BADGE: Record<string, string> = {
  PAID: '프리미엄 (결제)',
  ADMIN_GRANT: '프리미엄 (관리자 적용)',
  PROMOTION: '프리미엄 (이벤트)',
};

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
      const sessionId = localStorage.getItem('sessionId');
      const res = await fetch(`/api/jobs/my/list?status=${statusMap[activeTab]}&page=1&limit=50`, {
        credentials: 'include',
        headers: { 'Authorization': `Bearer ${sessionId}` },
      });
      if (res.ok) {
        const data = await res.json();
        setJobs(Array.isArray(data) ? data : data.items || data.jobs || data.data || []);
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

  // 날짜 포맷 / Format date (MM.DD)
  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}.${d.getDate()}`;
  };

  // 공고 마감 / Close job
  const handleClose = async (jobId: number) => {
    try {
      const sessionId = localStorage.getItem('sessionId');
      const res = await fetch(`/api/jobs/${jobId}/close`, {
        method: 'POST', credentials: 'include',
        headers: { 'Authorization': `Bearer ${sessionId}` },
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
            const expiryDday = getDday(job.expiresAt);
            const premiumDday = getDday(job.premiumEndAt);
            const isExpired = dday === '만료' || expiryDday === '만료';
            const isUrgent = dday && !isExpired && parseInt(dday.replace('D-', '')) <= 3;
            const isPremium = job.tierType === 'PREMIUM';
            const isDraft = job.status === 'DRAFT';
            const premiumExpired = premiumDday === '만료';

            return (
              <div key={job.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition relative">
                {/* 카드 본문 (클릭 → 공고 상세) / Card body (click → job detail) */}
                <div
                  onClick={() => {
                    if (isDraft && job.id === -1) { router.push('/company/jobs/create'); return; }
                    if (isDraft) { router.push(`/company/jobs/create?copy=${job.id}`); return; }
                    router.push(`/company/jobs/${job.id}`);
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
                            <Star className="w-3 h-3" /> {PREMIUM_BADGE[job.premiumSource || ''] || '프리미엄'}
                          </span>
                        )}
                        {isDraft && (
                          <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">임시저장</span>
                        )}
                      </div>

                      {/* 비자 매칭 배지 / Visa match badges */}
                      {job.allowedVisas && (typeof job.allowedVisas === 'string' ? job.allowedVisas : '').length > 0 && (() => {
                        const visas = typeof job.allowedVisas === 'string'
                          ? job.allowedVisas.split(',').map(v => v.trim()).filter(Boolean)
                          : Array.isArray(job.allowedVisas) ? job.allowedVisas : [];
                        return visas.length > 0 ? (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {visas.slice(0, 5).map(v => (
                              <span key={v} className="inline-flex items-center gap-0.5 text-xs px-2 py-0.5 bg-green-50 text-green-700 rounded-full">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />{v}
                              </span>
                            ))}
                            {visas.length > 5 && (
                              <span className="text-xs text-gray-400">+{visas.length - 5}</span>
                            )}
                          </div>
                        ) : null;
                      })()}

                      {/* 메타 정보 / Meta */}
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" /> 지원자 {job.applicantCount || 0}명
                        </span>
                        <span>{job.boardType === 'PART_TIME' ? '아르바이트' : '정규직'}</span>
                        {!isPremium && job.status === 'ACTIVE' && (
                          <span className="text-blue-600 font-medium">일반</span>
                        )}
                      </div>

                      {/* 기간 정보 바 / Duration info bar */}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {/* 공고 노출기간 / Posting exposure period */}
                        {job.expiresAt && (
                          <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md ${
                            expiryDday === '만료' ? 'bg-red-50 text-red-600' :
                            expiryDday && parseInt(expiryDday.replace('D-', '')) <= 3 ? 'bg-orange-50 text-orange-600 font-medium' :
                            'bg-gray-50 text-gray-600'
                          }`}>
                            <Clock className="w-3 h-3" />
                            공고 {expiryDday === '만료' ? '만료' : expiryDday === 'D-Day' ? '오늘 마감' : `${expiryDday}`}
                            <span className="text-gray-400">~{formatDate(job.expiresAt)}</span>
                          </span>
                        )}
                        {/* 접수 마감일 / Application deadline */}
                        {job.closingDate && dday && (
                          <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md ${
                            dday === '만료' ? 'bg-red-50 text-red-600' :
                            isUrgent ? 'bg-orange-50 text-orange-600 font-medium' :
                            'bg-gray-50 text-gray-600'
                          }`}>
                            <Clock className="w-3 h-3" />
                            접수 {dday === '만료' ? '마감' : dday === 'D-Day' ? '오늘 마감' : dday}
                            <span className="text-gray-400">~{formatDate(job.closingDate)}</span>
                          </span>
                        )}
                        {/* 프리미엄 상위노출 기간 / Premium exposure period */}
                        {isPremium && job.premiumEndAt && !premiumExpired && (
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-amber-50 text-amber-700 font-medium">
                            <Crown className="w-3 h-3" />
                            상위노출 {premiumDday === 'D-Day' ? '오늘 종료' : premiumDday}
                            <span className="text-amber-400">~{formatDate(job.premiumEndAt)}</span>
                          </span>
                        )}
                        {isPremium && premiumExpired && (
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-gray-100 text-gray-500">
                            <Crown className="w-3 h-3" />
                            상위노출 종료
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 상태별 CTA / Status-specific CTAs */}
                  {job.status === 'ACTIVE' && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <button type="button"
                        onClick={(e) => { e.stopPropagation(); router.push(`/company/payments/premium?jobId=${job.id}`); }}
                        className={`text-xs font-medium flex items-center gap-1 ${
                          isPremium
                            ? 'text-amber-500 hover:text-amber-600'
                            : 'text-amber-600 hover:text-amber-700'
                        }`}>
                        <Crown className="w-3 h-3" />
                        {isPremium ? '상위노출 연장하기' : '상위노출 신청'}
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
                            <button onClick={() => { setOpenMenu(null); router.push(`/company/payments/premium?jobId=${job.id}`); }}
                              className="w-full text-left px-4 py-2 text-sm text-amber-600 hover:bg-amber-50 flex items-center gap-2">
                              <Crown className="w-3.5 h-3.5" /> {isPremium ? '상위노출 연장' : '상위노출 신청'}
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
