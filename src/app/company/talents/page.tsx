'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Search, Filter, X, Eye, CreditCard,
  AlertTriangle, Loader2, Users, Globe, Briefcase, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

/** 인재 프로필 (API 응답) / Talent profile from API */
interface TalentProfile {
  resumeId: number;
  nationality: string;
  topikLevel: number;
  kiipLevel: number;
  preferredJobTypes: string[];
  preferredRegions: string[];
  workExperienceCount: number;
  updatedAt: string;
}

/** 필터 상태 / Filter state */
interface FilterState {
  nationality: string;
  topikLevel: string;
  jobType: string;
  region: string;
  keyword: string;
}

/** 국적 코드 → 라벨 매핑 / Nationality code to label */
const NATIONALITY_MAP: Record<string, string> = {
  VN: '베트남', PH: '필리핀', TH: '태국', ID: '인도네시아', CN: '중국',
  KH: '캄보디아', MM: '미얀마', NP: '네팔', UZ: '우즈베키스탄', MN: '몽골',
  BD: '방글라데시', LK: '스리랑카', KR: '한국', JP: '일본', US: '미국',
  IN: '인도', PK: '파키스탄', RU: '러시아',
};

const NATIONALITY_OPTIONS = ['전체', '베트남', '필리핀', '태국', '인도네시아', '중국',
  '캄보디아', '미얀마', '네팔', '우즈베키스탄', '몽골', '방글라데시', '스리랑카'];

const REGION_OPTIONS = ['전체', '서울', '경기', '인천', '부산', '대구', '광주', '대전',
  '울산', '세종', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'];

const CATEGORY_OPTIONS = ['전체', '제조/생산', '건설/토목', '음식/서비스', '농업/축산', '어업/수산',
  'IT/소프트웨어', '사무/행정', '판매/유통', '교육/강사', '운송/물류', '숙박/관광'];

const TOPIK_OPTIONS = [
  { value: '', label: 'TOPIK 무관' },
  { value: '1', label: '1급 이상' },
  { value: '2', label: '2급 이상' },
  { value: '3', label: '3급 이상' },
  { value: '4', label: '4급 이상' },
  { value: '5', label: '5급 이상' },
  { value: '6', label: '6급' },
];

/**
 * 인재 검색 페이지 / Talent search page
 * 실제 API 연동: GET /api/resumes/search + 열람권 차감
 * Real API integration: GET /api/resumes/search + viewing credit deduction
 */
export default function CompanyTalentsPage() {
  const [showFilter, setShowFilter] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);
  const [creditModal, setCreditModal] = useState<TalentProfile | null>(null);
  const [viewedIds, setViewedIds] = useState<Set<number>>(new Set());
  const [talents, setTalents] = useState<TalentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [viewLoading, setViewLoading] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    nationality: '전체', topikLevel: '', jobType: '전체', region: '전체', keyword: '',
  });

  const updateFilter = (updates: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...updates }));
    setPage(1);
  };

  // 국적 라벨 → 코드 변환 / Convert nationality label to code
  const getNationalityCode = (label: string): string => {
    const entry = Object.entries(NATIONALITY_MAP).find(([, v]) => v === label);
    return entry ? entry[0] : '';
  };

  // 국기 이모지 / Flag emoji
  const getFlag = (code: string) => {
    if (!code || code.length !== 2) return '';
    return String.fromCodePoint(...[...code.toUpperCase()].map(c => 0x1F1E6 + c.charCodeAt(0) - 65));
  };

  // 열람권 잔액 조회 / Fetch viewing credits balance
  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const res = await fetch('/api/payments/viewing-credits/balance', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setCredits(data.totalRemaining ?? 0);
        }
      } catch { setCredits(0); }
    };
    fetchCredits();
  }, []);

  // 인재 검색 API 호출 / Search talents API call
  const fetchTalents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (filters.nationality !== '전체') params.set('nationality', getNationalityCode(filters.nationality));
      if (filters.topikLevel) params.set('topikLevel', filters.topikLevel);
      if (filters.jobType !== '전체') params.set('jobType', filters.jobType);
      if (filters.region !== '전체') params.set('region', filters.region);

      const res = await fetch(`/api/resumes/search?${params}`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setTalents(data.talents || []);
        setTotal(data.pagination?.total ?? 0);
        setTotalPages(data.pagination?.totalPages ?? 1);
      } else {
        setTalents([]);
        setTotal(0);
      }
    } catch {
      setTalents([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => { fetchTalents(); }, [fetchTalents]);

  // 프로필 열람 요청 / Request profile view
  const handleViewProfile = async (talent: TalentProfile) => {
    if (viewedIds.has(talent.resumeId)) return;
    setCreditModal(talent);
  };

  // 열람 확인 (실제 API 호출) / Confirm view (actual API call)
  const confirmView = async (talent: TalentProfile) => {
    setViewLoading(true);
    try {
      const res = await fetch(`/api/resumes/${talent.resumeId}/detail`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setViewedIds(prev => new Set([...prev, talent.resumeId]));
        setCredits(data.remainingCredits ?? (credits !== null ? credits - 1 : 0));
        setCreditModal(null);
        // TODO: 프로필 상세 모달 표시 / Show profile detail modal
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.message || '프로필 조회에 실패했습니다.');
      }
    } catch {
      alert('네트워크 오류가 발생했습니다.');
    } finally {
      setViewLoading(false);
    }
  };

  // 필터 사이드바 컨텐츠 / Filter sidebar content
  const FilterContent = () => (
    <div className="space-y-5">
      {/* 국적 / Nationality */}
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-2">국적</h3>
        <select value={filters.nationality} onChange={e => updateFilter({ nationality: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
          {NATIONALITY_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>

      {/* TOPIK 등급 / TOPIK level */}
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-2">한국어 수준</h3>
        <select value={filters.topikLevel} onChange={e => updateFilter({ topikLevel: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
          {TOPIK_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>

      {/* 직종 / Job category */}
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-2">직종</h3>
        <select value={filters.jobType} onChange={e => updateFilter({ jobType: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
          {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* 지역 / Region */}
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-2">지역</h3>
        <select value={filters.region} onChange={e => updateFilter({ region: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
          {REGION_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {/* 필터 초기화 / Reset */}
      <button onClick={() => { setFilters({ nationality: '전체', topikLevel: '', jobType: '전체', region: '전체', keyword: '' }); setPage(1); }}
        className="w-full text-sm text-gray-500 hover:text-gray-700 py-2 border border-gray-200 rounded-lg">
        필터 초기화
      </button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* 헤더 / Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">인재 검색</h1>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 bg-gray-100 rounded-lg px-3 py-1.5">
            <CreditCard className="w-3 h-3 inline mr-1" />잔여 열람권: <span className="font-bold text-gray-900">{credits ?? '-'}건</span>
          </span>
          <Link href="/company/payments/credits" className="text-xs text-blue-600 font-medium hover:text-blue-700">열람권 구매</Link>
        </div>
      </div>

      {/* 검색바 / Search bar */}
      <div className="flex gap-2 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input value={filters.keyword} onChange={e => updateFilter({ keyword: e.target.value })}
            placeholder="직종, 국적, 기술 등으로 검색" className="pl-10" />
        </div>
        <button onClick={() => setShowFilter(!showFilter)}
          className="md:hidden px-3 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition">
          <Filter className="w-4 h-4" />
        </button>
      </div>

      <div className="flex gap-6">
        {/* 필터 사이드바 (웹) / Filter sidebar (desktop) */}
        <aside className="hidden md:block w-56 shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-20">
            <h2 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-gray-500" /> 필터
            </h2>
            <FilterContent />
          </div>
        </aside>

        {/* 모바일 필터 시트 / Mobile filter sheet */}
        {showFilter && (
          <div className="md:hidden fixed inset-0 bg-black/40 z-50">
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl max-h-[80vh] overflow-y-auto p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900">필터</h2>
                <button onClick={() => setShowFilter(false)}><X className="w-5 h-5 text-gray-500" /></button>
              </div>
              <FilterContent />
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4" onClick={() => setShowFilter(false)}>적용</Button>
            </div>
          </div>
        )}

        {/* 검색 결과 / Search results */}
        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-4">검색 결과 <span className="font-bold text-gray-900">{total}</span>명</p>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : talents.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">조건에 맞는 인재가 없습니다.</p>
              <p className="text-xs text-gray-400 mt-1">필터를 조정해보세요.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {talents.map(talent => {
                  const isViewed = viewedIds.has(talent.resumeId);
                  const natLabel = NATIONALITY_MAP[talent.nationality] || talent.nationality;
                  return (
                    <div key={talent.resumeId} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-base">{getFlag(talent.nationality)}</span>
                        <span className="text-sm font-medium text-gray-700">{natLabel}</span>
                        {talent.topikLevel > 0 && (
                          <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">
                            TOPIK {talent.topikLevel}급
                          </span>
                        )}
                      </div>
                      <div className="space-y-1 text-xs text-gray-500">
                        <p className="flex items-center gap-1">
                          <Briefcase className="w-3 h-3" />
                          {talent.preferredJobTypes?.length > 0 ? talent.preferredJobTypes.join(', ') : '직종 미설정'}
                          {talent.workExperienceCount > 0 && ` | 경력 ${talent.workExperienceCount}건`}
                        </p>
                        <p className="flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          {talent.preferredRegions?.length > 0 ? talent.preferredRegions.join(', ') : '지역 미설정'}
                        </p>
                      </div>
                      <button
                        onClick={() => handleViewProfile(talent)}
                        className={`w-full mt-3 py-2 text-xs font-medium rounded-lg border transition ${
                          isViewed
                            ? 'text-gray-500 border-gray-200 bg-gray-50'
                            : 'text-blue-600 border-blue-200 hover:bg-blue-50'
                        }`}>
                        <Eye className="w-3 h-3 inline mr-1" />
                        {isViewed ? '프로필 보기' : '프로필 보기 — 열람권 1건'}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* 페이지네이션 / Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
                    className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-gray-600">{page} / {totalPages}</span>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
                    className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* 열람권 확인 모달 / Credit confirmation modal */}
      {creditModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6">
            <button onClick={() => setCreditModal(null)} className="float-right text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            {(credits ?? 0) > 0 ? (
              <>
                <div className="text-center mb-4">
                  <Eye className="w-10 h-10 text-blue-500 mx-auto mb-2" />
                  <h3 className="font-bold text-gray-900">프로필 열람</h3>
                  <p className="text-sm text-gray-500 mt-1">열람권 1건을 사용합니다.</p>
                  <p className="text-xs text-gray-400 mt-1">현재 잔여: {credits}건</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setCreditModal(null)}>취소</Button>
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" onClick={() => confirmView(creditModal)} disabled={viewLoading}>
                    {viewLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : '확인'}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="text-center mb-4">
                  <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
                  <h3 className="font-bold text-gray-900">열람권이 부족합니다</h3>
                  <p className="text-sm text-gray-500 mt-1">프로필을 보려면 열람권이 필요합니다.</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setCreditModal(null)}>닫기</Button>
                  <Link href="/company/payments/credits" className="flex-1">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">열람권 구매하기</Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
