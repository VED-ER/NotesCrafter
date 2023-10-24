'use client'

import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/clerk-react";
import { useConvexAuth } from "convex/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const GetStarted = () => {
  const { isAuthenticated, isLoading } = useConvexAuth()
  return (
    <div className="mt-20 bg-secondary w-full py-8 px-3 rounded-md">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold">Start Simplifying Now</h2>
      <p className="text-lg sm:text-xl mx-auto max-w-2xl mt-4">Whether you're a student, a professional, or a creative thinker, our simple note-taking web app is your reliable partner.</p>
      <div className="mt-6">
        {isAuthenticated && !isLoading && (
          <Button asChild>
            <Link href={'/notes'}>
              Enter NotesCrafter
              <ArrowRight className='w-5 h-5 ml-2' />
            </Link>
          </Button>
        )}
        {!isAuthenticated && !isLoading && (
          <SignInButton mode='modal'>
            <Button className=''>
              Get NotesCrafter for free
              <ArrowRight className='w-5 h-5 ml-2' />
            </Button>
          </SignInButton>
        )}
      </div>
    </div>
  );
};

export default GetStarted;
