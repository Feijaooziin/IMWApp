import { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { supabase } from "@/lib/supabase";
import { EditVideoModal } from "@/components/EditVideoModal";
import { DrawerSceneWrapper } from "@/components/drawer-Scene-wrapper";
import { Header } from "@/components/Header";

interface Video {
  id: string;
  title: string;
  description?: string;
  url: string;
  thumbnail?: string;
  category: string;
  created_at: string;
}

export default function ManageVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("geral");
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, [category]);

  async function fetchVideos() {
    setLoading(true);
    let query = supabase.from("videos").select("*");

    if (category) {
      query = query.eq("category", category);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      console.error(error.message);
    } else {
      setVideos(data || []);
    }
    setLoading(false);
  }

  return (
    <DrawerSceneWrapper>
      <Header name="Editar Vídeos" />
      <View style={styles.container}>
        <Text style={styles.title}>Gerenciar Vídeos</Text>
        <View style={styles.pickerWrapper}>
          {/* Picker de Categoria */}
          <Picker
            selectedValue={category}
            onValueChange={(value) => setCategory(value)}
            style={styles.picker}
          >
            <Picker.Item label="Geral" value="geral" />
            <Picker.Item label="Cultos" value="cultos" />
          </Picker>
        </View>
        {/* Lista de Vídeos */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#000"
            style={{ marginTop: 20 }}
          />
        ) : (
          <FlatList
            data={videos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.videoItem}
                onPress={() => {
                  setSelectedVideo(item);
                  setModalVisible(true);
                }}
              >
                <Text style={styles.videoTitle}>{item.title}</Text>
                <Text style={styles.videoDesc} numberOfLines={1}>
                  {item.description || "Sem descrição"}
                </Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={{ textAlign: "center", marginTop: 20 }}>
                Nenhum vídeo encontrado.
              </Text>
            }
          />
        )}

        {/* Modal de Edição */}
        <EditVideoModal
          visible={modalVisible}
          video={selectedVideo}
          onClose={() => {
            setModalVisible(false);
            setSelectedVideo(null);
            fetchVideos();
          }}
        />
      </View>
    </DrawerSceneWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#efefef",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  pickerWrapper: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    marginBottom: 24,
    elevation: 1,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
    color: "#000",
  },
  videoItem: {
    padding: 12,
    backgroundColor: "#FFF",
    borderRadius: 8,
    marginBottom: 10,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  videoDesc: {
    fontSize: 14,
    color: "#666",
  },
});
