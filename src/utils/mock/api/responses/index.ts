/**
 * Centralized Mock Responses Export
 *
 * This file exports all mocked API responses for easy access in tests
 * and mock server configuration.
 */

// Auth Responses
export {
  loginMockedResponse,
  registerMockedResponse,
  logoutMockedResponse,
  loginErrorResponse,
  registerErrorResponse,
} from './authResponses';

// User Responses
export {
  getProfileMockedResponse,
  updateProfileMockedResponse,
  changePasswordMockedResponse,
  deleteAccountMockedResponse,
  profileErrorResponse,
  changePasswordErrorResponse,
} from './userResponses';
