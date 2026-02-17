'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ChevronDown, ChevronUp, Globe, FileText, Clock, DollarSign,
  Building2, Users, ArrowRight, Search, Loader2, CheckCircle2,
  Briefcase, GraduationCap, MapPin, Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

/** 비자 가이드 정보 / Visa guide info */
interface VisaGuideItem {
  code: string;
  nameKo: string;
  description: string;
  employmentLevel: string;
  hireableSectors: string;
  companyRequirements: string;
  documents: string[];
  processingTime: string;
  cost: string;
  quotaLimit: string;
}

// 주요 비자 가이드 데이터 / Major visa guide data
const VISA_GUIDE_DATA: VisaGuideItem[] = [
  {
    code: 'E-7', nameKo: '특정활동', description: '전문인력 채용 (IT, 기계, 건축, 요리 등)',
    employmentLevel: '조건부 취업', hireableSectors: 'IT, 제조, 건설, 전문서비스, 요식업',
    companyRequirements: '사업자등록 필수, 매출 실적 있는 법인/개인사업자',
    documents: ['고용계약서', '학위증명서/경력증명서', '사업자등록증 사본', '자격증 사본 (해당시)', '납세증명서'],
    processingTime: '2~4주', cost: '13만원 (수수료)', quotaLimit: '업종별 허용 비율 제한',
  },
  {
    code: 'E-9', nameKo: '비전문취업', description: 'EPS 고용허가제를 통한 비전문 인력 채용',
    employmentLevel: '제한 취업', hireableSectors: '제조업, 건설업, 농축산업, 어업, 서비스업 (5개 업종)',
    companyRequirements: '내국인 구인 노력 14일 이상, 고용보험 가입 사업장',
    documents: ['표준근로계약서', '건강진단서', '기능시험합격증', '한국어시험성적 (EPS-TOPIK)', '고용허가서'],
    processingTime: '3~6개월 (EPS 절차 포함)', cost: '약 100만원 (입국 비용 포함)', quotaLimit: '업종별 쿼터 제한, 외국인 비율 20% 이내',
  },
  {
    code: 'H-2', nameKo: '방문취업', description: '중국/CIS 동포의 단순노무 취업',
    employmentLevel: '제한 취업', hireableSectors: '제조업, 건설업, 서비스업, 농축산업 등 40개 업종',
    companyRequirements: '특별한 규모 제한 없음, 고용보험 가입',
    documents: ['재외동포증명서', '건강진단서', '근로계약서', '취업인증확인서'],
    processingTime: '1~2주 (국내 전환시)', cost: '약 10~20만원', quotaLimit: '업종별 허용 제한',
  },
  {
    code: 'F-2', nameKo: '거주', description: '점수제 거주비자 (F-2-7), 자유 취업 가능',
    employmentLevel: '자유 취업', hireableSectors: '업종 제한 없음',
    companyRequirements: '특별한 제한 없음',
    documents: ['점수산정표', '소득증빙', '학위증빙', 'TOPIK 성적표', '사회통합프로그램 이수증'],
    processingTime: '2~4주', cost: '23만원', quotaLimit: '없음 (점수 80점 이상 필요)',
  },
  {
    code: 'F-4', nameKo: '재외동포', description: '해외 동포의 자유활동 (전문직)',
    employmentLevel: '자유 취업 (단순노무 제한)', hireableSectors: '전문직, 사무직, 기술직 (단순노무 불가)',
    companyRequirements: '특별한 제한 없음',
    documents: ['재외동포증명서', '여권사본', '가족관계증명서', '최종학력증명서'],
    processingTime: '2~3주', cost: '6만원', quotaLimit: '없음 (단순노무 제외)',
  },
  {
    code: 'F-5', nameKo: '영주', description: '영주권 소지자, 완전한 취업 자유',
    employmentLevel: '자유 취업', hireableSectors: '업종 제한 없음',
    companyRequirements: '특별한 제한 없음',
    documents: ['영주증 사본'],
    processingTime: '즉시 (영주증 소지)', cost: '없음 (이미 발급)', quotaLimit: '없음',
  },
  {
    code: 'F-6', nameKo: '결혼이민', description: '결혼이민자, 자유 취업 가능',
    employmentLevel: '자유 취업', hireableSectors: '업종 제한 없음',
    companyRequirements: '특별한 제한 없음',
    documents: ['결혼이민비자 사본', '혼인관계증명서'],
    processingTime: '즉시 (비자 소지)', cost: '없음', quotaLimit: '없음',
  },
];

// 비교 테이블 행 / Comparison table rows
const COMPARE_ROWS = [
  { key: 'hireableSectors', label: '채용 가능 업종' },
  { key: 'companyRequirements', label: '기업규모 요건' },
  { key: 'quotaLimit', label: '쿼터 제한' },
  { key: 'processingTime', label: '처리기간' },
  { key: 'cost', label: '비용' },
];

/**
 * 비자 가이드 페이지 / Visa guide page
 * 1. 비자 유형 카드 그리드 (프로그레시브 디스클로저)
 * 2. 비자 비교 테이블
 * 3. 비자 결정 위자드 (간이 시뮬레이션)
 */
export default function CompanyVisaGuidePage() {
  const [expandedVisa, setExpandedVisa] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'guide' | 'compare' | 'wizard'>('guide');

  // 위자드 상태 / Wizard state
  const [wizNationality, setWizNationality] = useState('');
  const [wizEducation, setWizEducation] = useState('');
  const [wizExperience, setWizExperience] = useState('');
  const [wizJobCategory, setWizJobCategory] = useState('');
  const [wizResult, setWizResult] = useState<string[] | null>(null);
  const [wizLoading, setWizLoading] = useState(false);

  // 간이 시뮬레이션 / Simple simulation
  const runSimulation = () => {
    setWizLoading(true);
    setTimeout(() => {
      const results: string[] = [];
      // 간이 로직 / Simple matching logic
      if (['베트남', '필리핀', '태국', '인도네시아', '캄보디아', '미얀마', '네팔', '우즈베키스탄', '몽골', '스리랑카', '방글라데시'].includes(wizNationality)) {
        results.push('E-9');
      }
      if (['중국', '러시아', '우즈베키스탄', '카자흐스탄'].includes(wizNationality)) {
        results.push('H-2');
      }
      if (['대졸', '석사', '박사'].includes(wizEducation) || parseInt(wizExperience) >= 3) {
        results.push('E-7');
      }
      if (['IT/소프트웨어', '사무/행정', '교육/강사'].includes(wizJobCategory) && ['대졸', '석사', '박사'].includes(wizEducation)) {
        results.push('E-7');
      }
      // 항상 F계열 추천 / Always suggest F-series if applicable
      results.push('F-2');
      setWizResult([...new Set(results)]);
      setWizLoading(false);
    }, 1000);
  };

  const sectionTabs = [
    { key: 'guide' as const, label: '비자 유형 가이드' },
    { key: 'compare' as const, label: '비자 비교' },
    { key: 'wizard' as const, label: '비자 추천' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold text-gray-900 mb-2">비자 가이드</h1>
      <p className="text-sm text-gray-500 mb-6">외국인 채용에 필요한 비자 정보를 한눈에 확인하세요.</p>

      {/* 섹션 탭 / Section tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-200">
        {sectionTabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveSection(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition ${
              activeSection === tab.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ═══ 1. 비자 유형 가이드 / Visa type guide ═══ */}
      {activeSection === 'guide' && (
        <div className="space-y-3">
          {VISA_GUIDE_DATA.map(visa => (
            <div key={visa.code} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <button
                type="button"
                onClick={() => setExpandedVisa(expandedVisa === visa.code ? null : visa.code)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                    <Globe className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{visa.code}</span>
                      <span className="text-sm text-gray-700">{visa.nameKo}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        visa.employmentLevel === '자유 취업' ? 'bg-green-100 text-green-700' :
                        visa.employmentLevel.includes('제한') ? 'bg-amber-100 text-amber-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {visa.employmentLevel}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{visa.description}</p>
                  </div>
                </div>
                {expandedVisa === visa.code ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>

              {/* 확장 상세 / Expanded details */}
              {expandedVisa === visa.code && (
                <div className="border-t border-gray-100 p-5 bg-gray-50/50 space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm font-bold text-blue-800 mb-1">이 비자 보유자를 채용하려면?</p>
                    <p className="text-xs text-blue-700">{visa.companyRequirements}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> 채용 가능 업종</h4>
                      <p className="text-xs text-gray-600">{visa.hireableSectors}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1"><Users className="w-3.5 h-3.5" /> 쿼터 제한</h4>
                      <p className="text-xs text-gray-600">{visa.quotaLimit}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> 필요 서류</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {visa.documents.map(doc => (
                        <span key={doc} className="text-xs bg-white border border-gray-200 px-2 py-1 rounded-md">{doc}</span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-500" />
                      <span className="text-xs text-gray-600">처리기간: <span className="font-medium">{visa.processingTime}</span></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-gray-500" />
                      <span className="text-xs text-gray-600">비용: <span className="font-medium">{visa.cost}</span></span>
                    </div>
                  </div>

                  <Link href="/company/payments"
                    className="inline-flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:text-blue-700">
                    행정대행 의뢰하기 <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ═══ 2. 비자 비교 테이블 / Visa comparison table ═══ */}
      {activeSection === 'compare' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left p-3 font-bold text-gray-700 sticky left-0 bg-gray-50 min-w-[100px]">항목</th>
                {VISA_GUIDE_DATA.map(v => (
                  <th key={v.code} className="text-center p-3 font-bold text-gray-900 min-w-[120px]">
                    <div>{v.code}</div>
                    <div className="text-gray-500 font-normal">{v.nameKo}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="p-3 font-medium text-gray-700 sticky left-0 bg-white">취업 수준</td>
                {VISA_GUIDE_DATA.map(v => (
                  <td key={v.code} className="p-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      v.employmentLevel === '자유 취업' ? 'bg-green-100 text-green-700' :
                      v.employmentLevel.includes('제한') ? 'bg-amber-100 text-amber-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>{v.employmentLevel}</span>
                  </td>
                ))}
              </tr>
              {COMPARE_ROWS.map(row => (
                <tr key={row.key} className="border-b border-gray-100">
                  <td className="p-3 font-medium text-gray-700 sticky left-0 bg-white">{row.label}</td>
                  {VISA_GUIDE_DATA.map(v => (
                    <td key={v.code} className="p-3 text-gray-600 text-center">
                      {(v as Record<string, unknown>)[row.key] as string}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="border-b border-gray-100">
                <td className="p-3 font-medium text-gray-700 sticky left-0 bg-white">필요 서류 수</td>
                {VISA_GUIDE_DATA.map(v => (
                  <td key={v.code} className="p-3 text-center font-medium text-gray-900">{v.documents.length}건</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* ═══ 3. 비자 결정 위자드 / Visa decision wizard ═══ */}
      {activeSection === 'wizard' && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="w-7 h-7 text-blue-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">어떤 외국인을 채용하시나요?</h2>
              <p className="text-sm text-gray-500 mt-1">간단한 정보를 입력하면 적합한 비자를 추천해드립니다.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">국적</label>
                <select value={wizNationality} onChange={e => setWizNationality(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  <option value="">선택하세요</option>
                  {['베트남', '필리핀', '태국', '인도네시아', '중국', '캄보디아', '미얀마', '네팔',
                    '우즈베키스탄', '몽골', '방글라데시', '스리랑카', '러시아', '카자흐스탄', '미국', '일본', '기타'].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">학력</label>
                <select value={wizEducation} onChange={e => setWizEducation(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  <option value="">선택하세요</option>
                  <option value="고졸">고졸</option>
                  <option value="초대졸">초대졸 (전문대)</option>
                  <option value="대졸">대졸</option>
                  <option value="석사">석사</option>
                  <option value="박사">박사</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">경력 (년)</label>
                <Input type="number" value={wizExperience} onChange={e => setWizExperience(e.target.value)}
                  placeholder="예: 3" min="0" max="30" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">직종</label>
                <select value={wizJobCategory} onChange={e => setWizJobCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  <option value="">선택하세요</option>
                  {['제조/생산', '건설/토목', '음식/서비스', '농업/축산', '어업/수산',
                    'IT/소프트웨어', '사무/행정', '판매/유통', '교육/강사', '운송/물류'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <Button onClick={runSimulation} disabled={!wizNationality || wizLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2">
                {wizLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                추천 비자 확인
              </Button>
            </div>

            {/* 추천 결과 / Recommendation results */}
            {wizResult && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" /> 추천 비자 유형
                </h3>
                <div className="space-y-2 mb-4">
                  {wizResult.map(code => {
                    const visa = VISA_GUIDE_DATA.find(v => v.code === code);
                    if (!visa) return null;
                    return (
                      <div key={code} className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <span className="w-2.5 h-2.5 bg-green-500 rounded-full shrink-0" />
                        <div>
                          <span className="font-bold text-gray-900 text-sm">{visa.code}</span>
                          <span className="text-sm text-gray-600 ml-1">{visa.nameKo}</span>
                          <p className="text-xs text-gray-500 mt-0.5">{visa.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <Link href={`/company/jobs/create`}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2">
                    <Briefcase className="w-4 h-4" /> 이 조건으로 공고 등록하기
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
