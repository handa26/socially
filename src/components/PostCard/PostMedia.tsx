"use client";

import { useState, useRef } from "react";
import {
	Eye,
	EyeOff,
	Play,
	Pause,
	Volume2,
	VolumeX,
	Maximize,
} from "lucide-react";

import { cn } from "@/lib/utils";

interface PostMediaProps {
	image?: string | null;
	video?: string | null;
	mediaType?: string | null;
	isSensitive?: boolean;
	aspectRatio?: string | null;
}

const PostMedia = ({
	image,
	video,
	mediaType,
	isSensitive = false,
	aspectRatio = "original",
}: PostMediaProps) => {
	const [showSensitive, setShowSensitive] = useState(!isSensitive);
	const [isPlaying, setIsPlaying] = useState(false);
	const [isMuted, setIsMuted] = useState(true);
	const [progress, setProgress] = useState(0);
	const [duration, setDuration] = useState(0);
	const [hasError, setHasError] = useState(false);

	const videoRef = useRef<HTMLVideoElement>(null);

	const toggleSensitive = () => {
		setShowSensitive(!showSensitive);
	};

	// Video controls
	const togglePlay = () => {
		if (!videoRef.current) return;
		if (isPlaying) {
			videoRef.current.pause();
		} else {
			videoRef.current.play();
		}
		setIsPlaying(!isPlaying);
	};

	const toggleMute = () => {
		if (!videoRef.current) return;
		videoRef.current.muted = !isMuted;
		setIsMuted(!isMuted);
	};

	const handleTimeUpdate = () => {
		if (!videoRef.current) return;
		const progress =
			(videoRef.current.currentTime / videoRef.current.duration) * 100;
		setProgress(progress);
	};

	const handleLoadedMetadata = () => {
		if (!videoRef.current) return;
		setDuration(videoRef.current.duration);
	};

	const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!videoRef.current) return;
		const rect = e.currentTarget.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const percentage = x / rect.width;
		videoRef.current.currentTime = percentage * videoRef.current.duration;
	};

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	// Determine aspect ratio class
	const getAspectRatioClass = () => {
		switch (aspectRatio) {
			case "square":
				return "aspect-square";
			case "video":
				return "aspect-video";
			case "portrait":
				return "aspect-[9/16]";
			default:
				return "aspect-auto";
		}
	};

	if (!image && !video) return null;

	// Determine media type
	const isVideo = mediaType === "video" || !!video;

	// Render sensitive content overlay
	if (isSensitive && !showSensitive) {
		return (
			<div className="mt-3 rounded-2xl overflow-hidden border border-border">
				<div className="relative bg-black/5 dark:bg-white/5 min-h-50 flex flex-col items-center justify-center gap-4 p-8">
					<div className="text-center space-y-2">
						<div className="flex justify-center">
							<div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
								<EyeOff className="w-6 h-6 text-muted-foreground" />
							</div>
						</div>
						<p className="text-sm font-medium">Sensitive content</p>
						<p className="text-xs text-muted-foreground max-w-xs">
							This {isVideo ? "video" : "image"} may contain sensitive material
						</p>
					</div>
					<button
						onClick={toggleSensitive}
						className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors"
					>
						<Eye className="w-4 h-4" />
						View {isVideo ? "video" : "image"}
					</button>
				</div>
			</div>
		);
	}

	// Render video
	if (isVideo && video) {
		return (
			<div className="mt-3 rounded-2xl overflow-hidden border border-border bg-black">
				<div className={cn("relative", getAspectRatioClass())}>
					{video && !hasError ? (
						<video
							ref={videoRef}
							src={video}
							className="w-full h-full object-contain"
							onTimeUpdate={handleTimeUpdate}
							onLoadedMetadata={handleLoadedMetadata}
							onPlay={() => setIsPlaying(true)}
							onPause={() => setIsPlaying(false)}
							onClick={togglePlay}
							playsInline
							muted={isMuted}
							onError={() => setHasError(true)}
						/>
					) : (
						<div className="flex items-center justify-center h-full min-h-50 bg-muted">
							<p className="text-sm text-muted-foreground">
								Failed to load video
							</p>
						</div>
					)}

					{/* Video Controls Overlay */}
					<div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-4 pt-8">
						{/* Progress Bar */}
						<div
							className="w-full h-1 bg-white/30 rounded-full cursor-pointer mb-3"
							onClick={handleProgressClick}
						>
							<div
								className="h-full bg-blue-500 rounded-full transition-all"
								style={{ width: `${progress}%` }}
							/>
						</div>

						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								{/* Play/Pause Button */}
								<button
									onClick={togglePlay}
									className="text-white hover:text-white/80 transition-colors"
								>
									{isPlaying ? (
										<Pause className="w-5 h-5" />
									) : (
										<Play className="w-5 h-5" />
									)}
								</button>

								{/* Mute/Unmute Button */}
								<button
									onClick={toggleMute}
									className="text-white hover:text-white/80 transition-colors"
								>
									{isMuted ? (
										<VolumeX className="w-5 h-5" />
									) : (
										<Volume2 className="w-5 h-5" />
									)}
								</button>

								{/* Time Display */}
								<span className="text-white text-xs font-mono">
									{formatTime(videoRef.current?.currentTime || 0)} /{" "}
									{formatTime(duration)}
								</span>
							</div>

							{/* Fullscreen Button */}
							<button
								onClick={() => {
									if (videoRef.current) {
										if (document.fullscreenElement) {
											document.exitFullscreen();
										} else {
											videoRef.current.requestFullscreen();
										}
									}
								}}
								className="text-white hover:text-white/80 transition-colors"
							>
								<Maximize className="w-5 h-5" />
							</button>
						</div>
					</div>

					{/* Sensitive Content Indicator (shown when content is visible) */}
					{isSensitive && (
						<button
							onClick={toggleSensitive}
							className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-black/60 backdrop-blur-sm text-white hover:bg-black/80 transition-colors"
						>
							<Eye className="w-3 h-3" />
							Hide
						</button>
					)}
				</div>
			</div>
		);
	}

	// Render image
	if (image) {
		return (
			<div className="mt-3 rounded-2xl overflow-hidden border border-border relative">
				<div className={cn("relative", getAspectRatioClass())}>
					<img
						src={image}
						alt="Post content"
						className="w-full h-full object-cover"
					/>

					{/* Sensitive Content Indicator */}
					{isSensitive && (
						<button
							onClick={toggleSensitive}
							className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-black/60 backdrop-blur-sm text-white hover:bg-black/80 transition-colors"
						>
							<Eye className="w-3 h-3" />
							Hide
						</button>
					)}
				</div>
			</div>
		);
	}

	return null;
};

export default PostMedia;
