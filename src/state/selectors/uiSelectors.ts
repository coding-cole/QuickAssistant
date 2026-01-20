import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';

const selectUiState = (state: RootState) => state.ui;

export const selectGlobalLoading = createSelector(selectUiState, (ui) => ui.isGlobalLoading);

export const selectToasts = createSelector(selectUiState, (ui) => ui.toasts);

export const selectModals = createSelector(selectUiState, (ui) => ui.modals);

export const selectIsModalOpen = (modalId: string) =>
  createSelector(selectModals, (modals) => modals[modalId] ?? false);
