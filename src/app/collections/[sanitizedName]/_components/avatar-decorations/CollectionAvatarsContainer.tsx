import { type Product } from "~/types/CollectiblesCategories";
import CollectionAvatarInfoEntry from "./CollectionAvatarInfoEntry";
import { CollectionUtils } from "~/utils/CollectionUtils";

export default function CollectionAvatarsContainer(props: { avatarDecorations: Product[] }) {
	const currencyFormatter = new Intl.NumberFormat("en-us", { style: "currency", currency: "USD" });

	return (
		<div className="flex w-[800px] max-w-[1280px] flex-col items-center gap-5">
			{props.avatarDecorations.map((ad) => (
				<div key={ad.sku_id} className="hover:shadow-2xl/50 flex w-full rounded-md bg-gray-50 shadow-md hover:bg-gray-100">
					<div className="max-h-[240px] min-h-[240px] min-w-[240px] max-w-[240px] rounded-l-md">
						<img src={CollectionUtils.getAvatarDecorationURL(ad, true)} alt={`${ad.name} Avatar Decoration`} width={240}></img>
					</div>
					<div className="ml-5 flex w-[320px] flex-grow flex-col items-start justify-center">
						<CollectionAvatarInfoEntry name="Name" value={ad.name}></CollectionAvatarInfoEntry>
						<CollectionAvatarInfoEntry name="Description" value={ad.summary}></CollectionAvatarInfoEntry>
						<CollectionAvatarInfoEntry name="SKU ID" value={ad.sku_id}></CollectionAvatarInfoEntry>
						<CollectionAvatarInfoEntry
							name="Price"
							value={currencyFormatter.format(CollectionUtils.getOriginalPrice(ad))}
						></CollectionAvatarInfoEntry>
					</div>
				</div>
			))}
		</div>
	);
}
