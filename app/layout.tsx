import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Header from "@/components/Header";
import { fetcher } from "@/lib/coingecko.actions";
import { TrendingCoin } from "@/type";

const geistSans = GeistSans;
const geistMono = GeistMono;

export const metadata: Metadata = {
	title: "Coin Pulse",
	description:
		"Crypto Screener App with a built-in High-Frequency Terminal & Dashboard",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
	let trendingCoins: TrendingCoin[] = [];
	try {
		const response = await fetcher<{ coins: TrendingCoin[] }>(
			"/search/trending",
			undefined,
			300
		);
		trendingCoins = response.coins;
	} catch (error) {
		console.error("Failed to fetch trending coins for header:", error);
	}

	return (
		<html
			lang="en"
			className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
		>
			<body className="min-h-full flex flex-col">
				<Header trendingCoins={trendingCoins} />
				{children}
			</body>
		</html>
	);
}
