import type { User } from '@app-types/api.types';

export const getProfileMockedResponse: User = {
  id: 'user-123',
  email: 'demo@example.com',
  firstName: 'John',
  lastName: 'Doe',
  avatar: 'https://i.pravatar.cc/150?img=1',
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-20T14:30:00Z',
};

export const updateProfileMockedResponse: User = {
  id: 'user-123',
  email: 'demo@example.com',
  firstName: 'Jonathan',
  lastName: 'Doe-Updated',
  avatar: 'https://i.pravatar.cc/150?img=2',
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-20T15:00:00Z',
};

export const changePasswordMockedResponse = {
  success: true,
  message: 'Password changed successfully',
};

export const deleteAccountMockedResponse = {
  success: true,
  message: 'Account deleted successfully',
};

export const profileErrorResponse = {
  message: 'User not found',
};

export const changePasswordErrorResponse = {
  message: 'Current password is incorrect',
};
