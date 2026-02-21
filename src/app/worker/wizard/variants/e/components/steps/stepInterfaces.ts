// src/app/worker/wizard/variants/e/components/steps/stepInterfaces.ts

import { WizardData } from '../../../a/types';

// Interface for props passed to each step component
// 각 단계 컴포넌트로 전달되는 props를 위한 인터페이스
export interface IStepProps {
  data: WizardData;
  updateData: <K extends keyof WizardData>(stepKey: K, data: WizardData[K]) => void;
  onNext: () => void;
  onBack: () => void;
  isCompleting: boolean;
  setIsCompleting: (isCompleting: boolean) => void;
}
