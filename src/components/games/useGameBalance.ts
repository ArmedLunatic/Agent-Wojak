"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "wojak-game-balance";
const DEFAULT_BALANCE = 1000;

export function useGameBalance() {
  const [balance, setBalance] = useState(DEFAULT_BALANCE);

  // Sync from localStorage on mount (SSR-safe)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        const parsed = parseInt(stored, 10);
        if (!isNaN(parsed)) {
          setBalance(parsed);
        }
      }
    }
  }, []);

  // Persist to localStorage whenever balance changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, String(balance));
    }
  }, [balance]);

  const addBalance = useCallback((amount: number) => {
    setBalance((prev) => prev + amount);
  }, []);

  const subtractBalance = useCallback((amount: number) => {
    setBalance((prev) => Math.max(0, prev - amount));
  }, []);

  const resetBalance = useCallback(() => {
    setBalance(DEFAULT_BALANCE);
  }, []);

  return { balance, addBalance, subtractBalance, resetBalance };
}
