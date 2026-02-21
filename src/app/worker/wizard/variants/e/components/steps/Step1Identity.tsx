"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Upload } from 'lucide-react';
import QuestCard from '../QuestCard';
import { IStepProps } from './stepInterfaces';
import { Gender, IdentityData } from '../../../a/types';

// Zod schema for validation
// Zod를 사용한 유효성 검사 스키마
const identitySchema = z.object({
  name: z.string().min(1, 'Name is required / 이름은 필수입니다.'),
  nationality: z.string().min(1, 'Nationality is required / 국적은 필수입니다.'),
  birthdate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD format required / YYYY-MM-DD 형식이 필요합니다.'),
  gender: z.nativeEnum(Gender, { errorMap: () => ({ message: "Please select a gender / 성별을 선택해주세요."})}),
  contact: z.string().min(9, 'A valid contact number is required / 유효한 연락처가 필요합니다.'),
  address: z.string().min(1, 'Address is required / 주소는 필수입니다.'),
  photo: z.any().optional(),
});

const Step1Identity: React.FC<IStepProps> = ({ data, updateData, onNext, onBack }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<IdentityData>({
    resolver: zodResolver(identitySchema),
    defaultValues: data.identity,
    mode: 'onChange',
  });

  const photo = watch('photo');

  const onSubmit = (formData: IdentityData) => {
    updateData('identity', formData);
    onNext();
  };

  return (
    <QuestCard questName="Quest 2: Who Are You?">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col items-center gap-4">
          <Label htmlFor="photo-upload" className="cursor-pointer">
            <Avatar className="w-24 h-24 border-4 border-amber-300 shadow-md">
              <AvatarImage src={photo instanceof File ? URL.createObjectURL(photo) : photo} alt="User Avatar" />
              <AvatarFallback className="bg-gray-700">
                <User className="w-12 h-12 text-gray-400" />
              </AvatarFallback>
            </Avatar>
          </Label>
          <Input id="photo-upload" type="file" className="hidden" accept="image/*"
            onChange={(e) => e.target.files && setValue('photo', e.target.files[0], { shouldValidate: true })}
          />
          <Button type="button" variant="outline" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload Photo (사진 업로드)
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="name">Full Name (이름)</Label>
            <Input id="name" {...register('name')} placeholder="Hong Gildong" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="nationality">Nationality (국적)</Label>
            <Input id="nationality" {...register('nationality')} placeholder="Country" />
            {errors.nationality && <p className="text-red-500 text-xs mt-1">{errors.nationality.message}</p>}
          </div>
          <div>
            <Label htmlFor="birthdate">Date of Birth (생년월일)</Label>
            <Input id="birthdate" type="date" {...register('birthdate')} />
            {errors.birthdate && <p className="text-red-500 text-xs mt-1">{errors.birthdate.message}</p>}
          </div>
          <div>
            <Label>Gender (성별)</Label>
            <RadioGroup
              defaultValue={data.identity.gender || undefined}
              onValueChange={(val) => setValue('gender', val as Gender, { shouldValidate: true })}
              className="flex gap-4 pt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={Gender.MALE} id="male" />
                <Label htmlFor="male">Male (남)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={Gender.FEMALE} id="female" />
                <Label htmlFor="female">Female (여)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={Gender.OTHER} id="other" />
                <Label htmlFor="other">Other (기타)</Label>
              </div>
            </RadioGroup>
            {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>}
          </div>
          <div>
            <Label htmlFor="contact">Contact (연락처)</Label>
            <Input id="contact" {...register('contact')} placeholder="010-1234-5678" />
            {errors.contact && <p className="text-red-500 text-xs mt-1">{errors.contact.message}</p>}
          </div>
          <div>
            <Label htmlFor="address">Address (주소)</Label>
            <Input id="address" {...register('address')} placeholder="Seoul, South Korea" />
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
          </div>
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

export default Step1Identity;
