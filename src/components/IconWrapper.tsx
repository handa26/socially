"use client";

import { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface IconWrapperProps {
	children: ReactNode;
	isActive?: boolean;
	className?: string;
	size?: "sm" | "md" | "lg";
}

const IconWrapper = ({
	children,
	isActive,
	className,
	size = "md",
}: IconWrapperProps) => {
	const sizeClasses = {
		sm: "w-4 h-4",
		md: "w-6 h-6",
		lg: "w-8 h-8",
	};

	return (
		<div
			className={cn(
				"relative flex items-center justify-center transition-transform duration-200",
				isActive && "scale-110",
				className,
			)}
		>
			<div
				className={cn(
					sizeClasses[size],
					"transition-colors duration-200",
					isActive
						? "text-foreground"
						: "text-muted-foreground group-hover:text-foreground",
				)}
			>
				{children}
			</div>
			{isActive && (
				<span className="absolute inset-0 bg-blue-500/10 rounded-full -z-10 animate-pulse" />
			)}
		</div>
	);
};

export default IconWrapper;
