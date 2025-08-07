import { useEffect, useRef, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { router } from "expo-router";
import { Drawer } from "expo-router/drawer";

import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

export default function MainLayout() {
  const drawerRef = useRef<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { setAuth } = useAuth();

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setAuth(session.user);
        router.replace("/home");
        return;
      }
      setAuth(null);
      router.replace("/(auth)/signin");
    });
  }, []);

  function openDrawer() {
    drawerRef.current?.openDrawer();
    setDrawerOpen(true);
  }
  function closeDrawer() {
    drawerRef.current?.closeDrawer();
    setDrawerOpen(false);
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerShown: false,
          drawerActiveBackgroundColor: "transparent",
          drawerInactiveBackgroundColor: "transparent",
          drawerInactiveTintColor: "#777",
          drawerActiveTintColor: "#FFF",
          overlayColor: "transparent",
          drawerStyle: {
            backgroundColor: "#292929",
            paddingTop: 32,
            width: "50%",
          },
          drawerLabelStyle: {
            marginLeft: 8,
          },
          sceneStyle: {
            backgroundColor: drawerOpen ? "#292929" : "#efefef",
          },
        }}
      >
        <Drawer.Screen
          name="home"
          options={{
            drawerLabel: "Início",
            drawerIcon: ({ color }) => (
              <Ionicons name="home" size={20} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="(videos)"
          options={{
            drawerLabel: "Vídeos",
            drawerIcon: ({ color }) => (
              <Ionicons name="videocam" size={20} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="bible"
          options={{
            drawerLabel: "Bíblia",
            drawerIcon: ({ color }) => (
              <Ionicons name="book" size={20} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="about"
          options={{
            drawerLabel: "Sobre",
            drawerIcon: ({ color }) => (
              <Ionicons
                name="information-circle-sharp"
                size={20}
                color={color}
              />
            ),
          }}
        />

        <Drawer.Screen
          name="profile"
          options={{
            drawerLabel: "Perfil",
            drawerIcon: ({ color }) => (
              <Ionicons name="person" size={20} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="add-video"
          options={{
            drawerLabel: "Add Vídeos",
            drawerIcon: ({ color }) => (
              <Ionicons name="cloud-upload" size={20} color={color} />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
