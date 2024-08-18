import {ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View} from "react-native";
import {Footer} from "../components/footer";
import {FlightCard} from "../components/flight-cards";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useFocusEffect} from "@react-navigation/native";
import React, {useCallback, useState} from "react";

export default function FavouritesScreen() {
    const [favoriteItems, setFavoriteItems] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [passengers, setPassengers] = useState({
        adults: 1,
        children: 0,
        infants: 0,
    });

    const loadFavoriteAndCartItems = useCallback(async () => {
        try {
            const userString = await AsyncStorage.getItem('@user');
            if (userString) {
                const user = JSON.parse(userString);
                setUserId(user.id);
                const favoriteKey = `@favorites_${user.id}`;
                const cartKey = `@cart_${user.id}`;

                const [favoriteString, cartString] = await Promise.all([
                    AsyncStorage.getItem(favoriteKey),
                    AsyncStorage.getItem(cartKey)
                ]);

                if (favoriteString) {
                    const loadedFavorites = JSON.parse(favoriteString);
                    setFavoriteItems(loadedFavorites);
                } else {
                    setFavoriteItems([]);
                }

                if (cartString) {
                    const loadedCart = JSON.parse(cartString);
                    setCartItems(loadedCart);
                } else {
                    setCartItems([]);
                }
            } else {
                setFavoriteItems([]);
                setCartItems([]);
                setUserId(null);
            }
        } catch (error) {
            console.error('Failed to load favorite and cart items', error);
            setFavoriteItems([]);
            setCartItems([]);
            setUserId(null);
        }
        setLoading(false);
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadFavoriteAndCartItems();
        }, [loadFavoriteAndCartItems])
    );

    const removeFromFavorites = async (flightId) => {
        try {
            const updatedFavorites = favoriteItems.filter(item => item.id !== flightId);
            const favoriteKey = `@favorites_${userId}`;
            await AsyncStorage.setItem(favoriteKey, JSON.stringify(updatedFavorites));
            setFavoriteItems(updatedFavorites);
        } catch (error) {
            console.error('Failed to remove flight from favorites', error);
            Alert.alert('Error', 'Failed to remove flight from favorites');
        }
    };

    const toggleCart = async (flight) => {
        if (!userId) {
            Alert.alert('Error', 'Please log in to manage cart');
            return;
        }
        try {
            const cartKey = `@cart_${userId}`;
            let updatedCart;
            if (isInCart(flight)) {
                updatedCart = cartItems.filter(item => item.id !== flight.id);
            } else {
                const totalPassengers = passengers.adults + passengers.children;
                const flightWithPassengers = {
                    ...flight,
                    passengers: totalPassengers,
                    passengerDetails: {
                        adults: passengers.adults,
                        children: passengers.children
                    }
                };
                updatedCart = [...cartItems, flightWithPassengers];
            }
            await AsyncStorage.setItem(cartKey, JSON.stringify(updatedCart));
            setCartItems(updatedCart);
        } catch (error) {
            console.error('Failed to update cart', error);
            Alert.alert('Error', 'Failed to update cart');
        }
    };

    const isInCart = (flight) => {
        return cartItems.some(item => item.id === flight.id);
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#207FBF" />
            </View>
        );
    }

    return (
        <ScrollView style={{padding: 15}}>
            <View>
                <Text style={styles.titleText}>Favorite Flights</Text>
                {favoriteItems.length === 0 ? (
                    <Text style={[styles.mainText, {paddingBottom: 100}]}>You have no favorite flights</Text>
                ) : (
                    [...favoriteItems].reverse().map((flight, index) => {
                        const inCart = isInCart(flight);
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
                                baggageInfo={flight.baggage.piece}
                                btnText={inCart ? "Remove from cart" : "Add to cart"}
                                onPress={() => toggleCart(flight)}
                                favouriteIconColor='black'
                                favouriteIconPress={() => removeFromFavorites(flight.id)}
                                showFavIcon={true}
                            />
                        );
                    })
                )}
            </View>
            <Footer/>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    titleText: {
        fontSize: 20,
        fontFamily: 'Montserrat-Bold',
        color: '#207FBF',
        marginBottom: 15
    },
    buttonsContainer: {
        maxWidth: 230,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        borderRadius: 10,
        marginBottom: 15
    },
    button: {
        display: 'flex',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        maxWidth: 110
    },
    selectedButton: {
        backgroundColor: '#207FBF',
    },
    buttonText: {
        fontFamily: 'Montserrat-Medium',
        color: '#333',
        fontSize: 12,
        textAlign: 'center'
    },
    selectedButtonText: {
        fontFamily: 'Montserrat-Bold',
        color: 'white',
    },
    mainText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 15,
        color: 'black'
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})
