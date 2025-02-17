import {ScrollView, Text, View, StyleSheet, ActivityIndicator, useWindowDimensions} from "react-native";
import {Footer} from "../components/footer";
import {generateAccordionItems} from "../components/accordion-list";
import {QuestionForm} from "../components/question-form";
import React, {useCallback, useEffect, useState} from "react";
import axios from "axios";
import RenderHtml from "react-native-render-html";
import {useFocusEffect} from "@react-navigation/native";

const fetchData = async (setData, setLoading) => {
    try {
        const response = await axios.get('https://travelcom.online/api/information/docs');
        const cleanedData = {
            ...response.data,
            privacy_policy: cleanHtml(response.data.privacy_policy),
            terms: cleanHtml(response.data.terms),
            refunds: cleanHtml(response.data.refunds)
        };
        setData(cleanedData);
        setLoading(false);
    } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
    }
};

const InfoScreen = ({title, content}) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const {width} = useWindowDimensions();

    useEffect(() => {
        fetchData(setData, setLoading);
    }, []);

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#207FBF" />
            </View>
        );
    }

    return (
        <ScrollView style={{backgroundColor: '#EDEDED'}}>
            <Text style={styles.titleText}>{title}</Text>
            <View style={styles.privacyFlexbox}>
                {data && data[content] ? (
                    <RenderHtml
                        contentWidth={width}
                        source={{html: data[content]}}
                        tagsStyles={tagsStyles}
                    />
                ) : (
                    <Text>{`Error fetching ${content}`}</Text>
                )}
            </View>
            <Footer />
        </ScrollView>
    );
};

const cleanHtml = (html) => {
    html = html.replace(/<p>\s*<\/p>/g, '');
    html = html.replace(/<o:p>\s*<\/o:p>/g, '');
    html = html.replace(/<br\s*\/?>/g, '');
    html = html.replace(/<p>\s*<br\s*\/?>\s*<\/p>/g, '');
    return html;
};

export function PrivacyScreen() {
    return <InfoScreen title="Privacy Policy" content="privacy_policy" />;
}

export function TermsScreen() {
    return <InfoScreen title="Terms & Conditions" content="terms" />;
}

export function RefundsScreen() {
    return <InfoScreen title="Cancellation & Refunds" content="refunds" />;
}

export function FaqScreen(){
    const [faqData, setFaqData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [clearErrors, setClearErrors] = useState(false);
    const accordionItems = generateAccordionItems(faqData);

    useFocusEffect(
        useCallback(() => {
            setClearErrors(true);
            return () => {
                setClearErrors(false);
            };
        }, [])
    );

    const fetchFaqData = async () => {
        try {
            const response = await fetch('https://travelcom.online/api/questions/get');
            const data = await response.json();
            setFaqData(data);
        } catch (error) {
            console.error('Error fetching FAQ data:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchFaqData();
    }, []);

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#207FBF" />
            </View>
        );
    }

    return(
        <ScrollView>
            <View style={styles.faqFlexbox}>
                <Text style={styles.faqText}>FAQ</Text>
                {accordionItems}
            </View>
            <QuestionForm title='Any other question? Write to us!' clearErrors={clearErrors}/>
            <Footer color='white'/>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    privacyFlexbox: {
        display: 'flex',
        flexDirection: 'column',
        paddingHorizontal: 15
    },
    titleText: {
        fontSize: 20,
        fontFamily: 'Montserrat-Bold',
        color: '#207FBF',
        padding: 15
    },
    faqText: {
        fontFamily: 'Montserrat-Bold',
        marginBottom: 15,
        fontSize: 30,
        color: '#207FBF',
        textAlign: 'center'
    },
    faqFlexbox: {
        padding: 14,
        backgroundColor: 'white'
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})

const tagsStyles = {
    p: {
        marginTop: 0,
        marginBottom: 3,
    },
    span: {
        marginTop: 0,
        marginBottom: 0,
    }
};

