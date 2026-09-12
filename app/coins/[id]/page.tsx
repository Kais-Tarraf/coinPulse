import LiveDataWrapper from "@/components/LiveDataWrapper";
import { fetcher, getPools } from "@/lib/coingecko.actions";
import { formatCurrency } from "@/lib/utils";
import { CoinDetailsData, NextPageProps, OHLCData, Trade } from "@/type";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const page = async ({ params }: NextPageProps) => {
	const { id } = await params;
	const [coinData, coinOHLCData] = await Promise.all([
		fetcher<CoinDetailsData>(`coins/${id}`, {
			dex_pair_format: "contract_address",
		}),
		await fetcher<OHLCData[]>(`/coins/${id}/ohlc`, {
			vs_currency: "usd",
			days: 1,
			// interval: "hourly",
			precision: "full",
		}),
	]);
	const platform = coinData.asset_platform_id
		? coinData.detail_platforms?.[coinData.asset_platform_id]
		: null;

	const extractedNetwork = platform?.geckoterminal_url
		? platform.geckoterminal_url.split("/")[3]
		: null;

	const contractAddress = platform?.contract_address || null;

	const pool = await getPools(id, extractedNetwork, contractAddress);

	const network = extractedNetwork || pool.network || null;
	const coinDetails = [
		{
			label: "Market Cap",
			value: formatCurrency(coinData.market_data.market_cap.usd),
		},
		{
			label: "Market Cap Rank",
			value: `# ${coinData.market_cap_rank}`,
		},
		{
			label: "Total Volume",
			value: formatCurrency(coinData.market_data.total_volume.usd),
		},
		{
			label: "Website",
			value: "-",
			link: coinData.links.homepage[0],
			linkText: "Homepage",
		},
		{
			label: "Explore",
			value: "-",
			link: coinData.links.blockchain_site[0],
			linkText: "Explore",
		},
		{
			label: "Community",
			value: "-",
			link: coinData.links.subreddit_url,
			linkText: "Community",
		},
	];
	console.log("Network: " + network, "| Pool Address: " + pool.address);

	return (
		<main id="coin-details-page">
			<section className="primary">
				<LiveDataWrapper
					coinId={id}
					poolId={pool.id}
					coin={coinData}
					coinOHLCData={coinOHLCData}
					network={network}
					pool={pool}
				>
					<h4>Exchange Listings</h4>
				</LiveDataWrapper>
				{/* <h1 className="text-3xl font-bold">
					Coin <strong>{id}</strong>
				</h1>
				<p>Trend Overview</p>
				<p>Recent Trades</p>
				<p>Exchange Listing</p> */}
			</section>
			<section className="secondary">
				<p>Currency Convertor</p>
				<div className="details">
					<h4>Coin Details</h4>

					<ul className="details-grid">
						{coinDetails.map(({ label, value, link, linkText }, index) => (
							<li key={index}>
								<p className="label">{label}</p>
								{link ? (
									<div className="link">
										<Link href={link} target="_blank">
											{linkText || label}
										</Link>
										<ArrowUpRight size={16} />
									</div>
								) : (
									<p className="text-base font-medium">{value}</p>
								)}
							</li>
						))}
					</ul>
				</div>
				<p>Top Gainers and Losers</p>
			</section>
		</main>
	);
};

export default page;
