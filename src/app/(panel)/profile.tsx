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
} from "react-native";
import { DrawerSceneWrapper } from "@/components/drawer-Scene-wrapper";
import { Header } from "@/components/Header";
import { supabase } from "@/lib/supabase";
import { useSupabaseUser } from "@/context/UserContext";
import { useAuth } from "@/context/AuthContext";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

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
  neighborhood: string;
  conversion_date: string;
  baptism_date: string;
  ministry: string;
  member_status: string;
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
    neighborhood: "",
    conversion_date: "",
    baptism_date: "",
    ministry: "",
    member_status: "",
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
        neighborhood: profile.neighborhood || "",
        conversion_date: profile.conversion_date || "",
        baptism_date: profile.baptism_date || "",
        ministry: profile.ministry || "",
        member_status: profile.member_status || "",
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
      conversion_date: formData.conversion_date
        ? new Date(formData.conversion_date)
        : null,
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
          neighborhood: profile.neighborhood || "",
          conversion_date: profile.conversion_date || "",
          baptism_date: profile.baptism_date || "",
          ministry: profile.ministry || "",
          member_status: profile.member_status || "",
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
        style={[styles.input, !editMode && styles.inputDisabled]}
        disabled={!editMode}
        onPress={() => setDateField(field)}
      >
        <Text>{formData[field] || "Selecionar Data"}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <DrawerSceneWrapper>
      <Header name="Área do Membro" />
      <ScrollView contentContainerStyle={styles.container}>
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
          {renderInput("Endereço", formData.street, (t) =>
            setFormData({ ...formData, street: t })
          )}
          <View style={{ marginLeft: 8, flex: 1 }}>
            {renderInput("Bairro", formData.neighborhood, (t) =>
              setFormData({ ...formData, neighborhood: t })
            )}
          </View>
        </View>

        {/* Eclesiásticos */}
        <Text style={styles.sectionTitle}>Dados Eclesiásticos</Text>
        {renderDateInput("Data de Conversão", "conversion_date")}
        {renderDateInput("Data de Batismo", "baptism_date")}
        {renderInput("Ministério / Função", formData.ministry, (t) =>
          setFormData({ ...formData, ministry: t })
        )}
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
            <Picker.Item label="Visitante" value="Visitante" />
            <Picker.Item label="Inativo" value="Inativo" />
          </Picker>
        </View>
        {renderInput("Participa de Grupo ou Célula", formData.group_name, (t) =>
          setFormData({ ...formData, group_name: t })
        )}

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
    flex: 1,
    padding: 20,
    backgroundColor: "#efefef",
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
    color: "#333",
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
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
