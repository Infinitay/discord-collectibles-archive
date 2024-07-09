import "~/styles/globals.css";

import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Discord Archives",
	description: "An easily viewable archive of the various collections, or profile items, found on Discord",
	icons: [{ rel: "icon", url: "/icon.png" }]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className={`${inter.className}`}>
			<body>{children}</body>
		</html>
	);
}
