import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";

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
  handler: async (ctx, args) => {
    // First, save the message to the database
    const messageId = await ctx.runMutation(api.messages.send, {
      domain: args.domain,
      content: args.content,
      username: args.username,
    });

    // Then, notify your external API (runs in parallel, doesn't block)
    await notifyMessageSent(ctx, args);

    return messageId;
  },
});

