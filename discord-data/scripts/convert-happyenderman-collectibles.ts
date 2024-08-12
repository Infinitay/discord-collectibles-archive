import * as fs from "fs";
if (!fs.existsSync("../raw/old-data/collectibles-categories-happyenderman-original.json")) {
	throw new Error("../raw/old-data/collectibles-categories-happyenderman-original not found");
}

// Import happyendermangit's data: https://github.com/happyendermangit/discarchives/blob/main/src/collectibles/collectibles.js
// Manually modify the file so that it is a JSON file and you are only keeping the currently named collectibles array
import oldJSON from "../raw/old-data/collectibles-categories-happyenderman-original.json" assert { type: "json" };
import olderJSON from "../raw/old-data/collectibles-categories-20231101.json" assert { type: "json" };

interface Colors {
	_originalInput: string;
	_r: number;
	_g: number;
	_b: number;
	_a: number;
	_roundA: number;
	_format: string;
	_ok: boolean;
	_tc_id: number;
}

const data = [
	{ json: oldJSON, exportPath: "../raw/old-data/collectibles-categories-happyenderman-converted.json" },
	{ json: olderJSON, exportPath: "../raw/old-data/collectibles-categories-20231101-converted.json" }
];

const replacements = new Map();
replacements.set("storeListingId", "store_listing_id");
replacements.set("unpublishedAt", "unpublished_at");
replacements.set("publishedAt", "published_at");
replacements.set("countryPrices", "country_prices");
replacements.set("countryCode", "country_code");
replacements.set("categorysku_id", "category_sku_id");
replacements.set("premiumType", "premium_type");
replacements.set("backgroundColors", "background_colors");
replacements.set("buttonColors", "button_colors");
replacements.set("confettiColors", "confetti_colors");
replacements.set("mobileBanner", "mobile_banner");
replacements.set("mobileBg", "mobile_bg");
replacements.set("pdpBg", "pdp_bg");

for (const entry of data) {
	// Replace the old property names with the new names
	let s = JSON.stringify(entry.json);
	replacements.forEach((value, key) => {
		s = s.replaceAll(key, value);
	});
	entry.json = JSON.parse(s);
	for (const collection of entry.json) {
		// Fixing styles for the collection and each product
		const newColorObject = generateColorObject();
		if ("styles" in collection) {
			// Check if the first product exists and has styles
			const firstProduct = collection.products[0];
			if (firstProduct !== undefined && "styles" in firstProduct) {
				console.log(`No styles for '${collection.name}' collection so converting existing colors and generating it`);
				const styles = firstProduct.styles! as any;

				// Check if backgroundColors is present and valid
				if ("background_colors" in styles && typeof styles.background_colors[0] === "object" && !Array.isArray(styles.background_colors[0])) {
					// Convert backgroundColors, buttonColors, and confettiColors for the first product
					if ("background_colors" in styles) {
						newColorObject.background_colors = styles.background_colors.map(convertRGBToDecimal);
					}
					if ("button_colors" in styles) {
						newColorObject.button_colors = styles.button_colors.map(convertRGBToDecimal);
					}
					if ("confetti_colors" in styles) {
						newColorObject.confetti_colors = styles.confetti_colors.map(convertRGBToDecimal);
					}
					console.log("Color object", newColorObject);
					(collection.styles as any) = newColorObject;
				} else {
					console.log(`No valid background colors in ${collection.name}, probably already in the proper format`);
				}
			}
		} else {
			// Else use an empty color object because the color data was not present such as for old collections that were first released
			console.log(`No styles for '${collection.name}' collection so generating it`);
			(collection as any).styles = newColorObject;
		}

		// Change the various properties for the collection pretaining the product, prices, or the collection properties
		(collection.products as any) = collection.products.map((product) => {
			// Assign the color object to the products themselves like in the new data format as of June 2024
			(product as { styles?: any }).styles = (collection as any).styles;

			// Set the product's banner to the collection's banner if it's null
			if ((product as { banner: string | null }).banner === null) {
				(product as { banner: string | null }).banner = collection.banner;
			}

			// Handle type and premium_type but do assign it differently for the DISXCORE collection
			if (collection.sku_id !== "1144058340327047249") {
				// Premium type for these products _should be_ 0
				// product.type should be equal to product.items[0] type (there is always at least one item)
				if ("premium_type" in product) {
					product.premium_type = 0;
				} else {
					(product as any)["premium_type"] = 0;
				}
			} else {
				// The premium type for DISCORE products is set to 2 as of June 2024
				// Although this is unnecessary given the data is premiumType and we already rename, but just in case
				if ("premium_type" in product) {
					(product as { premium_type: number })["premium_type"] = 2;
				} else {
					(product as any)["premium_type"] = 2;
				}
			}
			(product as any)["type"] = product.items[0]!.type;

			// Add google_sku_ids to the product which should just be empty for now
			// @ts-ignore
			(product as { google_sku_ids: any })["google_sku_ids"] = {};

			// Remove currency and price from the product
			if ("currency" in product) delete (product as any)["currency"];
			if ("price" in product) delete (product as any)["price"];

			// Set the country_code of each price to "US" since we only have US prices
			// Set an exponent value if it's not available
			// Remove tax and taxInclusive from the prices
			// Remove paymentSourcePrices from prices
			Object.keys(product.prices).forEach((key) => {
				const price = (product as any)["prices"][key];
				const countryPrices = price["country_prices"];

				if ("country_code" in countryPrices) {
					countryPrices.country_code = "US";
				} else {
					countryPrices.country_code = "US";
				}

				if (!("exponent" in countryPrices["prices"][0])) {
					countryPrices["prices"][0].exponent = 2; // Should be 2 for USD
				}

				if ("tax" in countryPrices["prices"][0]) delete countryPrices["prices"][0]["tax"];
				if ("taxInclusive" in countryPrices["prices"][0]) delete countryPrices["prices"][0]["taxInclusive"];
				if ("paymentSourcePrices" in price) delete price["paymentSourcePrices"];
			});

			if (!("categorysku_id" in product || "category_sku_id" in product)) {
				(product as any)["category_sku_id"] = collection.sku_id;
			}

			return product;
		});
	}

	fs.writeFileSync(entry.exportPath, JSON.stringify(entry.json), "utf-8");
	console.log(`========== Converted "${entry.exportPath}" ==========`);
}

function convertRGBToDecimal(colors: Colors) {
	return (colors._r << 16) + (colors._g << 8) + colors._b;
}

function generateColorObject() {
	return {
		background_colors: [] as number[],
		button_colors: [] as number[],
		confetti_colors: [] as number[]
	};
}
