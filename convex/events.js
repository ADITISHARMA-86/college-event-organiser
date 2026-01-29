import { v } from "convex/values";
import { query } from "./_generated/server";

export const getFeaturedEvents = query({
  args: {
    limit: v.optional(v.number()),
  },

  handler: async (ctx, args) => {
    const now = Date.now();
    const limit = args.limit ?? 3;

    const events = await ctx.db
      .query("events")
      .withIndex("by_startDate", (q) =>
        q.gte("startDate", now)
      )
      .order("desc")
      .take(limit);

    // Sort by registration count for featured
    const featured =events 
    .sort((a,b) => b.registeredCount - a.registeredCount)
    .slice(0,args.limit?? 3);
    return featured;
  },
});
//Get events by location(city/state)

export const getEventsByLocation =query({
  args: {
    city :v.string(),
    state : v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx,args) =>{
    const now= Date.now();

    let events = await ctx.db
      .query("events")
      .withIndex("by_startDate") 
        .filter( (q) => q.gte(q.field("startDate"), now) )
      .collect();
      //Filter by city or state

      if (args.city){
        events = events.filter(
          (e) => e.city.toLowerCase() === args.city.toLowerCase()
        );
      }else if(args.state){
        events = events.filter(
          (e) => e.city.toLowerCase() === args.state.toLowerCase()

        );
      }
      return events.slice(0,args.limit??4);
  },

});
// Get popular events (high registraion count)
export const getPopularEvents = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    let events = await ctx.db
      .query("events")
      .withIndex("by_startDate")
      .filter((q) => q.gte(q.field("startDate"), now))
      .collect();

    const popular = events
      .sort((a, b) => b.registeredCount - a.registeredCount)
      .slice(0, args.limit ?? 6);

    return popular;
  },
});

// Get popular events (high registraion count)
export const getEventsByCategory = query({
  args:{
    category:v.string(),
    limit:v.optional(v.number()),
 },
    handler: async (ctx,args) =>{
    const now= Date.now();

    let events = await ctx.db
      .query("events")
      .withIndex("by_category",(q) => q.eq("category",args.category)) 
      .filter( (q) => q.gte(q.field("startDate"), now) )
      .collect();
       

      return events.slice(0,args.limit ?? 12);
  },
});

export const getCategoryCounts =query({
   handler: async (ctx) =>{
    const now= Date.now();

    let events = await ctx.db
      .query("events")
      .withIndex("by_startDate") 
        .filter( (q) => q.gte(q.field("startDate"), now) )
      .collect();
      //Sort by registration count
      const counts = {};
      events.forEach((events) =>{
        counts[events.category] =(counts[events.category]||0)+1;
      });

      return counts;
  },
});