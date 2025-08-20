import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";

import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";

import { router } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useSupabaseErrorHandler } from "@/hooks/useSupabaseErrorHandler";
import { Feather, Ionicons } from "@expo/vector-icons";

export default function Login() {
  GoogleSignin.configure({
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    webClientId:
      "682310866995-231q6ikha3j4o8tqd06oa9cn85llhlsi.apps.googleusercontent.com",
    offlineAccess: true,
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { handleSupabaseError } = useSupabaseErrorHandler();

  async function handleLogin() {
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      handleSupabaseError(error);
      console.log(`Mensagem de erro: ${error.message}`);
      setLoading(false);
      return;
    }

    setEmail("");
    setPassword("");
    setLoading(false);
    router.replace("/(screens)/home");
  }

  function handleSignUp() {
    router.navigate("/signup");
  }

  async function handleGoogleSignUp() {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log("userInfo:", userInfo);
      if (userInfo.data?.idToken) {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: userInfo.data.idToken,
        });
        console.log(error, data);
      } else {
        throw new Error("no ID token present!");
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        console.log(error);
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        console.log(error);
      } else {
        // some other error happened
        console.log(error);
      }
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image style={styles.img} source={require("@/assets/logo.png")} />
        <View style={styles.user}>
          <Text style={styles.name}>Igreja Metodista Wesleyana</Text>
          <Text style={styles.username}>Cachoeira</Text>
        </View>
      </View>
      <Text style={styles.title}>Login</Text>

      <View style={styles.form}>
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
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginLabel}>
          {loading ? "Carregando..." : "Entrar"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.loginGoogleButton}
        onPress={handleGoogleSignUp}
      >
        <Ionicons name="logo-google" size={20} color="white" />
        <Text style={styles.loginLabel}>
          {loading ? "Carregando..." : "Login com o Google"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ flexDirection: "row", gap: 4 }}
        onPress={handleSignUp}
      >
        <Text style={styles.signinLabel}>Não tem uma conta?</Text>
        <Text style={styles.signinLabel2}>Cadastar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 14,
    paddingTop: 40,
    backgroundColor: "#efefef",
    alignItems: "center",
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
    textTransform: "uppercase",
    fontSize: 24,
    fontWeight: "900",
    color: "#000",
    lineHeight: 28,
    marginTop: 60,
    marginBottom: 8,
  },

  form: {
    width: "90%",
    marginTop: 40,
    marginBottom: 36,
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

  loginGoogleButton: {
    backgroundColor: "red",
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 16,
    marginTop: 16,
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
    fontWeight: "700",
    color: "blue",
  },
});
