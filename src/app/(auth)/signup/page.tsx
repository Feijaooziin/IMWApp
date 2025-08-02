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

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          name: name,
        },
      },
    });

    if (error) {
      Alert.alert("Erro", error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    setName("");
    setEmail("");
    setPassword("");
    router.replace("/(auth)/signin/page");
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1, backgroundColor: "#efefef" }}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Image
              style={styles.img}
              source={{
                uri: "https://scontent-gru2-1.cdninstagram.com/v/t51.2885-19/466698498_2394222744247375_116135971975854835_n.jpg?stp=dst-jpg_s150x150_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby4xMDgwLmMyIn0&_nc_ht=scontent-gru2-1.cdninstagram.com&_nc_cat=107&_nc_oc=Q6cZ2QH4VeIoRgPkAj8-IXmLmWXmLH2Sp7gHNz7iHGXnFkF3lqxV9e_0TcnASIx9vK8tq8s&_nc_ohc=a_R2fIv3diEQ7kNvwFPjood&_nc_gid=Trw9FrbhC3IvYm6RxrLmag&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfSur31dxoboiXQYYfnGSiLR5k5SS5bzX6UtIhGhPsK9MQ&oe=6891CA09&_nc_sid=8b3546",
              }}
            />
            <View style={styles.user}>
              <Text style={styles.hi}>Igreja Metodista Wesleyana</Text>
              <Text style={styles.username}>Cachoeira</Text>
            </View>
          </View>
          <Text style={styles.title}>Cadastro</Text>

          <View style={styles.form}>
            <Text style={styles.inputLabel}>Nome</Text>
            <TextInput
              placeholder="Nome Completo..."
              style={styles.input}
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              placeholder="Digite seu Email..."
              style={styles.input}
              value={email}
              onChangeText={setEmail}
            />

            <Text style={styles.inputLabel}>Senha</Text>
            <TextInput
              placeholder="Digite sua Senha..."
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.loginButton} onPress={handleSignUp}>
              <Text style={styles.loginLabel}>
                {loading ? "Carregando..." : "Cadastrar"}
              </Text>
            </TouchableOpacity>
          </View>
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
    width: 50,
    height: 50,
    borderRadius: 100,
    marginTop: 5,
    marginBottom: 5,
  },

  user: {
    flex: 1,
    justifyContent: "center",
  },

  hi: {
    fontSize: 14,
    fontWeight: "300",
  },

  username: {
    fontSize: 20,
    fontWeight: "700",
  },

  title: {
    textTransform: "uppercase",
    fontSize: 24,
    fontWeight: "900",
    color: "#000",
    lineHeight: 28,
    marginTop: 60,
  },

  form: {
    width: "90%",
    marginTop: 40,
    marginBottom: 48,
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
  },

  buttons: {
    marginTop: -20,
    gap: 16,
    alignItems: "center",
  },

  loginButton: {
    backgroundColor: "#0099ff",
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 10,
  },

  loginButtonGoogle: {
    backgroundColor: "#ff3f3f",
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 10,
    flexDirection: "row",
    gap: 10,
  },

  loginLabel: {
    color: "white",
    fontWeight: "900",
    fontSize: 16,
  },

  signinLabel: {
    marginTop: 16,
    fontWeight: "300",
  },
  signinLabel2: {
    marginTop: 16,
    fontWeight: "300",
    color: "blue",
  },
});
