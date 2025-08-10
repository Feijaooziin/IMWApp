import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { supabase } from "@/lib/supabase";

interface Video {
  id: string;
  title: string;
  description?: string;
  url: string;
  thumbnail?: string;
  category: string;
  created_at: string;
}

export function useVideos(category?: string) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchVideos() {
    setLoading(true);
    setError(null);

    let query = supabase.from("videos").select("*");

    if (category) {
      query = query.eq("category", category);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      setError(error.message);
      Alert.alert("Erro Supabase", error.message);
    } else {
      setVideos(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchVideos();

    // Escuta mudanças no Supabase em tempo real
    const channel = supabase
      .channel("videos-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "videos" },
        () => {
          fetchVideos(); // recarrega a lista quando houver alteração
        }
      )
      .subscribe();

    // Cleanup ao desmontar
    return () => {
      supabase.removeChannel(channel);
    };
  }, [category]);

  return { videos, loading, error, refresh: fetchVideos };
}
