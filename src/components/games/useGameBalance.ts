"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const STORAGE_KEY = "wojak-game-balance";
const DEFAULT_BALANCE = 1000;
const SYNC_EVENT = "wojak-balance-sync";

export function useGameBalance() {
  const [balance, setBalance] = useState(DEFAULT_BALANCE);
  const initialized = useRef(false);

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
      initialized.current = true;
    }
  }, []);

  // Persist to localStorage whenever balance changes (skip initial render)
  useEffect(() => {
    if (initialized.current && typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, String(balance));
      // Notify other hook instances on the same page
      window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: balance }));
    }
  }, [balance]);

  // Listen for sync events from other hook instances
  useEffect(() => {
    function handleSync(e: Event) {
      const value = (e as CustomEvent).detail;
      if (typeof value === "number") {
        setBalance(value);
      }
    }
    window.addEventListener(SYNC_EVENT, handleSync);
    return () => window.removeEventListener(SYNC_EVENT, handleSync);
  }, []);

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
