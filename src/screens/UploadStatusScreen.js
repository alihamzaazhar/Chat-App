import {
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Video } from "expo-av";

const UploadStatusScreen = (props) => {
  const navigation = useNavigation();
  const [caption, setCaption] = useState('')
  return (
    <View style={styles.SafeAreaView}>
      <View style={styles.container}>
        {props.route.params.imageURI !== null ? (
          <View style={styles.contentContainer}>
            <Image
              source={{ uri: props.route.params.imageURI }}
              style={styles.Image}
            />
          </View>
        ) : (
          <View style={styles.contentContainer}>
            <Video
              source={{ uri: props.route.params.videoURI }}
              style={styles.Video}
              resizeMode="cover"
              isLooping
            />
          </View>
        )}

        <KeyboardAvoidingView style={styles.captionContainer}>
          <View style={styles.TextInputContainer}>
            <TextInput
              placeholder="Add a caption..."
              placeholderTextColor={"#F1F1F1"}
              style={styles.TextInput}
              multiline={true}
            />
          </View>
          <View style={styles.sendIconContainer}>
            <TouchableOpacity onPress={()=> {navigation.navigate("BottomTab")}}>
              <Image
                source={require("../../assets/send.png")}
                style={styles.sendIcon}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

export default UploadStatusScreen;

const styles = StyleSheet.create({
  SafeAreaView: {
    flex: 1,
    backgroundColor: "#0F1828",
    marginTop: Platform.OS === "android" ? 30 : 0,
  },
  container: {
    flex: 1,
  },
  Image: {
    height: "100%",
    width: "100%",
  },
  Video: {
    flex: 1,
  },
  contentContainer: {
    height: "90%",
  },
  TextInputContainer: {
    backgroundColor: "#152033",
    height: 45,
    borderRadius: 23,
    elevation: 10,
    width: "85%",
    justifyContent: "center",
  },
  TextInput: {
    paddingLeft: 30,
    fontSize: 16,
    color: "#F1F1F1",
    paddingRight: 30,
  },
  sendIcon: {
    height: 35,
    width: 35,
  },
  captionContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    height: "10%",
    alignItems: "center",
    marginHorizontal: 10,
  },
  sendIconContainer: {
    justifyContent: "center",
    height: 45,
    marginRight: 2,
  },
});
