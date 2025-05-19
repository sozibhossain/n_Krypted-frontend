"use client";
import { useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { useSocketContext } from "@/Provider/SocketProvider";
import { useSession } from "next-auth/react";


const Notifications = () => {
  const { notifications, setNotifications } = useSocketContext();

  console.log("notifications", notifications);
  const session = useSession();
  const userId = session?.data?.user?.id;




  useEffect(() => {
    const fetchInitialNotifications = async () => {
      if (userId) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/notifications?userId=${userId}`,
            // {
            //   headers: {
            //     Authorization: `Bearer ${token}`,
            //   },
            // }
          );
          const data = await response.json();
          if (data.status && data.data) {
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


  console.log("ewgfvrebh", notifications)
  return (
    <div>
      
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
