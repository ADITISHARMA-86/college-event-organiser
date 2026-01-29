"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

export default function EventCarousel() {
  const autoplay = useRef(Autoplay({ delay: 3000, stopOnInteraction: false }));
  const [emblaRef, embla] = useEmblaCarousel({ loop: true }, [autoplay.current]);
  const router = useRouter();

  const handleViewLocalEvents = () => {
    router.push("/events");
  };

  const images = [
    "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1517433456452-f9633a875f6f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1518972559570-7cc1309f3229?auto=format&fit=crop&w=800&q=80",
  ];

  const programs = [
    {
      city: "Campus",
      title: "Orientation Day",
      desc: "Welcome new students to the college with fun activities.",
      startDate: "2026-02-05",
      registrationCount: 120,
    },
    {
      city: "Sports Arena",
      title: "Annual Sports Meet",
      desc: "Inter-college competitions and games.",
      startDate: "2026-02-12",
      registrationCount: 240,
    },
    {
      city: "Auditorium",
      title: "Cultural Fest",
      desc: "Music, dance, drama, and art exhibitions.",
      startDate: "2026-02-18",
      registrationCount: 300,
    },
    {
      city: "Lab Hall",
      title: "Tech Workshop",
      desc: "Hands-on coding, robotics, and tech sessions.",
      startDate: "2026-02-22",
      registrationCount: 90,
    },
    {
      city: "Art Studio",
      title: "Art & Painting",
      desc: "Showcase your creative skills in painting and crafts.",
      startDate: "2026-02-26",
      registrationCount: 60,
    },
    {
      city: "Dance Hall",
      title: "Dance Performance",
      desc: "Experience exciting dance performances by students.",
      startDate: "2026-03-01",
      registrationCount: 150,
    },
  ];

  useEffect(() => {
    if (embla && autoplay.current) autoplay.current.reset();
  }, [embla]);

  return (
    <div className="relative overflow-hidden rounded-xl max-w-5xl mx-auto">
      {/* Carousel */}
      <div className="overflow-hidden w-full" ref={emblaRef}>
        <div className="flex">
          {images.map((src, index) => (
            <div key={index} className="flex-none w-full relative">
              <Image
                src={src}
                alt={`event ${index + 1}`}
                width={2000}
                height={500}
                className="w-full h-72 md:h-80 object-cover rounded-xl"
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/70 to-black/20 rounded-xl z-10" />

              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white z-20">
                <Badge className="w-fit mb-2" variant="secondary">
                  {programs[index].city}
                </Badge>

                <h2 className="text-3xl md:text-5xl font-bold mb-2">
                  {programs[index].title}
                </h2>

                <p className="text-white/90 mb-4 line-clamp-2 text-sm md:text-base">
                  {programs[index].desc}
                </p>

                <div className="flex items-center gap-4 text-white/80 text-xs md:text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {format(new Date(programs[index].startDate), "PPP")}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{programs[index].city}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{programs[index].registrationCount} registered</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        className="absolute top-1/2 left-4 -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-full"
        onClick={() => embla?.scrollPrev()}
      >
        ‹
      </button>

      <button
        className="absolute top-1/2 right-4 -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-full"
        onClick={() => embla?.scrollNext()}
      >
        ›
      </button>

      {/* 👇 View All Button BELOW images */}
      {/* 👇 View All Button at bottom of image */}
     <div className="mt-6 flex justify-end">
  <Button
    onClick={handleViewLocalEvents}
    className="gap-2 bg-black text-white hover:bg-black/90 px-6 py-2 rounded-lg"
  >
    View All <ArrowRight className="w-4 h-4" />
  </Button>
</div>

    </div>
  );
}
