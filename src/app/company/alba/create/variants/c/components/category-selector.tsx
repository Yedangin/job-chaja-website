'use client';

import { useState, useMemo } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { JOB_CATEGORIES, type JobCategory } from './alba-types';

/**
 * 비주얼 직종 선택 컴포넌트 (카드 그리드)
 * Visual job category selector with card grid layout
 *
 * 알바몬/당근마켓 스타일 — 이모지 아이콘 + 카드 기반
 * Albamon/Daangn style — emoji icons + card-based
 */

interface CategorySelectorProps {
  value: string;
  onChange: (code: string) => void;
}

export function CategorySelector({ value, onChange }: CategorySelectorProps) {
  // 검색어 상태 / Search keyword state
  const [searchQuery, setSearchQuery] = useState('');
  // 선택된 그룹 (null = 전체) / Selected group (null = all)
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  // 그룹 목록 추출 / Extract group list
  const groups = useMemo(() => {
    const groupMap = new Map<string, string>();
    JOB_CATEGORIES.forEach((cat) => {
      if (!groupMap.has(cat.group)) {
        groupMap.set(cat.group, cat.groupName);
      }
    });
    return Array.from(groupMap.entries()).map(([code, name]) => ({ code, name }));
  }, []);

  // 필터링된 카테고리 목록 / Filtered category list
  const filteredCategories = useMemo(() => {
    let result = JOB_CATEGORIES;

    if (selectedGroup) {
      result = result.filter((cat) => cat.group === selectedGroup);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (cat) =>
          cat.name.toLowerCase().includes(q) ||
          cat.nameEn.toLowerCase().includes(q) ||
          cat.groupName.toLowerCase().includes(q)
      );
    }

    return result;
  }, [selectedGroup, searchQuery]);

  // 선택된 카테고리 / Selected category
  const selectedCategory = JOB_CATEGORIES.find((c) => c.code === value);

  return (
    <div className="space-y-4">
      {/* 선택된 직종 표시 / Selected category display */}
      {selectedCategory && (
        <div className="flex items-center gap-3 p-3 bg-orange-50 border border-orange-200 rounded-2xl">
          <span className="text-2xl" role="img" aria-label={selectedCategory.name}>
            {selectedCategory.icon}
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-orange-900">
              {/* 선택됨 / Selected */}
              {selectedCategory.name}
            </p>
            <p className="text-xs text-orange-600">{selectedCategory.nameEn}</p>
          </div>
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-xs text-orange-500 hover:text-orange-700 underline min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="직종 변경 / Change category"
          >
            {/* 변경 / Change */}
            변경
          </button>
        </div>
      )}

      {/* 검색 + 그룹 필터 / Search + group filter */}
      {!selectedCategory && (
        <>
          {/* 검색 입력 / Search input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="직종 검색... / Search category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 rounded-xl border-gray-200 bg-gray-50 focus:bg-white"
              aria-label="직종 검색 / Search job category"
            />
          </div>

          {/* 그룹 탭 (가로 스크롤) / Group tabs (horizontal scroll) */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
            <button
              type="button"
              onClick={() => setSelectedGroup(null)}
              className={cn(
                'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all min-h-[44px]',
                selectedGroup === null
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
              aria-label="전체 직종 / All categories"
            >
              {/* 전체 / All */}
              전체
            </button>
            {groups.map((group) => (
              <button
                key={group.code}
                type="button"
                onClick={() => setSelectedGroup(group.code)}
                className={cn(
                  'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap min-h-[44px]',
                  selectedGroup === group.code
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
                aria-label={`${group.name} 그룹 / ${group.name} group`}
              >
                {group.name}
              </button>
            ))}
          </div>

          {/* 카테고리 카드 그리드 / Category card grid */}
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
            {filteredCategories.map((cat) => (
              <CategoryCard
                key={cat.code}
                category={cat}
                isSelected={cat.code === value}
                onSelect={onChange}
              />
            ))}
          </div>

          {/* 검색 결과 없음 / No results */}
          {filteredCategories.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <p className="text-sm">
                {/* 검색 결과가 없습니다 / No results found */}
                검색 결과가 없습니다
              </p>
              <p className="text-xs mt-1">No results found</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/**
 * 개별 카테고리 카드 / Individual category card
 */
function CategoryCard({
  category,
  isSelected,
  onSelect,
}: {
  category: JobCategory;
  isSelected: boolean;
  onSelect: (code: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(category.code)}
      className={cn(
        'flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all min-h-[44px]',
        'hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm',
        isSelected
          ? 'border-orange-400 bg-orange-50 shadow-md shadow-orange-100'
          : 'border-transparent bg-gray-50 hover:border-orange-200'
      )}
      aria-label={`${category.name} 선택 / Select ${category.nameEn}`}
      aria-pressed={isSelected}
    >
      <span className="text-2xl md:text-3xl" role="img" aria-hidden="true">
        {category.icon}
      </span>
      <span className={cn(
        'text-xs font-medium text-center leading-tight',
        isSelected ? 'text-orange-800' : 'text-gray-700'
      )}>
        {category.name}
      </span>
    </button>
  );
}
