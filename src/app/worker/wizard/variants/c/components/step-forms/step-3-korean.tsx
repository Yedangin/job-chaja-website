'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { CheckCircle2, Loader2 } from 'lucide-react';

/**
 * Step 3: 한국어능력 폼 (간소화) / Step 3: Korean language form (simplified)
 * TOPIK, KIIP, 세종학당 점수 입력
 * TOPIK, KIIP, Sejong Institute score input
 */

interface Step3KoreanProps {
  onSave: (data: Record<string, unknown>) => Promise<void>;
  onClose: () => void;
}

export default function Step3Korean({ onSave, onClose }: Step3KoreanProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [topik, setTopik] = useState(0);
  const [kiip, setKiip] = useState(0);
  const [sejong, setSejong] = useState(0);

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      await onSave({ topikLevel: topik, kiipStage: kiip, sejongLevel: sejong });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* TOPIK 등급 / TOPIK Level */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-gray-700">
          TOPIK 등급
          <span className="text-xs text-gray-400 ml-1">/ TOPIK Level</span>
        </Label>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-400">미응시 / None</span>
          <span className="text-lg font-bold text-blue-600">{topik === 0 ? '-' : `${topik}급`}</span>
          <span className="text-xs text-gray-400">6급</span>
        </div>
        <Slider
          value={[topik]}
          onValueChange={(v) => setTopik(v[0])}
          min={0}
          max={6}
          step={1}
          aria-label="TOPIK 등급 / TOPIK Level"
        />
        <div className="flex justify-between text-[10px] text-gray-400">
          {[0, 1, 2, 3, 4, 5, 6].map((n) => (
            <span key={n}>{n || '-'}</span>
          ))}
        </div>
      </div>

      {/* KIIP 단계 / KIIP Stage */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-gray-700">
          KIIP 단계 (사회통합프로그램)
          <span className="text-xs text-gray-400 ml-1">/ KIIP Stage</span>
        </Label>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-400">미이수 / None</span>
          <span className="text-lg font-bold text-purple-600">{kiip === 0 ? '-' : `${kiip}단계`}</span>
          <span className="text-xs text-gray-400">5단계</span>
        </div>
        <Slider
          value={[kiip]}
          onValueChange={(v) => setKiip(v[0])}
          min={0}
          max={5}
          step={1}
          aria-label="KIIP 단계 / KIIP Stage"
        />
      </div>

      {/* 세종학당 레벨 / Sejong Institute Level */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-gray-700">
          세종학당 레벨
          <span className="text-xs text-gray-400 ml-1">/ Sejong Institute Level</span>
        </Label>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-400">미이수 / None</span>
          <span className="text-lg font-bold text-green-600">{sejong === 0 ? '-' : `${sejong}레벨`}</span>
          <span className="text-xs text-gray-400">6레벨</span>
        </div>
        <Slider
          value={[sejong]}
          onValueChange={(v) => setSejong(v[0])}
          min={0}
          max={6}
          step={1}
          aria-label="세종학당 레벨 / Sejong Institute Level"
        />
      </div>

      {/* 저장 버튼 / Save button */}
      <div className="flex gap-3 pt-4 border-t border-gray-100">
        <Button
          variant="outline"
          onClick={onClose}
          className="flex-1 h-12 rounded-xl"
          aria-label="취소 / Cancel"
        >
          취소
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSaving}
          className="flex-1 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          aria-label="저장하기 / Save"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 mr-1" />
              저장하기
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
