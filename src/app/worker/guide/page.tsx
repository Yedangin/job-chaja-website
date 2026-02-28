'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, BookOpen, ChevronRight, ChevronLeft } from 'lucide-react';

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

interface InfoPost {
  id: number;
  title: string;
  category: InfoCategory;
  thumbnail?: string;
  createdAt: string;
}

const MOCK_POSTS: InfoPost[] = [
  { id: 1, title: '외국인 등록증(ARC) 발급 완벽 가이드', category: 'VISA_INFO', createdAt: '2025-02-01T00:00:00Z' },
  { id: 2, title: '한국 은행 계좌 개설 방법 (외국인)', category: 'LIVING_TIPS', createdAt: '2025-01-28T00:00:00Z' },
  { id: 3, title: '외국인 핸드폰 개통 가이드 (선불/후불)', category: 'LIVING_TIPS', createdAt: '2025-01-25T00:00:00Z' },
  { id: 4, title: '외국인 건강보험 가입 안내', category: 'LIVING_TIPS', createdAt: '2025-01-20T00:00:00Z' },
  { id: 5, title: '한국어 무료 교육 프로그램 총정리', category: 'EDUCATION', createdAt: '2025-01-18T00:00:00Z' },
  { id: 6, title: '비자 연장·변경 절차 안내', category: 'VISA_INFO', createdAt: '2025-01-15T00:00:00Z' },
  { id: 7, title: '근로계약서 체크리스트 — 서명 전 필독', category: 'POLICY_LAW', createdAt: '2025-01-10T00:00:00Z' },
  { id: 8, title: '최저임금 & 급여 계산 가이드 (2025)', category: 'POLICY_LAW', createdAt: '2025-01-05T00:00:00Z' },
];

const ITEMS_PER_PAGE = 6;

export default function WorkerGuidePage() {
  const [posts, setPosts] = useState<InfoPost[]>(MOCK_POSTS);
  const [activeCategory, setActiveCategory] = useState<InfoCategory | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(MOCK_POSTS.length);
  const [loading, setLoading] = useState(false);

  const categories: Array<InfoCategory | 'ALL'> = [
    'ALL', 'VISA_INFO', 'EDUCATION', 'LIVING_TIPS', 'POLICY_LAW', 'ANNOUNCEMENTS',
  ];

  useEffect(() => {
    let cancelled = false;

    const fetchPosts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (activeCategory !== 'ALL') params.set('category', activeCategory);
        if (search) params.set('search', search);
        params.set('page', String(page));
        params.set('limit', String(ITEMS_PER_PAGE));

        const res = await fetch(`/api/info-board?${params.toString()}`);
        if (res.ok) {
          const json = await res.json();
          // SuccessTransformInterceptor 래퍼 처리 / Handle wrapper
          const payload = json.data || json;
          if (!cancelled) {
            setPosts(payload.items || []);
            setTotal(payload.total || 0);
          }
          return;
        }
      } catch {
        // fall through to mock data
      }
      if (cancelled) return;
      // Fallback to mock data
      let filtered = MOCK_POSTS;
      if (activeCategory !== 'ALL') filtered = filtered.filter((p) => p.category === activeCategory);
      if (search) filtered = filtered.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));
      setTotal(filtered.length);
      const start = (page - 1) * ITEMS_PER_PAGE;
      setPosts(filtered.slice(start, start + ITEMS_PER_PAGE));
      setLoading(false);
    };

    fetchPosts().finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [activeCategory, search, page]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const handleCategoryChange = (cat: InfoCategory | 'ALL') => {
    setActiveCategory(cat);
    setPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <BookOpen className="w-7 h-7 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">한국 생활 가이드</h1>
          <p className="text-sm text-gray-500 mt-0.5">외국인 근로자를 위한 한국 생활 정보</p>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="궁금한 내용을 검색해보세요"
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
      </form>

      {/* Category Tabs */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat === 'ALL' ? '전체' : CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Post Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-2xl h-40 animate-pulse" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>검색 결과가 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/worker/guide/${post.id}`}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-blue-200 transition-all group"
            >
              {post.thumbnail && (
                <div className="w-full h-32 rounded-xl overflow-hidden mb-3 bg-gray-100">
                  <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-2 ${CATEGORY_COLORS[post.category]}`}
                  >
                    {CATEGORY_LABELS[post.category]}
                  </span>
                  <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-400 mt-1 flex-shrink-0 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                page === p
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-200 hover:bg-gray-50 text-gray-600'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
