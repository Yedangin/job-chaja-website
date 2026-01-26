'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, CheckCircle2, ArrowRight, ArrowLeft, FileUp } from 'lucide-react';

type Step = 1 | 2 | 3;

interface FormData {
  managerName: string;
  managerPhone: string;
  managerEmail: string;
  department: string;
  bizNo: string;
  repName: string;
  openDate: string;
  agreeTerms: boolean;
  agreePrivacy: boolean;
  agreeMarketing: boolean;
}

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isVerified, setIsVerified] = useState(false);
  const [showAuthCode, setShowAuthCode] = useState(false);
  const [showBizInfo, setShowBizInfo] = useState(false);
  const [needsExtraDoc, setNeedsExtraDoc] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    managerName: '',
    managerPhone: '',
    managerEmail: '',
    department: '',
    bizNo: '',
    repName: '',
    openDate: '',
    agreeTerms: false,
    agreePrivacy: false,
    agreeMarketing: false,
  });

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

  const handleCheckBizInfo = () => {
    if (formData.bizNo.length === 10) {
      setShowBizInfo(true);
      // Simulate API response
      setFormData(prev => ({
        ...prev,
        repName: '홍길동',
        openDate: '2020-01-15',
      }));
      // Randomly show extra doc requirement
      setNeedsExtraDoc(Math.random() > 0.5);
    }
  };

  const handleNextStep = (e: FormEvent) => {
    e.preventDefault();
    if (currentStep === 1 && isVerified && formData.agreeTerms && formData.agreePrivacy) {
      setCurrentStep(2);
    }
  };

  const handleFinish = () => {
    if (showBizInfo) {
      setCurrentStep(3);
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
                      {step === 3 && '가입 완료'}
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
                  사업자등록번호를 조회하여 기업 정보를 확인합니다.
                </p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      사업자등록번호 <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        name="bizNo"
                        value={formData.bizNo}
                        onChange={handleInputChange}
                        placeholder="10자리 숫자 입력"
                        maxLength={10}
                        inputMode="numeric"
                        disabled={showBizInfo}
                      />
                      {!showBizInfo && (
                        <Button
                          type="button"
                          onClick={handleCheckBizInfo}
                          className="bg-slate-800 hover:bg-slate-700 text-white font-bold"
                        >
                          조회
                        </Button>
                      )}
                    </div>
                  </div>

                  {showBizInfo && (
                    <>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                          대표자 성명
                        </label>
                        <Input
                          type="text"
                          value={formData.repName}
                          readOnly
                          className="bg-gray-50 text-slate-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                          개업년월일
                        </label>
                        <Input
                          type="text"
                          value={formData.openDate}
                          readOnly
                          className="bg-gray-50 text-slate-500"
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Extra Doc Warning */}
                {needsExtraDoc && (
                  <Card className="bg-orange-50 border-orange-100 p-6 animate-in slide-in-from-top">
                    <div className="flex items-start gap-3 mb-4">
                      <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-orange-900">추가 서류 제출 필요</h4>
                        <p className="text-sm text-orange-800 mt-1">
                          담당자명과 대표자명이 일치하지 않습니다.
                          <br />
                          재직 증빙 서류를 업로드해 주시면 승인 절차가 진행됩니다.
                        </p>
                      </div>
                    </div>

                    <div className="border-2 border-dashed border-orange-200 bg-white rounded-xl p-6 text-center hover:border-orange-400 transition cursor-pointer">
                      <FileUp className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                      <p className="font-bold text-slate-700 text-sm">
                        재직증명서 또는 사업자등록증 사본 업로드
                      </p>
                      <p className="text-xs text-slate-400 mt-1">JPG, PNG, PDF (10MB 이하)</p>
                    </div>
                  </Card>
                )}
              </div>

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
                  disabled={!showBizInfo}
                  className="bg-sky-600 hover:bg-sky-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-12 py-4 rounded-xl font-bold text-lg"
                >
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
                  onClick={() => (window.location.href = '/login')}
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
