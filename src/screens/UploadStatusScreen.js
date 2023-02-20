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
import { app, db } from "../firebase/Config";
import { getAuth } from "firebase/auth/react-native";
import { addDoc, collection, doc, serverTimestamp } from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
const UploadStatusScreen = (props) => {
  const navigation = useNavigation();
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState('')
  const [video, setVideo] = useState('')
  const [uploading, setUploading] = useState(0)
  const auth = getAuth(app);
  const [url, setUrl] = useState(null)
  const storage = getStorage(app);


  useEffect(() => {
    if(props.route.params.videoURI){
      setVideo(props.route.params.videoURI)
    }
    if(props.route.params.imageURI){
      setImage(props.route.params.imageURI)
    }
  }, []);

  useEffect(() => {
    if(url){
      storyData()
      navigation.navigate("BottomTab", {
        screen: "AllChat",
        // params: {
        //   Caption: caption ? caption : "",
        //   uri:props.route.params.imageURI || props.route.params.videoURI,
        //   contentType: props.route.params.type,
        //   userID: auth.currentUser.uid,
        //   storyCreationTime: serverTimestamp()
        // },
      })
    }
  }, [url]);


  const uploadingContent = image || video

  const uploadStory = async () => {
    const blobImage = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new TypeError("Network Request Failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uploadingContent, true);
      xhr.send(null);
    });

    let metadata = {}
    if(image){
      metadata.contentType =  "image/jpg"
    }
    else if(video){    
        metadata.contentType = "video/mp4"     
    }
    
    const storageRef = ref(
      storage,
      "status/" + auth.currentUser.displayName + '_' +(Math.floor(Math.random() * 100000))
    );
    const uploadTask = uploadBytesResumable(storageRef, blobImage, metadata);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        setUploading(progress)
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
          setUrl(downloadURL)
          
        });
      }
    );
  };


  const storyData = async () => {
    try{
      const userRef =  doc(db, "Users", auth.currentUser.uid)
      const userStatusRef = await addDoc(collection(userRef, "statuses"), {
        caption: caption ? caption : "",
        uri: url,
        contentType: props.route.params.type,
        userID: auth.currentUser.uid,
        userName: auth.currentUser.displayName,
        createdAt: serverTimestamp()
      });
      console.log("Document written with ID: ", userStatusRef.id);
    }catch(e){
        console.log(e)
    }
  };

  return (
    <View style={styles.SafeAreaView}>
      <View style={styles.container}>
        {props.route.params.imageURI ? (
          <View style={styles.contentContainer}>
            <Image
              source={{ uri: props.route.params.imageURI }}
              style={styles.Image}
            />
          </View>
        ) : props.route.params.videoURI ? (
          <View style={styles.contentContainer}>
            <Video
              source={{ uri: props.route.params.videoURI }}
              style={styles.Video}
              resizeMode="cover"
              isLooping
              useNativeControls
            />
          </View>
        ) : (
          <View>
            <Text>No image or video found</Text>
          </View>
        )}

        <KeyboardAvoidingView style={styles.captionContainer}>
          <View style={styles.TextInputContainer}>
            <TextInput
              placeholder="Add a caption..."
              placeholderTextColor={"#F1F1F1"}
              style={styles.TextInput}
              multiline={true}
              value={caption}
              onChangeText={(text) => {
                setCaption(text);
              }}
            />
          </View>
          <View style={styles.sendIconContainer}>
            <TouchableOpacity
              onPress={() => {
                uploadStory()
              }}
            >
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
    alignSelf: "stretch",
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
