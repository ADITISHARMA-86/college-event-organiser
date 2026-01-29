"use client";
import EventCarousel from "@/components/event-carousel";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Users, ArrowRight, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { createLocationSlug } from "@/lib/location-utils";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CATEGORIES } from "@/lib/data";
import Autoplay from "embla-carousel-autoplay";
import EventCard from "@/components/event-card";


export default function ExplorePage() {
  const router = useRouter();

  // Autoplay plugin
  const autoplay = useRef(
    Autoplay({
      delay: 3000,
      stopOnInteraction: true,
    })
  );

  // Fetch current user
  const { data: currentUser } = useConvexQuery(api.users.getCurrentUser);

  // Fetch events
  const featuredEventsRaw = useConvexQuery(
  api.explore.getFeaturedEvents,
  { limit: 3 }
);

const featuredEvents = Array.isArray(featuredEventsRaw)
  ? featuredEventsRaw
  : [];

  const localEventsRaw = useConvexQuery(
  api.explore.getEventsByLocation,
  currentUser
    ? {
        city: currentUser.location?.city ?? "Sultanpur",
        state: currentUser.location?.state ?? "Uttar Pradesh",
        limit: 4,
      }
    : "skip"
);

const localEvents = Array.isArray(localEventsRaw)
  ? localEventsRaw
  : [];

  const popularEventsRaw = useConvexQuery(
  api.explore.getPopularEvents,
  { limit: 6 }
);

const popularEvents = Array.isArray(popularEventsRaw)
  ? popularEventsRaw
  : [];

  const categoryCounts = useConvexQuery(api.explore.getCategoryCounts);

  const handleEventClick = (slug) => slug && router.push(`/events/${slug}`);
  const handleCategoryClick = (categoryId) => categoryId && router.push(`/explore/${categoryId}`);
  const handleViewLocalEvents = () => {
    const city = currentUser?.location?.city || "Sultanpur";
    const state = currentUser?.location?.state || "Uttar Pradesh";
    const slug = createLocationSlug(city, state);
    router.push(`/explore/${slug}`);
  };

  const categoriesWithCounts = CATEGORIES.map((cat) => ({
    ...cat,
    count: categoryCounts?.[cat.id] || 0,
  }));

  const isLoading =
  !featuredEventsRaw ||
  !localEventsRaw ||
  !popularEventsRaw;


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 lg:px-16">
      {/* Hero */}
      <div className="pb-12 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">Discover Events</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Explore featured events, find what&apos;s happening locally, or browse events across India
        </p>
      </div>
      <section className="max-w-7xl mx-auto px-4 mb-20">
      <EventCarousel />
       </section>

      {/* Featured Carousel */}
      {featuredEvents?.length > 0 && (
        <div className="mb-16">
          <Carousel
            plugins={[autoplay.current]}
            className="w-full"
            onMouseEnter={() => autoplay.current.stop()}
            onMouseLeave={() => autoplay.current.play()}
          >
            <CarouselContent>
              {featuredEvents.map((event) => (
                <CarouselItem key={event._id} className="basis-full">

                  <div
                    className="relative aspect-video rounded-xl overflow-hidden cursor-pointer"
                    onClick={() => handleEventClick(event.slug)}
                  >
                    {event.coverImage ? (
                      <Image
                        src={event.coverImage}
                        alt={event.title}
                        fill
                        className="object-cover"
                        priority
                      />
                    ) : (
                      <div
                        className="absolute inset-0"
                        style={{ backgroundColor: event.themeColor || "#333" }}
                      />
                    )}
                    <div className="absolute inset-0 bg-linear-to-r from-black/60 to-black/30" />
                    <div className="relative h-full flex flex-col justify-end p-6 md:p-12">
                      <Badge className="w-fit mb-2" variant="secondary">
                        {event.city}, {event.state || event.country}
                      </Badge>
                      <h2 className="text-3xl md:text-5xl font-bold mb-2 text-white">
                        {event.title}
                      </h2>
                      <p className="text-white/90 mb-4 line-clamp-2 text-sm md:text-base">
                        {event.description}
                      </p>
                      <div className="flex items-center gap-4 text-white/80 text-xs md:text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{format(new Date(event.startDate), "PPP")}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{event.city}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{event.registrationCount || 0} registered</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>
      )}

      {/* Local Events */}
      {localEvents?.length > 0 && (
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-1">Events Near You</h2>
              <p className="text-muted-foreground">
                Happening in {currentUser?.location?.city || "your area"}
              </p>
            </div>
            <Button variant="outline" className="gap-2" onClick={handleViewLocalEvents}>
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
           {localEvents?.map((event) =>
               event ? (
               <EventCard
              key={event._id}
              event={event}
              variant="grid"
              onClick={() => handleEventClick(event.slug)}
             />
             ) : null
             )}

          </div>
        </div>
      )}

      {/* Categories */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-6">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categoriesWithCounts.map((cat) => (
            <Card
              key={cat.id}
              className="bg-linear-to-br from-gray-900 to-gray-800 text-white py-2 cursor-pointer 
           rounded-lg hover:from-gray-800 hover:to-gray-700 hover:shadow-md 
           hover:border-purple-500/50 transition-all"
              onClick={() => handleCategoryClick(cat.id)}
            >
              <CardContent className="px-3 sm:p-6 flex items-center gap-3">
                <div className="text-3xl sm:text-4xl">{cat.icon}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold mb-1">{cat.label}</h3>
                  <p className="text-sm text-muted-foreground">
                    {cat.count} Event{cat.count !== 1 ? "s" : ""}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Popular Events */}
      {popularEvents?.length > 0 && (
        <div className="mb-16">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-1">Popular Across India</h2>
            <p className="text-muted-foreground">Trending events nationwide</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                variant="list"
                onClick={() => handleEventClick(event.slug)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {(!featuredEvents?.length &&
        !localEvents?.length &&
        !popularEvents?.length) && (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto space-y-4">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold">No events yet</h2>
            <p className="text-muted-foreground">
              Be the first to create an event in your area!
            </p>
            <Button asChild className="gap-2">
              <a href="/create-event">Create Event</a>
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
