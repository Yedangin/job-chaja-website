# 게시판 + 슬라이더 통합 시스템 아키텍처

## 1. 데이터 흐름 (Data Flow)

```
백엔드 DB (Posts)
    ↓
/api/info-board?limit=100
    ↓
┌─────────────────────────┐
│ Posts 데이터 (8개)       │
└─────────────────────────┘
    ↓                  ↓
Board List Page    Banner Slider
(전체 표시)         (Top 5 순환)
```

## 2. 데이터 구조

### Posts 응답 형식 (기존)
```json
{
  "status": "OK",
  "data": {
    "items": [
      {
        "id": 1,
        "title": "게시글 제목",
        "category": "POLICY_LAW",
        "createdAt": "2026-02-28T00:33:29.173Z",
        "viewCount": 100
      }
    ],
    "total": 8
  }
}
```

### Banner 데이터 (동적 변환)
```typescript
interface BannerItem {
  id: number;
  bg: string;              // 카테고리별 색상
  textColor: string;
  accentBg: string;
  accentText: string;
  tag: string;             // 카테고리 표시명
  icon: React.ReactNode;
  title: string;           // posts.title
  desc: string;            // posts.category + date
  cta: string;             // "읽기"
  href: string;            // /board/posts{id}
  postId: number;          // posts.id
}
```

## 3. 카테고리별 색상 매핑

```typescript
const CATEGORY_COLORS = {
  POLICY_LAW: {
    bg: 'bg-gradient-to-r from-[#0052CC] to-[#0066FF]',
    accentBg: 'bg-white/20',
    tag: '정책·법령',
    icon: AlertCircle
  },
  VISA_INFO: {
    bg: 'bg-gradient-to-r from-[#1A1A2E] to-[#16213E]',
    accentBg: 'bg-[#FE9800]/20',
    tag: '비자정보',
    icon: FileText
  },
  EDUCATION: {
    bg: 'bg-gradient-to-r from-[#0D4F3C] to-[#03B26C]',
    accentBg: 'bg-white/20',
    tag: '교육',
    icon: GraduationCap
  },
  LIVING_TIPS: {
    bg: 'bg-gradient-to-r from-[#5B21B6] to-[#7C3AED]',
    accentBg: 'bg-white/20',
    tag: '생활팁',
    icon: Home
  }
};
```

## 4. 컴포넌트 변경

### Banner-Slider (동적 로드)
- [x] Posts API에서 데이터 받기
- [x] 색상 매핑으로 배너 생성
- [x] href를 /board/posts{id}로 설정
- [x] Top 5 포스트만 표시 (회전)

### Posts 페이지 (슬라이더 통합)
- [x] "Featured" 섹션에 슬라이더의 Top 5 강조
- [x] 일반 목록과 함께 표시
- [x] 같은 데이터 소스 사용

## 5. 재사용 가능한 유틸 함수

```typescript
// utils/post-to-banner.ts
export const convertPostsToBanners = (posts: Post[]): BannerItem[] => {
  return posts.slice(0, 5).map(post => ({
    id: post.id,
    ...CATEGORY_COLORS[post.category],
    title: post.title,
    desc: `${CATEGORY_MAP[post.category].label} • ${formatDate(post.createdAt)}`,
    cta: '읽기',
    href: `/board/posts${post.id}`,
    postId: post.id,
  }));
};
```

## 6. 파일 구조

```
src/
├── components/
│   ├── banner-slider.tsx          (수정: 동적 로드)
│   ├── footer.tsx                 (확인: 법인주소 ✓)
│   ├── header.tsx                 (확인: 네비게이션)
│   └── ...
├── app/
│   ├── board/
│   │   └── posts/
│   │       └── page.tsx          (수정: Featured 섹션 추가)
│   └── page.tsx                  (확인: 슬라이더 import)
├── utils/
│   └── post-to-banner.ts         (신규: 변환 함수)
└── constants/
    └── category-colors.ts         (신규: 색상 맵)
```

## 7. 마이그레이션 체크리스트

- [ ] CATEGORY_COLORS 상수 정의
- [ ] post-to-banner 유틸 함수 작성
- [ ] banner-slider.tsx 동적 로드 구현
- [ ] posts/page.tsx Featured 섹션 추가
- [ ] 로컬/AWS 모두 테스트
- [ ] PlayWright 검증
