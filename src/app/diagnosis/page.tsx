'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plane, MapPin, User, GraduationCap, Wallet, Target, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import {
  popularCountries,
  educationOptions,
  fundOptions,
  goalOptions,
  priorityOptions,
} from './designs/_mock/diagnosis-mock-data';

// 비자 진단 입력 페이지 (여정 스타일) / Visa diagnosis input page (journey style)
export default function DiagnosisPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDeparting, setIsDeparting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    country: '',
    age: '',
    education: '',
    fund: '',
    goal: '',
    priority: '',
  });

  const totalSteps = 6;

  // 진단 실행 (API 호출) / Run diagnosis (API call)
  const submitDiagnosis = async () => {
    setIsSubmitting(true);
    setIsDeparting(true);

    const fundOption = fundOptions.find((f) => f.value.toString() === formData.fund);

    // 백엔드 DTO에 맞게 변환 / Convert to backend DTO format
    const requestBody = {
      nationality: formData.country,
      age: parseInt(formData.age),
      educationLevel: formData.education,
      availableAnnualFund: fundOption?.value ?? 0,
      finalGoal: formData.goal,
      priorityPreference: formData.priority,
    };

    // 입력 데이터를 sessionStorage에 저장 / Save input data to sessionStorage
    sessionStorage.setItem('diagnosis-input', JSON.stringify(requestBody));

    // 결과 페이지로 이동 (결과 페이지에서 API 호출) / Navigate to result page (API called there)
    setTimeout(() => {
      router.push('/diagnosis/result');
    }, 1500);
  };

  // 다음 단계로 / Next step
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsTransitioning(false);
      }, 300);
    } else {
      submitDiagnosis();
    }
  };

  // 입력값 업데이트 / Update form value
  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  // 현재 단계가 완료되었는지 확인 / Check if current step is complete
  const isStepComplete = () => {
    switch (currentStep) {
      case 1: return !!formData.country;
      case 2: return !!formData.age && parseInt(formData.age) > 0;
      case 3: return !!formData.education;
      case 4: return !!formData.fund;
      case 5: return !!formData.goal;
      case 6: return !!formData.priority;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-blue-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-blue-600 mb-4">
            <Plane className="w-8 h-8" />
            <h1 className="text-3xl font-bold">한국 비자 여정</h1>
          </div>
          <p className="text-gray-600">탑승권을 작성하여 당신만의 한국 비자 여정을 시작하세요</p>
        </div>

        {/* 출발 애니메이션 / Departure animation */}
        {isDeparting && (
          <div className="fixed inset-0 bg-sky-100 z-50 flex items-center justify-center">
            <div className="text-center animate-[fly_1.5s_ease-in-out]">
              <Plane className="w-24 h-24 text-orange-500 mx-auto mb-4" />
              <p className="text-2xl font-bold text-blue-900">탑승 준비 완료!</p>
              <p className="text-gray-600">한국으로 출발합니다...</p>
            </div>
          </div>
        )}

        {/* 보딩 패스 카드 / Boarding pass card */}
        <Card className="relative border-2 border-dashed border-blue-400 bg-white shadow-xl overflow-hidden">
          {/* 보딩 패스 헤더 / Boarding pass header */}
          <div className="bg-gradient-to-r from-blue-500 to-sky-400 text-white p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs opacity-80">BOARDING PASS</p>
                <p className="text-2xl font-bold">JOBCHAJA</p>
              </div>
              <div className="text-right">
                <p className="text-xs opacity-80">VISA JOURNEY</p>
                <p className="text-lg font-semibold">STEP {currentStep}/{totalSteps}</p>
              </div>
            </div>
          </div>

          {/* 보딩 패스 정보 미리보기 / Boarding pass preview */}
          <div className="p-6 border-b-2 border-dashed border-gray-200">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">FROM</p>
                <p className="font-semibold text-lg">
                  {formData.country
                    ? (popularCountries.find((c) => c.code === formData.country)?.flag ?? '') +
                      ' ' +
                      (popularCountries.find((c) => c.code === formData.country)?.nameKo ?? '')
                    : '___________'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">TO</p>
                <p className="font-semibold text-lg">&#x1F1F0;&#x1F1F7; KOREA</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-xs text-gray-500">PASSENGER</p>
                <p className="font-medium">{formData.age ? formData.age + '세' : '___'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">CLASS</p>
                <p className="font-medium">
                  {formData.education
                    ? educationOptions.find((e) => e.value === formData.education)?.labelKo.split(' ')[0]
                    : '___'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">BAGGAGE</p>
                <p className="font-medium">
                  {formData.fund
                    ? fundOptions.find((f) => f.value.toString() === formData.fund)?.labelKo.split(' ')[0]
                    : '___'}
                </p>
              </div>
            </div>

            {/* 바코드 장식 / Barcode decoration */}
            <div className="mt-4 flex gap-[2px] h-12 opacity-30">
              {Array.from({ length: 20 }, (_, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gray-800"
                  style={{ opacity: 0.5 + (i % 3) * 0.2 }}
                />
              ))}
            </div>
          </div>

          {/* 입력 폼 (단계별) / Input form (step by step) */}
          <div className="p-6">
            <div
              className={`transition-all duration-300 ${
                isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
              }`}
            >
              {/* Step 1: 출발 국가 / From country */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-blue-600 mb-4">
                    <MapPin className="w-5 h-5" />
                    <h3 className="font-semibold text-lg">출발지를 선택하세요</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-80 overflow-y-auto">
                    {popularCountries.map((country) => (
                      <button
                        key={country.code}
                        onClick={() => updateField('country', country.code)}
                        className={`p-3 border-2 rounded-lg text-left transition-all ${
                          formData.country === country.code
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <span className="text-2xl mb-1 block">{country.flag}</span>
                        <span className="text-sm font-medium">{country.nameKo}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: 나이 / Age */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-blue-600 mb-4">
                    <User className="w-5 h-5" />
                    <h3 className="font-semibold text-lg">탑승객 나이</h3>
                  </div>
                  <div>
                    <Label htmlFor="age">만 나이를 입력하세요</Label>
                    <Input
                      id="age"
                      type="number"
                      min="15"
                      max="70"
                      value={formData.age}
                      onChange={(e) => updateField('age', e.target.value)}
                      placeholder="예: 25"
                      className="text-lg h-14"
                    />
                    <p className="text-sm text-gray-500 mt-2">대부분의 비자는 만 18세 이상부터 신청 가능합니다</p>
                  </div>
                </div>
              )}

              {/* Step 3: 학력 / Education */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-blue-600 mb-4">
                    <GraduationCap className="w-5 h-5" />
                    <h3 className="font-semibold text-lg">좌석 등급 (학력)</h3>
                  </div>
                  <div>
                    <Label htmlFor="education">최종 학력을 선택하세요</Label>
                    <Select value={formData.education} onValueChange={(value) => updateField('education', value)}>
                      <SelectTrigger id="education" className="h-14 text-lg">
                        <SelectValue placeholder="학력 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {educationOptions.map((edu) => (
                          <SelectItem key={edu.value} value={edu.value} className="text-lg">
                            {edu.labelKo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Step 4: 자금 / Fund */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-blue-600 mb-4">
                    <Wallet className="w-5 h-5" />
                    <h3 className="font-semibold text-lg">수하물 수당 (준비 자금)</h3>
                  </div>
                  <div className="space-y-3">
                    {fundOptions.map((fund) => (
                      <button
                        key={fund.value}
                        onClick={() => updateField('fund', fund.value.toString())}
                        className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                          formData.fund === fund.value.toString()
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="font-semibold">{fund.labelKo}</div>
                        <div className="text-sm text-gray-500">{fund.bracket}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 5: 목표 / Goal */}
              {currentStep === 5 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-blue-600 mb-4">
                    <Target className="w-5 h-5" />
                    <h3 className="font-semibold text-lg">여행 목적</h3>
                  </div>
                  <div className="space-y-3">
                    {goalOptions.map((goal) => (
                      <button
                        key={goal.value}
                        onClick={() => updateField('goal', goal.value)}
                        className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                          formData.goal === goal.value
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl">{goal.emoji}</span>
                          <span className="font-semibold">{goal.labelKo}</span>
                        </div>
                        <div className="text-sm text-gray-500">{goal.descKo}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 6: 우선순위 / Priority */}
              {currentStep === 6 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-blue-600 mb-4">
                    <Heart className="w-5 h-5" />
                    <h3 className="font-semibold text-lg">좌석 선호도</h3>
                  </div>
                  <div className="space-y-3">
                    {priorityOptions.map((priority) => (
                      <button
                        key={priority.value}
                        onClick={() => updateField('priority', priority.value)}
                        className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                          formData.priority === priority.value
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl">{priority.emoji}</span>
                          <span className="font-semibold">{priority.labelKo}</span>
                        </div>
                        <div className="text-sm text-gray-500">{priority.descKo}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 다음 버튼 / Next button */}
            <div className="flex gap-3 mt-6">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="flex-1"
                >
                  이전
                </Button>
              )}
              <Button
                onClick={handleNext}
                disabled={!isStepComplete() || isSubmitting}
                className="flex-1 bg-gradient-to-r from-blue-500 to-sky-400 hover:from-blue-600 hover:to-sky-500"
              >
                {currentStep === totalSteps ? '출발하기' : '다음'}
              </Button>
            </div>
          </div>
        </Card>

        {/* 진행 표시기 / Progress indicator */}
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i + 1 === currentStep
                  ? 'w-8 bg-blue-500'
                  : i + 1 < currentStep
                    ? 'w-2 bg-blue-400'
                    : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

    </div>
  );
}
