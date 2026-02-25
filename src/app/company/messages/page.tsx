'use client';

import Link from 'next/link';
import { Search, MessageSquare, Users, ArrowRight } from 'lucide-react';

/**
 * 연락내역 페이지 - 채팅 기능 준비 중 / Messages page - chat feature coming soon
 * 실제 채팅 UI 레이아웃을 모사한 스켈레톤 + 준비 중 안내 패널
 * Mockup skeleton of real chat UI with a "coming soon" notice panel
 */

/** 더미 대화 항목 타입 / Dummy conversation item type */
interface DummyConversation {
  id: number;
  name: string;
  preview: string;
  time: string;
  unread?: number;
}

/** 좌측 패널에 표시할 더미 대화 목록 / Dummy conversations for left panel */
const DUMMY_CONVERSATIONS: DummyConversation[] = [
  { id: 1, name: '홍길동', preview: '면접 일정 확인 부탁드립니다.', time: '2시간 전', unread: 2 },
  { id: 2, name: '김철수', preview: '지원서 검토 감사합니다!', time: '어제' },
  { id: 3, name: '이영희', preview: '근무 조건에 대해 여쭤보고 싶습니다.', time: '2일 전' },
  { id: 4, name: '박민준', preview: '비자 관련 서류를 준비했습니다.', time: '3일 전' },
];

/**
 * 단일 스켈레톤 대화 항목 / Single skeleton conversation item
 */
function ConversationSkeleton({ conv }: { conv: DummyConversation }) {
  return (
    <div className="flex items-start gap-3 px-4 py-3 border-b border-gray-100 animate-pulse cursor-not-allowed">
      {/* 아바타 스켈레톤 / Avatar skeleton */}
      <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          {/* 이름 / Name */}
          <div className="h-3.5 w-16 bg-gray-200 rounded" />
          {/* 시간 / Time */}
          <div className="h-3 w-10 bg-gray-100 rounded" />
        </div>
        {/* 미리보기 / Preview */}
        <div className="h-3 w-full bg-gray-100 rounded" />
      </div>
    </div>
  );
}

/**
 * 연락내역 메인 페이지 / Messages main page
 */
export default function MessagesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* 페이지 헤더 / Page header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">연락내역</h1>
        <p className="text-sm text-gray-500 mt-1">Messages</p>
      </div>

      {/* 2열 레이아웃: 대화 목록 + 상세 패널 / 2-column layout: list + detail panel */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex h-[600px]">

        {/* ── 왼쪽: 대화 목록 (데스크탑에서만 표시) / Left: conversation list (desktop only) ── */}
        <div className="hidden md:flex flex-col w-72 border-r border-gray-200 shrink-0">
          {/* 검색창 / Search box */}
          <div className="p-3 border-b border-gray-100">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 animate-pulse">
              <Search className="w-4 h-4 text-gray-300 shrink-0" />
              <span className="text-sm text-gray-300 select-none">대화 검색...</span>
            </div>
          </div>

          {/* 스켈레톤 대화 목록 / Skeleton conversation list */}
          <div className="flex-1 overflow-y-auto">
            {DUMMY_CONVERSATIONS.map((conv) => (
              <ConversationSkeleton key={conv.id} conv={conv} />
            ))}
          </div>
        </div>

        {/* ── 오른쪽: 준비 중 안내 패널 / Right: coming soon panel ── */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 bg-gray-50 text-center">
          {/* 아이콘 / Icon */}
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-5 shadow-sm">
            <MessageSquare className="w-10 h-10 text-blue-400" />
          </div>

          {/* 제목 / Title */}
          <h2 className="text-lg font-bold text-gray-800 mb-1">채팅 기능 준비 중</h2>
          <p className="text-sm font-medium text-blue-500 mb-5">Chat Feature Coming Soon</p>

          {/* 설명 / Description */}
          <div className="max-w-xs space-y-2 mb-8">
            <p className="text-sm text-gray-600 leading-relaxed">
              지원자와의 직접 메시지 기능을 준비하고 있습니다.
            </p>
            <p className="text-sm text-gray-400 leading-relaxed">
              현재는 지원서를 통해 소통하실 수 있습니다.
            </p>
          </div>

          {/* 구분선 / Divider */}
          <div className="w-full max-w-xs border-t border-gray-200 mb-6" />

          {/* 예정 기능 태그 / Upcoming feature tags */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {['실시간 채팅', '파일 전송', '알림', '번역 지원'].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full border border-blue-100"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* CTA 버튼 / CTA button */}
          <Link
            href="/company/applicants"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors"
          >
            <Users className="w-4 h-4" />
            지원자 관리로 이동
            <ArrowRight className="w-4 h-4" />
          </Link>

          {/* 보조 텍스트 / Sub text */}
          <p className="text-xs text-gray-400 mt-4">
            채팅 기능 출시 시 이메일로 안내해 드립니다.
          </p>
        </div>
      </div>
    </div>
  );
}
