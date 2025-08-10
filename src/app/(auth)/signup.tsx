import { useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";

import { supabase } from "@/lib/supabase";
import { useSupabaseErrorHandler } from "@/hooks/useSupabaseErrorHandler";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { handleSupabaseError } = useSupabaseErrorHandler();

  async function handleSignUp() {
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          name: name,
        },
      },
    });

    if (error) {
      handleSupabaseError(error);
      console.log(`Mensagem de erro: ${error.message}`);
      setLoading(false);
      return;
    }

    setLoading(false);
    setName("");
    setEmail("");
    setPassword("");
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1, backgroundColor: "#efefef" }}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Image style={styles.img} source={require("@/assets/logo.png")} />
            <View style={styles.user}>
              <Text style={styles.name}>Igreja Metodista Wesleyana</Text>
              <Text style={styles.username}>Cachoeira</Text>
            </View>
          </View>

          <View
            style={{
              width: "100%",
              flexDirection: "row",

              marginTop: 30,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={30} />
            </TouchableOpacity>
            <View style={{ flex: 1, alignItems: "center", marginLeft: -30 }}>
              <Text style={styles.title}>Cadastro</Text>
            </View>
          </View>

          <View style={styles.form}>
            <Text style={styles.inputLabel}>Nome</Text>
            <TextInput
              placeholder="Nome Completo..."
              placeholderTextColor="#000"
              style={styles.input}
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              placeholder="Digite seu Email..."
              placeholderTextColor="#000"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
            />

            <Text style={styles.inputLabel}>Senha</Text>
            <TextInput
              placeholder="Digite sua Senha..."
              placeholderTextColor="#000"
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          <TouchableOpacity style={styles.loginButton} onPress={handleSignUp}>
            <Text style={styles.loginLabel}>
              {loading ? "Carregando..." : "Cadastrar"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 40,
    backgroundColor: "#efefef",
    alignItems: "center",
    minHeight: "100%",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    borderBottomWidth: 1,
    borderBottomColor: "#888",
  },

  img: {
    width: 40,
    height: 40,
    borderRadius: 100,
    marginTop: 5,
    marginBottom: 5,
  },

  user: {
    flex: 1,
    justifyContent: "center",
  },

  name: {
    fontSize: 14,
    fontWeight: "300",
  },

  username: {
    fontSize: 20,
    fontWeight: "700",
  },

  title: {
    flex: 1,
    textTransform: "uppercase",
    fontSize: 24,
    fontWeight: "900",
    color: "#000",
    lineHeight: 28,
  },

  form: {
    width: "90%",
    marginTop: 40,
    marginBottom: 24,
  },

  inputLabel: {
    marginBottom: 6,
    paddingLeft: 8,
    fontSize: 20,
    color: "#555",
  },

  input: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 30,
    color: "#000",
  },

  loginButton: {
    backgroundColor: "#0099ff",
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 10,
  },

  loginLabel: {
    color: "white",
    fontWeight: "900",
    fontSize: 16,
  },
});
