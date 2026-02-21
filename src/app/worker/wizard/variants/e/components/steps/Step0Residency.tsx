"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Building, Plane } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import QuestCard from '../QuestCard';

import { ResidencyStatus, WizardData } from '../../../a/types';
import { IStepProps } from './stepInterfaces';

const residencyOptions = [
  {
    value: ResidencyStatus.LONG_TERM,
    label: 'Long-term Resident in Korea', // 한국 장기체류
    description: 'I have an ARC (Alien Registration Card).', // 외국인등록증(ARC)을 소지하고 있습니다.
    icon: Building,
  },
  {
    value: ResidencyStatus.SHORT_TERM,
    label: 'Short-term Visitor in Korea', // 한국 단기체류
    description: 'I am here on a tourist visa or visa-free.', // 관광 비자 또는 무비자로 체류 중입니다.
    icon: Plane,
  },
  {
    value: ResidencyStatus.OVERSEAS,
    label: 'Living Overseas', // 해외 거주
    description: 'I am currently outside of Korea.', // 현재 한국 국외에 거주 중입니다.
    icon: Globe,
  },
];

const Step0Residency: React.FC<IStepProps> = ({ data, updateData, onNext }) => {
  const [selectedStatus, setSelectedStatus] = useState<ResidencyStatus | null>(
    data.residency.status
  );

  const handleNext = () => {
    if (selectedStatus) {
      updateData('residency', { status: selectedStatus });
      onNext();
    }
  };

  return (
    <QuestCard questName="Quest 1: The Journey Begins">
      <div className="flex flex-col gap-8">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">
            Where does your adventure start?
          </h3>
          <p className="text-gray-400">
            Select your current residency status. This will customize your journey.
            <br />
            (현재 거주 상태를 선택해주세요. 당신의 여정이 맞춤 설정됩니다.)
          </p>
        </div>

        <RadioGroup
          value={selectedStatus || ''}
          onValueChange={(value: string) => setSelectedStatus(value as ResidencyStatus)}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {residencyOptions.map((option) => (
            <motion.div
              key={option.value}
              whileHover={{ scale: 1.05 }}
              className="h-full"
            >
              <RadioGroupItem value={option.value} id={option.value} className="sr-only" />
              <Label
                htmlFor={option.value}
                className={`flex flex-col items-center justify-center p-6 rounded-lg border-2 h-full cursor-pointer transition-all duration-200
                  ${selectedStatus === option.value
                    ? 'border-blue-500 bg-blue-900/50 shadow-lg shadow-blue-500/30'
                    : 'border-gray-700 bg-gray-800/50 hover:border-blue-400'
                  }`}
              >
                <option.icon className={`w-12 h-12 mb-4 transition-colors ${selectedStatus === option.value ? 'text-blue-300' : 'text-gray-400'}`} />
                <span className="text-center font-semibold text-white text-base mb-2">{option.label}</span>
                <span className="text-center text-xs text-gray-400">{option.description}</span>
              </Label>
            </motion.div>
          ))}
        </RadioGroup>

        <div className="flex justify-end mt-4">
          <Button
            onClick={handleNext}
            disabled={!selectedStatus}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-8 py-6"
          >
            Start Quest (퀘스트 시작)
          </Button>
        </div>
      </div>
    </QuestCard>
  );
};

export default Step0Residency;
