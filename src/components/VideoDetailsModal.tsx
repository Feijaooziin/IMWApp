import { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";

interface VideoItem {
  id: string;
  title: string;
  description?: string;
  url: string;
  thumbnail?: string;
}

interface Props {
  visible: boolean;
  video: VideoItem | null;
  onClose: () => void;
}

export function VideoDetailsModal({ visible, video, onClose }: Props) {
  if (!video) return null;

  const handleWatch = () => {
    if (video.url) {
      Linking.openURL(video.url);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={2}>
              {video.title}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={32} color="#000" />
            </TouchableOpacity>
          </View>

          {video.thumbnail && (
            <Image source={{ uri: video.thumbnail }} style={styles.thumbnail} />
          )}

          <Text style={styles.description}>{video.description}</Text>
          <TouchableOpacity style={styles.watchButton} onPress={handleWatch}>
            <Text style={styles.watchText}>Assistir</Text>
            <Ionicons name="play" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    width: "100%",
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  title: {
    color: "#444",
    fontSize: 24,
    flex: 1,
    marginRight: 10,
    fontWeight: "800",
  },
  thumbnail: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginVertical: 10,
  },
  description: {
    fontSize: 18,
    color: "#555",
    marginBottom: 20,
    fontWeight: "500",
  },
  watchButton: {
    backgroundColor: "#d31515",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 6,
    gap: 12,
  },
  watchText: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "900",
  },
});
