import { StyleSheet, Text, View } from "react-native";
import { DrawerSceneWrapper } from "@/components/drawer-Scene-wrapper";
import { Header } from "@/components/Header";

export default function Home() {
  return (
    <DrawerSceneWrapper>
      <Header name="Início" />
    </DrawerSceneWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#efefef",
    paddingHorizontal: 14,
  },
});
