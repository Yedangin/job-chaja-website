'use client';

import Header from '@/components/header';
import Footer from '@/components/footer';
import { useState, useEffect } from 'react';
import {
  Star, Check, ChevronRight, ChevronLeft, Shield, Zap, Eye, FileText,
  CreditCard, Sparkles, MapPin, Clock, Briefcase, Globe, Mail, Send,
  AlertTriangle, Building2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

declare global {
  interface Window {
    IMP: any;
  }
}

interface Product {
  id: string;
  productCode: string;
  boardType: string;
  tierType: string;
  nameKo: string;
  originalPrice: number;
  discountPrice: number;
  discountPercent: number;
  durationDays: number;
  features: string[] | null;
}

interface VisaType {
  id: string;
  code: string;
  nameKo: string;
  nameEn: string | null;
  category: string;
}

export default function JobCreatePage() {
  const router = useRouter();
  const [isCompanyMode, setIsCompanyMode] = useState(true);
  const [step, setStep] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [visaTypes, setVisaTypes] = useState<VisaType[]>([]);
  const [suggestedVisas, setSuggestedVisas] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null);
  const [verificationLoading, setVerificationLoading] = useState(true);

  // Form state
  const [form, setForm] = useState({
    title: '',
    description: '',
    allowedVisas: [] as string[],
    minKoreanLevel: 0,
    displayAddress: '',
    actualAddress: '',
    workIntensity: 'MIDDLE',
    benefits: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    applicationMethod: 'PLATFORM',
    externalUrl: '',
    externalEmail: '',
    interviewMethod: 'OFFLINE',
    interviewPlace: '',
    employmentSubType: 'PERMANENT',
    closingDate: '',
    // Alba
    hourlyWage: '',
    workPeriod: '',
    workDays: [true, true, true, true, true, false, false],
    workTimeStart: '09:00',
    workTimeEnd: '18:00',
    // Fulltime
    salaryMin: '',
    salaryMax: '',
    experienceLevel: 'ENTRY',
    educationLevel: 'HIGH_SCHOOL',
  });

  useEffect(() => {
    // Check corporate verification status
    fetch('/api/auth/corporate-verify', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        setVerificationStatus(data.verificationStatus || null);
      })
      .catch(() => { setVerificationStatus(null); })
      .finally(() => setVerificationLoading(false));

    fetch('/api/payment/products')
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setProducts(data); })
      .catch(() => {});

    fetch('/api/jobs/visa-types')
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setVisaTypes(data); })
      .catch(() => {});
  }, []);

  const handleSuggestVisas = async () => {
    try {
      const res = await fetch('/api/jobs/visa-suggest/for-company');
      const data = await res.json();
      if (data.allVisas) {
        // 모든 활성 비자를 추천으로 표시 (실제 규칙 엔진 결과가 있으면 그것 사용)
        setSuggestedVisas(data.allVisas.map((v: VisaType) => v.code));
      }
    } catch {}
  };

  const toggleVisa = (code: string) => {
    setForm((prev) => ({
      ...prev,
      allowedVisas: prev.allowedVisas.includes(code)
        ? prev.allowedVisas.filter((v) => v !== code)
        : [...prev.allowedVisas, code],
    }));
  };

  const boardType = selectedProduct?.boardType;

  const handleSubmitAndPay = async () => {
    if (!selectedProduct) return;
    setProcessing(true);

    try {
      // 1. 공고 생성 (DRAFT)
      const jobBody: any = {
        boardType: selectedProduct.boardType,
        tierType: selectedProduct.tierType,
        title: form.title,
        description: form.description,
        allowedVisas: form.allowedVisas.join(','),
        minKoreanLevel: form.minKoreanLevel,
        displayAddress: form.displayAddress,
        actualAddress: form.actualAddress || form.displayAddress,
        workIntensity: form.workIntensity,
        benefits: form.benefits ? form.benefits.split(',').map((b) => b.trim()) : null,
        contactName: form.contactName,
        contactPhone: form.contactPhone,
        contactEmail: form.contactEmail,
        applicationMethod: form.applicationMethod,
        externalUrl: form.applicationMethod === 'WEBSITE' ? form.externalUrl : null,
        externalEmail: form.applicationMethod === 'EMAIL' ? form.externalEmail : null,
        interviewMethod: form.interviewMethod,
        interviewPlace: form.interviewPlace,
        employmentSubType: selectedProduct.boardType === 'FULL_TIME' ? form.employmentSubType : null,
        closingDate: form.closingDate || null,
      };

      if (selectedProduct.boardType === 'PART_TIME') {
        jobBody.albaAttributes = {
          hourlyWage: parseInt(form.hourlyWage) || 0,
          workPeriod: form.workPeriod || null,
          workDaysMask: form.workDays.map((d) => (d ? '1' : '0')).join(''),
          workTimeStart: form.workTimeStart,
          workTimeEnd: form.workTimeEnd,
        };
      } else {
        jobBody.fulltimeAttributes = {
          salaryMin: parseInt(form.salaryMin) || null,
          salaryMax: parseInt(form.salaryMax) || null,
          experienceLevel: form.experienceLevel,
          educationLevel: form.educationLevel,
        };
      }

      const jobRes = await fetch('/api/jobs/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobBody),
      });
      const jobData = await jobRes.json();

      if (!jobRes.ok) {
        alert(jobData.message || '공고 생성에 실패했습니다');
        setProcessing(false);
        return;
      }

      const jobId = jobData.jobId;

      // 2. 주문 생성
      const orderRes = await fetch('/api/payment/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productCode: selectedProduct.productCode,
          jobPostingId: jobId,
        }),
      });
      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        alert(orderData.message || '주문 생성에 실패했습니다');
        setProcessing(false);
        return;
      }

      // 3. 무료 상품이면 바로 활성화
      if (orderData.isFree) {
        await fetch(`/api/jobs/${jobId}/activate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: orderData.orderId }),
        });
        alert('공고가 등록되었습니다!');
        router.push(`/jobs/${jobId}`);
        return;
      }

      // 4. 유료 상품: PortOne 결제
      const IMP = window.IMP;
      if (!IMP) {
        alert('결제 모듈을 불러올 수 없습니다. 페이지를 새로고침 해주세요.');
        setProcessing(false);
        return;
      }

      IMP.init('imp05203088');
      IMP.request_pay(
        {
          pg: 'html5_inicis',
          pay_method: 'card',
          merchant_uid: orderData.merchantUid,
          name: selectedProduct.nameKo,
          amount: orderData.paidAmount,
          buyer_name: form.contactName,
          buyer_tel: form.contactPhone,
          buyer_email: form.contactEmail || undefined,
        },
        async (rsp: any) => {
          if (rsp.success) {
            // 5. 결제 검증
            const verifyRes = await fetch(`/api/payment/orders/${orderData.orderNo}/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ impUid: rsp.imp_uid }),
            });
            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              alert('결제 완료! 공고가 게시되었습니다.');
              router.push(`/jobs/${jobId}`);
            } else {
              alert('결제 검증에 실패했습니다. 관리자에게 문의해주세요.');
            }
          } else {
            alert(`결제 실패: ${rsp.error_msg}`);
          }
          setProcessing(false);
        },
      );
    } catch (err) {
      console.error(err);
      alert('오류가 발생했습니다');
      setProcessing(false);
    }
  };

  const DAYS = ['월', '화', '수', '목', '금', '토', '일'];

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-50">
      <Header isCompanyMode={isCompanyMode} onToggleMode={() => setIsCompanyMode(!isCompanyMode)} onLogoClick={() => setIsCompanyMode(false)} />

      <main className="flex-grow w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Verification Check */}
        {!verificationLoading && verificationStatus !== 'APPROVED' && (
          <div className="bg-white rounded-2xl border-2 border-amber-200 p-8 mb-8 text-center">
            <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">기업 인증이 필요합니다</h2>
            <p className="text-sm text-gray-500 mb-6">
              {verificationStatus === 'SUBMITTED'
                ? '기업 인증 심사가 진행 중입니다. 승인이 완료되면 공고를 등록하실 수 있습니다.'
                : '공고를 등록하려면 먼저 기업 인증을 완료해야 합니다.'}
            </p>
            {verificationStatus !== 'SUBMITTED' && (
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700 transition-colors"
              >
                <Building2 className="w-5 h-5" /> 기업 인증하기
              </Link>
            )}
          </div>
        )}

        {(verificationLoading || verificationStatus === 'APPROVED') && (
        <>
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[
            { num: 1, label: '상품 선택' },
            { num: 2, label: '공고 작성' },
            { num: 3, label: '결제/게시' },
          ].map((s, i) => (
            <div key={s.num} className="flex items-center">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${step >= s.num ? 'bg-sky-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                <span className="w-6 h-6 flex items-center justify-center text-sm font-bold">{s.num}</span>
                <span className="text-sm font-medium hidden sm:inline">{s.label}</span>
              </div>
              {i < 2 && <ChevronRight className="w-5 h-5 text-gray-300 mx-2" />}
            </div>
          ))}
        </div>

        {/* Step 1: Product Selection */}
        {step === 1 && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">채용 상품을 선택하세요</h1>
            <p className="text-gray-500 text-center mb-8">프리미엄 공고는 상단 노출 + 시각적 강조로 더 많은 지원자를 확보합니다</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className={`relative rounded-2xl border-2 p-6 cursor-pointer transition-all duration-200 ${
                    selectedProduct?.id === product.id
                      ? 'border-sky-500 bg-sky-50 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-sky-300 hover:shadow-md'
                  }`}
                >
                  {product.tierType === 'PREMIUM' && (
                    <div className="absolute -top-3 left-6 px-3 py-1 bg-amber-400 text-white text-xs font-bold rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3 fill-white" />PREMIUM
                    </div>
                  )}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${product.boardType === 'PART_TIME' ? 'bg-sky-100 text-sky-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {product.boardType === 'PART_TIME' ? '알바' : '정규직'}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{product.nameKo}</h3>
                    <p className="text-xs text-gray-500">게시기간 {product.durationDays}일</p>
                  </div>

                  <div className="flex items-baseline gap-2 mb-4">
                    {product.discountPercent > 0 && product.discountPrice !== product.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">{product.originalPrice.toLocaleString()}원</span>
                    )}
                    <span className="text-2xl font-black text-sky-600">
                      {product.discountPrice === 0 ? '무료' : `${product.discountPrice.toLocaleString()}원`}
                    </span>
                    {product.discountPercent > 0 && (
                      <span className="text-sm font-bold text-red-500">{product.discountPercent}% 할인</span>
                    )}
                  </div>

                  {product.tierType === 'PREMIUM' && (
                    <ul className="text-sm text-gray-600 space-y-1.5">
                      <li className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-amber-500" />상단 프리미엄 영역 노출</li>
                      <li className="flex items-center gap-2"><Eye className="w-4 h-4 text-sky-500" />시각적 강조 카드 디자인</li>
                      <li className="flex items-center gap-2"><Zap className="w-4 h-4 text-purple-500" />더 많은 지원자 확보</li>
                    </ul>
                  )}

                  {selectedProduct?.id === product.id && (
                    <div className="absolute top-4 right-4 w-6 h-6 bg-sky-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => selectedProduct && setStep(2)}
                disabled={!selectedProduct}
                className="px-8 py-3 bg-sky-500 text-white rounded-xl font-bold hover:bg-sky-600 disabled:opacity-30 transition-colors flex items-center gap-2"
              >
                다음 단계 <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Job Form */}
        {step === 2 && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">공고 정보 입력</h1>

            {/* Basic */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <h2 className="text-lg font-bold text-gray-900">기본 정보</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">공고 제목 *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="예: 편의점 주간 알바 모집"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">상세 설명 *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="업무 내용, 우대사항, 근무 환경 등을 자세히 작성해주세요"
                  rows={8}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">마감일 (선택)</label>
                <input
                  type="date"
                  value={form.closingDate}
                  onChange={(e) => setForm({ ...form, closingDate: e.target.value })}
                  className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            {/* Visa Selection - KEY FEATURE */}
            <div className="bg-white rounded-xl border-2 border-sky-200 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-sky-500" />
                  <h2 className="text-lg font-bold text-gray-900">허용 비자 선택 (핵심)</h2>
                </div>
                <button
                  onClick={handleSuggestVisas}
                  className="px-4 py-2 bg-sky-100 text-sky-700 rounded-lg text-sm font-medium hover:bg-sky-200 transition-colors flex items-center gap-1"
                >
                  <Sparkles className="w-4 h-4" />비자 자동 추천
                </button>
              </div>
              <p className="text-sm text-gray-500">채용하고자 하는 비자를 선택하세요. 규칙 엔진이 귀사에 맞는 비자를 추천합니다.</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {visaTypes.map((visa) => {
                  const selected = form.allowedVisas.includes(visa.code);
                  const suggested = suggestedVisas.includes(visa.code);
                  return (
                    <button
                      key={visa.code}
                      onClick={() => toggleVisa(visa.code)}
                      className={`px-3 py-2 rounded-lg text-sm text-left border-2 transition-all ${
                        selected
                          ? 'border-sky-500 bg-sky-50 text-sky-700'
                          : suggested
                          ? 'border-amber-300 bg-amber-50 text-amber-700'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{visa.code}</span>
                        {selected && <Check className="w-4 h-4" />}
                        {!selected && suggested && <Star className="w-3 h-3 text-amber-500 fill-amber-500" />}
                      </div>
                      <div className="text-xs opacity-70">{visa.nameKo}</div>
                    </button>
                  );
                })}
              </div>
              {form.allowedVisas.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2 border-t">
                  <span className="text-xs text-gray-500 py-1">선택됨:</span>
                  {form.allowedVisas.map((v) => (
                    <span key={v} className="px-2 py-1 bg-sky-100 text-sky-700 text-xs rounded-full font-medium">{v}</span>
                  ))}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">최소 한국어 수준 (TOPIK)</label>
                <select
                  value={form.minKoreanLevel}
                  onChange={(e) => setForm({ ...form, minKoreanLevel: parseInt(e.target.value) })}
                  className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm"
                >
                  <option value={0}>무관</option>
                  {[1, 2, 3, 4, 5, 6].map((l) => (
                    <option key={l} value={l}>{l}급 이상</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><MapPin className="w-5 h-5 text-gray-400" />근무지 정보</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">근무지 주소 (표시용) *</label>
                <input
                  value={form.displayAddress}
                  onChange={(e) => setForm({ ...form, displayAddress: e.target.value })}
                  placeholder="예: 서울 강남구 역삼동"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">실제 주소 (상세)</label>
                <input
                  value={form.actualAddress}
                  onChange={(e) => setForm({ ...form, actualAddress: e.target.value })}
                  placeholder="예: 서울특별시 강남구 역삼로 123 1층"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">근무 강도</label>
                  <select
                    value={form.workIntensity}
                    onChange={(e) => setForm({ ...form, workIntensity: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm"
                  >
                    <option value="LOWER">낮음</option>
                    <option value="MIDDLE">보통</option>
                    <option value="UPPER">높음</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">복리후생 (쉼표 구분)</label>
                  <input
                    value={form.benefits}
                    onChange={(e) => setForm({ ...form, benefits: e.target.value })}
                    placeholder="식사제공, 교통비, 숙소"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>
            </div>

            {/* Board-specific */}
            {boardType === 'PART_TIME' ? (
              <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Clock className="w-5 h-5 text-gray-400" />알바 근무 조건</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">시급 (원) *</label>
                    <input
                      type="number"
                      value={form.hourlyWage}
                      onChange={(e) => setForm({ ...form, hourlyWage: e.target.value })}
                      placeholder="12000"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">근무기간</label>
                    <input
                      value={form.workPeriod}
                      onChange={(e) => setForm({ ...form, workPeriod: e.target.value })}
                      placeholder="3개월 이상"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">근무 요일</label>
                  <div className="flex gap-2">
                    {DAYS.map((day, i) => (
                      <button
                        key={day}
                        onClick={() => {
                          const newDays = [...form.workDays];
                          newDays[i] = !newDays[i];
                          setForm({ ...form, workDays: newDays });
                        }}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                          form.workDays[i] ? 'bg-sky-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">근무 시작</label>
                    <input
                      type="time"
                      value={form.workTimeStart}
                      onChange={(e) => setForm({ ...form, workTimeStart: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">근무 종료</label>
                    <input
                      type="time"
                      value={form.workTimeEnd}
                      onChange={(e) => setForm({ ...form, workTimeEnd: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Briefcase className="w-5 h-5 text-gray-400" />정규직 근무 조건</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">고용 형태</label>
                  <select
                    value={form.employmentSubType}
                    onChange={(e) => setForm({ ...form, employmentSubType: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm"
                  >
                    <option value="PERMANENT">정규직</option>
                    <option value="CONTRACT">계약직</option>
                    <option value="INTERNSHIP">인턴십</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">최소 연봉 (만원)</label>
                    <input
                      type="number"
                      value={form.salaryMin}
                      onChange={(e) => setForm({ ...form, salaryMin: e.target.value })}
                      placeholder="3000"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">최대 연봉 (만원)</label>
                    <input
                      type="number"
                      value={form.salaryMax}
                      onChange={(e) => setForm({ ...form, salaryMax: e.target.value })}
                      placeholder="5000"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">경력 요건</label>
                    <select
                      value={form.experienceLevel}
                      onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm"
                    >
                      <option value="ENTRY">신입</option>
                      <option value="JUNIOR">1~3년</option>
                      <option value="MID">3~5년</option>
                      <option value="SENIOR">5년 이상</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">학력 요건</label>
                    <select
                      value={form.educationLevel}
                      onChange={(e) => setForm({ ...form, educationLevel: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm"
                    >
                      <option value="HIGH_SCHOOL">고졸</option>
                      <option value="BACHELOR">학사</option>
                      <option value="MASTER">석사</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Application Method */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <h2 className="text-lg font-bold text-gray-900">지원 방식</h2>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'PLATFORM', label: '플랫폼 지원', icon: Send, desc: '이력서 직접 제출' },
                  { value: 'WEBSITE', label: '홈페이지 지원', icon: Globe, desc: '외부 사이트 연결' },
                  { value: 'EMAIL', label: '이메일 지원', icon: Mail, desc: '이메일 안내' },
                ].map((method) => (
                  <button
                    key={method.value}
                    onClick={() => setForm({ ...form, applicationMethod: method.value })}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      form.applicationMethod === method.value
                        ? 'border-sky-500 bg-sky-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <method.icon className={`w-6 h-6 mx-auto mb-2 ${form.applicationMethod === method.value ? 'text-sky-500' : 'text-gray-400'}`} />
                    <p className="text-sm font-medium">{method.label}</p>
                    <p className="text-xs text-gray-400">{method.desc}</p>
                  </button>
                ))}
              </div>
              {form.applicationMethod === 'WEBSITE' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">외부 지원 URL *</label>
                  <input
                    value={form.externalUrl}
                    onChange={(e) => setForm({ ...form, externalUrl: e.target.value })}
                    placeholder="https://careers.example.com/apply"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              )}
              {form.applicationMethod === 'EMAIL' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">지원 이메일 *</label>
                  <input
                    type="email"
                    value={form.externalEmail}
                    onChange={(e) => setForm({ ...form, externalEmail: e.target.value })}
                    placeholder="hr@example.com"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              )}
            </div>

            {/* Contact & Interview */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <h2 className="text-lg font-bold text-gray-900">담당자 정보</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">담당자명 *</label>
                  <input
                    value={form.contactName}
                    onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">연락처 *</label>
                  <input
                    value={form.contactPhone}
                    onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                    placeholder="010-0000-0000"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                  <input
                    type="email"
                    value={form.contactEmail}
                    onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">면접 방식</label>
                  <select
                    value={form.interviewMethod}
                    onChange={(e) => setForm({ ...form, interviewMethod: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm"
                  >
                    <option value="OFFLINE">오프라인</option>
                    <option value="ONLINE">온라인</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 flex items-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" />이전
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!form.title || !form.displayAddress || !form.contactName || !form.contactPhone || form.allowedVisas.length === 0}
                className="px-8 py-3 bg-sky-500 text-white rounded-xl font-bold hover:bg-sky-600 disabled:opacity-30 transition-colors flex items-center gap-2"
              >
                미리보기 & 결제 <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Preview & Payment */}
        {step === 3 && selectedProduct && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">공고 미리보기 & 결제</h1>

            {/* Preview Card */}
            <div className={`bg-white rounded-xl border-2 ${selectedProduct.tierType === 'PREMIUM' ? 'border-amber-200' : 'border-gray-200'} p-6`}>
              {selectedProduct.tierType === 'PREMIUM' && (
                <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full mb-3">PREMIUM</span>
              )}
              <h2 className="text-xl font-bold text-gray-900 mb-1">{form.title}</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {form.allowedVisas.map((v) => (
                  <span key={v} className="px-2 py-1 bg-sky-100 text-sky-700 text-xs rounded-full">{v}</span>
                ))}
              </div>
              <div className="text-sm text-gray-500 space-y-1">
                <p><MapPin className="w-3.5 h-3.5 inline mr-1" />{form.displayAddress}</p>
                {boardType === 'PART_TIME' && form.hourlyWage && (
                  <p><Clock className="w-3.5 h-3.5 inline mr-1" />시급 {parseInt(form.hourlyWage).toLocaleString()}원</p>
                )}
                {boardType === 'FULL_TIME' && (form.salaryMin || form.salaryMax) && (
                  <p><Briefcase className="w-3.5 h-3.5 inline mr-1" />연봉 {form.salaryMin || '?'}~{form.salaryMax || '?'}만원</p>
                )}
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-gray-400" />결제 정보
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">상품</span>
                  <span className="font-medium">{selectedProduct.nameKo}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">정가</span>
                  <span className="text-gray-400 line-through">{selectedProduct.originalPrice.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">할인 ({selectedProduct.discountPercent}%)</span>
                  <span className="text-red-500">-{(selectedProduct.originalPrice - selectedProduct.discountPrice).toLocaleString()}원</span>
                </div>
                <div className="flex justify-between py-3 border-t-2 border-gray-900 text-lg">
                  <span className="font-bold">결제 금액</span>
                  <span className="font-black text-sky-600">
                    {selectedProduct.discountPrice === 0 ? '무료' : `${selectedProduct.discountPrice.toLocaleString()}원`}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 flex items-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" />수정하기
              </button>
              <button
                onClick={handleSubmitAndPay}
                disabled={processing}
                className="px-10 py-3 bg-sky-500 text-white rounded-xl font-bold hover:bg-sky-600 disabled:opacity-50 transition-colors flex items-center gap-2 text-lg"
              >
                {processing ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                ) : selectedProduct.discountPrice === 0 ? (
                  <>
                    <FileText className="w-5 h-5" />무료 게시하기
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />{selectedProduct.discountPrice.toLocaleString()}원 결제하기
                  </>
                )}
              </button>
            </div>
          </div>
        )}
        </>
        )}
      </main>

      <Footer />
    </div>
  );
}
