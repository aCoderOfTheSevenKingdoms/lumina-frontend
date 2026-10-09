import {io} from "socket.io-client";

let socket = null;

export function getSocket() {
    if(!socket) {
        socket = io(import.meta.env.VITE_API_URL, {
            withCredentials: true 
        });
    }
    return socket;
}

export function disconnectSocket() {
    socket?.disconnect();
    socket = null;
}