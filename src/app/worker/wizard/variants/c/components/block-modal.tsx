'use client';

import { useEffect, useRef } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { WizardBlock } from './wizard-types';

/**
 * 블록 모달/슬라이드 패널 / Block modal/slide panel
 * 타일 클릭 시 우측에서 슬라이드 인 되는 폼 패널.
 * Slide-in panel from right when tile is clicked.
 *
 * 모바일: 전체 화면 슬라이드 / Mobile: full-screen slide
 * 데스크톱: 우측 사이드 패널 / Desktop: right side panel
 */

interface BlockModalProps {
  block: WizardBlock | null;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function BlockModal({ block, isOpen, onClose, children }: BlockModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // ESC 키로 닫기 / Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      // 바디 스크롤 방지 / Prevent body scroll
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // 열림/닫힘 애니메이션 focus 관리 / Focus management on open/close
  useEffect(() => {
    if (isOpen && panelRef.current) {
      panelRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen || !block) return null;

  return (
    <>
      {/* 오버레이 (데스크톱) / Overlay (desktop) */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 animate-in fade-in duration-200 hidden md:block"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 슬라이드 패널 / Slide panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${block.name} (${block.nameEn}) 설정`}
        tabIndex={-1}
        className={cn(
          'fixed z-50 bg-white shadow-2xl flex flex-col',
          'focus-visible:outline-none',
          // 모바일: 전체 화면 / Mobile: full screen
          'inset-0 md:inset-auto',
          // 데스크톱: 우측 사이드 패널 / Desktop: right side panel
          'md:top-0 md:right-0 md:bottom-0 md:w-[520px] md:max-w-[90vw]',
          'md:rounded-l-3xl',
          // 슬라이드 애니메이션 / Slide animation
          'animate-in slide-in-from-right duration-300 md:slide-in-from-right',
        )}
      >
        {/* 상단 헤더 / Top header */}
        <header className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 shrink-0">
          {/* 뒤로가기 (모바일) / Back button (mobile) */}
          <button
            type="button"
            onClick={onClose}
            className="md:hidden p-2 -ml-1 rounded-xl hover:bg-gray-100 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="돌아가기 / Go back"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-gray-900 truncate">
              {block.name}
              <span className="text-xs font-normal text-gray-400 ml-1.5">
                {block.nameEn}
              </span>
            </h2>
            <p className="text-xs text-gray-400 truncate">
              {block.description}
            </p>
          </div>

          {/* 닫기 (데스크톱) / Close button (desktop) */}
          <button
            type="button"
            onClick={onClose}
            className="hidden md:flex p-2 rounded-xl hover:bg-gray-100 transition min-h-[44px] min-w-[44px] items-center justify-center"
            aria-label="닫기 / Close"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </header>

        {/* 폼 콘텐츠 영역 / Form content area */}
        <div className="flex-1 overflow-y-auto px-4 py-5">
          {children}
        </div>
      </div>
    </>
  );
}
