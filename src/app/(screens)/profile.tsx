import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

import { DrawerSceneWrapper } from "@/components/drawer-Scene-wrapper";
import { Header } from "@/components/Header";
import { supabase } from "@/lib/supabase";
import { useSupabaseUser } from "@/context/UserContext";
import { useAuth } from "@/context/AuthContext";

// ✅ Definição de tipo para o formulário
type FormFields = {
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

type FormKeys = keyof FormFields;

export default function Profile() {
  const { profile } = useSupabaseUser();
  const { setAuth } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [dateField, setDateField] = useState<FormKeys | null>(null); // ✅ agora é keyof FormFields
  const [formData, setFormData] = useState<FormFields>({
    name: "",
    email: "",
    avatar_url: "",
    birth_date: "",
    gender: "",
    phone_mobile: "",
    phone_landline: "",
    street: "",
    number: "",
    neighborhood: "",
    city: "",
    member_status: "",
    baptism_date: "",
    ministry: "",
    entry_date: "",
    group_name: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        avatar_url: profile.avatar_url || "",
        birth_date: profile.birth_date || "",
        gender: profile.gender || "",
        phone_mobile: profile.phone_mobile || "",
        phone_landline: profile.phone_landline || "",
        street: profile.street || "",
        number: profile.number || "",
        neighborhood: profile.neighborhood || "",
        city: profile.city || "",
        member_status: profile.member_status || "",
        baptism_date: profile.baptism_date || "",
        ministry: profile.ministry || "",
        entry_date: profile.entry_date || "",
        group_name: profile.group_name || "",
      });
    }
  }, [profile]);

  async function saveChanges() {
    if (!profile?.id) return;

    // Convertendo campos de data para Date (se tiver valor)
    const dataToUpdate = {
      ...formData,
      birth_date: formData.birth_date ? new Date(formData.birth_date) : null,
      baptism_date: formData.baptism_date
        ? new Date(formData.baptism_date)
        : null,
      entry_date: formData.entry_date ? new Date(formData.entry_date) : null,
    };

    const { error } = await supabase
      .from("users")
      .update(dataToUpdate)
      .eq("id", profile.id);

    if (error) {
      Alert.alert(
        "Erro",
        "Não foi possível salvar as alterações." + error.message
      );
    } else {
      Alert.alert("Sucesso", "Dados atualizados com sucesso!");
      setEditMode(false);
    }
  }

  async function handleCancel() {
    {
      if (profile) {
        setFormData({
          name: profile.name || "",
          email: profile.email || "",
          avatar_url: profile.avatar_url || "",
          birth_date: profile.birth_date || "",
          gender: profile.gender || "",
          phone_mobile: profile.phone_mobile || "",
          phone_landline: profile.phone_landline || "",
          street: profile.street || "",
          number: profile.number || "",
          neighborhood: profile.neighborhood || "",
          city: profile.city || "",
          member_status: profile.member_status || "",
          baptism_date: profile.baptism_date || "",
          ministry: profile.ministry || "",
          entry_date: profile.entry_date || "",
          group_name: profile.group_name || "",
        });
      }
      setEditMode(false);
    }
  }

  async function handleLogout() {
    Alert.alert("Sair", "Deseja mesmo sair da sua conta?", [
      { text: "Não", style: "cancel" },
      {
        text: "Sim",
        onPress: async () => {
          const { error } = await supabase.auth.signOut();
          setAuth(null);
          if (error) {
            Alert.alert("Erro", "Erro ao sair da conta, tente novamente.");
          }
        },
      },
    ]);
  }

  function handleDateChange(event: any, selectedDate?: Date) {
    if (dateField && selectedDate) {
      setFormData((prev) => ({
        ...prev,
        [dateField]: selectedDate.toISOString().split("T")[0],
      }));
    }
    setDateField(null);
  }

  const renderInput = (
    label: string,
    value: string,
    onChange: (text: string) => void,
    keyboardType: "default" | "email-address" | "numeric" = "default"
  ) => (
    <View style={{ flex: 1 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, !editMode && styles.inputDisabled]}
        value={value}
        editable={editMode}
        keyboardType={keyboardType}
        onChangeText={onChange}
      />
    </View>
  );

  const renderDateInput = (label: string, field: FormKeys) => (
    <View style={{ flex: 1 }}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[styles.dateInput, !editMode && styles.inputDisabled]}
        disabled={!editMode}
        onPress={() => setDateField(field)}
      >
        <Text style={!editMode ? styles.dateTextDisabled : styles.dateText}>
          {formData[field] || "Selecionar Data"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <DrawerSceneWrapper>
      <Header name="Área do Membro" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView
          contentContainerStyle={[
            styles.container,
            { flexGrow: 1, minHeight: "100%" },
          ]}
          keyboardShouldPersistTaps="never"
        >
          {/* Foto de Perfil */}
          <View style={styles.imageContainer}>
            <Image
              style={styles.profileImage}
              source={
                formData.avatar_url
                  ? { uri: formData.avatar_url }
                  : require("@/assets/default-avatar.png")
              }
            />
          </View>

          {/* Dados Pessoais */}
          <Text style={styles.sectionTitle}>Dados Pessoais</Text>
          {renderInput("Nome Completo", formData.name, (t) =>
            setFormData({ ...formData, name: t })
          )}
          {renderInput("URL da Imagem", formData.avatar_url, (t) =>
            setFormData({ ...formData, avatar_url: t })
          )}
          <View style={styles.row}>
            {renderDateInput("Data de Nascimento", "birth_date")}
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.label}>Gênero</Text>
              <View
                style={[
                  styles.pickerContainer,
                  !editMode && styles.inputDisabled,
                ]}
              >
                <Picker
                  enabled={editMode}
                  selectedValue={formData.gender}
                  onValueChange={(val) =>
                    setFormData({ ...formData, gender: val })
                  }
                >
                  <Picker.Item label="Selecione" value="" />
                  <Picker.Item label="Masculino" value="Masculino" />
                  <Picker.Item label="Feminino" value="Feminino" />
                  <Picker.Item label="Outro" value="Outro" />
                </Picker>
              </View>
            </View>
          </View>

          {/* Contato */}
          <Text style={styles.sectionTitle}>Informações de Contato</Text>
          {renderInput("Telefone Celular", formData.phone_mobile, (t) =>
            setFormData({ ...formData, phone_mobile: t })
          )}
          {renderInput("Telefone Fixo", formData.phone_landline, (t) =>
            setFormData({ ...formData, phone_landline: t })
          )}
          {renderInput("E-mail", formData.email, (t) =>
            setFormData({ ...formData, email: t })
          )}
          <View style={styles.row}>
            <View style={{ flex: 3 }}>
              {renderInput("Rua", formData.street, (t) =>
                setFormData({ ...formData, street: t })
              )}
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              {renderInput("Número", formData.number, (t) =>
                setFormData({ ...formData, number: t })
              )}
            </View>
          </View>
          <View style={styles.row}>
            {renderInput("Bairro", formData.neighborhood, (t) =>
              setFormData({ ...formData, neighborhood: t })
            )}
            <View style={{ marginLeft: 8, flex: 1 }}>
              {renderInput("Cidade", formData.city, (t) =>
                setFormData({ ...formData, city: t })
              )}
            </View>
          </View>

          {/* Eclesiásticos */}
          <Text style={styles.sectionTitle}>Dados Eclesiásticos</Text>
          <Text style={styles.label}>Situação do Membro</Text>
          <View
            style={[styles.pickerContainer, !editMode && styles.inputDisabled]}
          >
            <Picker
              enabled={editMode}
              selectedValue={formData.member_status}
              onValueChange={(val) =>
                setFormData({ ...formData, member_status: val })
              }
            >
              <Picker.Item label="Selecione" value="" />
              <Picker.Item label="Ativo" value="Ativo" />
              <Picker.Item label="Inativo" value="Inativo" />
              <Picker.Item label="Ausente" value="Ausente" />
              <Picker.Item label="Falecido" value="Falecido" />
            </Picker>
          </View>

          <View style={styles.row2}>
            {renderDateInput("Data de Batismo", "baptism_date")}
            {renderDateInput("Membro desde", "entry_date")}
          </View>

          {renderInput("Ministério / Função", formData.ministry, (t) =>
            setFormData({ ...formData, ministry: t })
          )}

          <Text style={styles.label}>Participa de qual GCEU</Text>
          <View
            style={[styles.pickerContainer, !editMode && styles.inputDisabled]}
          >
            <Picker
              enabled={editMode}
              selectedValue={formData.group_name}
              onValueChange={(val) =>
                setFormData({ ...formData, group_name: val })
              }
              dropdownIconColor={!editMode ? "#777" : "#000"}
            >
              <Picker.Item label="Selecione" value="" />
              <Picker.Item label="Aliança" value="Aliança" />
              <Picker.Item label="GCEU1" value="GCEU1" />
              <Picker.Item label="GCEU2" value="GCEU2" />
              <Picker.Item label="GCEU3" value="GCEU3" />
              <Picker.Item label="GCEU4" value="GCEU4" />
            </Picker>
          </View>

          {editMode ? (
            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.btnSave} onPress={saveChanges}>
                <Text style={styles.btnText}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnCancel} onPress={handleCancel}>
                <Text style={styles.btnText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.btnEdit}
              onPress={() => setEditMode(true)}
            >
              <Text style={styles.btnText}>Editar Cadastro</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.btnLogout} onPress={handleLogout}>
            <Text style={styles.btnText}>Sair</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {dateField && (
        <DateTimePicker
          value={
            formData[dateField] ? new Date(formData[dateField]) : new Date()
          }
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
        />
      )}
    </DrawerSceneWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#efefef",
    minHeight: "100%",
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 100,
    backgroundColor: "#ddd",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#333",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
    color: "#333",
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
  inputDisabled: {
    backgroundColor: "#ccc",
    color: "#777",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#999",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 4,
    height: 50,
    justifyContent: "center",
    color: "#000",
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#999",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 12,
    justifyContent: "center",
    height: 50,
  },
  dateText: {
    fontSize: 14,
    color: "#333",
  },
  dateTextDisabled: {
    fontSize: 14,
    color: "#777",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  row2: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    gap: 8,
  },
  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  btnLogout: {
    backgroundColor: "#6b7280",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
    width: "100%",
  },
  btnEdit: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  btnSave: {
    backgroundColor: "#16a34a",
    flex: 1,
    marginRight: 5,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  btnCancel: {
    backgroundColor: "#dc2626",
    flex: 1,
    marginLeft: 5,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
