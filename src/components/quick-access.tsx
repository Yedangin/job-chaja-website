import Link from 'next/link';
import { ShieldCheck, BookOpen, CalendarDays, FileText, TrendingUp, Bookmark } from 'lucide-react';

const shortcuts = [
  {
    icon: ShieldCheck,
    label: '비자 진단',
    sub: '취업 가능 비자 확인',
    href: '/diagnosis',
    iconCls: 'text-sky-600',
    bgCls: 'bg-sky-50 border-sky-200',
  },
  {
    icon: BookOpen,
    label: '취업 가이드',
    sub: '한국 취업 완벽 가이드',
    href: 'company/guide',
    iconCls: 'text-emerald-600',
    bgCls: 'bg-emerald-50 border-emerald-200',
  },
  {
    icon: CalendarDays,
    label: '채용 박람회',
    sub: '현장 면접 사전 접수',
    href: '/events',
    iconCls: 'text-violet-600',
    bgCls: 'bg-violet-50 border-violet-200',
  },
  {
    icon: FileText,
    label: '이력서 작성',
    sub: '나만의 이력서 만들기',
    href: '/resume',
    iconCls: 'text-amber-600',
    bgCls: 'bg-amber-50 border-amber-200',
  },
  {
    icon: TrendingUp,
    label: '급여 정보',
    sub: '직종별 평균 급여',
    href: '/salary',
    iconCls: 'text-rose-500',
    bgCls: 'bg-rose-50 border-rose-200',
  },
  {
    icon: Bookmark,
    label: '추천 공고',
    sub: '내 비자 맞춤 공고',
    href: '/recommended',
    iconCls: 'text-indigo-600',
    bgCls: 'bg-indigo-50 border-indigo-200',
  },
];

export default function QuickAccess() {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
      {shortcuts.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className="flex flex-col items-center gap-2 py-3.5 px-2 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-150 group"
        >
          <div className={`w-10 h-10 rounded-xl ${item.bgCls} border flex items-center justify-center shrink-0`}>
            <item.icon size={19} className={item.iconCls} />
          </div>
          <div className="text-center min-w-0">
            <p className="text-xs font-semibold text-slate-800 group-hover:text-sky-600 transition-colors leading-tight">
              {item.label}
            </p>
            <p className="text-[10px] text-slate-400 leading-tight mt-0.5 hidden sm:block">{item.sub}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
