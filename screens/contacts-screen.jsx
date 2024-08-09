import {Linking, ScrollView, Text, TouchableOpacity, View, StyleSheet} from "react-native";
import {AddressIcon} from "../components/icons/address-icon";
import MailIcon from "../components/icons/mail-icon";
import {InstagramIcon} from "../components/icons/instagram-icon";
import {FacebookIcon} from "../components/icons/facebook-icon";
import {TwitterIcon} from "../components/icons/twitter-icon";
import {LinkedinIcon} from "../components/icons/linkedin";
import {QuestionForm} from "../components/question-form";

export default function ContactsScreen({navigation}) {
    return(
        <ScrollView>
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
                        <MailIcon color="#207FBF"/>
                        <Text style={styles.blueText}>E-mail</Text>
                    </View>
                    <TouchableOpacity onPress={() => Linking.openURL('mailto:info@travelcom.com')}>
                        <Text style={styles.blueTextSmall}>info@travelcom.com</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.blueText}>Follow us</Text>
                <View style={styles.iconRow}>
                    <TouchableOpacity onPress={() => Linking.openURL('https://instagram.com')}>
                        <InstagramIcon/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => Linking.openURL('https://facebook.com')}>
                        <FacebookIcon/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => Linking.openURL('https://twitter.com')}>
                        <TwitterIcon/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => Linking.openURL('https://linkedin.com')}>
                        <LinkedinIcon/>
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity onPress={() => navigation.navigate('Privacy')}>
                        <Text style={styles.contactsLink}>Privacy Policy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Terms')}>
                        <Text style={styles.contactsLink}>Terms & Conditions</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Refunds')}>
                        <Text style={styles.contactsLink}>Cancellations & Refunds</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('FAQ')}>
                        <Text style={styles.contactsLink}>FAQ</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <QuestionForm title='Any other question? Write to us!'/>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
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
        maxWidth: 300,
        width: 'auto'
    },
    info: {
        padding: 20,
        display: "flex",
        flexDirection: 'column',
        gap: 15,
        backgroundColor: 'white'
    },
    iconRow: {
        display: 'flex',
        flexDirection: 'row',
        gap: 25,
    },
    contactsLink: {
        fontSize: 15,
        fontFamily: 'Montserrat-Medium',
        color: '#207fbf',
        maxWidth: 200,
        paddingVertical: 12
    }
})
