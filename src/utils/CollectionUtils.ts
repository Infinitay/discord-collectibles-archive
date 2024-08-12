import { type CollectiblesCategories, ItemTypes, PremiumTypes, PricesKeys, type Product } from "~/types/CollectiblesCategories";
import { type ProfileEffect } from "~/types/ProfileEffects";
import collections from "~discord-data/collections";
import effects from "~discord-data/profile-effects";

const DISCORD_AVATAR_DECORATION_ENDPOINT = "https://cdn.discordapp.com/avatar-decoration-presets/";

// =============== COLLECTIONS ===============
const getAvatarDecorations = (collection: CollectiblesCategories): Product[] => {
	return collection.products.filter((product) => isAvatarDecoration(product));
};

const getProfileEffects = (collection: CollectiblesCategories): Product[] => {
	return collection.products.filter((product) => isProfileEffect(product));
};

const isUncategorized = (collection: CollectiblesCategories): boolean => {
	return collection.sku_id === collections.uncategorized.sku_id;
};

// =============== PRODUCTS ===============
const isProductNitroOnly = (product: Product): boolean => {
	return product.premium_type === PremiumTypes.Nitro;
};

const getOriginalPrice = (product: Product): number => {
	if (product.prices[PricesKeys.OriginalPrice] === undefined) {
		return -1;
	}
	const priceObject = product.prices[PricesKeys.OriginalPrice].country_prices.prices[0]!;
	return priceObject.amount / Math.pow(10, priceObject.exponent);
};

const getNitroPrice = (product: Product): number => {
	if (isProductNitroOnly(product)) {
		return getOriginalPrice(product);
	} else {
		if (product.prices[PricesKeys.NitroPrice]) {
			const priceObject = product.prices[PricesKeys.NitroPrice].country_prices.prices[0]!;
			return priceObject.amount / Math.pow(10, priceObject.exponent);
		} else {
			return -1;
		}
	}
};

const isAvatarDecoration = (product: Product): boolean => {
	return (product.type as number) === (ItemTypes.AvatarDecoration as number);
};

const isProfileEffect = (product: Product): boolean => {
	return (product.type as number) === (ItemTypes.ProfileEffect as number);
};

// ===== Avatar Decorations =====
const isAvatarAnimated = (product: Product): boolean => {
	// All products currently have at least 1 item (bundled products have more)
	// All avatar decorations have the asset field
	return product.items[0]!.asset!.startsWith("a_");
};

const getAvatarDecorationURL = (product: Product, animated = false): string => {
	const avatarDecortationURL = `${DISCORD_AVATAR_DECORATION_ENDPOINT}${product.items[0]!.asset}.png`;
	return `${avatarDecortationURL}?size=240&passthrough=${animated ? "true" : "false"}`;
};

// ===== Profile Effects =====
const getProfileEffect = (product: Product): ProfileEffect | undefined => {
	const collectionSKU = product.category_sku_id;
	const collectionName = Object.entries(collections).find(([_k, c]) => c.sku_id === collectionSKU)?.[0];
	if (!collectionName) return undefined;
	const profileEffects = effects[collectionName as keyof typeof effects];
	if (!profileEffects) return undefined;
	return profileEffects.find((effect) => effect.sku_id === product.sku_id);
};

export const CollectionUtils = {
	getAvatarDecorations,
	getProfileEffects,
	isUncategorized,

	isProductNitroOnly,
	getOriginalPrice,
	getNitroPrice,

	isAvatarAnimated,
	getAvatarDecorationURL,

	getProfileEffect
};
