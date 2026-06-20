import { create } from "zustand";
import { getMyProfile } from "@/services/userApi";

interface User {
  userId: number;
  name: string;
  imageUrl: string;
  role: string;
}

interface UserStore {
  user: User | null;
  fetchUser: () => Promise<void>;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,

  fetchUser: async () => {
    const profile = await getMyProfile();
    set({ user: profile });
  },

  clearUser: () => set({ user: null }),
}));
