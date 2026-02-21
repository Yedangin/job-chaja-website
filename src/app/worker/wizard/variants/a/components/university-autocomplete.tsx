'use client';

/**
 * 대학교/어학당 자동완성 컴포넌트 / University/Language Institute Autocomplete Component
 * 국내 교육기관 검색 및 선택 / Search and select Korean educational institutions
 */

import { useState, useRef, useEffect } from 'react';
import { Search, X, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

/** 교육기관 타입 / Institution type */
export type InstitutionType = 'UNIVERSITY' | 'COLLEGE' | 'GRADUATE_SCHOOL' | 'LANGUAGE_INSTITUTE';

/** 교육기관 DTO / Institution DTO */
export interface InstitutionDto {
  id: number;
  name: string;
  nameEn?: string;
  type: InstitutionType;
  address: string;
  addressDetail?: string;
  latitude: number;
  longitude: number;
  isMetroArea: boolean;
  affiliatedUniversity?: string;
  searchKeywords: string[];
}

interface UniversityAutocompleteProps {
  /** 선택된 교육기관 / Selected institution */
  value?: InstitutionDto | null;
  /** 선택 핸들러 / Selection handler */
  onSelect: (institution: InstitutionDto) => void;
  /** 교육기관 타입 필터 (선택사항) / Institution type filter (optional) */
  type?: InstitutionType;
  /** 플레이스홀더 / Placeholder */
  placeholder?: string;
  /** 비활성화 / Disabled */
  disabled?: boolean;
}

/**
 * 대학교 자동완성 컴포넌트 / University Autocomplete Component
 *
 * 국내 대학교, 전문대학, 대학원, 어학당 검색 및 선택
 * Search and select Korean universities, colleges, graduate schools, and language institutes
 */
export function UniversityAutocomplete({
  value,
  onSelect,
  type,
  placeholder = '학교명 입력 (예: 서울대) / Enter school name',
  disabled = false,
}: UniversityAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<InstitutionDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout>();

  /** 교육기관 검색 / Search institutions */
  const searchInstitutions = async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        limit: '10',
      });

      if (type) {
        params.append('type', type);
      }

      const response = await fetch(`http://localhost:8000/institutions/search?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch institutions');
      }

      const data: InstitutionDto[] = await response.json();
      setResults(data);
      setIsOpen(true);
      setSelectedIndex(0);
    } catch (error) {
      console.error('Institution search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  /** 입력 변경 핸들러 (디바운스 적용) / Input change handler (with debounce) */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    // 디바운스: 300ms 대기 후 검색 / Debounce: search after 300ms
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      searchInstitutions(newQuery);
    }, 300);
  };

  /** 교육기관 선택 핸들러 / Institution selection handler */
  const handleSelect = (institution: InstitutionDto) => {
    onSelect(institution);
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  /** 선택 취소 핸들러 / Clear selection handler */
  const handleClear = () => {
    onSelect(null as any);
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  /** 키보드 네비게이션 / Keyboard navigation */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % results.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  /** 외부 클릭 감지 / Detect outside clicks */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /** 교육기관 타입 라벨 / Institution type label */
  const getTypeLabel = (instType: InstitutionType): string => {
    const labels: Record<InstitutionType, string> = {
      UNIVERSITY: '대학교',
      COLLEGE: '전문대학',
      GRADUATE_SCHOOL: '대학원',
      LANGUAGE_INSTITUTE: '어학당',
    };
    return labels[instType] || '';
  };

  return (
    <div ref={containerRef} className="relative">
      {/* 선택된 교육기관 표시 / Selected institution display */}
      {value ? (
        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-blue-900 truncate">{value.name}</p>
            <p className="text-xs text-blue-600 truncate">
              {getTypeLabel(value.type)} · {value.address}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClear}
            disabled={disabled}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-blue-100 text-blue-600 shrink-0 disabled:opacity-50"
            aria-label="선택 취소 / Clear selection"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        // 검색 입력 필드 / Search input field
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            ref={inputRef}
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (results.length > 0) {
                setIsOpen(true);
              }
            }}
            placeholder={placeholder}
            disabled={disabled}
            className="pl-9 min-h-[40px] rounded-lg text-sm"
          />
        </div>
      )}

      {/* 검색 결과 드롭다운 / Search results dropdown */}
      {isOpen && !value && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-[320px] overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-gray-500">
              검색 중... / Searching...
            </div>
          ) : results.length > 0 ? (
            <ul className="py-1">
              {results.map((institution, index) => (
                <li key={institution.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(institution)}
                    className={cn(
                      'w-full px-3 py-2.5 text-left hover:bg-blue-50 transition-colors',
                      index === selectedIndex && 'bg-blue-50',
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <Building2 className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {institution.name}
                          </p>
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 shrink-0">
                            {getTypeLabel(institution.type)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          {institution.address}
                        </p>
                        {institution.affiliatedUniversity && (
                          <p className="text-xs text-blue-600 truncate mt-0.5">
                            소속: {institution.affiliatedUniversity}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : query.length >= 2 ? (
            <div className="p-4 text-center text-sm text-gray-500">
              검색 결과가 없습니다 / No results found
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
