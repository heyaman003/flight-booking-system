'use client'
import SSEListener from "@/components/SSEListner";
import { useAuth } from "@/contexts/AuthContext";

export default function SSEWrapper() {
  const { user } = useAuth();
  if (!user?.id) return null;
  return <SSEListener clientId={user.id} />;
}