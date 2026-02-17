'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BENEFIT_OPTIONS } from '../types/job-create.types';

interface BenefitSelectorProps {
  selected: string[];
  onChange: (benefits: string[]) => void;
}

/**
 * 복리후생 칩 + 커스텀 입력 / Benefit chips + custom input
 * 기본 옵션 선택 + 직접 입력 추가
 * Preset options + custom input
 */
export function BenefitSelector({ selected, onChange }: BenefitSelectorProps) {
  const [customInput, setCustomInput] = useState('');

  const toggleBenefit = (benefit: string) => {
    if (selected.includes(benefit)) {
      onChange(selected.filter(b => b !== benefit));
    } else {
      onChange([...selected, benefit]);
    }
  };

  const addCustom = () => {
    const trimmed = customInput.trim();
    if (trimmed && !selected.includes(trimmed)) {
      onChange([...selected, trimmed]);
      setCustomInput('');
    }
  };

  const removeBenefit = (benefit: string) => {
    onChange(selected.filter(b => b !== benefit));
  };

  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">복리후생</label>

      {/* 기본 옵션 / Preset options */}
      <div className="flex flex-wrap gap-2 mb-3">
        {BENEFIT_OPTIONS.map(b => (
          <button
            key={b}
            type="button"
            onClick={() => toggleBenefit(b)}
            className={`px-3 py-1.5 text-sm rounded-full border transition ${
              selected.includes(b)
                ? 'bg-blue-50 text-blue-700 border-blue-300 font-medium'
                : 'text-gray-600 border-gray-200 hover:border-gray-300'
            }`}
          >
            {b}
          </button>
        ))}
      </div>

      {/* 커스텀 입력 / Custom input */}
      <div className="flex gap-2">
        <Input
          value={customInput}
          onChange={e => setCustomInput(e.target.value)}
          placeholder="직접 입력"
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addCustom();
            }
          }}
        />
        <Button
          type="button"
          variant="outline"
          className="shrink-0 text-sm"
          onClick={addCustom}
        >
          추가
        </Button>
      </div>

      {/* 선택된 커스텀 항목 / Selected custom items */}
      {selected.filter(b => !BENEFIT_OPTIONS.includes(b as typeof BENEFIT_OPTIONS[number])).length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {selected
            .filter(b => !BENEFIT_OPTIONS.includes(b as typeof BENEFIT_OPTIONS[number]))
            .map(b => (
              <span
                key={b}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {b}
                <button type="button" onClick={() => removeBenefit(b)}>
                  <X className="w-3 h-3 text-gray-400 hover:text-gray-600" />
                </button>
              </span>
            ))}
        </div>
      )}
    </div>
  );
}
