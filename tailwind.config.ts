import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
	content: ["./src/**/*.tsx"],
	theme: {
		extend: {
			fontFamily: {
				sans: ["var(--font-geist-sans)", ...fontFamily.sans]
			},
			colors: {
				// Discord Brand Colors
				"discord-blurple": "#5865F2",
				"discord-green": "#57F287",
				"discord-yellow": "#FEE75C",
				"discord-fuchsia": "#EB459E",
				"discord-red": "#ED4245",
				"discord-white": "#FFFFFF",
				"discord-black": "#23272A",
				// Extra Discord Color
				"discord-gray": "#2c2f33"
			}
		}
	},
	plugins: []
} satisfies Config;
