import Link from "next/link";
import React from "react";

const PAGES = [{ id: "collections", label: "Collections", link: "/collections" }];

export default function NavBar() {
	return (
		<nav className="fixed left-0 right-0 top-0 z-50 flex items-center bg-gray-100/50 px-6 py-2 shadow shadow-black/10 backdrop-blur-md">
			<Link href="/" className="text-4xl font-bold uppercase">
				<img src="/icon.png" alt="Discord Collectibles Archive Logo" className="h-10 w-10 drop-shadow hover:drop-shadow-lg" />
			</Link>
			<div className="flex gap-x-5 pl-5">
				{PAGES.map((page) => (
					<Link key={page.id} href={page.link} className="text-xl transition-all duration-75 hover:text-black/50 hover:drop-shadow">
						{page.label}
					</Link>
				))}
			</div>
		</nav>
	);
}
