'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  MapPin, DollarSign, Clock, Users, Calendar,
  ShieldCheck, ShieldAlert, ShieldX, ChevronDown,
  Share2, Bookmark, BookmarkCheck, ArrowLeft, Info,
  Phone, Mail, Globe,
} from 'lucide-react';
import type {
  AlbaJobResponse, AlbaVisaMatchingResponse, DayOfWeek,
  VisaEvalResult, VisaMatchStatus,
} from '../../../../../company/alba/create/variants/a/types';

/** 요일 라벨 / Day labels */
const DAY_LABELS: Record<DayOfWeek, string> = {
  MON: '월', TUE: '화', WED: '수', THU: '목', FRI: '금', SAT: '토', SUN: '일',
};
const ALL_DAYS: DayOfWeek[] = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

/** 복리후생 라벨 매핑 / Benefits label mapping */
const BENEFIT_LABELS: Record<string, { label: string; icon: string }> = {
  MEAL: { label: '식사 제공', icon: '🍚' },
  TRANSPORT: { label: '교통비', icon: '🚌' },
  INSURANCE: { label: '4대보험', icon: '🏥' },
  HOUSING: { label: '숙소 제공', icon: '🏠' },
  UNIFORM: { label: '유니폼', icon: '👔' },
  STAFF_DISCOUNT: { label: '직원 할인', icon: '🏷' },
  BONUS: { label: '성과급', icon: '💰' },
  FLEXIBLE_HOURS: { label: '유연근무', icon: '⏰' },
};

/** 비자 상태별 설정 / Visa status config */
const VISA_STATUS_CONFIG: Record<VisaMatchStatus, { label: string; color: string; bgColor: string; icon: typeof ShieldCheck }> = {
  eligible: { label: '적합', color: 'text-green-600', bgColor: 'bg-green-50', icon: ShieldCheck },
  conditional: { label: '조건부', color: 'text-amber-600', bgColor: 'bg-amber-50', icon: ShieldAlert },
  blocked: { label: '불가', color: 'text-red-600', bgColor: 'bg-red-50', icon: ShieldX },
};

/** 더미 공고 데이터 / Dummy job data */
const DUMMY_JOB: AlbaJobResponse = {
  jobId: '1', corporateId: '100', boardType: 'PART_TIME', tierType: 'STANDARD',
  title: '강남역 카페 주말 바리스타 모집', status: 'ACTIVE',
  jobCategoryCode: 'CAFE_BARISTA', jobCategoryName: '카페 바리스타', ksicCode: 'I',
  jobDescription: '주말 바리스타', recruitCount: 2, hourlyWage: 12000, weeklyHours: 16,
  schedule: [
    { dayOfWeek: 'SAT', startTime: '10:00', endTime: '18:00' },
    { dayOfWeek: 'SUN', startTime: '10:00', endTime: '18:00' },
  ],
  isWeekendOnly: true,
  workPeriod: { startDate: '2026-03-01', endDate: null },
  address: { sido: '서울특별시', sigungu: '강남구', detail: '역삼동 123-45 2층', lat: 37.4979, lng: 127.0276 },
  displayAddress: '서울 강남구 역삼동',
  koreanLevel: 'BASIC', experienceLevel: 'NONE',
  preferredQualifications: '바리스타 자격증 우대, 인근 거주자 환영',
  benefits: ['MEAL', 'STAFF_DISCOUNT'],
  detailDescription: `저희 카페에서 함께할 주말 바리스타를 모집합니다.

[주요 업무]
- 에스프레소 및 다양한 음료 제조
- 고객 응대 및 주문 처리
- 매장 청소 및 마감 정리

[근무 환경]
- 깔끔하고 현대적인 인테리어
- 직원 음료 무료 제공
- 친절하고 화기애애한 분위기

밝고 친절한 분들의 많은 지원 바랍니다!`,
  workContentImg: null,
  applicationDeadline: '2026-03-15', applicationMethod: 'PLATFORM',
  contactName: '김채용', contactPhone: '010-1234-5678', contactEmail: 'hire@cafe.com',
  isPremium: false, premiumStartAt: null, premiumEndAt: null,
  matchedVisas: [
    { visaCode: 'F-5', visaName: '영주', visaNameEn: 'Permanent Residence', status: 'eligible', requiredPermit: null, maxWeeklyHours: null, maxWorkplaces: null, notes: '내국인과 동일' },
    { visaCode: 'F-6', visaName: '결혼이민', visaNameEn: 'Marriage Immigration', status: 'eligible', requiredPermit: null, maxWeeklyHours: null, maxWorkplaces: null, notes: null },
    { visaCode: 'D-2', visaName: '유학', visaNameEn: 'Study Abroad', status: 'conditional', conditions: ['체류자격외활동허가 필요', '주말 근무: 시간 제한 없음'], requiredPermit: '체류자격외활동허가', maxWeeklyHours: 20, maxWorkplaces: 2, notes: '주말만 근무 시 시간 무제한' },
  ],
  allowedVisas: 'F-5,F-6,F-2,H-1,D-2,H-2,F-4',
  viewCount: 234, scrapCount: 45, applyCount: 12,
  companyName: '카페 라떼', companyLogo: null,
  createdAt: '2026-02-15T00:00:00Z', updatedAt: '2026-02-18T00:00:00Z', expiresAt: '2026-03-01T00:00:00Z',
};

/** 더미 사용자 비자 상태 / Dummy user visa status */
const USER_VISA = { code: 'D-2', name: '유학', status: 'conditional' as VisaMatchStatus };

/**
 * 구직자용 알바 공고 상세 페이지 (시안 E)
 * Alba Job Detail Page for Workers (Variant E)
 *
 * 히어로(기업+시급+비자스코어) + 비자 인사이트 + 스케줄 테이블 + 복리후생 + 하단 고정 CTA
 * Hero(company+wage+visa score) + visa insight + schedule table + benefits + sticky bottom CTA
 */
export default function AlbaDetailPageVariantE() {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showAllVisas, setShowAllVisas] = useState(false);
  const job = DUMMY_JOB;

  /** 사용자 비자에 대한 매칭 결과 찾기 / Find match result for user's visa */
  const userVisaMatch = job.matchedVisas.find((v) => v.visaCode === USER_VISA.code);
  const visaScore = USER_VISA.status === 'eligible' ? 100 : USER_VISA.status === 'conditional' ? 70 : 0;
  const scoreColor = visaScore >= 80 ? 'text-green-600' : visaScore >= 50 ? 'text-amber-600' : 'text-red-600';
  const scoreBgColor = visaScore >= 80 ? 'bg-green-50 border-green-200' : visaScore >= 50 ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200';
  const scoreBarColor = visaScore >= 80 ? 'bg-green-500' : visaScore >= 50 ? 'bg-amber-400' : 'bg-red-400';

  /** 한국어 수준 라벨 / Korean level label */
  const koreanLabels: Record<string, string> = {
    NONE: '상관없음', BASIC: '기초 회화', DAILY: '일상 회화', BUSINESS: '업무 회화',
  };

  /** 경력 라벨 / Experience label */
  const expLabels: Record<string, string> = {
    NONE: '경력무관', UNDER_1Y: '1년 미만', ONE_TO_THREE_Y: '1~3년', OVER_3Y: '3년 이상',
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* 히어로 섹션 / Hero section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* 뒤로가기 / Back button */}
          <Link
            href="/worker/alba/variants/e"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition mb-4"
            aria-label="목록으로 돌아가기 / Back to list"
          >
            <ArrowLeft className="w-4 h-4" />
            목록으로
          </Link>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold text-blue-600">{job.companyName}</p>
              <h1 className="text-2xl font-bold text-gray-900 mt-1">{job.title}</h1>
            </div>
            {/* 기업 로고 placeholder / Company logo placeholder */}
            <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-lg font-bold text-gray-400 shrink-0 ml-4">
              {job.companyName.charAt(0)}
            </div>
          </div>

          {/* 핵심 정보 그리드 / Key info grid */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="w-4 h-4 text-gray-400" />
              <strong className="text-gray-900">시급 {job.hourlyWage.toLocaleString()}원</strong>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>{job.displayAddress}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>주 {job.weeklyHours}시간</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Users className="w-4 h-4 text-gray-400" />
              <span>{job.recruitCount}명 모집</span>
            </div>
          </div>

          {/* 비자 적합도 카드 / Visa compatibility card */}
          <div className={`mt-5 rounded-xl border p-4 ${scoreBgColor}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {VISA_STATUS_CONFIG[USER_VISA.status] && (
                  <>
                    {(() => { const Icon = VISA_STATUS_CONFIG[USER_VISA.status].icon; return <Icon className={`w-5 h-5 ${scoreColor}`} />; })()}
                  </>
                )}
                <div>
                  <p className={`font-semibold ${scoreColor}`}>
                    내 비자 ({USER_VISA.code}) 적합도
                  </p>
                  <p className="text-xs text-gray-500">My visa compatibility score</p>
                </div>
              </div>
              <span className={`text-3xl font-bold ${scoreColor}`}>{visaScore}</span>
            </div>
            <div className="w-full bg-white/50 rounded-full h-2 mt-3">
              <div
                className={`${scoreBarColor} h-2 rounded-full transition-all duration-700`}
                style={{ width: `${visaScore}%` }}
              />
            </div>
            {/* 조건 표시 / Condition display */}
            {userVisaMatch?.conditions && userVisaMatch.conditions.length > 0 && (
              <div className="mt-3 space-y-1">
                {userVisaMatch.conditions.map((cond, i) => (
                  <p key={i} className="text-xs text-amber-700 flex items-start gap-1">
                    <Info className="w-3 h-3 mt-0.5 shrink-0" /> {cond}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 본문 컨텐츠 / Body content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 좌측 메인 (2/3) / Left main (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* 상세 업무 내용 / Job description */}
            <section className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-base font-semibold text-gray-900 mb-3">상세 업무 내용</h2>
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {job.detailDescription}
              </p>
            </section>

            {/* 근무 스케줄 테이블 / Work schedule table */}
            <section className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-base font-semibold text-gray-900 mb-3">근무 스케줄</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-center">
                  <thead>
                    <tr className="bg-gray-50">
                      {ALL_DAYS.map((day) => (
                        <th
                          key={day}
                          className={`p-2.5 text-xs font-semibold ${
                            day === 'SAT' || day === 'SUN' ? 'text-red-500' : 'text-gray-600'
                          }`}
                        >
                          {DAY_LABELS[day]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {ALL_DAYS.map((day) => {
                        const sch = job.schedule.find((s) => s.dayOfWeek === day);
                        return (
                          <td
                            key={day}
                            className={`p-2.5 border-t ${
                              sch
                                ? 'text-blue-600 font-semibold bg-blue-50'
                                : 'text-gray-300'
                            }`}
                          >
                            {sch ? (
                              <div>
                                <p className="text-xs">{sch.startTime}</p>
                                <p className="text-[10px] text-gray-400">~</p>
                                <p className="text-xs">{sch.endTime}</p>
                              </div>
                            ) : (
                              '-'
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* 근무 기간 / Work period */}
              <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  {job.workPeriod.startDate} ~ {job.workPeriod.endDate || '채용시까지'}
                </span>
                {job.isWeekendOnly && (
                  <span className="px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded text-[10px] font-medium">
                    주말 전용
                  </span>
                )}
              </div>
            </section>

            {/* 자격요건 / Requirements */}
            <section className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-base font-semibold text-gray-900 mb-3">자격요건</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-gray-500 mb-1">한국어 수준</p>
                  <p className="font-medium text-gray-900">{koreanLabels[job.koreanLevel] || job.koreanLevel}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">경력</p>
                  <p className="font-medium text-gray-900">{expLabels[job.experienceLevel] || job.experienceLevel}</p>
                </div>
              </div>
              {job.preferredQualifications && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">우대사항</p>
                  <p className="text-sm text-gray-700">{job.preferredQualifications}</p>
                </div>
              )}
            </section>

            {/* 복리후생 / Benefits */}
            {job.benefits.length > 0 && (
              <section className="bg-white rounded-xl border border-gray-200 p-5">
                <h2 className="text-base font-semibold text-gray-900 mb-3">복리후생</h2>
                <div className="flex flex-wrap gap-2">
                  {job.benefits.map((b) => {
                    const info = BENEFIT_LABELS[b];
                    return (
                      <span
                        key={b}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg text-sm text-gray-700 border border-gray-100"
                      >
                        {info?.icon} {info?.label || b}
                      </span>
                    );
                  })}
                </div>
              </section>
            )}
          </div>

          {/* 우측 사이드바 (1/3) / Right sidebar (1/3) */}
          <div className="lg:col-span-1 space-y-6">
            {/* 비자 인사이트 카드 / Visa insight card */}
            <section className="bg-white rounded-xl border border-gray-200 p-5 sticky top-20">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <Info className="w-4 h-4 text-blue-500" />
                비자 인사이트
              </h3>

              {/* 허용 비자 요약 / Allowed visa summary */}
              <div className="space-y-2">
                {job.matchedVisas.slice(0, showAllVisas ? undefined : 3).map((visa) => {
                  const config = VISA_STATUS_CONFIG[visa.status];
                  const Icon = config.icon;
                  return (
                    <div key={visa.visaCode} className={`rounded-lg p-2.5 ${config.bgColor}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                          <span className="text-sm font-semibold text-gray-900">{visa.visaCode}</span>
                          <span className="text-xs text-gray-500">{visa.visaName}</span>
                        </div>
                        <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
                      </div>
                      {visa.conditions && visa.conditions.length > 0 && (
                        <p className="text-[10px] text-amber-600 mt-1 pl-5">{visa.conditions[0]}</p>
                      )}
                    </div>
                  );
                })}
              </div>

              {job.matchedVisas.length > 3 && (
                <button
                  onClick={() => setShowAllVisas(!showAllVisas)}
                  className="w-full mt-2 text-xs text-blue-600 font-medium flex items-center justify-center gap-1 py-2 hover:text-blue-700"
                  aria-label={showAllVisas ? '접기' : '전체 보기'}
                >
                  {showAllVisas ? '접기' : `전체 ${job.matchedVisas.length}개 보기`}
                  <ChevronDown className={`w-3 h-3 transition-transform ${showAllVisas ? 'rotate-180' : ''}`} />
                </button>
              )}

              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-[10px] text-gray-400 leading-relaxed">
                  * 위 정보는 공고 조건 기반 예상 결과이며, 개인 상황에 따라 다를 수 있습니다.
                  실제 취업 가능 여부는 출입국관리사무소에 확인하세요.
                </p>
              </div>
            </section>

            {/* 기업/연락처 정보 / Company/contact info */}
            <section className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">기업 정보</h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span>{job.companyName}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{job.address.sido} {job.address.sigungu} {job.address.detail}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{job.contactPhone}</span>
                </div>
                {job.contactEmail && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{job.contactEmail}</span>
                  </div>
                )}
              </div>
            </section>

            {/* 공고 메타 정보 / Posting meta info */}
            <section className="text-xs text-gray-400 space-y-1 px-1">
              <p>등록일: {new Date(job.createdAt).toLocaleDateString('ko-KR')}</p>
              {job.applicationDeadline && <p>마감일: {job.applicationDeadline}</p>}
              <p>조회수: {job.viewCount} | 스크랩: {job.scrapCount}</p>
            </section>
          </div>
        </div>
      </div>

      {/* 하단 고정 CTA / Sticky bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 safe-area-bottom">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-2">
          {/* 스크랩 / Bookmark */}
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className="w-12 h-12 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition shrink-0"
            aria-label={isBookmarked ? '스크랩 해제 / Remove bookmark' : '스크랩 / Bookmark'}
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-5 h-5 text-blue-600" />
            ) : (
              <Bookmark className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {/* 공유 / Share */}
          <button
            className="w-12 h-12 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition shrink-0"
            aria-label="공유하기 / Share"
          >
            <Share2 className="w-5 h-5 text-gray-400" />
          </button>

          {/* 지원하기 버튼 (비자 상태에 따라 색상 변화) / Apply button (color varies by visa status) */}
          <button
            className={`flex-1 h-12 text-white text-sm font-semibold rounded-lg transition ${
              USER_VISA.status === 'eligible'
                ? 'bg-green-600 hover:bg-green-700'
                : USER_VISA.status === 'conditional'
                  ? 'bg-amber-500 hover:bg-amber-600'
                  : 'bg-gray-400 cursor-not-allowed'
            }`}
            disabled={USER_VISA.status === 'blocked'}
            aria-label="지원하기 / Apply"
          >
            {USER_VISA.status === 'eligible' && '지원하기'}
            {USER_VISA.status === 'conditional' && '조건부 지원하기'}
            {USER_VISA.status === 'blocked' && '지원 불가 (비자 부적합)'}
          </button>
        </div>
      </div>
    </div>
  );
}
