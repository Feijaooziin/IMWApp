import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { router, Stack } from "expo-router";

export default function LoginLayout() {
  const { setAuth } = useAuth();

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setAuth(session.user);
        router.replace("/(panel)/home");
        return;
      }
      setAuth(null);
      router.replace("/(auth)/signin");
    });
  }, []);
  return (
    // <Stack>
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)/signin" options={{ title: "Login" }} />
      <Stack.Screen name="(auth)/signup" options={{ title: "Cadastro" }} />
    </Stack>
  );
}
