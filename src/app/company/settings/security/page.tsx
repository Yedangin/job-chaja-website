'use client';

/**
 * 기업회원 보안 설정 페이지 / Company member security settings page
 * - 2단계 인증 (미구현 → Coming Soon UI)
 * - 최근 로그인 기록 (더미 데이터 표시)
 * - 모든 기기 로그아웃 (Coming Soon)
 * - 비밀번호 변경 링크
 * Two-factor auth (Coming Soon) | Login history | Logout all devices (Coming Soon) | Password change link
 */

import { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Smartphone,
  Monitor,
  Clock,
  MapPin,
  Lock,
  LogOut,
  ChevronRight,
  AlertCircle,
  Info,
} from 'lucide-react';

// 로그인 기록 항목 타입 / Login history entry type
interface LoginRecord {
  id: string;
  device: string;       // 기기 설명 / Device description
  deviceType: 'desktop' | 'mobile'; // 기기 유형 / Device type
  location: string;     // 접속 위치 / Location
  ip: string;           // IP 주소 / IP address
  loginAt: string;      // 로그인 시각 / Login time
  isCurrent: boolean;   // 현재 세션 여부 / Is current session
}

// 더미 로그인 기록 데이터 / Dummy login history data
const DUMMY_LOGIN_HISTORY: LoginRecord[] = [
  {
    id: '1',
    device: 'Chrome · Windows 11',
    deviceType: 'desktop',
    location: '서울, 대한민국',
    ip: '211.xxx.xxx.xxx',
    loginAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5분 전 / 5 min ago
    isCurrent: true,
  },
  {
    id: '2',
    device: 'Safari · iPhone 15',
    deviceType: 'mobile',
    location: '서울, 대한민국',
    ip: '211.xxx.xxx.xxx',
    loginAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3시간 전 / 3 hrs ago
    isCurrent: false,
  },
  {
    id: '3',
    device: 'Chrome · MacBook Pro',
    deviceType: 'desktop',
    location: '서울, 대한민국',
    ip: '182.xxx.xxx.xxx',
    loginAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2일 전 / 2 days ago
    isCurrent: false,
  },
];

// 상대 시간 표시 헬퍼 / Relative time display helper
function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 1000 / 60);
  const hours   = Math.floor(minutes / 60);
  const days    = Math.floor(hours / 24);

  if (minutes < 1)  return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24)   return `${hours}시간 전`;
  return `${days}일 전`;
}

// ── 2단계 인증 섹션 / Two-factor authentication section ──────────────────────
function TwoFactorSection() {
  // 토글 상태 (Coming Soon이라 실제 동작 없음) / Toggle state (no actual action, Coming Soon)
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      {/* 섹션 헤더 / Section header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-base font-bold text-gray-900">2단계 인증</h2>
          <p className="text-xs text-gray-400">Two-Factor Authentication</p>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <div className="flex-1 min-w-0 mr-4">
          <p className="text-sm font-semibold text-gray-800 mb-0.5">
            추가 보안 인증 활성화
          </p>
          <p className="text-xs text-gray-500">
            로그인 시 SMS 또는 인증 앱으로 2차 인증을 진행합니다.
            {/* Enable secondary auth via SMS or authenticator app on login. */}
          </p>
        </div>
        {/* Coming Soon 토글 / Coming Soon toggle */}
        <button
          type="button"
          onClick={() => setEnabled((v) => !v)}
          disabled
          title="준비 중인 기능입니다"
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-not-allowed items-center rounded-full transition-colors ${
            enabled ? 'bg-blue-500' : 'bg-gray-200'
          }`}
          aria-pressed={enabled}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
              enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Coming Soon 배너 / Coming Soon banner */}
      <div className="mt-4 flex items-start gap-2.5 p-3.5 bg-amber-50 border border-amber-100 rounded-xl">
        <Info className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
        <div>
          <p className="text-xs font-semibold text-amber-800">준비 중인 기능입니다</p>
          <p className="text-xs text-amber-700 mt-0.5">
            2단계 인증은 현재 개발 중이며 곧 제공될 예정입니다.
            {/* Two-factor authentication is under development and coming soon. */}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── 최근 로그인 기록 섹션 / Recent login history section ──────────────────────
function LoginHistorySection() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      {/* 섹션 헤더 / Section header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
          <Clock className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h2 className="text-base font-bold text-gray-900">최근 로그인 기록</h2>
          <p className="text-xs text-gray-400">Recent Login Activity</p>
        </div>
      </div>

      {/* 더미 데이터 안내 / Dummy data notice */}
      <div className="flex items-start gap-2.5 p-3.5 bg-blue-50 border border-blue-100 rounded-xl mb-4">
        <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
        <p className="text-xs text-blue-700">
          실제 로그인 기록 API 연동 전까지는 예시 데이터가 표시됩니다.
          {/* Example data shown until real login history API is integrated. */}
        </p>
      </div>

      {/* 로그인 기록 목록 / Login history list */}
      <div className="space-y-3">
        {DUMMY_LOGIN_HISTORY.map((record) => (
          <div
            key={record.id}
            className={`flex items-start gap-4 p-4 rounded-xl border ${
              record.isCurrent
                ? 'border-blue-200 bg-blue-50'
                : 'border-gray-100 bg-gray-50'
            }`}
          >
            {/* 기기 아이콘 / Device icon */}
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                record.isCurrent ? 'bg-blue-100' : 'bg-gray-200'
              }`}
            >
              {record.deviceType === 'mobile' ? (
                <Smartphone
                  className={`w-4 h-4 ${record.isCurrent ? 'text-blue-600' : 'text-gray-500'}`}
                />
              ) : (
                <Monitor
                  className={`w-4 h-4 ${record.isCurrent ? 'text-blue-600' : 'text-gray-500'}`}
                />
              )}
            </div>

            {/* 기기 정보 / Device info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {record.device}
                </p>
                {/* 현재 세션 뱃지 / Current session badge */}
                {record.isCurrent && (
                  <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-600 text-white shrink-0">
                    현재 기기
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-gray-400">
                {/* 위치 / Location */}
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {record.location}
                </span>
                {/* IP / IP */}
                <span>{record.ip}</span>
                {/* 시간 / Time */}
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {relativeTime(record.loginAt)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 추가 보안 설정 섹션 / Additional security settings section ────────────────
function AdditionalSecuritySection() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
      {/* 비밀번호 변경 링크 / Change password link */}
      <Link
        href="/company/settings/password"
        className="flex items-center gap-4 p-5 hover:bg-gray-50 transition group"
      >
        <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-50 transition">
          <Lock className="w-4 h-4 text-gray-500 group-hover:text-blue-600 transition" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800">비밀번호 변경</p>
          <p className="text-xs text-gray-400">Change Password</p>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition" />
      </Link>

      {/* 모든 기기 로그아웃 / Logout from all devices */}
      <button
        type="button"
        disabled
        title="준비 중인 기능입니다"
        className="w-full flex items-center gap-4 p-5 cursor-not-allowed opacity-60"
      >
        <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
          <LogOut className="w-4 h-4 text-gray-500" />
        </div>
        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-gray-800">모든 기기 로그아웃</p>
            {/* Coming Soon 뱃지 / Coming Soon badge */}
            <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full font-medium">
              준비 중
            </span>
          </div>
          <p className="text-xs text-gray-400">Logout from All Devices</p>
        </div>
        <AlertCircle className="w-4 h-4 text-gray-300" />
      </button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 메인 페이지 컴포넌트 / Main page component
// ══════════════════════════════════════════════════════════════════════════════
export default function CompanySecurityPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* 페이지 헤더 / Page header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">보안 설정</h1>
        <p className="text-sm text-gray-500 mt-0.5">Security Settings</p>
      </div>

      <div className="space-y-4">
        {/* 2단계 인증 / Two-factor auth */}
        <TwoFactorSection />

        {/* 최근 로그인 기록 / Login history */}
        <LoginHistorySection />

        {/* 추가 보안 설정 / Additional security */}
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">
            보안 관리 / Security Management
          </h3>
          <AdditionalSecuritySection />
        </div>
      </div>
    </div>
  );
}
