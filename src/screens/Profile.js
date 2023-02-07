import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import Animated, { RotateInUpLeft } from "react-native-reanimated";
import BottomSheet from "reanimated-bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import { app, db } from "../firebase/Config";
import { getAuth, updateProfile } from "firebase/auth";
import { addDoc, serverTimestamp, collection, doc, setDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { async } from "@firebase/util";

const Profile = (props) => {
  const [phoneNumber, setPhoneNumber] = useState(props.route.params ? props.route.params.phoneNumber: null)
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [hasCamerPermission, setHasCameraPermission] = useState(null);
  const [image, setImage] = useState("");
  const [profile, setProfile] = useState("");
  const [progressBar, setProgressBar] = useState(0);
  const [uploading, setUploading] = useState(false);
  const navigation = useNavigation()
  const bottomSheet = useRef();
  const fall = new Animated.Value(1);
  const auth = getAuth(app);
  const storage = getStorage(app);


  const renderInner = () => {
    return (
      <View style={styles.renderInnerContainer}>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.headerText}>Upload Photo</Text>
          <Text style={styles.subheaderText}>Choose your Profile Picture</Text>
        </View>
        <View style={styles.bottomSheetBTNsContainer}>
          <TouchableOpacity
            style={[styles.btnContainer, { width: "90%" }]}
            onPress={() => openCamera()}
          >
            <Text style={styles.btnText}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btnContainer, { width: "90%" }]}
            onPress={() => pickImage()}
          >
            <Text style={styles.btnText}>Choose from Library</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btnContainer, { width: "90%" }]}
            onPress={() => bottomSheet.current.snapTo(1)}
          >
            <Text style={styles.btnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <View style={styles.bottomSheetContainer}>
        <View style={styles.panelHeader}>
          <View style={styles.panelHandle} />
        </View>
      </View>
    );
  };

  const galleryPermission = async () => {
    const galleryStatus =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    setHasGalleryPermission(galleryStatus.status === "granted");
  };
  const cameraPermission = async () => {
    const cameraStatus = await ImagePicker.requestCameraPermissionsAsync;
    setHasCameraPermission(cameraStatus.status === "granted");
  };

  const uploadImage = async () => {
    const blobImage = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new TypeError("Network Request Failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", profile, true);
      xhr.send(null);
    });
    const metadata = {
      contentType: "image/jpeg",
    };
    const storageRef = ref(
      storage,
      "profileImages/" + phoneNumber + '_' +(Math.floor(Math.random() * 100000))
    );
    const uploadTask = uploadBytesResumable(storageRef, blobImage, metadata);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        setProgressBar(progress);
        setUploading(true)
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        switch (error.code) {
          case "storage/unauthorized":
            break;
          case "storage/canceled":
            break;
          case "storage/unknown":
            break;
        }
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          setImage(downloadURL);
          setUploading(false)
        });
      }
    );
  };

  const setUserData = async () => {
    try {
      await setDoc(doc(db, "Users", auth.currentUser.uid), {
        name: firstName + (lastName ? " " + lastName : ""),
        mobile: phoneNumber,
        profileImage: image,
    });
    } catch (e) {
      console.log(e);
    }
  };
  const pickImage = async () => {
    galleryPermission();
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setProfile(result.assets[0].uri);
    }
  };

  const openCamera = async () => {
    cameraPermission();
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [9, 16],
      quality: 1,
    });
    if (!result.canceled) {
      setProfile(result.assets[0].uri);
    }
  };

  if (hasGalleryPermission === false) {
    setHasGalleryPermission(null);
  }

  if (hasCamerPermission === false) {
    setHasCameraPermission(null);
  }

  useEffect(() => {
    if (profile !== null) {
      uploadImage();
    }
  }, [profile]);

  const profileData = async () => {
    try {
      const displayName = `${firstName}${lastName}`
      updateProfile(auth.currentUser, {
        displayName: displayName,
        photoURL: profile
      }).then(()=> {
        console.log("Data uploaded Successfully")
        setUserData()
        navigation.navigate('BottomTab')
      })
      Keyboard.dismiss()
    } catch (e) {
      console.log(e);
    }
  };

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
        <Text style={styles.titleText}>Your Profile</Text>
      </View>

      <GestureHandlerRootView style={styles.container}>
        <BottomSheet
          ref={bottomSheet}
          snapPoints={[360, 0]}
          initialSnap={1}
          callbackNode={fall}
          renderContent={renderInner}
          renderHeader={renderHeader}
          enabledGestureInteraction={true}
        />

        {profile ? (
          <View style={styles.imgContainer}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => bottomSheet.current.snapTo(0)}
            >
              <Image source={{ uri: profile }} style={styles.img} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.imgContainer}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => bottomSheet.current.snapTo(0)}
            >
              <Image
                source={require("../../assets/profile_picture.png")}
                style={styles.img}
              />
            </TouchableOpacity>
          </View>
        )}

        {progressBar !== 100 && uploading === true ? (
          <View style={{marginTop: 10}}>
          <ActivityIndicator size={"large"} />
          </View>

        ) : progressBar === 100 && uploading === false ? (
          <View style={{marginTop: 10}}>
           <Text style={{fontSize: 14, color: "#F7F7FC", alignSelf: "center"}}>Your profile picture has been set.</Text>
          </View>) : null}

        <View style={styles.inputContainer}>
          <TextInput
            value={firstName}
            onChangeText={(firstName) => {
              setFirstName(firstName);
            }}
            placeholder={"First Name (Required)"}
            placeholderTextColor={"#F7F7FC"}
            style={styles.textInput}
          />
          <TextInput
            value={lastName}
            onChangeText={(lastName) => {
              setLastName(lastName);
            }}
            placeholder={"Last Name (Optional)"}
            placeholderTextColor={"#F7F7FC"}
            style={styles.textInput}
          />
        </View>
        <View style={styles.footerbtnConainer}>
          <View style={styles.btnContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                if (image !== null) {
                  profileData()
                }
              }}
            >
              <Text style={styles.btnText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  SafeAreaView: {
    flex: 1,
    backgroundColor: "#0F1828",
    marginTop: Platform.OS === "android" ? 30 : 0,
  },
  header: {
    paddingVertical: 20,
    flexDirection: "row",
  },
  headerbtnContainer: {
    marginLeft: 15,
    height: 30,
    width: 25,
  },
  headerImg: {
    height: 30.02,
    width: 20.42,
    resizeMode: "contain",
  },
  titleText: {
    fontSize: 23,
    fontFamily: "sans-serif",
    lineHeight: 30,
    color: "#F7F7FC",
    textAlign: "left",
    textAlignVertical: "top",
    marginLeft: 20,
  },
  container: {
    flex: 1,
    marginHorizontal: 15,
  },
  imgContainer: {
    justifyContent: "center",
    alignSelf: "center",
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    borderBottomLeftRadius: 102,
    borderBottomRightRadius: 102,
  },
  img: {
    width: 200,
    height: 202,
    alignSelf: "center",
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    borderBottomLeftRadius: 102,
    borderBottomRightRadius: 102,
  },
  inputContainer: {
    marginTop: 30,
    flexDirection: "column",
    justifyContent: "center",
    marginBottom: 30,
  },
  textInput: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    textAlignVertical: "center",
    textAlign: "left",
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 24,
    fontFamily: "sans-serif",
    color: "#F7F7FC",
    backgroundColor: "#152033",
    marginTop: 15,
    borderRadius: 4,
  },
  footerbtnConainer: {
    flex: 1,
    justifyContent: "flex-end"
  },
  btnContainer: {
    backgroundColor: "#375FFF",
    marginTop: 18,
    height: 52,
    borderRadius: 30,
    width: "100%",
    justifyContent: "center",
  },
  btnText: {
    color: "#F7F7FC",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 28,
  },
  bottomSheetContainer: {
    backgroundColor: "#ffff",
    shadowColor: "#333333",
    shadowOffset: { width: -1, height: -3 },
    shadowRadius: 2,
    shadowOpacity: 0.4,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: "center",
  },
  panelHandle: {
    width: 40,
    height: 7,
    backgroundColor: "#375FFF",
    marginBottom: 5,
    borderRadius: 5,
  },
  renderInnerContainer: {
    backgroundColor: "#fff",
    height: "100%",
  },
  headerText: {
    fontSize: 24,
    fontFamily: "sans-serif",
    fontWeight: "bold",
    lineHeight: 34,
    textAlignVertical: "center",
    textAlign: "center",
    marginTop: 10,
  },
  subheaderText: {
    fontSize: 15,
    fontFamily: "sans-serif",
    fontWeight: "600",
    lineHeight: 24,
    textAlignVertical: "center",
    textAlign: "center",
  },
  bottomSheetBTNsContainer: {
    marginTop: 10,
    alignItems: "center",
  },
});
