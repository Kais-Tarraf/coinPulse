import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = GeistSans;
const geistMono = GeistMono;

export const metadata: Metadata = {
	title: "Coin Pulse",
	description:
		"Crypto Screener App with a built-in High-Frequency Terminal & Dashboard",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
	return (
		<html
			lang="en"
			className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
		>
			<body className="min-h-full flex flex-col">
				<Header />
				{children}
			</body>
		</html>
	);
}
