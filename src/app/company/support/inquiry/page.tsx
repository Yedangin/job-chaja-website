'use client';

/**
 * 기업 1:1 고객 문의 페이지 / Company 1:1 Customer Inquiry Page
 * 기업 회원 전용 문의 유형 선택 + 파일 첨부 UI 포함
 * Company-specific inquiry categories + file attachment UI
 */

import { useState, useRef } from 'react';
import {
  MessageSquare,
  Loader2,
  Check,
  ChevronDown,
  Paperclip,
  X,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';

/** 기업용 문의 유형 목록 / Company-specific inquiry categories */
const CATEGORIES = [
  { value: 'account', label: '회원가입/인증', labelEn: 'Registration / Verification' },
  { value: 'posting', label: '공고 등록', labelEn: 'Job Posting' },
  { value: 'payment', label: '결제/환불', labelEn: 'Payment / Refund' },
  { value: 'credits', label: '열람권', labelEn: 'Viewing Credits' },
  { value: 'visa', label: '비자 매칭', labelEn: 'Visa Matching' },
  { value: 'etc', label: '기타', labelEn: 'Other' },
] as const;

type CategoryValue = (typeof CATEGORIES)[number]['value'] | '';

/** 첨부 파일 항목 타입 / Attached file item type */
interface AttachedFile {
  id: string;
  file: File;
}

export default function CompanyInquiryPage() {
  /** 문의 유형 / Inquiry category */
  const [category, setCategory] = useState<CategoryValue>('');
  /** 제목 / Title */
  const [title, setTitle] = useState('');
  /** 내용 / Content */
  const [content, setContent] = useState('');
  /** 첨부 파일 목록 / Attached files */
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  /** 제출 중 / Submitting */
  const [submitting, setSubmitting] = useState(false);
  /** 제출 완료 / Submission success */
  const [success, setSuccess] = useState(false);
  /** 에러 메시지 / Error message */
  const [error, setError] = useState<string | null>(null);

  /** 파일 입력 ref / File input ref */
  const fileInputRef = useRef<HTMLInputElement>(null);

  /** 파일 첨부 핸들러 / File attach handler */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (attachedFiles.length + files.length > 3) {
      toast.error('파일은 최대 3개까지 첨부할 수 있습니다. / Max 3 files allowed.');
      return;
    }
    const newFiles: AttachedFile[] = files.map((f) => ({
      id: `${f.name}-${f.lastModified}`,
      file: f,
    }));
    setAttachedFiles((prev) => [...prev, ...newFiles]);
    // input 초기화 (동일 파일 재첨부 허용) / Reset input to allow re-attaching same file
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  /** 파일 제거 핸들러 / File remove handler */
  const handleRemoveFile = (id: string) => {
    setAttachedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  /** 폼 제출 핸들러 / Form submit handler */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('제목을 입력해주세요. / Please enter a title.');
      return;
    }
    if (!content.trim()) {
      setError('문의 내용을 입력해주세요. / Please enter the inquiry content.');
      return;
    }
    setSubmitting(true);
    setError(null);

    try {
      const sessionId = localStorage.getItem('sessionId');
      const selectedCategory = CATEGORIES.find((c) => c.value === category);
      const fullTitle = selectedCategory
        ? `[${selectedCategory.label}] ${title.trim()}`
        : title.trim();

      const res = await fetch('/api/auth/support-ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(sessionId ? { Authorization: `Bearer ${sessionId}` } : {}),
        },
        body: JSON.stringify({ title: fullTitle, content: content.trim() }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((data as { message?: string })?.message || '문의 등록에 실패했습니다.');

      toast.success('문의가 접수되었습니다. / Inquiry submitted successfully.');
      setSuccess(true);
      setTitle('');
      setContent('');
      setCategory('');
      setAttachedFiles([]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '문의 등록에 실패했습니다.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  /** 바이트를 사람이 읽기 쉬운 크기로 변환 / Convert bytes to human-readable size */
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* 페이지 헤더 / Page header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">1:1 고객 문의</h1>
        <p className="text-sm text-gray-500 mt-0.5">Customer Support — 기업 전용 / Company Only</p>
      </div>

      {/* 제출 완료 상태 / Submission success state */}
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
          {/* 응답 시간 안내 배너 / Response time info banner */}
          <div className="flex items-center gap-3 mb-6 p-4 bg-blue-50 rounded-xl">
            <MessageSquare className="w-5 h-5 text-blue-600 shrink-0" />
            <p className="text-sm text-blue-800">
              평균 응답 시간: 영업일 기준 1~2일 / Avg. response: 1-2 business days
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 문의 유형 / Inquiry category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                문의 유형 <span className="text-gray-400 font-normal">/ Category</span>
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategoryValue)}
                  className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white"
                >
                  <option value="">선택해주세요 (선택사항) / Select (optional)</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label} / {c.labelEn}
                    </option>
                  ))}
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
                placeholder="문의 제목을 입력하세요 / Enter inquiry title"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{title.length} / 100</p>
            </div>

            {/* 문의 내용 / Inquiry content */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                문의 내용 <span className="text-gray-400 font-normal">/ Content</span>
                <span className="text-red-500 ml-0.5">*</span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={7}
                maxLength={2000}
                placeholder="문의 내용을 자세히 입력해주세요. 공고 번호, 오류 메시지 등을 포함하면 빠른 처리에 도움이 됩니다.
Please describe your inquiry in detail. Including job posting numbers or error messages helps us respond faster."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{content.length} / 2000</p>
            </div>

            {/* 파일 첨부 (UI만) / File attachment (UI only) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                파일 첨부 <span className="text-gray-400 font-normal">/ Attach Files</span>
                <span className="text-gray-400 font-normal ml-1">(선택, 최대 3개)</span>
              </label>

              {/* 첨부된 파일 목록 / List of attached files */}
              {attachedFiles.length > 0 && (
                <div className="space-y-2 mb-3">
                  {attachedFiles.map((af) => (
                    <div
                      key={af.id}
                      className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <Paperclip className="w-4 h-4 text-gray-400 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-700 truncate">{af.file.name}</p>
                        <p className="text-[10px] text-gray-400">{formatFileSize(af.file.size)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(af.id)}
                        className="w-5 h-5 rounded-full bg-gray-200 hover:bg-red-100 flex items-center justify-center transition shrink-0"
                        aria-label="파일 제거 / Remove file"
                      >
                        <X className="w-3 h-3 text-gray-500 hover:text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* 파일 추가 버튼 / Add file button */}
              {attachedFiles.length < 3 && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 cursor-pointer transition w-full justify-center"
                  >
                    <Paperclip className="w-4 h-4" />
                    파일 선택 / Select files
                  </label>
                  <p className="text-xs text-gray-400 mt-1.5">
                    이미지, PDF, Word, Excel 파일 첨부 가능 / Images, PDF, Word, Excel accepted
                  </p>
                </>
              )}
            </div>

            {/* 에러 메시지 / Error message */}
            {error && (
              <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* 제출 버튼 / Submit button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white text-sm font-semibold rounded-xl transition flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  제출 중... / Submitting...
                </>
              ) : (
                '문의 제출하기 / Submit Inquiry'
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
