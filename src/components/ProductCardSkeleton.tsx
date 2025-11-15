"use client";

import SkeletonLoader from "./SkeletonLoader";

export default function ProductCardSkeleton({ count = 1 }: { count?: number }) {
	return (
		<>
			{Array.from({ length: count }).map((_, i) => (
				<div key={i} className="card overflow-hidden">
					<SkeletonLoader variant="card" className="aspect-[4/5] mb-4" />
					<div className="space-y-2">
						<SkeletonLoader variant="text" className="w-3/4" />
						<SkeletonLoader variant="text" className="w-1/2 h-6" />
					</div>
				</div>
			))}
		</>
	);
}

