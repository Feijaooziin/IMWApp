import { GoogleSignin } from "@react-native-google-signin/google-signin";

import { StyleSheet, View, ActivityIndicator } from "react-native";
GoogleSignin.configure({
  webClientId:
    "682310866995-231q6ikha3j4o8tqd06oa9cn85llhlsi.apps.googleusercontent.com",
});

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
