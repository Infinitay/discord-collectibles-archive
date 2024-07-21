// Regex to remove special characters (not including spaces) from the collection name
const SANITIZE_COLLECTION_NAME_REGEX = /[^a-z0-9\s]/gi;

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
export const sanitizeCollectionName = (collectionName: string): string => {
	return collectionName.toLowerCase().replaceAll(SANITIZE_COLLECTION_NAME_REGEX, "").replaceAll(" ", "-");
};

/**
 * Sanitizes the string and converts it to camelCase
 *
 * @param string
 * @returns sanitized and camelCase without special characters
 */
export const toSanitizedCamelCase = (string: string): string => {
	string = string.toLowerCase();
	const strings = string.split(/\s/gi);
	let camelCase = strings.shift() ?? "";
	if (strings.length > 0) {
		camelCase += strings.map((s) => `${s.charAt(0).toUpperCase()}${s.substring(1)}`).join("");
	}
	return camelCase.replaceAll(SANITIZE_COLLECTION_NAME_REGEX, "");
};
