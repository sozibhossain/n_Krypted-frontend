"use client"

import { useSession } from "next-auth/react"
import type React from "react"
import { createContext, useState, useEffect, useContext, useCallback } from "react"
import { io, type Socket } from "socket.io-client"
import { toast } from "sonner"

interface NotificationData {
  dealId: any
  updatedAt: string | number | Date
  _id: string
  message: string
  type: string
  auction?: {
    _id: string
    title: string
    sku: string
  }
  isRead: boolean
  createdAt: string
  notificationCount?: number
  userId?: string
}

interface SocketContextType {
  socket: Socket | null
  notifications: NotificationData[]
  setNotifications: React.Dispatch<React.SetStateAction<NotificationData[]>>
  notificationCount: number
  setNotificationCount: React.Dispatch<React.SetStateAction<number>>
  isConnected: boolean
  connectionError: string | null
}

const SocketContext = createContext<SocketContextType | undefined>(undefined)

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [notifications, setNotifications] = useState<NotificationData[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const session = useSession()
  const token = session?.data?.user?.accessToken
  const userID = session?.data?.user?.id

  const [notificationCount, setNotificationCount] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("notificationCount")
      try {
        return stored ? Number.parseInt(stored, 10) : 0
      } catch (error) {
        console.error("Failed to parse notification count from localStorage:", error)
        return 0
      }
    }
    return 0
  })

  // Save notification count to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("notificationCount", notificationCount.toString())
    }
  }, [notificationCount])

  const handleDealStatusChange = useCallback(
    (data: any) => {
      console.log("deal_status_change received:", data)

      const notificationData: NotificationData = {
        _id: `temp_${Date.now()}`, // Temporary ID since backend doesn't send one
        message: data.message,
        type: "deal_status_change",
        dealId: data.dealsId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isRead: false,
        userId: userID || "",
      }

      setNotifications((prevNotifications) => {
        // Avoid duplicates based on message and dealId
        const exists = prevNotifications.some(
          (notif) => notif.message === data.message && notif.dealId === data.dealsId,
        )
        if (exists) return prevNotifications
        return [notificationData, ...prevNotifications]
      })

      setNotificationCount((prev) => prev + 1)
      toast.success(data.message)
    },
    [userID],
  )

  const handleNewDeal = useCallback(
    (data: any) => {
      console.log("new_deal received:", data)

      const notificationData: NotificationData = {
        _id: `temp_${Date.now()}`, // Temporary ID since backend doesn't send one
        message: data.message,
        type: "new_deal",
        dealId: data.deal?._id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isRead: false,
        userId: userID || "",
      }

      setNotifications((prevNotifications) => {
        const exists = prevNotifications.some(
          (notif) => notif.message === data.message && notif.dealId === data.deal?._id,
        )
        if (exists) return prevNotifications
        return [notificationData, ...prevNotifications]
      })

      setNotificationCount((prev) => prev + 1)
      toast.success(data.message)
    },
    [userID],
  )

  const handlePendingNotifications = useCallback((notifications: NotificationData[]) => {
    console.log("pending_notifications received:", notifications)
    setNotifications(notifications)
    setNotificationCount(notifications.filter((n) => !n.isRead).length)
  }, [])

  // Socket connection management
  useEffect(() => {
    if (!token || !userID) {
      if (socket) {
        console.log("Disconnecting socket - no token or userID")
        socket.disconnect()
        setSocket(null)
        setIsConnected(false)
      }
      return
    }

    if (socket?.connected) {
      return // Already connected
    }

    console.log("Attempting to connect to socket with userID:", userID)

    const newSocket = io("http://localhost:5000", {
      transports: ["websocket", "polling"],
      timeout: 20000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      forceNew: true,
    })

    newSocket.on("connect", () => {
      console.log("Socket connected successfully, ID:", newSocket.id)
      setIsConnected(true)
      setConnectionError(null)

      // Authenticate with the backend
      console.log("Authenticating with userID:", userID)
      newSocket.emit("authenticate", userID)
    })

    newSocket.on("disconnect", (reason) => {
      console.log("Socket disconnected, reason:", reason)
      setIsConnected(false)
    })

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error)
      setConnectionError(error.message)
      setIsConnected(false)
    })

    newSocket.on("reconnect", (attemptNumber) => {
      console.log("Socket reconnected after", attemptNumber, "attempts")
      setIsConnected(true)
      setConnectionError(null)
      // Re-authenticate after reconnection
      newSocket.emit("authenticate", userID)
    })

    newSocket.on("reconnect_error", (error) => {
      console.error("Socket reconnection error:", error)
      setConnectionError(error.message)
    })

    // Listen for backend events
    newSocket.on("deal_status_change", handleDealStatusChange)
    newSocket.on("new_deal", handleNewDeal)
    newSocket.on("pending_notifications", handlePendingNotifications)

    setSocket(newSocket)

    return () => {
      console.log("Cleaning up socket connection")
      newSocket.off("deal_status_change", handleDealStatusChange)
      newSocket.off("new_deal", handleNewDeal)
      newSocket.off("pending_notifications", handlePendingNotifications)
      newSocket.disconnect()
      setSocket(null)
      setIsConnected(false)
    }
  }, [token, userID, handleDealStatusChange, handleNewDeal, handlePendingNotifications])

  return (
    <SocketContext.Provider
      value={{
        socket,
        notifications,
        setNotifications,
        notificationCount,
        setNotificationCount,
        isConnected,
        connectionError,
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}

export const useSocketContext = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error("useSocketContext must be used within a SocketProvider")
  }
  return context
}
