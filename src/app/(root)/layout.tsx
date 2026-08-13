import LeftBar from "@/components/LeftBar";
import RightBar from "@/components/RightBar";

export default function RootLayout({
	children,
	modal,
}: Readonly<{
	children: React.ReactNode;
	modal: React.ReactNode;
}>) {
	return (
		<div className="flex justify-between mx-auto max-w-3xl lg:max-w-5xl xl:max-w-7xl xxl:max-w-screen-xxl">
			<div className="px-2 xsm:px-4 xxl:px-8">
				<LeftBar />
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
