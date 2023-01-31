// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeFirestore  } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getReactNativePersistence, initializeAuth} from 'firebase/auth/react-native';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCz8PCJCa9iQKYhsw7UKmL9kwUZ5G4v0Ak",
  authDomain: "chatflock.firebaseapp.com",
  projectId: "chatflock",
  storageBucket: "chatflock.appspot.com",
  messagingSenderId: "277968864523",
  appId: "1:277968864523:web:ad26908f6f94c13bfcce0e",
  measurementId: "G-096FTGMK11"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {experimentalForceLongPolling: true});
initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
export {app, db}