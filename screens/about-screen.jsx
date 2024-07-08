import {ScrollView, Text, View, StyleSheet, Image, TouchableOpacity, Linking} from "react-native";
import {AddressIcon} from "../components/icons/address-icon";
import MailIcon from "../components/icons/mail-icon";
import {Footer} from "../components/footer";

export default function AboutScreen() {
    return(
        <ScrollView>
            <View style={styles.aboutFlexbox}>
                <Text style={styles.titleText}>About the company</Text>
                <View style={{width: '100%'}}>
                    <Image style={styles.aboutImage} source={require('../assets/about-image-1.png')}/>
                </View>
                <Text style={styles.aboutText}>
                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.
                    Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus
                    mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa
                    quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo,
                    rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium.
                    Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus.
                </Text>
                <Text style={styles.aboutText}>
                    Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus
                    in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque
                    rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi.
                    Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper
                    libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar,
                    hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero
                    venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo.
                </Text>
                <Text style={styles.aboutText}>
                    Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum
                    sodales, augue velit cursus nunc,Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
                    commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient
                    montes, nascetur ridiculus mus.
                </Text>
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
                        <MailIcon color='#207FBF'/>
                        <Text style={styles.blueText}>E-mail</Text>
                    </View>
                    <TouchableOpacity onPress={() => Linking.openURL('mailto:info@travelcom.com')}>
                        <Text style={styles.blueTextSmall}>info@nobleconseirge.com</Text>
                    </TouchableOpacity>
                </View>
                <Footer/>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    titleText: {
        fontSize: 26,
        fontFamily: 'Montserrat-Bold',
        textAlign: 'center',
    },
    aboutText: {
        fontSize: 12,
        fontFamily: 'Montserrat-Regular'
    },
    aboutFlexbox: {
        backgroundColor: 'white',
        padding: 15,
        gap: 20
    },
    aboutImage: {
        width: '100%',
        height: undefined,
        aspectRatio: 3/4,
        borderRadius: 10
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
    }
})