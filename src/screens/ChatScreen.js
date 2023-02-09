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
import React, { useState, useEffect } from "react";
import { app, db } from "../firebase/Config";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

const ChatScreen = (props) => {
  const [message, setMessage] = useState(null);
  const [data, setData] = useState([]);
  const auth = getAuth(app);
  const navigation = useNavigation();

  // console.log(props.route.params)

  useEffect(() => {
    getMsg();
  }, []);

  useEffect(() => {
    if(message){
      getMsg();
    }
  }, []);

  const sendingMsg = async () => {
    const querySnapshot = await getDocs(collection(db, "Chats"));
    querySnapshot.forEach(async (doc) => {
        const chatsRef = collection(db, "Chats", doc.id, "messages");
        if (message) {
          try {
            const msgRef = await addDoc(chatsRef, {
              sender_id: auth.currentUser.uid,
              sender_name: auth.currentUser.displayName,
              textmessage: message,
              time: serverTimestamp(),
              reciever_id: props.route.params.userID,
            });
            console.log(msgRef.id, "send msg");
            getMsg()
          } catch (e) {
            console.log(e);
          }
        }
        setMessage(null);
      })
  };

  const sendMsg = async () => {
    const querySnapshot = await getDocs(collection(db, "Chats"));
    if (querySnapshot.docs.length === 0) {
      try {
        const ref = await addDoc(collection(db, "Chats"), {
          contact1_uid: auth.currentUser.uid,
          contact1_name: auth.currentUser.displayName,
          contact1_avatar: auth.currentUser.photoURL,
          contact1_phoneNumber: auth.currentUser.phoneNumber,
          contact2_uid: props.route.params.userID,
          contact2_name: props.route.params.username,
          contact2_avatar: props.route.params.profileImage,
          contact2_phoneNumber: props.route.params.phoneNumber,
        });
        console.log(ref.id, "When new Chat start");
        sendingMsg();
      } catch (e) {
        console.log(e);
      }
    }else{
      sendingMsg();
    }
  }

  const getMsg = async () => {
    const q = query(
      collection(db, "Chats"),
      where("contact2_uid", "==", props.route.params.userID)
    );
    const querySnap = await getDocs(q);
    const data = [];
    querySnap.forEach((doc) => {
      data.push(doc.data());
    });
    if (data.length === 0) {
      // try {
      //   if (message) {
      //     const ref = await addDoc(collection(db, "Chats"), {
      //       contact1_uid: auth.currentUser.uid,
      //       contact1_name: auth.currentUser.displayName,
      //       contact1_avatar: auth.currentUser.photoURL,
      //       contact1_phoneNumber: auth.currentUser.phoneNumber,
      //       contact2_uid: props.route.params.userID,
      //       contact2_name: props.route.params.username,
      //       contact2_avatar: props.route.params.profileImage,
      //       contact2_phoneNumber: props.route.params.phoneNumber,
      //     });
      //     console.log(ref.id);
      //   }
      // } catch (e) {
      //   console.log(e);
      // }      

    }
    const querySnapshot = await getDocs(collection(db, "Chats"));
    querySnapshot.forEach(async (doc) => {
      const chatsRef = collection(db, "Chats", doc.id, "messages");
      const q = query(chatsRef, orderBy("time", "desc"));
      const unsub = onSnapshot(q, (querySnapshot) => {
        const chat = [];
        querySnapshot.forEach((doc) => {
          chat.push(doc.data());
        });
        setData(chat);
      });
    });
  };

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
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={require("../../assets/Vector.png")}
              style={styles.headerImg}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.titleText}>{props.route.params.username}</Text>
      </View>
      <View style={styles.container}>
        <KeyboardAvoidingView style={styles.chatContainer}>
          <FlatList
            data={data}
            inverted
            keyExtractor={(item, index) => {
              return index.toString();
            }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              return item.sender_id !== auth.currentUser.uid ? (
                <View style={styles.otherMessage}>
                  <Text style={styles.otherMessageText}>
                    {item.textmessage}
                  </Text>
                  <Text style={styles.reciever_time}>
                    {item.time
                      .toDate()
                      .toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                  </Text>
                </View>
              ) : (
                <View style={styles.myMessage}>
                  <Text style={styles.myMessageText}>{item.textmessage}</Text>
                  <Text style={styles.reciever_time}>
                    {item.time
                      ? item.time
                          .toDate()
                          .toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "numeric",
                          })
                      : null}
                  </Text>
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
          onChangeText={(msg) => {
            setMessage(msg);
          }}
          numberOfLines={10}
        />
        <TouchableOpacity
          style={styles.imgContainer}
          onPress={() => {
            sendMsg();
          }}
        >
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
    height: 50,
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
    height: 50,
    paddingTop: 5,
    backgroundColor: "#1B2B48",
    alignSelf: "flex-start",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginTop: 5,
    paddingLeft: "2%",
    paddingRight: "5%",
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
  reciever_time: {
    color: "#ADB5BD",
    textAlign: "left",
    verticalAlign: "top",
    lineHeight: 16,
    fontSize: 10,
    fontWeight: "normal",
    fontFamily: "sans-serif",
  },
});
