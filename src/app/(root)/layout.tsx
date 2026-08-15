import { currentUser } from "@clerk/nextjs/server";

import LeftBar from "@/components/LeftBar";
import RightBar from "@/components/RightBar";

import { getUserByClerkId } from "@/actions/user.action";
import { getUnreadNotificationCount } from "@/actions/notification.action";

export default async function RootLayout({
	children,
	modal,
}: Readonly<{
	children: React.ReactNode;
	modal: React.ReactNode;
}>) {
	const authUser = await currentUser();
  if (!authUser) return null;

  const user = await getUserByClerkId(authUser.id);
  if (!user) return null;

  const unreadCount = await getUnreadNotificationCount();

	return (
		<div className="flex justify-between mx-auto max-w-3xl lg:max-w-5xl xl:max-w-7xl xxl:max-w-screen-xxl">
			<div className="px-2 xsm:px-4 xxl:px-8">
				<LeftBar user={user} initialUnreadCount={unreadCount} />
			</div>

			<div className="flex-1 lg:min-w-150 border-x border-borderGray">
				{children}
				{modal}
			</div>

			<div className="hidden lg:flex ml-4 md:ml-8 flex-1">
				<RightBar />
			</div>
		</div>
	);
}
