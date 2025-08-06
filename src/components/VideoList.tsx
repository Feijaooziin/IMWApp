import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { VideoDetailsModal } from "./VideoDetailsModal";

interface VideoItem {
  id: string;
  title: string;
  description?: string;
  url: string;
  thumbnail?: string;
}

interface Props {
  data: VideoItem[];
  loading: boolean;
}

export function VideoList({ data, loading }: Props) {
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => setSelectedVideo(item)}
          >
            {item.thumbnail && (
              <Image
                source={{ uri: item.thumbnail }}
                style={styles.thumbnail}
              />
            )}
            <Text style={styles.title}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />

      <VideoDetailsModal
        visible={!!selectedVideo}
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
  },
  thumbnail: {
    width: "100%",
    height: 200,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    padding: 10,
  },
});
