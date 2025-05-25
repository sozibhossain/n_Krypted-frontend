"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useSocketContext } from "@/Provider/SocketProvider";
import { useSession } from "next-auth/react";


// types/notification.ts
export interface Deal {
  _id: string;
  title: string;
  description: string;
  participationsLimit: number;
  price: number;
  // Add other deal properties as needed
}

export interface Notification {
  _id: string;
  message: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  isRead: boolean;
  type: string;
  dealId?: Deal;  // Optional because not all notifications might have a deal
  auction?: {    // Optional because not all notifications might have an auction
    title: string;
    // Add other auction properties as needed
  };
}

const Notifications = () => {
  const { notifications, setNotifications } = useSocketContext();
  const session = useSession();
  const userId = session?.data?.user?.id;

  useEffect(() => {
    const fetchInitialNotifications = async () => {
      if (userId) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/notifications?userId=${userId}`
          );
          const data = await response.json();
          if (data.notifications && data.notifications) {
            setNotifications(data.notifications);
          } else {
            console.error(
              "Failed to fetch initial notifications:",
              data.message
            );
          }
        } catch (error) {
          console.error("Error fetching initial notifications:", error);
        }
      }
    };

    fetchInitialNotifications();
  }, [userId, setNotifications]);

  return (
    <div>
      <ul className="space-y-4">
        {notifications.map((notification) => (
          <li
            key={notification._id}
            className="p-4 space-x-4 border-b border-[#595959] hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <Link href={`/deals/${notification.dealId?._id}`} passHref>
              <div className="flex items-center justify-between">
                <p className="text-xl text-white">
                  {notification.message}
                  {notification.auction && (
                    <span className="text-[#FFFFFF] text-xl font-semibold">
                      {" "}
                      ({notification.auction.title})
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-400">
                  {notification.createdAt &&
                    !isNaN(Number(new Date(notification.createdAt)))
                    ? new Date(notification.createdAt).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })
                    : "Unknown date"}
                </p>
              </div>
            </Link>
          </li>
        ))}
        {notifications.length === 0 && (
          <li className="text-gray-500">No new notifications</li>
        )}
      </ul>
    </div>
  );
};

export default Notifications;