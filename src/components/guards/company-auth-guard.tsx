'use client';

import { useAuth, type VerificationStatus } from '@/contexts/auth-context';
import { Lock } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

/**
 * 기업인증 상태별 접근 제어 매트릭스 / Verification status access control matrix
 * (CLAUDE.md 섹션 9-4)
 *
 * | 기능                    | 미인증 | 대기중 | 승인완료 | 반려 |
 * |------------------------|:-----:|:-----:|:------:|:---:|
 * | 기업 프로필 설정          |  O    |  O    |   O    |  O  |
 * | 서비스 둘러보기           |  O    |  O    |   O    |  O  |
 * | 공고 등록(임시저장)       |  X    |  O    |   O    |  X  |
 * | 공고 게시(발행)          |  X    |  X    |   O    |  X  |
 * | 인재 검색/열람           |  X    |  X    |   O    |  X  |
 * | 결제/구매               |  X    |  X    |   O    |  X  |
 */

/** 기능별 필요 인증 수준 / Feature access levels */
type AccessLevel =
  | 'profile'       // 프로필: 항상 접근 가능 / Always accessible
  | 'browse'        // 둘러보기: 항상 접근 가능 / Always accessible
  | 'draft'         // 임시저장: PENDING, APPROVED / Drafts allowed
  | 'publish'       // 게시: APPROVED만 / Publish approved only
  | 'talent'        // 인재검색: APPROVED만 / Talent search approved only
  | 'payment';      // 결제: APPROVED만 / Payment approved only

interface CompanyAuthGuardProps {
  /** 필요 접근 수준 / Required access level */
  requiredAccess: AccessLevel;
  children: React.ReactNode;
  /** 차단 시 대체 콘텐츠 (선택) / Fallback content when blocked */
  fallback?: React.ReactNode;
}

/**
 * 인증 상태에 따라 기능 접근 제어 / Control feature access based on verification status
 */
function isAccessAllowed(status: VerificationStatus, level: AccessLevel): boolean {
  // 프로필/둘러보기는 항상 허용 / Profile/browse always allowed
  if (level === 'profile' || level === 'browse') return true;

  // 임시저장: SUBMITTED 또는 APPROVED / Draft: SUBMITTED or APPROVED
  if (level === 'draft') {
    return status === 'SUBMITTED' || status === 'APPROVED';
  }

  // 게시/인재검색/결제: APPROVED만 / Publish/talent/payment: APPROVED only
  return status === 'APPROVED';
}

/**
 * 기업인증 가드 컴포넌트 / Company verification guard component
 * 잠긴 기능 클릭 시 안내 모달 표시
 */
export default function CompanyAuthGuard({
  requiredAccess,
  children,
  fallback,
}: CompanyAuthGuardProps) {
  const { verificationStatus } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const allowed = isAccessAllowed(verificationStatus, requiredAccess);

  if (allowed) {
    return <>{children}</>;
  }

  // 기본 차단 UI / Default blocked UI
  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <>
      {/* 잠긴 상태 렌더링 / Locked state rendering */}
      <div
        className="relative cursor-pointer group"
        onClick={() => setShowModal(true)}
      >
        <div className="pointer-events-none opacity-50 select-none">
          {children}
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-lg">
          <div className="flex items-center gap-2 text-gray-500 bg-white px-3 py-2 rounded-lg shadow-sm border text-sm">
            <Lock className="w-4 h-4" />
            <span>인증 완료 후 이용 가능</span>
          </div>
        </div>
      </div>

      {/* 안내 모달 / Info modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-6 max-w-sm mx-4 shadow-xl">
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                기업인증이 필요합니다
              </h3>
              <p className="text-sm text-gray-500 mb-1">
                이 기능은 기업인증 완료 후 이용 가능합니다.
              </p>
              <p className="text-xs text-gray-400 mb-6">
                {(verificationStatus === 'NONE' || verificationStatus === 'PENDING') && '사업자등록증을 제출하여 기업인증을 시작하세요.'}
                {verificationStatus === 'SUBMITTED' && '기업인증 심사가 진행 중입니다. 1~2 영업일 소요됩니다.'}
                {verificationStatus === 'REJECTED' && '기업인증이 반려되었습니다. 서류를 다시 제출해주세요.'}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2.5 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                닫기
              </button>
              {(verificationStatus === 'NONE' || verificationStatus === 'REJECTED') && (
                <Link
                  href="/company/verification"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center"
                >
                  {verificationStatus === 'NONE' ? '인증 시작' : '재제출하기'}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * 간단한 잠금 버튼 래퍼 / Simple lock button wrapper
 * 버튼이나 링크를 감싸서 인증 상태에 따라 잠금 처리
 */
export function CompanyLockedFeature({
  requiredAccess,
  children,
}: {
  requiredAccess: AccessLevel;
  children: React.ReactNode;
}) {
  return (
    <CompanyAuthGuard requiredAccess={requiredAccess}>
      {children}
    </CompanyAuthGuard>
  );
}
