import {Pressable, StyleSheet, Text, View} from "react-native";
import {InstagramIcon} from "./icons/instagram-icon";
import {FacebookIcon} from "./icons/facebook-icon";
import {TwitterIcon} from "./icons/twitter-icon";
import {LinkedinIcon} from "./icons/linkedin";
import Logo from "./icons/logo";

export function Footer(){
    return(
        <View style={styles.footerMain}>
            <View style={styles.iconRow}>
                <InstagramIcon/>
                <FacebookIcon/>
                <TwitterIcon/>
                <LinkedinIcon/>
            </View>
            <Logo color='#207FBF' width={140} height={60}/>
            <Pressable>
                <Text style={styles.footerLinkBlue}>Rumors Limited</Text>
            </Pressable>
            <Pressable>
                <Text style={styles.footerLinkBlue}>info@travelcom.com</Text>
            </Pressable>
            <Pressable>
                <Text style={styles.footerLinkBlue}>International House, 55 Longsmith Street, Gloucester, UKВ </Text>
            </Pressable>
            <Pressable>
                <Text style={styles.footerLink}>Privacy Policy</Text>
            </Pressable>
            <Pressable>
                <Text style={styles.footerLink}>Terms & Conditions</Text>
            </Pressable>
            <Pressable>
                <Text style={styles.footerLink}>Cancellations & Refunds</Text>
            </Pressable>
            <Pressable>
                <Text style={styles.footerLink}>FAQ</Text>
            </Pressable>
            <Text style={styles.footerSmallText}>Copyright ©Travelcom. All Rights Reserved </Text>
        </View>
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