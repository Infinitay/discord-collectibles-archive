"use client";
import { Product } from "~/types/CollectiblesCategories";
import { CollectionUtils } from "~/utils/CollectionUtils";
import CollectionEffectInfoEntry from "./CollectionEffectInfoEntry";
import CollectionProfileEffect from "./CollectionProfileEffect";
import { useState } from "react";

export default function CollectionEffectContainer(props: { profileEffects: Product[] }) {
	// Use an object for the state so we can track the individual profile effects
	// Key: Profile Effect SKU ID, Value: boolean to force re-render
	const [rerenderEffects, setRerenderEffects] = useState<{ [key: string]: number }>({});
	const currencyFormatter = new Intl.NumberFormat("en-us", { style: "currency", currency: "USD" });

	// Because we're using an object and tracking individual profile effects, handle the mouse enter event
	const handleMouseEnter = (skuID: string) => {
		setRerenderEffects((prevRerenderState) => {
			return { ...prevRerenderState, [skuID]: Date.now() };
		});
	};

	return (
		<div className="flex w-[800px] max-w-[1280px] flex-col items-center gap-5">
			{props.profileEffects.map((pep) => (
				<div
					key={pep.sku_id}
					className="hover:shadow-2xl/50 flex w-full rounded-md bg-gray-50 shadow-md hover:bg-gray-100"
					onMouseEnter={() => handleMouseEnter(pep.sku_id)}
				>
					<div className="relative max-h-[880px] min-h-[880px] min-w-[440px] max-w-[440px] overflow-hidden rounded-l-md">
						<CollectionProfileEffect profileEffectProduct={pep} forceRender={rerenderEffects[pep.sku_id]} />
					</div>
					<div className="ml-5 flex w-[320px] flex-grow flex-col items-start justify-center">
						<CollectionEffectInfoEntry name="Name" value={pep.name}></CollectionEffectInfoEntry>
						<CollectionEffectInfoEntry name="Description" value={pep.summary}></CollectionEffectInfoEntry>
						<CollectionEffectInfoEntry
							name="Alt Description"
							value={CollectionUtils.getProfileEffect(pep)?.accessibilityLabel ?? ""}
						></CollectionEffectInfoEntry>
						<CollectionEffectInfoEntry name="SKU ID" value={pep.sku_id}></CollectionEffectInfoEntry>
						<CollectionEffectInfoEntry
							name="Price"
							value={currencyFormatter.format(CollectionUtils.getOriginalPrice(pep))}
						></CollectionEffectInfoEntry>
					</div>
				</div>
			))}
		</div>
	);
}
