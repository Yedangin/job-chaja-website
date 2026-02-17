'use client';

import { useEffect, useRef } from 'react';
import { X, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAddressSearch } from '../hooks/use-address-search';
import type { DaumAddressData } from '../types/job-create.types';

interface AddressSearchModalProps {
  address: string;
  addressDetail: string;
  onAddressChange: (address: string) => void;
  onAddressDetailChange: (detail: string) => void;
  error?: string;
}

/**
 * 주소 검색 모달 / Address search modal
 * 다음 우편번호 API 연동, 직접 입력도 가능
 * Integrates Daum Postcode API, also allows manual input
 */
export function AddressSearchModal({
  address,
  addressDetail,
  onAddressChange,
  onAddressDetailChange,
  error,
}: AddressSearchModalProps) {
  const { isOpen, openSearch, closeSearch, searchAddress } = useAddressSearch();
  const embedRef = useRef<HTMLDivElement>(null);

  // 모달 열릴 때 검색 실행 / Execute search when modal opens
  useEffect(() => {
    if (isOpen && embedRef.current) {
      searchAddress(
        (data: DaumAddressData) => {
          onAddressChange(data.roadAddress || data.jibunAddress);
        },
        embedRef.current,
      );
    }
  }, [isOpen, searchAddress, onAddressChange]);

  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-1.5">
        근무지 주소 <span className="text-red-500">*</span>
      </label>

      {/* 주소 입력 + 검색 버튼 / Address input + search button */}
      <div className="flex gap-2">
        <Input
          value={address}
          onChange={e => onAddressChange(e.target.value)}
          placeholder="주소를 검색하세요"
          className={`flex-1 ${error ? 'border-red-500' : ''}`}
          readOnly={false}
        />
        <Button
          type="button"
          variant="outline"
          className="shrink-0 gap-1"
          onClick={openSearch}
        >
          <MapPin className="w-4 h-4" /> 주소 검색
        </Button>
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

      {/* 상세 주소 / Detail address */}
      <Input
        value={addressDetail}
        onChange={e => onAddressDetailChange(e.target.value)}
        placeholder="상세 주소 (동/호수 등)"
        className="mt-2"
      />

      {/* 주소 검색 모달 / Search modal overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl w-full max-w-lg mx-4 overflow-hidden shadow-2xl">
            {/* 모달 헤더 / Modal header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="font-bold text-gray-900">주소 검색</h3>
              <button type="button" onClick={closeSearch}>
                <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            {/* 다음 API 임베드 영역 / Daum API embed area */}
            <div ref={embedRef} className="h-[450px]" />
          </div>
        </div>
      )}
    </div>
  );
}
