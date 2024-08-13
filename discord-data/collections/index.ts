import fantasyData from "~discord-data/collections/fantasy.json" assert { type: "json" };
import breakfastData from "~discord-data/collections/breakfast.json" assert { type: "json" };
import disxcoreData from "~discord-data/collections/disxcore.json" assert { type: "json" };
import fallData from "~discord-data/collections/fall.json" assert { type: "json" };
import halloweenData from "~discord-data/collections/halloween.json" assert { type: "json" };
import winterWonderlandData from "~discord-data/collections/winter-wonderland.json" assert { type: "json" };
import monstersData from "~discord-data/collections/monsters.json" assert { type: "json" };
import cyberpunkData from "~discord-data/collections/cyberpunk.json" assert { type: "json" };
import lunarNewYearData from "~discord-data/collections/lunar-new-year.json" assert { type: "json" };
import elementsData from "~discord-data/collections/elements.json" assert { type: "json" };
import animeData from "~discord-data/collections/anime.json" assert { type: "json" };
import uncategorizedData from "~discord-data/collections/uncategorized.json" assert { type: "json" };
import springtoonsData from "~discord-data/collections/springtoons.json" assert { type: "json" };
import valorantData from "~discord-data/collections/valorant.json" assert { type: "json" };
import lofiVibesData from "~discord-data/collections/lofi-vibes.json" assert { type: "json" };
import galaxyData from "~discord-data/collections/galaxy.json" assert { type: "json" };
import feelinRetroData from "~discord-data/collections/feelin-retro.json" assert { type: "json" };
import piratesData from "~discord-data/collections/pirates.json" assert { type: "json" };
import arcadeData from "~discord-data/collections/arcade.json" assert { type: "json" };
import palworldData from "~discord-data/collections/palworld.json" assert { type: "json" };
import darkFantasyData from "~discord-data/collections/dark-fantasy.json" assert { type: "json" };
import { type CollectiblesCategories } from "~/types/CollectiblesCategories";

const fantasy = fantasyData as CollectiblesCategories;
const breakfast = breakfastData as CollectiblesCategories;
const disxcore = disxcoreData as CollectiblesCategories;
const fall = fallData as CollectiblesCategories;
const halloween = halloweenData as CollectiblesCategories;
const winterWonderland = winterWonderlandData as CollectiblesCategories;
const monsters = monstersData as CollectiblesCategories;
const cyberpunk = cyberpunkData as CollectiblesCategories;
const lunarNewYear = lunarNewYearData as CollectiblesCategories;
const elements = elementsData as CollectiblesCategories;
const anime = animeData as CollectiblesCategories;
const uncategorized = uncategorizedData as CollectiblesCategories;
const springtoons = springtoonsData as CollectiblesCategories;
const valorant = valorantData as CollectiblesCategories;
const lofiVibes = lofiVibesData as CollectiblesCategories;
const galaxy = galaxyData as CollectiblesCategories;
const feelinRetro = feelinRetroData as CollectiblesCategories;
const pirates = piratesData as CollectiblesCategories;
const arcade = arcadeData as CollectiblesCategories;
const palworld = palworldData as CollectiblesCategories;
const darkFantasy = darkFantasyData as CollectiblesCategories;

const collections = {
	fantasy,
	breakfast,
	disxcore,
	fall,
	halloween,
	winterWonderland,
	monsters,
	cyberpunk,
	lunarNewYear,
	elements,
	anime,
	uncategorized,
	springtoons,
	valorant,
	lofiVibes,
	galaxy,
	feelinRetro,
	pirates,
	arcade,
	palworld,
	darkFantasy
};

export default collections;
