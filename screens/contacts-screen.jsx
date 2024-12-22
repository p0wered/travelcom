import {Linking, ScrollView, Text, TouchableOpacity, View, StyleSheet} from "react-native";
import {AddressIcon} from "../components/icons/address-icon";
import MailIcon from "../components/icons/mail-icon";
import {InstagramIcon} from "../components/icons/instagram-icon";
import {FacebookIcon} from "../components/icons/facebook-icon";
import {TwitterIcon} from "../components/icons/twitter-icon";
import {LinkedinIcon} from "../components/icons/linkedin";
import {QuestionForm} from "../components/question-form";
import {useInformationContext} from "../contextProvider";
import {useCallback, useState} from "react";
import {useFocusEffect} from "@react-navigation/native";

export default function ContactsScreen({navigation}) {
    const {information, error} = useInformationContext();
    const [clearErrors, setClearErrors] = useState(false);

    useFocusEffect(
        useCallback(() => {
            setClearErrors(true);
            return () => {
                setClearErrors(false);
            };
        }, [])
    );

    const renderSocialButton = (url, Icon) => {
        return url ? (
            <TouchableOpacity onPress={() => Linking.openURL(url)}>
                <Icon />
            </TouchableOpacity>
        ) : null;
    };


    return(
        <ScrollView>
            <View style={styles.info}>
                <Text style={[styles.blueTextSmall, {fontSize: 18}]}>
                    {information.site_name}
                </Text>
                <View>
                    <View style={styles.merger}>
                        <AddressIcon/>
                        <Text style={styles.blueText}>Address</Text>
                    </View>
                    <Text style={styles.blueTextSmall}>
                        {information.site_address}
                    </Text>
                </View>
                <View>
                    <View style={styles.merger}>
                        <MailIcon color="#207FBF"/>
                        <Text style={styles.blueText}>E-mail</Text>
                    </View>
                    <TouchableOpacity onPress={() => Linking.openURL(`mailto:${information.site_email}`)}>
                        <Text style={styles.blueTextSmall}>{information.site_email}</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.blueText}>Follow us</Text>
                <View style={styles.iconRow}>
                    {renderSocialButton(information.instagram, InstagramIcon)}
                    {renderSocialButton(information.facebook, FacebookIcon)}
                    {renderSocialButton(information.twitter, TwitterIcon)}
                    {renderSocialButton(information.linkedin, LinkedinIcon)}
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
            <QuestionForm title='Any other question? Write to us!' clearErrors={clearErrors}/>
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
