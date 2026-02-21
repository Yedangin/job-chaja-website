'use client';

import { useState, useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import {
  CheckCircle2,
  Loader2,
  Zap,
  Plus,
  X,
  Award,
  Wrench,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TECHNICAL_SKILLS } from '../mock-data';
import type { DeltaFormData } from '../wizard-types';

/**
 * Step 5: DELTA 폼 (상세 구현) / Step 5: DELTA form (detailed)
 * 기술 스킬, 언어 점수, 자격증, 특기사항 평가
 * Technical skills, language scores, certifications, special abilities
 *
 * DELTA = Direct Evaluation of Language, Technical skills, and Abilities
 */

interface Step5DeltaProps {
  onSave: (data: Record<string, unknown>) => Promise<void>;
  onClose: () => void;
}

export default function Step5Delta({ onSave, onClose }: Step5DeltaProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<DeltaFormData>({
    technicalSkills: [],
    languageScores: { topik: 0, kiip: 0, sejong: 0 },
    certifications: [],
    specialAbilities: '',
  });

  // 자격증 입력 필드 / Certification input field
  const [certInput, setCertInput] = useState('');

  // 기술 스킬 섹션 펼침/접힘 / Technical skills section expand/collapse
  const [showAllSkills, setShowAllSkills] = useState(false);

  // 기술 스킬 토글 / Toggle technical skill
  const toggleSkill = useCallback((code: string) => {
    setFormData((prev) => ({
      ...prev,
      technicalSkills: prev.technicalSkills.includes(code)
        ? prev.technicalSkills.filter((s) => s !== code)
        : [...prev.technicalSkills, code],
    }));
  }, []);

  // 자격증 추가 / Add certification
  const addCertification = useCallback(() => {
    const trimmed = certInput.trim();
    if (trimmed && !formData.certifications.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        certifications: [...prev.certifications, trimmed],
      }));
      setCertInput('');
    }
  }, [certInput, formData.certifications]);

  // 자격증 삭제 / Remove certification
  const removeCertification = useCallback((cert: string) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((c) => c !== cert),
    }));
  }, []);

  // DELTA 점수 계산 (목업) / Calculate DELTA score (mock)
  const deltaScore = (() => {
    let score = 0;
    score += formData.technicalSkills.length * 10;
    score += formData.languageScores.topik * 8;
    score += formData.languageScores.kiip * 6;
    score += formData.languageScores.sejong * 4;
    score += formData.certifications.length * 12;
    if (formData.specialAbilities.length > 20) score += 10;
    return Math.min(score, 100);
  })();

  // DELTA 등급 / DELTA grade
  const deltaGrade = deltaScore >= 80 ? 'A' : deltaScore >= 60 ? 'B' : deltaScore >= 40 ? 'C' : 'D';
  const deltaColor = deltaScore >= 80 ? 'text-green-600' : deltaScore >= 60 ? 'text-blue-600' : deltaScore >= 40 ? 'text-amber-600' : 'text-gray-500';

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      await onSave(formData as unknown as Record<string, unknown>);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  // 표시할 스킬 수 / Number of skills to display
  const visibleSkills = showAllSkills ? TECHNICAL_SKILLS : TECHNICAL_SKILLS.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* DELTA 점수 미리보기 / DELTA score preview */}
      <div className="bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 rounded-2xl p-5 border border-indigo-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-600" />
            <span className="text-sm font-bold text-indigo-800">
              {/* DELTA 종합 점수 / DELTA Total Score */}
              DELTA 종합 점수
            </span>
          </div>
          <div className="text-right">
            <span className={cn('text-3xl font-extrabold tabular-nums', deltaColor)}>
              {deltaScore}
            </span>
            <span className="text-sm text-gray-500">/100</span>
          </div>
        </div>

        {/* 점수 바 / Score bar */}
        <div className="mt-3 h-2.5 bg-white/60 rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-700',
              deltaScore >= 80 ? 'bg-green-500' :
              deltaScore >= 60 ? 'bg-blue-500' :
              deltaScore >= 40 ? 'bg-amber-500' :
              'bg-gray-400'
            )}
            style={{ width: `${deltaScore}%` }}
          />
        </div>

        {/* 등급 표시 / Grade display */}
        <div className="flex items-center justify-between mt-2">
          <p className="text-[10px] text-indigo-500">
            {/* 스킬/자격증을 추가할수록 점수가 올라갑니다 / Add more skills & certs to increase score */}
            스킬/자격증을 추가할수록 점수가 올라갑니다
          </p>
          <span className={cn('text-sm font-bold', deltaColor)}>
            Grade {deltaGrade}
          </span>
        </div>
      </div>

      {/* === 기술 스킬 / Technical Skills === */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
          <Wrench className="w-4 h-4 text-gray-500" />
          기술 스킬
          <span className="text-xs text-gray-400 ml-1">/ Technical Skills</span>
          {formData.technicalSkills.length > 0 && (
            <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-auto">
              {formData.technicalSkills.length}개 선택
            </span>
          )}
        </Label>

        <div className="grid grid-cols-2 gap-2">
          {visibleSkills.map((skill) => {
            const isSelected = formData.technicalSkills.includes(skill.code);
            return (
              <button
                key={skill.code}
                type="button"
                onClick={() => toggleSkill(skill.code)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all min-h-[44px]',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400',
                  isSelected
                    ? 'border-blue-300 bg-blue-50 text-blue-700 shadow-sm'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-blue-200 hover:bg-blue-50/30'
                )}
                aria-label={`${skill.label} (${skill.labelEn})`}
                aria-pressed={isSelected}
              >
                {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
                <span className="truncate">{skill.label}</span>
              </button>
            );
          })}
        </div>

        {/* 더보기/접기 / Show more/less */}
        {TECHNICAL_SKILLS.length > 6 && (
          <button
            type="button"
            onClick={() => setShowAllSkills(!showAllSkills)}
            className="w-full flex items-center justify-center gap-1 py-2 text-xs text-blue-600 hover:text-blue-700 transition min-h-[44px]"
            aria-expanded={showAllSkills}
            aria-label={showAllSkills ? '접기 / Show less' : '더보기 / Show more'}
          >
            {showAllSkills ? (
              <>접기 <ChevronUp className="w-3.5 h-3.5" /></>
            ) : (
              <>+{TECHNICAL_SKILLS.length - 6}개 더보기 <ChevronDown className="w-3.5 h-3.5" /></>
            )}
          </button>
        )}
      </div>

      {/* === 한국어 능력 (간략) / Korean Language (brief) === */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-gray-700">
          한국어 능력 점수
          <span className="text-xs text-gray-400 ml-1">/ Korean Language Scores</span>
        </Label>

        {/* TOPIK */}
        <div className="bg-gray-50 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600">TOPIK</span>
            <span className="text-sm font-bold text-blue-600">
              {formData.languageScores.topik === 0 ? '미응시' : `${formData.languageScores.topik}급`}
            </span>
          </div>
          <Slider
            value={[formData.languageScores.topik]}
            onValueChange={(v) =>
              setFormData({
                ...formData,
                languageScores: { ...formData.languageScores, topik: v[0] },
              })
            }
            min={0}
            max={6}
            step={1}
            aria-label="TOPIK 등급 / TOPIK Level"
          />
        </div>

        {/* KIIP */}
        <div className="bg-gray-50 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600">KIIP (사회통합)</span>
            <span className="text-sm font-bold text-purple-600">
              {formData.languageScores.kiip === 0 ? '미이수' : `${formData.languageScores.kiip}단계`}
            </span>
          </div>
          <Slider
            value={[formData.languageScores.kiip]}
            onValueChange={(v) =>
              setFormData({
                ...formData,
                languageScores: { ...formData.languageScores, kiip: v[0] },
              })
            }
            min={0}
            max={5}
            step={1}
            aria-label="KIIP 단계 / KIIP Stage"
          />
        </div>

        {/* 세종학당 / Sejong */}
        <div className="bg-gray-50 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600">세종학당 / Sejong</span>
            <span className="text-sm font-bold text-green-600">
              {formData.languageScores.sejong === 0 ? '미이수' : `${formData.languageScores.sejong}레벨`}
            </span>
          </div>
          <Slider
            value={[formData.languageScores.sejong]}
            onValueChange={(v) =>
              setFormData({
                ...formData,
                languageScores: { ...formData.languageScores, sejong: v[0] },
              })
            }
            min={0}
            max={6}
            step={1}
            aria-label="세종학당 레벨 / Sejong Institute Level"
          />
        </div>
      </div>

      {/* === 자격증 / Certifications === */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-gray-500" />
          자격증
          <span className="text-xs text-gray-400 ml-1">/ Certifications</span>
        </Label>

        {/* 자격증 입력 / Certification input */}
        <div className="flex gap-2">
          <Input
            value={certInput}
            onChange={(e) => setCertInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCertification();
              }
            }}
            placeholder="자격증 이름 입력 / Certification name"
            className="h-11 rounded-xl flex-1"
            aria-label="자격증 이름 / Certification name"
          />
          <Button
            type="button"
            onClick={addCertification}
            disabled={!certInput.trim()}
            className="h-11 w-11 rounded-xl bg-blue-600 hover:bg-blue-700 shrink-0"
            aria-label="자격증 추가 / Add certification"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* 추가된 자격증 태그 / Added certification tags */}
        {formData.certifications.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.certifications.map((cert) => (
              <span
                key={cert}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full text-xs font-medium text-indigo-700"
              >
                <Award className="w-3 h-3" />
                {cert}
                <button
                  type="button"
                  onClick={() => removeCertification(cert)}
                  className="ml-0.5 p-0.5 hover:bg-indigo-100 rounded-full transition"
                  aria-label={`${cert} 삭제 / Remove ${cert}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* === 특기사항 / Special Abilities === */}
      <div className="space-y-2">
        <Label htmlFor="delta-special" className="text-sm font-semibold text-gray-700">
          특기사항 (선택)
          <span className="text-xs text-gray-400 ml-1">/ Special Abilities (Optional)</span>
        </Label>
        <textarea
          id="delta-special"
          value={formData.specialAbilities}
          onChange={(e) => setFormData({ ...formData, specialAbilities: e.target.value })}
          placeholder="기타 보유 기술이나 특기사항을 자유롭게 작성하세요&#10;Describe any additional skills or special abilities"
          className="w-full h-24 px-3 py-2 text-sm rounded-xl border border-gray-200 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 placeholder:text-gray-400"
          aria-label="특기사항 / Special abilities"
        />
      </div>

      {/* === 저장 버튼 / Save buttons === */}
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
          className="flex-1 h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-200"
          aria-label="DELTA 저장 / Save DELTA"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Zap className="w-4 h-4 mr-1" />
              DELTA 저장
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
