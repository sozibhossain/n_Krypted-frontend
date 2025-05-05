"use client";
import { useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { useSocketContext } from "@/Provider/SocketProvider";
import { useSession } from "next-auth/react";

const Notifications = () => {
  const { notifications, setNotifications } = useSocketContext();
  const session = useSession();
  const token = session?.data?.user?.accessToken;

  useEffect(() => {
    const fetchInitialNotifications = async () => {
      if (token) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/bids/notifications`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await response.json();
          if (data.status && data.data) {
            setNotifications(data.data);
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
  }, [token, setNotifications]);

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-4 text-center">Notifications</h2>
      <ul className="space-y-4">
        {notifications.map((notification) => (
          <li
            key={notification._id}
            className="p-4  space-x-4 border-b border-[#dfc5a2]"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {notification.message}
                {notification.auction && (
                  <span className="font-semibold">
                    {" "}
                    ({notification.auction.title})
                  </span>
                )}
              </p>
              <p className="text-xs text-gray-400">
                {formatDistanceToNow(new Date(notification.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
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
