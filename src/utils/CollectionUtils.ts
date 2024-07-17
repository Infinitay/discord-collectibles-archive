import { CollectiblesCategories, ItemTypes, PremiumTypes, PricesKeys, Product } from "~/types/CollectiblesCategories";

const getAvatarDecorations = (collection: CollectiblesCategories): Product[] => {
	return collection.products.filter((product) => product.type === ItemTypes.AvatarDecoration);
};

const getProfileEffects = (collection: CollectiblesCategories): Product[] => {
	return collection.products.filter((product) => product.type === ItemTypes.ProfileEffect);
};

const isProductNitroOnly = (product: Product): boolean => {
	return product.premium_type === PremiumTypes.Nitro;
};

const getOriginalPrice = (product: Product): number => {
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

export const CollectionUtils = {
	getAvatarDecorations,
	getProfileEffects,

	isProductNitroOnly,
	getOriginalPrice,
	getNitroPrice
};
