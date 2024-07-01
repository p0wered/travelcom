import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeScreen from "./screens/home-screen";
import FlightsScreen from "./screens/flights-screen";
import HotelsScreen from "./screens/hotels-screen";
import TabIcons from "./components/icons/tab-icons";
import ChatScreen from "./screens/chat-screen";
import ProfileScreen from "./screens/profile-screen";
import Logo from "./components/icons/logo";
import MenuIcon from "./components/icons/menu-icon";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {useEffect} from 'react';

SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator();

export default function App() {
    const [loaded, error] = useFonts({
        'Montserrat-Bold': require('./assets/fonts/Montserrat-Bold.ttf'),
        'Montserrat-Regular': require('./assets/fonts/Montserrat-Regular.ttf'),
        'Montserrat-Light': require('./assets/fonts/Montserrat-Light.ttf'),
    });

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

    return (
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName={'Hotels'}
                screenOptions={({route}) => ({
                    tabBarIcon: ({color}) => {
                        let iconName;
                        let routeName = route.name;

                        if (routeName === 'Travel') {
                            iconName = 'home-icon'
                        } else if (routeName === 'Hotels') {
                            iconName = 'hotels-icon'
                        } else if (routeName === 'Flights') {
                            iconName = 'flights-icon'
                        } else if (routeName === 'Chat') {
                            iconName = 'chat-icon'
                        } else if (routeName === 'Profile') {
                            iconName = 'profile-icon'
                        }
                        return <TabIcons icon={iconName} color={color}/>
                    },
                    tabBarActiveTintColor: '#207FBF',
                    tabBarInactiveTintColor: '#9B9B9A',
                    tabBarLabelStyle: {
                        fontSize: 11,
                        fontWeight: 700,
                        marginTop: 0,
                    },
                    tabBarStyle: {height: 68},
                    tabBarItemStyle: {height: 60},
                    headerStyle: {
                        backgroundColor: '#207FBF',
                        height: 75
                    },
                    headerTintColor: 'white',
                    headerTitle: '',
                    headerLeft: () => (
                        <Logo color='white' width={92} height={38}/>
                    ),
                    headerLeftContainerStyle: {padding: 14},
                    headerRight: () => (
                        <MenuIcon/>
                    ),
                    headerRightContainerStyle: {padding: 14},
                })}>

                <Tab.Screen name={'Travel'} component={HomeScreen}/>
                <Tab.Screen name={'Hotels'} component={HotelsScreen}/>
                <Tab.Screen name={'Flights'} component={FlightsScreen}/>
                <Tab.Screen name={'Chat'} component={ChatScreen}/>
                <Tab.Screen name={'Profile'} component={ProfileScreen}/>
            </Tab.Navigator>
        </NavigationContainer>
  );
}