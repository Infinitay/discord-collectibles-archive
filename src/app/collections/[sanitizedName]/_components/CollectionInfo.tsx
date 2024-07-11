import React from "react";
import { CollectiblesCategories } from "~/types/CollectiblesCategories";
import CollectionColors from "./CollectionColors";

const AdditionalInfoContainer = (props: { collection: CollectiblesCategories }) => {
	// Thank you Claude 3.5 for the styling
	const infoItems = [
		{ label: "Background Colors", colors: props.collection.styles.background_colors },
		{ label: "Button Colors", colors: props.collection.styles.button_colors },
		{ label: "Confetti Colors", colors: props.collection.styles.confetti_colors }
	];

	return (
		<div className="mt-5 w-full max-w-[1280px] px-4">
			<div className="mx-auto max-w-[800px]">
				{infoItems.map((item, index) => (
					<div key={index} className="mb-6 flex items-center">
						<div className="flex w-1/2 justify-end pr-4">
							<span className="font-bold">{item.label}</span>
						</div>
						<div className="flex w-1/2 pl-4">
							<CollectionColors colors={item.colors} />
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default AdditionalInfoContainer;
