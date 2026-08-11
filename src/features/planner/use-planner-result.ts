'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  fetchPlannerResult,
  PlannerApiError,
  readPlannerResult,
  savePlannerResult,
} from '@/lib/planner-api';
import type { PlannerResult } from '@/lib/planner-types';

export type PlannerResultLoadError =
  | 'not-found'
  | 'forbidden'
  | 'load-error';

function parseSessionId(value: string | null) {
  if (!value || !/^\d+$/.test(value)) return null;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
}

function classifyLoadError(error: unknown): PlannerResultLoadError {
  if (error instanceof PlannerApiError) {
    if (error.status === 403 || error.status === 401) return 'forbidden';
    if (error.status === 404) return 'not-found';
  }
  return 'load-error';
}

export function usePlannerResult() {
  const [result, setResult] = useState<PlannerResult | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<PlannerResultLoadError | null>(null);
  const [cacheWarning, setCacheWarning] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setCacheWarning(false);

    const queryValue = new URLSearchParams(window.location.search).get('sessionId');
    const requestedId = parseSessionId(queryValue);
    const cached = readPlannerResult();
    const cachedId = cached?.sessionId ?? cached?.meta.sessionId ?? null;

    if (queryValue && !requestedId) {
      setResult(null);
      setSessionId(null);
      setError('not-found');
      setIsLoading(false);
      return;
    }

    const effectiveId = requestedId || cachedId;
    if (!effectiveId) {
      setResult(null);
      setSessionId(null);
      setError('not-found');
      setIsLoading(false);
      return;
    }

    setSessionId(effectiveId);
    const matchingCache = cachedId === effectiveId ? cached : null;
    if (matchingCache) setResult(matchingCache);

    try {
      const fresh = await fetchPlannerResult(effectiveId);
      savePlannerResult(fresh);
      setResult(fresh);
    } catch (loadError) {
      const kind = classifyLoadError(loadError);
      if (kind === 'load-error' && matchingCache) {
        setCacheWarning(true);
      } else {
        setResult(null);
        setError(kind);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    result,
    sessionId,
    isLoading,
    error,
    cacheWarning,
    retry: load,
  };
}
