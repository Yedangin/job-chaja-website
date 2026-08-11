# JobChaja 5-Locale i18n QA Report

- 기준일: 2026-08-03
- 출시 locale: `ko`, `en`, `vi`, `th`, `fil`
- 호환 alias: `kr -> ko`, `tl -> fil`
- UI fallback: 요청 locale -> `en`
- 장문 콘텐츠 fallback: 요청 locale -> `en` -> `ko`
- 감사 명령: `node scripts/i18n-audit.mjs`

## 최종 결과

| 항목 | 결과 |
|---|---:|
| canonical catalog parity | PASS |
| locale별 canonical key | 143개, 누락 0, 추가 0 |
| launch source | 176개 |
| 후보가 남은 파일 | 138개 |
| 한국어 하드코딩 후보 | 2,259건 |
| 영어 하드코딩 후보 | 1,364건 |
| 고정 `ko-KR` | 54건 |
| 위험 marker | 4건 |
| 감사 종료코드 | `1` |
| `npm run typecheck:launch` | PASS |
| Next production build | PASS, static page 262개 |
| 공개 브라우저 QA | PASS 42/42 |
| 로그인 브라우저 QA | PASS 46/46 |

종료코드 `1`은 catalog 불일치가 아니라 출시 후보 전체의 문자열 전환이 아직 끝나지 않았다는 뜻이다. 현재 완성 판정은 이번 P0 세로 기능에만 적용하며 전체 웹 다국어 완료를 뜻하지 않는다.

## 그룹별 잔여 후보

| 그룹 | 영향 파일 / 검사 파일 | 한국어 | 영어 | `ko-KR` | 위험 marker |
|---|---:|---:|---:|---:|---:|
| admin | 3 / 6 | 496 | 156 | 38 | 0 |
| board | 2 / 12 | 2 | 0 | 0 | 0 |
| company | 71 / 81 | 853 | 613 | 8 | 4 |
| planner | 7 / 13 | 88 | 78 | 0 | 0 |
| public | 26 / 29 | 330 | 186 | 1 | 0 |
| worker | 29 / 35 | 490 | 331 | 7 | 0 |

## 완료된 P0 UI

- 공지·가이드 canonical 목록/상세와 관리자 CMS
- canonical 비자 플래너 입력·결과·상세·이력
- 작업자 이력서 공개 동의와 기업 인재 검색·북마크·열람
- 기업 공고 관리·상세, 알바·정규직 작성 폼
- worker/company 공통 메뉴·배너·모바일 탭

이 범위는 `ko/en/vi/th/fil` UI와 390px/768px/1440px 브라우저 검증을 통과했다. 기존 CMS seed 본문 중 한국어만 등록된 콘텐츠는 UI 번역과 별개로 운영 번역·검수해야 한다.

## 다음 배치 우선순위

1. `/admin/page.tsx`, 약관, 회원가입, 기업 인증
2. 작업자·기업 면접과 지원자 화면
3. 공개 알바·정규직 목록/상세와 worker 전용 목록/상세
4. 결제 화면은 paid gate를 유지한 상태에서 문구·오류만 준비
5. 정책·법률 본문은 자동 번역 직게시를 금지하고 출처·기준일·검수자를 저장

Luna에는 반복 문자열 전환과 viewport 회귀를 5~10개 파일 단위로 맡기고, Terra에는 복합 폼·반응형 상태, Sol에는 정책·권한·결제·감사 로직을 맡긴다.
