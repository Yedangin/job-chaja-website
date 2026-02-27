/**
 * 프록시 라우트용 백엔드 응답 언래핑 유틸리티
 * Proxy route utility for unwrapping backend responses
 *
 * 백엔드 SuccessTransformInterceptor가 모든 성공 응답을 {"status":"OK","data":{...}} 로 래핑함.
 * Backend SuccessTransformInterceptor wraps ALL success responses as {"status":"OK","data":{...}}.
 *
 * 이 함수를 프록시 라우트에서 response.json() 직후 호출하면
 * 클라이언트가 native fetch든 apiClient든 항상 실제 데이터를 받음.
 * Call this in proxy routes right after response.json() so clients
 * always receive actual data regardless of using native fetch or apiClient.
 *
 * @example
 * const rawData = await response.json();
 * const data = unwrapBackendResponse(rawData);
 * return NextResponse.json(data, { status: response.status });
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function unwrapBackendResponse(data: any): any {
  if (
    data &&
    typeof data === 'object' &&
    !Array.isArray(data) &&
    data.status === 'OK' &&
    'data' in data
  ) {
    return data.data;
  }
  return data;
}
