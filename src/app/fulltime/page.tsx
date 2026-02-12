'use client';

import Header from '@/components/header';
import Footer from '@/components/footer';
import { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, Eye, Users, ChevronLeft, ChevronRight, Briefcase } from 'lucide-react';
import Link from 'next/link';

interface JobPosting {
  id: string;
  title: string;
  boardType: string;
  tierType: string;
  status: string;
  displayAddress: string;
  allowedVisas: string;
  employmentSubType: string | null;
  applicationMethod: string;
  viewCount: number;
  scrapCount: number;
  applyCount: number;
  closingDate: string | null;
  createdAt: string;
  fulltimeAttributes: {
    salaryMin: number | null;
    salaryMax: number | null;
    experienceLevel: string;
    educationLevel: string;
  } | null;
  company: {
    companyId: string;
    companyName: string;
    brandName: string | null;
    logoImageUrl: string | null;
  } | null;
}

const SUB_TYPE_LABELS: Record<string, string> = {
  CONTRACT: '계약직',
  PERMANENT: '정규직',
  INTERNSHIP: '인턴십',
};

const EXP_LABELS: Record<string, string> = {
  ENTRY: '신입',
  JUNIOR: '1~3년',
  MID: '3~5년',
  SENIOR: '5년 이상',
};

function formatSalaryWon(val: number | null): string {
  if (!val) return '';
  if (val >= 10000) return Math.round(val / 10000).toLocaleString();
  return val.toLocaleString();
}

function formatSalaryRange(min: number | null, max: number | null): string {
  const minStr = formatSalaryWon(min);
  const maxStr = formatSalaryWon(max);
  if (minStr && maxStr) return `${minStr}~${maxStr}만원`;
  if (minStr) return `${minStr}만원~`;
  if (maxStr) return `~${maxStr}만원`;
  return '협의';
}

export default function FulltimePage() {
  const [isCompanyMode, setIsCompanyMode] = useState(false);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [premiumJobs, setPremiumJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [visaFilter, setVisaFilter] = useState('');
  const [subTypeFilter, setSubTypeFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [visaTypes, setVisaTypes] = useState<{ code: string; nameKo: string }[]>([]);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ boardType: 'FULL_TIME', page: page.toString(), limit: '20' });
      if (keyword) params.set('keyword', keyword);
      if (visaFilter) params.set('visa', visaFilter);
      if (subTypeFilter) params.set('employmentSubType', subTypeFilter);
      const res = await fetch(`/api/jobs/list?${params}`);
      if (res.ok) {
        const data = await res.json();
        const allItems = data.items || [];
        setPremiumJobs(allItems.filter((j: JobPosting) => j.tierType === 'PREMIUM'));
        setJobs(allItems.filter((j: JobPosting) => j.tierType === 'STANDARD'));
        setTotalPages(data.totalPages || 1);
        setTotal(data.total || 0);
      }
    } catch (err) { console.error('Failed to fetch jobs:', err); }
    finally { setLoading(false); }
  }, [page, keyword, visaFilter, subTypeFilter]);

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

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header isCompanyMode={isCompanyMode} onToggleMode={() => setIsCompanyMode(!isCompanyMode)} onLogoClick={() => setIsCompanyMode(false)} />

      <main className="grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-end mb-5">
          <div>
            <h1 className="text-xl font-bold text-gray-900">정규직 채용관</h1>
            <p className="text-xs text-gray-500 mt-0.5">외국인이 지원 가능한 정규직 공고를 모아봤어요</p>
          </div>
          <span className="text-xs text-gray-400">{total > 0 && `총 ${total}건`}</span>
        </div>

        {/* Search */}
        <div className="dashboard-card p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="직종, 회사명으로 검색" value={keyword}
                onChange={(e) => setKeyword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-md text-sm focus:border-blue-500 outline-none transition" />
            </div>
            <select value={visaFilter} onChange={(e) => { setVisaFilter(e.target.value); setPage(1); }}
              className="px-3 py-2.5 border border-gray-200 rounded-md text-sm text-gray-700 outline-none cursor-pointer">
              <option value="">비자 전체</option>
              {visaTypes.map(v => <option key={v.code} value={v.code}>{v.code} ({v.nameKo})</option>)}
            </select>
            <select value={subTypeFilter} onChange={(e) => { setSubTypeFilter(e.target.value); setPage(1); }}
              className="px-3 py-2.5 border border-gray-200 rounded-md text-sm text-gray-700 outline-none cursor-pointer">
              <option value="">고용형태 전체</option>
              <option value="PERMANENT">정규직</option>
              <option value="CONTRACT">계약직</option>
              <option value="INTERNSHIP">인턴십</option>
            </select>
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
            {/* Premium */}
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
                            {job.employmentSubType && (
                              <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                {SUB_TYPE_LABELS[job.employmentSubType] || job.employmentSubType}
                              </span>
                            )}
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
                          {job.fulltimeAttributes && (
                            <div className="text-blue-600 font-semibold">
                              연봉 {formatSalaryRange(job.fulltimeAttributes.salaryMin, job.fulltimeAttributes.salaryMax)}
                            </div>
                          )}
                          {job.fulltimeAttributes && (
                            <div className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{EXP_LABELS[job.fulltimeAttributes.experienceLevel] || job.fulltimeAttributes.experienceLevel}</div>
                          )}
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

            {/* Standard - Table */}
            <div className="mb-6">
              <h2 className="font-bold text-gray-900 text-sm mb-3">일반 공고</h2>
              {jobs.length === 0 && premiumJobs.length === 0 ? (
                <div className="dashboard-card p-10 text-center">
                  <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-500 text-sm">공고가 없습니다</h3>
                  <p className="text-gray-400 mt-1 text-xs">아직 등록된 정규직 공고가 없어요.</p>
                </div>
              ) : (
                <div className="dashboard-card overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wide">공고명</th>
                        <th className="px-4 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wide hidden sm:table-cell">기업</th>
                        <th className="px-4 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wide hidden md:table-cell">지역</th>
                        <th className="px-4 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wide">연봉</th>
                        <th className="px-4 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wide hidden lg:table-cell">경력</th>
                        <th className="px-4 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wide hidden lg:table-cell">비자</th>
                        <th className="px-4 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wide hidden lg:table-cell">지원자</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {jobs.map((job) => (
                        <tr key={job.id} className="hover:bg-gray-50 transition cursor-pointer group">
                          <td className="px-4 py-3">
                            <Link href={`/jobs/${job.id}`} className="block">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">{job.title}</p>
                                {job.employmentSubType && (
                                  <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded shrink-0">
                                    {SUB_TYPE_LABELS[job.employmentSubType] || job.employmentSubType}
                                  </span>
                                )}
                              </div>
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
                            {job.fulltimeAttributes && (
                              <span className="font-semibold text-blue-600">
                                {formatSalaryRange(job.fulltimeAttributes.salaryMin, job.fulltimeAttributes.salaryMax)}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 hidden lg:table-cell">
                            {job.fulltimeAttributes && (
                              <span className="text-gray-600">{EXP_LABELS[job.fulltimeAttributes.experienceLevel] || job.fulltimeAttributes.experienceLevel}</span>
                            )}
                          </td>
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

            {/* Pagination */}
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
      </main>
      <Footer />
    </div>
  );
}
