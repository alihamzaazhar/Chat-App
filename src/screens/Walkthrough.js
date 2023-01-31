import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  Image,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
const Walkthrough = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.SafeAreaView}>
      <View style={styles.container}>
        <View style={styles.onboardImgContainer}>
          <Image
            source={require("../../assets/Illustration.png")}
            style={styles.onboardImg}
          />
        </View>
        <View style={styles.ImgcontentContainer}>
          <Text style={styles.imgContentText}>
            Connect easily with your family and friends over countries
          </Text>
        </View>
        <View style={styles.footerContainer}>
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>Terms & Privacy Policy</Text>
          </View>
          <View style={styles.btnContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate("VerificationScreen")}
            >
              <Text style={styles.btnText}>Start Messaging</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Walkthrough;

const styles = StyleSheet.create({
  SafeAreaView: {
    flex: 1,
    backgroundColor: "#0F1828",
    marginTop: Platform.OS === "android" ? 30 : 0,
  },
  container: {
    flex: 1,
    marginHorizontal: 15,
    alignItems: "center",
  },
  onboardImgContainer: {
    flex: 1,
    marginTop: 70,
  },
  onboardImg: {
    height: 271,
    width: 262,
  },
  ImgcontentContainer: {
    flex: 1,
    marginTop: 80,
  },
  imgContentText: {
    color: "#F7F7FC",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 24,
    width: 300,
    fontFamily: "sans-serif",
  },
  termsContainer: {
    marginTop: 80,
  },
  termsText: {
    color: "#F7F7FC",
    textAlign: "center",
    lineHeight: 24,
    fontSize: 14,
    fontFamily: "sans-serif",
    fontWeight: "600",
  },
  btnContainer: {
    backgroundColor: "#375FFF",
    marginTop: 18,
    height: 52,
    borderRadius: 30,
  },
  btnText: {
    color: "#F7F7FC",
    marginHorizontal: 101.5,
    marginVertical: 12,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 28,
  },
  footerContainer: {
    flex: 1,
  },
});
