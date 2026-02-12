'use client';

import Header from '@/components/header';
import Footer from '@/components/footer';
import { useState, useEffect, use } from 'react';
import {
  MapPin, Eye, Heart, Users, Shield, Globe, Mail,
  ExternalLink, ChevronLeft, Building2,
  CheckCircle, AlertCircle, Send, FileText,
} from 'lucide-react';
import Link from 'next/link';

interface JobDetail {
  id: string;
  title: string;
  description: string;
  boardType: string;
  tierType: string;
  status: string;
  displayAddress: string;
  actualAddress: string;
  allowedVisas: string;
  minKoreanLevel: number;
  workIntensity: string;
  benefits: string[] | null;
  contactName: string;
  contactPhone: string;
  contactEmail: string | null;
  applicationMethod: string;
  externalUrl: string | null;
  externalEmail: string | null;
  interviewMethod: string;
  interviewPlace: string | null;
  employmentSubType: string | null;
  viewCount: number;
  scrapCount: number;
  applyCount: number;
  closingDate: string | null;
  suspendReason: string | null;
  createdAt: string;
  albaAttributes: {
    hourlyWage: number;
    workPeriod: string | null;
    workDaysMask: string;
    workTimeStart: string | null;
    workTimeEnd: string | null;
  } | null;
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
    ksicCode: string;
    addressRoad: string;
  } | null;
}

const INTENSITY_LABELS: Record<string, string> = { UPPER: '높음', MIDDLE: '보통', LOWER: '낮음' };
const KOREAN_LEVELS: Record<number, string> = { 0: '무관', 1: '1급', 2: '2급', 3: '3급', 4: '4급', 5: '5급', 6: '6급' };
const SUB_TYPE_LABELS: Record<string, string> = { CONTRACT: '계약직', PERMANENT: '정규직', INTERNSHIP: '인턴십' };
const EXP_LABELS: Record<string, string> = { ENTRY: '신입', JUNIOR: '1~3년', MID: '3~5년', SENIOR: '5년 이상' };
const EDU_LABELS: Record<string, string> = { HIGH_SCHOOL: '고졸', BACHELOR: '학사', MASTER: '석사' };
const DAYS = ['월', '화', '수', '목', '금', '토', '일'];

function formatSalaryWon(val: number | null): string {
  if (!val) return '';
  if (val >= 10000) return Math.round(val / 10000).toLocaleString();
  return val.toLocaleString();
}

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [isCompanyMode, setIsCompanyMode] = useState(false);
  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isScrapped, setIsScrapped] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [applyStatus, setApplyStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [applyError, setApplyError] = useState('');

  useEffect(() => {
    fetch(`/api/jobs/${id}`)
      .then((res) => res.json())
      .then((data) => { if (data.id) setJob(data); })
      .catch(() => {})
      .finally(() => setLoading(false));

    fetch(`/api/applications/scraps/check/${id}`)
      .then((res) => res.json())
      .then((data) => { if (data.scrapped !== undefined) setIsScrapped(data.scrapped); })
      .catch(() => {});
  }, [id]);

  const handleToggleScrap = async () => {
    try {
      const res = await fetch(`/api/applications/scraps/${id}`, { method: 'POST' });
      const data = await res.json();
      if (data.scrapped !== undefined) setIsScrapped(data.scrapped);
    } catch {}
  };

  const handleApply = async () => {
    setApplyStatus('loading');
    try {
      const res = await fetch('/api/applications/applications/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: id, applicationMethod: job?.applicationMethod, coverLetter: coverLetter || undefined }),
      });
      const data = await res.json();
      if (res.ok) setApplyStatus('success');
      else { setApplyError(data.message || '지원에 실패했습니다'); setApplyStatus('error'); }
    } catch { setApplyError('네트워크 오류가 발생했습니다'); setApplyStatus('error'); }
  };

  const formatWorkDays = (mask: string) => mask.split('').map((v, i) => (v === '1' ? DAYS[i] : null)).filter(Boolean).join(', ');

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header isCompanyMode={isCompanyMode} onToggleMode={() => setIsCompanyMode(!isCompanyMode)} onLogoClick={() => setIsCompanyMode(false)} />
        <main className="grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-blue-600" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header isCompanyMode={isCompanyMode} onToggleMode={() => setIsCompanyMode(!isCompanyMode)} onLogoClick={() => setIsCompanyMode(false)} />
        <main className="grow flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <h2 className="text-lg font-bold text-gray-600">공고를 찾을 수 없습니다</h2>
            <Link href="/" className="text-blue-600 font-medium mt-3 inline-block hover:text-blue-700 text-sm">메인으로 돌아가기</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const getDDay = () => {
    if (!job.closingDate) return null;
    const diff = Math.ceil((new Date(job.closingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return '마감';
    if (diff === 0) return 'D-Day';
    return `D-${diff}`;
  };

  const isAlba = job.boardType === 'PART_TIME';

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header isCompanyMode={isCompanyMode} onToggleMode={() => setIsCompanyMode(!isCompanyMode)} onLogoClick={() => setIsCompanyMode(false)} />

      <main className="grow w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <Link href={isAlba ? '/alba' : '/fulltime'} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-5 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          {isAlba ? '알바채용관' : '정규직 채용관'}으로 돌아가기
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-5">
            {/* Header Card */}
            <div className="dashboard-card p-5">
              {job.status === 'SUSPENDED' && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4 text-sm text-red-600">
                  이 공고는 관리자에 의해 중지되었습니다.
                  {job.suspendReason && <span className="text-red-500 ml-1">({job.suspendReason})</span>}
                </div>
              )}

              {/* Company */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm text-gray-600 font-medium">{job.company?.brandName || job.company?.companyName}</span>
                {job.tierType === 'PREMIUM' && (
                  <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">PREMIUM</span>
                )}
                {job.employmentSubType && (
                  <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                    {SUB_TYPE_LABELS[job.employmentSubType]}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-xl font-bold text-gray-900 mb-4 leading-snug">{job.title}</h1>

              {/* Key Info - flat layout, no rounded blocks */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-200 border border-gray-200 rounded-md overflow-hidden mb-4">
                <div className="bg-white p-3">
                  <p className="text-[11px] text-gray-400 mb-0.5">근무지</p>
                  <p className="text-sm font-medium text-gray-800">{job.displayAddress}</p>
                </div>
                {isAlba && job.albaAttributes && (
                  <div className="bg-white p-3">
                    <p className="text-[11px] text-blue-500 mb-0.5">시급</p>
                    <p className="text-sm font-semibold text-blue-600">{job.albaAttributes.hourlyWage.toLocaleString()}원</p>
                  </div>
                )}
                {!isAlba && job.fulltimeAttributes && (
                  <div className="bg-white p-3">
                    <p className="text-[11px] text-blue-500 mb-0.5">연봉</p>
                    <p className="text-sm font-semibold text-blue-600">
                      {job.fulltimeAttributes.salaryMin && job.fulltimeAttributes.salaryMax
                        ? `${formatSalaryWon(job.fulltimeAttributes.salaryMin)}~${formatSalaryWon(job.fulltimeAttributes.salaryMax)}만원`
                        : '협의'}
                    </p>
                  </div>
                )}
                <div className="bg-white p-3">
                  <p className="text-[11px] text-gray-400 mb-0.5">면접</p>
                  <p className="text-sm font-medium text-gray-800">{job.interviewMethod === 'ONLINE' ? '온라인' : '오프라인'}</p>
                </div>
                {getDDay() && (
                  <div className="bg-white p-3">
                    <p className="text-[11px] text-gray-400 mb-0.5">마감</p>
                    <p className={`text-sm font-semibold ${getDDay() === '마감' ? 'text-red-500' : 'text-gray-800'}`}>
                      {getDDay()}
                    </p>
                  </div>
                )}
              </div>

              {/* Visa Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {job.allowedVisas.split(',').map((visa) => (
                  <span key={visa} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded flex items-center gap-1">
                    <Shield className="w-3 h-3 text-gray-400" />{visa.trim()}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-5 pt-3 border-t border-gray-100 text-xs text-gray-400">
                <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />조회 {job.viewCount}</span>
                <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" />스크랩 {job.scrapCount}</span>
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />지원 {job.applyCount}</span>
                <span className="ml-auto">등록 {new Date(job.createdAt).toLocaleDateString('ko-KR')}</span>
              </div>
            </div>

            {/* Work Conditions */}
            <div className="dashboard-card p-5">
              <h2 className="font-bold text-gray-900 mb-3 text-sm">근무 조건</h2>
              <table className="w-full text-sm">
                <tbody className="divide-y divide-gray-100">
                  {isAlba && job.albaAttributes && (
                    <>
                      <InfoRow label="시급" value={`${job.albaAttributes.hourlyWage.toLocaleString()}원`} highlight />
                      <InfoRow label="근무요일" value={formatWorkDays(job.albaAttributes.workDaysMask)} />
                      {job.albaAttributes.workTimeStart && job.albaAttributes.workTimeEnd && (
                        <InfoRow label="근무시간" value={`${job.albaAttributes.workTimeStart} ~ ${job.albaAttributes.workTimeEnd}`} />
                      )}
                      {job.albaAttributes.workPeriod && <InfoRow label="근무기간" value={job.albaAttributes.workPeriod} />}
                    </>
                  )}
                  {!isAlba && job.fulltimeAttributes && (
                    <>
                      <InfoRow
                        label="연봉"
                        value={job.fulltimeAttributes.salaryMin && job.fulltimeAttributes.salaryMax
                          ? `${formatSalaryWon(job.fulltimeAttributes.salaryMin)}~${formatSalaryWon(job.fulltimeAttributes.salaryMax)}만원`
                          : '협의'}
                        highlight
                      />
                      <InfoRow label="경력" value={EXP_LABELS[job.fulltimeAttributes.experienceLevel] || '무관'} />
                      <InfoRow label="학력" value={EDU_LABELS[job.fulltimeAttributes.educationLevel] || '무관'} />
                    </>
                  )}
                  <InfoRow label="근무 강도" value={INTENSITY_LABELS[job.workIntensity]} />
                  <InfoRow label="한국어" value={`TOPIK ${KOREAN_LEVELS[job.minKoreanLevel] || '무관'}`} />
                </tbody>
              </table>
            </div>

            {/* Description */}
            <div className="dashboard-card p-5">
              <h2 className="font-bold text-gray-900 mb-3 text-sm">상세 설명</h2>
              <div className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">{job.description}</div>
            </div>

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <div className="dashboard-card p-5">
                <h2 className="font-bold text-gray-900 mb-3 text-sm">복리후생</h2>
                <div className="flex flex-wrap gap-1.5">
                  {job.benefits.map((benefit, i) => (
                    <span key={i} className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded border border-green-100">
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Location */}
            <div className="dashboard-card p-5">
              <h2 className="font-bold text-gray-900 mb-3 text-sm">근무지 위치</h2>
              <p className="text-sm text-gray-600 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-gray-400" />
                {job.actualAddress}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Company Info */}
            <div className="dashboard-card p-4">
              <p className="font-bold text-gray-900 text-sm">{job.company?.companyName}</p>
              {job.company?.brandName && <p className="text-xs text-gray-500 mt-0.5">{job.company.brandName}</p>}
              <p className="text-xs text-gray-400 flex items-center gap-1 mt-2">
                <MapPin className="w-3 h-3" />{job.company?.addressRoad}
              </p>
            </div>

            {/* Apply Actions */}
            <div className="dashboard-card p-4 space-y-2.5 sticky top-16">
              {job.status === 'ACTIVE' && (
                <>
                  {job.applicationMethod === 'PLATFORM' && (
                    <button
                      onClick={() => setShowApplyModal(true)}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" /> 지원하기
                    </button>
                  )}
                  {job.applicationMethod === 'WEBSITE' && job.externalUrl && (
                    <a href={job.externalUrl} target="_blank" rel="noopener noreferrer"
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition flex items-center justify-center gap-2">
                      <Globe className="w-4 h-4" /> 홈페이지에서 지원 <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {job.applicationMethod === 'EMAIL' && job.externalEmail && (
                    <a href={`mailto:${job.externalEmail}`}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition flex items-center justify-center gap-2">
                      <Mail className="w-4 h-4" /> 이메일로 지원
                    </a>
                  )}
                </>
              )}
              {job.status === 'CLOSED' && (
                <div className="py-2.5 bg-gray-100 text-gray-500 font-semibold rounded-md text-center text-sm">마감된 공고</div>
              )}
              <button
                onClick={handleToggleScrap}
                className={`w-full py-2.5 border font-semibold rounded-md transition flex items-center justify-center gap-2 text-sm ${
                  isScrapped
                    ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Heart className={`w-4 h-4 ${isScrapped ? 'fill-red-500 text-red-500' : ''}`} />
                {isScrapped ? '스크랩 취소' : '스크랩'}
              </button>

              <div className="pt-3 border-t border-gray-100 text-sm text-gray-500">
                <p className="font-semibold text-gray-700 mb-1.5 text-xs">채용 담당자</p>
                <p>{job.contactName}</p>
                <p>{job.contactPhone}</p>
                {job.contactEmail && <p>{job.contactEmail}</p>}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full overflow-hidden fade-in-element">
            {applyStatus === 'success' ? (
              <div className="text-center py-8 px-6">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">지원 완료!</h3>
                <p className="text-gray-500 text-sm mb-5">기업에서 이력서를 검토한 후 연락드릴 예정입니다.</p>
                <button onClick={() => { setShowApplyModal(false); setApplyStatus('idle'); }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 text-sm">확인</button>
              </div>
            ) : (
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-3">지원하기</h3>
                <p className="text-sm text-gray-500 mb-3">프로필에 등록된 이력서가 함께 전송됩니다.</p>
                <textarea
                  value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="자기소개 또는 지원 동기를 작성해주세요 (선택)"
                  className="w-full h-28 border border-gray-200 rounded-md p-3 text-sm resize-none focus:border-blue-500 outline-none mb-3"
                />
                {applyStatus === 'error' && <p className="text-xs text-red-500 mb-2">{applyError}</p>}
                <div className="flex gap-2">
                  <button onClick={() => { setShowApplyModal(false); setApplyStatus('idle'); }}
                    className="flex-1 py-2 border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50 font-medium text-sm">취소</button>
                  <button onClick={handleApply} disabled={applyStatus === 'loading'}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 font-semibold text-sm flex items-center justify-center gap-1.5">
                    {applyStatus === 'loading' ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    ) : (<><FileText className="w-4 h-4" />지원서 제출</>)}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

function InfoRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <tr>
      <td className="py-2.5 pr-4 text-gray-400 w-24">{label}</td>
      <td className={`py-2.5 font-medium ${highlight ? 'text-blue-600' : 'text-gray-800'}`}>{value}</td>
    </tr>
  );
}
