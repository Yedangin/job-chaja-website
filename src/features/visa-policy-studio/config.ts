import {
  BookOpenCheck,
  ClipboardCheck,
  FileCheck2,
  Route,
  Scale,
  UserRoundCheck,
  type LucideIcon,
} from 'lucide-react';
import type { JourneyStageKey, ReviewStatus } from './types';

export type EditorTabKey = JourneyStageKey | 'SOURCE_VERSION';

export const STAGES: Array<{
  key: JourneyStageKey;
  number: number;
  label: string;
  shortLabel: string;
  description: string;
  icon: LucideIcon;
}> = [
  { key: 'ELIGIBILITY', number: 1, label: '판정 규칙', shortLabel: '판정', description: '입력값과 정책 요건을 비교하는 판단 보조 규칙', icon: Scale },
  { key: 'CONDITION_ROADMAP', number: 2, label: '조건충족 방법', shortLabel: '조건충족', description: '미충족 조건을 실제로 개선하기 위한 행동 계획', icon: Route },
  { key: 'EVIDENCE', number: 3, label: '증빙·서류', shortLabel: '증빙', description: '충족한 조건을 입증하고 신청에 제출할 자료', icon: FileCheck2 },
  { key: 'SELF_PROCEDURE', number: 4, label: '셀프 수속', shortLabel: '셀프 수속', description: '본인이 공식 채널에서 직접 진행하는 신청 순서', icon: ClipboardCheck },
  { key: 'EXPERT_HANDOFF', number: 5, label: '전문가 전환', shortLabel: '행정사 연결', description: '개별 해석·서면 검토·신청 대행이 필요한 전환 조건', icon: UserRoundCheck },
];

export const EDITOR_TABS: Array<{ key: EditorTabKey; label: string; icon: LucideIcon }> = [
  ...STAGES.map(({ key, label, icon }) => ({ key, label, icon })),
  { key: 'SOURCE_VERSION', label: '출처·버전', icon: BookOpenCheck },
];

export const REVIEW_LABELS: Record<ReviewStatus, string> = {
  NOT_REQUESTED: '검토 요청 전',
  PENDING: '행정사 검토 중',
  CHANGES_REQUESTED: '수정 요청',
  APPROVED: '행정사 승인',
  EXPIRED: '검토 만료',
  UNKNOWN: '전문가 검토 미연결',
};

