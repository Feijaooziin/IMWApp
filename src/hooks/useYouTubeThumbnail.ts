import { useState, useEffect } from "react";

export function useYouTubeThumbnail(
  url: string,
  quality: "default" | "mq" | "hq" | "max" = "hq"
) {
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  useEffect(() => {
    if (!url) {
      setThumbnail(null);
      return;
    }

    const regex = /(?:v=|\/)([0-9A-Za-z_-]{11})(?:\?|&|$)/;
    const match = url.match(regex);

    if (!match || !match[1]) {
      setThumbnail(null);
      return;
    }

    const videoId = match[1];
    let thumbUrl: string;

    switch (quality) {
      case "mq":
        thumbUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
        break;
      case "hq":
        thumbUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        break;
      case "max":
        thumbUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        break;
      default:
        thumbUrl = `https://img.youtube.com/vi/${videoId}/0.jpg`;
    }

    setThumbnail(thumbUrl);
  }, [url, quality]);

  return thumbnail;
}
