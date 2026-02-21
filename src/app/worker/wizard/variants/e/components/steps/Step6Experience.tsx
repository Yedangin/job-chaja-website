"use client";

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PlusCircle, Trash2, Briefcase } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import QuestCard from '../QuestCard';
import { IStepProps } from './stepInterfaces';
import { ExperienceEntry } from '../../../a/types';

// Zod schema for a single experience entry
// Zod를 사용한 단일 경력 항목 유효성 검사 스키마
const experienceEntrySchema = z.object({
  company: z.string().min(1, "Company name is required"),
  position: z.string().min(1, "Position is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  description: z.string().optional(),
});

// Zod schema for the experience step
// Zod를 사용한 경력 단계 유효성 검사 스키마
const experienceSchema = z.object({
  experience: z.array(experienceEntrySchema),
  noExperience: z.boolean().default(false),
}).refine(data => data.noExperience || data.experience.length > 0, {
    message: "Please add at least one experience or check 'No experience'.",
    path: ['experience'],
});


const Step6Experience: React.FC<IStepProps> = ({ data, updateData, onNext, onBack }) => {
  const { register, control, handleSubmit, watch, setValue, formState: { errors, isValid } } = useForm<{ experience: ExperienceEntry[], noExperience: boolean }>({
    resolver: zodResolver(experienceSchema),
    defaultValues: { 
        experience: data.experience,
        noExperience: data.experience.length === 0,
    },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'experience',
  });

  const noExperience = watch('noExperience');

  useEffect(() => {
    if (noExperience) {
        // Clear all experience fields if 'no experience' is checked
        // '경력 없음'이 선택되면 모든 경력 필드를 지웁니다.
        remove();
    }
  }, [noExperience, remove]);

  const onSubmit = (formData: { experience: ExperienceEntry[] }) => {
    updateData('experience', formData.experience);
    onNext();
  };

  return (
    <QuestCard questName="Quest 7: Tales of Experience">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">What are your tales of experience?</h3>
          <p className="text-gray-400">List your work experience, or check the box if you have none. (경력 정보를 입력하거나, 경력이 없다면 체크박스를 선택하세요.)</p>
        </div>

        <div className="flex items-center space-x-2">
            <Checkbox
                id="noExperience"
                checked={noExperience}
                onCheckedChange={(checked) => setValue('noExperience', !!checked, { shouldValidate: true })}
            />
            <Label htmlFor="noExperience" className="text-lg">I have no work experience (경력 없음)</Label>
        </div>

        {!noExperience && (
            <>
                <div className="space-y-6">
                {fields.map((field, index) => (
                    <Card key={field.id} className="bg-gray-900/50 border-gray-700">
                    <CardHeader className="flex flex-row items-center justify-between pb-4">
                        <div className="flex items-center gap-3">
                            <Briefcase className="w-6 h-6 text-amber-300"/>
                            <h4 className="font-bold text-lg text-amber-200">Experience #{index + 1}</h4>
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                        <Trash2 className="h-5 w-5 text-red-500" />
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor={`experience.${index}.company`}>Company</Label>
                                <Input {...register(`experience.${index}.company`)} placeholder="Adventurer's Guild" />
                                {errors.experience?.[index]?.company && <p className="text-red-500 text-xs mt-1">{errors.experience?.[index]?.company?.message}</p>}
                            </div>
                            <div>
                                <Label htmlFor={`experience.${index}.position`}>Position</Label>
                                <Input {...register(`experience.${index}.position`)} placeholder="Dragon Slayer" />
                                {errors.experience?.[index]?.position && <p className="text-red-500 text-xs mt-1">{errors.experience?.[index]?.position?.message}</p>}
                            </div>
                            <div>
                                <Label htmlFor={`experience.${index}.startDate`}>Start Date</Label>
                                <Input type="month" {...register(`experience.${index}.startDate`)} />
                                {errors.experience?.[index]?.startDate && <p className="text-red-500 text-xs mt-1">{errors.experience?.[index]?.startDate?.message}</p>}
                            </div>
                            <div>
                                <Label htmlFor={`experience.${index}.endDate`}>End Date</Label>
                                <Input type="month" {...register(`experience.${index}.endDate`)} />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor={`experience.${index}.description`}>Description</Label>
                            <Textarea {...register(`experience.${index}.description`)} placeholder="Describe your quests and achievements..." />
                        </div>
                    </CardContent>
                    </Card>
                ))}
                </div>

                <Button
                type="button"
                variant="outline"
                className="w-full flex items-center gap-2 border-dashed border-gray-600 hover:border-solid hover:border-amber-400"
                onClick={() => append({ company: '', position: '', startDate: '', endDate: '', description: '' })}
                >
                <PlusCircle className="h-5 w-5" /> Add Experience (경력 추가)
                </Button>
            </>
        )}
        {errors.experience?.root && <p className="text-red-500 text-xs mt-1 text-center">{errors.experience.root.message}</p>}

        <div className="flex justify-between mt-8">
          <Button type="button" variant="outline" onClick={onBack}>Back (뒤로)</Button>
          <Button type="submit" disabled={!isValid} className="bg-blue-600 hover:bg-blue-700 text-white">Next (다음)</Button>
        </div>
      </form>
    </QuestCard>
  );
};

export default Step6Experience;
