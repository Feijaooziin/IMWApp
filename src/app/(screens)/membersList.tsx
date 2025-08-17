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
    let query = supabase.from("users").select("*").order("name");

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
        <Text>STATUS: {item.member_status}</Text>
        <Text>EMAIL: {item.member_status}</Text>
        <Text>GCEU: {item.group_name}</Text>
        <Text>MINISTÉRIO: {item.ministry}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <DrawerSceneWrapper>
      <Header name="Lista de Membros" />
      <ScrollView
        contentContainerStyle={styles.container}
        nestedScrollEnabled={true}
      >
        <TextInput
          placeholder="Buscar por nome..."
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
          scrollEnabled={false}
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

                <Text style={styles.label}>Filtrar por GCEU</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={filterGroup}
                    onValueChange={(val) => setFilterGroup(val)}
                  >
                    <Picker.Item label="Todos" value="" />
                    <Picker.Item label="Aliança" value="Aliança" />
                    <Picker.Item label="Rede" value="Rede" />
                    <Picker.Item label="Status" value="Status" />
                    <Picker.Item label="Essência" value="Essência" />
                  </Picker>
                </View>

                <Text style={styles.label}>Filtrar por STATUS</Text>
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

                <Text style={styles.label}>
                  Filtrar por MINISTÉRIO / FUNÇÃO
                </Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={filterMinistry}
                    onValueChange={(val) => setFilterMinistry(val)}
                  >
                    <Picker.Item label="Todos" value="" />
                    <Picker.Item label="Pastor" value="Pastor" />
                    <Picker.Item label="Presbítero" value="Presbítero" />
                    <Picker.Item label="Líder" value="Líder" />
                    <Picker.Item label="Louvor" value="Louvor" />
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

                    <View style={styles.modalSection}>
                      <Text style={styles.modalLabel}>STATUS:</Text>
                      <Text style={styles.modalText}>
                        {selectedMember.member_status}
                      </Text>
                    </View>

                    <View style={styles.modalSection}>
                      <Text style={styles.modalLabel}>Email:</Text>
                      <Text style={styles.modalText}>
                        {selectedMember.email}
                      </Text>
                    </View>

                    <View style={styles.modalSection}>
                      <Text style={styles.modalLabel}>GCEU:</Text>
                      <Text style={styles.modalText}>
                        {selectedMember.group_name}
                      </Text>
                    </View>

                    <View style={styles.modalSection}>
                      <Text style={styles.modalLabel}>MINISTÉRIO:</Text>
                      <Text style={styles.modalText}>
                        {selectedMember.ministry}
                      </Text>
                    </View>

                    <View style={styles.modalSection}>
                      <Text style={styles.modalLabel}>TELEFONE CELULAR:</Text>
                      <Text style={styles.modalText}>
                        {selectedMember.phone_mobile}
                      </Text>
                    </View>

                    <View style={styles.modalSection}>
                      <Text style={styles.modalLabel}>TELEFONE FIXO:</Text>
                      <Text style={styles.modalText}>
                        {selectedMember.phone_landline}
                      </Text>
                    </View>

                    <View style={styles.modalSection}>
                      <Text style={styles.modalLabel}>ENDEREÇO:</Text>
                      <Text style={styles.modalText}>
                        {selectedMember.street}, {selectedMember.number}
                      </Text>
                    </View>

                    <View style={styles.modalSection}>
                      <Text style={styles.modalLabel}>BAIRRO:</Text>
                      <Text style={styles.modalText}>
                        {selectedMember.neighborhood}
                      </Text>
                    </View>

                    <View style={styles.modalSection}>
                      <Text style={styles.modalLabel}>CIDADE:</Text>
                      <Text style={styles.modalText}>
                        {selectedMember.city}
                      </Text>
                    </View>

                    <View style={styles.modalSection}>
                      <Text style={styles.modalLabel}>DATA DE NASCIMENTO:</Text>
                      <Text style={styles.modalText}>
                        {selectedMember.birth_date}
                      </Text>
                    </View>

                    <View style={styles.modalSection}>
                      <Text style={styles.modalLabel}>DATA DE BATISMO:</Text>
                      <Text style={styles.modalText}>
                        {selectedMember.baptism_date}
                      </Text>
                    </View>

                    <View style={styles.modalSection}>
                      <Text style={styles.modalLabel}>MEMBRO DESDE:</Text>
                      <Text style={styles.modalText}>
                        {selectedMember.entry_date}
                      </Text>
                    </View>
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
  container: {
    padding: 20,
    backgroundColor: "#efefef",
    flexGrow: 1,
  },
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
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
    color: "#333",
  },
  memberCard: {
    backgroundColor: "#fff",
    flexDirection: "row",
    padding: 12,
    borderWidth: 1,
    borderColor: "#3333",
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 100,
  },
  name: {
    fontWeight: "bold",
    fontSize: 18,
  },
  btnFilter: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalRoot: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
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
  sectionTitle: {
    fontSize: 24,
    fontWeight: "900",
    marginVertical: 8,
  },
  modalSection: {
    flexDirection: "row",
    gap: 4,
    marginBottom: 6,
    alignItems: "center",
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: "900",
    color: "#000",
  },
  modalText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#292929",
  },
});
