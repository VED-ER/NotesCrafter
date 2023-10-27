import React from "react";
import Logo from "../../../components/Logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="flex flex-col bg-background z-50">
      <div className="w-full bottom-0 flex items-center p-6">
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
      <div className="px-6 pb-6 flex justify-between text-xs">
        <p>Copyright &copy; NotesCrafter {new Date().getFullYear()}</p>
        <p>Developed by <Link target="_blank" href={"https://github.com/VED-ER"}>VED-ER</Link></p>
      </div>
    </div>
  );
};

export default Footer;
