'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Loader2, MapPin, Clock, DollarSign, Users, Eye, Bookmark,
  Calendar, Briefcase, Building2, Globe, FileText, ExternalLink, Mail, Phone,
  AlertTriangle, Crown, Edit, X as XIcon, Power,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

/** 공고 상세 데이터 / Job detail data */
interface JobDetail {
  id: string;
  boardType: string;
  tierType: string;
  title: string;
  description: string;
  status: string;
  closingDate: string | null;
  allowedVisas: string[];
  displayAddress: string;
  actualAddress: string;
  workIntensity: string;
  benefits: string[] | null;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  applicationMethod: string;
  externalUrl: string | null;
  externalEmail: string | null;
  interviewMethod: string;
  employmentSubType: string;
  viewCount: number;
  scrapCount: number;
  applyCount: number;
  expiresAt: string | null;
  isUrgent: boolean;
  isFeatured: boolean;
  createdAt: string;
  headcount?: number;
  requirements?: string;
  preferredQualifications?: string;
  albaAttributes?: {
    hourlyWage: number | null;
    workDaysMask: string | null;
    workTimeStart: string | null;
    workTimeEnd: string | null;
  } | null;
  fulltimeAttributes?: {
    salaryMin: number | null;
    salaryMax: number | null;
    experienceLevel: string | null;
    educationLevel: string | null;
  } | null;
  company?: {
    companyName: string;
    brandName: string | null;
    logoImageUrl: string | null;
  } | null;
}

/** 상태 라벨 / Status labels */
const STATUS_MAP: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: '채용중', color: 'bg-green-100 text-green-700' },
  CLOSED: { label: '마감', color: 'bg-gray-100 text-gray-600' },
  DRAFT: { label: '임시저장', color: 'bg-yellow-100 text-yellow-700' },
  SUSPENDED: { label: '정지', color: 'bg-red-100 text-red-700' },
  EXPIRED: { label: '만료', color: 'bg-gray-100 text-gray-500' },
};

/**
 * 기업 공고 상세 페이지 / Company job detail page
 * GET /api/jobs/:id 연동 / Connects to GET /api/jobs/:id
 */
export default function CompanyJobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const sessionId = localStorage.getItem('sessionId');
        const res = await fetch(`/api/jobs/${id}`, {
          credentials: 'include',
          headers: sessionId ? { 'Authorization': `Bearer ${sessionId}` } : {},
        });
        if (res.ok) {
          const data = await res.json();
          // allowedVisas 문자열→배열 변환 / Convert allowedVisas string to array
          if (typeof data.allowedVisas === 'string') {
            data.allowedVisas = data.allowedVisas.split(',').map((v: string) => v.trim()).filter(Boolean);
          } else if (!Array.isArray(data.allowedVisas)) {
            data.allowedVisas = [];
          }
          setJob(data);
        } else {
          setError('공고를 불러올 수 없습니다.');
        }
      } catch {
        setError('네트워크 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchJob();
  }, [id]);

  // 공고 마감 / Close job posting
  const handleClose = async () => {
    if (!confirm('이 공고를 마감하시겠습니까?')) return;
    setClosing(true);
    try {
      const res = await fetch(`/api/jobs/${id}/close`, { method: 'POST', credentials: 'include' });
      if (res.ok) {
        setJob(prev => prev ? { ...prev, status: 'CLOSED' } : prev);
      }
    } catch { /* 무시 / ignore */ }
    finally { setClosing(false); }
  };

  // 급여 포맷 / Format salary
  const formatSalary = () => {
    if (!job) return '';
    if (job.albaAttributes?.hourlyWage) return `시급 ${job.albaAttributes.hourlyWage.toLocaleString()}원`;
    if (job.fulltimeAttributes) {
      const { salaryMin, salaryMax } = job.fulltimeAttributes;
      if (salaryMin && salaryMax && salaryMin !== salaryMax) {
        return `월 ${(salaryMin / 10000).toFixed(0)}만 ~ ${(salaryMax / 10000).toFixed(0)}만원`;
      }
      if (salaryMin) return `월 ${(salaryMin / 10000).toFixed(0)}만원`;
    }
    return '협의';
  };

  // D-day 계산 / D-day calculation
  const getDday = () => {
    if (!job?.closingDate && !job?.expiresAt) return null;
    const target = job.closingDate || job.expiresAt;
    const diff = Math.ceil((new Date(target!).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return '마감';
    if (diff === 0) return 'D-Day';
    return `D-${diff}`;
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
    </div>
  );

  if (error || !job) return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-center">
      <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
      <p className="text-gray-500">{error || '공고를 찾을 수 없습니다.'}</p>
      <Link href="/company/jobs" className="text-sm text-blue-600 mt-4 inline-block">공고 목록으로</Link>
    </div>
  );

  const status = STATUS_MAP[job.status] || STATUS_MAP.DRAFT;
  const dday = getDday();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* 상단 네비게이션 / Top navigation */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm">
          <ArrowLeft className="w-4 h-4" /> 뒤로
        </button>
        <div className="flex items-center gap-2">
          <Link href={`/company/jobs/${id}/applicants`}>
            <Button variant="outline" size="sm" className="text-xs gap-1 text-blue-600 border-blue-200 hover:bg-blue-50"><Users className="w-3 h-3" /> 지원자 관리</Button>
          </Link>
          <Link href={`/company/jobs/create?copy=${id}`}>
            <Button variant="outline" size="sm" className="text-xs gap-1"><FileText className="w-3 h-3" /> 복사</Button>
          </Link>
          {job.status === 'ACTIVE' && (
            <Button variant="outline" size="sm" className="text-xs gap-1 text-red-600 border-red-200 hover:bg-red-50"
              onClick={handleClose} disabled={closing}>
              <Power className="w-3 h-3" /> {closing ? '마감 중...' : '마감'}
            </Button>
          )}
        </div>
      </div>

      {/* 공고 헤더 / Job header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.color}`}>{status.label}</span>
            {job.tierType === 'PREMIUM' && (
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 flex items-center gap-1">
                <Crown className="w-3 h-3" /> {job.premiumSource === 'ADMIN_GRANT' ? '프리미엄 (관리자 적용)' : job.premiumSource === 'PROMOTION' ? '프리미엄 (이벤트)' : '프리미엄'}
              </span>
            )}
            {dday && <span className="text-xs font-medium text-red-500">{dday}</span>}
          </div>
          <span className="text-xs text-gray-400">{new Date(job.createdAt).toLocaleDateString('ko-KR')}</span>
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h1>
        {job.company && <p className="text-sm text-gray-600 flex items-center gap-1"><Building2 className="w-4 h-4" /> {job.company.companyName}</p>}

        {/* 통계 / Stats */}
        <div className="flex items-center gap-6 mt-4 text-sm text-gray-500">
          <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> 조회 {job.viewCount}</span>
          <span className="flex items-center gap-1"><Bookmark className="w-4 h-4" /> 스크랩 {job.scrapCount}</span>
          <Link href={`/company/jobs/${id}/applicants`} className="flex items-center gap-1 text-blue-600 hover:text-blue-700">
            <Users className="w-4 h-4" /> 지원자 {job.applyCount}명
          </Link>
        </div>
      </div>

      {/* 근무 조건 / Work conditions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
        <h2 className="text-sm font-bold text-gray-900 mb-4">근무 조건</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600"><MapPin className="w-4 h-4 text-gray-400 shrink-0" /> {job.displayAddress || '미입력'}</div>
          <div className="flex items-center gap-2 text-gray-600"><DollarSign className="w-4 h-4 text-gray-400 shrink-0" /> {formatSalary()}</div>
          <div className="flex items-center gap-2 text-gray-600"><Briefcase className="w-4 h-4 text-gray-400 shrink-0" /> {job.boardType === 'PART_TIME' ? '아르바이트' : '정규직'} {job.employmentSubType ? `(${job.employmentSubType})` : ''}</div>
          {job.albaAttributes?.workTimeStart && (
            <div className="flex items-center gap-2 text-gray-600"><Clock className="w-4 h-4 text-gray-400 shrink-0" /> {job.albaAttributes.workTimeStart} ~ {job.albaAttributes.workTimeEnd}</div>
          )}
          {job.fulltimeAttributes?.experienceLevel && (
            <div className="flex items-center gap-2 text-gray-600"><Calendar className="w-4 h-4 text-gray-400 shrink-0" /> 경력: {job.fulltimeAttributes.experienceLevel}</div>
          )}
          {job.headcount && (
            <div className="flex items-center gap-2 text-gray-600"><Users className="w-4 h-4 text-gray-400 shrink-0" /> 모집 {job.headcount}명</div>
          )}
        </div>
      </div>

      {/* 허용 비자 / Allowed visas */}
      {job.allowedVisas && job.allowedVisas.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
          <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-1"><Globe className="w-4 h-4" /> 채용 가능 비자</h2>
          <div className="flex flex-wrap gap-2">
            {job.allowedVisas.map(v => (
              <span key={v} className="text-xs px-3 py-1.5 bg-green-50 text-green-700 rounded-full border border-green-200">{v}</span>
            ))}
          </div>
        </div>
      )}

      {/* 상세 내용 / Description */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
        <h2 className="text-sm font-bold text-gray-900 mb-3">상세 내용</h2>
        <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{job.description || '내용 없음'}</div>
        {job.requirements && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h3 className="text-sm font-bold text-gray-800 mb-2">자격 요건</h3>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{job.requirements}</p>
          </div>
        )}
        {job.preferredQualifications && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h3 className="text-sm font-bold text-gray-800 mb-2">우대 사항</h3>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{job.preferredQualifications}</p>
          </div>
        )}
      </div>

      {/* 복리후생 / Benefits */}
      {job.benefits && job.benefits.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
          <h2 className="text-sm font-bold text-gray-900 mb-3">복리후생</h2>
          <div className="flex flex-wrap gap-2">
            {job.benefits.map((b, i) => (
              <span key={i} className="text-xs px-3 py-1.5 bg-gray-50 text-gray-600 rounded-full border border-gray-200">{b}</span>
            ))}
          </div>
        </div>
      )}

      {/* 접수 방법 + 담당자 / Application method + Contact */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
        <h2 className="text-sm font-bold text-gray-900 mb-3">접수 안내</h2>
        <div className="space-y-2 text-sm text-gray-600">
          <p className="flex items-center gap-2"><FileText className="w-4 h-4 text-gray-400" /> 접수 방법: {job.applicationMethod || '사이트 내 지원'}</p>
          {job.externalUrl && <p className="flex items-center gap-2"><ExternalLink className="w-4 h-4 text-gray-400" /> <a href={job.externalUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{job.externalUrl}</a></p>}
          {job.contactName && <p className="flex items-center gap-2"><Users className="w-4 h-4 text-gray-400" /> 담당자: {job.contactName}</p>}
          {job.contactPhone && <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /> {job.contactPhone}</p>}
          {job.contactEmail && <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" /> {job.contactEmail}</p>}
        </div>
      </div>
    </div>
  );
}
