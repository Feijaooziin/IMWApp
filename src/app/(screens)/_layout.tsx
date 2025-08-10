import { useEffect, useRef, useState } from "react";
import { View, TouchableOpacity, Alert } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { router } from "expo-router";
import { Drawer } from "expo-router/drawer";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "@/hooks/AuthContext";
import { supabase } from "@/lib/supabase";
import { useUserRole } from "@/hooks/useUserRole";

export default function MainLayout() {
  const drawerRef = useRef<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { setAuth } = useAuth();
  const { role } = useUserRole();

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
    setAuth(null);
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
        drawerContent={(props) => (
          <DrawerContentScrollView
            {...props}
            contentContainerStyle={{ flex: 1 }}
          >
            <DrawerItemList {...props} />

            <View style={{ flex: 1 }} />

            <TouchableOpacity
              style={{
                backgroundColor: "white",
                borderRadius: 12,
              }}
            >
              <DrawerItem
                label="Sair da Conta"
                labelStyle={{
                  color: "#292929",
                }}
                icon={() => (
                  <Ionicons name="log-out" size={24} color="#292929" />
                )}
                onPress={handleLogout}
              />
            </TouchableOpacity>
          </DrawerContentScrollView>
        )}
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
          name="(admin)"
          options={{
            drawerLabel: "Editar Vídeos",
            drawerIcon: ({ color }) => (
              <Ionicons name="cloud-upload" size={20} color={color} />
            ),
            drawerItemStyle: {
              display: role === "admin" ? "flex" : "none",
            },
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
