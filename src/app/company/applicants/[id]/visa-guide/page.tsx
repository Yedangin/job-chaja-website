'use client';

/**
 * 기업 측 비자 준비 가이드 / Company-side visa preparation guide
 * 채용 확정 후 기업이 준비할 서류 체크리스트
 * Company's document checklist after hiring confirmation (spec 08 §6-3)
 */

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Building2,
  User,
  FileText,
  Loader2,
  BadgeCheck,
  Clock,
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';

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
  offeredSalary: number | null;
  expectedStartDate: string | null;
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

const SCENARIO_LABELS: Record<string, string> = {
  A: '취업 제한 없음 (F비자)',
  B: '체류자격 변경 (D-10 → E-7)',
  D: '졸업 후 취업 전환 (D-2 → E-7)',
  E: '기업 스폰서십 (비자 신규 발급)',
  F: '기존 비자 활용 (재입국)',
};

export default function CompanyVisaGuidePage() {
  const params = useParams();
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
      await fetchGuide();
    } catch {
      // ignore
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
        <Link href="/company/applicants" className="text-blue-600 text-sm hover:underline mt-4 block">
          지원자 관리로 돌아가기
        </Link>
      </div>
    );
  }

  const companyChecked = data.checklist.company.filter((i) => i.isChecked).length;
  const applicantChecked = data.checklist.applicant.filter((i) => i.isChecked).length;

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* 뒤로가기 / Back */}
        <Link
          href="/company/applicants"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-4 h-4" />
          지원자 관리로 돌아가기
        </Link>

        {/* 헤더 / Header */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                {data.applicant.name}의 비자 준비 현황
              </h1>
              <p className="text-sm text-gray-500">{data.job.title}</p>
            </div>
          </div>

          {/* 요약 정보 / Summary */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-blue-50 rounded-xl p-3">
              <p className="text-blue-600 font-medium text-xs mb-1">현재 비자</p>
              <p className="font-semibold text-gray-900">
                {data.applicant.currentVisa || '해외 거주 (미보유)'}
              </p>
            </div>
            <div className="bg-indigo-50 rounded-xl p-3">
              <p className="text-indigo-600 font-medium text-xs mb-1">필요 절차</p>
              <p className="font-semibold text-gray-900 text-xs">
                {data.scenario ? SCENARIO_LABELS[data.scenario] || data.scenario : '판별 대기'}
              </p>
            </div>
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
          </div>
        </div>

        {/* 전체 진행률 / Overall progress */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900">전체 준비 현황</h2>
            <span className="text-sm font-medium text-blue-600">
              {data.checklist.progress.checked}/{data.checklist.progress.total} 완료
            </span>
          </div>
          <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full transition-all"
              style={{ width: `${data.checklist.progress.percentage}%` }}
            />
          </div>
        </div>

        {/* 기업 준비 서류 (체크 가능) / Company documents (checkable) */}
        {data.checklist.company.length > 0 && (
          <div className="bg-white rounded-2xl border border-orange-100 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-orange-500" />
              <h2 className="font-semibold text-gray-900">기업에서 준비할 서류</h2>
              <span className="text-xs text-gray-400 ml-auto">
                {companyChecked}/{data.checklist.company.length} 완료
              </span>
            </div>
            <div className="space-y-2">
              {data.checklist.company.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  disabled={toggling === item.id}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-orange-50 transition-colors text-left"
                >
                  {toggling === item.id ? (
                    <Loader2 className="w-5 h-5 text-orange-400 animate-spin shrink-0" />
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

        {/* 구직자 준비 서류 (읽기 전용) / Applicant documents (read-only) */}
        {data.checklist.applicant.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-blue-500" />
              <h2 className="font-semibold text-gray-900">구직자가 준비하는 서류</h2>
              <span className="text-xs text-gray-400 ml-auto">
                {applicantChecked}/{data.checklist.applicant.length} 완료
              </span>
            </div>
            <div className="space-y-2">
              {data.checklist.applicant.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-2.5 rounded-xl"
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

        {/* 안내 / Notice */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
          <p className="text-xs text-gray-400">
            ※ 기업 서류를 체크하면 구직자에게도 진행 상태가 반영됩니다.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            ※ 입사 예정일을 역산하여 서류 준비를 시작하세요.
          </p>
        </div>
      </div>
    </div>
  );
}
