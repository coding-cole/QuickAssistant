import type { LoginResponse } from '@app-types/api.types';

export const loginMockedResponse: LoginResponse = {
  accessToken: 'mock_access_token_3aLQE6r3UO4VXTJCU10=',
  refreshToken: 'mock_refresh_token_5bMRT9s4VP5WYVKDV21=',
  user: {
    id: 'user-123',
    email: 'demo@example.com',
    firstName: 'John',
    lastName: 'Doe',
    avatar: 'https://i.pravatar.cc/150?img=1',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
  },
};

export const registerMockedResponse: LoginResponse = {
  accessToken: 'mock_access_token_new_user_xyz=',
  refreshToken: 'mock_refresh_token_new_user_abc=',
  user: {
    id: 'user-456',
    email: 'newuser@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    avatar: undefined,
    createdAt: '2024-01-20T14:00:00Z',
    updatedAt: '2024-01-20T14:00:00Z',
  },
};

export const logoutMockedResponse = {
  success: true,
  message: 'Logout successful',
};

export const loginErrorResponse = {
  message: 'Invalid email or password',
};

export const registerErrorResponse = {
  message: 'Email already exists',
};
