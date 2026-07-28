import { createClient } from "./client";

/**
 * Broadcasts a live platform event via Supabase Realtime Channels
 */
export async function broadcastRealtimeEvent(
  event: "product_created" | "drop_scheduled" | "stock_updated",
  payload: any
) {
  try {
    const supabase = createClient();
    const channel = supabase.channel("marvel_merch_realtime_broadcast");
    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        channel.send({
          type: "broadcast",
          event: event,
          payload: payload,
        });
      }
    });
  } catch (err) {
    console.error("[Realtime Broadcast Error]", err);
  }
}
