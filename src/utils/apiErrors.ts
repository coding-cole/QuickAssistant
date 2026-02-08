import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { SerializedError } from '@reduxjs/toolkit';

type ErrorData = {
  message?: string;
  error?: string;
  detail?: string;
  errors?: string[] | Record<string, string | string[]>;
};

const isFetchBaseQueryError = (error: unknown): error is FetchBaseQueryError =>
  typeof error === 'object' && error !== null && 'status' in error;

const isSerializedError = (error: unknown): error is SerializedError =>
  typeof error === 'object' && error !== null && ('message' in error || 'name' in error);

const parseErrorData = (data: unknown): string | null => {
  if (!data) return null;

  if (typeof data === 'string') {
    const trimmed = data.trim();
    if (!trimmed) return null;

    try {
      const parsed = JSON.parse(trimmed) as ErrorData;
      return parsed.message || parsed.error || parsed.detail || trimmed;
    } catch {
      return trimmed;
    }
  }

  if (typeof data === 'object') {
    const payload = data as ErrorData;
    if (payload.message || payload.error || payload.detail) {
      return payload.message || payload.error || payload.detail || null;
    }

    if (payload.errors) {
      if (Array.isArray(payload.errors)) {
        return payload.errors.join('\n');
      }

      const values = Object.values(payload.errors)
        .flatMap((value) => (Array.isArray(value) ? value : [value]))
        .filter(Boolean);

      if (values.length > 0) {
        return values.join('\n');
      }
    }
  }

  return null;
};

const statusFallbackMessage = (status: number): string => {
  if (status === 401) return 'Your session has expired. Please sign in again.';
  if (status === 403) return 'You do not have permission to perform this action.';
  if (status === 404) return 'The requested resource could not be found.';
  if (status >= 500) return 'The server had a problem. Please try again later.';
  return `Request failed (${status}).`;
};

export const getApiErrorMessage = (
  error: unknown,
  fallback = 'Something went wrong. Please try again.'
): string | null => {
  if (!error) return null;

  if (isFetchBaseQueryError(error)) {
    if (typeof error.status === 'number') {
      const parsed = parseErrorData(error.data);
      return parsed || statusFallbackMessage(error.status);
    }

    if (error.status === 'FETCH_ERROR') {
      return error.error || 'Network request failed. Check your connection and try again.';
    }

    if (error.status === 'PARSING_ERROR') {
      const parsed = parseErrorData(error.data);
      return parsed || error.error || 'We had trouble reading the response.';
    }

    if (error.status === 'TIMEOUT_ERROR') {
      return error.error || 'Request timed out. Please try again.';
    }

    return error.error || fallback;
  }

  if (isSerializedError(error)) {
    return error.message || fallback;
  }

  if (error instanceof Error) {
    return error.message || fallback;
  }

  return fallback;
};

export const normalizeApiError = (error: FetchBaseQueryError): FetchBaseQueryError => {
  if (typeof error.status !== 'number') {
    return error;
  }

  const message = getApiErrorMessage(error);
  if (!message) return error;

  return {
    ...error,
    data: {
      ...(typeof error.data === 'object' && error.data !== null ? (error.data as object) : {}),
      message,
    },
  } as FetchBaseQueryError;
};
