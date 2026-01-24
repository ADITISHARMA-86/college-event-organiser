import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";



export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="pb-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          
          {/* LEFT */}
          <div>
            <span className="text-gray-500 font-light tracking-wide mb-6 block">
              EVENTX<span className="text-purple-500">*</span>
            </span>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight mb-6">
              Discover & <br />
              create amazing <br />
              <span className= "bg-linear-to-r from-blue-400   via-purple-500 to-orange-400 bg-clip-text text-transparent"
              >events.</span>
            </h1>

            <p className="text-gray-600 max-w-md mb-8">
              Whether you&apos;re hosting or attending, EVENTX makes every
              event memorable. Join our community today.
            </p>

            <Link href="/explore">
              <Button size="lg" className="rounded-full px-8 bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300">
                Get Started
              </Button>
            </Link>
          </div>

          {/* RIGHT */}
          <div className="hidden md:block">
            {/* You can add image / illustration here later */}
            <Image src="/hero.gif" alt="react meetup" width={700} height={700} className="w-full h-auto" priority/>
          </div>

        </div>
      </section>
    </div>
  );
}
