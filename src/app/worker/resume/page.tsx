'use client';

/**
 * 이력서 관리 페이지 / Resume management page
 * - 이력서 목록 조회, 생성, 수정, 삭제
 * - Resume list, create, edit, delete
 */

import { useState, useEffect, useCallback } from 'react';
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  Star,
  X,
  Loader2,
  LogIn,
  ChevronDown,
  ChevronUp,
  PlusCircle,
  MinusCircle,
  Save,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

// ── 타입 정의 / Type definitions ──────────────────────────────────────────────

/** 학력 / Education */
interface Education {
  school: string;       // 학교명 / School name
  major?: string;       // 전공 / Major
  degree?: string;      // 학위 / Degree
  startDate?: string;   // 입학일 / Start date
  endDate?: string;     // 졸업일 / End date (empty if current)
  isCurrent?: boolean;  // 재학 중 / Currently enrolled
}

/** 경력 / Work experience */
interface WorkExperience {
  company: string;      // 회사명 / Company name
  position?: string;    // 직책 / Position
  description?: string; // 업무 내용 / Job description
  startDate?: string;   // 시작일 / Start date
  endDate?: string;     // 종료일 / End date (empty if current)
  isCurrent?: boolean;  // 재직 중 / Currently working
}

/** 언어 능력 / Language */
interface Language {
  name: string;         // 언어명 / Language name
  level?: string;       // 수준 / Level
}

/** 이력서 / Resume */
interface Resume {
  id: string;
  title: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  fullName?: string;
  phone?: string;
  email?: string;
  nationality?: string;
  visaType?: string;
  educations?: Education[];
  experiences?: WorkExperience[];
  skills?: string[];
  languages?: Language[];
  selfIntroduction?: string;
}

/** 이력서 폼 데이터 / Resume form data */
interface ResumeFormData {
  title: string;
  fullName: string;
  phone: string;
  email: string;
  nationality: string;
  visaType: string;
  educations: Education[];
  experiences: WorkExperience[];
  skills: string[];
  languages: Language[];
  selfIntroduction: string;
}

// ── 상수 / Constants ──────────────────────────────────────────────────────────

/** 비어있는 학력 항목 / Empty education entry */
const EMPTY_EDUCATION: Education = {
  school: '',
  major: '',
  degree: '',
  startDate: '',
  endDate: '',
  isCurrent: false,
};

/** 비어있는 경력 항목 / Empty experience entry */
const EMPTY_EXPERIENCE: WorkExperience = {
  company: '',
  position: '',
  description: '',
  startDate: '',
  endDate: '',
  isCurrent: false,
};

/** 비어있는 언어 항목 / Empty language entry */
const EMPTY_LANGUAGE: Language = { name: '', level: '' };

/** 기본 폼 값 / Default form values */
const DEFAULT_FORM: ResumeFormData = {
  title: '',
  fullName: '',
  phone: '',
  email: '',
  nationality: '',
  visaType: '',
  educations: [{ ...EMPTY_EDUCATION }],
  experiences: [],
  skills: [],
  languages: [],
  selfIntroduction: '',
};

// ── 유틸 / Utils ──────────────────────────────────────────────────────────────

/** 날짜 포맷 / Date format → "YYYY.MM.DD" */
function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

/** Resume → FormData 변환 / Convert Resume to form data */
function resumeToForm(resume: Resume): ResumeFormData {
  return {
    title: resume.title ?? '',
    fullName: resume.fullName ?? '',
    phone: resume.phone ?? '',
    email: resume.email ?? '',
    nationality: resume.nationality ?? '',
    visaType: resume.visaType ?? '',
    educations:
      resume.educations && resume.educations.length > 0
        ? resume.educations
        : [{ ...EMPTY_EDUCATION }],
    experiences: resume.experiences ?? [],
    skills: resume.skills ?? [],
    languages: resume.languages ?? [],
    selfIntroduction: resume.selfIntroduction ?? '',
  };
}

// ── 로딩 스켈레톤 / Loading skeleton ─────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 animate-pulse">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="h-5 w-48 bg-gray-200 rounded mb-2" />
          <div className="h-3 w-32 bg-gray-100 rounded" />
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-16 bg-gray-100 rounded-lg" />
          <div className="h-8 w-16 bg-gray-100 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// ── 미로그인 상태 / Not logged in ──────────────────────────────────────────────
function NotLoggedIn() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <LogIn className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-base font-semibold text-gray-700 mb-2">
        로그인이 필요합니다
      </h3>
      <p className="text-sm text-gray-400 mb-6">
        로그인하여 이력서를 관리하세요.
        <br />
        Log in to manage your resumes.
      </p>
      <Link
        href="/auth/login"
        className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition"
      >
        <LogIn className="w-4 h-4" />
        로그인하기
      </Link>
    </div>
  );
}

// ── 이력서 카드 / Resume card ──────────────────────────────────────────────────
interface ResumeCardProps {
  resume: Resume;
  onEdit: (resume: Resume) => void;
  onDelete: (id: string) => void;
  deleting: boolean;
}

function ResumeCard({ resume, onEdit, onDelete, deleting }: ResumeCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-blue-200 hover:shadow-sm transition">
      <div className="flex items-start justify-between gap-4">
        {/* 이력서 아이콘 + 정보 / Icon + info */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-gray-900">{resume.title}</h3>
              {/* 기본 이력서 뱃지 / Default badge */}
              {resume.isDefault && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  기본 이력서
                </span>
              )}
            </div>
            {/* 이름 + 수정일 / Name + updated date */}
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-gray-400">
              {resume.fullName && (
                <span className="text-gray-500 font-medium">{resume.fullName}</span>
              )}
              {resume.fullName && <span>·</span>}
              <span>최종 수정: {formatDate(resume.updatedAt)}</span>
            </div>
            {/* 비자 유형 / Visa type */}
            {resume.visaType && (
              <span className="inline-block mt-1.5 text-xs font-medium px-2 py-0.5 bg-blue-50 text-blue-600 rounded-lg">
                {resume.visaType}
              </span>
            )}
          </div>
        </div>

        {/* 액션 버튼 / Action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onEdit(resume)}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition"
            aria-label={`${resume.title} 편집`}
          >
            <Edit2 className="w-3.5 h-3.5" />
            편집
          </button>
          <button
            type="button"
            onClick={() => onDelete(resume.id)}
            disabled={deleting}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition disabled:opacity-50"
            aria-label={`${resume.title} 삭제`}
          >
            {deleting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}

// ── 학력 편집 / Education editor ──────────────────────────────────────────────
interface EducationEditorProps {
  educations: Education[];
  onChange: (educations: Education[]) => void;
}

function EducationEditor({ educations, onChange }: EducationEditorProps) {
  // 특정 인덱스 필드 변경 / Update field at index
  const update = (idx: number, key: keyof Education, value: string | boolean) => {
    const next = educations.map((e, i) =>
      i === idx ? { ...e, [key]: value } : e
    );
    onChange(next);
  };

  // 항목 추가 / Add entry
  const add = () => onChange([...educations, { ...EMPTY_EDUCATION }]);

  // 항목 삭제 / Remove entry
  const remove = (idx: number) => onChange(educations.filter((_, i) => i !== idx));

  return (
    <div className="space-y-4">
      {educations.map((edu, idx) => (
        <div key={idx} className="border border-gray-200 rounded-xl p-4 bg-gray-50 relative">
          {/* 삭제 버튼 / Remove button */}
          {educations.length > 1 && (
            <button
              type="button"
              onClick={() => remove(idx)}
              className="absolute top-3 right-3 text-gray-300 hover:text-red-400 transition"
              aria-label="학력 항목 삭제"
            >
              <MinusCircle className="w-4 h-4" />
            </button>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 학교명 / School name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                학교명 <span className="text-red-400">*</span>
                <span className="text-gray-400 ml-1">/ School</span>
              </label>
              <input
                type="text"
                value={edu.school}
                onChange={(e) => update(idx, 'school', e.target.value)}
                placeholder="학교 이름을 입력하세요"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 bg-white"
              />
            </div>
            {/* 전공 / Major */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                전공 / Major
              </label>
              <input
                type="text"
                value={edu.major ?? ''}
                onChange={(e) => update(idx, 'major', e.target.value)}
                placeholder="전공"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 bg-white"
              />
            </div>
            {/* 학위 / Degree */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                학위 / Degree
              </label>
              <select
                value={edu.degree ?? ''}
                onChange={(e) => update(idx, 'degree', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 bg-white"
              >
                <option value="">선택</option>
                <option value="고등학교졸업">고등학교 졸업</option>
                <option value="전문학사">전문학사</option>
                <option value="학사">학사</option>
                <option value="석사">석사</option>
                <option value="박사">박사</option>
                <option value="기타">기타</option>
              </select>
            </div>
            {/* 입학일 / Start date */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                입학일 / Start
              </label>
              <input
                type="month"
                value={edu.startDate ?? ''}
                onChange={(e) => update(idx, 'startDate', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 bg-white"
              />
            </div>
            {/* 졸업일 / End date */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                졸업일 / End
              </label>
              <input
                type="month"
                value={edu.endDate ?? ''}
                disabled={edu.isCurrent}
                onChange={(e) => update(idx, 'endDate', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 bg-white disabled:bg-gray-100 disabled:text-gray-400"
              />
            </div>
            {/* 재학 중 / Currently enrolled */}
            <div className="sm:col-span-2">
              <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer w-fit">
                <input
                  type="checkbox"
                  checked={edu.isCurrent ?? false}
                  onChange={(e) => update(idx, 'isCurrent', e.target.checked)}
                  className="rounded accent-blue-600"
                />
                재학 중 / Currently enrolled
              </label>
            </div>
          </div>
        </div>
      ))}

      {/* 학력 추가 버튼 / Add education */}
      <button
        type="button"
        onClick={add}
        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition"
      >
        <PlusCircle className="w-4 h-4" />
        학력 추가 / Add Education
      </button>
    </div>
  );
}

// ── 경력 편집 / Experience editor ─────────────────────────────────────────────
interface ExperienceEditorProps {
  experiences: WorkExperience[];
  onChange: (experiences: WorkExperience[]) => void;
}

function ExperienceEditor({ experiences, onChange }: ExperienceEditorProps) {
  const update = (idx: number, key: keyof WorkExperience, value: string | boolean) => {
    const next = experiences.map((e, i) =>
      i === idx ? { ...e, [key]: value } : e
    );
    onChange(next);
  };

  const add = () => onChange([...experiences, { ...EMPTY_EXPERIENCE }]);
  const remove = (idx: number) => onChange(experiences.filter((_, i) => i !== idx));

  return (
    <div className="space-y-4">
      {experiences.length === 0 && (
        <p className="text-sm text-gray-400 py-2">
          경력 사항이 없습니다. 추가해주세요. / No work experience added yet.
        </p>
      )}

      {experiences.map((exp, idx) => (
        <div key={idx} className="border border-gray-200 rounded-xl p-4 bg-gray-50 relative">
          {/* 삭제 / Remove */}
          <button
            type="button"
            onClick={() => remove(idx)}
            className="absolute top-3 right-3 text-gray-300 hover:text-red-400 transition"
            aria-label="경력 항목 삭제"
          >
            <MinusCircle className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 회사명 / Company */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                회사명 <span className="text-red-400">*</span>
                <span className="text-gray-400 ml-1">/ Company</span>
              </label>
              <input
                type="text"
                value={exp.company}
                onChange={(e) => update(idx, 'company', e.target.value)}
                placeholder="회사 이름"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 bg-white"
              />
            </div>
            {/* 직책 / Position */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                직책 / Position
              </label>
              <input
                type="text"
                value={exp.position ?? ''}
                onChange={(e) => update(idx, 'position', e.target.value)}
                placeholder="직책/직위"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 bg-white"
              />
            </div>
            {/* 재직 중 / Currently working */}
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={exp.isCurrent ?? false}
                  onChange={(e) => update(idx, 'isCurrent', e.target.checked)}
                  className="rounded accent-blue-600"
                />
                재직 중 / Currently working
              </label>
            </div>
            {/* 시작일 / Start date */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                시작일 / Start
              </label>
              <input
                type="month"
                value={exp.startDate ?? ''}
                onChange={(e) => update(idx, 'startDate', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 bg-white"
              />
            </div>
            {/* 종료일 / End date */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                종료일 / End
              </label>
              <input
                type="month"
                value={exp.endDate ?? ''}
                disabled={exp.isCurrent}
                onChange={(e) => update(idx, 'endDate', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 bg-white disabled:bg-gray-100 disabled:text-gray-400"
              />
            </div>
            {/* 업무 내용 / Description */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                업무 내용 / Description
              </label>
              <textarea
                value={exp.description ?? ''}
                onChange={(e) => update(idx, 'description', e.target.value)}
                placeholder="담당 업무를 간략히 설명하세요"
                rows={2}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 bg-white resize-none"
              />
            </div>
          </div>
        </div>
      ))}

      {/* 경력 추가 / Add experience */}
      <button
        type="button"
        onClick={add}
        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition"
      >
        <PlusCircle className="w-4 h-4" />
        경력 추가 / Add Experience
      </button>
    </div>
  );
}

// ── 스킬 태그 편집 / Skills tag editor ───────────────────────────────────────
interface SkillsEditorProps {
  skills: string[];
  onChange: (skills: string[]) => void;
}

function SkillsEditor({ skills, onChange }: SkillsEditorProps) {
  const [input, setInput] = useState('');

  // 스킬 추가 / Add skill
  const add = () => {
    const trimmed = input.trim();
    if (!trimmed || skills.includes(trimmed)) return;
    onChange([...skills, trimmed]);
    setInput('');
  };

  // 스킬 삭제 / Remove skill
  const remove = (skill: string) => onChange(skills.filter((s) => s !== skill));

  // 엔터 키 입력 처리 / Handle enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      add();
    }
  };

  return (
    <div>
      {/* 태그 목록 / Tag list */}
      <div className="flex flex-wrap gap-2 mb-3">
        {skills.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full"
          >
            {skill}
            <button
              type="button"
              onClick={() => remove(skill)}
              className="hover:text-blue-900 transition"
              aria-label={`${skill} 삭제`}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        {skills.length === 0 && (
          <p className="text-sm text-gray-400">스킬을 추가해주세요. / Add your skills.</p>
        )}
      </div>

      {/* 입력 필드 / Input field */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="스킬 입력 후 Enter / Enter skill and press Enter"
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
        />
        <button
          type="button"
          onClick={add}
          className="px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
        >
          추가
        </button>
      </div>
    </div>
  );
}

// ── 언어 능력 편집 / Language editor ─────────────────────────────────────────
interface LanguageEditorProps {
  languages: Language[];
  onChange: (languages: Language[]) => void;
}

function LanguageEditor({ languages, onChange }: LanguageEditorProps) {
  const update = (idx: number, key: keyof Language, value: string) => {
    const next = languages.map((l, i) =>
      i === idx ? { ...l, [key]: value } : l
    );
    onChange(next);
  };

  const add = () => onChange([...languages, { ...EMPTY_LANGUAGE }]);
  const remove = (idx: number) => onChange(languages.filter((_, i) => i !== idx));

  return (
    <div className="space-y-3">
      {languages.length === 0 && (
        <p className="text-sm text-gray-400">언어 능력을 추가해주세요. / Add your language skills.</p>
      )}

      {languages.map((lang, idx) => (
        <div key={idx} className="flex items-center gap-3">
          {/* 언어명 / Language name */}
          <input
            type="text"
            value={lang.name}
            onChange={(e) => update(idx, 'name', e.target.value)}
            placeholder="언어 / Language"
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
          />
          {/* 수준 / Level */}
          <select
            value={lang.level ?? ''}
            onChange={(e) => update(idx, 'level', e.target.value)}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
          >
            <option value="">수준 선택</option>
            <option value="초급">초급 / Beginner</option>
            <option value="중급">중급 / Intermediate</option>
            <option value="고급">고급 / Advanced</option>
            <option value="원어민">원어민 / Native</option>
          </select>
          {/* 삭제 / Remove */}
          <button
            type="button"
            onClick={() => remove(idx)}
            className="text-gray-300 hover:text-red-400 transition shrink-0"
            aria-label="언어 항목 삭제"
          >
            <MinusCircle className="w-4 h-4" />
          </button>
        </div>
      ))}

      {/* 언어 추가 / Add language */}
      <button
        type="button"
        onClick={add}
        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition"
      >
        <PlusCircle className="w-4 h-4" />
        언어 추가 / Add Language
      </button>
    </div>
  );
}

// ── 섹션 아코디언 / Section accordion ────────────────────────────────────────
interface SectionProps {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function Section({ title, subtitle, defaultOpen = true, children }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      {/* 섹션 헤더 / Section header */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 hover:bg-gray-100 transition text-left"
        aria-expanded={open}
      >
        <div>
          <p className="text-sm font-semibold text-gray-800">{title}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
        )}
      </button>

      {/* 섹션 내용 / Section content */}
      {open && <div className="px-5 py-5">{children}</div>}
    </div>
  );
}

// ── 이력서 폼 / Resume form ────────────────────────────────────────────────────
interface ResumeFormProps {
  initial?: Resume | null;
  onSave: (data: ResumeFormData) => Promise<void>;
  onCancel: () => void;
  saving: boolean;
}

function ResumeForm({ initial, onSave, onCancel, saving }: ResumeFormProps) {
  // 폼 상태 초기화 / Initialize form state
  const [form, setForm] = useState<ResumeFormData>(
    initial ? resumeToForm(initial) : { ...DEFAULT_FORM }
  );

  // 텍스트 필드 변경 / Handle text field change
  const set = <K extends keyof ResumeFormData>(key: K, value: ResumeFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // 제출 핸들러 / Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 제목 필수 검증 / Validate required title
    if (!form.title.trim()) {
      toast.error('이력서 제목을 입력해주세요. / Please enter a resume title.');
      return;
    }

    await onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* ─── 이력서 제목 / Resume title ─────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-blue-100 p-5">
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          이력서 제목 <span className="text-red-400">*</span>
          <span className="text-gray-400 font-normal ml-1">/ Resume Title</span>
        </label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          placeholder="예: 홍길동 이력서, 서비스직 지원용"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
          required
          aria-label="이력서 제목"
        />
      </div>

      {/* ─── 기본 정보 / Basic info ──────────────────────────────────────────── */}
      <Section title="기본 정보" subtitle="Basic Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 이름 / Full name */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              이름 / Full Name
            </label>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => set('fullName', e.target.value)}
              placeholder="성명"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            />
          </div>
          {/* 연락처 / Phone */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              연락처 / Phone
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
              placeholder="010-0000-0000"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            />
          </div>
          {/* 이메일 / Email */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              이메일 / Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              placeholder="example@email.com"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            />
          </div>
          {/* 국적 / Nationality */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              국적 / Nationality
            </label>
            <input
              type="text"
              value={form.nationality}
              onChange={(e) => set('nationality', e.target.value)}
              placeholder="예: 베트남, 중국, 필리핀"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            />
          </div>
          {/* 비자 유형 / Visa type */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              비자 유형 / Visa Type
            </label>
            <input
              type="text"
              value={form.visaType}
              onChange={(e) => set('visaType', e.target.value)}
              placeholder="예: E-9, F-4, H-2"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            />
          </div>
        </div>
      </Section>

      {/* ─── 학력 / Education ────────────────────────────────────────────────── */}
      <Section title="학력" subtitle="Education">
        <EducationEditor
          educations={form.educations}
          onChange={(v) => set('educations', v)}
        />
      </Section>

      {/* ─── 경력 / Experience ───────────────────────────────────────────────── */}
      <Section
        title="경력"
        subtitle="Work Experience"
        defaultOpen={false}
      >
        <ExperienceEditor
          experiences={form.experiences}
          onChange={(v) => set('experiences', v)}
        />
      </Section>

      {/* ─── 스킬 / Skills ───────────────────────────────────────────────────── */}
      <Section title="스킬" subtitle="Skills" defaultOpen={false}>
        <SkillsEditor
          skills={form.skills}
          onChange={(v) => set('skills', v)}
        />
      </Section>

      {/* ─── 언어 능력 / Languages ───────────────────────────────────────────── */}
      <Section title="언어 능력" subtitle="Languages" defaultOpen={false}>
        <LanguageEditor
          languages={form.languages}
          onChange={(v) => set('languages', v)}
        />
      </Section>

      {/* ─── 자기소개서 / Self introduction ─────────────────────────────────── */}
      <Section title="자기소개서" subtitle="Self Introduction" defaultOpen={false}>
        <textarea
          value={form.selfIntroduction}
          onChange={(e) => set('selfIntroduction', e.target.value)}
          placeholder="본인의 경험, 역량, 지원 동기를 자유롭게 작성하세요.
Write about your experience, skills, and motivation."
          rows={8}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 resize-none"
          aria-label="자기소개서"
        />
        {/* 글자 수 카운트 / Character count */}
        <p className="text-xs text-gray-400 mt-1.5 text-right">
          {form.selfIntroduction.length}자
        </p>
      </Section>

      {/* ─── 저장/취소 버튼 / Save/cancel buttons ────────────────────────────── */}
      <div className="flex items-center justify-end gap-3 pt-2 pb-6">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-xl hover:border-gray-400 transition disabled:opacity-50"
        >
          취소 / Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition disabled:opacity-60"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? '저장 중...' : '저장하기 / Save'}
        </button>
      </div>
    </form>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 메인 페이지 컴포넌트 / Main page component
// ══════════════════════════════════════════════════════════════════════════════
export default function WorkerResumePage() {
  // 이력서 목록 / Resume list
  const [resumes, setResumes] = useState<Resume[]>([]);
  // 로딩 상태 / Loading state
  const [loading, setLoading] = useState(true);
  // 에러 메시지 / Error message
  const [error, setError] = useState<string | null>(null);
  // 로그인 여부 / Whether user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // 뷰 모드: 목록 | 신규 작성 | 편집 / View mode: list | new | edit
  type ViewMode = 'list' | 'new' | 'edit';
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  // 편집 중인 이력서 / Currently editing resume
  const [editingResume, setEditingResume] = useState<Resume | null>(null);

  // 저장 중 / Saving
  const [saving, setSaving] = useState(false);
  // 삭제 중인 이력서 ID / Deleting resume ID
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // 이력서 목록 로드 / Load resume list
  const loadResumes = useCallback(async () => {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      // 세션 없음 → 미로그인 / No session → not logged in
      setIsLoggedIn(false);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/resumes', {
        headers: { Authorization: `Bearer ${sessionId}` },
      });

      if (!res.ok) {
        // 인증 오류 처리 / Handle auth error
        if (res.status === 401) {
          setIsLoggedIn(false);
        } else {
          const data = await res.json().catch(() => ({}));
          setError(
            (data as { message?: string }).message ||
              '이력서 목록을 불러오는 데 실패했습니다.'
          );
        }
        return;
      }

      const data = await res.json();
      // 응답 형태: 배열 또는 { resumes: [...] } / Array or { resumes: [...] }
      const list: Resume[] = Array.isArray(data)
        ? data
        : (data.resumes ?? data.data ?? []);
      setResumes(list);
    } catch {
      // 네트워크 오류 / Network error
      setError('네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadResumes();
  }, [loadResumes]);

  // 새 이력서 작성 클릭 / Click new resume
  const handleNewResume = () => {
    setEditingResume(null);
    setViewMode('new');
    // 폼 최상단으로 스크롤 / Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 이력서 편집 클릭 / Click edit resume
  const handleEditResume = (resume: Resume) => {
    setEditingResume(resume);
    setViewMode('edit');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 폼 취소 / Cancel form
  const handleCancelForm = () => {
    setViewMode('list');
    setEditingResume(null);
  };

  // 이력서 저장 / Save resume (create or update)
  const handleSave = async (formData: ResumeFormData) => {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) return;

    setSaving(true);
    try {
      const isEdit = viewMode === 'edit' && editingResume;
      const url = isEdit
        ? `/api/resumes/${editingResume.id}`
        : '/api/resumes';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionId}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(
          (data as { message?: string }).message ||
            '이력서 저장에 실패했습니다. / Failed to save resume.'
        );
        return;
      }

      // 성공 처리 / Handle success
      toast.success(
        isEdit
          ? '이력서가 수정되었습니다. / Resume updated.'
          : '이력서가 등록되었습니다. / Resume created.'
      );
      setViewMode('list');
      setEditingResume(null);
      setLoading(true);
      await loadResumes();
    } catch {
      toast.error('네트워크 오류가 발생했습니다. / Network error.');
    } finally {
      setSaving(false);
    }
  };

  // 이력서 삭제 / Delete resume
  const handleDelete = async (id: string) => {
    if (
      !confirm(
        '이력서를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.\nDelete this resume? This action cannot be undone.'
      )
    )
      return;

    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/resumes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${sessionId}` },
      });

      if (res.ok) {
        // 로컬 목록에서 제거 / Remove from local list
        setResumes((prev) => prev.filter((r) => r.id !== id));
        toast.success('이력서가 삭제되었습니다. / Resume deleted.');
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(
          (data as { message?: string }).message ||
            '이력서 삭제에 실패했습니다. / Failed to delete resume.'
        );
      }
    } catch {
      toast.error('네트워크 오류가 발생했습니다. / Network error.');
    } finally {
      setDeletingId(null);
    }
  };

  // ── 렌더링 / Render ──────────────────────────────────────────────────────

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* 헤더 / Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {viewMode === 'list' && '이력서 관리'}
            {viewMode === 'new' && '이력서 작성'}
            {viewMode === 'edit' && '이력서 편집'}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {viewMode === 'list' && 'Resume Management'}
            {viewMode === 'new' && 'Create New Resume'}
            {viewMode === 'edit' && 'Edit Resume'}
          </p>
        </div>

        {/* 오른쪽 액션 / Right action */}
        {viewMode === 'list' && !loading && isLoggedIn && (
          <button
            type="button"
            onClick={handleNewResume}
            className="flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">새 이력서 작성</span>
            <span className="sm:hidden">작성</span>
          </button>
        )}

        {/* 폼 모드에서 뒤로가기 / Back button in form mode */}
        {(viewMode === 'new' || viewMode === 'edit') && (
          <button
            type="button"
            onClick={handleCancelForm}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition"
          >
            <X className="w-4 h-4" />
            목록으로
          </button>
        )}
      </div>

      {/* ── 로딩 / Loading ─────────────────────────────────────────────────── */}
      {loading && viewMode === 'list' && (
        <div className="space-y-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {/* ── 미로그인 / Not logged in ──────────────────────────────────────── */}
      {!loading && !isLoggedIn && <NotLoggedIn />}

      {/* ── 에러 / Error ──────────────────────────────────────────────────── */}
      {!loading && isLoggedIn && error && viewMode === 'list' && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-4 text-sm text-red-700 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
          <div>
            <p>{error}</p>
            <button
              type="button"
              onClick={() => {
                setError(null);
                setLoading(true);
                loadResumes();
              }}
              className="mt-2 text-xs font-medium text-red-600 underline"
            >
              다시 시도 / Retry
            </button>
          </div>
        </div>
      )}

      {/* ── 이력서 목록 / Resume list ──────────────────────────────────────── */}
      {!loading && isLoggedIn && !error && viewMode === 'list' && (
        <>
          {resumes.length === 0 ? (
            /* 빈 상태 / Empty state */
            <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-blue-300" />
              </div>
              <h3 className="text-base font-semibold text-gray-700 mb-2">
                등록된 이력서가 없습니다
              </h3>
              <p className="text-sm text-gray-400 mb-6">
                이력서를 작성하면 공고에 간편하게 지원할 수 있습니다.
                <br />
                Create a resume to easily apply to job postings.
              </p>
              <button
                type="button"
                onClick={handleNewResume}
                className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition"
              >
                <Plus className="w-4 h-4" />
                첫 이력서 작성하기
              </button>
            </div>
          ) : (
            /* 이력서 카드 목록 / Resume card list */
            <div className="space-y-4">
              {/* 이력서 수 표시 / Resume count */}
              <p className="text-sm text-gray-400">
                총 {resumes.length}개의 이력서 / {resumes.length} resume{resumes.length !== 1 ? 's' : ''}
              </p>

              {resumes.map((resume) => (
                <ResumeCard
                  key={resume.id}
                  resume={resume}
                  onEdit={handleEditResume}
                  onDelete={handleDelete}
                  deleting={deletingId === resume.id}
                />
              ))}

              {/* 하단 추가 버튼 / Bottom add button */}
              <button
                type="button"
                onClick={handleNewResume}
                className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 hover:border-blue-300 text-gray-400 hover:text-blue-500 text-sm font-medium py-4 rounded-2xl transition"
              >
                <Plus className="w-4 h-4" />
                새 이력서 작성 / Create New Resume
              </button>
            </div>
          )}
        </>
      )}

      {/* ── 이력서 폼 / Resume form ────────────────────────────────────────── */}
      {isLoggedIn && (viewMode === 'new' || viewMode === 'edit') && (
        <ResumeForm
          initial={editingResume}
          onSave={handleSave}
          onCancel={handleCancelForm}
          saving={saving}
        />
      )}
    </div>
  );
}
