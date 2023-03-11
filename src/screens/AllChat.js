import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React from "react";
import { app, db } from "../firebase/Config";
import { getAuth } from "firebase/auth";
import {
  collection,
  onSnapshot,
  doc,
  getDocs,
  collectionGroup,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import ViewStoryComponent from "../components/ViewStoryComponent";
import { FlatList } from "react-native-gesture-handler";
const AllChat = () => {
  const auth = getAuth(app);
  const [data, setData] = useState([]);
  const navigation = useNavigation();
  const [propsData, setPropsData] = useState(null);
  const [currentUserData, setCurrentUserData] = useState([]);
  const [chatData, setChatData] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        let allUsersData = [];
        const querySnapshot = await getDocs(collection(db, "Users"));
        querySnapshot.forEach((doc) => {
          let data = [];
          const userRef = collection(db, "Users", doc.id, "statuses");
          const unsub = onSnapshot(userRef, (snapshot) => {
            snapshot.forEach((doc) => {
              const userStatuses = doc.data();
              data.push({
                ContentTYPE: userStatuses.contentType,
                ContentURI: userStatuses.uri,
                Caption: userStatuses.caption,
                createdAt: userStatuses.createdAt,
                postedBy: userStatuses.userID,
                username: userStatuses.userName,
                finish: 0
              });
            });
            if(doc.data().mobile !== auth.currentUser.phoneNumber){
              allUsersData.push({
                username: doc.data().name,
                profileImage: doc.data().profileImage,
                statusData: data,
              });
            }
            setData(allUsersData);
          });
        });
        // for( let i in userIDs){
        //   const userRef =  collection(db, "Users", userIDs[i], "statuses")
        //   const unsub = onSnapshot(userRef, (snapshot) => {
        //     let data = [];
        //     snapshot.forEach((doc) => {
        //       const userStatuses = doc.data()
        //       data.push(
        //         {
        //           ContentTYPE: userStatuses.contentType,
        //           ContentURI: userStatuses.uri
        //         }
        //       )
        //       });
        //       setData(data)
        //   });
        // }
      } catch (e) {
        console.log(e);
      }
    })();
    myyStatusData();
  }, []);

  const myyStatusData = async () => {
    const finish = 0
    const querySnapshot = await getDocs(collection(db, "Users"));
    querySnapshot.forEach((doc) => {
      if (doc.id === auth.currentUser.uid) {
        const userRef = collection(
          db,
          "Users",
          auth.currentUser.uid,
          "statuses"
        );
        let mydata = [];
        const unsub = onSnapshot(userRef, (snapshot) => {
          snapshot.forEach((doc) => {
            const userStatuses = doc.data();
            mydata.push({
              ContentTYPE: userStatuses.contentType,
              ContentURI: userStatuses.uri,
              Caption: userStatuses.caption,
              createdAt: userStatuses.createdAt,
              postedBy: userStatuses.userID,
              username: userStatuses.userName,
              finish: finish
            });
            setCurrentUserData(mydata);
          });
        });
      }
    });
  };
  useEffect(() => {
    getChats();
  }, []);
  const getChats = async () => {
    const chatsref = await getDocs(collection(db, "Chats"));
    chatsref.forEach((doc) => {
      const allData = [];
      allData.push({
        reciever_id: doc.data().contact1_uid,
        reciever_name: doc.data().contact1_name,
        reciever_phoneNumber: doc.data().contact1_phoneNumber,
        reciever_image: doc.data().contact1_avatar,
      });
      setChatData(allData);
    });
  };

  const startChat = ({ item }) => {
    navigation.navigate("ChatScreen", {
      username: item.reciever_name,
      profileImage: item.reciever_image,
      phoneNumber: item.reciever_phoneNumber,
      userID: item.reciever_id,
    });
  };

  const sendStatus = ({ item }) => {
    navigation.navigate("ViewStoryComponent", {
      data: item.statusData,
      username: item.username,
      profileImage: item.profileImage
    });
  };


  return (
    <View style={styles.SafeAreaView}>
      <View style={styles.header}>
        <Text style={styles.title}>Chats</Text>
        <View style={styles.imgContainer}>
          <TouchableOpacity>
            <Image
              source={require("../../assets/new-msg.png")}
              style={styles.img}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={require("../../assets/hamgurger.png")}
              style={[styles.img, { height: 22 }]}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.storiescontainer}>
          {currentUserData.length === 0 ? (
            <View style={styles.yourStoryContainer}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.navigate("StoryCamera")}
              >
                <Image
                  source={require("../../assets/Avatar.png")}
                  style={styles.addStoryIcon}
                />
              </TouchableOpacity>
              <Text style={styles.yourstoryText}>Your Story</Text>
            </View>
          ) : (
            <View style={styles.yourStoryContainer}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  if (currentUserData.length > 0) {
                    navigation.navigate("ViewStoryComponent", {
                      data: currentUserData
                    })
                  }
                }}
              >
                <Image
                  source={{ uri: auth.currentUser.photoURL }}
                  style={styles.addStoryIcon}
                />
              </TouchableOpacity>
              <Text style={styles.yourstoryText}>
                {auth.currentUser.displayName.toUpperCase()}
              </Text>
            </View>
          )}
          <View style={styles.othersStoryContainer}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={data}
              keyExtractor={(item, index) => {
                return index.toString();
              }}
              renderItem={({ item }) => {
                return (
                  <View style={{ height: 58, marginTop: 15}}>
                    <TouchableOpacity onPress={()=> {
                       sendStatus({ item });
                    }}>
                    <Image source={{uri: item.profileImage}} style={styles.otherusersProfile}/>
                    </TouchableOpacity>                   
                    <Text style={styles.yourstoryText}>{item.username.toUpperCase()}</Text>
                  </View>
                );
              }}
            />
          </View>
        </View>
        <View style={styles.searchBar}>
          <Image
            source={require("../../assets/searchIcon.png")}
            style={{ height: 30, width: 30, marginLeft: 5 }}
          />
          <TextInput
            placeholder="Search"
            placeholderTextColor={"#ADB5BD"}
            style={styles.TextInput}
            keyboardAppearance={"dark"}
            // onChangeText={(text) => onSearch(text)}
          />
        </View>
        <View style={styles.chatContainer}>
          <FlatList
            data={chatData}
            keyExtractor={(item, index) => {
              return index.toString();
            }}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    startChat({ item });
                  }}
                >
                  <View style={styles.flatlistContainer}>
                    <Image
                      source={{ uri: item.reciever_image }}
                      style={styles.img_contacts}
                    />
                    <View style={styles.usernameContainer}>
                      <Text style={styles.username}>{item.reciever_name}</Text>
                      <Text style={styles.phoneNumber}>
                        {item.reciever_phoneNumber}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default AllChat;

const styles = StyleSheet.create({
  SafeAreaView: {
    flex: 1,
    backgroundColor: "#0F1828",
    marginTop: Platform.OS === "android" ? 30 : 0,
  },
  header: {
    height: 70,
    marginHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: "#F7F7FC",
    lineHeight: 30,
    fontSize: 24,
    fontWeight: "600",
    fontFamily: "sans-serif",
    textAlign: "left",
    textAlignVertical: "top",
  },
  imgContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  img: {
    height: 29,
    width: 29,
    marginLeft: 8,
  },
  container: {
    flex: 1,
    backgroundColor: "#0F1828",
    marginHorizontal: 15,
  },
  searchBar: {
    backgroundColor: "#152033",
    flexDirection: "row",
    borderColor: "#fff",
    alignItems: "center",
    marginTop: 20,
    borderRadius: 4,
  },
  TextInput: {
    width: "100%",
    fontSize: 18,
    marginLeft: 5,
    height: 40,
    color: "#ADB5BD",
  },
  storiescontainer: {
    height: 108,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  yourStoryContainer: {
    flexDirection: "column",
  },
  addStoryIcon: {
    height: 60,
    width: 60,
    borderRadius: 10,
    alignSelf: "center",
  },
  yourstoryText: {
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 10,
    fontFamily: "sans-serif",
    fontWeight: "normal",
    lineHeight: 20,
    color: "#F7F7FC",
  },
  username: {
    color: "#F7F7FC",
    fontSize: 14,
    textAlign: "left",
    textAlignVertical: "center",
    fontWeight: "normal",
    fontFamily: "sans-serif",
  },
  flatlistContainer: {
    flexDirection: "row",
    height: 58,
    marginVertical: 20,
  },
  img_contacts: {
    height: 56,
    width: 56,
    borderRadius: 16,
    alignSelf: "center",
  },
  usernameContainer: {
    flexDirection: "column",
    marginLeft: 20,
    justifyContent: "space-evenly",
  },
  phoneNumber: {
    color: "#ADB5BD",
    fontSize: 12,
    textAlign: "left",
    textAlignVertical: "center",
    fontWeight: "normal",
    fontFamily: "sans-serif",
  },
  othersStoryContainer: {
    width: "100%",
    height: 108,
    justifyContent: "center",
    marginLeft: 20
  },
  otherusersProfile: {
    height: 60,
    width: 60,
    borderRadius: 10,
    alignSelf: "center",
  }
});
