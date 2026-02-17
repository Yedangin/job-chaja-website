'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { JobCreateFormData, WizardStep } from '../types/job-create.types';
import { toast } from '@/lib/toast';

const STORAGE_KEY = 'jobDraft';
const AUTO_SAVE_DELAY = 3000; // 3초 디바운스 / 3s debounce

interface SavedDraft {
  form: JobCreateFormData;
  step: WizardStep;
  savedAt: string;
}

/**
 * 자동저장 훅 / Auto-save hook
 * localStorage에 폼 데이터를 3초 디바운스로 자동 저장
 * Auto-saves form data to localStorage with 3s debounce
 */
export function useAutoSave(form: JobCreateFormData, step: WizardStep) {
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 저장 실행 / Execute save
  const save = useCallback(() => {
    if (!form.title.trim()) return;
    setIsSaving(true);
    try {
      const draft: SavedDraft = {
        form,
        step,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
      setLastSaved(
        new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
      );
    } catch { /* localStorage 용량 초과 등 무시 / Ignore quota exceeded */ }
    finally { setIsSaving(false); }
  }, [form, step]);

  // 디바운스 자동저장 / Debounced auto-save
  useEffect(() => {
    if (step >= 6) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(save, AUTO_SAVE_DELAY);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [form, step, save]);

  // 임시저장 불러오기 / Load draft
  const loadDraft = useCallback((): SavedDraft | null => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as SavedDraft;
      if (parsed.form && parsed.step) return parsed;
      return null;
    } catch {
      return null;
    }
  }, []);

  // 임시저장 삭제 / Clear draft
  const clearDraft = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setLastSaved(null);
  }, []);

  // 수동 저장 / Manual save
  const manualSave = useCallback(() => {
    save();
    toast.info('임시저장되었습니다.');
  }, [save]);

  // 이전 작성 내용 복원 확인 / Check for restore prompt
  const checkRestore = useCallback((): SavedDraft | null => {
    const draft = loadDraft();
    if (draft) {
      return draft;
    }
    return null;
  }, [loadDraft]);

  return {
    lastSaved,
    isSaving,
    manualSave,
    clearDraft,
    checkRestore,
  };
}
