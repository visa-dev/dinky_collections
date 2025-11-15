"use client";

import LoadingSpinner from "./LoadingSpinner";
import HeaderClient from "./HeaderClient";

export default function PageLoader({ message = "Loading..." }: { message?: string }) {
	return (
		<div className="min-h-dvh">
			<HeaderClient />
			<div className="container py-12 flex items-center justify-center min-h-[calc(100vh-4rem)]">
				<div className="text-center space-y-4">
					<LoadingSpinner size="lg" />
					<p className="text-charcoal/60">{message}</p>
				</div>
			</div>
		</div>
	);
}

