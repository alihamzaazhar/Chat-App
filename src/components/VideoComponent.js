import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import * as MediaLibrary from "expo-media-library";
import { Camera, CameraType } from "expo-camera";
import { Video } from "expo-av";
import { useNavigation } from "@react-navigation/native";

const VideoComponent = () => {
  const [video, setVideo] = useState(null);
  const [type, setType] = useState(CameraType.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const [cameraRoll, setCameraRoll] = useState([]);
  const cameraRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const navigation = useNavigation()
  const recordVideo = async () => {
    if (cameraRef) {
      try {
        const videoRecords = await cameraRef.current.recordAsync({
          maxDuration: 30,
          quality: Camera.Constants.VideoQuality["480"],
        });
        setVideo(videoRecords.uri);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const stopVideoRecording = async () => {
    if (cameraRef) {
      cameraRef.current.stopRecording();
    }
  };

  const saveVideo = () => {
    if (video) {
      try {
        // MediaLibrary.createAssetAsync(video);
        // Alert.alert("Video Saved!");
        navigation.navigate("UploadStatusScreen", {
          videoURI: video,
          type: "video"
        })
        setVideo(null);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pauseAsync();
    } else {
      videoRef.current.playAsync();
    }
    setIsPlaying(!isPlaying);
  };
  return (
    <View style={styles.container}>
      {!video ? (
        <Camera
          style={styles.cameraContainer}
          type={type}
          flashMode={flash}
          ref={cameraRef}
          ratio={"20:9"}
          //   onCameraReady={()=> }
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
            {flash === Camera.Constants.FlashMode.torch ? (
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
                      ? Camera.Constants.FlashMode.torch
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
        <View style={styles.container}>
          <Video
            ref={videoRef}
            style={styles.videoContainer}
            source={{ uri: video }}
            resizeMode="cover"
            isLooping
          />
          <View style={styles.playAndPauseContainer}>
            <TouchableOpacity onPress={handlePlayPause}>
                {isPlaying ? (
                  <Image
                    source={require("../../assets/pause-button.png")}
                    style={styles.image}
                  />
                ) : (
                  <Image
                    source={require("../../assets/play-button.png")}
                    style={styles.image}
                  />
                )}
            </TouchableOpacity>
          </View>
        </View>
      )}
      <View style={styles.takePhotoContainer}>
        {video ? (
          <View style={styles.retakeContainer}>
            <TouchableOpacity onPress={() => setVideo(null)}>
              <Image
                source={require("../../assets/retweet.png")}
                style={styles.image}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => saveVideo()}>
              <Image
                source={require("../../assets/check.png")}
                style={styles.image}
              />
            </TouchableOpacity>
          </View>

        ) : (
          <View style={{ marginBottom: 10, height: 200 }}>
            <View style={{ height: 100 }}>
              <FlatList
                data={cameraRoll}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => item.id}
                renderItem={({ item }) => (
                  <View
                    style={{
                      paddingLeft: 2,
                      justifyContent: "center",
                    }}
                  >
                    <Image
                      source={{ uri: item.uri }}
                      style={{ height: 65, width: 55 }}
                    />
                  </View>
                )}
              />
            </View>
            <View style={styles.captureContainer}>
              <TouchableOpacity
                onLongPress={() => recordVideo()}
                onPressOut={() => stopVideoRecording()}
              >
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

export default VideoComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "gray",
  },
  cameraContainer: {
    flex: 1,
  },
  videoContainer: {
    flex: 1,
    alignSelf: "stretch",
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
  playAndPauseContainer: {
    flex: 0,
    position: "absolute",
    top: "50%",
    left: "45%",
    width: "100%",
    alignSelf: "center"
  }
});
