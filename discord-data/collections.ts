import { CollectiblesCategories } from "~/types/CollectiblesCategories";
import collections from "./collections/index";

type CollectionsExport = {
	[key: string]: CollectiblesCategories;
};

const typedCollections: CollectionsExport = collections;

export default typedCollections;
