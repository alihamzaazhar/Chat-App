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
import ViewStoryComponent from '../components/ViewStoryComponent'
const AllChat = (props) => {
  const auth = getAuth(app);
  const [data, setData] = useState([]);
  const navigation = useNavigation();
  const [propsData, setPropsData] = useState(null);
  const [currentUserData, setCurrentUserData] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        let allUsersData = [];
        let counter = 1;
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
              });
            });
            allUsersData.push({
              username: "user " + counter,
              statusData: data,
            });
            setData(allUsersData);
            counter++;
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
            });
            setCurrentUserData(mydata);
          });
        });
      }
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
          {currentUserData === null ? (
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
          <View style={styles.othersStoryContainer}></View>
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
});
