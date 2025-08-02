import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";

interface HeaderProps {
  name: string;
  label?: string;
  onPress?: () => void;
}

export function Header({ name, label, onPress }: HeaderProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const { setAuth, user } = useAuth();

  async function handleSignout() {
    setModalVisible(false);
    const { error } = await supabase.auth.signOut();
    setAuth(null);

    if (error) {
      Alert.alert("Error", "Erro ao sair da conta, tente novamente mais tarde");
      return;
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Image
            style={styles.img}
            source={{
              uri: "https://scontent-gru2-1.cdninstagram.com/v/t51.2885-19/466698498_2394222744247375_116135971975854835_n.jpg?stp=dst-jpg_s150x150_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby4xMDgwLmMyIn0&_nc_ht=scontent-gru2-1.cdninstagram.com&_nc_cat=107&_nc_oc=Q6cZ2QH4VeIoRgPkAj8-IXmLmWXmLH2Sp7gHNz7iHGXnFkF3lqxV9e_0TcnASIx9vK8tq8s&_nc_ohc=a_R2fIv3diEQ7kNvwFPjood&_nc_gid=Trw9FrbhC3IvYm6RxrLmag&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfSur31dxoboiXQYYfnGSiLR5k5SS5bzX6UtIhGhPsK9MQ&oe=6891CA09&_nc_sid=8b3546",
            }}
          />
        </TouchableOpacity>
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
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{user?.email}</Text>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={handleSignout}
            >
              <Text style={styles.modalOptionText}>Deslogar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 14,
    paddingTop: 40,
    backgroundColor: "#efefef",
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
  },

  username: {
    fontSize: 20,
    fontWeight: "700",
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

  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    width: "80%",
    borderRadius: 8,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },

  modalOption: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },

  modalOptionText: {
    fontSize: 16,
  },

  closeButton: {
    marginTop: 15,
    backgroundColor: "#0683bd",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },

  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
