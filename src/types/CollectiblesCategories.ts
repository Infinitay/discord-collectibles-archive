export interface CollectiblesCategories {
	sku_id: string;
	name: string;
	summary: string;
	store_listing_id: string;
	banner: string;
	unpublished_at: string | null;
	styles: Styles;
	logo: string;
	mobile_bg?: string;
	pdp_bg?: string;
	mobile_banner?: string;
	products: Product[];
}

export interface Product {
	sku_id: string;
	name: string;
	summary: string;
	store_listing_id: string;
	banner: string;
	unpublished_at: null;
	styles: Styles;
	prices: Record<PricesKeys.OriginalPrice, PriceValue> & Partial<Record<PricesKeys, PriceValue>>;
	items: Item[];
	type: ProductTypes;
	premium_type: PremiumTypes;
	category_sku_id: string;
	bundled_products?: BundledProduct[];
	google_sku_ids: Record<string, string | undefined>;
}

export interface BundledProduct {
	sku_id: string;
	name: string;
	summary: string;
	type: ItemTypes;
	premium_type: PremiumTypes;
	prices: Record<string, PriceValue>;
}

export interface PriceValue {
	country_prices: CountryPrices;
}

export interface CountryPrices {
	country_code: CountryCode;
	prices: PriceElement[];
}

// ISO 3166-1 alpha-2 code
export type CountryCode = "US";

export interface PriceElement {
	amount: number;
	currency: Currency;
	exponent: number;
}

// ISO 4217 code
export type Currency = "usd";

export interface Item {
	type: ItemTypes;
	id: string;
	sku_id: string;
	asset?: string;
	label?: string;
}

export interface Styles {
	background_colors: number[];
	button_colors: number[];
	confetti_colors: number[];
}

export enum ProductTypes {
	AvatarDecoration = 0,
	ProfileEffect = 1,
	Bundle = 1000
}

export enum PremiumTypes {
	Everyone = 0,
	Nitro = 2
}

export enum ItemTypes {
	AvatarDecoration = 0,
	ProfileEffect = 1
}

export enum PricesKeys {
	OriginalPrice = "0",
	NitroPrice = "4",
	OriginalPrice2 = "5",
	NitroPrice2 = "7"
}
