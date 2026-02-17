'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search, Filter, X, Eye, CreditCard, ChevronDown, ChevronUp,
  AlertTriangle, Loader2, Users, Globe, Briefcase,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

/** 인재 프로필 / Talent profile */
interface TalentProfile {
  id: number;
  nationality: string;
  nationalityLabel: string;
  visaType: string;
  jobCategory: string;
  experienceYears: number;
  topikLevel: number;
  region: string;
  educationLevel: string;
  viewed?: boolean;
}

/** 필터 상태 / Filter state */
interface FilterState {
  visaTypes: string[];
  nationality: string;
  koreanLevel: string;
  jobCategory: string;
  experience: string;
  education: string;
  region: string;
  keyword: string;
}

const VISA_OPTIONS = [
  { code: 'E-9', label: 'E-9 비전문취업' },
  { code: 'E-7', label: 'E-7 특정활동' },
  { code: 'H-2', label: 'H-2 방문취업' },
  { code: 'F-2', label: 'F-2 거주' },
  { code: 'F-4', label: 'F-4 재외동포' },
  { code: 'F-5', label: 'F-5 영주' },
  { code: 'F-6', label: 'F-6 결혼이민' },
  { code: 'D-2', label: 'D-2 유학' },
  { code: 'D-10', label: 'D-10 구직' },
  { code: 'E-2', label: 'E-2 회화지도' },
  { code: 'H-1', label: 'H-1 관광취업' },
  { code: 'C-4', label: 'C-4 단기취업' },
];

const NATIONALITY_OPTIONS = [
  '전체', '베트남', '필리핀', '태국', '인도네시아', '중국',
  '캄보디아', '미얀마', '네팔', '우즈베키스탄', '몽골', '방글라데시', '스리랑카',
];

const EXPERIENCE_OPTIONS = [
  { value: '', label: '경력 무관' },
  { value: 'ENTRY', label: '신입' },
  { value: '1-3', label: '1~3년' },
  { value: '3-5', label: '3~5년' },
  { value: '5-10', label: '5~10년' },
  { value: '10+', label: '10년+' },
];

const EDUCATION_OPTIONS = [
  { value: '', label: '학력 무관' },
  { value: 'HIGH_SCHOOL', label: '고졸' },
  { value: 'ASSOCIATE', label: '초대졸' },
  { value: 'BACHELOR', label: '대졸' },
  { value: 'MASTER', label: '석사+' },
];

const REGION_OPTIONS = [
  '전체', '서울', '경기', '인천', '부산', '대구', '광주', '대전',
  '울산', '세종', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주',
];

const CATEGORY_OPTIONS = [
  '전체', '제조/생산', '건설/토목', '음식/서비스', '농업/축산', '어업/수산',
  'IT/소프트웨어', '사무/행정', '판매/유통', '교육/강사', '운송/물류', '숙박/관광',
];

// 더미 인재 데이터 / Sample talent data (API 연동 전)
const SAMPLE_TALENTS: TalentProfile[] = [
  { id: 1, nationality: 'VN', nationalityLabel: '베트남', visaType: 'E-7-1', jobCategory: 'IT/소프트웨어', experienceYears: 3, topikLevel: 4, region: '서울', educationLevel: 'BACHELOR' },
  { id: 2, nationality: 'PH', nationalityLabel: '필리핀', visaType: 'E-9', jobCategory: '제조/생산', experienceYears: 2, topikLevel: 3, region: '경기', educationLevel: 'HIGH_SCHOOL' },
  { id: 3, nationality: 'TH', nationalityLabel: '태국', visaType: 'E-9', jobCategory: '음식/서비스', experienceYears: 1, topikLevel: 2, region: '부산', educationLevel: 'ASSOCIATE' },
  { id: 4, nationality: 'CN', nationalityLabel: '중국', visaType: 'F-4', jobCategory: '사무/행정', experienceYears: 5, topikLevel: 5, region: '서울', educationLevel: 'MASTER' },
  { id: 5, nationality: 'ID', nationalityLabel: '인도네시아', visaType: 'H-2', jobCategory: '건설/토목', experienceYears: 4, topikLevel: 3, region: '인천', educationLevel: 'HIGH_SCHOOL' },
  { id: 6, nationality: 'UZ', nationalityLabel: '우즈베키스탄', visaType: 'E-9', jobCategory: '농업/축산', experienceYears: 2, topikLevel: 2, region: '충남', educationLevel: 'HIGH_SCHOOL' },
  { id: 7, nationality: 'NP', nationalityLabel: '네팔', visaType: 'E-9', jobCategory: '제조/생산', experienceYears: 3, topikLevel: 3, region: '경기', educationLevel: 'HIGH_SCHOOL' },
  { id: 8, nationality: 'MM', nationalityLabel: '미얀마', visaType: 'E-9', jobCategory: '어업/수산', experienceYears: 1, topikLevel: 2, region: '전남', educationLevel: 'HIGH_SCHOOL' },
];

/**
 * 인재 검색 페이지 / Talent search page
 * 필터 사이드바 + 검색 결과 카드 + 열람권 차감
 */
export default function CompanyTalentsPage() {
  const [showFilter, setShowFilter] = useState(false);
  const [showMoreVisas, setShowMoreVisas] = useState(false);
  const [credits, setCredits] = useState(5);
  const [creditModal, setCreditModal] = useState<TalentProfile | null>(null);
  const [viewedIds, setViewedIds] = useState<Set<number>>(new Set());

  const [filters, setFilters] = useState<FilterState>({
    visaTypes: [], nationality: '전체', koreanLevel: '', jobCategory: '전체',
    experience: '', education: '', region: '전체', keyword: '',
  });

  const updateFilter = (updates: Partial<FilterState>) => setFilters(prev => ({ ...prev, ...updates }));

  const toggleVisaType = (code: string) => {
    setFilters(prev => ({
      ...prev,
      visaTypes: prev.visaTypes.includes(code)
        ? prev.visaTypes.filter(v => v !== code) : [...prev.visaTypes, code],
    }));
  };

  // 필터 적용 / Apply filters
  const filteredTalents = useMemo(() => {
    return SAMPLE_TALENTS.filter(t => {
      if (filters.visaTypes.length > 0 && !filters.visaTypes.some(v => t.visaType.startsWith(v))) return false;
      if (filters.nationality !== '전체' && t.nationalityLabel !== filters.nationality) return false;
      if (filters.jobCategory !== '전체' && t.jobCategory !== filters.jobCategory) return false;
      if (filters.region !== '전체' && t.region !== filters.region) return false;
      if (filters.keyword && !t.jobCategory.includes(filters.keyword) && !t.nationalityLabel.includes(filters.keyword)) return false;
      return true;
    });
  }, [filters]);

  const getFlag = (code: string) => {
    if (!code || code.length !== 2) return '';
    return String.fromCodePoint(...[...code.toUpperCase()].map(c => 0x1F1E6 + c.charCodeAt(0) - 65));
  };

  const handleViewProfile = (talent: TalentProfile) => {
    if (viewedIds.has(talent.id)) { /* 이미 열람 / already viewed */ return; }
    setCreditModal(talent);
  };

  const confirmView = (talent: TalentProfile) => {
    setCredits(prev => prev - 1);
    setViewedIds(prev => new Set([...prev, talent.id]));
    setCreditModal(null);
  };

  const visasToShow = showMoreVisas ? VISA_OPTIONS : VISA_OPTIONS.slice(0, 7);

  // 필터 사이드바 컨텐츠 / Filter sidebar content
  const FilterContent = () => (
    <div className="space-y-5">
      {/* 비자 유형 / Visa type */}
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-2">비자 유형</h3>
        <div className="space-y-1.5">
          {visasToShow.map(v => (
            <label key={v.code} className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={filters.visaTypes.includes(v.code)} onCheckedChange={() => toggleVisaType(v.code)} />
              <span className="text-sm text-gray-600">{v.label}</span>
            </label>
          ))}
        </div>
        {VISA_OPTIONS.length > 7 && (
          <button onClick={() => setShowMoreVisas(!showMoreVisas)} className="text-xs text-blue-600 mt-1 hover:underline">
            {showMoreVisas ? '접기' : `더보기 (+${VISA_OPTIONS.length - 7})`}
          </button>
        )}
      </div>

      {/* 국적 / Nationality */}
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-2">국적</h3>
        <select value={filters.nationality} onChange={e => updateFilter({ nationality: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
          {NATIONALITY_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>

      {/* 직종 / Job category */}
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-2">직종</h3>
        <select value={filters.jobCategory} onChange={e => updateFilter({ jobCategory: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
          {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* 경력 / Experience */}
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-2">경력</h3>
        <div className="space-y-1.5">
          {EXPERIENCE_OPTIONS.map(opt => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="exp" checked={filters.experience === opt.value} onChange={() => updateFilter({ experience: opt.value })} className="accent-blue-600" />
              <span className="text-sm text-gray-600">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 학력 / Education */}
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-2">학력</h3>
        <select value={filters.education} onChange={e => updateFilter({ education: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
          {EDUCATION_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
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
      <button onClick={() => setFilters({ visaTypes: [], nationality: '전체', koreanLevel: '', jobCategory: '전체', experience: '', education: '', region: '전체', keyword: '' })}
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
            <CreditCard className="w-3 h-3 inline mr-1" />잔여 열람권: <span className="font-bold text-gray-900">{credits}건</span>
          </span>
          <Link href="/company/payments/credits" className="text-xs text-blue-600 font-medium hover:text-blue-700">열람권 구매</Link>
        </div>
      </div>

      {/* 검색바 + 필터 토글 / Search + filter toggle */}
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
          <p className="text-sm text-gray-500 mb-4">검색 결과 <span className="font-bold text-gray-900">{filteredTalents.length}</span>명</p>
          {filteredTalents.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">조건에 맞는 인재가 없습니다.</p>
              <p className="text-xs text-gray-400 mt-1">필터를 조정해보세요.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredTalents.map(talent => {
                const isViewed = viewedIds.has(talent.id);
                return (
                  <div key={talent.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-base">{getFlag(talent.nationality)}</span>
                      <span className="text-sm font-medium text-gray-700">{talent.nationalityLabel}</span>
                      <span className="inline-flex items-center gap-0.5 text-xs px-2 py-0.5 bg-green-50 text-green-700 rounded-full">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />{talent.visaType}
                      </span>
                    </div>
                    <div className="space-y-1 text-xs text-gray-500">
                      <p className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {talent.jobCategory} | 경력 {talent.experienceYears}년</p>
                      <p className="flex items-center gap-1"><Globe className="w-3 h-3" /> TOPIK {talent.topikLevel}급 | {talent.region} 거주</p>
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
          )}
        </div>
      </div>

      {/* 열람권 확인 모달 / Credit confirmation modal */}
      {creditModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6">
            <button onClick={() => setCreditModal(null)} className="float-right text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            {credits > 0 ? (
              <>
                <div className="text-center mb-4">
                  <Eye className="w-10 h-10 text-blue-500 mx-auto mb-2" />
                  <h3 className="font-bold text-gray-900">프로필 열람</h3>
                  <p className="text-sm text-gray-500 mt-1">열람권 1건을 사용합니다.</p>
                  <p className="text-xs text-gray-400 mt-1">현재 잔여: {credits}건</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setCreditModal(null)}>취소</Button>
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" onClick={() => confirmView(creditModal)}>확인</Button>
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
