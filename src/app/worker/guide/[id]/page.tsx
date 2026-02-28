'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';

type InfoCategory =
  | 'VISA_INFO'
  | 'EDUCATION'
  | 'LIVING_TIPS'
  | 'POLICY_LAW'
  | 'ANNOUNCEMENTS';

const CATEGORY_LABELS: Record<InfoCategory, string> = {
  VISA_INFO: '비자 정보',
  EDUCATION: '교육',
  LIVING_TIPS: '생활 정보',
  POLICY_LAW: '정책·법령',
  ANNOUNCEMENTS: '공지사항',
};

const CATEGORY_COLORS: Record<InfoCategory, string> = {
  VISA_INFO: 'bg-blue-100 text-blue-700',
  EDUCATION: 'bg-green-100 text-green-700',
  LIVING_TIPS: 'bg-yellow-100 text-yellow-700',
  POLICY_LAW: 'bg-purple-100 text-purple-700',
  ANNOUNCEMENTS: 'bg-red-100 text-red-700',
};

interface PostDetail {
  id: number;
  title: string;
  category: InfoCategory;
  content: string;
  thumbnail?: string;
  createdAt: string;
}

const MOCK_DETAIL: Record<number, PostDetail> = {
  1: {
    id: 1, title: '외국인 등록증(ARC) 발급 완벽 가이드', category: 'VISA_INFO',
    createdAt: '2025-02-01T00:00:00Z',
    content: `■ 외국인 등록증이란?
한국에 90일 이상 체류하는 모든 외국인은 반드시 외국인 등록증(Alien Registration Card, ARC)을 발급받아야 합니다. 은행 계좌 개설, 핸드폰 개통, 건강보험 가입 등 한국 생활의 기본입니다.

■ 신청 기한
입국일로부터 90일 이내에 반드시 신청해야 합니다. 기한을 넘기면 과태료가 부과됩니다.

■ 신청 장소
거주지 관할 출입국·외국인관서 (Immigration Office)
- 하이코리아(Hi Korea) 홈페이지에서 사전 예약 가능
- 예약 없이 방문 시 대기 시간이 길 수 있습니다

■ 필요 서류
1. 여권 원본
2. 컬러 사진 1매 (3.5cm × 4.5cm)
3. 수수료 3만원
4. 체류지 증명서류 (임대차계약서 또는 숙소제공확인서)
5. 재직증명서 또는 사업자등록증 사본 (취업 비자의 경우)

■ 발급 소요 시간
접수 후 약 2~3주 소요. 발급 전까지 접수증으로 신분 증명 가능합니다.

■ 주의사항
- 주소 변경 시 14일 이내에 전입 신고 필요
- 분실 시 즉시 재발급 신청 (수수료 3만원)
- 외국인 등록증은 항상 소지하세요`,
  },
  2: {
    id: 2, title: '한국 은행 계좌 개설 방법 (외국인)', category: 'LIVING_TIPS',
    createdAt: '2025-01-28T00:00:00Z',
    content: `■ 외국인도 한국에서 은행 계좌를 개설할 수 있습니다

급여 수령, 월세 이체, 온라인 결제 등을 위해 한국 은행 계좌가 필요합니다.

■ 필요 서류
1. 여권 원본
2. 외국인 등록증 (ARC)
3. 재직증명서 또는 근로계약서 (급여 계좌 개설 시)

■ 추천 은행
- 하나은행 (Hana Bank): 다국어 앱 지원, 외국인 전용 창구
- 우리은행 (Woori Bank): 외국인 근로자 특화 서비스
- 신한은행 (Shinhan Bank): 영어/중국어/베트남어 지원
- IBK기업은행: 외국인 근로자 급여 이체 수수료 우대

■ 개설 절차
1. 은행 영업시간(09:00~16:00) 내 방문
2. 번호표 뽑고 대기 → "계좌 개설" 창구
3. 서류 제출 + 본인 확인
4. 체크카드 발급 (즉시 또는 1~2주 후 수령)
5. 모바일 뱅킹 앱 설치 및 등록

■ 주의사항
- 입국 후 일정 기간(보통 6개월)이 지나야 비대면 이체 한도가 올라갑니다
- 체크카드 비밀번호 4자리는 반드시 기억하세요
- 해외 송금은 별도 신청 필요 (은행 창구 또는 센디, 웨스턴유니온 등)`,
  },
  3: {
    id: 3, title: '외국인 핸드폰 개통 가이드 (선불/후불)', category: 'LIVING_TIPS',
    createdAt: '2025-01-25T00:00:00Z',
    content: `■ 한국에서 핸드폰 개통하기

한국 생활에서 핸드폰은 필수입니다. 교통카드, 은행 인증, 배달 앱 등 모든 서비스에 필요합니다.

■ 선불폰 (Prepaid SIM)
- 외국인 등록증 없이도 여권만으로 개통 가능
- 편의점(CU, GS25)이나 공항에서 구매
- 데이터 1~10GB 요금제 선택
- 추천: 한국선불폰, 에브리폰, 모요(Moyo)

■ 후불폰 (Postpaid Plan)
필요 서류:
1. 여권 원본
2. 외국인 등록증
3. 은행 계좌 (자동이체용)
4. 재직증명서 (통신사에 따라)

추천 통신사:
- SKT: 가장 넓은 커버리지
- KT: 안정적인 속도
- LG U+: 가성비 좋은 요금제
- 알뜰폰 (MVNO): 월 2~3만원대 저렴한 요금제

■ 개통 장소
- 통신사 대리점 (SK/KT/LG 간판이 있는 매장)
- 대형마트 내 통신 코너
- 온라인 개통 (일부 알뜰폰)

■ 팁
- 약정 없는 요금제를 추천합니다 (체류 기간에 따라 유동적)
- 와이파이만 필요하면 포켓 와이파이 대여도 방법
- 핸드폰 번호는 은행, 보험, 고용센터 등 모든 곳에 등록하세요`,
  },
  4: {
    id: 4, title: '외국인 건강보험 가입 안내', category: 'LIVING_TIPS',
    createdAt: '2025-01-20T00:00:00Z',
    content: `■ 한국 건강보험 제도

한국에서 일하는 외국인도 건강보험에 가입해야 합니다. 병원비의 약 70%를 건강보험이 부담합니다.

■ 직장가입자 (회사에서 가입)
- 고용주가 자동으로 가입 처리
- 보험료: 월급의 약 3.5% (본인 부담), 나머지 3.5%는 회사 부담
- 입사일부터 적용

■ 지역가입자 (자영업·무직)
- 출입국관리사무소에서 외국인 등록 후 자동 가입
- 보험료: 월 약 13만원 (소득에 따라 다름)
- 입국 후 6개월 경과 시 의무 가입

■ 병원 이용 방법
1. 병원 접수 시 외국인 등록증 제시
2. 건강보험 적용 여부 확인
3. 본인부담금만 결제 (보통 30%)
4. 처방전을 받아 약국에서 약 구매

■ 응급 상황
- 119에 전화 (무료, 통역 서비스 가능)
- 응급실은 건강보험 적용됨
- 1345 외국인종합안내센터 (다국어 상담)

■ 주의사항
- 보험료 3개월 이상 체납 시 급여 정지
- 퇴사 시 직장가입 → 지역가입으로 자동 전환
- 치과·한방·미용은 일부 항목만 보험 적용`,
  },
  5: {
    id: 5, title: '한국어 무료 교육 프로그램 총정리', category: 'EDUCATION',
    createdAt: '2025-01-18T00:00:00Z',
    content: `■ 외국인을 위한 무료 한국어 교육

한국어 능력은 취업, 비자 연장, 일상생활 모든 곳에서 필요합니다. 정부와 지자체에서 다양한 무료 교육을 제공합니다.

■ 세종학당 (King Sejong Institute)
- 전 세계 + 국내 운영
- 초급~고급 과정
- 온라인 수업 가능 (iksi.or.kr)
- 수료증 발급

■ 사회통합프로그램 (KIIP)
- 법무부 운영, 비자 연장 시 가점
- 0단계(기초)~5단계(한국사회이해)
- 사전평가로 단계 배정
- 이수 시 귀화·영주권 신청 시 시험 면제
- 신청: socinet.go.kr

■ 고용센터 한국어 교육
- 고용노동부 운영
- 주로 E-9, H-2 비자 대상
- 직장 생활에 필요한 실용 한국어
- 가까운 고용센터에 문의

■ 다문화가족지원센터
- 여성가족부 운영
- 결혼이민자 + 외국인 주민 대상
- 한국어·한국문화 교육
- 전국 230여 개소

■ EPS-TOPIK 준비
- 고용허가제(E-9) 취업을 위한 한국어 시험
- 한국산업인력공단에서 시행
- 무료 학습 교재: eps.hrdkorea.or.kr`,
  },
  6: {
    id: 6, title: '비자 연장·변경 절차 안내', category: 'VISA_INFO',
    createdAt: '2025-01-15T00:00:00Z',
    content: `■ 비자 연장 (체류기간 연장)

현재 비자의 체류 기간을 늘리고 싶을 때 신청합니다.

■ 신청 시기
- 만료일 4개월 전 ~ 만료일까지
- 가급적 2개월 전에 신청하세요 (심사 기간 고려)

■ 신청 장소
- 하이코리아(hikorea.go.kr) 온라인 신청
- 또는 관할 출입국·외국인관서 방문

■ 공통 필요 서류
1. 신청서 (출입국관리사무소 비치 또는 온라인 다운로드)
2. 여권 원본
3. 외국인 등록증
4. 수수료 6만원
5. 컬러 사진 1매

■ 비자별 추가 서류
- E-9 (비전문취업): 표준근로계약서, 사업자등록증 사본
- H-2 (방문취업): 취업확인서
- F-4 (재외동포): 국적 관련 서류
- E-7 (전문인력): 고용계약서, 학력/경력 증명

■ 비자 변경 (체류자격 변경)
다른 종류의 비자로 바꾸고 싶을 때:
- E-9 → F-2(거주) 전환: 일정 기간 체류 + 점수제 충족
- D-10(구직) → E-7(전문인력): 고용 계약 체결 후
- 변경 수수료: 10만원

■ 주의사항
- 체류기간 초과(오버스테이) 시 벌금 + 출국 명령
- 비자 상태를 항상 확인하세요
- 1345 외국인종합안내센터에서 상담 가능`,
  },
  7: {
    id: 7, title: '근로계약서 체크리스트 — 서명 전 필독', category: 'POLICY_LAW',
    createdAt: '2025-01-10T00:00:00Z',
    content: `■ 근로계약서란?

한국에서 일을 시작하기 전에 반드시 근로계약서를 작성해야 합니다. 이것은 법으로 정해진 의무입니다.

■ 서명 전 반드시 확인할 7가지

1. 임금 (급여)
   - 기본급이 최저임금 이상인지 확인
   - 주휴수당 포함 여부
   - 야근·휴일 수당 기준

2. 근무시간
   - 1일 8시간, 주 40시간 기본
   - 연장근로 합의 여부 및 수당

3. 휴일·휴가
   - 주 1일 이상 유급 휴일
   - 연차 유급휴가 (1년 근무 시 15일)

4. 계약 기간
   - 시작일과 종료일 명시
   - 수습 기간 조건

5. 근무 장소 및 업무 내용
   - 실제 근무할 장소와 일치하는지 확인
   - 업무 범위가 명확한지

6. 숙소·식사 제공
   - 제공 시 급여에서 공제 금액
   - 공제 한도 확인 (법정 한도 있음)

7. 해고·퇴직 조건
   - 부당 해고 시 구제 방법
   - 퇴직금 지급 기준 (1년 이상 근무 시)

■ 반드시 한국어 + 모국어 계약서를 받으세요
- 표준근로계약서 양식 사용 권장
- 이해할 수 없는 조항이 있으면 서명하지 마세요
- 외국인력지원센터(1644-0644)에서 무료 상담 가능

■ 문제가 있을 때
- 고용노동부 상담센터: 1350
- 외국인력지원센터: 1644-0644
- 법률 구조공단: 132 (무료 법률 상담)`,
  },
  8: {
    id: 8, title: '최저임금 & 급여 계산 가이드 (2025)', category: 'POLICY_LAW',
    createdAt: '2025-01-05T00:00:00Z',
    content: `■ 2025년 최저임금

시급: 9,860원
일급 (8시간): 78,880원
월급 (주 40시간, 주휴수당 포함): 2,060,740원

■ 주휴수당이란?

1주 15시간 이상 근무하고, 개근한 경우 1일분의 추가 임금을 받습니다.
- 주 5일, 하루 8시간 근무 시: 78,880원 추가
- 알바(파트타임)도 주 15시간 이상이면 해당

■ 급여 계산 예시

1. 주 40시간 정규직
   - 기본급: 9,860원 × 209시간 = 2,060,740원/월
   - 209시간 = (주 40시간 + 주휴 8시간) × 4.345주

2. 주 30시간 파트타임
   - 기본급: 9,860원 × 30시간 × 4.345주 = 1,285,410원/월
   - 주휴수당: 9,860원 × 6시간 × 4.345주 = 257,082원/월

■ 급여에서 공제되는 항목
- 국민연금: 4.5%
- 건강보험: 3.545%
- 장기요양보험: 건강보험의 12.81%
- 고용보험: 0.9%
- 소득세 + 지방소득세
- 숙소·식사 제공 시 공제 (법정 한도 내)

■ 급여일
- 매월 정해진 날짜에 지급 (계약서에 명시)
- 1개월에 1회 이상 지급 의무
- 퇴직 시 14일 이내 정산 지급

■ 급여 미지급 시
- 고용노동부 진정 (1350)
- 체불임금 무료 구제 서비스
- 외국인도 동일하게 보호받습니다`,
  },
};

export default function WorkerGuideDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/info-board/${id}`);
        if (res.ok) {
          const json = await res.json();
          // SuccessTransformInterceptor 래퍼 처리 / Handle wrapper
          const payload = json.data || json;
          if (!cancelled) setPost(payload);
          return;
        }
      } catch {
        // fall through
      }
      if (cancelled) return;
      const mock = MOCK_DETAIL[id];
      if (mock) {
        setPost(mock);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    };

    fetchPost().finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6 space-y-4">
        <div className="h-8 w-24 bg-gray-100 rounded-lg animate-pulse" />
        <div className="h-12 bg-gray-100 rounded-xl animate-pulse" />
        <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center py-16">
        <p className="text-gray-400 text-lg">게시글을 찾을 수 없습니다.</p>
        <button
          onClick={() => router.push('/worker/guide')}
          className="mt-4 text-blue-600 hover:underline text-sm"
        >
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <button
        onClick={() => router.push('/worker/guide')}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        목록으로 돌아가기
      </button>

      <article className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-4">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-gray-400" />
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${CATEGORY_COLORS[post.category]}`}
          >
            {CATEGORY_LABELS[post.category]}
          </span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 leading-tight">{post.title}</h1>

        <div className="flex items-center gap-1.5 text-sm text-gray-400 pb-4 border-b border-gray-100">
          <Calendar className="w-4 h-4" />
          <span>
            {new Date(post.createdAt).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>

        {post.thumbnail && (
          <div className="w-full rounded-xl overflow-hidden">
            <img
              src={post.thumbnail}
              alt={post.title}
              className="w-full object-cover max-h-80"
            />
          </div>
        )}

        <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </div>
      </article>

      <div className="flex justify-center">
        <button
          onClick={() => router.push('/worker/guide')}
          className="flex items-center gap-2 px-6 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          목록으로 돌아가기
        </button>
      </div>
    </div>
  );
}
