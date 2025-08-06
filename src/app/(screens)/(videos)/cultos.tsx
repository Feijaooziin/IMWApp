import { View, Text, StyleSheet } from "react-native";
import { useVideos } from "@/hooks/useVideos";
import { DrawerSceneWrapper } from "@/components/drawer-Scene-wrapper";
import { Header } from "@/components/Header";
import { VideoList } from "@/components/VideoList";

export default function Cultos() {
  const { videos, loading } = useVideos("cultos");

  return (
    <DrawerSceneWrapper>
      <Header name="Cultos Gravados" />
      <View style={styles.container}>
        <VideoList data={videos} loading={loading} />
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
