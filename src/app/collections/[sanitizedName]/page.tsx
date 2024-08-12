import React from "react";
import { sanitizeCollectionName } from "~/utils/TextUtils";
import collections from "~discord-data/collections";
import CollectionBanner from "./_components/CollectionBanner";
import CollectionInfoContainer from "./_components/info/CollectionInfoContainer";
import { CollectionUtils } from "~/utils/CollectionUtils";
import CollectionAvatarsContainer from "./_components/avatar-decorations/CollectionAvatarsContainer";
import CollectionEffectContainer from "./_components/profile-effects/CollectionEffectContainer";

// Don't build the page for any non-existent collections
export const dynamicParams = false;

export async function generateStaticParams() {
	return Object.values(collections).map((collection) => ({ sanitizedName: sanitizeCollectionName(collection.name) }));
}

export default function Page({ params }: { params: { sanitizedName: string } }) {
	const collection = Object.values(collections).find((c) => sanitizeCollectionName(c.name) === params.sanitizedName);
	if (!collection) {
		return <div>Collection not found</div>;
	}

	return (
		<div className="flex min-h-screen flex-col items-center gap-y-5 py-5">
			<CollectionBanner collection={collection} />
			<CollectionInfoContainer collection={collection} />
			<CollectionAvatarsContainer avatarDecorations={CollectionUtils.getAvatarDecorations(collection)} />
			<CollectionEffectContainer profileEffects={CollectionUtils.getProfileEffects(collection)} />
		</div>
	);
}
