'use client';

/**
 * 정규채용관 공고 상세 페이지 / Full-time job detail page
 * - 공고 상세 정보, 비자 적격 여부, 지원하기 기능
 * - Job detail, visa eligibility check, and apply functionality
 */

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronLeft, MapPin, DollarSign, Briefcase, GraduationCap,
  CheckCircle, AlertTriangle, XCircle, Building2, Calendar,
  Bookmark, BookmarkCheck, Loader2, FileText, Clock, Share2,
  Eye, Users,
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

/* ─────────────────────────────────────────────
   타입 정의 / Type definitions
───────────────────────────────────────────── */
interface JobDetail {
  id: string;
  title: string;
  boardType: string;
  tierType: 'PREMIUM' | 'STANDARD';
  status: string;
  displayAddress: string;
  allowedVisas: string;
  applicationMethod: string;
  applicationUrl: string | null;
  applicationEmail: string | null;
  viewCount: number;
  scrapCount: number;
  applyCount: number;
  closingDate: string | null;
  createdAt: string;
  detailDescription: string | null;
  preferredConditions: string | null;
  benefits: string | null;
  fulltimeAttributes: {
    salaryMin: number | null;
    salaryMax: number | null;
    experienceLevel: 'ENTRY' | 'JUNIOR' | 'MID' | 'SENIOR';
    educationLevel: string;
    employmentType: string;
    workSchedule: string | null;
    workDaysPerWeek: number | null;
  } | null;
  company: {
    companyId: string;
    companyName: string;
    brandName: string | null;
    logoImageUrl: string | null;
    industry: string | null;
    address: string | null;
  } | null;
}

interface EligibilityResult {
  eligible: boolean;
  visaCode: string;
  restrictions: string[];
  notes: string[];
  documentsRequired: string[];
}

/* ─────────────────────────────────────────────
   상수 / Constants
───────────────────────────────────────────── */
const EXP_LABELS: Record<string, string> = {
  ENTRY:  '신입',
  JUNIOR: '1~3년',
  MID:    '3~5년',
  SENIOR: '5년↑',
};

/* ─────────────────────────────────────────────
   헬퍼 함수 / Helpers
───────────────────────────────────────────── */

/** 연봉 포맷 / Format salary */
function formatSalary(min: number | null, max: number | null): string {
  if (!min && !max) return '급여 협의';
  const toMan = (v: number) => Math.round(v / 10000).toLocaleString();
  if (min && max) return `${toMan(min)}~${toMan(max)}만원`;
  if (min)        return `${toMan(min)}만원↑`;
  if (max)        return `~${toMan(max)}만원`;
  return '급여 협의';
}

/** D-Day 계산 / D-Day */
function getDDay(closingDate: string | null): string | null {
  if (!closingDate) return null;
  const diff = Math.ceil((new Date(closingDate).getTime() - Date.now()) / 86400000);
  if (diff < 0)   return '마감됨';
  if (diff === 0) return 'D-Day';
  return `D-${diff}`;
}

/** 날짜 포맷 / Format date */
function formatDate(dateStr: string | null): string {
  if (!dateStr) return '상시 모집';
  return new Date(dateStr).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
}

/* ─────────────────────────────────────────────
   서브 컴포넌트 / Sub components
───────────────────────────────────────────── */

/** 적격 카드 / Eligibility card */
function EligibilityCard({ eligibility, loading }: {
  eligibility: EligibilityResult | null;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5 animate-pulse">
        <div className="h-4 w-32 bg-gray-200 rounded mb-3" />
        <div className="h-8 w-48 bg-gray-100 rounded" />
      </div>
    );
  }
  if (!eligibility) return null;

  const { eligible, visaCode, restrictions, notes, documentsRequired } = eligibility;

  const cardStyle = eligible && restrictions.length === 0
    ? 'border-green-200 bg-green-50'
    : eligible
      ? 'border-yellow-200 bg-yellow-50'
      : 'border-gray-200 bg-gray-50';

  const icon = eligible && restrictions.length === 0
    ? <CheckCircle className="w-5 h-5 text-green-600" />
    : eligible
      ? <AlertTriangle className="w-5 h-5 text-yellow-600" />
      : <XCircle className="w-5 h-5 text-gray-400" />;

  const mainLabel = eligible && restrictions.length === 0
    ? '지원 가능'
    : eligible
      ? '조건부 지원 가능'
      : '지원 불가';

  const labelColor = eligible && restrictions.length === 0
    ? 'text-green-700'
    : eligible
      ? 'text-yellow-700'
      : 'text-gray-600';

  return (
    <div className={`rounded-xl border p-5 mb-5 ${cardStyle}`}>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <div>
          <span className={`text-sm font-bold ${labelColor}`}>{mainLabel}</span>
          <span className="text-xs text-gray-500 ml-2">({visaCode})</span>
        </div>
      </div>

      {restrictions.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-gray-600 mb-1.5">제한 조건 / Restrictions</p>
          <ul className="space-y-1">
            {restrictions.map((r, i) => (
              <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                <AlertTriangle className="w-3 h-3 text-yellow-500 shrink-0 mt-0.5" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}

      {notes.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-gray-600 mb-1.5">참고 사항 / Notes</p>
          <ul className="space-y-1">
            {notes.map((n, i) => (
              <li key={i} className="text-xs text-gray-500">• {n}</li>
            ))}
          </ul>
        </div>
      )}

      {documentsRequired.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-600 mb-1.5">필요 서류 / Required Documents</p>
          <div className="flex flex-wrap gap-1.5">
            {documentsRequired.map((doc, i) => (
              <span key={i} className="px-2 py-0.5 bg-white rounded border border-gray-200 text-xs text-gray-600">
                {doc}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   메인 컴포넌트 / Main component
───────────────────────────────────────────── */
export default function RegularJobDetailPage() {
  const params   = useParams();
  const router   = useRouter();
  const { user } = useAuth();
  const jobId = params.id as string;

  /* ── 상태 / State ── */
  const [job, setJob]                   = useState<JobDetail | null>(null);
  const [eligibility, setEligibility]   = useState<EligibilityResult | null>(null);
  const [loading, setLoading]           = useState(true);
  const [eligLoading, setEligLoading]   = useState(false);
  const [error, setError]               = useState<string | null>(null);

  /* 지원 상태 / Apply state */
  const [applying, setApplying]         = useState(false);
  const [applied, setApplied]           = useState(false);
  const [applyError, setApplyError]     = useState<string | null>(null);
  const [applySuccess, setApplySuccess] = useState(false);

  /* 스크랩 상태 / Scrap state */
  const [scrapped, setScrapped]         = useState(false);
  const [scrapping, setScrapping]       = useState(false);

  /* ── 공고 상세 로드 / Load job detail ── */
  const fetchJob = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const sessionId = localStorage.getItem('sessionId');
      const authHeader: Record<string, string> = {};
      if (sessionId) authHeader['Authorization'] = `Bearer ${sessionId}`;
      const res = await fetch(`/api/jobs/${jobId}`, { headers: authHeader });
      if (!res.ok) throw new Error('공고를 찾을 수 없습니다.');
      const data = await res.json();
      setJob(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '공고를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  /* ── 적격 여부 로드 / Load eligibility ── */
  const fetchEligibility = useCallback(async () => {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId || !user) return;
    setEligLoading(true);
    try {
      const res = await fetch(`/api/jobs/${jobId}/eligibility`, {
        headers: { Authorization: `Bearer ${sessionId}` },
      });
      if (res.ok) {
        const data = await res.json();
        setEligibility(data);
      }
    } catch {
      /* 미인증 시 무시 / Ignore when not verified */
    } finally {
      setEligLoading(false);
    }
  }, [jobId, user]);

  useEffect(() => { fetchJob(); }, [fetchJob]);
  useEffect(() => { fetchEligibility(); }, [fetchEligibility]);

  /* ── 지원하기 / Apply ── */
  const handleApply = async () => {
    // 로그인 확인 / Check login
    if (!user) {
      router.push('/auth/login?next=' + encodeURIComponent(`/worker/regular/${jobId}`));
      return;
    }
    // 이미 지원 / Already applied
    if (applied || applySuccess) return;

    setApplyError(null);
    setApplying(true);
    try {
      const sessionId = localStorage.getItem('sessionId');
      const res = await fetch('/api/applications/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(sessionId ? { Authorization: `Bearer ${sessionId}` } : {}),
        },
        body: JSON.stringify({ jobId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        // 이미 지원한 경우 처리 / Handle already applied
        if (res.status === 409) {
          setApplied(true);
          return;
        }
        throw new Error(data?.message || '지원에 실패했습니다.');
      }
      setApplySuccess(true);
      setApplied(true);
    } catch (err: unknown) {
      setApplyError(err instanceof Error ? err.message : '지원에 실패했습니다.');
    } finally {
      setApplying(false);
    }
  };

  /* ── 스크랩 / Scrap ── */
  const handleScrap = async () => {
    if (!user) {
      router.push('/auth/login?next=' + encodeURIComponent(`/worker/regular/${jobId}`));
      return;
    }
    setScrapping(true);
    try {
      const sessionId = localStorage.getItem('sessionId');
      const method = scrapped ? 'DELETE' : 'POST';
      await fetch(`/api/jobs/${jobId}/scrap`, {
        method,
        headers: sessionId ? { Authorization: `Bearer ${sessionId}` } : {},
      });
      setScrapped(prev => !prev);
    } catch {
      /* 스크랩 실패 시 무시 / Ignore on failure */
    } finally {
      setScrapping(false);
    }
  };

  /* ── 공유 / Share ── */
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: job?.title ?? '', url }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(url).catch(() => {});
    }
  };

  /* ── 로딩 / Loading ── */
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-5 w-24 bg-gray-200 rounded" />
          <div className="h-8 w-3/4 bg-gray-200 rounded" />
          <div className="h-40 bg-gray-100 rounded-xl" />
          <div className="h-60 bg-gray-100 rounded-xl" />
        </div>
      </div>
    );
  }

  /* ── 에러 / Error ── */
  if (error || !job) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <XCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-gray-700 mb-1">{error || '공고를 찾을 수 없습니다.'}</h3>
          <Link href="/worker/regular" className="mt-4 inline-block text-sm text-blue-600 hover:text-blue-700">
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const companyName = job.company?.brandName || job.company?.companyName || '기업명 미공개';
  const dDay = getDDay(job.closingDate);
  const visas = job.allowedVisas
    ? job.allowedVisas.split(',').map(v => v.trim()).filter(Boolean)
    : [];
  const benefitsList = job.benefits
    ? job.benefits.split(/[,\n]/).map(b => b.trim()).filter(Boolean)
    : [];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-32">

      {/* ── 뒤로가기 / Back button ── */}
      <Link
        href="/worker/regular"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-5 transition"
      >
        <ChevronLeft className="w-4 h-4" />
        정규채용관으로 돌아가기
      </Link>

      {/* ── 헤더 카드 / Header card ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-5">
        <div className="flex gap-4">
          {/* 로고 / Logo */}
          <div className="w-16 h-16 rounded-xl border border-gray-100 bg-white flex items-center justify-center overflow-hidden shrink-0">
            {job.company?.logoImageUrl ? (
              <Image
                src={job.company.logoImageUrl}
                alt={companyName}
                width={64}
                height={64}
                className="object-contain w-full h-full"
              />
            ) : (
              <Building2 className="w-8 h-8 text-gray-300" />
            )}
          </div>

          {/* 회사 정보 / Company info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-sm text-gray-500">{companyName}</span>
              {job.company?.industry && (
                <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                  {job.company.industry}
                </span>
              )}
              {job.tierType === 'PREMIUM' && (
                <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded">
                  PREMIUM
                </span>
              )}
            </div>

            {/* 공고 제목 / Title */}
            <h1 className="text-lg font-bold text-gray-900 leading-snug mb-2">
              {job.title}
            </h1>

            {/* 고용 형태 + D-Day / Employment type + D-Day */}
            <div className="flex items-center gap-2 flex-wrap">
              {job.fulltimeAttributes?.employmentType && (
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded border border-blue-200">
                  {job.fulltimeAttributes.employmentType}
                </span>
              )}
              {dDay && (
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  dDay === '마감됨'
                    ? 'bg-red-50 text-red-600 border border-red-200'
                    : dDay === 'D-Day'
                      ? 'bg-orange-50 text-orange-600 border border-orange-200'
                      : 'bg-blue-50 text-blue-600 border border-blue-200'
                }`}>
                  {dDay}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 공유 + 조회 / Share + view count */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{job.viewCount.toLocaleString()} 조회</span>
            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{job.applyCount.toLocaleString()} 지원</span>
          </div>
          <button
            onClick={handleShare}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition"
          >
            <Share2 className="w-3.5 h-3.5" />
            공유
          </button>
        </div>
      </div>

      {/* ── 핵심 정보 그리드 / Key info grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          {
            icon: <DollarSign className="w-4 h-4 text-blue-500" />,
            label: '연봉 / Salary',
            value: formatSalary(job.fulltimeAttributes?.salaryMin ?? null, job.fulltimeAttributes?.salaryMax ?? null),
            highlight: true,
          },
          {
            icon: <Clock className="w-4 h-4 text-purple-500" />,
            label: '경력 / Experience',
            value: job.fulltimeAttributes?.experienceLevel
              ? EXP_LABELS[job.fulltimeAttributes.experienceLevel]
              : '무관',
          },
          {
            icon: <MapPin className="w-4 h-4 text-green-500" />,
            label: '지역 / Location',
            value: job.displayAddress || '미정',
          },
          {
            icon: <GraduationCap className="w-4 h-4 text-orange-500" />,
            label: '학력 / Education',
            value: job.fulltimeAttributes?.educationLevel || '학력 무관',
          },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-1.5 mb-1.5">
              {item.icon}
              <span className="text-[10px] text-gray-400">{item.label}</span>
            </div>
            <p className={`text-sm font-semibold ${item.highlight ? 'text-blue-600' : 'text-gray-800'}`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* ── 적격 카드 (로그인 시) / Eligibility card (when logged in) ── */}
      {user && (
        eligibility || eligLoading ? (
          <EligibilityCard eligibility={eligibility} loading={eligLoading} />
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-500 shrink-0" />
              <p className="text-sm text-blue-800">비자 인증 후 지원 가능 여부를 확인하세요</p>
            </div>
            <Link
              href="/worker/visa"
              className="shrink-0 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition"
            >
              인증하기
            </Link>
          </div>
        )
      )}

      {/* ── 상세 설명 / Detail description ── */}
      {job.detailDescription && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
          <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-500" />
            상세 설명 / Job Description
          </h2>
          <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {job.detailDescription}
          </div>
        </div>
      )}

      {/* ── 우대사항 / Preferred conditions ── */}
      {job.preferredConditions && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
          <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            우대사항 / Preferred Qualifications
          </h2>
          <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {job.preferredConditions}
          </div>
        </div>
      )}

      {/* ── 복리후생 / Benefits ── */}
      {benefitsList.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
          <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-purple-500" />
            복리후생 / Benefits
          </h2>
          <div className="flex flex-wrap gap-2">
            {benefitsList.map((b, i) => (
              <span key={i} className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full border border-purple-200">
                {b}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── 근무 위치 / Work location ── */}
      {job.company?.address && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
          <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-green-500" />
            근무 위치 / Work Location
          </h2>
          <p className="text-sm text-gray-600">{job.company.address}</p>
        </div>
      )}

      {/* ── 지원 마감일 + 방법 / Application deadline + method ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-5">
        <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-500" />
          접수 정보 / Application Info
        </h2>
        <div className="space-y-2 text-sm">
          <div className="flex gap-3">
            <span className="text-gray-400 w-20 shrink-0">마감일</span>
            <span className="text-gray-800 font-medium">{formatDate(job.closingDate)}</span>
          </div>
          <div className="flex gap-3">
            <span className="text-gray-400 w-20 shrink-0">접수 방법</span>
            <span className="text-gray-800">
              {job.applicationMethod === 'ONLINE' ? '온라인 지원'
                : job.applicationMethod === 'EMAIL' ? `이메일 (${job.applicationEmail ?? ''})`
                : job.applicationMethod === 'SITE' ? '외부 사이트'
                : job.applicationMethod}
            </span>
          </div>
          {job.applicationUrl && (
            <div className="flex gap-3">
              <span className="text-gray-400 w-20 shrink-0">지원 링크</span>
              <a
                href={job.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 underline truncate"
              >
                {job.applicationUrl}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* ── 허용 비자 / Allowed visas ── */}
      {visas.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-5">
          <h2 className="text-sm font-bold text-gray-900 mb-3">채용 가능 비자 / Allowed Visas</h2>
          <div className="flex flex-wrap gap-2">
            {visas.map(v => (
              <span key={v} className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                {v}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── 하단 스티키 바 / Bottom sticky bar ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-50 safe-area-bottom md:left-64">
        <div className="max-w-3xl mx-auto flex items-center gap-3">

          {/* 스크랩 버튼 / Scrap button */}
          <button
            onClick={handleScrap}
            disabled={scrapping}
            className={`flex items-center gap-1.5 px-4 py-3 rounded-xl border text-sm font-semibold transition ${
              scrapped
                ? 'border-blue-300 bg-blue-50 text-blue-600'
                : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            {scrapping ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : scrapped ? (
              <BookmarkCheck className="w-4 h-4" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
            스크랩
          </button>

          {/* 지원하기 버튼 / Apply button */}
          {applySuccess ? (
            <div className="flex-1 py-3 bg-green-600 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4" />
              지원 완료! Applied!
            </div>
          ) : applied ? (
            <div className="flex-1 py-3 bg-gray-200 text-gray-500 text-sm font-bold rounded-xl flex items-center justify-center gap-2 cursor-not-allowed">
              이미 지원한 공고입니다
            </div>
          ) : dDay === '마감됨' ? (
            <div className="flex-1 py-3 bg-gray-200 text-gray-500 text-sm font-bold rounded-xl flex items-center justify-center gap-2 cursor-not-allowed">
              마감된 공고입니다
            </div>
          ) : (
            <button
              onClick={handleApply}
              disabled={applying}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition"
            >
              {applying ? (
                <><Loader2 className="w-4 h-4 animate-spin" />지원 중...</>
              ) : (
                <>지원하기</>
              )}
            </button>
          )}
        </div>

        {/* 지원 에러 메시지 / Apply error message */}
        {applyError && (
          <p className="text-center text-xs text-red-500 mt-1.5">{applyError}</p>
        )}
      </div>
    </div>
  );
}
