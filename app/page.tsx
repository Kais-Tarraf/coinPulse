import Categories from "@/components/home/Categories";
import CoinOverview from "@/components/home/CoinOverview";
import {
	CoinOverviewFallback,
	TopCategoriesFallback,
	TrendingCoinsFallback,
} from "@/components/home/fallback";
import TrendingCoins from "@/components/home/TrendingCoins";
import { Suspense } from "react";
// prompt to create loading skeleton
// Create a fallback.tsx file with CoinOverviewFallback
// and TrendingCoinsFallback skeleton Uls that match the
// existing #coin-overview-fallback and #trending-coins-fallback css rules, using datatable for the trending
// table layout. update page.tsx to use these components
// as suspense fallbacks.
//=======================================================

// Prompt for dummy Trending Coins:
// Review app/page.tsx and add a local dummy TrendingCoin[]
// dataset matching the TrendingCoin type. Use existing local
// image assets for thumb/large so images resolve. Wire the
// dummy data into the DataTable so the table renders rows.
// const dummyTrendingCoins: TrendingCoin[] = [
// 	{
// 		item: {
// 			id: "bitcoin",
// 			name: "Bitcoin",
// 			symbol: "BTC",
// 			market_cap_rank: 1,
// 			thumb: "/logo.svg",
// 			large: "/logo.svg",
// 			data: {
// 				price: 89113,
// 				price_change_percentage_24h: {
// 					usd: 2.5,
// 				},
// 			},
// 		},
// 	},
// 	{
// 		item: {
// 			id: "ethereum",
// 			name: "Ethereum",
// 			symbol: "ETH",
// 			market_cap_rank: 2,
// 			thumb: "/converter.svg",
// 			large: "/converter.svg",
// 			data: {
// 				price: 4500,
// 				price_change_percentage_24h: {
// 					usd: -1.2,
// 				},
// 			},
// 		},
// 	},
// ];

const page = async () => {
	return (
		<main className="main-container">
			<section className="home-grid">
				<Suspense fallback={<CoinOverviewFallback />}>
					<CoinOverview />
				</Suspense>
				<Suspense fallback={<TrendingCoinsFallback />}>
					<TrendingCoins />
				</Suspense>
			</section>
			<section className="w-full mt-7 space-y-4">
				<Suspense fallback={<TopCategoriesFallback />}>
					<Categories />
				</Suspense>
			</section>
		</main>
	);
};

export default page;
