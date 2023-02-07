import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from "react-native";
import React, { useState } from "react";
import PhotoComponent from "../components/PhotoComponent";
import VideoComponent from "../components/VideoComponent";
const StoryCamera = (props) => {
  const [selected, setSelected] = useState("photo");
  console.log(props.route.params)

  // const DESIRED_RATIO = '51:23';
  // const prepareRatio = async () => {
  //             if (Platform.OS === 'android' && cameraRef.current) {
  //                 const ratios = await cameraRef.current.getSupportedRatiosAsync();

  //                 // See if the current device has your desired ratio, otherwise get the maximum supported one
  //                 // Usually the last element of "ratios" is the maximum supported ratio
  //                 const ratio = ratios.find((ratio) => ratio === DESIRED_RATIO) || ratios[ratios.length - 1];
  //                 console.log(ratios);
  //                 setRatio(ratio);
  //             }
  // };

  return (
    <View style={styles.container}>
      {selected === "photo" ? <PhotoComponent /> : <VideoComponent />}
      <View
        style={{
          backgroundColor: "#000",
          flex: 0,
          flexDirection: "column-reverse",
          paddingBottom: 40,
        }}
      >
        <View
          style={[
            styles.choiceContainer,
            selected === "photo"
              ? { paddingLeft: 70, flexDirection: "row-reverse" }
              : { paddingRight: 70, flexDirection: "row" },
          ]}
        >
          <TouchableOpacity
            style={
              selected === "photo" ? styles.centerButton : styles.leftButton
            }
            onPress={() => setSelected("photo")}
          >
            <Text style={styles.buttonText}>Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              selected === "video" ? styles.centerButton : styles.leftButton
            }
            onPress={() => setSelected("video")}
          >
            <Text style={styles.buttonText}>Video</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default StoryCamera;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "gray",
    marginTop: Platform.OS === "android" ? 30 : 0,
  },
  choiceContainer: {
    alignItems: "center",
    height: 80,
    flex: 0,
    justifyContent: "center",
    backgroundColor: "#000",
    width: "100%",
    flexDirection: "row",
  },
  centerButton: {
    justifyContent: "center",
    alignItems: "center",
    width: "20%",
    paddingHorizontal: 5,
    paddingVertical: 5,
    backgroundColor: "gray",
    borderRadius: 25,
  },
  leftButton: {
    justifyContent: "center",
    alignItems: "center",
    width: "20%",
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  buttonText: {
    color: "#F1F1F1",
  },
});
