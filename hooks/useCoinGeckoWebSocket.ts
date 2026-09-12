// Important Note: This will only work with the paid Pro API reference to update data in real time on the coin ([id]) page.
// This project works with the demo API.
// import {
// 	ExtendedPriceData,
// 	OHLCData,
// 	Trade,
// 	UseCoinGeckoWebSocketProps,
// 	UseCoinGeckoWebSocketReturn,
// 	WebSocketMessage,
// } from "@/type";
// import { useEffect, useRef, useState } from "react";
// const WS_BASE = `${process.env.NEXT_PUBLIC_COINGECKO_WEBSOCKET_URL}?x_cg_pro_api_key=${process.env.NEXT_PUBLIC_COINGECKO_API_KEY}`;
// export const useCoinGeckoWebSocket = ({
// 	coinId,
// 	poolId,
// 	liveInterval,
// }: UseCoinGeckoWebSocketProps): UseCoinGeckoWebSocketReturn => {
// 	const wsRef = useRef<WebSocket | null>(null);
// 	const subscribed = useRef<Set<string>>(new Set());
// 	const [price, setPrice] = useState<ExtendedPriceData | null>(null);
// 	const [trades, setTrades] = useState<Trade[]>([]);
// 	const [ohlcv, setOhlcv] = useState<OHLCData | null>(null);
// 	const [isWsReady, setIsWsReady] = useState(false);
// 	useEffect(() => {
// 		const ws = new WebSocket(WS_BASE);
// 		wsRef.current = ws;
// 		const send = (payload: Record<string, unknown>) =>
// 			ws.send(JSON.stringify(payload));
// 		const handleMessage = (event: MessageEvent) => {
// 			const msg: WebSocketMessage = JSON.parse(event.data);
// 			if (msg.type === "ping") {
// 				send({ type: "pong" });
// 				return;
// 			}
// 			if (msg.type === "confirm_subscription") {
// 				const { chanel } = JSON.parse(msg?.identifier ?? "");
// 				subscribed.current.add(chanel);
// 			}
// 			if ((msg.c = "C1")) {
// 				setPrice({
// 					usd: msg.p ?? 0,
// 					coin: msg.i,
// 					price: msg.p,
// 					change24h: msg.pp,
// 					marketCap: msg.m,
// 					volume24h: msg.v,
// 					timestamp: msg.t,
// 				});
// 			}
// 			if ((msg.c = "G2")) {
// 				const newTrade: Trade = {
// 					price: msg.pu,
// 					value: msg.vo,
// 					timestamp: msg.t ?? 0,
// 					type: msg.ty,
// 					amount: msg.to,
// 				};
// 				setTrades((prev) => [newTrade, ...prev].slice(0, 7));
// 			}
// 			if (msg.ch === "G3") {
// 				const timestamp = msg.t ?? 0;
// 				const candle: OHLCData = [
// 					timestamp,
// 					Number(msg.o ?? 0),
// 					Number(msg.h ?? 0),
// 					Number(msg.l ?? 0),
// 					Number(msg.c ?? 0),
// 				];
// 				setOhlcv(candle);
// 			}
// 		};
// 		ws.onopen = () => setIsWsReady(true);
// 		ws.onmessage = handleMessage;
// 		ws.onclose = () => setIsWsReady(false);
// 		return () => ws.close();
// 	}, []);
// 	useEffect(() => {
// 		if (!isWsReady) return;
// 		const ws = wsRef.current;
// 		if (!ws) return;
// 		const send = (payload: Record<string, unknown>) =>
// 			ws.send(JSON.stringify(payload));
// 		const unSubscribeAll = () => {
// 			subscribed.current.forEach((chanel) => {
// 				send({
// 					command: "unsubscribe",
// 					identifier: JSON.stringify({ chanel }),
// 				});
// 			});
// 		};
// 		const subscribe = (chanel: string, data?: Record<string | unknown>) => {
// 			if (subscribed.current.has(chanel)) return;
// 			send({
// 				command: "subscribe",
// 				identifier: JSON.stringify({ chanel }),
// 			});
// 			if (data) {
// 				send({
// 					command: "message",
// 					identifier: JSON.stringify({ chanel }),
// 					data: JSON.stringify(data),
// 				});
// 			}
// 		};
// 		queueMicrotask(() => {
// 			setPrice(null);
// 			setTrades([]);
// 			setOhlcv(null);
// 			unSubscribeAll();
// 			subscribe("CGSimplePrice", { coin_id: [coinId], action: "set_tokens" });
// 		});
// 		const poolAddress = poolId.replace("_", ":");
// 		if (poolAddress) {
// 			subscribe("OnchainTrade", {
// 				"network_id:pool_address": [poolAddress],
// 				action: "set_pools",
// 			});
// 			subscribe("OnChainOHLCV", {
// 				"network_id:pool_address": [poolAddress],
// 				interval: liveInterval,
// 				action: "set_pools",
// 			});
// 		}
// 		return {
// 			price,
// 			trades,
// 			ohlcv,
// 			isConnected: isWsReady,
// 		};
// 	}, [coinId, poolId, isWsReady, liveInterval]);
// };
