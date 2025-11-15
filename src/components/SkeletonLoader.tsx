"use client";

interface SkeletonLoaderProps {
	className?: string;
	variant?: "text" | "circular" | "rectangular" | "card";
	width?: string;
	height?: string;
	count?: number;
}

export default function SkeletonLoader({
	className = "",
	variant = "rectangular",
	width,
	height,
	count = 1,
}: SkeletonLoaderProps) {
	const baseClasses = "loading-shimmer rounded-lg";
	
	const variantClasses = {
		text: "h-4",
		circular: "rounded-full aspect-square",
		rectangular: "h-full",
		card: "h-full rounded-xl",
	};

	const style: React.CSSProperties = {};
	if (width) style.width = width;
	if (height) style.height = height;

	if (count > 1) {
		return (
			<>
				{Array.from({ length: count }).map((_, i) => (
					<div
						key={i}
						className={`${baseClasses} ${variantClasses[variant]} ${className}`}
						style={style}
					/>
				))}
			</>
		);
	}

	return (
		<div
			className={`${baseClasses} ${variantClasses[variant]} ${className}`}
			style={style}
		/>
	);
}

