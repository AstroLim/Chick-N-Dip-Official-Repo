"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getSession, getMyProfile } from "@/backend/utils/supabase/auth";
import { logout } from "@/backend/services/auth.service";
import { listAllInquiryThreadsAdmin } from "@/backend/services/inquiry.service";
import AdminSidebar from "@/app/components/AdminSidebar";

const ADMIN_ROLES = ["admin", "super_admin", "superadmin"];

function isAdmin(role) {
  if (!role || typeof role !== "string") return false;
  return ADMIN_ROLES.includes(String(role).toLowerCase().trim());
}

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inquiryCount, setInquiryCount] = useState(0);

  useEffect(() => {
    async function check() {
      try {
        const session = await getSession();
        if (!session) {
          router.replace("/user");
          return;
        }
        let prof = null;
        for (let attempt = 0; attempt < 3; attempt++) {
          try {
            if (attempt > 0) await new Promise((r) => setTimeout(r, 300));
            prof = await getMyProfile();
            if (prof) break;
          } catch {
            prof = null;
          }
        }
        const role = prof?.Role ?? prof?.role;
        if (!prof || !isAdmin(role)) {
          router.replace("/user");
          return;
        }
        setProfile(prof);

        try {
          const inquiries = await listAllInquiryThreadsAdmin();
          const open = (inquiries || []).filter((i) => i?.status === "open" || !i?.status);
          setInquiryCount(open.length);
        } catch {
          setInquiryCount(0);
        }
      } catch {
        router.replace("/user");
      } finally {
        setLoading(false);
      }
    }
    check();
  }, [router]);

  async function handleLogout() {
    try {
      await logout();
      router.replace("/user");
    } catch {
      router.replace("/user");
    }
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-body)",
          color: "var(--gray)",
        }}
      >
        Loading…
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar
        profile={profile}
        inquiryCount={inquiryCount}
        onLogout={handleLogout}
      />
      <div
        style={{
          marginLeft: "var(--sidebar-w)",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        {children}
      </div>
    </div>
  );
}
