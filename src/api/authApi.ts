import { baseApi } from './baseApi';
import type { LoginRequest, LoginResponse, RegisterRequest, User } from '@app-types/api.types';
import { storageService } from '@services/storage';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(_credentials, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          await storageService.setAuthToken(data.accessToken);
          if (data.refreshToken) {
            await storageService.setRefreshToken(data.refreshToken);
          }
        } catch {
          // Swallow storage errors; UI handles API failures
        }
      },
      invalidatesTags: ['Auth'],
    }),

    register: builder.mutation<LoginResponse, RegisterRequest>({
      query: (data) => ({
        url: '/auth/register',
        method: 'POST',
        body: data,
      }),
      async onQueryStarted(_data, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          await storageService.setAuthToken(data.accessToken);
          if (data.refreshToken) {
            await storageService.setRefreshToken(data.refreshToken);
          }
        } catch {
          // Swallow storage errors; UI handles API failures
        }
      },
      invalidatesTags: ['Auth'],
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          await storageService.clearAuthData();
        }
      },
      invalidatesTags: ['Auth', 'User'],
    }),

    getMe: builder.query<User, void>({
      query: () => '/users/me',
      providesTags: ['User'],
    }),

    forgotPassword: builder.mutation<void, { email: string }>({
      query: (data) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: data,
      }),
    }),

    resetPassword: builder.mutation<void, { token: string; password: string }>({
      query: (data) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
