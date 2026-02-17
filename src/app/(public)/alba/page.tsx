'use client';

/**
 * 알바채용관 — 비자 필터 + 적격 뱃지 포함
 * Part-time job listing — with visa filter + eligibility badges
 */

import { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, Eye, Users, ChevronLeft, ChevronRight, Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

interface JobPosting {
  id: string;
  title: string;
  boardType: string;
  tierType: string;
  status: string;
  displayAddress: string;
  allowedVisas: string;
  applicationMethod: string;
  viewCount: number;
  scrapCount: number;
  applyCount: number;
  closingDate: string | null;
  createdAt: string;
  albaAttributes: {
    hourlyWage: number;
    workPeriod: string | null;
    workDaysMask: string;
    workTimeStart: string | null;
    workTimeEnd: string | null;
  } | null;
  company: {
    companyId: string;
    companyName: string;
    brandName: string | null;
    logoImageUrl: string | null;
  } | null;
  /** 비자 필터 적용 시 서버에서 내려주는 적격 정보 / Eligibility info from visa-filtered API */
  eligibility?: {
    eligible: boolean;
    visaCode: string;
    restrictions: string[];
    notes: string[];
    documentsRequired: string[];
  };
}

/** 사용자 유형 분기 / User type branching */
type UserMode = 'guest' | 'company' | 'individual_unverified' | 'individual_verified';

export default function AlbaPage() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [premiumJobs, setPremiumJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [visaFilter, setVisaFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [visaTypes, setVisaTypes] = useState<{ code: string; nameKo: string }[]>([]);

  // 비자 필터 상태 / Visa filter state
  const [userMode, setUserMode] = useState<UserMode>('guest');
  const [eligibilityFilterOn, setEligibilityFilterOn] = useState(false);
  const [userVisaCode, setUserVisaCode] = useState<string | null>(null);

  // 사용자 상태 확인 / Check user auth state + visa verification
  useEffect(() => {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      setUserMode('guest');
      return;
    }

    // 프로필 조회 / Fetch profile to check user type
    fetch('/api/auth/profile-detail', { credentials: 'include' })
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(profile => {
        if (profile.userType === 'CORPORATE') {
          setUserMode('company');
          return;
        }

        // 개인 사용자: 비자 인증 여부 확인 / Individual: check visa verification
        fetch('/api/visa-verification/me', { credentials: 'include' })
          .then(r => { if (!r.ok) throw new Error(); return r.json(); })
          .then(verification => {
            if (verification && verification.visaCode && verification.verificationStatus !== 'REJECTED') {
              setUserMode('individual_verified');
              setUserVisaCode(verification.visaCode);
              setEligibilityFilterOn(true); // 기본: ON / Default: ON
            } else {
              setUserMode('individual_unverified');
            }
          })
          .catch(() => {
            setUserMode('individual_unverified');
          });
      })
      .catch(() => {
        setUserMode('guest');
      });
  }, []);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      // 비자 인증 사용자 + 필터 ON → eligible API / Verified user + filter ON → eligible API
      if (userMode === 'individual_verified' && eligibilityFilterOn) {
        const params = new URLSearchParams({ boardType: 'PART_TIME', page: page.toString(), limit: '20' });
        if (keyword) params.set('keyword', keyword);
        const res = await fetch(`/api/jobs/eligible?${params}`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          const allItems = data.items || [];
          setPremiumJobs(allItems.filter((j: JobPosting) => j.tierType === 'PREMIUM'));
          setJobs(allItems.filter((j: JobPosting) => j.tierType === 'STANDARD'));
          setTotalPages(data.totalPages || 1);
          setTotal(data.total || 0);
        } else {
          // API 실패 시 일반 목록 fallback / Fallback to normal listing on API failure
          await fetchNormalJobs();
        }
      } else {
        await fetchNormalJobs();
      }
    } catch {
      await fetchNormalJobs();
    } finally {
      setLoading(false);
    }
  }, [page, keyword, visaFilter, userMode, eligibilityFilterOn]);

  // 일반 목록 조회 / Normal listing fetch
  const fetchNormalJobs = async () => {
    try {
      const params = new URLSearchParams({ boardType: 'PART_TIME', page: page.toString(), limit: '20' });
      if (keyword) params.set('keyword', keyword);
      if (visaFilter) params.set('visa', visaFilter);
      // 비자 인증 사용자: 뱃지 표시를 위해 visaFilter=true / Verified user: pass visaFilter for badges
      if (userMode === 'individual_verified' && !eligibilityFilterOn) {
        params.set('visaFilter', 'true');
      }
      const res = await fetch(`/api/jobs/list?${params}`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        const allItems = data.items || [];
        setPremiumJobs(allItems.filter((j: JobPosting) => j.tierType === 'PREMIUM'));
        setJobs(allItems.filter((j: JobPosting) => j.tierType === 'STANDARD'));
        setTotalPages(data.totalPages || 1);
        setTotal(data.total || 0);
      }
    } catch { /* 에러 시 빈 목록 유지 / Keep empty on error */ }
  };

  useEffect(() => { fetchJobs(); }, [fetchJobs]);
  useEffect(() => {
    fetch('/api/jobs/visa-types').then(r => r.json()).then(d => { if (Array.isArray(d)) setVisaTypes(d); }).catch(() => {});
  }, []);

  const handleSearch = () => { setPage(1); fetchJobs(); };

  const getDDay = (closingDate: string | null) => {
    if (!closingDate) return null;
    const diff = Math.ceil((new Date(closingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return '마감';
    if (diff === 0) return 'D-Day';
    return `D-${diff}`;
  };

  /** 적격 뱃지 렌더 / Render eligibility badge */
  const renderEligibilityBadge = (job: JobPosting) => {
    if (!job.eligibility || userMode !== 'individual_verified') return null;

    if (job.eligibility.eligible && job.eligibility.restrictions.length === 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-semibold rounded border border-green-200">
          <CheckCircle className="w-3 h-3" />지원 가능
        </span>
      );
    }
    if (job.eligibility.eligible && job.eligibility.restrictions.length > 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-50 text-yellow-700 text-[10px] font-semibold rounded border border-yellow-200"
          title={job.eligibility.restrictions[0]}>
          <AlertTriangle className="w-3 h-3" />조건부
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-semibold rounded border border-gray-200">
        <XCircle className="w-3 h-3" />지원 불가
      </span>
    );
  };

  return (
    <div className="grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-end mb-5">
          <div>
            <h1 className="text-xl font-bold text-gray-900">알바채용관</h1>
            <p className="text-xs text-gray-500 mt-0.5">외국인이 지원 가능한 알바 공고를 모아봤어요</p>
          </div>
          <span className="text-xs text-gray-400">{total > 0 && `총 ${total}건`}</span>
        </div>

        {/* 비자 미인증 배너 / Unverified user banner */}
        {userMode === 'individual_unverified' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-semibold text-blue-800">비자 인증하면 지원 가능 공고를 확인할 수 있어요</p>
                <p className="text-xs text-blue-600 mt-0.5">내 비자에 맞는 공고만 필터링하고, 적격 여부를 바로 확인하세요</p>
              </div>
            </div>
            <Link href="/visa-verification"
              className="shrink-0 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-md transition">
              인증하기
            </Link>
          </div>
        )}

        {/* 비자 필터 토글 / Visa eligibility filter toggle */}
        {userMode === 'individual_verified' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-800 font-medium">
                비자 인증 완료 {userVisaCode && <span className="text-green-600">({userVisaCode})</span>}
              </span>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-xs text-green-700 font-medium">내 비자로 지원 가능한 공고만</span>
              <button
                onClick={() => { setEligibilityFilterOn(prev => !prev); setPage(1); }}
                className={`relative w-10 h-5 rounded-full transition-colors ${eligibilityFilterOn ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${eligibilityFilterOn ? 'translate-x-5' : ''}`} />
              </button>
            </label>
          </div>
        )}

        {/* Search / 검색 */}
        <div className="dashboard-card p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="검색어를 입력하세요" value={keyword}
                onChange={(e) => setKeyword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-md text-sm focus:border-blue-500 outline-none transition" />
            </div>
            {/* 필터 ON일 때 비자 드롭다운 숨김 / Hide visa dropdown when eligibility filter is ON */}
            {!eligibilityFilterOn && (
              <select value={visaFilter} onChange={(e) => { setVisaFilter(e.target.value); setPage(1); }}
                className="px-3 py-2.5 border border-gray-200 rounded-md text-sm text-gray-700 outline-none cursor-pointer">
                <option value="">비자 전체</option>
                {visaTypes.map(v => <option key={v.code} value={v.code}>{v.code} ({v.nameKo})</option>)}
              </select>
            )}
            <button onClick={handleSearch}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-semibold transition">
              검색
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-blue-600" />
          </div>
        ) : (
          <>
            {/* Premium / 프리미엄 공고 */}
            {premiumJobs.length > 0 && (
              <div className="mb-8">
                <h2 className="font-bold text-gray-900 text-sm mb-3">프리미엄 공고</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {premiumJobs.map((job) => (
                    <Link key={job.id} href={`/jobs/${job.id}`}>
                      <div className="dashboard-card p-4 hover:border-blue-300 transition group cursor-pointer">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">PREMIUM</span>
                            {renderEligibilityBadge(job)}
                          </div>
                          {getDDay(job.closingDate) && (
                            <span className={`text-[11px] font-semibold ${getDDay(job.closingDate) === '마감' ? 'text-red-500' : 'text-blue-600'}`}>
                              {getDDay(job.closingDate)}
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">{job.title}</h3>
                        <p className="text-xs text-gray-500 mb-2">{job.company?.brandName || job.company?.companyName}</p>
                        <div className="space-y-1 text-xs text-gray-400">
                          <div className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.displayAddress}</div>
                          {job.albaAttributes && <div className="text-blue-600 font-semibold">시급 {job.albaAttributes.hourlyWage.toLocaleString()}원</div>}
                        </div>
                        <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-gray-100">
                          <div className="flex flex-wrap gap-1">
                            {job.allowedVisas.split(',').slice(0, 3).map(v => (
                              <span key={v} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-medium rounded">{v.trim()}</span>
                            ))}
                          </div>
                          <span className="text-[11px] text-gray-400 flex items-center gap-0.5"><Eye className="w-3 h-3" />{job.viewCount}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Standard — Table / 일반 공고 */}
            <div className="mb-6">
              <h2 className="font-bold text-gray-900 text-sm mb-3">일반 공고</h2>
              {jobs.length === 0 && premiumJobs.length === 0 ? (
                <div className="dashboard-card p-10 text-center">
                  <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-500 text-sm">
                    {eligibilityFilterOn ? '내 비자로 지원 가능한 알바 공고가 없습니다' : '공고가 없습니다'}
                  </h3>
                  <p className="text-gray-400 mt-1 text-xs">
                    {eligibilityFilterOn
                      ? '필터를 해제하면 전체 공고를 볼 수 있어요.'
                      : '아직 등록된 알바 공고가 없어요.'}
                  </p>
                </div>
              ) : (
                <div className="dashboard-card overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wide">공고명</th>
                        <th className="px-4 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wide hidden sm:table-cell">기업</th>
                        <th className="px-4 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wide hidden md:table-cell">지역</th>
                        <th className="px-4 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wide">시급</th>
                        {userMode === 'individual_verified' && (
                          <th className="px-4 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wide hidden md:table-cell">적격</th>
                        )}
                        <th className="px-4 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wide hidden lg:table-cell">비자</th>
                        <th className="px-4 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wide hidden lg:table-cell">지원자</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {jobs.map((job) => (
                        <tr key={job.id} className="hover:bg-gray-50 transition cursor-pointer group">
                          <td className="px-4 py-3">
                            <Link href={`/jobs/${job.id}`} className="block">
                              <p className="font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">{job.title}</p>
                              {getDDay(job.closingDate) && (
                                <span className={`text-[11px] font-semibold ${getDDay(job.closingDate) === '마감' ? 'text-red-500' : 'text-blue-600'}`}>
                                  {getDDay(job.closingDate)}
                                </span>
                              )}
                            </Link>
                          </td>
                          <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{job.company?.brandName || job.company?.companyName}</td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <span className="text-gray-400 text-xs">{job.displayAddress}</span>
                          </td>
                          <td className="px-4 py-3">
                            {job.albaAttributes && <span className="font-semibold text-blue-600">{job.albaAttributes.hourlyWage.toLocaleString()}원</span>}
                          </td>
                          {userMode === 'individual_verified' && (
                            <td className="px-4 py-3 hidden md:table-cell">
                              {renderEligibilityBadge(job)}
                            </td>
                          )}
                          <td className="px-4 py-3 hidden lg:table-cell">
                            <div className="flex flex-wrap gap-1">
                              {job.allowedVisas.split(',').slice(0, 2).map(v => (
                                <span key={v} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-medium rounded">{v.trim()}</span>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3 hidden lg:table-cell">
                            <span className="text-gray-400 flex items-center gap-1"><Users className="w-3 h-3" />{job.applyCount}명</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Pagination / 페이지네이션 */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-1.5 mt-6">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="p-2 rounded-md border border-gray-200 disabled:opacity-30 hover:bg-gray-50">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
                  const num = start + i;
                  return (
                    <button key={num} onClick={() => setPage(num)}
                      className={`w-8 h-8 rounded-md text-sm font-medium ${num === page ? 'bg-blue-600 text-white' : 'border border-gray-200 hover:bg-gray-50'}`}>
                      {num}
                    </button>
                  );
                })}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="p-2 rounded-md border border-gray-200 disabled:opacity-30 hover:bg-gray-50">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
    </div>
  );
}
