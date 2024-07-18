import React from "react";
import { sanitizeCollectionName } from "~/utils/TextUtils";
import collections from "~discord-data/Collections";
import CollectionBanner from "./_components/CollectionBanner";
import CollectionInfoContainer from "./_components/info/CollectionInfoContainer";
import { CollectionUtils } from "~/utils/CollectionUtils";
import CollectionInfoEntry from "./_components/info/CollectionInfoEntry";
import CollectionAvatarInfoEntry from "./_components/avatar-decorations/CollectionAvatarInfoEntry";
import CollectionAvatarsContainer from "./_components/avatar-decorations/CollectionAvatarsContainer";

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
			<CollectionInfoContainer collection={collection} />
			<CollectionAvatarsContainer avatarDecorations={CollectionUtils.getAvatarDecorations(collection)} />
		</div>
	);
}
