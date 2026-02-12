'use client';

import { MapPin, Clock, Briefcase } from 'lucide-react';

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
}: JobCardProps) {
  return (
    <div className="dashboard-card p-4 hover:border-blue-300 transition group cursor-pointer">
      {isPremium && (
        <span className="inline-block text-[10px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded mb-2">PREMIUM</span>
      )}

      <h3 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
        {title}
      </h3>
      <p className="text-xs text-gray-500 mb-2">{company}</p>

      <div className="space-y-1 text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          <span className="line-clamp-1">{location}</span>
        </div>
        <div className="text-blue-600 font-semibold">{salary}</div>
        {workHours && (
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{workHours}</span>
          </div>
        )}
        {jobType && (
          <div className="flex items-center gap-1">
            <Briefcase className="w-3 h-3" />
            <span>{jobType}</span>
          </div>
        )}
      </div>
    </div>
  );
}
