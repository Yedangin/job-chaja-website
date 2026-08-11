import type { ReviewStatus } from './types';

export function formatDate(value: string | null | undefined) {
  if (!value) return '미기록';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '미기록';
  return new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
}

export function formatDateTime(value: string | null | undefined) {
  if (!value) return '미기록';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '미기록';
  return new Intl.DateTimeFormat('ko-KR', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(date);
}

export function displayCount(value: number | null | undefined) {
  return typeof value === 'number' ? value.toLocaleString('ko-KR') : '—';
}

export function parseStringArray(value: string | string[] | null | undefined): string[] {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === 'string');
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

export function prettyJson(value: string | null | undefined) {
  if (!value) return '기록 없음';
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return value;
  }
}

export function reviewClass(status: ReviewStatus) {
  if (status === 'APPROVED') return 'border-emerald-200 bg-emerald-50 text-emerald-700';
  if (status === 'PENDING') return 'border-amber-200 bg-amber-50 text-amber-700';
  if (status === 'CHANGES_REQUESTED' || status === 'EXPIRED') return 'border-red-200 bg-red-50 text-red-700';
  return 'border-slate-200 bg-slate-50 text-slate-600';
}

export function statusClass(status: string) {
  if (['ACTIVE', 'CURRENT', 'PASS', 'APPLIED', 'REVIEWED'].includes(status)) return 'border-emerald-200 bg-emerald-50 text-emerald-700';
  if (['PENDING', 'DRAFT', 'RULE_DRAFTED', 'CHANGE_DETECTED'].includes(status)) return 'border-amber-200 bg-amber-50 text-amber-700';
  if (['FAIL', 'STALE', 'EXPIRED'].includes(status)) return 'border-red-200 bg-red-50 text-red-700';
  return 'border-slate-200 bg-slate-50 text-slate-600';
}

