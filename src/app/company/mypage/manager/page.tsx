'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Loader2, Save, CheckCircle, AlertCircle, UserCog,
} from 'lucide-react';

/**
 * 담당자 정보 폼 타입 / Manager information form type
 */
interface ManagerForm {
  name: string;
  phone: string;
  email: string;
  position: string;
  department: string;
}

/**
 * API 응답에서 담당자 정보를 추출하는 타입 / Type for extracting manager info from API response
 */
interface ProfileDetailResponse {
  name?: string;
  phone?: string;
  email?: string;
  position?: string;
  department?: string;
}

/**
 * 담당자 정보 수정 페이지 / Manager information edit page
 * GET  /api/auth/my/profile-detail → 현재 정보 로드 / Load current info
 * PUT  /api/auth/my/profile        → 정보 저장 / Save info
 */
export default function ManagerPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /** 저장 결과 상태 / Save result state: null | 'success' | 'error' */
  const [saveStatus, setSaveStatus] = useState<'success' | 'error' | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const [form, setForm] = useState<ManagerForm>({
    name: '',
    phone: '',
    email: '',
    position: '',
    department: '',
  });

  /** 프로필 초기 로드 / Load profile on mount */
  useEffect(() => {
    const sessionId = typeof window !== 'undefined' ? localStorage.getItem('sessionId') : null;

    fetch('/api/auth/my/profile-detail', {
      headers: sessionId ? { Authorization: `Bearer ${sessionId}` } : {},
    })
      .then((r) => r.json())
      .then((data: ProfileDetailResponse) => {
        setForm({
          name: data.name ?? '',
          phone: data.phone ?? '',
          email: data.email ?? '',
          position: data.position ?? '',
          department: data.department ?? '',
        });
      })
      .catch(() => {
        /* 로드 실패 시 빈 폼 유지 / Keep empty form on load failure */
      })
      .finally(() => setLoading(false));
  }, []);

  /**
   * 입력 필드 변경 핸들러 / Input field change handler
   */
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // 저장 결과 초기화 / Reset save status on edit
    if (saveStatus) setSaveStatus(null);
  }

  /**
   * 폼 제출 (저장) / Form submit (save)
   * 이메일은 읽기 전용이므로 PUT body에서 제외 / Email is read-only; excluded from PUT body
   */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveStatus(null);
    setErrorMessage('');

    const sessionId = typeof window !== 'undefined' ? localStorage.getItem('sessionId') : null;

    try {
      const response = await fetch('/api/auth/my/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(sessionId ? { Authorization: `Bearer ${sessionId}` } : {}),
        },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          position: form.position,
          department: form.department,
        }),
      });

      if (response.ok) {
        setSaveStatus('success');
      } else {
        const data = await response.json().catch(() => ({}));
        setErrorMessage((data as { message?: string }).message ?? '저장에 실패했습니다.');
        setSaveStatus('error');
      }
    } catch {
      setErrorMessage('네트워크 오류가 발생했습니다.');
      setSaveStatus('error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* 페이지 헤더 / Page header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/company/mypage"
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
          aria-label="마이페이지로 돌아가기"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">담당자 정보</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manager Information</p>
        </div>
      </div>

      {/* 로딩 상태 / Loading state */}
      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-blue-500 animate-spin mr-3" />
          <span className="text-sm text-gray-500">정보를 불러오는 중...</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* 폼 헤더 아이콘 영역 / Form header icon area */}
            <div className="bg-linear-to-r from-blue-50 to-indigo-50 px-6 py-5 border-b border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <UserCog className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">담당자 연락처 및 직책 정보</p>
                <p className="text-xs text-gray-500">이메일은 변경할 수 없습니다.</p>
              </div>
            </div>

            {/* 폼 필드 영역 / Form fields area */}
            <div className="p-6 space-y-5">
              {/* 담당자명 / Manager name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                  담당자명 <span className="text-red-500">*</span>
                  <span className="text-gray-400 font-normal ml-1">· Manager Name</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="홍길동"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              {/* 연락처 / Phone number */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                  연락처 <span className="text-red-500">*</span>
                  <span className="text-gray-400 font-normal ml-1">· Phone Number</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="010-0000-0000"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              {/* 이메일 (읽기 전용) / Email (read-only) */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  이메일
                  <span className="text-gray-400 font-normal ml-1">· Email</span>
                  <span className="ml-2 px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-medium rounded">
                    읽기 전용
                  </span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  readOnly
                  tabIndex={-1}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-500 bg-gray-50 cursor-not-allowed"
                />
              </div>

              {/* 구분선 / Divider */}
              <div className="border-t border-gray-100 pt-2">
                <p className="text-xs text-gray-400 mb-3">선택 정보 · Optional</p>
              </div>

              {/* 직책 / Position */}
              <div>
                <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1.5">
                  직책
                  <span className="text-gray-400 font-normal ml-1">· Position</span>
                </label>
                <input
                  id="position"
                  name="position"
                  type="text"
                  value={form.position}
                  onChange={handleChange}
                  placeholder="예: 인사담당자, 채용 매니저"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              {/* 부서 / Department */}
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1.5">
                  부서
                  <span className="text-gray-400 font-normal ml-1">· Department</span>
                </label>
                <input
                  id="department"
                  name="department"
                  type="text"
                  value={form.department}
                  onChange={handleChange}
                  placeholder="예: 인사팀, HR팀"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* 저장 결과 메시지 / Save result message */}
            {saveStatus === 'success' && (
              <div className="mx-6 mb-4 flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                <p className="text-sm text-green-700 font-medium">담당자 정보가 저장되었습니다.</p>
              </div>
            )}
            {saveStatus === 'error' && (
              <div className="mx-6 mb-4 flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            )}

            {/* 저장 버튼 / Save button */}
            <div className="px-6 pb-6">
              <button
                type="submit"
                disabled={saving}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    저장 중...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    저장하기
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
