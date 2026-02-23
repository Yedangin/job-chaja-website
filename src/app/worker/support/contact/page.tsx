'use client';

/**
 * 1:1 고객 문의 / Customer support ticket
 */

import { useState } from 'react';
import { MessageSquare, Loader2, Check, ChevronDown } from 'lucide-react';

const CATEGORIES = [
  '계정/로그인 문제',
  '비자 정보 오류',
  '공고 관련 문의',
  '결제/환불 문의',
  '서비스 이용 문의',
  '기타',
];

export default function WorkerSupportContactPage() {
  const [category, setCategory] = useState('');
  const [title, setTitle]       = useState('');
  const [content, setContent]   = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('제목과 내용을 모두 입력해주세요.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const sessionId = localStorage.getItem('sessionId');
      const fullTitle = category ? `[${category}] ${title.trim()}` : title.trim();
      const res = await fetch('/api/auth/support-ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(sessionId ? { Authorization: `Bearer ${sessionId}` } : {}),
        },
        body: JSON.stringify({ title: fullTitle, content: content.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || '문의 등록에 실패했습니다.');
      setSuccess(true);
      setTitle('');
      setContent('');
      setCategory('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '문의 등록에 실패했습니다.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">1:1 고객 문의</h1>
        <p className="text-sm text-gray-500 mt-0.5">Customer Support</p>
      </div>

      {success ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">문의가 접수되었습니다</h3>
          <p className="text-sm text-gray-500 mb-6">
            영업일 기준 1~2일 내에 이메일로 답변드립니다.<br />
            We will reply within 1-2 business days.
          </p>
          <button
            type="button"
            onClick={() => setSuccess(false)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            추가 문의하기 / Submit another inquiry
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6 p-4 bg-blue-50 rounded-xl">
            <MessageSquare className="w-5 h-5 text-blue-600 shrink-0" />
            <p className="text-sm text-blue-800">
              평균 응답 시간: 영업일 기준 1~2일 / Avg. response: 1-2 business days
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 카테고리 / Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                문의 유형 <span className="text-gray-400 font-normal">/ Category</span>
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white"
                >
                  <option value="">선택해주세요 (선택사항)</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* 제목 / Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                제목 <span className="text-gray-400 font-normal">/ Title</span>
                <span className="text-red-500 ml-0.5">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
                placeholder="문의 제목을 입력하세요"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>

            {/* 내용 / Content */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                내용 <span className="text-gray-400 font-normal">/ Content</span>
                <span className="text-red-500 ml-0.5">*</span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                maxLength={2000}
                placeholder="문의 내용을 자세히 적어주세요."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{content.length} / 2000</p>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white text-sm font-semibold rounded-xl transition flex items-center justify-center gap-2"
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> 제출 중...</>
              ) : (
                '문의 제출하기 / Submit'
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
