import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { router, Stack } from "expo-router";

export default function RootLayout() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}

function MainLayout() {
  const { setAuth } = useAuth();

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setAuth(session.user);
        router.replace("/(panel)/homepage/page");
        return;
      }
      setAuth(null);
      router.replace("/(auth)/signin/page");
    });
  }, []);
  return (
    // <Stack>
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)/signin/page" options={{ title: "Login" }} />
      <Stack.Screen name="(auth)/signup/page" options={{ title: "Cadastro" }} />
    </Stack>
  );
}
