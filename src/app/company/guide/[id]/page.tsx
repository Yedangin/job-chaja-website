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
    id: 1,
    title: 'E-9 비자 갱신 방법 안내',
    category: 'VISA_INFO',
    content:
      'E-9 비자 갱신을 위해서는 만료일 4개월 전에 신청하셔야 합니다.\n\n필요 서류:\n- 외국인등록증\n- 여권\n- 재직증명서\n- 표준근로계약서\n\n자세한 내용은 가까운 출입국사무소에 문의하세요.',
    createdAt: '2025-01-15T00:00:00Z',
  },
  2: {
    id: 2,
    title: '한국어 교육 지원 프로그램',
    category: 'EDUCATION',
    content:
      '정부에서는 외국인 근로자를 위한 한국어 교육을 무료로 지원합니다.\n\n교육 기관:\n- 고용센터 한국어 교실\n- 다문화가족지원센터\n- 외국인력지원센터\n\n신청 방법: 가까운 고용센터를 방문하여 신청하시면 됩니다.',
    createdAt: '2025-01-10T00:00:00Z',
  },
};

export default function CompanyGuideDetailPage() {
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
          const data = await res.json();
          if (!cancelled) setPost(data);
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
          onClick={() => router.push('/company/guide')}
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
        onClick={() => router.push('/company/guide')}
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
          onClick={() => router.push('/company/guide')}
          className="flex items-center gap-2 px-6 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          목록으로 돌아가기
        </button>
      </div>
    </div>
  );
}
