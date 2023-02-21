import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
  FlatList,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import * as MediaLibrary from "expo-media-library";
import { Camera, CameraType } from "expo-camera";
import * as ImageManipulator from 'expo-image-manipulator';
import { FlipType } from "expo-image-manipulator";
import { useNavigation } from "@react-navigation/native";

const PhotoComponent = () => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasAudioPermission, setHasAudioPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(CameraType.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const [cameraRoll, setCameraRoll] = useState([]);
  const cameraRef = useRef(null);
  const navigation = useNavigation()

  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");
      const audioStatus = await Camera.requestMicrophonePermissionsAsync();
      setHasAudioPermission(audioStatus.status === "granted");
    })();

    (async () => {
      const { assets } = await MediaLibrary.getAssetsAsync({
        first: 30,
        sortBy: ["creationTime"],
        mediaType: ["photo"],
      });
      setCameraRoll(assets);
    })();
  }, []);

  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  if (hasAudioPermission === false) {
    return <Text>No access to audio</Text>;
  }

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const options = {quality: 0};
        let data = await cameraRef.current.takePictureAsync(options);
        if(type === CameraType.front){
          data = await ImageManipulator.manipulateAsync(data.uri, [
            {rotate: 180},
            {flip: ImageManipulator.FlipType.Vertical}
          ])
        }
        setImage(data.uri);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const saveImage = async () => {
    if (image) {
      try {
        // await MediaLibrary.createAssetAsync(image);
        // Alert.alert("Picture Saved!");
        navigation.navigate("UploadStatusScreen", {
          imageURI: image,
          type: "image",
        })
        setImage(null);
        (async () => {
          const { assets } = await MediaLibrary.getAssetsAsync({
            first: 30,
            sortBy: [MediaLibrary.SortBy.creationTime],
            mediaType: MediaLibrary.MediaType.photo,
          });
          setCameraRoll(assets);
        })();
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <View style={styles.container}>
      {!image ? (
        <Camera
          style={styles.cameraContainer}
          type={type}
          flashMode={flash}
          ref={cameraRef}
          ratio={"20:9"}
          mirror={false}
          // onCameraReady={()=> prepareRatio()}
        >
          <View style={styles.insideCameraContainer}>
            <TouchableOpacity
              onPress={() => {
                setType(
                  type === CameraType.back ? CameraType.front : CameraType.back
                );
              }}
            >
              <Image
                source={require("../../assets/switch-camera.png")}
                style={{ height: 35, width: 35 }}
              />
            </TouchableOpacity>
            {flash === Camera.Constants.FlashMode.on ? (
              <TouchableOpacity
                onPress={() => {
                  setFlash(
                    flash === Camera.Constants.FlashMode.off
                      ? Camera.Constants.FlashMode.on
                      : Camera.Constants.FlashMode.off
                  );
                }}
              >
                <Image
                  source={require("../../assets/thunder.png")}
                  style={{ height: 35, width: 35 }}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setFlash(
                    flash === Camera.Constants.FlashMode.off
                      ? Camera.Constants.FlashMode.on
                      : Camera.Constants.FlashMode.off
                  );
                }}
              >
                <Image
                  source={require("../../assets/no-flash.png")}
                  style={{ height: 35, width: 35 }}
                />
              </TouchableOpacity>
            )}
          </View>
        </Camera>
      ) : (
        <Image source={{ uri: image }} style={styles.cameraContainer} />
      )}
      <View style={styles.takePhotoContainer}>
        {image ? (
          <View style={styles.retakeContainer}>
            <TouchableOpacity onPress={() => setImage(null)}>
              <Image
                source={require("../../assets/retweet.png")}
                style={styles.image}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => saveImage()}>
              <Image
                source={require("../../assets/check.png")}
                style={styles.image}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{marginBottom: 10, height: 200}}>
            <View style={{height: 100}}>
            <FlatList 
            data={cameraRoll}
            horizontal
            showsHorizontalScrollIndicator = {false}
            keyExtractor={(item, index) => item.id}
            renderItem = {({item}) => (
              <View style={{    
               paddingLeft: 2,
               justifyContent: "center"
              }}>
                <Image source={{uri : item.uri}} style={{height: 65, width: 55}}/>
              </View>
            )}
            />
            </View>
            <View style={styles.captureContainer}>
              <TouchableOpacity onPress={() => takePicture()}>
                <Image
                  source={require("../../assets/take_picture.png")}
                  style={styles.image}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default PhotoComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "gray",
  },
  cameraContainer: {
    flex: 1,
  },
  takePhotoContainer: {
    flex: 0,
    position: "absolute",
    top: "90%",
    width: "100%",
    height: 50,
    justifyContent: "center",
  },
  image: {
    height: 45,
    width: 45,
  },
  retakeContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  captureContainer: {
    alignItems: "center",
  },
  insideCameraContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    marginTop: 20,
  },
});
