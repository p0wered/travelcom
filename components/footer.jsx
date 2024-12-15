import {TouchableOpacity, StyleSheet, Text, View, Linking} from "react-native";
import {InstagramIcon} from "./icons/instagram-icon";
import {FacebookIcon} from "./icons/facebook-icon";
import {TwitterIcon} from "./icons/twitter-icon";
import {LinkedinIcon} from "./icons/linkedin";
import Logo from "./icons/logo";
import {useNavigation} from "@react-navigation/native";
import {useInformationContext} from "../contextProvider";

export function FooterRaw({color, navigation}) {
    const {information, error} = useInformationContext();

    if (error) return <Text>Error loading footer information</Text>;
    if (!information) return null;

    const renderSocialButton = (url, Icon) => {
        return url ? (
            <TouchableOpacity onPress={() => Linking.openURL(url)}>
                <Icon />
            </TouchableOpacity>
        ) : null;
    };

    return (
        <View style={[styles.footerMain, { backgroundColor: color }]}>
            <View style={styles.iconRow}>
                {renderSocialButton(information.instagram, InstagramIcon)}
                {renderSocialButton(information.facebook, FacebookIcon)}
                {renderSocialButton(information.twitter, TwitterIcon)}
                {renderSocialButton(information.linkedin, LinkedinIcon)}
            </View>
            <Logo color='#207FBF' width={140} height={60} />
            <View>
                <Text style={styles.footerLinkBlue}>{information.site_name}</Text>
            </View>
            <TouchableOpacity onPress={() => Linking.openURL(`mailto:${information.site_email}`)}>
                <Text style={styles.footerLinkBlue}>{information.site_email}</Text>
            </TouchableOpacity>
            <TouchableOpacity>
                <Text style={styles.footerLinkBlue}>
                    {information.site_address}
                </Text>
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
            <Text style={styles.footerSmallText}>{information.copyright}</Text>
        </View>
    )
}

export function Footer({ color }) {
    const navigation = useNavigation();
    return (
        <FooterRaw color={color} navigation={navigation} />
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
