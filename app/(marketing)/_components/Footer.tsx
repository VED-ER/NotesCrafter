import React from "react";
import Logo from "../../../components/Logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="w-full bottom-0 flex items-center p-6 bg-background z-50">
      <div className="hidden md:block">
        <Logo />
      </div>
      <div className="flex md:ml-auto justify-between w-full md:justify-end">
        <Button variant={"ghost"} size={"sm"} asChild>
          <Link href={"/privacy-policy"}>Privacy Policy</Link>
        </Button>
        <Button variant={"ghost"} size={"sm"} asChild>
          <Link href={"/terms-and-conditions"}>Terms & Conditions</Link>
        </Button>
      </div>
    </div>
  );
};

export default Footer;
