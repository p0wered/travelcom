import {
    ActivityIndicator, Alert, Image,
    ScrollView,
    StyleSheet,
    Text, TextInput,
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
import {useCallback, useEffect, useState} from "react";
import {RoundTripSelector} from "../components/roundtrip-selector";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useFocusEffect} from "@react-navigation/native";
import Arrow from "../components/icons/arrow-icon";
import {DayIcon} from "../components/icons/day-icon";
import {NightIcon} from "../components/icons/night-icon";
import {CheckIcon} from "../components/icons/check-icon";

export const convertPrice = (rubles) => {
    const euros = rubles / 95.32;
    return Math.round(euros);
};

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
    const [visibleFlights, setVisibleFlights] = useState(12);
    const [userId, setUserId] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [filtersVisible, setFiltersVisible] = useState(false);
    const [dayFlightsOnly, setDayFlightsOnly] = useState(false);
    const [nightFlightsOnly, setNightFlightsOnly] = useState(false);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [selectedAirlines, setSelectedAirlines] = useState([]);
    const [availableAirlines, setAvailableAirlines] = useState([]);
    const [filteredResults, setFilteredResults] = useState([]);
    const [favoriteItems, setFavoriteItems] = useState([]);
    const [errorMsg, setErrorMsg] = useState(undefined);

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

    const applyFilters = () => {
        let filtered = [...flightResults];
        if (dayFlightsOnly) {
            filtered = filtered.filter(flight => {
                const depHour = parseInt(flight.depTime.split(':')[0]);
                return depHour >= 6 && depHour < 22;
            });
        }
        if (nightFlightsOnly) {
            filtered = filtered.filter(flight => {
                const depHour = parseInt(flight.depTime.split(':')[0]);
                return depHour < 6 || depHour >= 22;
            });
        }
        if (minPrice !== '') {
            filtered = filtered.filter(flight => flight.price >= parseFloat(minPrice));
        }
        if (maxPrice !== '') {
            filtered = filtered.filter(flight => flight.price <= parseFloat(maxPrice));
        }
        if (selectedAirlines.length > 0) {
            filtered = filtered.filter(flight => selectedAirlines.includes(flight.provider.supplier.title));
        }
        if (filtered.length === 0 && flightResults.length !== 0){
            setErrorMsg('Nothing found')
            setFilteredResults(filtered);
            setVisibleFlights(12);
        } else {
            setErrorMsg(undefined)
            setFilteredResults(filtered);
            setVisibleFlights(12);
        }
    };

    useEffect(() => {
        applyFilters();
    }, [dayFlightsOnly, nightFlightsOnly, minPrice, maxPrice, selectedAirlines, flightResults]);

    const toggleAirline = (airline) => {
        setSelectedAirlines(prevSelected =>
            prevSelected.includes(airline)
                ? prevSelected.filter(a => a !== airline)
                : [...prevSelected, airline]
        );
    };

    const loadCartItems = useCallback(async () => {
        try {
            const userString = await AsyncStorage.getItem('@user');
            if (userString) {
                const user = JSON.parse(userString);
                setUserId(user.id);
                const cartKey = `@cart_${user.id}`;
                const cartString = await AsyncStorage.getItem(cartKey);
                if (cartString) {
                    const loadedCart = JSON.parse(cartString);
                    setCartItems(loadedCart);
                    console.log(loadedCart);
                } else {
                    setCartItems([]);
                }
            } else {
                setCartItems([]);
                setUserId(null);
            }
        } catch (error) {
            console.error('Failed to load cart items', error);
            setCartItems([]);
            setUserId(null);
        }
    }, []);

    const loadFavoriteItems = useCallback(async () => {
        try {
            const userString = await AsyncStorage.getItem('@user');
            if (userString) {
                const user = JSON.parse(userString);
                setUserId(user.id);
                const favoriteKey = `@favorites_${user.id}`;
                const favoriteString = await AsyncStorage.getItem(favoriteKey);
                if (favoriteString) {
                    const loadedFavorites = JSON.parse(favoriteString);
                    setFavoriteItems(loadedFavorites);
                    console.log(loadedFavorites);
                } else {
                    setFavoriteItems([]);
                }
            } else {
                setFavoriteItems([]);
                setUserId(null);
            }
        } catch (error) {
            console.error('Failed to load favorite items', error);
            setFavoriteItems([]);
            setUserId(null);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadCartItems();
        }, [loadCartItems])
    );

    useFocusEffect(
        useCallback(() => {
            loadFavoriteItems();
        }, [loadFavoriteItems])
    );

    const addToCart = async (flight) => {
        if (!userId) {
            Alert.alert('Error', 'Please log in to add flights to cart');
            return;
        }
        try {
            const cartKey = `@cart_${userId}`;
            const updatedCart = [...cartItems, flight];
            await AsyncStorage.setItem(cartKey, JSON.stringify(updatedCart));
            setCartItems(updatedCart);
        } catch (error) {
            console.error('Failed to add flight to cart', error);
            Alert.alert('Error', 'Failed to add flight to cart');
        }
    };

    const removeFromCart = async (flight) => {
        if (!userId) {
            Alert.alert('Error', 'Please log in to remove flights from cart');
            return;
        }
        try {
            const updatedCart = cartItems.filter(item => item.id !== flight.id);
            const cartKey = `@cart_${userId}`;
            await AsyncStorage.setItem(cartKey, JSON.stringify(updatedCart));
            setCartItems(updatedCart);
        } catch (error) {
            console.error('Failed to remove flight from cart', error);
            Alert.alert('Error', 'Failed to remove flight from cart');
        }
    };

    const isInCart = (flight) => {
        return cartItems.some(item => item.id === flight.id);
    };

    const toggleFavorite = async (flight) => {
        if (!userId) {
            Alert.alert('Error', 'Please log in to manage favorites');
            return;
        }
        try {
            const favoriteKey = `@favorites_${userId}`;
            let updatedFavorites;
            if (isInFavorites(flight)) {
                updatedFavorites = favoriteItems.filter(item => item.id !== flight.id);
            } else {
                updatedFavorites = [...favoriteItems, flight];
            }
            await AsyncStorage.setItem(favoriteKey, JSON.stringify(updatedFavorites));
            setFavoriteItems(updatedFavorites);
        } catch (error) {
            console.error('Failed to update favorites', error);
            Alert.alert('Error', 'Failed to update favorites');
        }
    };

    const isInFavorites = (flight) => {
        return favoriteItems.some(item => item.id === flight.id);
    };

    const handleSearch = async () => {
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
        if (airportFrom === '' || airportTo === '') {
            setErrorMsg('Please fill all fields');
        } else {
            setIsLoading(true);
            try {
                const response = await axios.post('https://travelcom.online/api/crpo/getFlights', payload);
                if (response.data.success === false) {
                    setErrorMsg(response.data.message || 'No flights found');
                    setFlightResults([]);
                    setFilteredResults([]);
                    setVisibleFlights(0);
                    setAvailableAirlines([]);
                } else {
                    setFlightResults(response.data);
                    setFilteredResults(response.data);
                    setVisibleFlights(12);
                    console.log('response:', JSON.stringify(response.data, null, 2));
                    const airlines = [...new Set(response.data.map(flight => flight.provider.supplier.title))];
                    setAvailableAirlines(airlines);
                    setErrorMsg(undefined);
                }
            } catch (error) {
                if (error.response) {
                    setErrorMsg(error.response.data.message || 'Error fetching flights');
                } else if (error.request) {
                    setErrorMsg('No response from server');
                } else {
                    setErrorMsg(error.message || 'Error fetching flights');
                }
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleShowMore = () => {
        setVisibleFlights(prevVisible => Math.min(prevVisible + 12, filteredResults.length));
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
                <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.filtersFlexbox}
                    onPress={() => setFiltersVisible(!filtersVisible)}
                >
                    <View style={styles.merger}>
                        <FilterIcon/>
                        <Text style={styles.mainBlueText}>{filtersVisible ? 'Hide Filters' : 'Show Filters'}</Text>
                    </View>
                    <Arrow/>
                </TouchableOpacity>

                {filtersVisible && (
                    <View style={styles.filtersContainer}>
                        <View style={{gap: 15}}>
                            <Text style={styles.mainBlueText}>Transfers</Text>
                            <TouchableOpacity
                                style={styles.filtersFlexbox}
                                onPress={() => setDayFlightsOnly(!dayFlightsOnly)}
                            >
                                <View style={styles.merger}>
                                    <DayIcon color='#207FBF'/>
                                    <Text style={styles.mainText}>Day flights only</Text>
                                </View>
                                <CheckIcon color={dayFlightsOnly ? '#207FBF' : 'grey'} width={24} height={24}/>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.filtersFlexbox}
                                onPress={() => setNightFlightsOnly(!nightFlightsOnly)}
                            >
                                <View style={styles.merger}>
                                    <NightIcon color='#207FBF'/>
                                    <Text style={styles.mainText}>Night flights only</Text>
                                </View>
                                <CheckIcon color={nightFlightsOnly ? '#207FBF' : 'grey'} width={24} height={24}/>
                            </TouchableOpacity>
                        </View>
                        <View style={{gap: 15}}>
                            <Text style={styles.mainBlueText}>Price</Text>
                            <View style={styles.merger}>
                                <TextInput
                                    style={styles.filtersInput}
                                    placeholder='from 0'
                                    placeholderTextColor='#bebebe'
                                    value={minPrice}
                                    onChangeText={setMinPrice}
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    style={styles.filtersInput}
                                    placeholder='up to 1000$'
                                    placeholderTextColor='#bebebe'
                                    value={maxPrice}
                                    onChangeText={setMaxPrice}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>
                        <View style={{gap: 15}}>
                            <Text style={styles.mainBlueText}>Airlines</Text>
                            <View>
                                {
                                    availableAirlines.length > 0 ? (
                                        availableAirlines.map(airline => (
                                            <TouchableOpacity
                                                style={styles.filtersFlexbox}
                                                key={airline}
                                                onPress={() => toggleAirline(airline)}
                                            >
                                                <View style={styles.merger}>
                                                    <Image source={airlinesImg} style={{width: 24, height: 24}}/>
                                                    <Text style={styles.mainText}>{airline}</Text>
                                                </View>
                                                <CheckIcon
                                                    color={selectedAirlines.includes(airline) ? '#207FBF' : 'grey'}
                                                    width={24}
                                                    height={24}
                                                />
                                            </TouchableOpacity>
                                        ))
                                    ) : (
                                        <Text style={styles.smallText}>No available airlines</Text>
                                    )
                                }
                            </View>
                        </View>
                    </View>
                )}

                {errorMsg ? (
                    <Text style={[styles.mainText, {textAlign: 'center', marginTop: 10}]}>{errorMsg}</Text>
                ) : (
                    <></>
                )}

                {filteredResults.slice(0, visibleFlights).map((flight, index) => {
                    const inCart = isInCart(flight);
                    const inFavorites = isInFavorites(flight);
                    const isRoundTrip = flight.isRoundtrip || false;
                    return (
                        <FlightCard
                            key={flight.id}
                            price={convertPrice(flight.price)}
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
                            backDepTime={isRoundTrip ? flight.back_ticket?.depTime : undefined}
                            backDepDate={isRoundTrip ? flight.back_ticket?.depDate : undefined}
                            backDepAirport={isRoundTrip ? `${flight.back_ticket?.depAirport.title}, ${flight.back_ticket?.depAirport.code}` : undefined}
                            backDepCity={isRoundTrip ? flight.back_ticket?.depCity.title : undefined}
                            backArriveTime={isRoundTrip ? flight.back_ticket?.arriveTime : undefined}
                            backArriveDate={isRoundTrip ? flight.back_ticket?.arriveDate : undefined}
                            backArriveAirport={isRoundTrip ? `${flight.back_ticket?.arriveAirport.title}, ${flight.back_ticket?.arriveAirport.code}` : undefined}
                            backArriveCity={isRoundTrip ? flight.back_ticket?.arriveCity.title : undefined}
                            backFlightTime={isRoundTrip ? `${flight.back_ticket?.duration.flight.hour}h, ${flight.back_ticket?.duration.flight.minute}min` : undefined}
                            isRoundTrip={isRoundTrip}
                            btnText={inCart ? "Remove from cart" : "Add to cart"}
                            onPress={() => inCart ? removeFromCart(flight) : addToCart(flight)}
                            favouriteIconPress={() => toggleFavorite(flight)}
                            favouriteIconColor={inFavorites ? 'black' : 'white'}
                            onCartScreen={false}
                            showFavIcon={true}
                        />
                    );
                })}

                {visibleFlights < filteredResults.length && (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[styles.showMoreBtn, {paddingVertical: 18}]}
                        onPress={handleShowMore}
                    >
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
    filtersFlexbox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8
    },
    mainBlueText: {
        color: '#207FBF',
        fontSize: 18,
        fontFamily: 'Montserrat-Bold'
    },
    filtersContainer: {
        paddingHorizontal: 15,
        paddingVertical: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        gap: 15,
        marginBottom: 15
    },
    merger: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center'
    },
    filtersInput: {
        color: '#207FBF',
        width: '49%',
        fontSize: 16,
        fontFamily: 'Montserrat-Bold',
        paddingHorizontal: 15,
        height: 56,
        borderRadius: 10,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#8c8c8c'
    },
});