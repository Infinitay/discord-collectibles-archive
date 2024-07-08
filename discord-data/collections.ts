import { CollectiblesCategories } from "~/types/CollectiblesCategories";
import Collections from "~discord-data/Collections";

type CollectionsExport = {
	[key: string]: CollectiblesCategories;
};

const typedCollections: CollectionsExport = Collections;

export default typedCollections;
