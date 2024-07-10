import { CollectiblesCategories } from "~/types/CollectiblesCategories";

function generateBannerURL(collection: CollectiblesCategories, png = true) {
	const quality = png ? "png" : "jpg";
	return `https://cdn.discordapp.com/app-assets/1096190356233670716/${collection.banner}.${quality}?size=1280`;
}

function generateLogoURL(collection: CollectiblesCategories, png = true) {
	const quality = png ? "png" : "jpg";
	return `https://cdn.discordapp.com/app-assets/1096190356233670716/${collection.logo}.${quality}?size=480`;
}

export default function CollectionBanner(props: { collection: CollectiblesCategories }) {
	return (
		<div
			className="flex h-[240px] w-full max-w-[1280px] flex-col items-center justify-center rounded-xl bg-cover bg-center"
			style={{ backgroundImage: `url("${generateBannerURL(props.collection)}")` }}
		>
			<img src={generateLogoURL(props.collection)} alt={`${props.collection.name} logo`} width={480}></img>
		</div>
	);
}
