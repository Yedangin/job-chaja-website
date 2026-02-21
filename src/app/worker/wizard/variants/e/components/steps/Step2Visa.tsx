"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import QuestCard from '../QuestCard';
import { IStepProps } from './stepInterfaces';
import { VisaData } from '../../../a/types';
import { Upload, FileText } from 'lucide-react';

// Zod schema for validation
// Zod를 사용한 유효성 검사 스키마
const visaSchema = z.object({
  visaType: z.string().min(1, 'Visa type is required / 비자 종류는 필수입니다.'),
  arcNumber: z.string().optional(),
  expiryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD format required / YYYY-MM-DD 형식이 필요합니다.'),
  arcScan: z.any().refine(file => file instanceof File || typeof file === 'string', 'ARC scan is required. / 외국인등록증(ARC) 스캔 파일은 필수입니다.').optional(),
});

const Step2Visa: React.FC<IStepProps> = ({ data, updateData, onNext, onBack }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<VisaData>({
    resolver: zodResolver(visaSchema),
    defaultValues: data.visa,
    mode: 'onChange',
  });

  const arcScan = watch('arcScan');

  const onSubmit = (formData: VisaData) => {
    updateData('visa', formData);
    onNext();
  };
  
  const isLongTermStay = data.residency.status === 'LONG_TERM';

  if (!isLongTermStay) {
      // If not a long-term resident, this step might be skipped or different
      // 장기 체류자가 아닌 경우, 이 단계는 건너뛰거나 다를 수 있습니다.
      // For this design, we'll just move to the next step immediately.
      // 이 디자인에서는 즉시 다음 단계로 이동합니다.
      React.useEffect(() => {
        onNext();
      }, [onNext]);

      return (
        <QuestCard questName="Quest 3: Proof of Stay">
            <div className="text-center p-8">
                <h3 className="text-lg font-semibold text-amber-200">No ARC required!</h3>
                <p className="text-gray-400">You'll be redirected to the next quest shortly.</p>
                <p className="text-gray-400">(외국인등록증이 필요 없습니다! 다음 퀘스트로 곧 이동합니다.)</p>
            </div>
        </QuestCard>
      );
  }

  return (
    <QuestCard questName="Quest 3: Proof of Stay">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="visaType">Visa Type (비자 종류)</Label>
            <Input id="visaType" {...register('visaType')} placeholder="e.g., F-4, E-7" />
            {errors.visaType && <p className="text-red-500 text-xs mt-1">{errors.visaType.message}</p>}
          </div>
          <div>
            <Label htmlFor="arcNumber">ARC Number (외국인등록번호)</Label>
            <Input id="arcNumber" {...register('arcNumber')} placeholder="YYMMDD-XXXXXXX" />
            {errors.arcNumber && <p className="text-red-500 text-xs mt-1">{errors.arcNumber.message}</p>}
          </div>
          <div>
            <Label htmlFor="expiryDate">Expiry Date (만료일)</Label>
            <Input id="expiryDate" type="date" {...register('expiryDate')} />
            {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate.message}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="arcScan">ARC Scan (외국인등록증 스캔)</Label>
          <Card className="mt-2 bg-gray-900/50 border-gray-700 border-dashed">
            <div className="p-6 flex flex-col items-center justify-center text-center">
              {arcScan && (arcScan instanceof File || typeof arcScan === 'string') ? (
                <div className="flex flex-col items-center gap-2">
                  <FileText className="w-12 h-12 text-green-400" />
                  <p className="text-sm font-medium text-white">
                    {arcScan instanceof File ? arcScan.name : 'File uploaded'}
                  </p>
                  <Button type="button" size="sm" variant="destructive" onClick={() => setValue('arcScan', null, { shouldValidate: true })}>
                    Remove (삭제)
                  </Button>
                </div>
              ) : (
                <>
                  <label htmlFor="arc-scan-upload" className="cursor-pointer w-full">
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="w-12 h-12 text-gray-500" />
                      <p className="text-sm text-gray-400">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, PDF (MAX. 5MB)</p>
                    </div>
                  </label>
                  <Input id="arc-scan-upload" type="file" className="hidden"
                    accept="image/png, image/jpeg, application/pdf"
                    onChange={(e) => e.target.files && setValue('arcScan', e.target.files[0], { shouldValidate: true })}
                  />
                </>
              )}
            </div>
          </Card>
          {errors.arcScan && <p className="text-red-500 text-xs mt-1">{errors.arcScan.message as string}</p>}
          <p className="text-xs text-gray-400 mt-2">Upload for faster processing with OCR. (OCR로 더 빠른 처리를 위해 업로드하세요.)</p>
        </div>

        <div className="flex justify-between mt-8">
          <Button type="button" variant="outline" onClick={onBack}>
            Back (뒤로)
          </Button>
          <Button type="submit" disabled={!isValid} className="bg-blue-600 hover:bg-blue-700 text-white">
            Next (다음)
          </Button>
        </div>
      </form>
    </QuestCard>
  );
};

export default Step2Visa;
