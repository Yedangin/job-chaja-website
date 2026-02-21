'use client';

/**
 * Step 3: 한국어 능력 / Korean language ability
 * 시험 종류/급수, 증명서 업로드, 회화 자가평가
 * Test type/level, certificate upload, self-assessed conversation level
 */

import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText, X } from 'lucide-react';
import { KoreanTestType, ConversationLevel } from '../types';
import type { KoreanLanguageData } from '../types';

interface Step3KoreanProps {
  /** 현재 데이터 / Current data */
  data: KoreanLanguageData;
  /** 데이터 변경 핸들러 / Data change handler */
  onChange: (data: KoreanLanguageData) => void;
}

/** 한국어 시험 종류 / Korean test type options */
const TEST_TYPE_OPTIONS: { value: KoreanTestType; label: string; labelEn: string; levels: string[] }[] = [
  {
    value: KoreanTestType.TOPIK,
    label: 'TOPIK',
    labelEn: 'TOPIK',
    levels: ['1급', '2급', '3급', '4급', '5급', '6급'],
  },
  {
    value: KoreanTestType.KIIP,
    label: '사회통합프로그램(KIIP)',
    labelEn: 'KIIP',
    levels: ['0단계', '1단계', '2단계', '3단계', '4단계', '5단계'],
  },
  {
    value: KoreanTestType.SEJONG,
    label: '세종학당 한국어능력시험',
    labelEn: 'Sejong Korean Test',
    levels: ['초급1', '초급2', '중급1', '중급2', '고급1', '고급2'],
  },
  {
    value: KoreanTestType.NONE,
    label: '시험 미응시',
    labelEn: 'No Test Taken',
    levels: [],
  },
];

/** 회화 자가평가 레벨 / Conversation self-assessment levels */
const CONVERSATION_LEVELS: {
  value: ConversationLevel;
  label: string;
  labelEn: string;
  description: string;
  descriptionEn: string;
}[] = [
  {
    value: ConversationLevel.BASIC,
    label: '기초',
    labelEn: 'Basic',
    description: '간단한 인사, 숫자 정도 가능',
    descriptionEn: 'Simple greetings and numbers',
  },
  {
    value: ConversationLevel.BEGINNER,
    label: '초급',
    labelEn: 'Beginner',
    description: '간단한 의사소통 가능',
    descriptionEn: 'Simple communication possible',
  },
  {
    value: ConversationLevel.INTERMEDIATE,
    label: '중급',
    labelEn: 'Intermediate',
    description: '업무 지시 이해 가능',
    descriptionEn: 'Can understand work instructions',
  },
  {
    value: ConversationLevel.ADVANCED,
    label: '고급',
    labelEn: 'Advanced',
    description: '업무에 전문적 용어 및 토론 가능',
    descriptionEn: 'Can use technical terms and discuss professionally',
  },
  {
    value: ConversationLevel.NATIVE,
    label: '원어민급',
    labelEn: 'Native-level',
    description: '한국어 원어민 수준',
    descriptionEn: 'Native-level Korean',
  },
];

export default function Step3Korean({ data, onChange }: Step3KoreanProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  /** 필드 업데이트 헬퍼 / Field update helper */
  const updateField = <K extends keyof KoreanLanguageData>(
    key: K,
    value: KoreanLanguageData[K],
  ) => {
    onChange({ ...data, [key]: value });
  };

  /** 선택된 시험의 급수 목록 / Levels for selected test */
  const selectedTest = TEST_TYPE_OPTIONS.find((t) => t.value === data.testType);

  /** 증명서 업로드 / Certificate upload */
  const handleCertUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const mockUrl = URL.createObjectURL(file);
      updateField('certificateImage', mockUrl);
    }
  };

  return (
    <div className="space-y-6">
      {/* 시험 종류 선택 / Test type selection */}
      <div className="space-y-1.5">
        <Label className="text-sm text-gray-700">
          한국어 시험 <span className="text-gray-400 font-normal">/ Korean Test</span>
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {TEST_TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                updateField('testType', opt.value);
                updateField('testLevel', '');
              }}
              className={cn(
                'min-h-[44px] rounded-xl text-sm font-medium transition-all px-3 py-2',
                'focus:outline-none focus:ring-2 focus:ring-blue-300',
                data.testType === opt.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200',
              )}
              aria-pressed={data.testType === opt.value}
            >
              <div className="text-center">
                <span>{opt.label}</span>
                {opt.value !== opt.labelEn && (
                  <span className="block text-[10px] opacity-70">{opt.labelEn}</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 급수 선택 / Level selection */}
      {selectedTest && selectedTest.levels.length > 0 && (
        <div className="space-y-1.5">
          <Label className="text-sm text-gray-700">
            급수/단계 <span className="text-gray-400 font-normal">/ Level</span>
          </Label>
          <div className="flex flex-wrap gap-2">
            {selectedTest.levels.map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => updateField('testLevel', level)}
                className={cn(
                  'min-h-[40px] min-w-[60px] rounded-lg text-sm font-medium transition-all px-3',
                  'focus:outline-none focus:ring-2 focus:ring-blue-300',
                  data.testLevel === level
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200',
                )}
                aria-pressed={data.testLevel === level}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 증명서 업로드 / Certificate upload */}
      {data.testType && data.testType !== KoreanTestType.NONE && (
        <div className="space-y-1.5">
          <Label className="text-sm text-gray-700">
            성적 증명서 <span className="text-gray-400 font-normal">/ Certificate</span>
          </Label>
          {data.certificateImage ? (
            <div className="relative flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
              <FileText className="w-5 h-5 text-green-600 shrink-0" />
              <span className="text-sm text-green-700 flex-1 truncate">
                증명서 업로드 완료 / Certificate uploaded
              </span>
              <button
                type="button"
                onClick={() => updateField('certificateImage', null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-green-100 text-green-600"
                aria-label="증명서 삭제 / Remove certificate"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full min-h-[60px] rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-400 flex items-center justify-center gap-2 text-gray-400 hover:text-blue-500 transition-all"
              aria-label="증명서 업로드 / Upload certificate"
            >
              <Upload className="w-5 h-5" />
              <span className="text-sm">증명서 업로드 / Upload certificate</span>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={handleCertUpload}
          />
        </div>
      )}

      {/* 회화 자가평가 / Conversation self-assessment */}
      <div className="space-y-3">
        <Label className="text-sm text-gray-700">
          회화 능력 자가평가 <span className="text-gray-400 font-normal">/ Conversation Self-Assessment</span>
        </Label>
        <div className="space-y-2">
          {CONVERSATION_LEVELS.map((level) => (
            <button
              key={level.value}
              type="button"
              onClick={() => updateField('conversationLevel', level.value)}
              className={cn(
                'w-full text-left min-h-[56px] rounded-xl p-3 transition-all',
                'focus:outline-none focus:ring-2 focus:ring-blue-300',
                data.conversationLevel === level.value
                  ? 'bg-blue-50 border-2 border-blue-300'
                  : 'bg-gray-50 border border-gray-200 hover:bg-gray-100',
              )}
              aria-pressed={data.conversationLevel === level.value}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className={cn(
                    'text-sm font-semibold',
                    data.conversationLevel === level.value ? 'text-blue-700' : 'text-gray-700',
                  )}>
                    {level.label}
                  </span>
                  <span className="text-xs text-gray-400 ml-1.5">{level.labelEn}</span>
                </div>
                {data.conversationLevel === level.value && (
                  <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                    ✓
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{level.description}</p>
              <p className="text-[10px] text-gray-400">{level.descriptionEn}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
