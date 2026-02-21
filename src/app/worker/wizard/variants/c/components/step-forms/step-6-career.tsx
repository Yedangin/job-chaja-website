'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2, Plus, Trash2 } from 'lucide-react';

/**
 * Step 6: 경력 폼 (간소화) / Step 6: Career form (simplified)
 * 이전 직장명, 직무, 근무기간 입력
 * Previous company, position, work period input
 */

interface Step6CareerProps {
  onSave: (data: Record<string, unknown>) => Promise<void>;
  onClose: () => void;
}

interface CareerEntry {
  id: string;
  companyName: string;
  position: string;
  startDate: string;
  endDate: string;
}

export default function Step6Career({ onSave, onClose }: Step6CareerProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [careers, setCareers] = useState<CareerEntry[]>([
    { id: '1', companyName: '', position: '', startDate: '', endDate: '' },
  ]);

  const addCareer = () => {
    setCareers((prev) => [
      ...prev,
      { id: String(Date.now()), companyName: '', position: '', startDate: '', endDate: '' },
    ]);
  };

  const removeCareer = (id: string) => {
    if (careers.length > 1) {
      setCareers((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const updateCareer = (id: string, field: keyof CareerEntry, value: string) => {
    setCareers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      await onSave({ careers });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      {careers.map((career, index) => (
        <div
          key={career.id}
          className="p-4 bg-gray-50 rounded-2xl space-y-3 relative"
        >
          {/* 경력 번호 + 삭제 / Career number + delete */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">
              {/* 경력 N / Career N */}
              경력 {index + 1}
            </span>
            {careers.length > 1 && (
              <button
                type="button"
                onClick={() => removeCareer(career.id)}
                className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label={`경력 ${index + 1} 삭제 / Remove career ${index + 1}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* 회사명 / Company */}
          <div className="space-y-1">
            <Label className="text-xs font-medium text-gray-600">
              회사명 <span className="text-gray-400">/ Company</span>
            </Label>
            <Input
              value={career.companyName}
              onChange={(e) => updateCareer(career.id, 'companyName', e.target.value)}
              placeholder="회사 이름 / Company name"
              className="h-10 rounded-xl text-sm"
            />
          </div>

          {/* 직무 / Position */}
          <div className="space-y-1">
            <Label className="text-xs font-medium text-gray-600">
              직무 <span className="text-gray-400">/ Position</span>
            </Label>
            <Input
              value={career.position}
              onChange={(e) => updateCareer(career.id, 'position', e.target.value)}
              placeholder="직무/직위 / Position/Title"
              className="h-10 rounded-xl text-sm"
            />
          </div>

          {/* 근무기간 / Work period */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-600">
                시작일 <span className="text-gray-400">/ From</span>
              </Label>
              <Input
                type="month"
                value={career.startDate}
                onChange={(e) => updateCareer(career.id, 'startDate', e.target.value)}
                className="h-10 rounded-xl text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-600">
                종료일 <span className="text-gray-400">/ To</span>
              </Label>
              <Input
                type="month"
                value={career.endDate}
                onChange={(e) => updateCareer(career.id, 'endDate', e.target.value)}
                className="h-10 rounded-xl text-sm"
              />
            </div>
          </div>
        </div>
      ))}

      {/* 경력 추가 버튼 / Add career button */}
      <Button
        type="button"
        variant="outline"
        onClick={addCareer}
        className="w-full h-11 rounded-xl border-dashed border-2 text-gray-500 hover:text-blue-600 hover:border-blue-300"
        aria-label="경력 추가 / Add career"
      >
        <Plus className="w-4 h-4 mr-1" />
        경력 추가 / Add Career
      </Button>

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
