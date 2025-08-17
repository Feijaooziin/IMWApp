import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { supabase } from "@/lib/supabase";
import { Header } from "@/components/Header";
import { DrawerSceneWrapper } from "@/components/drawer-Scene-wrapper";

type Member = {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
  birth_date: string;
  gender: string;
  phone_mobile: string;
  phone_landline: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  member_status: string;
  baptism_date: string;
  ministry: string;
  entry_date: string;
  group_name: string;
};

export default function MembersList() {
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState("");
  const [filterGroup, setFilterGroup] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterMinistry, setFilterMinistry] = useState("");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [filtersVisible, setFiltersVisible] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, [search]);

  async function fetchMembers() {
    let query = supabase.from("users").select("*");

    if (search) query = query.ilike("name", `%${search}%`);
    if (filterGroup) query = query.eq("group_name", filterGroup);
    if (filterStatus) query = query.eq("member_status", filterStatus);
    if (filterMinistry) query = query.eq("ministry", filterMinistry);

    const { data, error } = await query;
    if (error) console.log(error);
    else setMembers(data || []);
  }

  const renderMember = ({ item }: { item: Member }) => (
    <TouchableOpacity
      style={styles.memberCard}
      onPress={() => setSelectedMember(item)}
    >
      <Image
        source={
          item.avatar_url
            ? { uri: item.avatar_url }
            : require("@/assets/default-avatar.png")
        }
        style={styles.avatar}
      />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text>Status: {item.member_status}</Text>
        <Text>Grupo: {item.group_name}</Text>
        <Text>Ministério: {item.ministry}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <DrawerSceneWrapper>
      <Header name="Lista de Membros" />
      <ScrollView contentContainerStyle={styles.container}>
        <TextInput
          placeholder="Buscar por nome"
          style={styles.input}
          value={search}
          onChangeText={setSearch}
        />

        <TouchableOpacity
          style={styles.btnFilter}
          onPress={() => setFiltersVisible(true)}
        >
          <Text style={styles.btnText}>Filtros</Text>
        </TouchableOpacity>

        <FlatList
          data={members}
          keyExtractor={(item) => item.id}
          renderItem={renderMember}
          style={{ marginTop: 10 }}
        />

        {/* Modal de filtros */}
        <Modal visible={filtersVisible} animationType="slide" transparent>
          <View style={styles.modalRoot}>
            <View style={styles.modalCard}>
              <ScrollView contentContainerStyle={{ padding: 20 }}>
                <TouchableOpacity
                  onPress={() => setFiltersVisible(false)}
                  style={{ alignSelf: "flex-end", marginBottom: 10 }}
                >
                  <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                    Fechar
                  </Text>
                </TouchableOpacity>

                <Text style={styles.label}>Filtrar por Grupo</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={filterGroup}
                    onValueChange={(val) => setFilterGroup(val)}
                  >
                    <Picker.Item label="Todos" value="" />
                    <Picker.Item label="Aliança" value="Aliança" />
                    <Picker.Item label="GCEU1" value="GCEU1" />
                    <Picker.Item label="GCEU2" value="GCEU2" />
                    <Picker.Item label="GCEU3" value="GCEU3" />
                    <Picker.Item label="GCEU4" value="GCEU4" />
                  </Picker>
                </View>

                <Text style={styles.label}>Filtrar por Status</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={filterStatus}
                    onValueChange={(val) => setFilterStatus(val)}
                  >
                    <Picker.Item label="Todos" value="" />
                    <Picker.Item label="Ativo" value="Ativo" />
                    <Picker.Item label="Inativo" value="Inativo" />
                    <Picker.Item label="Ausente" value="Ausente" />
                    <Picker.Item label="Falecido" value="Falecido" />
                  </Picker>
                </View>

                <Text style={styles.label}>Filtrar por Ministério</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={filterMinistry}
                    onValueChange={(val) => setFilterMinistry(val)}
                  >
                    <Picker.Item label="Todos" value="" />
                    <Picker.Item label="Louvor" value="Louvor" />
                    <Picker.Item label="Evangelismo" value="Evangelismo" />
                    <Picker.Item label="Ensino" value="Ensino" />
                  </Picker>
                </View>

                {/* Botões de aplicar e resetar filtros */}
                <TouchableOpacity
                  style={[
                    styles.btnFilter,
                    { backgroundColor: "#16a34a", marginTop: 10 },
                  ]}
                  onPress={() => {
                    fetchMembers();
                    setFiltersVisible(false);
                  }}
                >
                  <Text style={styles.btnText}>Aplicar Filtros</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.btnFilter,
                    { backgroundColor: "#6b7280", marginTop: 10 },
                  ]}
                  onPress={() => {
                    fetchMembers();
                    setFilterGroup("");
                    setFilterStatus("");
                    setFilterMinistry("");
                  }}
                >
                  <Text style={styles.btnText}>Resetar Filtros</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Modal de visualização do membro */}
        <Modal
          visible={!!selectedMember}
          animationType="slide"
          transparent
          onRequestClose={() => setSelectedMember(null)}
        >
          <View style={styles.modalRoot}>
            <View style={styles.modalCard}>
              <ScrollView contentContainerStyle={{ padding: 20 }}>
                <TouchableOpacity
                  onPress={() => setSelectedMember(null)}
                  style={{ alignSelf: "flex-end", marginBottom: 10 }}
                >
                  <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                    Fechar
                  </Text>
                </TouchableOpacity>

                {selectedMember && (
                  <>
                    <Image
                      source={
                        selectedMember.avatar_url
                          ? { uri: selectedMember.avatar_url }
                          : require("@/assets/default-avatar.png")
                      }
                      style={styles.profileImage}
                    />
                    <Text style={styles.sectionTitle}>
                      {selectedMember.name}
                    </Text>
                    <Text>Email: {selectedMember.email}</Text>
                    <Text>Status: {selectedMember.member_status}</Text>
                    <Text>Grupo: {selectedMember.group_name}</Text>
                    <Text>Ministério: {selectedMember.ministry}</Text>
                    <Text>Telefone Celular: {selectedMember.phone_mobile}</Text>
                    <Text>Telefone Fixo: {selectedMember.phone_landline}</Text>
                    <Text>
                      Endereço: {selectedMember.street}, {selectedMember.number}
                    </Text>
                    <Text>Bairro: {selectedMember.neighborhood}</Text>
                    <Text>Cidade: {selectedMember.city}</Text>
                    <Text>Data de Nascimento: {selectedMember.birth_date}</Text>
                    <Text>Data de Batismo: {selectedMember.baptism_date}</Text>
                    <Text>Membro desde: {selectedMember.entry_date}</Text>
                  </>
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </DrawerSceneWrapper>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#efefef", flexGrow: 1 },
  input: {
    borderWidth: 1,
    borderColor: "#999",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 14,
    color: "#000",
    height: 50,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#999",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 12,
    justifyContent: "center",
    height: 50,
  },
  label: { fontSize: 14, fontWeight: "500", marginBottom: 4, color: "#333" },
  memberCard: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
  },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: "#ddd" },
  name: { fontWeight: "bold", fontSize: 16 },
  btnFilter: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  modalRoot: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    padding: 16,
  },
  modalCard: {
    maxHeight: "90%",
    borderRadius: 12,
    backgroundColor: "#efefef",
    overflow: "hidden",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 100,
    alignSelf: "center",
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginVertical: 8 },
});
