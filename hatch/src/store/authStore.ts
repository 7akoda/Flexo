import { create } from "zustand";

type AuthState = {
	auth: string | null;
	setAuth: (name: string | null) => void;
};

export const useAuth = create<AuthState>((set) => ({
	auth: null,
	setAuth: (name) => set({ auth: name }),
}));
