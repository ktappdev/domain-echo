import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    domain: v.string(),
    content: v.string(),
    username: v.string(),
    createdAt: v.number(), // Unix timestamp in milliseconds
  })
    .index("by_domain", ["domain"])
    .index("by_domain_and_time", ["domain", "createdAt"]),

  presence: defineTable({
    domain: v.string(),
    username: v.string(),
    sessionId: v.string(),
    lastSeen: v.number(), // Unix timestamp in milliseconds
  })
    .index("by_domain", ["domain"])
    .index("by_session", ["sessionId"])
    .index("by_last_seen", ["lastSeen"]),
});

