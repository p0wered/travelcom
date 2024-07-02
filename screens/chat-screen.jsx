import {Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import Logo from "../components/icons/logo";
import {useState} from "react";
import {ChatSendIcon} from "../components/icons/chat-send-icon";
import {PaperclipIcon} from "../components/icons/paperclip-icon";

export default function ChatScreen() {
    const [message, setMessage] = useState('');

    return(
        <View style={{flex: 1}}>
            <View style={styles.chatMerger}>
                <View style={styles.logoCircle}>
                    <Logo color='white' width={42} height={42}/>
                </View>
                <Text style={styles.mainText}>Chat with a Travelcom manager</Text>
            </View>
            <ScrollView style={styles.chatBody}>
                <Text style={[styles.msgTime, {paddingTop: 8, paddingBottom: 5}]}>Chat started</Text>
                <View style={styles.messageInWrap}>
                    <View style={styles.messageIncoming}>
                        <Text style={styles.msgText}>
                            Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
                            Aenean commodo ligula eget dolor. Aenean massa. Cum sociis
                            natoque penatibus et magnis dis parturient montes, nascetur
                            ridiculus mus. Donec quam felis, ultricies nec, pellentesque
                            eu, pretium quis, sem. Nulla consequat massa quis enim. Donec
                            pede justo, fringilla vel, aliquet nec, vulputate eget.
                        </Text>
                    </View>
                    <Text style={styles.msgTime}>18:00</Text>
                </View>
                <View style={styles.messageInWrap}>
                    <View style={styles.messageIncoming}>
                        <Text style={styles.msgText}>
                            Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
                            Aenean commodo ligula eget dolor. Aenean massa.
                        </Text>
                    </View>
                    <Text style={styles.msgTime}>18:00</Text>
                </View>
                <View style={styles.messageOutWrap}>
                    <View style={styles.messageOutgoing}>
                        <Text style={styles.msgText}>
                            Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
                            Aenean commodo ligula eget dolor. Aenean massa.
                        </Text>
                    </View>
                    <Text style={styles.msgTime}>18:00</Text>
                </View>
                <View style={styles.messageOutWrap}>
                    <View style={styles.messageOutgoing}>
                        <Text style={styles.msgText}>
                            Lorem ipsum dolor sit amet, consectetuer
                        </Text>
                    </View>
                    <Text style={styles.msgTime}>18:00</Text>
                </View>
                <View style={styles.messageOutWrap}>
                    <View style={styles.messageOutgoing}>
                        <Text style={styles.msgText}>
                            Lorem ipsum dolor sit amet, consectetuer
                        </Text>
                    </View>
                    <Text style={styles.msgTime}>18:00</Text>
                </View>
            </ScrollView>
            <View style={styles.inputContainer}>
                <View style={styles.inputMerger}>
                    <TextInput
                        style={styles.input}
                        value={message}
                        multiline={true}
                        onChangeText={setMessage}
                        placeholder="Type a message..."
                        placeholderTextColor='#a9a9a9'
                    />
                    <Pressable style={styles.paperclipPos}>
                        <PaperclipIcon/>
                    </Pressable>
                </View>
                <Pressable style={styles.sendButton}>
                    <ChatSendIcon/>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainText: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 14,
        color: 'black'
    },
    msgText: {
      fontSize: 11,
      fontFamily: 'Montserrat-Light'
    },
    msgTime: {
        fontSize: 11,
        color: '#9B9B9A',
        fontFamily: 'Montserrat-Light',
        marginBottom: 5,
        textAlign: 'center'
    },
    logoCircle: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
        borderRadius: 100,
        backgroundColor: '#207FBF'
    },
    chatMerger: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        borderBottomStartRadius: 10,
        borderBottomEndRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: 'white',
        zIndex: 1,
    },
    chatBody: {
        flex: 1,
        paddingHorizontal: 15
    },
    messageInWrap: {
        width: '100%',
        display: 'flex',
        alignItems: 'flex-end',
        flexDirection: 'row',
        gap: 6,
        marginBottom: 10
    },
    messageIncoming: {
        borderBottomEndRadius: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        backgroundColor: 'white',
        padding: 15,
        width: 'auto',
        maxWidth: 275
    },
    messageOutWrap: {
        width: '100%',
        display: 'flex',
        alignItems: 'flex-end',
        flexDirection: 'row-reverse',
        gap: 6,
        marginBottom: 10
    },
    messageOutgoing: {
        borderBottomEndRadius: 10,
        borderBottomStartRadius: 10,
        borderTopLeftRadius: 10,
        backgroundColor: 'white',
        padding: 15,
        width: 'auto',
        maxWidth: 275
    },
    inputContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    inputMerger: {
        position: 'relative',
        width: '100%',
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    paperclipPos: {
        right: 6,
        padding: 10,
        position: 'absolute'
    },
    input: {
        width: '100%',
        borderRadius: 10,
        backgroundColor: 'white',
        paddingLeft: 15,
        paddingRight: 44,
        paddingVertical: 12,
        fontSize: 11,
        fontFamily: 'Montserrat-Regular'
    },
    sendButton: {
        width: 40,
        height: 40,
        marginRight: 6,
        marginLeft: 12
    },
    sendButtonText: {
        color: 'white',
        fontSize: 20,
    },
});