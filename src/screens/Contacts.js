import {
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import * as Contact from "expo-contacts";
import { app, db } from "../firebase/Config";
import { getAuth } from "firebase/auth";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
const Contacts = () => {
  const [phoneContacts, setPhoneContacts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [data, setData] = useState([]);
  const auth = getAuth(app);
  const navigation = useNavigation()

  const getUsersData = async () => {
    try {
      const res = collection(db, "Users");
      const unsub = onSnapshot(res, (snapshot) => {
        let data = [];
        snapshot.forEach((doc) => {
          const firestoreContacts = doc.data();
          phoneContacts.forEach((contacts) => {
            if (firestoreContacts.mobile === contacts.phoneNumber) {
              data.push({
                username: firestoreContacts.name,
                phoneNumber: firestoreContacts.mobile,
                profile: firestoreContacts.profileImage,
                uid: doc.id
              });
            }
          });
          setContacts(data);
          setData(data)
        });
      });
    } catch (e) {
      console.log(e);
    }
  };



 
    const onSearch = (text) => {
      if (text !== "") {
        let tempData = data.filter((item) => {
          return item.username.toLowerCase().indexOf(text.toLowerCase()) > -1;
        });
        setData(tempData);
      } else {
        setData(contacts);
      }
    };


  useEffect(() => {
    getUsersData();
  }, [phoneContacts]);

  useEffect(() => {
    (async () => {
      const { status } = await Contact.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contact.getContactsAsync({
          fields: [Contact.Fields.PhoneNumbers],
        });
        if (data.length > 0) {
          const allData = data.map((allNumbers) => ({
            username:
              allNumbers.firstName +
              (allNumbers.lastName ? " " + allNumbers.lastName : ""),
            phoneNumber: allNumbers.phoneNumbers
              ? allNumbers.phoneNumbers[0].number.replace(/ /g, "")
              : null,
          }));
          setPhoneContacts(allData);
        }
      }
    })();
  }, []);

  const startChat = ({item}) => {
    navigation.navigate("ChatScreen", {
      username: item.username,
      profileImage: item.profile,
      phoneNumber: item.phoneNumber,
      userID: item.uid
    })
  }
  return (
    <View style={styles.SafeAreaView}>
      <View style={styles.header}>
        <Text style={styles.title}>Contacts</Text>
        <TouchableOpacity>
          <Image
            source={require("../../assets/addContacts.png")}
            style={styles.img}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
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
            onChangeText={(text) => onSearch(text)}
          />
        </View>

        <FlatList
          data={contacts}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={()=> {startChat({item})}}>
            <View style={styles.flatlistContainer}>
              <Image source={{uri : item.profile}} style={styles.img_contacts} />
              <View style={styles.usernameContainer}>
              <Text style={styles.username}>
                {item.username}
                  {/* // .split(" ")
                  // .map((word) => 
                  //     (word[0] === word[0].toUpperCase()) ? word : word[0].toUpperCase() + word.slice(1))
                  // .join(" ")} */}
              </Text>
              <Text style={styles.phoneNumber}>{item.phoneNumber}</Text>
              </View>
            </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

export default Contacts;

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
  username: {
    color: "#F7F7FC",
    fontSize: 14,
    textAlign: "left",
    textAlignVertical: "center",
    fontWeight: "normal",
    fontFamily: "sans-serif"
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
    alignSelf: "center"
  },
  usernameContainer: {
    flexDirection: "column",
    marginLeft: 20,
    justifyContent: "space-evenly"
  },
  phoneNumber: {
    color: "#ADB5BD",
    fontSize: 12,
    textAlign: "left",
    textAlignVertical: "center",
    fontWeight: "normal",
    fontFamily: "sans-serif"
  }
});
