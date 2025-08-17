import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import PagerView from "react-native-pager-view";

interface HomeBannerProps {
  title: string;
}

export default function HomeBanner({ title }: HomeBannerProps) {
  return (
    <>
      <View
        style={{
          width: "100%",
          justifyContent: "flex-start",
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "900",
            color: "#000",
            lineHeight: 28,
            marginLeft: 36,
            marginBottom: 4,
            textDecorationLine: "underline",
          }}
        >
          {title}
        </Text>
      </View>
      <View style={styles.container}>
        <PagerView style={{ flex: 1 }} initialPage={0} pageMargin={14}>
          <Pressable
            style={styles.btn}
            key="1"
            onPress={() => console.log("Clicou no Banner 1")}
          >
            <Image
              source={require("@/assets/home-banner-1.png")}
              style={styles.img}
            />
          </Pressable>

          <Pressable
            style={styles.btn}
            key="2"
            onPress={() => console.log("Clicou no Banner 2")}
          >
            <Image
              source={require("@/assets/home-banner-2.png")}
              style={styles.img}
            />
          </Pressable>

          <Pressable
            style={styles.btn}
            key="3"
            onPress={() => console.log("Clicou no Banner 3")}
          >
            <Image
              source={require("@/assets/home-banner-3.png")}
              style={styles.img}
            />
          </Pressable>
        </PagerView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 360,
    height: 180,
    borderRadius: 16,
    marginBottom: 16,
  },
  btn: {
    width: 360,
    height: 180,
    borderRadius: 16,
  },
  img: {
    width: 360,
    height: 180,
    borderRadius: 16,
  },
});
