import {ScrollView, Text, View, StyleSheet, Image, TouchableOpacity, Linking, useWindowDimensions} from "react-native";
import {AddressIcon} from "../components/icons/address-icon";
import MailIcon from "../components/icons/mail-icon";
import {Footer} from "../components/footer";
import axios from "axios";
import React, {useEffect, useState} from "react";
import {useInformationContext} from "../contextProvider";
import RenderHtml from "react-native-render-html";

export default function AboutScreen() {
    const [image, setImage] = useState(null);
    const [text, setText] = useState(null);
    const {information} = useInformationContext();
    const {width} = useWindowDimensions();

    const fetchImage = async () => {
        try {
            const response = await axios.get("https://travelcom.online/api/images/get");
            setImage(response.data.about_page_1);
        } catch (error) {
            console.error(error);
        }
    }

    const fetchData = async () => {
        try {
            const response = await axios.get('https://travelcom.online/api/information/docs');
            setText(response.data.about);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchImage();
        fetchData();
    }, []);

    return(
        <ScrollView>
            <View style={styles.aboutFlexbox}>
                <Text style={styles.titleText}>About the company</Text>
                <View style={{width: '100%'}}>
                    <Image style={styles.aboutImage} source={{uri: image}}/>
                </View>
                <RenderHtml
                    contentWidth={width}
                    source={{html: text}}
                />
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
                        <MailIcon color='#207FBF'/>
                        <Text style={styles.blueText}>E-mail</Text>
                    </View>
                    <TouchableOpacity onPress={() => Linking.openURL(`mailto:${information.site_email}`)}>
                        <Text style={styles.blueTextSmall}>{information.site_email}</Text>
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
