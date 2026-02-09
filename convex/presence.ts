import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get active users for a domain (within last 60 seconds)
export const getByDomain = query({
  args: { domain: v.string() },
  handler: async (ctx, args) => {
    const threshold = Date.now() - 60000; // 60 seconds ago
    
    const activeUsers = await ctx.db
      .query("presence")
      .withIndex("by_domain", (q) => q.eq("domain", args.domain))
      .filter((q) => q.gt(q.field("lastSeen"), threshold))
      .collect();
    
    return activeUsers;
  },
});

// Update or create presence for a session
export const update = mutation({
  args: {
    domain: v.string(),
    username: v.string(),
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    // Find existing presence by sessionId
    const existing = await ctx.db
      .query("presence")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .first();
    
    if (existing) {
      // Update existing presence
      await ctx.db.patch(existing._id, {
	    // If the popup is reopened or the user navigates to a different domain,
	    // keep a single presence record per session by updating these fields.
	    domain: args.domain,
	    username: args.username,
	    lastSeen: Date.now(),
      });
      return existing._id;
    } else {
      // Create new presence
      const presenceId = await ctx.db.insert("presence", {
        domain: args.domain,
        username: args.username,
        sessionId: args.sessionId,
        lastSeen: Date.now(),
      });
      return presenceId;
    }
  },
});

// Remove presence when user leaves
export const remove = mutation({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    const presence = await ctx.db
      .query("presence")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .first();
    
    if (presence) {
      await ctx.db.delete(presence._id);
    }
  },
});

// Cleanup stale presence records (older than 60 seconds)
export const cleanupStale = mutation({
  args: {},
  handler: async (ctx) => {
    const threshold = Date.now() - 60000;
    
    const stalePresence = await ctx.db
      .query("presence")
      .withIndex("by_last_seen")
      .filter((q) => q.lt(q.field("lastSeen"), threshold))
      .collect();
    
    for (const presence of stalePresence) {
      await ctx.db.delete(presence._id);
    }
    
    return stalePresence.length;
  },
});

