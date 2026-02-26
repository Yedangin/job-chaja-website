'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Users, Clock, Globe, Loader2, Eye, MessageSquare,
  Calendar, CheckCircle2, XCircle, ChevronRight, Send,
  FileText, AlertTriangle, CreditCard, X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

type Stage = 'REVIEW' | 'INTERVIEW' | 'ACCEPTED' | 'REJECTED';

/** 지원자 정보 / Applicant data */
interface Applicant {
  id: number;
  userId?: number;
  fullName: string;
  nationality?: string;
  nationalityLabel?: string;
  visaType?: string;
  experienceYears?: number;
  topikLevel?: number;
  appliedAt: string;
  status: Stage;
  memo?: string;
  resumeViewed?: boolean;
  coverLetter?: string;
}

/** 공고 요약 / Job summary */
interface JobSummary {
  id: number;
  title: string;
  closingDate?: string;
  allowedVisas?: string[];
  applicantCount?: number;
}

const STAGE_CONFIG: Record<Stage, { label: string; color: string; icon: typeof FileText }> = {
  REVIEW: { label: '서류검토', color: 'blue', icon: FileText },
  INTERVIEW: { label: '면접', color: 'amber', icon: Calendar },
  ACCEPTED: { label: '최종합격', color: 'green', icon: CheckCircle2 },
  REJECTED: { label: '불합격', color: 'red', icon: XCircle },
};

const STAGES: Stage[] = ['REVIEW', 'INTERVIEW', 'ACCEPTED', 'REJECTED'];

/**
 * 지원자 관리 페이지 / Applicant management page
 * 파이프라인 뷰 (서류검토→면접→최종합격/불합격)
 * 이력서 열람 (열람권 차감), 메모, 면접제의, 합격/불합격 통보
 */
export default function CompanyApplicantsPage() {
  const { id: jobId } = useParams<{ id: string }>();
  const router = useRouter();
  const [activeStage, setActiveStage] = useState<Stage | 'ALL'>('ALL');
  const [job, setJob] = useState<JobSummary | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState<number>(5); // 잔여 열람권 / remaining credits

  // 모달 상태 / Modal states
  const [viewModal, setViewModal] = useState<Applicant | null>(null);
  const [memoModal, setMemoModal] = useState<Applicant | null>(null);
  const [memoText, setMemoText] = useState('');
  const [interviewModal, setInterviewModal] = useState<Applicant | null>(null);
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewNote, setInterviewNote] = useState('');
  const [interviewMethod, setInterviewMethod] = useState<'ONLINE' | 'OFFLINE'>('OFFLINE');
  const [interviewDate2, setInterviewDate2] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [interviewAddress, setInterviewAddress] = useState('');
  const [interviewDirections, setInterviewDirections] = useState('');
  const [whatToBring, setWhatToBring] = useState('');
  const [resultModal, setResultModal] = useState<{ applicant: Applicant; type: 'accept' | 'reject' } | null>(null);
  const [resultMessage, setResultMessage] = useState('');
  const [creditModal, setCreditModal] = useState<Applicant | null>(null);

  // 데이터 로드 / Load data
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;

    // 공고 정보 / Job info
    fetch(`/api/jobs/${jobId}`, { credentials: 'include', headers: { 'Authorization': `Bearer ${accessToken}` } })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setJob({ id: data.id, title: data.title, closingDate: data.closingDate, allowedVisas: data.allowedVisas, applicantCount: data.applicantCount }); })
      .catch(() => {});

    // 지원자 목록 / Applicants
    fetch(`/api/applications/job/${jobId}`, { credentials: 'include', headers: { 'Authorization': `Bearer ${accessToken}` } })
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        const list = Array.isArray(data) ? data : data.items || data.applications || data.data || [];
        setApplicants(list.map((a: Record<string, unknown>) => ({
          id: a.id as number,
          userId: a.userId as number | undefined,
          fullName: (a.fullName || a.applicantName || `지원자 #${a.id}`) as string,
          nationality: a.nationality as string | undefined,
          nationalityLabel: a.nationalityLabel as string | undefined,
          visaType: a.visaType as string | undefined,
          experienceYears: a.experienceYears as number | undefined,
          topikLevel: a.topikLevel as number | undefined,
          appliedAt: (a.appliedAt || a.createdAt || new Date().toISOString()) as string,
          status: mapStatus(a.status as string),
          memo: (a.memo || '') as string,
          resumeViewed: a.resumeViewed as boolean | undefined,
          coverLetter: a.coverLetter as string | undefined,
        })));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [jobId]);

  // 상태 매핑 / Map backend status to pipeline stage
  function mapStatus(status: string): Stage {
    if (!status) return 'REVIEW';
    const upper = status.toUpperCase();
    if (upper === 'ACCEPTED' || upper === 'HIRED') return 'ACCEPTED';
    if (upper === 'REJECTED') return 'REJECTED';
    if (upper === 'INTERVIEW' || upper === 'INTERVIEWING') return 'INTERVIEW';
    return 'REVIEW';
  }

  // 스테이지별 지원자 수 / Count per stage
  const countByStage = (stage: Stage) => applicants.filter(a => a.status === stage).length;

  // 필터된 지원자 / Filtered applicants
  const filtered = activeStage === 'ALL' ? applicants : applicants.filter(a => a.status === activeStage);

  // 지원자 상태 변경 / Update applicant status
  const updateStatus = async (applicant: Applicant, newStatus: Stage) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const res = await fetch(`/api/applications/${applicant.id}/status`, {
        method: 'PUT', credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setApplicants(prev => prev.map(a => a.id === applicant.id ? { ...a, status: newStatus } : a));
        toast.success(`${applicant.fullName}님의 상태가 변경되었습니다.`);
      } else { toast.error('상태 변경에 실패했습니다.'); }
    } catch { toast.error('네트워크 오류'); }
  };

  // 이력서 열람 / View resume (credit deduction)
  const handleViewResume = (applicant: Applicant) => {
    if (applicant.resumeViewed) {
      // 이미 열람한 이력서 → 바로 표시 / Already viewed → show directly
      setViewModal(applicant);
      return;
    }
    if (credits <= 0) {
      // 열람권 부족 / No credits
      setCreditModal(applicant);
      return;
    }
    // 열람권 차감 확인 / Confirm credit deduction
    setCreditModal(applicant);
  };

  // 열람권 사용 확인 / Confirm credit use
  const confirmViewResume = (applicant: Applicant) => {
    setCredits(prev => prev - 1);
    setApplicants(prev => prev.map(a => a.id === applicant.id ? { ...a, resumeViewed: true } : a));
    setCreditModal(null);
    setViewModal(applicant);
    toast.success('열람권 1건이 사용되었습니다.');
  };

  // 메모 저장 / Save memo
  const saveMemo = async () => {
    if (!memoModal) return;
    setApplicants(prev => prev.map(a => a.id === memoModal.id ? { ...a, memo: memoText } : a));
    toast.success('메모가 저장되었습니다.');
    setMemoModal(null);
    setMemoText('');
  };

  // 면접 제의 / Send interview request
  const sendInterview = async () => {
    if (!interviewModal || !interviewDate) { toast.error('1순위 면접 일시를 선택해주세요.'); return; }
    if (!interviewDate2) { toast.error('2순위 면접 일시를 선택해주세요.'); return; }
    if (interviewMethod === 'ONLINE' && !meetingLink) { toast.error('미팅 링크를 입력해주세요.'); return; }
    if (interviewMethod === 'OFFLINE' && !interviewAddress) { toast.error('면접 장소를 입력해주세요.'); return; }

    const notePayload = JSON.stringify({
      method: interviewMethod,
      slot1: interviewDate,
      slot2: interviewDate2,
      meetingLink: interviewMethod === 'ONLINE' ? meetingLink : '',
      address: interviewMethod === 'OFFLINE' ? interviewAddress : '',
      directions: interviewMethod === 'OFFLINE' ? interviewDirections : '',
      whatToBring,
      selectedSlot: null,
      cancelledBy: null,
      cancelReason: null,
      resultMessage: '',
    });

    try {
      const accessToken = localStorage.getItem('accessToken');
      const res = await fetch(`/api/applications/${interviewModal.id}/status`, {
        method: 'PUT', credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
        body: JSON.stringify({ status: 'INTERVIEW_REQUESTED', interviewDate, interviewNote: notePayload }),
      });
      if (res.ok) {
        setApplicants(prev => prev.map(a => a.id === interviewModal.id ? { ...a, status: 'INTERVIEW' as Stage } : a));
        toast.success(`${interviewModal.fullName}님에게 면접이 제의되었습니다.`);
      } else { toast.error('면접 제의에 실패했습니다.'); }
    } catch { toast.error('네트워크 오류'); }

    setInterviewModal(null);
    setInterviewDate('');
    setInterviewDate2('');
    setInterviewNote('');
    setInterviewMethod('OFFLINE');
    setMeetingLink('');
    setInterviewAddress('');
    setInterviewDirections('');
    setWhatToBring('');
  };

  // 합격/불합격 통보 / Send result
  const sendResult = async () => {
    if (!resultModal) return;
    const newStatus: Stage = resultModal.type === 'accept' ? 'ACCEPTED' : 'REJECTED';

    try {
      const accessToken = localStorage.getItem('accessToken');

      // Read existing interviewNote and update with resultMessage
      let updatedNote: Record<string, unknown> = {};
      try {
        const appRes = await fetch(`/api/applications/${resultModal.applicant.id}`, {
          credentials: 'include',
          headers: { 'Authorization': `Bearer ${accessToken}` },
        });
        if (appRes.ok) {
          const appData = await appRes.json();
          if (appData.interviewNote) {
            updatedNote = JSON.parse(appData.interviewNote);
          }
        }
      } catch { /* ignore parse errors, proceed with empty note */ }
      updatedNote.resultMessage = resultMessage;

      const body: Record<string, string> = {
        status: resultModal.type === 'accept' ? 'ACCEPTED' : 'REJECTED',
        interviewNote: JSON.stringify(updatedNote),
      };
      if (resultModal.type === 'reject' && resultMessage) {
        body.rejectionReason = resultMessage;
      }

      const res = await fetch(`/api/applications/${resultModal.applicant.id}/status`, {
        method: 'PUT', credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setApplicants(prev => prev.map(a => a.id === resultModal.applicant.id ? { ...a, status: newStatus } : a));
        toast.success(`${resultModal.applicant.fullName}님에게 ${resultModal.type === 'accept' ? '합격' : '불합격'} 통보가 발송되었습니다.`);
      } else { toast.error('통보 발송에 실패했습니다.'); }
    } catch { toast.error('네트워크 오류'); }

    setResultModal(null);
    setResultMessage('');
  };

  // 국기 이모지 / Flag emoji from country code
  const getFlag = (code?: string) => {
    if (!code || code.length !== 2) return '';
    return String.fromCodePoint(...[...code.toUpperCase()].map(c => 0x1F1E6 + c.charCodeAt(0) - 65));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* 헤더 / Header */}
      <div className="flex items-center gap-3 mb-4">
        <Link href="/company/jobs" className="p-2 text-gray-500 hover:text-gray-700 transition">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-gray-900 truncate">{job?.title || `공고 #${jobId}`}</h1>
          <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> 지원자 {applicants.length}명</span>
            {job?.closingDate && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 마감 {new Date(job.closingDate).toLocaleDateString('ko-KR')}</span>}
            {job?.allowedVisas && job.allowedVisas.length > 0 && (
              <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> 비자 {job.allowedVisas.length}개</span>
            )}
          </div>
        </div>
        <div className="shrink-0 text-xs text-gray-500 bg-gray-100 rounded-lg px-3 py-1.5">
          <CreditCard className="w-3 h-3 inline mr-1" />잔여 열람권: <span className="font-bold text-gray-900">{credits}건</span>
        </div>
      </div>

      {/* 파이프라인 탭 / Pipeline tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
        <button onClick={() => setActiveStage('ALL')}
          className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition ${
            activeStage === 'ALL' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}>
          전체 ({applicants.length})
        </button>
        {STAGES.map(stage => {
          const config = STAGE_CONFIG[stage];
          const count = countByStage(stage);
          return (
            <button key={stage} onClick={() => setActiveStage(stage)}
              className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition flex items-center gap-1.5 ${
                activeStage === stage ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
              {config.label} ({count})
            </button>
          );
        })}
      </div>

      {/* 파이프라인 시각화 (웹) / Pipeline visualization (desktop) */}
      <div className="hidden md:flex items-center gap-2 mb-6 bg-white rounded-xl border border-gray-200 p-4">
        {STAGES.map((stage, idx) => {
          const config = STAGE_CONFIG[stage];
          const count = countByStage(stage);
          return (
            <div key={stage} className="flex items-center flex-1">
              <div className={`flex-1 text-center p-3 rounded-lg bg-${config.color}-50 border border-${config.color}-200`}>
                <p className={`text-2xl font-bold text-${config.color}-600`}>{count}</p>
                <p className="text-xs text-gray-600 mt-0.5">{config.label}</p>
              </div>
              {idx < STAGES.length - 1 && <ChevronRight className="w-4 h-4 text-gray-300 mx-1 shrink-0" />}
            </div>
          );
        })}
      </div>

      {/* 지원자 목록 / Applicant list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">
            {activeStage === 'ALL' ? '아직 지원자가 없습니다.' : `${STAGE_CONFIG[activeStage as Stage].label} 단계의 지원자가 없습니다.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(applicant => {
            const stageConfig = STAGE_CONFIG[applicant.status];
            return (
              <div key={applicant.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition">
                <div className="flex items-start gap-3">
                  {/* 프로필 / Profile */}
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0 text-sm font-bold text-gray-500">
                    {applicant.fullName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-gray-900 text-sm">{applicant.fullName}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium bg-${stageConfig.color}-100 text-${stageConfig.color}-700`}>
                        {stageConfig.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 flex-wrap">
                      {applicant.nationality && (
                        <span>{getFlag(applicant.nationality)} {applicant.nationalityLabel || applicant.nationality}</span>
                      )}
                      {applicant.visaType && (
                        <span className="inline-flex items-center gap-0.5">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> {applicant.visaType}
                        </span>
                      )}
                      {applicant.experienceYears !== undefined && (
                        <span>경력 {applicant.experienceYears}년</span>
                      )}
                      {applicant.topikLevel !== undefined && applicant.topikLevel > 0 && (
                        <span>TOPIK {applicant.topikLevel}급</span>
                      )}
                      <span>지원일: {new Date(applicant.appliedAt).toLocaleDateString('ko-KR')}</span>
                    </div>
                    {applicant.memo && (
                      <p className="text-xs text-amber-600 mt-1.5 bg-amber-50 px-2 py-1 rounded inline-block">
                        <MessageSquare className="w-3 h-3 inline mr-1" />메모: {applicant.memo}
                      </p>
                    )}
                  </div>

                  {/* 액션 버튼 / Action buttons */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button onClick={() => handleViewResume(applicant)}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border transition ${
                        applicant.resumeViewed
                          ? 'text-gray-600 border-gray-200 hover:bg-gray-50'
                          : 'text-blue-600 border-blue-200 hover:bg-blue-50'
                      }`}>
                      <Eye className="w-3 h-3" /> {applicant.resumeViewed ? '이력서' : '이력서 보기'}
                    </button>
                    {applicant.status === 'REVIEW' && (
                      <button onClick={() => { setInterviewModal(applicant); }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-amber-600 border border-amber-200 rounded-lg hover:bg-amber-50 transition">
                        <Calendar className="w-3 h-3" /> 면접제의
                      </button>
                    )}
                    {(applicant.status === 'REVIEW' || applicant.status === 'INTERVIEW') && (
                      <>
                        <button onClick={() => setResultModal({ applicant, type: 'accept' })}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-600 border border-green-200 rounded-lg hover:bg-green-50 transition">
                          <CheckCircle2 className="w-3 h-3" /> 합격
                        </button>
                        <button onClick={() => setResultModal({ applicant, type: 'reject' })}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition">
                          <XCircle className="w-3 h-3" /> 불합격
                        </button>
                      </>
                    )}
                    <button onClick={() => { setMemoModal(applicant); setMemoText(applicant.memo || ''); }}
                      className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ═══ 모달들 / Modals ═══ */}

      {/* 열람권 확인 / Credit confirmation modal */}
      {creditModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6">
            <button onClick={() => setCreditModal(null)} className="float-right text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            {creditModal.resumeViewed ? null : credits > 0 ? (
              <>
                <div className="text-center mb-4">
                  <Eye className="w-10 h-10 text-blue-500 mx-auto mb-2" />
                  <h3 className="font-bold text-gray-900">이력서 열람</h3>
                  <p className="text-sm text-gray-500 mt-1">열람권 1건을 사용합니다.</p>
                  <p className="text-xs text-gray-400 mt-1">현재 잔여: {credits}건</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setCreditModal(null)}>취소</Button>
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" onClick={() => confirmViewResume(creditModal)}>확인</Button>
                </div>
              </>
            ) : (
              <>
                <div className="text-center mb-4">
                  <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
                  <h3 className="font-bold text-gray-900">열람권이 부족합니다</h3>
                  <p className="text-sm text-gray-500 mt-1">이력서를 보려면 열람권이 필요합니다.</p>
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

      {/* 이력서 보기 / Resume view modal */}
      {viewModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-lg">{viewModal.fullName} 이력서</h3>
              <button onClick={() => setViewModal(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                {viewModal.nationality && <div><span className="text-gray-500">국적:</span> <span className="font-medium">{getFlag(viewModal.nationality)} {viewModal.nationalityLabel || viewModal.nationality}</span></div>}
                {viewModal.visaType && <div><span className="text-gray-500">비자:</span> <span className="font-medium">{viewModal.visaType}</span></div>}
                {viewModal.experienceYears !== undefined && <div><span className="text-gray-500">경력:</span> <span className="font-medium">{viewModal.experienceYears}년</span></div>}
                {viewModal.topikLevel !== undefined && viewModal.topikLevel > 0 && <div><span className="text-gray-500">TOPIK:</span> <span className="font-medium">{viewModal.topikLevel}급</span></div>}
              </div>
              {viewModal.coverLetter && (
                <div>
                  <h4 className="font-medium text-gray-700 text-sm mb-1">자기소개서</h4>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap bg-gray-50 rounded-lg p-3">{viewModal.coverLetter}</p>
                </div>
              )}
              <p className="text-xs text-gray-400 text-center">상세 이력서는 구직자의 공개 설정에 따라 표시됩니다.</p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
              <Button variant="outline" onClick={() => setViewModal(null)}>닫기</Button>
            </div>
          </div>
        </div>
      )}

      {/* 메모 / Memo modal */}
      {memoModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">{memoModal.fullName} 메모</h3>
              <button onClick={() => setMemoModal(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-xs text-gray-400 mb-2">내부 메모 (지원자에게 보이지 않습니다)</p>
            <textarea value={memoText} onChange={e => setMemoText(e.target.value)} rows={4} placeholder="메모를 입력하세요"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none" />
            <div className="flex gap-2 mt-3">
              <Button variant="outline" className="flex-1" onClick={() => setMemoModal(null)}>취소</Button>
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" onClick={saveMemo}>저장</Button>
            </div>
          </div>
        </div>
      )}

      {/* 면접 제의 / Interview request modal */}
      {interviewModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[85vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">면접 제의</h3>
              <button onClick={() => { setInterviewModal(null); setInterviewDate(''); setInterviewDate2(''); setInterviewNote(''); setInterviewMethod('OFFLINE'); setMeetingLink(''); setInterviewAddress(''); setInterviewDirections(''); setWhatToBring(''); }} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-sm text-gray-500 mb-4">{interviewModal.fullName}님에게 면접을 제의합니다.</p>
            <div className="space-y-3">
              {/* 면접 방식 / Interview method toggle */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">면접 방식 <span className="text-red-500">*</span></label>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setInterviewMethod('ONLINE')}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg border transition ${
                      interviewMethod === 'ONLINE' ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                    }`}>
                    온라인
                  </button>
                  <button type="button" onClick={() => setInterviewMethod('OFFLINE')}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg border transition ${
                      interviewMethod === 'OFFLINE' ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                    }`}>
                    오프라인
                  </button>
                </div>
              </div>
              {/* 1순위 면접 일시 / 1st priority datetime */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">1순위 면접 일시 <span className="text-red-500">*</span></label>
                <Input type="datetime-local" value={interviewDate} onChange={e => setInterviewDate(e.target.value)} />
              </div>
              {/* 2순위 면접 일시 / 2nd priority datetime */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">2순위 면접 일시 <span className="text-red-500">*</span></label>
                <Input type="datetime-local" value={interviewDate2} onChange={e => setInterviewDate2(e.target.value)} />
              </div>
              {/* 온라인: 미팅 링크 / Online: meeting link */}
              {interviewMethod === 'ONLINE' && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">미팅 링크 <span className="text-red-500">*</span></label>
                  <Input type="text" value={meetingLink} onChange={e => setMeetingLink(e.target.value)} placeholder="https://zoom.us/..." />
                </div>
              )}
              {/* 오프라인: 주소 / Offline: address */}
              {interviewMethod === 'OFFLINE' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">면접 장소 <span className="text-red-500">*</span></label>
                    <Input type="text" value={interviewAddress} onChange={e => setInterviewAddress(e.target.value)} placeholder="서울시 강남구 테헤란로 123" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">층/호수/찾아오는 길 (선택)</label>
                    <Input type="text" value={interviewDirections} onChange={e => setInterviewDirections(e.target.value)} placeholder="3층 301호, 엘리베이터 이용" />
                  </div>
                </>
              )}
              {/* 준비물 / What to bring */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">준비물 (선택)</label>
                <Input type="text" value={whatToBring} onChange={e => setWhatToBring(e.target.value)} placeholder="여권, 이력서 등" />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" className="flex-1" onClick={() => { setInterviewModal(null); setInterviewDate(''); setInterviewDate2(''); setInterviewNote(''); setInterviewMethod('OFFLINE'); setMeetingLink(''); setInterviewAddress(''); setInterviewDirections(''); setWhatToBring(''); }}>취소</Button>
              <Button className="flex-1 bg-amber-500 hover:bg-amber-600 text-white gap-1" onClick={sendInterview}>
                <Send className="w-3.5 h-3.5" /> 면접 제의
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 합격/불합격 통보 / Accept/Reject result modal */}
      {resultModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">
                {resultModal.type === 'accept' ? '합격 통보' : '불합격 통보'}
              </h3>
              <button onClick={() => setResultModal(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              {resultModal.applicant.fullName}님에게 {resultModal.type === 'accept' ? '합격' : '불합격'} 통보를 발송합니다.
            </p>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">메시지 (선택)</label>
              <textarea value={resultMessage} onChange={e => setResultMessage(e.target.value)} rows={4}
                placeholder={resultModal.type === 'accept' ? '합격을 축하합니다! 근무 시작일 등 안내사항을 입력하세요.' : '아쉽지만 불합격 안내드립니다.'}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none" />
            </div>
            {resultModal.type === 'accept' && (
              <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700">
                합격 통보 후 &quot;비자 행정대행이 필요하신가요?&quot; CTA가 표시됩니다.
              </div>
            )}
            <div className="flex gap-2 mt-4">
              <Button variant="outline" className="flex-1" onClick={() => setResultModal(null)}>취소</Button>
              <Button className={`flex-1 gap-1 text-white ${resultModal.type === 'accept' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`} onClick={sendResult}>
                <Send className="w-3.5 h-3.5" /> 발송
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
