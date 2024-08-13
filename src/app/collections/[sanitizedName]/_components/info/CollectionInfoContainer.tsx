import React from "react";
import { type CollectiblesCategories } from "~types/CollectiblesCategories";
import CollectionInfoEntry from "./CollectionInfoEntry";
import { DiscordUtils } from "~/utils/DiscordUtils";
import { CollectionUtils } from "~/utils/CollectionUtils";

export default function CollectionInfoContainer(props: { collection: CollectiblesCategories }) {
	// Thank you Claude 3.5 for the styling
	const infoItems = [
		{ label: "Background Colors", colors: props.collection.styles.background_colors },
		{ label: "Button Colors", colors: props.collection.styles.button_colors },
		{ label: "Confetti Colors", colors: props.collection.styles.confetti_colors }
	];

	const hasAnyColors = infoItems.some((item) => item.colors.length > 0);

	const currencyFormatter = new Intl.NumberFormat("en-us", { style: "currency", currency: "USD" });
	const { totalOriginalCost, totalDiscountedCost } = props.collection.products.reduce(
		(acc, product) => {
			const originalPrice = CollectionUtils.getOriginalPrice(product);
			const discountedPrice = CollectionUtils.getNitroPrice(product);
			return { totalOriginalCost: acc.totalOriginalCost + originalPrice, totalDiscountedCost: acc.totalDiscountedCost + discountedPrice };
		},
		{ totalOriginalCost: 0, totalDiscountedCost: 0 }
	);
	const totalCostsString = `${currencyFormatter.format(totalOriginalCost)} (${currencyFormatter.format(totalDiscountedCost)} with Nitro)`;

	return (
		<div className="flex w-[1280px] max-w-[1280px] space-x-32 px-32 justify-center">
			<div className="flex w-[640px] flex-col justify-center gap-y-6 px-3">
				<CollectionInfoEntry name="Name" value={props.collection.name} />
				<CollectionInfoEntry name="Description" value={props.collection.summary} />
				<CollectionInfoEntry name="Added on" value={new Date(DiscordUtils.snowflakeToDate(props.collection.sku_id)).toLocaleString()} />
				<CollectionInfoEntry name="SKU ID" value={props.collection.sku_id} />
				<CollectionInfoEntry name="Total Products" value={props.collection.products.length} />
				<CollectionInfoEntry name="Total Cost (USD)" value={totalCostsString} />
			</div>
			{hasAnyColors && <div className="flex w-[640px] flex-col justify-center gap-y-6 px-3">
				{infoItems.map((item) => (
					<CollectionInfoEntry key={item.label} name={item.label} colors={item.colors} />
				))}
			</div>}
		</div>
	);
}
