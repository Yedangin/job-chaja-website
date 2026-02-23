'use client';

/**
 * 개인회원 프로필 편집 페이지 / Worker profile edit page
 * - 이름(풀네임) 변경 / Change display name
 * - 프로필 사진 등록·변경 / Upload or change profile picture
 * - 이메일 표시 (읽기 전용) / Email display (read-only)
 */

import { useState, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { User, Camera, Loader2, Check, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function WorkerProfilePage() {
  const { user, refreshAuth } = useAuth();

  /** 편집 중인 이름 / Name being edited */
  const [fullName, setFullName] = useState(user?.fullName || '');

  /** 미리보기 이미지 URL / Preview image URL (base64 or remote) */
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  /** 서버에 저장할 이미지 URL (base64) / Image URL to save (base64) */
  const [imageToSave, setImageToSave] = useState<string | null>(null);

  /** 저장 중 / Saving in progress */
  const [isSaving, setIsSaving] = useState(false);

  /** 저장 성공 / Save succeeded */
  const [saveSuccess, setSaveSuccess] = useState(false);

  /** 에러 메시지 / Error message */
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  /** 파일 인풋 ref / File input ref */
  const fileInputRef = useRef<HTMLInputElement>(null);

  /** 프로필 이미지 클릭 핸들러 / Profile image click handler */
  const handleImageClick = () => fileInputRef.current?.click();

  /** 파일 선택 핸들러 / File select handler */
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 5MB 제한 / 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('이미지 크기는 5MB 이하여야 합니다. / Image must be under 5MB.');
      return;
    }
    if (!file.type.startsWith('image/')) {
      setErrorMsg('이미지 파일만 업로드할 수 있습니다. / Only image files are allowed.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setPreviewImage(result);
      setImageToSave(result);
      setErrorMsg(null);
    };
    reader.readAsDataURL(file);
  }, []);

  /** 저장 핸들러 / Save handler */
  const handleSave = async () => {
    if (!fullName.trim()) {
      setErrorMsg('이름을 입력해주세요. / Please enter your name.');
      return;
    }
    setIsSaving(true);
    setErrorMsg(null);
    setSaveSuccess(false);

    try {
      const sessionId = localStorage.getItem('sessionId');
      const body: Record<string, string> = { fullName: fullName.trim() };
      if (imageToSave) body.profileImageUrl = imageToSave;

      const res = await fetch('/api/auth/my/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(sessionId ? { Authorization: `Bearer ${sessionId}` } : {}),
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || '저장에 실패했습니다.');
      }

      // 인증 정보 새로고침 (사이드바 이름 반영) / Refresh auth to update sidebar name
      await refreshAuth();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '저장에 실패했습니다.';
      setErrorMsg(message);
    } finally {
      setIsSaving(false);
    }
  };

  /** 표시할 아바타 이미지 / Avatar image to display */
  const avatarSrc = previewImage || null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* 뒤로 가기 / Back */}
      <div className="mb-6">
        <Link
          href="/worker/mypage"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          대시보드로 돌아가기 / Back to Dashboard
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">프로필 설정</h1>
      <p className="text-sm text-gray-500 mb-8">Profile Settings</p>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {/* 프로필 사진 섹션 / Profile picture section */}
        <div className="flex flex-col items-center pt-10 pb-6 bg-gradient-to-b from-blue-50 to-white">
          <div className="relative">
            <button
              type="button"
              onClick={handleImageClick}
              className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-md hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="프로필 사진 변경 / Change profile picture"
            >
              {avatarSrc ? (
                <Image
                  src={avatarSrc}
                  alt="프로필 사진"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              ) : (
                <User className="w-10 h-10 text-blue-400" />
              )}
            </button>
            {/* 카메라 오버레이 / Camera overlay */}
            <button
              type="button"
              onClick={handleImageClick}
              className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white shadow hover:bg-blue-700 transition"
              aria-label="사진 업로드"
            >
              <Camera className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* 숨겨진 파일 인풋 / Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleFileChange}
          />

          <p className="text-xs text-gray-400 mt-3">
            JPG, PNG, WebP · 최대 5MB / Up to 5MB
          </p>
        </div>

        {/* 폼 영역 / Form area */}
        <div className="px-6 py-6 space-y-5">
          {/* 이름 / Full name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              이름 <span className="text-gray-400 font-normal">/ Full Name</span>
              <span className="text-red-500 ml-0.5">*</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="이름을 입력하세요 / Enter your name"
              maxLength={50}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
            />
          </div>

          {/* 이메일 (읽기 전용) / Email (read-only) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              이메일 <span className="text-gray-400 font-normal">/ Email</span>
            </label>
            <input
              type="email"
              value={user?.email || ''}
              readOnly
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 mt-1">
              이메일은 변경할 수 없습니다. / Email cannot be changed.
            </p>
          </div>

          {/* 에러 메시지 / Error message */}
          {errorMsg && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
              <span className="shrink-0 mt-0.5">⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 성공 메시지 / Success message */}
          {saveSuccess && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700">
              <Check className="w-4 h-4 shrink-0" />
              <span>프로필이 저장되었습니다. / Profile saved successfully.</span>
            </div>
          )}

          {/* 저장 버튼 / Save button */}
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !fullName.trim()}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                저장 중... / Saving...
              </>
            ) : (
              '저장하기 / Save'
            )}
          </button>
        </div>
      </div>

      {/* 안내 문구 / Info note */}
      <p className="text-center text-xs text-gray-400 mt-6">
        프로필 정보는 구직 활동 및 기업 매칭에 사용됩니다. / Profile info is used for job matching.
      </p>
    </div>
  );
}
