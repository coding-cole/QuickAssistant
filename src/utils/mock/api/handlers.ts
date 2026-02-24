import { http, HttpResponse } from 'msw';
import { API_BASE_URL } from '@config/env';
import {
  getProfileMockedResponse,
  updateProfileMockedResponse,
  changePasswordMockedResponse,
  deleteAccountMockedResponse,
} from './responses/userResponses';

export const handlers = [
  // User Endpoints
  http.get(`${API_BASE_URL}/users/me`, () => {
    return HttpResponse.json(getProfileMockedResponse, { status: 200 });
  }),

  http.patch(`${API_BASE_URL}/users/me`, () => {
    return HttpResponse.json(updateProfileMockedResponse, { status: 200 });
  }),

  http.post(`${API_BASE_URL}/users/me/password`, () => {
    return HttpResponse.json(changePasswordMockedResponse, { status: 200 });
  }),

  http.delete(`${API_BASE_URL}/users/me`, () => {
    return HttpResponse.json(deleteAccountMockedResponse, { status: 200 });
  }),
];
