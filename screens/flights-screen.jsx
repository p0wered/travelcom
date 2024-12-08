import {
    ActivityIndicator, Alert, Image, Platform,
    ScrollView,
    StyleSheet,
    Text, TextInput,
    TouchableOpacity,
    View
} from "react-native";
import {SearchIcon} from "../components/icons/search-icon";
import {FilterIcon} from "../components/icons/filter-icon";
import {Footer} from "../components/footer";
import {FlightCard} from "../components/flight-cards";
import {AutoCompleteInput} from "../components/autocomplete-input";
import {DateInput} from "../components/input-date";
import {PassengerDropdown} from "../components/passengers-selector";
import {useCallback, useEffect, useRef, useState} from "react";
import {RoundTripSelector} from "../components/roundtrip-selector";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import Arrow from "../components/icons/arrow-icon";
import {DayIcon} from "../components/icons/day-icon";
import {NightIcon} from "../components/icons/night-icon";
import {CheckIcon} from "../components/icons/check-icon";

export default function FlightsScreen({route, navigation}) {
    const navigate = useNavigation();
    const [searchParams, setSearchParams] = useState(() => route.params);
    const [airportFrom, setAirportFrom] = useState(searchParams?.airportFrom || '');
    const [fromSuggestions, setFromSuggestions] = useState([]);
    const [airportTo, setAirportTo] = useState(searchParams?.airportTo || '');
    const [whereSuggestions, setWhereSuggestions] = useState([]);
    const [dateStart, setDateStart] = useState(searchParams?.dateStart || new Date());
    const [dateEnd, setDateEnd] = useState(searchParams?.dateEnd || new Date());
    const [roundTrip, setRoundTrip] = useState(searchParams?.roundTrip ?? true);
    const [isLoading, setIsLoading] = useState(false);
    const [passengers, setPassengers] = useState(searchParams?.passengers || {
        adults: 1,
        children: 0,
        infants: 0,
    });
    const [paramsUpdated, setParamsUpdated] = useState(false);
    const prevSearchParamsRef = useRef();
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
    const [availableArriveAirports, setAvailableArriveAirports] = useState([]);
    const [availableDepAirports, setAvailableDepAirports] = useState([]);
    const [selectedArriveAirports, setSelectedArriveAirports] = useState([]);
    const [selectedDepAirports, setSelectedDepAirports] = useState([]);
    const [flightClass, setFlightClass] = useState('Economy');
    const [airlinesLogos, setAirlinesLogos] = useState([]);
    const [filteredResults, setFilteredResults] = useState([]);
    const [favoriteItems, setFavoriteItems] = useState([]);
    const [errorMsg, setErrorMsg] = useState(undefined);
    const [addLoading, setAddLoading] = useState({});

    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        if (route.params && JSON.stringify(route.params) !== JSON.stringify(prevSearchParamsRef.current)) {
            setSearchParams(route.params);
            setAirportFrom(route.params.airportFrom || '');
            setAirportTo(route.params.airportTo || '');
            setDateStart(route.params.dateStart || new Date());
            setRoundTrip(route.params.roundTrip ?? true);

            if (route.params.roundTrip) {
                setDateEnd(route.params.dateEnd);
            } else {
                setDateEnd(null);
            }

            setPassengers(route.params.passengers || {
                adults: 1,
                children: 0,
                infants: 0,
            });

            setParamsUpdated(true);
            prevSearchParamsRef.current = route.params;
        }
    }, [route.params]);

    useEffect(() => {
        if (paramsUpdated) {
            console.log('Got on flights screen', searchParams);
            handleSearch();
            setParamsUpdated(false);
        }
    }, [paramsUpdated, searchParams]);


    const checkAuth = async () => {
        console.log('Checking user data')
        try {
            const userString = await AsyncStorage.getItem('@user');
            if (userString) {
                console.log(userString);
                const user = JSON.parse(userString);
                console.log(user)
                setUserId(user.id);
                console.log(userId)
            }
        } catch (error) {
            console.error('No user data', error);
        }
    };

    const handleSearch = async () => {
        console.log('Searching...')
        const payload = {
            adults: passengers.adults,
            airportFrom: getAirportCode(airportFrom),
            airportTo: getAirportCode(airportTo),
            children: passengers.children,
            dateStart: formatDate(dateStart),
            infants: passengers.infants,
            isRoundtrip: roundTrip,
            flightClass: flightClass
        };

        if (roundTrip) {
            payload.dateEnd = formatDate(dateEnd);
        }

        console.log(payload);

        setDayFlightsOnly(false);
        setNightFlightsOnly(false);
        setMinPrice('');
        setMaxPrice('');
        setSelectedAirlines([]);
        setAvailableArriveAirports([]);
        setAvailableDepAirports(Object.values({}));

        if (airportFrom === '' || airportTo === '') {
            Alert.alert('', 'Please fill all fields');
        } else if (roundTrip && dateStart > dateEnd) {
            Alert.alert('', 'Please select valid dates');
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
                    setAvailableArriveAirports([]);
                    setAvailableDepAirports(Object.values({}));
                } else {
                    setErrorMsg(undefined)
                    setFlightResults(response.data.data);
                    setFilteredResults(response.data.data);
                    setVisibleFlights(12);
                    const airlines = [...new Set(response.data.data.map(flight => flight.provider.supplier.title))];
                    const logos = [...new Set(response.data.data.map(flight => flight.providerLogo))];
                    setAvailableAirlines(airlines);
                    setAirlinesLogos(logos);
                    setAvailableArriveAirports(response.data.arriveAirports || []);
                    setAvailableDepAirports(Object.values(response.data.depAirports || {}));
                }
            } catch (error) {
                if (error.response) {
                    setErrorMsg(error.response.data.message);
                    setFilteredResults([]);
                    setVisibleFlights(0);
                    setAvailableAirlines([]);
                } else if (error.request) {
                    setErrorMsg('No response from server');
                    setFilteredResults([]);
                    setVisibleFlights(0);
                    setAvailableAirlines([]);
                } else {
                    setErrorMsg(error.message || 'Error fetching flights');
                    setFilteredResults([]);
                    setVisibleFlights(0);
                    setAvailableAirlines([]);
                }
            } finally {
                setIsLoading(false);
            }
        }
    };

    const applyFilters = () => {
        let filtered = [...flightResults];

        if (dayFlightsOnly || nightFlightsOnly) {
            filtered = filtered.filter(flight => {
                const depHour = parseInt(flight.depTime.split(':')[0]);
                if (dayFlightsOnly && !nightFlightsOnly) {
                    return depHour >= 6 && depHour < 22;
                } else if (nightFlightsOnly && !dayFlightsOnly) {
                    return depHour < 6 || depHour >= 22;
                } else {
                    return true;
                }
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
        if (selectedArriveAirports.length > 0) {
            filtered = filtered.filter(flight =>
                selectedArriveAirports.includes(flight.arriveAirport.code)
            );
        }
        if (selectedDepAirports.length > 0) {
            filtered = filtered.filter(flight =>
                selectedDepAirports.includes(flight.depAirport.code)
            );
        }

        setFilteredResults(filtered);
        setVisibleFlights(Math.min(12, filtered.length));

        if (filtered.length === 0 && flightResults.length !== 0) {
            setErrorMsg('Nothing found');
        } else {
            setErrorMsg(undefined);
        }
    };

    useEffect(() => {
        applyFilters();
    }, [
        dayFlightsOnly,
        nightFlightsOnly,
        minPrice,
        maxPrice,
        selectedAirlines,
        selectedArriveAirports,
        selectedDepAirports,
        flightResults
    ]);

    const toggleAirline = (airline) => {
        setSelectedAirlines(prevSelected =>
            prevSelected.includes(airline)
                ? prevSelected.filter(a => a !== airline)
                : [...prevSelected, airline]
        );
    };

    const loadCartItems = useCallback(async () => {
        try {
            const token = await AsyncStorage.getItem('@token');
            if (!token) {
                setCartItems([]);
                setUserId(null);
                return [];
            }

            const response = await axios.get('https://travelcom.online/api/cart/my', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data && Array.isArray(response.data)) {
                const parsedCartItems = response.data.map(item => {
                    return {
                        ...item,
                        item: JSON.parse(item.item)
                    };
                });
                setCartItems(parsedCartItems);
                setUserId(parsedCartItems[0]?.user_id || null);
                return parsedCartItems;
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Failed to load cart items', error);
            Alert.alert('Error', error.message || 'Failed to load cart items');
            setCartItems([]);
            setUserId(null);
            return [];
        }
    }, []);

    const loadFavoriteItems = useCallback(async () => {
        try {
            const token = await AsyncStorage.getItem('@token');
            if (token) {
                const response = await axios.get('https://travelcom.online/api/favourite/my', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                if (response.data && Array.isArray(response.data)) {
                    setFavoriteItems(response.data);
                }
            }
        } catch (error) {
            console.error('Failed to load favorite items', error);
        }
    }, []);

    const isInFavorites = useCallback((flight) => {
        return favoriteItems.some(item => {
            const itemData = JSON.parse(item.item);
            return itemData.id === flight.id;
        });
    }, [favoriteItems]);

    const toggleFavorite = async (flight) => {
        const token = await AsyncStorage.getItem('@token');
        if (!token) {
            Alert.alert('Error', 'Please log in to manage favorites');
            return;
        }
        try {
            const passengerTypes = [
                ...Array(passengers.adults).fill('Adult'),
                ...Array(passengers.children).fill('Child'),
                ...Array(passengers.infants).fill('Infant')
            ];

            const flightWithPassengers = {
                ...flight,
                personCount: passengerTypes.length,
                personDetails: passengerTypes,
                isRoundtrip: roundTrip
            };

            const response = await axios.post('https://travelcom.online/api/favourite/create', {
                item: JSON.stringify(flightWithPassengers)
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 201 || response.status === 204) {
                await loadFavoriteItems();
            } else {
                throw new Error('Failed to update favorites');
            }
        } catch (error) {
            console.error('Failed to update favorites', error);
            Alert.alert('Error', error.message || 'Failed to update favorites');
        }
    };

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

    const handleFlightClassChange = (newClass) => {
        if (flightClass !== newClass) {
            setFlightClass(newClass);
        }
    };

    useEffect(() => {
        handleSearch();
    }, [flightClass]);

    const addToCart = async (flight) => {
        setAddLoading(prev => ({ ...prev, [flight.id]: true }));
        try {
            const userString = await AsyncStorage.getItem('@user');
            if (!userString) {
                Alert.alert('Error', 'Please log in to add flights to cart');
                setAddLoading(prev => ({ ...prev, [flight.id]: false }));
                return;
            }
            const user = JSON.parse(userString);
            const userId = user.id;

            const totalPassengers = passengers.adults + passengers.children + passengers.infants;
            const passengerDetailsList = [
                ...Array(passengers.adults).fill('Adult'),
                ...Array(passengers.children).fill('Child'),
                ...Array(passengers.infants).fill('Infant')
            ];

            const itemToAdd = {
                ...flight,
                personCount: totalPassengers,
                personDetails: passengerDetailsList,
                isRoundtrip: roundTrip
            };

            const response = await axios.post('https://travelcom.online/api/cart/add', {
                item: JSON.stringify(itemToAdd)
            }, {
                headers: {
                    'Authorization': `Bearer ${await AsyncStorage.getItem('@token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                const updatedCartItems = await loadCartItems();
                setCartItems(updatedCartItems);
                setAddLoading(prev => ({ ...prev, [flight.id]: false }));
                navigation.navigate('Cart')
            } else {
                throw new Error('Failed to add flight to cart');
            }
        } catch (error) {
            console.error('Failed to add flight to cart', error);
            Alert.alert('Error', error.message || 'Failed to add flight to cart');
        }
        setAddLoading(prev => ({ ...prev, [flight.id]: false }));
    };

    const isInCart = (flight) => {
        return cartItems.some(item => item.item.id === flight.id);
    };

    const handleShowMore = () => {
        setVisibleFlights(prevVisible => Math.min(prevVisible + 12, filteredResults.length));
    };

    const getAirportCode = (fullAirportName) => {
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
            <View style={{width: '100%', backgroundColor: 'white'}}>
                <Text style={[styles.mainBlueText, {paddingHorizontal: 15, paddingTop: 15, backgroundColor: 'white'}]}>Search flights</Text>
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
                            <DateInput
                                inCheckout={false}
                                onlyNextDates={true}
                                date={dateStart}
                                setDate={setDateStart}
                                minDate={new Date()}
                            />
                        </View>
                        <View style={[styles.separator, roundTrip ? {display: 'flex'} : {display: 'none'}, Platform.OS === 'ios' ? {marginRight: -10} : {marginRight: 0}]}/>
                        <View style={[{marginVertical: 7}, roundTrip ? {display: 'flex'} : {display: 'none'}]}>
                            <DateInput
                                inCheckout={false}
                                onlyNextDates={true}
                                date={dateEnd}
                                setDate={setDateEnd}
                                minDate={new Date()}
                            />
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
                                    placeholder='up to 1000€'
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
                                        availableAirlines.map((airline, index) => (
                                            <TouchableOpacity
                                                style={styles.filtersFlexbox}
                                                key={airline}
                                                onPress={() => toggleAirline(airline)}
                                            >
                                                <View style={styles.merger}>
                                                    <Image source={{uri: airlinesLogos[index]}} style={{width: 28, height: 28, borderRadius: 100, borderWidth: 1, borderColor: '#d5d5d5'}}/>
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
                        <View style={{ gap: 15 }}>
                            <Text style={styles.mainBlueText}>Flight Class</Text>
                            <View>
                                {['Economy', 'Business', 'First'].map((option) => (
                                    <TouchableOpacity
                                        style={styles.filtersFlexbox}
                                        key={option}
                                        onPress={() => handleFlightClassChange(option)}
                                    >
                                        <Text style={styles.mainText}>{option}</Text>
                                        <CheckIcon
                                            color={flightClass === option ? '#207FBF' : 'grey'}
                                            width={24}
                                            height={24}
                                        />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                        <View style={{gap: 15}}>
                            <Text style={styles.mainBlueText}>Departure Airports</Text>
                            <View>
                                {availableDepAirports.length > 0 ? (
                                    availableDepAirports.map((airport) => (
                                        <TouchableOpacity
                                            style={styles.filtersFlexbox}
                                            key={airport}
                                            onPress={() => setSelectedDepAirports((prev) =>
                                                prev.includes(airport)
                                                    ? prev.filter(a => a !== airport)
                                                    : [...prev, airport]
                                            )}
                                        >
                                            <Text style={styles.mainText}>{airport}</Text>
                                            <CheckIcon
                                                color={selectedDepAirports.includes(airport) ? '#207FBF' : 'grey'}
                                                width={24}
                                                height={24}
                                            />
                                        </TouchableOpacity>
                                    ))
                                ) : (
                                    <Text style={styles.smallText}>No available airports</Text>
                                )}
                            </View>
                        </View>
                        <View style={{gap: 15}}>
                            <Text style={styles.mainBlueText}>Arrival Airports</Text>
                            <View>
                                {availableArriveAirports.length > 0 ? (
                                    availableArriveAirports.map((airport) => (
                                        <TouchableOpacity
                                            style={styles.filtersFlexbox}
                                            key={airport}
                                            onPress={() => setSelectedArriveAirports((prev) =>
                                                prev.includes(airport)
                                                    ? prev.filter(a => a !== airport)
                                                    : [...prev, airport]
                                            )}
                                        >
                                            <Text style={styles.mainText}>{airport}</Text>
                                            <CheckIcon
                                                color={selectedArriveAirports.includes(airport) ? '#207FBF' : 'grey'}
                                                width={24}
                                                height={24}
                                            />
                                        </TouchableOpacity>
                                    ))
                                ) : (
                                    <Text style={styles.smallText}>No available airports</Text>
                                )}
                            </View>
                        </View>
                    </View>
                )}

                {isLoading ? (
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 20}}>
                        <ActivityIndicator size="large" color="#207FBF" />
                    </View>
                ) : (
                    filteredResults.slice(0, visibleFlights).map((flight, index) => {
                        const inCart = isInCart(flight);
                        const inFavorites = isInFavorites(flight);
                        const isRoundTrip = flight.isRoundtrip || false;
                        return (
                            <FlightCard
                                key={flight.id}
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
                                airlinesImg={flight.providerLogo}
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
                                baggageInfo={flight.baggage}
                                btnText={addLoading[flight.id] ? 'Loading' : 'Choose'}
                                onPress={() => addToCart(flight)}
                                favouriteIconPress={() => toggleFavorite(flight)}
                                favouriteIconColor={inFavorites ? '#207fbf' : 'white'}
                                onCartScreen={false}
                                showFavIcon={true}
                            />
                        );
                    })
                )}

                {errorMsg ? (
                    <Text style={[styles.mainText, {textAlign: 'center', color: '#cd3737', marginTop: 10}]}>{errorMsg}</Text>
                ) : (
                    <></>
                )}

                {visibleFlights < filteredResults.length && !errorMsg && !isLoading &&(
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
        padding: 15,
        display: 'flex',
        flexDirection: 'column',
        gap: 15,
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
