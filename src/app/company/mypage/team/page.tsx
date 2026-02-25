'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, UserPlus, Shield, Clock, ArrowRight, ChevronRight } from 'lucide-react';

/**
 * API에서 내려오는 사용자 정보 타입 / User info type from API
 */
interface UserProfileResponse {
  email?: string;
  name?: string;
}

/**
 * 예정 기능 항목 타입 / Upcoming feature item type
 */
interface UpcomingFeature {
  icon: React.ElementType;
  label: string;
  labelEn: string;
  description: string;
}

/** 예정 기능 목록 / Upcoming feature list */
const UPCOMING_FEATURES: UpcomingFeature[] = [
  {
    icon: UserPlus,
    label: '팀원 초대',
    labelEn: 'Invite Team Members',
    description: '이메일로 팀원을 초대하고 함께 채용 업무를 관리하세요.',
  },
  {
    icon: Shield,
    label: '권한 관리',
    labelEn: 'Permission Management',
    description: '팀원별 접근 권한을 설정하여 안전하게 계정을 공유하세요.',
  },
  {
    icon: Clock,
    label: '접속 기록',
    labelEn: 'Access History',
    description: '팀원들의 로그인 및 주요 활동 기록을 확인하세요.',
  },
];

/**
 * 팀원/계정 관리 페이지 / Team & account management page
 * 팀 계정 기능 준비 중 플레이스홀더 / Placeholder while team account feature is in development
 */
export default function TeamPage() {
  /** 현재 로그인 계정 이메일 / Current logged-in account email */
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loadingUser, setLoadingUser] = useState(true);

  /** 마운트 시 현재 사용자 정보 로드 / Load current user info on mount */
  useEffect(() => {
    const sessionId = typeof window !== 'undefined' ? localStorage.getItem('sessionId') : null;

    fetch('/api/auth/my/profile-detail', {
      headers: sessionId ? { Authorization: `Bearer ${sessionId}` } : {},
    })
      .then((r) => r.json())
      .then((data: UserProfileResponse) => {
        setEmail(data.email ?? '');
        setName(data.name ?? '');
      })
      .catch(() => {
        /* 로드 실패 시 빈 값 유지 / Keep empty values on failure */
      })
      .finally(() => setLoadingUser(false));
  }, []);

  /** 이메일 첫 글자로 아바타 이니셜 생성 / Generate avatar initial from email */
  const avatarInitial = name
    ? name.charAt(0).toUpperCase()
    : email
    ? email.charAt(0).toUpperCase()
    : '?';

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* 페이지 헤더 / Page header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">팀원 / 계정 관리</h1>
        <p className="text-sm text-gray-500 mt-1">Team &amp; Account Management</p>
      </div>

      {/* 준비 중 안내 배너 / Coming soon info banner */}
      <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-5 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900 mb-1">팀원 계정 관리 기능 준비 중</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              여러 담당자가 하나의 기업 계정을 함께 사용할 수 있는{' '}
              <span className="font-medium text-blue-700">팀 계정 기능</span>을 준비하고 있습니다.
            </p>
          </div>
        </div>
      </div>

      {/* 현재 사용 가능: 내 계정 정보 / Currently available: my account info */}
      <div className="bg-white rounded-xl border border-gray-200 mb-6 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700">현재 사용 가능 · Available Now</h3>
          <p className="text-xs text-gray-400 mt-0.5">내 계정 정보</p>
        </div>

        <div className="px-5 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* 아바타 이니셜 / Avatar initial */}
            <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
              {loadingUser ? (
                <div className="w-5 h-5 rounded-full bg-blue-400 animate-pulse" />
              ) : (
                <span className="text-white text-sm font-bold">{avatarInitial}</span>
              )}
            </div>

            <div>
              {loadingUser ? (
                <>
                  <div className="h-3.5 w-40 bg-gray-200 rounded animate-pulse mb-1.5" />
                  <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
                </>
              ) : (
                <>
                  <p className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">
                    {email || '이메일 없음'}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">대표 계정 (어드민)</p>
                </>
              )}
            </div>
          </div>

          {/* 담당자 정보 수정 링크 / Link to manager info edit */}
          <Link
            href="/company/mypage/manager"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors shrink-0"
          >
            담당자 정보 수정
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 예정 기능 미리보기 / Upcoming features preview */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700">예정 기능 미리보기 · Coming Soon</h3>
          <p className="text-xs text-gray-400 mt-0.5">출시 예정인 팀 관리 기능들을 확인하세요.</p>
        </div>

        <div className="divide-y divide-gray-100">
          {UPCOMING_FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.label} className="px-5 py-4 flex items-start gap-4">
                {/* 기능 아이콘 / Feature icon */}
                <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-4 h-4 text-gray-400" />
                </div>

                {/* 기능 설명 / Feature description */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold text-gray-800">{feature.label}</p>
                    <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-medium rounded">
                      준비 중
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{feature.description}</p>
                </div>

                {/* 준비 중 화살표 (비활성) / Disabled arrow */}
                <ChevronRight className="w-4 h-4 text-gray-200 shrink-0 mt-2" />
              </div>
            );
          })}
        </div>

        {/* 하단 안내 / Bottom notice */}
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">
            팀 계정 기능 출시 시 이메일로 안내해 드립니다.
          </p>
        </div>
      </div>
    </div>
  );
}
