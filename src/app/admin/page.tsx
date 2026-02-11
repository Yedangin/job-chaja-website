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
  partTimePostings: number;
  fullTimePostings: number;
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

const sidebarMenus = [
  { id: 'dashboard', label: '대시보드', icon: LayoutDashboard },
  { id: 'users', label: '회원 관리', icon: Users },
  { id: 'jobs', label: '공고 관리', icon: Briefcase },
  { id: 'reports', label: '통계/리포트', icon: TrendingUp },
  { id: 'support', label: '고객센터', icon: MessageSquare },
  { id: 'logs', label: '활동 로그', icon: Activity },
  { id: 'settings', label: '시스템 설정', icon: Settings },
];

const ACTION_TYPE_OPTIONS = [
  { value: '', label: '전체' },
  { value: 'LOGIN', label: '로그인' },
  { value: 'LOGOUT', label: '로그아웃' },
  { value: 'PASSWORD_CHANGE', label: '비밀번호 변경' },
  { value: 'NOTIFICATION_UPDATE', label: '알림 설정' },
  { value: 'ACCOUNT_DELETE', label: '회원탈퇴' },
  { value: 'SUPPORT_TICKET', label: '고객센터 문의' },
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
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
              <ClipboardList size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">JobChaja</span>
          </Link>
          <span className="ml-2 text-[10px] font-semibold text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded">ADMIN</span>
        </div>

        <nav className="flex-1 py-4 px-3">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">메뉴</p>
          <ul className="space-y-1">
            {sidebarMenus.map((menu) => {
              const Icon = menu.icon;
              const isActive = activeMenu === menu.id;
              return (
                <li key={menu.id}>
                  <button
                    onClick={() => { setActiveMenu(menu.id); setSelectedTicket(null); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-sky-50 text-sky-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                  >
                    <Icon size={18} className={isActive ? 'text-sky-600' : 'text-gray-400'} />
                    <span>{menu.label}</span>
                    {isActive && <ChevronRight size={14} className="ml-auto text-sky-400" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-3 border-t border-gray-100">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors">
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
          {activeMenu === 'users' && <PlaceholderContent title="회원 관리" desc="회원 관리 기능이 준비중입니다." />}
          {activeMenu === 'jobs' && <PlaceholderContent title="공고 관리" desc="공고 관리 기능이 준비중입니다." />}
          {activeMenu === 'reports' && <PlaceholderContent title="통계/리포트" desc="통계 리포트 기능이 준비중입니다." />}
          {activeMenu === 'settings' && <PlaceholderContent title="시스템 설정" desc="시스템 설정 기능이 준비중입니다." />}
        </div>
      </main>
    </div>
  );
}

// --- Dashboard ---

function DashboardContent({ stats }: { stats: AdminStats | null }) {
  return (
    <>
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">사용자 분석</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard icon={<Users size={20} />} iconBg="bg-sky-100" iconColor="text-sky-600" label="전체 회원수" value={stats?.totalUsers ?? 0} />
          <StatCard icon={<Activity size={20} />} iconBg="bg-green-100" iconColor="text-green-600" label="일일 접속자수" value={stats?.dailyActiveUsers ?? 0} />
          <StatCard icon={<Globe size={20} />} iconBg="bg-violet-100" iconColor="text-violet-600" label="소셜 회원수" value={stats?.socialUsers ?? 0} />
          <StatCard icon={<Mail size={20} />} iconBg="bg-amber-100" iconColor="text-amber-600" label="이메일 회원수" value={stats?.emailUsers ?? 0} />
          <StatCard icon={<UserCheck size={20} />} iconBg="bg-teal-100" iconColor="text-teal-600" label="개인 회원수" value={stats?.individualUsers ?? 0} />
          <StatCard icon={<Building2 size={20} />} iconBg="bg-indigo-100" iconColor="text-indigo-600" label="기업 회원수" value={stats?.corporateUsers ?? 0} />
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">공고/프로필 현황</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center"><Briefcase size={20} className="text-sky-600" /></div>
              <div><p className="text-sm text-gray-500">총 공고수</p><p className="text-2xl font-bold text-gray-900">{stats?.totalJobPostings ?? 0}</p></div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center"><FileText size={20} className="text-teal-600" /></div>
              <div><p className="text-sm text-gray-500">총 프로필수</p><p className="text-2xl font-bold text-gray-900">{stats?.totalProfiles ?? 0}</p></div>
            </div>
          </div>
        </div>
      </div>
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
