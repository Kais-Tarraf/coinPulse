"use server";

import { CoinGeckoErrorBody, PoolData, QueryParams, SearchCoin } from "@/type";
import qs from "query-string";

const BASE_URL = process.env.COINGECKO_BASE_URL;
const API_KEY = process.env.COINGECKO_API_KEY;
if (!BASE_URL) throw new Error("Could not get base url");
if (!API_KEY) throw new Error("Could not get api key");

export async function fetcher<T>(
	endPoint: string,
	params?: QueryParams,
	revalidate = 60
): Promise<T> {
	const url = qs.stringifyUrl(
		{
			url: `${BASE_URL}/${endPoint}`,
			query: params,
		},
		{ skipEmptyString: true, skipNull: true }
	);
	const response = await fetch(url, {
		headers: {
			"x-cg-demo-api-key": API_KEY, //x-cg-demo-api-key
			"Content-Type": "application/json",
		} as Record<string, string>,
		next: { revalidate },
	});
	if (!response.ok) {
		const errorBody: CoinGeckoErrorBody = await response
			.json()
			.catch(() => ({}));
		throw new Error(
			`API Error: ${response.status}: ${errorBody.error || response.statusText}`
		);
	}
	return response.json();
}
export async function getPools(
	id: string,
	network?: string | null,
	contractAddress?: string | null
): Promise<PoolData> {
	const fallback: PoolData = {
		id: "",
		address: "",
		name: "",
		network: "",
	};

	try {
		let response;
		if (network && contractAddress) {
			response = await fetcher<{ data: any[] }>(
				`/onchain/networks/${network}/tokens/${contractAddress}/pools`
			);
		} else {
			response = await fetcher<{ data: any[] }>("/onchain/search/pools", {
				query: id,
			});
		}

		const rawPool = response?.data?.[0];
		if (!rawPool) return fallback;

		const extractedNetwork =
			rawPool.relationships?.network?.data?.id ||
			rawPool.id?.split("_")[0] ||
			network ||
			"";

		return {
			id: rawPool.id || fallback.id,
			address:
				rawPool.attributes?.address || rawPool.address || fallback.address,
			name: rawPool.attributes?.name || rawPool.name || fallback.name,
			network: extractedNetwork,
		};
	} catch {
		return fallback;
	}
}

export async function SearchCoins(query: string): Promise<SearchCoin[]> {
	if (!query) return [];
	const searchRes = await fetch(
		`${BASE_URL}/search?query=${encodeURIComponent(query)}`,
		{
			next: { revalidate: 60 },
		}
	);
	if (!searchRes.ok) throw new Error("Failed to search");
	const searchData = await searchRes.json();
	const coinsIds = searchData.coins.slice(0, 10).map((coin: any) => coin.id);
	if (!coinsIds.length) return [];
	const marketRes = await fetch(
		`${BASE_URL}/coins/markets?vs_currency=usd&id=${coinsIds.join(
			","
		)}&price_change_percentage=24`,
		{ next: { revalidate: 60 } }
	);
	if (!marketRes.ok) throw new Error("Failed to fetch coin markets");
	const marketsData = await marketRes.json();
	return marketsData.map((coin: any) => ({
		id: coin.id,
		name: coin.name,
		symbol: coin.symbol,
		thumb: coin.image,
		data: {
			price_change_percentage_24h: coin.price_change_percentage_24h ?? 0,
		},
	}));
}
