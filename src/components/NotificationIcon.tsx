import Link from "next/link";
import { BellIcon } from "lucide-react";

import { Button } from "./ui/button";

import { getNotifications } from "@/actions/notification.action";
import { Notification } from "@/app/notifications/page";

const NotificationIcon = async () => {
  // const [unreadNotifsCounter, setUnreadNotifsCounter] = useState(0);
  
  const data = await getNotifications();
  
  const unreadNotifications = data.filter((n) => !n.read);

  // const fetchNotifications = async () => {
  //   try {
  //     const data = await getNotifications();

  //     const unreadCount = data.filter((n) => !n.read).length;
  //     setUnreadNotifsCounter(unreadCount);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   fetchNotifications();
  //   const interval = setInterval(fetchNotifications, 10000);
  //   return () => clearInterval(interval);
  // }, []);

  return (
    <Button variant="ghost" className="flex items-center justify-start gap-2" asChild>
      <Link href="/notifications" className="relative">
        <BellIcon className="w-4 h-4" />
        {unreadNotifications.length > 0 && (
          <span className="absolute top-0 left-[17px] flex items-center justify-center h-4 w-4 text-[9px] font-bold leading-none text-white bg-red-500 rounded-full">
            {unreadNotifications.length === 0 ? "" : unreadNotifications.length}
          </span>
        )}
        <span className="hidden lg:inline">Notifications</span>
        <span className="inline lg:hidden">Notifications</span>
      </Link>
    </Button>
  );
};

export default NotificationIcon;
