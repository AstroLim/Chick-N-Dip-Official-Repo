"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import LoginModal from "@/app/components/LoginModal";
import RegisterModal from "@/app/components/RegisterModal";
import { getSession, getMyProfile } from "@/backend/utils/supabase/auth";
import { logout } from "@/backend/services/auth.service";

const ADMIN_ROLES = ["admin", "super_admin", "superadmin"];

function isAdmin(role) {
  if (!role || typeof role !== "string") return false;
  return ADMIN_ROLES.includes(role.toLowerCase());
}

export default function UserLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const [sess, prof] = await Promise.all([getSession(), getMyProfile()]);
        setSession(sess);
        setProfile(prof);
      } catch {
        setSession(null);
        setProfile(null);
      }
    }
    load();
  }, [refreshKey, pathname]);

  async function handleLogout() {
    try {
      await logout();
      setRefreshKey((k) => k + 1);
      router.refresh();
    } catch {
      router.refresh();
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <NavBar
        activePath={pathname}
        session={session}
        profile={profile}
        onLoginClick={() => {
          setRegisterOpen(false);
          setLoginOpen(true);
        }}
        onSignupClick={() => {
          setLoginOpen(false);
          setRegisterOpen(true);
        }}
        onLogout={handleLogout}
      />
      <main key={refreshKey} style={{ flex: 1 }}>{children}</main>
      <Footer />

      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSuccess={() => {
          setRefreshKey((k) => k + 1);
          router.refresh();
        }}
        onSwitchToRegister={() => {
          setLoginOpen(false);
          setRegisterOpen(true);
        }}
      />
      <RegisterModal
        isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onSwitchToLogin={() => {
          setRegisterOpen(false);
          setLoginOpen(true);
        }}
      />
    </div>
  );
}
