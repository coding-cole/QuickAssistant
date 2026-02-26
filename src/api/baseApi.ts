import { createApi, fetchBaseQuery, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import type { FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { API_BASE_URL } from '@config/env';
import { normalizeApiError } from '@utils/apiErrors';

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers) => {
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

const headersToObject = (headers: globalThis.Headers): Record<string, string> => {
  const result: Record<string, string> = {};
  headers.forEach((value, key) => {
    result[key] = value;
  });
  return result;
};

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const isString = typeof args === 'string';
  const url = isString ? args : args.url;
  const method = isString ? 'GET' : (args.method ?? 'GET');
  const body = isString ? undefined : args.body;
  const params = isString ? undefined : args.params;
  const customHeaders = isString ? undefined : args.headers;

  console.log('[API Request]', {
    url: `${API_BASE_URL}${url}`,
    method,
    ...(params && { params }),
    ...(body && { body }),
    headers: {
      'content-type': 'application/json',
      ...(typeof customHeaders === 'object' && customHeaders !== null ? customHeaders : {}),
    },
  });

  let result = await baseQuery(args, api, extraOptions);

  const status = result.meta?.response?.status;
  const responseHeaders = result.meta?.response?.headers
    ? headersToObject(result.meta.response.headers)
    : {};

  if (result.error) {
    result = { ...result, error: normalizeApiError(result.error) };
    console.log('[API Response Error]', {
      status,
      headers: responseHeaders,
      error: result.error,
    });
  } else {
    console.log('[API Response]', {
      status,
      headers: responseHeaders,
      data: result.data,
    });
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User'],
  endpoints: () => ({}),
});
