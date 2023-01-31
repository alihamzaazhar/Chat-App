import { StyleSheet, Text, View, Image } from 'react-native'
import React, {useEffect} from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useNavigation } from '@react-navigation/native'
import { app } from '../firebase/Config'


const SplashScreen = () => {
  const navigation = useNavigation();
  const auth = getAuth(app)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {

      //   if(user.displayName !== null){
      //     navigation.replace('Profile');
      //   }else if (user){
      //     navigation.replace('Profile')
      //   }       
      // // }else{
      // //   navigation.replace('Walkthrough')
      // //   console.log(user)

      if(user){      
        if(user.displayName === null){
          navigation.replace("Profile")
        }else{
           navigation.replace("BottomTab")
        }  
      }else{
        navigation.replace('Walkthrough')
      }
    });
    return unsubscribe;
  }, []);
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/chatIcon.png')} style={styles.img}/>
    </View>
  )
}

export default SplashScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#0F1828"
  },
  img: {
    height: "30%",
    width: "30%",
    resizeMode: "contain",
    alignSelf: "center",

  }
})