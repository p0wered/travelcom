import React, {useCallback, useEffect, useState} from "react";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {generateAccordionItems} from "../components/accordion-list";
import axios from "axios";
import {
    ActivityIndicator,
    ImageBackground,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import {AutoCompleteInput} from "../components/autocomplete-input";
import {RoundTripSelector} from "../components/roundtrip-selector";
import {DateInput} from "../components/input-date";
import {PassengerDropdown} from "../components/passengers-selector";
import {SearchIcon} from "../components/icons/search-icon";
import {QuestionForm} from "../components/question-form";
import {Footer} from "../components/footer";
import {BlogList, DirectionsList} from "./home-screen";
import {useGlobalContext} from "../contextHome";

export default function HomeSearchScreen() {
    const { mainImage, setMainImage, directions, setDirections, news, setNews, faqData, setFaqData } = useGlobalContext();
    const [loading, setLoading] = useState(true);
    const [clearErrors, setClearErrors] = useState(false);
    const navigation = useNavigation();
    const accordionItems = generateAccordionItems(faqData);
    const [airportFrom, setAirportFrom] = useState('');
    const [fromSuggestions, setFromSuggestions] = useState([]);
    const [airportTo, setAirportTo] = useState('');
    const [whereSuggestions, setWhereSuggestions] = useState([]);
    const [dateStart, setDateStart] = useState(new Date());
    const [dateEnd, setDateEnd] = useState(new Date());
    const [roundTrip, setRoundTrip] = useState(true);
    const [passengers, setPassengers] = useState({
        adults: 1,
        children: 0,
        infants: 0,
    });

    const handleSearch = () => {
        const searchParams = {
            airportFrom,
            airportTo,
            dateStart,
            dateEnd,
            roundTrip,
            passengers
        };
        console.log('Sending to flight results screen', searchParams)
        navigation.navigate('FlightResults', searchParams);
    };

    const fetchMainImage = async () => {
        if (!mainImage) {
            setLoading(true);
            try {
                const response = await axios.get("https://travelcom.online/api/images/get");
                setMainImage(response.data.mainImage);
            } catch (error) {
                console.error(error);
            }
        }
    }

    const fetchDirections = async () => {
        if (directions.length === 0) {
            try {
                const response = await axios.get('https://travelcom.online/api/country/get-for-main-page');
                setDirections(response.data);
            } catch (error) {
                console.error('Error fetching directions:', error);
            }
        }
    };

    const fetchNews = async () => {
        if (news.length === 0) {
            try {
                const response = await axios.get('https://travelcom.online/api/news/get-for-main-page');
                setNews(response.data);
            } catch (error) {
                console.error('Error fetching news:', error);
            }
        }
    };

    const fetchFaqData = async () => {
        if (faqData.length === 0) {
            try {
                const response = await fetch('https://travelcom.online/api/questions/get');
                const data = await response.json();
                setFaqData(data);
            } catch (error) {
                console.error('Error fetching FAQ data:', error);
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchMainImage();
        fetchDirections();
        fetchNews();
        fetchFaqData();
    }, []);

    useFocusEffect(
        useCallback(() => {
            setClearErrors(true);
            return () => {
                setClearErrors(false);
            };
        }, [])
    );

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#207FBF" />
            </View>
        );
    }

    return (
        <ScrollView style={{flex: 1}}>
            <ImageBackground source={{uri: mainImage}} style={{width: '100%', height: 'auto', paddingBottom: 100}}>
                <View style={styles.offerTravel}>
                    <View style={styles.offerTitle}>
                        <Text numberOfLines={3} style={styles.offerTitleText}>Knows what you need</Text>
                    </View>
                    <View style={{backgroundColor: 'white'}}>
                        <View style={styles.flightsInputForm}>
                            <AutoCompleteInput
                                title='From'
                                inputText={airportFrom}
                                setInputText={setAirportFrom}
                                suggestions={fromSuggestions}
                                setSuggestions={setFromSuggestions}
                            />
                            <AutoCompleteInput
                                title='Where'
                                inputText={airportTo}
                                setInputText={setAirportTo}
                                suggestions={whereSuggestions}
                                setSuggestions={setWhereSuggestions}
                            />
                            <RoundTripSelector roundTrip={roundTrip} setRoundTrip={setRoundTrip} setBackDate={setDateEnd}/>
                            <View style={[styles.selector, Platform.OS === 'ios' ? styles.selectorIOS : styles.selectorAndroid]}>
                                <View style={{marginVertical: 7}}>
                                    <DateInput inCheckout={false} onlyNextDates={true} date={dateStart} setDate={setDateStart}/>
                                </View>
                                <View style={[styles.separator, roundTrip ? {display: 'flex'} : {display: 'none'}, Platform.OS === 'ios' ? {marginRight: -10} : {marginRight: 0}]}/>
                                <View style={[{marginVertical: 7}, roundTrip ? {display: 'flex'} : {display: 'none'}]}>
                                    <DateInput inCheckout={false} onlyNextDates={true} date={dateEnd} setDate={setDateEnd}/>
                                </View>
                            </View>
                            <PassengerDropdown passengers={passengers} setPassengers={setPassengers}/>
                            <View style={styles.flexCenter}>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={[styles.searchBtn, styles.flexCenter]}
                                    onPress={handleSearch}
                                >
                                    <View style={[styles.flexCenter, {gap: 4}]}>
                                        <SearchIcon/>
                                        <Text style={styles.btnText}>Search</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </ImageBackground>
            <DirectionsList navigation={navigation} directions={directions}/>
            <BlogList navigation={navigation} setLoading={setLoading} news={news}/>
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
    mainText: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 14,
        color: 'white'
    },
    offerTravel: {
        paddingTop: 14,
    },
    offerTitle: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4
    },
    offerTitleText: {
        fontFamily: 'Montserrat-Bold',
        color: 'white',
        textAlign: 'center',
        fontSize: 32,
        width: 220,
        height: 120,
        textTransform: 'uppercase'
    },
    seleneForm: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingTop: 17,
        paddingLeft: 14,
        paddingRight: 14,
        paddingBottom: 45
    },
    formText: {
        fontSize: 20,
        fontFamily: 'Montserrat-Regular',
        marginTop: 70,
        marginBottom: 70,
        textAlign: 'center',
        maxWidth: 500
    },
    mainBtn: {
        padding: 15,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: '#207FBF',
    },
    formBtn: {
        bottom: -22,
        position: 'absolute',
    },
    directionTitle: {
        position: 'absolute',
        top: -55,
        height: 100,
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 20,
        paddingBottom: 60,
        borderRadius: 10,
        backgroundColor: '#207FBF'
    },
    directionItem: {
        width: '100%',
        maxWidth: 500,
        height: 222,
        borderRadius: 10,
        overflow: "hidden",
        marginBottom: 15,
        position: 'relative',
        margin: 'auto',
    },
    directionInner: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        top: 12,
        left: 12
    },
    directionFlexbox: {
        width: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        padding: 14,
        marginBottom: 5,
    },
    blogFlexbox: {
        position: 'relative',
        backgroundColor: '#207FBF',
        display: 'flex',
        flexDirection: 'column',
        paddingVertical: 14,
        paddingTop: 20,
        gap: 15
    },
    blogBtn: {
        position: 'absolute',
        backgroundColor: 'white',
        top: -44,
    },
    faqText: {
        fontFamily: 'Montserrat-Bold',
        marginBottom: 15,
        fontSize: 30,
        color: '#207FBF',
        textAlign: 'center'
    },
    faqFlexbox: {
        padding: 14
    },
    accordionItem: {
        height: 51,
        borderWidth: 1,
        borderColor: '#207FBF',
        borderRadius: 10,
        marginBottom: 12
    },
    accordionItemActive: {
        height: 'auto',
        backgroundColor: '#207FBF',
    },
    accordionInner: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: 15
    },
    separatorAccordion: {
        width: '100%',
        height: 1,
        backgroundColor: 'white'
    },
    arrowContainer: {
        position: 'relative',
        width: 15,
        height: 15,
    },
    arrowWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    flightsInputForm : {
        position: "relative",
        padding: 15,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
    },
    flexCenter: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    selector: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        overflow: "hidden",
        justifyContent: 'space-between',
        paddingHorizontal: 25,
        height: 64,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#207FBF',
        borderRadius: 10
    },
    selectorAndroid: {

    },
    selectorIOS: {

    },
    selectorText: {
        fontFamily: 'Montserrat-Bold',
        color: '#207FBF'
    },
    separator: {
        width: 86,
        height: 1,
        backgroundColor: '#207FBF'
    },
    selectorTextGrey: {
        fontSize: 11,
        fontFamily: 'Montserrat-Regular',
        color: '#9B9B9A'
    },
    searchBtn: {
        width: 166,
        padding: 12,
        borderRadius: 10,
        backgroundColor: '#207FBF',
    },
    btnText: {
        fontFamily: 'Montserrat-Bold',
        color: 'white',
        textAlign: 'center'
    },
    mainBlueText: {
        color: '#207FBF',
        fontSize: 18,
        fontFamily: 'Montserrat-Bold'
    }
});
