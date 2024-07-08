import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import airlinesImg from "../assets/airlines.png";
import {SearchIcon} from "../components/icons/search-icon";
import {FilterIcon} from "../components/icons/filter-icon";
import {Footer} from "../components/footer";
import {FlightCard, TransferFlightCard} from "../components/flight-cards";
import {AutoCompleteInput} from "../components/autocomplete-input";
import {DateInput} from "../components/input-date";
import {PassengerDropdown} from "../components/passengers-selector";
import {useEffect, useState} from "react";

export default function FlightsScreen() {
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCities();
    }, []);

    const fetchCities = async () => {
        if (cities.length > 0) return;
        try {
            setLoading(true);
            const response = await fetch('https://countriesnow.space/api/v0.1/countries/cities', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    country: 'Nigeria'
                }),
            });
            const data = await response.json();
            if (data.data && Array.isArray(data.data)) {
                setCities(data.data);
            }
        } catch (error) {
            console.error('Error fetching cities:', error);
        } finally {
            setLoading(false);
        }
    };

    return(
        <ScrollView>
            <View style={styles.flightsInputForm}>
                <AutoCompleteInput title='From' airportsData={cities}/>
                <AutoCompleteInput title='Where' airportsData={cities}/>
                <View style={styles.selector}>
                    <View style={{marginVertical: 7}}>
                        <DateInput/>
                    </View>
                    <View style={styles.separator}/>
                    <Pressable style={{marginVertical: 7}}>
                        <DateInput/>
                    </Pressable>
                </View>
                <PassengerDropdown/>
                <View style={styles.flexCenter}>
                    <TouchableOpacity activeOpacity={0.8} style={[styles.searchBtn, styles.flexCenter]}>
                        <View style={[styles.flexCenter, {gap: 4}]}>
                            <SearchIcon/>
                            <Text style={styles.btnText}>Search</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.flightsList}>
                <Pressable style={{marginBottom: 8}}>
                    <FilterIcon/>
                </Pressable>
                <FlightCard
                    price={200}
                    flightTime='5h, 20min'
                    depCity='London'
                    depAirport='Luton Airport, LTN'
                    depTime='11:10'
                    depDate='2/03/2024'
                    arrivalCity='Paris'
                    arrivalTime='16:30'
                    arrivalDate='2/03/2024'
                    arrivalAirport='Paris Airport, CGA'
                    airlinesTitle='Aegean Airlines'
                    airlinesImg={airlinesImg}
                    btnShown={true}
                />
                <TransferFlightCard
                    price={400}
                    flightTime1='5h, 20min'
                    depCity1='London'
                    depAirport1='Luton Airport, LTN'
                    depTime1='11:10'
                    depDate1='2/03/2024'
                    arrivalCity1='Paris'
                    arrivalAirport1='Paris Airport, CGA'
                    arrivalTime1='16:30'
                    arrivalDate1='2/03/2024'
                    airlinesImg1={airlinesImg}
                    airlinesImg2={airlinesImg}
                    airlinesTitle1='Aegean Airlines'
                    airlinesTitle2='Aegean Airlines'
                    arrivalCity2='Barcelona'
                    arrivalAirport2='Barcelona Airport, BNA'
                    depDate2='2/03/2024'
                    depTime2='17:40'
                    arrivalTime2='21:40'
                    arrivalDate2='2/03/2024'
                    transferTime='1h, 10min'
                    btnShown={true}
                />
                <TouchableOpacity activeOpacity={0.8} style={[styles.showMoreBtn, {paddingVertical: 18}]}>
                    <Text style={styles.btnText}>Show more</Text>
                </TouchableOpacity>
            </View>
            <Footer/>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    mainText: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 15,
        color: 'black'
    },
    largeText: {
        fontSize: 24,
        fontFamily: 'Montserrat-Bold',
        marginBottom: 14,
        textAlign: 'right'
    },
    smallText: {
        fontSize: 12,
        fontFamily: 'Montserrat-Regular'
    },
    smallTextBlue: {
        fontSize: 12,
        color: '#207FBF',
        fontFamily: 'Montserrat-Bold'
    },
    greyText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 11,
        color: '#B3B3B3',
        maxWidth: 130
    },
    flightsInputForm : {
        position: "relative",
        backgroundColor: 'white',
        padding: 15,
        display: 'flex',
        flexDirection: 'column',
        gap: 15
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
        height: 64,
        paddingHorizontal: 25,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#207FBF',
        borderRadius: 10
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
    flightsList: {
        padding: 15,
    },
    showMoreBtn: {
        padding: 12,
        borderRadius: 10,
        backgroundColor: '#207FBF',
    },
    loadingContainer: {
        flex: 1,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 20,
        fontFamily: 'Montserrat-Bold',
        marginLeft: 10,
    },
});