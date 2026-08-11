'use client';

import { useEffect, useState } from 'react';
import { loadPolicyStudioSnapshot, loadRuleHistory } from './api';
import type { PolicyStudioSnapshot, RuleVersion, VisaRule } from './types';

interface HistoryState {
  ruleId: string;
  versions: RuleVersion[];
  details: VisaRule[];
  error: string;
}

const EMPTY_HISTORY: HistoryState = { ruleId: '', versions: [], details: [], error: '' };

export function usePolicyStudio() {
  const [snapshot, setSnapshot] = useState<PolicyStudioSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [selectedPathwayId, setSelectedPathwayId] = useState('');
  const [selectedRuleId, setSelectedRuleId] = useState('');
  const [history, setHistory] = useState<HistoryState>(EMPTY_HISTORY);

  useEffect(() => {
    const controller = new AbortController();
    loadPolicyStudioSnapshot(controller.signal)
      .then((data) => {
        setSnapshot(data);
        setSelectedPathwayId((current) => data.pathways.some((item) => item.id === current) ? current : (data.pathways[0]?.id ?? ''));
        setSelectedRuleId((current) => data.rules.some((item) => item.id === current) ? current : (data.rules[0]?.id ?? ''));
      })
      .catch((reason: unknown) => {
        if (!controller.signal.aborted) setError(reason instanceof Error ? reason.message : '정책 스튜디오를 불러오지 못했습니다.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [reloadKey]);

  useEffect(() => {
    if (!selectedRuleId) return;
    const controller = new AbortController();
    loadRuleHistory(selectedRuleId, controller.signal)
      .then(({ versions, details }) => setHistory({ ruleId: selectedRuleId, versions, details, error: '' }))
      .catch((reason: unknown) => {
        if (!controller.signal.aborted) setHistory({
          ruleId: selectedRuleId,
          versions: [],
          details: [],
          error: reason instanceof Error ? reason.message : '규칙 버전 이력을 불러오지 못했습니다.',
        });
      });
    return () => controller.abort();
  }, [selectedRuleId]);

  const reload = () => {
    setLoading(true);
    setError('');
    setReloadKey((key) => key + 1);
  };

  return {
    snapshot,
    loading,
    error,
    reload,
    selectedPathwayId,
    setSelectedPathwayId,
    selectedRuleId,
    setSelectedRuleId,
    ruleVersions: history.ruleId === selectedRuleId ? history.versions : [],
    ruleDetails: history.ruleId === selectedRuleId ? history.details : [],
    historyLoading: Boolean(selectedRuleId && history.ruleId !== selectedRuleId),
    historyError: history.ruleId === selectedRuleId ? history.error : '',
  };
}

