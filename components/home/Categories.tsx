import { fetcher } from "@/lib/coingecko.actions";
import { Category, DataTableColumn, TrendingCoin } from "@/type";
import DataTable from "../DataTable";
import { cn, formatCurrency, formatPercentage } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";
import Image from "next/image";

const Categories = async () => {
	const categories = await fetcher<Category[]>("/coins/categories");
	const columns: DataTableColumn<Category>[] = [
		{
			header: "Category",
			cellClassName: "category-cell",
			cell: (category) => category.name,
		},
		{
			header: "Top Gainers",
			cellClassName: "top-gainers-cell",
			cell: (category) =>
				category.top_3_coins.map((coin) => (
					<Image key={coin} src={coin} alt={coin} width={28} height={28} />
				)),
		},
		{
			header: "24h Change",
			cellClassName: "price-change-cell",
			cell: (coin: Category) => {
				console.log(coin);
				const item = coin.market_cap_change_24h;
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
						<p>{formatPercentage(coin.market_cap_change_24h)}</p>
					</div>
				);
			},
		},
		{
			header: "Market Cap",
			cellClassName: "market-cap-cell",
			cell: (category) => formatCurrency(category.market_cap),
		},
		{
			header: "24 Volume",
			cellClassName: "volume-cell",
			cell: (category) => formatCurrency(category.volume_24h),
		},
	];
	return (
		<div id="categories" className="custom-scrollbar">
			<h4>Top Categories</h4>
			<DataTable
				columns={columns}
				data={categories?.slice(0, 10)}
				rowKey={(_, index) => index}
				tableClassName="mt-3"
			/>
		</div>
	);
};

export default Categories;
