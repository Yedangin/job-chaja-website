'use client';

/**
 * Variant B — 알바 공고 상세 (구직자) — 2-컬럼 레이아웃 + 탭 섹션
 * Variant B — Alba job detail (worker) — two-column layout + tabbed sections
 *
 * 특징: 좌측 메인 콘텐츠 + 우측 기업정보/지원 사이드바 (sticky),
 *       탭: 상세정보 / 근무조건 / 비자정보 / 접수방법
 * Features: Left main content + right company info/apply sidebar (sticky),
 *           tabs: Details / Work Conditions / Visa Info / Application Method
 */

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, MapPin, Clock, Calendar, Shield, ShieldAlert,
  Eye, Bookmark, BookmarkCheck, Share2, AlertCircle, Phone,
  Mail, ExternalLink, Building2, Users, Star, ChevronRight,
  CheckCircle, Info,
} from 'lucide-react';
import type {
  AlbaJobResponse,
  VisaEvalResult,
  VisaMatch,
} from '../../../../../company/alba/create/variants/b/components/alba-types';
import {
  DAY_LABELS,
  KOREAN_LEVEL_LABELS,
  EXPERIENCE_LEVEL_LABELS,
  BENEFIT_LABELS,
  APPLICATION_METHOD_LABELS,
  POST_STATUS_LABELS,
} from '../../../../../company/alba/create/variants/b/components/alba-types';

// ─── 탭 정의 / Tab definition ───
type TabKey = 'detail' | 'conditions' | 'visa' | 'apply';
const TABS: { key: TabKey; label: string; labelEn: string }[] = [
  { key: 'detail', label: '상세정보', labelEn: 'Details' },
  { key: 'conditions', label: '근무조건', labelEn: 'Conditions' },
  { key: 'visa', label: '비자정보', labelEn: 'Visa Info' },
  { key: 'apply', label: '접수방법', labelEn: 'How to Apply' },
];

// ─── 목업 데이터 / Mock data ───
const MOCK_JOB: AlbaJobResponse & { visaMatch?: VisaMatch; distanceFromSchool?: string } = {
  jobId: '12345', corporateId: '67890', boardType: 'PART_TIME', tierType: 'STANDARD',
  title: '강남역 카페 주말 바리스타 모집',
  status: 'ACTIVE',
  jobCategoryCode: 'CAFE_BARISTA', jobCategoryName: '카페/바리스타', ksicCode: 'I',
  jobDescription: '주말 런치~저녁 타임(11시~19시) 바리스타 업무를 담당합니다. 에스프레소 머신 사용, 음료 제조, 간단한 디저트 세팅, 마감 정리까지 포함됩니다.',
  recruitCount: 2, hourlyWage: 12000, weeklyHours: 16,
  schedule: [
    { dayOfWeek: 'SAT', startTime: '11:00', endTime: '19:00' },
    { dayOfWeek: 'SUN', startTime: '11:00', endTime: '19:00' },
  ],
  isWeekendOnly: true,
  workPeriod: { startDate: '2026-03-01', endDate: null },
  address: { sido: '서울특별시', sigungu: '강남구', detail: '역삼동 123-45 카페빌딩 2층', lat: 37.4979, lng: 127.0276 },
  displayAddress: '서울 강남구 역삼동',
  koreanLevel: 'DAILY', experienceLevel: 'NONE',
  preferredQualifications: '바리스타 자격증 소지자 우대, 주말 장기 근무 가능자 환영',
  benefits: ['MEAL', 'TRANSPORT', 'STAFF_DISCOUNT'],
  detailDescription: `안녕하세요, 카페 라떼입니다!

강남역 도보 3분 거리에 위치한 스페셜티 카페에서 주말 바리스타를 모집합니다.

[주요 업무]
- 에스프레소 기반 음료 제조
- 브루잉 커피 추출 (핸드드립, 에어로프레스)
- 디저트 플레이팅 및 서빙
- 매장 청결 유지 및 마감 정리

[근무 환경]
- 강남역 2번 출구 도보 3분
- 넓고 쾌적한 매장 (60석 규모)
- 최신 라마르조코 머신 사용
- 직원 할인 30% 제공

경험이 없어도 친절하게 교육해드립니다.
커피에 관심 있는 분이라면 누구나 환영합니다!`,
  workContentImg: null,
  applicationDeadline: '2026-03-15',
  applicationMethod: 'PLATFORM',
  contactName: '김채용', contactPhone: '010-1234-5678', contactEmail: 'hire@cafelatte.kr',
  isPremium: false, premiumStartAt: null, premiumEndAt: null,
  matchedVisas: [
    { visaCode: 'F-5', visaName: '영주', visaNameEn: 'Permanent Residence', status: 'eligible', notes: '내국인과 동일한 취업 권리' },
    { visaCode: 'F-6', visaName: '결혼이민', visaNameEn: 'Marriage Immigration', status: 'eligible', notes: '내국인과 동일한 취업 권리' },
    { visaCode: 'F-2', visaName: '거주', visaNameEn: 'Residence', status: 'eligible', notes: '취업 제한 없음' },
    { visaCode: 'H-1', visaName: '워킹홀리데이', visaNameEn: 'Working Holiday', status: 'eligible', notes: '체류기간 최대 1년' },
    { visaCode: 'D-2', visaName: '유학', visaNameEn: 'Study Abroad', status: 'conditional', conditions: ['주말만 근무 — 시간 제한 없음', '체류자격외활동허가 필요'], maxWeeklyHours: null, maxWorkplaces: 2, requiredPermit: '체류자격외활동허가' },
    { visaCode: 'H-2', visaName: '방문취업', visaNameEn: 'Visit & Employment', status: 'conditional', conditions: ['특례고용허가 필요 (일부 업종)'], requiredPermit: '특례고용허가' },
    { visaCode: 'F-4', visaName: '재외동포', visaNameEn: 'Overseas Korean', status: 'conditional', conditions: ['단순노무 해당 시 예외 직종 확인 필요'] },
  ],
  allowedVisas: 'F-5,F-6,F-2,H-1,D-2,H-2,F-4',
  viewCount: 345, scrapCount: 28, applyCount: 12,
  companyName: '카페 라떼', companyLogo: null,
  createdAt: '2026-02-10T09:00:00Z', updatedAt: '2026-02-15T14:00:00Z', expiresAt: '2026-02-24T09:00:00Z',
  visaMatch: { status: 'eligible', conditions: [] },
  distanceFromSchool: '30분',
};

export default function AlbaDetailVariantBPage() {
  const job = MOCK_JOB;

  // ─── 상태 / State ───
  const [activeTab, setActiveTab] = useState<TabKey>('detail');
  const [isBookmarked, setIsBookmarked] = useState(false);

  // ─── D-Day / D-Day ───
  const getDDay = (deadline: string | null): string | null => {
    if (!deadline) return null;
    const diff = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return '마감';
    if (diff === 0) return 'D-Day';
    return `D-${diff}`;
  };

  const dDay = getDDay(job.applicationDeadline);

  // ─── 비자 상태 배지 / Visa status badge ───
  const renderVisaStatusBadge = (visa: VisaEvalResult) => {
    if (visa.status === 'eligible') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-[11px] font-semibold rounded border border-green-200">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />가능
        </span>
      );
    }
    if (visa.status === 'conditional') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 text-[11px] font-semibold rounded border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />조건부
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-600 text-[11px] font-semibold rounded border border-red-200">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />불가
      </span>
    );
  };

  // ─── 내 비자 배지 / My visa match badge ───
  const myVisaBadge = () => {
    if (!job.visaMatch) return null;
    if (job.visaMatch.status === 'eligible') {
      return (
        <div className="bg-green-50 border border-green-200 rounded-sm px-3 py-2 flex items-center gap-2">
          <Shield className="w-4 h-4 text-green-600" />
          <span className="text-sm font-semibold text-green-700">내 비자(D-2)로 지원 가능</span>
        </div>
      );
    }
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-sm px-3 py-2">
        <div className="flex items-center gap-2 mb-1">
          <ShieldAlert className="w-4 h-4 text-amber-600" />
          <span className="text-sm font-semibold text-amber-700">조건부 지원 가능</span>
        </div>
        {job.visaMatch.conditions.map((c, i) => (
          <p key={i} className="text-xs text-amber-600 ml-6">{c}</p>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4">
      {/* ─── 상단 네비게이션 / Top navigation ─── */}
      <div className="flex items-center gap-2 mb-3">
        <Link
          href="/worker/alba/variants/b"
          className="p-1.5 text-gray-400 hover:text-gray-700 transition min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="알바 목록으로 돌아가기 / Back to job list"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <span className="text-xs text-gray-400">알바채용관 &gt; 공고 상세</span>
      </div>

      {/* ─── 2-컬럼 레이아웃 / Two-column layout ─── */}
      <div className="flex gap-4 items-start">
        {/* 좌측 메인 콘텐츠 / Left main content */}
        <div className="flex-1 min-w-0">
          {/* 공고 헤더 / Job header */}
          <div className="border border-gray-200 rounded-sm bg-white mb-4">
            <div className="p-4">
              {/* 카테고리 + 배지 / Category + badges */}
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{job.jobCategoryName}</span>
                {job.isPremium && (
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">PREMIUM</span>
                )}
                {job.isWeekendOnly && (
                  <span className="text-[10px] font-medium text-green-700 bg-green-100 px-1.5 py-0.5 rounded">주말만</span>
                )}
                {dDay && (
                  <span className={`text-[11px] font-semibold ${dDay === '마감' ? 'text-red-500' : 'text-blue-600'}`}>
                    {dDay}
                  </span>
                )}
              </div>

              {/* 제목 / Title */}
              <h1 className="text-xl font-bold text-gray-900 mb-3">{job.title}</h1>

              {/* 핵심 정보 그리드 / Key info grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                <div className="bg-blue-50 rounded-sm px-3 py-2.5 text-center">
                  <p className="text-xs text-blue-500 mb-0.5">시급</p>
                  <p className="text-lg font-bold text-blue-700">{job.hourlyWage.toLocaleString()}<span className="text-sm">원</span></p>
                </div>
                <div className="bg-gray-50 rounded-sm px-3 py-2.5 text-center">
                  <p className="text-xs text-gray-500 mb-0.5">근무시간</p>
                  <p className="text-sm font-semibold text-gray-700">주 {job.weeklyHours}시간</p>
                </div>
                <div className="bg-gray-50 rounded-sm px-3 py-2.5 text-center">
                  <p className="text-xs text-gray-500 mb-0.5">근무요일</p>
                  <p className="text-sm font-semibold text-gray-700">
                    {job.schedule.map(s => DAY_LABELS[s.dayOfWeek]).join(', ')}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-sm px-3 py-2.5 text-center">
                  <p className="text-xs text-gray-500 mb-0.5">모집인원</p>
                  <p className="text-sm font-semibold text-gray-700">{job.recruitCount}명</p>
                </div>
              </div>

              {/* 위치 + 통계 / Location + stats */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />{job.displayAddress}
                  </span>
                  {job.distanceFromSchool && (
                    <span className="text-blue-600 font-medium">학교에서 {job.distanceFromSchool}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{job.viewCount}</span>
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{job.applyCount}명 지원</span>
                </div>
              </div>
            </div>

            {/* 내 비자 매칭 결과 / My visa match result */}
            <div className="px-4 pb-4">
              {myVisaBadge()}
            </div>
          </div>

          {/* ─── 탭 네비게이션 / Tab navigation ─── */}
          <div className="border border-gray-200 rounded-sm bg-white">
            <div className="flex border-b border-gray-200">
              {TABS.map(tab => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`
                    flex-1 px-3 py-3 text-sm font-medium border-b-2 transition-colors min-h-[44px]
                    ${activeTab === tab.key
                      ? 'border-blue-700 text-blue-700 bg-blue-50/30'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}
                  `}
                  aria-label={`${tab.label} 탭`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ─── 탭 콘텐츠: 상세정보 / Tab: Details ─── */}
            {activeTab === 'detail' && (
              <div className="p-4">
                <div className="prose prose-sm max-w-none">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {job.detailDescription}
                  </p>
                </div>
                {job.preferredQualifications && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">우대사항 / Preferences</h3>
                    <p className="text-sm text-gray-600">{job.preferredQualifications}</p>
                  </div>
                )}
              </div>
            )}

            {/* ─── 탭 콘텐츠: 근무조건 / Tab: Work Conditions ─── */}
            {activeTab === 'conditions' && (
              <div className="p-4">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-2.5 pr-4 text-gray-500 font-medium w-[100px]">시급</td>
                      <td className="py-2.5 text-blue-700 font-bold">{job.hourlyWage.toLocaleString()}원</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2.5 pr-4 text-gray-500 font-medium">근무요일</td>
                      <td className="py-2.5 text-gray-800">
                        {job.schedule.map(s => (
                          <span key={s.dayOfWeek} className="inline-block mr-3">
                            <span className="font-medium">{DAY_LABELS[s.dayOfWeek]}</span>
                            <span className="text-gray-500 ml-1">{s.startTime}~{s.endTime}</span>
                          </span>
                        ))}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2.5 pr-4 text-gray-500 font-medium">주당 시간</td>
                      <td className="py-2.5 text-gray-800">{job.weeklyHours}시간</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2.5 pr-4 text-gray-500 font-medium">근무기간</td>
                      <td className="py-2.5 text-gray-800">
                        {job.workPeriod.startDate} ~ {job.workPeriod.endDate || '채용시까지'}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2.5 pr-4 text-gray-500 font-medium">근무지</td>
                      <td className="py-2.5 text-gray-800">
                        {job.address.sido} {job.address.sigungu} {job.address.detail}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2.5 pr-4 text-gray-500 font-medium">한국어</td>
                      <td className="py-2.5 text-gray-800">{KOREAN_LEVEL_LABELS[job.koreanLevel]}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2.5 pr-4 text-gray-500 font-medium">경력</td>
                      <td className="py-2.5 text-gray-800">{EXPERIENCE_LEVEL_LABELS[job.experienceLevel]}</td>
                    </tr>
                    {job.benefits.length > 0 && (
                      <tr>
                        <td className="py-2.5 pr-4 text-gray-500 font-medium">복리후생</td>
                        <td className="py-2.5">
                          <div className="flex flex-wrap gap-1.5">
                            {job.benefits.map(b => (
                              <span key={b} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded border border-blue-100">
                                {BENEFIT_LABELS[b as keyof typeof BENEFIT_LABELS] || b}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* ─── 탭 콘텐츠: 비자정보 / Tab: Visa Info ─── */}
            {activeTab === 'visa' && (
              <div className="p-4">
                {/* 요약 / Summary */}
                <div className="bg-blue-50 border border-blue-100 rounded-sm px-4 py-3 mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-800">
                      {job.matchedVisas.filter(v => v.status === 'eligible').length + job.matchedVisas.filter(v => v.status === 'conditional').length}개
                      비자 유형의 구직자가 지원 가능합니다
                    </span>
                  </div>
                  <p className="text-xs text-blue-600 ml-6">
                    가능 {job.matchedVisas.filter(v => v.status === 'eligible').length}개 /
                    조건부 {job.matchedVisas.filter(v => v.status === 'conditional').length}개
                  </p>
                </div>

                {/* 비자 목록 테이블 / Visa list table */}
                <div className="border border-gray-200 rounded-sm overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">비자</th>
                        <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">상태</th>
                        <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500 hidden sm:table-cell">조건/사유</th>
                        <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500 hidden md:table-cell">비고</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {job.matchedVisas.map(visa => (
                        <tr key={visa.visaCode} className={visa.status === 'eligible' ? 'bg-green-50/30' : visa.status === 'conditional' ? 'bg-amber-50/30' : 'bg-red-50/30'}>
                          <td className="px-3 py-2.5">
                            <div>
                              <span className="font-semibold text-gray-800">{visa.visaCode}</span>
                              <span className="text-gray-500 ml-1">{visa.visaName}</span>
                            </div>
                            <span className="text-[11px] text-gray-400">{visa.visaNameEn}</span>
                          </td>
                          <td className="px-3 py-2.5">
                            {renderVisaStatusBadge(visa)}
                          </td>
                          <td className="px-3 py-2.5 hidden sm:table-cell">
                            {visa.conditions && visa.conditions.length > 0 ? (
                              <ul className="space-y-0.5">
                                {visa.conditions.map((c, i) => (
                                  <li key={i} className="text-xs text-amber-600 flex items-start gap-1">
                                    <span className="mt-1 w-1 h-1 rounded-full bg-amber-400 shrink-0" />
                                    {c}
                                  </li>
                                ))}
                              </ul>
                            ) : visa.notes ? (
                              <span className="text-xs text-gray-500">{visa.notes}</span>
                            ) : (
                              <span className="text-xs text-green-600">제한 없음</span>
                            )}
                          </td>
                          <td className="px-3 py-2.5 hidden md:table-cell text-xs text-gray-500">
                            {visa.requiredPermit && (
                              <span className="text-amber-600">{visa.requiredPermit}</span>
                            )}
                            {visa.maxWeeklyHours != null && (
                              <div>최대 {visa.maxWeeklyHours}h/주</div>
                            )}
                            {visa.maxWorkplaces != null && (
                              <div>{visa.maxWorkplaces}개소 제한</div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 주말 근무 안내 / Weekend work notice */}
                {job.isWeekendOnly && (
                  <div className="mt-3 bg-green-50 border border-green-100 rounded-sm px-3 py-2 flex items-start gap-2">
                    <Info className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <p className="text-xs text-green-700">
                      이 공고는 <span className="font-semibold">주말만 근무</span>입니다.
                      D-2(유학) 비자 소지자는 주말/공휴일/방학 중 시간 제한 없이 근무할 수 있습니다.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ─── 탭 콘텐츠: 접수방법 / Tab: How to Apply ─── */}
            {activeTab === 'apply' && (
              <div className="p-4">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-2.5 pr-4 text-gray-500 font-medium w-[100px]">접수방법</td>
                      <td className="py-2.5 text-gray-800 font-semibold">
                        {APPLICATION_METHOD_LABELS[job.applicationMethod]}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2.5 pr-4 text-gray-500 font-medium">접수마감</td>
                      <td className="py-2.5 text-gray-800">
                        {job.applicationDeadline || '채용시까지'}
                        {dDay && (
                          <span className={`ml-2 text-xs font-semibold ${dDay === '마감' ? 'text-red-500' : 'text-blue-600'}`}>
                            ({dDay})
                          </span>
                        )}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2.5 pr-4 text-gray-500 font-medium">담당자</td>
                      <td className="py-2.5 text-gray-800">{job.contactName}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2.5 pr-4 text-gray-500 font-medium">연락처</td>
                      <td className="py-2.5">
                        <a href={`tel:${job.contactPhone}`} className="text-blue-600 hover:underline flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5" />{job.contactPhone}
                        </a>
                      </td>
                    </tr>
                    {job.contactEmail && (
                      <tr>
                        <td className="py-2.5 pr-4 text-gray-500 font-medium">이메일</td>
                        <td className="py-2.5">
                          <a href={`mailto:${job.contactEmail}`} className="text-blue-600 hover:underline flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5" />{job.contactEmail}
                          </a>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* 지원 안내 / Application notice */}
                <div className="mt-4 bg-gray-50 border border-gray-200 rounded-sm px-3 py-2.5">
                  <h4 className="text-xs font-semibold text-gray-700 mb-1">지원 시 준비 서류</h4>
                  <ul className="text-xs text-gray-500 space-y-0.5">
                    <li className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-green-500" />이력서 (잡차자 프로필)</li>
                    <li className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-green-500" />비자 인증 (잡차자 비자인증)</li>
                    <li className="flex items-center gap-1"><AlertCircle className="w-3 h-3 text-amber-500" />체류자격외활동허가서 (해당 비자)</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─── 우측 사이드바 (기업정보 + 지원 버튼) / Right sidebar ─── */}
        <aside className="hidden lg:block w-[280px] shrink-0">
          <div className="sticky top-4 space-y-3">
            {/* 기업 정보 카드 / Company info card */}
            <div className="border border-gray-200 rounded-sm bg-white">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  기업 정보
                </h3>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  {job.companyLogo ? (
                    <img src={job.companyLogo} alt={job.companyName} className="w-12 h-12 rounded border border-gray-200 object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded border border-gray-200 bg-gray-100 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800">{job.companyName}</h4>
                    <p className="text-xs text-gray-500">{job.displayAddress}</p>
                  </div>
                </div>
                <Link
                  href="#"
                  className="w-full flex items-center justify-center gap-1 text-xs text-blue-600 hover:underline py-1"
                  aria-label="기업 상세보기"
                >
                  기업 상세보기 <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* 지원 버튼 카드 / Apply button card */}
            <div className="border border-gray-200 rounded-sm bg-white p-4 space-y-3">
              {/* 스크랩 + 공유 / Bookmark + share */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`
                    flex-1 flex items-center justify-center gap-1.5 py-2.5 border rounded text-sm font-medium transition-colors min-h-[44px]
                    ${isBookmarked
                      ? 'bg-blue-50 border-blue-300 text-blue-600'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'}
                  `}
                  aria-label={isBookmarked ? '스크랩 해제' : '스크랩'}
                >
                  {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  {isBookmarked ? '스크랩됨' : '스크랩'}
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-1.5 py-2.5 px-4 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50 transition-colors min-h-[44px]"
                  aria-label="공유하기 / Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* 지원 버튼 / Apply button */}
              <button
                type="button"
                className="w-full py-3 bg-blue-700 text-white text-sm font-bold rounded hover:bg-blue-800 transition-colors min-h-[48px] flex items-center justify-center gap-2"
                aria-label="지원하기 / Apply"
              >
                지원하기
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* 마감일 안내 / Deadline notice */}
              {dDay && dDay !== '마감' && (
                <p className="text-center text-xs text-gray-500">
                  접수 마감 <span className="font-semibold text-blue-600">{dDay}</span>
                  {job.applicationDeadline && ` (${job.applicationDeadline})`}
                </p>
              )}
              {dDay === '마감' && (
                <p className="text-center text-xs text-red-500 font-semibold">
                  이 공고는 접수가 마감되었습니다
                </p>
              )}
            </div>

            {/* 비자 요약 미니 카드 / Visa summary mini card */}
            <div className="border border-gray-200 rounded-sm bg-white">
              <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50">
                <h3 className="text-xs font-semibold text-gray-700">지원 가능 비자</h3>
              </div>
              <div className="p-3">
                <div className="flex flex-wrap gap-1.5">
                  {job.matchedVisas
                    .filter(v => v.status !== 'blocked')
                    .map(v => (
                      <span
                        key={v.visaCode}
                        className={`
                          inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded border
                          ${v.status === 'eligible'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'}
                        `}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${v.status === 'eligible' ? 'bg-green-500' : 'bg-amber-500'}`} />
                        {v.visaCode}
                      </span>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* ─── 모바일 하단 고정 지원 버튼 / Mobile sticky apply button ─── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-40">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`
              flex items-center justify-center p-3 border rounded transition-colors min-w-[48px] min-h-[48px]
              ${isBookmarked ? 'bg-blue-50 border-blue-300 text-blue-600' : 'border-gray-200 text-gray-500'}
            `}
            aria-label={isBookmarked ? '스크랩 해제' : '스크랩'}
          >
            {isBookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
          </button>
          <button
            type="button"
            className="flex-1 py-3 bg-blue-700 text-white text-sm font-bold rounded hover:bg-blue-800 transition-colors min-h-[48px]"
            aria-label="지원하기 / Apply"
          >
            지원하기
          </button>
        </div>
      </div>

      {/* 모바일 하단 여백 / Mobile bottom padding */}
      <div className="lg:hidden h-20" />
    </div>
  );
}
