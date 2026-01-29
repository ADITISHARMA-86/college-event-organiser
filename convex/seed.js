import { internalMutation } from "./_generated/server";

// Use the same SAMPLE_EVENTS array but we will override city/state/venue
const SAMPLE_EVENTS = [
  {
    title: "React 19 Workshop: Master the New Features",
    description: `Join us for an intensive hands-on workshop diving deep into React 19's revolutionary features!`,
    category: "tech",
    tags: ["tech", "react", "javascript", "frontend"],
    venue: "College Tech Lab",
    address: "Main Campus, Sultanpur",
    capacity: 50,
    ticketType: "free",
    coverImage:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&q=80",
    themeColor: "#4c1d95",
  },
  {
    title: "Cultural Fest 2026",
    description: `Music, dance, and art from our students.`,
    category: "culture",
    tags: ["music", "dance", "art"],
    venue: "College Auditorium",
    address: "Main Campus, Sultanpur",
    capacity: 120,
    ticketType: "free",
    coverImage:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&q=80",
    themeColor: "#831843",
  },
  {
    title: "Annual Sports Meet 2026",
    description: `Compete in athletics and team sports at our college.`,
    category: "sports",
    tags: ["sports", "athletics", "competition"],
    venue: "College Sports Ground",
    address: "Main Campus, Sultanpur",
    capacity: 150,
    ticketType: "free",
    coverImage:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80",
    themeColor: "#065f46",
  },
];

// Helper functions (keep your random date & slug logic)
function getRandomFutureDate(minDays = 7, maxDays = 90) {
  const now = Date.now();
  const randomDays = Math.floor(Math.random() * (maxDays - minDays) + minDays);
  return now + randomDays * 24 * 60 * 60 * 1000;
}

function getEventEndTime(startTime) {
  const durationHours = Math.floor(Math.random() * 3) + 2;
  return startTime + durationHours * 60 * 60 * 1000;
}

function generateSlug(title) {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") +
    `-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
  );
}

// Main seed function
export const run = internalMutation({
  handler: async (ctx) => {
    // Get or create college organizer
    let organizer = await ctx.db.query("users").first();
    if (!organizer) {
      const organizerId = await ctx.db.insert("users", {
        email: "organizer@sultanpurcollege.edu",
        tokenIdentifier: "seed-user-token",
        name: "Sultanpur College Event Team",
        hasCompletedOnboarding: true,
        location: {
          city: "Sultanpur",
          state: "Uttar Pradesh",
          country: "India",
        },
        interests: ["tech", "culture", "sports"],
        freeEventsCreated: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      organizer = await ctx.db.get(organizerId);
    }

    const createdEvents = [];

    for (const eventData of SAMPLE_EVENTS) {
      const startDate = getRandomFutureDate();
      const endDate = getEventEndTime(startDate);
      const registrationCount = Math.floor(
        Math.random() * eventData.capacity * 0.7
      );

      const event = {
        ...eventData,
        slug: generateSlug(eventData.title),
        organizerId: organizer._id,
        organizerName: organizer.name,
        startDate,
        endDate,
        timezone: "Asia/Kolkata",
        locationType: "physical",
        city: "Sultanpur",
        state: "Uttar Pradesh",
        country: "India",
        registrationCount,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await ctx.db.insert("events", event);
      createdEvents.push(eventData.title);
    }

    console.log(`✅ Successfully seeded ${createdEvents.length} Sultanpur events!`);
    return {
      success: true,
      count: createdEvents.length,
      events: createdEvents,
    };
  },
});

// Optional: Clear all events (same as your clear function)
export const clear = internalMutation({
  handler: async (ctx) => {
    const events = await ctx.db.query("events").collect();
    let count = 0;

    for (const event of events) {
      const regs = await ctx.db
        .query("registrations")
        .withIndex("by_event", (q) => q.eq("eventId", event._id))
        .collect();

      for (const reg of regs) {
        await ctx.db.delete(reg._id);
      }

      await ctx.db.delete(event._id);
      count++;
    }

    console.log(`🗑️ Cleared ${count} events`);
    return { success: true, deleted: count };
  },
});
