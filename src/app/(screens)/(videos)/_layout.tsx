import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { withLayoutContext } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

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
          let iconName: keyof typeof Ionicons.glyphMap = "videocam";

          if (route.name === "geral") iconName = "videocam";
          if (route.name === "cultos") iconName = "tv";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="geral" options={{ title: "Geral" }} />
      <Tabs.Screen name="cultos" options={{ title: "Cultos Gravados" }} />
    </Tabs>
  );
}
