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

  useEffect(() => {
    fetchVideos();
  }, [category]);

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

    console.log("Supabase data:", data);
    console.log("Supabase error:", error);

    if (error) {
      setError(error.message);
      Alert.alert("Erro Supabase", error.message);
    } else if (!data || data.length === 0) {
      setVideos([]);
      Alert.alert("Nenhum vídeo", "A lista de vídeos está vazia.");
    } else {
      setVideos(data);
    }

    setLoading(false);
  }

  return { videos, loading, error, refresh: fetchVideos };
}
