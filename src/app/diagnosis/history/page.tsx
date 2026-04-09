'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, History, Loader2, LogIn } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import EmptyState from '@/components/empty-state';

interface HistoryEntry {
  sessionId: number;
  topPathwayId: string | null;
  pathwayCount: number;
  createdAt: string;
  nationality: string | null;
  finalGoal: string | null;
}

const NATIONALITY_LABELS: Record<string, string> = {
  VN: 'Vietnam', PH: 'Philippines', TH: 'Thailand', ID: 'Indonesia',
  CN: 'China', KH: 'Cambodia', MM: 'Myanmar', NP: 'Nepal',
  UZ: 'Uzbekistan', MN: 'Mongolia', BD: 'Bangladesh', LK: 'Sri Lanka',
  JP: 'Japan', US: 'USA', GB: 'UK', IN: 'India',
};

const GOAL_LABELS: Record<string, string> = {
  employment: '취업',
  study: '유학',
  permanent_residency: '영주권',
  study_then_work: '유학→취업',
};

export default function DiagnosisHistoryPage() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    try {
      const historyRes = await fetch('/api/visa-planner/history', { credentials: 'include' });

      if (historyRes.status === 401 || historyRes.status === 403) {
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }

      if (historyRes.ok) {
        const data = await historyRes.json();
        setEntries(data.sessions || []);
      }
    } catch {
      setEntries([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <History className="w-5 h-5 text-cyan-600" />
            비자 플래너 이력
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">무료 결과와 이전 플래너 세션을 확인할 수 있습니다.</p>
        </div>
        <Link href="/visa-planner">
          <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700">
            새 플래너 시작
          </Button>
        </Link>
      </div>

      {!isLoggedIn && (
        <Card className="p-12 text-center">
          <LogIn className="w-8 h-8 text-gray-400 mx-auto mb-4" />
          <h3 className="text-base font-semibold text-gray-700 mb-2">로그인이 필요합니다</h3>
          <Link href="/auth/login">
            <Button className="bg-cyan-600 hover:bg-cyan-700">
              <LogIn className="w-4 h-4 mr-2" />
              로그인하기
            </Button>
          </Link>
        </Card>
      )}

      {isLoggedIn && loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
        </div>
      )}

      {isLoggedIn && !loading && entries.length === 0 && (
        <EmptyState
          icon="document"
          title="저장된 플래너 이력이 없습니다"
          description="무료 비자 플래너를 한 번 실행하면 이력이 여기에 표시됩니다."
          actionLabel="비자 플래너 시작"
          actionHref="/visa-planner"
        />
      )}

      {isLoggedIn && !loading && entries.length > 0 && (
        <div className="space-y-4">
          {entries.map((entry) => (
            <Card key={entry.sessionId} className="p-5 border-gray-200 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <Badge className="bg-cyan-100 text-cyan-700 hover:bg-cyan-100">
                      {entry.pathwayCount}개 경로
                    </Badge>
                    {entry.nationality && (
                      <Badge variant="outline">
                        {NATIONALITY_LABELS[entry.nationality] || entry.nationality}
                      </Badge>
                    )}
                    {entry.finalGoal && (
                      <Badge variant="outline">
                        {GOAL_LABELS[entry.finalGoal] || entry.finalGoal}
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">플래너 세션 #{entry.sessionId}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(entry.createdAt).toLocaleString()}
                  </p>
                </div>

                <Button asChild variant="outline">
                  <Link href="/visa-planner">
                    다시 실행
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
