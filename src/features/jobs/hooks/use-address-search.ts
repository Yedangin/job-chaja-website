'use client';

import { useState, useCallback } from 'react';
import type { DaumAddressData } from '../types/job-create.types';

/**
 * 다음 주소 검색 훅 / Daum address search hook
 * 다음 우편번호 API를 활용한 주소 검색
 * Uses Daum Postcode API for address search
 */
export function useAddressSearch() {
  const [isOpen, setIsOpen] = useState(false);

  // 모달 열기/닫기 / Open/close modal
  const openSearch = useCallback(() => setIsOpen(true), []);
  const closeSearch = useCallback(() => setIsOpen(false), []);

  // 다음 API 스크립트 로드 / Load Daum API script
  const loadScript = useCallback((): Promise<void> => {
    return new Promise((resolve, reject) => {
      // 이미 로드됨 / Already loaded
      if ((window as unknown as Record<string, unknown>).daum) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('다음 주소 API를 불러올 수 없습니다.'));
      document.head.appendChild(script);
    });
  }, []);

  // 주소 검색 실행 / Execute address search
  const searchAddress = useCallback(async (
    onComplete: (data: DaumAddressData) => void,
    container?: HTMLElement | null,
  ) => {
    try {
      await loadScript();
      const daum = (window as unknown as Record<string, unknown>).daum as {
        Postcode: new (options: {
          oncomplete: (data: DaumAddressData) => void;
          onclose?: () => void;
          width: string;
          height: string;
        }) => { embed: (el: HTMLElement) => void; open: () => void };
      };

      const postcode = new daum.Postcode({
        oncomplete: (data: DaumAddressData) => {
          onComplete(data);
          closeSearch();
        },
        onclose: () => closeSearch(),
        width: '100%',
        height: '100%',
      });

      if (container) {
        postcode.embed(container);
      } else {
        postcode.open();
      }
    } catch {
      // API 로드 실패 시 무시 / Ignore API load failure
    }
  }, [loadScript, closeSearch]);

  return {
    isOpen,
    openSearch,
    closeSearch,
    searchAddress,
  };
}
