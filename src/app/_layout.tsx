import { useEffect } from "react";
import { router, Stack } from "expo-router";

import { AuthProvider, useAuth } from "@/hooks/AuthContext";
import { supabase } from "@/lib/supabase";

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
        router.replace("/(screens)/home");
        return;
      }
      setAuth(null);
      router.replace("/(auth)/signin");
    });
  }, []);
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)/signin" options={{ title: "Login" }} />
      <Stack.Screen name="(auth)/signup" options={{ title: "Cadastro" }} />
    </Stack>
  );
}
