'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, CheckCircle2, ArrowRight, ArrowLeft, Loader2, Clock, Upload, X, FileText } from 'lucide-react';
import { toast } from 'sonner';

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

export default function RegisterPage() {
  const router = useRouter();
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

  // 인증 상태
  const [authLoading, setAuthLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null);
  const [lastRejectionReason, setLastRejectionReason] = useState<string | null>(null);

  // PASS 본인인증 (다날) - 아직 미연동, 연동 시 인증된 이름으로 설정
  const [verifiedName] = useState<string | null>(null);

  // 서류 업로드 상태
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

  // 세션 확인 + 기업 인증 상태 조회
  useEffect(() => {
    const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!accessToken) {
      setAuthLoading(false);
      return;
    }

    const checkAuth = async () => {
      try {
        const profileRes = await fetch('/api/auth/profile', {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
        });
        if (!profileRes.ok) { setAuthLoading(false); return; }
        const profile = await profileRes.json();
        if (profile.user?.role !== 4) { setAuthLoading(false); return; }

        // 기업 인증 상태 조회
        const verifyRes = await fetch('/api/auth/corporate-verify', {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
        });
        if (verifyRes.ok) {
          const data = await verifyRes.json();
          setVerificationStatus(data.verificationStatus || 'PENDING');
          setLastRejectionReason(data.lastRejectionReason || null);
          // 기존 데이터가 있으면 폼에 미리 채우기
          if (data.managerName) setFormData(prev => ({ ...prev, managerName: data.managerName }));
          if (data.managerPhone) setFormData(prev => ({ ...prev, managerPhone: data.managerPhone }));
          if (data.managerEmail) setFormData(prev => ({ ...prev, managerEmail: data.managerEmail }));
          if (data.bizRegNumber) setFormData(prev => ({ ...prev, bizNo: data.bizRegNumber }));
          if (data.companyNameOfficial) setFormData(prev => ({ ...prev, companyName: data.companyNameOfficial }));
          if (data.ceoName) setFormData(prev => ({ ...prev, repName: data.ceoName }));
        }
      } catch { /* ignore */ }
      finally { setAuthLoading(false); }
    };
    checkAuth();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleRequestAuthCode = () => {
    setShowAuthCode(true);
  };

  const handleConfirmAuthCode = () => {
    setIsVerified(true);
    setShowAuthCode(false);
  };

  const handleCheckBizInfo = async () => {
    const cleanNo = formData.bizNo.replace(/[^0-9]/g, '');
    if (cleanNo.length !== 10) {
      toast.error('사업자등록번호 10자리를 입력해주세요.');
      return;
    }
    if (!formData.companyName.trim()) {
      toast.error('기업명을 입력해주세요.');
      return;
    }
    if (!formData.repName.trim()) {
      toast.error('대표자 성명을 입력해주세요.');
      return;
    }
    const cleanDate = formData.openDate.replace(/[^0-9]/g, '');
    if (cleanDate.length !== 8) {
      toast.error('개업일자 8자리(YYYYMMDD)를 입력해주세요.');
      return;
    }

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

      if (data.isValid) {
        toast.success('사업자 정보가 확인되었습니다.');
      } else {
        toast.error(data.message || '사업자 정보 확인에 실패했습니다.');
      }
    } catch {
      toast.error('네트워크 오류가 발생했습니다.');
    } finally {
      setBizCheckLoading(false);
    }
  };

  // 파일 업로드 핸들러
  const handleFileUpload = async (file: File, docType: 'bizReg' | 'empCert') => {
    // 클라이언트 사이드 검증
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('JPG, PNG, PDF 파일만 업로드 가능합니다.');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      toast.error('파일 크기는 20MB 이하만 가능합니다.');
      return;
    }

    const setUploading = docType === 'bizReg' ? setBizRegUploading : setEmpCertUploading;
    setUploading(true);

    try {
      const accessToken = localStorage.getItem('accessToken');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('docType', docType);

      // Next.js API Route에 10MB body 제한이 있어 백엔드로 직접 업로드
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      const res = await fetch(`${backendUrl}/auth/upload-corporate-doc`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Authorization': `Bearer ${accessToken}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || '파일 업로드에 실패했습니다.');
        return;
      }

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

  // 대표자 본인 체크 가능 여부
  const canShowCeoSelfCheckbox = verifiedName !== null && verifiedName === formData.repName;

  // 신청 완료 버튼 활성화 조건
  const canSubmit = bizCheckResult?.isValid
    && bizRegDoc !== null
    && ((canShowCeoSelfCheckbox && isCeoSelf) || empCertDoc !== null);

  const handleNextStep = (e: FormEvent) => {
    e.preventDefault();
    if (currentStep === 1 && isVerified && formData.agreeTerms && formData.agreePrivacy) {
      setCurrentStep(2);
    }
  };

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

  const handleBackStep = () => {
    setCurrentStep(prev => (prev === 1 ? 1 : (prev - 1) as Step));
  };

  const toggleAllAgreements = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      agreeTerms: checked,
      agreePrivacy: checked,
      agreeMarketing: checked,
    }));
  };

  const isAllAgreed = formData.agreeTerms && formData.agreePrivacy;

  // 로딩 중
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
      </div>
    );
  }

  // 이미 승인된 경우
  if (verificationStatus === 'APPROVED') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">이미 인증 완료된 기업입니다</h2>
          <p className="text-sm text-slate-500 mb-6">기업 서비스를 바로 이용하실 수 있습니다.</p>
          <Button onClick={() => router.push('/biz')} className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-8 py-3">
            기업 서비스로 이동
          </Button>
        </div>
      </div>
    );
  }

  // 심사 대기 중
  if (verificationStatus === 'SUBMITTED') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md text-center">
          <Clock className="w-16 h-16 text-sky-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">기업 인증 심사 중</h2>
          <p className="text-sm text-slate-500 mb-6">
            제출하신 정보를 관리자가 검토 중입니다.<br />
            승인이 완료되면 기업 서비스를 이용하실 수 있습니다.
          </p>
          <Button onClick={() => router.push('/')} variant="outline" className="font-bold px-8 py-3">
            메인으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-10 px-4 bg-slate-100">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex min-h-96">

        {/* Sidebar - Left */}
        <div className="w-1/3 bg-slate-900 p-10 text-white flex flex-col justify-between relative overflow-hidden hidden lg:flex">
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500 rounded-full blur-3xl opacity-10 -mr-20 -mt-20"></div>

          <div className="relative z-10">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-10">
              <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center text-white font-bold">
                ✈
              </div>
              <span className="text-xl font-bold tracking-tight">JobChaja Partners</span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl font-bold leading-snug mb-4">
              성공적인 글로벌 채용
              <br />
              지금 시작하세요.
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              신뢰받는 기업 인증을 통해
              <br />
              더 많은 인재를 만나보세요.
            </p>

            {/* Benefits Card */}
            <Card className="bg-slate-800/50 border-slate-700 p-4 mb-8">
              <h4 className="font-bold text-sm mb-2 text-sky-400 flex items-center gap-1">
                ℹ️ 입점 혜택
              </h4>
              <ul className="text-xs text-slate-300 space-y-2">
                <li>• 신규 가입 시 50,000 포인트 즉시 지급</li>
                <li>• 검증된 E-9/E-7 인재 DB 열람권</li>
                <li>• 전담 관리자 매칭 서비스</li>
              </ul>
            </Card>
          </div>

          {/* Rejection Banner */}
          {lastRejectionReason && (
            <Card className="bg-red-900/30 border-red-700/50 p-4 mb-4 relative z-10">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm text-red-300">이전 신청 거절 사유</h4>
                  <p className="text-xs text-red-200 mt-1">{lastRejectionReason}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Stepper */}
          <div className="relative z-10 space-y-6 mt-10">
            {[1, 2, 3].map((step, idx) => (
              <div key={step}>
                <div className="flex items-center gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ring-4 ${currentStep === step
                      ? 'bg-sky-500 text-white ring-sky-500/20'
                      : currentStep > step
                        ? 'bg-green-500 text-white ring-green-500/20'
                        : 'bg-slate-700 text-slate-400 ring-transparent'
                      }`}
                  >
                    {currentStep > step ? '✓' : step}
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">
                      {step === 1 && '담당자 정보'}
                      {step === 2 && '사업자 인증'}
                      {step === 3 && '신청 완료'}
                    </p>
                  </div>
                </div>
                {idx < 2 && <div className="w-0.5 h-6 bg-slate-700 ml-4"></div>}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="relative z-10 text-xs text-slate-600 mt-auto">
            © 2026 JobChaja Corp. All rights reserved.
          </div>
        </div>

        {/* Form Area - Right */}
        <div className="w-full lg:w-2/3 bg-white p-8 md:p-16 relative overflow-y-auto max-h-screen lg:max-h-none">

          {/* STEP 1: 담당자 정보 */}
          {currentStep === 1 && (
            <div className="max-w-2xl mx-auto animate-in fade-in">
              <div className="mb-8 border-b border-gray-100 pb-6">
                <h1 className="text-3xl font-bold text-slate-900">담당자 정보 입력</h1>
                <p className="text-slate-500 mt-2 text-sm">
                  채용 공고 관리 및 지원자 연락을 위한 정보를 입력해주세요.
                </p>
              </div>

              <form onSubmit={handleNextStep}>
                {/* Phone Verification */}
                <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-100 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-800">휴대폰 본인인증</h3>
                  </div>

                  {/* Name Input */}
                  <Input
                    type="text"
                    name="managerName"
                    value={formData.managerName}
                    onChange={handleInputChange}
                    placeholder="담당자 실명 입력"
                    disabled={isVerified}
                  />

                  {/* Phone Input */}
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
                      <Button
                        type="button"
                        onClick={handleRequestAuthCode}
                        className="bg-slate-800 hover:bg-slate-700 text-white font-bold w-28"
                      >
                        인증요청
                      </Button>
                    )}
                  </div>

                  {/* Auth Code Input */}
                  {showAuthCode && !isVerified && (
                    <div className="space-y-2 animate-in slide-in-from-top">
                      <div className="flex gap-3">
                        <div className="relative flex-1">
                          <Input
                            type="text"
                            placeholder="인증번호 6자리"
                            maxLength={6}
                            inputMode="numeric"
                            className="w-full"
                          />
                          <span className="absolute right-4 top-2.5 text-xs text-red-500 font-bold">
                            02:59
                          </span>
                        </div>
                        <Button
                          type="button"
                          onClick={handleConfirmAuthCode}
                          className="bg-sky-600 hover:bg-sky-700 text-white font-bold w-20"
                        >
                          확인
                        </Button>
                      </div>
                      <p className="text-xs text-slate-400 ml-1">
                        인증번호가 도착하지 않았나요?{' '}
                        <button type="button" className="underline text-slate-600 font-medium">
                          재발송
                        </button>
                      </p>
                    </div>
                  )}

                  {/* Success Message */}
                  {isVerified && (
                    <div className="flex items-center gap-1 text-sm text-green-600 font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      인증되었습니다.
                    </div>
                  )}
                </div>

                {/* Additional Info */}
                <div className="space-y-6 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        담당자 이메일 <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="email"
                        name="managerEmail"
                        value={formData.managerEmail}
                        onChange={handleInputChange}
                        placeholder="example@company.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        부서 / 직함 <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        placeholder="예: 인사팀 / 매니저"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Terms Agreement */}
                <div className="border-t border-gray-100 pt-6">
                  <div className="flex items-center mb-4">
                    <Checkbox
                      id="all-agree"
                      checked={isAllAgreed}
                      onCheckedChange={(checked) =>
                        toggleAllAgreements(checked as boolean)
                      }
                      className="w-5 h-5"
                    />
                    <label
                      htmlFor="all-agree"
                      className="ml-2 font-bold text-slate-900 cursor-pointer"
                    >
                      약관 전체 동의
                    </label>
                  </div>
                  <div className="space-y-4 pl-2">
                    {[
                      { id: 'agreeTerms', label: '[필수] 기업회원 이용약관 동의' },
                      { id: 'agreePrivacy', label: '[필수] 개인정보 수집 및 이용 동의' },
                      { id: 'agreeMarketing', label: '[선택] 마케팅 정보 수신 및 활용 동의' },
                    ].map(item => (
                      <div key={item.id}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Checkbox
                              id={item.id}
                              name={item.id}
                              checked={formData[item.id as keyof FormData] as boolean}
                              onCheckedChange={(checked) =>
                                handleInputChange({
                                  target: {
                                    name: item.id,
                                    type: 'checkbox',
                                    checked: checked as boolean,
                                  } as any,
                                } as ChangeEvent<HTMLInputElement>)
                              }
                              className="w-4 h-4"
                            />
                            <label
                              htmlFor={item.id}
                              className="ml-2 text-sm text-slate-600 cursor-pointer"
                            >
                              {item.label}
                            </label>
                          </div>
                          <a href="#" className="text-xs text-slate-400 underline">
                            보기
                          </a>
                        </div>
                        {item.id === 'agreeMarketing' && (
                          <p className="text-xs text-slate-400 mt-1 ml-6 leading-relaxed">
                            채용 관련 이벤트, 신규 인재 추천 등 유용한 정보를 받아보실 수 있습니다. (SMS/Email)
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-10 flex justify-end">
                  <Button
                    type="submit"
                    disabled={!isVerified || !isAllAgreed}
                    className="bg-sky-600 hover:bg-sky-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-12 py-4 rounded-xl font-bold text-lg flex items-center gap-2"
                  >
                    다음 단계 <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 2: 사업자 인증 */}
          {currentStep === 2 && (
            <div className="max-w-2xl mx-auto animate-in fade-in">
              <div className="mb-8 border-b border-gray-100 pb-6">
                <h1 className="text-3xl font-bold text-slate-900">사업자 정보 확인</h1>
                <p className="text-slate-500 mt-2 text-sm">
                  사업자 정보를 입력하고 진위확인 조회를 진행해주세요.
                </p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      사업자등록번호 <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      name="bizNo"
                      value={formData.bizNo}
                      onChange={(e) => {
                        handleInputChange(e);
                        setBizCheckResult(null);
                      }}
                      placeholder="10자리 숫자 입력"
                      maxLength={10}
                      inputMode="numeric"
                      disabled={bizCheckResult?.isValid}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      기업명 <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={(e) => {
                        handleInputChange(e);
                        setBizCheckResult(null);
                      }}
                      placeholder="기업명 입력"
                      disabled={bizCheckResult?.isValid}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      대표자 성명 <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      name="repName"
                      value={formData.repName}
                      onChange={(e) => {
                        handleInputChange(e);
                        setBizCheckResult(null);
                      }}
                      placeholder="대표자 성명 입력"
                      disabled={bizCheckResult?.isValid}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      개업일자 <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      name="openDate"
                      value={formData.openDate}
                      onChange={(e) => {
                        handleInputChange(e);
                        setBizCheckResult(null);
                      }}
                      placeholder="YYYYMMDD (예: 20200315)"
                      maxLength={8}
                      inputMode="numeric"
                      disabled={bizCheckResult?.isValid}
                    />
                    <p className="text-xs text-slate-400 mt-1">사업자등록증에 기재된 개업연월일 8자리를 입력해주세요.</p>
                  </div>

                  <div className="md:col-span-2">
                    {!bizCheckResult?.isValid ? (
                      <Button
                        type="button"
                        onClick={handleCheckBizInfo}
                        disabled={bizCheckLoading || !formData.bizNo.trim() || !formData.companyName.trim() || !formData.repName.trim() || formData.openDate.replace(/[^0-9]/g, '').length !== 8}
                        className="bg-slate-800 hover:bg-slate-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold w-full py-3"
                      >
                        {bizCheckLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        {bizCheckLoading ? '진위확인 중...' : '사업자 진위확인'}
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={() => {
                          setBizCheckResult(null);
                        }}
                        variant="outline"
                        className="text-slate-600 font-bold w-full py-3"
                      >
                        다시 조회
                      </Button>
                    )}

                    {/* 조회 결과 표시 */}
                    {bizCheckResult && (
                      <div className={`mt-3 flex items-center gap-2 text-sm font-medium ${bizCheckResult.isValid ? 'text-green-600' : 'text-red-500'}`}>
                        {bizCheckResult.isValid ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <AlertCircle className="w-4 h-4" />
                        )}
                        <span>{bizCheckResult.message}</span>
                      </div>
                    )}
                    {bizCheckResult && !bizCheckResult.isValid && (
                      <p className="text-xs text-slate-400 mt-1">입력 정보를 확인 후 다시 조회해주세요.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* 서류 업로드 섹션 - 진위확인 통과 후 표시 */}
              {bizCheckResult?.isValid && (
                <div className="mt-8 space-y-6 animate-in fade-in">
                  <div className="border-t border-gray-100 pt-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">서류 업로드</h3>
                    <p className="text-sm text-slate-500 mb-6">
                      기업 인증을 위한 서류를 업로드해주세요. (JPG, PNG, PDF / 최대 20MB)
                    </p>
                  </div>

                  {/* 사업자등록증 업로드 (필수) */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      사업자등록증 <span className="text-red-500">*</span>
                    </label>
                    {bizRegDoc ? (
                      <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                        <FileText className="w-5 h-5 text-green-600 shrink-0" />
                        <span className="text-sm text-green-700 font-medium truncate flex-1">
                          {bizRegDoc.originalName}
                        </span>
                        <button
                          type="button"
                          onClick={() => setBizRegDoc(null)}
                          className="text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-sky-400 hover:bg-sky-50/50 transition-colors">
                        {bizRegUploading ? (
                          <Loader2 className="w-6 h-6 animate-spin text-sky-500" />
                        ) : (
                          <>
                            <Upload className="w-6 h-6 text-slate-400 mb-2" />
                            <span className="text-sm text-slate-500">클릭하여 파일 선택</span>
                            <span className="text-xs text-slate-400 mt-1">JPG, PNG, PDF (최대 20MB)</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png,.pdf"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, 'bizReg');
                            e.target.value = '';
                          }}
                          disabled={bizRegUploading}
                        />
                      </label>
                    )}
                  </div>

                  {/* 대표자 본인 확인 체크박스 - PASS 인증된 이름과 대표자명 일치 시만 표시 */}
                  {canShowCeoSelfCheckbox && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id="ceoSelf"
                          checked={isCeoSelf}
                          onCheckedChange={(checked) => {
                            setIsCeoSelf(checked as boolean);
                            if (checked) setEmpCertDoc(null);
                          }}
                          className="mt-0.5"
                        />
                        <label htmlFor="ceoSelf" className="cursor-pointer">
                          <span className="text-sm font-bold text-slate-800 block">
                            본인은 위 사업자의 대표자 본인임을 확인합니다.
                          </span>
                          <span className="text-xs text-slate-500 mt-1 block">
                            본인인증된 이름과 대표자 성명이 일치합니다. 체크 시 재직증명서 제출이 면제됩니다.
                          </span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* 재직증명서 업로드 (조건부 필수) */}
                  {!(canShowCeoSelfCheckbox && isCeoSelf) && (
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        재직증명서 <span className="text-red-500">*</span>
                      </label>
                      {empCertDoc ? (
                        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                          <FileText className="w-5 h-5 text-green-600 shrink-0" />
                          <span className="text-sm text-green-700 font-medium truncate flex-1">
                            {empCertDoc.originalName}
                          </span>
                          <button
                            type="button"
                            onClick={() => setEmpCertDoc(null)}
                            className="text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-sky-400 hover:bg-sky-50/50 transition-colors">
                          {empCertUploading ? (
                            <Loader2 className="w-6 h-6 animate-spin text-sky-500" />
                          ) : (
                            <>
                              <Upload className="w-6 h-6 text-slate-400 mb-2" />
                              <span className="text-sm text-slate-500">클릭하여 파일 선택</span>
                              <span className="text-xs text-slate-400 mt-1">JPG, PNG, PDF (최대 20MB)</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.pdf"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(file, 'empCert');
                              e.target.value = '';
                            }}
                            disabled={empCertUploading}
                          />
                        </label>
                      )}
                      <p className="text-xs text-slate-400 mt-2">
                        해당 기업 소속임을 증명하는 재직증명서를 업로드해주세요.
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-12 flex justify-between items-center pt-6 border-t border-gray-100">
                <Button
                  type="button"
                  onClick={handleBackStep}
                  variant="ghost"
                  className="text-slate-500 hover:text-slate-800 hover:bg-gray-50 flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  이전
                </Button>
                <Button
                  type="button"
                  onClick={handleFinish}
                  disabled={!canSubmit || submitting}
                  className="bg-sky-600 hover:bg-sky-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-12 py-4 rounded-xl font-bold text-lg flex items-center gap-2"
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                  신청 완료
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: 완료 */}
          {currentStep === 3 && (
            <div className="max-w-lg mx-auto text-center py-10 animate-in fade-in">
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white text-4xl mx-auto mb-6 shadow-xl shadow-green-200">
                ✓
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                입점 심사 신청이
                <br />
                접수되었습니다.
              </h2>
              <p className="text-slate-500 mb-10 leading-relaxed text-sm">
                관리자가 제출해주신 정보와 서류를 확인한 후
                <br />
                최종 승인 처리를 도와드립니다. (영업일 기준 1일 소요)
                <br />
                <span className="text-slate-400 block mt-2">
                  * 승인 결과는 알림톡 및 이메일로 안내됩니다.
                </span>
              </p>

              <div className="flex gap-4">
                <Button
                  onClick={() => router.push('/')}
                  className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-bold py-3"
                >
                  메인으로
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
