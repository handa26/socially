"use client";

import Link from "next/link";
import Image from "next/image";

import IconWrapper from "./IconWrapper";

import { useActivePath } from "@/hooks/useActivePath";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface MenuItemProps {
	href: string;
	icon: ReactNode;
	label: string;
	isActive?: boolean;
	className?: string;
	labelClassName?: string;
	activeClassName?: string;
	showLabel?: boolean;
	exactMatch?: boolean;
	onClick?: () => void;
}

const MenuItem = ({
	href,
	icon,
	label,
	isActive: forcedActive,
	className,
	labelClassName,
	activeClassName,
	showLabel = true,
	exactMatch = false,
	onClick,
}: MenuItemProps) => {
	const { isActive: getIsActive } = useActivePath();
	const isActive =
		forcedActive !== undefined ? forcedActive : getIsActive(href, exactMatch);

	return (
		<Link
			href={href}
			onClick={onClick}
			className={cn(
				"p-2 rounded-full flex items-center gap-4 transition-all duration-200 group relative w-full",
				isActive
					? "bg-accent/50 text-foreground"
					: "hover:bg-accent/50 text-muted-foreground hover:text-foreground",
				className,
				isActive && activeClassName,
			)}
		>
			<IconWrapper isActive={isActive} size="md">
				{icon}
			</IconWrapper>

			{showLabel && (
				<span
					className={cn(
						"hidden xxl:inline font-medium transition-colors duration-200",
						isActive
							? "text-foreground"
							: "text-muted-foreground group-hover:text-foreground",
						labelClassName,
					)}
				>
					{label}
				</span>
			)}

			{/* {isActive && (
				<span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full hidden xxl:block" />
			)} */}
		</Link>
	);
};

export default MenuItem;
