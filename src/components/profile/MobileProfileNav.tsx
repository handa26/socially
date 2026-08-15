"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

interface MobileProfileNavProps {
	title: string;
	postCount?: number;
}

const MobileProfileNav = ({ title, postCount }: MobileProfileNavProps) => {
	const router = useRouter();

	return (
		<div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
			<div className="flex items-center px-4 h-14">
				<Button
					variant="ghost"
					size="sm"
					className="h-8 w-8 p-0"
					onClick={() => router.back()}
				>
					<ArrowLeft className="h-5 w-5" />
				</Button>
				<div className="flex-1 ml-2">
					<h1 className="font-bold text-lg">{title}</h1>
					{postCount !== undefined && (
						<p className="text-xs text-muted-foreground">{postCount} posts</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default MobileProfileNav;
