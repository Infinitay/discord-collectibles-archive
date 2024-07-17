import React from "react";
import { CollectiblesCategories, ItemTypes } from "~types/CollectiblesCategories";
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

	const avatarDecorationsLength = CollectionUtils.getAvatarDecorations(props.collection).length;
	const profileEffectsLength = CollectionUtils.getProfileEffects(props.collection).length;

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
		<div className="mt-5 flex w-full max-w-[1280px] px-4">
			<div className="my-auto w-[640px]">
				<CollectionInfoEntry name="Name" value={props.collection.name} />
				<CollectionInfoEntry name="Description" value={props.collection.summary} />
				<CollectionInfoEntry name="Added on" value={new Date(DiscordUtils.snowflakeToDate(props.collection.sku_id)).toLocaleString()} />
				<CollectionInfoEntry name="SKU ID" value={props.collection.sku_id} />
				<CollectionInfoEntry name="Total Products" value={props.collection.products.length} />
				<CollectionInfoEntry name="Total Cost (USD)" value={totalCostsString} />
				<CollectionInfoEntry name="Avatar Decorations" value={avatarDecorationsLength} />
				<CollectionInfoEntry name="Profile Effects" value={profileEffectsLength} />
			</div>
			<div className="my-auto w-[640px]">
				{infoItems.map((item) => (
					<CollectionInfoEntry key={item.label} name={item.label} colors={item.colors} />
				))}
			</div>
		</div>
	);
}
