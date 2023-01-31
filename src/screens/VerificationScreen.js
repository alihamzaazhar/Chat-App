import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { COUNTRIES } from "../components/Countries";
import { useNavigation } from "@react-navigation/native";
import { app, db } from "../firebase/Config";
import { getAuth, signInWithPhoneNumber} from "firebase/auth";
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { getDoc, where, collection, query, doc, getDocs } from "firebase/firestore";

const VerificationScreen = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [flag, setFlag] = useState("");
  const [isClicked, setIsClicked] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [mobile, setMobile] = useState(null)
  const [registeredNumbers, setRegisteredNumbers] = useState([])
  const [err, setErr] = useState(false)
  const navigation = useNavigation();

  const recaptchaVerifier = useRef(null);
  const auth = getAuth(app)

const getRegisteredNumbers = async() => {
  try{
   const q = query(collection(db, "Users"), where("mobile", '==', mobile))
   const querySnapshot = await getDocs(q)
   const arr = []
   querySnapshot.forEach((doc)=> {
    arr.push(
      doc.data().mobile
    )
    setRegisteredNumbers(arr)
   })
  }catch(e){
    console.log(e);
  }
}

useEffect(() => {
  getRegisteredNumbers()
}, [mobile]);



const phoneNumberformatter = () => {
    if(phoneNumber!=='' && countryCode!==''){
      const mobileNumber = `${countryCode}${phoneNumber}`
      setMobile(mobileNumber)
    }
} 

const signInwithPhoneNumber = async()=> {
  try{

    if(registeredNumbers[0] === mobile){
      console.log("This Number is already exist")
      setErr(true)
    }else{
      const confirmation = await signInWithPhoneNumber(auth, mobile, recaptchaVerifier.current);
      if(confirmation){
        navigation.navigate("VerificationCodeScreen", {
              phone: countryCode.concat(phoneNumber),
              dailingCode: countryCode,
              confirmMethod: confirmation
            })
      }
    }  
  }catch(e){
    console.log(e)
  }
}

useEffect(() => {
  phoneNumberformatter();
}, [countryCode, phoneNumber]);

  const MyModal = () => {
    const [data, setData] = useState(COUNTRIES);
    const onSearch = (text) => {
      if (text !== "") {
        let tempData = data.filter((item) => {
          return item.name.toLowerCase().indexOf(text.toLowerCase()) > -1;
        });
        setData(tempData);
      } else {
        setData(COUNTRIES);
      }
    };
    return (
      <Modal animationType="slide" transparent={false}>
        <View style={{backgroundColor: "#0F1828", flex: 1}}>
          <View style={styles.container}>
            <TextInput
              placeholder="Search your country"
              style={styles.searchInputContainer}
              placeholderTextColor={"#ffff"}
              onChangeText={(text) => onSearch(text)}
            />
            <FlatList
              data={data}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => {
                    setCountryCode(item.mobileCode);
                    setFlag(item.flag);
                    onSearch("");
                    setIsClicked(false);
                  }}
                >
                  <View style={styles.countryItems}>
                    <Image source={item.flag} style={styles.img} />
                    <Text style={{ color: "#fff", marginLeft: 20 }}>
                      {item.name} ({item.mobileCode})
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    );
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
      </View>

      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Enter Your Phone Number</Text>
        </View>
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitleText}>
            Please confirm your country code and enter your phone number
          </Text>
        </View>

        <View style={styles.phoneContainer}>
          <View style={styles.countryCodeContainer}>
            <TouchableOpacity
              onPress={() => {
                setIsClicked(!isClicked);
                setModalVisible(!isModalVisible);
              }}
            >
              {isClicked ? (
                <View style={styles.countryCode}>
                  <Image
                    source={COUNTRIES[0].flag}
                    style={styles.countryflag}
                  />
                  <Text style={styles.dailingCode}>
                    {COUNTRIES[0].mobileCode}
                  </Text>
                </View>) :                 <View style={styles.countryCode}>
                  <Image source={flag} style={styles.countryflag} />
                  <Text style={styles.dailingCode}>{countryCode}</Text>
                </View> }

            </TouchableOpacity>
          </View>
          <View style={styles.phoneInputContainer}>
            <TextInput
              style={styles.phoneNumberInput}
              value={phoneNumber}
              onChangeText={(phonenumber) => setPhoneNumber(phonenumber)}
              placeholder={"Phone Number"}
              placeholderTextColor={"#F7F7FC"}
              keyboardAppearance="dark"
              keyboardType="numeric"
              maxLength={15}
            />
          </View>
        </View>

        {err === true ? <Text style={styles.errMsg}>This number is already exist, use different number</Text> : null}
        {isClicked === true ? <MyModal /> : null}
        <View style={styles.footerbtnConainer}>
          <View style={styles.btnContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={()=> {
                signInwithPhoneNumber();
              }}
            >
              <Text style={styles.btnText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
        <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={app.options}
      />
      </View>
    </SafeAreaView>
  );
};

export default VerificationScreen;

const styles = StyleSheet.create({
  SafeAreaView: {
    flex: 1,
    backgroundColor: "#0F1828",
    marginTop: Platform.OS === "android" ? 30 : 0,
  },
  header: {
    paddingVertical: 20,
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
  container: {
    flex: 1,
    marginHorizontal: 15,
  },
  titleContainer: {
    marginTop: 70,
  },
  titleText: {
    textAlign: "center",
    color: "#F7F7FC",
    fontWeight: "bold",
    fontSize: 24,
    fontFamily: "sans-serif",
    textAlignVertical: "top",
    alignSelf: "center",
  },
  subtitleContainer: {
    marginTop: 10,
  },
  subtitleText: {
    textAlign: "center",
    color: "#F7F7FC",
    fontWeight: "400",
    fontSize: 14,
    fontFamily: "sans-serif",
    lineHeight: 24,
    textAlignVertical: "top",
    width: 295,
    alignSelf: "center",
  },
  phoneContainer: {
    width: "100%",
    marginTop: 50,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  phoneInputContainer: {
    backgroundColor: "#152033",
    width: "75%",
    borderRadius: 4,
    marginLeft: 5,
  },
  phoneNumberInput: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    textAlignVertical: "center",
    textAlign: "left",
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 24,
    fontFamily: "sans-serif",
    color: "#F7F7FC",
  },
  countryCodeContainer: {
    backgroundColor: "#152033",
    width: "23%",
    borderRadius: 4,
    justifyContent: "center",
  },
  countryflag: {
    height: 30,
    width: 30,
    resizeMode: "contain",
  },
  dailingCode: {
    fontSize: 14,
    textAlign: "left",
    lineHeight: 24,
    fontWeight: "600",
    fontFamily: "sans-serif",
    color: "#F7F7FC",
    textAlignVertical: "center",
  },
  countryCode: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  countryItems: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#ADB5BD",
  },
  searchInputContainer: {
    marginTop: 30,
    backgroundColor: "#152033",
    width: "100%",
    borderRadius: 4,
    marginLeft: 5,
    height: 50,
    color: "#fff",
  },
  footerbtnConainer: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 50
  },
  btnContainer: {
    backgroundColor: "#375FFF",
    marginTop: 18,
    height: 52,
    borderRadius: 30,
  },
  btnText: {
    color: "#F7F7FC",
    marginHorizontal: 101.5,
    marginVertical: 12,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 28,
  },
  errMsg: {
    color: "#F7F7FC",
    fontWeight: "400",
    fontSize: 14,
    fontFamily: "sans-serif",
    lineHeight: 24,
    width: "100%",
    marginTop: 10,
    alignSelf: "center",
    textAlign: "center"
  }
});
