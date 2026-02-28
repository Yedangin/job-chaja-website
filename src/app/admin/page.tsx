'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  Settings,
  LogOut,
  UserCheck,
  Building2,
  Globe,
  Mail,
  Activity,
  ChevronRight,
  TrendingUp,
  ClipboardList,
  MessageSquare,
  ArrowUpDown,
  ChevronLeft,
  ChevronDown,
  Loader2,
  Search,
  Send,
  X,
  Scale,
  RefreshCw,
  Play,
  Eye,
  Plus,
  Trash2,
  Edit3,
  Check,
  AlertTriangle,
  Shield,
  FileCheck,
  Code,
  Zap,
  Ban,
  ShoppingCart,
  DollarSign,
  Pause,
  RotateCcw,
  ExternalLink,
  Filter,
  ArrowUp,
  ArrowDown,
  Clock,
  AlertCircle,
  MapPin,
  Calendar,
  Star,
  History,
  Crown,
  MinusCircle,
} from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  individualUsers: number;
  corporateUsers: number;
  adminUsers: number;
  socialUsers: number;
  emailUsers: number;
  dailyActiveUsers: number;
  totalProfiles: number;
  totalJobPostings: number;
  activeJobPostings: number;
  partTimePostings: number;
  fullTimePostings: number;
  // 추가 통계 / Enhanced stats
  todayMatchings: number;
  pendingVisaVerifications: number;
  verifiedVisaVerifications: number;
  pendingCorporateVerifications: number;
  visaDistribution: Array<{ visaCode: string; count: number }>;
  dailyTrends: Array<{ date: string; newUsers: number; matchings: number; newJobs: number }>;
}

interface ActivityLogItem {
  id: string;
  userId: string | null;
  userEmail: string | null;
  userName: string | null;
  userGender: string | null;
  actionType: string;
  description: string | null;
  metadata: string | null;
  ipAddress: string | null;
  createdAt: string;
}

interface LogsMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface SupportTicketItem {
  id: string;
  userId: string;
  userEmail: string;
  userType: string;
  title: string;
  content: string;
  status: string;
  answer: string | null;
  answeredAt: string | null;
  createdAt: string;
}

const sidebarGroups = [
  {
    label: '홈',
    items: [
      { id: 'dashboard', label: '대시보드', icon: LayoutDashboard },
    ],
  },
  {
    label: '운영 관리',
    items: [
      { id: 'jobs', label: '공고 관리', icon: Briefcase },
      { id: 'sales', label: '판매 관리', icon: ShoppingCart },
      { id: 'users', label: '회원 관리', icon: Users },
    ],
  },
  {
    label: '모니터링',
    items: [
      { id: 'logs', label: '활동 로그', icon: Activity },
      { id: 'system-logs', label: '시스템 로그', icon: Code },
      { id: 'reports', label: '통계/리포트', icon: TrendingUp },
    ],
  },
  {
    label: '지원',
    items: [
      { id: 'support', label: '고객센터', icon: MessageSquare },
      { id: 'policy', label: '정책/규정 관리', icon: Scale },
      { id: 'law-amendments', label: '법령 변경 관리', icon: FileCheck },
    ],
  },
];

const sidebarBottomMenu = { id: 'settings', label: '시스템 설정', icon: Settings };

// flat list for label lookup
const sidebarMenus = sidebarGroups.flatMap(g => g.items).concat(sidebarBottomMenu);

const ACTION_TYPE_OPTIONS = [
  { value: '', label: '전체' },
  { value: 'LOGIN', label: '로그인' },
  { value: 'LOGOUT', label: '로그아웃' },
  { value: 'REGISTER', label: '회원가입' },
  { value: 'SOCIAL_LOGIN', label: '소셜 로그인' },
  { value: 'PASSWORD_CHANGE', label: '비밀번호 변경' },
  { value: 'NOTIFICATION_UPDATE', label: '알림 설정' },
  { value: 'ACCOUNT_DELETE', label: '회원탈퇴' },
  { value: 'SUPPORT_TICKET', label: '고객센터 문의' },
  { value: 'CORPORATE_DOC_UPLOAD', label: '기업 서류 업로드' },
  { value: 'CORPORATE_VERIFY_SUBMIT', label: '기업 인증 신청' },
  { value: 'CORPORATE_VERIFY_APPROVE', label: '기업 인증 승인' },
  { value: 'CORPORATE_VERIFY_REJECT', label: '기업 인증 거절' },
];

export default function AdminPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [activeMenu, setActiveMenu] = useState('dashboard');

  // Activity Logs state
  const [logs, setLogs] = useState<ActivityLogItem[]>([]);
  const [logsMeta, setLogsMeta] = useState<LogsMeta>({ total: 0, page: 1, limit: 20, totalPages: 0 });
  const [logsLoading, setLogsLoading] = useState(false);
  const [logFilters, setLogFilters] = useState({ actionType: '', userName: '', page: 1, limit: 20, sortField: 'createdAt', sortOrder: 'desc' as 'asc' | 'desc' });

  // Support Tickets state
  const [tickets, setTickets] = useState<SupportTicketItem[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicketItem | null>(null);
  const [answerText, setAnswerText] = useState('');
  const [answerLoading, setAnswerLoading] = useState(false);

  // Policy management state
  const [policyTab, setPolicyTab] = useState('changes');

  const sessionId = typeof window !== 'undefined' ? localStorage.getItem('sessionId') : null;

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    return fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionId}`,
        ...(options.headers || {}),
      },
    });
  };

  useEffect(() => {
    const checkAuthAndLoadStats = async () => {
      try {
        if (!sessionId) { router.push('/login'); return; }

        const profileRes = await fetchWithAuth('/api/auth/profile');
        if (!profileRes.ok) { localStorage.removeItem('sessionId'); router.push('/login'); return; }

        const profileData = await profileRes.json();
        if (profileData.user?.role !== 5) { router.push('/'); return; }

        setIsAuthorized(true);

        const statsRes = await fetchWithAuth('/api/auth/admin/stats');
        if (statsRes.ok) setStats(await statsRes.json());
      } catch {
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };
    checkAuthAndLoadStats();
  }, [router]);

  // Load logs when switching to logs tab or changing filters
  useEffect(() => {
    if (activeMenu === 'logs' && isAuthorized) loadLogs();
  }, [activeMenu, logFilters, isAuthorized]);

  // Load tickets when switching to support tab
  useEffect(() => {
    if (activeMenu === 'support' && isAuthorized) loadTickets();
  }, [activeMenu, isAuthorized]);

  const loadLogs = async () => {
    setLogsLoading(true);
    try {
      const params = new URLSearchParams();
      if (logFilters.actionType) params.set('actionType', logFilters.actionType);
      if (logFilters.userName) params.set('userName', logFilters.userName);
      params.set('page', String(logFilters.page));
      params.set('limit', String(logFilters.limit));
      params.set('sortField', logFilters.sortField);
      params.set('sortOrder', logFilters.sortOrder);

      const res = await fetchWithAuth(`/api/auth/admin/activity-logs?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.data || []);
        setLogsMeta(data.meta || { total: 0, page: 1, limit: 20, totalPages: 0 });
      }
    } catch { }
    finally { setLogsLoading(false); }
  };

  const loadTickets = async () => {
    setTicketsLoading(true);
    try {
      const res = await fetchWithAuth('/api/auth/admin/support-tickets');
      if (res.ok) setTickets(await res.json());
    } catch { }
    finally { setTicketsLoading(false); }
  };

  const handleAnswerTicket = async () => {
    if (!selectedTicket || !answerText.trim()) return;
    setAnswerLoading(true);
    try {
      const res = await fetchWithAuth(`/api/auth/admin/support-tickets/${selectedTicket.id}`, {
        method: 'PUT',
        body: JSON.stringify({ answer: answerText }),
      });
      if (res.ok) {
        setAnswerText('');
        setSelectedTicket(null);
        loadTickets();
      }
    } catch { }
    finally { setAnswerLoading(false); }
  };

  const toggleSort = (field: string) => {
    setLogFilters(prev => ({
      ...prev,
      sortField: field,
      sortOrder: prev.sortField === field && prev.sortOrder === 'asc' ? 'desc' : 'asc',
      page: 1,
    }));
  };

  const handleLogout = async () => {
    try {
      if (sessionId) await fetchWithAuth('/api/auth/logout', { method: 'POST' });
    } catch { }
    localStorage.removeItem('sessionId');
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-sky-500 border-t-transparent mx-auto"></div>
          <p className="mt-3 text-sm text-gray-500">권한 확인 중...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) return null;

  const getMenuLabel = () => sidebarMenus.find(m => m.id === activeMenu)?.label || '대시보드';

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-gray-200 flex flex-col fixed h-full">
        <div className="h-16 flex items-center px-5 border-b border-gray-100">
          <span className="text-lg font-bold text-gray-900">JobChaja</span>
          <span className="ml-2 text-[10px] font-semibold text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded">ADMIN</span>
        </div>

        <nav className="flex-1 py-3 px-3 overflow-y-auto">
          {sidebarGroups.map((group, gi) => (
            <div key={group.label} className={gi > 0 ? 'mt-5' : ''}>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-1.5">{group.label}</p>
              <ul className="space-y-0.5">
                {group.items.map((menu) => {
                  const Icon = menu.icon;
                  const isActive = activeMenu === menu.id;
                  return (
                    <li key={menu.id}>
                      <button
                        onClick={() => { setActiveMenu(menu.id); setSelectedTicket(null); }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-sky-50 text-sky-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                      >
                        <Icon size={18} className={isActive ? 'text-sky-600' : 'text-gray-400'} />
                        <span>{menu.label}</span>
                        {isActive && <ChevronRight size={14} className="ml-auto text-sky-400" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-100 space-y-1">
          {(() => {
            const Icon = sidebarBottomMenu.icon;
            const isActive = activeMenu === sidebarBottomMenu.id;
            return (
              <button
                onClick={() => { setActiveMenu(sidebarBottomMenu.id); setSelectedTicket(null); }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-sky-50 text-sky-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                <Icon size={18} className={isActive ? 'text-sky-600' : 'text-gray-400'} />
                <span>{sidebarBottomMenu.label}</span>
                {isActive && <ChevronRight size={14} className="ml-auto text-sky-400" />}
              </button>
            );
          })()}
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors">
            <LogOut size={18} /><span>로그아웃</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-60">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-lg font-bold text-gray-900">{getMenuLabel()}</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">관리자</span>
            <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center">
              <UserCheck size={16} className="text-sky-600" />
            </div>
          </div>
        </header>

        <div className="p-8">
          {activeMenu === 'dashboard' && <DashboardContent stats={stats} />}
          {activeMenu === 'logs' && (
            <ActivityLogsContent
              logs={logs}
              meta={logsMeta}
              loading={logsLoading}
              filters={logFilters}
              onFilterChange={(f) => setLogFilters(prev => ({ ...prev, ...f, page: 1 }))}
              onPageChange={(page) => setLogFilters(prev => ({ ...prev, page }))}
              onSort={toggleSort}
            />
          )}
          {activeMenu === 'support' && (
            <SupportContent
              tickets={tickets}
              loading={ticketsLoading}
              selectedTicket={selectedTicket}
              onSelectTicket={setSelectedTicket}
              answerText={answerText}
              onAnswerTextChange={setAnswerText}
              onSubmitAnswer={handleAnswerTicket}
              answerLoading={answerLoading}
            />
          )}
          {activeMenu === 'policy' && (
            <PolicyManagementContent
              activeTab={policyTab}
              onTabChange={setPolicyTab}
              fetchWithAuth={fetchWithAuth}
            />
          )}
          {activeMenu === 'users' && <AdminUsersContent fetchWithAuth={fetchWithAuth} />}
          {activeMenu === 'jobs' && <AdminJobsContent fetchWithAuth={fetchWithAuth} />}
          {activeMenu === 'sales' && <AdminSalesContent fetchWithAuth={fetchWithAuth} />}
          {activeMenu === 'system-logs' && <SystemLogsContent fetchWithAuth={fetchWithAuth} />}
          {activeMenu === 'law-amendments' && <LawAmendmentContent fetchWithAuth={fetchWithAuth} />}
          {activeMenu === 'reports' && <PlaceholderContent title="통계/리포트" desc="통계 리포트 기능이 준비중입니다." />}
          {activeMenu === 'settings' && <PlaceholderContent title="시스템 설정" desc="시스템 설정 기능이 준비중입니다." />}
        </div>
      </main>
    </div>
  );
}

// --- Dashboard ---

function DashboardContent({ stats }: { stats: AdminStats | null }) {
  // 7일 추이 최대값 (차트 비율 계산용) / Max value for 7-day trend bar chart
  const trendMax = Math.max(
    ...(stats?.dailyTrends?.flatMap((d) => [d.newUsers, d.matchings, d.newJobs]) || [1]),
    1,
  );

  return (
    <>
      {/* 핵심 지표 / Key metrics */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">핵심 지표</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={<Users size={20} />} iconBg="bg-sky-100" iconColor="text-sky-600" label="전체 회원수" value={stats?.totalUsers ?? 0} />
          <StatCard icon={<Activity size={20} />} iconBg="bg-green-100" iconColor="text-green-600" label="일일 접속자수" value={stats?.dailyActiveUsers ?? 0} />
          <StatCard icon={<Zap size={20} />} iconBg="bg-amber-100" iconColor="text-amber-600" label="오늘 매칭수" value={stats?.todayMatchings ?? 0} />
          <StatCard icon={<Briefcase size={20} />} iconBg="bg-violet-100" iconColor="text-violet-600" label="게시중 공고" value={stats?.activeJobPostings ?? 0} />
        </div>
      </div>

      {/* 조치 필요 / Action needed */}
      {((stats?.pendingVisaVerifications ?? 0) > 0 || (stats?.pendingCorporateVerifications ?? 0) > 0) && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">조치 필요</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(stats?.pendingVisaVerifications ?? 0) > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Shield size={20} className="text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-orange-700">비자인증 심사대기</p>
                  <p className="text-2xl font-bold text-orange-800">{stats?.pendingVisaVerifications}건</p>
                </div>
              </div>
            )}
            {(stats?.pendingCorporateVerifications ?? 0) > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <FileCheck size={20} className="text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-yellow-700">기업인증 심사대기</p>
                  <p className="text-2xl font-bold text-yellow-800">{stats?.pendingCorporateVerifications}건</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 사용자 분석 / User stats */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">사용자 분석</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <StatCard icon={<UserCheck size={20} />} iconBg="bg-teal-100" iconColor="text-teal-600" label="개인 회원수" value={stats?.individualUsers ?? 0} />
          <StatCard icon={<Building2 size={20} />} iconBg="bg-indigo-100" iconColor="text-indigo-600" label="기업 회원수" value={stats?.corporateUsers ?? 0} />
          <StatCard icon={<Globe size={20} />} iconBg="bg-violet-100" iconColor="text-violet-600" label="소셜 회원수" value={stats?.socialUsers ?? 0} />
          <StatCard icon={<Mail size={20} />} iconBg="bg-amber-100" iconColor="text-amber-600" label="이메일 회원수" value={stats?.emailUsers ?? 0} />
        </div>
      </div>

      {/* 공고/프로필 + 비자인증 / Jobs & visa stats */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">공고 · 비자인증 현황</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <StatCard icon={<Briefcase size={20} />} iconBg="bg-sky-100" iconColor="text-sky-600" label="총 공고수" value={stats?.totalJobPostings ?? 0} />
          <StatCard icon={<FileText size={20} />} iconBg="bg-teal-100" iconColor="text-teal-600" label="총 프로필수" value={stats?.totalProfiles ?? 0} />
          <StatCard icon={<Shield size={20} />} iconBg="bg-green-100" iconColor="text-green-600" label="비자인증 완료" value={stats?.verifiedVisaVerifications ?? 0} />
          <StatCard icon={<ClipboardList size={20} />} iconBg="bg-gray-100" iconColor="text-gray-600" label="파트타임 공고" value={stats?.partTimePostings ?? 0} />
        </div>
      </div>

      {/* 7일 추이 / 7-day trends */}
      {stats?.dailyTrends && stats.dailyTrends.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">7일 추이</h2>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-6 mb-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-sky-500 inline-block" /> 신규회원</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-500 inline-block" /> 매칭</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-green-500 inline-block" /> 신규공고</span>
            </div>
            <div className="space-y-3">
              {stats.dailyTrends.map((d) => (
                <div key={d.date} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-12 shrink-0">
                    {d.date.slice(5)}
                  </span>
                  <div className="flex-1 flex gap-1">
                    <div className="h-5 bg-sky-500 rounded-r" style={{ width: `${Math.max((d.newUsers / trendMax) * 100, 2)}%` }} title={`신규회원 ${d.newUsers}`}>
                      {d.newUsers > 0 && <span className="text-[10px] text-white px-1 leading-5">{d.newUsers}</span>}
                    </div>
                    <div className="h-5 bg-amber-500 rounded-r" style={{ width: `${Math.max((d.matchings / trendMax) * 100, 2)}%` }} title={`매칭 ${d.matchings}`}>
                      {d.matchings > 0 && <span className="text-[10px] text-white px-1 leading-5">{d.matchings}</span>}
                    </div>
                    <div className="h-5 bg-green-500 rounded-r" style={{ width: `${Math.max((d.newJobs / trendMax) * 100, 2)}%` }} title={`신규공고 ${d.newJobs}`}>
                      {d.newJobs > 0 && <span className="text-[10px] text-white px-1 leading-5">{d.newJobs}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 비자별 분포 / Visa distribution */}
      {stats?.visaDistribution && stats.visaDistribution.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">비자별 분포</h2>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex flex-wrap gap-3">
              {stats.visaDistribution
                .sort((a, b) => b.count - a.count)
                .map((v) => (
                  <div key={v.visaCode} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
                    <span className="text-sm font-bold text-gray-900">{v.visaCode}</span>
                    <span className="text-xs text-gray-500">{v.count}명</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// --- Activity Logs ---

function ActivityLogsContent({
  logs, meta, loading, filters, onFilterChange, onPageChange, onSort,
}: {
  logs: ActivityLogItem[];
  meta: LogsMeta;
  loading: boolean;
  filters: { actionType: string; userName: string; sortField: string; sortOrder: 'asc' | 'desc'; limit: number };
  onFilterChange: (f: Partial<typeof filters>) => void;
  onPageChange: (page: number) => void;
  onSort: (field: string) => void;
}) {
  const [searchInput, setSearchInput] = useState(filters.userName);

  const SortHeader = ({ field, label }: { field: string; label: string }) => (
    <th
      className="px-4 py-3 cursor-pointer hover:bg-gray-100 select-none transition-colors"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1">
        <span>{label}</span>
        <ArrowUpDown size={12} className={filters.sortField === field ? 'text-sky-600' : 'text-gray-300'} />
        {filters.sortField === field && (
          <span className="text-[10px] text-sky-600">{filters.sortOrder === 'asc' ? '↑' : '↓'}</span>
        )}
      </div>
    </th>
  );

  return (
    <div>
      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-600">기능:</label>
          <select
            value={filters.actionType}
            onChange={(e) => onFilterChange({ actionType: e.target.value })}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            {ACTION_TYPE_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-600">사용자명:</label>
          <div className="relative">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') onFilterChange({ userName: searchInput }); }}
              placeholder="이름 검색"
              className="pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 w-40"
            />
            <button onClick={() => onFilterChange({ userName: searchInput })} className="absolute right-2 top-1/2 -translate-y-1/2">
              <Search size={14} className="text-gray-400 hover:text-sky-600" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-600">표시:</label>
          <select
            value={filters.limit}
            onChange={(e) => onFilterChange({ limit: Number(e.target.value) })}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value={10}>10건</option>
            <option value={20}>20건</option>
            <option value={50}>50건</option>
          </select>
        </div>

        <div className="ml-auto text-sm text-gray-500">
          총 <span className="font-bold text-gray-900">{meta.total}</span>건
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-gray-300" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b border-gray-200">
                <tr>
                  <SortHeader field="createdAt" label="시간" />
                  <SortHeader field="userName" label="사용자명" />
                  <SortHeader field="userEmail" label="이메일" />
                  <SortHeader field="userGender" label="성별" />
                  <SortHeader field="actionType" label="기능" />
                  <th className="px-4 py-3">설명</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.length > 0 ? logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString('ko-KR', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{log.userName || '-'}</td>
                    <td className="px-4 py-3 text-gray-600">{log.userEmail || '-'}</td>
                    <td className="px-4 py-3 text-gray-600">{log.userGender || '-'}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-sky-50 text-sky-700 text-xs font-bold rounded">
                        {ACTION_TYPE_OPTIONS.find(o => o.value === log.actionType)?.label || log.actionType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{log.description || '-'}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-16 text-center text-gray-400">
                      <Activity className="w-8 h-8 mx-auto mb-2 text-gray-200" />
                      <p className="text-sm">활동 로그가 없습니다.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => onPageChange(meta.page - 1)}
              disabled={meta.page <= 1}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-white rounded-lg border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={14} /> 이전
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(meta.totalPages, 10) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${meta.page === page ? 'bg-sky-500 text-white' : 'text-gray-600 hover:bg-white'}`}
                  >
                    {page}
                  </button>
                );
              })}
              {meta.totalPages > 10 && <span className="text-gray-400">...</span>}
            </div>
            <button
              onClick={() => onPageChange(meta.page + 1)}
              disabled={meta.page >= meta.totalPages}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-white rounded-lg border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              다음 <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Support Center ---

function SupportContent({
  tickets, loading, selectedTicket, onSelectTicket, answerText, onAnswerTextChange, onSubmitAnswer, answerLoading,
}: {
  tickets: SupportTicketItem[];
  loading: boolean;
  selectedTicket: SupportTicketItem | null;
  onSelectTicket: (t: SupportTicketItem | null) => void;
  answerText: string;
  onAnswerTextChange: (t: string) => void;
  onSubmitAnswer: () => void;
  answerLoading: boolean;
}) {
  const StatusBadge = ({ status }: { status: string }) => {
    const config: Record<string, { label: string; style: string }> = {
      OPEN: { label: '답변대기', style: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
      ANSWERED: { label: '답변완료', style: 'bg-green-50 text-green-700 border-green-200' },
      CLOSED: { label: '종료', style: 'bg-gray-50 text-gray-500 border-gray-200' },
    };
    const { label, style } = config[status] || { label: status, style: 'bg-gray-50 text-gray-500 border-gray-200' };
    return <span className={`px-2 py-1 text-[11px] font-bold rounded border ${style}`}>{label}</span>;
  };

  if (loading) {
    return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-gray-300" /></div>;
  }

  // Detail view
  if (selectedTicket) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center gap-3">
          <button onClick={() => onSelectTicket(null)} className="p-1 hover:bg-gray-100 rounded-lg">
            <ChevronLeft size={20} className="text-gray-500" />
          </button>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900">{selectedTicket.title}</h2>
            <p className="text-sm text-gray-500">{selectedTicket.userEmail} ({selectedTicket.userType === 'INDIVIDUAL' ? '개인' : '기업'})</p>
          </div>
          <StatusBadge status={selectedTicket.status} />
        </div>

        <div className="p-6">
          {/* Content */}
          <div className="mb-6">
            <p className="text-xs text-gray-400 mb-2">{new Date(selectedTicket.createdAt).toLocaleString('ko-KR')}</p>
            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-wrap">{selectedTicket.content}</div>
          </div>

          {/* Existing answer */}
          {selectedTicket.answer && (
            <div className="mb-6 bg-sky-50 rounded-xl p-4 border border-sky-100">
              <p className="text-xs font-bold text-sky-700 mb-2">관리자 답변</p>
              <p className="text-sm text-sky-800 whitespace-pre-wrap">{selectedTicket.answer}</p>
              {selectedTicket.answeredAt && <p className="text-xs text-sky-500 mt-2">{new Date(selectedTicket.answeredAt).toLocaleString('ko-KR')}</p>}
            </div>
          )}

          {/* Answer form */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              {selectedTicket.answer ? '답변 수정' : '답변 작성'}
            </label>
            <textarea
              value={answerText}
              onChange={(e) => onAnswerTextChange(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
              placeholder="답변을 입력하세요..."
            />
            <div className="flex justify-end mt-3">
              <button
                onClick={onSubmitAnswer}
                disabled={answerLoading || !answerText.trim()}
                className="px-6 py-2.5 bg-sky-500 text-white text-sm font-bold rounded-lg hover:bg-sky-600 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {answerLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                답변 등록
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-700">전체 문의 ({tickets.length}건)</h2>
      </div>

      {tickets.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b border-gray-200">
              <tr>
                <th className="px-4 py-3">제목</th>
                <th className="px-4 py-3">작성자</th>
                <th className="px-4 py-3">회원유형</th>
                <th className="px-4 py-3">상태</th>
                <th className="px-4 py-3">작성일</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  onClick={() => { onSelectTicket(ticket); onAnswerTextChange(ticket.answer || ''); }}
                  className="hover:bg-sky-50/50 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3 font-medium text-gray-900">{ticket.title}</td>
                  <td className="px-4 py-3 text-gray-600">{ticket.userEmail}</td>
                  <td className="px-4 py-3 text-gray-600">{ticket.userType === 'INDIVIDUAL' ? '개인' : '기업'}</td>
                  <td className="px-4 py-3"><StatusBadge status={ticket.status} /></td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{new Date(ticket.createdAt).toLocaleDateString('ko-KR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <MessageSquare className="w-10 h-10 mb-3 text-gray-200" />
          <p className="text-sm font-medium">접수된 문의가 없습니다.</p>
        </div>
      )}
    </div>
  );
}

// --- Shared Components ---

function StatCard({ icon, iconBg, iconColor, label, value }: { icon: React.ReactNode; iconBg: string; iconColor: string; label: string; value: number }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center ${iconColor}`}>{icon}</div>
      <div><p className="text-sm text-gray-500">{label}</p><p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p></div>
    </div>
  );
}

function PlaceholderContent({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
      <Settings size={40} className="mx-auto mb-4 text-gray-200" />
      <h2 className="text-lg font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-sm text-gray-500">{desc}</p>
    </div>
  );
}

// ==========================================
// 공고 관리 (Admin)
// ==========================================

interface AdminJobItem {
  id: string;
  title: string;
  boardType: string;
  tierType: string;
  status: string;
  displayAddress: string;
  allowedVisas: string;
  viewCount: number;
  applyCount: number;
  scrapCount: number;
  closingDate: string | null;
  suspendedAt: string | null;
  suspendReason: string | null;
  premiumStartAt: string | null;
  premiumEndAt: string | null;
  premiumSource: string | null;
  isFeatured: boolean;
  createdAt: string;
  company: { companyName: string; brandName: string | null } | null;
}

// 프리미엄 부여 사유 드롭다운 / Premium grant reason options
const PREMIUM_GRANT_REASONS = [
  { value: 'PARTNER_PROMO', label: '파트너사 프로모션' },
  { value: 'NEW_SIGNUP', label: '신규가입 혜택' },
  { value: 'EVENT', label: '이벤트' },
  { value: 'CS_COMP', label: 'CS 보상' },
  { value: 'OTHER', label: '기타' },
];

// 프리미엄 해제 사유 드롭다운 / Premium revoke reason options
const PREMIUM_REVOKE_REASONS = [
  { value: 'VIOLATION', label: '규정 위반' },
  { value: 'WRONG_GRANT', label: '잘못된 부여 수정' },
  { value: 'PROMO_END', label: '프로모션 종료' },
  { value: 'CORP_REQUEST', label: '기업 요청' },
  { value: 'OTHER', label: '기타' },
];

// 프리미엄 소스 표시 / Premium source display
const PREMIUM_SOURCE_LABELS: Record<string, { label: string; style: string }> = {
  PAID: { label: '결제', style: 'bg-emerald-100 text-emerald-700' },
  ADMIN_GRANT: { label: '수동', style: 'bg-purple-100 text-purple-700' },
  PROMOTION: { label: '이벤트', style: 'bg-orange-100 text-orange-700' },
};

const JOB_STATUS_CONFIG: Record<string, { label: string; style: string }> = {
  DRAFT: { label: '임시저장', style: 'bg-gray-100 text-gray-600' },
  ACTIVE: { label: '게시중', style: 'bg-green-100 text-green-700' },
  CLOSED: { label: '마감', style: 'bg-gray-100 text-gray-500' },
  SUSPENDED: { label: '중지됨', style: 'bg-red-100 text-red-700' },
};

function AdminJobsContent({ fetchWithAuth }: { fetchWithAuth: FetchFn }) {
  const [jobs, setJobs] = useState<AdminJobItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 0 });
  const [filters, setFilters] = useState({ status: '', boardType: '', keyword: '', page: 1 });
  const [suspendModal, setSuspendModal] = useState<{ jobId: string; title: string } | null>(null);
  const [suspendReason, setSuspendReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // 프리미엄 부여 모달 상태 / Premium grant modal state
  const [grantModal, setGrantModal] = useState<{ jobId: string; title: string; company: string } | null>(null);
  const [grantStep, setGrantStep] = useState<1 | 2>(1);
  const [grantForm, setGrantForm] = useState({ days: 30, reason: 'EVENT', memo: '', grantFeatured: false });

  // 프리미엄 해제 모달 상태 / Premium revoke modal state
  const [revokeModal, setRevokeModal] = useState<{ jobId: string; title: string; company: string; premiumSource: string | null; premiumEndAt: string | null } | null>(null);
  const [revokeStep, setRevokeStep] = useState<1 | 2>(1);
  const [revokeForm, setRevokeForm] = useState({ reason: 'VIOLATION', memo: '', forceNoRefund: false });

  // 프리미엄 이력 패널 상태 / Premium history panel state
  const [historyPanel, setHistoryPanel] = useState<string | null>(null);
  const [historyData, setHistoryData] = useState<any>(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.set('status', filters.status);
      if (filters.boardType) params.set('boardType', filters.boardType);
      if (filters.keyword) params.set('keyword', filters.keyword);
      params.set('page', String(filters.page));
      params.set('limit', '20');
      const res = await fetchWithAuth(`/api/jobs/admin/all?${params}`);
      if (res.ok) {
        const data = await res.json();
        setJobs(data.items || []);
        setMeta({ total: data.total || 0, page: data.page || 1, totalPages: data.totalPages || 0 });
      }
    } catch { }
    finally { setLoading(false); }
  };

  useEffect(() => { loadJobs(); }, [filters]);

  const handleSuspend = async () => {
    if (!suspendModal || !suspendReason.trim()) return;
    setActionLoading(true);
    try {
      const res = await fetchWithAuth(`/api/jobs/admin/${suspendModal.jobId}/suspend`, {
        method: 'POST',
        body: JSON.stringify({ reason: suspendReason }),
      });
      if (res.ok) {
        setSuspendModal(null);
        setSuspendReason('');
        loadJobs();
      }
    } catch { }
    finally { setActionLoading(false); }
  };

  const handleUnsuspend = async (jobId: string) => {
    setActionLoading(true);
    try {
      const res = await fetchWithAuth(`/api/jobs/admin/${jobId}/unsuspend`, { method: 'POST' });
      if (res.ok) loadJobs();
    } catch { }
    finally { setActionLoading(false); }
  };

  // 프리미엄 부여 (이중확인) / Grant premium (double confirmation)
  const handleGrantPremium = async () => {
    if (!grantModal) return;
    setActionLoading(true);
    try {
      const res = await fetchWithAuth(`/api/payment/admin/grant-premium/${grantModal.jobId}`, {
        method: 'POST',
        body: JSON.stringify(grantForm),
      });
      if (res.ok) {
        setGrantModal(null);
        setGrantStep(1);
        setGrantForm({ days: 30, reason: 'EVENT', memo: '', grantFeatured: false });
        loadJobs();
      }
    } catch { }
    finally { setActionLoading(false); }
  };

  // 프리미엄 해제 (이중확인) / Revoke premium (double confirmation)
  const handleRevokePremium = async () => {
    if (!revokeModal) return;
    setActionLoading(true);
    try {
      const res = await fetchWithAuth(`/api/payment/admin/revoke-premium/${revokeModal.jobId}`, {
        method: 'POST',
        body: JSON.stringify(revokeForm),
      });
      if (res.ok) {
        setRevokeModal(null);
        setRevokeStep(1);
        setRevokeForm({ reason: 'VIOLATION', memo: '', forceNoRefund: false });
        loadJobs();
      }
    } catch { }
    finally { setActionLoading(false); }
  };

  // 프리미엄 이력 조회 / Load premium history
  const loadPremiumHistory = async (jobId: string) => {
    setHistoryPanel(jobId);
    setHistoryLoading(true);
    try {
      const res = await fetchWithAuth(`/api/payment/admin/premium-history/${jobId}`);
      if (res.ok) {
        const data = await res.json();
        setHistoryData(data);
      }
    } catch { }
    finally { setHistoryLoading(false); }
  };

  return (
    <div>
      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-wrap gap-3 items-center">
        <select
          value={filters.status}
          onChange={(e) => setFilters(p => ({ ...p, status: e.target.value, page: 1 }))}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          <option value="">전체 상태</option>
          <option value="ACTIVE">게시중</option>
          <option value="DRAFT">임시저장</option>
          <option value="CLOSED">마감</option>
          <option value="SUSPENDED">중지됨</option>
        </select>
        <select
          value={filters.boardType}
          onChange={(e) => setFilters(p => ({ ...p, boardType: e.target.value, page: 1 }))}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          <option value="">전체 유형</option>
          <option value="PART_TIME">알바</option>
          <option value="FULL_TIME">정규직</option>
        </select>
        <div className="relative">
          <input
            type="text"
            value={filters.keyword}
            onChange={(e) => setFilters(p => ({ ...p, keyword: e.target.value }))}
            onKeyDown={(e) => { if (e.key === 'Enter') setFilters(p => ({ ...p, page: 1 })); }}
            placeholder="제목/기업명 검색"
            className="pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 w-48"
          />
          <Search size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        <div className="ml-auto text-sm text-gray-500">총 <span className="font-bold text-gray-900">{meta.total}</span>건</div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-gray-300" /></div>
        ) : jobs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3">제목</th>
                  <th className="px-4 py-3">기업</th>
                  <th className="px-4 py-3">유형</th>
                  <th className="px-4 py-3">프리미엄</th>
                  <th className="px-4 py-3">상태</th>
                  <th className="px-4 py-3">조회</th>
                  <th className="px-4 py-3">지원</th>
                  <th className="px-4 py-3">등록일</th>
                  <th className="px-4 py-3">조치</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <a href={`/jobs/${job.id}`} target="_blank" rel="noopener noreferrer" className="font-medium text-gray-900 hover:text-sky-600 flex items-center gap-1">
                        {job.title.length > 30 ? job.title.substring(0, 30) + '...' : job.title}
                        <ExternalLink size={12} className="text-gray-300" />
                      </a>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{job.company?.brandName || job.company?.companyName || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-[11px] font-bold rounded ${job.boardType === 'PART_TIME' ? 'bg-sky-100 text-sky-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {job.boardType === 'PART_TIME' ? '알바' : '정규직'}
                      </span>
                    </td>
                    {/* 프리미엄 상태 열 / Premium status column */}
                    <td className="px-4 py-3">
                      {job.tierType === 'PREMIUM' && job.premiumSource ? (
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1">
                            <Crown size={12} className="text-amber-500" />
                            <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${PREMIUM_SOURCE_LABELS[job.premiumSource]?.style || 'bg-gray-100 text-gray-600'}`}>
                              {PREMIUM_SOURCE_LABELS[job.premiumSource]?.label || job.premiumSource}
                            </span>
                          </div>
                          {job.premiumEndAt && (
                            <p className="text-[10px] text-gray-400">~{new Date(job.premiumEndAt).toLocaleDateString('ko-KR')}</p>
                          )}
                        </div>
                      ) : (
                        <span className="text-[11px] text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-[11px] font-bold rounded ${JOB_STATUS_CONFIG[job.status]?.style || 'bg-gray-100 text-gray-500'}`}>
                        {JOB_STATUS_CONFIG[job.status]?.label || job.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{job.viewCount}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{job.applyCount}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{new Date(job.createdAt).toLocaleDateString('ko-KR')}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {/* 프리미엄 부여/해제 버튼 / Premium grant/revoke buttons */}
                        {job.status === 'ACTIVE' && job.tierType !== 'PREMIUM' && (
                          <button
                            onClick={() => { setGrantModal({ jobId: job.id, title: job.title, company: job.company?.companyName || '-' }); setGrantStep(1); }}
                            className="px-2 py-1 text-[11px] font-bold text-amber-600 bg-amber-50 rounded hover:bg-amber-100 flex items-center gap-1"
                          >
                            <Star size={12} /> 부여
                          </button>
                        )}
                        {job.tierType === 'PREMIUM' && (
                          <>
                            <button
                              onClick={() => { setRevokeModal({ jobId: job.id, title: job.title, company: job.company?.companyName || '-', premiumSource: job.premiumSource, premiumEndAt: job.premiumEndAt }); setRevokeStep(1); }}
                              className="px-2 py-1 text-[11px] font-bold text-rose-600 bg-rose-50 rounded hover:bg-rose-100 flex items-center gap-1"
                            >
                              <MinusCircle size={12} /> 해제
                            </button>
                            <button
                              onClick={() => loadPremiumHistory(job.id)}
                              className="px-2 py-1 text-[11px] font-bold text-gray-500 bg-gray-50 rounded hover:bg-gray-100 flex items-center gap-1"
                            >
                              <History size={12} /> 이력
                            </button>
                          </>
                        )}
                        {/* 기존 중지/해제 버튼 / Existing suspend/unsuspend buttons */}
                        {job.status === 'ACTIVE' && (
                          <button
                            onClick={() => setSuspendModal({ jobId: job.id, title: job.title })}
                            className="px-2 py-1 text-[11px] font-bold text-red-600 bg-red-50 rounded hover:bg-red-100 flex items-center gap-1"
                          >
                            <Pause size={12} /> 중지
                          </button>
                        )}
                        {job.status === 'SUSPENDED' && (
                          <div className="space-y-1">
                            <button
                              onClick={() => handleUnsuspend(job.id)}
                              disabled={actionLoading}
                              className="px-2 py-1 text-[11px] font-bold text-green-600 bg-green-50 rounded hover:bg-green-100 flex items-center gap-1"
                            >
                              <RotateCcw size={12} /> 해제
                            </button>
                            {job.suspendReason && (
                              <p className="text-[10px] text-red-500 max-w-[120px] truncate" title={job.suspendReason}>사유: {job.suspendReason}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center py-16 text-gray-400">
            <Briefcase className="w-8 h-8 mb-2 text-gray-200" />
            <p className="text-sm">등록된 공고가 없습니다.</p>
          </div>
        )}

        {meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
            <button onClick={() => setFilters(p => ({ ...p, page: p.page - 1 }))} disabled={meta.page <= 1} className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-white rounded-lg border border-gray-200 disabled:opacity-40">
              <ChevronLeft size={14} /> 이전
            </button>
            <span className="text-sm text-gray-500">{meta.page} / {meta.totalPages}</span>
            <button onClick={() => setFilters(p => ({ ...p, page: p.page + 1 }))} disabled={meta.page >= meta.totalPages} className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-white rounded-lg border border-gray-200 disabled:opacity-40">
              다음 <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Suspend Modal / 공고 중지 모달 */}
      {suspendModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle size={20} className="text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">공고 게시 중지</h3>
                <p className="text-xs text-gray-500 mt-0.5">{suspendModal.title}</p>
              </div>
            </div>
            <textarea
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none mb-4"
              placeholder="중지 사유를 입력하세요 (기업에게 통보됨)..."
            />
            <div className="flex gap-3 justify-end">
              <button onClick={() => { setSuspendModal(null); setSuspendReason(''); }} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                취소
              </button>
              <button
                onClick={handleSuspend}
                disabled={actionLoading || !suspendReason.trim()}
                className="px-5 py-2 bg-red-500 text-white text-sm font-bold rounded-lg hover:bg-red-600 disabled:opacity-50 flex items-center gap-2"
              >
                {actionLoading ? <Loader2 size={14} className="animate-spin" /> : <Ban size={14} />}
                게시 중지
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Premium Grant Modal (이중확인) / Premium grant modal (double confirmation) */}
      {grantModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <Crown size={20} className="text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">프리미엄 수동 부여</h3>
                <p className="text-xs text-gray-500 mt-0.5">{grantModal.title} — {grantModal.company}</p>
              </div>
            </div>

            {grantStep === 1 ? (
              /* Step 1: 정보 입력 / Step 1: Input */
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1 block">부여 기간 (일)</label>
                  <input type="number" min={1} max={365} value={grantForm.days}
                    onChange={(e) => setGrantForm(p => ({ ...p, days: Number(e.target.value) || 1 }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1 block">사유</label>
                  <select value={grantForm.reason} onChange={(e) => setGrantForm(p => ({ ...p, reason: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
                    {PREMIUM_GRANT_REASONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1 block">메모 (선택)</label>
                  <textarea value={grantForm.memo} onChange={(e) => setGrantForm(p => ({ ...p, memo: e.target.value }))}
                    rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                    placeholder="내부 참고용 메모..."
                  />
                </div>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={grantForm.grantFeatured} onChange={(e) => setGrantForm(p => ({ ...p, grantFeatured: e.target.checked }))}
                    className="rounded border-gray-300 text-amber-500 focus:ring-amber-500" />
                  상위노출(Featured) 동시 부여
                </label>
                <div className="flex gap-3 justify-end pt-2">
                  <button onClick={() => { setGrantModal(null); setGrantStep(1); }} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">취소</button>
                  <button onClick={() => setGrantStep(2)} className="px-5 py-2 bg-amber-500 text-white text-sm font-bold rounded-lg hover:bg-amber-600 flex items-center gap-2">
                    다음 <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ) : (
              /* Step 2: 최종 확인 / Step 2: Final confirmation */
              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
                  <p className="text-sm"><span className="font-bold text-gray-600">공고:</span> {grantModal.title}</p>
                  <p className="text-sm"><span className="font-bold text-gray-600">기업:</span> {grantModal.company}</p>
                  <p className="text-sm"><span className="font-bold text-gray-600">기간:</span> {grantForm.days}일</p>
                  <p className="text-sm"><span className="font-bold text-gray-600">사유:</span> {PREMIUM_GRANT_REASONS.find(r => r.value === grantForm.reason)?.label}</p>
                  {grantForm.memo && <p className="text-sm"><span className="font-bold text-gray-600">메모:</span> {grantForm.memo}</p>}
                  {grantForm.grantFeatured && <p className="text-sm text-amber-700 font-bold">+ 상위노출 동시 부여</p>}
                </div>
                <div className="flex items-center gap-2 text-xs text-orange-600 bg-orange-50 p-3 rounded-lg">
                  <AlertTriangle size={14} />
                  <span>이 작업은 로그에 기록됩니다. 부여 후 이력 조회에서 확인할 수 있습니다.</span>
                </div>
                <div className="flex gap-3 justify-end pt-2">
                  <button onClick={() => setGrantStep(1)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">이전으로</button>
                  <button onClick={handleGrantPremium} disabled={actionLoading}
                    className="px-5 py-2 bg-amber-500 text-white text-sm font-bold rounded-lg hover:bg-amber-600 disabled:opacity-50 flex items-center gap-2">
                    {actionLoading ? <Loader2 size={14} className="animate-spin" /> : <Crown size={14} />}
                    확인 및 부여
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Premium Revoke Modal (이중확인) / Premium revoke modal (double confirmation) */}
      {revokeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
                <MinusCircle size={20} className="text-rose-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">프리미엄 해제</h3>
                <p className="text-xs text-gray-500 mt-0.5">{revokeModal.title} — {revokeModal.company}</p>
              </div>
            </div>

            {revokeStep === 1 ? (
              /* Step 1: 해제 정보 / Step 1: Revocation info */
              <div className="space-y-4">
                {/* 현재 프리미엄 상태 / Current premium status */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm space-y-1">
                  <p><span className="font-bold text-gray-600">소스:</span>{' '}
                    <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${PREMIUM_SOURCE_LABELS[revokeModal.premiumSource || '']?.style || 'bg-gray-100'}`}>
                      {PREMIUM_SOURCE_LABELS[revokeModal.premiumSource || '']?.label || revokeModal.premiumSource || '-'}
                    </span>
                  </p>
                  {revokeModal.premiumEndAt && (
                    <p><span className="font-bold text-gray-600">종료일:</span> {new Date(revokeModal.premiumEndAt).toLocaleDateString('ko-KR')}
                      {' '}(잔여 {Math.max(0, Math.ceil((new Date(revokeModal.premiumEndAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))}일)
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1 block">해제 사유</label>
                  <select value={revokeForm.reason} onChange={(e) => setRevokeForm(p => ({ ...p, reason: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500">
                    {PREMIUM_REVOKE_REASONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1 block">메모 (선택)</label>
                  <textarea value={revokeForm.memo} onChange={(e) => setRevokeForm(p => ({ ...p, memo: e.target.value }))}
                    rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                    placeholder="내부 참고용 메모..."
                  />
                </div>

                {/* 결제 공고인 경우 환불 분기 UI / Refund branching for paid premium */}
                {revokeModal.premiumSource === 'PAID' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
                    <p className="text-xs font-bold text-blue-700">이 공고는 결제로 프리미엄이 적용되었습니다</p>
                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                      <input type="checkbox" checked={revokeForm.forceNoRefund}
                        onChange={(e) => setRevokeForm(p => ({ ...p, forceNoRefund: e.target.checked }))}
                        className="rounded border-gray-300 text-rose-500 focus:ring-rose-500" />
                      환불 없이 해제 (위반 사유)
                    </label>
                    {!revokeForm.forceNoRefund && (
                      <p className="text-[11px] text-blue-600">체크하지 않으면 잔여 기간에 대해 일할계산 환불 처리됩니다.</p>
                    )}
                  </div>
                )}

                <div className="flex gap-3 justify-end pt-2">
                  <button onClick={() => { setRevokeModal(null); setRevokeStep(1); }} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">취소</button>
                  <button onClick={() => setRevokeStep(2)} className="px-5 py-2 bg-rose-500 text-white text-sm font-bold rounded-lg hover:bg-rose-600 flex items-center gap-2">
                    다음 <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ) : (
              /* Step 2: 최종 확인 / Step 2: Final confirmation */
              <div className="space-y-4">
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 space-y-2">
                  <p className="text-sm"><span className="font-bold text-gray-600">공고:</span> {revokeModal.title}</p>
                  <p className="text-sm"><span className="font-bold text-gray-600">기업:</span> {revokeModal.company}</p>
                  <p className="text-sm"><span className="font-bold text-gray-600">사유:</span> {PREMIUM_REVOKE_REASONS.find(r => r.value === revokeForm.reason)?.label}</p>
                  {revokeForm.memo && <p className="text-sm"><span className="font-bold text-gray-600">메모:</span> {revokeForm.memo}</p>}
                  {revokeModal.premiumSource === 'PAID' && (
                    <p className="text-sm font-bold text-rose-700">
                      {revokeForm.forceNoRefund ? '환불 없이 해제 (위반)' : '잔여 기간 일할계산 환불 처리'}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-orange-600 bg-orange-50 p-3 rounded-lg">
                  <AlertTriangle size={14} />
                  <span>이 작업은 로그에 기록됩니다. 해제 후 복구하려면 다시 부여해야 합니다.</span>
                </div>
                <div className="flex gap-3 justify-end pt-2">
                  <button onClick={() => setRevokeStep(1)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">이전으로</button>
                  <button onClick={handleRevokePremium} disabled={actionLoading}
                    className="px-5 py-2 bg-rose-500 text-white text-sm font-bold rounded-lg hover:bg-rose-600 disabled:opacity-50 flex items-center gap-2">
                    {actionLoading ? <Loader2 size={14} className="animate-spin" /> : <MinusCircle size={14} />}
                    확인 및 해제
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Premium History Panel / 프리미엄 이력 패널 */}
      {historyPanel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <History size={20} className="text-gray-600" />
                </div>
                <h3 className="font-bold text-gray-900">프리미엄 이력</h3>
              </div>
              <button onClick={() => { setHistoryPanel(null); setHistoryData(null); }} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={16} />
              </button>
            </div>

            {historyLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-gray-300" /></div>
            ) : historyData ? (
              <div className="space-y-6">
                {/* 현재 상태 / Current status */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">현재 상태</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p><span className="text-gray-500">공고:</span> {historyData.currentStatus?.title}</p>
                    <p><span className="text-gray-500">티어:</span> {historyData.currentStatus?.tierType}</p>
                    <p><span className="text-gray-500">소스:</span> {historyData.currentStatus?.premiumSource || '-'}</p>
                    <p><span className="text-gray-500">종료일:</span> {historyData.currentStatus?.premiumEndAt ? new Date(historyData.currentStatus.premiumEndAt).toLocaleDateString('ko-KR') : '-'}</p>
                  </div>
                </div>

                {/* 관리자 조치 이력 / Admin action history */}
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">관리자 조치 이력</h4>
                  {historyData.adminActions?.length > 0 ? (
                    <div className="space-y-2">
                      {historyData.adminActions.map((action: any) => (
                        <div key={action.id} className="border border-gray-200 rounded-lg p-3 text-sm">
                          <div className="flex items-center justify-between mb-1">
                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${action.actionType.includes('GRANT') ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                              {action.actionType}
                            </span>
                            <span className="text-[11px] text-gray-400">{new Date(action.createdAt).toLocaleString('ko-KR')}</span>
                          </div>
                          <p className="text-xs text-gray-600">사유: {action.reason}</p>
                          {action.metadata && (
                            <div className="mt-1 text-[11px] text-gray-400">
                              {action.metadata.days && <span>기간: {action.metadata.days}일 | </span>}
                              {action.metadata.memo && <span>메모: {action.metadata.memo}</span>}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 text-center py-4">관리자 조치 이력이 없습니다.</p>
                  )}
                </div>

                {/* 결제 이력 / Payment history */}
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">결제 이력</h4>
                  {historyData.paymentHistory?.length > 0 ? (
                    <div className="space-y-2">
                      {historyData.paymentHistory.map((order: any) => (
                        <div key={order.orderId} className="border border-gray-200 rounded-lg p-3 text-sm flex items-center justify-between">
                          <div>
                            <p className="font-medium">{order.productName}</p>
                            <p className="text-[11px] text-gray-400">{order.orderNo}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-emerald-600">{order.paidAmount?.toLocaleString()}원</p>
                            <p className="text-[11px] text-gray-400">{order.paidAt ? new Date(order.paidAt).toLocaleDateString('ko-KR') : '-'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 text-center py-4">결제 이력이 없습니다.</p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-8">이력을 불러올 수 없습니다.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 판매 관리 (Admin)
// ==========================================

interface OrderItem {
  id: string;
  orderNo: string;
  corporateId: string;
  snapshotProductName: string;
  snapshotOriginalPrice: number;
  snapshotDiscountPrice: number;
  snapshotDiscountPct: number;
  paidAmount: number;
  paymentStatus: string;
  pgProvider: string | null;
  impUid: string | null;
  paidAt: string | null;
  cancelledAt: string | null;
  cancelReason: string | null;
  jobPostingId: string | null;
  createdAt: string;
  product: { productCode: string; nameKo: string; boardType: string; tierType: string } | null;
}

interface PaymentStatsData {
  totalRevenue: number;
  totalOrders: number;
  paidOrders: number;
  cancelledOrders: number;
  byProduct: { productCode: string; nameKo: string; count: number; revenue: number }[];
  byMonth: { month: string; count: number; revenue: number }[];
}

const PAYMENT_STATUS_CONFIG: Record<string, { label: string; style: string }> = {
  PENDING: { label: '대기', style: 'bg-yellow-100 text-yellow-700' },
  PAID: { label: '결제완료', style: 'bg-green-100 text-green-700' },
  CANCELLED: { label: '취소', style: 'bg-red-100 text-red-700' },
  REFUNDED: { label: '환불', style: 'bg-purple-100 text-purple-700' },
  FAILED: { label: '실패', style: 'bg-gray-100 text-gray-500' },
};

function AdminSalesContent({ fetchWithAuth }: { fetchWithAuth: FetchFn }) {
  const [tab, setTab] = useState<'orders' | 'stats'>('orders');
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersMeta, setOrdersMeta] = useState({ total: 0, page: 1, totalPages: 0 });
  const [orderFilters, setOrderFilters] = useState({ paymentStatus: '', productCode: '', page: 1 });
  const [stats, setStats] = useState<PaymentStatsData | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  const loadOrders = async () => {
    setOrdersLoading(true);
    try {
      const params = new URLSearchParams();
      if (orderFilters.paymentStatus) params.set('paymentStatus', orderFilters.paymentStatus);
      if (orderFilters.productCode) params.set('productCode', orderFilters.productCode);
      params.set('page', String(orderFilters.page));
      params.set('limit', '20');
      const res = await fetchWithAuth(`/api/payment/orders?${params}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.items || []);
        setOrdersMeta({ total: data.total || 0, page: data.page || 1, totalPages: data.totalPages || 0 });
      }
    } catch { }
    finally { setOrdersLoading(false); }
  };

  const loadStats = async () => {
    setStatsLoading(true);
    try {
      const res = await fetchWithAuth('/api/payment/stats');
      if (res.ok) setStats(await res.json());
    } catch { }
    finally { setStatsLoading(false); }
  };

  useEffect(() => { if (tab === 'orders') loadOrders(); }, [orderFilters, tab]);
  useEffect(() => { if (tab === 'stats') loadStats(); }, [tab]);

  return (
    <div>
      {/* Tab switcher */}
      <div className="flex gap-1 mb-6 bg-white rounded-xl border border-gray-200 p-1.5">
        <button
          onClick={() => setTab('orders')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${tab === 'orders' ? 'bg-sky-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          <ShoppingCart size={16} /> 주문/판매 내역
        </button>
        <button
          onClick={() => setTab('stats')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${tab === 'stats' ? 'bg-sky-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          <TrendingUp size={16} /> 매출 통계
        </button>
      </div>

      {tab === 'orders' && (
        <div>
          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-wrap gap-3 items-center">
            <select
              value={orderFilters.paymentStatus}
              onChange={(e) => setOrderFilters(p => ({ ...p, paymentStatus: e.target.value, page: 1 }))}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="">전체 결제상태</option>
              <option value="PAID">결제완료</option>
              <option value="PENDING">대기</option>
              <option value="CANCELLED">취소</option>
              <option value="REFUNDED">환불</option>
              <option value="FAILED">실패</option>
            </select>
            <select
              value={orderFilters.productCode}
              onChange={(e) => setOrderFilters(p => ({ ...p, productCode: e.target.value, page: 1 }))}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="">전체 상품</option>
              <option value="ALBA_PREMIUM">알바 프리미엄</option>
              <option value="ALBA_STANDARD">알바 일반</option>
              <option value="FT_PREMIUM">정규직 프리미엄</option>
              <option value="FT_STANDARD">정규직 일반</option>
            </select>
            <div className="ml-auto text-sm text-gray-500">총 <span className="font-bold text-gray-900">{ordersMeta.total}</span>건</div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {ordersLoading ? (
              <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-gray-300" /></div>
            ) : orders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3">주문번호</th>
                      <th className="px-4 py-3">상품</th>
                      <th className="px-4 py-3">원가</th>
                      <th className="px-4 py-3">할인</th>
                      <th className="px-4 py-3">결제금액</th>
                      <th className="px-4 py-3">상태</th>
                      <th className="px-4 py-3">결제일</th>
                      <th className="px-4 py-3">공고</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-xs font-mono text-gray-600">{order.orderNo}</td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-medium text-gray-900">{order.snapshotProductName}</span>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-400 line-through">{order.snapshotOriginalPrice.toLocaleString()}원</td>
                        <td className="px-4 py-3 text-xs text-sky-600 font-medium">{order.snapshotDiscountPct}%</td>
                        <td className="px-4 py-3 text-sm font-bold text-gray-900">
                          {order.paidAmount === 0 ? (
                            <span className="text-green-600">무료</span>
                          ) : (
                            `${order.paidAmount.toLocaleString()}원`
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 text-[11px] font-bold rounded ${PAYMENT_STATUS_CONFIG[order.paymentStatus]?.style || 'bg-gray-100 text-gray-500'}`}>
                            {PAYMENT_STATUS_CONFIG[order.paymentStatus]?.label || order.paymentStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                          {order.paidAt ? new Date(order.paidAt).toLocaleDateString('ko-KR') : '-'}
                        </td>
                        <td className="px-4 py-3">
                          {order.jobPostingId ? (
                            <a href={`/jobs/${order.jobPostingId}`} target="_blank" rel="noopener noreferrer" className="text-xs text-sky-600 hover:underline flex items-center gap-1">
                              보기 <ExternalLink size={10} />
                            </a>
                          ) : (
                            <span className="text-xs text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center py-16 text-gray-400">
                <ShoppingCart className="w-8 h-8 mb-2 text-gray-200" />
                <p className="text-sm">주문 내역이 없습니다.</p>
              </div>
            )}

            {ordersMeta.totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
                <button onClick={() => setOrderFilters(p => ({ ...p, page: p.page - 1 }))} disabled={ordersMeta.page <= 1} className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-white rounded-lg border border-gray-200 disabled:opacity-40">
                  <ChevronLeft size={14} /> 이전
                </button>
                <span className="text-sm text-gray-500">{ordersMeta.page} / {ordersMeta.totalPages}</span>
                <button onClick={() => setOrderFilters(p => ({ ...p, page: p.page + 1 }))} disabled={ordersMeta.page >= ordersMeta.totalPages} className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-white rounded-lg border border-gray-200 disabled:opacity-40">
                  다음 <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'stats' && (
        <div>
          {statsLoading ? (
            <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-gray-300" /></div>
          ) : stats ? (
            <>
              {/* Summary cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center"><DollarSign size={20} className="text-green-600" /></div>
                    <div><p className="text-sm text-gray-500">총 매출</p><p className="text-2xl font-bold text-gray-900">{stats.totalRevenue.toLocaleString()}원</p></div>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center"><ShoppingCart size={20} className="text-sky-600" /></div>
                    <div><p className="text-sm text-gray-500">총 주문</p><p className="text-2xl font-bold text-gray-900">{stats.totalOrders}건</p></div>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center"><Check size={20} className="text-emerald-600" /></div>
                    <div><p className="text-sm text-gray-500">결제 완료</p><p className="text-2xl font-bold text-gray-900">{stats.paidOrders}건</p></div>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center"><X size={20} className="text-red-600" /></div>
                    <div><p className="text-sm text-gray-500">취소/환불</p><p className="text-2xl font-bold text-gray-900">{stats.cancelledOrders}건</p></div>
                  </div>
                </div>
              </div>

              {/* By Product */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="text-sm font-bold text-gray-700 mb-4">상품별 판매</h3>
                  {stats.byProduct.length > 0 ? (
                    <div className="space-y-3">
                      {stats.byProduct.map((p) => (
                        <div key={p.productCode} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{p.nameKo}</p>
                            <p className="text-xs text-gray-500">{p.productCode}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-gray-900">{p.revenue.toLocaleString()}원</p>
                            <p className="text-xs text-gray-500">{p.count}건</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 text-center py-8">데이터 없음</p>
                  )}
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="text-sm font-bold text-gray-700 mb-4">월별 매출</h3>
                  {stats.byMonth.length > 0 ? (
                    <div className="space-y-2">
                      {stats.byMonth.map((m) => {
                        const maxRevenue = Math.max(...stats.byMonth.map(x => x.revenue), 1);
                        const widthPct = (m.revenue / maxRevenue) * 100;
                        return (
                          <div key={m.month} className="flex items-center gap-3">
                            <span className="text-xs text-gray-500 w-20 flex-shrink-0">{m.month}</span>
                            <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                              <div className="bg-sky-500 h-full rounded-full transition-all" style={{ width: `${widthPct}%` }} />
                            </div>
                            <span className="text-xs font-medium text-gray-700 w-24 text-right">{m.revenue.toLocaleString()}원</span>
                            <span className="text-[11px] text-gray-400 w-12 text-right">{m.count}건</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 text-center py-8">데이터 없음</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <TrendingUp className="w-10 h-10 mx-auto mb-3 text-gray-200" />
              <p className="text-sm text-gray-400">통계 데이터를 불러올 수 없습니다.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ==========================================
// 정책/규정 관리 (5 탭)
// ==========================================

const POLICY_TABS = [
  { id: 'changes', label: '정책 변경 피드', icon: AlertTriangle },
  { id: 'rules', label: '규칙 관리', icon: Shield },
  { id: 'visa-types', label: '비자 유형', icon: Globe },
  { id: 'industry-codes', label: '업종코드', icon: Building2 },
  { id: 'test', label: '규칙 테스트', icon: Zap },
];

type FetchFn = (url: string, options?: RequestInit) => Promise<Response>;

// --- 회원 관리 (전체/개인/기업) ---

interface AdminUser {
  id: string;
  email: string;
  userType: string;
  socialProvider: string | null;
  isActive: boolean;
  joinedAt: string;
  lastLoginAt: string | null;
  updatedAt: string;
  needsAction: boolean;
  individual: {
    realName: string | null;
    nationality: string | null;
    gender: string | null;
    birthDate: string | null;
    visaType: string | null;
    visaExpiryDate: string | null;
    addressRoad: string | null;
    desiredJobType: string | null;
    desiredSalary: number;
    desiredIndustries: string | null;
    finalEducationLvl: string | null;
    koreanFluencyLvl: string | null;
    totalCareerMonths: number;
    profileImageUrl: string | null;
    selfIntro: string | null;
    isProfileCompleted: boolean;
    profileCompletionPercent: number;
  } | null;
  corporate: {
    companyNameOfficial: string | null;
    bizRegNumber: string | null;
    ceoName: string | null;
    managerName: string | null;
    managerPhone: string | null;
    managerEmail: string | null;
    verificationStatus: string;
    verificationMethod: string | null;
    bizRegDocPath: string | null;
    bizRegDocOrigName: string | null;
    empCertDocPath: string | null;
    empCertDocOrigName: string | null;
    isCeoSelf: boolean;
    ocrVerified: boolean | null;
    ocrExtractedBizNo: string | null;
    isBizVerified: boolean;
    submittedAt: string | null;
    approvedAt: string | null;
    lastRejectionReason: string | null;
  } | null;
}

interface UsersMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function AdminUsersContent({ fetchWithAuth }: { fetchWithAuth: FetchFn }) {
  const [userTab, setUserTab] = useState<'ALL' | 'INDIVIDUAL' | 'CORPORATE'>('ALL');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [meta, setMeta] = useState<UsersMeta>({ total: 0, page: 1, limit: 20, totalPages: 0 });
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [page, setPage] = useState(1);

  // Sort
  const [sortBy, setSortBy] = useState('latest');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Detail views
  const [selectedIndividual, setSelectedIndividual] = useState<AdminUser | null>(null);
  const [selectedCorporate, setSelectedCorporate] = useState<AdminUser | null>(null);
  const [corpDetailTab, setCorpDetailTab] = useState<'info' | 'postings'>('info');
  const [corpJobPostings, setCorpJobPostings] = useState<any[]>([]);
  const [corpJobsLoading, setCorpJobsLoading] = useState(false);
  const [expandedPosting, setExpandedPosting] = useState<string | null>(null);

  // 개인회원 상세 (비자인증 + 이력서 포함)
  // Individual user detail (with visa verification + resume)
  const [userDetail, setUserDetail] = useState<any>(null);
  const [userDetailLoading, setUserDetailLoading] = useState(false);
  const [visaActionLoading, setVisaActionLoading] = useState(false);
  const [visaRejectReason, setVisaRejectReason] = useState('');
  const [showVisaRejectForm, setShowVisaRejectForm] = useState(false);

  // Corporate actions
  const [rejectModal, setRejectModal] = useState<AdminUser | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Document preview
  const [docPreview, setDocPreview] = useState<{ url: string; name: string; type: string } | null>(null);

  const SORT_OPTIONS = [
    { key: 'latest', label: '최신 업데이트순' },
    { key: 'needsAction', label: '조치필요 우선' },
    { key: 'name', label: '이름/회사명순' },
    { key: 'joinedAt', label: '가입일순' },
    { key: 'lastLogin', label: '최근접속순' },
  ];

  const loadUsers = async (tab?: string, p?: number, sort?: string, order?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('type', tab || userTab);
      params.set('page', String(p || page));
      params.set('limit', '20');
      params.set('sortBy', sort || sortBy);
      params.set('sortOrder', order || sortOrder);
      if (searchKeyword.trim()) params.set('search', searchKeyword.trim());
      const res = await fetchWithAuth(`/api/auth/admin/users?${params}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.data || []);
        setMeta(data.meta || { total: 0, page: 1, limit: 20, totalPages: 0 });
      }
    } catch { }
    finally { setLoading(false); }
  };

  // 기업 공고 목록 로드 (드로어 탭2에서 사용)
  const loadCorpJobPostings = async (companyName: string) => {
    setCorpJobsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('search', companyName);
      params.set('limit', '50');
      const res = await fetchWithAuth(`/api/jobs/admin/all?${params}`);
      if (res.ok) {
        const data = await res.json();
        setCorpJobPostings(data.items || []);
      } else {
        setCorpJobPostings([]);
      }
    } catch {
      setCorpJobPostings([]);
    }
    finally { setCorpJobsLoading(false); }
  };

  useEffect(() => { setPage(1); loadUsers(userTab, 1); }, [userTab]);

  const handleSearch = () => { setPage(1); loadUsers(userTab, 1); };

  const handlePageChange = (newPage: number) => { setPage(newPage); loadUsers(userTab, newPage); };

  const handleSortChange = (newSortBy: string) => {
    if (newSortBy === sortBy) {
      const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
      setSortOrder(newOrder);
      setPage(1);
      loadUsers(userTab, 1, newSortBy, newOrder);
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
      setPage(1);
      loadUsers(userTab, 1, newSortBy, 'desc');
    }
    setShowSortMenu(false);
  };

  // 개인회원 상세 열기 (서버에서 풀데이터 fetch) / Open individual detail (fetch full data)
  const openIndividualDetail = async (u: AdminUser) => {
    setSelectedIndividual(u);
    setUserDetail(null);
    setUserDetailLoading(true);
    setShowVisaRejectForm(false);
    setVisaRejectReason('');
    try {
      const res = await fetchWithAuth(`/api/auth/admin/users/${u.id}`);
      if (res.ok) setUserDetail(await res.json());
    } catch { }
    finally { setUserDetailLoading(false); }
  };

  // 비자인증 승인/거절 / Approve/reject visa verification
  const handleVisaAction = async (action: 'VERIFIED' | 'REJECTED') => {
    if (!userDetail?.visaVerification) return;
    if (action === 'REJECTED' && !visaRejectReason.trim()) return;
    setVisaActionLoading(true);
    try {
      const res = await fetchWithAuth(`/api/auth/admin/visa-verification/${userDetail.visaVerification.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          action,
          rejectionReason: action === 'REJECTED' ? visaRejectReason : undefined,
        }),
      });
      if (res.ok) {
        // 상세 다시 로드 / Reload detail
        const detailRes = await fetchWithAuth(`/api/auth/admin/users/${userDetail.id}`);
        if (detailRes.ok) setUserDetail(await detailRes.json());
        setShowVisaRejectForm(false);
        setVisaRejectReason('');
      }
    } catch { }
    finally { setVisaActionLoading(false); }
  };

  const openCorporateDetail = (u: AdminUser) => {
    setSelectedCorporate(u);
    setCorpDetailTab('info');
    setCorpJobPostings([]);
    setExpandedPosting(null);
  };

  // Corporate approve/reject
  const handleApprove = async (userId: string) => {
    if (!confirm('이 기업의 인증을 승인하시겠습니까?')) return;
    setActionLoading(true);
    try {
      const res = await fetchWithAuth(`/api/auth/admin/corporate-verifications/${userId}`, {
        method: 'PUT',
        body: JSON.stringify({ action: 'APPROVE' }),
      });
      if (res.ok) { setSelectedCorporate(null); loadUsers(); }
    } catch { }
    finally { setActionLoading(false); }
  };

  const handleReject = async () => {
    if (!rejectModal || !rejectReason.trim()) return;
    setActionLoading(true);
    try {
      const res = await fetchWithAuth(`/api/auth/admin/corporate-verifications/${rejectModal.id}`, {
        method: 'PUT',
        body: JSON.stringify({ action: 'REJECT', reason: rejectReason }),
      });
      if (res.ok) { setRejectModal(null); setRejectReason(''); setSelectedCorporate(null); loadUsers(); }
    } catch { }
    finally { setActionLoading(false); }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED': return <span className="px-2 py-1 text-xs font-bold bg-green-100 text-green-700 rounded-full">승인</span>;
      case 'SUBMITTED': return <span className="px-2 py-1 text-xs font-bold bg-sky-100 text-sky-700 rounded-full">심사대기</span>;
      case 'PENDING': return <span className="px-2 py-1 text-xs font-bold bg-gray-100 text-gray-500 rounded-full">미제출</span>;
      case 'REJECTED': return <span className="px-2 py-1 text-xs font-bold bg-red-100 text-red-700 rounded-full">거절</span>;
      default: return <span className="px-2 py-1 text-xs font-bold bg-gray-100 text-gray-500 rounded-full">{status}</span>;
    }
  };

  const userTypeBadge = (type: string) => {
    switch (type) {
      case 'INDIVIDUAL': return <span className="px-2 py-0.5 text-xs font-medium bg-teal-50 text-teal-700 rounded">개인</span>;
      case 'CORPORATE': return <span className="px-2 py-0.5 text-xs font-medium bg-indigo-50 text-indigo-700 rounded">기업</span>;
      default: return <span className="px-2 py-0.5 text-xs font-medium bg-gray-50 text-gray-700 rounded">{type}</span>;
    }
  };

  const needsActionBadge = (u: AdminUser) => {
    if (!u.needsAction) return null;
    if (u.corporate?.verificationStatus === 'SUBMITTED') {
      return <span className="px-1.5 py-0.5 text-[10px] font-bold bg-orange-100 text-orange-700 rounded-full flex items-center gap-0.5"><AlertCircle size={10} />심사필요</span>;
    }
    if (u.corporate?.ocrVerified === false) {
      return <span className="px-1.5 py-0.5 text-[10px] font-bold bg-red-100 text-red-700 rounded-full flex items-center gap-0.5"><AlertTriangle size={10} />OCR불일치</span>;
    }
    if (u.corporate?.verificationStatus === 'REJECTED') {
      return <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-700 rounded-full flex items-center gap-0.5"><AlertCircle size={10} />거절됨</span>;
    }
    return null;
  };

  const completionColor = (pct: number) => {
    if (pct >= 80) return 'bg-green-500';
    if (pct >= 50) return 'bg-yellow-500';
    return 'bg-red-400';
  };

  const getDocPreviewUrl = (docPath: string) => {
    return `/api/auth/admin/corporate-doc-file?path=${encodeURIComponent(docPath)}`;
  };

  const isImageFile = (name: string | null) => {
    if (!name) return false;
    return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(name);
  };

  const socialProviderLabel = (provider: string | null) => {
    if (!provider) return <span className="px-2 py-0.5 text-xs bg-amber-50 text-amber-700 rounded">이메일</span>;
    return <span className="px-2 py-0.5 text-xs bg-violet-50 text-violet-700 rounded">{provider}</span>;
  };

  const jobStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE': return <span className="px-2 py-0.5 text-xs font-bold bg-green-100 text-green-700 rounded-full">게시중</span>;
      case 'DRAFT': return <span className="px-2 py-0.5 text-xs font-bold bg-gray-100 text-gray-500 rounded-full">임시저장</span>;
      case 'CLOSED': return <span className="px-2 py-0.5 text-xs font-bold bg-gray-200 text-gray-600 rounded-full">마감</span>;
      case 'SUSPENDED': return <span className="px-2 py-0.5 text-xs font-bold bg-red-100 text-red-700 rounded-full">중지됨</span>;
      default: return <span className="px-2 py-0.5 text-xs font-bold bg-gray-100 text-gray-500 rounded-full">{status}</span>;
    }
  };

  return (
    <div>
      {/* User type tabs */}
      <div className="flex gap-2 mb-4">
        {([
          { key: 'ALL' as const, label: '전체 회원', icon: Users },
          { key: 'INDIVIDUAL' as const, label: '개인회원', icon: UserCheck },
          { key: 'CORPORATE' as const, label: '기업회원', icon: Building2 },
        ]).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setUserTab(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              userTab === key
                ? 'bg-sky-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      {/* Search + Sort + info */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-wrap gap-3 items-center">
        <div className="relative">
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="이름/이메일/회사명 검색"
            className="pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 w-64"
          />
          <Search size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer" onClick={handleSearch} />
        </div>

        {/* Sort dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-1.5"
          >
            <ArrowUpDown size={14} />
            {SORT_OPTIONS.find(o => o.key === sortBy)?.label || '정렬'}
            {sortOrder === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
          </button>
          {showSortMenu && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 min-w-[180px] py-1">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => handleSortChange(opt.key)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between ${
                    sortBy === opt.key ? 'text-sky-600 font-medium bg-sky-50' : 'text-gray-700'
                  }`}
                >
                  {opt.label}
                  {sortBy === opt.key && (sortOrder === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
                </button>
              ))}
            </div>
          )}
        </div>

        <button onClick={() => loadUsers()} className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-1">
          <RefreshCw size={14} /> 새로고침
        </button>
        <div className="ml-auto flex items-center gap-3 text-sm text-gray-500">
          {users.filter(u => u.needsAction).length > 0 && (
            <span className="flex items-center gap-1 text-orange-600 font-medium">
              <AlertCircle size={14} /> 조치필요 {users.filter(u => u.needsAction).length}건
            </span>
          )}
          총 <span className="font-bold text-gray-900">{meta.total}</span>명
        </div>
      </div>

      {/* Click outside to close sort menu */}
      {showSortMenu && <div className="fixed inset-0 z-10" onClick={() => setShowSortMenu(false)} />}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-gray-300" /></div>
        ) : users.length > 0 ? (
          <div className="overflow-x-auto">
            {userTab === 'INDIVIDUAL' ? (
              /* Individual members table */
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3">이름</th>
                    <th className="px-4 py-3">이메일</th>
                    <th className="px-4 py-3">국적</th>
                    <th className="px-4 py-3">비자유형</th>
                    <th className="px-4 py-3">비자만료일</th>
                    <th className="px-4 py-3">프로필 완성</th>
                    <th className="px-4 py-3">가입방식</th>
                    <th className="px-4 py-3">가입일</th>
                    <th className="px-4 py-3">상세</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {u.individual?.realName || <span className="text-gray-400">미입력</span>}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{u.email}</td>
                      <td className="px-4 py-3 text-gray-600">{u.individual?.nationality || '-'}</td>
                      <td className="px-4 py-3 text-gray-600">{u.individual?.visaType === 'PENDING' ? '미등록' : u.individual?.visaType || '-'}</td>
                      <td className="px-4 py-3 text-gray-600">{u.individual?.visaExpiryDate || '-'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${completionColor(u.individual?.profileCompletionPercent || 0)}`} style={{ width: `${u.individual?.profileCompletionPercent || 0}%` }} />
                          </div>
                          <span className="text-xs text-gray-500">{u.individual?.profileCompletionPercent || 0}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">{socialProviderLabel(u.socialProvider)}</td>
                      <td className="px-4 py-3 text-gray-600">{new Date(u.joinedAt).toLocaleDateString('ko-KR')}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => openIndividualDetail(u)} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors">
                          <Eye size={12} className="inline mr-1" />상세
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : userTab === 'CORPORATE' ? (
              /* Corporate members table */
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3">회사명</th>
                    <th className="px-4 py-3">사업자번호</th>
                    <th className="px-4 py-3">대표자</th>
                    <th className="px-4 py-3">담당자</th>
                    <th className="px-4 py-3">이메일</th>
                    <th className="px-4 py-3">인증상태</th>
                    <th className="px-4 py-3">상태</th>
                    <th className="px-4 py-3">가입일</th>
                    <th className="px-4 py-3">조치</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((u) => (
                    <tr key={u.id} className={`hover:bg-gray-50 transition-colors ${u.needsAction ? 'bg-orange-50/40' : ''}`}>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {u.corporate?.companyNameOfficial || <span className="text-gray-400">미입력</span>}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{u.corporate?.bizRegNumber || '-'}</td>
                      <td className="px-4 py-3 text-gray-600">{u.corporate?.ceoName || '-'}</td>
                      <td className="px-4 py-3 text-gray-600">{u.corporate?.managerName || '-'}</td>
                      <td className="px-4 py-3 text-gray-600">{u.email}</td>
                      <td className="px-4 py-3">{statusBadge(u.corporate?.verificationStatus || 'PENDING')}</td>
                      <td className="px-4 py-3">{needsActionBadge(u)}</td>
                      <td className="px-4 py-3 text-gray-600">{new Date(u.joinedAt).toLocaleDateString('ko-KR')}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => openCorporateDetail(u)} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors">
                            <Eye size={12} className="inline mr-1" />상세
                          </button>
                          {u.corporate?.verificationStatus === 'SUBMITTED' && (
                            <>
                              <button onClick={() => handleApprove(u.id)} disabled={actionLoading}
                                className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors disabled:opacity-50">
                                <Check size={12} className="inline mr-1" />승인
                              </button>
                              <button onClick={() => { setRejectModal(u); setRejectReason(''); }} disabled={actionLoading}
                                className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors disabled:opacity-50">
                                <X size={12} className="inline mr-1" />거절
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              /* ALL members table */
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3">유형</th>
                    <th className="px-4 py-3">이름/회사명</th>
                    <th className="px-4 py-3">이메일</th>
                    <th className="px-4 py-3">가입방식</th>
                    <th className="px-4 py-3">상태</th>
                    <th className="px-4 py-3">가입일</th>
                    <th className="px-4 py-3">최근접속</th>
                    <th className="px-4 py-3">상세</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((u) => (
                    <tr key={u.id} className={`hover:bg-gray-50 transition-colors ${u.needsAction ? 'bg-orange-50/40' : ''}`}>
                      <td className="px-4 py-3">{userTypeBadge(u.userType)}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {u.userType === 'INDIVIDUAL'
                          ? u.individual?.realName || <span className="text-gray-400">미입력</span>
                          : u.corporate?.companyNameOfficial || <span className="text-gray-400">미입력</span>}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{u.email}</td>
                      <td className="px-4 py-3">{socialProviderLabel(u.socialProvider)}</td>
                      <td className="px-4 py-3">{needsActionBadge(u)}</td>
                      <td className="px-4 py-3 text-gray-600">{new Date(u.joinedAt).toLocaleDateString('ko-KR')}</td>
                      <td className="px-4 py-3 text-gray-600">{u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString('ko-KR') : '-'}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => u.userType === 'INDIVIDUAL' ? openIndividualDetail(u) : openCorporateDetail(u)}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                        >
                          <Eye size={12} className="inline mr-1" />상세
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">
            {userTab === 'INDIVIDUAL' ? '등록된 개인 회원이 없습니다.' :
             userTab === 'CORPORATE' ? '등록된 기업 회원이 없습니다.' :
             '등록된 회원이 없습니다.'}
          </div>
        )}
      </div>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button onClick={() => handlePageChange(page - 1)} disabled={page <= 1}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed">
            <ChevronLeft size={14} />
          </button>
          {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
            .filter(p => p === 1 || p === meta.totalPages || Math.abs(p - page) <= 2)
            .map((p, idx, arr) => (
              <span key={p}>
                {idx > 0 && arr[idx - 1] !== p - 1 && <span className="text-gray-300 px-1">...</span>}
                <button
                  onClick={() => handlePageChange(p)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    p === page ? 'bg-sky-600 text-white' : 'border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {p}
                </button>
              </span>
            ))}
          <button onClick={() => handlePageChange(page + 1)} disabled={page >= meta.totalPages}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed">
            <ChevronRight size={14} />
          </button>
        </div>
      )}

      {/* 개인회원 상세 모달 (비자인증 + 이력서 포함) / Individual Detail Modal with visa + resume */}
      {selectedIndividual && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setSelectedIndividual(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto m-4" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">개인회원 상세정보</h3>
              <button onClick={() => setSelectedIndividual(null)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            {userDetailLoading ? (
              <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-gray-300" /></div>
            ) : (
              <div className="p-6 space-y-6">
                {/* 프로필 완성도 / Profile completion */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">프로필 완성도</span>
                    <span className="text-sm font-bold text-gray-900">{selectedIndividual.individual?.profileCompletionPercent || 0}%</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${completionColor(selectedIndividual.individual?.profileCompletionPercent || 0)}`}
                      style={{ width: `${selectedIndividual.individual?.profileCompletionPercent || 0}%` }}
                    />
                  </div>
                </div>

                {/* 기본 정보 / Basic info */}
                <div>
                  <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <UserCheck size={16} className="text-sky-600" /> 기본 정보
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 block mb-1">이름</span>
                      <span className="font-medium text-gray-900">{selectedIndividual.individual?.realName || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block mb-1">이메일</span>
                      <span className="font-medium text-gray-900">{selectedIndividual.email}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block mb-1">국적</span>
                      <span className="font-medium text-gray-900">{selectedIndividual.individual?.nationality || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block mb-1">성별</span>
                      <span className="font-medium text-gray-900">
                        {selectedIndividual.individual?.gender === 'MALE' ? '남성' :
                         selectedIndividual.individual?.gender === 'FEMALE' ? '여성' :
                         selectedIndividual.individual?.gender || '-'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 block mb-1">생년월일</span>
                      <span className="font-medium text-gray-900">{selectedIndividual.individual?.birthDate || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block mb-1">가입방식</span>
                      <span className="font-medium text-gray-900">{selectedIndividual.socialProvider || '이메일'}</span>
                    </div>
                  </div>
                </div>

                {/* 비자인증 상태 / Visa verification status */}
                <div>
                  <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <Shield size={16} className="text-sky-600" /> 비자 인증
                  </h4>
                  {userDetail?.visaVerification ? (
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-gray-900">{userDetail.visaVerification.visaCode}</span>
                          {userDetail.visaVerification.visaSubType && (
                            <span className="text-xs text-gray-500">({userDetail.visaVerification.visaSubType})</span>
                          )}
                          {(() => {
                            const st = userDetail.visaVerification.verificationStatus;
                            const config: Record<string, { label: string; style: string }> = {
                              PENDING: { label: '대기중', style: 'bg-gray-100 text-gray-600' },
                              SUBMITTED: { label: '심사대기', style: 'bg-sky-100 text-sky-700' },
                              VERIFIED: { label: '인증완료', style: 'bg-green-100 text-green-700' },
                              REJECTED: { label: '거절됨', style: 'bg-red-100 text-red-700' },
                            };
                            const { label, style } = config[st] || { label: st, style: 'bg-gray-100 text-gray-600' };
                            return <span className={`px-2 py-1 text-xs font-bold rounded ${style}`}>{label}</span>;
                          })()}
                        </div>
                        <span className="text-xs text-gray-500">
                          {userDetail.visaVerification.verificationMethod === 'OCR' ? 'OCR 인증' : '수동 입력'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500 block mb-1">만료일</span>
                          <span className="font-medium text-gray-900">
                            {userDetail.visaVerification.visaExpiryDate
                              ? new Date(userDetail.visaVerification.visaExpiryDate).toLocaleDateString('ko-KR')
                              : '-'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 block mb-1">외국인등록번호</span>
                          <span className="font-medium text-gray-900">
                            {userDetail.visaVerification.foreignRegistrationNumber || '-'}
                          </span>
                        </div>
                      </div>

                      {/* 거절 사유 / Rejection reason */}
                      {userDetail.visaVerification.rejectionReason && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <span className="text-xs font-bold text-red-700">거절 사유: </span>
                          <span className="text-sm text-red-600">{userDetail.visaVerification.rejectionReason}</span>
                        </div>
                      )}

                      {/* 승인/거절 버튼 / Approve/Reject buttons */}
                      {userDetail.visaVerification.verificationStatus === 'SUBMITTED' && (
                        <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                          <button
                            onClick={() => handleVisaAction('VERIFIED')}
                            disabled={visaActionLoading}
                            className="px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-1"
                          >
                            {visaActionLoading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                            승인
                          </button>
                          <button
                            onClick={() => setShowVisaRejectForm(!showVisaRejectForm)}
                            disabled={visaActionLoading}
                            className="px-4 py-2 bg-red-100 text-red-700 text-sm font-bold rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 flex items-center gap-1"
                          >
                            <Ban size={14} /> 거절
                          </button>
                        </div>
                      )}

                      {/* 거절 사유 입력 폼 / Rejection reason form */}
                      {showVisaRejectForm && (
                        <div className="pt-2 space-y-2">
                          <textarea
                            value={visaRejectReason}
                            onChange={(e) => setVisaRejectReason(e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                            placeholder="거절 사유를 입력하세요..."
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleVisaAction('REJECTED')}
                              disabled={visaActionLoading || !visaRejectReason.trim()}
                              className="px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                              {visaActionLoading ? <Loader2 size={14} className="animate-spin inline mr-1" /> : null}
                              거절 확인
                            </button>
                            <button
                              onClick={() => { setShowVisaRejectForm(false); setVisaRejectReason(''); }}
                              className="px-4 py-2 text-gray-600 text-sm rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              취소
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-xl p-4 text-center text-sm text-gray-400">
                      비자 인증 정보가 없습니다.
                    </div>
                  )}
                </div>

                {/* 이력서 / Resume */}
                {userDetail?.resume && (
                  <div>
                    <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                      <FileText size={16} className="text-sky-600" /> 이력서
                    </h4>
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500 block mb-1">TOPIK</span>
                          <span className="font-medium text-gray-900">{userDetail.resume.topikLevel != null ? `${userDetail.resume.topikLevel}급` : '-'}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block mb-1">KIIP</span>
                          <span className="font-medium text-gray-900">{userDetail.resume.kiipLevel != null ? `${userDetail.resume.kiipLevel}단계` : '-'}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block mb-1">희망 급여</span>
                          <span className="font-medium text-gray-900">{userDetail.resume.preferredSalary ? `${userDetail.resume.preferredSalary.toLocaleString()}만원` : '-'}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block mb-1">작성 상태</span>
                          <span className={`px-2 py-1 text-xs font-bold rounded ${userDetail.resume.isComplete ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {userDetail.resume.isComplete ? '완성' : '작성중'}
                          </span>
                        </div>
                      </div>
                      {userDetail.resume.preferredJobTypes?.length > 0 && (
                        <div className="text-sm">
                          <span className="text-gray-500 block mb-1">희망 고용형태</span>
                          <div className="flex gap-1.5">
                            {userDetail.resume.preferredJobTypes.map((t: string) => (
                              <span key={t} className="px-2 py-0.5 text-xs bg-sky-50 text-sky-700 rounded">{t}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {userDetail.resume.preferredRegions?.length > 0 && (
                        <div className="text-sm">
                          <span className="text-gray-500 block mb-1">희망 지역</span>
                          <div className="flex gap-1.5 flex-wrap">
                            {userDetail.resume.preferredRegions.map((r: string) => (
                              <span key={r} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded">{r}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 취업 희망 정보 / Job preferences */}
                <div>
                  <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <Briefcase size={16} className="text-sky-600" /> 취업 희망 정보
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 block mb-1">희망 직종</span>
                      <span className="font-medium text-gray-900">{selectedIndividual.individual?.desiredJobType || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block mb-1">희망 급여</span>
                      <span className="font-medium text-gray-900">
                        {selectedIndividual.individual?.desiredSalary
                          ? `${selectedIndividual.individual.desiredSalary.toLocaleString()}원`
                          : '-'}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500 block mb-1">희망 산업</span>
                      <span className="font-medium text-gray-900">{selectedIndividual.individual?.desiredIndustries || '-'}</span>
                    </div>
                  </div>
                </div>

                {/* 역량 정보 / Competency */}
                <div>
                  <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <FileText size={16} className="text-sky-600" /> 역량 정보
                  </h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 block mb-1">최종학력</span>
                      <span className="font-medium text-gray-900">{selectedIndividual.individual?.finalEducationLvl || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block mb-1">한국어 수준</span>
                      <span className="font-medium text-gray-900">{selectedIndividual.individual?.koreanFluencyLvl || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block mb-1">총 경력</span>
                      <span className="font-medium text-gray-900">
                        {selectedIndividual.individual?.totalCareerMonths
                          ? `${Math.floor(selectedIndividual.individual.totalCareerMonths / 12)}년 ${selectedIndividual.individual.totalCareerMonths % 12}개월`
                          : '-'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 날짜 / Dates */}
                <div className="border-t border-gray-100 pt-4 grid grid-cols-2 gap-4 text-sm text-gray-500">
                  <div>
                    <span className="block mb-1">가입일</span>
                    <span className="text-gray-900">{new Date(selectedIndividual.joinedAt).toLocaleDateString('ko-KR')}</span>
                  </div>
                  <div>
                    <span className="block mb-1">최근 접속</span>
                    <span className="text-gray-900">{selectedIndividual.lastLoginAt ? new Date(selectedIndividual.lastLoginAt).toLocaleDateString('ko-KR') : '-'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Corporate Detail Slide-out Drawer */}
      {selectedCorporate && selectedCorporate.corporate && (
        <>
          <div className="fixed inset-0 z-50 bg-black/30" onClick={() => setSelectedCorporate(null)} />
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-3xl bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Drawer header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <Building2 size={20} className="text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {selectedCorporate.corporate.companyNameOfficial || '기업회원'}
                  </h3>
                  <p className="text-sm text-gray-500">{selectedCorporate.email}</p>
                </div>
                <div className="flex items-center gap-2 ml-3">
                  {statusBadge(selectedCorporate.corporate.verificationStatus)}
                  {needsActionBadge(selectedCorporate)}
                </div>
              </div>
              <button onClick={() => setSelectedCorporate(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            {/* Drawer tabs */}
            <div className="flex border-b border-gray-200 shrink-0">
              <button
                onClick={() => setCorpDetailTab('info')}
                className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${
                  corpDetailTab === 'info'
                    ? 'text-sky-600 border-b-2 border-sky-600 bg-sky-50/50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Building2 size={14} className="inline mr-1.5" />기업정보
              </button>
              <button
                onClick={() => {
                  setCorpDetailTab('postings');
                  if (corpJobPostings.length === 0 && selectedCorporate.corporate?.companyNameOfficial) {
                    loadCorpJobPostings(selectedCorporate.corporate.companyNameOfficial);
                  }
                }}
                className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${
                  corpDetailTab === 'postings'
                    ? 'text-sky-600 border-b-2 border-sky-600 bg-sky-50/50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Briefcase size={14} className="inline mr-1.5" />등록공고
              </button>
            </div>

            {/* Drawer content */}
            <div className="flex-1 overflow-y-auto p-6">
              {corpDetailTab === 'info' ? (
                <div className="space-y-6">
                  {/* Rejection reason */}
                  {selectedCorporate.corporate.lastRejectionReason && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                      <AlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-sm font-bold text-red-700">거절 사유</span>
                        <p className="text-sm text-red-600 mt-1">{selectedCorporate.corporate.lastRejectionReason}</p>
                      </div>
                    </div>
                  )}

                  {/* Status + method */}
                  <div className="flex items-center gap-3">
                    {selectedCorporate.corporate.verificationMethod && (
                      <span className="px-2 py-1 text-xs bg-purple-50 text-purple-700 rounded-full">
                        {selectedCorporate.corporate.verificationMethod === 'CEO_MATCH' ? '대표자 자동인증' : '서류 수동심사'}
                      </span>
                    )}
                  </div>

                  {/* Company info */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                      <Building2 size={16} className="text-sky-600" /> 회사 정보
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500 block mb-1">회사명</span>
                        <span className="font-medium text-gray-900">{selectedCorporate.corporate.companyNameOfficial || '-'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block mb-1">사업자등록번호</span>
                        <span className="font-medium text-gray-900">{selectedCorporate.corporate.bizRegNumber || '-'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block mb-1">대표자명</span>
                        <span className="font-medium text-gray-900">{selectedCorporate.corporate.ceoName || '-'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block mb-1">이메일</span>
                        <span className="font-medium text-gray-900">{selectedCorporate.email}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block mb-1">담당자명</span>
                        <span className="font-medium text-gray-900">{selectedCorporate.corporate.managerName || '-'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block mb-1">담당자 연락처</span>
                        <span className="font-medium text-gray-900">{selectedCorporate.corporate.managerPhone || '-'}</span>
                      </div>
                    </div>
                  </div>

                  {/* OCR Verification */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                      <FileCheck size={16} className="text-sky-600" /> OCR 검증 결과
                    </h4>
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500 block mb-1">입력 사업자번호</span>
                          <span className="font-medium text-gray-900 font-mono">{selectedCorporate.corporate.bizRegNumber || '-'}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block mb-1">OCR 추출 번호</span>
                          <span className="font-medium text-gray-900 font-mono">{selectedCorporate.corporate.ocrExtractedBizNo || '미추출'}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-sm text-gray-500">OCR 검증:</span>
                        {selectedCorporate.corporate.ocrVerified === true ? (
                          <span className="px-3 py-1 text-xs font-bold bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                            <Check size={12} /> 일치
                          </span>
                        ) : selectedCorporate.corporate.ocrVerified === false ? (
                          <span className="px-3 py-1 text-xs font-bold bg-red-100 text-red-700 rounded-full flex items-center gap-1">
                            <AlertTriangle size={12} /> 불일치
                          </span>
                        ) : (
                          <span className="px-3 py-1 text-xs font-bold bg-gray-100 text-gray-500 rounded-full">미검증</span>
                        )}
                        <span className="text-sm text-gray-500 ml-4">대표자 본인 선언:</span>
                        {selectedCorporate.corporate.isCeoSelf ? (
                          <span className="px-3 py-1 text-xs font-bold bg-blue-100 text-blue-700 rounded-full flex items-center gap-1">
                            <Check size={12} /> 본인
                          </span>
                        ) : (
                          <span className="px-3 py-1 text-xs font-bold bg-gray-100 text-gray-500 rounded-full">아니오</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Documents */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                      <FileText size={16} className="text-sky-600" /> 제출 서류
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border border-gray-200 rounded-xl p-4">
                        <span className="text-sm font-medium text-gray-700 block mb-2">사업자등록증</span>
                        {selectedCorporate.corporate.bizRegDocPath ? (
                          <div>
                            <p className="text-xs text-gray-500 mb-2 truncate" title={selectedCorporate.corporate.bizRegDocOrigName || ''}>
                              {selectedCorporate.corporate.bizRegDocOrigName || '파일'}
                            </p>
                            {isImageFile(selectedCorporate.corporate.bizRegDocOrigName) ? (
                              <img
                                src={getDocPreviewUrl(selectedCorporate.corporate.bizRegDocPath)}
                                alt="사업자등록증"
                                className="w-full max-h-48 object-contain rounded-lg border border-gray-100 cursor-pointer hover:opacity-80"
                                onClick={() => setDocPreview({
                                  url: getDocPreviewUrl(selectedCorporate.corporate!.bizRegDocPath!),
                                  name: selectedCorporate.corporate!.bizRegDocOrigName || '사업자등록증',
                                  type: 'image',
                                })}
                              />
                            ) : (
                              <a href={getDocPreviewUrl(selectedCorporate.corporate.bizRegDocPath)} target="_blank" rel="noopener noreferrer"
                                className="text-sky-600 hover:text-sky-700 text-sm flex items-center gap-1">
                                <ExternalLink size={14} /> PDF 열기
                              </a>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">미업로드</span>
                        )}
                      </div>
                      <div className="border border-gray-200 rounded-xl p-4">
                        <span className="text-sm font-medium text-gray-700 block mb-2">재직증명서</span>
                        {selectedCorporate.corporate.empCertDocPath ? (
                          <div>
                            <p className="text-xs text-gray-500 mb-2 truncate" title={selectedCorporate.corporate.empCertDocOrigName || ''}>
                              {selectedCorporate.corporate.empCertDocOrigName || '파일'}
                            </p>
                            {isImageFile(selectedCorporate.corporate.empCertDocOrigName) ? (
                              <img
                                src={getDocPreviewUrl(selectedCorporate.corporate.empCertDocPath)}
                                alt="재직증명서"
                                className="w-full max-h-48 object-contain rounded-lg border border-gray-100 cursor-pointer hover:opacity-80"
                                onClick={() => setDocPreview({
                                  url: getDocPreviewUrl(selectedCorporate.corporate!.empCertDocPath!),
                                  name: selectedCorporate.corporate!.empCertDocOrigName || '재직증명서',
                                  type: 'image',
                                })}
                              />
                            ) : (
                              <a href={getDocPreviewUrl(selectedCorporate.corporate.empCertDocPath)} target="_blank" rel="noopener noreferrer"
                                className="text-sky-600 hover:text-sky-700 text-sm flex items-center gap-1">
                                <ExternalLink size={14} /> PDF 열기
                              </a>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">미업로드</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="border-t border-gray-100 pt-4 grid grid-cols-3 gap-4 text-sm text-gray-500">
                    <div>
                      <span className="block mb-1">가입일</span>
                      <span className="text-gray-900">{new Date(selectedCorporate.joinedAt).toLocaleDateString('ko-KR')}</span>
                    </div>
                    <div>
                      <span className="block mb-1">제출일</span>
                      <span className="text-gray-900">{selectedCorporate.corporate.submittedAt ? new Date(selectedCorporate.corporate.submittedAt).toLocaleDateString('ko-KR') : '-'}</span>
                    </div>
                    <div>
                      <span className="block mb-1">승인일</span>
                      <span className="text-gray-900">{selectedCorporate.corporate.approvedAt ? new Date(selectedCorporate.corporate.approvedAt).toLocaleDateString('ko-KR') : '-'}</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  {selectedCorporate.corporate.verificationStatus === 'SUBMITTED' && (
                    <div className="border-t border-gray-100 pt-4 flex gap-3">
                      <button onClick={() => handleApprove(selectedCorporate.id)} disabled={actionLoading}
                        className="flex-1 py-2.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                        {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} 승인
                      </button>
                      <button onClick={() => { setRejectModal(selectedCorporate); setRejectReason(''); }} disabled={actionLoading}
                        className="flex-1 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                        <X size={16} /> 거절
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* 등록공고 탭 */
                <div className="space-y-4">
                  {corpJobsLoading ? (
                    <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-gray-300" /></div>
                  ) : corpJobPostings.length > 0 ? (
                    corpJobPostings.map((job: any) => (
                      <div key={job.id} className="border border-gray-200 rounded-xl overflow-hidden">
                        <button
                          onClick={() => setExpandedPosting(expandedPosting === job.id ? null : job.id)}
                          className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className={`px-2 py-0.5 text-xs font-bold rounded-full shrink-0 ${
                              job.boardType === 'PART_TIME' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                            }`}>
                              {job.boardType === 'PART_TIME' ? '알바' : '정규직'}
                            </span>
                            <span className="font-medium text-gray-900 truncate">{job.title}</span>
                            {jobStatusBadge(job.status)}
                          </div>
                          <div className="flex items-center gap-3 shrink-0 ml-3">
                            <span className="text-xs text-gray-500">{job.createdAt ? new Date(job.createdAt).toLocaleDateString('ko-KR') : ''}</span>
                            <ChevronDown size={16} className={`text-gray-400 transition-transform ${expandedPosting === job.id ? 'rotate-180' : ''}`} />
                          </div>
                        </button>
                        {expandedPosting === job.id && (
                          <div className="border-t border-gray-100 p-4 bg-gray-50 space-y-3">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500 block mb-1">티어</span>
                                <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                                  job.tierType === 'PREMIUM' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                                }`}>{job.tierType || 'STANDARD'}</span>
                              </div>
                              <div>
                                <span className="text-gray-500 block mb-1">허용 비자</span>
                                <span className="font-medium text-gray-900">{job.allowedVisas || '-'}</span>
                              </div>
                              <div>
                                <span className="text-gray-500 block mb-1">근무지</span>
                                <span className="font-medium text-gray-900">{job.displayAddress || '-'}</span>
                              </div>
                              <div>
                                <span className="text-gray-500 block mb-1">급여</span>
                                <span className="font-medium text-gray-900">
                                  {job.albaAttributes
                                    ? `시급 ${job.albaAttributes.hourlyWage?.toLocaleString()}원`
                                    : job.fulltimeAttributes
                                      ? `연봉 ${(job.fulltimeAttributes.salaryMin / 10000)?.toLocaleString()}만 ~ ${(job.fulltimeAttributes.salaryMax / 10000)?.toLocaleString()}만원`
                                      : '-'}
                                </span>
                              </div>
                              {job.albaAttributes && (
                                <>
                                  <div>
                                    <span className="text-gray-500 block mb-1">근무시간</span>
                                    <span className="font-medium text-gray-900">
                                      {job.albaAttributes.workTimeStart || ''} ~ {job.albaAttributes.workTimeEnd || ''}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-gray-500 block mb-1">근무기간</span>
                                    <span className="font-medium text-gray-900">{job.albaAttributes.workPeriod || '-'}</span>
                                  </div>
                                </>
                              )}
                              {job.fulltimeAttributes && (
                                <>
                                  <div>
                                    <span className="text-gray-500 block mb-1">경력</span>
                                    <span className="font-medium text-gray-900">{job.fulltimeAttributes.experienceLevel || '-'}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-500 block mb-1">학력</span>
                                    <span className="font-medium text-gray-900">{job.fulltimeAttributes.educationLevel || '-'}</span>
                                  </div>
                                </>
                              )}
                              <div>
                                <span className="text-gray-500 block mb-1">조회 / 지원 / 스크랩</span>
                                <span className="font-medium text-gray-900">
                                  {job.viewCount || 0} / {job.applyCount || 0} / {job.scrapCount || 0}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500 block mb-1">등록일</span>
                                <span className="font-medium text-gray-900">{job.createdAt ? new Date(job.createdAt).toLocaleDateString('ko-KR') : '-'}</span>
                              </div>
                            </div>
                            {job.description && (
                              <div className="text-sm">
                                <span className="text-gray-500 block mb-1">공고 내용</span>
                                <p className="text-gray-700 whitespace-pre-wrap bg-white rounded-lg p-3 border border-gray-200 max-h-48 overflow-y-auto text-xs leading-relaxed">
                                  {job.description}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-16 text-gray-400">
                      <Briefcase size={40} className="mx-auto mb-3 text-gray-300" />
                      <p className="text-sm">등록된 공고가 없습니다.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Image fullscreen preview modal */}
      {docPreview && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70" onClick={() => setDocPreview(null)}>
          <div className="relative max-w-4xl max-h-[90vh] m-4" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setDocPreview(null)}
              className="absolute -top-3 -right-3 z-10 bg-white rounded-full p-1.5 shadow-lg hover:bg-gray-100">
              <X size={18} className="text-gray-600" />
            </button>
            <div className="bg-white rounded-xl p-2 shadow-2xl">
              <p className="text-sm text-gray-600 px-2 py-1 mb-1">{docPreview.name}</p>
              <img src={docPreview.url} alt={docPreview.name} className="max-w-full max-h-[80vh] object-contain rounded-lg" />
            </div>
          </div>
        </div>
      )}

      {/* Reject reason modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40" onClick={() => setRejectModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md m-4" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">기업 인증 거절</h3>
              <p className="text-sm text-gray-500 mt-1">
                {rejectModal.corporate?.companyNameOfficial || rejectModal.email}의 인증을 거절합니다.
              </p>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">거절 사유 (필수)</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="거절 사유를 입력해주세요. 기업 회원에게 전달됩니다."
                rows={4}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              />
              <div className="flex gap-3 mt-4">
                <button onClick={() => setRejectModal(null)}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">
                  취소
                </button>
                <button onClick={handleReject} disabled={!rejectReason.trim() || actionLoading}
                  className="flex-1 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <X size={16} />} 거절 확인
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PolicyManagementContent({
  activeTab, onTabChange, fetchWithAuth,
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
  fetchWithAuth: FetchFn;
}) {
  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 mb-6 bg-white rounded-xl border border-gray-200 p-1.5">
        {POLICY_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-sky-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'changes' && <PolicyChangesTab fetchWithAuth={fetchWithAuth} />}
      {activeTab === 'rules' && <RulesTab fetchWithAuth={fetchWithAuth} />}
      {activeTab === 'visa-types' && <VisaTypesTab fetchWithAuth={fetchWithAuth} />}
      {activeTab === 'industry-codes' && <IndustryCodesTab fetchWithAuth={fetchWithAuth} />}
      {activeTab === 'test' && <RuleTestTab fetchWithAuth={fetchWithAuth} />}
    </div>
  );
}

// ---- Tab 1: 정책 변경 피드 ----

interface PolicyChangeItem {
  id: string;
  sourceSite: string;
  sourceUrl: string;
  pageTitle: string | null;
  summary: string;
  previousContent: string | null;
  currentContent: string | null;
  changeType: string;
  affectedVisaTypes: string | null;
  effectiveDate: string | null;
  reviewStatus: string;
  reviewedBy: string | null;
  reviewedAt: string | null;
  reviewNote: string | null;
  draftRuleId: string | null;
  detectedAt: string;
}

interface ScrapingStatusItem {
  id: string;
  siteKey: string;
  siteUrl: string;
  siteName: string;
  lastScrapedAt: string | null;
  lastStatus: string;
  lastError: string | null;
  totalChangesFound: number;
}

const SITE_NAMES: Record<string, string> = {
  law_go_kr: '국가법령정보센터',
  immigration_go_kr: '출입국외국인정책본부',
  eps_go_kr: '외국인고용관리시스템',
  moel_go_kr: '고용노동부',
  hikorea_go_kr: '하이코리아',
};

const REVIEW_STATUS_CONFIG: Record<string, { label: string; style: string }> = {
  PENDING: { label: '검토대기', style: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  REVIEWED: { label: '검토완료', style: 'bg-blue-50 text-blue-700 border-blue-200' },
  RULE_DRAFTED: { label: '규칙초안', style: 'bg-purple-50 text-purple-700 border-purple-200' },
  APPLIED: { label: '적용완료', style: 'bg-green-50 text-green-700 border-green-200' },
  DISMISSED: { label: '무시', style: 'bg-gray-50 text-gray-500 border-gray-200' },
};

function PolicyChangesTab({ fetchWithAuth }: { fetchWithAuth: FetchFn }) {
  const [changes, setChanges] = useState<PolicyChangeItem[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 20, totalPages: 0 });
  const [loading, setLoading] = useState(false);
  const [scrapingStatus, setScrapingStatus] = useState<ScrapingStatusItem[]>([]);
  const [scrapingLoading, setScrapingLoading] = useState(false);
  const [selectedChange, setSelectedChange] = useState<PolicyChangeItem | null>(null);
  const [reviewForm, setReviewForm] = useState({ reviewStatus: '', reviewNote: '', affectedVisaTypes: '' });
  const [filters, setFilters] = useState({ sourceSite: '', reviewStatus: '', page: 1 });
  const [triggerLoading, setTriggerLoading] = useState(false);

  const loadChanges = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.sourceSite) params.set('sourceSite', filters.sourceSite);
      if (filters.reviewStatus) params.set('reviewStatus', filters.reviewStatus);
      params.set('page', String(filters.page));
      const res = await fetchWithAuth(`/api/policy/changes?${params}`);
      if (res.ok) {
        const data = await res.json();
        setChanges(data.data || []);
        setMeta(data.meta || { total: 0, page: 1, limit: 20, totalPages: 0 });
      }
    } catch { }
    finally { setLoading(false); }
  };

  const loadScrapingStatus = async () => {
    setScrapingLoading(true);
    try {
      const res = await fetchWithAuth('/api/policy/scraping/status');
      if (res.ok) setScrapingStatus(await res.json());
    } catch { }
    finally { setScrapingLoading(false); }
  };

  useEffect(() => { loadChanges(); loadScrapingStatus(); }, [filters]);

  const handleTriggerScraping = async (siteKey?: string) => {
    setTriggerLoading(true);
    try {
      await fetchWithAuth('/api/policy/scraping/trigger', {
        method: 'POST',
        body: JSON.stringify(siteKey ? { siteKey } : {}),
      });
      setTimeout(() => { loadScrapingStatus(); loadChanges(); }, 2000);
    } catch { }
    finally { setTriggerLoading(false); }
  };

  const handleReview = async () => {
    if (!selectedChange) return;
    try {
      const res = await fetchWithAuth(`/api/policy/changes/${selectedChange.id}/review`, {
        method: 'PUT',
        body: JSON.stringify(reviewForm),
      });
      if (res.ok) {
        setSelectedChange(null);
        loadChanges();
      }
    } catch { }
  };

  const handleCreateDraftRule = async (changeId: string) => {
    try {
      const res = await fetchWithAuth(`/api/policy/changes/${changeId}/create-draft-rule`, { method: 'POST' });
      if (res.ok) loadChanges();
    } catch { }
  };

  const ScrapingStatusBadge = ({ status }: { status: string }) => {
    const configs: Record<string, string> = {
      SUCCESS: 'bg-green-100 text-green-700',
      FAILED: 'bg-red-100 text-red-700',
      RUNNING: 'bg-blue-100 text-blue-700',
      IDLE: 'bg-gray-100 text-gray-500',
    };
    return <span className={`px-2 py-0.5 text-[11px] font-bold rounded ${configs[status] || configs.IDLE}`}>{status}</span>;
  };

  // Detail view
  if (selectedChange) {
    return (
      <div>
        <button onClick={() => setSelectedChange(null)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-4">
          <ChevronLeft size={16} /> 목록으로
        </button>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-2 py-1 text-[11px] font-bold rounded border ${REVIEW_STATUS_CONFIG[selectedChange.reviewStatus]?.style || ''}`}>
                {REVIEW_STATUS_CONFIG[selectedChange.reviewStatus]?.label || selectedChange.reviewStatus}
              </span>
              <span className="text-xs text-gray-400">{SITE_NAMES[selectedChange.sourceSite] || selectedChange.sourceSite}</span>
              <span className="text-xs text-gray-400">{new Date(selectedChange.detectedAt).toLocaleString('ko-KR')}</span>
            </div>
            <h2 className="text-lg font-bold text-gray-900">{selectedChange.pageTitle || selectedChange.summary.substring(0, 60)}</h2>
          </div>

          <div className="p-6 space-y-6">
            {/* Content comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold text-gray-500 mb-2">이전 내용</p>
                <div className="bg-red-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap min-h-[100px] max-h-[300px] overflow-y-auto border border-red-100">
                  {selectedChange.previousContent || '(없음)'}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 mb-2">현재 내용</p>
                <div className="bg-green-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap min-h-[100px] max-h-[300px] overflow-y-auto border border-green-100">
                  {selectedChange.currentContent || selectedChange.summary}
                </div>
              </div>
            </div>

            {/* Source link */}
            {selectedChange.sourceUrl && (
              <div>
                <p className="text-xs font-bold text-gray-500 mb-1">출처</p>
                <a href={selectedChange.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-sky-600 hover:underline break-all">
                  {selectedChange.sourceUrl}
                </a>
              </div>
            )}

            {/* Review form */}
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-sm font-bold text-gray-700 mb-4">검토 처리</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">검토 상태</label>
                  <select
                    value={reviewForm.reviewStatus}
                    onChange={(e) => setReviewForm(p => ({ ...p, reviewStatus: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="">선택</option>
                    <option value="REVIEWED">검토완료</option>
                    <option value="APPLIED">적용완료</option>
                    <option value="DISMISSED">무시</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">영향 비자 유형</label>
                  <input
                    type="text"
                    value={reviewForm.affectedVisaTypes}
                    onChange={(e) => setReviewForm(p => ({ ...p, affectedVisaTypes: e.target.value }))}
                    placeholder="예: E-9, H-2"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="text-xs font-medium text-gray-500 mb-1 block">검토 메모</label>
                <textarea
                  value={reviewForm.reviewNote}
                  onChange={(e) => setReviewForm(p => ({ ...p, reviewNote: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
                  placeholder="검토 의견을 입력하세요..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleReview}
                  disabled={!reviewForm.reviewStatus}
                  className="px-5 py-2.5 bg-sky-500 text-white text-sm font-bold rounded-lg hover:bg-sky-600 disabled:opacity-50 flex items-center gap-2"
                >
                  <Check size={14} /> 검토 저장
                </button>
                {selectedChange.reviewStatus !== 'RULE_DRAFTED' && selectedChange.affectedVisaTypes && (
                  <button
                    onClick={() => handleCreateDraftRule(selectedChange.id)}
                    className="px-5 py-2.5 bg-purple-500 text-white text-sm font-bold rounded-lg hover:bg-purple-600 flex items-center gap-2"
                  >
                    <FileCheck size={14} /> 규칙 초안 생성
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Scraping Status Widget */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-700">스크래핑 현황</h3>
          <button
            onClick={() => handleTriggerScraping()}
            disabled={triggerLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-500 text-white text-xs font-bold rounded-lg hover:bg-sky-600 disabled:opacity-50"
          >
            {triggerLoading ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} />}
            전체 수동 실행
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {scrapingStatus.map((s) => (
            <div key={s.siteKey} className="border border-gray-100 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-gray-700 truncate">{s.siteName}</span>
                <ScrapingStatusBadge status={s.lastStatus} />
              </div>
              <p className="text-[11px] text-gray-400">
                {s.lastScrapedAt ? new Date(s.lastScrapedAt).toLocaleString('ko-KR', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : '미실행'}
              </p>
              <p className="text-[11px] text-gray-500 mt-1">감지: {s.totalChangesFound}건</p>
              {s.lastError && <p className="text-[11px] text-red-500 mt-1 truncate" title={s.lastError}>{s.lastError}</p>}
            </div>
          ))}
          {scrapingStatus.length === 0 && !scrapingLoading && (
            <p className="text-xs text-gray-400 col-span-5">스크래핑 상태 정보가 없습니다.</p>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-wrap gap-3 items-center">
        <select
          value={filters.sourceSite}
          onChange={(e) => setFilters(p => ({ ...p, sourceSite: e.target.value, page: 1 }))}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          <option value="">전체 출처</option>
          {Object.entries(SITE_NAMES).map(([key, name]) => (
            <option key={key} value={key}>{name}</option>
          ))}
        </select>
        <select
          value={filters.reviewStatus}
          onChange={(e) => setFilters(p => ({ ...p, reviewStatus: e.target.value, page: 1 }))}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          <option value="">전체 상태</option>
          {Object.entries(REVIEW_STATUS_CONFIG).map(([key, { label }]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        <div className="ml-auto text-sm text-gray-500">총 <span className="font-bold text-gray-900">{meta.total}</span>건</div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-gray-300" /></div>
        ) : changes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3">출처</th>
                  <th className="px-4 py-3">감지일</th>
                  <th className="px-4 py-3">제목/요약</th>
                  <th className="px-4 py-3">유형</th>
                  <th className="px-4 py-3">영향 비자</th>
                  <th className="px-4 py-3">상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {changes.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => { setSelectedChange(c); setReviewForm({ reviewStatus: '', reviewNote: '', affectedVisaTypes: c.affectedVisaTypes || '' }); }}
                    className="hover:bg-sky-50/50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 text-xs text-gray-600">{SITE_NAMES[c.sourceSite] || c.sourceSite}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{new Date(c.detectedAt).toLocaleDateString('ko-KR')}</td>
                    <td className="px-4 py-3 font-medium text-gray-900 max-w-xs truncate">{c.pageTitle || c.summary.substring(0, 50)}</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[11px] rounded">{c.changeType}</span></td>
                    <td className="px-4 py-3 text-xs text-gray-500">{c.affectedVisaTypes || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-[11px] font-bold rounded border ${REVIEW_STATUS_CONFIG[c.reviewStatus]?.style || ''}`}>
                        {REVIEW_STATUS_CONFIG[c.reviewStatus]?.label || c.reviewStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center py-16 text-gray-400">
            <AlertTriangle className="w-8 h-8 mb-2 text-gray-200" />
            <p className="text-sm">감지된 정책 변경이 없습니다.</p>
          </div>
        )}

        {meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
            <button onClick={() => setFilters(p => ({ ...p, page: p.page - 1 }))} disabled={filters.page <= 1} className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-white rounded-lg border border-gray-200 disabled:opacity-40">
              <ChevronLeft size={14} /> 이전
            </button>
            <span className="text-sm text-gray-500">{meta.page} / {meta.totalPages}</span>
            <button onClick={() => setFilters(p => ({ ...p, page: p.page + 1 }))} disabled={filters.page >= meta.totalPages} className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-white rounded-lg border border-gray-200 disabled:opacity-40">
              다음 <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ---- Tab 2: 규칙 관리 (하이브리드 UI) ----

interface VisaRuleItem {
  id: string;
  visaTypeId: string;
  visaTypeCode?: string;
  visaTypeName?: string;
  ruleName: string;
  ruleDescription: string | null;
  priority: number;
  ruleType: string;
  conditions: string;
  actions: string;
  version: number;
  status: string;
  effectiveFrom: string;
  effectiveTo: string | null;
  createdAt: string;
}

interface Clause {
  field: string;
  op: string;
  value: any;
  of?: string;
  percent?: number;
}

interface ConditionBlock {
  operator: string;
  clauses: Clause[];
}

interface RuleActionData {
  type: string;
  documents?: string[];
  restrictions?: string[];
  notes?: string;
  reason?: string;
  suggestion?: string;
}

const RULE_FIELDS = [
  { value: 'ksicCode', label: 'KSIC 업종코드' },
  { value: 'companySizeType', label: '기업 규모' },
  { value: 'employeeCountKorean', label: '한국인 직원수' },
  { value: 'employeeCountForeign', label: '외국인 직원수' },
  { value: 'annualRevenue', label: '연매출(만원)' },
  { value: 'addressRoad', label: '소재지' },
  { value: 'jobType', label: '직종' },
  { value: 'offeredSalary', label: '제시급여(만원)' },
];

const RULE_OPS = [
  { value: 'EQ', label: '=' },
  { value: 'NEQ', label: '!=' },
  { value: 'GT', label: '>' },
  { value: 'GTE', label: '>=' },
  { value: 'LT', label: '<' },
  { value: 'LTE', label: '<=' },
  { value: 'IN', label: 'IN (포함)' },
  { value: 'NOT_IN', label: 'NOT IN' },
  { value: 'STARTS_WITH', label: '시작값' },
  { value: 'CONTAINS', label: '포함' },
  { value: 'PERCENTAGE_LTE', label: '% 이하' },
];

const RULE_STATUS_CONFIG: Record<string, { label: string; style: string }> = {
  DRAFT: { label: '초안', style: 'bg-yellow-50 text-yellow-700' },
  ACTIVE: { label: '활성', style: 'bg-green-50 text-green-700' },
  INACTIVE: { label: '비활성', style: 'bg-gray-50 text-gray-500' },
  ARCHIVED: { label: '보관', style: 'bg-gray-50 text-gray-400' },
};

function RulesTab({ fetchWithAuth }: { fetchWithAuth: FetchFn }) {
  const [rules, setRules] = useState<VisaRuleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'list' | 'create' | 'edit'>('list');
  const [editingRule, setEditingRule] = useState<VisaRuleItem | null>(null);
  const [visaTypes, setVisaTypes] = useState<{ id: string; code: string; nameKo: string }[]>([]);

  // Form state
  const [form, setForm] = useState({
    visaTypeId: '',
    ruleName: '',
    ruleDescription: '',
    priority: 100,
    ruleType: 'ELIGIBILITY',
    effectiveFrom: new Date().toISOString().split('T')[0],
    effectiveTo: '',
  });
  const [conditions, setConditions] = useState<ConditionBlock>({ operator: 'AND', clauses: [{ field: 'ksicCode', op: 'STARTS_WITH', value: '' }] });
  const [actions, setActions] = useState<RuleActionData>({ type: 'ELIGIBLE', documents: [], restrictions: [], notes: '' });
  const [jsonConditions, setJsonConditions] = useState('');
  const [jsonActions, setJsonActions] = useState('');
  const [jsonSync, setJsonSync] = useState(true);

  const loadRules = async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth('/api/visa-rules/rules?limit=100');
      if (res.ok) {
        const data = await res.json();
        setRules(data.data || []);
      }
    } catch { }
    finally { setLoading(false); }
  };

  const loadVisaTypes = async () => {
    try {
      const res = await fetchWithAuth('/api/visa-rules/visa-types');
      if (res.ok) {
        const data = await res.json();
        setVisaTypes(data || []);
      }
    } catch { }
  };

  useEffect(() => { loadRules(); loadVisaTypes(); }, []);

  // Sync visual ↔ JSON
  useEffect(() => {
    if (jsonSync) {
      setJsonConditions(JSON.stringify(conditions, null, 2));
      setJsonActions(JSON.stringify(actions, null, 2));
    }
  }, [conditions, actions, jsonSync]);

  const handleJsonConditionsChange = (val: string) => {
    setJsonConditions(val);
    try {
      const parsed = JSON.parse(val);
      setConditions(parsed);
    } catch { }
  };

  const handleJsonActionsChange = (val: string) => {
    setJsonActions(val);
    try {
      const parsed = JSON.parse(val);
      setActions(parsed);
    } catch { }
  };

  const addClause = () => {
    setConditions(p => ({ ...p, clauses: [...p.clauses, { field: 'ksicCode', op: 'EQ', value: '' }] }));
  };

  const removeClause = (idx: number) => {
    setConditions(p => ({ ...p, clauses: p.clauses.filter((_, i) => i !== idx) }));
  };

  const updateClause = (idx: number, key: string, val: any) => {
    setConditions(p => ({
      ...p,
      clauses: p.clauses.map((c, i) => i === idx ? { ...c, [key]: val } : c),
    }));
  };

  const resetForm = () => {
    setForm({ visaTypeId: '', ruleName: '', ruleDescription: '', priority: 100, ruleType: 'ELIGIBILITY', effectiveFrom: new Date().toISOString().split('T')[0], effectiveTo: '' });
    setConditions({ operator: 'AND', clauses: [{ field: 'ksicCode', op: 'STARTS_WITH', value: '' }] });
    setActions({ type: 'ELIGIBLE', documents: [], restrictions: [], notes: '' });
    setJsonSync(true);
  };

  const handleSubmit = async () => {
    const body = {
      ...form,
      conditions: JSON.stringify(conditions),
      actions: JSON.stringify(actions),
      effectiveTo: form.effectiveTo || undefined,
    };

    try {
      let res;
      if (mode === 'edit' && editingRule) {
        res = await fetchWithAuth(`/api/visa-rules/rules/${editingRule.id}`, {
          method: 'PUT',
          body: JSON.stringify(body),
        });
      } else {
        res = await fetchWithAuth('/api/visa-rules/rules', {
          method: 'POST',
          body: JSON.stringify(body),
        });
      }
      if (res.ok) {
        setMode('list');
        resetForm();
        loadRules();
      }
    } catch { }
  };

  const handleEdit = (rule: VisaRuleItem) => {
    setEditingRule(rule);
    setForm({
      visaTypeId: rule.visaTypeId,
      ruleName: rule.ruleName,
      ruleDescription: rule.ruleDescription || '',
      priority: rule.priority,
      ruleType: rule.ruleType,
      effectiveFrom: rule.effectiveFrom.split('T')[0],
      effectiveTo: rule.effectiveTo ? rule.effectiveTo.split('T')[0] : '',
    });
    try {
      setConditions(JSON.parse(rule.conditions));
      setActions(JSON.parse(rule.actions));
    } catch {
      setConditions({ operator: 'AND', clauses: [] });
      setActions({ type: 'ELIGIBLE' });
    }
    setJsonSync(true);
    setMode('edit');
  };

  const handleActivate = async (ruleId: string) => {
    try {
      const res = await fetchWithAuth(`/api/visa-rules/rules/${ruleId}/activate`, { method: 'POST' });
      if (res.ok) loadRules();
    } catch { }
  };

  const handleDelete = async (ruleId: string) => {
    try {
      const res = await fetchWithAuth(`/api/visa-rules/rules/${ruleId}`, { method: 'DELETE' });
      if (res.ok) loadRules();
    } catch { }
  };

  // Create/Edit form view
  if (mode === 'create' || mode === 'edit') {
    return (
      <div>
        <button onClick={() => { setMode('list'); resetForm(); }} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-4">
          <ChevronLeft size={16} /> 목록으로
        </button>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">{mode === 'edit' ? '규칙 수정' : '새 규칙 생성'}</h3>

          {/* Basic info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">비자 유형 *</label>
              <select value={form.visaTypeId} onChange={(e) => setForm(p => ({ ...p, visaTypeId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
                <option value="">선택</option>
                {visaTypes.map(v => <option key={v.id} value={v.id}>{v.code} - {v.nameKo}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">규칙명 *</label>
              <input type="text" value={form.ruleName} onChange={(e) => setForm(p => ({ ...p, ruleName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">규칙 유형</label>
              <select value={form.ruleType} onChange={(e) => setForm(p => ({ ...p, ruleType: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
                <option value="ELIGIBILITY">ELIGIBILITY (적격)</option>
                <option value="RESTRICTION">RESTRICTION (제한)</option>
                <option value="DOCUMENT">DOCUMENT (서류)</option>
                <option value="QUOTA">QUOTA (쿼터)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">우선순위 (낮을수록 높음)</label>
              <input type="number" value={form.priority} onChange={(e) => setForm(p => ({ ...p, priority: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">시행일 *</label>
              <input type="date" value={form.effectiveFrom} onChange={(e) => setForm(p => ({ ...p, effectiveFrom: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">만료일</label>
              <input type="date" value={form.effectiveTo} onChange={(e) => setForm(p => ({ ...p, effectiveTo: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
          </div>

          <div className="mb-6">
            <label className="text-xs font-medium text-gray-500 mb-1 block">규칙 설명</label>
            <textarea value={form.ruleDescription} onChange={(e) => setForm(p => ({ ...p, ruleDescription: e.target.value }))}
              rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none" />
          </div>

          {/* Hybrid: Conditions */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-gray-700">조건 (Conditions)</h4>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">연산:</span>
                <select value={conditions.operator} onChange={(e) => setConditions(p => ({ ...p, operator: e.target.value }))}
                  className="px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none focus:ring-2 focus:ring-sky-500">
                  <option value="AND">AND</option>
                  <option value="OR">OR</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Visual builder */}
              <div className="space-y-2">
                {conditions.clauses.map((clause, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                    <select value={clause.field} onChange={(e) => updateClause(idx, 'field', e.target.value)}
                      className="px-2 py-1.5 border border-gray-200 rounded text-xs bg-white flex-shrink-0">
                      {RULE_FIELDS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                    </select>
                    <select value={clause.op} onChange={(e) => updateClause(idx, 'op', e.target.value)}
                      className="px-2 py-1.5 border border-gray-200 rounded text-xs bg-white flex-shrink-0">
                      {RULE_OPS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                    <input type="text" value={typeof clause.value === 'object' ? JSON.stringify(clause.value) : clause.value}
                      onChange={(e) => {
                        let val: any = e.target.value;
                        if (clause.op === 'IN' || clause.op === 'NOT_IN') {
                          try { val = JSON.parse(val); } catch { }
                        }
                        updateClause(idx, 'value', val);
                      }}
                      placeholder={clause.op === 'IN' ? '["값1","값2"]' : '값'}
                      className="flex-1 px-2 py-1.5 border border-gray-200 rounded text-xs bg-white min-w-0" />
                    {clause.op === 'PERCENTAGE_LTE' && (
                      <>
                        <input type="text" value={clause.of || ''} onChange={(e) => updateClause(idx, 'of', e.target.value)}
                          placeholder="of" className="w-20 px-2 py-1.5 border border-gray-200 rounded text-xs bg-white" />
                        <input type="number" value={clause.percent || ''} onChange={(e) => updateClause(idx, 'percent', Number(e.target.value))}
                          placeholder="%" className="w-16 px-2 py-1.5 border border-gray-200 rounded text-xs bg-white" />
                      </>
                    )}
                    <button onClick={() => removeClause(idx)} className="p-1 hover:bg-red-100 rounded text-gray-400 hover:text-red-500 flex-shrink-0">
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <button onClick={addClause} className="flex items-center gap-1 text-xs text-sky-600 hover:text-sky-800 font-medium mt-1">
                  <Plus size={12} /> 조건 추가
                </button>
              </div>

              {/* JSON preview */}
              <div>
                <textarea value={jsonConditions} onChange={(e) => handleJsonConditionsChange(e.target.value)}
                  rows={8} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-mono bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none" />
              </div>
            </div>
          </div>

          {/* Hybrid: Actions */}
          <div className="mb-6">
            <h4 className="text-sm font-bold text-gray-700 mb-3">액션 (Actions)</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">유형</label>
                  <select value={actions.type} onChange={(e) => setActions(p => ({ ...p, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
                    <option value="ELIGIBLE">ELIGIBLE (허용)</option>
                    <option value="BLOCKED">BLOCKED (차단)</option>
                  </select>
                </div>
                {actions.type === 'ELIGIBLE' ? (
                  <>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">필요 서류 (쉼표 구분)</label>
                      <input type="text" value={actions.documents?.join(', ') || ''}
                        onChange={(e) => setActions(p => ({ ...p, documents: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                        placeholder="사업자등록증, 고용계약서" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">제한사항 (쉼표 구분)</label>
                      <input type="text" value={actions.restrictions?.join(', ') || ''}
                        onChange={(e) => setActions(p => ({ ...p, restrictions: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                        placeholder="학사학위 이상, TOPIK 4급" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">비고</label>
                      <input type="text" value={actions.notes || ''}
                        onChange={(e) => setActions(p => ({ ...p, notes: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">차단 사유</label>
                      <input type="text" value={actions.reason || ''}
                        onChange={(e) => setActions(p => ({ ...p, reason: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">대안 제안</label>
                      <input type="text" value={actions.suggestion || ''}
                        onChange={(e) => setActions(p => ({ ...p, suggestion: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
                    </div>
                  </>
                )}
              </div>
              <div>
                <textarea value={jsonActions} onChange={(e) => handleJsonActionsChange(e.target.value)}
                  rows={8} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-mono bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none" />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button onClick={handleSubmit} disabled={!form.visaTypeId || !form.ruleName}
              className="px-6 py-2.5 bg-sky-500 text-white text-sm font-bold rounded-lg hover:bg-sky-600 disabled:opacity-50 flex items-center gap-2">
              <Check size={14} /> {mode === 'edit' ? '수정 저장' : '규칙 생성'}
            </button>
            <button onClick={() => { setMode('list'); resetForm(); }}
              className="px-6 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50">
              취소
            </button>
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-gray-700">전체 규칙 ({rules.length}건)</h3>
        <button onClick={() => { resetForm(); setMode('create'); }}
          className="flex items-center gap-1.5 px-4 py-2 bg-sky-500 text-white text-sm font-bold rounded-lg hover:bg-sky-600">
          <Plus size={14} /> 새 규칙
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-gray-300" /></div>
        ) : rules.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3">규칙명</th>
                  <th className="px-4 py-3">비자</th>
                  <th className="px-4 py-3">유형</th>
                  <th className="px-4 py-3">우선순위</th>
                  <th className="px-4 py-3">상태</th>
                  <th className="px-4 py-3">버전</th>
                  <th className="px-4 py-3">시행일</th>
                  <th className="px-4 py-3">액션</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rules.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{r.ruleName}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{r.visaTypeCode || '-'}</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[11px] rounded">{r.ruleType}</span></td>
                    <td className="px-4 py-3 text-gray-600">{r.priority}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-[11px] font-bold rounded ${RULE_STATUS_CONFIG[r.status]?.style || ''}`}>
                        {RULE_STATUS_CONFIG[r.status]?.label || r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">v{r.version}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{new Date(r.effectiveFrom).toLocaleDateString('ko-KR')}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => handleEdit(r)} className="p-1.5 hover:bg-sky-50 rounded text-gray-400 hover:text-sky-600" title="수정">
                          <Edit3 size={14} />
                        </button>
                        {r.status === 'DRAFT' && (
                          <button onClick={() => handleActivate(r.id)} className="p-1.5 hover:bg-green-50 rounded text-gray-400 hover:text-green-600" title="활성화">
                            <Zap size={14} />
                          </button>
                        )}
                        {r.status !== 'ARCHIVED' && (
                          <button onClick={() => handleDelete(r.id)} className="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-500" title="비활성화">
                            <Ban size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center py-16 text-gray-400">
            <Shield className="w-8 h-8 mb-2 text-gray-200" />
            <p className="text-sm">등록된 규칙이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ---- Tab 3: 비자 유형 관리 ----

interface VisaTypeItem {
  id: string;
  code: string;
  nameKo: string;
  nameEn: string | null;
  category: string;
  description: string | null;
  isActive: boolean;
}

function VisaTypesTab({ fetchWithAuth }: { fetchWithAuth: FetchFn }) {
  const [items, setItems] = useState<VisaTypeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<VisaTypeItem | null>(null);
  const [form, setForm] = useState({ code: '', nameKo: '', nameEn: '', category: 'WORK', description: '' });

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth('/api/visa-rules/visa-types');
      if (res.ok) setItems(await res.json());
    } catch { }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async () => {
    try {
      let res;
      if (editItem) {
        res = await fetchWithAuth(`/api/visa-rules/visa-types/${editItem.id}`, { method: 'PUT', body: JSON.stringify(form) });
      } else {
        res = await fetchWithAuth('/api/visa-rules/visa-types', { method: 'POST', body: JSON.stringify(form) });
      }
      if (res.ok) { setShowForm(false); setEditItem(null); setForm({ code: '', nameKo: '', nameEn: '', category: 'WORK', description: '' }); load(); }
    } catch { }
  };

  const startEdit = (item: VisaTypeItem) => {
    setEditItem(item);
    setForm({ code: item.code, nameKo: item.nameKo, nameEn: item.nameEn || '', category: item.category, description: item.description || '' });
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-gray-700">비자 유형 ({items.length}건)</h3>
        <button onClick={() => { setEditItem(null); setForm({ code: '', nameKo: '', nameEn: '', category: 'WORK', description: '' }); setShowForm(true); }}
          className="flex items-center gap-1.5 px-4 py-2 bg-sky-500 text-white text-sm font-bold rounded-lg hover:bg-sky-600">
          <Plus size={14} /> 추가
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
          <h4 className="text-sm font-bold text-gray-700 mb-4">{editItem ? '비자 유형 수정' : '비자 유형 추가'}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <input type="text" placeholder="코드 (예: E-9)" value={form.code} onChange={(e) => setForm(p => ({ ...p, code: e.target.value }))}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
            <input type="text" placeholder="한글명" value={form.nameKo} onChange={(e) => setForm(p => ({ ...p, nameKo: e.target.value }))}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
            <input type="text" placeholder="영문명" value={form.nameEn} onChange={(e) => setForm(p => ({ ...p, nameEn: e.target.value }))}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
            <select value={form.category} onChange={(e) => setForm(p => ({ ...p, category: e.target.value }))}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
              <option value="WORK">WORK (취업)</option>
              <option value="STUDY">STUDY (유학)</option>
              <option value="RESIDENCE">RESIDENCE (거주)</option>
              <option value="VISIT">VISIT (방문)</option>
            </select>
            <input type="text" placeholder="설명" value={form.description} onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 col-span-2" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleSubmit} className="px-4 py-2 bg-sky-500 text-white text-sm font-bold rounded-lg hover:bg-sky-600">저장</button>
            <button onClick={() => { setShowForm(false); setEditItem(null); }} className="px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50">취소</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-gray-300" /></div>
        ) : items.length > 0 ? (
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b border-gray-200">
              <tr>
                <th className="px-4 py-3">코드</th>
                <th className="px-4 py-3">한글명</th>
                <th className="px-4 py-3">영문명</th>
                <th className="px-4 py-3">카테고리</th>
                <th className="px-4 py-3">활성</th>
                <th className="px-4 py-3">액션</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-bold text-sky-700">{v.code}</td>
                  <td className="px-4 py-3 text-gray-900">{v.nameKo}</td>
                  <td className="px-4 py-3 text-gray-500">{v.nameEn || '-'}</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[11px] rounded">{v.category}</span></td>
                  <td className="px-4 py-3">{v.isActive ? <span className="text-green-600 text-xs font-bold">Active</span> : <span className="text-gray-400 text-xs">Inactive</span>}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => startEdit(v)} className="p-1.5 hover:bg-sky-50 rounded text-gray-400 hover:text-sky-600"><Edit3 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center py-16 text-gray-400">
            <Globe className="w-8 h-8 mb-2 text-gray-200" />
            <p className="text-sm">등록된 비자 유형이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ---- Tab 4: 업종코드 관리 ----

interface IndustryCodeItem {
  id: string;
  ksicCode: string;
  sectionCode: string;
  nameKo: string;
  nameEn: string | null;
  level: number;
  parentCode: string | null;
  isActive: boolean;
}

function IndustryCodesTab({ fetchWithAuth }: { fetchWithAuth: FetchFn }) {
  const [items, setItems] = useState<IndustryCodeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ksicCode: '', sectionCode: '', nameKo: '', nameEn: '', level: 5, parentCode: '' });

  const load = async (query?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set('search', query);
      params.set('limit', '100');
      const res = await fetchWithAuth(`/api/visa-rules/industry-codes?${params}`);
      if (res.ok) {
        const data = await res.json();
        setItems(Array.isArray(data) ? data : data.data || []);
      }
    } catch { }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSearch = () => { load(searchQuery); };

  const handleSubmit = async () => {
    try {
      const res = await fetchWithAuth('/api/visa-rules/industry-codes', { method: 'POST', body: JSON.stringify(form) });
      if (res.ok) { setShowForm(false); setForm({ ksicCode: '', sectionCode: '', nameKo: '', nameEn: '', level: 5, parentCode: '' }); load(searchQuery); }
    } catch { }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-gray-700">업종코드</h3>
          <div className="relative">
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
              placeholder="코드 또는 이름 검색" className="pl-3 pr-8 py-1.5 border border-gray-200 rounded-lg text-sm w-60 focus:outline-none focus:ring-2 focus:ring-sky-500" />
            <button onClick={handleSearch} className="absolute right-2 top-1/2 -translate-y-1/2"><Search size={14} className="text-gray-400" /></button>
          </div>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-4 py-2 bg-sky-500 text-white text-sm font-bold rounded-lg hover:bg-sky-600">
          <Plus size={14} /> 추가
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <input type="text" placeholder="KSIC 코드" value={form.ksicCode} onChange={(e) => setForm(p => ({ ...p, ksicCode: e.target.value }))}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
            <input type="text" placeholder="대분류 코드 (예: C)" value={form.sectionCode} onChange={(e) => setForm(p => ({ ...p, sectionCode: e.target.value }))}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
            <input type="text" placeholder="한글명" value={form.nameKo} onChange={(e) => setForm(p => ({ ...p, nameKo: e.target.value }))}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
            <input type="number" placeholder="레벨 (1-5)" value={form.level} onChange={(e) => setForm(p => ({ ...p, level: Number(e.target.value) }))}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleSubmit} className="px-4 py-2 bg-sky-500 text-white text-sm font-bold rounded-lg hover:bg-sky-600">저장</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50">취소</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-gray-300" /></div>
        ) : items.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3">KSIC코드</th>
                  <th className="px-4 py-3">한글명</th>
                  <th className="px-4 py-3">대분류</th>
                  <th className="px-4 py-3">레벨</th>
                  <th className="px-4 py-3">상위코드</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((ic) => (
                  <tr key={ic.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-bold text-sky-700">{ic.ksicCode}</td>
                    <td className="px-4 py-3 text-gray-900">{ic.nameKo}</td>
                    <td className="px-4 py-3 text-gray-600">{ic.sectionCode}</td>
                    <td className="px-4 py-3 text-gray-500">{ic.level}</td>
                    <td className="px-4 py-3 text-gray-400">{ic.parentCode || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center py-16 text-gray-400">
            <Building2 className="w-8 h-8 mb-2 text-gray-200" />
            <p className="text-sm">등록된 업종코드가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 시스템 로그 (MongoDB 기반 4종 로그)
// System Logs (MongoDB-based 4 log types)
// ==========================================

const SYSTEM_LOG_TABS = [
  { id: 'requests', label: '요청 로그', icon: Globe },
  { id: 'matching', label: '매칭 로그', icon: Zap },
  { id: 'errors', label: '에러 로그', icon: AlertTriangle },
  { id: 'changes', label: '변경 로그', icon: Edit3 },
];

function SystemLogsContent({ fetchWithAuth }: { fetchWithAuth: FetchFn }) {
  const [logTab, setLogTab] = useState('requests');
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 20, totalPages: 0 });
  const [filters, setFilters] = useState<Record<string, string>>({});

  const loadLogs = async (tab?: string, p?: number) => {
    setLoading(true);
    const currentTab = tab || logTab;
    try {
      const params = new URLSearchParams();
      params.set('page', String(p || meta.page));
      params.set('limit', '20');
      // 날짜 필터 / Date filters
      if (filters.startDate) params.set('startDate', filters.startDate);
      if (filters.endDate) params.set('endDate', filters.endDate);
      // 탭별 필터 / Tab-specific filters
      if (currentTab === 'requests' && filters.statusCode) params.set('statusCode', filters.statusCode);
      if (currentTab === 'requests' && filters.path) params.set('path', filters.path);
      if (currentTab === 'errors' && filters.errorType) params.set('errorType', filters.errorType);
      if (currentTab === 'errors' && filters.is500) params.set('is500', filters.is500);
      if (currentTab === 'changes' && filters.tableName) params.set('tableName', filters.tableName);

      const res = await fetchWithAuth(`/api/admin/logs/${currentTab}?${params}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.data || []);
        setMeta(data.meta || { total: 0, page: 1, limit: 20, totalPages: 0 });
      }
    } catch { }
    finally { setLoading(false); }
  };

  useEffect(() => { loadLogs(logTab, 1); }, [logTab]);

  const handleTabChange = (tab: string) => {
    setLogTab(tab);
    setLogs([]);
    setMeta({ total: 0, page: 1, limit: 20, totalPages: 0 });
    setFilters({});
  };

  const handlePageChange = (page: number) => {
    setMeta((prev) => ({ ...prev, page }));
    loadLogs(logTab, page);
  };

  const statusCodeColor = (code: number) => {
    if (code < 300) return 'text-green-700 bg-green-50';
    if (code < 400) return 'text-blue-700 bg-blue-50';
    if (code < 500) return 'text-yellow-700 bg-yellow-50';
    return 'text-red-700 bg-red-50';
  };

  return (
    <div>
      {/* 탭 / Tabs */}
      <div className="flex gap-2 mb-4">
        {SYSTEM_LOG_TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => handleTabChange(id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              logTab === id
                ? 'bg-sky-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      {/* 필터 바 / Filter bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-gray-500">시작일:</label>
          <input
            type="date"
            value={filters.startDate || ''}
            onChange={(e) => setFilters((p) => ({ ...p, startDate: e.target.value }))}
            className="px-2 py-1.5 border border-gray-200 rounded-lg text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-gray-500">종료일:</label>
          <input
            type="date"
            value={filters.endDate || ''}
            onChange={(e) => setFilters((p) => ({ ...p, endDate: e.target.value }))}
            className="px-2 py-1.5 border border-gray-200 rounded-lg text-sm"
          />
        </div>

        {logTab === 'errors' && (
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-500">500만:</label>
            <select
              value={filters.is500 || ''}
              onChange={(e) => setFilters((p) => ({ ...p, is500: e.target.value }))}
              className="px-2 py-1.5 border border-gray-200 rounded-lg text-sm"
            >
              <option value="">전체</option>
              <option value="true">500만</option>
              <option value="false">비500</option>
            </select>
          </div>
        )}

        <button
          onClick={() => loadLogs(logTab, 1)}
          className="px-3 py-1.5 bg-sky-600 text-white text-sm rounded-lg hover:bg-sky-700 transition-colors flex items-center gap-1"
        >
          <Search size={14} /> 조회
        </button>
        <div className="ml-auto text-sm text-gray-500">
          총 <span className="font-bold text-gray-900">{meta.total}</span>건
        </div>
      </div>

      {/* 테이블 / Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-gray-300" /></div>
        ) : (
          <div className="overflow-x-auto">
            {logTab === 'requests' && (
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3">시간</th>
                    <th className="px-4 py-3">Method</th>
                    <th className="px-4 py-3">Path</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">응답시간</th>
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">IP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {logs.length > 0 ? logs.map((l, i) => (
                    <tr key={l.id || i} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-gray-600 whitespace-nowrap text-xs">{new Date(l.createdAt).toLocaleString('ko-KR')}</td>
                      <td className="px-4 py-2"><span className="px-1.5 py-0.5 text-xs font-bold bg-gray-100 rounded">{l.method}</span></td>
                      <td className="px-4 py-2 text-gray-700 max-w-xs truncate text-xs">{l.path}</td>
                      <td className="px-4 py-2"><span className={`px-1.5 py-0.5 text-xs font-bold rounded ${statusCodeColor(l.statusCode)}`}>{l.statusCode}</span></td>
                      <td className="px-4 py-2 text-gray-600 text-xs">{l.responseTime}ms</td>
                      <td className="px-4 py-2 text-gray-500 text-xs">{l.userId || '-'}</td>
                      <td className="px-4 py-2 text-gray-500 text-xs">{l.ip || '-'}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400 text-sm">로그가 없습니다.</td></tr>
                  )}
                </tbody>
              </table>
            )}

            {logTab === 'matching' && (
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3">시간</th>
                    <th className="px-4 py-3">적격 비자</th>
                    <th className="px-4 py-3">불적격</th>
                    <th className="px-4 py-3">소요시간</th>
                    <th className="px-4 py-3">User</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {logs.length > 0 ? logs.map((l, i) => {
                    let visas: string[] = [];
                    try { visas = JSON.parse(l.eligibleVisas || '[]'); } catch { }
                    return (
                      <tr key={l.id || i} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-gray-600 text-xs whitespace-nowrap">{new Date(l.createdAt).toLocaleString('ko-KR')}</td>
                        <td className="px-4 py-2">
                          <div className="flex gap-1 flex-wrap">
                            {visas.length > 0 ? visas.map((v: string) => (
                              <span key={v} className="px-1.5 py-0.5 text-[10px] font-bold bg-green-50 text-green-700 rounded">{v}</span>
                            )) : <span className="text-gray-400 text-xs">-</span>}
                          </div>
                        </td>
                        <td className="px-4 py-2 text-gray-600 text-xs">{l.blockedCount}</td>
                        <td className="px-4 py-2 text-gray-600 text-xs">{l.durationMs}ms</td>
                        <td className="px-4 py-2 text-gray-500 text-xs">{l.userId || '-'}</td>
                      </tr>
                    );
                  }) : (
                    <tr><td colSpan={5} className="px-4 py-12 text-center text-gray-400 text-sm">로그가 없습니다.</td></tr>
                  )}
                </tbody>
              </table>
            )}

            {logTab === 'errors' && (
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3">시간</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Message</th>
                    <th className="px-4 py-3">Path</th>
                    <th className="px-4 py-3">User</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {logs.length > 0 ? logs.map((l, i) => (
                    <tr key={l.id || i} className={`hover:bg-gray-50 ${l.is500 ? 'bg-red-50/30' : ''}`}>
                      <td className="px-4 py-2 text-gray-600 text-xs whitespace-nowrap">{new Date(l.createdAt).toLocaleString('ko-KR')}</td>
                      <td className="px-4 py-2"><span className={`px-1.5 py-0.5 text-xs font-bold rounded ${statusCodeColor(l.statusCode)}`}>{l.statusCode}</span></td>
                      <td className="px-4 py-2 text-gray-700 text-xs">{l.errorType}</td>
                      <td className="px-4 py-2 text-gray-600 text-xs max-w-xs truncate">{l.message}</td>
                      <td className="px-4 py-2 text-gray-500 text-xs">{l.path || '-'}</td>
                      <td className="px-4 py-2 text-gray-500 text-xs">{l.userId || '-'}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400 text-sm">에러 로그가 없습니다.</td></tr>
                  )}
                </tbody>
              </table>
            )}

            {logTab === 'changes' && (
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3">시간</th>
                    <th className="px-4 py-3">Admin</th>
                    <th className="px-4 py-3">테이블</th>
                    <th className="px-4 py-3">액션</th>
                    <th className="px-4 py-3">Record ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {logs.length > 0 ? logs.map((l, i) => (
                    <tr key={l.id || i} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-gray-600 text-xs whitespace-nowrap">{new Date(l.createdAt).toLocaleString('ko-KR')}</td>
                      <td className="px-4 py-2 text-gray-700 text-xs">{l.adminId}</td>
                      <td className="px-4 py-2"><span className="px-1.5 py-0.5 text-xs font-bold bg-gray-100 rounded">{l.tableName}</span></td>
                      <td className="px-4 py-2">
                        <span className={`px-1.5 py-0.5 text-xs font-bold rounded ${
                          l.action === 'CREATE' ? 'bg-green-50 text-green-700' :
                          l.action === 'UPDATE' ? 'bg-sky-50 text-sky-700' :
                          l.action === 'DELETE' ? 'bg-red-50 text-red-700' :
                          'bg-gray-50 text-gray-700'
                        }`}>{l.action}</span>
                      </td>
                      <td className="px-4 py-2 text-gray-500 text-xs">{l.recordId}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan={5} className="px-4 py-12 text-center text-gray-400 text-sm">변경 로그가 없습니다.</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* 페이지네이션 / Pagination */}
        {meta.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 p-4 border-t border-gray-200">
            <button onClick={() => handlePageChange(meta.page - 1)} disabled={meta.page <= 1}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30">
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: Math.min(meta.totalPages, 10) }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => handlePageChange(p)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  meta.page === p ? 'bg-sky-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {p}
              </button>
            ))}
            {meta.totalPages > 10 && <span className="text-gray-400">...</span>}
            <button onClick={() => handlePageChange(meta.page + 1)} disabled={meta.page >= meta.totalPages}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30">
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ---- Tab 5: 규칙 테스트 ----

interface EvaluationResult {
  eligibleVisas: {
    visaCode: string;
    visaName: string;
    documents: string[];
    restrictions: string[];
    notes: string[];
    matchedRules: string[];
  }[];
  blockedVisas: {
    visaCode: string;
    visaName: string;
    reason: string;
    suggestion: string;
    blockedByRule: string;
  }[];
  summary: {
    totalEvaluated: number;
    eligible: number;
    blocked: number;
  };
}

function RuleTestTab({ fetchWithAuth }: { fetchWithAuth: FetchFn }) {
  const [form, setForm] = useState({
    ksicCode: '',
    companySizeType: 'SME',
    employeeCountKorean: '',
    employeeCountForeign: '',
    annualRevenue: '',
    addressRoad: '',
    jobType: '',
    offeredSalary: '',
  });
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEvaluate = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const body = {
        ksicCode: form.ksicCode,
        companySizeType: form.companySizeType,
        employeeCountKorean: form.employeeCountKorean ? Number(form.employeeCountKorean) : undefined,
        employeeCountForeign: form.employeeCountForeign ? Number(form.employeeCountForeign) : undefined,
        annualRevenue: form.annualRevenue ? Number(form.annualRevenue) : undefined,
        addressRoad: form.addressRoad || undefined,
        jobType: form.jobType || undefined,
        offeredSalary: form.offeredSalary ? Number(form.offeredSalary) : undefined,
      };
      const res = await fetchWithAuth('/api/visa-rules/test-evaluate', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setResult(await res.json());
      } else {
        const data = await res.json();
        setError(data.message || '평가 실패');
      }
    } catch {
      setError('서버 연결 오류');
    }
    finally { setLoading(false); }
  };

  return (
    <div>
      {/* Input form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h3 className="text-sm font-bold text-gray-700 mb-4">기업 정보 입력</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">KSIC 업종코드 *</label>
            <input type="text" value={form.ksicCode} onChange={(e) => setForm(p => ({ ...p, ksicCode: e.target.value }))}
              placeholder="예: 56221" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">기업 규모 *</label>
            <select value={form.companySizeType} onChange={(e) => setForm(p => ({ ...p, companySizeType: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
              <option value="SME">중소기업</option>
              <option value="MID">중견기업</option>
              <option value="LARGE">대기업</option>
              <option value="STARTUP">스타트업</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">한국인 직원수</label>
            <input type="number" value={form.employeeCountKorean} onChange={(e) => setForm(p => ({ ...p, employeeCountKorean: e.target.value }))}
              placeholder="0" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">외국인 직원수</label>
            <input type="number" value={form.employeeCountForeign} onChange={(e) => setForm(p => ({ ...p, employeeCountForeign: e.target.value }))}
              placeholder="0" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">연매출 (만원)</label>
            <input type="number" value={form.annualRevenue} onChange={(e) => setForm(p => ({ ...p, annualRevenue: e.target.value }))}
              placeholder="0" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">소재지</label>
            <input type="text" value={form.addressRoad} onChange={(e) => setForm(p => ({ ...p, addressRoad: e.target.value }))}
              placeholder="서울특별시 강남구" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">직종</label>
            <input type="text" value={form.jobType} onChange={(e) => setForm(p => ({ ...p, jobType: e.target.value }))}
              placeholder="예: 개발자" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">제시 급여 (만원/월)</label>
            <input type="number" value={form.offeredSalary} onChange={(e) => setForm(p => ({ ...p, offeredSalary: e.target.value }))}
              placeholder="0" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
          </div>
        </div>

        <button onClick={handleEvaluate} disabled={loading || !form.ksicCode}
          className="px-6 py-2.5 bg-sky-500 text-white text-sm font-bold rounded-lg hover:bg-sky-600 disabled:opacity-50 flex items-center gap-2">
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
          평가 실행
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-sm text-red-700">{error}</div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
              <p className="text-sm text-gray-500">평가 비자수</p>
              <p className="text-2xl font-bold text-gray-900">{result.summary.totalEvaluated}</p>
            </div>
            <div className="bg-green-50 rounded-xl border border-green-200 p-5 text-center">
              <p className="text-sm text-green-600">적격 비자</p>
              <p className="text-2xl font-bold text-green-700">{result.summary.eligible}</p>
            </div>
            <div className="bg-red-50 rounded-xl border border-red-200 p-5 text-center">
              <p className="text-sm text-red-600">차단 비자</p>
              <p className="text-2xl font-bold text-red-700">{result.summary.blocked}</p>
            </div>
          </div>

          {/* Eligible */}
          {result.eligibleVisas.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-green-700 mb-3">적격 비자</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {result.eligibleVisas.map((v) => (
                  <div key={v.visaCode} className="bg-white rounded-xl border-2 border-green-200 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-sm font-bold rounded">{v.visaCode}</span>
                      <span className="text-sm font-medium text-gray-900">{v.visaName}</span>
                    </div>
                    {v.documents.length > 0 && (
                      <div className="mb-2">
                        <p className="text-[11px] font-bold text-gray-500 mb-1">필요 서류:</p>
                        <div className="flex flex-wrap gap-1">
                          {v.documents.map((d, i) => <span key={i} className="px-1.5 py-0.5 bg-blue-50 text-blue-700 text-[11px] rounded">{d}</span>)}
                        </div>
                      </div>
                    )}
                    {v.restrictions.length > 0 && (
                      <div>
                        <p className="text-[11px] font-bold text-gray-500 mb-1">제한사항:</p>
                        <div className="flex flex-wrap gap-1">
                          {v.restrictions.map((r, i) => <span key={i} className="px-1.5 py-0.5 bg-orange-50 text-orange-700 text-[11px] rounded">{r}</span>)}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Blocked */}
          {result.blockedVisas.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-red-700 mb-3">차단 비자</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {result.blockedVisas.map((v) => (
                  <div key={v.visaCode} className="bg-white rounded-xl border-2 border-red-200 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-sm font-bold rounded">{v.visaCode}</span>
                      <span className="text-sm font-medium text-gray-900">{v.visaName}</span>
                    </div>
                    <p className="text-xs text-red-600 mb-1"><strong>사유:</strong> {v.reason}</p>
                    {v.suggestion && <p className="text-xs text-gray-500"><strong>대안:</strong> {v.suggestion}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// 법령 변경 관리 / Law Amendment Management
// ============================================================

interface LawAmendmentData {
  id: string;
  title: string;
  source: string;
  sourceUrl?: string;
  detectedAt: string;
  effectiveDate: string;
  status: string;
  affectedVisaCodes: string[];
  changeSummary: Record<string, any>;
  changeDetails: Record<string, any>;
  impactAnalysis?: Record<string, any>;
  reviewedBy?: string;
  reviewedAt?: string;
  appliedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  items?: LawAmendmentItemData[];
}

interface LawAmendmentItemData {
  id: string;
  targetTable: string;
  targetId?: string;
  action: string;
  beforeData?: Record<string, any>;
  afterData?: Record<string, any>;
  isApplied: boolean;
  appliedAt?: string;
}

const AMENDMENT_STATUS_MAP: Record<string, { label: string; color: string }> = {
  DETECTED: { label: '감지됨', color: 'bg-blue-100 text-blue-800' },
  REVIEWING: { label: '검토중', color: 'bg-yellow-100 text-yellow-800' },
  APPROVED: { label: '승인됨', color: 'bg-green-100 text-green-800' },
  STAGING: { label: '시뮬레이션', color: 'bg-purple-100 text-purple-800' },
  APPLIED: { label: '적용완료', color: 'bg-gray-100 text-gray-800' },
  REJECTED: { label: '반려', color: 'bg-red-100 text-red-800' },
};

const AMENDMENT_TABS = ['ALL', 'DETECTED', 'REVIEWING', 'APPROVED', 'STAGING', 'APPLIED', 'REJECTED'];

function LawAmendmentContent({ fetchWithAuth }: { fetchWithAuth: (url: string, opts?: RequestInit) => Promise<Response> }) {
  const [amendments, setAmendments] = useState<LawAmendmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedAmendment, setSelectedAmendment] = useState<LawAmendmentData | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [impactResult, setImpactResult] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [approveDate, setApproveDate] = useState('');
  const [showApproveForm, setShowApproveForm] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: '', source: '', sourceUrl: '', effectiveDate: '',
    affectedVisaCodes: '', changeSummary: '', changeDetails: '',
  });

  const loadAmendments = async () => {
    setLoading(true);
    try {
      const statusParam = activeTab !== 'ALL' ? `&status=${activeTab}` : '';
      const res = await fetchWithAuth(`/api/admin/law-amendments?page=${page}&limit=15${statusParam}`);
      const data = await res.json();
      if (res.ok) {
        setAmendments(data.items || []);
        setTotalPages(data.totalPages || 1);
        setTotal(data.total || 0);
      }
    } catch (e) { console.error('Failed to load amendments:', e); }
    setLoading(false);
  };

  useEffect(() => { loadAmendments(); }, [activeTab, page]);

  const openDetail = async (id: string) => {
    setDetailLoading(true);
    setSimulationResult(null);
    setImpactResult(null);
    setShowRejectForm(false);
    setShowApproveForm(false);
    try {
      const res = await fetchWithAuth(`/api/admin/law-amendments/${id}`);
      const data = await res.json();
      if (res.ok) setSelectedAmendment(data);
    } catch (e) { console.error(e); }
    setDetailLoading(false);
  };

  const handleApprove = async () => {
    if (!selectedAmendment) return;
    setActionLoading(true);
    try {
      const body: any = {};
      if (approveDate) body.effectiveDate = approveDate;
      const res = await fetchWithAuth(`/api/admin/law-amendments/${selectedAmendment.id}/approve`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedAmendment(data);
        setShowApproveForm(false);
        loadAmendments();
      }
    } catch (e) { console.error(e); }
    setActionLoading(false);
  };

  const handleReject = async () => {
    if (!selectedAmendment || !rejectReason) return;
    setActionLoading(true);
    try {
      const res = await fetchWithAuth(`/api/admin/law-amendments/${selectedAmendment.id}/reject`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectReason }),
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedAmendment(data);
        setShowRejectForm(false);
        setRejectReason('');
        loadAmendments();
      }
    } catch (e) { console.error(e); }
    setActionLoading(false);
  };

  const handleSimulate = async () => {
    if (!selectedAmendment) return;
    setActionLoading(true);
    try {
      const res = await fetchWithAuth(`/api/admin/law-amendments/${selectedAmendment.id}/simulate`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        setSimulationResult(data);
      }
    } catch (e) { console.error(e); }
    setActionLoading(false);
  };

  const handleImpact = async () => {
    if (!selectedAmendment) return;
    setActionLoading(true);
    try {
      const res = await fetchWithAuth(`/api/admin/law-amendments/${selectedAmendment.id}/impact`);
      if (res.ok) {
        const data = await res.json();
        setImpactResult(data);
      }
    } catch (e) { console.error(e); }
    setActionLoading(false);
  };

  const handleApply = async () => {
    if (!selectedAmendment) return;
    if (!confirm('정말 즉시 적용하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;
    setActionLoading(true);
    try {
      const res = await fetchWithAuth(`/api/admin/law-amendments/${selectedAmendment.id}/apply`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedAmendment(data);
        loadAmendments();
      }
    } catch (e) { console.error(e); }
    setActionLoading(false);
  };

  const handleCreate = async () => {
    setActionLoading(true);
    try {
      let summaryObj = {};
      let detailsObj = {};
      try { summaryObj = JSON.parse(createForm.changeSummary || '{}'); } catch { summaryObj = { text: createForm.changeSummary }; }
      try { detailsObj = JSON.parse(createForm.changeDetails || '{}'); } catch { detailsObj = { text: createForm.changeDetails }; }
      const res = await fetchWithAuth('/api/admin/law-amendments', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: createForm.title,
          source: createForm.source || 'MANUAL',
          sourceUrl: createForm.sourceUrl || undefined,
          effectiveDate: createForm.effectiveDate,
          affectedVisaCodes: createForm.affectedVisaCodes.split(',').map(s => s.trim()).filter(Boolean),
          changeSummary: summaryObj,
          changeDetails: detailsObj,
        }),
      });
      if (res.ok) {
        setShowCreateForm(false);
        setCreateForm({ title: '', source: '', sourceUrl: '', effectiveDate: '', affectedVisaCodes: '', changeSummary: '', changeDetails: '' });
        loadAmendments();
      }
    } catch (e) { console.error(e); }
    setActionLoading(false);
  };

  const statusBadge = (status: string) => {
    const s = AMENDMENT_STATUS_MAP[status] || { label: status, color: 'bg-gray-100 text-gray-600' };
    return <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${s.color}`}>{s.label}</span>;
  };

  return (
    <div>
      {/* 헤더 / Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">법령 변경 관리</h2>
          <p className="text-sm text-gray-500 mt-1">자동 감지된 법령/정책 변경 사항을 검토하고 관리합니다.</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" /> 수동 등록
        </button>
      </div>

      {/* 상태 탭 / Status tabs */}
      <div className="flex gap-1 mb-4 overflow-x-auto">
        {AMENDMENT_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setPage(1); }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap ${
              activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab === 'ALL' ? `전체 (${total})` : `${AMENDMENT_STATUS_MAP[tab]?.label || tab}`}
          </button>
        ))}
      </div>

      {/* 목록 테이블 / List table */}
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
      ) : amendments.length === 0 ? (
        <div className="text-center py-12 text-gray-400">검색 결과 없음</div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500">제목</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">출처</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">영향 비자</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">감지일</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">시행일</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">상태</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {amendments.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900 truncate max-w-[300px]">{a.title}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{a.source}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {a.affectedVisaCodes?.slice(0, 3).map((v) => (
                        <span key={v} className="px-1.5 py-0.5 bg-blue-50 text-blue-700 text-xs rounded">{v}</span>
                      ))}
                      {a.affectedVisaCodes?.length > 3 && (
                        <span className="text-xs text-gray-400">+{a.affectedVisaCodes.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{new Date(a.detectedAt).toLocaleDateString('ko-KR')}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{new Date(a.effectiveDate).toLocaleDateString('ko-KR')}</td>
                  <td className="px-4 py-3">{statusBadge(a.status)}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openDetail(a.id)} className="text-blue-600 hover:underline text-xs">상세</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* 페이지네이션 / Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 py-3 border-t">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1} className="px-3 py-1 text-sm rounded bg-gray-100 disabled:opacity-50">이전</button>
              <span className="text-sm text-gray-500">{page} / {totalPages}</span>
              <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages} className="px-3 py-1 text-sm rounded bg-gray-100 disabled:opacity-50">다음</button>
            </div>
          )}
        </div>
      )}

      {/* 수동 등록 모달 / Create modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 m-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">법령 변경 수동 등록</h3>
              <button onClick={() => setShowCreateForm(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <input placeholder="제목 *" value={createForm.title} onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm" />
              <input placeholder="출처 (예: 법제처, immigration.go.kr)" value={createForm.source}
                onChange={(e) => setCreateForm({ ...createForm, source: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm" />
              <input placeholder="원문 URL" value={createForm.sourceUrl}
                onChange={(e) => setCreateForm({ ...createForm, sourceUrl: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm" />
              <input type="date" placeholder="시행일 *" value={createForm.effectiveDate}
                onChange={(e) => setCreateForm({ ...createForm, effectiveDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm" />
              <input placeholder="영향 비자 코드 (쉼표 구분: E-7,E-9,F-2)" value={createForm.affectedVisaCodes}
                onChange={(e) => setCreateForm({ ...createForm, affectedVisaCodes: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm" />
              <textarea placeholder="변경 요약 (JSON 또는 텍스트)" value={createForm.changeSummary}
                onChange={(e) => setCreateForm({ ...createForm, changeSummary: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm" rows={2} />
              <textarea placeholder="변경 상세 (JSON 또는 텍스트)" value={createForm.changeDetails}
                onChange={(e) => setCreateForm({ ...createForm, changeDetails: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm" rows={2} />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowCreateForm(false)} className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg">취소</button>
              <button onClick={handleCreate} disabled={actionLoading || !createForm.title || !createForm.effectiveDate}
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                {actionLoading ? '처리중...' : '등록'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 상세 모달 / Detail modal */}
      {selectedAmendment && (
        <div className="fixed inset-0 bg-black/30 flex items-start justify-center z-50 overflow-y-auto pt-8 pb-8">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-6 m-4">
            {detailLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin" /></div>
            ) : (
              <>
                {/* 헤더 / Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {statusBadge(selectedAmendment.status)}
                      <span className="text-xs text-gray-400">ID: {selectedAmendment.id}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{selectedAmendment.title}</h3>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                      <span>출처: {selectedAmendment.source}</span>
                      {selectedAmendment.sourceUrl && (
                        <a href={selectedAmendment.sourceUrl} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:underline">
                          <ExternalLink className="w-3 h-3" /> 원문
                        </a>
                      )}
                    </div>
                  </div>
                  <button onClick={() => setSelectedAmendment(null)}><X className="w-5 h-5" /></button>
                </div>

                {/* 기본 정보 / Basic info */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">감지일</div>
                    <div className="text-sm font-medium">{new Date(selectedAmendment.detectedAt).toLocaleDateString('ko-KR')}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">시행일</div>
                    <div className="text-sm font-medium">{new Date(selectedAmendment.effectiveDate).toLocaleDateString('ko-KR')}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">영향 비자</div>
                    <div className="flex flex-wrap gap-1">
                      {selectedAmendment.affectedVisaCodes?.map((v) => (
                        <span key={v} className="px-1.5 py-0.5 bg-blue-50 text-blue-700 text-xs rounded font-medium">{v}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 변경 요약 / Change summary */}
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-gray-700 mb-2">변경 요약</h4>
                  <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 overflow-x-auto">
                    <pre className="whitespace-pre-wrap">{JSON.stringify(selectedAmendment.changeSummary, null, 2)}</pre>
                  </div>
                </div>

                {/* 변경 항목 테이블 / Change items table */}
                {selectedAmendment.items && selectedAmendment.items.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-bold text-gray-700 mb-2">변경 항목 ({selectedAmendment.items.length}건)</h4>
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full text-xs">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left font-medium text-gray-500">대상 테이블</th>
                            <th className="px-3 py-2 text-left font-medium text-gray-500">ID</th>
                            <th className="px-3 py-2 text-left font-medium text-gray-500">액션</th>
                            <th className="px-3 py-2 text-left font-medium text-gray-500">변경전</th>
                            <th className="px-3 py-2 text-left font-medium text-gray-500">변경후</th>
                            <th className="px-3 py-2 text-center font-medium text-gray-500">적용</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {selectedAmendment.items.map((item) => (
                            <tr key={item.id}>
                              <td className="px-3 py-2 font-medium">{item.targetTable}</td>
                              <td className="px-3 py-2 text-gray-500">{item.targetId || '-'}</td>
                              <td className="px-3 py-2">
                                <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                                  item.action === 'CREATE' ? 'bg-green-100 text-green-700' :
                                  item.action === 'UPDATE' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-red-100 text-red-700'
                                }`}>{item.action}</span>
                              </td>
                              <td className="px-3 py-2 text-gray-500 max-w-[150px] truncate">
                                {item.beforeData ? JSON.stringify(item.beforeData).substring(0, 40) : '-'}
                              </td>
                              <td className="px-3 py-2 text-gray-500 max-w-[150px] truncate">
                                {item.afterData ? JSON.stringify(item.afterData).substring(0, 40) : '-'}
                              </td>
                              <td className="px-3 py-2 text-center">
                                {item.isApplied ? <Check className="w-4 h-4 text-green-600 mx-auto" /> : <span className="text-gray-400">-</span>}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 영향 분석 결과 / Impact analysis result */}
                {impactResult && (
                  <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <h4 className="text-sm font-bold text-yellow-800 mb-2">영향 분석 결과</h4>
                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div><span className="text-gray-500">영향 비자 타입:</span> <strong>{impactResult.affectedVisaTypeCount}건</strong></div>
                      <div><span className="text-gray-500">영향 규칙:</span> <strong>{impactResult.affectedRuleCount}건</strong></div>
                      <div><span className="text-gray-500">리스크:</span> <strong className={
                        impactResult.riskLevel === 'HIGH' ? 'text-red-600' :
                        impactResult.riskLevel === 'MEDIUM' ? 'text-yellow-600' : 'text-green-600'
                      }>{impactResult.riskLevel}</strong></div>
                    </div>
                    {impactResult.affectedRules?.length > 0 && (
                      <div className="mt-2">
                        <div className="text-xs text-gray-500 mb-1">영향 규칙 목록:</div>
                        {impactResult.affectedRules.map((r: any) => (
                          <div key={r.id} className="text-xs text-gray-600">• {r.ruleName} ({r.visaCode})</div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 시뮬레이션 결과 / Simulation result */}
                {simulationResult && (
                  <div className="mb-4 bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <h4 className="text-sm font-bold text-purple-800 mb-2">시뮬레이션 결과</h4>
                    <div className="grid grid-cols-3 gap-3 text-xs mb-2">
                      <div>상태: <strong className={simulationResult.status === 'READY' ? 'text-green-600' : 'text-red-600'}>{simulationResult.status}</strong></div>
                      <div>적용 가능: <strong>{simulationResult.applyableItems}/{simulationResult.totalItems}</strong></div>
                      <div>이슈: <strong className={simulationResult.totalIssues > 0 ? 'text-red-600' : 'text-green-600'}>{simulationResult.totalIssues}건</strong></div>
                    </div>
                    {simulationResult.results?.map((r: any) => (
                      <div key={r.itemId} className="text-xs border-t border-purple-200 pt-1 mt-1">
                        <span className="font-medium">{r.targetTable}</span> — {r.action}
                        {r.canApply ? <span className="text-green-600 ml-2">적용 가능</span> : <span className="text-red-600 ml-2">이슈: {r.issues.join(', ')}</span>}
                      </div>
                    ))}
                  </div>
                )}

                {/* 반려 사유 / Rejection info */}
                {selectedAmendment.status === 'REJECTED' && selectedAmendment.rejectionReason && (
                  <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="text-sm font-bold text-red-800 mb-1">반려 사유</div>
                    <div className="text-xs text-red-600">{selectedAmendment.rejectionReason}</div>
                    {selectedAmendment.rejectedAt && (
                      <div className="text-xs text-gray-400 mt-1">반려일: {new Date(selectedAmendment.rejectedAt).toLocaleString('ko-KR')}</div>
                    )}
                  </div>
                )}

                {/* 액션 버튼 / Action buttons */}
                <div className="flex flex-wrap gap-2 border-t pt-4 mt-4">
                  <button onClick={handleImpact} disabled={actionLoading}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 disabled:opacity-50">
                    <AlertTriangle className="w-3 h-3" /> 영향 분석
                  </button>
                  {['DETECTED', 'REVIEWING', 'APPROVED'].includes(selectedAmendment.status) && (
                    <button onClick={handleSimulate} disabled={actionLoading}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 disabled:opacity-50">
                      <Play className="w-3 h-3" /> 시뮬레이션
                    </button>
                  )}
                  {['DETECTED', 'REVIEWING'].includes(selectedAmendment.status) && (
                    <>
                      {!showApproveForm ? (
                        <button onClick={() => setShowApproveForm(true)} disabled={actionLoading}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs bg-green-100 text-green-800 rounded-lg hover:bg-green-200 disabled:opacity-50">
                          <Check className="w-3 h-3" /> 승인
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <input type="date" value={approveDate} onChange={(e) => setApproveDate(e.target.value)}
                            className="px-2 py-1 text-xs border rounded" placeholder="시행일" />
                          <button onClick={handleApprove} disabled={actionLoading}
                            className="px-3 py-1.5 text-xs bg-green-600 text-white rounded-lg">확인</button>
                          <button onClick={() => setShowApproveForm(false)} className="text-xs text-gray-500">취소</button>
                        </div>
                      )}
                    </>
                  )}
                  {!['APPLIED', 'REJECTED'].includes(selectedAmendment.status) && (
                    <>
                      {!showRejectForm ? (
                        <button onClick={() => setShowRejectForm(true)} disabled={actionLoading}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs bg-red-100 text-red-800 rounded-lg hover:bg-red-200 disabled:opacity-50">
                          <Ban className="w-3 h-3" /> 반려
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <input value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="반려 사유" className="px-2 py-1 text-xs border rounded w-48" />
                          <button onClick={handleReject} disabled={actionLoading || !rejectReason}
                            className="px-3 py-1.5 text-xs bg-red-600 text-white rounded-lg disabled:opacity-50">확인</button>
                          <button onClick={() => setShowRejectForm(false)} className="text-xs text-gray-500">취소</button>
                        </div>
                      )}
                    </>
                  )}
                  {['APPROVED', 'STAGING'].includes(selectedAmendment.status) && (
                    <button onClick={handleApply} disabled={actionLoading}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs bg-orange-100 text-orange-800 rounded-lg hover:bg-orange-200 disabled:opacity-50">
                      <Zap className="w-3 h-3" /> 즉시 적용
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
