'use client';

/**
 * 제안 수락 확인 모달 / Proposal acceptance confirmation modal
 * 위저드 100% 완성 시 표시
 * Shown when wizard reaches 100% completion
 */

import { Button } from '@/components/ui/button';
import { CheckCircle, Sparkles } from 'lucide-react';

interface ProposalAcceptanceModalProps {
  /** 표시 여부 / Show modal */
  isOpen: boolean;
  /** 수락 핸들러 / Accept handler */
  onAccept: () => void;
  /** 닫기/나중에 핸들러 / Close/later handler */
  onClose: () => void;
}

export default function ProposalAcceptanceModal({
  isOpen,
  onAccept,
  onClose,
}: ProposalAcceptanceModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* 배경 오버레이 / Background overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
        aria-label="배경 클릭으로 닫기 / Close by clicking background"
      >
        {/* 모달 콘텐츠 / Modal content */}
        <div
          className="bg-white rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-labelledby="modal-title"
          aria-modal="true"
        >
          {/* 아이콘 / Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <Sparkles className="w-6 h-6 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
            </div>
          </div>

          {/* 제목 / Title */}
          <div className="text-center space-y-2">
            <h2 id="modal-title" className="text-xl font-bold text-gray-900">
              🎉 프로필 작성 완료!
            </h2>
            <p className="text-sm text-gray-500">
              Profile completed successfully
            </p>
          </div>

          {/* 설명 / Description */}
          <div className="space-y-3 p-4 bg-blue-50 rounded-xl">
            <p className="text-sm text-gray-700 leading-relaxed">
              <span className="font-semibold text-blue-700">기업 제안 기능</span>을 활성화하시겠습니까?
            </p>
            <p className="text-xs text-gray-600 leading-relaxed">
              기업에서 회원님의 경력 및 학력을 확인하여 제안을 보내올 수 있습니다.
              인재채용관에 카드로 등록됩니다.
            </p>
            <p className="text-xs text-gray-400 leading-relaxed">
              Companies can review your profile and send you job offers.
              Your profile will be visible in the talent recruitment section.
            </p>
          </div>

          {/* 버튼 그룹 / Button group */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 min-h-[48px] rounded-xl"
            >
              나중에
              <span className="text-xs text-gray-400 ml-1">/ Later</span>
            </Button>
            <Button
              type="button"
              onClick={onAccept}
              className="flex-1 min-h-[48px] rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold"
            >
              수락하기
              <span className="text-xs ml-1 opacity-80">/ Accept</span>
            </Button>
          </div>

          {/* 추가 안내 / Additional info */}
          <p className="text-xs text-center text-gray-400">
            언제든지 마이페이지에서 설정을 변경할 수 있습니다
            <br />
            You can change this setting anytime in My Page
          </p>
        </div>
      </div>
    </>
  );
}
