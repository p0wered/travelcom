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
import {useCallback, useEffect, useRef, useState} from 'react';
import {Modal, StyleSheet, Text, Animated, TouchableOpacity, View, Dimensions, StatusBar, Platform} from "react-native";
import CloseIcon from "./components/icons/close-icon";
import React from 'react';
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
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {FaqScreen, PrivacyScreen, RefundsScreen, TermsScreen} from "./screens/footer-screens";
import OrdersScreen from "./screens/orders-screen";
import CartScreen from "./screens/cart-screen";
import FavouritesScreen from "./screens/favourites-screen";
import NotificationScreen from "./screens/notification-screen";
import {NewsItemScreen} from "./screens/news-item-screen";
import {DirectionItemScreen} from "./screens/direction-item-screen";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {usePushNotifications} from "./usePushNotifications";
import {InformationProvider} from "./contextProvider";
import {NotificationProvider} from "./contextNotifications";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {InAppBrowser} from "./components/in-app-browser";
import HomeSearchScreen from "./screens/home-search-screen";
import {GlobalProvider} from "./contextHome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator();
const {width} = Dimensions.get('window');


const useUnreadMessagesCount = () => {
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const token = await AsyncStorage.getItem('@token');
                if (token) {
                    const response = await axios.get('https://travelcom.online/api/notifications/count', {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    setUnreadCount(response.data);
                } else {
                    setUnreadCount(0);
                }
            } catch (error) {
                console.error('Error fetching unread messages count:', error);
                setUnreadCount(0);
            }
        };

        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 2000);

        return () => clearInterval(interval);
    }, []);

    return unreadCount;
};

function MainTabs(){
    const navigation = useNavigation();
    const [menuVisible, setMenuVisible] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(width)).current;
    const [isInputFocused, setIsInputFocused] = useState(false);
    const unreadCount = useUnreadMessagesCount();

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

    const tabScreenOptions = useCallback(({route}) => ({
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
            return <TabIcons icon={iconName} color={color} unreadCount={routeName === 'Chat' ? unreadCount : 0}/>
        },
        tabBarActiveTintColor: '#207FBF',
        tabBarInactiveTintColor: '#9B9B9A',
        tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: 700,
            marginTop: 0,
        },
        tabBarStyle: {
            height: isInputFocused ? 0 : (Platform.OS === 'ios' ? 84 : 68),
            opacity: isInputFocused ? 0 : 1,
            overflow: 'hidden',
        },
        tabBarItemStyle: isInputFocused ? {height: 0} : {height: 60, display: 'flex', flexDirection: 'column'},
        headerStyle: {
            backgroundColor: '#207FBF',
            height: Platform.OS === 'ios' ? 90 : 52,
            borderBottomColor: '#1d73ae'
        },
        headerTintColor: 'white',
        headerTitle: '',
        headerLeft: () => (
            <Logo color='white' width={92} height={38}/>
        ),
        headerLeftContainerStyle: {paddingHorizontal: 10, paddingBottom: 10},
        headerRight: () => (
            <TouchableOpacity style={{paddingHorizontal: 18}} onPress={toggleMenu}>
                <MenuIcon/>
            </TouchableOpacity>
        ),
        headerRightContainerStyle: {paddingBottom: 10},
    }), [isInputFocused, toggleMenu, unreadCount]);

    return(
        <>
            <Tab.Navigator
                initialRouteName={'Travel'}
                screenOptions={tabScreenOptions}>
                <Tab.Screen name={'Travel'} component={HomeScreen}/>
                <Tab.Screen name={'Hotels'} component={HotelsScreen}/>
                <Tab.Screen name={'Flights'} component={HomeSearchScreen}/>
                <Tab.Screen name={'FlightResults'} component={FlightsScreen} options={{tabBarButton: () => null}}/>
                <Tab.Screen name={'Chat'} component={ChatScreen} initialParams={{setIsInputFocused}}/>
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
                <Animated.View style={[
                    styles.menuContainer,
                    Platform.OS === 'ios' ? {paddingTop: 40} : {paddingTop: 0},
                    {transform: [{translateX: slideAnim}]}
                ]}>
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
                                    <Text style={styles.btnText}>Travel organization</Text>
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

const Stack = createNativeStackNavigator();

function AppContent() {
    const {expoPushToken, notification} = usePushNotifications();

    return (
        <Stack.Navigator
            screenOptions={() => ({
                headerStyle: {backgroundColor: '#207FBF'},
                headerTintColor: 'white'

            })}
        >
            <Stack.Screen name="MainTabs" component={MainTabs} options={{headerShown: false}}/>
            <Stack.Screen
                name="Privacy"
                component={PrivacyScreen}
                options={({navigation}) => ({
                    headerBackTitle: 'Back',
                    ...(Platform.OS === 'ios'
                        ? { headerTitle: '' }
                        : { headerTitle: 'Back' })
                })}
            />
            <Stack.Screen
                name="Terms"
                component={TermsScreen}
                options={({navigation}) => ({
                    headerBackTitle: 'Back',
                    ...(Platform.OS === 'ios'
                        ? { headerTitle: '' }
                        : { headerTitle: 'Back' })
                })}
            />
            <Stack.Screen
                name="Refunds"
                component={RefundsScreen}
                options={({navigation}) => ({
                    headerBackTitle: 'Back',
                    ...(Platform.OS === 'ios'
                        ? { headerTitle: '' }
                        : { headerTitle: 'Back' })
                })}
            />
            <Stack.Screen
                name="FAQ"
                component={FaqScreen}
                options={({navigation}) => ({
                    headerBackTitle: 'Back',
                    ...(Platform.OS === 'ios'
                        ? { headerTitle: '' }
                        : { headerTitle: 'Back' })
                })}
            />
            <Stack.Screen
                name="NewsItem"
                component={NewsItemScreen}
                options={({navigation}) => ({
                    headerBackTitle: 'Back',
                    ...(Platform.OS === 'ios'
                        ? { headerTitle: '' }
                        : { headerTitle: 'Back' })
                })}
            />
            <Stack.Screen
                name="DirectionItem"
                component={DirectionItemScreen}
                options={({navigation}) => ({
                    headerBackTitle: 'Back',
                    ...(Platform.OS === 'ios'
                        ? { headerTitle: '' }
                        : { headerTitle: 'Back' })
                })}
            />
            <Stack.Screen
                name="Orders"
                component={OrdersScreen}
                options={({navigation}) => ({
                    headerBackTitle: 'Back',
                    ...(Platform.OS === 'ios'
                        ? { headerTitle: '' }
                        : { headerTitle: 'Back' })
                })}
            />
            <Stack.Screen
                name="Cart"
                component={CartScreen}
                options={({navigation}) => ({
                    headerBackTitle: 'Back',
                    ...(Platform.OS === 'ios'
                        ? { headerTitle: '' }
                        : { headerTitle: 'Back' })
                })}
            />
            <Stack.Screen
                name="Favourites"
                component={FavouritesScreen}
                options={({navigation}) => ({
                    headerBackTitle: 'Back',
                    ...(Platform.OS === 'ios'
                        ? { headerTitle: '' }
                        : { headerTitle: 'Back' })
                })}
            />
            <Stack.Screen
                name="Notifications"
                component={NotificationScreen}
                options={({navigation}) => ({
                    headerBackTitle: 'Back',
                    ...(Platform.OS === 'ios'
                        ? { headerTitle: '' }
                        : { headerTitle: 'Back' })
                })}
            />
            <Stack.Screen
                name="InAppBrowser"
                component={InAppBrowser}
                options={({navigation}) => ({
                    headerBackTitle: 'Back',
                    ...(Platform.OS === 'ios'
                        ? { headerTitle: '' }
                        : { headerTitle: 'Back' })
                })}
            />
        </Stack.Navigator>
    );
}

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.log(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={styles.errorText}>Oops! Some error occurred while loading app.</Text>
                </View>
            );
        }

        return this.props.children;
    }
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
        <ErrorBoundary>
            <SafeAreaProvider>
                <NavigationContainer>
                    <NotificationProvider>
                        <InformationProvider>
                            <GlobalProvider>
                                <GestureHandlerRootView>
                                    <AppContent/>
                                    <StatusBar barStyle='light-content' backgroundColor='#207fbf' />
                                </GestureHandlerRootView>
                            </GlobalProvider>
                        </InformationProvider>
                    </NotificationProvider>
                </NavigationContainer>
            </SafeAreaProvider>
        </ErrorBoundary>
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
        backgroundColor: 'white'
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
        paddingHorizontal: 30,
        paddingVertical: 10
    },
    btnText: {
        fontSize: 17,
        fontFamily: 'Montserrat-Bold',
        color: '#207FBF'
    },
    errorText: {
        fontSize: 16,
        fontFamily: 'Montserrat-Bold',
        color: 'black',
        padding: 15,
        textAlign: 'center'
    }
});
