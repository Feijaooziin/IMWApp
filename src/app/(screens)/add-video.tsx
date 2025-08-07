import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";

import { Picker } from "@react-native-picker/picker";

import { DrawerSceneWrapper } from "@/components/drawer-Scene-wrapper";
import { Header } from "@/components/Header";
import { supabase } from "@/lib/supabase";

export default function AddVideo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [category, setCategory] = useState("");

  async function handleAddVideo() {
    if (!title || !url) {
      Alert.alert("Erro", "Preencha pelo menos o título e a URL.");
      return;
    }

    const { error } = await supabase.from("videos").insert([
      {
        title,
        description,
        url,
        thumbnail,
        category,
      },
    ]);

    if (error) {
      Alert.alert("Erro ao salvar", error.message);
    } else {
      Alert.alert("Sucesso", "Vídeo adicionado com sucesso!");
      setTitle("");
      setDescription("");
      setUrl("");
      setThumbnail("");
      setCategory("");
    }
  }

  return (
    <DrawerSceneWrapper>
      <Header name="Adicionar Vídeo" />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>URL do Vídeo *</Text>
        <TextInput
          style={styles.input}
          value={url}
          onChangeText={setUrl}
          placeholder="https://"
          placeholderTextColor="#000"
        />

        <Text style={styles.label}>Título *</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Título do vídeo"
          placeholderTextColor="#000"
        />

        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder="Descrição do vídeo"
          placeholderTextColor="#000"
        />

        <Text style={styles.label}>Thumbnail (URL)</Text>
        <TextInput
          style={styles.input}
          value={thumbnail}
          onChangeText={setThumbnail}
          placeholder="https://"
          placeholderTextColor="#000"
        />

        <Text style={styles.label}>Categoria</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={category}
            onValueChange={(value) => setCategory(value)}
            style={styles.picker}
            dropdownIconColor="#000"
          >
            <Picker.Item
              label="Selecione uma categoria"
              value=""
              enabled={false}
            />
            <Picker.Item label="Geral" value="geral" />
            <Picker.Item label="Culto Gravado" value="culto" />
            {/* Adicione mais categorias se necessário */}
          </Picker>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleAddVideo}>
          <Text style={styles.buttonText}>Adicionar Vídeo</Text>
        </TouchableOpacity>
      </ScrollView>
    </DrawerSceneWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  label: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 8,
    marginTop: 4,
    fontSize: 16,
    elevation: 2,
  },
  pickerWrapper: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    marginTop: 4,
    elevation: 1,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
    color: "#000",
  },
  button: {
    marginTop: 24,
    backgroundColor: "#222",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
