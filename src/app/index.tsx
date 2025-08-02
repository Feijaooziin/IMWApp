import { StyleSheet, View, ActivityIndicator } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={50} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#efefef",
    alignItems: "center",
    justifyContent: "center",
  },
});
