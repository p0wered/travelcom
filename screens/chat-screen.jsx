import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    Image,
    Dimensions,
    Linking,
    Platform,
    StyleSheet,
    KeyboardAvoidingView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Pusher from 'pusher-js/react-native';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import {ChatSendIcon} from "../components/icons/chat-send-icon";
import {PaperclipIcon} from "../components/icons/paperclip-icon";
import {useNavigation} from "@react-navigation/native";
import axios from "axios";

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MAX_IMAGE_WIDTH = SCREEN_WIDTH * 0.7;

const MessageContent = ({ content }) => {
    const [imageSize, setImageSize] = useState({width: 250, height: 250});

    if (content.startsWith('<img')) {
        const srcMatch = content.match(/src="([^"]*)"/);
        const widthMatch = content.match(/width="(\d+)2px"/);

        if (srcMatch && srcMatch[1]) {
            let imageUrl
            if (srcMatch[1].startsWith('https://admin.travelcom.online')){
                imageUrl = srcMatch[1];
            } else {
                imageUrl = `https://travelcom.online${srcMatch[1]}`;
            }
            const specifiedWidth = widthMatch && widthMatch[1] ? parseInt(widthMatch[1]) : MAX_IMAGE_WIDTH;

            useEffect(() => {
                Image.getSize(imageUrl, (width, height) => {
                    const aspectRatio = width / height;
                    let newWidth = Math.min(specifiedWidth, MAX_IMAGE_WIDTH);
                    let newHeight = newWidth / aspectRatio;
                    setImageSize({ width: newWidth, height: newHeight });
                }, (error) => console.error('Error getting image size:', error));
            }, [imageUrl, specifiedWidth]);

            return <Image source={{ uri: imageUrl }} style={[styles.messageImage, imageSize]} />;
        }
    } else if (content.startsWith('<a')) {
        const hrefMatch = content.match(/href="([^"]*)"/);
        const imgSrcMatch = content.match(/src="([^"]*)"/);
        if (hrefMatch && hrefMatch[1] && imgSrcMatch && imgSrcMatch[1]) {
            return (
                <TouchableOpacity onPress={() => Linking.openURL(`https://travelcom.online${hrefMatch[1]}`)}>
                    <Image source={{ uri: imgSrcMatch[1] }} style={styles.documentIcon} />
                    <Text style={styles.documentText}>Open document</Text>
                </TouchableOpacity>
            );
        }
    }
    return <Text style={styles.messageText}>{content}</Text>;
};

const IncomingMessage = ({ message, time }) => (
    <View style={styles.incomingMessageContainer}>
        <View style={styles.incomingMessageBubble}>
            <MessageContent content={message} />
            <Text style={styles.messageTime}>{time}</Text>
        </View>
    </View>
);

const OutgoingMessage = ({ message, time }) => (
    <View style={styles.outgoingMessageContainer}>
        <View style={styles.outgoingMessageBubble}>
            <MessageContent content={message} />
            <Text style={styles.messageTime}>{time}</Text>
        </View>
    </View>
);


export default function ChatScreen({navigation}){
    const navigate = useNavigation();
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [userData, setUserData] = useState(null);
    const [userToken, setUserToken] = useState(null);
    const [chatId, setChatId] = useState(null);
    const [isPickerVisible, setIsPickerVisible] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const flatListRef = useRef();

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const asset = result.assets[0];
            const fileName = asset.uri.split('/').pop();
            const fileExtension = fileName.split('.').pop();
            const fileInfo = await FileSystem.getInfoAsync(asset.uri);

            const file = {
                uri: asset.uri,
                name: fileName,
                type: `image/${fileExtension}`,
            };

            let formData = new FormData();
            formData.append('image', file);
            sendFile(formData);
        }
    };

    const pickDocument = async () => {
        try {
            let result = await DocumentPicker.getDocumentAsync({
                type: '*/*',
                copyToCacheDirectory: true,
            });

            console.log(result);

            if (result.canceled) {
                console.log('Document picking was cancelled');
                return;
            }

            let documentData = new FormData();

            if (Platform.OS === 'web') {
                documentData.append('image', result.output[0]);
            } else {
                const fileUri = result.assets[0].uri;
                const fileName = result.assets[0].name;
                const fileType = result.assets[0].mimeType;
                documentData.append('image', {
                    uri: fileUri,
                    name: fileName,
                    type: fileType
                });
            }

            console.log(documentData);
            await sendFile(documentData);
        } catch (error) {
            console.error('Error picking document:', error);
        }
    };

    const sendFile = async (formData) => {
        try {
            const response = await axios.post('https://travelcom.online/api/chat/send_message', formData, {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response.data);
        } catch (error) {
            console.error('Error sending file:', error);
        }
    };

    const togglePicker = () => {
        setIsPickerVisible(!isPickerVisible);
    };

    const getUserData = async () => {
        try {
            const userDataString = await AsyncStorage.getItem('@user');
            const token = await AsyncStorage.getItem('@token');
            if (userDataString && token) {
                const parsedUserData = JSON.parse(userDataString);
                setUserData(parsedUserData);
                setUserToken(token);
                setLoggedIn(true);
                return { isLoggedIn: true, userData: parsedUserData, token };
            } else {
                setUserData(null);
                setUserToken(null);
                setLoggedIn(false);
                return { isLoggedIn: false, userData: null, token: null };
            }
        } catch (e) {
            console.error('Failed to get user data', e);
            setUserData(null);
            setUserToken(null);
            setLoggedIn(false);
            return { isLoggedIn: false, userData: null, token: null };
        }
    };

    useEffect(() => {
        let isMounted = true;

        const checkUserAndFetchData = async () => {
            const { isLoggedIn, userData, token } = await getUserData();
            if (isMounted) {
                if (isLoggedIn && userData && token) {
                    await fetchMessages(token);
                    initializePusher(userData);
                } else {
                    setMessages([]);
                    setChatId(null);
                }
            }
        };

        const unsubscribe = navigation.addListener('focus', checkUserAndFetchData);

        checkUserAndFetchData();

        return () => {
            isMounted = false;
            unsubscribe();
        };
    }, [navigation]);

    const initializePusher = useCallback((userData) => {
        if (!userData || !userData.id) return;

        const pusher = new Pusher('9e6dd00ba6c994e5ebfe', {
            cluster: 'eu'
        });

        const channel = pusher.subscribe(`chat_${userData.id}`);
        channel.bind('new-message', (data) => {
            setMessages(prevMessages => {
                if (!prevMessages.some(msg => msg.id === data.id)) {
                    return [...prevMessages, data];
                }
                return prevMessages;
            });
            flatListRef.current?.scrollToEnd({animated: true});
        });

        return () => {
            pusher.unsubscribe(`chat_${userData.id}`);
        };
    }, []);

    const fetchMessages = useCallback(async (token) => {
        if (!token) return;

        try {
            const response = await fetch('https://travelcom.online/api/chat/get_messages', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (data && Array.isArray(data.messages)) {
                setMessages(data.messages);
                setChatId(data.id);
                setTimeout(() => flatListRef.current?.scrollToEnd({animated: false}), 100);
            } else {
                console.error('Unexpected data format:', data);
                setMessages([]);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    }, []);

    const sendMessage = async () => {
        if (inputMessage.trim() === '' || !userData || !userToken || !chatId) return;

        try {
            const response = await fetch('https://travelcom.online/api/chat/send_message', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: inputMessage,
                    userId: userData.id,
                    chatId: chatId,
                }),
            });

            if (response.ok) {
                setInputMessage('');
            } else {
                console.error('Failed to send message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    };

    const renderMessage = ({ item }) => {
        const isOutgoing = item.user_id === userData.id;
        const MessageComponent = isOutgoing ? OutgoingMessage : IncomingMessage;

        return (
            <MessageComponent
                message={item.text}
                time={formatTime(item.created_at)}
            />
        );
    };

    if (!userData || !userToken) {
        return (
            <View style={[styles.container, {backgroundColor: 'white'}]}>
                <View style={styles.loginFlexbox}>
                    <Text style={styles.loginText}>Please login to use chat</Text>
                </View>
            </View>
        )
    }

    function renderContent() {
        return (
            <>
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={(item) => item.id.toString()}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({animated: true})}
                />
                <View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={inputMessage}
                            onChangeText={setInputMessage}
                            placeholder="Type a message..."
                            placeholderTextColor='#d0d0d0'
                            multiline={true}
                            numberOfLines={2}
                        />
                        <TouchableOpacity style={styles.attachButton} onPress={togglePicker}>
                            <View>
                                <PaperclipIcon/>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                            <ChatSendIcon/>
                        </TouchableOpacity>
                    </View>
                    {isPickerVisible && (
                        <View style={styles.pickerContainer}>
                            <TouchableOpacity style={styles.pickerOption} onPress={pickImage}>
                                <Text style={styles.blueText}>Image</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.pickerOption} onPress={pickDocument}>
                                <Text style={styles.blueText}>Document</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
            keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        >
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id.toString()}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({animated: true})}
            />
            <View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={inputMessage}
                        onChangeText={setInputMessage}
                        placeholder="Type a message..."
                        placeholderTextColor='#d0d0d0'
                        multiline={true}
                        numberOfLines={2}
                    />
                    <TouchableOpacity style={styles.attachButton} onPress={togglePicker}>
                        <View>
                            <PaperclipIcon/>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                        <ChatSendIcon/>
                    </TouchableOpacity>
                </View>
                {isPickerVisible && (
                    <View style={styles.pickerContainer}>
                        <TouchableOpacity style={styles.pickerOption} onPress={pickImage}>
                            <Text style={styles.blueText}>Image</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.pickerOption} onPress={pickDocument}>
                            <Text style={styles.blueText}>Document</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </KeyboardAvoidingView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    incomingMessageContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginVertical: 5,
        marginHorizontal: 10,
    },
    outgoingMessageContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginVertical: 5,
        marginHorizontal: 10,
    },
    incomingMessageBubble: {
        backgroundColor: '#ffffff',
        borderRadius: 15,
        padding: 10,
        maxWidth: '80%',
    },
    loginFlexbox: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    loginText: {
        fontSize: 18,
        fontFamily: 'Montserrat-Bold',
        color: '#207FBF'
    },
    outgoingMessageBubble: {
        backgroundColor: '#d0ecff',
        borderRadius: 15,
        padding: 10,
        maxWidth: '80%',
    },
    messageText: {
        fontSize: 16,
        fontFamily: 'Montserrat-Regular'
    },
    messageTime: {
        fontSize: 12,
        color: '#888',
        alignSelf: 'flex-end',
        marginTop: 5,
    },
    inputContainer: {
        height: 70,
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#FFFFFF',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#d0d0d0',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    sendButton: {
        borderRadius: 100,
        justifyContent: 'center',
    },
    sendButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    messageImage: {
        height: 250,
        resizeMode: 'contain',
        borderRadius: 6
    },
    documentIcon: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
    },
    documentText: {
        color: '#207fbf',
        marginTop: 5,
        fontFamily: 'Montserrat-Regular'
    },
    attachButton: {
        padding: 10,
        marginRight: 5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    pickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        gap: 10,
        paddingHorizontal: 10,
        paddingBottom: 10,
        backgroundColor: '#fff'
    },
    pickerOption: {
        width: '48%',
        padding: 10,
        borderRadius: 10,
        borderColor: '#207FBF',
        borderWidth: 1,
        backgroundColor: '#fff',
    },
    blueText: {
        color: '#207FBF',
        fontSize: 14,
        fontFamily: 'Montserrat-Regular',
        textAlign: 'center'
    }
});