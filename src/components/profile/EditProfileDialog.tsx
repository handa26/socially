"use client";

import { useState } from "react";
import toast from "react-hot-toast";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { updateProfile } from "@/actions/profile.action";

interface EditProfileDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	user: any;
	onSuccess?: () => void;
}

const EditProfileDialog = ({
	open,
	onOpenChange,
	user,
	onSuccess,
}: EditProfileDialogProps) => {
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		name: user.name || "",
		bio: user.bio || "",
		location: user.location || "",
		website: user.website || "",
	});

	const handleSubmit = async () => {
		setIsLoading(true);
		const formDataObj = new FormData();
		Object.entries(formData).forEach(([key, value]) => {
			formDataObj.append(key, value);
		});

		try {
			const result = await updateProfile(formDataObj);
			if (result.success) {
				toast.success("Profile updated successfully!");
				onOpenChange(false);
				onSuccess?.();
			} else {
				toast.error("Failed to update profile");
			}
		} catch (error) {
			toast.error("Something went wrong");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-125">
				<DialogHeader>
					<DialogTitle>Edit Profile</DialogTitle>
				</DialogHeader>
				<div className="space-y-4 py-4">
					<div className="space-y-2">
						<Label>Name</Label>
						<Input
							value={formData.name}
							onChange={(e) =>
								setFormData({ ...formData, name: e.target.value })
							}
							placeholder="Your name"
							maxLength={50}
						/>
					</div>
					<div className="space-y-2">
						<Label>Bio</Label>
						<Textarea
							value={formData.bio}
							onChange={(e) =>
								setFormData({ ...formData, bio: e.target.value })
							}
							className="min-h-25"
							placeholder="Tell us about yourself"
							maxLength={160}
						/>
						<p className="text-xs text-muted-foreground text-right">
							{formData.bio.length}/160
						</p>
					</div>
					<div className="space-y-2">
						<Label>Location</Label>
						<Input
							value={formData.location}
							onChange={(e) =>
								setFormData({ ...formData, location: e.target.value })
							}
							placeholder="Where are you based?"
						/>
					</div>
					<div className="space-y-2">
						<Label>Website</Label>
						<Input
							value={formData.website}
							onChange={(e) =>
								setFormData({ ...formData, website: e.target.value })
							}
							placeholder="https://yourwebsite.com"
							type="url"
						/>
					</div>
				</div>
				<div className="flex justify-end gap-3">
					<DialogClose asChild>
						<Button variant="outline" disabled={isLoading}>
							Cancel
						</Button>
					</DialogClose>
					<Button onClick={handleSubmit} disabled={isLoading}>
						{isLoading ? "Saving..." : "Save Changes"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default EditProfileDialog;
