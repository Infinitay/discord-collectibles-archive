import { CollectionUtils } from "~/utils/CollectionUtils";

export default function HomePage() {
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
			<div className="py-2">
				<h1 className="text-center text-2xl">Collections</h1>
				<div className="mx-auto max-w-xs p-4">
					<table className="min-w-full border">
						<tbody className="">
							<tr className="border-b">
								<th className="px-4 py-2 font-medium"># of Collections</th>
								<td className="px-4 py-2 text-gray-700">{CollectionUtils.getNumberOfCollections()}</td>
							</tr>
							<tr className="border-b">
								<th className="px-4 py-2 font-medium">Recently Added Collection</th>
								<td className="px-4 py-2 text-gray-700">{CollectionUtils.getRecentlyAddedCollection()?.name}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</main>
	);
}
