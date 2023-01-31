import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import {app, db} from '../firebase/Config'
import { getAuth } from "firebase/auth/react-native";

const VerificationCodeScreen = (props) => {

  const auth = getAuth(app)

  const [number, setNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(null)
  const [code1, setCode1] = useState("");
  const [code2, setCode2] = useState("");
  const [code3, setCode3] = useState("");
  const [code4, setCode4] = useState("");
  const [code5, setCode5] = useState("");
  const [code6, setCode6] = useState("");
  const [verificationCode, setVerificationCode] = useState(null);


  const code1Ref = useRef(null);
  const code2Ref = useRef(null);
  const code3Ref = useRef(null);
  const code4Ref = useRef(null);
  const code5Ref = useRef(null);
  const code6Ref = useRef(null);
  const navigation = useNavigation();
  const numberFormatter = () => {
    const phoneNumber = props.route.params.phone;
    const countryCode = props.route.params.dailingCode;
    setPhoneNumber(phoneNumber)
    if (countryCode.length == 2) {
      let formattedNumber =
        phoneNumber.slice(0, 2) +
        " " +
        phoneNumber.slice(2, 5) +
        "-" +
        phoneNumber.slice(6, 9) +
        "-" +
        phoneNumber.slice(9, 13);
      setNumber(formattedNumber);
    } else if (countryCode.length == 3) {
      let formattedNumber =
        phoneNumber.slice(0, 3) +
        " " +
        phoneNumber.slice(3, 6) +
        "-" +
        phoneNumber.slice(6, 9) +
        "-" +
        phoneNumber.slice(9, 13);
      setNumber(formattedNumber);
    } else {
      let formattedNumber =
        phoneNumber.slice(0, 4) +
        " " +
        phoneNumber.slice(4, 7) +
        "-" +
        phoneNumber.slice(7, 10) +
        "-" +
        phoneNumber.slice(10, 14);
      setNumber(formattedNumber);
    }
  };
  const handleVerificationCode = () => {
    if (
      code1 !== "" &&
      code2 !== "" &&
      code3 !== "" &&
      code4 !== "" &&
      code5 !== "" &&
      code6 !== ""
    ) {
      const code = `${code1}${code2}${code3}${code4}${code5}${code6}`;
      setVerificationCode(code);
    }
  };

  const confirmCode = async() => {
    try{
      const verification = await props.route.params.confirmMethod
      console.log(verification)

        const res = await verification.confirm(verificationCode)
        console.log(res)
        navigation.navigate('Profile', {
          phoneNumber: phoneNumber
        })
      

    }catch(e){
      console.log(e)
    }
  }

  useEffect(() => {
    numberFormatter();
  }, []);


  useEffect(() => {
    handleVerificationCode();
  }, [code6]);


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
          <Text style={styles.titleText}>Enter Code</Text>
        </View>
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitleText}>
            We have sent you an SMS with the code to {number}
          </Text>
        </View>

        <View style={styles.codeContainer}>
          <TextInput
            ref={code1Ref}
            value={code1}
            style={styles.TextInput}
            keyboardType={"number-pad"}
            maxLength={1}
            onChangeText={(code1) => {
              setCode1(code1);
              if (code1 !== "") {
                code2Ref.current.focus();
              }
            }}
          />
          <TextInput
            ref={code2Ref}
            value={code2}
            style={styles.TextInput}
            keyboardType={"number-pad"}
            maxLength={1}
            onChangeText={(code2) => {
              setCode2(code2);
              if (code2 !== "") {
                code3Ref.current.focus();
              }
            }}
          />
          <TextInput
            ref={code3Ref}
            value={code3}
            style={styles.TextInput}
            keyboardType={"number-pad"}
            maxLength={1}
            onChangeText={(code3) => {
              setCode3(code3);
              if (code3 !== "") {
                code4Ref.current.focus();
              }
            }}
          />
          <TextInput
            ref={code4Ref}
            value={code4}
            style={styles.TextInput}
            keyboardType={"number-pad"}
            maxLength={1}
            onChangeText={(code4) => {
              setCode4(code4);
              if (code4 !== "") {
                code5Ref.current.focus();
              }
            }}
          />
          <TextInput
            ref={code5Ref}
            value={code5}
            style={styles.TextInput}
            keyboardType={"number-pad"}
            maxLength={1}
            onChangeText={(code5) => {
              setCode5(code5);
              if (code5 !== "") {
                code6Ref.current.focus();
              }
            }}
          />
          <TextInput
            ref={code6Ref}
            value={code6}
            style={styles.TextInput}
            keyboardType={"number-pad"}
            maxLength={1}
            onChangeText={(code6) => {
              setCode6(code6);
            }}
          />
        </View>

        <View style={styles.resendCodeContainer}>
          <Text style={styles.others}>
            Don't receieve the OTP?{" "}
            <Text
              onPress={() => {
                console.log("Hello");
              }}
              style={styles.resendText}
            >
              Resend Code
            </Text>{" "}
          </Text>
        </View>

        <View style={styles.footerbtnConainer}>
          <View style={styles.btnContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              // onPress={() => navigation.navigate("VerificationCodeScreen", {
              //   phone: countryCode.concat(phoneNumber),
              //   dailingCode: countryCode
              // })}
              onPress={() => {
                confirmCode();
              }}
            >
              <Text style={styles.btnText}>Verify and Proceed</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default VerificationCodeScreen;

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
    width: "65%",
    alignSelf: "center",
  },
  codeContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 60,
    marginTop: 70,
    justifyContent: "space-evenly",
  },
  TextInput: {
    width: "12%",
    height: 45,
    borderRadius: 35,
    color: "#F7F7FC",
    textAlignVertical: "center",
    textAlign: "center",
    fontSize: 32,
    fontFamily: "sans-serif",
    fontWeight: "bold",
    backgroundColor: "#152033",
  },
  resendCodeContainer: {
    alignSelf: "center",
    marginTop: 40,
    flexDirection: "row",
  },
  resendText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#F7F7FC",
    fontFamily: "sans-serif",
    lineHeight: 28,
    textAlign: "center",
    textAlignVertical: "center",
  },
  others: {
    fontSize: 12,
    color: "#A4A4A4",
  },
  footerbtnConainer: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 50,
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
});
