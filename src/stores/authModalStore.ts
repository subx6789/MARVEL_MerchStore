"use client";

import { create } from "zustand";

export type AuthModalView = "login" | "register" | "forgot";

interface AuthModalStore {
  isOpen: boolean;
  view: AuthModalView;
  openModal: (view?: AuthModalView) => void;
  closeModal: () => void;
  setView: (view: AuthModalView) => void;
}

export const useAuthModalStore = create<AuthModalStore>((set) => ({
  isOpen: false,
  view: "login",
  openModal: (view = "login") => set({ isOpen: true, view }),
  closeModal: () => set({ isOpen: false }),
  setView: (view) => set({ view }),
}));
