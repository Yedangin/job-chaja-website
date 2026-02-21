'use client';

/**
 * 채팅 입력 컴포넌트 / Chat input component
 * 다양한 입력 유형에 따라 적절한 입력 UI를 렌더링합니다.
 * Renders appropriate input UI based on various input types.
 */

import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ChatInputType, ChoiceOption } from '../types';

// === 공통 Props / Common props ===
interface BaseChatInputProps {
  /** 입력 타입 / Input type */
  inputType: ChatInputType;
  /** 선택 옵션 / Options */
  options?: ChoiceOption[];
  /** 플레이스홀더 / Placeholder */
  placeholder?: string;
  /** 필수 여부 / Required */
  required?: boolean;
  /** 스킵 가능 여부 / Skippable */
  skippable?: boolean;
  /** 스킵 라벨 / Skip label */
  skipLabel?: string;
  /** 유효성 패턴 / Validation pattern */
  validationPattern?: string;
  /** 유효성 메시지 / Validation message */
  validationMessage?: string;
  /** 제출 핸들러 / Submit handler */
  onSubmit: (value: string | string[]) => void;
  /** 스킵 핸들러 / Skip handler */
  onSkip?: () => void;
  /** 비활성 상태 / Disabled state */
  disabled?: boolean;
}

export default function ChatInput({
  inputType,
  options,
  placeholder,
  required,
  skippable,
  skipLabel,
  validationPattern,
  validationMessage,
  onSubmit,
  onSkip,
  disabled,
}: BaseChatInputProps) {
  // 입력 타입별 컴포넌트 렌더링 / Render component by input type
  switch (inputType) {
    case 'choice':
      return (
        <ChoiceInput
          options={options ?? []}
          onSubmit={onSubmit}
          disabled={disabled}
          skippable={skippable}
          skipLabel={skipLabel}
          onSkip={onSkip}
        />
      );
    case 'text':
      return (
        <TextInput
          placeholder={placeholder}
          required={required}
          validationPattern={validationPattern}
          validationMessage={validationMessage}
          onSubmit={onSubmit}
          disabled={disabled}
          skippable={skippable}
          skipLabel={skipLabel}
          onSkip={onSkip}
        />
      );
    case 'select':
      return (
        <SelectInput
          options={options ?? []}
          placeholder={placeholder}
          onSubmit={onSubmit}
          disabled={disabled}
          skippable={skippable}
          skipLabel={skipLabel}
          onSkip={onSkip}
        />
      );
    case 'date':
      return (
        <DateInput
          placeholder={placeholder}
          onSubmit={onSubmit}
          disabled={disabled}
          skippable={skippable}
          skipLabel={skipLabel}
          onSkip={onSkip}
        />
      );
    case 'file':
      return (
        <FileInput
          onSubmit={onSubmit}
          disabled={disabled}
          skippable={skippable}
          skipLabel={skipLabel}
          onSkip={onSkip}
        />
      );
    case 'multi-select':
      return (
        <MultiSelectInput
          options={options ?? []}
          onSubmit={onSubmit}
          disabled={disabled}
          skippable={skippable}
          skipLabel={skipLabel}
          onSkip={onSkip}
        />
      );
    case 'number':
      return (
        <NumberInput
          placeholder={placeholder}
          onSubmit={onSubmit}
          disabled={disabled}
          skippable={skippable}
          skipLabel={skipLabel}
          onSkip={onSkip}
        />
      );
    case 'phone':
      return (
        <PhoneInput
          placeholder={placeholder}
          onSubmit={onSubmit}
          disabled={disabled}
          skippable={skippable}
          skipLabel={skipLabel}
          onSkip={onSkip}
        />
      );
    case 'rating':
      return (
        <RatingInput
          onSubmit={onSubmit}
          disabled={disabled}
          skippable={skippable}
          skipLabel={skipLabel}
          onSkip={onSkip}
        />
      );
    case 'salary-range':
      return (
        <SalaryRangeInput
          onSubmit={onSubmit}
          disabled={disabled}
          skippable={skippable}
          skipLabel={skipLabel}
          onSkip={onSkip}
        />
      );
    default:
      return (
        <TextInput
          placeholder={placeholder}
          onSubmit={onSubmit}
          disabled={disabled}
          skippable={skippable}
          skipLabel={skipLabel}
          onSkip={onSkip}
        />
      );
  }
}

// === 선택 버튼 입력 / Choice button input ===
function ChoiceInput({
  options,
  onSubmit,
  disabled,
  skippable,
  skipLabel,
  onSkip,
}: {
  options: ChoiceOption[];
  onSubmit: (value: string | string[]) => void;
  disabled?: boolean;
  skippable?: boolean;
  skipLabel?: string;
  onSkip?: () => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onSubmit(option.value)}
            disabled={disabled}
            className={cn(
              'px-4 py-3 rounded-xl border-2 border-gray-200 bg-white',
              'text-sm font-medium text-gray-700',
              'hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700',
              'active:scale-95 transition-all duration-200',
              'min-h-[44px] min-w-[44px]', // WCAG 터치 타겟 / WCAG touch target
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2',
              'shadow-sm hover:shadow-md'
            )}
          >
            {option.icon && <span className="mr-1.5">{option.icon}</span>}
            {option.label}
            {option.description && (
              <span className="block text-xs text-gray-400 mt-0.5">{option.description}</span>
            )}
          </button>
        ))}
      </div>
      {skippable && (
        <SkipButton label={skipLabel} onSkip={onSkip} disabled={disabled} />
      )}
    </div>
  );
}

// === 텍스트 입력 / Text input ===
function TextInput({
  placeholder,
  required,
  validationPattern,
  validationMessage,
  onSubmit,
  disabled,
  skippable,
  skipLabel,
  onSkip,
}: {
  placeholder?: string;
  required?: boolean;
  validationPattern?: string;
  validationMessage?: string;
  onSubmit: (value: string | string[]) => void;
  disabled?: boolean;
  skippable?: boolean;
  skipLabel?: string;
  onSkip?: () => void;
}) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = useCallback(() => {
    if (required && !value.trim()) {
      setError('필수 항목입니다. (This field is required.)');
      return;
    }
    if (validationPattern) {
      const regex = new RegExp(validationPattern);
      if (!regex.test(value)) {
        setError(validationMessage ?? '올바른 형식이 아닙니다. (Invalid format.)');
        return;
      }
    }
    setError('');
    onSubmit(value.trim());
  }, [value, required, validationPattern, validationMessage, onSubmit]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError('');
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder={placeholder ?? '입력해주세요 (Please enter)'}
          disabled={disabled}
          className="flex-1 h-11 rounded-xl bg-white"
          aria-invalid={!!error}
        />
        <Button
          onClick={handleSubmit}
          disabled={disabled || (!value.trim() && required)}
          size="lg"
          className="rounded-xl min-w-[44px] bg-blue-500 hover:bg-blue-600"
        >
          다음
        </Button>
      </div>
      {error && (
        <p className="text-red-500 text-xs ml-1" role="alert">{error}</p>
      )}
      {skippable && (
        <SkipButton label={skipLabel} onSkip={onSkip} disabled={disabled} />
      )}
    </div>
  );
}

// === 드롭다운 선택 / Dropdown select input ===
function SelectInput({
  options,
  placeholder,
  onSubmit,
  disabled,
  skippable,
  skipLabel,
  onSkip,
}: {
  options: ChoiceOption[];
  placeholder?: string;
  onSubmit: (value: string | string[]) => void;
  disabled?: boolean;
  skippable?: boolean;
  skipLabel?: string;
  onSkip?: () => void;
}) {
  const [value, setValue] = useState('');

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Select
          value={value}
          onValueChange={(val) => {
            setValue(val);
            // 선택 즉시 제출 / Submit on select
            onSubmit(val);
          }}
          disabled={disabled}
        >
          <SelectTrigger className="flex-1 h-11 rounded-xl bg-white w-full">
            <SelectValue placeholder={placeholder ?? '선택해주세요 (Please select)'} />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.icon && <span className="mr-1.5">{opt.icon}</span>}
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {skippable && (
        <SkipButton label={skipLabel} onSkip={onSkip} disabled={disabled} />
      )}
    </div>
  );
}

// === 날짜 입력 / Date input ===
function DateInput({
  placeholder,
  onSubmit,
  disabled,
  skippable,
  skipLabel,
  onSkip,
}: {
  placeholder?: string;
  onSubmit: (value: string | string[]) => void;
  disabled?: boolean;
  skippable?: boolean;
  skipLabel?: string;
  onSkip?: () => void;
}) {
  const [value, setValue] = useState('');

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Input
          type="date"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 h-11 rounded-xl bg-white"
          min="1950-01-01"
          max="2030-12-31"
        />
        <Button
          onClick={() => value && onSubmit(value)}
          disabled={disabled || !value}
          size="lg"
          className="rounded-xl min-w-[44px] bg-blue-500 hover:bg-blue-600"
        >
          다음
        </Button>
      </div>
      {skippable && (
        <SkipButton label={skipLabel} onSkip={onSkip} disabled={disabled} />
      )}
    </div>
  );
}

// === 파일 업로드 / File upload input ===
function FileInput({
  onSubmit,
  disabled,
  skippable,
  skipLabel,
  onSkip,
}: {
  onSubmit: (value: string | string[]) => void;
  disabled?: boolean;
  skippable?: boolean;
  skipLabel?: string;
  onSkip?: () => void;
}) {
  const [fileName, setFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setFileName(file.name);
      setIsUploading(true);

      // Mock 업로드 딜레이 / Mock upload delay
      await new Promise((r) => setTimeout(r, 1000));
      setIsUploading(false);
      onSubmit(file.name);
    },
    [onSubmit]
  );

  return (
    <div className="flex flex-col gap-2">
      <label
        className={cn(
          'flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed',
          'border-gray-300 bg-white cursor-pointer',
          'hover:border-blue-400 hover:bg-blue-50',
          'transition-all duration-200 min-h-[44px]',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input
          type="file"
          className="sr-only"
          onChange={handleFileChange}
          disabled={disabled || isUploading}
          accept="image/*,.pdf"
        />
        {isUploading ? (
          <div className="flex items-center gap-2 text-blue-500">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">업로드 중... (Uploading...)</span>
          </div>
        ) : fileName ? (
          <span className="text-sm text-green-600 font-medium">
            ✓ {fileName}
          </span>
        ) : (
          <span className="text-sm text-gray-500">
            📎 파일 선택 (Select file)
          </span>
        )}
      </label>
      {skippable && (
        <SkipButton label={skipLabel} onSkip={onSkip} disabled={disabled} />
      )}
    </div>
  );
}

// === 복수 선택 / Multi-select input ===
function MultiSelectInput({
  options,
  onSubmit,
  disabled,
  skippable,
  skipLabel,
  onSkip,
}: {
  options: ChoiceOption[];
  onSubmit: (value: string | string[]) => void;
  disabled?: boolean;
  skippable?: boolean;
  skipLabel?: string;
  onSkip?: () => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleOption = useCallback((value: string) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-gray-500 ml-1">
        여러 개 선택 가능 (Multiple selection allowed)
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => toggleOption(option.value)}
              disabled={disabled}
              className={cn(
                'px-4 py-2.5 rounded-xl border-2 text-sm font-medium',
                'transition-all duration-200 min-h-[44px]',
                'focus:outline-none focus:ring-2 focus:ring-blue-400',
                isSelected
                  ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300',
                'disabled:opacity-50'
              )}
            >
              {option.icon && <span className="mr-1">{option.icon}</span>}
              {option.label}
              {isSelected && <span className="ml-1.5">✓</span>}
            </button>
          );
        })}
      </div>
      {selected.length > 0 && (
        <Button
          onClick={() => onSubmit(selected)}
          disabled={disabled}
          size="lg"
          className="rounded-xl bg-blue-500 hover:bg-blue-600 w-full sm:w-auto"
        >
          선택 완료 ({selected.length}개)
        </Button>
      )}
      {skippable && (
        <SkipButton label={skipLabel} onSkip={onSkip} disabled={disabled} />
      )}
    </div>
  );
}

// === 숫자 입력 / Number input ===
function NumberInput({
  placeholder,
  onSubmit,
  disabled,
  skippable,
  skipLabel,
  onSkip,
}: {
  placeholder?: string;
  onSubmit: (value: string | string[]) => void;
  disabled?: boolean;
  skippable?: boolean;
  skipLabel?: string;
  onSkip?: () => void;
}) {
  const [value, setValue] = useState('');

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && value && onSubmit(value)}
          placeholder={placeholder ?? '숫자 입력 (Enter number)'}
          disabled={disabled}
          className="flex-1 h-11 rounded-xl bg-white"
          min={0}
        />
        <Button
          onClick={() => value && onSubmit(value)}
          disabled={disabled || !value}
          size="lg"
          className="rounded-xl min-w-[44px] bg-blue-500 hover:bg-blue-600"
        >
          다음
        </Button>
      </div>
      {skippable && (
        <SkipButton label={skipLabel} onSkip={onSkip} disabled={disabled} />
      )}
    </div>
  );
}

// === 전화번호 입력 / Phone input ===
function PhoneInput({
  placeholder,
  onSubmit,
  disabled,
  skippable,
  skipLabel,
  onSkip,
}: {
  placeholder?: string;
  onSubmit: (value: string | string[]) => void;
  disabled?: boolean;
  skippable?: boolean;
  skipLabel?: string;
  onSkip?: () => void;
}) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const formatPhone = (input: string) => {
    // 숫자만 추출 / Extract digits only
    const digits = input.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
  };

  const handleSubmit = useCallback(() => {
    const digits = value.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 11) {
      setError('올바른 전화번호를 입력해주세요. (Please enter a valid phone number.)');
      return;
    }
    setError('');
    onSubmit(value);
  }, [value, onSubmit]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Input
          type="tel"
          value={value}
          onChange={(e) => {
            setValue(formatPhone(e.target.value));
            if (error) setError('');
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder={placeholder ?? '010-0000-0000'}
          disabled={disabled}
          className="flex-1 h-11 rounded-xl bg-white"
          maxLength={13}
          aria-invalid={!!error}
        />
        <Button
          onClick={handleSubmit}
          disabled={disabled || !value}
          size="lg"
          className="rounded-xl min-w-[44px] bg-blue-500 hover:bg-blue-600"
        >
          다음
        </Button>
      </div>
      {error && (
        <p className="text-red-500 text-xs ml-1" role="alert">{error}</p>
      )}
      {skippable && (
        <SkipButton label={skipLabel} onSkip={onSkip} disabled={disabled} />
      )}
    </div>
  );
}

// === 자가 평가 (1~5) / Self-rating (1~5) ===
function RatingInput({
  onSubmit,
  disabled,
  skippable,
  skipLabel,
  onSkip,
}: {
  onSubmit: (value: string | string[]) => void;
  disabled?: boolean;
  skippable?: boolean;
  skipLabel?: string;
  onSkip?: () => void;
}) {
  const levels = [
    { value: '1', label: '초급', desc: 'Beginner' },
    { value: '2', label: '기초', desc: 'Elementary' },
    { value: '3', label: '중급', desc: 'Intermediate' },
    { value: '4', label: '중상급', desc: 'Upper-Int.' },
    { value: '5', label: '고급', desc: 'Advanced' },
  ];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        {levels.map((level) => (
          <button
            key={level.value}
            type="button"
            onClick={() => onSubmit(level.value)}
            disabled={disabled}
            className={cn(
              'flex-1 flex flex-col items-center gap-1 py-3 px-2',
              'rounded-xl border-2 border-gray-200 bg-white',
              'hover:border-blue-400 hover:bg-blue-50',
              'transition-all duration-200 min-h-[44px]',
              'focus:outline-none focus:ring-2 focus:ring-blue-400',
              'disabled:opacity-50'
            )}
          >
            <span className="text-lg font-bold text-blue-500">{level.value}</span>
            <span className="text-xs font-medium text-gray-700">{level.label}</span>
            <span className="text-[10px] text-gray-400">{level.desc}</span>
          </button>
        ))}
      </div>
      {skippable && (
        <SkipButton label={skipLabel} onSkip={onSkip} disabled={disabled} />
      )}
    </div>
  );
}

// === 급여 범위 입력 / Salary range input ===
function SalaryRangeInput({
  onSubmit,
  disabled,
  skippable,
  skipLabel,
  onSkip,
}: {
  onSubmit: (value: string | string[]) => void;
  disabled?: boolean;
  skippable?: boolean;
  skipLabel?: string;
  onSkip?: () => void;
}) {
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');

  const formatWon = (v: string) => {
    const num = v.replace(/\D/g, '');
    return num ? Number(num).toLocaleString() : '';
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <label className="text-xs text-gray-500 mb-1 block">
            최소 (Min)
          </label>
          <Input
            type="text"
            value={min}
            onChange={(e) => setMin(formatWon(e.target.value))}
            placeholder="2,000,000"
            disabled={disabled}
            className="h-11 rounded-xl bg-white"
          />
        </div>
        <span className="text-gray-400 pt-5">~</span>
        <div className="flex-1">
          <label className="text-xs text-gray-500 mb-1 block">
            최대 (Max)
          </label>
          <Input
            type="text"
            value={max}
            onChange={(e) => setMax(formatWon(e.target.value))}
            placeholder="3,500,000"
            disabled={disabled}
            className="h-11 rounded-xl bg-white"
          />
        </div>
        <div className="pt-5">
          <Button
            onClick={() => onSubmit(`${min}~${max}`)}
            disabled={disabled || (!min && !max)}
            size="lg"
            className="rounded-xl bg-blue-500 hover:bg-blue-600"
          >
            다음
          </Button>
        </div>
      </div>
      <p className="text-xs text-gray-400 ml-1">단위: 원 (KRW/month)</p>
      {skippable && (
        <SkipButton label={skipLabel} onSkip={onSkip} disabled={disabled} />
      )}
    </div>
  );
}

// === 스킵 버튼 / Skip button ===
function SkipButton({
  label,
  onSkip,
  disabled,
}: {
  label?: string;
  onSkip?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onSkip}
      disabled={disabled}
      className={cn(
        'text-sm text-gray-400 hover:text-gray-600',
        'transition-colors duration-200 py-2',
        'focus:outline-none focus:underline',
        'disabled:opacity-50'
      )}
    >
      {label ?? '없음 / 모르겠어요 (Skip)'}
    </button>
  );
}
