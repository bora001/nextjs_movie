import { fetchUserInfo } from "@/lib/api/auth/authApi";
import { create } from "zustand";
import { PersistStorage } from "zustand/middleware";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  fetchUser: () => Promise<void>;
  setUser: (user: User | null) => void;
}
const sessionStorageWrapper: PersistStorage<AuthState> = {
  getItem: (name) => {
    const item = sessionStorage.getItem(name);
    return item ? Promise.resolve(JSON.parse(item)) : Promise.resolve(null);
  },
  setItem: (name, value) => {
    return Promise.resolve(sessionStorage.setItem(name, JSON.stringify(value)));
  },
  removeItem: (name) => {
    return Promise.resolve(sessionStorage.removeItem(name));
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      fetchUser: async () => {
        try {
          const response = await fetchUserInfo();
          if (response.success && response.data) {
            set({ user: response.data.user });
          } else {
            set({ user: null });
          }
        } catch {
          set({ user: null });
        }
      },
    }),
    {
      name: "nextjs-movie-auth",
      storage: sessionStorageWrapper,
    }
  )
);
