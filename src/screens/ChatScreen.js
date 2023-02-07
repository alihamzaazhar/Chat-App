import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  TextInput,
  Image,
  KeyboardAvoidingView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useState } from "react";

const ChatScreen = () => {
  const [message, setMessage] = useState(null);

  const DATA1 = [
    {
      sendername: "you",
      message: "Hi",
    },
    {
      sendername: "other",
      message: "hello",
    },
    {
      sendername: "other",
      message: "Hi",
    },
    {
      sendername: "you",
      message: "Hi",
    },
    {
      sendername: "other",
      message: "hello",
    },
    {
      sendername: "other",
      message: "Hi",
    },
    {
      sendername: "you",
      message: "Hi",
    },
    {
      sendername: "other",
      message: "hello",
    },
    {
      sendername: "other",
      message: "Hi",
    },
    {
      sendername: "you",
      message: "Hi",
    },
    {
      sendername: "other",
      message: "hello",
    },
  ];
  return (
    <SafeAreaView style={styles.SafeAreaView}>
      <View style={styles.header}>
        <View style={styles.headerbtnContainer}>
          <TouchableOpacity>
            <Image
              source={require("../../assets/Vector.png")}
              style={styles.headerImg}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.titleText}>Chat Room</Text>
      </View>
      <View style={styles.container}>
        <KeyboardAvoidingView style={styles.chatContainer}>
          <FlatList
            data={DATA1}
            keyExtractor={(item, index) => {
              index.toString();
            }}
            showsVerticalScrollIndicator = {false}
            renderItem={({ item }) => {
              return item.sendername !== "you" ? (
                <View style={styles.otherMessage}>
                  <Text style={styles.otherMessageText}>{item.message}</Text>
                </View>
              ) : (
                <View style={styles.myMessage}>
                  <Text style={styles.myMessageText}>{item.message}</Text>
                </View>
              );
            }}
          />
        </KeyboardAvoidingView>
      </View>

      <KeyboardAvoidingView style={styles.textmsgContainer}>
        <TouchableOpacity style={styles.imgContainer}>
          <Image
            source={require("../../assets/options.png")}
            style={[styles.img, { marginHorizontal: "1%" }]}
          />
        </TouchableOpacity>
        <TextInput
          placeholder="Enter message here..."
          placeholderTextColor={"white"}
          style={styles.TextInput}
          value={message}
          onChange={(msg) => {
            setMessage(msg);
          }}
          numberOfLines={10}
        />
        <TouchableOpacity style={styles.imgContainer}>
          <Image
            source={require("../../assets/sendmessage.png")}
            style={[styles.img, { marginHorizontal: "2%" }]}
          />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  SafeAreaView: {
    flex: 1,
    backgroundColor: "#0F1828",
    marginTop: Platform.OS === "android" ? 30 : 0,
  },
  header: {
    paddingVertical: 15,
    flexDirection: "row",
  },
  headerbtnContainer: {
    marginLeft: 15,
    height: 30,
    width: 25,
  },
  headerImg: {
    height: 25.02,
    width: 13.42,
    resizeMode: "contain",
  },
  titleText: {
    fontSize: 18,
    fontFamily: "sans-serif",
    lineHeight: 30,
    color: "#F7F7FC",
    textAlign: "left",
    textAlignVertical: "top",
    marginLeft: 20,
  },
  container: {
    flex: 1,
    marginHorizontal: 10,
  },
  textmsgContainer: {
    flexDirection: "row",
    justifyContent: "center",
    height: 60,
    alignItems: "center",
  },
  chatContainer: {
    flex: 1,
  },
  TextInput: {
    width: "80%",
    height: 40,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "#152033",
    color: "white",
    borderRadius: 10,
  },
  img: {
    width: "100%",
    height: "50%",
  },
  imgContainer: {
    width: "10%",
  },
  myMessage: {
    alignSelf: "flex-end",
    height: 35,
    backgroundColor: "#375FFF",
    paddingHorizontal: "5%",
    paddingTop: 5,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    marginBottom: 5,
  },
  myMessageText: {
    color: "#F7F7FC",
    textAlign: "left",
    verticalAlign: "middle",
    lineHeight: 24,
    fontSize: 16,
    fontWeight: "normal",
    fontFamily: "sans-serif",
  },
  otherMessage: {
    height: 35,
    paddingHorizontal: "5%",
    paddingTop: 5,
    backgroundColor: "#1B2B48",
    alignSelf: "flex-start",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginTop: 5,
  },
  otherMessageText: {
    color: "#F7F7FC",
    textAlign: "left",
    verticalAlign: "middle",
    lineHeight: 24,
    fontSize: 16,
    fontWeight: "normal",
    fontFamily: "sans-serif",
  },
});
