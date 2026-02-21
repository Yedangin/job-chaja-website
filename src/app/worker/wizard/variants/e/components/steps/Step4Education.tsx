"use client";

import React from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PlusCircle, Trash2, BookOpen } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import QuestCard from '../QuestCard';
import { IStepProps } from './stepInterfaces';
import { EducationEntry, DegreeType, EnrollmentStatus } from '../../../a/types';

// Zod schema for a single education entry
// Zod를 사용한 단일 학력 항목 유효성 검사 스키마
const educationEntrySchema = z.object({
  institution: z.string().min(1, "Institution name is required"),
  major: z.string().min(1, "Major is required"),
  degree: z.nativeEnum(DegreeType, { errorMap: () => ({ message: "Degree type is required" })}),
  enrollmentStatus: z.nativeEnum(EnrollmentStatus, { errorMap: () => ({ message: "Enrollment status is required" })}),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
});

// Zod schema for the education step
// Zod를 사용한 학력 단계 유효성 검사 스키마
const educationSchema = z.object({
  education: z.array(educationEntrySchema).min(1, "Please add at least one education entry."),
});

const Step4Education: React.FC<IStepProps> = ({ data, updateData, onNext, onBack }) => {
  const { register, control, handleSubmit, formState: { errors, isValid } } = useForm<{ education: EducationEntry[] }>({
    resolver: zodResolver(educationSchema),
    defaultValues: { education: data.education },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'education',
  });

  const onSubmit = (formData: { education: EducationEntry[] }) => {
    updateData('education', formData.education);
    onNext();
  };

  return (
    <QuestCard questName="Quest 5: Scrolls of Knowledge">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">What knowledge have you acquired?</h3>
          <p className="text-gray-400">List your educational background. You can add multiple entries. (학력 정보를 입력해주세요. 여러 개 추가할 수 있습니다.)</p>
        </div>

        <div className="space-y-6">
          {fields.map((field, index) => (
            <Card key={field.id} className="bg-gray-900/50 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div className="flex items-center gap-3">
                    <BookOpen className="w-6 h-6 text-amber-300"/>
                    <h4 className="font-bold text-lg text-amber-200">Education #{index + 1}</h4>
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                  <Trash2 className="h-5 w-5 text-red-500" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor={`education.${index}.institution`}>Institution</Label>
                        <Input {...register(`education.${index}.institution`)} placeholder="University of World" />
                        {errors.education?.[index]?.institution && <p className="text-red-500 text-xs mt-1">{errors.education?.[index]?.institution?.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor={`education.${index}.major`}>Major</Label>
                        <Input {...register(`education.${index}.major`)} placeholder="Global Studies" />
                        {errors.education?.[index]?.major && <p className="text-red-500 text-xs mt-1">{errors.education?.[index]?.major?.message}</p>}
                    </div>
                    <div>
                        <Label>Degree</Label>
                        <Controller
                            control={control}
                            name={`education.${index}.degree`}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger><SelectValue placeholder="Select Degree" /></SelectTrigger>
                                    <SelectContent>
                                        {Object.values(DegreeType).map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                         {errors.education?.[index]?.degree && <p className="text-red-500 text-xs mt-1">{errors.education?.[index]?.degree?.message}</p>}
                    </div>
                     <div>
                        <Label>Status</Label>
                        <Controller
                            control={control}
                            name={`education.${index}.enrollmentStatus`}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger><SelectValue placeholder="Select Status" /></SelectTrigger>
                                    <SelectContent>
                                        {Object.values(EnrollmentStatus).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.education?.[index]?.enrollmentStatus && <p className="text-red-500 text-xs mt-1">{errors.education?.[index]?.enrollmentStatus?.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor={`education.${index}.startDate`}>Start Date</Label>
                        <Input type="month" {...register(`education.${index}.startDate`)} />
                        {errors.education?.[index]?.startDate && <p className="text-red-500 text-xs mt-1">{errors.education?.[index]?.startDate?.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor={`education.${index}.endDate`}>End Date (or expected)</Label>
                        <Input type="month" {...register(`education.${index}.endDate`)} />
                    </div>
                 </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center gap-2 border-dashed border-gray-600 hover:border-solid hover:border-amber-400"
          onClick={() => append({ institution: '', major: '', degree: DegreeType.BACHELORS, enrollmentStatus: EnrollmentStatus.GRADUATED, startDate: '', endDate: '' })}
        >
          <PlusCircle className="h-5 w-5" /> Add Education (학력 추가)
        </Button>
        {errors.education?.root && <p className="text-red-500 text-xs mt-1 text-center">{errors.education.root.message}</p>}


        <div className="flex justify-between mt-8">
          <Button type="button" variant="outline" onClick={onBack}>Back (뒤로)</Button>
          <Button type="submit" disabled={!isValid} className="bg-blue-600 hover:bg-blue-700 text-white">Next (다음)</Button>
        </div>
      </form>
    </QuestCard>
  );
};

export default Step4Education;
