import rawCollectibles from "~discord-data/raw/collectibles-categories.json" assert { type: "json" };
import * as path from "node:path";
import * as fs from "node:fs";

// Regex to remove special characters (not including spaces) from the collection name
const SANITIZE_COLLECTION_NAME_REGEX = /[^a-z0-9\s]/gi;

const DISCORD_DATA_PATH = "../";
const COLLECTIONS_DIRECTORY = path.join(DISCORD_DATA_PATH, "collections");

// Initialize the collections directory if it doesn't exist
if (!fs.existsSync(COLLECTIONS_DIRECTORY)) {
	fs.mkdirSync(COLLECTIONS_DIRECTORY);
}

// Extract each collection from the raw data into it's own JSON file
for (const collection of rawCollectibles) {
	console.log(`Generating '${collection.name}' collection`);
	const sanitizedCollectionName = sanitizeCollectionName(collection.name);
	const collectionPath = path.join(COLLECTIONS_DIRECTORY, `${sanitizedCollectionName}.json`);
	fs.writeFileSync(collectionPath, JSON.stringify(collection, null, "\t") + "\n", "utf-8");
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
