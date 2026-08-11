import {
  INFO_BOARD_AUDIENCES,
  INFO_BOARD_BANNER_THEMES,
  INFO_BOARD_CATEGORIES,
  INFO_BOARD_LOCALES,
  INFO_BOARD_STATUSES,
  type AdminInfoBoardQuery,
  type CompanyInfoBoardQuery,
  type ConfigureFeaturedInfoBoardInput,
  type InfoBoardAttachment,
  type InfoBoardListResult,
  type InfoBoardFeaturedAudit,
  type InfoBoardLocale,
  type InfoBoardMutation,
  type InfoBoardPost,
  type TranslateInfoBoardInput,
  type InfoBoardTranslation,
  type PublicInfoBoardQuery,
  type WorkerInfoBoardQuery,
} from '../features/board/types';

type JsonRecord = Record<string, unknown>;

export class InfoBoardApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
  ) {
    super(message);
    this.name = 'InfoBoardApiError';
  }
}

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function unwrapInfoBoardPayload(value: unknown): unknown {
  let current = value;
  for (let depth = 0; depth < 3; depth += 1) {
    if (!isRecord(current)) break;
    if ('data' in current && current.data !== undefined) {
      current = current.data;
      continue;
    }
    if ('body' in current && current.body !== undefined) {
      current = current.body;
      continue;
    }
    break;
  }
  return current;
}

function readString(record: JsonRecord, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) return value;
  }
  return undefined;
}

function readBoolean(record: JsonRecord, keys: string[], fallback: boolean): boolean {
  for (const key of keys) {
    if (typeof record[key] === 'boolean') return record[key] as boolean;
  }
  return fallback;
}

function readEnum<T extends string>(
  value: unknown,
  allowed: readonly T[],
  fallback: T,
): T {
  return typeof value === 'string' && allowed.includes(value as T)
    ? (value as T)
    : fallback;
}

function localeSuffix(locale: InfoBoardLocale): string {
  return locale === 'fil' ? 'Fil' : `${locale.charAt(0).toUpperCase()}${locale.slice(1)}`;
}

function normalizeTranslations(record: JsonRecord): Partial<Record<InfoBoardLocale, InfoBoardTranslation>> {
  const result: Partial<Record<InfoBoardLocale, InfoBoardTranslation>> = {};
  const translations = record.translations;

  if (Array.isArray(translations)) {
    for (const item of translations) {
      if (!isRecord(item)) continue;
      const locale = readString(item, ['locale', 'language']);
      if (!locale || !INFO_BOARD_LOCALES.includes(locale as InfoBoardLocale)) continue;
      result[locale as InfoBoardLocale] = {
        title: readString(item, ['title']) || '',
        summary: readString(item, ['summary', 'description']) || '',
        content: readString(item, ['content', 'body']) || '',
      };
    }
  } else if (isRecord(translations)) {
    for (const locale of INFO_BOARD_LOCALES) {
      const item = translations[locale];
      if (isRecord(item)) {
        result[locale] = {
          title: readString(item, ['title']) || '',
          summary: readString(item, ['summary', 'description']) || '',
          content: readString(item, ['content', 'body']) || '',
        };
      }
    }
  }

  const titleTranslations = isRecord(record.titleTranslations) ? record.titleTranslations : {};
  const contentTranslations = isRecord(record.contentTranslations) ? record.contentTranslations : {};
  for (const locale of INFO_BOARD_LOCALES) {
    const suffix = localeSuffix(locale);
    const title =
      readString(titleTranslations, [locale]) ||
      readString(record, [`title${suffix}`, `title_${locale}`]);
    const content =
      readString(contentTranslations, [locale]) ||
      readString(record, [`content${suffix}`, `content_${locale}`]);
    if (title || content) {
      result[locale] = {
        title: title || result[locale]?.title || '',
        summary: result[locale]?.summary || '',
        content: content || result[locale]?.content || '',
      };
    }
  }

  return result;
}

function normalizeAttachments(value: unknown): InfoBoardAttachment[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item, index) => {
    if (!isRecord(item)) return [];
    const rawId = item.id ?? item.attachmentId ?? item.key;
    const id =
      typeof rawId === 'number' || typeof rawId === 'bigint' || typeof rawId === 'string'
        ? String(rawId)
        : String(index);
    const name = readString(item, ['name', 'fileName', 'originalName']) || 'Attachment';
    const rawSize = item.size ?? item.sizeBytes;
    const attachment: InfoBoardAttachment = {
      id,
      name,
      url: readString(item, ['url', 'downloadUrl', 'fileUrl']),
      mimeType: readString(item, ['mimeType', 'contentType']),
      size: typeof rawSize === 'number' ? rawSize : undefined,
    };
    return [attachment];
  });
}

function normalizeLocalizedNumbers(value: unknown): Partial<Record<InfoBoardLocale, number>> {
  if (!isRecord(value)) return {};
  return Object.fromEntries(
    INFO_BOARD_LOCALES.flatMap((locale) => {
      const id = Number(value[locale]);
      return Number.isInteger(id) && id > 0 ? [[locale, id]] : [];
    }),
  );
}

function normalizeLocalizedStrings(value: unknown): Partial<Record<InfoBoardLocale, string>> {
  if (!isRecord(value)) return {};
  return Object.fromEntries(
    INFO_BOARD_LOCALES.flatMap((locale) => {
      const url = value[locale];
      return typeof url === 'string' && url.trim() ? [[locale, url]] : [];
    }),
  );
}

export function normalizeInfoBoardPost(
  value: unknown,
  requestedLocale: InfoBoardLocale = 'ko',
): InfoBoardPost {
  const payload = unwrapInfoBoardPayload(value);
  if (!isRecord(payload)) {
    throw new InfoBoardApiError('The server returned an invalid notice.', 502, 'INVALID_RESPONSE');
  }

  const idValue = payload.id ?? payload.postId;
  const id = typeof idValue === 'number' ? idValue : Number(idValue);
  if (!Number.isFinite(id)) {
    throw new InfoBoardApiError('The notice does not have a valid ID.', 502, 'INVALID_RESPONSE');
  }

  const fallbackTitle = readString(payload, ['title']) || 'Untitled notice';
  const fallbackSummary = readString(payload, ['summary', 'description']) || '';
  const fallbackContent = readString(payload, ['content', 'body']) || '';
  const translations = normalizeTranslations(payload);
  const responseLocale = readEnum(payload.locale, INFO_BOARD_LOCALES, requestedLocale);
  if (!translations[responseLocale] && (fallbackTitle || fallbackContent)) {
    translations[responseLocale] = {
      title: fallbackTitle,
      summary: fallbackSummary,
      content: fallbackContent,
    };
  }

  const hasWorkflowFields =
    'status' in payload ||
    'audience' in payload ||
    'translations' in payload ||
    'isPinned' in payload ||
    'pinned' in payload;
  const rawVersion = Number(payload.version);

  return {
    id,
    category: readEnum(payload.category, INFO_BOARD_CATEGORIES, 'ANNOUNCEMENTS'),
    status: readEnum(payload.status, INFO_BOARD_STATUSES, 'PUBLISHED'),
    audience: readEnum(payload.audience, INFO_BOARD_AUDIENCES, 'ALL'),
    isPinned: readBoolean(payload, ['isPinned', 'pinned'], false),
    isFeatured: readBoolean(payload, ['isFeatured', 'featured'], false),
    featuredOrder:
      Number.isInteger(Number(payload.featuredOrder)) && Number(payload.featuredOrder) > 0
        ? Number(payload.featuredOrder)
        : undefined,
    bannerTheme: readEnum(payload.bannerTheme, INFO_BOARD_BANNER_THEMES, 'BRAND'),
    featuredStartAt: readString(payload, ['featuredStartAt']),
    featuredEndAt: readString(payload, ['featuredEndAt']),
    bannerAssetId:
      Number.isInteger(Number(payload.bannerAssetId)) && Number(payload.bannerAssetId) > 0
        ? Number(payload.bannerAssetId)
        : undefined,
    bannerImage: readString(payload, ['bannerImage']),
    bannerAssetIds: normalizeLocalizedNumbers(payload.bannerAssets),
    bannerImages: normalizeLocalizedStrings(payload.bannerImages),
    translations,
    fallbackTitle,
    fallbackContent,
    thumbnail: readString(payload, ['thumbnail', 'thumbnailUrl']),
    attachments: normalizeAttachments(payload.attachments ?? payload.assets),
    scheduledAt: readString(payload, ['scheduledAt', 'publishAt']),
    publishedAt: readString(payload, ['publishedAt']),
    createdAt: readString(payload, ['createdAt']) || new Date(0).toISOString(),
    updatedAt: readString(payload, ['updatedAt']),
    version: Number.isInteger(rawVersion) && rawVersion >= 0 ? rawVersion : undefined,
    isLegacyContract: !hasWorkflowFields,
  };
}

export function getLocalizedPost(
  post: InfoBoardPost,
  locale: InfoBoardLocale,
): InfoBoardTranslation {
  return (
    post.translations[locale] ||
    post.translations.en ||
    post.translations.ko || {
      title: post.fallbackTitle,
      summary: '',
      content: post.fallbackContent,
    }
  );
}

function extractErrorMessage(value: unknown, fallback: string): string {
  const payload = unwrapInfoBoardPayload(value);
  if (isRecord(payload)) {
    const message = payload.message ?? payload.error;
    if (Array.isArray(message)) return message.filter((item) => typeof item === 'string').join(' ');
    if (typeof message === 'string' && message.trim()) return message;
  }
  return fallback;
}

async function requestJson(path: string, options: RequestInit = {}): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch(path, {
      ...options,
      credentials: 'include',
      headers: {
        ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...(options.headers || {}),
      },
      cache: 'no-store',
    });
  } catch (reason) {
    if (reason instanceof DOMException && reason.name === 'AbortError') {
      throw new InfoBoardApiError('The notice request was cancelled.', 0, 'ABORTED');
    }
    throw new InfoBoardApiError('The notice service is not reachable. Please try again.', 0, 'NETWORK_ERROR');
  }

  const contentType = response.headers.get('content-type') || '';
  const value = contentType.includes('application/json')
    ? await response.json().catch(() => null)
    : await response.text().catch(() => '');

  if (!response.ok) {
    throw new InfoBoardApiError(
      extractErrorMessage(value, `The notice request failed (${response.status}).`),
      response.status,
      response.status === 401
        ? 'AUTH_REQUIRED'
        : response.status === 403
          ? 'FORBIDDEN'
          : response.status === 404
            ? 'NOT_FOUND'
            : response.status === 409
              ? 'EDIT_CONFLICT'
            : response.status === 405
            ? 'UNSUPPORTED_CONTRACT'
            : undefined,
    );
  }
  return unwrapInfoBoardPayload(value);
}

function listParams(query: PublicInfoBoardQuery | CompanyInfoBoardQuery | AdminInfoBoardQuery) {
  const params = new URLSearchParams();
  if (query.search?.trim()) params.set('search', query.search.trim());
  if (query.category) params.set('category', query.category);
  if (query.locale) params.set('locale', query.locale);
  if ('audience' in query && query.audience) params.set('audience', query.audience);
  if ('status' in query && query.status) params.set('status', query.status);
  if ('includeDeleted' in query && query.includeDeleted) params.set('includeDeleted', 'true');
  params.set('page', String(query.page || 1));
  params.set('limit', String(query.limit || 10));
  return params;
}

function normalizeListResult(
  payload: unknown,
  query: PublicInfoBoardQuery | CompanyInfoBoardQuery | AdminInfoBoardQuery,
): InfoBoardListResult {
  const record = isRecord(payload) ? payload : {};
  const rawItems = Array.isArray(payload)
    ? payload
    : Array.isArray(record.items)
      ? record.items
      : Array.isArray(record.results)
        ? record.results
        : [];
  const items = rawItems.map((item) => normalizeInfoBoardPost(item, query.locale));
  const totalValue = record.total ?? (isRecord(record.pagination) ? record.pagination.total : undefined);
  const total = typeof totalValue === 'number' ? totalValue : Number(totalValue || items.length);
  const page = Number(record.page || query.page || 1);
  const limit = Number(record.limit || query.limit || 10);

  return {
    items,
    total: Number.isFinite(total) ? total : items.length,
    page: Number.isFinite(page) ? page : 1,
    limit: Number.isFinite(limit) ? limit : 10,
    isLegacyContract: items.length > 0 && items.every((item) => item.isLegacyContract),
  };
}

export async function listPublicInfoBoard(
  query: PublicInfoBoardQuery,
  signal?: AbortSignal,
): Promise<InfoBoardListResult> {
  const payload = await requestJson(`/api/info-board?${listParams(query).toString()}`, { signal });
  return normalizeListResult(payload, query);
}

export async function listFeaturedInfoBoard(
  locale: InfoBoardLocale,
  limit = 8,
  signal?: AbortSignal,
): Promise<InfoBoardListResult> {
  const params = new URLSearchParams({ locale, limit: String(limit) });
  const payload = await requestJson(`/api/info-board/featured?${params.toString()}`, { signal });
  return normalizeListResult(payload, { locale, page: 1, limit });
}

export async function getPublicInfoBoardPost(
  id: number,
  locale: InfoBoardLocale,
  signal?: AbortSignal,
): Promise<InfoBoardPost> {
  const params = new URLSearchParams({ locale });
  return normalizeInfoBoardPost(
    await requestJson(`/api/info-board/${id}?${params.toString()}`, { signal }),
    locale,
  );
}

export async function listCompanyInfoBoard(
  query: CompanyInfoBoardQuery,
  signal?: AbortSignal,
): Promise<InfoBoardListResult> {
  const payload = await requestJson(`/api/info-board/company/posts?${listParams(query).toString()}`, {
    signal,
  });
  return normalizeListResult(payload, query);
}

export async function getCompanyInfoBoardPost(
  id: number,
  locale: InfoBoardLocale,
  signal?: AbortSignal,
): Promise<InfoBoardPost> {
  const params = new URLSearchParams({ locale });
  return normalizeInfoBoardPost(
    await requestJson(`/api/info-board/company/posts/${id}?${params.toString()}`, { signal }),
    locale,
  );
}

export async function listWorkerInfoBoard(
  query: WorkerInfoBoardQuery,
  signal?: AbortSignal,
): Promise<InfoBoardListResult> {
  const payload = await requestJson(`/api/info-board/worker/posts?${listParams(query).toString()}`, {
    signal,
  });
  return normalizeListResult(payload, query);
}

export async function getWorkerInfoBoardPost(
  id: number,
  locale: InfoBoardLocale,
  signal?: AbortSignal,
): Promise<InfoBoardPost> {
  const params = new URLSearchParams({ locale });
  return normalizeInfoBoardPost(
    await requestJson(`/api/info-board/worker/posts/${id}?${params.toString()}`, { signal }),
    locale,
  );
}

export async function listAdminInfoBoard(
  query: AdminInfoBoardQuery,
  signal?: AbortSignal,
): Promise<InfoBoardListResult> {
  const payload = await requestJson(`/api/info-board/admin/posts?${listParams(query).toString()}`, {
    signal,
  });
  return normalizeListResult(payload, query);
}

export async function getAdminInfoBoardPost(
  id: number,
  locale: InfoBoardLocale,
  signal?: AbortSignal,
): Promise<InfoBoardPost> {
  const params = new URLSearchParams({ locale });
  return normalizeInfoBoardPost(
    await requestJson(`/api/info-board/admin/posts/${id}?${params.toString()}`, { signal }),
    locale,
  );
}

export async function listAdminFeaturedInfoBoard(
  locale: InfoBoardLocale,
  signal?: AbortSignal,
): Promise<InfoBoardListResult> {
  const params = new URLSearchParams({ locale });
  const payload = await requestJson(`/api/info-board/admin/featured?${params.toString()}`, {
    signal,
  });
  return normalizeListResult(payload, { locale, page: 1, limit: 8 });
}

export async function configureAdminFeaturedInfoBoard(
  id: number,
  input: ConfigureFeaturedInfoBoardInput,
): Promise<InfoBoardPost> {
  return normalizeInfoBoardPost(
    await requestJson(`/api/info-board/admin/featured/${id}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    }),
  );
}

export async function reorderAdminFeaturedInfoBoard(
  items: Array<{ id: number; order: number; expectedVersion: number }>,
): Promise<InfoBoardListResult> {
  const payload = await requestJson('/api/info-board/admin/featured/order', {
    method: 'PUT',
    body: JSON.stringify({ items }),
  });
  return normalizeListResult(payload, { locale: 'ko', page: 1, limit: 8 });
}

export async function removeAdminFeaturedInfoBoard(
  id: number,
  expectedVersion: number,
): Promise<InfoBoardPost> {
  return normalizeInfoBoardPost(
    await requestJson(`/api/info-board/admin/featured/${id}/remove`, {
      method: 'POST',
      body: JSON.stringify({ expectedVersion }),
    }),
  );
}

export async function listAdminFeaturedAudit(
  signal?: AbortSignal,
): Promise<InfoBoardFeaturedAudit[]> {
  const payload = await requestJson('/api/info-board/admin/featured/audit', { signal });
  const record = isRecord(payload) ? payload : {};
  const items = Array.isArray(record.items) ? record.items : [];
  return items.flatMap((item) => {
    if (!isRecord(item)) return [];
    const id = Number(item.id);
    if (!Number.isFinite(id)) return [];
    const postId = item.postId === null ? null : Number(item.postId);
    return [{
      id,
      postId: postId === null || Number.isFinite(postId) ? postId : null,
      postTitle: typeof item.postTitle === 'string' ? item.postTitle : null,
      action: readString(item, ['action']) || 'UPDATED',
      previousState: isRecord(item.previousState) ? item.previousState : null,
      nextState: isRecord(item.nextState) ? item.nextState : null,
      actorId: readString(item, ['actorId']) || '-',
      createdAt: readString(item, ['createdAt']) || new Date(0).toISOString(),
    }];
  });
}

export async function translateAdminInfoBoardDraft(
  input: TranslateInfoBoardInput,
): Promise<Partial<Record<InfoBoardLocale, InfoBoardTranslation>>> {
  const payload = await requestJson('/api/info-board/admin/translate', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  const record = isRecord(payload) ? payload : {};
  return normalizeTranslations({ translations: record.translations });
}

function mutationPayload(input: InfoBoardMutation): JsonRecord {
  const primary = input.translations.ko.title.trim()
    ? input.translations.ko
    : input.translations.en;
  return {
    title: primary.title.trim(),
    content: primary.content.trim(),
    category: input.category,
    status: input.status,
    audience: input.audience,
    isPinned: input.isPinned,
    isFeatured: input.isFeatured,
    featuredOrder: input.isFeatured ? input.featuredOrder || 1 : undefined,
    bannerTheme: input.bannerTheme,
    featuredStartAt: input.isFeatured ? input.featuredStartAt || undefined : undefined,
    featuredEndAt: input.isFeatured ? input.featuredEndAt || undefined : undefined,
    bannerAssetId: input.isFeatured ? input.bannerAssetId : undefined,
    scheduledAt: input.status === 'SCHEDULED' ? input.scheduledAt || undefined : undefined,
    thumbnail: input.thumbnail?.trim() || undefined,
    attachmentIds: [...new Set([
      ...input.attachments
        .map((attachment) => Number(attachment.id))
        .filter((id) => Number.isInteger(id) && id > 0),
      ...(input.isFeatured && input.bannerAssetId ? [input.bannerAssetId] : []),
      ...(input.isFeatured ? Object.values(input.bannerAssetIds ?? {}) : []),
    ])],
    translations: INFO_BOARD_LOCALES.flatMap((locale) => {
      const translation = input.translations[locale];
      return translation.title.trim() && translation.content.trim()
        ? [{
            locale,
            title: translation.title.trim(),
            summary: translation.summary.trim() || undefined,
            content: translation.content.trim(),
          }]
        : [];
    }),
  };
}

export async function createAdminInfoBoardPost(input: InfoBoardMutation): Promise<InfoBoardPost> {
  return normalizeInfoBoardPost(
    await requestJson('/api/info-board', {
      method: 'POST',
      body: JSON.stringify(mutationPayload(input)),
    }),
  );
}

export async function updateAdminInfoBoardPost(
  id: number,
  input: InfoBoardMutation,
  expectedVersion: number,
): Promise<InfoBoardPost> {
  return normalizeInfoBoardPost(
    await requestJson(`/api/info-board/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...mutationPayload(input), expectedVersion }),
    }),
  );
}

export async function deleteAdminInfoBoardPost(id: number): Promise<void> {
  await requestJson(`/api/info-board/${id}`, { method: 'DELETE' });
}

export function uploadAdminInfoBoardAttachment(
  file: File,
  onProgress: (progress: number) => void,
): { promise: Promise<InfoBoardAttachment>; abort: () => void } {
  const xhr = new XMLHttpRequest();
  const promise = new Promise<InfoBoardAttachment>((resolve, reject) => {
    xhr.open('POST', '/api/info-board/attachments');
    xhr.withCredentials = true;
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onerror = () => reject(new InfoBoardApiError('The attachment upload failed.', 0, 'NETWORK_ERROR'));
    xhr.onabort = () => reject(new InfoBoardApiError('The attachment upload was cancelled.', 0, 'ABORTED'));
    xhr.onload = () => {
      let value: unknown = null;
      try {
        value = JSON.parse(xhr.responseText);
      } catch {
        value = xhr.responseText;
      }
      if (xhr.status < 200 || xhr.status >= 300) {
        reject(
          new InfoBoardApiError(
            extractErrorMessage(value, `Attachment upload failed (${xhr.status}).`),
            xhr.status,
            xhr.status === 404 || xhr.status === 405 ? 'UNSUPPORTED_CONTRACT' : undefined,
          ),
        );
        return;
      }
      const payload = unwrapInfoBoardPayload(value);
      const attachments = normalizeAttachments(Array.isArray(payload) ? payload : [payload]);
      if (!attachments[0]) {
        reject(new InfoBoardApiError('The upload response is invalid.', 502, 'INVALID_RESPONSE'));
        return;
      }
      resolve(attachments[0]);
    };
    const formData = new FormData();
    formData.append('file', file);
    xhr.send(formData);
  });
  return { promise, abort: () => xhr.abort() };
}

export async function deleteAdminInfoBoardAttachment(id: string): Promise<void> {
  await requestJson(`/api/info-board/attachments/${encodeURIComponent(id)}`, { method: 'DELETE' });
}
