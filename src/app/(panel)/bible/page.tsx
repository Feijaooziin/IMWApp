import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { DrawerSceneWrapper } from "@/components/drawer-Scene-wrapper";
import { Header } from "@/components/Header";
import { Feather, Ionicons } from "@expo/vector-icons";

type LivroJSON = {
  name: string;
  abbrev: string;
  chapters: string[][];
};

export default function Bible() {
  const [versao, setVersao] = useState("nvi");
  const [bibleData, setBibleData] = useState<LivroJSON[]>([]);
  const [livros, setLivros] = useState<
    { nome: string; codigo: string; capitulos: number }[]
  >([]);
  const [livro, setLivro] = useState<{
    nome: string;
    codigo: string;
    capitulos: number;
  } | null>(null);
  const [capitulo, setCapitulo] = useState(1);
  const [versiculos, setVersiculos] = useState<string[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  //Carregar JSON da versão selecionada dinamicamente
  const carregarVersao = async (novaVersao: string) => {
    setCarregando(true);
    try {
      let data: LivroJSON[] = [];
      if (novaVersao === "aa") {
        data = require("@/data/bible_aa.json");
      } else if (novaVersao === "acf") {
        data = require("@/data/bible_acf.json");
      } else if (novaVersao === "nvi") {
        data = require("@/data/bible_nvi.json");
      }

      setBibleData(data);

      const livrosLista = data.map((livro) => ({
        // nome: livro.abbrev.toUpperCase(),
        nome: livro.name,
        codigo: livro.abbrev,
        capitulos: livro.chapters.length,
      }));

      setLivros(livrosLista);
      setLivro(livrosLista[0]);
      setCapitulo(1);
    } catch (e) {
      console.error("Erro ao carregar versão:", e);
    } finally {
      setCarregando(false);
    }
  };

  //Buscar capítulo
  const buscarBiblia = () => {
    if (!livro) return;
    setCarregando(true);

    const livroData = bibleData.find((l) => l.abbrev === livro.codigo);
    if (livroData && livroData.chapters[capitulo - 1]) {
      setVersiculos(livroData.chapters[capitulo - 1]);
    } else {
      setVersiculos(["Texto não encontrado."]);
    }

    setCarregando(false);
  };

  //Carrega versão inicial
  useEffect(() => {
    carregarVersao(versao);
  }, [versao]);

  //Atualiza capítulo quando troca livro ou capítulo
  useEffect(() => {
    buscarBiblia();
  }, [livro, capitulo, bibleData]);

  const proximoCapitulo = () => {
    if (livro && capitulo < livro.capitulos) {
      setCapitulo(capitulo + 1);
    }
  };

  const capituloAnterior = () => {
    if (capitulo > 1) {
      setCapitulo(capitulo - 1);
    }
  };

  return (
    <DrawerSceneWrapper>
      <Header
        name="Bíblia"
        label={`📖 - ${versao}`}
        onPress={() => setModalVisible(true)}
      />
      <View style={styles.container}>
        {livros.length > 0 && (
          <>
            <Text style={styles.label}>Livro</Text>
            <Picker
              selectedValue={livro?.codigo}
              style={styles.picker}
              dropdownIconColor="#000"
              onValueChange={(itemValue) => {
                const novoLivro =
                  livros.find((l) => l.codigo === itemValue) || livros[0];
                setLivro(novoLivro);
                setCapitulo(1);
              }}
            >
              {livros.map((item) => (
                <Picker.Item
                  key={item.codigo}
                  label={item.nome}
                  value={item.codigo}
                />
              ))}
            </Picker>

            <Text style={styles.label}>Capítulo</Text>
            <Picker
              dropdownIconColor="#000"
              selectedValue={capitulo}
              style={styles.picker}
              onValueChange={(itemValue) => setCapitulo(itemValue)}
            >
              {Array.from({ length: livro?.capitulos || 1 }, (_, i) => (
                <Picker.Item key={i + 1} label={`${i + 1}`} value={i + 1} />
              ))}
            </Picker>
          </>
        )}

        <ScrollView style={styles.resultBox}>
          {carregando ? (
            <ActivityIndicator size="large" color="#000" />
          ) : (
            versiculos.map((v, index) => (
              <Text key={index} style={styles.result}>
                <Text style={{ fontWeight: "bold" }}>{index + 1}. </Text>
                {v}
              </Text>
            ))
          )}
        </ScrollView>

        <View style={styles.navButtons}>
          <TouchableOpacity style={styles.navButton} onPress={capituloAnterior}>
            <Ionicons name="arrow-back" size={20} color={"white"} />
            <Text style={styles.navButtonText}>Capítulo Anterior</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={proximoCapitulo}>
            <Text style={styles.navButtonText}>Próximo Capítulo</Text>
            <Ionicons name="arrow-forward" size={20} color={"white"} />
          </TouchableOpacity>
        </View>

        {/* Modal de Configurações */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Escolher Versão da Bíblia</Text>

              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => {
                  setVersao("nvi");
                  setModalVisible(false);
                }}
              >
                <Text style={styles.modalOptionText}>
                  📖 NVI - Nova Versão Internacional
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => {
                  setVersao("aa");
                  setModalVisible(false);
                }}
              >
                <Text style={styles.modalOptionText}>
                  📖 AA - Almeida Atualizada
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => {
                  setVersao("acf");
                  setModalVisible(false);
                }}
              >
                <Text style={styles.modalOptionText}>
                  📖 ACF - Almeida Corrigida Fiel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </DrawerSceneWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 14,
    backgroundColor: "#efefef",
  },
  label: {
    fontSize: 14,
    marginTop: 10,
  },
  picker: {
    backgroundColor: "#fff",
    borderRadius: 5,
    marginVertical: 2,
    color: "#000",
  },
  navButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 54,
  },
  navButton: {
    flexDirection: "row",
    backgroundColor: "#0683bd",
    padding: 10,
    paddingHorizontal: 25,
    gap: 12,
    borderRadius: 5,
    width: "48%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  resultBox: {
    marginTop: 20,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  result: {
    fontSize: 18,
    lineHeight: 26,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    width: "80%",
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  modalOption: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  modalOptionText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: "#0683bd",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
