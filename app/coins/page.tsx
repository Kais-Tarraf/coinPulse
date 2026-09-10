import CoinsPagination from "@/components/CoinsPagination";
import DataTable from "@/components/DataTable";
import { fetcher } from "@/lib/coingecko.actions";
import { cn, formatCurrency, formatPercentage } from "@/lib/utils";
import { CoinMarketData, DataTableColumn, NextPageProps } from "@/type";
import { TrendingDown, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const page = async ({ searchParams }: NextPageProps) => {
	const { page } = await searchParams;
	const currentPage = Number(page) || 1;
	const perPage = 10;
	const coinsData = await fetcher<CoinMarketData[]>("/coins/markets", {
		vs_currency: "usd",
		order: "market_cap_desc",
		per_page: perPage,
		page: currentPage,
		sparkline: "false",
		price_change_percentage: "24h",
	});
	const columns: DataTableColumn<CoinMarketData>[] = [
		{
			header: "Rank",
			cellClassName: "rank-cell",
			cell: (coin) => (
				<>
					#{coin.market_cap_rank}
					<Link href={`/coins/${coin.id}`} aria-label="View Coin" />
				</>
			),
		},
		{
			header: "Token",
			cellClassName: "token-cell",
			cell: (coin) => (
				<div className="token-info">
					<Image src={coin.image} alt={coin.name} width={36} height={36} />
					<p>
						{coin.name} ({coin.symbol.toUpperCase()})
					</p>
				</div>
			),
		},
		{
			header: "Price",
			cellClassName: "price-cell",
			cell: (coin) => formatCurrency(coin.current_price),
		},
		{
			header: "24h Change",
			cellClassName: "price-change-cell",
			cell: (coin) => {
				const item = coin.price_change_percentage_24h;
				const isTrendingUp = item > 0;
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
						<p>{formatPercentage(coin.market_cap_change_percentage_24h)}</p>
					</div>
				);
			},
		},
		{
			header: "Market Cap",
			cellClassName: "market-cap-cell",
			cell: (coin) => formatCurrency(coin.market_cap),
		},
	];
	const hasMorePage = coinsData.length === perPage;
	const estimatedTotalPages =
		currentPage >= 100 ? Math.ceil(currentPage / 100) * 100 + 100 : 100;
	// console.log(coinsData);
	return (
		<main id="coins-page">
			<div className="content">
				<h4>All Coins</h4>
				<DataTable
					columns={columns}
					data={coinsData}
					rowKey={(coin) => coin.id}
					tableClassName="coins-table"
				/>
				<CoinsPagination
					currentPage={currentPage}
					totalPages={estimatedTotalPages}
					hasMorePages={hasMorePage}
				/>
			</div>
		</main>
	);
};

export default page;
