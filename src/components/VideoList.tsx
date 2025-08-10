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
        showsVerticalScrollIndicator={false}
        data={data}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={() => (
          <View style={{ padding: 20, alignItems: "center" }}>
            <Text style={{ fontSize: 18, fontWeight: "600", color: "#777" }}>
              Lista Vazia.
            </Text>
          </View>
        )}
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
            <View style={styles.infoContainer}>
              <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
                {item.title}
              </Text>
              <Text
                style={styles.description}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {item.description}
              </Text>
            </View>
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
    elevation: 2,
    flexDirection: "row",
    marginVertical: 6,
    overflow: "hidden",
  },
  thumbnail: {
    width: "40%",
    height: 80,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  infoContainer: {
    width: "60%",
    padding: 10,
    justifyContent: "center",
    borderLeftWidth: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#222",
  },
  description: {
    fontSize: 14,
    color: "#555",
  },
});
