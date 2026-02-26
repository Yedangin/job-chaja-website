'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  AlertCircle, CheckCircle2, ArrowRight, ArrowLeft, Loader2,
  Clock, Upload, X, FileText, Shield, ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

type Step = 1 | 2 | 3;

interface FormData {
  managerName: string;
  managerPhone: string;
  managerEmail: string;
  department: string;
  bizNo: string;
  companyName: string;
  repName: string;
  openDate: string;
  agreeTerms: boolean;
  agreePrivacy: boolean;
  agreeMarketing: boolean;
}

/**
 * 기업인증 제출 페이지 / Company verification submission page
 * 3단계 폼: 담당자 정보 → 사업자 인증 → 완료
 * register/page.tsx 기반, CompanyLayout 내에서 동작
 */
export default function CompanyVerificationPage() {
  const router = useRouter();
  const { user, refreshAuth } = useAuth();

  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isVerified, setIsVerified] = useState(false);
  const [showAuthCode, setShowAuthCode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bizCheckLoading, setBizCheckLoading] = useState(false);
  const [bizCheckResult, setBizCheckResult] = useState<{
    businessStatus: string;
    statusDetail: string;
    isValid: boolean;
    message: string;
  } | null>(null);

  // 인증 상태 (직접 API 호출) / Verification status (direct API call)
  const [pageLoading, setPageLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null);
  const [lastRejectionReason, setLastRejectionReason] = useState<string | null>(null);

  // PASS 본인인증 (다날) - 아직 미연동
  const [verifiedName] = useState<string | null>(null);

  // 서류 업로드 상태 / Document upload state
  const [bizRegDoc, setBizRegDoc] = useState<{ filePath: string; originalName: string } | null>(null);
  const [empCertDoc, setEmpCertDoc] = useState<{ filePath: string; originalName: string } | null>(null);
  const [bizRegUploading, setBizRegUploading] = useState(false);
  const [empCertUploading, setEmpCertUploading] = useState(false);
  const [isCeoSelf, setIsCeoSelf] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    managerName: '',
    managerPhone: '',
    managerEmail: '',
    department: '',
    bizNo: '',
    companyName: '',
    repName: '',
    openDate: '',
    agreeTerms: false,
    agreePrivacy: false,
    agreeMarketing: false,
  });

  // 기업 인증 상태 조회 / Fetch corporate verification status
  useEffect(() => {
    const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!accessToken) { setPageLoading(false); return; }

    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/auth/corporate-verify', {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
        });
        if (res.ok) {
          const data = await res.json();
          setVerificationStatus(data.verificationStatus || 'PENDING');
          setLastRejectionReason(data.lastRejectionReason || null);
          // 기존 데이터 미리 채우기 / Pre-fill existing data
          if (data.managerName) setFormData(prev => ({ ...prev, managerName: data.managerName }));
          if (data.managerPhone) setFormData(prev => ({ ...prev, managerPhone: data.managerPhone }));
          if (data.managerEmail) setFormData(prev => ({ ...prev, managerEmail: data.managerEmail }));
          if (data.bizRegNumber) setFormData(prev => ({ ...prev, bizNo: data.bizRegNumber }));
          if (data.companyNameOfficial) setFormData(prev => ({ ...prev, companyName: data.companyNameOfficial }));
          if (data.ceoName) setFormData(prev => ({ ...prev, repName: data.ceoName }));
        }
      } catch { /* ignore */ }
      finally { setPageLoading(false); }
    };
    fetchStatus();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleRequestAuthCode = () => { setShowAuthCode(true); };
  const handleConfirmAuthCode = () => { setIsVerified(true); setShowAuthCode(false); };

  // 사업자 진위확인 / Business number verification
  const handleCheckBizInfo = async () => {
    const cleanNo = formData.bizNo.replace(/[^0-9]/g, '');
    if (cleanNo.length !== 10) { toast.error('사업자등록번호 10자리를 입력해주세요.'); return; }
    if (!formData.companyName.trim()) { toast.error('기업명을 입력해주세요.'); return; }
    if (!formData.repName.trim()) { toast.error('대표자 성명을 입력해주세요.'); return; }
    const cleanDate = formData.openDate.replace(/[^0-9]/g, '');
    if (cleanDate.length !== 8) { toast.error('개업일자 8자리(YYYYMMDD)를 입력해주세요.'); return; }

    setBizCheckLoading(true);
    setBizCheckResult(null);

    try {
      const res = await fetch('/api/auth/verify-business-number', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bizRegNumber: cleanNo,
          ceoName: formData.repName.trim(),
          companyName: formData.companyName.trim(),
          openDate: cleanDate,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || '사업자 조회에 실패했습니다.');
        setBizCheckResult({ businessStatus: '', statusDetail: '', isValid: false, message: data.message || '조회 실패' });
        return;
      }
      setBizCheckResult({
        businessStatus: data.businessStatus,
        statusDetail: data.statusDetail || '',
        isValid: data.isValid,
        message: data.message,
      });
      if (data.isValid) toast.success('사업자 정보가 확인되었습니다.');
      else toast.error(data.message || '사업자 정보 확인에 실패했습니다.');
    } catch {
      toast.error('네트워크 오류가 발생했습니다.');
    } finally {
      setBizCheckLoading(false);
    }
  };

  // 파일 업로드 / File upload
  const handleFileUpload = async (file: File, docType: 'bizReg' | 'empCert') => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) { toast.error('JPG, PNG, PDF 파일만 업로드 가능합니다.'); return; }
    if (file.size > 20 * 1024 * 1024) { toast.error('파일 크기는 20MB 이하만 가능합니다.'); return; }

    const setUploading = docType === 'bizReg' ? setBizRegUploading : setEmpCertUploading;
    setUploading(true);

    try {
      const accessToken = localStorage.getItem('accessToken');
      const fd = new FormData();
      fd.append('file', file);
      fd.append('docType', docType);

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      const res = await fetch(`${backendUrl}/auth/upload-corporate-doc`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Authorization': `Bearer ${accessToken}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.message || '파일 업로드에 실패했습니다.'); return; }

      if (docType === 'bizReg') {
        setBizRegDoc({ filePath: data.filePath, originalName: data.originalName });
        toast.success('사업자등록증이 업로드되었습니다.');
      } else {
        setEmpCertDoc({ filePath: data.filePath, originalName: data.originalName });
        toast.success('재직증명서가 업로드되었습니다.');
      }
    } catch {
      toast.error('파일 업로드 중 오류가 발생했습니다.');
    } finally {
      setUploading(false);
    }
  };

  const canShowCeoSelfCheckbox = verifiedName !== null && verifiedName === formData.repName;
  const canSubmit = bizCheckResult?.isValid && bizRegDoc !== null
    && ((canShowCeoSelfCheckbox && isCeoSelf) || empCertDoc !== null);

  const handleNextStep = (e: FormEvent) => {
    e.preventDefault();
    if (currentStep === 1 && isVerified && formData.agreeTerms && formData.agreePrivacy) {
      setCurrentStep(2);
    }
  };

  // 최종 제출 / Final submission
  const handleFinish = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const accessToken = localStorage.getItem('accessToken');
      const res = await fetch('/api/auth/corporate-verify', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
        body: JSON.stringify({
          bizRegNumber: formData.bizNo,
          companyNameOfficial: formData.companyName,
          ceoName: formData.repName,
          managerName: formData.managerName,
          managerPhone: formData.managerPhone,
          bizRegDocPath: bizRegDoc?.filePath,
          bizRegDocOrigName: bizRegDoc?.originalName,
          empCertDocPath: empCertDoc?.filePath || null,
          empCertDocOrigName: empCertDoc?.originalName || null,
          isCeoSelf,
        }),
      });
      if (res.ok) {
        setCurrentStep(3);
        toast.success('기업 인증 신청이 접수되었습니다.');
        await refreshAuth();
      } else {
        const data = await res.json();
        toast.error(data.message || '제출에 실패했습니다.');
      }
    } catch {
      toast.error('네트워크 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackStep = () => { setCurrentStep(prev => (prev === 1 ? 1 : (prev - 1) as Step)); };

  const toggleAllAgreements = (checked: boolean) => {
    setFormData(prev => ({ ...prev, agreeTerms: checked, agreePrivacy: checked, agreeMarketing: checked }));
  };

  const isAllAgreed = formData.agreeTerms && formData.agreePrivacy;

  // ─── 로딩 / Loading ──────────────────────────
  if (pageLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // ─── 이미 승인 / Already APPROVED ──────────────
  if (verificationStatus === 'APPROVED') {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">기업인증이 완료되었습니다</h2>
        <p className="text-sm text-gray-500 mb-6">모든 서비스를 자유롭게 이용하실 수 있습니다.</p>
        <Link
          href="/company/dashboard"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          대시보드로 이동
        </Link>
      </div>
    );
  }

  // ─── 심사 대기 중 / Awaiting review (SUBMITTED) ─
  if (verificationStatus === 'SUBMITTED') {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">기업인증 심사 중</h2>
        <p className="text-sm text-gray-500 mb-2">
          제출하신 정보를 관리자가 검토 중입니다.
        </p>
        <p className="text-xs text-gray-400 mb-6">
          승인이 완료되면 알림으로 안내드립니다. (영업일 기준 1~2일 소요)
        </p>
        <Link
          href="/company/dashboard"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
        >
          대시보드로 돌아가기
        </Link>
      </div>
    );
  }

  // ─── 3단계 폼 / 3-step form ─────────────────────
  const steps = [
    { num: 1, label: '담당자 정보' },
    { num: 2, label: '사업자 인증' },
    { num: 3, label: '신청 완료' },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* 반려 안내 배너 / Rejection banner */}
      {lastRejectionReason && (
        <div className="flex items-start gap-3 p-4 mb-6 bg-red-50 border border-red-200 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-700">이전 신청이 반려되었습니다</p>
            <p className="text-xs text-red-600 mt-1">{lastRejectionReason}</p>
            <p className="text-xs text-red-500 mt-1">서류를 수정하여 다시 제출해주세요.</p>
          </div>
        </div>
      )}

      {/* 상단 진행 바 / Top progress bar */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((s, idx) => (
          <div key={s.num} className="flex items-center flex-1">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                currentStep === s.num ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                : currentStep > s.num ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-500'
              }`}>
                {currentStep > s.num ? '✓' : s.num}
              </div>
              <span className={`text-xs font-medium hidden sm:inline ${
                currentStep >= s.num ? 'text-gray-900' : 'text-gray-400'
              }`}>
                {s.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-3 ${currentStep > s.num ? 'bg-green-400' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* ── STEP 1: 담당자 정보 ── */}
      {currentStep === 1 && (
        <form onSubmit={handleNextStep} className="space-y-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">담당자 정보 입력</h1>
            <p className="text-sm text-gray-500 mt-1">채용 공고 관리 및 지원자 연락을 위한 정보를 입력해주세요.</p>
          </div>

          {/* 휴대폰 본인인증 / Phone verification */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 space-y-4">
            <h3 className="font-bold text-gray-800 text-sm">휴대폰 본인인증</h3>

            <Input
              type="text"
              name="managerName"
              value={formData.managerName}
              onChange={handleInputChange}
              placeholder="담당자 실명 입력"
              disabled={isVerified}
            />

            <div className="flex gap-3">
              <Input
                type="text"
                name="managerPhone"
                value={formData.managerPhone}
                onChange={handleInputChange}
                placeholder="휴대폰 번호 ('-' 없이 입력)"
                maxLength={11}
                inputMode="numeric"
                disabled={isVerified}
                className="flex-1"
              />
              {!isVerified && (
                <Button type="button" onClick={handleRequestAuthCode}
                  className="bg-gray-800 hover:bg-gray-700 text-white font-bold w-28 text-sm">
                  인증요청
                </Button>
              )}
            </div>

            {showAuthCode && !isVerified && (
              <div className="space-y-2">
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Input type="text" placeholder="인증번호 6자리" maxLength={6} inputMode="numeric" />
                    <span className="absolute right-4 top-2.5 text-xs text-red-500 font-bold">02:59</span>
                  </div>
                  <Button type="button" onClick={handleConfirmAuthCode}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold w-20 text-sm">
                    확인
                  </Button>
                </div>
                <p className="text-xs text-gray-400">
                  인증번호가 도착하지 않았나요?{' '}
                  <button type="button" className="underline text-gray-600 font-medium">재발송</button>
                </p>
              </div>
            )}

            {isVerified && (
              <div className="flex items-center gap-1 text-sm text-green-600 font-bold">
                <CheckCircle2 className="w-4 h-4" /> 인증되었습니다.
              </div>
            )}
          </div>

          {/* 추가 정보 / Additional info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                담당자 이메일 <span className="text-red-500">*</span>
              </label>
              <Input
                type="email" name="managerEmail"
                value={formData.managerEmail} onChange={handleInputChange}
                placeholder="example@company.com" required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                부서 / 직함 <span className="text-red-500">*</span>
              </label>
              <Input
                type="text" name="department"
                value={formData.department} onChange={handleInputChange}
                placeholder="예: 인사팀 / 매니저" required
              />
            </div>
          </div>

          {/* 약관 동의 / Terms agreement */}
          <div className="border-t border-gray-100 pt-5 space-y-3">
            <div className="flex items-center">
              <Checkbox
                id="all-agree" checked={isAllAgreed}
                onCheckedChange={(checked) => toggleAllAgreements(checked as boolean)}
                className="w-5 h-5"
              />
              <label htmlFor="all-agree" className="ml-2 font-bold text-gray-900 cursor-pointer text-sm">
                약관 전체 동의
              </label>
            </div>
            <div className="space-y-3 pl-1">
              {[
                { id: 'agreeTerms', label: '[필수] 기업회원 이용약관 동의' },
                { id: 'agreePrivacy', label: '[필수] 개인정보 수집 및 이용 동의' },
                { id: 'agreeMarketing', label: '[선택] 마케팅 정보 수신 및 활용 동의' },
              ].map(item => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Checkbox
                      id={item.id} name={item.id}
                      checked={formData[item.id as keyof FormData] as boolean}
                      onCheckedChange={(checked) =>
                        handleInputChange({
                          target: { name: item.id, type: 'checkbox', checked: checked as boolean } as unknown,
                        } as ChangeEvent<HTMLInputElement>)
                      }
                      className="w-4 h-4"
                    />
                    <label htmlFor={item.id} className="ml-2 text-sm text-gray-600 cursor-pointer">{item.label}</label>
                  </div>
                  <button type="button" className="text-xs text-gray-400 underline">보기</button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={!isVerified || !isAllAgreed}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2"
            >
              다음 단계 <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>
      )}

      {/* ── STEP 2: 사업자 인증 ── */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">사업자 정보 확인</h1>
            <p className="text-sm text-gray-500 mt-1">사업자 정보를 입력하고 진위확인 조회를 진행해주세요.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                사업자등록번호 <span className="text-red-500">*</span>
              </label>
              <Input
                type="text" name="bizNo" value={formData.bizNo}
                onChange={(e) => { handleInputChange(e); setBizCheckResult(null); }}
                placeholder="10자리 숫자 입력" maxLength={10} inputMode="numeric"
                disabled={bizCheckResult?.isValid}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  기업명 <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text" name="companyName" value={formData.companyName}
                  onChange={(e) => { handleInputChange(e); setBizCheckResult(null); }}
                  placeholder="기업명 입력" disabled={bizCheckResult?.isValid}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  대표자 성명 <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text" name="repName" value={formData.repName}
                  onChange={(e) => { handleInputChange(e); setBizCheckResult(null); }}
                  placeholder="대표자 성명 입력" disabled={bizCheckResult?.isValid}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                개업일자 <span className="text-red-500">*</span>
              </label>
              <Input
                type="text" name="openDate" value={formData.openDate}
                onChange={(e) => { handleInputChange(e); setBizCheckResult(null); }}
                placeholder="YYYYMMDD (예: 20200315)" maxLength={8} inputMode="numeric"
                disabled={bizCheckResult?.isValid}
              />
              <p className="text-xs text-gray-400 mt-1">사업자등록증에 기재된 개업연월일 8자리를 입력해주세요.</p>
            </div>

            {/* 진위확인 버튼 / Verification button */}
            <div>
              {!bizCheckResult?.isValid ? (
                <Button
                  type="button" onClick={handleCheckBizInfo}
                  disabled={bizCheckLoading || !formData.bizNo.trim() || !formData.companyName.trim() || !formData.repName.trim() || formData.openDate.replace(/[^0-9]/g, '').length !== 8}
                  className="bg-gray-800 hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold w-full py-3"
                >
                  {bizCheckLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  {bizCheckLoading ? '진위확인 중...' : '사업자 진위확인'}
                </Button>
              ) : (
                <Button type="button" onClick={() => setBizCheckResult(null)}
                  variant="outline" className="text-gray-600 font-bold w-full py-3">
                  다시 조회
                </Button>
              )}

              {bizCheckResult && (
                <div className={`mt-3 flex items-center gap-2 text-sm font-medium ${bizCheckResult.isValid ? 'text-green-600' : 'text-red-500'}`}>
                  {bizCheckResult.isValid ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  <span>{bizCheckResult.message}</span>
                </div>
              )}
            </div>
          </div>

          {/* 서류 업로드 / Document upload section */}
          {bizCheckResult?.isValid && (
            <div className="space-y-5 pt-4 border-t border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-1">서류 업로드</h3>
                <p className="text-xs text-gray-500">기업 인증을 위한 서류를 업로드해주세요. (JPG, PNG, PDF / 최대 20MB)</p>
              </div>

              {/* 사업자등록증 (필수) / Business registration (required) */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  사업자등록증 <span className="text-red-500">*</span>
                </label>
                {bizRegDoc ? (
                  <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                    <FileText className="w-5 h-5 text-green-600 shrink-0" />
                    <span className="text-sm text-green-700 font-medium truncate flex-1">{bizRegDoc.originalName}</span>
                    <button type="button" onClick={() => setBizRegDoc(null)} className="text-gray-400 hover:text-red-500 transition">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition">
                    {bizRegUploading ? (
                      <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-gray-400 mb-1" />
                        <span className="text-sm text-gray-500">클릭하여 파일 선택</span>
                        <span className="text-xs text-gray-400 mt-0.5">JPG, PNG, PDF (최대 20MB)</span>
                      </>
                    )}
                    <input type="file" accept=".jpg,.jpeg,.png,.pdf" className="hidden"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f, 'bizReg'); e.target.value = ''; }}
                      disabled={bizRegUploading}
                    />
                  </label>
                )}
              </div>

              {/* 대표자 본인 확인 / CEO self-check */}
              {canShowCeoSelfCheckbox && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox id="ceoSelf" checked={isCeoSelf}
                      onCheckedChange={(checked) => { setIsCeoSelf(checked as boolean); if (checked) setEmpCertDoc(null); }}
                      className="mt-0.5"
                    />
                    <label htmlFor="ceoSelf" className="cursor-pointer">
                      <span className="text-sm font-bold text-gray-800 block">본인은 위 사업자의 대표자 본인임을 확인합니다.</span>
                      <span className="text-xs text-gray-500 mt-1 block">체크 시 재직증명서 제출이 면제됩니다.</span>
                    </label>
                  </div>
                </div>
              )}

              {/* 재직증명서 (조건부 필수) / Employment certificate (conditional) */}
              {!(canShowCeoSelfCheckbox && isCeoSelf) && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    재직증명서 <span className="text-red-500">*</span>
                  </label>
                  {empCertDoc ? (
                    <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                      <FileText className="w-5 h-5 text-green-600 shrink-0" />
                      <span className="text-sm text-green-700 font-medium truncate flex-1">{empCertDoc.originalName}</span>
                      <button type="button" onClick={() => setEmpCertDoc(null)} className="text-gray-400 hover:text-red-500 transition">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition">
                      {empCertUploading ? (
                        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                      ) : (
                        <>
                          <Upload className="w-5 h-5 text-gray-400 mb-1" />
                          <span className="text-sm text-gray-500">클릭하여 파일 선택</span>
                          <span className="text-xs text-gray-400 mt-0.5">JPG, PNG, PDF (최대 20MB)</span>
                        </>
                      )}
                      <input type="file" accept=".jpg,.jpeg,.png,.pdf" className="hidden"
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f, 'empCert'); e.target.value = ''; }}
                        disabled={empCertUploading}
                      />
                    </label>
                  )}
                  <p className="text-xs text-gray-400 mt-1.5">해당 기업 소속임을 증명하는 재직증명서를 업로드해주세요.</p>
                </div>
              )}
            </div>
          )}

          {/* 하단 버튼 / Bottom buttons */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <Button type="button" onClick={handleBackStep} variant="ghost"
              className="text-gray-500 hover:text-gray-800 flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> 이전
            </Button>
            <Button
              type="button" onClick={handleFinish}
              disabled={!canSubmit || submitting}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              신청 완료
            </Button>
          </div>
        </div>
      )}

      {/* ── STEP 3: 완료 ── */}
      {currentStep === 3 && (
        <div className="text-center py-10">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <ShieldCheck className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-3">기업인증 신청이 접수되었습니다</h2>
          <p className="text-sm text-gray-500 mb-1">
            관리자가 제출하신 정보와 서류를 확인한 후 승인 처리를 진행합니다.
          </p>
          <p className="text-xs text-gray-400 mb-8">
            * 영업일 기준 1~2일 소요 / 승인 결과는 알림으로 안내됩니다.
          </p>
          <Link
            href="/company/dashboard"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            대시보드로 이동
          </Link>
        </div>
      )}
    </div>
  );
}
