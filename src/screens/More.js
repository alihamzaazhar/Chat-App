import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const More = () => {
  return (
    <View style={styles.SafeAreaView}>
     <View style={styles.header}>
       <Text style={styles.title}>More</Text>
      </View>
    </View>
  )
}

export default More

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
    alignItems: "center"
  },
  title : {
    color: "#F7F7FC",
    lineHeight: 30,
    fontSize: 24,
    fontWeight: "600",
    fontFamily: "sans-serif",
    textAlign: "left",
    textAlignVertical: "top"
 },
})