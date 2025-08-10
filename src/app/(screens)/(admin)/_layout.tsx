import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { withLayoutContext } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";

const { Navigator } = createBottomTabNavigator();

export const Tabs = withLayoutContext(Navigator);

export default function Layout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#aaa",
        tabBarStyle: {
          backgroundColor: "#292929",
          height: 75,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Feather.glyphMap = "video";

          if (route.name === "addVideo") iconName = "plus";
          if (route.name === "manageVideos") iconName = "edit";

          return <Feather name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="addVideo" options={{ title: "Adicionar Vídeos" }} />
      <Tabs.Screen name="manageVideos" options={{ title: "Editar Vídeos" }} />
    </Tabs>
  );
}
