import { StyleSheet } from "react-native";
import { DrawerSceneWrapper } from "@/components/drawer-Scene-wrapper";
import { Header } from "@/components/Header";

export default function About() {
  return (
    <DrawerSceneWrapper>
      <Header name="Sobre" />
    </DrawerSceneWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 32,
    backgroundColor: "#fff",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
  },
});
