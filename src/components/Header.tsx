import { useSupabaseUser } from "@/context/UserContext";
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
        <Image
          style={styles.img}
          source={{
            uri: "https://scontent-gru2-1.cdninstagram.com/v/t51.2885-19/466698498_2394222744247375_116135971975854835_n.jpg?stp=dst-jpg_s150x150_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby4xMDgwLmMyIn0&_nc_ht=scontent-gru2-1.cdninstagram.com&_nc_cat=107&_nc_oc=Q6cZ2QH4VeIoRgPkAj8-IXmLmWXmLH2Sp7gHNz7iHGXnFkF3lqxV9e_0TcnASIx9vK8tq8s&_nc_ohc=a_R2fIv3diEQ7kNvwFPjood&_nc_gid=Trw9FrbhC3IvYm6RxrLmag&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfSur31dxoboiXQYYfnGSiLR5k5SS5bzX6UtIhGhPsK9MQ&oe=6891CA09&_nc_sid=8b3546",
          }}
        />
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
    width: 50,
    height: 50,
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
