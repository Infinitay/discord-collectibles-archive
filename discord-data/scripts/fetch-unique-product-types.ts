import { type Product, type CollectiblesCategories } from "~/types/CollectiblesCategories";
import collections from "~discord-data/collections";

// Map to store the combination of types and corresponding sku_id
const productTypesMap = new Map<string, Product>();
const bundledProductTypesMap = new Map<string, Product>();
const priceKeys = new Map<string, string>();

Object.values(collections)
	.filter((c) => c.unpublished_at === null)
	.forEach((collection: CollectiblesCategories) => {
		collection.products.forEach((product) => {
			const productType = product.type;
			const premiumType = product.premium_type;
			const isBundle = !!product.bundled_products && product.bundled_products.length > 0;
			const itemTypes = product.items.map((item) => item.type).join(",");
			if (isBundle) {
				const bundledProductTypes = product.bundled_products?.map((bp) => bp.type).join(",");
				const bundledPremiumTypes = product.bundled_products?.map((bp) => bp.premium_type).join(",");
				const key = `${isBundle}|${productType}|${premiumType}|${itemTypes}|||${bundledProductTypes}|${bundledPremiumTypes}`;
				bundledProductTypesMap.set(key, product);
			} else {
				const key = `${isBundle}|${productType}|${premiumType}|${itemTypes}`;
				productTypesMap.set(key, product);
			}
			Object.entries(product.prices).forEach(([key, priceValue]) => {
				const actualPricesList = priceValue.country_prices.prices;
				if (actualPricesList.length > 1) {
					console.log("Multiple prices found for key:", key, "in product:", product.sku_id);
				} else if (actualPricesList.length === 1) {
					const actualPrices = actualPricesList[0]?.amount;
					if (!actualPrices) {
						console.log("No price found for key:", key, "in product:", product.sku_id);
					} else {
						const priceKey = `${key}|${premiumType}|${actualPrices}`;
						priceKeys.set(priceKey, `${collection.name}=>${product.name}`);
					}
				}
			});
		});
	});

console.log("productTypesMap:", productTypesMap);
console.log("bundledProductTypesMap:", bundledProductTypesMap);
console.log("priceKeys:", priceKeys);
// console.log(JSON.stringify([...productTypesMap.values(), ...bundledProductTypesMap.values()]));

// Normal products => isBundle|productType|premiumType|itemTypes
// 'false|0|0|0' => '1245088023452975104', => Arcade: Slither 'n Snack = Avatar Decoration
// 'false|1|0|1' => '1245088254647205991', => Arcade: Twinkle Trails = Profile Effect
// 'false|0|2|0' => '1144059132517826601', => Disxcore: Smoke = Avatar Decoration
// 'false|1|2|1' => '1139323103193878569'  => Disxcore: Cyberspace = Profile Effect

// Bundled products => isBundle|productType|premiumType|itemTypes|||bundledProductTypes|bundledPremiumTypes
// 'true|1000|0|0,1|||0,1|0,0' => '1245481938202918912' => Arcade: Star Collector Bundle = Bundle (Avatar Decoration + Profile Effect)
