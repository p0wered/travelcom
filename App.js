import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeScreen from "./screens/home-screen";
import HelpScreen from "./screens/help-screen";
import HotelsScreen from "./screens/hotels-screen";
import TravelIcon from "./components/icons/travel-icon";

const Tab = createBottomTabNavigator();


export default function App() {
  return (
      <View>
        <TravelIcon/>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
