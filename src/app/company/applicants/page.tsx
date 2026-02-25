'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Users, Briefcase, ChevronRight, Loader2, Search,
  Clock, RefreshCw, Plus, UserCircle, Filter,
} from 'lucide-react';
import { toast } from 'sonner';

/** 공고 정보 / Job posting summary */
interface JobPosting {
  id: number;
  title: string;
  status: string;
  boardType: string;
  location?: string;
  closingDate?: string;
  applicantCount?: number;
  createdAt: string;
}

/** 지원자 정보 / Applicant summary */
interface ApplicantSummary {
  id: number;
  fullName: string;
  nationality?: string;
  visaType?: string;
  appliedAt: string;
  status: ApplicationStatus;
}

/** 공고별 지원자 집계 / Per-job applicant aggregate */
interface JobApplicantGroup {
  job: JobPosting;
  applicants: ApplicantSummary[];
  totalCount: number;
  isLoading: boolean;
}

type ApplicationStatus =
  | 'PENDING'
  | 'REVIEWING'
  | 'INTERVIEW_SCHEDULED'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'CANCELLED';

type TabKey = 'all' | 'with_applicants' | 'new';
type FilterStatus = 'ALL' | 'ACTIVE' | 'CLOSED';

/** 지원 상태 설정 / Application status configuration */
const STATUS_CONFIG: Record<ApplicationStatus, { label: string; colorClass: string; badgeClass: string }> = {
  PENDING:             { label: '검토 대기', colorClass: 'text-gray-600', badgeClass: 'bg-gray-100 text-gray-600' },
  REVIEWING:           { label: '서류 검토', colorClass: 'text-blue-600', badgeClass: 'bg-blue-100 text-blue-700' },
  INTERVIEW_SCHEDULED: { label: '면접 예정', colorClass: 'text-purple-600', badgeClass: 'bg-purple-100 text-purple-700' },
  ACCEPTED:            { label: '최종 합격', colorClass: 'text-green-600', badgeClass: 'bg-green-100 text-green-700' },
  REJECTED:            { label: '불합격', colorClass: 'text-red-600', badgeClass: 'bg-red-100 text-red-600' },
  CANCELLED:           { label: '취소', colorClass: 'text-gray-500', badgeClass: 'bg-gray-100 text-gray-500' },
};

/** 백엔드 상태값을 내부 타입으로 매핑 / Map backend status to internal type */
function mapApplicationStatus(raw: string): ApplicationStatus {
  const upper = raw?.toUpperCase() ?? '';
  if (upper === 'REVIEWING' || upper === 'REVIEW') return 'REVIEWING';
  if (upper === 'INTERVIEW_SCHEDULED' || upper === 'INTERVIEW' || upper === 'INTERVIEWING') return 'INTERVIEW_SCHEDULED';
  if (upper === 'ACCEPTED' || upper === 'HIRED') return 'ACCEPTED';
  if (upper === 'REJECTED') return 'REJECTED';
  if (upper === 'CANCELLED' || upper === 'CANCELED') return 'CANCELLED';
  return 'PENDING';
}

/** 시간 경과 표시 / Relative time display */
function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
}

/** D-day 계산 / Calculate days remaining */
function getDday(dateStr?: string): string | null {
  if (!dateStr) return null;
  const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return '만료';
  if (diff === 0) return 'D-Day';
  return `D-${diff}`;
}

/**
 * 전체 지원자 관리 페이지 / Aggregate applicant management overview page
 * 모든 공고의 지원자를 한 눈에 확인하고 빠른 상태 변경 가능
 * View applicants across all company jobs with quick status updates
 */
export default function CompanyAllApplicantsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('ACTIVE');
  const [searchQuery, setSearchQuery] = useState('');
  const [jobGroups, setJobGroups] = useState<JobApplicantGroup[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);

  /** 공고 목록 가져오기 / Fetch company job list */
  const fetchJobs = useCallback(async () => {
    setIsLoadingJobs(true);
    try {
      const sessionId = localStorage.getItem('sessionId');
      const statusParam = filterStatus === 'ALL' ? '' : `&status=${filterStatus}`;
      const res = await fetch(`/api/jobs/my/list?page=1&limit=100${statusParam}`, {
        credentials: 'include',
        headers: { 'Authorization': `Bearer ${sessionId}` },
      });
      if (!res.ok) {
        setJobGroups([]);
        return;
      }
      const data = await res.json();
      const jobs: JobPosting[] = Array.isArray(data) ? data : data.jobs ?? data.data ?? [];

      // 공고별 지원자 그룹 초기화 / Initialize job groups with loading state
      const initialGroups: JobApplicantGroup[] = jobs.map(job => ({
        job,
        applicants: [],
        totalCount: job.applicantCount ?? 0,
        isLoading: true,
      }));
      setJobGroups(initialGroups);

      // 각 공고의 지원자 병렬 로드 (최대 3명씩 미리보기) / Load recent applicants per job in parallel
      await Promise.all(
        jobs.map(async (job, idx) => {
          try {
            const sessionId2 = localStorage.getItem('sessionId');
            const appRes = await fetch(`/api/applications/job/${job.id}?page=1&limit=3`, {
              credentials: 'include',
              headers: { 'Authorization': `Bearer ${sessionId2}` },
            });
            if (!appRes.ok) {
              setJobGroups(prev =>
                prev.map((g, i) => i === idx ? { ...g, isLoading: false } : g)
              );
              return;
            }
            const appData = await appRes.json();
            const list = Array.isArray(appData)
              ? appData
              : appData.applications ?? appData.data ?? [];

            const mapped: ApplicantSummary[] = list.map((a: Record<string, unknown>) => ({
              id: a.id as number,
              fullName: (a.fullName ?? a.applicantName ?? `지원자 #${a.id}`) as string,
              nationality: a.nationality as string | undefined,
              visaType: a.visaType as string | undefined,
              appliedAt: (a.appliedAt ?? a.createdAt ?? new Date().toISOString()) as string,
              status: mapApplicationStatus(a.status as string),
            }));

            setJobGroups(prev =>
              prev.map((g, i) =>
                i === idx
                  ? { ...g, applicants: mapped, isLoading: false }
                  : g
              )
            );
          } catch {
            setJobGroups(prev =>
              prev.map((g, i) => i === idx ? { ...g, isLoading: false } : g)
            );
          }
        })
      );
    } catch {
      setJobGroups([]);
    } finally {
      setIsLoadingJobs(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  /** 지원자 상태 빠른 변경 / Quick applicant status update */
  const handleStatusChange = async (
    applicationId: number,
    jobIdx: number,
    newStatus: ApplicationStatus
  ) => {
    setUpdatingStatus(applicationId);
    try {
      const sessionId = localStorage.getItem('sessionId');
      const res = await fetch(`/api/applications/${applicationId}/status`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionId}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setJobGroups(prev =>
          prev.map((g, i) =>
            i === jobIdx
              ? {
                  ...g,
                  applicants: g.applicants.map(a =>
                    a.id === applicationId ? { ...a, status: newStatus } : a
                  ),
                }
              : g
          )
        );
        toast.success('상태가 변경되었습니다.');
      } else {
        toast.error('상태 변경에 실패했습니다.');
      }
    } catch {
      toast.error('네트워크 오류가 발생했습니다.');
    } finally {
      setUpdatingStatus(null);
    }
  };

  // 탭 필터 적용 / Apply tab filter
  const filteredGroups = jobGroups.filter(g => {
    if (activeTab === 'with_applicants') return g.totalCount > 0;
    if (activeTab === 'new') {
      // 신규 = 24시간 내 지원자 있는 공고 / New = jobs with applicants in last 24h
      return g.applicants.some(a => {
        const diff = Date.now() - new Date(a.appliedAt).getTime();
        return diff < 24 * 60 * 60 * 1000;
      });
    }
    return true;
  });

  // 검색어 필터 / Apply search filter
  const searchedGroups = filteredGroups.filter(g =>
    g.job.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 요약 통계 / Summary stats
  const totalApplicants = jobGroups.reduce((sum, g) => sum + g.totalCount, 0);
  const jobsWithApplicants = jobGroups.filter(g => g.totalCount > 0).length;
  const newApplicantsCount = jobGroups.reduce((sum, g) => {
    return sum + g.applicants.filter(a => {
      const diff = Date.now() - new Date(a.appliedAt).getTime();
      return diff < 24 * 60 * 60 * 1000;
    }).length;
  }, 0);

  const tabs: { key: TabKey; label: string; count: number }[] = [
    { key: 'all', label: '전체 공고', count: jobGroups.length },
    { key: 'with_applicants', label: '지원자 있는 공고', count: jobsWithApplicants },
    { key: 'new', label: '신규 지원자', count: newApplicantsCount },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* 페이지 헤더 / Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">지원자 관리</h1>
          <p className="text-sm text-gray-500 mt-1">
            전체 공고의 지원자를 한 눈에 확인하세요.
          </p>
        </div>
        <button
          onClick={fetchJobs}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
          title="새로고침 / Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${isLoadingJobs ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* 요약 통계 카드 / Summary stat cards */}
      {!isLoadingJobs && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-xs text-gray-500">총 공고</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{jobGroups.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-xs text-gray-500">총 지원자</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalApplicants}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-orange-500" />
              </div>
              <span className="text-xs text-gray-500">신규 (24h)</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{newApplicantsCount}</p>
          </div>
        </div>
      )}

      {/* 상태 요약 탭 / Status summary tabs */}
      <div className="flex items-center justify-between mb-4 border-b border-gray-200">
        <div className="flex gap-0">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition flex items-center gap-2 ${
                activeTab === tab.key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-xs font-semibold ${
                  activeTab === tab.key
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 검색 + 필터 / Search and filter */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="공고명 검색..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-1">
          <Filter className="w-3.5 h-3.5 text-gray-400" />
          {(['ACTIVE', 'CLOSED', 'ALL'] as FilterStatus[]).map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                filterStatus === s
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {s === 'ACTIVE' ? '활성' : s === 'CLOSED' ? '마감' : '전체'}
            </button>
          ))}
        </div>
      </div>

      {/* 로딩 / Loading skeleton */}
      {isLoadingJobs ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                  <div>
                    <div className="h-4 w-48 bg-gray-200 rounded mb-2" />
                    <div className="h-3 w-32 bg-gray-100 rounded" />
                  </div>
                </div>
                <div className="h-4 w-20 bg-gray-200 rounded" />
              </div>
              <div className="space-y-2">
                {[1, 2, 3].map(j => (
                  <div key={j} className="h-10 bg-gray-100 rounded-lg" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : searchedGroups.length === 0 ? (
        /* 빈 상태 / Empty state */
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          {jobGroups.length === 0 ? (
            <>
              <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-400 text-sm mb-4">등록된 공고가 없습니다.</p>
              <Link
                href="/company/jobs/create"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
              >
                <Plus className="w-4 h-4" />
                첫 공고 등록하기
              </Link>
            </>
          ) : (
            <>
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-400 text-sm">조건에 맞는 공고가 없습니다.</p>
            </>
          )}
        </div>
      ) : (
        /* 공고별 지원자 카드 목록 / Job applicant group cards */
        <div className="space-y-4">
          {searchedGroups.map((group, groupIdx) => {
            const dday = getDday(group.job.closingDate);
            const isExpired = dday === '만료';
            const isUrgent = dday && !isExpired && parseInt(dday.replace('D-', '')) <= 3;
            const boardLabel = group.job.boardType === 'PART_TIME' ? '알바' : '정규직';

            return (
              <div
                key={group.job.id}
                className="bg-white rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-sm transition"
              >
                {/* 공고 헤더 / Job header */}
                <div className="p-5 pb-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                        <Briefcase className="w-5 h-5 text-blue-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="font-bold text-gray-900 text-sm truncate">
                          {group.job.title}
                        </h2>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 flex-wrap">
                          <span>{boardLabel}</span>
                          {group.job.location && (
                            <>
                              <span className="text-gray-300">·</span>
                              <span>{group.job.location}</span>
                            </>
                          )}
                          {dday && (
                            <>
                              <span className="text-gray-300">·</span>
                              <span className={
                                isExpired ? 'text-red-500' :
                                isUrgent ? 'text-orange-500 font-medium' :
                                'text-gray-500'
                              }>
                                {isExpired ? '노출 종료' : dday}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 지원자 수 + 전체보기 / Applicant count + view all link */}
                    <Link
                      href={`/company/jobs/${group.job.id}/applicants`}
                      className="flex items-center gap-1.5 shrink-0 group"
                    >
                      <div className="flex items-center gap-1 text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition">
                        <Users className="w-4 h-4" />
                        지원자 {group.totalCount}명
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  </div>
                </div>

                {/* 구분선 / Divider */}
                <div className="border-t border-gray-100" />

                {/* 지원자 미리보기 목록 / Applicant preview list */}
                <div className="px-5 py-3">
                  {group.isLoading ? (
                    /* 지원자 로딩 스켈레톤 / Applicant loading skeleton */
                    <div className="space-y-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-9 bg-gray-100 rounded-lg animate-pulse" />
                      ))}
                    </div>
                  ) : group.applicants.length === 0 ? (
                    /* 지원자 없는 공고 / No applicants */
                    <div className="py-4 text-center">
                      <p className="text-xs text-gray-400">아직 지원자가 없습니다.</p>
                    </div>
                  ) : (
                    /* 지원자 행 목록 / Applicant rows */
                    <div className="space-y-1">
                      {group.applicants.map(applicant => {
                        const statusCfg = STATUS_CONFIG[applicant.status];
                        return (
                          <div
                            key={applicant.id}
                            className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-gray-50 transition group"
                          >
                            {/* 아바타 / Avatar */}
                            <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                              <UserCircle className="w-5 h-5 text-gray-400" />
                            </div>

                            {/* 이름 + 비자 / Name + visa */}
                            <div className="flex-1 min-w-0">
                              <span className="text-sm font-medium text-gray-800 truncate">
                                {applicant.fullName}
                              </span>
                              {applicant.visaType && (
                                <span className="ml-2 text-xs text-gray-400">{applicant.visaType}</span>
                              )}
                            </div>

                            {/* 상태 드롭다운 / Status dropdown */}
                            <div className="relative shrink-0">
                              <select
                                value={applicant.status}
                                disabled={updatingStatus === applicant.id}
                                onChange={e =>
                                  handleStatusChange(
                                    applicant.id,
                                    groupIdx,
                                    e.target.value as ApplicationStatus
                                  )
                                }
                                className={`text-xs px-2 py-1 rounded-full border-0 font-medium cursor-pointer appearance-none pr-5 ${statusCfg.badgeClass} disabled:opacity-60`}
                              >
                                {(Object.keys(STATUS_CONFIG) as ApplicationStatus[]).map(s => (
                                  <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                                ))}
                              </select>
                            </div>

                            {/* 지원 시간 / Applied time */}
                            <span className="text-xs text-gray-400 shrink-0 hidden sm:block">
                              {timeAgo(applicant.appliedAt)}
                            </span>
                          </div>
                        );
                      })}

                      {/* 더 보기 링크 / More link */}
                      {group.totalCount > 3 && (
                        <Link
                          href={`/company/jobs/${group.job.id}/applicants`}
                          className="flex items-center justify-center gap-1.5 mt-2 py-2 text-xs text-blue-600 hover:text-blue-700 font-medium hover:bg-blue-50 rounded-lg transition"
                        >
                          + {group.totalCount - 3}명 더 보기
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  )}
                </div>

                {/* 카드 하단 - 전체보기 버튼 / Card footer - view all button */}
                <div className="px-5 pb-4">
                  <Link
                    href={`/company/jobs/${group.job.id}/applicants`}
                    className="w-full flex items-center justify-center gap-1.5 py-2 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50 hover:border-blue-300 hover:text-blue-600 transition font-medium"
                  >
                    전체보기 (지원자 관리 페이지로)
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 로딩 스피너 (첫 진입 시) / Initial loading spinner */}
      {isLoadingJobs && jobGroups.length === 0 && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      )}
    </div>
  );
}
