'use client';

/**
 * 비자 준비 가이드 상세 페이지 / Visa preparation guide detail page
 * 최종 합격 후 비자 시나리오별 맞춤 체크리스트 표시
 * Shows customized visa checklist after final acceptance (spec 08 §6-2)
 */

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Clock,
  Building2,
  User,
  FileText,
  MapPin,
  Loader2,
  PartyPopper,
  Shield,
  BadgeCheck,
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import EmptyState from '@/components/empty-state';

interface ChecklistItem {
  id: string;
  text: string;
  order: number;
  isChecked: boolean;
  checkedAt: string | null;
}

interface VisaGuideData {
  applicationId: string;
  status: string;
  scenario: string | null;
  visaGuideGeneratedAt: string | null;
  offeredSalary: number | null;
  expectedStartDate: string | null;
  companyMessage: string | null;
  applicant: {
    name: string;
    currentVisa: string | null;
    visaExpiryDate: string | null;
    nationality: string | null;
  };
  company: { name: string };
  job: { title: string };
  checklist: {
    company: ChecklistItem[];
    applicant: ChecklistItem[];
    progress: { total: number; checked: number; percentage: number };
  };
}

const SCENARIO_INFO: Record<string, { label: string; desc: string; icon: typeof PartyPopper }> = {
  A: { label: '취업 제한 없음', desc: 'F비자 보유 — 별도 비자 절차 없이 바로 근무 가능합니다.', icon: PartyPopper },
  B: { label: '체류자격 변경', desc: '출입국관리사무소에서 체류자격 변경 신청이 필요합니다.', icon: FileText },
  D: { label: '졸업 후 취업 전환', desc: '졸업 시기에 따라 D-10 경유 또는 직접 E-7 전환이 필요합니다.', icon: FileText },
  E: { label: '기업 스폰서십', desc: '기업이 비자 발급 인정서를 신청하고, 본국에서 비자를 발급받아야 합니다.', icon: Building2 },
  F: { label: '기존 비자 활용', desc: '비자 유효기간 확인 후 재입국 또는 변경 절차가 필요합니다.', icon: Shield },
};

export default function WorkerVisaGuidePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [data, setData] = useState<VisaGuideData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  const fetchGuide = useCallback(async () => {
    try {
      const res = await apiClient.get(`/api/applications/${id}/visa-guide`);
      setData(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || '비자 가이드를 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchGuide(); }, [fetchGuide]);

  const toggleItem = async (itemId: string) => {
    if (toggling) return;
    setToggling(itemId);
    try {
      await apiClient.patch(`/api/applications/${id}/checklist/${itemId}`);
      await fetchGuide(); // 새로고침 / Refresh
    } catch {
      // 에러 무시 / Ignore
    } finally {
      setToggling(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center py-16">
        <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <p className="text-gray-600">{error || '데이터를 찾을 수 없습니다.'}</p>
        <Link href="/worker/applications" className="text-blue-600 text-sm hover:underline mt-4 block">
          지원 내역으로 돌아가기
        </Link>
      </div>
    );
  }

  const scenario = data.scenario ? SCENARIO_INFO[data.scenario] : null;
  const ScenarioIcon = scenario?.icon || FileText;
  const visaExpiry = data.applicant.visaExpiryDate
    ? new Date(data.applicant.visaExpiryDate)
    : null;
  const daysUntilExpiry = visaExpiry
    ? Math.ceil((visaExpiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* 뒤로가기 / Back */}
        <Link
          href="/worker/applications"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-4 h-4" />
          지원 내역으로 돌아가기
        </Link>

        {/* 헤더 카드 / Header card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <PartyPopper className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">비자 준비 가이드</h1>
              <p className="text-sm text-gray-500">
                {data.company.name} — {data.job.title}
              </p>
            </div>
          </div>

          {/* 기본 정보 / Basic info */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {data.applicant.currentVisa && (
              <div className="bg-blue-50 rounded-xl p-3">
                <p className="text-blue-600 font-medium text-xs mb-1">현재 비자</p>
                <p className="font-semibold text-gray-900">{data.applicant.currentVisa}</p>
              </div>
            )}
            {data.offeredSalary && (
              <div className="bg-green-50 rounded-xl p-3">
                <p className="text-green-600 font-medium text-xs mb-1">제시 연봉</p>
                <p className="font-semibold text-gray-900">{data.offeredSalary.toLocaleString()}만원</p>
              </div>
            )}
            {data.expectedStartDate && (
              <div className="bg-purple-50 rounded-xl p-3">
                <p className="text-purple-600 font-medium text-xs mb-1">입사 예정일</p>
                <p className="font-semibold text-gray-900">
                  {new Date(data.expectedStartDate).toLocaleDateString('ko-KR')}
                </p>
              </div>
            )}
            {scenario && (
              <div className="bg-indigo-50 rounded-xl p-3">
                <p className="text-indigo-600 font-medium text-xs mb-1">시나리오</p>
                <p className="font-semibold text-gray-900">{scenario.label}</p>
              </div>
            )}
          </div>

          {/* 비자 만료 경고 / Visa expiry warning */}
          {visaExpiry && daysUntilExpiry !== null && daysUntilExpiry <= 90 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-yellow-800">
                  비자 만료일: {visaExpiry.toLocaleDateString('ko-KR')} (D-{daysUntilExpiry})
                </p>
                <p className="text-xs text-yellow-700 mt-0.5">
                  만료 전에 체류자격 변경을 완료해야 합니다.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 시나리오 안내 / Scenario description */}
        {scenario && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <ScenarioIcon className="w-5 h-5 text-indigo-600" />
              <h2 className="font-semibold text-gray-900">시나리오 {data.scenario}: {scenario.label}</h2>
            </div>
            <p className="text-sm text-gray-600">{scenario.desc}</p>
          </div>
        )}

        {/* 기업 메시지 / Company message */}
        {data.companyMessage && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-5 h-5 text-gray-400" />
              <h2 className="font-semibold text-gray-900">기업 메시지</h2>
            </div>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{data.companyMessage}</p>
          </div>
        )}

        {/* 진행 상태 / Progress */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900">준비 진행률</h2>
            <span className="text-sm font-medium text-blue-600">
              {data.checklist.progress.checked}/{data.checklist.progress.total} 완료
            </span>
          </div>
          <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${data.checklist.progress.percentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1.5 text-right">
            {data.checklist.progress.percentage}%
          </p>
        </div>

        {/* 체크리스트 빈 상태 / Checklist empty state */}
        {data.checklist.company.length === 0 && data.checklist.applicant.length === 0 && (
          <EmptyState
            icon="document"
            title="체크리스트가 없습니다"
            description="채용이 확정되면 비자 가이드가 생성됩니다."
          />
        )}

        {/* 기업 준비 서류 / Company documents */}
        {data.checklist.company.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-orange-500" />
              <h2 className="font-semibold text-gray-900">기업이 준비하는 서류</h2>
              <span className="text-xs text-gray-400 ml-auto">기업에게 안내 완료</span>
            </div>
            <div className="space-y-2">
              {data.checklist.company.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50"
                >
                  {item.isChecked ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300 shrink-0" />
                  )}
                  <span className={`text-sm ${item.isChecked ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 본인 준비 서류 / Applicant documents */}
        {data.checklist.applicant.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-blue-500" />
              <h2 className="font-semibold text-gray-900">본인이 준비하는 서류</h2>
            </div>
            <div className="space-y-2">
              {data.checklist.applicant.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  disabled={toggling === item.id}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-blue-50 transition-colors text-left"
                >
                  {toggling === item.id ? (
                    <Loader2 className="w-5 h-5 text-blue-400 animate-spin shrink-0" />
                  ) : item.isChecked ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300 shrink-0" />
                  )}
                  <span className={`text-sm ${item.isChecked ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                    {item.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 안내 사항 / Notice */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <p className="text-sm font-medium text-gray-700">신청 장소</p>
          </div>
          <p className="text-sm text-gray-500">
            {data.scenario === 'E'
              ? '본국 한국대사관 (비자 신청) → overseas.mofa.go.kr'
              : '관할 출입국관리사무소 → hikorea.go.kr'}
          </p>
          <p className="text-xs text-gray-400 mt-3">
            ※ 이 안내는 일반적인 절차이며, 개인 상황에 따라 추가 서류가 필요할 수 있습니다.
          </p>
          <p className="text-xs text-gray-400">
            ※ 최종 확인은 출입국관리사무소에 문의하세요.
          </p>
        </div>
      </div>
    </div>
  );
}
