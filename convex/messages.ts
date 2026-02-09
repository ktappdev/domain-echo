import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get messages for a specific domain (last 50, max 30 minutes old)
export const getByDomain = query({
  args: { domain: v.string() },
  handler: async (ctx, args) => {
    const thirtyMinutesAgo = Date.now() - 30 * 60 * 1000;
    
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_domain_and_time", (q) => 
        q.eq("domain", args.domain).gte("createdAt", thirtyMinutesAgo)
      )
      .order("desc")
      .take(50);
    
    // Return in ascending order (oldest first)
    return messages.reverse();
  },
});

// Send a new message
export const send = mutation({
  args: {
    domain: v.string(),
    content: v.string(),
    username: v.string(),
  },
  handler: async (ctx, args) => {
    // Content validation
    if (args.content.length > 500) {
      throw new Error("Message too long. Maximum 500 characters.");
    }
    
    if (args.content.trim().length === 0) {
      throw new Error("Message cannot be empty.");
    }
    
    const messageId = await ctx.db.insert("messages", {
      domain: args.domain,
      content: args.content.trim(),
      username: args.username,
      createdAt: Date.now(),
    });
    
    return messageId;
  },
});

