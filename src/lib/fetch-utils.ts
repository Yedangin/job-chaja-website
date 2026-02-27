/**
 * 429 재시도 로직이 포함된 fetch 래퍼 / Fetch wrapper with 429 retry logic
 * 백엔드 rate limit에 걸렸을 때 자동으로 재시도하여 데이터 누락 방지
 * Automatically retries on backend rate limit to prevent missing data
 */
export async function fetchWithRetry(
  url: string,
  options?: RequestInit,
  maxRetries = 2,
  retryDelay = 1500,
): Promise<Response> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await fetch(url, options);

    // 429가 아니면 바로 반환 / Return immediately if not 429
    if (response.status !== 429) return response;

    // 마지막 시도면 그냥 반환 / On last attempt, return as-is
    if (attempt === maxRetries) return response;

    // 재시도 전 대기 / Wait before retry
    await new Promise((r) => setTimeout(r, retryDelay * (attempt + 1)));
  }

  // 도달 불가 (타입 안전용) / Unreachable (for type safety)
  return fetch(url, options);
}
