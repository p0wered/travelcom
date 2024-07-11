import {
    ActivityIndicator, Alert,
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
import {FlightCard} from "../components/flight-cards";
import {AutoCompleteInput} from "../components/autocomplete-input";
import {DateInput} from "../components/input-date";
import {PassengerDropdown} from "../components/passengers-selector";
import {useEffect, useState} from "react";
import {RoundTripSelector} from "../components/roundtrip-selector";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function FlightsScreen() {
    const [airportFrom, setAirportFrom] = useState('');
    const [fromSuggestions, setFromSuggestions] = useState([]);
    const [airportTo, setAirportTo] = useState('');
    const [whereSuggestions, setWhereSuggestions] = useState([]);
    const [dateStart, setDateStart] = useState(new Date());
    const [dateEnd, setDateEnd] = useState(new Date());
    const [roundTrip, setRoundTrip] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [passengers, setPassengers] = useState({
        adults: 1,
        children: 1,
        infants: 0,
    });
    const [flightResults, setFlightResults] = useState([]);
    const [visibleFlights, setVisibleFlights] = useState(5);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const userString = await AsyncStorage.getItem('@user');
            if (userString) {
                const user = JSON.parse(userString);
                setUserId(user.id);
            }
        } catch (error) {
            console.error('Failed to get user data', error);
        }
    };

    const addToCart = async (flight) => {
        if (!userId) {
            Alert.alert('Error', 'Please log in to add flights to cart');
            return;
        }

        try {
            const cartKey = `@cart_${userId}`;
            const cartString = await AsyncStorage.getItem(cartKey);
            let cart = cartString ? JSON.parse(cartString) : [];

            // Добавляем уникальный идентификатор к каждому билету
            const flightWithId = { ...flight, id: Date.now().toString() };
            cart.push(flightWithId);

            await AsyncStorage.setItem(cartKey, JSON.stringify(cart));
            console.log('Cart after adding:', JSON.stringify(cart, null, 2));
            Alert.alert('Success', 'Flight added to cart');
        } catch (error) {
            console.error('Failed to add flight to cart', error);
            Alert.alert('Error', 'Failed to add flight to cart');
        }
    };

    const handleSearch = async () => {
        setIsLoading(true)

        const payload = {
            adults: passengers.adults,
            airportFrom: getAirportCode(airportFrom),
            airportTo: getAirportCode(airportTo),
            children: passengers.children,
            dateEnd: formatDate(dateEnd),
            dateStart: formatDate(dateStart),
            infants: passengers.infants,
            isRoundtrip: roundTrip
        };

        console.log('sending data:', JSON.stringify(payload, null, 2));

        try {
            const response = await axios.post('https://travelcom.online/api/crpo/getFlights', payload);
            setFlightResults(response.data);
            setVisibleFlights(5);
            console.log('response:', JSON.stringify(response.data, null, 2));
        } catch (error) {
            console.error('error fetching flights:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleShowMore = () => {
        setVisibleFlights(prevVisible => prevVisible + 5);
    };

    const getAirportCode = (fullAirportName) => {
        if (!fullAirportName || fullAirportName.length < 3) {
            console.warn(`Неверный формат названия аэропорта: "${fullAirportName}"`);
            return '';
        }
        return fullAirportName.slice(0, 3).toUpperCase();
    };

    const formatDate = (date) => {
        if (date !== null){
            return date.toLocaleDateString('ru-RU', {day: '2-digit', month: '2-digit', year: 'numeric'}).replace(/\//g, '.');
        } else {
            return null;
        }
    };

    return(
        <ScrollView>
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
                <View style={styles.selector}>
                    <View style={{marginVertical: 7}}>
                        <DateInput date={dateStart} setDate={setDateStart}/>
                    </View>
                    <View style={[styles.separator, roundTrip ? {display: 'flex'} : {display: 'none'}]}/>
                    <View style={[{marginVertical: 7}, roundTrip ? {display: 'flex'} : {display: 'none'}]}>
                        <DateInput date={dateEnd} setDate={setDateEnd}/>
                    </View>
                </View>
                <PassengerDropdown passengers={passengers} setPassengers={setPassengers}/>
                <View style={styles.flexCenter}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[styles.searchBtn, styles.flexCenter]}
                        onPress={handleSearch}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#ffffff" />
                        ) : (
                            <View style={[styles.flexCenter, {gap: 4}]}>
                                <SearchIcon/>
                                <Text style={styles.btnText}>Search</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.flightsList}>
                <Pressable style={{marginBottom: 8}}>
                    <FilterIcon/>
                </Pressable>
                {flightResults.slice(0, visibleFlights).map((flight, index) => (
                    <FlightCard
                        key={index}
                        price={flight.price}
                        flightTime={`${flight.duration.flight.hour}h, ${flight.duration.flight.minute}min`}
                        depCity={flight.depCity.title}
                        depAirport={`${flight.depAirport.title}, ${flight.depAirport.code}`}
                        depTime={flight.depTime}
                        depDate={flight.depDate}
                        arrivalCity={flight.arriveCity.title}
                        arrivalTime={flight.arriveTime}
                        arrivalDate={flight.arriveDate}
                        arrivalAirport={`${flight.arriveAirport.title}, ${flight.arriveAirport.code}`}
                        airlinesTitle={flight.provider.supplier.title}
                        airlinesImg={airlinesImg}
                        btnText="Add to cart"
                        onPress={() => addToCart(flight)}
                    />
                ))}
                {visibleFlights < flightResults.length && (
                    <TouchableOpacity activeOpacity={0.8} style={[styles.showMoreBtn, {paddingVertical: 18}]} onPress={handleShowMore}>
                        <Text style={styles.btnText}>Show more</Text>
                    </TouchableOpacity>
                )}
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