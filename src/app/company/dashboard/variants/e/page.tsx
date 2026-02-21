import React from 'react';
import type { IconType } from 'react-icons';
import { 
  FaBriefcase, FaUsers, FaUserPlus, FaFileSignature, 
  FaCheckCircle, FaPlusCircle, FaSyncAlt, FaRandom,
  FaBell, FaExclamationTriangle, FaInfoCircle
} from 'react-icons/fa';

// ==========================================================================================
// 0. Mock Data & Type Definitions / 모의 데이터 및 타입 정의
// ==========================================================================================

// --- Data based on API specs / API 명세 기반 데이터 ---

const summaryData = {
  activeJobCount: 3,
  totalApplicants: 12,
  weeklyNewApplicants: 5,
  pendingHires: 2,
};

const applicantsByTrackData = {
  immediate: 4,
  sponsor: 2,
  transition: 5,
  transfer: 1,
};

const recentApplicantsData = {
  applicants: [
    { id: 'APP-001', name: '김민준', jobTitle: '프론트엔드 개발자', track: 'TRANSITION', appliedAt: '2026-02-20', status: '서류 검토' },
    { id: 'APP-002', name: 'Emily White', jobTitle: '마케팅 전문가', track: 'IMMEDIATE', appliedAt: '2026-02-19', status: '인터뷰 대기' },
    { id: 'APP-003', name: 'Nguyen Van A', jobTitle: '백엔드 개발자', track: 'SPONSOR', appliedAt: '2026-02-19', status: '서류 제출' },
    { id: 'APP-004', name: 'Olivia Martinez', jobTitle: '디자이너', track: 'TRANSITION', appliedAt: '2026-02-18', status: '합격' },
    { id: 'APP-005', name: 'David Lee', jobTitle: '데이터 분석가', track: 'TRANSFER', appliedAt: '2026-02-17', status: '불합격' },
  ],
};

const myJobsData = {
  jobs: [
    { id: 'JOB-01', title: '시니어 백엔드 개발자 (E-7)', applicantCount: 5, status: '채용중', createdAt: '2026-02-01' },
    { id: 'JOB-02', title: 'UX/UI 디자이너 (F-6)', applicantCount: 3, status: '채용중', createdAt: '2026-01-15' },
    { id: 'JOB-03', title: '글로벌 마케터 (D-10)', applicantCount: 4, status: '마감', createdAt: '2026-01-05' },
  ],
};

const alertsData = {
  alerts: [
    { id: 'ALERT-01', message: '⚠️ Nguyen Van A 체류자격 변경 서류 제출 기한 D-7', priority: 'high', dueDate: '2026-02-27' },
    { id: 'ALERT-02', message: '📋 John Smith 사증발급인정서 심사 중', priority: 'medium', dueDate: null },
    { id: 'ALERT-03', message: '✅ 이지은 님 채용 확정 완료', priority: 'low', dueDate: null },
  ],
};

// --- Type Definitions / 타입 정의 ---

type TrackId = 'immediate' | 'sponsor' | 'transition' | 'transfer';
type ApplicantTrackId = 'IMMEDIATE' | 'SPONSOR' | 'TRANSITION' | 'TRANSFER';

interface Applicant {
  id: string;
  name: string;
  jobTitle: string;
  track: ApplicantTrackId;
  appliedAt: string;
  status: string;
}

interface Job {
  id: string;
  title: string;
  applicantCount: number;
  status: string;
  createdAt: string;
}

interface Alert {
  id: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string | null;
}


// ==========================================================================================
// 1. Reusable Components / 재사용 가능 컴포넌트
// ==========================================================================================

// --- SummaryCard.tsx ---
// [KO] 상단 요약 정보를 표시하는 카드 컴포넌트입니다.
// [EN] A card component that displays summary information at the top.
interface SummaryCardProps {
  icon: IconType;
  title: string;
  value: number;
  unit: string;
  color: string;
}

function SummaryCard({ icon: Icon, title, value, unit, color }: SummaryCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-start transition-transform hover:scale-105">
      <div className={`mr-4 text-3xl ${color}`}>
        <Icon />
      </div>
      <div>
        <p className="text-sm text-gray-600 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900">
          {value.toLocaleString()}
          <span className="text-lg font-medium ml-1">{unit}</span>
        </p>
      </div>
    </div>
  );
}

// --- TrackChart.tsx ---
// [KO] 비자 트랙별 지원자 분포를 시각화하는 컴포넌트입니다.
// [EN] A component that visualizes the applicant distribution by visa track.
const trackConfig = {
  immediate: { color: '#22c55e', label: '즉시채용 (IMMEDIATE)', icon: FaCheckCircle, description: 'F비자 보유자, 즉시 근로 가능' },
  sponsor: { color: '#3b82f6', label: '스폰서채용 (SPONSOR)', icon: FaPlusCircle, description: '해외 거주 인재, E비자 스폰서 필요' },
  transition: { color: '#eab308', label: '전환채용 (TRANSITION)', icon: FaSyncAlt, description: 'D비자 유학생 등, E비자로 전환 필요' },
  transfer: { color: '#f97316', label: '이직채용 (TRANSFER)', icon: FaRandom, description: 'E비자 보유자, 이직 프로세스 필요' },
};

interface TrackChartProps {
  data: Record<TrackId, number>;
  totalApplicants: number;
}

function TrackChart({ data, totalApplicants }: TrackChartProps) {
  const tracks = Object.keys(data) as TrackId[];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-full">
      <h3 className="text-lg font-bold text-gray-900 mb-1">지원자 비자 트랙 분포</h3>
      <p className="text-sm text-gray-600 mb-6">총 {totalApplicants}명의 지원자가 4가지 트랙에 어떻게 분포되어 있는지 보여줍니다.</p>
      <div className="space-y-4">
        {tracks.map((track) => {
          const { color, label, icon: Icon, description } = trackConfig[track];
          const value = data[track];
          const percentage = totalApplicants > 0 ? ((value / totalApplicants) * 100) : 0;
          return (
            <div key={track}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center"><Icon className="mr-2" style={{ color }}/> <span className="font-semibold text-gray-800">{label}</span></div>
                <div className="font-bold text-gray-900">{value}명 <span className="text-sm font-medium text-gray-500">({percentage.toFixed(1)}%)</span></div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5"><div className="h-2.5 rounded-full" style={{ width: `${percentage}%`, backgroundColor: color }}></div></div>
              <p className="text-xs text-gray-500 mt-1 pl-1">{description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- RecentApplicants.tsx ---
// [KO] 최근 지원자 목록을 테이블 형태로 보여주는 컴포넌트입니다.
// [EN] A component that displays a list of recent applicants in a table format.
const applicantTrackConfig = {
  IMMEDIATE: { color: 'bg-green-500', label: '즉시' },
  SPONSOR: { color: 'bg-blue-500', label: '스폰서' },
  TRANSITION: { color: 'bg-yellow-500', label: '전환' },
  TRANSFER: { color: 'bg-orange-500', label: '이직' },
};

interface RecentApplicantsProps { applicants: Applicant[]; }

function RecentApplicants({ applicants }: RecentApplicantsProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 mb-4">최근 지원자</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50"><tr_><th scope="col" className="px-6 py-3">이름</th><th scope="col" className="px-6 py-3">지원 공고</th><th scope="col" className="px-6 py-3">트랙</th><th scope="col" className="px-6 py-3">지원일</th><th scope="col" className="px-6 py-3">상태</th></tr_></thead>
          <tbody>
            {applicants.map((applicant) => {
              const { color, label } = applicantTrackConfig[applicant.track];
              return (
                <tr key={applicant.id} className="bg-white border-b hover:bg-gray-50">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{applicant.name}</th>
                  <td className="px-6 py-4">{applicant.jobTitle}</td>
                  <td className="px-6 py-4"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${color}`}>{label}</span></td>
                  <td className="px-6 py-4">{applicant.appliedAt}</td>
                  <td className="px-6 py-4">{applicant.status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- MyJobs.tsx ---
// [KO] 회사가 등록한 채용 공고 목록을 보여주는 컴포넌트입니다.
// [EN] A component that displays the list of job postings registered by the company.
interface MyJobsProps { jobs: Job[]; }

function MyJobs({ jobs }: MyJobsProps) {
  const getStatusColor = (status: string) => status === '채용중' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800';
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 mb-4">내 채용 공고</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50"><tr_><th scope="col" className="px-6 py-3">공고명</th><th scope="col" className="px-6 py-3">지원자 수</th><th scope="col" className="px-6 py-3">상태</th><th scope="col" className="px-6 py-3">등록일</th></tr_></thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} className="bg-white border-b hover:bg-gray-50">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{job.title}</th>
                <td className="px-6 py-4">{job.applicantCount}명</td>
                <td className="px-6 py-4"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(job.status)}`}>{job.status}</span></td>
                <td className="px-6 py-4">{job.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- Alerts.tsx ---
// [KO] 중요한 알림 및 할 일 목록을 보여주는 컴포넌트입니다.
// [EN] A component that displays important alerts and to-do items.
interface AlertsProps { alerts: Alert[]; }

function Alerts({ alerts }: AlertsProps) {
  const getPriorityConfig = (priority: Alert['priority']) => {
    if (priority === 'high') return { icon: FaExclamationTriangle, color: 'text-red-500', bgColor: 'bg-red-50' };
    if (priority === 'medium') return { icon: FaBell, color: 'text-yellow-500', bgColor: 'bg-yellow-50' };
    return { icon: FaInfoCircle, color: 'text-blue-500', bgColor: 'bg-blue-50' };
  };
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-full">
      <h3 className="text-lg font-bold text-gray-900 mb-4">알림 및 할 일</h3>
      <ul className="space-y-4">
        {alerts.map((alert) => {
          const { icon: Icon, color, bgColor } = getPriorityConfig(alert.priority);
          return (
            <li key={alert.id} className={`p-4 rounded-lg flex items-start ${bgColor}`}>
              <Icon className={`flex-shrink-0 w-5 h-5 mt-0.5 ${color}`} />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800">{alert.message}</p>
                {alert.dueDate && <p className="text-xs text-gray-600 mt-1">기한: {alert.dueDate}</p>}
              </div>
            </li>
          );
        })}
        {alerts.length === 0 && <div className="text-center py-10 text-gray-500"><FaBell className="mx-auto text-3xl mb-2"/><p>새로운 알림이 없습니다.</p></div>}
      </ul>
    </div>
  );
}


// ==========================================================================================
// 2. Main Page Component / 메인 페이지 컴포넌트
// ==========================================================================================
// [KO] 기업용 대시보드 (E variant) 페이지 컴포넌트입니다.
// [EN] This is the company dashboard (E variant) page component.

export default function CompanyDashboardEPage() {
  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8 font-sans text-gray-800" style={{ fontFamily: "'Pretendard', sans-serif" }}>
      <main className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">정규채용 대시보드 (Visa-Centric Design)</h1>
          <p className="text-gray-600 mt-1">4가지 채용 트랙의 현황을 시각적으로 확인하고 관리하세요.</p>
        </header>

        {/* --- 1. Top Summary Cards / 상단 요약 카드 --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SummaryCard icon={FaBriefcase} title="진행 중 공고" value={summaryData.activeJobCount} unit="건" color="text-blue-500" />
          <SummaryCard icon={FaUsers} title="총 지원자" value={summaryData.totalApplicants} unit="명" color="text-green-500" />
          <SummaryCard icon={FaUserPlus} title="금주 신규 지원" value={summaryData.weeklyNewApplicants} unit="명" color="text-yellow-500" />
          <SummaryCard icon={FaFileSignature} title="채용 확정 대기" value={summaryData.pendingHires} unit="명" color="text-purple-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- 2. Applicants by Track Visualization / 트랙별 지원자 분포 --- */}
          <div className="lg:col-span-2">
            <TrackChart data={applicantsByTrackData} totalApplicants={summaryData.totalApplicants} />
          </div>

          {/* --- 3. Alerts / To-Dos / 알림 및 할 일 --- */}
          <div className="lg:row-span-2">
             <Alerts alerts={alertsData.alerts} />
          </div>

          {/* --- 4. Recent Applicants / 최근 지원자 --- */}
          <div className="lg:col-span-2">
            <RecentApplicants applicants={recentApplicantsData.applicants} />
          </div>
          
          {/* --- 5. My Jobs / 내 공고 --- */}
           <div className="lg:col-span-2">
             <MyJobs jobs={myJobsData.jobs} />
           </div>
        </div>
      </main>
    </div>
  );
}
