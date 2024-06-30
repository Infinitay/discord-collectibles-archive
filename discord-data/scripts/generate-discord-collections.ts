import newRawCollectibles from "~discord-data/raw/collectibles-categories.json" assert { type: "json" };
import oldRawCollectibles from "~discord-data/raw/old-data/collectibles-categories-happyenderman-converted.json" assert { type: "json" };
import * as path from "node:path";
import * as fs from "node:fs";
import { CollectiblesCategories, Product } from "~/types/CollectiblesCategories";
import { strictDeepEqual } from "fast-equals";
import { DiscordUtils } from "~/utils/DiscordUtils";

// Regex to remove special characters (not including spaces) from the collection name
const SANITIZE_COLLECTION_NAME_REGEX = /[^a-z0-9\s]/gi;

const DISCORD_DATA_PATH = "../";
const COLLECTIONS_DIRECTORY = path.join(DISCORD_DATA_PATH, "collections");
const UNCATEGORIZED_SKU_ID = "1217175518781243583";
// Optional, set path to either undefined or the path to the older raw collectibles data
const OLDER_RAW_COLLEECTIBLES_PATH: string | undefined = path.join(DISCORD_DATA_PATH, "raw/old-data/collectibles-categories-20231101-converted.json");

// <sku_id, collection> Mappings
const previousCollections = new Map<string, CollectiblesCategories>();
const currentCollections = new Map<string, CollectiblesCategories>();

const modifiedCollections = new Set<string>();

// Initialize the collections directory if it doesn't exist
if (!fs.existsSync(COLLECTIONS_DIRECTORY)) {
	fs.mkdirSync(COLLECTIONS_DIRECTORY);
	console.log("Didn't find an existing collection. Using old raw data to generate collections");
	oldRawCollectibles.forEach((oldCollection) => {
		previousCollections.set(oldCollection.sku_id, oldCollection);
		currentCollections.set(oldCollection.sku_id, oldCollection);
		modifiedCollections.add(oldCollection.sku_id);
	});

	// Some unpublish dates may be missing so pull them from even older raw data
	if (!!OLDER_RAW_COLLEECTIBLES_PATH && fs.existsSync(OLDER_RAW_COLLEECTIBLES_PATH)) {
		const olderRawCollectibles: CollectiblesCategories[] = JSON.parse(fs.readFileSync(OLDER_RAW_COLLEECTIBLES_PATH, "utf-8"));
		// Update any missing or outdated unpublished_at values
		olderRawCollectibles.forEach((olderCollection) => {
			if (previousCollections.has(olderCollection.sku_id)) {
				// Now update the unpublished_at value if it's missing or out of date
				const currentUnpublishedAt = new Date(previousCollections.get(olderCollection.sku_id)!.unpublished_at ?? 0);
				const olderUnpublishedAt = new Date(olderCollection.unpublished_at ?? 0);
				if (currentUnpublishedAt < olderUnpublishedAt) {
					console.log(`Updating unpublished_at for collection '${olderCollection.name}' from ${currentUnpublishedAt} to ${olderUnpublishedAt}`);
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
			const previousCollection: CollectiblesCategories = JSON.parse(fs.readFileSync(filePath, "utf-8"));
			previousCollections.set(previousCollection.sku_id, previousCollection);
			currentCollections.set(previousCollection.sku_id, previousCollection);
		}
	}
	const previousCollectionNames = Array.from(previousCollections.values())
		.map((c) => `"${c.name}"`)
		.join(", ");
	console.log(`Found and loaded ${previousCollections.size} collections from the existing collections: [${previousCollectionNames}]`);
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
			const uncategorizedProductSKUs: Set<string> = new Set(uncategorizedCollection.products.map((product) => product.sku_id));
			const matchedProductSKUs = new Set(collection.products.map((p) => p.sku_id).filter((sku) => uncategorizedProductSKUs.has(sku)));

			// Check to see if an uncategorized produce was placed into a new category
			if (matchedProductSKUs.size) {
				// Remove any products that now has a new category from uncategorized
				uncategorizedCollection.products = uncategorizedCollection.products.filter((ucp) => !matchedProductSKUs.has(ucp.sku_id));
				console.log(
					`Removed ${matchedProductSKUs.size} uncategorized products because they now a category ${matchedProductSKUs} -> '${collection.name}' collection`
				);
			}
			currentCollections.set(uncategorizedCollection.sku_id, uncategorizedCollection);
			modifiedCollections.add(uncategorizedCollection.sku_id);
		}
	}
	currentCollections.set(collection.sku_id, collection);
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
const collectionsToIndex = indexFileExists ? exportedCollections : Array.from(currentCollections.values()).sort(sortCollectionsByDate);
if (collectionsToIndex.length !== 0) {
	const missingPrefix = indexFileExists ? "Updating the" : "Generating an";
	console.log(`${missingPrefix} index file with imports for the ${collectionsToIndex.length} collections at "${collectionsIndexPath}"`);

	const imports = collectionsToIndex
		.map((c) => `import ${toSanitizedCamelCase(c.name)} from "~discord-data/collections/${sanitizeCollectionName(c.name)}.json" assert { type: "json" };`)
		.join("\n");

	const collectionIndexContent = `${imports}

export default {
	${collectionsToIndex.map((c) => `${toSanitizedCamelCase(c.name)}`).join(",\n\t")}
};
`;

	fs.writeFileSync(collectionsIndexPath, collectionIndexContent);
} else {
	console.log(`No collections to index, skipping the index file generation`);
}

/**
 * Sanitize the collection name by converting to lowercase removing special characters, and replacing spaces with '-'
 *
 * Examples:
 * - "Arcade" -> "arcade"
 * - "Lofi Vibes" -> "lofi-vibes"
 * - "Feelin' Retro" -> "feelin-retro"
 * @param collectionName unsanitized collection name
 * @returns sanitized lowercase collection name without special characters
 */
function sanitizeCollectionName(collectionName: string) {
	return collectionName.toLowerCase().replaceAll(SANITIZE_COLLECTION_NAME_REGEX, "").replaceAll(" ", "-");
}

/**
 * Sanitizes the string and converts it to camelCase
 *
 * @param string
 * @returns sanitized and camelCase without special characters
 */
function toSanitizedCamelCase(string: string) {
	string = string.toLowerCase();
	const strings = string.split(/\s/gi);
	let camelCase = strings.shift() ?? "";
	if (strings.length > 0) {
		camelCase += strings.map((s) => `${s.charAt(0).toUpperCase()}${s.substring(1)}`).join("");
	}
	return camelCase.replaceAll(SANITIZE_COLLECTION_NAME_REGEX, "");
}

function sortCollectionsByDate(a: CollectiblesCategories, b: CollectiblesCategories) {
	return DiscordUtils.snowflakeToDate(a.sku_id).getTime() - DiscordUtils.snowflakeToDate(b.sku_id).getTime();
}
