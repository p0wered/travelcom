import {NavigationContainer, useNavigation} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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
import {useEffect, useRef, useState} from 'react';
import {Modal, StyleSheet, Text, Animated, TouchableOpacity, View, Dimensions} from "react-native";
import CloseIcon from "./components/icons/close-icon";
import {
    AboutIcon,
    ContactsIcon,
    FlightsIcon,
    HelpIcon,
    HotelsIcon,
    NewsIcon,
    TravelIcon
} from "./components/icons/side-bar-icons";
import HelpScreen from "./screens/help-screen";
import AboutScreen from "./screens/about-screen";
import NewsScreen from "./screens/news-screen";
import ContactsScreen from "./screens/contacts-screen";

SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator();
const {width} = Dimensions.get('window');

function AppContent(){
    const navigation = useNavigation();
    const [menuVisible, setMenuVisible] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(width)).current;

    const toggleMenu = () => {
        if (menuVisible) {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: width,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start(() => setMenuVisible(false));
        } else {
            setMenuVisible(true);
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start();
        }
    };

    const createNavigationFunction = (screenName) => () => {
        toggleMenu();
        navigation.navigate(screenName);
    };

    const navigateToTravel = createNavigationFunction('Travel');
    const navigateToFlights = createNavigationFunction('Flights');
    const navigateToHotels = createNavigationFunction('Hotels');
    const navigateToHelp = createNavigationFunction('Help');
    const navigateToNews = createNavigationFunction('News');
    const navigateToAbout = createNavigationFunction('About');
    const navigateToContacts = createNavigationFunction('Contacts');

    return(
        <>
            <Tab.Navigator
                initialRouteName={'Home'}
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
                        <TouchableOpacity style={{padding: 18}} onPress={toggleMenu}>
                            <MenuIcon/>
                        </TouchableOpacity>
                    ),
                })}>
                <Tab.Screen name={'Travel'} component={HomeScreen}/>
                <Tab.Screen name={'Hotels'} component={HotelsScreen}/>
                <Tab.Screen name={'Flights'} component={FlightsScreen}/>
                <Tab.Screen name={'Chat'} component={ChatScreen}/>
                <Tab.Screen name={'Profile'} component={ProfileScreen}/>
                <Tab.Screen name={'Help'} component={HelpScreen} options={{tabBarButton: () => null}}/>
                <Tab.Screen name={'News'} component={NewsScreen} options={{tabBarButton: () => null}}/>
                <Tab.Screen name={'About'} component={AboutScreen} options={{tabBarButton: () => null}}/>
                <Tab.Screen name={'Contacts'} component={ContactsScreen} options={{tabBarButton: () => null}}/>
            </Tab.Navigator>
            <Modal transparent={true} visible={menuVisible} onRequestClose={toggleMenu}>
                <Animated.View style={[styles.modalOverlay, {opacity: fadeAnim}]}>
                    <TouchableOpacity
                        style={StyleSheet.absoluteFill}
                        activeOpacity={1}
                        onPress={toggleMenu}
                    />
                </Animated.View>
                <Animated.View style={[styles.menuContainer, {transform: [{ translateX: slideAnim }]}]}>
                    <TouchableOpacity style={styles.menuContent} activeOpacity={1}>
                        <View>
                            <View style={styles.closeBtn}>
                                <TouchableOpacity onPress={toggleMenu} style={{padding: 24}}>
                                    <CloseIcon/>
                                </TouchableOpacity>
                            </View>
                            <View>
                                <TouchableOpacity style={styles.sideBarBtn} onPress={navigateToFlights}>
                                    <FlightsIcon/>
                                    <Text style={styles.btnText}>Flights</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.sideBarBtn} onPress={navigateToHotels}>
                                    <HotelsIcon/>
                                    <Text style={styles.btnText}>Hotels</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.sideBarBtn} onPress={navigateToTravel}>
                                    <TravelIcon/>
                                    <Text style={styles.btnText}>Travel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.sideBarBtn} onPress={navigateToHelp}>
                                    <HelpIcon/>
                                    <Text style={styles.btnText}>Help</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.sideBarBtn} onPress={navigateToNews}>
                                    <NewsIcon/>
                                    <Text style={styles.btnText}>News</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.sideBarBtn} onPress={navigateToAbout}>
                                    <View style={{paddingVertical: 6, paddingHorizontal: 3}}>
                                        <AboutIcon/>
                                    </View>
                                    <Text style={styles.btnText}>About Us</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.sideBarBtn} onPress={navigateToContacts}>
                                    <ContactsIcon/>
                                    <Text style={styles.btnText}>Contacts</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                </Animated.View>
            </Modal>
        </>
    )
}

export default function App() {
    const [loaded, error] = useFonts({
        'Montserrat-Bold': require('./assets/fonts/Montserrat-Bold.ttf'),
        'Montserrat-Medium': require('./assets/fonts/Montserrat-Medium.ttf'),
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
            <AppContent/>
        </NavigationContainer>
  );
}

const styles = StyleSheet.create({
    modalOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    menuContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: 287,
        backgroundColor: 'white',
    },
    menuContent: {
        flex: 1,
    },
    closeBtn: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: '100%'
    },
    sideBarBtn: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 50,
        paddingVertical: 10
    },
    btnText: {
        fontSize: 24,
        fontFamily: 'Montserrat-Bold',
        color: '#207FBF'
    }
});