'use client';

/**
 * Step5Delta — DELTA 평가 (상세 폼)
 * Step5Delta — DELTA evaluation (detailed form)
 *
 * DELTA 점수, 카테고리, 인증서 업로드, 점수 시뮬레이터
 * DELTA score, category, certificate upload, score simulator
 */

import { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart3,
  Upload,
  FileText,
  CheckCircle2,
  Info,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { WizardFormData } from '../wizard-types';

interface Step5Props {
  formData: WizardFormData;
  onUpdate: (field: keyof WizardFormData, value: string) => void;
}

/** DELTA 카테고리 / DELTA categories */
const DELTA_CATEGORIES = [
  { value: 'IT_SOFTWARE', label: 'IT/소프트웨어 / IT/Software' },
  { value: 'MANUFACTURING', label: '제조업 / Manufacturing' },
  { value: 'CONSTRUCTION', label: '건설업 / Construction' },
  { value: 'AGRICULTURE', label: '농업 / Agriculture' },
  { value: 'SERVICE', label: '서비스업 / Service' },
  { value: 'PROFESSIONAL', label: '전문직 / Professional' },
  { value: 'OTHER', label: '기타 / Other' },
];

/** 점수 등급 계산 / Score grade calculation */
function getScoreGrade(score: number): {
  grade: string;
  color: string;
  bgColor: string;
} {
  if (score >= 80) return { grade: 'A (우수)', color: 'text-green-700', bgColor: 'bg-green-50' };
  if (score >= 60) return { grade: 'B (양호)', color: 'text-blue-700', bgColor: 'bg-blue-50' };
  if (score >= 40) return { grade: 'C (보통)', color: 'text-amber-700', bgColor: 'bg-amber-50' };
  return { grade: 'D (기초)', color: 'text-gray-700', bgColor: 'bg-gray-50' };
}

export default function Step5Delta({ formData, onUpdate }: Step5Props) {
  const [certFileName, setCertFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const score = formData.deltaScore ?? 0;
  const gradeInfo = getScoreGrade(score);

  return (
    <div className="space-y-8">
      {/* 섹션 1: DELTA 점수 / Section 1: DELTA score */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <h3 className="text-sm font-semibold text-gray-900">
            DELTA 평가 점수 / DELTA Evaluation Score
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* DELTA 카테고리 / DELTA category */}
          <div className="space-y-2">
            <Label htmlFor="delta-category">평가 분야 (Evaluation Field)</Label>
            <Select
              value={formData.deltaCategory ?? ''}
              onValueChange={(val) => onUpdate('deltaCategory', val)}
            >
              <SelectTrigger id="delta-category" className="w-full min-h-[44px]">
                <SelectValue placeholder="분야 선택" />
              </SelectTrigger>
              <SelectContent>
                {DELTA_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* DELTA 점수 / DELTA score */}
          <div className="space-y-2">
            <Label htmlFor="delta-score">DELTA 점수 (Score, 0-100)</Label>
            <Input
              id="delta-score"
              type="number"
              min={0}
              max={100}
              value={formData.deltaScore ?? ''}
              onChange={(e) => onUpdate('deltaScore' as keyof WizardFormData, e.target.value)}
              placeholder="0~100"
              className="min-h-[44px]"
            />
          </div>
        </div>

        {/* 점수 시각화 / Score visualization */}
        {score > 0 && (
          <div className={cn('mt-4 p-4 rounded-lg border', gradeInfo.bgColor)}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className={cn('w-4 h-4', gradeInfo.color)} />
                <span className={cn('text-sm font-semibold', gradeInfo.color)}>
                  등급: {gradeInfo.grade}
                </span>
              </div>
              <span className="text-2xl font-bold text-gray-900">{score}점</span>
            </div>

            {/* 점수 바 / Score bar */}
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-blue-500' : score >= 40 ? 'bg-amber-500' : 'bg-gray-400'
                )}
                style={{ width: `${score}%` }}
              />
            </div>

            {/* 등급 라벨 / Grade labels */}
            <div className="flex justify-between mt-1 text-[10px] text-gray-400">
              <span>0</span>
              <span>D(40)</span>
              <span>C(60)</span>
              <span>B(80)</span>
              <span>A(100)</span>
            </div>
          </div>
        )}
      </section>

      {/* 섹션 2: 인증서 업로드 / Section 2: Certificate upload */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Upload className="w-5 h-5 text-blue-600" />
          <h3 className="text-sm font-semibold text-gray-900">
            인증서 업로드 (선택) / Certificate Upload (Optional)
          </h3>
        </div>

        <div
          className={cn(
            'border-2 border-dashed rounded-lg p-6 text-center transition-colors',
            certFileName ? 'border-green-300 bg-green-50/30' : 'border-gray-300 hover:border-gray-400'
          )}
        >
          {certFileName ? (
            <div className="flex flex-col items-center gap-2">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <FileText className="w-3.5 h-3.5" />
                <span>{certFileName}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCertFileName(null);
                  onUpdate('deltaCertFile', '');
                }}
                className="text-xs text-blue-600 hover:underline min-h-[44px] flex items-center"
                aria-label="파일 다시 선택 / Re-select file"
              >
                다시 선택
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-8 h-8 text-gray-400" />
              <p className="text-sm text-gray-600">DELTA 인증서 업로드</p>
              <p className="text-xs text-gray-400">PDF, JPG, PNG (최대 10MB)</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-1 px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors min-h-[44px]"
                aria-label="인증서 파일 선택 / Select certificate file"
              >
                파일 선택
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setCertFileName(file.name);
                    onUpdate('deltaCertFile', file.name);
                  }
                }}
                aria-label="DELTA 인증서 파일 / DELTA certificate file"
              />
            </div>
          )}
        </div>
      </section>

      {/* DELTA 안내 / DELTA info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
          <div className="text-xs text-blue-700 leading-relaxed">
            <p className="font-semibold mb-1">DELTA 평가란?</p>
            <p>
              DELTA(Digital Employment Literacy & Technical Assessment)는 외국인
              구직자의 디지털 역량과 기술 능력을 평가하는 시스템입니다. 점수가
              높을수록 더 많은 기업에 매칭될 수 있습니다.
            </p>
            <p className="mt-1">
              <strong>What is DELTA?</strong> DELTA evaluates digital competency
              and technical skills of foreign job seekers. Higher scores lead to
              more job matches.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
