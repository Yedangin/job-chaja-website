'use client';

import { useState } from 'react';
import { MapPin, Plane, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ResidencyType } from './wizard-types';

/**
 * 거주 분기 모달 (Step 0) / Residency branch modal (Step 0)
 * 최초 진입 시 1회만 표시. 국내 거주 또는 해외 거주 선택.
 * Shown once on first entry. Select domestic or overseas residency.
 */

interface ResidencyModalProps {
  isOpen: boolean;
  onSelect: (type: ResidencyType) => void;
  onClose: () => void;
}

export default function ResidencyModal({ isOpen, onSelect, onClose }: ResidencyModalProps) {
  const [selected, setSelected] = useState<ResidencyType | null>(null);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (selected) {
      onSelect(selected);
    }
  };

  return (
    <>
      {/* 오버레이 / Overlay */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 모달 컨텐츠 / Modal content */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-label="거주 유형 선택 / Residency type selection"
      >
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
          {/* 상단 헤더 / Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-2">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {/* 환영합니다! / Welcome! */}
                환영합니다!
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {/* 현재 거주 상태를 선택하세요 / Select your current residency */}
                현재 거주 상태를 선택하세요
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-gray-100 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="닫기 / Close"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* 선택 카드 / Selection cards */}
          <div className="px-6 py-4 space-y-3">
            {/* 국내 거주 / Domestic */}
            <button
              type="button"
              onClick={() => setSelected('domestic')}
              className={cn(
                'w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all min-h-[76px]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400',
                selected === 'domestic'
                  ? 'border-blue-400 bg-blue-50/80 shadow-md shadow-blue-100'
                  : 'border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50/30'
              )}
              aria-label="한국 국내 거주 / Currently in Korea"
              aria-pressed={selected === 'domestic'}
            >
              <div
                className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors',
                  selected === 'domestic' ? 'bg-blue-100' : 'bg-gray-100'
                )}
              >
                <MapPin
                  className={cn(
                    'w-6 h-6 transition-colors',
                    selected === 'domestic' ? 'text-blue-600' : 'text-gray-400'
                  )}
                />
              </div>
              <div className="text-left">
                <p
                  className={cn(
                    'font-bold transition-colors',
                    selected === 'domestic' ? 'text-blue-700' : 'text-gray-700'
                  )}
                >
                  {/* 한국 국내 거주 / Living in Korea */}
                  한국 국내 거주
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {/* 현재 한국에 체류 중입니다 / Currently staying in Korea */}
                  현재 한국에 체류 중입니다
                </p>
              </div>
            </button>

            {/* 해외 거주 / Overseas */}
            <button
              type="button"
              onClick={() => setSelected('overseas')}
              className={cn(
                'w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all min-h-[76px]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400',
                selected === 'overseas'
                  ? 'border-purple-400 bg-purple-50/80 shadow-md shadow-purple-100'
                  : 'border-gray-200 bg-white hover:border-purple-200 hover:bg-purple-50/30'
              )}
              aria-label="해외 거주 (입국 예정) / Living overseas (planning to enter Korea)"
              aria-pressed={selected === 'overseas'}
            >
              <div
                className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors',
                  selected === 'overseas' ? 'bg-purple-100' : 'bg-gray-100'
                )}
              >
                <Plane
                  className={cn(
                    'w-6 h-6 transition-colors',
                    selected === 'overseas' ? 'text-purple-600' : 'text-gray-400'
                  )}
                />
              </div>
              <div className="text-left">
                <p
                  className={cn(
                    'font-bold transition-colors',
                    selected === 'overseas' ? 'text-purple-700' : 'text-gray-700'
                  )}
                >
                  {/* 해외 거주 (입국 예정) / Living Overseas */}
                  해외 거주 (입국 예정)
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {/* 한국 입국을 계획하고 있습니다 / Planning to enter Korea */}
                  한국 입국을 계획하고 있습니다
                </p>
              </div>
            </button>
          </div>

          {/* 확인 버튼 / Confirm button */}
          <div className="px-6 pb-6 pt-2">
            <Button
              onClick={handleConfirm}
              disabled={!selected}
              className={cn(
                'w-full h-12 rounded-2xl font-bold text-base transition-all',
                selected
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              )}
              aria-label="선택 확인 / Confirm selection"
            >
              {/* 시작하기 / Get Started */}
              시작하기
            </Button>

            <p className="text-center text-[10px] text-gray-400 mt-2">
              {/* 나중에 프로필에서 변경 가능합니다 / Can be changed later in profile */}
              나중에 프로필에서 변경 가능합니다
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
