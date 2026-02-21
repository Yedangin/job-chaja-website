/**
 * 정규채용 공고 API 함수
 * Fulltime job posting API functions
 */

import type {
  FulltimeJobFormData,
  FulltimeVisaMatchingResponse,
} from './components/fulltime-types';

/**
 * 비자 필터링 규칙 타입
 * Visa filter rule type
 */
export interface VisaFilterRule {
  visaCode: string;
  visaName: string;
  visaNameEn: string;
  hiringTrack: string;
  minSalary: number | null;
  minEducation: string | null;
  requiresOverseasHire: boolean;
  allowedJobCategories: string[] | null;
  notes: string | null;
  requiresEntryLevel?: boolean; // 신입 채용만 가능 여부 (D-2만 true)
}

/**
 * 비자 필터링 규칙 응답 타입
 * Visa filter rules response type
 */
export interface VisaFilterRulesResponse {
  visas: VisaFilterRule[];
  totalCount: number;
  retrievedAt: string;
}

/**
 * 비자 필터링 규칙 조회 API 호출
 * Fetch visa filter rules API
 */
export async function fetchVisaFilterRules(): Promise<VisaFilterRulesResponse> {
  try {
    const response = await fetch('http://localhost:8000/fulltime-visa/filter-rules', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error('비자 규칙 조회 실패');

    return await response.json();
  } catch (error) {
    console.error('비자 규칙 조회 API 오류:', error);
    throw error;
  }
}

/**
 * 정규채용 비자 매칭 API 호출
 * Call fulltime visa matching API
 */
export async function matchFulltimeVisa(
  form: FulltimeJobFormData
): Promise<FulltimeVisaMatchingResponse> {
  try {
    // TODO: 실제 API 연동
    // const response = await fetch('/api/fulltime-visa/evaluate', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(form),
    // });
    // if (!response.ok) throw new Error('비자 매칭 실패');
    // return await response.json();

    // 임시 Mock 데이터
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return {
      immediate: {
        track: 'immediate',
        eligible: [
          { visaType: 'F-2', visaName: '거주', status: 'eligible' },
          { visaType: 'F-5', visaName: '영주', status: 'eligible' },
        ],
        conditional: [],
        blocked: [],
      },
      sponsor: {
        track: 'sponsor',
        eligible: [
          { visaType: 'E-7-1', visaName: '전문직종', status: 'eligible' },
          { visaType: 'E-7-4', visaName: '숙련기능', status: 'eligible' },
        ],
        conditional: [
          {
            visaType: 'E-7-2',
            visaName: '준전문직종',
            status: 'conditional',
            conditions: ['학사 학위 필요', '외국인 고용비율 20% 이하 유지'],
          },
        ],
        blocked: [
          {
            visaType: 'E-1',
            visaName: '교수',
            status: 'blocked',
            reasons: ['고등교육기관에서만 발급 가능'],
          },
        ],
      },
      transition: {
        track: 'transition',
        eligible: [
          { visaType: 'D-10→E-7', visaName: '구직→특정활동', status: 'eligible' },
        ],
        conditional: [
          {
            visaType: 'D-2→E-7',
            visaName: '유학→특정활동',
            status: 'conditional',
            conditions: ['졸업 필요', '학사 이상'],
          },
        ],
        blocked: [],
      },
      transfer: {
        track: 'transfer',
        eligible: [
          { visaType: 'E-7→E-7', visaName: 'E-7 직장 변경', status: 'eligible' },
        ],
        conditional: [],
        blocked: [],
      },
      summary: {
        totalEligible: 7,
        totalConditional: 2,
        totalBlocked: 1,
      },
    };
  } catch (error) {
    console.error('비자 매칭 API 오류:', error);
    throw error;
  }
}

/**
 * 정규채용 공고 등록 API 호출
 * Submit fulltime job posting
 */
export async function createFulltimeJob(
  form: FulltimeJobFormData
): Promise<void> {
  try {
    // TODO: 실제 API 연동
    // const response = await fetch('/api/fulltime/jobs', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(form),
    // });
    // if (!response.ok) throw new Error('공고 등록 실패');

    // 임시 딜레이
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log('공고 등록 성공:', form);
  } catch (error) {
    console.error('공고 등록 API 오류:', error);
    throw error;
  }
}
