import {Pressable, Text, TextInput, View, StyleSheet, ScrollView, TouchableOpacity, Linking} from "react-native";
import {SendIcon} from "../components/icons/send-icon";
import {Footer} from "../components/footer";
import {AddressIcon} from "../components/icons/address-icon";
import MailIcon from "../components/icons/mail-icon";

export default function HelpScreen() {
    return(
        <ScrollView>
            <View style={styles.questionForm}>
                <View style={{marginBottom: 30, marginTop: 15}}>
                    <Text style={styles.questionTitle}>
                        If you have any questions or problems with the registration, please contact us
                    </Text>
                </View>
                <View style={{display: 'flex', flexDirection: 'column', gap: 14}}>
                    <TextInput
                        style={styles.questionInput}
                        placeholder='Phone'
                        placeholderTextColor='grey'
                        autoComplete='tel'
                        keyboardType='number-pad'
                    />
                    <TextInput
                        style={styles.questionInput}
                        placeholder='E-mail'
                        placeholderTextColor='grey'
                        autoComplete='email'
                    />
                    <TextInput
                        style={[styles.questionInput, {height: 107}]}
                        placeholder='Your question'
                        placeholderTextColor='grey'
                        multiline = {true}
                        numberOfLines={4}
                    />
                </View>
                <Pressable style={styles.sendBtn}>
                    <Text style={styles.sendBtnText}>SEND</Text>
                    <SendIcon/>
                </Pressable>
            </View>
            <View style={styles.info}>
                <View>
                    <View style={styles.merger}>
                        <AddressIcon/>
                        <Text style={styles.blueText}>Address</Text>
                    </View>
                    <Text style={styles.blueTextSmall}>
                        International House, 55 Longsmith Street, Gloucester, UKВ
                    </Text>
                </View>
                <View>
                    <View style={styles.merger}>
                        <MailIcon/>
                        <Text style={styles.blueText}>E-mail</Text>
                    </View>
                    <TouchableOpacity onPress={() => Linking.openURL('mailto:info@travelcom.com')}>
                        <Text style={styles.blueTextSmall}>info@nobleconseirge.com</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Footer color='white'/>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    questionForm: {
        padding: 15,
        backgroundColor: '#207FBF'
    },
    questionTitle: {
        paddingHorizontal: 30,
        fontSize: 20,
        fontFamily: 'Montserrat-Bold',
        color: 'white',
        textTransform: 'uppercase',
        textAlign: 'center'
    },
    questionInput: {
        fontSize: 16,
        fontFamily: 'Montserrat-Bold',
        height: 64,
        paddingHorizontal: 25,
        backgroundColor: 'white',
        borderRadius: 10
    },
    sendBtn: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 10
    },
    sendBtnText: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 16,
        color: 'white'
    },
    merger: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 14
    },
    blueText: {
        fontSize: 15,
        fontFamily: 'Montserrat-Bold',
        color: '#207FBF'
    },
    blueTextSmall: {
        fontSize: 12,
        fontFamily: 'Montserrat-Medium',
        color: '#207FBF',
        maxWidth: 300
    },
    info: {
        padding: 20,
        display: "flex",
        flexDirection: 'column',
        gap: 15,
        backgroundColor: 'white'
    }
})