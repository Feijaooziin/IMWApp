import { useSupabaseUser } from "@/hooks/UserContext";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

interface HeaderProps {
  name: string;
  label?: string;
  onPress?: () => void;
}

export function Header({ name, label, onPress }: HeaderProps) {
  const { profile } = useSupabaseUser();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image style={styles.img} source={require("@/assets/logo.png")} />
        <View style={styles.user}>
          <Text style={styles.hi}>Igreja Metodista Wesleyana</Text>
          <Text style={styles.username}>Cachoeira</Text>
        </View>

        <DrawerToggleButton />
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>{name}</Text>
        {onPress && (
          <TouchableOpacity style={styles.configButton} onPress={onPress}>
            <Text style={styles.configButtonText}>{label}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#efefef",
    padding: 14,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    borderBottomWidth: 1,
    borderBottomColor: "#888",
  },
  img: {
    width: 40,
    height: 40,
    borderRadius: 100,
    marginTop: 5,
    marginBottom: 5,
  },
  user: {
    flex: 1,
    justifyContent: "center",
  },
  hi: {
    fontSize: 14,
    fontWeight: "300",
    color: "#000",
  },
  username: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
  },
  title: {
    flex: 1,
    textTransform: "uppercase",
    fontSize: 24,
    fontWeight: "900",
    color: "#000",
    lineHeight: 28,
  },
  configButton: {
    backgroundColor: "#0683bd",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  configButtonText: {
    color: "#fff",
    fontWeight: "900",
    textTransform: "uppercase",
  },
});
