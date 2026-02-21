/**
 * 알바 API 클라이언트 (백엔드 연동)
 * Alba API client (backend integration)
 */

import type { AlbaJobFormData, AlbaVisaMatchingResponse } from './components/alba-types';

const API_BASE = '/api';

/**
 * 비자 매칭 요청 / Request visa matching
 * POST /api/alba/visa-matching
 */
export async function matchAlbaVisa(form: AlbaJobFormData): Promise<AlbaVisaMatchingResponse> {
  const body = {
    jobCategoryCode: form.jobCategoryCode,
    weeklyHours: form.weeklyHours,
    schedule: form.schedule.map(s => ({
      dayOfWeek: s.dayOfWeek,
      startTime: s.startTime,
      endTime: s.endTime,
    })),
    address: {
      sido: form.address.sido,
      sigungu: form.address.sigungu,
      detail: form.address.detail || '-',
      lat: form.address.lat || 37.5665,
      lng: form.address.lng || 126.978,
    },
    hourlyWage: form.hourlyWage,
  };

  try {
    const res = await fetch(`${API_BASE}/alba/visa-matching`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
    });

    if (res.ok) {
      return res.json();
    }

    // 유효성 검증 실패 시 에러 메시지 로깅 / Log validation error
    const errData = await res.json().catch(() => null);
    console.warn('Alba visa matching API error:', res.status, errData);
  } catch (err) {
    // 네트워크 오류 / Network error
    console.warn('Alba visa matching API not reachable:', err);
  }

  // 백엔드 미연결 시 목 데이터 반환 / Return mock data when backend unavailable
  return MOCK_VISA_RESULT;
}

/**
 * 알바 공고 등록 / Create alba job posting
 * POST /api/alba/jobs
 */
export async function createAlbaJob(form: AlbaJobFormData): Promise<{ jobId: string }> {
  try {
    const res = await fetch(`${API_BASE}/alba/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(form),
    });

    if (res.ok) {
      return res.json();
    }
  } catch {
    console.warn('Alba job create API not reachable');
  }

  // 백엔드 미연결 시 목 응답 / Mock response when not connected
  return { jobId: 'mock-' + Date.now() };
}

/** 목 비자 매칭 결과 (백엔드 미연결 시) / Mock visa matching result (when backend unavailable) */
const MOCK_VISA_RESULT: AlbaVisaMatchingResponse = {
  eligible: [
    {
      visaCode: 'F-5',
      visaName: '영주',
      visaNameEn: 'Permanent Residence',
      status: 'eligible',
      conditions: [],
      blockReasons: [],
      requiredPermit: null,
      maxWeeklyHours: null,
      maxWorkplaces: null,
      notes: '내국인과 동일한 취업 권리',
    },
    {
      visaCode: 'F-6',
      visaName: '결혼이민',
      visaNameEn: 'Marriage Immigration',
      status: 'eligible',
      conditions: [],
      blockReasons: [],
      requiredPermit: null,
      maxWeeklyHours: null,
      maxWorkplaces: null,
      notes: '내국인과 동일한 취업 권리',
    },
    {
      visaCode: 'H-1',
      visaName: '워킹홀리데이',
      visaNameEn: 'Working Holiday',
      status: 'eligible',
      conditions: [],
      blockReasons: [],
      requiredPermit: null,
      maxWeeklyHours: null,
      maxWorkplaces: null,
      notes: '체류기간 최대 1년, 18~30세 대상',
    },
    {
      visaCode: 'H-2',
      visaName: '방문취업',
      visaNameEn: 'Visit & Employment',
      status: 'eligible',
      conditions: [
        '[특례고용허가] 내국인 구인 14일 → 특례고용가능확인서 발급 → 구직자명부 등록자만 채용',
      ],
      blockReasons: [],
      requiredPermit: '특례고용가능확인서',
      maxWeeklyHours: null,
      maxWorkplaces: null,
      notes: null,
    },
  ],
  conditional: [
    {
      visaCode: 'D-2',
      visaName: '유학',
      visaNameEn: 'Study Abroad',
      status: 'conditional',
      conditions: [
        'TOPIK 충족 필요 (학년별 다름)',
        '최대 2개 사업장',
        '[거리제한] 수도권 90분 / 비수도권 60분',
      ],
      blockReasons: [],
      requiredPermit: '체류자격외활동허가',
      maxWeeklyHours: 20,
      maxWorkplaces: 2,
      notes: '[학기 중] 토·공휴일 무제한 | [방학 중] TOPIK 충족 시 무제한',
    },
    {
      visaCode: 'D-4',
      visaName: '어학연수',
      visaNameEn: 'Language Training',
      status: 'conditional',
      conditions: [
        'TOPIK 2급 이상 + 출석률 90% 이상',
        '입국 후 6개월 경과 필요',
        '1개 사업장만 허용',
      ],
      blockReasons: [],
      requiredPermit: '체류자격외활동허가',
      maxWeeklyHours: 20,
      maxWorkplaces: 1,
      notes: '방학·공휴일 포함 주 20시간 (무제한 아님)',
    },
    {
      visaCode: 'F-4',
      visaName: '재외동포',
      visaNameEn: 'Overseas Korean',
      status: 'conditional',
      conditions: [
        '단순노무 제한 (일부 업종 예외)',
      ],
      blockReasons: [],
      requiredPermit: null,
      maxWeeklyHours: null,
      maxWorkplaces: null,
      notes: '2024년 음식점 조리 보조원 예외 확대',
    },
  ],
  blocked: [
    {
      visaCode: 'D-10',
      visaName: '구직',
      visaNameEn: 'Job Seeking',
      status: 'blocked',
      conditions: [],
      blockReasons: [
        'D-10 비자는 단순노무 알바 불가 — 전문직종 인턴만 가능',
      ],
      requiredPermit: null,
      maxWeeklyHours: null,
      maxWorkplaces: null,
      notes: null,
    },
  ],
  summary: {
    totalEligible: 4,
    totalConditional: 3,
    totalBlocked: 1,
  },
  matchedAt: new Date().toISOString(),
  inputSummary: {
    jobCategoryCode: 'REST_SERVING',
    ksicCode: 'I',
    weeklyHours: 20,
    isWeekendOnly: false,
    hasWeekdayShift: true,
    isDepopulationArea: false,
  },
};
