/**
 * 정규채용 공고 등록 위자드 (최종 버전)
 * Fulltime job posting creation wizard (final version)
 * - Step 1: 기본 정보 (직종, 연봉, 경력, 학력, 해외채용)
 * - Step 2: 근무 조건 (주소, 우대전공, 모집인원, 회사정보)
 * - Step 3: 상세 내용 (제목, 설명, 복리후생)
 * - Step 4: 비자 매칭 결과 + 접수 설정
 * - Step 5: 미리보기 + 등록
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import WizardProgress from './components/wizard-progress';
import StepBasicInfo from './components/step-basic-info';
import StepWorkConditions from './components/step-work-conditions';
import StepDetails from './components/step-details';
import StepVisaMatching from './components/step-visa-matching';
import StepPreview from './components/step-preview';
import LiveVisaIndicator from './components/live-visa-indicator';
import { matchFulltimeVisa, createFulltimeJob, submitFulltimeJobForReview } from './api';
import { useAuth } from '@/contexts/auth-context';
import { apiClient } from '@/lib/api-client';
import CompanyAuthGuard from '@/components/guards/company-auth-guard';
import { useLanguage } from '@/i18n/LanguageProvider';
import type {
  FulltimeJobFormData,
  FulltimeVisaMatchingResponse,
  WizardStep,
} from './components/fulltime-types';

const COPY = {
  ko: {
    pageTitle: '정규직 공고 등록', backToJobs: '공고 목록으로 돌아가기', progress: '공고 작성 진행 단계', visaPanel: '비자 적합성 안내',
    previous: '이전', next: '다음', requestReview: '검토 요청하기', requestingReview: '검토 요청 중...',
    submittedTitle: '검토 요청을 접수했습니다', submittedDescription: (eligible: number, conditional: number) => `관리자 검토 후 게시 여부를 알려드립니다. 현재 ${eligible}개 비자는 가능, ${conditional}개 비자는 추가 확인이 필요합니다.`,
    goToManage: '공고 관리로 이동', createAnother: '새 공고 작성', submitError: '공고를 검토 요청으로 보내지 못했습니다. 잠시 후 다시 시도해주세요.',
    requiredJob: '직종을 선택해주세요.', requiredEmployment: '고용 형태를 선택해주세요.', minSalary: '최소 연봉은 2,000만원 이상이어야 합니다.', maxSalary: '최대 연봉은 최소 연봉보다 커야 합니다.',
    requiredExperience: '경력 수준을 선택해주세요.', requiredEducation: '학력을 선택해주세요.', requiredSido: '시/도를 선택해주세요.', requiredSigungu: '시/군/구를 선택해주세요.', requiredAddress: '상세 주소를 입력해주세요.', recruitCount: '모집 인원은 1명 이상이어야 합니다.',
    titleLength: '제목은 10자 이상 입력해주세요.', descriptionLength: '상세 설명은 50자 이상 입력해주세요.', applicationMethod: '접수 방법을 선택해주세요.', applicationDeadline: '마감일을 선택하거나 채용 시까지를 선택해주세요.', contactName: '담당자 이름을 입력해주세요.', contactPhone: '담당자 전화번호를 입력해주세요.',
  },
  en: {
    pageTitle: 'Create a full-time job post', backToJobs: 'Back to job posts', progress: 'Job post progress', visaPanel: 'Visa eligibility guidance',
    previous: 'Back', next: 'Continue', requestReview: 'Request review', requestingReview: 'Requesting review...',
    submittedTitle: 'Your review request has been received', submittedDescription: (eligible: number, conditional: number) => `${eligible} visa options currently match this post. ${conditional} option(s) need additional review. We will let you know after the administrator review.`,
    goToManage: 'Manage job posts', createAnother: 'Create another post', submitError: 'We could not send this post for review. Please try again shortly.',
    requiredJob: 'Select a job category.', requiredEmployment: 'Select an employment type.', minSalary: 'The minimum annual salary must be at least KRW 20,000,000.', maxSalary: 'The maximum annual salary must be higher than the minimum.',
    requiredExperience: 'Select an experience level.', requiredEducation: 'Select an education level.', requiredSido: 'Select a province or city.', requiredSigungu: 'Select a district or county.', requiredAddress: 'Enter the detailed work address.', recruitCount: 'Enter at least one opening.',
    titleLength: 'Enter a title with at least 10 characters.', descriptionLength: 'Enter a job description with at least 50 characters.', applicationMethod: 'Select an application method.', applicationDeadline: 'Set a deadline or choose to keep the post open.', contactName: 'Enter the contact person’s name.', contactPhone: 'Enter the contact phone number.',
  },
  vi: {
    pageTitle: 'Tạo tin tuyển dụng toàn thời gian', backToJobs: 'Quay lại danh sách tin tuyển dụng', progress: 'Tiến độ tạo tin tuyển dụng', visaPanel: 'Hướng dẫn điều kiện thị thực',
    previous: 'Quay lại', next: 'Tiếp tục', requestReview: 'Gửi duyệt', requestingReview: 'Đang gửi duyệt...',
    submittedTitle: 'Yêu cầu duyệt đã được tiếp nhận', submittedDescription: (eligible: number, conditional: number) => `Hiện có ${eligible} lựa chọn thị thực phù hợp và ${conditional} lựa chọn cần kiểm tra thêm. Chúng tôi sẽ thông báo sau khi quản trị viên duyệt.`,
    goToManage: 'Quản lý tin tuyển dụng', createAnother: 'Tạo tin mới', submitError: 'Không thể gửi tin để duyệt. Vui lòng thử lại sau.',
    requiredJob: 'Hãy chọn ngành nghề.', requiredEmployment: 'Hãy chọn hình thức làm việc.', minSalary: 'Mức lương năm tối thiểu phải từ 20.000.000 KRW.', maxSalary: 'Mức lương năm tối đa phải cao hơn mức tối thiểu.',
    requiredExperience: 'Hãy chọn mức kinh nghiệm.', requiredEducation: 'Hãy chọn trình độ học vấn.', requiredSido: 'Hãy chọn tỉnh hoặc thành phố.', requiredSigungu: 'Hãy chọn quận, huyện hoặc khu vực.', requiredAddress: 'Hãy nhập địa chỉ làm việc chi tiết.', recruitCount: 'Số lượng tuyển phải từ 1 người trở lên.',
    titleLength: 'Tiêu đề cần có ít nhất 10 ký tự.', descriptionLength: 'Mô tả công việc cần có ít nhất 50 ký tự.', applicationMethod: 'Hãy chọn cách ứng tuyển.', applicationDeadline: 'Hãy đặt hạn nộp hồ sơ hoặc chọn không giới hạn thời hạn.', contactName: 'Hãy nhập tên người liên hệ.', contactPhone: 'Hãy nhập số điện thoại liên hệ.',
  },
  th: {
    pageTitle: 'สร้างประกาศงานประจำ', backToJobs: 'กลับไปยังรายการประกาศงาน', progress: 'ความคืบหน้าการสร้างประกาศงาน', visaPanel: 'ข้อมูลคุณสมบัติด้านวีซ่า',
    previous: 'ย้อนกลับ', next: 'ดำเนินการต่อ', requestReview: 'ส่งตรวจสอบ', requestingReview: 'กำลังส่งตรวจสอบ...',
    submittedTitle: 'ได้รับคำขอตรวจสอบแล้ว', submittedDescription: (eligible: number, conditional: number) => `ขณะนี้มีตัวเลือกวีซ่าที่ตรง ${eligible} รายการ และ ${conditional} รายการที่ต้องตรวจสอบเพิ่มเติม เราจะแจ้งผลหลังผู้ดูแลระบบตรวจสอบ`,
    goToManage: 'จัดการประกาศงาน', createAnother: 'สร้างประกาศใหม่', submitError: 'ไม่สามารถส่งประกาศเพื่อตรวจสอบได้ กรุณาลองใหม่อีกครั้ง',
    requiredJob: 'กรุณาเลือกประเภทงาน', requiredEmployment: 'กรุณาเลือกรูปแบบการจ้างงาน', minSalary: 'เงินเดือนรายปีขั้นต่ำต้องไม่น้อยกว่า 20,000,000 วอน', maxSalary: 'เงินเดือนรายปีสูงสุดต้องมากกว่าค่าต่ำสุด',
    requiredExperience: 'กรุณาเลือกระดับประสบการณ์', requiredEducation: 'กรุณาเลือกระดับการศึกษา', requiredSido: 'กรุณาเลือกจังหวัดหรือเมือง', requiredSigungu: 'กรุณาเลือกเขตหรืออำเภอ', requiredAddress: 'กรุณากรอกรายละเอียดที่อยู่ที่ทำงาน', recruitCount: 'จำนวนที่รับต้องอย่างน้อย 1 คน',
    titleLength: 'หัวข้อจะต้องมีอย่างน้อย 10 ตัวอักษร', descriptionLength: 'รายละเอียดงานจะต้องมีอย่างน้อย 50 ตัวอักษร', applicationMethod: 'กรุณาเลือกวิธีสมัคร', applicationDeadline: 'กรุณากำหนดวันปิดรับ หรือเลือกเปิดรับจนกว่าจะได้ผู้สมัคร', contactName: 'กรุณากรอกชื่อผู้ติดต่อ', contactPhone: 'กรุณากรอกหมายเลขโทรศัพท์ผู้ติดต่อ',
  },
  fil: {
    pageTitle: 'Gumawa ng full-time na job post', backToJobs: 'Bumalik sa mga job post', progress: 'Pag-usad ng paggawa ng job post', visaPanel: 'Gabay sa pagiging kwalipikado sa visa',
    previous: 'Bumalik', next: 'Magpatuloy', requestReview: 'Ipadala para sa pagsusuri', requestingReview: 'Ipinapadala para sa pagsusuri...',
    submittedTitle: 'Natanggap na ang kahilingan para sa pagsusuri', submittedDescription: (eligible: number, conditional: number) => `May ${eligible} opsyon sa visa na kasalukuyang tugma at ${conditional} na nangangailangan ng karagdagang pagsusuri. Magbibigay kami ng update pagkatapos ng pagsusuri ng administrator.`,
    goToManage: 'Pamahalaan ang mga job post', createAnother: 'Gumawa ng bagong post', submitError: 'Hindi maipadala ang job post para sa pagsusuri. Pakisubukang muli sa ilang sandali.',
    requiredJob: 'Pumili ng kategorya ng trabaho.', requiredEmployment: 'Pumili ng uri ng trabaho.', minSalary: 'Ang minimum na taunang sahod ay dapat hindi bababa sa KRW 20,000,000.', maxSalary: 'Ang maximum na taunang sahod ay dapat mas mataas kaysa minimum.',
    requiredExperience: 'Pumili ng antas ng karanasan.', requiredEducation: 'Pumili ng antas ng edukasyon.', requiredSido: 'Pumili ng lalawigan o lungsod.', requiredSigungu: 'Pumili ng distrito o county.', requiredAddress: 'Ilagay ang kumpletong address ng trabaho.', recruitCount: 'Maglagay ng hindi bababa sa isang bakante.',
    titleLength: 'Maglagay ng pamagat na may hindi bababa sa 10 character.', descriptionLength: 'Maglagay ng paglalarawan ng trabaho na may hindi bababa sa 50 character.', applicationMethod: 'Pumili ng paraan ng pag-apply.', applicationDeadline: 'Magtakda ng deadline o piliing panatilihing bukas ang post.', contactName: 'Ilagay ang pangalan ng contact person.', contactPhone: 'Ilagay ang numero ng telepono ng contact person.',
  },
} as const;

const INITIAL_FORM: FulltimeJobFormData = {
  // Step 1 — 선택 필드는 빈값으로 초기화 (사용자가 직접 선택)
  // Selection fields initialized empty (user must explicitly choose)
  jobCategoryCode: '',
  employmentType: '' as unknown as FulltimeJobFormData['employmentType'],
  salaryInputType: '' as unknown as FulltimeJobFormData['salaryInputType'],
  salaryMin: 0,
  salaryMax: 0,
  weeklyWorkHours: 40,
  experienceLevel: '' as unknown as FulltimeJobFormData['experienceLevel'],
  educationLevel: '' as unknown as FulltimeJobFormData['educationLevel'],
  overseasHireWilling: true,  // 해외 인재 채용 기본값 "예" / Default overseas hire = yes
  // Step 2
  address: { sido: '', sigungu: '', detail: '' },
  preferredMajors: [],
  recruitCount: 1,
  companyInfo: {},
  // Step 3
  title: '',
  detailDescription: '',
  benefits: [],
  // Step 4
  applicationMethod: 'PLATFORM',
  applicationDeadline: null,
  isOpenEnded: false,
  // 담당자 정보 (프로필에서 자동 입력) / Contact info (auto-filled from profile)
  contactName: '',
  contactPhone: '',
  contactEmail: '',
};

export default function FulltimeCreatePage() {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const locale = lang === 'kr' ? 'ko' : lang === 'tl' ? 'fil' : lang === 'ja' ? 'en' : lang;
  const copy = COPY[locale];
  const [step, setStep] = useState<WizardStep>(1);
  const [form, setForm] = useState<FulltimeJobFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [matchResult, setMatchResult] = useState<FulltimeVisaMatchingResponse | null>(null);
  const [isMatchLoading, setIsMatchLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  // 프로필에서 담당자 정보 자동 입력 / Auto-fill contact info from profile
  useEffect(() => {
    if (!user || form.contactName || form.contactEmail) return;

    const timer = window.setTimeout(() => {
      setForm((prev) => ({
        ...prev,
        contactName: prev.contactName || user.fullName || '',
        contactEmail: prev.contactEmail || user.email || '',
      }));
    }, 0);

    return () => window.clearTimeout(timer);
  }, [form.contactEmail, form.contactName, user]);

  // 기업인증 정보에서 회사 정보 자동 입력 / Auto-fill company info from corporate verification
  useEffect(() => {
    if (!user || user.role !== 'CORPORATE') return;
    apiClient.get('/auth/corporate-verify').then(({ data }) => {
      if (!data) return;
      setForm((prev) => ({
        ...prev,
        // 담당자 전화번호 자동 입력 / Auto-fill manager phone
        contactPhone: prev.contactPhone || data.managerPhone || '',
        // 회사 정보 자동 입력 (비자 매칭에 필요) / Auto-fill company info (needed for visa matching)
        companyInfo: {
          ...prev.companyInfo,
          totalEmployees: prev.companyInfo.totalEmployees || data.employeeCountKorean || undefined,
          foreignEmployeeCount: prev.companyInfo.foreignEmployeeCount || data.employeeCountForeign || undefined,
        },
      }));
    }).catch(() => {
      // 인증 정보 조회 실패 시 수동 입력으로 진행 / Proceed with manual input on failure
    });
  }, [user]);

  // 폼 업데이트 / Update form field
  const updateForm = useCallback(
    <K extends keyof FulltimeJobFormData>(key: K, value: FulltimeJobFormData[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
      // 비자 매칭에 영향을 주는 필드 변경 시 결과 초기화
      if (
        [
          'jobCategoryCode',
          'employmentType',
          'salaryMin',
          'salaryMax',
          'experienceLevel',
          'educationLevel',
          'overseasHireWilling',
          'address',
        ].includes(key)
      ) {
        setMatchResult(null);
      }
    },
    []
  );

  // Step 1 유효성 검증
  const validateStep1 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.jobCategoryCode) errs.jobCategoryCode = copy.requiredJob;
    if (!form.employmentType) errs.employmentType = copy.requiredEmployment;
    if (form.salaryMin < 20000000) errs.salaryMin = copy.minSalary;
    if (form.salaryMax < form.salaryMin) errs.salaryMax = copy.maxSalary;
    if (!form.experienceLevel) errs.experienceLevel = copy.requiredExperience;
    if (!form.educationLevel) errs.educationLevel = copy.requiredEducation;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 2 유효성 검증
  const validateStep2 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.address.sido) errs.address = copy.requiredSido;
    if (!form.address.sigungu) errs.address = copy.requiredSigungu;
    if (!form.address.detail.trim()) errs.address = copy.requiredAddress;
    if (form.recruitCount < 1) errs.recruitCount = copy.recruitCount;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 3 유효성 검증
  const validateStep3 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.title.trim() || form.title.length < 10)
      errs.title = copy.titleLength;
    if (!form.detailDescription.trim() || form.detailDescription.length < 50)
      errs.detailDescription = copy.descriptionLength;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 4 유효성 검증 (접수 설정 + 담당자 정보)
  // Step 4 validation (application settings + contact info)
  const validateStep4 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.applicationMethod) errs.applicationMethod = copy.applicationMethod;
    if (!form.isOpenEnded && !form.applicationDeadline)
      errs.applicationDeadline = copy.applicationDeadline;
    if (!form.contactName.trim()) errs.contactName = copy.contactName;
    if (!form.contactPhone.trim()) errs.contactPhone = copy.contactPhone;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // 다음 단계
  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step === 3 && !validateStep3()) return;
    if (step === 4 && !validateStep4()) return;
    setStep((prev) => Math.min(prev + 1, 5) as WizardStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 이전 단계
  const handlePrev = () => {
    setStep((prev) => Math.max(prev - 1, 1) as WizardStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 비자 매칭 요청
  const handleRequestMatch = useCallback(async () => {
    if (isMatchLoading) return;
    setIsMatchLoading(true);
    try {
      const result = await matchFulltimeVisa(form);
      setMatchResult(result);
    } catch {
      setMatchResult(null);
    } finally {
      setIsMatchLoading(false);
    }
  }, [form, isMatchLoading]);

  // Step 4 진입 시 비자 매칭 자동 실행
  useEffect(() => {
    if (step !== 4 || matchResult || isMatchLoading) return;

    const timer = window.setTimeout(() => {
      void handleRequestMatch();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [handleRequestMatch, isMatchLoading, matchResult, step]);

  // 공고 등록 (비자 매칭 결과도 함께 전송)
  // Submit job posting (includes visa matching result)
  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const draft = await createFulltimeJob(form, matchResult);
      await submitFulltimeJobForReview(draft.jobId);
      setCompleted(true);
    } catch {
      alert(copy.submitError);
    } finally {
      setSubmitting(false);
    }
  };

  // 완료 화면
  if (completed) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-9 h-9 text-[#0066FF]" aria-hidden="true" />
          </div>
          <h2 className="text-xl font-bold text-[#191F28] mb-2">{copy.submittedTitle}</h2>
          <p className="text-sm text-gray-500 mb-8">
            {copy.submittedDescription(
              matchResult?.overallSummary.totalEligible ?? 0,
              matchResult?.overallSummary.totalConditional ?? 0,
            )}
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
            <Link
              href="/company/fulltime"
              className="px-6 py-2.5 bg-[#0066FF] text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition text-center"
            >
              {copy.goToManage}
            </Link>
            <Link
              href="/company/fulltime/create"
              className="px-6 py-2.5 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-[#F9FAFB] transition text-center"
              onClick={() => {
                setForm(INITIAL_FORM);
                setStep(1);
                setMatchResult(null);
                setCompleted(false);
              }}
            >
              {copy.createAnother}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 이전/다음 네비게이션 버튼 / Prev/next navigation buttons
  const navButtons = (
    <div className="flex items-center justify-between gap-3 pt-5 mt-5 border-t border-gray-100">
      {step > 1 ? (
        <button
          type="button"
          onClick={handlePrev}
          aria-label={copy.previous}
          className="px-5 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          {copy.previous}
        </button>
      ) : (
        <div />
      )}
      {step < 5 ? (
        <button
          type="button"
          onClick={handleNext}
          aria-label={copy.next}
          className="px-7 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition min-w-[100px]"
        >
          {copy.next}
        </button>
      ) : (
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          aria-label={submitting ? copy.requestingReview : copy.requestReview}
          className="px-7 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition min-w-[100px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {copy.requestingReview}
            </>
          ) : (
            copy.requestReview
          )}
        </button>
      )}
    </div>
  );

  return (
    <CompanyAuthGuard requiredAccess="draft">
    <div className="bg-[#F9FAFB] min-h-screen">
      {/* 상단 컴팩트 스티키 바: 제목 + 진행 단계 / Compact sticky bar: title + step progress */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          {/* 제목 행 / Title row */}
          <div className="h-11 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/company/fulltime" aria-label={copy.backToJobs} className="p-1 text-gray-500 hover:text-[#191F28]">
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              </Link>
              <h1 className="text-sm font-bold text-[#191F28]">{copy.pageTitle}</h1>
            </div>
          </div>
          {/* 진행 단계 표시 / Step progress */}
          <div className="pb-2.5">
            <div aria-label={copy.progress}>
              <WizardProgress currentStep={step} onStepClick={(s) => setStep(s)} />
            </div>
          </div>
        </div>
      </div>

      {/* 스텝 컨텐츠 — Steps 1~3: 2컬럼 (폼 + 비자 패널), Steps 4~5: 단일 컬럼 */}
      {/* Step content — Steps 1~3: 2-column (form + visa panel), Steps 4~5: single column */}
      {step <= 3 ? (
        <div className="max-w-6xl mx-auto px-4 pt-5 pb-28 md:pb-8">
          <div className="flex flex-col gap-5 items-stretch lg:flex-row lg:items-start">
            <div className="flex-1 min-w-0">
              {step === 1 && <StepBasicInfo form={form} errors={errors} updateForm={updateForm} />}
              {step === 2 && <StepWorkConditions form={form} errors={errors} updateForm={updateForm} />}
              {step === 3 && <StepDetails form={form} errors={errors} updateForm={updateForm} />}
            </div>
            {/* 우측 비자 패널 (sticky) / Right visa panel (sticky) */}
            <aside className="w-full shrink-0 lg:w-64 lg:sticky lg:top-[100px]" aria-label={copy.visaPanel}>
              <LiveVisaIndicator form={form} />
            </aside>
          </div>
          {navButtons}
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-4 pt-5 pb-28 md:pb-8">
          {step === 4 && (
            <StepVisaMatching
              form={form}
              errors={errors}
              updateForm={updateForm}
              matchResult={matchResult}
              isMatchLoading={isMatchLoading}
              onRequestMatch={handleRequestMatch}
            />
          )}
          {step === 5 && <StepPreview form={form} onGoToStep={setStep} />}
          {navButtons}
        </div>
      )}
    </div>
    </CompanyAuthGuard>
  );
}
