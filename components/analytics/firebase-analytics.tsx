"use client";

import { useEffect } from "react";
import { getFirebaseApp } from "@/lib/firebase/client";

/**
 * Client-only Firebase Analytics initializer.
 * - Runs only in the browser (Analytics requires `window`)
 * - Skips silently if config env vars are missing or not supported
 * - Safe to render alongside @vercel/analytics
 */
export function FirebaseAnalytics() {
  useEffect(() => {
    let mounted = true;

    (async () => {
      const app = getFirebaseApp();
      if (!app) return;

      try {
        const { isSupported, getAnalytics } = await import("firebase/analytics");
        const supported = await isSupported();
        if (!supported || !mounted) return;
        getAnalytics(app);
      } catch (err) {
        console.warn("[FirebaseAnalytics] init failed:", err);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return null;
}
