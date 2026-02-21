"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function MePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchMe = async () => {
      const res = await api.get("/users/me");
      setUser(res.data);
    };

    fetchMe();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Current User</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}