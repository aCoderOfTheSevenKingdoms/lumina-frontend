import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
});

export const getChats = async () => {
    const response = await api.get("/api/chat/");
    return response.data;
}

export const getMessages = async (chatId) => {
    const response = await api.get(`/api/chat/${chatId}/messages`);
    return response.data;
}

export const deleteChat = async (chatId) => {
    const response = await api.delete(`/api/chat/delete/${chatId}`);
    return response.data;
}