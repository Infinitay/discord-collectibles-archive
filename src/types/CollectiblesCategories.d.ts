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
	prices: { [key: string]: PriceValue };
	items: Item[];
	type: ProductTypes | number;
	premium_type: PremiumTypes | number;
	category_sku_id: string;
	bundled_products?: BundledProduct[];
	google_sku_ids: { [key: string]: string };
}

export interface BundledProduct {
	sku_id: string;
	name: string;
	summary: string;
	type: ItemTypes | number;
	premium_type: PremiumTypes | number;
	prices: { [key: string]: PriceValue };
}

export interface PriceValue {
	country_prices: CountryPrices;
}

export interface CountryPrices {
	country_code: CountryCode;
	prices: PriceElement[];
}

// Union to a string because it could be any country code (ISO 3166-1 alpha-2 code), but also type check was complaining
export type CountryCode = "US" | string;

export interface PriceElement {
	amount: number;
	currency: Currency;
	exponent: number;
}

// Union to a string because it could be any currency code (ISO 4217 code), but also type check was complaining
export type Currency = "usd" | string;

export interface Item {
	type: ItemTypes | number;
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
	Nitro = 1
}

export enum ItemTypes {
	AvatarDecoration = 0,
	ProfileEffect = 1
}
