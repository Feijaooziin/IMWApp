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
  userRole?: string; // "admin" ou outro
  onUpdated?: () => void; // callback para recarregar lista
}

export function VideoDetailsModal({
  visible,
  video,
  onClose,
  userRole,
  onUpdated,
}: Props) {
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const isAdmin = userRole === "admin";

  useEffect(() => {
    if (video) {
      setEditTitle(video.title || "");
      setEditDescription(video.description || "");
    }
  }, [video]);

  if (!video) return null;

  const handleWatch = () => {
    if (video.url) {
      Linking.openURL(video.url);
    }
  };

  const handleUpdate = async () => {
    if (!editTitle.trim()) {
      Alert.alert("Erro", "O título não pode estar vazio.");
      return;
    }
    const { error } = await supabase
      .from("videos")
      .update({
        title: editTitle.trim(),
        description: editDescription.trim(),
      })
      .eq("id", video.id);

    if (error) {
      Alert.alert("Erro", error.message);
    } else {
      Alert.alert("Sucesso", "Vídeo atualizado com sucesso!");
      onClose();
      onUpdated?.();
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir este vídeo?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase
              .from("videos")
              .delete()
              .eq("id", video.id);

            if (error) {
              Alert.alert("Erro", error.message);
            } else {
              Alert.alert("Sucesso", "Vídeo excluído!");
              onClose();
              onUpdated?.();
            }
          },
        },
      ]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1}>
              {isAdmin ? "Editar Vídeo" : video.title}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={32} color="#000" />
            </TouchableOpacity>
          </View>

          {video.thumbnail && (
            <Image source={{ uri: video.thumbnail }} style={styles.thumbnail} />
          )}

          {isAdmin ? (
            <>
              <Text style={styles.label}>Título</Text>
              <TextInput
                style={styles.input}
                value={editTitle}
                onChangeText={setEditTitle}
              />
              <Text style={styles.label}>Descrição</Text>
              <TextInput
                style={[styles.input, { height: 80 }]}
                value={editDescription}
                onChangeText={setEditDescription}
                multiline
              />
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#007bff" }]}
                onPress={handleUpdate}
              >
                <Text style={styles.buttonText}>Salvar Alterações</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#d31515" }]}
                onPress={handleDelete}
              >
                <Text style={styles.buttonText}>Excluir Vídeo</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.description}>{video.description}</Text>
              <TouchableOpacity
                style={styles.watchButton}
                onPress={handleWatch}
              >
                <Text style={styles.watchText}>Assistir</Text>
                <Ionicons name="play" size={20} color="#FFF" />
              </TouchableOpacity>
            </>
          )}
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
    paddingHorizontal: 20,
  },
  container: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    width: "100%",
    padding: 15,
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
  label: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    marginTop: 4,
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
  button: {
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
