/* global Request, RequestInit, Response, fetch */
import { API_BASE_URL } from '@config/env';
import {
  loginMockedResponse,
  registerMockedResponse,
  logoutMockedResponse,
} from './responses/authResponses';
import {
  getProfileMockedResponse,
  updateProfileMockedResponse,
  changePasswordMockedResponse,
  deleteAccountMockedResponse,
} from './responses/userResponses';

type MockRoute = {
  method: string;
  path: string;
  response: unknown;
  status?: number;
};

const mockRoutes: MockRoute[] = [
  { method: 'POST', path: '/auth/login', response: loginMockedResponse },
  { method: 'POST', path: '/auth/register', response: registerMockedResponse, status: 201 },
  { method: 'POST', path: '/auth/logout', response: logoutMockedResponse },
  { method: 'GET', path: '/users/me', response: getProfileMockedResponse },
  { method: 'PATCH', path: '/users/me', response: updateProfileMockedResponse },
  { method: 'POST', path: '/users/me/password', response: changePasswordMockedResponse },
  { method: 'DELETE', path: '/users/me', response: deleteAccountMockedResponse },
];

/**
 * Simple fetch interceptor for React Native development
 *
 * Intercepts fetch requests to the API and returns mock responses.
 * Only active in development mode (__DEV__).
 */
export function enableMocking(): void {
  if (!__DEV__) {
    return;
  }

  const originalFetch = global.fetch;

  global.fetch = (async (input: string | Request, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input.url;
    // Check method from init first, then from Request object if input is a Request
    const method =
      init?.method?.toUpperCase() ||
      (typeof input !== 'string' && input.method ? input.method.toUpperCase() : 'GET');

    console.log(`[Mock] Intercepted: ${method} ${url}`);

    // Check if this request matches a mock route
    for (const route of mockRoutes) {
      const fullPath = `${API_BASE_URL}${route.path}`;
      if (url === fullPath && method === route.method) {
        console.warn(`[Mock] Matched route: ${route.path}`);
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 300));

        const body = JSON.stringify(route.response);
        return new Response(body, {
          status: route.status || 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    console.log(`[Mock] No match, passing through to original fetch`);
    // Pass through to original fetch for non-mocked requests
    return originalFetch(input, init);
  }) as typeof fetch;

  console.log('[Mock] API mocking enabled for development');
}
