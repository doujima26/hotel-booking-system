"use client";

import GuestHome from "../components/GuestHome";
import UserHome from "../components/UserHome";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user?.role === "user") {
    return <UserHome />;
  }

  return <GuestHome />;
}