"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

import CreatePost from "@/components/CreatePost/CreatePost";

const PostModal = () => {
	const router = useRouter();

	const closeModal = () => {
		router.back();
	};

	return (
		<div className="absolute w-screen h-screen top-0 left-0 z-20 bg-[#293139a6] flex justify-center">
			<div className="py-4 px-8 rounded-xl bg-black w-150 h-max mt-12">
				{/* TOP */}
				<div className="flex items-center justify-between">
					<div className="cursor-pointer p-2 rounded-full hover:bg-[#181818]" onClick={closeModal}>
						<X />
					</div>
					<div className="text-iconBlue font-bold">Drafts</div>
				</div>

        {/* CENTER */}
				<CreatePost isModal />
			</div>
		</div>
	);
};

export default PostModal;
