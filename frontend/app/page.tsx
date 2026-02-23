"use client";

import GuestHome from "../components/GuestHome";
import UserHome from "./user/UserHome";
import AdminHome from "./admin/AdminHome";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user?.role === "admin") {
    return <AdminHome />;
  }

  if (user?.role === "user") {
    return <UserHome />;
  }

  return <GuestHome />;
}