import React from "react";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
   <nav className="fixed top-0 right-0 left-0 bg-black z-20 border-b ">
  <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
    <Link href="/" className="flex items-center">
     <Image
  src="/event-logo.png"
  alt="Event logo"
  width={500}
  height={500}
  className="h-11 w-auto"
  priority


      />
    </Link>
  </div>
</nav>

  );
};

export default Header;
