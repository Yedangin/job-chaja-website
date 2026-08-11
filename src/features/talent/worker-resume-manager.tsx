'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Check,
  GraduationCap,
  Loader2,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageProvider';
import { normalizeLocale, type LaunchLocale } from '@/i18n/locales';
import { TALENT_COPY, talentErrorMessage } from './copy';

const CONSENT_VERSION = 'talent-disclosure-2026-08-03';

type Education = {
  school: string;
  major: string;
  degree: string;
  graduationYear: number | null;
  country: string;
};

type WorkExperience = {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
};

type Resume = {
  id: number;
  nationality: string;
  birthDate: string | null;
  educations: Education[] | null;
  workExperiences: WorkExperience[] | null;
  topikLevel: number | null;
  kiipLevel: number | null;
  certificates: unknown;
  preferredJobTypes: string[];
  preferredRegions: string[];
  preferredSalary: number | null;
  preferredEmploymentTypes: string[];
  isComplete: boolean;
  updatedAt: string;
};

type FormState = {
  nationality: string;
  birthDate: string;
  educations: Education[];
  workExperiences: WorkExperience[];
  topikLevel: number | null;
  kiipLevel: number | null;
  certificates: unknown;
  preferredJobTypes: string;
  preferredRegions: string;
  preferredSalary: string;
  preferredEmploymentTypes: string[];
};

type Visibility = {
  isOpenToScout: boolean;
  consentVersion: string | null;
  consentedAt: string | null;
};

const ko = {
  title: '내 이력서', subtitle: '기업에 제출할 이력서를 한 곳에서 관리하세요.', loading: '이력서를 불러오는 중입니다.', login: '로그인이 필요합니다.', loginAction: '로그인',
  empty: '아직 이력서가 없습니다', emptyBody: '기본 정보부터 차례로 작성할 수 있습니다.', create: '이력서 작성', retry: '다시 시도', edit: '수정', remove: '삭제', removeConfirm: '이력서를 삭제할까요? 삭제 후에는 복구할 수 없습니다.',
  basic: '기본 정보', history: '학력과 경력', preference: '희망 조건과 공개', nationality: '국적 코드', birthDate: '생년월일', topik: 'TOPIK 등급', kiip: '사회통합프로그램 단계', select: '선택 안 함',
  education: '학력', addEducation: '학력 추가', school: '학교명', major: '전공', degree: '학위', graduationYear: '졸업 연도', experience: '경력', addExperience: '경력 추가', company: '회사명', role: '담당 업무', startDate: '시작 월', endDate: '종료 월', description: '업무 내용',
  jobs: '희망 직종', regions: '희망 지역', salary: '희망 급여(만원)', employment: '고용 형태', disclosure: '인재채용관 공개 동의', disclosureBody: '승인된 기업이 완성된 이력서를 검색하고, 열람권 사용 후 상세 내용을 볼 수 있습니다. 공개는 언제든 철회할 수 있습니다.', disclosureOn: '공개 동의함', disclosureOff: '비공개', withdraw: '공개 철회',
  back: '이전', next: '다음', save: '저장', cancel: '취소', saved: '저장했습니다.', validationBasic: '국적을 입력하세요.', validationEducation: '학교명이 포함된 학력을 하나 이상 입력하세요.', validationLanguage: 'TOPIK 또는 사회통합프로그램 단계를 선택하세요.',
  jobPlaceholder: '제조/생산, IT/소프트웨어', regionPlaceholder: '서울, 경기', employmentRegular: '정규직', employmentContract: '계약직', employmentPartTime: '시간제',
  errorLoad: '이력서를 불러오지 못했습니다.', errorSave: '이력서를 저장하지 못했습니다.', errorWithdraw: '공개 동의를 철회하지 못했습니다.', errorDelete: '이력서를 삭제하지 못했습니다.',
};

type Copy = typeof ko;

const COPY: Record<LaunchLocale, Copy> = {
  ko,
  en: {
    title: 'My resume', subtitle: 'Manage the resume you submit to employers.', loading: 'Loading your resume.', login: 'Please log in to manage your resume.', loginAction: 'Log in',
    empty: 'No resume yet', emptyBody: 'Start with basic information and continue step by step.', create: 'Create resume', retry: 'Try again', edit: 'Edit', remove: 'Delete', removeConfirm: 'Delete this resume? This cannot be undone.',
    basic: 'Basic details', history: 'Education and work', preference: 'Preferences and visibility', nationality: 'Nationality code', birthDate: 'Date of birth', topik: 'TOPIK level', kiip: 'KIIP stage', select: 'Not selected',
    education: 'Education', addEducation: 'Add education', school: 'School', major: 'Major', degree: 'Degree', graduationYear: 'Graduation year', experience: 'Work experience', addExperience: 'Add experience', company: 'Company', role: 'Role', startDate: 'Start month', endDate: 'End month', description: 'Responsibilities',
    jobs: 'Preferred roles', regions: 'Preferred regions', salary: 'Preferred salary (10K KRW)', employment: 'Employment type', disclosure: 'Talent pool disclosure consent', disclosureBody: 'Approved employers may find your completed resume and view details after using a viewing credit. You can withdraw at any time.', disclosureOn: 'I agree to disclose', disclosureOff: 'Private', withdraw: 'Withdraw disclosure',
    back: 'Back', next: 'Next', save: 'Save', cancel: 'Cancel', saved: 'Resume saved.', validationBasic: 'Enter your nationality.', validationEducation: 'Add at least one education with a school name.', validationLanguage: 'Select a TOPIK level or KIIP stage.',
    jobPlaceholder: 'Manufacturing / Production, IT / Software', regionPlaceholder: 'Seoul, Gyeonggi', employmentRegular: 'Regular', employmentContract: 'Contract', employmentPartTime: 'Part-time',
    errorLoad: 'Could not load your resume.', errorSave: 'Could not save your resume.', errorWithdraw: 'Could not withdraw disclosure.', errorDelete: 'Could not delete your resume.',
  },
  vi: {
    title: 'Hồ sơ của tôi', subtitle: 'Quản lý hồ sơ gửi tới nhà tuyển dụng.', loading: 'Đang tải hồ sơ.', login: 'Vui lòng đăng nhập để quản lý hồ sơ.', loginAction: 'Đăng nhập',
    empty: 'Chưa có hồ sơ', emptyBody: 'Bắt đầu từ thông tin cơ bản và hoàn thành từng bước.', create: 'Tạo hồ sơ', retry: 'Thử lại', edit: 'Chỉnh sửa', remove: 'Xóa', removeConfirm: 'Xóa hồ sơ này? Thao tác này không thể hoàn tác.',
    basic: 'Thông tin cơ bản', history: 'Học vấn và kinh nghiệm', preference: 'Nguyện vọng và công khai', nationality: 'Mã quốc tịch', birthDate: 'Ngày sinh', topik: 'Cấp TOPIK', kiip: 'Giai đoạn KIIP', select: 'Chưa chọn',
    education: 'Học vấn', addEducation: 'Thêm học vấn', school: 'Trường', major: 'Chuyên ngành', degree: 'Bằng cấp', graduationYear: 'Năm tốt nghiệp', experience: 'Kinh nghiệm làm việc', addExperience: 'Thêm kinh nghiệm', company: 'Công ty', role: 'Vai trò', startDate: 'Tháng bắt đầu', endDate: 'Tháng kết thúc', description: 'Mô tả công việc',
    jobs: 'Công việc mong muốn', regions: 'Khu vực mong muốn', salary: 'Mức lương mong muốn (10.000 KRW)', employment: 'Hình thức làm việc', disclosure: 'Đồng ý công khai trong kho ứng viên', disclosureBody: 'Doanh nghiệp đã được phê duyệt có thể tìm hồ sơ hoàn chỉnh và xem chi tiết sau khi dùng quyền xem. Bạn có thể rút lại bất cứ lúc nào.', disclosureOn: 'Tôi đồng ý công khai', disclosureOff: 'Không công khai', withdraw: 'Rút quyền công khai',
    back: 'Quay lại', next: 'Tiếp theo', save: 'Lưu', cancel: 'Hủy', saved: 'Đã lưu hồ sơ.', validationBasic: 'Nhập quốc tịch.', validationEducation: 'Thêm ít nhất một trường học.', validationLanguage: 'Chọn cấp TOPIK hoặc KIIP.',
    jobPlaceholder: 'Sản xuất, IT / Phần mềm', regionPlaceholder: 'Seoul, Gyeonggi', employmentRegular: 'Chính thức', employmentContract: 'Hợp đồng', employmentPartTime: 'Bán thời gian',
    errorLoad: 'Không thể tải hồ sơ.', errorSave: 'Không thể lưu hồ sơ.', errorWithdraw: 'Không thể rút quyền công khai.', errorDelete: 'Không thể xóa hồ sơ.',
  },
  th: {
    title: 'เรซูเม่ของฉัน', subtitle: 'จัดการเรซูเม่สำหรับส่งให้นายจ้าง', loading: 'กำลังโหลดเรซูเม่', login: 'กรุณาเข้าสู่ระบบเพื่อจัดการเรซูเม่', loginAction: 'เข้าสู่ระบบ',
    empty: 'ยังไม่มีเรซูเม่', emptyBody: 'เริ่มจากข้อมูลพื้นฐานแล้วทำทีละขั้นตอน', create: 'สร้างเรซูเม่', retry: 'ลองอีกครั้ง', edit: 'แก้ไข', remove: 'ลบ', removeConfirm: 'ลบเรซูเม่นี้หรือไม่? ไม่สามารถกู้คืนได้',
    basic: 'ข้อมูลพื้นฐาน', history: 'การศึกษาและงาน', preference: 'ความต้องการและการเปิดเผย', nationality: 'รหัสสัญชาติ', birthDate: 'วันเกิด', topik: 'ระดับ TOPIK', kiip: 'ระดับ KIIP', select: 'ยังไม่เลือก',
    education: 'การศึกษา', addEducation: 'เพิ่มการศึกษา', school: 'สถานศึกษา', major: 'สาขา', degree: 'วุฒิ', graduationYear: 'ปีที่จบ', experience: 'ประสบการณ์ทำงาน', addExperience: 'เพิ่มประสบการณ์', company: 'บริษัท', role: 'ตำแหน่ง', startDate: 'เดือนเริ่ม', endDate: 'เดือนสิ้นสุด', description: 'รายละเอียดงาน',
    jobs: 'งานที่ต้องการ', regions: 'พื้นที่ที่ต้องการ', salary: 'เงินเดือนที่ต้องการ (หมื่นวอน)', employment: 'รูปแบบการจ้าง', disclosure: 'ยินยอมเปิดเผยในคลังผู้สมัคร', disclosureBody: 'บริษัทที่ได้รับอนุมัติสามารถค้นหาเรซูเม่ที่สมบูรณ์และดูรายละเอียดหลังใช้สิทธิ์เข้าชม คุณถอนความยินยอมได้ทุกเมื่อ', disclosureOn: 'ยินยอมเปิดเผย', disclosureOff: 'ไม่เปิดเผย', withdraw: 'ถอนการเปิดเผย',
    back: 'ย้อนกลับ', next: 'ถัดไป', save: 'บันทึก', cancel: 'ยกเลิก', saved: 'บันทึกแล้ว', validationBasic: 'กรอกสัญชาติ', validationEducation: 'เพิ่มสถานศึกษาอย่างน้อยหนึ่งแห่ง', validationLanguage: 'เลือกระดับ TOPIK หรือ KIIP',
    jobPlaceholder: 'การผลิต, IT / ซอฟต์แวร์', regionPlaceholder: 'โซล, คยองกี', employmentRegular: 'ประจำ', employmentContract: 'สัญญาจ้าง', employmentPartTime: 'พาร์ตไทม์',
    errorLoad: 'ไม่สามารถโหลดเรซูเม่ได้', errorSave: 'ไม่สามารถบันทึกเรซูเม่ได้', errorWithdraw: 'ไม่สามารถถอนการเปิดเผยได้', errorDelete: 'ไม่สามารถลบเรซูเม่ได้',
  },
  fil: {
    title: 'Aking resume', subtitle: 'Pamahalaan ang resume na ipinapadala sa employer.', loading: 'Nilo-load ang resume.', login: 'Mag-log in para pamahalaan ang resume.', loginAction: 'Mag-log in',
    empty: 'Wala pang resume', emptyBody: 'Magsimula sa basic details at kumpletuhin bawat hakbang.', create: 'Gumawa ng resume', retry: 'Subukan muli', edit: 'I-edit', remove: 'I-delete', removeConfirm: 'I-delete ang resume? Hindi na ito maibabalik.',
    basic: 'Basic details', history: 'Edukasyon at trabaho', preference: 'Kagustuhan at visibility', nationality: 'Nationality code', birthDate: 'Petsa ng kapanganakan', topik: 'TOPIK level', kiip: 'KIIP stage', select: 'Hindi pinili',
    education: 'Edukasyon', addEducation: 'Magdagdag ng edukasyon', school: 'Paaralan', major: 'Kurso', degree: 'Degree', graduationYear: 'Taon ng pagtatapos', experience: 'Karanasan sa trabaho', addExperience: 'Magdagdag ng trabaho', company: 'Kumpanya', role: 'Tungkulin', startDate: 'Simula', endDate: 'Pagtatapos', description: 'Detalye ng trabaho',
    jobs: 'Gustong trabaho', regions: 'Gustong lugar', salary: 'Gustong sahod (10K KRW)', employment: 'Uri ng employment', disclosure: 'Pahintulot sa talent pool', disclosureBody: 'Maaaring hanapin ng aprubadong employer ang kumpletong resume at tingnan ang detalye gamit ang viewing credit. Maaari mong bawiin anumang oras.', disclosureOn: 'Pumapayag akong ilantad', disclosureOff: 'Pribado', withdraw: 'Bawiin ang pahintulot',
    back: 'Bumalik', next: 'Susunod', save: 'I-save', cancel: 'Kanselahin', saved: 'Na-save ang resume.', validationBasic: 'Ilagay ang nationality.', validationEducation: 'Magdagdag ng kahit isang paaralan.', validationLanguage: 'Pumili ng TOPIK o KIIP level.',
    jobPlaceholder: 'Manufacturing / Production, IT / Software', regionPlaceholder: 'Seoul, Gyeonggi', employmentRegular: 'Regular', employmentContract: 'Contract', employmentPartTime: 'Part-time',
    errorLoad: 'Hindi ma-load ang resume.', errorSave: 'Hindi ma-save ang resume.', errorWithdraw: 'Hindi mabawi ang disclosure.', errorDelete: 'Hindi ma-delete ang resume.',
  },
};

const emptyEducation = (): Education => ({ school: '', major: '', degree: '', graduationYear: null, country: '' });
const emptyWork = (): WorkExperience => ({ company: '', role: '', startDate: '', endDate: '', description: '' });
const emptyForm = (): FormState => ({
  nationality: '', birthDate: '', educations: [emptyEducation()], workExperiences: [], topikLevel: null, kiipLevel: null,
  certificates: [], preferredJobTypes: '', preferredRegions: '', preferredSalary: '', preferredEmploymentTypes: [],
});

function resumeToForm(resume: Resume): FormState {
  return {
    nationality: resume.nationality || '', birthDate: resume.birthDate?.slice(0, 10) || '',
    educations: resume.educations?.length ? resume.educations : [emptyEducation()], workExperiences: resume.workExperiences ?? [],
    topikLevel: resume.topikLevel, kiipLevel: resume.kiipLevel, certificates: resume.certificates ?? [],
    preferredJobTypes: resume.preferredJobTypes.join(', '), preferredRegions: resume.preferredRegions.join(', '),
    preferredSalary: resume.preferredSalary == null ? '' : String(resume.preferredSalary), preferredEmploymentTypes: resume.preferredEmploymentTypes,
  };
}

function csv(value: string) {
  return value.split(',').map((item) => item.trim()).filter(Boolean);
}

async function responseError(response: Response, copy: (typeof TALENT_COPY)[LaunchLocale]) {
  return talentErrorMessage({ status: response.status }, copy);
}

const inputClass = 'h-10 w-full rounded-lg border border-[#DDE2E8] bg-white px-3 text-sm text-[#191F28] outline-none focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/10';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block space-y-1.5 text-sm font-medium text-[#191F28]"><span>{label}</span>{children}</label>;
}

export default function WorkerResumeManager() {
  const { lang } = useLanguage();
  const locale = normalizeLocale(lang);
  const c = COPY[locale];
  const talentCopy = TALENT_COPY[locale];
  const [resume, setResume] = useState<Resume | null>(null);
  const [visibility, setVisibility] = useState<Visibility>({ isOpenToScout: false, consentVersion: null, consentedAt: null });
  const [form, setForm] = useState<FormState>(emptyForm);
  const [desiredVisibility, setDesiredVisibility] = useState(false);
  const [step, setStep] = useState(0);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [authRequired, setAuthRequired] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null); setAuthRequired(false);
    try {
      const [resumeResponse, visibilityResponse] = await Promise.all([
        fetch('/api/resumes/me', { credentials: 'include', cache: 'no-store' }),
        fetch('/api/resumes/me/scout-visibility', { credentials: 'include', cache: 'no-store' }),
      ]);
      if (resumeResponse.status === 401 || visibilityResponse.status === 401) { setAuthRequired(true); return; }
      if (!resumeResponse.ok) throw new Error(await responseError(resumeResponse, talentCopy));
      if (!visibilityResponse.ok) throw new Error(await responseError(visibilityResponse, talentCopy));
      const loadedResume = await resumeResponse.json() as Resume | null;
      const loadedVisibility = await visibilityResponse.json() as Visibility;
      setResume(loadedResume); setVisibility(loadedVisibility); setDesiredVisibility(loadedVisibility.isOpenToScout);
      setForm(loadedResume ? resumeToForm(loadedResume) : emptyForm());
    } catch (caught) { setError(caught instanceof Error ? caught.message : c.errorLoad); }
    finally { setLoading(false); }
  }, [c.errorLoad, talentCopy]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load(); }, [load]);

  const validation = () => {
    if (step === 0 && !form.nationality.trim()) return c.validationBasic;
    if (step === 1 && !form.educations.some((item) => item.school.trim())) return c.validationEducation;
    if (step === 2 && form.topikLevel == null && form.kiipLevel == null) return c.validationLanguage;
    return null;
  };

  const next = () => {
    const message = validation();
    if (message) { setError(message); return; }
    setError(null); setStep((current) => Math.min(2, current + 1));
  };

  const updateVisibility = async (isOpenToScout: boolean) => {
    const response = await fetch('/api/resumes/me/scout-visibility', {
      method: 'PUT', credentials: 'include', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isOpenToScout, consentVersion: CONSENT_VERSION }),
    });
    if (!response.ok) throw new Error(await responseError(response, talentCopy));
    const state = await response.json() as Visibility;
    setVisibility(state); setDesiredVisibility(state.isOpenToScout);
  };

  const save = async () => {
    const message = validation();
    if (message) { setError(message); return; }
    setSaving(true); setError(null); setNotice(null);
    try {
      const payload = {
        nationality: form.nationality.trim().toUpperCase(), birthDate: form.birthDate || undefined,
        educations: form.educations.filter((item) => item.school.trim()),
        workExperiences: form.workExperiences.filter((item) => item.company.trim() || item.role.trim()),
        topikLevel: form.topikLevel, kiipLevel: form.kiipLevel, certificates: form.certificates,
        preferredJobTypes: csv(form.preferredJobTypes), preferredRegions: csv(form.preferredRegions),
        preferredSalary: form.preferredSalary ? Number(form.preferredSalary) : null,
        preferredEmploymentTypes: form.preferredEmploymentTypes,
      };
      const response = await fetch(resume ? '/api/resumes/me' : '/api/resumes', {
        method: resume ? 'PUT' : 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(await responseError(response, talentCopy));
      const savedResume = await response.json() as Resume;
      if (desiredVisibility !== visibility.isOpenToScout) await updateVisibility(desiredVisibility);
      setResume(savedResume); setForm(resumeToForm(savedResume)); setEditing(false); setStep(0); setNotice(c.saved);
    } catch (caught) { setError(caught instanceof Error ? caught.message : c.errorSave); }
    finally { setSaving(false); }
  };

  const withdraw = async () => {
    setSaving(true); setError(null);
    try { await updateVisibility(false); setNotice(c.saved); }
    catch (caught) { setError(caught instanceof Error ? caught.message : c.errorWithdraw); }
    finally { setSaving(false); }
  };

  const remove = async () => {
    if (!window.confirm(c.removeConfirm)) return;
    setSaving(true); setError(null);
    try {
      if (visibility.isOpenToScout) await updateVisibility(false);
      const response = await fetch('/api/resumes/me', { method: 'DELETE', credentials: 'include' });
      if (!response.ok) throw new Error(await responseError(response, talentCopy));
      setResume(null); setForm(emptyForm()); setEditing(false); setDesiredVisibility(false); setNotice(null);
    } catch (caught) { setError(caught instanceof Error ? caught.message : c.errorDelete); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex min-h-[55vh] items-center justify-center gap-2 text-sm text-[#4E5968]"><Loader2 className="size-5 animate-spin text-[#0066FF]" />{c.loading}</div>;
  if (authRequired) return <div className="mx-auto max-w-lg px-4 py-20 text-center"><h1 className="text-xl font-bold text-[#191F28]">{c.login}</h1><Link href="/auth/login" className="mt-5 inline-flex min-h-10 items-center justify-center rounded-lg bg-[#0066FF] px-4 py-2 text-center text-sm font-semibold leading-5 text-white whitespace-normal">{c.loginAction}</Link></div>;

  return (
    <main className="min-h-screen bg-[#F9FAFB] px-4 py-8 text-[#191F28]">
      <div className="mx-auto max-w-4xl">
        <header className="mb-7 flex flex-wrap items-start justify-between gap-4">
          <div><h1 className="text-2xl font-bold">{c.title}</h1><p className="mt-1 text-sm text-[#6B7684]">{c.subtitle}</p></div>
          {resume && !editing && <div className="flex flex-wrap justify-end gap-2"><button onClick={() => { setEditing(true); setStep(0); setNotice(null); }} className="min-h-10 rounded-lg border border-[#DDE2E8] bg-white px-4 py-2 text-center text-sm font-semibold leading-5 whitespace-normal">{c.edit}</button><button onClick={() => void remove()} disabled={saving} aria-label={c.remove} title={c.remove} className="grid size-10 shrink-0 place-items-center rounded-lg border border-[#DDE2E8] bg-white text-[#E5484D]"><Trash2 className="size-4" /></button></div>}
        </header>

        {(error || notice) && <div className={`mb-5 flex flex-wrap items-start gap-2 rounded-lg border px-4 py-3 text-sm ${error ? 'border-[#FFD1D3] bg-[#FFF5F5] text-[#B4232B]' : 'border-[#B9E8CE] bg-[#F2FBF6] text-[#16794B]'}`}>{error ? <AlertCircle className="mt-0.5 size-4 shrink-0" /> : <Check className="mt-0.5 size-4 shrink-0" />}<span className="min-w-0 flex-1 break-words">{error || notice}</span>{error && !editing && <button onClick={() => void load()} className="min-h-8 shrink-0 px-2 text-center font-semibold whitespace-normal">{c.retry}</button>}</div>}

        {!resume && !editing ? (
          <section className="border-y border-[#E5E8EB] bg-white px-5 py-16 text-center"><BriefcaseBusiness className="mx-auto size-9 text-[#0066FF]" /><h2 className="mt-4 text-lg font-bold">{c.empty}</h2><p className="mt-2 text-sm text-[#6B7684]">{c.emptyBody}</p><button onClick={() => { setEditing(true); setStep(0); }} className="mt-6 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#0066FF] px-4 py-2 text-center text-sm font-semibold leading-5 text-white whitespace-normal"><Plus className="size-4 shrink-0" />{c.create}</button></section>
        ) : editing ? (
          <section className="rounded-lg border border-[#E5E8EB] bg-white">
            <ol className="grid grid-cols-3 border-b border-[#E5E8EB]">{[c.basic, c.history, c.preference].map((label, index) => <li key={label} className={`px-2 py-3 text-center text-xs font-semibold sm:text-sm ${index === step ? 'border-b-2 border-[#0066FF] text-[#0066FF]' : 'text-[#8B95A1]'}`}>{index + 1}. {label}</li>)}</ol>
            <div className="p-5 sm:p-7">
              {step === 0 && <div className="grid gap-5 sm:grid-cols-2">
                <Field label={c.nationality}><input value={form.nationality} maxLength={3} onChange={(event) => setForm({ ...form, nationality: event.target.value })} className={inputClass} placeholder="VN" /></Field>
                <Field label={c.birthDate}><input type="date" value={form.birthDate} onChange={(event) => setForm({ ...form, birthDate: event.target.value })} className={inputClass} /></Field>
                <Field label={c.topik}><select value={form.topikLevel ?? ''} onChange={(event) => setForm({ ...form, topikLevel: event.target.value === '' ? null : Number(event.target.value) })} className={inputClass}><option value="">{c.select}</option>{[0,1,2,3,4,5,6].map((level) => <option key={level} value={level}>{level}</option>)}</select></Field>
                <Field label={c.kiip}><select value={form.kiipLevel ?? ''} onChange={(event) => setForm({ ...form, kiipLevel: event.target.value === '' ? null : Number(event.target.value) })} className={inputClass}><option value="">{c.select}</option>{[0,1,2,3,4,5].map((level) => <option key={level} value={level}>{level}</option>)}</select></Field>
              </div>}

              {step === 1 && <div className="space-y-8">
                <div><div className="mb-3 flex flex-wrap items-center justify-between gap-2"><h2 className="flex min-w-0 items-center gap-2 font-bold"><GraduationCap className="size-5 shrink-0 text-[#0066FF]" />{c.education}</h2><button onClick={() => setForm({ ...form, educations: [...form.educations, emptyEducation()] })} className="inline-flex min-h-9 items-center justify-center gap-1 px-2 py-1 text-center text-sm font-semibold leading-5 text-[#0066FF] whitespace-normal"><Plus className="size-4 shrink-0" />{c.addEducation}</button></div>
                  <div className="space-y-4">{form.educations.map((education, index) => <div key={index} className="grid gap-3 border-b border-[#E5E8EB] pb-4 sm:grid-cols-2"><Field label={c.school}><input value={education.school} onChange={(event) => setForm({ ...form, educations: form.educations.map((item, itemIndex) => itemIndex === index ? { ...item, school: event.target.value } : item) })} className={inputClass} /></Field><Field label={c.major}><input value={education.major} onChange={(event) => setForm({ ...form, educations: form.educations.map((item, itemIndex) => itemIndex === index ? { ...item, major: event.target.value } : item) })} className={inputClass} /></Field><Field label={c.degree}><input value={education.degree} onChange={(event) => setForm({ ...form, educations: form.educations.map((item, itemIndex) => itemIndex === index ? { ...item, degree: event.target.value } : item) })} className={inputClass} /></Field><div className="grid grid-cols-[1fr_auto] gap-2"><Field label={c.graduationYear}><input type="number" value={education.graduationYear ?? ''} onChange={(event) => setForm({ ...form, educations: form.educations.map((item, itemIndex) => itemIndex === index ? { ...item, graduationYear: event.target.value ? Number(event.target.value) : null } : item) })} className={inputClass} /></Field><button onClick={() => setForm({ ...form, educations: form.educations.filter((_, itemIndex) => itemIndex !== index) })} aria-label={c.remove} title={c.remove} className="mt-6 grid size-10 place-items-center rounded-lg text-[#E5484D]"><Trash2 className="size-4" /></button></div></div>)}</div>
                </div>
                <div><div className="mb-3 flex flex-wrap items-center justify-between gap-2"><h2 className="flex min-w-0 items-center gap-2 font-bold"><BriefcaseBusiness className="size-5 shrink-0 text-[#0066FF]" />{c.experience}</h2><button onClick={() => setForm({ ...form, workExperiences: [...form.workExperiences, emptyWork()] })} className="inline-flex min-h-9 items-center justify-center gap-1 px-2 py-1 text-center text-sm font-semibold leading-5 text-[#0066FF] whitespace-normal"><Plus className="size-4 shrink-0" />{c.addExperience}</button></div>
                  {form.workExperiences.map((work, index) => <div key={index} className="mb-4 grid gap-3 border-b border-[#E5E8EB] pb-4 sm:grid-cols-2"><Field label={c.company}><input value={work.company} onChange={(event) => setForm({ ...form, workExperiences: form.workExperiences.map((item, itemIndex) => itemIndex === index ? { ...item, company: event.target.value } : item) })} className={inputClass} /></Field><Field label={c.role}><input value={work.role} onChange={(event) => setForm({ ...form, workExperiences: form.workExperiences.map((item, itemIndex) => itemIndex === index ? { ...item, role: event.target.value } : item) })} className={inputClass} /></Field><Field label={c.startDate}><input type="month" value={work.startDate} onChange={(event) => setForm({ ...form, workExperiences: form.workExperiences.map((item, itemIndex) => itemIndex === index ? { ...item, startDate: event.target.value } : item) })} className={inputClass} /></Field><Field label={c.endDate}><input type="month" value={work.endDate} onChange={(event) => setForm({ ...form, workExperiences: form.workExperiences.map((item, itemIndex) => itemIndex === index ? { ...item, endDate: event.target.value } : item) })} className={inputClass} /></Field><div className="flex gap-2 sm:col-span-2"><label className="block flex-1 space-y-1.5 text-sm font-medium"><span>{c.description}</span><textarea value={work.description} onChange={(event) => setForm({ ...form, workExperiences: form.workExperiences.map((item, itemIndex) => itemIndex === index ? { ...item, description: event.target.value } : item) })} className={`${inputClass} h-20 py-2`} /></label><button onClick={() => setForm({ ...form, workExperiences: form.workExperiences.filter((_, itemIndex) => itemIndex !== index) })} aria-label={c.remove} title={c.remove} className="mt-6 grid size-10 place-items-center rounded-lg text-[#E5484D]"><Trash2 className="size-4" /></button></div></div>)}
                </div>
              </div>}

              {step === 2 && <div className="space-y-6">
                <div className="grid gap-5 sm:grid-cols-2"><Field label={c.jobs}><input value={form.preferredJobTypes} onChange={(event) => setForm({ ...form, preferredJobTypes: event.target.value })} className={inputClass} placeholder={c.jobPlaceholder} /></Field><Field label={c.regions}><input value={form.preferredRegions} onChange={(event) => setForm({ ...form, preferredRegions: event.target.value })} className={inputClass} placeholder={c.regionPlaceholder} /></Field><Field label={c.salary}><input type="number" min="0" value={form.preferredSalary} onChange={(event) => setForm({ ...form, preferredSalary: event.target.value })} className={inputClass} /></Field><Field label={c.employment}><div className="grid grid-cols-1 gap-2 sm:grid-cols-3">{[
                  { value: 'REGULAR', label: c.employmentRegular },
                  { value: 'CONTRACT', label: c.employmentContract },
                  { value: 'PART_TIME', label: c.employmentPartTime },
                ].map((type) => <button key={type.value} onClick={() => setForm({ ...form, preferredEmploymentTypes: form.preferredEmploymentTypes.includes(type.value) ? form.preferredEmploymentTypes.filter((item) => item !== type.value) : [...form.preferredEmploymentTypes, type.value] })} className={`min-h-10 min-w-0 rounded-lg border px-2 py-2 text-center text-xs font-semibold leading-4 whitespace-normal ${form.preferredEmploymentTypes.includes(type.value) ? 'border-[#0066FF] bg-[#EAF2FF] text-[#0066FF]' : 'border-[#DDE2E8] text-[#6B7684]'}`}>{type.label}</button>)}</div></Field></div>
                <div className="border-t border-[#E5E8EB] pt-6"><div className="flex items-start justify-between gap-4"><div className="min-w-0"><h2 className="flex items-center gap-2 font-bold"><ShieldCheck className="size-5 shrink-0 text-[#0066FF]" />{c.disclosure}</h2><p className="mt-2 max-w-2xl break-words text-sm leading-6 text-[#6B7684]">{c.disclosureBody}</p></div><button type="button" role="switch" aria-label={c.disclosure} aria-checked={desiredVisibility} onClick={() => setDesiredVisibility((current) => !current)} className={`relative mt-1 h-7 w-12 shrink-0 rounded-full transition ${desiredVisibility ? 'bg-[#0066FF]' : 'bg-[#C9D0D8]'}`}><span className={`absolute top-1 size-5 rounded-full bg-white transition ${desiredVisibility ? 'left-6' : 'left-1'}`} /></button></div><p className={`mt-3 break-words text-sm font-semibold ${desiredVisibility ? 'text-[#0066FF]' : 'text-[#8B95A1]'}`}>{desiredVisibility ? c.disclosureOn : c.disclosureOff}</p></div>
              </div>}
            </div>
            <div className="grid grid-cols-1 gap-2 border-t border-[#E5E8EB] px-5 py-4 sm:grid-cols-2"><button onClick={() => step === 0 ? setEditing(false) : setStep((current) => current - 1)} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#DDE2E8] px-4 py-2 text-center text-sm font-semibold leading-5 whitespace-normal"><ArrowLeft className="size-4 shrink-0" />{step === 0 ? c.cancel : c.back}</button>{step < 2 ? <button onClick={next} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#0066FF] px-4 py-2 text-center text-sm font-semibold leading-5 text-white whitespace-normal">{c.next}<ArrowRight className="size-4 shrink-0" /></button> : <button onClick={() => void save()} disabled={saving} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#0066FF] px-4 py-2 text-center text-sm font-semibold leading-5 text-white whitespace-normal disabled:opacity-50">{saving ? <Loader2 className="size-4 shrink-0 animate-spin" /> : <Save className="size-4 shrink-0" />}{c.save}</button>}</div>
          </section>
        ) : resume ? (
          <section className="rounded-lg border border-[#E5E8EB] bg-white"><div className="grid gap-6 p-6 sm:grid-cols-3"><div><p className="text-xs text-[#8B95A1]">{c.nationality}</p><p className="mt-1 font-semibold">{resume.nationality}</p></div><div><p className="text-xs text-[#8B95A1]">{c.education}</p><p className="mt-1 font-semibold">{resume.educations?.length ?? 0}</p></div><div><p className="text-xs text-[#8B95A1]">{c.experience}</p><p className="mt-1 font-semibold">{resume.workExperiences?.length ?? 0}</p></div></div><div className="flex flex-col items-stretch gap-4 border-t border-[#E5E8EB] px-6 py-5 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><p className="break-words font-semibold">{c.disclosure}</p><p className={`mt-1 break-words text-sm ${visibility.isOpenToScout ? 'text-[#0066FF]' : 'text-[#8B95A1]'}`}>{visibility.isOpenToScout ? c.disclosureOn : c.disclosureOff}</p></div>{visibility.isOpenToScout && <button onClick={() => void withdraw()} disabled={saving} className="min-h-10 w-full rounded-lg border border-[#DDE2E8] px-4 py-2 text-center text-sm font-semibold leading-5 text-[#E5484D] whitespace-normal disabled:opacity-50 sm:w-auto">{c.withdraw}</button>}</div></section>
        ) : null}
      </div>
    </main>
  );
}
