import Link from "next/link";
import { useMemo } from "react";
import { CollectionUtils } from "~/utils/CollectionUtils";
import collections from "~discord-data/collections";

export default function HomePage() {
	const allAvatarDecorationsCost = useMemo(() => CollectionUtils.getAllAvatarDecorationsCost(), []);
	const allProfileEffectsCost = useMemo(() => CollectionUtils.getAllProfileEffectsCost(), []);

	const getTotalCosts = () => {
		const totalOriginalPrice = allAvatarDecorationsCost.totalOriginalPrice + allProfileEffectsCost.totalOriginalPrice;
		const totalDiscountedPrice = allAvatarDecorationsCost.totalDiscountedPrice + allProfileEffectsCost.totalDiscountedPrice;
		return { totalOriginalPrice, totalDiscountedPrice };
	};

	return (
		<main className="flex min-h-screen w-full flex-col items-center">
			<div className="py-5">
				<h1 className="pb-2 text-center text-5xl font-bold uppercase">Discord Collectibles Archives</h1>
				<p className="mx-auto w-1/2 text-center text-2xl">
					A website meant to help archive the various collectibles offered by Discord such as shop items, quests rewards, event rewards
				</p>
			</div>
			<div className="pt-20">
				<h1 className="text-center text-2xl font-semibold">Current Archived Data</h1>
			</div>
			<div className="flex flex-col items-center justify-center py-2">
				<h1 className="text-center text-2xl">Collections</h1>
				<div className="max-w-lg p-4">
					<div className="overflow-hidden rounded-lg shadow-md">
						<table className="w-full">
							<thead className="text-sm uppercase text-gray-700">
								<tr className="bg-gray-50">
									<th className="px-2 py-2"></th>
									<th className="px-2 py-2"></th>
									<th className="px-2 py-2">Cost</th>
									<th className="px-2 py-2 pr-3">Cost (Nitro)</th>
								</tr>
							</thead>
							<tbody className="[&>tr>th]:uppercase">
								<tr className="border-b">
									<th className="max-w-48 px-4 py-2 font-medium">Collections</th>
									<td className="px-4 py-2 text-gray-700">{CollectionUtils.getNumberOfCollections()}</td>
									<td className="px-4 py-2">
										<span className="pl-3">${getTotalCosts().totalOriginalPrice.toFixed(2)}</span>
									</td>
									<td className="px-4 py-2">
										<span className="text-green-700 text-opacity-80">${getTotalCosts().totalDiscountedPrice.toFixed(2)}</span>
									</td>
								</tr>
								<tr className="border-b">
									<th className="max-w-48 px-4 py-2 font-medium">Recently Added Collection</th>
									<td className="px-4 py-2 text-gray-700" colSpan={3}>
										{CollectionUtils.getRecentlyAddedCollection()?.name}
									</td>
								</tr>
								<tr className="border-b">
									<th className="max-w-48 px-4 py-2 font-medium">Uncategorized Products</th>
									<td className="px-4 py-2 text-gray-700" colSpan={3}>
										{collections.uncategorized.products.length}
									</td>
								</tr>
								<tr className="border-b">
									<th className="max-w-48 px-4 py-2 font-medium">Avatar Decorations</th>
									<td className="px-4 py-2 text-gray-700">
										<div className="flex items-center space-x-1">
											<span className="">{CollectionUtils.getAllAvatarDecorations().length}</span>
										</div>
									</td>
									<td className="px-4 py-2">
										<span className="pl-3">${CollectionUtils.getAllAvatarDecorationsCost().totalOriginalPrice.toFixed(2)}</span>
									</td>
									<td className="px-4 py-2">
										<span className="text-green-700 text-opacity-80">
											${CollectionUtils.getAllAvatarDecorationsCost().totalDiscountedPrice.toFixed(2)}
										</span>
									</td>
								</tr>
								<tr className="border-b">
									<th className="max-w-10 px-4 py-2 font-medium"># of Profile Effects</th>
									<td className="px-4 py-2 text-gray-700">
										<div className="flex items-center space-x-1">
											<span className="">{CollectionUtils.getAllProfileEffects().length}</span>
										</div>
									</td>
									<td className="px-4 py-2">
										<span className="pl-3">${CollectionUtils.getAllProfileEffectsCost().totalOriginalPrice.toFixed(2)}</span>
									</td>
									<td className="px-4 py-2">
										<span className="text-green-700 text-opacity-80">
											${CollectionUtils.getAllProfileEffectsCost().totalDiscountedPrice.toFixed(2)}
										</span>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
				<div className="py-2">
					<Link key="collections" className="w-full rounded bg-gray-50 px-4 py-2 text-center text-xl hover:bg-gray-100" href="/collections/">
						<span className="hover:text-black-80 hover:drop-shadow-sm">{"View Collections ->"}</span>
					</Link>
				</div>
			</div>
		</main>
	);
}
