import React from "react";
import { sanitizeCollectionName } from "~/utils/TextUtils";
import collections from "~discord-data/Collections";

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

	return <div>{collection.name}</div>;
}
