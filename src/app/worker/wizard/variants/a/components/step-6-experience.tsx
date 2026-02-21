'use client';

/**
 * Step 6: 경력 정보 / Work experience
 * 회사명, 직무, 기간 - 복수 입력, "없음" 가능
 * Company name, position, period - multiple entries, "no experience" option
 */

import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, Briefcase, Upload, FileText, X, Link as LinkIcon, AlertCircle } from 'lucide-react';
import type { ExperienceData, ExperienceEntry } from '../types';

interface Step6ExperienceProps {
  /** 현재 데이터 / Current data */
  data: ExperienceData;
  /** 데이터 변경 핸들러 / Data change handler */
  onChange: (data: ExperienceData) => void;
}

/** 빈 경력 항목 생성 / Create empty experience entry */
function createEmptyExperience(): ExperienceEntry {
  return {
    id: `exp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    companyName: '',
    position: '',
    department: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: '',
  };
}

/** 개별 경력 항목 폼 / Individual experience entry form */
function ExperienceEntryForm({
  entry,
  index,
  onUpdate,
  onRemove,
}: {
  entry: ExperienceEntry;
  index: number;
  onUpdate: (updated: ExperienceEntry) => void;
  onRemove: () => void;
}) {
  const updateField = <K extends keyof ExperienceEntry>(
    key: K,
    value: ExperienceEntry[K],
  ) => {
    onUpdate({ ...entry, [key]: value });
  };

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-2xl space-y-4">
      {/* 헤더 / Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-semibold text-gray-700">
            경력 {index + 1} <span className="text-gray-400 font-normal">/ Experience {index + 1}</span>
          </span>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all"
          aria-label={`경력 ${index + 1} 삭제 / Remove experience ${index + 1}`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* 회사명 / Company name */}
      <div className="space-y-1.5">
        <Label className="text-xs text-gray-600">
          회사명 <span className="text-gray-400">/ Company</span>
        </Label>
        <Input
          value={entry.companyName}
          onChange={(e) => updateField('companyName', e.target.value)}
          placeholder="회사명 입력 / Enter company name"
          className="min-h-[40px] rounded-lg text-sm"
        />
      </div>

      {/* 직무 + 부서 / Position + Department */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs text-gray-600">
            직무 <span className="text-gray-400">/ Position</span>
          </Label>
          <Input
            value={entry.position}
            onChange={(e) => updateField('position', e.target.value)}
            placeholder="직무"
            className="min-h-[40px] rounded-lg text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-gray-600">
            부서 <span className="text-gray-400">/ Dept</span>
          </Label>
          <Input
            value={entry.department}
            onChange={(e) => updateField('department', e.target.value)}
            placeholder="부서"
            className="min-h-[40px] rounded-lg text-sm"
          />
        </div>
      </div>

      {/* 재직 중 체크박스 / Currently working checkbox */}
      <div className="flex items-center gap-2">
        <Checkbox
          id={`current-${entry.id}`}
          checked={entry.isCurrent}
          onCheckedChange={(checked) => {
            updateField('isCurrent', checked === true);
            if (checked) updateField('endDate', '');
          }}
        />
        <Label htmlFor={`current-${entry.id}`} className="text-xs text-gray-600 cursor-pointer">
          현재 재직 중 <span className="text-gray-400">/ Currently working</span>
        </Label>
      </div>

      {/* 기간 / Period */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs text-gray-600">
            입사 <span className="text-gray-400">/ Start</span>
          </Label>
          <Input
            type="month"
            value={entry.startDate}
            onChange={(e) => updateField('startDate', e.target.value)}
            className="min-h-[40px] rounded-lg text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-gray-600">
            퇴사 <span className="text-gray-400">/ End</span>
          </Label>
          <Input
            type="month"
            value={entry.endDate}
            onChange={(e) => updateField('endDate', e.target.value)}
            className="min-h-[40px] rounded-lg text-sm"
            disabled={entry.isCurrent}
          />
        </div>
      </div>

      {/* 업무 설명 / Description */}
      <div className="space-y-1.5">
        <Label className="text-xs text-gray-600">
          업무 내용 <span className="text-gray-400">/ Description</span>
        </Label>
        <textarea
          value={entry.description}
          onChange={(e) => updateField('description', e.target.value)}
          placeholder="주요 업무 내용을 간략히 설명해주세요 / Briefly describe your main responsibilities"
          rows={3}
          className="w-full min-h-[80px] px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none"
        />
      </div>
    </div>
  );
}

export default function Step6Experience({ data, onChange }: Step6ExperienceProps) {
  const resumeInputRef = useRef<HTMLInputElement>(null);

  /** "경력 없음" 토글 / "No experience" toggle */
  const toggleNoExperience = () => {
    onChange({
      ...data,
      hasExperience: !data.hasExperience,
      entries: !data.hasExperience ? [] : data.entries,
    });
  };

  /** 필드 업데이트 헬퍼 / Field update helper */
  const updateField = <K extends keyof ExperienceData>(
    key: K,
    value: ExperienceData[K],
  ) => {
    onChange({ ...data, [key]: value });
  };

  /** 이력서 업로드 / Resume upload */
  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 실제로는 POST /individual-profile/upload + 바이러스 검사
      // In production: call POST /individual-profile/upload + virus scan
      const mockUrl = URL.createObjectURL(file);
      updateField('resumeFile', mockUrl);
    }
  };

  /** 항목 추가 / Add entry */
  const addEntry = () => {
    onChange({
      ...data,
      hasExperience: true,
      entries: [...data.entries, createEmptyExperience()],
    });
  };

  /** 항목 업데이트 / Update entry */
  const updateEntry = (index: number, updated: ExperienceEntry) => {
    const newEntries = [...data.entries];
    newEntries[index] = updated;
    onChange({ ...data, entries: newEntries });
  };

  /** 항목 삭제 / Remove entry */
  const removeEntry = (index: number) => {
    onChange({
      ...data,
      entries: data.entries.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-4">
      {/* 경력 없음 옵션 / No experience option */}
      <button
        type="button"
        onClick={toggleNoExperience}
        className={cn(
          'w-full min-h-[52px] rounded-xl p-4 text-left transition-all border-2',
          'focus:outline-none focus:ring-2 focus:ring-blue-300',
          !data.hasExperience
            ? 'bg-blue-50 border-blue-300 text-blue-700'
            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50',
        )}
        aria-pressed={!data.hasExperience}
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            'w-5 h-5 rounded-full border-2 flex items-center justify-center',
            !data.hasExperience ? 'border-blue-500 bg-blue-500' : 'border-gray-300',
          )}>
            {!data.hasExperience && (
              <span className="text-white text-xs">✓</span>
            )}
          </div>
          <div>
            <p className="text-sm font-medium">
              경력 없음 (신입)
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              No work experience (entry-level)
            </p>
          </div>
        </div>
      </button>

      {/* 이력서 & 포트폴리오 / Resume & Portfolio */}
      <div className="space-y-4 p-4 bg-gray-50 rounded-xl">
        <p className="text-sm font-medium text-gray-700">
          경력 인증 자료 <span className="text-gray-400 font-normal">/ Verification Materials</span>
          <span className="text-xs text-gray-400 ml-1">(선택사항 / Optional)</span>
        </p>

        {/* 이력서 파일 업로드 / Resume file upload */}
        <div className="space-y-1.5">
          <Label className="text-xs text-gray-600">
            이력서 파일 <span className="text-gray-400">/ Resume File</span>
          </Label>
          {data.resumeFile ? (
            <div className="relative flex items-center gap-3 p-3 bg-white border border-green-200 rounded-lg">
              <FileText className="w-4 h-4 text-green-600 shrink-0" />
              <span className="text-xs text-green-700 flex-1 truncate">
                이력서 업로드 완료 / Resume uploaded
              </span>
              <button
                type="button"
                onClick={() => updateField('resumeFile', null)}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-green-100 text-green-600"
                aria-label="이력서 삭제 / Remove resume"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => resumeInputRef.current?.click()}
              className="w-full min-h-[48px] rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 bg-white flex items-center justify-center gap-2 text-gray-400 hover:text-blue-500 transition-all"
              aria-label="이력서 업로드 / Upload resume"
            >
              <Upload className="w-4 h-4" />
              <span className="text-xs">PDF, DOC, DOCX 형식 / PDF, DOC, DOCX formats</span>
            </button>
          )}
          <input
            ref={resumeInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={handleResumeUpload}
          />
        </div>

        {/* 외부 포트폴리오 링크 / External portfolio link */}
        <div className="space-y-1.5">
          <Label className="text-xs text-gray-600">
            포트폴리오 링크 <span className="text-gray-400">/ Portfolio Link</span>
          </Label>
          <div className="relative">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={data.portfolioLink}
              onChange={(e) => updateField('portfolioLink', e.target.value)}
              placeholder="https://github.com/username 또는 개인 사이트"
              className="min-h-[40px] rounded-lg text-sm pl-10"
            />
          </div>
        </div>

        {/* 바이러스 검사 안내 / Virus scan notice */}
        <div className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg">
          <AlertCircle className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-600">
            업로드된 파일과 링크는 보안을 위해 자동으로 검사됩니다
            <br />
            <span className="text-blue-400">
              Uploaded files and links are automatically scanned for security
            </span>
          </p>
        </div>
      </div>

      {/* 경력 목록 / Experience list */}
      {data.hasExperience && (
        <>
          {data.entries.length === 0 ? (
            <div className="text-center py-8 space-y-3">
              <Briefcase className="w-12 h-12 text-gray-300 mx-auto" />
              <p className="text-sm text-gray-500">
                아래 버튼을 눌러 경력을 추가해주세요
              </p>
              <p className="text-xs text-gray-400">
                Tap the button below to add your work experience
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.entries.map((entry, index) => (
                <ExperienceEntryForm
                  key={entry.id}
                  entry={entry}
                  index={index}
                  onUpdate={(updated) => updateEntry(index, updated)}
                  onRemove={() => removeEntry(index)}
                />
              ))}
            </div>
          )}

          <Button
            type="button"
            variant="outline"
            onClick={addEntry}
            className="w-full min-h-[48px] rounded-xl border-dashed"
          >
            <Plus className="w-4 h-4 mr-2" />
            경력 추가 / Add Experience
          </Button>
        </>
      )}
    </div>
  );
}
