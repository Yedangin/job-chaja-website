"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import QuestCard from '../QuestCard';
import { IStepProps } from './stepInterfaces';
import { KoreanLanguageData, KoreanTestType } from '../../../a/types';
import { Upload, FileText } from 'lucide-react';

// Zod schema for validation
// Zod를 사용한 유효성 검사 스키마
const koreanSchema = z.object({
  testType: z.nativeEnum(KoreanTestType).nullable(),
  level: z.string().optional(),
  certificate: z.any().optional(),
});

const Step3Korean: React.FC<IStepProps> = ({ data, updateData, onNext, onBack }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<KoreanLanguageData>({
    resolver: zodResolver(koreanSchema),
    defaultValues: data.koreanLanguage,
    mode: 'onChange',
  });

  const certificate = watch('certificate');
  const testType = watch('testType');

  const onSubmit = (formData: KoreanLanguageData) => {
    updateData('koreanLanguage', formData);
    onNext();
  };

  return (
    <QuestCard questName="Quest 4: The Local Tongue">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div>
            <h3 className="text-xl font-bold text-white mb-2">
                How well do you speak the local tongue?
            </h3>
            <p className="text-gray-400">
                Provide your Korean language proficiency details.
                <br />
                (한국어 능력 정보를 입력해주세요.)
            </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Test Type (시험 종류)</Label>
            <Select
              defaultValue={data.koreanLanguage.testType || undefined}
              onValueChange={(val) => setValue('testType', val as KoreanTestType, { shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a test" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={KoreanTestType.TOPIK}>TOPIK</SelectItem>
                <SelectItem value={KoreanTestType.KIIP}>KIIP</SelectItem>
                <SelectItem value={KoreanTestType.NONE}>None (없음)</SelectItem>
              </SelectContent>
            </Select>
            {errors.testType && <p className="text-red-500 text-xs mt-1">{errors.testType.message}</p>}
          </div>
          {testType && testType !== KoreanTestType.NONE && (
            <div>
              <Label htmlFor="level">Level/Grade (급수)</Label>
              <Input id="level" {...register('level')} placeholder="e.g., 6급 or 5단계" />
              {errors.level && <p className="text-red-500 text-xs mt-1">{errors.level.message}</p>}
            </div>
          )}
        </div>

        {testType && testType !== KoreanTestType.NONE && (
            <div>
                <Label htmlFor="certificate">Certificate (증명서)</Label>
                <Card className="mt-2 bg-gray-900/50 border-gray-700 border-dashed">
                    <div className="p-6 flex flex-col items-center justify-center text-center">
                    {certificate && (certificate instanceof File || typeof certificate === 'string') ? (
                        <div className="flex flex-col items-center gap-2">
                            <FileText className="w-12 h-12 text-green-400" />
                            <p className="text-sm font-medium text-white">
                                {certificate instanceof File ? certificate.name : 'File uploaded'}
                            </p>
                            <Button type="button" size="sm" variant="destructive" onClick={() => setValue('certificate', null, { shouldValidate: true })}>
                                Remove (삭제)
                            </Button>
                        </div>
                    ) : (
                        <>
                        <label htmlFor="cert-upload" className="cursor-pointer w-full">
                            <div className="flex flex-col items-center gap-2">
                            <Upload className="w-12 h-12 text-gray-500" />
                            <p className="text-sm text-gray-400">Upload Certificate</p>
                            <p className="text-xs text-gray-500">PNG, JPG, PDF (MAX. 5MB)</p>
                            </div>
                        </label>
                        <Input id="cert-upload" type="file" className="hidden"
                            accept="image/png, image/jpeg, application/pdf"
                            onChange={(e) => e.target.files && setValue('certificate', e.target.files[0], { shouldValidate: true })}
                        />
                        </>
                    )}
                    </div>
                </Card>
                {errors.certificate && <p className="text-red-500 text-xs mt-1">{errors.certificate.message as string}</p>}
            </div>
        )}

        <div className="flex justify-between mt-8">
          <Button type="button" variant="outline" onClick={onBack}>
            Back (뒤로)
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
            Next (다음)
          </Button>
        </div>
      </form>
    </QuestCard>
  );
};

export default Step3Korean;
