import { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";

interface Video {
  id: string;
  title: string;
  description?: string;
}

interface Props {
  visible: boolean;
  video: Video | null;
  onClose: () => void;
}

export function EditVideoModal({ visible, video, onClose }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (video) {
      setTitle(video.title);
      setDescription(video.description || "");
    }
  }, [video]);

  async function handleUpdate() {
    if (!video) return;
    if (!title.trim()) {
      Alert.alert("Erro", "O título não pode estar vazio.");
      return;
    }
    const { error } = await supabase
      .from("videos")
      .update({ title: title.trim(), description: description.trim() })
      .eq("id", video.id);

    if (error) {
      Alert.alert("Erro", error.message);
    } else {
      Alert.alert("Sucesso", "Vídeo atualizado com sucesso!");
      onClose();
    }
  }

  async function handleDelete() {
    if (!video) return;
    Alert.alert("Confirmar exclusão", "Tem certeza que deseja excluir?", [
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
          }
        },
      },
    ]);
  }

  if (!video) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Editar Vídeo</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="#000" />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Título</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, { height: 80 }]}
            value={description}
            onChangeText={setDescription}
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
    marginBottom: 12,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 6,
    padding: 10,
    marginTop: 4,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
