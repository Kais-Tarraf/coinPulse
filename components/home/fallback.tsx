import DataTable from "@/components/DataTable";
import { DataTableColumn } from "@/type";

export const CoinOverviewFallback = () => {
	return (
		<div id="coin-overview-fallback" className="skeleton-container">
			<div className="p-4 md:p-6">
				<div className="header">
					<div className="header-image skeleton" />
					<div className="info">
						<div className="header-line-sm skeleton" />
						<div className="header-line-lg skeleton" />
					</div>
				</div>
				<div className="flex gap-2 mb-4">
					{[1, 2, 3, 4, 5, 6].map((i) => (
						<div key={i} className="period-button-skeleton skeleton" />
					))}
				</div>
				<div className="chart">
					<div className="chart-skeleton skeleton" />
				</div>
			</div>
		</div>
	);
};

export const TrendingCoinsFallback = () => {
	const columns: DataTableColumn<any>[] = [
		{
			header: "Name",
			cell: () => (
				<div className="name-link">
					<div className="name-image skeleton" />
					<div className="name-line skeleton" />
				</div>
			),
		},
		{
			header: "Price",
			cell: () => <div className="price-line skeleton" />,
		},
		{
			header: "24h %",
			cell: () => (
				<div className="price-change">
					<div className="change-icon skeleton" />
					<div className="change-line skeleton" />
				</div>
			),
		},
	];

	const data = Array(5).fill({});

	return (
		<div id="trending-coins-fallback">
			<h4>Trending Coins</h4>
			<DataTable
				columns={columns}
				data={data}
				rowKey={(_, index) => index}
				tableClassName="trending-coins-table"
				bodyCellClassName="change-cell"
			/>
		</div>
	);
};
