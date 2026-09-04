"use client";
import { cn } from "cn";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
	const pathname = usePathname();
	return (
		<header>
			<div className="main-container inner">
				<Link href="/">
					<Image src="/logo.svg" alt="CoinPulse logo" width={132} height={40} />
				</Link>
				<nav>
					<Link
						className={cn("nav-link", {
							"is-active": pathname === "/",
							"is-home": true,
						})}
						href="/"
					>
						Home
					</Link>
					<p>Search Model</p>
					<Link
						className={cn("nav-link", {
							"is-active": pathname === "/coins",
						})}
						href="/coins"
					>
						All Coins
					</Link>
				</nav>
			</div>
		</header>
	);
};

export default Header;
