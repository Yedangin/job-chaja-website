'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Users, Globe, Bell, Settings, Check, AlertCircle,
  Briefcase, CreditCard, ShieldCheck, Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type NotifCategory = 'ALL' | 'APPLICANT' | 'VISA' | 'SYSTEM';

/** 알림 데이터 / Notification data */
interface Notification {
  id: number;
  category: 'APPLICANT' | 'VISA' | 'SYSTEM';
  title: string;
  body: string;
  href: string;
  isRead: boolean;
  createdAt: string;
}

// 샘플 알림 / Sample notifications
const SAMPLE_NOTIFICATIONS: Notification[] = [
  { id: 1, category: 'APPLICANT', title: '새 지원자', body: '백엔드 개발자 공고에 새 지원자 1명이 지원했습니다.', href: '/company/jobs/1/applicants', isRead: false, createdAt: '2026-02-14T10:30:00Z' },
  { id: 2, category: 'APPLICANT', title: '면접 수락', body: 'Nguyen Van A님이 면접 제의를 수락했습니다.', href: '/company/jobs/1/applicants', isRead: false, createdAt: '2026-02-14T09:15:00Z' },
  { id: 3, category: 'SYSTEM', title: '공고 마감 임박', body: '제조업 생산직 공고가 D-1 남았습니다.', href: '/company/jobs', isRead: false, createdAt: '2026-02-13T18:00:00Z' },
  { id: 4, category: 'VISA', title: '비자 행정대행 업데이트', body: 'E-7 비자 신청서가 접수되었습니다.', href: '/company/visa-guide', isRead: true, createdAt: '2026-02-13T14:20:00Z' },
  { id: 5, category: 'SYSTEM', title: '열람권 소진 임박', body: '잔여 열람권이 2건 남았습니다.', href: '/company/payments/credits', isRead: true, createdAt: '2026-02-12T11:00:00Z' },
  { id: 6, category: 'SYSTEM', title: '기업인증 승인', body: '기업인증이 승인되었습니다. 모든 서비스를 이용할 수 있습니다.', href: '/company/verification', isRead: true, createdAt: '2026-02-11T16:45:00Z' },
  { id: 7, category: 'APPLICANT', title: '새 지원자', body: '음식서비스직 공고에 새 지원자 3명이 지원했습니다.', href: '/company/jobs/2/applicants', isRead: true, createdAt: '2026-02-10T08:30:00Z' },
];

const CATEGORY_TABS: { key: NotifCategory; label: string }[] = [
  { key: 'ALL', label: '전체' },
  { key: 'APPLICANT', label: '지원자' },
  { key: 'VISA', label: '비자' },
  { key: 'SYSTEM', label: '시스템' },
];

const CATEGORY_ICONS: Record<string, typeof Bell> = {
  APPLICANT: Users,
  VISA: Globe,
  SYSTEM: Settings,
};

const CATEGORY_COLORS: Record<string, string> = {
  APPLICANT: 'blue',
  VISA: 'purple',
  SYSTEM: 'gray',
};

/**
 * 기업 알림 페이지 / Company notifications page
 * 카테고리 탭, 읽음/안읽음, 전체 읽음 처리
 */
export default function CompanyNotificationsPage() {
  const [activeTab, setActiveTab] = useState<NotifCategory>('ALL');
  const [notifications, setNotifications] = useState<Notification[]>(SAMPLE_NOTIFICATIONS);

  const filtered = activeTab === 'ALL' ? notifications : notifications.filter(n => n.category === activeTab);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const markRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const formatTime = (dateStr: string): string => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}분 전`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}시간 전`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}일 전`;
    return new Date(dateStr).toLocaleDateString('ko-KR');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* 헤더 / Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-gray-900">알림</h1>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">{unreadCount}</span>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="text-sm text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> 전체 읽음
          </button>
        )}
      </div>

      {/* 카테고리 탭 / Category tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-200">
        {CATEGORY_TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition ${
              activeTab === tab.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}>
            {tab.label}
            {tab.key !== 'ALL' && (
              <span className="ml-1 text-xs">
                ({notifications.filter(n => tab.key === 'ALL' ? true : n.category === tab.key).filter(n => !n.isRead).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 알림 목록 / Notification list */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">알림이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(notif => {
            const Icon = CATEGORY_ICONS[notif.category] || Bell;
            const color = CATEGORY_COLORS[notif.category] || 'gray';
            return (
              <Link
                key={notif.id}
                href={notif.href}
                onClick={() => markRead(notif.id)}
                className={`block bg-white rounded-xl border p-4 hover:shadow-sm transition ${
                  notif.isRead ? 'border-gray-200' : 'border-blue-200 bg-blue-50/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 bg-${color}-100`}>
                    <Icon className={`w-4 h-4 text-${color}-600`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className={`text-sm font-medium ${notif.isRead ? 'text-gray-700' : 'text-gray-900 font-bold'}`}>{notif.title}</h3>
                      {!notif.isRead && <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0" />}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{notif.body}</p>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0 whitespace-nowrap">
                    <Clock className="w-3 h-3 inline mr-0.5" />{formatTime(notif.createdAt)}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
