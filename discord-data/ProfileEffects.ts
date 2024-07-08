import { ProfileEffect } from "~/types/ProfileEffects";
import profileEffects from "./profile-effects/index";

type ProfileEffectsExports = {
	[key: string]: ProfileEffect[];
};

const typedProfileEffects: ProfileEffectsExports = profileEffects;

export default typedProfileEffects;
