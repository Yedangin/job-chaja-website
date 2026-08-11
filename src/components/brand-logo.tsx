import { BriefcaseBusiness } from 'lucide-react';

interface BrandLogoProps {
  compact?: boolean;
  inverse?: boolean;
  admin?: boolean;
  className?: string;
}

export default function BrandLogo({
  compact = false,
  inverse = false,
  admin = false,
  className = '',
}: BrandLogoProps) {
  return (
    <span className={`group inline-flex items-center gap-2 ${className}`.trim()}>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0066FF] text-white shadow-sm transition-transform duration-200 motion-reduce:transition-none group-hover:-translate-y-0.5 group-hover:scale-[1.03]">
        <BriefcaseBusiness className="h-4.5 w-4.5" strokeWidth={2.25} aria-hidden="true" />
      </span>
      {!compact && (
        <span className={`text-[17px] font-extrabold ${inverse ? 'text-white' : 'text-[#191F28]'}`}>
          JobChaja
        </span>
      )}
      {admin && (
        <span className={`text-[10px] font-bold ${inverse ? 'text-slate-300' : 'text-[#6B7684]'}`}>
          ADMIN
        </span>
      )}
    </span>
  );
}
