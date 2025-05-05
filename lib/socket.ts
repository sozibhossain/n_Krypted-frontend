import { io } from "socket.io-client";

// Create a singleton socket instance
/* eslint-disable @typescript-eslint/no-explicit-any */
let socket: any;

export const initializeSocket = (url: string, ) => {
  if (!socket) {
    socket = io(url, {
      extraHeaders: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2ZlMTE3N2Q2MzhlNjZjZDc1MWExMWQiLCJpYXQiOjE3NDUyMjI4MTYsImV4cCI6MTc0NTgyNzYxNn0.ZLziWZQsxyJmM17TJ01eZPzlcCRxLpGQWnup9Hlrvro`,
      },
    });
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error("Socket not initialized. Call initializeSocket first.");
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = undefined;
  }
};
