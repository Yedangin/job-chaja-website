'use client';

// 변형 21: 지도 핀 / 위치 카드 디자인
// Variant 21: Map Pin / Location Card Design
// 구글맵 정보 창 + 카카오맵 마커 팝업 스타일
// Google Maps info window + Kakao Map marker popup style

import {
  MapPin,
  Clock,
  Users,
  Briefcase,
  Star,
  AlertTriangle,
  Navigation,
  ChevronRight,
  Eye,
  Zap,
} from 'lucide-react';
import { sampleJobs, getDDay, formatSalary, getTimeAgo } from '../_mock/job-mock-data';
import type { MockJobPosting } from '../_mock/job-mock-data';

// 지역별 그룹 정보 / Region group info
interface RegionGroup {
  name: string;
  color: string;
  bgColor: string;
  borderColor: string;
  pinColor: string;
  jobs: MockJobPosting[];
}

// 지역 추출 함수 / Extract region from location
function getRegion(location: string): string {
  if (location.startsWith('서울')) return '서울';
  if (location.startsWith('경기')) return '경기';
  if (location.startsWith('인천')) return '인천';
  return '기타';
}

// 지역별 스타일 설정 / Region-based style config
const regionStyles: Record<string, { color: string; bgColor: string; borderColor: string; pinColor: string }> = {
  '서울': { color: 'text-blue-700', bgColor: 'bg-blue-50', borderColor: 'border-blue-300', pinColor: 'text-blue-600' },
  '경기': { color: 'text-emerald-700', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-300', pinColor: 'text-emerald-600' },
  '인천': { color: 'text-purple-700', bgColor: 'bg-purple-50', borderColor: 'border-purple-300', pinColor: 'text-purple-600' },
  '기타': { color: 'text-gray-700', bgColor: 'bg-gray-50', borderColor: 'border-gray-300', pinColor: 'text-gray-600' },
};

// 지역별 그룹 생성 / Build region groups
function buildRegionGroups(jobs: MockJobPosting[]): RegionGroup[] {
  const grouped: Record<string, MockJobPosting[]> = {};
  jobs.forEach((job) => {
    const region = getRegion(job.location);
    if (!grouped[region]) grouped[region] = [];
    grouped[region].push(job);
  });

  // 서울 → 경기 → 인천 → 기타 순서 / Order: Seoul → Gyeonggi → Incheon → Other
  const order = ['서울', '경기', '인천', '기타'];
  return order
    .filter((r) => grouped[r]?.length)
    .map((r) => ({
      name: r,
      ...regionStyles[r],
      jobs: grouped[r],
    }));
}

// 미니맵 플레이스홀더 컴포넌트 / Mini map placeholder component
function MiniMapPlaceholder({ region }: { region: string }) {
  // 지역별 다른 그라데이션 색상 / Different gradient colors per region
  const gradients: Record<string, string> = {
    '서울': 'from-blue-200 via-blue-100 to-sky-50',
    '경기': 'from-emerald-200 via-green-100 to-lime-50',
    '인천': 'from-purple-200 via-violet-100 to-fuchsia-50',
    '기타': 'from-gray-200 via-gray-100 to-slate-50',
  };

  return (
    <div className={`w-full h-20 rounded-lg bg-gradient-to-br ${gradients[region] || gradients['기타']} relative overflow-hidden`}>
      {/* 지도 느낌의 격자 패턴 / Grid pattern for map feel */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full" style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }} />
      </div>
      {/* 도로 느낌의 라인 / Road-like lines */}
      <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-white/50 transform -translate-y-1/2" />
      <div className="absolute top-0 bottom-0 left-1/3 w-[2px] bg-white/50" />
      {/* 핀 마커 / Pin marker */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full">
        <div className="relative">
          <MapPin className="w-6 h-6 text-red-500 fill-red-500 drop-shadow-md" />
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-500/30 rounded-full" />
        </div>
      </div>
      {/* 지역 라벨 / Region label */}
      <div className="absolute bottom-1 right-2 text-[10px] font-medium text-gray-500/70">
        {region} 지역
      </div>
    </div>
  );
}

// D-day 색상 매핑 / D-day color mapping
function getDDayColor(dday: string | null): string {
  if (!dday || dday === '상시모집') return 'text-emerald-600 bg-emerald-50';
  if (dday === '마감') return 'text-gray-400 bg-gray-100';
  if (dday === 'D-Day') return 'text-red-600 bg-red-50';
  const num = parseInt(dday.replace('D-', ''));
  if (num <= 3) return 'text-red-600 bg-red-50';
  if (num <= 7) return 'text-orange-600 bg-orange-50';
  return 'text-blue-600 bg-blue-50';
}

// 지도 정보 카드 컴포넌트 / Map info window card component
function MapInfoCard({ job, regionStyle }: { job: MockJobPosting; regionStyle: RegionGroup }) {
  const dday = getDDay(job.closingDate);
  const salary = formatSalary(job);
  const timeAgo = getTimeAgo(job.postedDate);
  const region = getRegion(job.location);

  return (
    <div className="relative group">
      {/* 상단 핀 아이콘 / Top pin icon */}
      <div className="flex justify-center mb-1">
        <div className={`relative ${regionStyle.pinColor}`}>
          <MapPin className="w-8 h-8 fill-current drop-shadow-lg" />
          {/* 핀 위 미세한 그림자 / Subtle shadow above pin */}
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-current rounded-full opacity-20 blur-sm" />
        </div>
      </div>

      {/* 메인 카드 - 말풍선 형태 / Main card - speech bubble shape */}
      <div className={`relative bg-white rounded-2xl border-2 ${regionStyle.borderColor} shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 overflow-hidden`}>
        {/* 프리미엄/긴급 상단 스트립 / Premium/Urgent top strip */}
        {(job.tierType === 'PREMIUM' || job.isUrgent) && (
          <div className={`h-1.5 ${job.tierType === 'PREMIUM' ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400' : 'bg-gradient-to-r from-red-400 via-red-500 to-red-400'}`} />
        )}

        <div className="p-4">
          {/* 위치 - 히어로 요소 (큰 텍스트) / Location - hero element (large text) */}
          <div className={`flex items-center gap-2 mb-3 ${regionStyle.color}`}>
            <Navigation className="w-5 h-5 flex-shrink-0" />
            <span className="text-xl font-bold tracking-tight">{job.location}</span>
          </div>

          {/* 미니맵 플레이스홀더 / Mini map placeholder */}
          <MiniMapPlaceholder region={region} />

          {/* 공고 제목 / Job title */}
          <h3 className="text-sm font-semibold text-gray-900 mt-3 mb-2 line-clamp-2 leading-snug">
            {job.title}
          </h3>

          {/* 회사명 / Company name */}
          <p className="text-xs text-gray-500 mb-3 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5" />
            {job.company}
          </p>

          {/* 급여 정보 / Salary info */}
          <div className={`${regionStyle.bgColor} rounded-lg px-3 py-2 mb-3`}>
            <span className={`text-sm font-bold ${regionStyle.color}`}>
              {salary}
            </span>
          </div>

          {/* 비자 배지 / Visa badges */}
          <div className="flex flex-wrap gap-1 mb-3">
            {job.allowedVisas.map((visa) => (
              <span
                key={visa}
                className="px-2 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-600 rounded-full border border-gray-200"
              >
                {visa}
              </span>
            ))}
          </div>

          {/* 근무 시간 / Work hours */}
          {job.workHours && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
              <Clock className="w-3.5 h-3.5" />
              <span>{job.workHours}</span>
            </div>
          )}

          {/* 하단 메타 정보 / Bottom meta info */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {job.applicantCount}명
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {job.viewCount.toLocaleString()}
              </span>
            </div>

            {/* D-Day 배지 / D-Day badge */}
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${getDDayColor(dday)}`}>
              {dday}
            </span>
          </div>

          {/* 상태 배지 영역 / Status badge area */}
          <div className="flex items-center gap-1.5 mt-2">
            {job.tierType === 'PREMIUM' && (
              <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full border border-amber-200">
                <Star className="w-3 h-3 fill-amber-400" />
                PREMIUM
              </span>
            )}
            {job.isUrgent && (
              <span className="flex items-center gap-0.5 text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full border border-red-200">
                <AlertTriangle className="w-3 h-3" />
                긴급
              </span>
            )}
            {job.isFeatured && (
              <span className="flex items-center gap-0.5 text-[10px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-full border border-purple-200">
                <Zap className="w-3 h-3" />
                추천
              </span>
            )}
          </div>
        </div>

        {/* 상세보기 버튼 / View details button */}
        <button className={`w-full py-2.5 ${regionStyle.bgColor} ${regionStyle.color} text-xs font-semibold flex items-center justify-center gap-1 hover:opacity-80 transition-opacity border-t ${regionStyle.borderColor}`}>
          상세보기
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 하단 삼각형 포인터 (말풍선 꼬리) / Bottom triangle pointer (speech bubble tail) */}
      <div className="flex justify-center">
        <div className="relative">
          {/* 외부 삼각형 (테두리) / Outer triangle (border) */}
          <div
            className="w-0 h-0"
            style={{
              borderLeft: '12px solid transparent',
              borderRight: '12px solid transparent',
              borderTop: `14px solid ${regionStyle.borderColor === 'border-blue-300' ? '#93c5fd' : regionStyle.borderColor === 'border-emerald-300' ? '#6ee7b7' : regionStyle.borderColor === 'border-purple-300' ? '#c4b5fd' : '#d1d5db'}`,
            }}
          />
          {/* 내부 삼각형 (흰색 채우기) / Inner triangle (white fill) */}
          <div
            className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0"
            style={{
              borderLeft: '10px solid transparent',
              borderRight: '10px solid transparent',
              borderTop: '12px solid white',
            }}
          />
        </div>
      </div>

      {/* 바닥 그림자 점 (핀이 꽂힌 느낌) / Bottom shadow dot (pinned feel) */}
      <div className="flex justify-center mt-1">
        <div className="w-3 h-1.5 bg-gray-300 rounded-full blur-[1px]" />
      </div>
    </div>
  );
}

// 메인 페이지 컴포넌트 / Main page component
export default function Variant21Page() {
  const regionGroups = buildRegionGroups(sampleJobs);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-gray-50 to-slate-100">
      {/* 페이지 헤더 / Page header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 상단 타이틀 영역 / Top title area */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-5 py-2 shadow-sm border border-gray-200 mb-4">
            <MapPin className="w-5 h-5 text-red-500 fill-red-500" />
            <span className="text-sm font-semibold text-gray-700">지역별 채용공고</span>
            <span className="text-xs text-gray-400 ml-1">/ Jobs by Region</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
            내 주변 채용공고
          </h1>
          <p className="text-gray-500 text-sm">
            위치 기반으로 가까운 일자리를 찾아보세요 / Find nearby jobs based on location
          </p>
        </div>

        {/* 지역 탭 내비게이션 / Region tab navigation */}
        <div className="flex justify-center gap-3 mb-8 flex-wrap">
          {regionGroups.map((group) => (
            <div
              key={group.name}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 ${group.borderColor} ${group.bgColor} shadow-sm`}
            >
              <MapPin className={`w-4 h-4 ${group.pinColor}`} />
              <span className={`text-sm font-bold ${group.color}`}>{group.name}</span>
              <span className="text-xs text-gray-400 bg-white rounded-full px-2 py-0.5">
                {group.jobs.length}건
              </span>
            </div>
          ))}
        </div>

        {/* 지역별 그룹 렌더링 / Region group rendering */}
        {regionGroups.map((group) => (
          <div key={group.name} className="mb-12">
            {/* 지역 구분 헤더 / Region divider header */}
            <div className="flex items-center gap-3 mb-6">
              <div className={`flex items-center gap-2 ${group.bgColor} ${group.color} px-4 py-2 rounded-xl border ${group.borderColor}`}>
                <MapPin className={`w-5 h-5 ${group.pinColor} fill-current`} />
                <span className="text-lg font-extrabold">{group.name}</span>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent" />
              <span className="text-xs text-gray-400">{group.jobs.length}개 공고</span>
            </div>

            {/* 카드 그리드 / Card grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {group.jobs.map((job) => (
                <MapInfoCard key={job.id} job={job} regionStyle={group} />
              ))}
            </div>
          </div>
        ))}

        {/* 하단 안내 / Bottom notice */}
        <div className="text-center mt-8 pb-8">
          <p className="text-xs text-gray-400">
            * 위치는 공고 등록 시 입력된 근무지 기준입니다
          </p>
          <p className="text-xs text-gray-400">
            * Location is based on the workplace entered during job posting
          </p>
        </div>
      </div>
    </div>
  );
}
