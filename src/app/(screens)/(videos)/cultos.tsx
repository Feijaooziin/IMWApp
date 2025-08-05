import { View, Text, StyleSheet } from "react-native";
import { DrawerSceneWrapper } from "@/components/drawer-Scene-wrapper";
import { Header } from "@/components/Header";

export default function Cultos() {
  return (
    <DrawerSceneWrapper>
      <Header name="Vídeos - Cultos Gravados" />
      <View style={styles.container}>
        <Text style={styles.text}>Lista de cultos gravados aqui...</Text>
      </View>
    </DrawerSceneWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#efefef",
    paddingBottom: 80,
  },
  text: {
    fontSize: 16,
    color: "#000",
  },
});
