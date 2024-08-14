import newRawCollectibles from "~discord-data/raw/collectibles-categories.json" assert { type: "json" };
import oldRawCollectibles from "~discord-data/raw/old-data/collectibles-categories-happyenderman-converted.json" assert { type: "json" };
import * as path from "node:path";
import * as fs from "node:fs";
import { type CollectiblesCategories } from "~/types/CollectiblesCategories";
import { strictDeepEqual } from "fast-equals";
import { DiscordUtils } from "~/utils/DiscordUtils";
import { sanitizeCollectionName, toSanitizedCamelCase } from "~/utils/TextUtils";

const DISCORD_DATA_PATH = "../";
const COLLECTIONS_DIRECTORY = path.join(DISCORD_DATA_PATH, "collections");
const UNCATEGORIZED_SKU_ID = "1217175518781243583";
// Optional, set path to either undefined or the path to the older raw collectibles data
const OLDER_RAW_COLLECTIBLES_PATH: string | undefined = path.join(DISCORD_DATA_PATH, "raw/old-data/collectibles-categories-20231101-converted.json");

// <sku_id, collection> Mappings
const previousCollections = new Map<string, CollectiblesCategories>();
const currentCollections = new Map<string, CollectiblesCategories>();

const modifiedCollections = new Set<string>();

// Initialize the collections directory if it doesn't exist
if (!fs.existsSync(COLLECTIONS_DIRECTORY)) {
	fs.mkdirSync(COLLECTIONS_DIRECTORY);
	console.log("Didn't find an existing collection. Using old raw data to generate collections");
	oldRawCollectibles.forEach((oldCollection) => {
		previousCollections.set(oldCollection.sku_id, oldCollection as CollectiblesCategories);
		currentCollections.set(oldCollection.sku_id, oldCollection as CollectiblesCategories);
		modifiedCollections.add(oldCollection.sku_id);
	});

	// Some unpublish dates may be missing so pull them from even older raw data
	if (!!OLDER_RAW_COLLECTIBLES_PATH && fs.existsSync(OLDER_RAW_COLLECTIBLES_PATH)) {
		const olderRawCollectibles: CollectiblesCategories[] = JSON.parse(fs.readFileSync(OLDER_RAW_COLLECTIBLES_PATH, "utf-8")) as CollectiblesCategories[];
		// Update any missing or outdated unpublished_at values
		olderRawCollectibles.forEach((olderCollection) => {
			if (previousCollections.has(olderCollection.sku_id)) {
				// Now update the unpublished_at value if it's missing or out of date
				const currentUnpublishedAt = new Date(previousCollections.get(olderCollection.sku_id)!.unpublished_at ?? 0);
				const olderUnpublishedAt = new Date(olderCollection.unpublished_at ?? 0);
				if (currentUnpublishedAt < olderUnpublishedAt) {
					console.log(
						`Updating unpublished_at for collection '${olderCollection.name}' from ${currentUnpublishedAt.toISOString()} to ${olderUnpublishedAt.toISOString()}`
					);
					previousCollections.get(olderCollection.sku_id)!.unpublished_at = olderCollection.unpublished_at;
				}
				previousCollections.set(olderCollection.sku_id, olderCollection);
				currentCollections.set(olderCollection.sku_id, olderCollection);
				modifiedCollections.add(olderCollection.sku_id);
			}
		});
	}
	console.log(`Found and generated ${previousCollections.size} collections from the old data`);
} else {
	console.log("Found an existing collection. Using the existing collections to update/add to the current collections");
	for (const fileName of fs.readdirSync(COLLECTIONS_DIRECTORY)) {
		if (fileName.endsWith(".json")) {
			const filePath = path.join(COLLECTIONS_DIRECTORY, fileName);
			const previousCollection: CollectiblesCategories = JSON.parse(fs.readFileSync(filePath, "utf-8")) as CollectiblesCategories;
			previousCollections.set(previousCollection.sku_id, previousCollection);
			currentCollections.set(previousCollection.sku_id, previousCollection);
		}
	}
	const previousCollectionNames = Array.from(previousCollections.values())
		.map((c) => `"${c.name}"`)
		.join(", ");
	console.log(`Found and loaded ${previousCollections.size} collections from the existing collections: [${previousCollectionNames}]`);
}

// Discord started to change collections entirely and shift the products into new collections
// Cache all the products from prior collections to check if they were moved to a new collection
const previousProductsMap = new Map<string, Set<string>>();
for (const collection of previousCollections.values()) {
	previousProductsMap.set(collection.sku_id, new Set(collection.products.map((p) => p.sku_id)));
}

/*
 * Do the update check in two parts
 * 1) Check to see if there are any uncategorized products that now have a category
 *  - Find any matching products that are both in a collection and the uncategorized collection
 *  - Removing the products from the uncategorized collection
 * 2) Check to see if the collection needs updating. Older collections shouldn't change after they get unpublished
 */

console.log(`Checking to see if any of the ${newRawCollectibles.length} new collections need to be updated or added`);
for (const collection of newRawCollectibles) {
	const previousCollection = previousCollections.get(collection.sku_id);
	if (previousCollection !== undefined) {
		// Collection already exists, so check to see if the current collection needs to be updated
		if (!strictDeepEqual(previousCollection, collection)) {
			// The collections aren't equal, so add the new collection instead
			// Because we can safely assume the new collection is the updated one due to having an already up-to-date previous collection
			console.log(`Found an existing collection '${collection.name}' that needed to be updated`);
			modifiedCollections.add(collection.sku_id);

			// Now lets get an idea of what was it that changed
			if (previousCollection.products.length !== collection.products.length) {
				console.log(
					`Product size changed from ${previousCollection.products.length} -> ${collection.products.length} within '${collection.name}' collection`
				);
			}

			const { products: _pcdx, ...pcdx } = previousCollection;
			const { products: _cdx, ...cdx } = collection;
			if (!strictDeepEqual(pcdx, cdx)) {
				console.log(`The properties changed between the previous and current '${collection.name}' collection`);
			}
		} else {
			console.log(`Found an existing collection '${collection.name}' that doesn't need to be updated`);
		}
	} else {
		// The collection doesn't exist so simply add it
		console.log(`Didn't find an existing collection '${collection.name}' so creating it`);
		modifiedCollections.add(collection.sku_id);

		// Because the collections is new, there is a chance that previously uncategorized products now have a category
		const uncategorizedCollection = previousCollections.get(UNCATEGORIZED_SKU_ID);
		if (uncategorizedCollection !== undefined) {
			// Check to see if any of the current product skus are found within uncategorized
			const uncategorizedProductSKUs = new Set<string>(uncategorizedCollection.products.map((product) => product.sku_id));
			const matchedProductSKUs = new Set<string>(collection.products.map((p) => p.sku_id).filter((sku) => uncategorizedProductSKUs.has(sku)));

			// Check to see if an uncategorized produce was placed into a new category
			if (matchedProductSKUs.size) {
				// Remove any products that now has a new category from uncategorized
				uncategorizedCollection.products = uncategorizedCollection.products.filter((ucp) => !matchedProductSKUs.has(ucp.sku_id));
				console.log(
					`Removed ${matchedProductSKUs.size} uncategorized products (${[...matchedProductSKUs].join(", ")}) because they now a category -> '${collection.name}' collection`
				);
				currentCollections.set(uncategorizedCollection.sku_id, uncategorizedCollection);
				modifiedCollections.add(uncategorizedCollection.sku_id);
			}
		}
	}
	currentCollections.set(collection.sku_id, collection as CollectiblesCategories);
}

// Discord started to change collections entirely and shift the products into new collections
// ~~So we need to check if any of the products from the previous collection are now in the new collection~~
// Lets check all the products from the previous collection to see if they were moved to a new collection
const linkedCollections = new Map<string, string>(); // <previousCollectionSKU, mostRecentCollectionSKU>
for (const collection of currentCollections.values()) {
	// There has to be a better way to do this such as using hashmaps but I'm too lazy to think of one and it's not like we're working with a large dataset... yet
	// Then again I'm already using hashmaps and sets so perhaps this is the best solution. To behonest, I haven't given it much thought
	const belongedToPreviousCollection: [string, Set<string>][] | undefined = [...previousProductsMap.entries()].filter(
		([previousCollectionSKU, previousProductSKUs]: [string, Set<string>]) => {
			const currentCollectionProductSKUs = collection.products.map((p) => p.sku_id);
			return (
				previousCollectionSKU !== collection.sku_id &&
				[...previousProductSKUs].every((prevProductSKU) => currentCollectionProductSKUs.includes(prevProductSKU))
			);
		}
	);

	if (belongedToPreviousCollection !== undefined && belongedToPreviousCollection.length > 0) {
		console.log(
			`The products from the collection '${collection.name}' were moved from the collection(s): [${belongedToPreviousCollection.map(([sku]) => `"${previousCollections.get(sku)!.name}"`).join(", ")}]`
		);
		belongedToPreviousCollection.forEach(([previousCollectionSKU]) => linkedCollections.set(previousCollectionSKU, collection.sku_id));
	}
}

// Add any missing collections because so far we only added new or existing collections
// Don't forget that we removed any dupe/updated previous collections to prevent allocating more memory to more dupe collectsions

const exportedCollections = Array.from(currentCollections.values())
	.filter((c) => modifiedCollections.has(c.sku_id))
	.sort(sortCollectionsByDate);

// Extract each collection from the raw data into it's own JSON file
for (const collection of exportedCollections) {
	const sanitizedCollectionName = sanitizeCollectionName(collection.name);
	const collectionPath = path.join(COLLECTIONS_DIRECTORY, `${sanitizedCollectionName}.json`);
	fs.writeFileSync(collectionPath, JSON.stringify(collection, null, "\t") + "\n", "utf-8");
	console.log(`Finished generating the '${collection.name}' collection ("${collectionPath}")`);
}

const collectionsIndexPath = path.join(COLLECTIONS_DIRECTORY, "index.ts");
const indexFileExists = fs.existsSync(collectionsIndexPath);
const linkedCollectionsPath = path.join(COLLECTIONS_DIRECTORY, "linked-collections.json");
const linkedCollectionsExists = fs.existsSync(path.join(COLLECTIONS_DIRECTORY, "linked-collections.json"));
const collectionsToIndex = Array.from(currentCollections.values()).sort(sortCollectionsByDate);
if (collectionsToIndex.length !== 0 && exportedCollections.length > 0) {
	// Before we generate the index file, generate the linked collection json file {[previousCollectionSKU: string]: mostRecentCollectionSKU: string}
	console.log(`${linkedCollectionsExists ? "Updating" : "Generating"} the linked collections file at "${linkedCollectionsPath}"`);
	const linkedCollectionsContent = JSON.stringify(Object.fromEntries(linkedCollections), null, "\t");
	fs.writeFileSync(linkedCollectionsPath, linkedCollectionsContent + "\n", "utf-8");

	const missingPrefix = indexFileExists ? "Updating the" : "Generating an";
	console.log(
		`${missingPrefix} index file with imports for the ${collectionsToIndex.length} collections` +
			` (${exportedCollections.length} new) at "${collectionsIndexPath}"`
	);

	const imports = collectionsToIndex
		.map(
			(c) => `import ${toSanitizedCamelCase(c.name)}Data from "~discord-data/collections/${sanitizeCollectionName(c.name)}.json" assert { type: "json" };`
		)
		.join("\n");

	const collectionIndexContent = `${imports}
import linkedCollectionsData from "~discord-data/collections/linked-collections.json" assert { type: "json" };
import { type CollectiblesCategories } from "~/types/CollectiblesCategories";

${collectionsToIndex.map((c) => `${toSanitizedCamelCase(c.name)}`).map((varName) => `const ${varName} = ${varName}Data as CollectiblesCategories;`).join("\n")}

export const collections = {
	${collectionsToIndex.map((c) => `${toSanitizedCamelCase(c.name)}`).join(",\n\t")}
};

export const linkedCollections = linkedCollectionsData as Record<string, string>;

const collectionExports = {
	collections,
	linkedCollections
};

export default collectionExports;
`;

	fs.writeFileSync(collectionsIndexPath, collectionIndexContent);
} else {
	console.log(`No collections to index or update, skipping the index file generation`);
}

function sortCollectionsByDate(a: CollectiblesCategories, b: CollectiblesCategories) {
	return DiscordUtils.snowflakeToDate(a.sku_id).getTime() - DiscordUtils.snowflakeToDate(b.sku_id).getTime();
}

// Convert the linked collections map to JSON of an array of objects {[previousCollectionSKU: string]: mostRecentCollectionSKU: string}
// function convertLinkedMapToJson(linkedMap: Map<string, string>): Record<string, string> {
// 	const json: Record<string, string> = {};
// 	return [...linkedMap.entries()].map(([previousCollectionSKU, mostRecentCollectionSKU]) => ({ previousCollectionSKU, mostRecentCollectionSKU }));
// }
