"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  SignInButton,
  UserButton,
  SignedIn,
  SignedOut,
  ClerkLoaded,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { BarLoader } from "react-spinners";
import { useStoreUserEffect } from "@/hooks/useStoreUser";
import { Building, Plus, Ticket } from "lucide-react";

const Header = () => {
  const { isLoading } = useStoreUserEffect();
  const [, setShowUpgradeModal] = useState(false);

  return (
    <nav className="fixed top-0 right-0 left-0 bg-black z-20 border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
  src="/event-logo.png"
  alt="Event logo"
  width={200}
  height={60}
  priority
/>

        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowUpgradeModal(true)}
          >
            Pricing
          </Button>

            <Link href="/explore">
             <Button variant="ghost" size="sm" className="mr-2">
              Explore
              </Button>
             </Link>

          {/* 🔐 AUTH SAFE BLOCK */}
          <ClerkLoaded>
            <SignedIn>
              <Link href="/create-event">
            <Button
              variant="outline"
                size="sm"
                className="mr-4 text-black border-white hover:bg-white hover:text-black flex items-center gap-2">
                 <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Create Event</span>
                   </Button>
                   </Link>


              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Link
                    label="My Tickets"
                    labelIcon={<Ticket size={16} />}
                    href="/my-tickets"
                  />
                  <UserButton.Link
                    label="My Events"
                    labelIcon={<Building size={16} />}
                    href="/my-events"
                  />
                  <UserButton.Action label="manageAccount" />
                </UserButton.MenuItems>
              </UserButton>
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <Button size="sm">Sign In</Button>
              </SignInButton>
            </SignedOut>
          </ClerkLoaded>
        </div>
      </div>

      {/* Loader */}
      {isLoading && (
        <div className="absolute bottom-0 left-0 w-full">
          <BarLoader color="#a855f7" cssOverride={{ width: "100%" }} />
        </div>
      )}
    </nav>
     
  );
};

export default Header;

