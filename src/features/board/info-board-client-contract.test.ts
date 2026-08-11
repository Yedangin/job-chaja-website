import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import {
  createAdminInfoBoardPost,
  getAdminInfoBoardPost,
  getCompanyInfoBoardPost,
  getPublicInfoBoardPost,
  getWorkerInfoBoardPost,
  listAdminInfoBoard,
  listCompanyInfoBoard,
  listFeaturedInfoBoard,
  listPublicInfoBoard,
  listWorkerInfoBoard,
  updateAdminInfoBoardPost,
} from '../../lib/info-board-client';
import type { InfoBoardMutation } from './types';

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

test('uses separate public, worker, company, and admin read endpoints', async () => {
  const urls: string[] = [];
  globalThis.fetch = (async (input) => {
    urls.push(String(input));
    return Response.json({ items: [], total: 0, page: 1, limit: 10 });
  }) as typeof fetch;

  await listPublicInfoBoard({ locale: 'en', page: 1 });
  await listWorkerInfoBoard({ locale: 'en', page: 1 });
  await listCompanyInfoBoard({ locale: 'en', page: 1 });
  await listAdminInfoBoard({ locale: 'en', page: 1 });
  await listFeaturedInfoBoard('vi', 6);

  assert.match(urls[0], /^\/api\/info-board\?/);
  assert.doesNotMatch(urls[0], /audience=|status=/);
  assert.match(urls[1], /^\/api\/info-board\/worker\/posts\?/);
  assert.match(urls[2], /^\/api\/info-board\/company\/posts\?/);
  assert.match(urls[3], /^\/api\/info-board\/admin\/posts\?/);
  assert.equal(urls[4], '/api/info-board/featured?locale=vi&limit=6');
});

test('uses role-specific detail endpoints', async () => {
  const urls: string[] = [];
  globalThis.fetch = (async (input) => {
    urls.push(String(input));
    return Response.json({
      id: 9,
      title: 'Notice',
      content: 'Content',
      locale: 'en',
      category: 'ANNOUNCEMENTS',
      status: 'PUBLISHED',
      audience: 'ALL',
      version: 3,
      createdAt: '2026-01-01T00:00:00.000Z',
    });
  }) as typeof fetch;

  await getPublicInfoBoardPost(9, 'en');
  await getWorkerInfoBoardPost(9, 'en');
  await getCompanyInfoBoardPost(9, 'en');
  await getAdminInfoBoardPost(9, 'en');

  assert.equal(urls[0], '/api/info-board/9?locale=en');
  assert.equal(urls[1], '/api/info-board/worker/posts/9?locale=en');
  assert.equal(urls[2], '/api/info-board/company/posts/9?locale=en');
  assert.equal(urls[3], '/api/info-board/admin/posts/9?locale=en');
});

test('sends expectedVersion only for update requests', async () => {
  const requests: Array<{ url: string; init?: RequestInit }> = [];
  globalThis.fetch = (async (input, init) => {
    requests.push({ url: String(input), init });
    return Response.json({
      id: 12,
      title: 'Notice',
      content: 'Content',
      locale: 'en',
      category: 'ANNOUNCEMENTS',
      status: 'DRAFT',
      audience: 'ALL',
      version: 8,
      createdAt: '2026-01-01T00:00:00.000Z',
    });
  }) as typeof fetch;

  const mutation: InfoBoardMutation = {
    category: 'ANNOUNCEMENTS',
    status: 'DRAFT',
    audience: 'ALL',
    isPinned: false,
    isFeatured: true,
    featuredOrder: 2,
    bannerTheme: 'GREEN',
    attachments: [],
    translations: {
      ko: { title: '', summary: '', content: '' },
      en: { title: 'Notice', summary: 'Short summary', content: 'Content' },
      vi: { title: '', summary: '', content: '' },
      th: { title: '', summary: '', content: '' },
      fil: { title: '', summary: '', content: '' },
    },
  };

  await createAdminInfoBoardPost(mutation);
  await updateAdminInfoBoardPost(12, mutation, 7);

  const createBody = JSON.parse(String(requests[0].init?.body)) as Record<string, unknown>;
  const updateBody = JSON.parse(String(requests[1].init?.body)) as Record<string, unknown>;
  assert.equal(requests[0].init?.method, 'POST');
  assert.equal('expectedVersion' in createBody, false);
  assert.equal(createBody.isFeatured, true);
  assert.equal(createBody.featuredOrder, 2);
  assert.equal(createBody.bannerTheme, 'GREEN');
  assert.equal(
    (createBody.translations as Array<Record<string, unknown>>)[0].summary,
    'Short summary',
  );
  assert.equal(requests[1].init?.method, 'PUT');
  assert.equal(updateBody.expectedVersion, 7);
});
