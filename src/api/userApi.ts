import { baseApi } from './baseApi';
import type { User, UpdateUserRequest } from '@app-types/api.types';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<User, void>({
      query: () => '/users/me',
      providesTags: ['User'],
    }),

    updateProfile: builder.mutation<User, UpdateUserRequest>({
      query: (data) => ({
        url: '/users/me',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    changePassword: builder.mutation<void, { currentPassword: string; newPassword: string }>({
      query: (data) => ({
        url: '/users/me/password',
        method: 'POST',
        body: data,
      }),
    }),

    deleteAccount: builder.mutation<void, void>({
      query: () => ({
        url: '/users/me',
        method: 'DELETE',
      }),
      invalidatesTags: ['User', 'Auth'],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useLazyGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useDeleteAccountMutation,
} = userApi;
