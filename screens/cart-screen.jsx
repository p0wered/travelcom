import React, {useCallback, useState} from 'react';
import {Text, ScrollView, Alert, StyleSheet, View, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FlightCard} from "../components/flight-cards";
import airlinesImg from '../assets/airlines.png'
import {useFocusEffect} from "@react-navigation/native";
import {Footer} from "../components/footer";

export default function CartScreen({navigation}) {
    const [cartItems, setCartItems] = useState([]);
    const [userId, setUserId] = useState(null);

    const loadCartItems = useCallback(async () => {
        try {
            const userString = await AsyncStorage.getItem('@user');
            if (userString) {
                const user = JSON.parse(userString);
                setUserId(user.id);
                const cartKey = `@cart_${user.id}`;
                const cartString = await AsyncStorage.getItem(cartKey);
                console.log('Loaded cart string:', cartString);
                if (cartString) {
                    const loadedCart = JSON.parse(cartString);
                    console.log('Loaded cart:', loadedCart);
                    setCartItems(loadedCart);
                } else {
                    console.log('Cart is empty');
                    setCartItems([]);
                }
            } else {
                console.log('User not found');
                setCartItems([]);
            }
        } catch (error) {
            console.error('Failed to load cart items', error);
            setCartItems([]);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadCartItems();
        }, [loadCartItems])
    );

    const removeFromCart = async (flightId) => {
        try {
            const updatedCart = cartItems.filter(item => item.id !== flightId);
            const cartKey = `@cart_${userId}`;
            await AsyncStorage.setItem(cartKey, JSON.stringify(updatedCart));
            setCartItems(updatedCart);
            console.log('Updated cart:', updatedCart);
            Alert.alert('Success', 'Flight removed from cart');
        } catch (error) {
            console.error('Failed to remove flight from cart', error);
            Alert.alert('Error', 'Failed to remove flight from cart');
        }
    };

    return (
        <ScrollView>
            <View style={{padding: 15}}>
                <Text style={styles.titleText}>Shopping cart</Text>
                {cartItems.length === 0 ? (
                    <Text style={[styles.mainText, {paddingBottom: 100}]}>Your cart is empty</Text>
                ) : (
                    cartItems.map((flight, index) => (
                        <FlightCard
                            key={flight.id || index}
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
                            btnText="Remove from cart"
                            onPress={() => removeFromCart(flight.id)}
                        />
                    ))
                )}
                <TouchableOpacity activeOpacity={0.8} style={styles.showMoreBtn}>
                    <Text style={styles.btnText}>Checkout</Text>
                </TouchableOpacity>
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
    mainText: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 15,
        color: 'black'
    },
    showMoreBtn: {
        padding: 18,
        borderRadius: 10,
        backgroundColor: '#207FBF',
    },
    btnText: {
        fontFamily: 'Montserrat-Bold',
        color: 'white',
        textAlign: 'center'
    },
})