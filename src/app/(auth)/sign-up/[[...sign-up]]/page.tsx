import { SignUp } from "@clerk/nextjs";

import AuthLayout from "@/components/auth/AuthLayout";

const SignUpPage = () => {
	return (
		<AuthLayout
			title="Create your account"
			subtitle="Join the community and start connecting"
			footerText="Already have an account?"
			footerLinkText="Sign in"
			footerLinkHref="/sign-in"
		>
			<SignUp
				appearance={{
					elements: {
						rootBox: "w-full",
						card: "shadow-none p-0 bg-transparent",
						headerTitle: "hidden",
						headerSubtitle: "hidden",
						socialButtonsBlockButton:
							"w-full py-2 px-4 border border-input rounded-lg hover:bg-accent transition-colors",
						socialButtonsBlockButtonText: "text-sm font-medium",
						dividerLine: "bg-border",
						dividerText: "text-xs text-muted-foreground",
						formFieldLabel: "text-sm font-medium text-foreground",
						formFieldInput:
							"w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background",
						formButtonPrimary:
							"w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
						footerActionLink:
							"text-blue-600 hover:text-blue-700 font-semibold hover:underline",
						identityPreview: "border border-input rounded-lg p-4 bg-muted/50",
						alternativeMethodsBlockButton:
							"w-full py-2 px-4 border border-input rounded-lg hover:bg-accent transition-colors",
						alternativeMethodsBlockButtonText: "text-sm font-medium",
					},
				}}
			/>
		</AuthLayout>
	);
};

export default SignUpPage;
