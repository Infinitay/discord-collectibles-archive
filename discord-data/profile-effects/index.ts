import fantasyData from "~discord-data/profile-effects/fantasy.json" assert { type: "json" };
import breakfastData from "~discord-data/profile-effects/breakfast.json" assert { type: "json" };
import disxcoreData from "~discord-data/profile-effects/disxcore.json" assert { type: "json" };
import fallData from "~discord-data/profile-effects/fall.json" assert { type: "json" };
import halloweenData from "~discord-data/profile-effects/halloween.json" assert { type: "json" };
import winterWonderlandData from "~discord-data/profile-effects/winter-wonderland.json" assert { type: "json" };
import monstersData from "~discord-data/profile-effects/monsters.json" assert { type: "json" };
import cyberpunkData from "~discord-data/profile-effects/cyberpunk.json" assert { type: "json" };
import lunarNewYearData from "~discord-data/profile-effects/lunar-new-year.json" assert { type: "json" };
import elementsData from "~discord-data/profile-effects/elements.json" assert { type: "json" };
import animeData from "~discord-data/profile-effects/anime.json" assert { type: "json" };
import springtoonsData from "~discord-data/profile-effects/springtoons.json" assert { type: "json" };
import valorantData from "~discord-data/profile-effects/valorant.json" assert { type: "json" };
import lofiVibesData from "~discord-data/profile-effects/lofi-vibes.json" assert { type: "json" };
import galaxyData from "~discord-data/profile-effects/galaxy.json" assert { type: "json" };
import feelinRetroData from "~discord-data/profile-effects/feelin-retro.json" assert { type: "json" };
import piratesData from "~discord-data/profile-effects/pirates.json" assert { type: "json" };
import arcadeData from "~discord-data/profile-effects/arcade.json" assert { type: "json" };
import palworldData from "~discord-data/profile-effects/palworld.json" assert { type: "json" };
import { type ProfileEffect } from "~/types/ProfileEffects";

const fantasy = fantasyData as ProfileEffect[];
const breakfast = breakfastData as ProfileEffect[];
const disxcore = disxcoreData as ProfileEffect[];
const fall = fallData as ProfileEffect[];
const halloween = halloweenData as ProfileEffect[];
const winterWonderland = winterWonderlandData as ProfileEffect[];
const monsters = monstersData as ProfileEffect[];
const cyberpunk = cyberpunkData as ProfileEffect[];
const lunarNewYear = lunarNewYearData as ProfileEffect[];
const elements = elementsData as ProfileEffect[];
const anime = animeData as ProfileEffect[];
const springtoons = springtoonsData as ProfileEffect[];
const valorant = valorantData as ProfileEffect[];
const lofiVibes = lofiVibesData as ProfileEffect[];
const galaxy = galaxyData as ProfileEffect[];
const feelinRetro = feelinRetroData as ProfileEffect[];
const pirates = piratesData as ProfileEffect[];
const arcade = arcadeData as ProfileEffect[];
const palworld = palworldData as ProfileEffect[];

const profileEffects = {
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
	springtoons,
	valorant,
	lofiVibes,
	galaxy,
	feelinRetro,
	pirates,
	arcade,
	palworld
};

export default profileEffects;
