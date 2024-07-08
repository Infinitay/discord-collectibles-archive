import { ProfileEffect } from "~/types/ProfileEffects";
import profileEffects from "./profile-effects/index";

// Infer the type of the profile effects object
type InferredProfileEffects = typeof profileEffects;

// Using the inferred type, create a new type that maps the key names to the CollectiblesCategories type
type ProfileEffectsExports = {
	[K in keyof InferredProfileEffects]: ProfileEffect[];
};

const typedProfileEffects: ProfileEffectsExports = profileEffects;

export default typedProfileEffects;
