import { v } from "convex/values";
import { anyApi } from "convex/server";
import { action } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

const api = anyApi;

// NOTE: This module was an experiment to send a webhook when a message is sent.
// Currently nothing in the app calls these actions (the extension uses messages.send directly).
// If webhook notifications are desired, consider triggering the fetch inside messages.send
// (or via a scheduled action) to keep things type-safe and avoid self-references.

// Action to notify external API when a message is sent
export const notifyMessageSent = action({
  args: {
    domain: v.string(),
    content: v.string(),
    username: v.string(),
  },
  handler: async (ctx, args) => {
    // Call your external API here
    try {
      const response = await fetch("https://your-api.com/webhook/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add any auth headers you need
          // "Authorization": "Bearer YOUR_API_KEY",
        },
        body: JSON.stringify({
          domain: args.domain,
          content: args.content,
          username: args.username,
          timestamp: Date.now(),
        }),
      });

      if (!response.ok) {
        console.error("API call failed:", response.status, response.statusText);
      }

      return { success: response.ok };
    } catch (error) {
      console.error("Error calling external API:", error);
      // Don't throw - we don't want to fail the message send if the API call fails
      return { success: false, error: String(error) };
    }
  },
});

// Combined action that sends message AND calls external API
export const sendMessageWithNotification = action({
  args: {
    domain: v.string(),
    content: v.string(),
    username: v.string(),
  },
  returns: v.id("messages"),
  handler: async (ctx, args): Promise<Id<"messages">> => {
    // First, save the message to the database
    const messageId: Id<"messages"> = await ctx.runMutation(api.messages.send, {
      domain: args.domain,
      content: args.content,
      username: args.username,
    });

    // Then, notify your external API
    await ctx.runAction(api.actions.notifyMessageSent, {
      domain: args.domain,
      content: args.content,
      username: args.username,
    });

    return messageId;
  },
});

