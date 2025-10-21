import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import api from "../api/axios.js";

const useUserStore = create(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        token: null,
        role: null,
        isAuthenticated: false,
        loading: false,
        error: null,

        setUser: (user) => {
          set({ user });
        },
        setToken: (token) => {
          set({ token, isAuthenticated: !!token });
        },
        setRole: (role) => {
          set({ role });
        },
        setLoading: (loading) => set({ loading }),
        setError: (error) => set({ error }),

        logout: () => {
          set({
            user: null,
            token: null,
            role: null,
            isAuthenticated: false,
            loading: false,
            error: null,
          });
        },

        login: async (formData) => {
          set({ loading: true, error: null });
          try {
            const res = await api.post("/auth/login", formData);
            const data = res.data;

            if (data.role === "admin") {
              set({
                token: data.token,
                user: null, 
                role: data.role,
                isAuthenticated: !!data.token,
                loading: false,
                error: null,
              });
            } else {
              set({
                token: data.token,
                user: data.user ?? null,
                role: data.user?.role ?? "user",
                isAuthenticated: !!data.token,
                loading: false,
                error: null,
              });
            }
            return data;
          } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || "Login failed";
            set({
              error: errorMessage,
              loading: false,
            });
            throw err;
          }
        },
        loginWithGoogle: () => {
          set({ loading: true, error: null });
          window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/auth/google`;
        },
        register: async (formData) => {
          set({ loading: true, error: null });
          try {
            const res = await api.post("/auth/register", formData);
            const data = res.data;

            set({
              token: data.token,
              user: data.user ?? null,
              role: data.user?.role ?? "user",
              isAuthenticated: !!data.token,
              loading: false,
              error: null,
            });
            return data;
          } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || "Register failed";
            set({
              error: errorMessage,
              loading: false,
            });
            throw err;
          }
        },

        isAdmin: () => {
          const state = get();
          return state.role === "admin";
        },
        isUser: () => {
          const state = get();
          return state.user?.role === "user";
        },
        hasRole: (role) => {
          const state = get();
          return state.role === role;
        },
      }),
      {
        name: "user-storage",
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          role: state.role,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    )
  )
);

export default useUserStore;