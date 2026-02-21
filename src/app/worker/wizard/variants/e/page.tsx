"use client";

import React, { useState, useMemo, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import confetti from 'canvas-confetti';

// Import shared types
// ../a/types에서 공유 타입을 가져옵니다.
import {
  WizardData,
  WizardCompletion,
  ResidencyStatus,
  StepMeta,
} from '../a/types';

// Import Components
// 컴포넌트들을 가져옵니다.
import ExpBar from './components/ExpBar';
import QuestComplete from './components/QuestComplete';
import LevelUpModal from './components/LevelUpModal';

// Import Step Components
// 단계별 컴포넌트들을 가져옵니다.
import Step0Residency from './components/steps/Step0Residency';
import Step1Identity from './components/steps/Step1Identity';
import Step2Visa from './components/steps/Step2Visa';
import Step3Korean from './components/steps/Step3Korean';
import Step4Education from './components/steps/Step4Education';
import Step5Delta from './components/steps/Step5Delta';
import Step6Experience from './components/steps/Step6Experience';
import Step7Preferences from './components/steps/Step7Preferences';

// Helper to get initial data (mock)
// (모의) 초기 데이터를 가져오는 헬퍼 함수
const getInitialWizardData = (): WizardData => ({
  residency: { status: null },
  identity: {
    name: '',
    nationality: '',
    birthdate: '',
    gender: null,
    contact: '',
    photo: null,
    address: '',
  },
  visa: {
    visaType: '',
    arcNumber: '',
    expiryDate: '',
    arcScan: null,
  },
  koreanLanguage: {
    testType: null,
    level: '',
    certificate: null,
  },
  education: [],
  delta: {},
  experience: [],
  preferences: {
    employmentType: null,
    salary: { amount: 0, type: null },
    workLocation: '',
  },
});

// Wizard steps configuration
// 위저드 단계 설정
const WIZARD_STEPS: StepMeta[] = [
  { step: 0, questName: 'Quest 1: The Journey Begins' }, // 여정의 시작
  { step: 1, questName: 'Quest 2: Who Are You?' }, // 당신은 누구인가?
  { step: 2, questName: 'Quest 3: Proof of Stay' }, // 체류 증명
  { step: 3, questName: 'Quest 4: The Local Tongue' }, // 현지인의 언어
  { step: 4, questName: 'Quest 5: Scrolls of Knowledge' }, // 지식의 두루마리
  { step: 5, questName: 'Quest 6: The Unforeseen Path' }, // 예기치 않은 길
  { step: 6, questName: 'Quest 7: Tales of Experience' }, // 경험담
  { step: 7, questName: 'Quest 8: The Desired Hoard' }, // 원하는 보물
];

const TOTAL_STEPS = WIZARD_STEPS.length;

export default function WizardPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [wizardData, setWizardData] = useState<WizardData>(getInitialWizardData);
  const [completion, setCompletion] = useState<WizardCompletion>({
    residency: false,
    identity: false,
    visa: false,
    koreanLanguage: false,
    education: false,
    delta: false,
    experience: false,
    preferences: false,
  });
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const level = useMemo(() => {
    return Object.values(completion).filter(Boolean).length;
  }, [completion]);

  const experiencePoints = useMemo(() => {
    return (level / TOTAL_STEPS) * 100;
  }, [level]);

  const handleNext = useCallback(() => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
      setShowLevelUp(true);
      
      // Trigger confetti
      // 색종이 조각 효과 발생
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
      });
    }
  }, [currentStep]);
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const updateData = (stepKey: keyof WizardData, data: any) => {
    setWizardData((prev) => ({ ...prev, [stepKey]: data }));
    setCompletion((prev) => ({ ...prev, [stepKey]: true }));
  };

  const renderStep = () => {
    const stepProps = {
      data: wizardData,
      updateData,
      onNext: handleNext,
      onBack: handleBack,
      isCompleting,
      setIsCompleting,
    };

    switch (currentStep) {
      case 0:
        return <Step0Residency {...stepProps} key={currentStep} />;
      case 1:
        return <Step1Identity {...stepProps} key={currentStep} />;
      case 2:
        return <Step2Visa {...stepProps} key={currentStep} />;
      case 3:
        return <Step3Korean {...stepProps} key={currentStep} />;
      case 4:
        return <Step4Education {...stepProps} key={currentStep} />;
      case 5:
        return <Step5Delta {...stepProps} key={currentStep} />;
      case 6:
        return <Step6Experience {...stepProps} key={currentStep} />;
      case 7:
        return <Step7Preferences {...stepProps} key={currentStep} />;
      default:
        return <QuestComplete />;
    }
  };

  if (currentStep >= TOTAL_STEPS) {
    return <QuestComplete />;
  }

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen font-sans p-4 flex flex-col items-center relative overflow-hidden">
      {/* Fantasy RPG border effect */}
      {/* 판타지 RPG 테두리 효과 */}
      <div className="absolute inset-0 border-8 border-amber-300/30 rounded-2xl pointer-events-none z-0"></div>
      <div className="absolute inset-4 border-4 border-amber-400/40 rounded-lg pointer-events-none z-0"></div>
      <div className="absolute inset-6 border-2 border-amber-500/50 rounded-md pointer-events-none z-0"></div>

      <main className="w-full max-w-4xl mx-auto z-10 relative">
        <ExpBar level={level} experiencePoints={experiencePoints} />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="mt-8"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        <LevelUpModal
          isOpen={showLevelUp}
          onClose={() => setShowLevelUp(false)}
          level={level}
        />
      </main>
    </div>
  );
}
