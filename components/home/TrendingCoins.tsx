import { fetcher } from "@/lib/coingecko.actions";
import { cn, formatCurrency } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import DataTable from "../DataTable";
import { TrendingCoinsFallback } from "./fallback";

const columns: DataTableColumn<TrendingCoin>[] = [
	{
		header: "Name",
		cellClassName: "name-cell",
		cell: (coin) => {
			const item = coin.item;
			return (
				<Link href={`/coins/${item.id}`} className="flex items-center gap-2">
					<Image src={item.large} alt={item.name} width={36} height={36} />
					<p>{item.name}</p>
				</Link>
			);
		},
	},
	{
		header: "24h Change",
		cellClassName: "price-change-cell",
		cell: (coin) => {
			const item = coin.item;
			const isTrendingUp = item.data.price_change_percentage_24h.usd > 0;
			return (
				<div
					className={cn(
						"flex items-center gap-1",
						isTrendingUp ? "text-green-500" : "text-red-500"
					)}
				>
					{isTrendingUp ? (
						<TrendingUp width={16} height={16} />
					) : (
						<TrendingDown width={16} height={16} />
					)}
					<p>{item.data.price_change_percentage_24h.usd.toFixed(2)}%</p>
				</div>
			);
		},
	},
	{
		header: "Price",
		cellClassName: "price-cell",
		cell: (coin) => formatCurrency(coin.item.data.price),
	},
];
const TrendingCoins = async () => {
	let trendingCoins;
	try {
		trendingCoins = await fetcher<{ coins: TrendingCoin[] }>(
			"/search/trending",
			undefined,
			300
		);
	} catch (error) {
		console.error("Failed to fetch trending coins:", error);
		return <TrendingCoinsFallback />;
	}
	return (
		<div id="trending-coins">
			<h4>Trending Coins</h4>

			<DataTable
				columns={columns}
				data={trendingCoins.coins.slice(0, 6) || []}
				rowKey={(coin) => coin.item.id}
				tableClassName="trending-coins-table"
				headerCellClassName="py-3!"
				bodyCellClassName="py-2!"
			/>
		</div>
	);
};

export default TrendingCoins;
