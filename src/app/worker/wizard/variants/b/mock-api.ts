/**
 * Mock API 함수 / Mock API functions
 * 실제 백엔드 연동 전까지 사용하는 가짜 API 호출
 * Used until real backend integration
 */

import type { WizardFormData, WizardStep } from './types';

// === API 응답 타입 / API response type ===
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * 위저드 스텝 데이터 저장 (Mock)
 * Save wizard step data (Mock)
 * PUT /individual-profile/wizard/:step
 */
export async function saveWizardStep(
  step: WizardStep,
  data: Partial<WizardFormData>
): Promise<ApiResponse<{ savedStep: WizardStep }>> {
  // 네트워크 지연 시뮬레이션 / Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 500));

  console.info(`[Mock API] PUT /individual-profile/wizard/${step}`, data);

  return {
    success: true,
    data: { savedStep: step },
    message: `Step ${step} saved successfully`,
  };
}

/**
 * 위저드 전체 데이터 불러오기 (Mock)
 * Load full wizard data (Mock)
 * GET /individual-profile/wizard
 */
export async function loadWizardData(): Promise<ApiResponse<Partial<WizardFormData> | null>> {
  // 네트워크 지연 시뮬레이션 / Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  console.info('[Mock API] GET /individual-profile/wizard');

  // 빈 데이터 반환 (새 사용자) / Return empty for new user
  return {
    success: true,
    data: null,
    message: 'No existing data found',
  };
}

/**
 * OCR 문서 인식 (Mock)
 * OCR document recognition (Mock)
 * POST /visa-verification/ocr
 */
export async function ocrDocumentScan(
  _file: File
): Promise<ApiResponse<{ visaType: string; arcNumber: string; expiry: string }>> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  console.info('[Mock API] POST /visa-verification/ocr');

  return {
    success: true,
    data: {
      visaType: 'E-9',
      arcNumber: '000000-0000000',
      expiry: '2027-03-15',
    },
    message: 'OCR scan completed',
  };
}

/**
 * 프로필 사진 업로드 (Mock)
 * Profile photo upload (Mock)
 * POST /individual-profile/upload
 */
export async function uploadProfilePhoto(
  _file: File
): Promise<ApiResponse<{ url: string }>> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.info('[Mock API] POST /individual-profile/upload');

  return {
    success: true,
    data: {
      url: '/mock/profile-photo.jpg',
    },
    message: 'Photo uploaded',
  };
}

/**
 * 위저드 전체 제출 (Mock)
 * Submit full wizard (Mock)
 */
export async function submitWizard(
  data: WizardFormData
): Promise<ApiResponse<{ profileId: string }>> {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  console.info('[Mock API] Submit wizard', data);

  return {
    success: true,
    data: {
      profileId: 'mock-profile-' + Date.now(),
    },
    message: 'Profile created successfully',
  };
}
