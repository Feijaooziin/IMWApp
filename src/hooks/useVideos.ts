import { useEffect, useState } from "react";
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

    if (error) {
      setError(error.message);
    } else if (data) {
      setVideos(data);
    }

    setLoading(false);
  }

  return { videos, loading, error, refresh: fetchVideos };
}
