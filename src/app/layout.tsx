import "~/styles/globals.css";

import { Inter } from "next/font/google";
import NavBar from "./_components/NavBar";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Discord Archives",
	description: "An easily viewable archive of the various collections, or profile items, found on Discord",
	icons: [{ rel: "icon", url: "/icon.png" }]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className={`${inter.className}`}>
			<body className="min-h-screen pt-[calc(2.5rem+1.25rem-0.5rem)]">
				<NavBar />
				{/* 2.5rem = Biggest text + 1.25rem = main div top padding - 0.5rem = nav bar padding */}
				<main>{children}</main>
			</body>
		</html>
	);
}
