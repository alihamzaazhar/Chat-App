import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Contacts from "../screens/Contacts";
import AllChat from "../screens/AllChat";
import More from "../screens/More";
import { useNavigation } from "@react-navigation/native";

const Tab = createBottomTabNavigator();
const BottomTabNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconName;
          if (route.name === "Contacts") {
            iconName = focused
              ? require("../../assets/Menu.png")
              : require("../../assets/contacts.png");
          } else if (route.name === "AllChat") {
            iconName = focused
              ? require("../../assets/Menu1.png")
              : require("../../assets/chats.png");
          } else {
            iconName = focused
              ? require("../../assets/Menu2.png")
              : require("../../assets/more.png");
          }

          return <Image source={iconName} style={styles.img} />;
        },
        tabBarStyle: {
          backgroundColor: "#0F1828",
          borderTopWidth: 0,
          height: 65,
        },
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
      })}
    >
      <Tab.Screen name="Contacts" component={Contacts} />
      <Tab.Screen name="AllChat" component={AllChat} />
      <Tab.Screen name="More" component={More} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigation;

const styles = StyleSheet.create({
  img: {
    width: 65,
    height: 50,
  },
});
