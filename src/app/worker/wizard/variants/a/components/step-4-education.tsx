'use client';

/**
 * Step 4: 학력 정보 / Education history
 * 학교명, 전공, 학위, 재학상태 - 복수 입력 가능
 * School name, major, degree, enrollment status - multiple entries supported
 */

import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, GraduationCap, Upload, FileText, X, Globe } from 'lucide-react';
import { DegreeType, EnrollmentStatus } from '../types';
import type { EducationData, EducationEntry } from '../types';
import { UniversityAutocomplete, type InstitutionDto } from './university-autocomplete';
import { COUNTRIES, findCountryByCode } from './countries';

interface Step4EducationProps {
  /** 현재 데이터 / Current data */
  data: EducationData;
  /** 데이터 변경 핸들러 / Data change handler */
  onChange: (data: EducationData) => void;
}

/** 학위 옵션 / Degree options */
const DEGREE_OPTIONS: { value: DegreeType; label: string; labelEn: string }[] = [
  { value: DegreeType.HIGH_SCHOOL, label: '고등학교', labelEn: 'High School' },
  { value: DegreeType.ASSOCIATE, label: '전문학사', labelEn: 'Associate' },
  { value: DegreeType.BACHELOR, label: '학사', labelEn: 'Bachelor' },
  { value: DegreeType.MASTER, label: '석사', labelEn: 'Master' },
  { value: DegreeType.DOCTORATE, label: '박사', labelEn: 'Doctorate' },
];

/** 재학 상태 옵션 / Enrollment status options */
const ENROLLMENT_OPTIONS: { value: EnrollmentStatus; label: string; labelEn: string }[] = [
  { value: EnrollmentStatus.ENROLLED, label: '재학중', labelEn: 'Enrolled' },
  { value: EnrollmentStatus.ON_LEAVE, label: '휴학중', labelEn: 'On Leave' },
  { value: EnrollmentStatus.GRADUATED, label: '졸업', labelEn: 'Graduated' },
  { value: EnrollmentStatus.DROPPED_OUT, label: '중퇴', labelEn: 'Dropped Out' },
];

/** 빈 학력 항목 생성 / Create empty education entry */
function createEmptyEntry(): EducationEntry {
  return {
    id: `edu-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    schoolName: '',
    major: '',
    degree: null,
    enrollmentStatus: null,
    startDate: '',
    endDate: '',
    country: 'KR', // 기본값: 대한민국 / Default: South Korea
    certificateImage: null,
    institutionType: null,
    institutionId: null,
    schoolAddress: '',
  };
}

/** 개별 학력 항목 폼 / Individual education entry form */
function EducationEntryForm({
  entry,
  index,
  onUpdate,
  onRemove,
}: {
  entry: EducationEntry;
  index: number;
  onUpdate: (updated: EducationEntry) => void;
  onRemove: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateField = <K extends keyof EducationEntry>(
    key: K,
    value: EducationEntry[K],
  ) => {
    onUpdate({ ...entry, [key]: value });
  };

  /** 증명서 업로드 핸들러 / Certificate upload handler */
  const handleCertUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 실제로는 POST /individual-profile/upload 호출
      // In production: call POST /individual-profile/upload
      const mockUrl = URL.createObjectURL(file);
      updateField('certificateImage', mockUrl);
    }
  };

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-2xl space-y-4">
      {/* 헤더 / Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-semibold text-gray-700">
            학력 {index + 1} <span className="text-gray-400 font-normal">/ Education {index + 1}</span>
          </span>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all"
          aria-label={`학력 ${index + 1} 삭제 / Remove education ${index + 1}`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* 국가 선택 / Country selection */}
      <div className="space-y-1.5">
        <Label className="text-xs text-gray-600">
          <Globe className="w-3 h-3 inline mr-1" />
          국가 <span className="text-gray-400">/ Country</span>
        </Label>
        <select
          value={entry.country}
          onChange={(e) => {
            const newCountry = e.target.value;
            updateField('country', newCountry);
            // 국가 변경 시 institutionId 초기화 / Reset institutionId when country changes
            if (newCountry !== 'KR') {
              onUpdate({ ...entry, country: newCountry, institutionId: null, institutionType: null });
            }
          }}
          className="w-full min-h-[40px] px-3 rounded-lg border border-gray-200 bg-white text-sm outline-none focus:border-blue-400"
        >
          {COUNTRIES.map((country) => (
            <option key={country.code} value={country.code}>
              {country.flag} {country.nameKo} / {country.nameEn}
            </option>
          ))}
        </select>
      </div>

      {/* 학교명 / School name */}
      <div className="space-y-1.5">
        <Label className="text-xs text-gray-600">
          학교명 <span className="text-gray-400">/ School Name</span>
        </Label>
        {entry.country === 'KR' ? (
          // 국내: 자동완성 / Domestic: Autocomplete
          <UniversityAutocomplete
            value={
              entry.institutionId
                ? {
                    id: entry.institutionId,
                    name: entry.schoolName,
                    type: entry.institutionType as any,
                    address: entry.schoolAddress || '',
                    addressDetail: undefined,
                    latitude: 0,
                    longitude: 0,
                    isMetroArea: false,
                    searchKeywords: [],
                  }
                : null
            }
            onSelect={(institution: InstitutionDto) => {
              onUpdate({
                ...entry,
                schoolName: institution.name,
                institutionId: institution.id,
                institutionType: institution.type as any,
                schoolAddress: institution.address,
              });
            }}
            placeholder="학교명 입력 (예: 서울대) / Enter school name (e.g., Seoul)"
          />
        ) : (
          // 해외: 수동 입력 / International: Manual input
          <Input
            value={entry.schoolName}
            onChange={(e) => updateField('schoolName', e.target.value)}
            placeholder="학교명 직접 입력 / Enter school name manually"
            className="min-h-[40px] rounded-lg text-sm"
          />
        )}
      </div>

      {/* 전공 + 학위 / Major + degree */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs text-gray-600">
            전공 <span className="text-gray-400">/ Major</span>
          </Label>
          <Input
            value={entry.major}
            onChange={(e) => updateField('major', e.target.value)}
            placeholder="전공 입력"
            className="min-h-[40px] rounded-lg text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-gray-600">
            학위 <span className="text-gray-400">/ Degree</span>
          </Label>
          <select
            value={entry.degree || ''}
            onChange={(e) => updateField('degree', (e.target.value || null) as DegreeType | null)}
            className="w-full min-h-[40px] px-3 rounded-lg border border-gray-200 bg-white text-sm outline-none focus:border-blue-400"
          >
            <option value="">선택</option>
            {DEGREE_OPTIONS.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 재학 상태 / Enrollment status */}
      <div className="space-y-1.5">
        <Label className="text-xs text-gray-600">
          재학 상태 <span className="text-gray-400">/ Status</span>
        </Label>
        <div className="flex gap-1.5">
          {ENROLLMENT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => updateField('enrollmentStatus', opt.value)}
              className={cn(
                'flex-1 min-h-[36px] rounded-lg text-xs font-medium transition-all',
                entry.enrollmentStatus === opt.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 기간 / Period */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs text-gray-600">
            입학 <span className="text-gray-400">/ Start</span>
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
            졸업 <span className="text-gray-400">/ End</span>
          </Label>
          <Input
            type="month"
            value={entry.endDate}
            onChange={(e) => updateField('endDate', e.target.value)}
            className="min-h-[40px] rounded-lg text-sm"
          />
        </div>
      </div>

      {/* 졸업/재학 증명서 / Certificate (graduation or enrollment) */}
      <div className="space-y-1.5">
        <Label className="text-xs text-gray-600">
          졸업증명서 / 재학증명서 <span className="text-gray-400">/ Certificate</span>
          <span className="text-xs text-gray-400 ml-1">(선택사항 / Optional)</span>
        </Label>
        {entry.certificateImage ? (
          <div className="relative flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <FileText className="w-4 h-4 text-green-600 shrink-0" />
            <span className="text-xs text-green-700 flex-1 truncate">
              증명서 업로드 완료 / Certificate uploaded
            </span>
            <button
              type="button"
              onClick={() => updateField('certificateImage', null)}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-green-100 text-green-600"
              aria-label="증명서 삭제 / Remove certificate"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full min-h-[48px] rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 flex items-center justify-center gap-2 text-gray-400 hover:text-blue-500 transition-all"
            aria-label="증명서 업로드 / Upload certificate"
          >
            <Upload className="w-4 h-4" />
            <span className="text-xs">졸업증명서 또는 재학증명서 업로드</span>
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={handleCertUpload}
        />
        <p className="text-xs text-gray-400">
          학력 인증을 위해 증명서를 업로드하실 수 있습니다
          <br />
          You can upload a certificate to verify your education
        </p>
      </div>
    </div>
  );
}

export default function Step4Education({ data, onChange }: Step4EducationProps) {
  /** 항목 추가 / Add entry */
  const addEntry = () => {
    onChange({
      entries: [...data.entries, createEmptyEntry()],
    });
  };

  /** 항목 업데이트 / Update entry */
  const updateEntry = (index: number, updated: EducationEntry) => {
    const newEntries = [...data.entries];
    newEntries[index] = updated;
    onChange({ entries: newEntries });
  };

  /** 항목 삭제 / Remove entry */
  const removeEntry = (index: number) => {
    onChange({
      entries: data.entries.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-4">
      {/* 학력 목록 / Education list */}
      {data.entries.length === 0 ? (
        <div className="text-center py-10 space-y-3">
          <GraduationCap className="w-12 h-12 text-gray-300 mx-auto" />
          <p className="text-sm text-gray-500">
            등록된 학력이 없습니다
          </p>
          <p className="text-xs text-gray-400">
            No education records added yet
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.entries.map((entry, index) => (
            <EducationEntryForm
              key={entry.id}
              entry={entry}
              index={index}
              onUpdate={(updated) => updateEntry(index, updated)}
              onRemove={() => removeEntry(index)}
            />
          ))}
        </div>
      )}

      {/* 추가 버튼 / Add button */}
      <Button
        type="button"
        variant="outline"
        onClick={addEntry}
        className="w-full min-h-[48px] rounded-xl border-dashed"
      >
        <Plus className="w-4 h-4 mr-2" />
        학력 추가 / Add Education
      </Button>
    </div>
  );
}
