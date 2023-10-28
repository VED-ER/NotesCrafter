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
import { MenuIcon } from "lucide-react";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const navContentRef = useRef<HTMLDivElement>(null)
  const { isAuthenticated, isLoading } = useConvexAuth();
  const scrolled = useScrollTop(10);
  const pathname = usePathname();

  useEffect(() => {
    setShowMenu(false);
  }, [pathname]);

  useEffect(() => {
    navContentRef.current?.addEventListener('touchmove', e => {
      e.preventDefault()
    }, { passive: false })
  }, [])

  return (
    <nav
      className={cn(
        "p-5 fixed top-0 bg-background w-full z-50",
        scrolled && "border-b shadow"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex w-full md:w-auto justify-between items-center ">
          <Logo />

          <div className="flex md:hidden ms-auto space-x-3 items-center">
            <ModeToggle />
            <Button onClick={() => setShowMenu((prev) => !prev)}>
              <MenuIcon className="h-6 w-6 text-muted" />
            </Button>
          </div>
        </div>

        <div
          ref={navContentRef}
          className={cn(
            "hidden md:flex z-[-1] md:z-auto top-[76px]  flex-col md:flex-row md:items-center  md:static bg-background w-full md:w-auto left-0 px-5 md:px-0 md:py-0 pb-4 md:pb-0 space-y-2 md:space-y-0 opacity-0 md:opacity-100 transition-all ease-in duration-200 md:space-x-3",
            showMenu && " opacity-100 absolute flex shadow md:shadow-none"
          )}
        >
          <Button variant={"ghost"} asChild>
            <Link href={"/about"}>About</Link>
          </Button>
          <Button variant={"ghost"} asChild>
            <Link href={"/careers"}>Careers</Link>
          </Button>
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
              <Button className="" variant={"default"} asChild>
                <Link href={"/notes"}>Enter NotesCrafter</Link>
              </Button>
              <div className="mx-auto md:mx-0">
                <UserButton afterSignOutUrl="/" />
              </div>
            </>
          )}
          <div className="hidden md:block">
            <ModeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
