import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";

interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  avatar_url: string | null;
  birth_date?: string | null;
  gender?: string | null;
  phone_mobile?: string | null;
  phone_landline?: string | null;
  street?: string | null;
  number?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  conversion_date?: string | null;
  baptism_date?: string | null;
  ministry?: string | null;
  member_status?: string | null;
  entry_date?: string | null;
  group_name?: string | null;
  role?: string | null;
}

export function useSupabaseUser() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let subscription: RealtimeChannel | null = null;

    const userColumns = `
      id, name, email, avatar_url, birth_date, gender, phone_mobile,
      phone_landline, street, number, neighborhood, city, conversion_date,
      baptism_date, ministry, member_status, entry_date, group_name, role
    `;

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
          .select(userColumns)
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
            async () => {
              if (isMounted) {
                // Refetch para garantir que os dados estejam atualizados
                const { data: freshData, error: freshError } = await supabase
                  .from("users")
                  .select(userColumns)
                  .eq("id", user.id)
                  .single();

                if (!freshError && freshData) {
                  setProfile(freshData);
                }
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
