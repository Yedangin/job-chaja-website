'use client';

/**
 * Step 0: 거주 상태 분기 / Residency status selection
 * 3-way 선택 카드: 장기체류 / 단기체류 / 해외 거주
 * 3-way selection cards: Long-term / Short-term / Overseas
 */

import { cn } from '@/lib/utils';
import { Globe, Home, Plane } from 'lucide-react';
import { ResidencyStatus } from '../types';
import type { ResidencyData } from '../types';

interface Step0ResidencyProps {
  /** 현재 데이터 / Current data */
  data: ResidencyData;
  /** 데이터 변경 핸들러 / Data change handler */
  onChange: (data: ResidencyData) => void;
}

/** 거주 상태 선택지 정보 / Residency option info */
const RESIDENCY_OPTIONS: {
  value: ResidencyStatus;
  icon: typeof Globe;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  color: string;
  bgColor: string;
  borderColor: string;
  selectedBg: string;
}[] = [
  {
    value: ResidencyStatus.LONG_TERM,
    icon: Home,
    title: '한국 장기 체류',
    titleEn: 'Long-term Stay in Korea',
    description: '외국인등록증(ARC)을 보유하고 있으며, 6개월 이상 체류 중입니다.',
    descriptionEn: 'I have an ARC and have been staying in Korea for 6+ months.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    selectedBg: 'bg-blue-50',
  },
  {
    value: ResidencyStatus.SHORT_TERM,
    icon: Plane,
    title: '한국 단기 체류',
    titleEn: 'Short-term Stay in Korea',
    description: '관광, 단기방문 등의 목적으로 한국에 체류 중입니다.',
    descriptionEn: 'I am currently visiting Korea for tourism or short-term purposes.',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    selectedBg: 'bg-amber-50',
  },
  {
    value: ResidencyStatus.OVERSEAS,
    icon: Globe,
    title: '해외 거주',
    titleEn: 'Living Overseas',
    description: '현재 해외에 거주하며, 한국 취업을 희망합니다.',
    descriptionEn: 'I am currently living overseas and looking for jobs in Korea.',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    selectedBg: 'bg-green-50',
  },
];

export default function Step0Residency({ data, onChange }: Step0ResidencyProps) {
  const handleSelect = (value: ResidencyStatus) => {
    onChange({ residencyStatus: value });
  };

  return (
    <div className="space-y-6">
      {/* 안내 텍스트 / Guide text */}
      <div className="text-center space-y-2 pt-4">
        <h3 className="text-xl font-bold text-gray-900">
          현재 어디에 거주하고 계신가요?
        </h3>
        <p className="text-sm text-gray-500">
          Where are you currently living?
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {/* 거주 상태에 따라 이후 입력 항목이 달라집니다 */}
          The following steps will differ based on your residency status
        </p>
      </div>

      {/* 선택 카드 목록 — 3칸 가로 배치 / Selection cards — 3-column grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-1">
        {RESIDENCY_OPTIONS.map((option) => {
          const isSelected = data.residencyStatus === option.value;
          const Icon = option.icon;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={cn(
                'text-left rounded-2xl border-2 p-5 transition-all duration-200',
                'flex flex-col items-center text-center gap-3',
                'focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2',
                isSelected
                  ? `${option.selectedBg} ${option.borderColor} shadow-sm`
                  : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm',
              )}
              aria-pressed={isSelected}
              aria-label={`${option.title} / ${option.titleEn}`}
            >
              {/* 아이콘 / Icon */}
              <div
                className={cn(
                  'w-14 h-14 rounded-2xl flex items-center justify-center shrink-0',
                  isSelected ? option.bgColor : 'bg-gray-100',
                )}
              >
                <Icon
                  className={cn(
                    'w-7 h-7',
                    isSelected ? option.color : 'text-gray-400',
                  )}
                />
              </div>

              {/* 텍스트 / Text */}
              <div className="w-full">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <h4
                    className={cn(
                      'text-sm font-bold',
                      isSelected ? 'text-gray-900' : 'text-gray-700',
                    )}
                  >
                    {option.title}
                  </h4>
                  {isSelected && (
                    <span className={cn(
                      'inline-flex w-4 h-4 rounded-full items-center justify-center text-white text-[10px] shrink-0',
                      option.value === ResidencyStatus.LONG_TERM ? 'bg-blue-500' :
                      option.value === ResidencyStatus.SHORT_TERM ? 'bg-amber-500' :
                      'bg-green-500',
                    )}>
                      ✓
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-400 mb-2">{option.titleEn}</p>
                <p
                  className={cn(
                    'text-xs leading-relaxed',
                    isSelected ? 'text-gray-700' : 'text-gray-500',
                  )}
                >
                  {option.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* 선택 안내 / Selection hint */}
      {!data.residencyStatus && (
        <p className="text-center text-xs text-gray-400 pt-2">
          {/* 하나를 선택하면 다음 단계로 진행할 수 있습니다 */}
          Select one to proceed to the next step
        </p>
      )}
    </div>
  );
}
