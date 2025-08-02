import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";

interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  avatar_url: string | null;
}

export function useSupabaseUser() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let subscription: RealtimeChannel | null = null;

    async function fetchUserProfile() {
      try {
        setLoading(true);

        // 1️⃣ Pega usuário logado
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (userError) throw userError;

        if (!user || !isMounted) return;

        // 2️⃣ Busca dados da tabela users
        const { data, error } = await supabase
          .from("users")
          .select("id, name, email, avatar_url")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        if (isMounted) setProfile(data);

        // 3️⃣ Escuta alterações em tempo real
        subscription = supabase
          .channel("user-profile")
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "users",
              filter: `id=eq.${user.id}`,
            },
            (payload) => {
              if (isMounted) {
                setProfile(payload.new as UserProfile);
              }
            }
          )
          .subscribe();
      } catch (err: any) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchUserProfile();

    return () => {
      isMounted = false;
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, []);

  return { profile, loading, error };
}
