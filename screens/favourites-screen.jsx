import {ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View} from "react-native";
import {Footer} from "../components/footer";
import {FlightCard} from "../components/flight-cards";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import React, {useCallback, useState} from "react";
import axios from "axios";

export default function FavouritesScreen() {
    const [favoriteItems, setFavoriteItems] = useState([]);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [addingFlights, setAddingFlights] = useState({});
    const navigation = useNavigation();

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
        setLoading(false);
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadFavoriteItems();
        }, [loadFavoriteItems])
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

    const addToCart = async (flight) => {
        if (!userId) {
            Alert.alert('Error', 'Please log in to add flights to cart');
            return;
        }
        setAddingFlights(prev => ({ ...prev, [flight.id]: true }));
        try {
            const itemToAdd = {
                ...flight,
                personCount: flight.passengers,
                personDetails: [
                    ...Array(flight.passengerDetails.adults).fill('Adult'),
                    ...Array(flight.passengerDetails.children).fill('Child'),
                    ...Array(flight.passengerDetails.infants).fill('Infant')
                ],
                isRoundtrip: flight.isRoundtrip
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
                navigation.navigate('Cart');
            } else {
                throw new Error('Failed to add flight to cart');
            }
        } catch (error) {
            console.error('Failed to add flight to cart', error);
            Alert.alert('Error', error.message || 'Failed to add flight to cart');
        }
        setAddingFlights(prev => ({ ...prev, [flight.id]: false }));
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
                    [...favoriteItems].reverse().map((flight) => (
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
                            isRoundTrip={flight.isRoundtrip}
                            baggageInfo={flight.baggage}
                            btnText={addingFlights[flight.id] ? "Loading" : "Choose"}
                            onPress={() => addToCart(flight)}
                            favouriteIconColor='black'
                            favouriteIconPress={() => removeFromFavorites(flight.id)}
                            showFavIcon={true}
                        />
                    ))
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
