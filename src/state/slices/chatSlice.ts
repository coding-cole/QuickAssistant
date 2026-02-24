import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { storageService } from '@services/storage/storageService';
import { ASYNC_STORAGE_KEYS } from '@config/constants';

export interface SerializableMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
  type?: 'text' | 'transport-options';
  actionLabel?: string;
  actionParams?: {
    origin?: string;
    destination?: string;
    transportOptions?: unknown[];
    lastQuery?: string;
  };
}

interface ChatState {
  messages: SerializableMessage[];
}

const initialState: ChatState = {
  messages: [],
};

export const loadChatHistory = createAsyncThunk('chat/loadHistory', async () => {
  const messages = await storageService.getItem<SerializableMessage[]>(
    ASYNC_STORAGE_KEYS.CHAT_HISTORY
  );
  return messages ?? [];
});

const persistMessages = (messages: SerializableMessage[]) => {
  storageService.setItem(ASYNC_STORAGE_KEYS.CHAT_HISTORY, messages);
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<SerializableMessage>) => {
      state.messages.push(action.payload);
      persistMessages(state.messages);
    },
    clearMessages: (state) => {
      state.messages = [];
      storageService.removeItem(ASYNC_STORAGE_KEYS.CHAT_HISTORY);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadChatHistory.fulfilled, (state, action) => {
      state.messages = action.payload;
    });
  },
});

export const { addMessage, clearMessages } = chatSlice.actions;
export default chatSlice.reducer;
