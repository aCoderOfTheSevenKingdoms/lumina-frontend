import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSocket } from "../service/chat.socket";
import { getChats, getMessages, deleteChat } from "../service/chat.api";
import {
    setChats,
    setChatMessages,
    appendMessage,
    appendAIMessage,
    appendChunk,
    finalizeMessage,
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

    /**
     * Correlates the outgoing `chat:message` with the server events that follow,
     * since the socket listeners are registered once and cannot read local state.
     */
    const pendingRef = useRef(null);

    useEffect(() => {
        const socket = getSocket();

        const clearPending = () => {
            pendingRef.current = null;
        };

        const rollback = () => {
            const pending = pendingRef.current;
            if (!pending) return;

            const { chatId, optimisticChatId, tempMessageId, tempAiMessageId, resolvedChatId } =
                pending;
            const targetChatId = resolvedChatId || optimisticChatId;

            // Drop the in-flight/partial AI placeholder.
            if (tempAiMessageId) {
                dispatch(
                    removeMessage({ chatId: targetChatId, messageId: tempAiMessageId })
                );
            }

            // If the chat was never persisted (no `chat:started`), also undo the
            // optimistic user message (or the whole temp chat).
            if (!resolvedChatId) {
                if (chatId) {
                    dispatch(
                        removeMessage({ chatId: optimisticChatId, messageId: tempMessageId })
                    );
                } else {
                    dispatch(removeChat(optimisticChatId));
                }
            }

            clearPending();
        };

        const onStarted = (payload) => {
            const pending = pendingRef.current;
            if (!pending) return;

            const { chatId, title } = payload;
            pending.resolvedChatId = chatId;

            dispatch(
                appendAIMessage({
                    chatId,
                    previousId:
                        pending.optimisticChatId !== chatId ? pending.optimisticChatId : null,
                    title,
                    message: {
                        _id: pending.tempAiMessageId,
                        role: "ai",
                        content: "",
                        streaming: true,
                        createdAt: new Date().toISOString()
                    }
                })
            );
            dispatch(setCurrentChatId(chatId));
        };

        const onChunk = ({ chatId, chunk }) => {
            dispatch(appendChunk({ chatId, chunk }));
        };

        const onDone = ({ chatId, messageId, content }) => {
            dispatch(finalizeMessage({ chatId, messageId, content }));
            dispatch(setLoading(false));
            clearPending();
        };

        const onError = ({ message }) => {
            dispatch(setError(message || "Failed to get a response"));
            rollback();
            dispatch(setLoading(false));
        };

        const onConnectError = () => {
            dispatch(setError("Connection lost. Please refresh the page."));
            rollback();
            dispatch(setLoading(false));
        };

        socket.on("chat:started", onStarted);
        socket.on("chat:ai_response_chunk", onChunk);
        socket.on("chat:ai_response_done", onDone);
        socket.on("chat:error", onError);
        socket.on("connect_error", onConnectError);

        return () => {
            socket.off("chat:started", onStarted);
            socket.off("chat:ai_response_chunk", onChunk);
            socket.off("chat:ai_response_done", onDone);
            socket.off("chat:error", onError);
            socket.off("connect_error", onConnectError);
        };
    }, [dispatch]);

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

    function handleSendMessage({ message, chatId }) {
        const tempMessageId = createTempId();
        const tempAiMessageId = createTempId();
        const optimisticChatId = chatId || `temp-chat-${tempMessageId}`;

        pendingRef.current = {
            chatId: chatId || null,
            tempMessageId,
            tempAiMessageId,
            optimisticChatId,
            // Existing chats already have a real id; new chats get one on chat:started.
            resolvedChatId: chatId || null
        };

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
                    content: message,
                    createdAt: new Date().toISOString()
                }
            })
        );

        if (!chatId) dispatch(setCurrentChatId(optimisticChatId));

        dispatch(setLoading(true));

        // Fire-and-forget: the server events drive the rest of the UI.
        getSocket().emit("chat:message", { content: message, chatId });
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
        getSocket,
        handleGetChats,
        handleSelectChat,
        handleNewChat,
        handleSendMessage,
        handleDeleteChat
    };
};
