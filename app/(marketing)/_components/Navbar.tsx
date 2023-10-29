"use client";
import { useScrollTop } from "@/hooks/useScrollTop";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import Logo from "../../../components/Logo";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/theme-mode-toggle";
import { useConvexAuth } from "convex/react";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { Spinner } from "@/components/Spinner";
import Link from "next/link";
import { MenuIcon, XIcon } from "lucide-react";
import { useMediaQuery } from "usehooks-ts";

const navlinks = [
	{
		labe: "About",
		link: "/about"
	},
	{
		labe: "Careers",
		link: "/careers"
	}
];

const Navbar = () => {
	const [mounted, setMounted] = useState(false)
	const [showMenu, setShowMenu] = useState(false);
	const navContentRef = useRef<HTMLDivElement>(null)
	const { isAuthenticated, isLoading } = useConvexAuth();
	const scrolled = useScrollTop(10);
	const isMobile = useMediaQuery("(max-width: 768px)")

	// must have to prevent hydration warning. "Warning: Prop `className` did not match."
	useEffect(() => {
		setMounted(true)
	}, [])

	useEffect(() => {
		navContentRef.current?.addEventListener('touchmove', e => {
			e.preventDefault()
		}, { passive: false })
	}, [navContentRef.current])

	const Middlediv = () => (
		<div className="flex flex-col md:flex-row gap-3">
			{navlinks.map((d, i) => (
				<Button key={i} variant={isMobile ? "secondary" : "ghost"} asChild>
					<Link href={d.link}>
						{d.labe}
					</Link>
				</Button>
			))}
		</div>
	)

	const Rightdiv = () => (
		<div className="flex flex-col md:flex-row items-center gap-3">
			{isLoading && <Spinner />}
			{!isAuthenticated && !isLoading && (
				<>
					<SignInButton mode="modal">
						<Button variant={"ghost"}>Log in</Button>
					</SignInButton>
					<SignInButton mode="modal">
						<Button variant={"default"}>Get NotesCrafter for free</Button>
					</SignInButton>
				</>
			)}
			{isAuthenticated && !isLoading && (
				<>
					<Button className={cn(isMobile && "w-full")} variant={"default"} asChild>
						<Link href={"/notes"}>Enter NotesCrafter</Link>
					</Button>
					<div onClick={(e) => e.stopPropagation()} className="mx-auto md:mx-0">
						<UserButton afterSignOutUrl="/" />
					</div>
				</>
			)}
			<div className="hidden md:block">
				<ModeToggle />
			</div>
		</div>
	)

	if (!mounted) return null

	return (
		<nav className={cn("flex justify-between items-center p-5 fixed top-0 bg-background w-full z-50", scrolled && "border-b shadow")}>
			<div className="flex items-center gap-3 justify-between w-full md:w-auto">
				<Logo />
				<div className="flex md:hidden ms-auto space-x-3 items-center">
					<ModeToggle />
					<Button onClick={() => setShowMenu((prev) => !prev)}>
						<MenuIcon className="h-6 w-6 text-muted" />
					</Button>
				</div>
			</div>
			<div className="hidden md:flex gap-3 ">
				<Middlediv />
				<Rightdiv />
			</div>

			{/* mobile backdrop */}
			<div className={cn("pointer-events-none fixed h-full w-screen opacity-0 md:hidden bg-black/50 backdrop-blur-sm top-0 right-0 transition-opacity duration-300",
				showMenu && "opacity-100")}
			/>
			{/* sidebar mobile menu */}
			<div
				ref={navContentRef}
				onClick={() => setShowMenu(false)}
				className={cn(
					"fixed h-full w-screen md:hidden top-0 right-0 translate-x-full transition-all duration-300",
					showMenu && "translate-x-0"
				)}
			>
				<div className="bg-background flex-col absolute right-0 top-0 h-screen p-5 z-50 w-[75%] flex gap-3">
					<div className="flex justify-between items-center gap-3 mb-7">
						<Logo />
						<Button onClick={() => setShowMenu((prev) => !prev)}>
							<XIcon className="h-6 w-6 text-muted" />
						</Button>
					</div>
					<Middlediv />
					<Rightdiv />
				</div>
			</div>
		</nav >
	)
};

export default Navbar;
