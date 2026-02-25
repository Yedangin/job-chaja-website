'use client';

/**
 * 알바 공고 상세 페이지 (개인회원용)
 * Part-time Job Detail Page (worker)
 */

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Calendar,
  DollarSign,
  Briefcase,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Heart,
  Users,
  Eye,
  Building2,
  FileText,
  PhoneCall,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';

// ─── 타입 정의 / Type definitions ───────────────────────────────────────────

interface AlbaJobDetail {
  id: string;
  title: string;
  boardType: string;
  tierType: 'PREMIUM' | 'STANDARD';
  status: string;
  displayAddress: string;
  detailAddress: string | null;
  allowedVisas: string;
  applicationMethod: string;
  viewCount: number;
  scrapCount: number;
  applyCount: number;
  recruitCount: number | null;
  closingDate: string | null;
  createdAt: string;
  jobDescription: string | null;
  albaAttributes: {
    hourlyWage: number;
    workPeriod: string | null;
    workDaysMask: string;
    workTimeStart: string | null;
    workTimeEnd: string | null;
    jobCategory: string | null;
  } | null;
  company: {
    companyId: string;
    companyName: string;
    brandName: string | null;
    logoImageUrl: string | null;
    industry: string | null;
    companySize: string | null;
  } | null;
}

interface EligibilityResult {
  eligible: boolean;
  visaCode: string;
  restrictions: string[];
  notes: string[];
  documentsRequired: string[];
}

// ─── 유틸 함수 / Utility functions ───────────────────────────────────────────

/** 근무 시간 포맷 / Format work time */
function formatWorkTime(start: string | null, end: string | null): string {
  if (!start && !end) return '시간 협의';
  if (start && end) return `${start} ~ ${end}`;
  return start || end || '시간 협의';
}

/** workDaysMask → 한글 / Convert workDaysMask to Korean */
function formatWorkDays(mask: string): string {
  const DAYS = ['월', '화', '수', '목', '금', '토', '일'];
  if (!mask || mask.length < 7) return '협의';
  const selected = DAYS.filter((_, i) => mask[i] === '1');
  if (selected.length === 0) return '협의';
  if (selected.length === 7) return '주 7일';
  return selected.join(', ');
}

/** 마감일 포맷 / Format closing date */
function formatClosingDate(closingDate: string | null): string {
  if (!closingDate) return '채용 시 마감';
  const date = new Date(closingDate);
  const diff = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const formatted = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  if (diff < 0) return `${formatted} (마감)`;
  if (diff === 0) return `${formatted} (오늘 마감)`;
  return `${formatted} (D-${diff})`;
}

/** 날짜 포맷 / Format date */
function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

// ─── 메인 컴포넌트 / Main component ─────────────────────────────────────────

export default function AlbaJobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isLoggedIn, role } = useAuth();
  const jobId = params.id as string;

  // 데이터 상태 / Data state
  const [job, setJob] = useState<AlbaJobDetail | null>(null);
  const [eligibility, setEligibility] = useState<EligibilityResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [eligibilityLoading, setEligibilityLoading] = useState(false);

  // 지원 상태 / Apply state
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);

  // 스크랩 상태 / Scrap state
  const [scrapped, setScrapped] = useState(false);
  const [scrapLoading, setScrapLoading] = useState(false);

  // 토스트 상태 / Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  /** 토스트 표시 / Show toast */
  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // 공고 상세 조회 / Fetch job detail
  useEffect(() => {
    if (!jobId) return;

    const fetchJob = async () => {
      setLoading(true);
      try {
        const sessionId = localStorage.getItem('sessionId');
        const headers: Record<string, string> = {};
        if (sessionId) headers['Authorization'] = `Bearer ${sessionId}`;

        const res = await fetch(`/api/jobs/${jobId}`, { headers });
        if (!res.ok) {
          if (res.status === 404) router.push('/worker/alba');
          return;
        }
        const data: AlbaJobDetail = await res.json();
        setJob(data);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId, router]);

  // 비자 적격 여부 조회 (개인회원 + 로그인 시) / Fetch eligibility (individual + logged in)
  useEffect(() => {
    if (!jobId || !isLoggedIn || role !== 'INDIVIDUAL') return;

    const fetchEligibility = async () => {
      setEligibilityLoading(true);
      try {
        const sessionId = localStorage.getItem('sessionId');
        if (!sessionId) return;

        const res = await fetch(`/api/jobs/${jobId}/eligibility`, {
          headers: { Authorization: `Bearer ${sessionId}` },
        });
        if (res.ok) {
          const data: EligibilityResult = await res.json();
          setEligibility(data);
        }
      } finally {
        setEligibilityLoading(false);
      }
    };

    fetchEligibility();
  }, [jobId, isLoggedIn, role]);

  /** 지원하기 / Apply for job */
  const handleApply = async () => {
    if (!isLoggedIn) {
      showToast('로그인이 필요합니다', 'error');
      router.push('/login');
      return;
    }

    if (applied) {
      showToast('이미 지원한 공고입니다', 'error');
      return;
    }

    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      showToast('로그인이 필요합니다', 'error');
      return;
    }

    setApplying(true);
    setApplyError(null);
    try {
      const res = await fetch('/api/applications/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionId}`,
        },
        body: JSON.stringify({ jobId }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.status === 409 || data?.message?.includes('already')) {
        setApplied(true);
        showToast('이미 지원한 공고입니다', 'error');
        return;
      }

      if (!res.ok) {
        throw new Error(data?.message || '지원에 실패했습니다.');
      }

      setApplied(true);
      showToast('지원이 완료되었습니다!', 'success');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '지원에 실패했습니다.';
      setApplyError(message);
      showToast(message, 'error');
    } finally {
      setApplying(false);
    }
  };

  /** 스크랩 토글 / Toggle scrap */
  const handleScrap = async () => {
    if (!isLoggedIn) {
      showToast('로그인이 필요합니다', 'error');
      return;
    }

    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) return;

    setScrapLoading(true);
    try {
      // 스크랩 API 추후 연결 / Scrap API to be connected later
      setScrapped(prev => !prev);
      showToast(scrapped ? '스크랩이 해제되었습니다' : '스크랩되었습니다', 'success');
    } finally {
      setScrapLoading(false);
    }
  };

  // ─── 로딩 / Loading ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-5 w-24 bg-gray-200 rounded" />
          <div className="h-8 w-3/4 bg-gray-200 rounded" />
          <div className="h-32 bg-gray-100 rounded-xl" />
          <div className="h-48 bg-gray-100 rounded-xl" />
          <div className="h-64 bg-gray-100 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6 text-center">
        <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">공고를 찾을 수 없습니다.</p>
        <Link href="/worker/alba" className="mt-4 inline-flex text-blue-600 text-sm hover:underline">
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const companyName = job.company?.brandName || job.company?.companyName || '기업명 없음';
  const attrs = job.albaAttributes;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-28">
      {/* 뒤로가기 / Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-5 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        뒤로가기
      </button>

      {/* 회사 헤더 / Company header */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
        <div className="flex items-center gap-4 mb-4">
          {/* 회사 로고 / Company logo */}
          {job.company?.logoImageUrl ? (
            <img
              src={job.company.logoImageUrl}
              alt={companyName}
              className="w-14 h-14 rounded-xl object-cover border border-gray-100 shrink-0"
            />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6 text-gray-400" />
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm text-gray-500 truncate">{companyName}</p>
            {job.company?.industry && (
              <p className="text-xs text-gray-400">{job.company.industry}</p>
            )}
          </div>
        </div>

        {/* 공고 제목 + 배지 / Job title + badge */}
        <div className="flex items-start gap-2 mb-3">
          {job.tierType === 'PREMIUM' && (
            <span className="shrink-0 text-[10px] font-semibold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded mt-0.5">
              PREMIUM
            </span>
          )}
          <h1 className="text-lg font-bold text-gray-900 leading-snug">{job.title}</h1>
        </div>

        {/* 위치 / Location */}
        {job.displayAddress && (
          <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-3">
            <MapPin className="w-4 h-4 shrink-0 text-gray-400" />
            <span>{job.displayAddress}</span>
            {job.detailAddress && <span className="text-gray-400"> · {job.detailAddress}</span>}
          </div>
        )}

        {/* 핵심 정보 칩 / Key info chips */}
        {attrs && (
          <div className="flex flex-wrap gap-2">
            {attrs.hourlyWage > 0 && (
              <div className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold">
                <DollarSign className="w-3.5 h-3.5" />
                시급 {attrs.hourlyWage.toLocaleString()}원
              </div>
            )}
            {(attrs.workTimeStart || attrs.workTimeEnd) && (
              <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg text-sm">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                {formatWorkTime(attrs.workTimeStart, attrs.workTimeEnd)}
              </div>
            )}
            {attrs.workDaysMask && (
              <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg text-sm">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                {formatWorkDays(attrs.workDaysMask)}
              </div>
            )}
            {attrs.workPeriod && (
              <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg text-sm">
                <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                {attrs.workPeriod}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 비자 적격 카드 (개인회원) / Visa eligibility card (individual user) */}
      {isLoggedIn && role === 'INDIVIDUAL' && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
          <h2 className="text-sm font-bold text-gray-900 mb-3">내 비자 적격 여부</h2>
          {eligibilityLoading ? (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              확인 중...
            </div>
          ) : eligibility ? (
            <div>
              {/* 결과 뱃지 / Result badge */}
              {eligibility.eligible && eligibility.restrictions.length === 0 && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg mb-3">
                  <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-green-800">지원 가능</p>
                    <p className="text-xs text-green-600 mt-0.5">
                      {eligibility.visaCode} 비자로 이 공고에 지원할 수 있습니다.
                    </p>
                  </div>
                </div>
              )}
              {eligibility.eligible && eligibility.restrictions.length > 0 && (
                <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-yellow-800">조건부 지원 가능</p>
                    <p className="text-xs text-yellow-600 mt-0.5">
                      {eligibility.visaCode} 비자 · 아래 제한 사항을 확인하세요
                    </p>
                  </div>
                </div>
              )}
              {!eligibility.eligible && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-3">
                  <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-red-700">지원 불가</p>
                    <p className="text-xs text-red-500 mt-0.5">
                      {eligibility.visaCode} 비자로는 이 공고에 지원할 수 없습니다.
                    </p>
                  </div>
                </div>
              )}

              {/* 제한 사항 / Restrictions */}
              {eligibility.restrictions.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-semibold text-gray-500 mb-1.5">제한 사항</p>
                  <ul className="space-y-1">
                    {eligibility.restrictions.map((r, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                        <span className="text-yellow-500 mt-0.5 shrink-0">•</span>
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 필요 서류 / Required documents */}
              {eligibility.documentsRequired && eligibility.documentsRequired.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1.5">필요 서류</p>
                  <ul className="space-y-1">
                    {eligibility.documentsRequired.map((doc, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                        <FileText className="w-3 h-3 text-gray-400 mt-0.5 shrink-0" />
                        {doc}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            /* 비자 인증 미완료 안내 / No visa verification notice */
            <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-gray-400 shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-700">비자 인증 후 적격 여부를 확인하세요</p>
                <Link
                  href="/worker/visa-verification"
                  className="text-xs text-blue-600 hover:underline"
                >
                  비자 인증 바로가기
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 공고 상세 정보 / Job detail info */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
        <h2 className="text-sm font-bold text-gray-900 mb-4">공고 상세</h2>

        {/* 공고 설명 / Job description */}
        {job.jobDescription && (
          <div className="mb-5">
            <p className="text-xs font-semibold text-gray-500 mb-2">상세 내용</p>
            <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed bg-gray-50 rounded-lg p-4">
              {job.jobDescription}
            </div>
          </div>
        )}

        {/* 근무 정보 그리드 / Work info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 지원 방법 / Application method */}
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-1">지원 방법</p>
            <div className="flex items-center gap-1.5 text-sm text-gray-700">
              <PhoneCall className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              {job.applicationMethod === 'ONLINE' && '온라인 지원'}
              {job.applicationMethod === 'EMAIL' && '이메일 지원'}
              {job.applicationMethod === 'PHONE' && '전화 지원'}
              {job.applicationMethod === 'VISIT' && '방문 지원'}
              {!['ONLINE', 'EMAIL', 'PHONE', 'VISIT'].includes(job.applicationMethod) && job.applicationMethod}
            </div>
          </div>

          {/* 모집 인원 / Recruit count */}
          {job.recruitCount != null && (
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1">모집 인원</p>
              <div className="flex items-center gap-1.5 text-sm text-gray-700">
                <Users className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                {job.recruitCount}명
              </div>
            </div>
          )}

          {/* 마감일 / Closing date */}
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-1">마감일</p>
            <p className="text-sm text-gray-700">{formatClosingDate(job.closingDate)}</p>
          </div>

          {/* 등록일 / Posted date */}
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-1">등록일</p>
            <p className="text-sm text-gray-700">{formatDate(job.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* 허용 비자 / Allowed visas */}
      {job.allowedVisas && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
          <h2 className="text-sm font-bold text-gray-900 mb-3">지원 가능 비자</h2>
          <div className="flex flex-wrap gap-1.5">
            {job.allowedVisas.split(',').map(v => (
              <span
                key={v}
                className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg border border-blue-100"
              >
                {v.trim()}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 통계 / Statistics */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { icon: Eye, label: '조회수', value: job.viewCount.toLocaleString() },
          { icon: Heart, label: '스크랩', value: job.scrapCount.toLocaleString() },
          { icon: Users, label: '지원자', value: `${job.applyCount}명` },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-3 text-center">
            <stat.icon className="w-4 h-4 text-gray-400 mx-auto mb-1" />
            <p className="text-sm font-semibold text-gray-900">{stat.value}</p>
            <p className="text-[11px] text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* 지원 오류 메시지 / Apply error message */}
      {applyError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-sm text-red-600 flex items-center gap-2">
          <XCircle className="w-4 h-4 shrink-0" />
          {applyError}
        </div>
      )}

      {/* 토스트 알림 / Toast notification */}
      {toast && (
        <div
          className={`fixed bottom-24 left-1/2 -translate-x-1/2 px-5 py-3 rounded-xl text-sm font-medium shadow-lg z-50 transition-all ${
            toast.type === 'success'
              ? 'bg-green-600 text-white'
              : 'bg-red-600 text-white'
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* 하단 고정 액션 바 / Bottom sticky action bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex items-center gap-3 z-40 shadow-lg">
        <div className="max-w-3xl mx-auto w-full flex items-center gap-3">
          {/* 스크랩 버튼 / Scrap button */}
          <button
            onClick={handleScrap}
            disabled={scrapLoading}
            className={`flex items-center justify-center w-11 h-11 rounded-xl border transition ${
              scrapped
                ? 'bg-red-50 border-red-300 text-red-500'
                : 'bg-white border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-600'
            }`}
            aria-label="스크랩 토글 / Toggle scrap"
          >
            <Heart
              className={`w-5 h-5 ${scrapped ? 'fill-current' : ''}`}
            />
          </button>

          {/* 지원하기 버튼 / Apply button */}
          <button
            onClick={handleApply}
            disabled={applying || applied || job.status === 'CLOSED'}
            className={`flex-1 flex items-center justify-center gap-2 h-11 rounded-xl font-semibold text-sm transition ${
              applied
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                : job.status === 'CLOSED'
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {applying && <Loader2 className="w-4 h-4 animate-spin" />}
            {job.status === 'CLOSED'
              ? '마감된 공고입니다'
              : applied
              ? '지원 완료'
              : '지원하기'}
          </button>
        </div>
      </div>
    </div>
  );
}
