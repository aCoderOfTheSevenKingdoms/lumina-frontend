import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        chats: {},
        currentChatId: null,
        isLoading: false,
        error: null
    },
    reducers: {
        setChats: (state, action) => {
            state.chats = action.payload;
        },
        upsertChat: (state, action) => {
            const { chat, messages, previousId } = action.payload;

            if (previousId && previousId !== chat._id) {
                delete state.chats[previousId];
            }

            const existing = state.chats[chat._id] || {};
            state.chats[chat._id] = {
                ...existing,
                ...chat,
                messages: messages ?? existing.messages ?? []
            };
        },
        setChatMessages: (state, action) => {
            const { chatId, messages } = action.payload;

            if (!state.chats[chatId]) {
                state.chats[chatId] = { _id: chatId, messages: [] };
            }

            state.chats[chatId].messages = messages;
            state.chats[chatId].updatedAt = new Date().toISOString();
        },
        appendMessage: (state, action) => {
            const { chatId, message, chat } = action.payload;

            if (!state.chats[chatId]) {
                state.chats[chatId] = {
                    _id: chatId,
                    title: "New conversation",
                    messages: []
                };
            }

            if (chat) {
                state.chats[chatId] = { ...state.chats[chatId], ...chat };
            }

            state.chats[chatId].messages = [...(state.chats[chatId].messages ?? []), message];
            state.chats[chatId].updatedAt = new Date().toISOString();
        },
        removeMessage: (state, action) => {
            const { chatId, messageId } = action.payload;
            const chat = state.chats[chatId];

            if (!chat) return;

            chat.messages = (chat.messages ?? []).filter((message) => message._id !== messageId);
        },
        removeChat: (state, action) => {
            const chatId = action.payload;

            delete state.chats[chatId];

            if (state.currentChatId === chatId) {
                state.currentChatId = null;
            }
        },
        setCurrentChatId: (state, action) => {
            state.currentChatId = action.payload;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    }
});

export const {
    setChats,
    upsertChat,
    setChatMessages,
    appendMessage,
    removeMessage,
    removeChat,
    setCurrentChatId,
    setLoading,
    setError
} = chatSlice.actions;

export default chatSlice.reducer;
