import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';

// Base selectors
const selectAuthState = (state: RootState) => state.auth;

// Memoized selectors
export const selectUser = createSelector(selectAuthState, (auth) => auth.user);

export const selectAccessToken = createSelector(selectAuthState, (auth) => auth.accessToken);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (auth) => auth.isAuthenticated
);

export const selectAuthLoading = createSelector(selectAuthState, (auth) => auth.isLoading);

export const selectUserFullName = createSelector(selectUser, (user) =>
  user ? `${user.firstName} ${user.lastName}` : null
);

export const selectUserEmail = createSelector(selectUser, (user) => user?.email ?? null);

export const selectUserInitials = createSelector(selectUser, (user) => {
  if (!user) return null;
  const firstInitial = user.firstName?.charAt(0) ?? '';
  const lastInitial = user.lastName?.charAt(0) ?? '';
  return `${firstInitial}${lastInitial}`.toUpperCase();
});
