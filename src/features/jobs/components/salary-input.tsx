'use client';

import { Input } from '@/components/ui/input';
import type { SalaryType, BoardType } from '../types/job-create.types';

interface SalaryInputProps {
  boardType: BoardType;
  salaryType: SalaryType;
  salaryAmount: string;
  salaryMax: string;
  onSalaryTypeChange: (type: SalaryType) => void;
  onSalaryAmountChange: (value: string) => void;
  onSalaryMaxChange: (value: string) => void;
  errors?: Record<string, string>;
}

/**
 * 급여 복합 입력 컴포넌트 / Salary composite input
 * boardType에 따라 시급/월급/연봉 UI 자동 전환
 * Auto-switches between hourly/monthly/annual based on boardType
 */
export function SalaryInput({
  boardType,
  salaryType,
  salaryAmount,
  salaryMax,
  onSalaryTypeChange,
  onSalaryAmountChange,
  onSalaryMaxChange,
  errors = {},
}: SalaryInputProps) {
  const isPartTime = boardType === 'PART_TIME';

  // 급여 유형 옵션 / Salary type options
  const salaryOptions = isPartTime
    ? [{ v: 'HOURLY' as SalaryType, l: '시급' }]
    : [
        { v: 'MONTHLY' as SalaryType, l: '월급' },
        { v: 'ANNUAL' as SalaryType, l: '연봉' },
      ];

  // 단위 텍스트 / Unit text
  const unit = salaryType === 'HOURLY' ? '원' : '만원';

  // 환산 표시 / Conversion display
  const getConversionText = () => {
    const amount = parseInt(salaryAmount);
    if (!amount || amount <= 0) return null;

    if (salaryType === 'HOURLY') {
      const monthly = Math.round((amount * 160) / 10000);
      return `시급 ${amount.toLocaleString()}원 = 월 약 ${monthly.toLocaleString()}만원`;
    }
    if (salaryType === 'ANNUAL') {
      const monthly = Math.round(amount / 12);
      return `연봉 ${amount.toLocaleString()}만원 = 월 약 ${monthly.toLocaleString()}만원`;
    }
    return null;
  };

  const conversionText = getConversionText();

  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">
        급여 <span className="text-red-500">*</span>
      </label>

      {/* 급여 유형 선택 / Salary type selector */}
      {!isPartTime && (
        <div className="flex gap-2 mb-3">
          {salaryOptions.map(opt => (
            <button
              key={opt.v}
              type="button"
              onClick={() => onSalaryTypeChange(opt.v)}
              className={`px-4 py-2 text-sm rounded-lg border transition ${
                salaryType === opt.v
                  ? 'bg-blue-50 text-blue-700 border-blue-300 font-medium'
                  : 'text-gray-600 border-gray-200 hover:border-gray-300'
              }`}
            >
              {opt.l}
            </button>
          ))}
        </div>
      )}

      {/* 급여 입력 / Salary input */}
      <div className="flex items-center gap-2">
        <Input
          type="number"
          value={salaryAmount}
          onChange={e => onSalaryAmountChange(e.target.value)}
          placeholder={salaryType === 'HOURLY' ? '9,860' : '200'}
          className={`flex-1 ${errors.salaryAmount ? 'border-red-500' : ''}`}
        />
        {salaryType !== 'HOURLY' && (
          <>
            <span className="text-gray-400">~</span>
            <Input
              type="number"
              value={salaryMax}
              onChange={e => onSalaryMaxChange(e.target.value)}
              placeholder={`${unit} (선택)`}
              className={`flex-1 ${errors.salaryMax ? 'border-red-500' : ''}`}
            />
          </>
        )}
        <span className="text-sm text-gray-500 shrink-0">{unit}</span>
      </div>

      {/* 에러 메시지 / Error message */}
      {(errors.salaryAmount || errors.salaryMax) && (
        <p className="text-xs text-red-500 mt-1">
          {errors.salaryAmount || errors.salaryMax}
        </p>
      )}

      {/* 환산 표시 / Conversion display */}
      {conversionText && (
        <p className="text-xs text-blue-600 mt-1.5">{conversionText}</p>
      )}

      {/* 최저시급 안내 (알바) / Minimum wage notice (part-time) */}
      {isPartTime && (
        <p className="text-xs text-gray-400 mt-1">
          2025년 최저시급: 9,860원
        </p>
      )}
    </div>
  );
}
