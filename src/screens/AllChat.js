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

import { useNavigation } from "@react-navigation/native";

const AllChat = () => {

  const navigation = useNavigation()
 

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
          <View style={styles.yourStoryContainer}>
            <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('StoryCamera')}>
              <Image
                source={require("../../assets/Avatar.png")}
                style={styles.addStoryIcon}
              />
            </TouchableOpacity>
            <Text style={styles.yourstoryText}>Your Story</Text>
          </View>
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
        <View style={styles.chatContainer}></View>
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
