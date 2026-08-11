import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { NextRequest } from 'next/server';
import { GET, POST } from './[[...path]]/route';

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

test('streams multipart bodies with their boundary and admin credentials intact', async () => {
  const formData = new FormData();
  formData.append('file', new File(['board-file'], 'notice.pdf', { type: 'application/pdf' }));
  const request = new NextRequest('http://localhost/api/info-board/attachments', {
    method: 'POST',
    body: formData,
    headers: {
      authorization: 'Bearer admin-token',
      cookie: 'session=admin-session',
      'x-csrf-token': 'csrf-token',
    },
  });
  const requestBody = request.body;
  const requestContentType = request.headers.get('content-type');
  let forwardedUrl = '';
  let forwardedInit: RequestInit & { duplex?: 'half' } = {};

  globalThis.fetch = (async (input, init) => {
    forwardedUrl = String(input);
    forwardedInit = init || {};
    return Response.json({ data: { id: 41, originalName: 'notice.pdf' } });
  }) as typeof fetch;

  const response = await POST(request, {
    params: Promise.resolve({ path: ['attachments'] }),
  });

  assert.equal(forwardedUrl, 'http://localhost:8000/info-board/attachments');
  assert.equal(forwardedInit.body, requestBody);
  assert.equal(forwardedInit.duplex, 'half');
  assert.match(String(requestContentType), /^multipart\/form-data; boundary=/);
  const headers = new Headers(forwardedInit.headers);
  assert.equal(headers.get('content-type'), requestContentType);
  assert.equal(headers.get('authorization'), 'Bearer admin-token');
  assert.equal(headers.get('cookie'), 'session=admin-session');
  assert.equal(headers.get('x-csrf-token'), 'csrf-token');
  assert.equal(response.status, 200);
});

test('forwards company attachment credentials and preserves binary download headers', async () => {
  const bytes = new Uint8Array([37, 80, 68, 70, 45]);
  const request = new NextRequest(
    'http://localhost/api/info-board/company/attachments/7/content',
    {
      headers: {
        authorization: 'Bearer company-token',
        cookie: 'session=company-session',
      },
    },
  );
  let forwardedUrl = '';
  let forwardedHeaders = new Headers();

  globalThis.fetch = (async (input, init) => {
    forwardedUrl = String(input);
    forwardedHeaders = new Headers(init?.headers);
    return new Response(bytes, {
      status: 200,
      headers: {
        'content-type': 'application/pdf',
        'content-disposition': 'attachment; filename="guide.pdf"',
      },
    });
  }) as typeof fetch;

  const response = await GET(request, {
    params: Promise.resolve({ path: ['company', 'attachments', '7', 'content'] }),
  });

  assert.equal(
    forwardedUrl,
    'http://localhost:8000/info-board/company/attachments/7/content',
  );
  assert.equal(forwardedHeaders.get('authorization'), 'Bearer company-token');
  assert.equal(forwardedHeaders.get('cookie'), 'session=company-session');
  assert.equal(response.headers.get('content-type'), 'application/pdf');
  assert.equal(response.headers.get('content-disposition'), 'attachment; filename="guide.pdf"');
  assert.deepEqual(new Uint8Array(await response.arrayBuffer()), bytes);
});
