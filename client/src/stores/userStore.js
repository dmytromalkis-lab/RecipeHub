import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import api from "../api/axios.js";

const useUserStore = create(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,

        setUser: (user) => {
          set({ user });
        },
        setToken: (token) => {
          set({ token, isAuthenticated: !!token });
        },
        setLoading: (loading) => set({ loading }),
        setError: (error) => set({ error }),

        logout: () => {
          set({
            user: null,
            token: null,
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

            set({
              token: data.token,
              user: data.user ?? null,
              isAuthenticated: !!data.token,
              loading: false,
              error: null,
            });
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
        register: async (formData) => {
          set({ loading: true, error: null });
          try {
            const res = await api.post("/auth/register", formData);
            const data = res.data;

            set({
              token: data.token,
              user: data.user ?? null,
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
      }),
      {
        name: "user-storage",
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    )
  )
);

export default useUserStore;