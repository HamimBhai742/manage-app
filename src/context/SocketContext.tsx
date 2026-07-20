"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  playNotificationSound: (type?: "order" | "message") => void;
  requestNotificationPermission: () => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  playNotificationSound: () => {},
  requestNotificationPermission: () => {},
});

// Synthetic Web Audio API Chime generator (No external mp3 needed!)
const playChime = (type: "order" | "message" = "order") => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";

    if (type === "order") {
      // High-pitched double chime for order (880Hz -> 1320Hz)
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.15);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
    } else {
      // Soft pleasant chime for message (523Hz -> 659Hz)
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.12);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
    }

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.5);
  } catch (e) {
    console.error("Audio Context playback error:", e);
  }
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Request browser push notification permission
  const requestNotificationPermission = () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }
  };

  const playNotificationSound = (type: "order" | "message" = "order") => {
    playChime(type);
  };

  useEffect(() => {
    // Get server base URL without /api/v1
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";
    const socketUrl = apiUrl.replace(/\/api\/v1\/?$/, "");

    const newSocket = io(socketUrl, {
      transports: ["websocket", "polling"],
      autoConnect: true,
    });

    newSocket.on("connect", () => {
      setIsConnected(true);
      if (user) {
        newSocket.emit("join_room", { userId: user.id, role: user.role });
      }
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
    });

    // Global listeners for notifications
    newSocket.on("new_order", (data: any) => {
      playChime("order");
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("🛒 New Order Placed!", {
          body: data.notification?.message || "A new order was received.",
          icon: "/favicon.ico",
        });
      }
    });

    newSocket.on("new_message", (data: any) => {
      if (data.senderId !== user?.id) {
        playChime("message");
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("💬 New Chat Message", {
            body: `${data.sender?.name || "Customer"}: ${data.message}`,
            icon: "/favicon.ico",
          });
        }
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Re-emit join_room when user state changes
  useEffect(() => {
    if (socket && isConnected && user) {
      socket.emit("join_room", { userId: user.id, role: user.role });
    }
  }, [user, socket, isConnected]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        playNotificationSound,
        requestNotificationPermission,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
