import Link from "next/link";
import { sanitizeCollectionName } from "~/utils/TextUtils";
import { collections } from "~discord-data/collections";

export default function Page() {
	return (
		<div className="flex min-h-screen flex-col items-center py-5">
			<h1 className="mb-5 text-center text-5xl font-bold uppercase">Collections</h1>
			<div className="collections-container flex w-full max-w-md flex-col items-center space-y-4 ">
				{Object.values(collections).map((collection) => (
					<Link
						key={collection.sku_id}
						className="w-full rounded bg-gray-50 py-2 text-center text-xl"
						href={`/collections/${sanitizeCollectionName(collection.name)}`}
					>
						{collection.name}
					</Link>
				))}
			</div>
		</div>
	);
}
