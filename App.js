import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import BottomTabNavigation from './src/components/BottomTabNavigation';
import NavigationComponent from './src/components/NavigationComponent';
import Profile from './src/screens/Profile';
import ViewStoryComponent from './src/components/ViewStoryComponent'
import ChatScreen from './src/screens/ChatScreen';
export default function App() {
  return (
    <View style={styles.container}>
      <NavigationComponent />
      {/* <BottomTabNavigation /> */}
      {/* <Profile /> */}
      {/* <ViewStoryComponent /> */}
      {/* <ChatScreen /> */}
      <StatusBar style= "auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
