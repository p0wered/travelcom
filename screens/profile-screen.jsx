import React, {useState, useEffect, useCallback} from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    Alert,
    ScrollView,
    Text,
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
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {PersonIcon} from "../components/icons/person-icon";
import {PhoneIcon} from "../components/icons/phone-icon";
import {useNotification} from "../contextNotifications";
import {usePushNotifications} from "../usePushNotifications";

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
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);
    const [editableUser, setEditableUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { expoPushToken } = usePushNotifications(isAuthenticated);
    const { notificationsEnabled, setNotificationsEnabled } = useNotification();
    const [lastRecoverySent, setLastRecoverySent] = useState(0);
    const RECOVERY_COOLDOWN = 60000;

    useEffect(() => {
        if (user) {
            resetEditableUser();
        }
    }, [user]);

    useFocusEffect(
        useCallback(() => {
            loadUserData();
            fetchNotifications();
        }, [])
    );

    const loadUserData = async () => {
        try {
            const tokenString = await AsyncStorage.getItem('@token');
            if (tokenString) {
                setToken(tokenString);
                const response = await axios.get('https://travelcom.online/api/user/my', {
                    headers: {
                        'Authorization': `Bearer ${tokenString}`
                    }
                });
                if (response.data) {
                    setUser(response.data);
                }
            }
        } catch (e) {
            console.error('Failed to load user data', e);
        }
        setIsLoading(false);
    };

    const fetchNotifications = async () => {
        const tokenString = await AsyncStorage.getItem('@token');
        if (tokenString) {
            try {
                const response = await axios.get('https://travelcom.online/api/notifications/count', {
                    headers: {Authorization: `Bearer ${tokenString}`}
                });
                console.log(response.data)
                if (response.data > 0){
                    setHasUnread(true);
                } else {
                    setHasUnread(false);
                }
            } catch (error) {
                console.error('Error fetching notifications count:', error);
                setHasUnread(false);
            }
        }
    };

    const resetEditableUser = () => {
        setEditableUser({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone
        });
    };

    const handleEdit = () => {
        if (isEditing) {
            resetEditableUser();
        }
        setIsEditing(!isEditing);
    };

    const handleSave = async () => {
        try {
            const response = await axios.post('https://travelcom.online/api/auth/edit-profile', editableUser, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setUser(prev => ({ ...prev, ...editableUser }));
                await AsyncStorage.setItem('@user', JSON.stringify({ ...user, ...editableUser }));
                setIsEditing(false);
            } else {
                console.error('Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    const handleChange = (field, value) => {
        setEditableUser(prev => ({ ...prev, [field]: value }));
    };

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#207fbf" />
            </View>
        );
    }

    const saveUserData = async (userData, userToken) => {
        try {
            await AsyncStorage.setItem('@user', JSON.stringify(userData));
            await AsyncStorage.setItem('@token', userToken);
            setIsAuthenticated(true);
            setNotificationsEnabled(true);
        } catch (e) {
            console.error('Failed to save user data', e);
        }
    };

    const handleAuth = async () => {
        const url = isLogin
            ? 'https://travelcom.online/api/auth/login'
            : 'https://travelcom.online/api/auth/register';

        let baseAuthData = isLogin
            ? {email, password}
            : {name, email, phone, password, password_confirmation: passwordConfirmation};

        const pushTokenString = await AsyncStorage.getItem('@PushToken');
        let authData = { ...baseAuthData };

        if (pushTokenString) {
            const pushToken = JSON.parse(pushTokenString);
            authData.push_token = pushToken.data;
        }

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
                    if (!isLogin) {
                        setRegistrationSuccess(true);
                    } else {
                        setUser(response.data.user);
                        setToken(response.data.success.token);
                        await saveUserData(response.data.user, response.data.success.token);
                    }
                    setErrorMsg(undefined);
                } else {
                    console.log('User data or token not found in response');
                    Alert.alert('Error', 'User data or token not found in response');
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
        const now = Date.now();
        if (now - lastRecoverySent < RECOVERY_COOLDOWN) {
            const remainingTime = Math.ceil((RECOVERY_COOLDOWN - (now - lastRecoverySent)) / 1000);
            setErrorMsg('You can request only one recovery link per minute. Please wait.')
            return;
        }
        setIsLoading(true);
        if (email === '' ||  email === undefined || email === null){
            setErrorMsg('Please enter a valid email address');
        } else {
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
                if (response.status === 200) {
                    Alert.alert('Success', 'Check your email');
                    setIsForgotPassword(false);
                    setEmail('');
                    setLastRecoverySent(now);
                    setErrorMsg(undefined)
                } else {
                    setErrorMsg('Failed to send recovery email. Please try again.');
                }
            } catch (error) {
                console.error('Error:', error);
                if (error.response) {
                    console.error('Error response:', error.response.data);
                    console.error('Error status:', error.response.status);
                    if (error.response.status === 404) {
                        setErrorMsg('Email not found. Please check your email address.')
                    } else if (error.response.status === 429) {
                        setErrorMsg('Too many requests. Please try again later.')
                    } else {
                        setErrorMsg('An error occurred. Please try again.');
                    }
                } else if (error.request) {
                    setErrorMsg('No response from server. Please check your internet connection.');
                } else {
                    setErrorMsg('An unexpected error occurred. Please try again.');
                }
            }
        }
        setIsLoading(false);
    };

    const handleLogout = async () => {
        setUser(null);
        setToken(null);
        setEmail('');
        setPassword('');
        setIsAuthenticated(false);
        setNotificationsEnabled(false);
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
        setName('');
        setPassword('');
        setEmail('');
        setIsLogin(false);
        setErrorMsg(undefined);
        setIsForgotPassword(false);
    }

    const changeToLogin = () => {
        setName('');
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

    // user successfully registered
    if (registrationSuccess) {
        return (
            <View style={[styles.container, {backgroundColor: 'white'}]}>
                <Text style={styles.regTitle}>Check your email box</Text>
                <Text style={styles.textReg}>We've sent you a verification email. Please check your inbox and verify your account.</Text>
                <TouchableOpacity onPress={resetForm}>
                    <Text
                        style={[styles.mainText, {color: '#207FBF', marginTop: 10, textAlign: 'center'}]}
                    >
                        Back to Login
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    // user logged in, show profile
    if (user && token) {
        return (
            <ScrollView>
                <View style={styles.profileBlock}>
                    <View style={styles.nameBlock}>
                        <View style={[styles.merger, {gap: 10}]}>
                            <AvatarIcon/>
                            {isEditing ? (
                                <TextInput
                                    style={[styles.editInput, {fontFamily: 'Montserrat-Bold'}]}
                                    value={editableUser.name}
                                    onChangeText={(value) => handleChange('name', value)}
                                />
                            ) : (
                                <Text style={styles.mainText}>{user.name}</Text>
                            )}
                        </View>
                        <TouchableOpacity style={{padding: 10}} onPress={handleEdit}>
                            <EditProfileIcon />
                        </TouchableOpacity>
                    </View>
                    <View style={{marginBottom: 18}}>
                        <Text style={styles.smallText}>Email</Text>
                        {isEditing ? (
                            <TextInput
                                style={styles.editInput}
                                value={editableUser.email}
                                onChangeText={(value) => handleChange('email', value)}
                            />
                        ) : (
                            <Text style={styles.regularText}>{user.email}</Text>
                        )}
                    </View>
                    <View style={{marginBottom: 12}}>
                        <Text style={styles.smallText}>Phone number</Text>
                        {isEditing ? (
                            <TextInput
                                style={styles.editInput}
                                value={editableUser.phone}
                                onChangeText={(value) => handleChange('phone', value)}
                            />
                        ) : (
                            <Text style={styles.regularText}>{user.phone}</Text>
                        )}
                    </View>
                    {isEditing && (
                        <View style={{flexDirection: 'row', gap: 10}}>
                            <TouchableOpacity style={styles.editBtn} onPress={handleEdit} >
                                <Text style={styles.sendBtnText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.editBtn} onPress={handleSave} >
                                <Text style={styles.sendBtnText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    )}
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
                            <NotificationIcon unread={hasUnread}/>
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
        display: 'flex',
        flexDirection: "row",
        alignItems: 'center',
        marginBottom: 18
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
    },
    editInput: {
        fontSize: 14,
        fontFamily: 'Montserrat-Regular',
        height: 42,
        borderRadius: 10,
        paddingHorizontal: 10,
        backgroundColor: 'white',
        marginTop: 5,
        borderWidth: 1,
        borderColor: '#207FBF'
    },
    editBtn: {
        width: '48%',
        borderRadius: 10,
        paddingVertical: 14,
        paddingHorizontal: 20,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        backgroundColor: '#207FBF'
    },
    regTitle: {
        fontSize: 24,
        fontFamily: 'Montserrat-Bold',
        textAlign: 'center',
        marginBottom: 10
    },
    textReg: {
        fontSize: 16,
        fontFamily: 'Montserrat-Regular',
        marginBottom: 12,
        textAlign: 'center',
    },
});
