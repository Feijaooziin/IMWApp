import { ScrollView, StyleSheet, Text, View } from "react-native";
import { DrawerSceneWrapper } from "@/components/drawer-Scene-wrapper";

import { Header } from "@/components/Header";
import HomeBanner from "@/components/homeBanner";

export default function Home() {
  return (
    <DrawerSceneWrapper>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Header name="Início" />
          <View style={{ alignItems: "center" }}>
            <HomeBanner title="Eventos" />
          </View>
        </View>
      </ScrollView>
    </DrawerSceneWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#efefef",
  },
});
