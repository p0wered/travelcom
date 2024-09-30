import {ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View} from "react-native";
import {Footer} from "../components/footer";
import {FlightCard} from "../components/flight-cards";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import React, {useCallback, useState} from "react";
import axios from "axios";

export default function FavouritesScreen() {
    const [favoriteItems, setFavoriteItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addingFlights, setAddingFlights] = useState({});
    const navigation = useNavigation();

    const loadFavoriteItems = useCallback(async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('@token');
            if (!token) {
                Alert.alert('Error', 'Please log in to view favorites');
                setFavoriteItems([]);
                return;
            }

            const response = await axios.get('https://travelcom.online/api/favourite/my', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                const parsedFavorites = response.data.map(favorite => {
                    try {
                        return {
                            ...favorite,
                            flightData: JSON.parse(favorite.item)
                        };
                    } catch (error) {
                        console.error('Error parsing favorite item:', error, favorite);
                        return null;
                    }
                }).filter(item => item !== null);
                setFavoriteItems(parsedFavorites);
            } else {
                throw new Error('Failed to load favorite items');
            }
        } catch (error) {
            console.error('Failed to load favorite items', error);
            Alert.alert('Error','Failed to load favorite items');
            setFavoriteItems([]);
        }
        setLoading(false);
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadFavoriteItems();
        }, [loadFavoriteItems])
    );

    const removeFromFavorites = async (favorite) => {
        try {
            const token = await AsyncStorage.getItem('@token');
            if (!token) {
                Alert.alert('Error', 'Please log in to manage favorites');
                return;
            }

            const response = await axios.post('https://travelcom.online/api/favourite/create', {
                item: favorite.item
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 204) {
                setFavoriteItems(prevItems => prevItems.filter(item => item.id !== favorite.id));
            } else {
                throw new Error('Failed to update favorites');
            }
        } catch (error) {
            console.error('Failed to remove flight from favorites', error);
            Alert.alert('Error', 'Failed to remove flight from favorites');
        }
    };

    const addToCart = async (flight) => {
        setAddingFlights(prev => ({ ...prev, [flight.id]: true }));
        try {
            const token = await AsyncStorage.getItem('@token');
            if (!token) {
                Alert.alert('Error', 'Please log in to add flights to cart');
                return;
            }

            const response = await axios.post('https://travelcom.online/api/cart/add', {
                item: JSON.stringify(flight)
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
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
            Alert.alert('Error', 'Failed to add flight to cart');
        }
        setAddingFlights(prev => ({ ...prev, [flight.id]: false }));
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#207FBF"/>
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
                    favoriteItems.reverse().map((favorite) => {
                        const flight = favorite.flightData;
                        return (
                            <FlightCard
                                key={favorite.id}
                                price={flight.price}
                                flightTime={flight.duration ? `${flight.duration.flight.hour}h, ${flight.duration.flight.minute}min` : 'N/A'}
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
                                backDepTime={flight.isRoundtrip ? flight.back_ticket?.depTime : undefined}
                                backDepDate={flight.isRoundtrip ? flight.back_ticket?.depDate : undefined}
                                backDepAirport={flight.isRoundtrip ? `${flight.back_ticket?.depAirport.title}, ${flight.back_ticket?.depAirport.code}` : undefined}
                                backDepCity={flight.isRoundtrip ? flight.back_ticket?.depCity.title : undefined}
                                backArriveTime={flight.isRoundtrip ? flight.back_ticket?.arriveTime : undefined}
                                backArriveDate={flight.isRoundtrip ? flight.back_ticket?.arriveDate : undefined}
                                backArriveAirport={flight.isRoundtrip ? `${flight.back_ticket?.arriveAirport.title}, ${flight.back_ticket?.arriveAirport.code}` : undefined}
                                backArriveCity={flight.isRoundtrip ? flight.back_ticket?.arriveCity.title : undefined}
                                backFlightTime={flight.isRoundtrip && flight.back_ticket?.duration ? `${flight.back_ticket.duration.flight.hour}h, ${flight.back_ticket.duration.flight.minute}min` : undefined}
                                isRoundTrip={flight.isRoundtrip}
                                baggageInfo={flight.baggage}
                                btnText={addingFlights[flight.id] ? "Loading" : "Choose"}
                                onPress={() => addToCart(flight)}
                                favouriteIconColor='#207FBF'
                                favouriteIconPress={() => removeFromFavorites(favorite)}
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
