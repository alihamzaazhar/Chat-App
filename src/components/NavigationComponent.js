import { StyleSheet, Text, View } from "react-native";
import React, {useState, useEffect} from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTabNavigation from "./BottomTabNavigation";

import SplashScreen from '../screens/SplashScreen'
import Walkthrough from '../screens/Walkthrough'
import VerificationScreen from '../screens/VerificationScreen'
import VerificationCodeScreen from '../screens/VerificationCodeScreen'
import Profile from '../screens/Profile'
import AllChat from "../screens/AllChat";
import Contacts from '../screens/Contacts'
import StoryCamera from "../screens/StoryCamera";
import UploadStatusScreen from "../screens/UploadStatusScreen";

const Stack = createNativeStackNavigator();

const NavigationComponent = () => {
    const [showSplashScreen, setShowSplashScreen] = useState(true);
    useEffect(() => {
        setTimeout(() => {
          setShowSplashScreen(false);
        }, 1000);
      }, []);


  return ( 
  <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }} >
    {/* {showSplashScreen ? (
          <Stack.Screen name="SplashScreen" component={SplashScreen}  />
        ) : null}
      <Stack.Screen name="Walkthrough" component={Walkthrough} />  
      <Stack.Screen name="VerificationScreen" component={VerificationScreen} />
      <Stack.Screen name="VerificationCodeScreen" component={VerificationCodeScreen} />
      <Stack.Screen name="Profile" component={Profile} /> */}
      <Stack.Screen name="BottomTab" component={BottomTabNavigation} />
      <Stack.Screen name="Contacts" component={Contacts} />
      <Stack.Screen name="AllChat" component={AllChat} />
      <Stack.Screen name="StoryCamera" component={StoryCamera}/>
      <Stack.Screen name="UploadStatusScreen" component={UploadStatusScreen} />
    </Stack.Navigator>
  </NavigationContainer>
  )
};



export default NavigationComponent;

const styles = StyleSheet.create({

});
