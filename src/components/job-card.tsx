
'use client';

import { MapPin, Briefcase, DollarSign, Clock, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface JobCardProps {
  title: string;
  company: string;
  location: string;
  salary: string;
  workHours?: string;
  jobType?: string;
  isPremium?: boolean;
  isFeatured?: boolean;
  imageUrl?: string;
}

export default function JobCard({
  title,
  company,
  location,
  salary,
  workHours,
  jobType,
  isPremium = false,
  isFeatured = false,
  imageUrl,
}: JobCardProps) {
  return (
    <Card className="border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
      {imageUrl && (
        <div className="relative h-32 bg-gradient-to-br from-slate-200 to-slate-300 overflow-hidden">
          <Image 
            src={imageUrl} 
            alt={title} 
            fill
            className="object-cover group-hover:scale-105 transition-transform"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1">
            {isPremium && (
              <span className="inline-block bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-md mb-2">
                ⭐ Premium
              </span>
            )}
            <h3 className="font-bold text-slate-900 line-clamp-2 text-sm">{title}</h3>
          </div>
          <Star size={16} className="text-gray-300 flex-shrink-0 mt-1" />
        </div>

        <p className="text-xs text-slate-500 font-medium mb-4">{company}</p>

        <div className="space-y-2 mb-5">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <MapPin size={14} className="flex-shrink-0" />
            <span className="line-clamp-1">{location}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <DollarSign size={14} className="flex-shrink-0" />
            <span className="font-medium">{salary}</span>
          </div>
          {workHours && (
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Clock size={14} className="flex-shrink-0" />
              <span className="line-clamp-1">{workHours}</span>
            </div>
          )}
          {jobType && (
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Briefcase size={14} className="flex-shrink-0" />
              <span>{jobType}</span>
            </div>
          )}
        </div>

        <Button className="w-full bg-[#0ea5e9] text-white text-xs font-bold hover:bg-[#0284c7] py-2 rounded-lg">
          지원하기
        </Button>
      </div>
    </Card>
  );
}
