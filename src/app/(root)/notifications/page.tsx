import { Metadata } from "next";

import NotificationList from "@/components/notifications/NotificationList";

import {
	getNotifications,
	markNotificationsAsRead,
} from "@/actions/notification.action";

type Notifications = Awaited<ReturnType<typeof getNotifications>>;
export type Notification = Notifications[number];

export const metadata: Metadata = {
	title: "Notifications",
	description: "Stay updated with your latest interactions",
};

const NotificationsPage = async () => {
	const notifications = await getNotifications();

	return (
		<div className="max-w-150 mx-auto">
			<NotificationList initialNotifications={notifications} />
		</div>
	);
};

export default NotificationsPage;
