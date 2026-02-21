"use client";

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Trophy } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import QuestCard from '../QuestCard';
import { IStepProps } from './stepInterfaces';
import { PreferencesData, EmploymentType, SalaryType } from '../../../a/types';

// Zod schema for validation
// Zod를 사용한 유효성 검사 스키마
const preferencesSchema = z.object({
  employmentType: z.nativeEnum(EmploymentType, { errorMap: () => ({ message: "Please select an employment type." })}),
  salary: z.object({
    amount: z.number().min(0, "Amount must be positive."),
    type: z.nativeEnum(SalaryType, { errorMap: () => ({ message: "Please select a salary type." })}),
  }),
  workLocation: z.string().min(1, "Preferred location is required."),
});

const Step7Preferences: React.FC<IStepProps> = ({ data, updateData, onNext, onBack, setIsCompleting }) => {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<PreferencesData>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: data.preferences,
    mode: 'onChange',
  });

  const onSubmit = (formData: PreferencesData) => {
    setIsCompleting(true); // Show loading state on button
    updateData('preferences', formData);
    // Simulate API call before finishing
    setTimeout(() => {
        onNext();
        setIsCompleting(false);
    }, 1500);
  };

  return (
    <QuestCard questName="Quest 8: The Desired Hoard">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">What treasures do you seek?</h3>
          <p className="text-gray-400">Specify your desired working conditions. This is the final quest! (희망 근무 조건을 알려주세요. 마지막 퀘스트입니다!)</p>
        </div>

        <div className="space-y-6">
            <div>
                <Label>Employment Type (고용 형태)</Label>
                 <Controller
                    control={control}
                    name="employmentType"
                    render={({ field }) => (
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value || undefined} className="flex gap-4 pt-2">
                             {Object.values(EmploymentType).map(type => (
                                <div key={type} className="flex items-center space-x-2">
                                    <RadioGroupItem value={type} id={type} />
                                    <Label htmlFor={type}>{type}</Label>
                                </div>
                             ))}
                        </RadioGroup>
                    )}
                />
                {errors.employmentType && <p className="text-red-500 text-xs mt-1">{errors.employmentType.message}</p>}
            </div>

            <div>
                <Label>Desired Salary (희망 급여)</Label>
                <div className="flex gap-2">
                    <Input
                        type="number"
                        placeholder="3,000"
                        onChange={e => setValue('salary.amount', parseInt(e.target.value) || 0, { shouldValidate: true })}
                        defaultValue={data.preferences.salary.amount || ''}
                        className="w-2/3"
                    />
                     <Controller
                        control={control}
                        name="salary.type"
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                                <SelectTrigger className="w-1/3"><SelectValue placeholder="Per" /></SelectTrigger>
                                <SelectContent>
                                    {Object.values(SalaryType).map(type => (
                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                     ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>
                 {errors.salary?.amount && <p className="text-red-500 text-xs mt-1">{errors.salary.amount.message}</p>}
                 {errors.salary?.type && <p className="text-red-500 text-xs mt-1">{errors.salary.type.message}</p>}
            </div>

            <div>
                <Label htmlFor="workLocation">Preferred Location (희망 근무지)</Label>
                <Input {...register('workLocation')} id="workLocation" placeholder="e.g., Seoul, Gangnam" />
                {errors.workLocation && <p className="text-red-500 text-xs mt-1">{errors.workLocation.message}</p>}
            </div>
        </div>

        <div className="flex justify-between mt-8">
          <Button type="button" variant="outline" onClick={onBack}>Back (뒤로)</Button>
          <Button type="submit" disabled={!isValid} className="bg-green-600 hover:bg-green-700 text-white font-bold flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Complete Your Profile (프로필 완성하기)
          </Button>
        </div>
      </form>
    </QuestCard>
  );
};

export default Step7Preferences;
