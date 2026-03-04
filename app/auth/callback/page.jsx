"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/backend/utils/supabase/client";
import { applyPendingProfileIfAny } from "@/backend/services/auth.service";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState("Signing you in...");

  useEffect(() => {
    async function run() {
      const { data } = await supabase.auth.getSession();

      if (data?.session) {
        await applyPendingProfileIfAny();
        router.replace("/");
      } else {
        setStatus("No session found. Please login.");
        router.replace("/login");
      }
    }
    run();
  }, [router]);

  return (
    <main style={{ padding: 24 }}>
      <h1>{status}</h1>
    </main>
  );
}