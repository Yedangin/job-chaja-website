'use client';

/**
 * 비자 인증 페이지 / Visa Verification Page
 *
 * 상태별 UI:
 * - null (미제출): 업로드 폼 표시
 * - PENDING / SUBMITTED (심사 중): 제출 정보 + 검토 중 배너
 * - VERIFIED (승인): 비자 정보 카드 + 초록 뱃지
 * - REJECTED (반려): 반려 사유 + 재제출 폼
 *
 * Status-based UI:
 * - null (not submitted): Upload form
 * - PENDING / SUBMITTED (under review): Submitted info + reviewing banner
 * - VERIFIED (approved): Visa info card + green badge
 * - REJECTED (rejected): Rejection reason + resubmission form
 */

import { useState, useEffect, useRef, useCallback, DragEvent, ChangeEvent } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  ShieldCheck,
  ShieldX,
  ShieldAlert,
  Shield,
  Upload,
  FileImage,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
  LogIn,
  ChevronDown,
  Scan,
  Calendar,
  Hash,
  CreditCard,
  Info,
} from 'lucide-react';

// ── 타입 정의 / Type definitions ──────────────────────────────────────────────

/** 비자 인증 상태 / Visa verification status */
type VerifyStatus = 'PENDING' | 'SUBMITTED' | 'VERIFIED' | 'REJECTED';

/** 비자 인증 응답 / Visa verification response from backend */
interface VisaVerificationData {
  id: number;
  userId: string;
  visaCode: string;
  visaSubType: string | null;
  visaExpiryDate: string;
  foreignRegistrationNumber: string | null;
  verificationMethod: 'OCR' | 'MANUAL';
  verificationStatus: VerifyStatus;
  verifiedAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
}

/** OCR 추출 결과 / OCR extraction result */
interface OcrResult {
  visaCode: string | null;
  visaSubType: string | null;
  expiryDate: string | null;
  registrationNumber: string | null;
}

/** OCR API 응답 / OCR API response */
interface OcrResponse extends VisaVerificationData {
  ocrExtracted: OcrResult;
  ocrConfidence: number;
  needsManualReview: boolean;
}

/** 폼 입력 값 / Form input values */
interface VerificationForm {
  visaCode: string;
  visaSubType: string;
  visaExpiryDate: string;
  foreignRegistrationNumber: string;
}

// ── 비자 종류 목록 / Visa type list ────────────────────────────────────────────
// 주요 비자 코드 (DB에서 가져오는 것이 이상적이나, 공통 코드 하드코딩 최소화)
// Major visa codes (ideally from DB, but common codes listed here as display reference)
const VISA_GROUPS: { group: string; codes: { code: string; label: string }[] }[] = [
  {
    group: '취업 비자 / Work Visas',
    codes: [
      { code: 'E-1', label: 'E-1 교수 / Professor' },
      { code: 'E-2', label: 'E-2 회화지도 / Language Instructor' },
      { code: 'E-3', label: 'E-3 연구 / Research' },
      { code: 'E-4', label: 'E-4 기술지도 / Technology Transfer' },
      { code: 'E-5', label: 'E-5 전문직업 / Professional' },
      { code: 'E-6', label: 'E-6 예술흥행 / Arts & Performance' },
      { code: 'E-7', label: 'E-7 특정활동 / Specific Activity' },
      { code: 'E-9', label: 'E-9 비전문취업 / Non-professional Employment' },
      { code: 'E-10', label: 'E-10 선원취업 / Seafarer' },
    ],
  },
  {
    group: '거주 비자 / Residence Visas',
    codes: [
      { code: 'F-2', label: 'F-2 거주 / Resident' },
      { code: 'F-4', label: 'F-4 재외동포 / Overseas Korean' },
      { code: 'F-5', label: 'F-5 영주 / Permanent Resident' },
      { code: 'F-6', label: 'F-6 결혼이민 / Marriage Immigrant' },
    ],
  },
  {
    group: '유학 비자 / Study Visas',
    codes: [
      { code: 'D-2', label: 'D-2 유학 / Student' },
      { code: 'D-4', label: 'D-4 일반연수 / General Training' },
    ],
  },
  {
    group: '방문취업 / Working Holiday & Visit',
    codes: [
      { code: 'H-1', label: 'H-1 관광취업 / Working Holiday' },
      { code: 'H-2', label: 'H-2 방문취업 / Visit & Employment' },
    ],
  },
  {
    group: '기타 / Others',
    codes: [
      { code: 'D-1', label: 'D-1 문화예술 / Culture & Arts' },
      { code: 'D-3', label: 'D-3 기술연수 / Industrial Training' },
      { code: 'D-5', label: 'D-5 취재 / Journalism' },
      { code: 'D-6', label: 'D-6 종교 / Religion' },
      { code: 'D-7', label: 'D-7 주재 / Intra-company Transfer' },
      { code: 'D-8', label: 'D-8 기업투자 / Corporate Investment' },
      { code: 'D-9', label: 'D-9 무역경영 / Trade & Business' },
      { code: 'D-10', label: 'D-10 구직 / Job Seeking' },
      { code: 'G-1', label: 'G-1 기타 / Other' },
    ],
  },
];

// 모든 코드를 단순 배열로 펼치기 / Flatten all codes into a single array
const ALL_VISA_CODES = VISA_GROUPS.flatMap((g) => g.codes);

// ── 날짜 포맷 헬퍼 / Date format helper ──────────────────────────────────────
function formatDate(iso: string | null): string {
  if (!iso) return '-';
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

// ── 파일 크기 표시 / File size display ────────────────────────────────────────
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ── 비자 레이블 조회 / Get visa label ─────────────────────────────────────────
function getVisaLabel(code: string): string {
  return ALL_VISA_CODES.find((v) => v.code === code)?.label ?? code;
}

// ══════════════════════════════════════════════════════════════════════════════
// 서브 컴포넌트 / Sub-components
// ══════════════════════════════════════════════════════════════════════════════

// ── 미로그인 상태 / Not logged in state ───────────────────────────────────────
function NotLoggedIn() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <LogIn className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-base font-semibold text-gray-700 mb-2">
        로그인이 필요합니다
      </h3>
      <p className="text-sm text-gray-400 mb-6">
        비자 인증을 위해 먼저 로그인해주세요.
        <br />
        Please log in to submit visa verification.
      </p>
      <Link
        href="/auth/login"
        className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition"
      >
        <LogIn className="w-4 h-4" />
        로그인하기
      </Link>
    </div>
  );
}

// ── 로딩 스켈레톤 / Loading skeleton ──────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-32 bg-gray-100 rounded-2xl" />
      <div className="h-64 bg-gray-100 rounded-2xl" />
    </div>
  );
}

// ── 승인 상태 카드 / Approved status card ────────────────────────────────────
interface ApprovedCardProps {
  data: VisaVerificationData;
  onReapply: () => void;
}

function ApprovedCard({ data, onReapply }: ApprovedCardProps) {
  return (
    <div className="space-y-4">
      {/* 승인 배너 / Approval banner */}
      <div className="bg-green-50 border border-green-200 rounded-2xl p-5 flex items-start gap-4">
        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
          <ShieldCheck className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-base font-bold text-green-800 mb-0.5">
            비자 인증 완료
          </h2>
          <p className="text-sm text-green-700">
            Visa verification approved. You can now apply to eligible jobs.
          </p>
          {data.verifiedAt && (
            <p className="text-xs text-green-600 mt-1">
              승인일: {formatDate(data.verifiedAt)} / Verified on: {formatDate(data.verifiedAt)}
            </p>
          )}
        </div>
        {/* 승인 배지 / Approved badge */}
        <span className="ml-auto shrink-0 inline-flex items-center gap-1 bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
          <CheckCircle2 className="w-3.5 h-3.5" />
          승인됨
        </span>
      </div>

      {/* 비자 정보 카드 / Visa info card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-gray-400" />
          인증된 비자 정보 / Verified Visa Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 비자 종류 / Visa type */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">비자 종류 / Visa Type</p>
            <p className="text-base font-bold text-gray-900">{data.visaCode}</p>
            <p className="text-xs text-gray-500">{getVisaLabel(data.visaCode)}</p>
            {data.visaSubType && (
              <p className="text-xs text-blue-600 mt-0.5">세부: {data.visaSubType}</p>
            )}
          </div>
          {/* 만료일 / Expiry date */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">비자 만료일 / Expiry Date</p>
            <p className="text-base font-bold text-gray-900">
              {formatDate(data.visaExpiryDate)}
            </p>
          </div>
          {/* 외국인등록번호 / Foreign registration number */}
          {data.foreignRegistrationNumber && (
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">
                외국인등록번호 / Registration No.
              </p>
              <p className="text-sm font-semibold text-gray-700">
                {data.foreignRegistrationNumber}
              </p>
            </div>
          )}
          {/* 인증 방식 / Verification method */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">
              인증 방식 / Verification Method
            </p>
            <p className="text-sm font-semibold text-gray-700">
              {data.verificationMethod === 'OCR'
                ? 'OCR 자동 추출 / OCR Auto-extract'
                : '수동 입력 / Manual Input'}
            </p>
          </div>
        </div>
      </div>

      {/* 재인증 버튼 / Re-apply button */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-3">
          <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
          <p className="text-sm text-blue-700">
            비자를 갱신하셨나요? 재인증 버튼을 눌러 새 비자 정보를 제출하세요.
            <br />
            <span className="text-xs text-blue-500">
              Renewed your visa? Submit new information for re-verification.
            </span>
          </p>
        </div>
        <button
          type="button"
          onClick={onReapply}
          className="shrink-0 flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-blue-700 transition"
        >
          <RefreshCw className="w-4 h-4" />
          재인증
        </button>
      </div>
    </div>
  );
}

// ── 심사 중 상태 / Pending/Submitted status ───────────────────────────────────
function PendingCard({ data, onPendingResubmit }: { data: VisaVerificationData; onPendingResubmit: () => void }) {
  return (
    <div className="space-y-4">
      {/* 검토 중 배너 / Under review banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
          <Clock className="w-6 h-6 text-amber-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-base font-bold text-amber-800 mb-0.5">
            심사 중입니다
          </h2>
          <p className="text-sm text-amber-700">
            제출하신 비자 서류를 검토 중입니다. 영업일 기준 3~5일 소요됩니다.
            <br />
            <span className="text-xs text-amber-600">
              Your documents are under review. This may take 3–5 business days.
            </span>
          </p>
        </div>
        {/* 심사 중 배지 / Under review badge */}
        <span className="shrink-0 inline-flex items-center gap-1 bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
          <Clock className="w-3.5 h-3.5" />
          검토 중
        </span>
      </div>

      {/* 제출 정보 요약 / Submitted info summary */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-gray-400" />
          제출된 비자 정보 / Submitted Visa Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">비자 종류 / Visa Type</p>
            <p className="text-base font-bold text-gray-900">{data.visaCode}</p>
            <p className="text-xs text-gray-500">{getVisaLabel(data.visaCode)}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">제출일 / Submitted</p>
            <p className="text-sm font-semibold text-gray-700">
              {formatDate(data.createdAt)}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">비자 만료일 / Expiry Date</p>
            <p className="text-sm font-semibold text-gray-700">
              {formatDate(data.visaExpiryDate)}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">인증 방식 / Method</p>
            <p className="text-sm font-semibold text-gray-700">
              {data.verificationMethod === 'OCR'
                ? 'OCR 자동 추출'
                : '수동 입력'}
            </p>
          </div>
        </div>
      </div>

      {/* 재제출 안내 / Resubmit notice */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex items-center justify-between gap-4 flex-wrap">
        <p className="text-sm text-gray-500">
          잘못 제출하셨나요? 다시 제출하면 기존 심사가 초기화됩니다.
          <br />
          <span className="text-xs text-gray-400">
            Submitted incorrect info? Resubmitting will reset the current review.
          </span>
        </p>
        <button
          type="button"
          onClick={onPendingResubmit}
          className="shrink-0 flex items-center gap-2 bg-white border border-gray-300 text-gray-600 text-sm font-medium px-4 py-2 rounded-xl hover:border-blue-400 hover:text-blue-600 transition"
        >
          <RefreshCw className="w-4 h-4" />
          재제출
        </button>
      </div>
    </div>
  );
}

// ── 반려 상태 배너 / Rejected banner ─────────────────────────────────────────
function RejectedBanner({ reason }: { reason: string | null }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-4 mb-4">
      <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
        <ShieldX className="w-6 h-6 text-red-600" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-base font-bold text-red-800">인증 반려</h2>
          <span className="inline-flex items-center gap-1 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            <ShieldX className="w-3.5 h-3.5" />
            반려됨
          </span>
        </div>
        <p className="text-sm text-red-700">
          제출하신 비자 서류가 반려되었습니다. 아래 사유를 확인하고 다시 제출해주세요.
          <br />
          <span className="text-xs text-red-500">
            Your visa documents were rejected. Please review the reason below and resubmit.
          </span>
        </p>
        {reason && (
          <div className="mt-3 bg-red-100 rounded-xl px-4 py-3">
            <p className="text-xs font-semibold text-red-700 mb-1">
              반려 사유 / Rejection Reason:
            </p>
            <p className="text-sm text-red-800">{reason}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── 파일 업로드 드롭존 / File upload drop zone ────────────────────────────────
interface DropZoneProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  onOcrExtract: () => void;
  ocrLoading: boolean;
}

function DropZone({ file, onFileChange, onOcrExtract, ocrLoading }: DropZoneProps) {
  // 드래그 오버 상태 / Drag over state
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 파일 유효성 검사 / File validation
  const validateFile = (f: File): boolean => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowed.includes(f.type)) {
      toast.error('JPG, PNG, WebP, PDF 파일만 가능합니다 / Only JPG, PNG, WebP, PDF files are allowed');
      return false;
    }
    if (f.size > 20 * 1024 * 1024) {
      toast.error('20MB 이하 파일만 가능합니다 / File must be under 20MB');
      return false;
    }
    return true;
  };

  // 드롭 핸들러 / Drop handler
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && validateFile(dropped)) {
      onFileChange(dropped);
    }
  };

  // 파일 선택 핸들러 / File input change handler
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && validateFile(selected)) {
      onFileChange(selected);
    }
    // 같은 파일 재선택 허용 / Allow reselecting same file
    e.target.value = '';
  };

  return (
    <div className="space-y-3">
      {/* 드롭존 영역 / Drop zone area */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onClick={() => !file && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition cursor-pointer ${
          isDragOver
            ? 'border-blue-400 bg-blue-50'
            : file
            ? 'border-green-300 bg-green-50'
            : 'border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          onChange={handleInputChange}
          className="hidden"
        />

        {file ? (
          /* 파일 선택됨 / File selected */
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <FileImage className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-sm font-semibold text-gray-800 truncate max-w-xs">
              {file.name}
            </p>
            <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onFileChange(null); }}
              className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 mt-1 transition"
            >
              <X className="w-3 h-3" />
              파일 제거 / Remove
            </button>
          </div>
        ) : (
          /* 파일 미선택 / No file */
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Upload className="w-6 h-6 text-blue-500" />
            </div>
            <p className="text-sm font-semibold text-gray-700">
              외국인등록증 이미지 업로드
            </p>
            <p className="text-xs text-gray-400">
              드래그하거나 클릭하여 파일을 선택하세요
              <br />
              Drag & drop or click to select file
            </p>
            <p className="text-xs text-gray-300 mt-1">
              JPG, PNG, WebP, PDF · 최대 20MB
            </p>
          </div>
        )}
      </div>

      {/* OCR 자동 추출 버튼 / OCR auto-extract button */}
      {file && (
        <button
          type="button"
          onClick={onOcrExtract}
          disabled={ocrLoading}
          className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white text-sm font-semibold py-3 rounded-xl hover:bg-purple-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {ocrLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Scan className="w-4 h-4" />
          )}
          {ocrLoading
            ? 'OCR 분석 중... / Analyzing...'
            : 'OCR 자동 추출 / Auto-extract with OCR'}
        </button>
      )}
    </div>
  );
}

// ── 비자 코드 선택 드롭다운 / Visa code dropdown ──────────────────────────────
interface VisaSelectProps {
  value: string;
  onChange: (value: string) => void;
}

function VisaSelect({ value, onChange }: VisaSelectProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none border border-gray-300 rounded-xl px-4 py-3 pr-10 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        required
      >
        <option value="">비자 종류 선택 / Select Visa Type</option>
        {VISA_GROUPS.map((group) => (
          <optgroup key={group.group} label={group.group}>
            {group.codes.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  );
}

// ── 비자 인증 제출 폼 / Visa verification submission form ──────────────────────
interface SubmitFormProps {
  initialData?: VisaVerificationData | null;
  onSuccess: (data: VisaVerificationData) => void;
}

function SubmitForm({ initialData, onSuccess }: SubmitFormProps) {
  // 폼 상태 / Form state
  const [form, setForm] = useState<VerificationForm>({
    visaCode: initialData?.visaCode ?? '',
    visaSubType: initialData?.visaSubType ?? '',
    visaExpiryDate: initialData?.visaExpiryDate
      ? new Date(initialData.visaExpiryDate).toISOString().split('T')[0]
      : '',
    foreignRegistrationNumber: initialData?.foreignRegistrationNumber ?? '',
  });

  // 파일 상태 / File state
  const [file, setFile] = useState<File | null>(null);
  // OCR 로딩 / OCR loading
  const [ocrLoading, setOcrLoading] = useState(false);
  // 제출 로딩 / Submit loading
  const [submitLoading, setSubmitLoading] = useState(false);
  // OCR 결과 신뢰도 / OCR confidence
  const [ocrConfidence, setOcrConfidence] = useState<number | null>(null);
  // 수동 검토 필요 여부 / Needs manual review
  const [needsReview, setNeedsReview] = useState(false);

  // 폼 필드 업데이트 핸들러 / Form field update handler
  const updateField = (field: keyof VerificationForm) => (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  // OCR 자동 추출 핸들러 / OCR auto-extract handler
  const handleOcrExtract = async () => {
    if (!file) return;

    setOcrLoading(true);
    try {
      const sessionId = localStorage.getItem('sessionId');
      if (!sessionId) {
        toast.error('로그인이 필요합니다 / Please log in');
        return;
      }

      // multipart 폼 데이터 구성 / Build multipart form data
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/visa-verification/ocr', {
        method: 'POST',
        headers: { Authorization: `Bearer ${sessionId}` },
        body: formData,
      });

      const data = await res.json() as OcrResponse & { message?: string };

      if (!res.ok) {
        toast.error(data.message ?? 'OCR 처리에 실패했습니다 / OCR processing failed');
        return;
      }

      // OCR 추출 결과 폼에 반영 / Apply OCR results to form
      const extracted = data.ocrExtracted;
      setForm((prev) => ({
        ...prev,
        visaCode: extracted.visaCode ?? prev.visaCode,
        visaSubType: extracted.visaSubType ?? prev.visaSubType,
        visaExpiryDate: extracted.expiryDate ?? prev.visaExpiryDate,
        foreignRegistrationNumber:
          extracted.registrationNumber ?? prev.foreignRegistrationNumber,
      }));

      setOcrConfidence(data.ocrConfidence);
      setNeedsReview(data.needsManualReview);

      if (data.needsManualReview) {
        toast.warning(
          `OCR 신뢰도 ${Math.round(data.ocrConfidence)}% — 추출된 정보를 직접 확인해주세요 / Low confidence, please verify extracted info`
        );
      } else {
        toast.success('OCR 추출 완료! 내용을 확인하고 제출하세요 / OCR extraction successful');
      }

      // OCR 제출은 서버에서 이미 완료됨 → 성공 콜백 호출
      // OCR submission is already done server-side → call success callback
      onSuccess(data);
    } catch {
      toast.error('네트워크 오류가 발생했습니다 / Network error occurred');
    } finally {
      setOcrLoading(false);
    }
  };

  // 수동 제출 핸들러 / Manual submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.visaCode) {
      toast.error('비자 종류를 선택해주세요 / Please select a visa type');
      return;
    }
    if (!form.visaExpiryDate) {
      toast.error('비자 만료일을 입력해주세요 / Please enter the expiry date');
      return;
    }

    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      toast.error('로그인이 필요합니다 / Please log in');
      return;
    }

    setSubmitLoading(true);
    try {
      const payload: Record<string, string> = {
        visaCode: form.visaCode,
        visaExpiryDate: form.visaExpiryDate,
        verificationMethod: 'MANUAL',
      };
      if (form.visaSubType) payload.visaSubType = form.visaSubType;
      if (form.foreignRegistrationNumber)
        payload.foreignRegistrationNumber = form.foreignRegistrationNumber;

      const res = await fetch('/api/visa-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionId}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json() as VisaVerificationData & { message?: string };

      if (!res.ok) {
        toast.error(data.message ?? '제출에 실패했습니다 / Submission failed');
        return;
      }

      toast.success('비자 인증 신청이 완료되었습니다 / Visa verification submitted successfully');
      onSuccess(data);
    } catch {
      toast.error('네트워크 오류가 발생했습니다 / Network error occurred');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 파일 업로드 섹션 / File upload section */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-sm font-bold text-gray-700 mb-1 flex items-center gap-2">
          <FileImage className="w-4 h-4 text-purple-500" />
          외국인등록증 이미지 업로드 (선택) / Upload ARC Image (Optional)
        </h3>
        <p className="text-xs text-gray-400 mb-4">
          외국인등록증을 업로드하면 OCR로 비자 정보를 자동 추출할 수 있습니다.
          <br />
          Upload your Alien Registration Card (ARC) to auto-extract visa info via OCR.
        </p>

        <DropZone
          file={file}
          onFileChange={setFile}
          onOcrExtract={handleOcrExtract}
          ocrLoading={ocrLoading}
        />

        {/* OCR 신뢰도 표시 / OCR confidence display */}
        {ocrConfidence !== null && (
          <div
            className={`mt-3 flex items-center gap-2 text-xs px-3 py-2 rounded-lg ${
              needsReview
                ? 'bg-amber-50 text-amber-700'
                : 'bg-green-50 text-green-700'
            }`}
          >
            {needsReview ? (
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            )}
            OCR 신뢰도 / Confidence: {Math.round(ocrConfidence)}%
            {needsReview && ' — 추출된 정보를 확인해주세요 / Please verify extracted info'}
          </div>
        )}
      </div>

      {/* 비자 정보 수동 입력 / Manual visa info input */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-500" />
          비자 정보 입력 / Enter Visa Information
        </h3>

        <div className="space-y-4">
          {/* 비자 종류 선택 / Visa type selection */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              비자 종류 <span className="text-red-400">*</span>
              <span className="text-gray-400 font-normal ml-1">/ Visa Type (required)</span>
            </label>
            <VisaSelect
              value={form.visaCode}
              onChange={(val) => setForm((prev) => ({ ...prev, visaCode: val }))}
            />
          </div>

          {/* 세부 유형 / Sub-type */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              세부 유형 (선택)
              <span className="text-gray-400 font-normal ml-1">/ Sub-type (optional, e.g., E-7-1)</span>
            </label>
            <input
              type="text"
              value={form.visaSubType}
              onChange={updateField('visaSubType')}
              placeholder="예: E-7-1, F-2-7"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder:text-gray-300"
            />
          </div>

          {/* 비자 만료일 / Expiry date */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              비자 만료일 <span className="text-red-400">*</span>
              <span className="text-gray-400 font-normal ml-1">/ Expiry Date (required)</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="date"
                value={form.visaExpiryDate}
                onChange={updateField('visaExpiryDate')}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* 외국인등록번호 / Foreign registration number */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              외국인등록번호 (선택)
              <span className="text-gray-400 font-normal ml-1">/ Foreign Registration No. (optional)</span>
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={form.foreignRegistrationNumber}
                onChange={updateField('foreignRegistrationNumber')}
                placeholder="123456-1234567"
                maxLength={14}
                className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder:text-gray-300"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 개인정보 안내 / Privacy notice */}
      <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
        <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
        <p className="text-xs text-blue-700">
          제출하신 비자 정보는 취업 가능 여부 확인 목적으로만 사용되며, 관련 법령에 따라 안전하게 보관됩니다.
          <br />
          Your visa information is used solely for employment eligibility verification and is stored securely in compliance with applicable laws.
        </p>
      </div>

      {/* 제출 버튼 / Submit button */}
      <button
        type="submit"
        disabled={submitLoading || ocrLoading}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white text-sm font-bold py-3.5 rounded-xl hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <ShieldCheck className="w-4 h-4" />
        )}
        {submitLoading
          ? '제출 중... / Submitting...'
          : '비자 인증 신청하기 / Submit Verification'}
      </button>
    </form>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 메인 페이지 컴포넌트 / Main page component
// ══════════════════════════════════════════════════════════════════════════════
export default function WorkerVisaVerificationPage() {
  // 비자 인증 데이터 / Visa verification data (null = not submitted)
  const [verificationData, setVerificationData] =
    useState<VisaVerificationData | null | undefined>(undefined);
  // 로딩 상태 / Loading state
  const [loading, setLoading] = useState(true);
  // 로그인 여부 / Login state
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  // 재제출 모드 (승인/심사 중 → 폼 다시 보여주기) / Resubmit mode
  const [resubmitMode, setResubmitMode] = useState(false);

  // 비자 인증 상태 조회 / Fetch visa verification status
  const fetchVerification = useCallback(async () => {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      setIsLoggedIn(false);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/visa-verification/me', {
        headers: { Authorization: `Bearer ${sessionId}` },
      });

      if (res.status === 401) {
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        setVerificationData(null);
        setLoading(false);
        return;
      }

      const data = await res.json() as VisaVerificationData | null;
      setVerificationData(data);
    } catch {
      // 네트워크 오류 시 미제출로 처리 / Treat network error as not submitted
      setVerificationData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // 마운트 시 데이터 조회 / Fetch on mount
  useEffect(() => {
    fetchVerification();
  }, [fetchVerification]);

  // 제출 성공 핸들러 / On submit success
  const handleSuccess = (data: VisaVerificationData) => {
    setVerificationData(data);
    setResubmitMode(false);
  };

  // 재제출 모드 진입 / Enter resubmit mode
  const handleResubmit = () => {
    setResubmitMode(true);
  };

  // ── 현재 상태 계산 / Compute current display status ──────────────────────
  const currentStatus = verificationData?.verificationStatus ?? null;

  // ── 렌더링 / Render ────────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* 헤더 / Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-blue-600" />
            비자 인증
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Visa Verification</p>
        </div>

        {/* 현재 상태 배지 (로딩 아닐 때) / Current status badge */}
        {!loading && isLoggedIn && (
          <div>
            {currentStatus === 'VERIFIED' && !resubmitMode && (
              <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
                인증 완료
              </span>
            )}
            {(currentStatus === 'PENDING' || currentStatus === 'SUBMITTED') && !resubmitMode && (
              <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-full">
                <Clock className="w-3.5 h-3.5" />
                심사 중
              </span>
            )}
            {currentStatus === 'REJECTED' && !resubmitMode && (
              <span className="inline-flex items-center gap-1.5 bg-red-100 text-red-700 text-xs font-bold px-3 py-1.5 rounded-full">
                <ShieldX className="w-3.5 h-3.5" />
                반려됨
              </span>
            )}
            {(currentStatus === null || resubmitMode) && (
              <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-500 text-xs font-bold px-3 py-1.5 rounded-full">
                <Shield className="w-3.5 h-3.5" />
                미인증
              </span>
            )}
          </div>
        )}
      </div>

      {/* 로딩 / Loading */}
      {loading && <LoadingSkeleton />}

      {/* 미로그인 / Not logged in */}
      {!loading && !isLoggedIn && <NotLoggedIn />}

      {/* 로그인 + 데이터 로드 완료 / Logged in + data loaded */}
      {!loading && isLoggedIn && (
        <>
          {/* 재제출 모드 또는 미제출: 폼 표시 / Resubmit mode or not submitted: show form */}
          {(currentStatus === null || resubmitMode || currentStatus === 'REJECTED') && (
            <>
              {/* 반려 상태 배너 (반려일 때 항상 표시) / Rejected banner (always shown when rejected) */}
              {currentStatus === 'REJECTED' && (
                <RejectedBanner reason={verificationData?.rejectionReason ?? null} />
              )}

              {/* 재제출 모드일 때 취소 버튼 / Cancel resubmit mode button */}
              {resubmitMode && (
                <div className="mb-4">
                  <button
                    type="button"
                    onClick={() => setResubmitMode(false)}
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition"
                  >
                    <X className="w-4 h-4" />
                    취소 / Cancel
                  </button>
                </div>
              )}

              <SubmitForm
                initialData={verificationData ?? null}
                onSuccess={handleSuccess}
              />
            </>
          )}

          {/* 승인 상태 / VERIFIED */}
          {currentStatus === 'VERIFIED' && !resubmitMode && (
            <ApprovedCard
              data={verificationData!}
              onReapply={handleResubmit}
            />
          )}

          {/* 심사 중 상태 / PENDING or SUBMITTED */}
          {(currentStatus === 'PENDING' || currentStatus === 'SUBMITTED') &&
            !resubmitMode && (
              <PendingCard
                data={verificationData!}
                onPendingResubmit={handleResubmit}
              />
            )}
        </>
      )}
    </div>
  );
}
