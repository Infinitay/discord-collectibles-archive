import React from "react";
import { CollectiblesCategories } from "~/types/CollectiblesCategories";
import CollectionInfoEntry from "./CollectionInfoEntry";

export default function CollectionInfoContainer(props: { collection: CollectiblesCategories }) {
	// Thank you Claude 3.5 for the styling
	const infoItems = [
		{ label: "Background Colors", colors: props.collection.styles.background_colors },
		{ label: "Button Colors", colors: props.collection.styles.button_colors },
		{ label: "Confetti Colors", colors: props.collection.styles.confetti_colors }
	];

	return (
		<div className="mt-5 w-full max-w-[1280px] px-4">
			<div className="mx-auto max-w-[800px]">
				<CollectionInfoEntry name="Name" value={props.collection.name} />
				{infoItems.map((item) => (
					<CollectionInfoEntry key={item.label} name={item.label} colors={item.colors} />
				))}
			</div>
		</div>
	);
}
