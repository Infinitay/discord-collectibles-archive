import React from "react";
import { sanitizeCollectionName } from "~/utils/TextUtils";
import collections from "~discord-data/Collections";
import CollectionBanner from "./_components/CollectionBanner";
import CollectionColors from "./_components/CollectionColors";

// Don't build the page for any non-existent collections
export const dynamicParams = false;

export async function generateStaticParams() {
	return Object.values(collections).map((collection) => ({ sanitizedName: sanitizeCollectionName(collection.name) }));
}

export default function Page({ params }: { params: { sanitizedName: string } }) {
	const collection = Object.values(collections).find((collection) => sanitizeCollectionName(collection.name) === params.sanitizedName);
	if (!collection) {
		return <div>Collection not found</div>;
	}

	return (
		<div className="flex min-h-screen flex-col items-center py-5">
			<CollectionBanner collection={collection} />
		</div>
	);
}
