import { useDispatch, useSelector } from "react-redux";
import { initializeSocketConnection } from "../service/chat.socket";
import { sendMessage, getChats, getMessages, deleteChat } from "../service/chat.api";
import {
    setChats,
    upsertChat,
    setChatMessages,
    appendMessage,
    removeMessage,
    removeChat,
    setCurrentChatId,
    setLoading,
    setError
} from "../chat.slice";

/**
 * Builds a client-side unique id for optimistically rendered messages/chats
 * before the server persists them and hands back the real Mongo `_id`.
 */
const createTempId = () => {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return `temp-${crypto.randomUUID()}`;
    }
    return `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const buildTitle = (message) =>
    message.length > 60 ? `${message.slice(0, 57)}…` : message;

export const useChat = () => {
    const dispatch = useDispatch();
    const { chats, currentChatId, isLoading } = useSelector((state) => state.chat);

    async function handleGetChats() {
        try {
            const data = await getChats();
            const list = data.chats ?? [];

            const normalized = list.reduce((acc, chat) => {
                acc[chat._id] = { ...chat, messages: [] };
                return acc;
            }, {});

            dispatch(setChats(normalized));
            return normalized;
        } catch (err) {
            dispatch(setError(err.response?.data?.message || "Failed to load chats"));
            return {};
        }
    }

    async function handleSelectChat(chat) {
        dispatch(setError(null));
        dispatch(setCurrentChatId(chat._id));

        if (chats[chat._id]?.messages?.length) return;

        try {
            const data = await getMessages(chat._id);
            dispatch(setChatMessages({ chatId: chat._id, messages: data.messages ?? [] }));
        } catch (err) {
            dispatch(setError(err.response?.data?.message || "Failed to load messages"));
        }
    }

    function handleNewChat() {
        dispatch(setError(null));
        dispatch(setCurrentChatId(null));
    }

    async function handleSendMessage({ message, chatId }) {
        const tempMessageId = createTempId();
        const optimisticChatId = chatId || `temp-chat-${tempMessageId}`;

        dispatch(setError(null));

        // Optimistically render the user's message immediately with a unique _id
        // so the list renders without waiting for the DB round-trip.
        dispatch(
            appendMessage({
                chatId: optimisticChatId,
                chat: chatId ? null : { title: buildTitle(message) },
                message: {
                    _id: tempMessageId,
                    role: "user",
                    content: message
                }
            })
        );

        if (!chatId) dispatch(setCurrentChatId(optimisticChatId));

        dispatch(setLoading(true));

        try {
            const data = await sendMessage({ message, chatId });
            const { chat, chatTitle, messages, aiMessage } = data;

            // Re-fetched from the DB: every message now carries its real `_id`.
            const allMessages = [...(messages ?? []), aiMessage].filter(Boolean);
            const resolvedChatId = chat?._id || chatId;

            if (chat) {
                dispatch(
                    upsertChat({
                        chat: { ...chat, title: chat.title || chatTitle || buildTitle(message) },
                        messages: allMessages,
                        previousId: optimisticChatId
                    })
                );
            } else {
                dispatch(setChatMessages({ chatId: resolvedChatId, messages: allMessages }));
            }

            dispatch(setCurrentChatId(resolvedChatId));
            return allMessages;
        } catch (err) {
            dispatch(setError(err.response?.data?.message || "Failed to get a response"));

            if (chatId) {
                dispatch(removeMessage({ chatId: optimisticChatId, messageId: tempMessageId }));
            } else {
                dispatch(removeChat(optimisticChatId));
            }

            return null;
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleDeleteChat(chatId) {
        try {
            await deleteChat(chatId);
            dispatch(removeChat(chatId));
        } catch (err) {
            dispatch(setError(err.response?.data?.message || "Failed to delete chat"));
        }
    }

    return {
        chats,
        currentChatId,
        isLoading,
        initializeSocketConnection,
        handleGetChats,
        handleSelectChat,
        handleNewChat,
        handleSendMessage,
        handleDeleteChat
    };
};
