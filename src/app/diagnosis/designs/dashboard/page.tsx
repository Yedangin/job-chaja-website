'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, TrendingUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { mockPathways, type DiagnosisInput } from '@/app/diagnosis/designs/_mock/diagnosis-mock-data';

// 비자 진단 대시보드 입력 페이지 / Dashboard-style visa diagnosis input page
export default function DashboardDiagnosisPage() {
  const router = useRouter();

  // 입력 상태 / Input state
  const [input, setInput] = useState<DiagnosisInput>({
    nationality: '',
    age: 25,
    education: 'BACHELOR',
    annualFund: 30000000,
    goal: 'PERMANENT_RESIDENCE',
    priority: 'SPEED',
  });

  // 실시간 매칭 카운터 / Live matching counter
  const [matchCount, setMatchCount] = useState(0);

  // 입력 변경 시 매칭 가능한 경로 수 계산 / Calculate matching pathways on input change
  useEffect(() => {
    // 간단한 필터링 로직 (실제로는 백엔드 API 호출)
    // Simple filtering logic (in reality, would call backend API)
    let count = mockPathways.length;

    if (input.age < 30) count = Math.max(count - 1, 1);
    if (input.annualFund < 20000000) count = Math.max(count - 2, 1);
    if (input.education === 'HIGH_SCHOOL') count = Math.max(count - 1, 1);

    setMatchCount(count);
  }, [input]);

  // 분석 제출 / Submit analysis
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // sessionStorage에 입력 데이터 저장 / Save input data to sessionStorage
    sessionStorage.setItem('diagnosisInput', JSON.stringify(input));

    // 결과 페이지로 이동 / Navigate to result page
    router.push('/diagnosis/designs/dashboard/result');
  };

  // 최고 점수 경로 미리보기 / Top scoring pathway preview
  const topPathway = mockPathways[0];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 / Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            비자 경로 진단 / Visa Pathway Diagnosis
          </h1>
          <p className="text-gray-600">
            정보를 입력하시면 실시간으로 매칭 가능한 경로를 확인할 수 있습니다.
          </p>
        </div>

        {/* 데스크톱: 2컬럼 레이아웃 / Desktop: 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 왼쪽: 입력 폼 / Left: Input form */}
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 1. 국적 선택 / Country selector */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold">
                      1
                    </span>
                    국적 / Nationality
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    value={input.nationality}
                    onValueChange={(value) =>
                      setInput({ ...input, nationality: value })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="국적을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="KR">🇰🇷 대한민국 / South Korea</SelectItem>
                      <SelectItem value="US">🇺🇸 미국 / United States</SelectItem>
                      <SelectItem value="CN">🇨🇳 중국 / China</SelectItem>
                      <SelectItem value="JP">🇯🇵 일본 / Japan</SelectItem>
                      <SelectItem value="VN">🇻🇳 베트남 / Vietnam</SelectItem>
                      <SelectItem value="PH">🇵🇭 필리핀 / Philippines</SelectItem>
                      <SelectItem value="TH">🇹🇭 태국 / Thailand</SelectItem>
                      <SelectItem value="OTHER">🌏 기타 / Other</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* 2. 나이 / Age */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold">
                      2
                    </span>
                    나이 / Age
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Input
                      type="number"
                      min="18"
                      max="65"
                      value={input.age}
                      onChange={(e) =>
                        setInput({ ...input, age: parseInt(e.target.value) || 18 })
                      }
                      className="w-24"
                    />
                    <span className="text-gray-600">세 / years old</span>
                  </div>
                </CardContent>
              </Card>

              {/* 3. 학력 / Education */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold">
                      3
                    </span>
                    최종 학력 / Education Level
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={input.education}
                    onValueChange={(value) =>
                      setInput({
                        ...input,
                        education: value as DiagnosisInput['education'],
                      })
                    }
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="HIGH_SCHOOL" id="high-school" />
                      <Label htmlFor="high-school" className="cursor-pointer">
                        고등학교 졸업 / High School
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="BACHELOR" id="bachelor" />
                      <Label htmlFor="bachelor" className="cursor-pointer">
                        학사 / Bachelor's Degree
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="MASTER" id="master" />
                      <Label htmlFor="master" className="cursor-pointer">
                        석사 / Master's Degree
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="DOCTORATE" id="doctorate" />
                      <Label htmlFor="doctorate" className="cursor-pointer">
                        박사 / Doctorate
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* 4. 연간 자금 / Annual fund */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold">
                      4
                    </span>
                    연간 가용 자금 / Annual Fund
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-2xl font-bold text-blue-600">
                    ₩{input.annualFund.toLocaleString()}
                  </div>
                  <Slider
                    value={[input.annualFund]}
                    onValueChange={([value]) =>
                      setInput({ ...input, annualFund: value })
                    }
                    min={5000000}
                    max={100000000}
                    step={5000000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>₩5M</span>
                    <span>₩50M</span>
                    <span>₩100M</span>
                  </div>
                </CardContent>
              </Card>

              {/* 5. 목표 / Goal */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold">
                      5
                    </span>
                    목표 / Goal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { value: 'PERMANENT_RESIDENCE', label: '영주권', subLabel: 'Permanent Residence' },
                      { value: 'CITIZENSHIP', label: '시민권', subLabel: 'Citizenship' },
                      { value: 'WORK', label: '취업', subLabel: 'Work' },
                      { value: 'STUDY', label: '유학', subLabel: 'Study' },
                    ].map((goal) => (
                      <button
                        key={goal.value}
                        type="button"
                        onClick={() =>
                          setInput({
                            ...input,
                            goal: goal.value as DiagnosisInput['goal'],
                          })
                        }
                        className={cn(
                          'p-4 rounded-lg border-2 transition-all text-left',
                          input.goal === goal.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        )}
                      >
                        <div className="font-semibold text-gray-900">{goal.label}</div>
                        <div className="text-sm text-gray-600">{goal.subLabel}</div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 6. 우선순위 / Priority */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold">
                      6
                    </span>
                    우선순위 / Priority
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { value: 'SPEED', label: '빠른 속도', subLabel: 'Speed' },
                      { value: 'COST', label: '낮은 비용', subLabel: 'Low Cost' },
                      { value: 'STABILITY', label: '안정성', subLabel: 'Stability' },
                      { value: 'INCOME', label: '수입 잠재력', subLabel: 'Income Potential' },
                    ].map((priority) => (
                      <button
                        key={priority.value}
                        type="button"
                        onClick={() =>
                          setInput({
                            ...input,
                            priority: priority.value as DiagnosisInput['priority'],
                          })
                        }
                        className={cn(
                          'p-4 rounded-lg border-2 transition-all text-left',
                          input.priority === priority.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        )}
                      >
                        <div className="font-semibold text-gray-900">{priority.label}</div>
                        <div className="text-sm text-gray-600">{priority.subLabel}</div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 제출 버튼 (모바일에서만 표시) / Submit button (mobile only) */}
              <div className="lg:hidden">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={!input.nationality}
                >
                  분석하기 / Analyze
                </Button>
              </div>
            </form>
          </div>

          {/* 오른쪽: 실시간 미리보기 / Right: Live preview */}
          <div className="lg:sticky lg:top-8 h-fit space-y-6">
            {/* 매칭 카운터 / Match counter */}
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">
                      현재 매칭 가능 경로 / Available Pathways
                    </div>
                    <div className="text-4xl font-bold text-blue-600">
                      {matchCount}개
                    </div>
                  </div>
                  <TrendingUp className="w-12 h-12 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            {/* 최고 점수 경로 미리보기 / Top pathway preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  추천 경로 미리보기 / Top Pathway Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-xl font-bold text-gray-900 mb-2">
                    {topPathway.nameKo}
                  </div>
                  <div className="text-sm text-gray-600">{topPathway.nameEn}</div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">기간 / Duration</div>
                    <div className="text-lg font-semibold">
                      {topPathway.estimatedMonths}개월
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">비용 / Cost</div>
                    <div className="text-lg font-semibold">
                      ₩{(topPathway.estimatedCostKRW / 10000).toFixed(0)}만
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">점수 / Score</div>
                    <div className="text-lg font-semibold text-blue-600">
                      {topPathway.score}
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <div className="text-xs text-gray-500 mb-2">
                    비자 경로 / Visa Chain
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {topPathway.visaChain.map((visa, idx) => (
                      <React.Fragment key={idx}>
                        <span className="px-2 py-1 bg-gray-100 rounded">
                          {typeof visa === 'string' ? visa : visa.code}
                        </span>
                        {idx < topPathway.visaChain.length - 1 && (
                          <ChevronDown className="w-4 h-4 text-gray-400 rotate-[-90deg]" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 제출 버튼 (데스크톱에서만 표시) / Submit button (desktop only) */}
            <div className="hidden lg:block">
              <Button
                type="submit"
                size="lg"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={!input.nationality}
                onClick={handleSubmit}
              >
                분석하기 / Analyze
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
