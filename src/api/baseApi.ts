import { createApi, fetchBaseQuery, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import type { FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { API_BASE_URL, IS_DEV } from '@config/env';
import type { RootState } from '@state/store';
import { normalizeApiError } from '@utils/apiErrors';

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

const formatRequestLog = (args: string | FetchArgs) => {
  if (typeof args === 'string') {
    return { url: args, method: 'GET' };
  }

  const { url, method = 'GET', params, body } = args;
  return {
    url,
    method,
    params,
    body,
  };
};

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  if (IS_DEV) {
    const requestLog = formatRequestLog(args);
    console.warn('[API Request]', requestLog);
  }

  let result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    result = {
      ...result,
      error: normalizeApiError(result.error),
    };
  }

  if (IS_DEV) {
    if (result.error) {
      console.warn('[API Response Error]', {
        status: result.error.status,
        data: result.error.data,
        error: 'error' in result.error ? result.error.error : undefined,
      });
    } else {
      console.warn('[API Response]', result.data);
    }
  }

  if (result.error && result.error.status === 401) {
    // TODO: Implement token refresh logic here
    // For now, we'll just return the error
    // You could dispatch a logout action here
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Auth'],
  endpoints: () => ({}),
});
