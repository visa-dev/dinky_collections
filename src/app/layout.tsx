import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import PageTransition from "@/components/PageTransition";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
	title: "Dinky's Collection | Wear Confidence",
	description: "Wear Confidence – Dinky's Collection. Modern, premium fashion for everyone.",
	metadataBase: new URL("http://localhost:3000"),
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${inter.variable} ${playfair.variable} min-h-dvh bg-beige text-charcoal antialiased`}>
				<Providers>
					<PageTransition>{children}</PageTransition>
				</Providers>
			</body>
		</html>
	);
}
