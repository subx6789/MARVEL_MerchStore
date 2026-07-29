"use client";

// ─────────────────────────────────────────────────────────
// Marvel Event Bookings & Attendees Store
// Manages ticket passes, QR tokens, gate check-in & revenue
// ─────────────────────────────────────────────────────────
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface EventBooking {
  id: string;
  eventId: string;
  eventName: string;
  attendeeName: string;
  email: string;
  phone?: string;
  tier: "VIP Pass" | "General Pass" | "Comic Con Exclusive";
  seatsCount: number;
  totalPaid: number;
  qrCodeToken: string;
  status: "confirmed" | "checked_in" | "cancelled";
  bookedAt: string;
}

interface EventStore {
  bookings: EventBooking[];
  addBooking: (booking: Omit<EventBooking, "id" | "bookedAt" | "qrCodeToken" | "status"> & { qrCodeToken?: string }) => EventBooking;
  checkInAttendee: (bookingId: string) => boolean;
  cancelBooking: (bookingId: string) => void;
  getBookingsForEvent: (eventId: string) => EventBooking[];
  getTotalRevenue: (eventId?: string) => number;
}

export const useEventStore = create<EventStore>()(
  persist(
    (set, get) => ({
      bookings: [],

      addBooking: (bookingData) => {
        const id = `bk_${Date.now()}`;
        const qrCodeToken =
          bookingData.qrCodeToken ||
          `${bookingData.eventName.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

        const newBooking: EventBooking = {
          ...bookingData,
          id,
          qrCodeToken,
          status: "confirmed",
          bookedAt: new Date().toISOString(),
        };

        set((state) => ({
          bookings: [newBooking, ...state.bookings],
        }));

        return newBooking;
      },

      checkInAttendee: (bookingId) => {
        let success = false;
        set((state) => {
          const updated = state.bookings.map((b) => {
            if (b.id === bookingId || b.qrCodeToken === bookingId) {
              success = true;
              return { ...b, status: "checked_in" as const };
            }
            return b;
          });
          return { bookings: updated };
        });
        return success;
      },

      cancelBooking: (bookingId) =>
        set((state) => ({
          bookings: state.bookings.filter((b) => b.id !== bookingId),
        })),

      getBookingsForEvent: (eventId) => {
        return get().bookings.filter((b) => b.eventId === eventId);
      },

      getTotalRevenue: (eventId) => {
        const list = eventId ? get().bookings.filter((b) => b.eventId === eventId) : get().bookings;
        return list.reduce((sum, b) => (b.status !== "cancelled" ? sum + b.totalPaid : sum), 0);
      },
    }),
    {
      name: "marvel_event_bookings_store",
    }
  )
);
