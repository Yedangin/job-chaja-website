// 카테고리별 슬라이더 배너 색상 매핑 / Category-specific banner colors
import { AlertCircle, FileText, BookOpen, Home } from 'lucide-react';

export interface CategoryColorConfig {
  bg: string;
  textColor: string;
  accentBg: string;
  accentText: string;
  tag: string;
  icon: typeof AlertCircle;
}

export const CATEGORY_BANNER_COLORS: Record<string, CategoryColorConfig> = {
  POLICY_LAW: {
    bg: 'bg-gradient-to-r from-[#0052CC] to-[#0066FF]',
    textColor: 'text-white',
    accentBg: 'bg-white/20',
    accentText: 'text-white',
    tag: '정책·법령',
    icon: AlertCircle,
  },
  VISA_INFO: {
    bg: 'bg-gradient-to-r from-[#1A1A2E] to-[#16213E]',
    textColor: 'text-white',
    accentBg: 'bg-[#FE9800]/20',
    accentText: 'text-[#FE9800]',
    tag: '비자정보',
    icon: FileText,
  },
  EDUCATION: {
    bg: 'bg-gradient-to-r from-[#0D4F3C] to-[#03B26C]',
    textColor: 'text-white',
    accentBg: 'bg-white/20',
    accentText: 'text-white',
    tag: '교육',
    icon: BookOpen,
  },
  LIVING_TIPS: {
    bg: 'bg-gradient-to-r from-[#5B21B6] to-[#7C3AED]',
    textColor: 'text-white',
    accentBg: 'bg-white/20',
    accentText: 'text-white',
    tag: '생활팁',
    icon: Home,
  },
};

export const DEFAULT_CATEGORY_COLOR: CategoryColorConfig = {
  bg: 'bg-gradient-to-r from-[#6B7280] to-[#9CA3AF]',
  textColor: 'text-white',
  accentBg: 'bg-white/20',
  accentText: 'text-white',
  tag: '정보',
  icon: FileText,
};
