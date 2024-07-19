import React, { useState, useEffect } from 'react';
import {
    View,
    TextInput,
    Button,
    StyleSheet,
    Alert,
    ScrollView,
    Text,
    Pressable,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AvatarIcon} from "../components/icons/avatar-icon";
import {EditProfileIcon} from "../components/icons/edit-profile-icon";
import {OrdersIcon} from "../components/icons/orders-icon";
import {ShoppingCart} from "../components/icons/shopping-cart";
import {FavoriteIcon} from "../components/icons/favorite-icon";
import {NotificationIcon} from "../components/icons/notification-icon";
import ExitIcon from "../components/icons/exit-icon";
import {Footer} from "../components/footer";
import MailIcon from "../components/icons/mail-icon";
import {PasswordIcon} from "../components/icons/password-icon";
import {useNavigation} from "@react-navigation/native";
import {PersonIcon} from "../components/icons/person-icon";
import {PhoneIcon} from "../components/icons/phone-icon";

export default function ProfileScreen ({navigation}){
    const navigate = useNavigation();
    const [isLogin, setIsLogin] = useState(true);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState(undefined);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const userJson = await AsyncStorage.getItem('@user');
            const tokenString = await AsyncStorage.getItem('@token');
            if (userJson && tokenString) {
                setUser(JSON.parse(userJson));
                setToken(tokenString);
            }
        } catch (e) {
            console.error('Failed to load user data', e);
        }
    };

    const saveUserData = async (userData, userToken) => {
        try {
            await AsyncStorage.setItem('@user', JSON.stringify(userData));
            await AsyncStorage.setItem('@token', userToken);
        } catch (e) {
            console.error('Failed to save user data', e);
        }
    };

    const handleAuth = async () => {
        const url = isLogin
            ? 'https://travelcom.online/api/auth/login'
            : 'https://travelcom.online/api/auth/register';

        const authData = isLogin
            ? {email, password}
            : {name, email, phone, password, password_confirmation: passwordConfirmation};

        if (!isLogin && password !== passwordConfirmation) {
            setErrorMsg('Passwords must match')
        } else {
            console.log(`Sending ${isLogin ? 'login' : 'registration'} data:`, JSON.stringify(authData, null, 2));
            try {
                setIsLoading(true);
                const response = await axios({
                    method: 'post',
                    url: url,
                    data: authData,
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                });
                console.log('Server response:', response.data);

                if (response.data.success && response.data.user) {
                    setUser(response.data.user);
                    setToken(response.data.success.token);
                    await saveUserData(response.data.user, response.data.success.token);
                    setErrorMsg(undefined);
                } else {
                    console.log('User data or token not found in response');
                    Alert.alert('Error', 'User data or token not found in response');
                }
                if (!isLogin) {
                    setRegistrationSuccess(true);
                }
            } catch (error) {
                console.error('Error response:', error.response?.data);
                if (error.response && error.response.data) {
                    if (error.response.data.success === false) {
                        setErrorMsg(error.response.data.message);
                    } else if (error.response.data.errors) {
                        if (error.response.data.errors.email) {
                            setErrorMsg(error.response.data.errors.email[0]);
                        } else if (error.response.data.errors.password) {
                            setErrorMsg(error.response.data.errors.password[0]);
                        } else if (error.response.data.errors.phone) {
                            setErrorMsg(error.response.data.errors.phone[0]);
                        } else {
                            setErrorMsg('An error occurred. Please try again.');
                        }
                    } else {
                        setErrorMsg('An unexpected error occurred. Please try again.');
                    }
                } else {
                    setErrorMsg('No response from server. Please check your connection.');
                }
            }
            setIsLoading(false);
        }
    };

    const handlePasswordRecovery = async () => {
        setIsLoading(true);
        try {
            const response = await axios({
                method: 'post',
                url: 'https://travelcom.online/api/auth/recover',
                data: { email },
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            if (response.data.success) {
                Alert.alert('Success', 'Check your email');
                setIsForgotPassword(false);
                setEmail('');
            } else {
                setErrorMsg('Failed to send recovery email. Please try again.');
            }
        } catch (error) {
            console.error('Error response:', error.response?.data);
            setErrorMsg('An error occurred. Please try again.');
        }
        setIsLoading(false);
    };

    const handleLogout = async () => {
        setUser(null);
        setToken(null);
        setEmail('');
        setPassword('');
        try {
            await AsyncStorage.removeItem('@user');
            await AsyncStorage.removeItem('@token');
        } catch (e) {
            console.error('Failed to remove user data', e);
        }
    };

    const resetForm = () => {
        setName('');
        setEmail('');
        setPhone('');
        setPassword('');
        setPasswordConfirmation('');
        setRegistrationSuccess(false);
        setIsLogin(true);
    };

    const changeToRegister = () => {
        setPassword('');
        setEmail('');
        setIsLogin(false);
        setErrorMsg(undefined);
        setIsForgotPassword(false);
    }

    const changeToLogin = () => {
        setPassword('');
        setEmail('');
        setIsLogin(true);
        setErrorMsg(undefined);
        setIsForgotPassword(false);
    }

    const changeToRecover = () => {
        setPassword('');
        setEmail('');
        setErrorMsg(undefined);
        setIsForgotPassword(true);
    }

    // user logged in, show profile
    if (user && token) {
        return (
            <ScrollView>
                <View style={styles.profileBlock}>
                    <View style={[styles.merger, styles.nameBlock]}>
                        <View style={styles.merger}>
                            <AvatarIcon/>
                            <Text style={styles.mainText}>{user.name}</Text>
                        </View>
                        <Pressable style={{padding: 10}}>
                            <EditProfileIcon/>
                        </Pressable>
                    </View>
                    <View style={{marginBottom: 18}}>
                        <Text style={styles.smallText}>Email</Text>
                        <Text style={styles.regularText}>{user.email}</Text>
                    </View>
                    <View style={{marginBottom: 12}}>
                        <Text style={styles.smallText}>Phone number</Text>
                        <Text style={styles.regularText}>{user.phone}</Text>
                    </View>
                </View>
                <View style={{padding: 15}}>
                    <View style={styles.profileMenu}>
                        <TouchableOpacity
                            style={styles.menuButton}
                            activeOpacity={0.6}
                            onPress={() => navigation.navigate('Orders')}
                        >
                            <OrdersIcon/>
                            <Text style={styles.mediumText}>Orders</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.menuButton}
                            activeOpacity={0.6}
                            onPress={() => navigation.navigate('Cart')}
                        >
                            <ShoppingCart/>
                            <Text style={styles.mediumText}>Shopping Cart</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.menuButton}
                            activeOpacity={0.6}
                            onPress={() => navigation.navigate('Favourites')}
                        >
                            <View style={styles.favouriteIcon}>
                                <FavoriteIcon color='#207FBF' stroke='#207FBF'/>
                            </View>
                            <Text style={styles.mediumText}>Favourites</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.menuButton}
                            activeOpacity={0.6}
                            onPress={() => navigation.navigate('Notifications')}
                        >
                            <NotificationIcon/>
                            <Text style={styles.mediumText}>Notifications</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.3}
                        style={[styles.merger, {margin: 'auto', paddingVertical: 25}]}
                        onPress={handleLogout}
                    >
                        <Text style={styles.mainText}>Log out of profile</Text>
                        <ExitIcon/>
                    </TouchableOpacity>
                </View>
                <Footer color='white'/>
            </ScrollView>
        )
    }

    // user successfully registered
    if (registrationSuccess) {
        return (
            <View style={[styles.container, {backgroundColor: 'white'}]}>
                <Text style={styles.title}>Check your email box</Text>
                <Text style={styles.text}>We've sent you a verification email. Please check your inbox and verify your account.</Text>
                <Button title="Back to Login" onPress={resetForm} />
            </View>
        );
    }

    // user not logged in, show log in
    if (isLogin) {
        if (isForgotPassword) {
            return (
                <ScrollView style={{backgroundColor: 'white'}}>
                    <View style={{padding: 15}}>
                        <Text style={styles.titleText}>PASSWORD RECOVERY</Text>
                        <View style={[styles.inputContainer, {marginBottom: 0}]}>
                            <View style={styles.iconWrap}>
                                <MailIcon color='white'/>
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder='E-mail'
                                placeholderTextColor='#9B9B9A'
                                autoComplete='email'
                                keyboardType='email-address'
                                value={email}
                                onChangeText={setEmail}
                            />
                        </View>
                        {errorMsg ? (
                            <Text style={[styles.errorText, {marginTop: 15}]}>{errorMsg}</Text>
                        ) : (<></>)}
                        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                            <TouchableOpacity style={styles.sendBtn} onPress={handlePasswordRecovery}>
                                {
                                    isLoading ? (
                                        <ActivityIndicator color='#fff'/>
                                    ) : (
                                        <Text style={styles.sendBtnText}>RECOVER</Text>
                                    )
                                }
                            </TouchableOpacity>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 20}}>
                            <TouchableOpacity onPress={changeToLogin}>
                                <Text style={[styles.mainText, {color: '#207FBF'}]}>Back to Login</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            );
        }

        return (
            <ScrollView style={{backgroundColor: 'white'}}>
                <View style={{padding: 15}}>
                    <Text style={styles.titleText}>LOG IN</Text>
                    <View style={styles.inputContainer}>
                        <View style={styles.iconWrap}>
                            <MailIcon color='white'/>
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder='E-mail'
                            placeholderTextColor='#9B9B9A'
                            autoComplete='email'
                            keyboardType='email-address'
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <View style={styles.iconWrap}>
                            <PasswordIcon/>
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder='Password'
                            placeholderTextColor='#9B9B9A'
                            autoComplete='password'
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>
                    {errorMsg ? (
                        <Text style={styles.errorText}>{errorMsg}</Text>
                    ) : (<></>)}
                    <View style={[styles.merger, {justifyContent: 'center', gap: 0}]}>
                        <Text style={styles.mainText}>Don't have an account?</Text>
                        <TouchableOpacity style={{padding: 15}} onPress={changeToRegister}>
                            <Text style={[styles.mainText, {color: '#207FBF'}]}>Register</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                        <TouchableOpacity style={{padding: 10}} onPress={changeToRecover}>
                            <Text style={[styles.mainText, {color: '#207FBF'}]}>Forgot my password</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                        <TouchableOpacity style={styles.sendBtn} onPress={handleAuth}>
                            {
                                isLoading ? (
                                    <ActivityIndicator color='#fff'/>
                                ) : (
                                    <Text style={styles.sendBtnText}>LOG IN</Text>
                                )
                            }
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        );
    }

    return (
        <ScrollView style={{backgroundColor: 'white'}}>
            <View style={{padding: 15}}>
                <Text style={styles.titleText}>REGISTRATION</Text>
                <View style={styles.inputContainer}>
                    <View style={styles.iconWrap}>
                        <PersonIcon color='white' width={24} height={24}/>
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder='Name'
                        placeholderTextColor='#9B9B9A'
                        autoComplete='name'
                        value={name}
                        onChangeText={setName}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <View style={styles.iconWrap}>
                        <MailIcon color='white'/>
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder='E-mail'
                        placeholderTextColor='#9B9B9A'
                        autoComplete='email'
                        keyboardType='email-address'
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <View style={styles.iconWrap}>
                        <PhoneIcon color='white'/>
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder='Phone number'
                        placeholderTextColor='#9B9B9A'
                        autoComplete='tel'
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType='number-pad'
                    />
                </View>
                <View style={styles.inputContainer}>
                    <View style={styles.iconWrap}>
                        <PasswordIcon/>
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder='Password'
                        placeholderTextColor='#9B9B9A'
                        autoComplete='password'
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>
                <View style={styles.inputContainer}>
                    <View style={styles.iconWrap}>
                        <PasswordIcon/>
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder='Confirm Password'
                        placeholderTextColor='#9B9B9A'
                        value={passwordConfirmation}
                        onChangeText={setPasswordConfirmation}
                        secureTextEntry
                    />
                </View>
                <View style={[styles.merger, {justifyContent: 'center', gap: 0}]}>
                    <Text style={styles.mainText}>Already have an account?</Text>
                    <TouchableOpacity style={{padding: 15}} onPress={changeToLogin}>
                        <Text style={[styles.mainText, {color: '#207FBF'}]}>Log in</Text>
                    </TouchableOpacity>
                </View>
                {errorMsg ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{errorMsg}</Text>
                    </View>
                ) : null}
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                    <TouchableOpacity style={styles.sendBtn} onPress={handleAuth}>
                        {
                            isLoading ? (
                                <ActivityIndicator color='#fff'/>
                            ) : (
                                <Text style={styles.sendBtnText}>PROCEED</Text>
                            )
                        }
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    mainText: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 15,
        color: 'black'
    },
    regularText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 15,
        color: 'black'
    },
    mediumText: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 16,
        color: 'black'
    },
    smallText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 13,
        color: '#9B9B9A',
        marginBottom: 3
    },
    profileBlock: {
        padding: 15,
        backgroundColor: 'white',
        borderBottomStartRadius: 10,
        borderBottomEndRadius: 10
    },
    merger: {
        display: 'flex',
        flexDirection: "row",
        alignItems: 'center',
        gap: 16,
    },
    nameBlock: {
        justifyContent: 'space-between',
        marginBottom: 38
    },
    profileMenu: {
        borderRadius: 14,
        backgroundColor: 'white',
        padding: 15,
        display: 'flex',
        flexDirection: 'column',
        gap: 10
    },
    menuButton: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 11,
        paddingHorizontal: 20,
        backgroundColor: '#e8f2f8',
        borderRadius: 10,
        height: 52
    },
    favouriteIcon: {
        width: 30,
        height: 30,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    titleText: {
        textAlign: 'center',
        fontSize: 26,
        fontFamily: 'Montserrat-Bold',
        color: '#207FBF',
        marginBottom: 15
    },
    iconWrap: {
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#207FBF',
        width: 44
    },
    input: {
        fontSize: 16,
        fontFamily: 'Montserrat-Bold',
        paddingHorizontal: 25,
        width: '100%'
    },
    inputContainer: {
        display: 'flex',
        flexDirection: 'row',
        height: 64,
        borderRadius: 10,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#207FBF',
        overflow: 'hidden',
        marginBottom: 15
    },
    sendBtn: {
        borderRadius: 10,
        paddingVertical: 18,
        paddingHorizontal: 80,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        backgroundColor: '#207FBF'
    },
    sendBtnText: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 16,
        color: 'white'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    text: {
        fontSize: 16,
        marginBottom: 12,
        textAlign: 'center',
    },
    errorContainer: {
        padding: 10
    },
    errorText: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 12,
        color: '#c93333',
        textAlign: 'center'
    }
});