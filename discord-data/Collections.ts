import { CollectiblesCategories } from "~/types/CollectiblesCategories";
import collections from "~discord-data/collections/index";

// Infer the type of the collections object
type InferredCollections = typeof collections;

// Using the inferred type, create a new type that maps the key names to the CollectiblesCategories type
type CollectionsExport = {
	[K in keyof InferredCollections]: CollectiblesCategories;
};

const typedCollections: CollectionsExport = collections;

export default typedCollections;
