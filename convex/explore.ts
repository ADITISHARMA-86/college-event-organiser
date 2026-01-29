import { v } from "convex/values";
import { query } from "./_generated/server";

export const getPopularEvents = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const now = Date.now();
    const limit = args.limit ?? 3;

    const events = await ctx.db
      .query("events")
      .withIndex("by_start_date", (q) => q.gte("startDate", now))
      .collect();

    return events
      .sort((a, b) => (b.registrationCount ?? 0) - (a.registrationCount ?? 0))
      .slice(0, limit);
  },
});

export const getCategoryCounts = query(async (ctx) => {
  const events = await ctx.db.query("events").collect();
  const counts: Record<string, number> = {};
  events.forEach((e) => {
    counts[e.category] = (counts[e.category] ?? 0) + 1;
  });
  return counts;
});

export const getFeaturedEvents = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 3;
    const events = await ctx.db.query("events").collect();
    return events.slice(0, limit);
  },
});


