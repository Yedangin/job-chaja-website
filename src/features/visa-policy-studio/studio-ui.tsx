import { CircleDashed, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { statusClass } from './format';

export function StatusPill({ children, status }: { children: ReactNode; status: string }) {
  return <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-bold ${statusClass(status)}`}>{children}</span>;
}

export function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-[#E5E8EB] bg-white ${className}`}>{children}</section>;
}

export function SectionHeading({
  title,
  description,
  icon: Icon,
  action,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#E5E8EB] px-4 py-4 sm:px-5">
      <div className="flex min-w-0 gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#EAF2FF] text-[#0066FF]"><Icon className="h-4 w-4" /></span>
        <div className="min-w-0">
          <h2 className="font-bold text-[#191F28]">{title}</h2>
          <p className="mt-1 text-xs leading-5 text-[#6B7684]">{description}</p>
        </div>
      </div>
      {action}
    </div>
  );
}

export function EmptyState({
  icon: Icon = CircleDashed,
  title,
  description,
}: {
  icon?: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="px-5 py-10 text-center">
      <Icon className="mx-auto h-7 w-7 text-[#B0B8C1]" />
      <p className="mt-3 text-sm font-bold text-[#333D4B]">{title}</p>
      <p className="mx-auto mt-1 max-w-lg text-xs leading-5 text-[#8B95A1]">{description}</p>
    </div>
  );
}

