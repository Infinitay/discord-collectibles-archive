import { CollectiblesCategories, ItemTypes, PremiumTypes, PricesKeys, Product } from "~/types/CollectiblesCategories";

const DISCORD_AVATAR_DECORATION_ENDPOINT = "https://cdn.discordapp.com/avatar-decoration-presets/";

// =============== COLLECTIONS ===============
const getAvatarDecorations = (collection: CollectiblesCategories): Product[] => {
	return collection.products.filter((product) => product.type === ItemTypes.AvatarDecoration);
};

const getProfileEffects = (collection: CollectiblesCategories): Product[] => {
	return collection.products.filter((product) => product.type === ItemTypes.ProfileEffect);
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
	return product.type === ItemTypes.AvatarDecoration;
};

const isProfileEffect = (product: Product): boolean => {
	return product.type === ItemTypes.ProfileEffect;
};

// ===== Profile Effects =====
const isAvatarAnimated = (product: Product): boolean => {
	// All products currently have at least 1 item (bundled products have more)
	// All avatar decorations have the asset field
	return product.items[0]!.asset!.startsWith("a_");
};

const getAvatarDecorationURL = (product: Product, animated: boolean = false): string => {
	const avatarDecortationURL = `${DISCORD_AVATAR_DECORATION_ENDPOINT}${product.items[0]!.asset}.png`;
	return `${avatarDecortationURL}?size=240&passthrough=${animated ? "true" : "false"}`;
};

export const CollectionUtils = {
	getAvatarDecorations,
	getProfileEffects,

	isProductNitroOnly,
	getOriginalPrice,
	getNitroPrice,

	isAvatarAnimated,
	getAvatarDecorationURL
};
