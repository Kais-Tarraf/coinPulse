import { DataTableColumn, LiveDataProps, Trade } from "@/type";
import CandlestickChart from "./CandlestickChart";
import { Separator } from "./ui/separator";
import { fetcher } from "@/lib/coingecko.actions";
import { formatCurrency, timeAgo } from "@/lib/utils";
import DataTable from "./DataTable";

const LiveDataWrapper = async ({
	children,
	coinId,
	poolId,
	coin,
	network,
	pool,
	coinOHLCData,
}: LiveDataProps) => {
	let trades: Trade[] = [];
	console.log("Network: " + network, "| Pool Address: " + pool.address);
	const poolAddress = pool?.address;

	if (network && poolAddress) {
		try {
			const response = await fetcher<{ data: Trade[] }>(
				`/onchain/networks/${network}/pools/${poolAddress}/trades`
			);
			trades = response.data || [];
		} catch (error) {
			console.error("Failed to fetch trades:", error);
		}
	}
	const tradeColumns: DataTableColumn<any>[] = [
		{
			header: "Price",
			cellClassName: "price-cell",
			cell: (trade) => {
				const price = trade.attributes?.price_in_usd || trade.price;
				return price ? formatCurrency(parseFloat(price)) : "-";
			},
		},
		{
			header: "Amount",
			cellClassName: "amount-cell",
			cell: (trade) => {
				const amount = trade.attributes?.from_token_amount || trade.amount;
				return amount ? parseFloat(amount).toFixed(4) : "-";
			},
		},
		{
			header: "Value",
			cellClassName: "value-cell",
			cell: (trade) => {
				const value = trade.attributes?.volume_in_usd || trade.value;
				return value ? formatCurrency(parseFloat(value)) : "-";
			},
		},
		{
			header: "Buy/Sell",
			cellClassName: "type-cell",
			cell: (trade) => {
				const type = trade.attributes?.kind || trade.type;
				const isBuy = type === "buy" || type === "b";
				return (
					<span className={isBuy ? "text-green-500" : "text-red-500"}>
						{isBuy ? "Buy" : "Sell"}
					</span>
				);
			},
		},
		{
			header: "Time",
			cellClassName: "time-cell",
			cell: (trade) => {
				const time = trade.attributes?.block_timestamp || trade.timestamp;
				return time ? timeAgo(time) : "-";
			},
		},
	];
	return (
		<section id="live-data-wrapper">
			<p>Coin Header</p>
			<Separator className="divider" />
			<div className="trend">
				<CandlestickChart coinId={coinId} data={coinOHLCData}>
					<h4>Trend Overview</h4>
				</CandlestickChart>
			</div>
			<Separator className="divider" />
			{tradeColumns && (
				<div className="trades">
					<h4>Recent Trades</h4>
					<DataTable
						columns={tradeColumns}
						data={trades.slice(0, 10)}
						rowKey={(_, index) => index}
						tableClassName="trades-table"
					/>
				</div>
			)}
		</section>
	);
};

export default LiveDataWrapper;
