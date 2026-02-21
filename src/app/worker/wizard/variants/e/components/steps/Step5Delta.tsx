"use client";

import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Map, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import QuestCard from '../QuestCard';
import { IStepProps } from './stepInterfaces';
import { DeltaData, DeltaFieldConfig, VisaData } from '../../../a/types';

// Mock function to fetch dynamic field configuration based on visa
// 비자에 따라 동적 필드 구성을 가져오는 모의 함수
const getDeltaFields = async (visaType: string): Promise<DeltaFieldConfig[]> => {
  // In a real app, this would be an API call.
  // 실제 앱에서는 API 호출이 됩니다.
  return new Promise(resolve => {
    setTimeout(() => {
      // Example configurations based on visa type
      // 비자 유형에 따른 예시 구성
      if (visaType.toUpperCase().startsWith('F-4')) {
        resolve([
          { id: 'has_relatives_in_korea', label: 'Do you have relatives in Korea?', type: 'boolean' },
          { id: 'overseas_korean_id', label: 'Overseas Korean ID Number', type: 'text' },
        ]);
      } else if (visaType.toUpperCase().startsWith('E-7')) {
        resolve([
          { id: 'sponsoring_company', label: 'Sponsoring Company Name', type: 'text' },
          { id: 'contract_end_date', label: 'Contract End Date', type: 'date' },
        ]);
      } else {
        resolve([]); // No extra fields for other visas
      }
    }, 1000);
  });
};

const Step5Delta: React.FC<IStepProps> = ({ data, updateData, onNext, onBack }) => {
  const [fieldConfig, setFieldConfig] = useState<DeltaFieldConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const visaType = (data.visa as VisaData)?.visaType || '';

  // Dynamically create Zod schema from the field config
  // 필드 구성에서 동적으로 Zod 스키마 생성
  const deltaSchema = z.object(
    fieldConfig.reduce((acc, field) => {
      let validator: z.ZodTypeAny;
      switch (field.type) {
        case 'text':
          validator = z.string().min(1, `${field.label} is required.`);
          break;
        case 'date':
          validator = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD format required.');
          break;
        case 'boolean':
          validator = z.boolean().default(false);
          break;
        default:
          validator = z.any();
      }
      return { ...acc, [field.id]: validator };
    }, {} as Record<string, z.ZodTypeAny>)
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<DeltaData>({
    resolver: zodResolver(deltaSchema),
    defaultValues: data.delta,
    mode: 'onChange',
  });

  useEffect(() => {
    if (!visaType) {
        setIsLoading(false);
        onNext(); // Skip if no visa type
        return;
    }
    
    let isMounted = true;
    getDeltaFields(visaType).then(config => {
      if (isMounted) {
        if (config.length === 0) {
            // If no fields are returned, skip this step
            // 필드가 반환되지 않으면 이 단계를 건너뜁니다.
            onNext();
        } else {
            setFieldConfig(config);
            setIsLoading(false);
        }
      }
    });

    return () => { isMounted = false; };
  }, [visaType, onNext]);

  const onSubmit = (formData: DeltaData) => {
    updateData('delta', formData);
    onNext();
  };

  const renderField = (field: DeltaFieldConfig) => {
    switch (field.type) {
      case 'text':
      case 'date':
        return (
          <div key={field.id}>
            <Label htmlFor={field.id}>{field.label}</Label>
            <Input id={field.id} type={field.type} {...register(field.id)} />
            {errors[field.id] && <p className="text-red-500 text-xs mt-1">{errors[field.id]?.message as string}</p>}
          </div>
        );
      case 'boolean':
        return (
          <div key={field.id} className="flex items-center space-x-2">
            <Controller
              name={field.id}
              control={control}
              render={({ field: controllerField }) => (
                <Checkbox
                  id={field.id}
                  checked={controllerField.value}
                  onCheckedChange={controllerField.onChange}
                />
              )}
            />
            <Label htmlFor={field.id}>{field.label}</Label>
          </div>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
        <QuestCard questName="Quest 6: The Unforeseen Path">
            <div className="flex flex-col items-center justify-center p-12 text-center">
                <Loader2 className="w-16 h-16 text-amber-400 animate-spin mb-4" />
                <p className="text-lg text-gray-300">Checking for special quests based on your visa...</p>
                <p className="text-lg text-gray-300">(비자에 따른 특별 퀘스트 확인 중...)</p>
            </div>
        </QuestCard>
    );
  }

  return (
    <QuestCard questName="Quest 6: The Unforeseen Path">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">A path tailored for you...</h3>
          <p className="text-gray-400">Please provide some additional information based on your visa type. (비자 종류에 따라 추가 정보를 입력해주세요.)</p>
        </div>

        <div className="space-y-6">{fieldConfig.map(renderField)}</div>

        <div className="flex justify-between mt-8">
          <Button type="button" variant="outline" onClick={onBack}>Back (뒤로)</Button>
          <Button type="submit" disabled={!isValid} className="bg-blue-600 hover:bg-blue-700 text-white">Next (다음)</Button>
        </div>
      </form>
    </QuestCard>
  );
};

export default Step5Delta;
