'use client';

import { CATEGORY_OPTIONS } from '../types/job-create.types';

interface CategorySelectorProps {
  selected: string[];
  onChange: (categories: string[]) => void;
  error?: string;
}

/**
 * 직종 멀티셀렉트 칩 / Category multi-select chips
 * 최대 3개 선택 가능
 * Up to 3 selections allowed
 */
export function CategorySelector({ selected, onChange, error }: CategorySelectorProps) {
  const toggleCategory = (cat: string) => {
    if (selected.includes(cat)) {
      onChange(selected.filter(c => c !== cat));
    } else if (selected.length < 3) {
      onChange([...selected, cat]);
    }
  };

  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">
        모집 직종/직무 (최대 3개) <span className="text-red-500">*</span>
      </label>
      <div className="flex flex-wrap gap-2">
        {CATEGORY_OPTIONS.map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => toggleCategory(cat)}
            className={`px-3 py-1.5 text-sm rounded-full border transition ${
              selected.includes(cat)
                ? 'bg-blue-50 text-blue-700 border-blue-300 font-medium'
                : 'text-gray-600 border-gray-200 hover:border-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      <p className="text-xs text-gray-400 mt-1">{selected.length}/3 선택됨</p>
    </div>
  );
}
