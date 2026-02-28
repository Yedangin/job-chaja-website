'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trash2, Plus, RefreshCw, FileText, Eye, Star, StarOff } from 'lucide-react';

/**
 * 어드민 — 한국 생활 가이드 관리 페이지
 * Admin — Info board (guide) management page
 *
 * 기능: 게시글 CRUD + 메인 슬라이더 연결(pinned) 관리
 * Features: Post CRUD + main slider pinned post management
 */

type InfoCategory = 'VISA_INFO' | 'EDUCATION' | 'LIVING_TIPS' | 'POLICY_LAW' | 'ANNOUNCEMENTS';

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

export default function AdminGuidePage() {
  const [posts, setPosts] = useState<InfoPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [form, setForm] = useState({
    title: '',
    content: '',
    category: 'VISA_INFO' as InfoCategory,
    thumbnail: '',
  });

  /* httpOnly 쿠키 기반 인증 — credentials: 'include' 사용 */
  /* httpOnly cookie-based auth — use credentials: 'include' */
  const fetchApi = async (url: string, options: RequestInit = {}) => {
    return fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...((options.headers as Record<string, string>) || {}),
      },
    });
  };

  const loadPosts = async () => {
    setLoading(true);
    try {
      const res = await fetchApi('/api/info-board?limit=50');
      if (res.ok) {
        const json = await res.json();
        // SuccessTransformInterceptor 래퍼 처리 / Handle wrapper
        const payload = json.data || json;
        setPosts(payload.items || []);
      }
    } catch {
      // API 실패 시 빈 배열 유지 / Keep empty on failure
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setError('제목과 내용을 입력해주세요.');
      return;
    }
    setSubmitting(true);
    setError('');
    setSuccessMsg('');
    try {
      const body: Record<string, string> = {
        title: form.title.trim(),
        content: form.content.trim(),
        category: form.category,
      };
      if (form.thumbnail.trim()) body.thumbnail = form.thumbnail.trim();

      const res = await fetchApi('/api/info-board', {
        method: 'POST',
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setSuccessMsg('게시글이 성공적으로 등록되었습니다.');
        setForm({ title: '', content: '', category: 'VISA_INFO', thumbnail: '' });
        await loadPosts();
      } else {
        const json = await res.json();
        const payload = json.data || json;
        setError(payload.message || '등록에 실패했습니다.');
      }
    } catch {
      setError('서버 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`"${title}" 게시글을 삭제하시겠습니까?`)) return;
    try {
      const res = await fetchApi(`/api/info-board/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSuccessMsg('게시글이 삭제되었습니다.');
        setPosts((prev) => prev.filter((p) => p.id !== id));
      } else {
        const json = await res.json();
        const payload = json.data || json;
        setError(payload.message || '삭제에 실패했습니다.');
      }
    } catch {
      setError('서버 오류가 발생했습니다.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* 헤더 / Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="w-7 h-7 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">한국 생활 가이드 관리</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              게시글 작성 후 메인 슬라이더와 연결하세요
            </p>
          </div>
        </div>
        <Link
          href="/worker/guide"
          className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          <Eye className="w-4 h-4" />
          사용자 뷰 보기
        </Link>
      </div>

      {/* 안내 배너 / Info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <p className="font-semibold mb-1">메인 슬라이더 연결 방법</p>
        <p className="text-blue-600">
          게시글 작성 후 → 메인 페이지 슬라이더에 표시하려면 hero-section.tsx의 slides 배열에
          해당 게시글 ID와 제목을 추가하세요. 게시글 ID는 아래 목록에서 확인할 수 있습니다.
          <br />
          예: <code className="bg-blue-100 px-1 rounded">href: &apos;/worker/guide/9&apos;</code> → 새 게시글 #9와 연결
        </p>
      </div>

      {/* 작성 폼 / Create Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-blue-500" />
          새 게시글 작성
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                카테고리 *
              </label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value as InfoCategory })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                썸네일 URL (선택)
              </label>
              <input
                type="url"
                value={form.thumbnail}
                onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
                placeholder="https://..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              제목 *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="게시글 제목을 입력하세요"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              내용 *
            </label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="게시글 내용을 입력하세요 (■ 로 소제목 구분)"
              rows={10}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              {submitting ? '등록 중...' : '게시글 등록'}
            </button>
          </div>
        </form>
      </div>

      {/* 게시글 목록 / Posts List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            등록된 게시글 ({posts.length}개)
          </h2>
          <button
            onClick={loadPosts}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            새로고침
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-500">로딩 중...</span>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>등록된 게시글이 없습니다.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-2 font-medium text-gray-500 w-12">ID</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">제목</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500 w-28">카테고리</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500 w-28">등록일</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500 w-20">슬라이더</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-500 w-16">삭제</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr
                    key={post.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-2 text-gray-400 font-mono">#{post.id}</td>
                    <td className="py-3 px-2">
                      <Link
                        href={`/worker/guide/${post.id}`}
                        className="font-medium text-gray-800 hover:text-blue-600 transition-colors"
                      >
                        {post.title}
                      </Link>
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORY_COLORS[post.category]}`}
                      >
                        {CATEGORY_LABELS[post.category]}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="py-3 px-2">
                      {post.id <= 8 ? (
                        <span className="flex items-center gap-1 text-amber-500" title="메인 슬라이더에 표시중">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span className="text-xs">연결됨</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-gray-300" title="슬라이더 미연결">
                          <StarOff className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-2 text-right">
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        title="삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
