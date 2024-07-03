import {TouchableOpacity, StyleSheet, Text, View, Linking} from "react-native";
import {InstagramIcon} from "./icons/instagram-icon";
import {FacebookIcon} from "./icons/facebook-icon";
import {TwitterIcon} from "./icons/twitter-icon";
import {LinkedinIcon} from "./icons/linkedin";
import Logo from "./icons/logo";
import {useNavigation} from "@react-navigation/native";

export function FooterRaw({color, navigation}){
    return(
        <View style={[styles.footerMain, {backgroundColor: color}]}>
            <View style={styles.iconRow}>
                <TouchableOpacity>
                    <InstagramIcon/>
                </TouchableOpacity>
                <TouchableOpacity>
                    <FacebookIcon/>
                </TouchableOpacity>
                <TouchableOpacity>
                    <TwitterIcon/>
                </TouchableOpacity>
                <TouchableOpacity>
                    <LinkedinIcon/>
                </TouchableOpacity>
            </View>
            <Logo color='#207FBF' width={140} height={60}/>
            <View>
                <Text style={styles.footerLinkBlue}>Rumors Limited</Text>
            </View>
            <TouchableOpacity onPress={() => Linking.openURL('mailto:info@travelcom.com') }>
                <Text style={styles.footerLinkBlue}>info@travelcom.com</Text>
            </TouchableOpacity>
            <TouchableOpacity>
                <Text style={styles.footerLinkBlue}>International House, 55 Longsmith Street, Gloucester, UKВ </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Privacy')}>
                <Text style={styles.footerLink}>Privacy Policy</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Terms')}>
                <Text style={styles.footerLink}>Terms & Conditions</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Refunds')}>
                <Text style={styles.footerLink}>Cancellations & Refunds</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('FAQ')}>
                <Text style={styles.footerLink}>FAQ</Text>
            </TouchableOpacity>
            <Text style={styles.footerSmallText}>Copyright ©Travelcom. All Rights Reserved </Text>
        </View>
    )
}

export function Footer({color}){
    const navigation = useNavigation();
    return(
        <FooterRaw color={color} navigation={navigation}/>
    )
}

const styles = StyleSheet.create({
    footerMain: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        paddingVertical: 50,
        paddingHorizontal: 15,
    },
    iconRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 25,
    },
    footerLink: {
        fontFamily: 'Montserrat-Light',
        textAlign: 'center',
        fontSize: 18,
    },
    footerLinkBlue: {
        fontFamily: 'Montserrat-Light',
        textAlign: 'center',
        fontSize: 18,
        color: '#207FBF'
    },
    footerSmallText: {
        fontSize: 12,
    }
});