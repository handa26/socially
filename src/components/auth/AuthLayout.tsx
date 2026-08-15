"use client";

import { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";

interface AuthLayoutProps {
	children: ReactNode;
	title: string;
	subtitle?: string;
	showBackButton?: boolean;
	footerText?: string;
	footerLinkText?: string;
	footerLinkHref?: string;
}

const AuthLayout = ({
	children,
	title,
	subtitle,
	footerText,
	footerLinkText,
	footerLinkHref,
}: AuthLayoutProps) => {
	return (
		<div className="min-h-screen flex flex-col lg:flex-row">
			{/* Left Side - Branding/Image */}
			<div className="relative hidden lg:flex lg:w-1/2 bg-linear-to-br from-blue-600 via-blue-700 to-blue-800 overflow-hidden">
				{/* Background Pattern */}
				<div className="absolute inset-0 opacity-10">
					<div
						className="absolute inset-0"
						style={{
							backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
						}}
					/>
					<div
						className="absolute inset-0"
						style={{
							backgroundImage: `radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
						}}
					/>
				</div>

				{/* Content */}
				<div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-12 text-white">
					<div className="max-w-md space-y-8">
						{/* Logo */}
						<div className="flex items-center gap-1">
							<div className="flex items-center justify-center">
								<Image
									src="/socially-logo.png"
									alt="logo"
									width={42}
									height={42}
									className="object-center mt-1.5"
								/>
							</div>
							<span className="text-3xl font-bold tracking-tight">
								Socially
							</span>
						</div>

						{/* Tagline */}
						<div className="space-y-4">
							<h1 className="text-4xl font-bold leading-tight">
								Join the conversation.
								<br />
								Connect with the world.
							</h1>
							<p className="text-lg text-blue-100">
								Share your thoughts, follow your interests, and be part of the
								community.
							</p>
						</div>

						{/* Features */}
						<div className="space-y-3 pt-4">
							{[
								"Real-time updates",
								"Connect with like-minded people",
								"Share your story",
								"Stay informed",
							].map((feature, index) => (
								<div key={index} className="flex items-center gap-3 text-sm">
									<div className="w-5 h-5 rounded-full bg-blue-500/30 flex items-center justify-center">
										<svg
											className="w-3 h-3"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M5 13l4 4L19 7"
											/>
										</svg>
									</div>
									<span>{feature}</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* Right Side - Auth Form */}
			<div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-background">
				<div className="w-full max-w-md">
					{/* Mobile Logo */}
					<div className="lg:hidden flex items-center justify-center mb-8">
						<div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
							<svg
								viewBox="0 0 24 24"
								className="w-8 h-8 text-white"
								fill="currentColor"
							>
								<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
							</svg>
						</div>
					</div>

					{/* Header */}
					<div className="mb-8">
						<h1 className="text-2xl font-bold tracking-tight">{title}</h1>
						{subtitle && (
							<p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
						)}
					</div>

					{/* Auth Form */}
					{children}

					{/* Footer */}
					{footerText && footerLinkText && footerLinkHref && (
						<div className="mt-6 text-center text-sm">
							<span className="text-muted-foreground">{footerText} </span>
							<Link
								href={footerLinkHref}
								className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
							>
								{footerLinkText}
							</Link>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default AuthLayout;
