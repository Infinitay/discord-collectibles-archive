// Before running this script, make sure your collections are up to date
import collections from "~discord-data/collections";
// Make sure you download and save the response from https://discord.com/api/v9/user-profile-effects to the following file:
// import userProfileEffects from "~discord-data/raw/user-profile-effects.json" assert { type: "json" };
// import userProfileEffects from "~discord-data/raw/user-profile-effects-add.json" assert { type: "json" };
import userProfileEffects from "~discord-data/raw/user-profile-effects-add-uncat.json" assert { type: "json" };
import * as path from "node:path";
import * as fs from "node:fs";
import { ProfileEffect } from "~/types/ProfileEffects";
import { strictDeepEqual } from "fast-equals";

enum ItemTypes {
	AvatarDecoration = 0,
	ProfileEffect = 1
}

const SANITIZE_COLLECTION_NAME_REGEX = /[^a-z0-9\s]/gi;

const DISCORD_DATA_PATH = "../";
const EFFECTS_DIRECTORY = path.join(DISCORD_DATA_PATH, "profile-effects");
const UNCATEGORIZED_SKU_ID = "1217175518781243583";

// Collection data used to reference effects to their respective collections
const collectionValues = Object.values(collections); // All collections
const collectionNameMap = new Map<string, string>(); // [Collection sku_id] -> Collection name

const effectsFromCollectionsMap = new Map<string, string>(); // [Effect sku_id] -> Collection sku_id
const collectionSanitizedNameMap = new Map<string, string>(); // Collection sanitized name -> Collection sku_id

const previousProfileEffectToCollectionMap = new Map<string, string>(); // [Profile effect sku_id] -> Collection sku_id
const currentProfileEffectToCollectionMap = new Map<string, string>(); // [Profile effect sku_id] -> Collection sku_id
const effectsMap = new Map<string, ProfileEffect>(); // [Profile effect sku_id] -> ProfileEffect

// Create a map for effects found within collections to their respective categories
// Make sure to initialize the Collection maps first because we need it for loading the existing effects
for (const collection of collectionValues) {
	collectionNameMap.set(collection.sku_id, collection.name);
	collectionSanitizedNameMap.set(sanitizeCollectionName(collection.name), collection.sku_id);
	// Map all profile effects within collections to their respective skus
	const profileEffectSKUs = collection.products.filter((product) => product.type === ItemTypes.ProfileEffect).map((product) => product.sku_id);

	for (const sku of profileEffectSKUs) {
		effectsFromCollectionsMap.set(sku, collection.sku_id);
	}
}

// Just in case check to see if Uncategorized exists, and if not add it to the collection map
if (collectionNameMap.get(UNCATEGORIZED_SKU_ID) === undefined) {
	collectionNameMap.set(UNCATEGORIZED_SKU_ID, "Uncategorized");
	collectionSanitizedNameMap.set(sanitizeCollectionName("Uncategorized"), UNCATEGORIZED_SKU_ID);
}

// Initialize the profile-effects folder if it doesn't exist
if (!fs.existsSync(EFFECTS_DIRECTORY)) {
	console.log("Didn't find an existing effects folder, so we're creating one now");
	fs.mkdirSync(EFFECTS_DIRECTORY);
} else {
	for (const fileName of fs.readdirSync(EFFECTS_DIRECTORY)) {
		if (fileName.endsWith(".json")) {
			const filePath = path.join(EFFECTS_DIRECTORY, fileName);
			const previousEffects: ProfileEffect[] = JSON.parse(fs.readFileSync(filePath, "utf-8")) || [];
			const previousCategory = collectionSanitizedNameMap.get(fileName.substring(0, fileName.length - 5))!;
			for (const effect of previousEffects) {
				previousProfileEffectToCollectionMap.set(effect.sku_id, previousCategory);
				effectsMap.set(effect.sku_id, effect);
			}
		}
	}
}

const changedCollections = new Set<string>();
const previouslyUncategorizedEffects = new Set<string>();

for (const currentEffect of userProfileEffects["profile_effect_configs"]) {
	const currentEffectName = currentEffect.title;
	const currentEffectSKU = currentEffect.sku_id;
	const currentEffectCollectionSKU = effectsFromCollectionsMap.get(currentEffectSKU) ?? UNCATEGORIZED_SKU_ID;
	const currentCollectionName = collectionNameMap.get(currentEffectCollectionSKU) ?? "Uncategorized";
	console.log(`Processing effect "${currentEffectName}" from the "${currentCollectionName}" collection`);

	// First check to see if the effect already exists
	const previousEffectCollectionSKU = previousProfileEffectToCollectionMap.get(currentEffectSKU);
	if (previousEffectCollectionSKU !== undefined) {
		// First lets check to see if the collection has changed
		if (previousEffectCollectionSKU !== currentEffectCollectionSKU) {
			console.log(`Collection changed from "${collectionNameMap.get(previousEffectCollectionSKU)!}" to "${currentCollectionName}"`);
			changedCollections.add(currentEffectCollectionSKU);
			// We don't have to remove the effect from the previous collection because we will handle it by:
			// First, add the previous collection sku to the changed collections set
			changedCollections.add(previousEffectCollectionSKU);
			// Secondly, update the effect to the new collection
			previousProfileEffectToCollectionMap.set(currentEffectSKU, currentEffectCollectionSKU);
			if (previousEffectCollectionSKU === UNCATEGORIZED_SKU_ID) {
				previouslyUncategorizedEffects.add(currentEffectSKU);
			}
		} else {
			// We can use else here because if the collection changed it still gets updated. This is to handle if the collection wasn't updated
			// First, check to see if the effect has changed at all
			const previousEffect = effectsMap.get(currentEffectSKU)!;
			if (!strictDeepEqual(previousEffect, currentEffect)) {
				console.log(`The "${currentEffectName}" effect has been modified in some way`);
				effectsMap.set(currentEffectSKU, currentEffect);
				changedCollections.add(currentEffectCollectionSKU);
			} else {
				console.log(`The "${currentEffectName}" effect has not been modified`);
			}
		}
	} else {
		console.log(`The "${currentEffectName}" effect is new`);
		// Because it's a new effect we need to add the effect to the effects map and the effect->collection map
		effectsMap.set(currentEffectSKU, currentEffect);
		previousProfileEffectToCollectionMap.set(currentEffectSKU, currentEffectCollectionSKU);
		changedCollections.add(currentEffectCollectionSKU);
	}
}

const groupedEffectsByCollection = new Map<string, ProfileEffect[]>(); // [Collection sku_id] -> ProfileEffect[]

for (const [effectSKU, categorySKU] of previousProfileEffectToCollectionMap) {
	// If the collection hasn't changed, then don't bother updating it
	if (!changedCollections.has(categorySKU)) {
		continue;
	}
	const effect = effectsMap.get(effectSKU)!;
	const collectionEffects = groupedEffectsByCollection.get(categorySKU) ?? [];
	collectionEffects.push(effect);
	groupedEffectsByCollection.set(categorySKU, collectionEffects);
}

if (groupedEffectsByCollection.size > 0) {
	const collectionNamesString = [...groupedEffectsByCollection.keys()].map((sku) => `"${collectionNameMap.get(sku)!}"`).join(", ");
	console.log(`Updating the effects found within ${groupedEffectsByCollection.size} collections: ${collectionNamesString}`);

	for (const [collectionSKU, effects] of groupedEffectsByCollection) {
		const collectionName = collectionNameMap.get(collectionSKU)!; // Should always exist if collections is up to date
		const sanitizedCollectionName = sanitizeCollectionName(collectionName);
		const filePath = path.join(EFFECTS_DIRECTORY, `${sanitizedCollectionName}.json`);
		console.log(`Writing ${effects.length} effects to the "${collectionName}" collection at "${filePath}"`);
		fs.writeFileSync(filePath, JSON.stringify(effects, null, "\t") + "\n", "utf-8");
	}

	// Additional cleanup for previously uncategorized effects
	if (!groupedEffectsByCollection.has(UNCATEGORIZED_SKU_ID) && previouslyUncategorizedEffects.size > 0) {
		console.log(`Removing the Uncategorized effects because there are no longer any profile effects found in that collection`);
		const filePath = path.join(EFFECTS_DIRECTORY, "uncategorized.json");
		fs.unlinkSync(filePath);
	}
} else {
	console.log("No changes were made to any collections, so no updates are needed");
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
