import React, {useCallback, useEffect, useState} from 'react';
import {
    Text,
    ScrollView,
    Alert,
    StyleSheet,
    View,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FlightCard} from "../components/flight-cards";
import {useFocusEffect} from "@react-navigation/native";
import {Footer} from "../components/footer";
import {DateInput} from "../components/input-date";

const CheckoutForm = ({onSubmit, onPersonCountChange, initialFormDataList, initialPassengerCount, passengerDetails}) => {
    const [formDataList, setFormDataList] = useState(initialFormDataList ||
        [
            ...Array(passengerDetails.adults).fill({type: 'Adult'}),
            ...Array(passengerDetails.children).fill({type: 'Child'}),
            ...Array(passengerDetails.infants).fill({type: 'Infant'})
        ].map(passenger => ({
            ...passenger,
            firstName: '',
            lastName: '',
            middleName: '',
            birthDate: null,
            gender: '',
            passport: '',
            docExp: ''
        }))
    );
    const [personCount, setPersonCount] = useState(initialPassengerCount);
    const [error, setError] = useState('');

    const handleChange = (index, name, value) => {
        const newFormDataList = [...formDataList];
        if (name === 'passport') {
            value = value.slice(0, 9);
        }
        newFormDataList[index] = { ...newFormDataList[index], [name]: value };
        setFormDataList(newFormDataList);
        setError('');
        validateForm(newFormDataList);
    };

    useEffect(() => {
        onPersonCountChange(personCount, formDataList);
    }, [personCount, formDataList]);

    const validateForm = () => {
        for (let i = 0; i < formDataList.length; i++) {
            const person = formDataList[i];
            for (const key in person) {
                if (key === 'birthDate' || key === 'docExp') {
                    if (person[key] === null || person[key] === '') {
                        setError(`Please select a ${key === 'birthDate' ? 'birth date' : 'document expiration date'} for Person ${i + 1}`);
                        return false;
                    }
                } else {
                    if (typeof person[key] !== 'string' || person[key].trim() === '') {
                        setError(`Please fill in all fields for Person ${i + 1}`);
                        return false;
                    }
                    if (key === 'passport' && person[key].length < 9) {
                        setError(`Passport number for Person ${i + 1} must be 9 digits`);
                        return false;
                    }
                }
            }
        }
        return true;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            setError('');
            onSubmit(formDataList);
        }
    };

    return (
        <ScrollView style={styles.formContainer}>
            {formDataList.map((formData, index) => {
                const typeIndex = formDataList.filter((data, i) => data.type === formData.type && i < index).length + 1;
                return (
                    <View key={index} style={styles.personContainer}>
                        <View style={styles.personHeaderContainer}>
                            <Text style={[styles.mainText]}>{formData.type} {typeIndex}</Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="First Name"
                            placeholderTextColor="#bebebe"
                            value={formData.firstName}
                            onChangeText={(text) => handleChange(index, 'firstName', text)}
                            autoComplete='name'
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Last Name"
                            placeholderTextColor="#bebebe"
                            value={formData.lastName}
                            onChangeText={(text) => handleChange(index, 'lastName', text)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Middle Name"
                            placeholderTextColor="#bebebe"
                            value={formData.middleName}
                            onChangeText={(text) => handleChange(index, 'middleName', text)}
                            autoComplete='name-middle'
                        />
                        <View style={[styles.input, {justifyContent: 'center'}]}>
                            <DateInput
                                inCheckout={true}
                                placeholder='Birth Date'
                                date={formData.birthDate}
                                onlyNextDates={false}
                                setDate={(date) => handleChange(index, 'birthDate', date)}
                            />
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Gender"
                            placeholderTextColor="#bebebe"
                            value={formData.gender}
                            onChangeText={(text) => handleChange(index, 'gender', text)}
                            autoComplete='gender'
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Passport"
                            placeholderTextColor="#bebebe"
                            value={formData.passport}
                            onChangeText={(text) => handleChange(index, 'passport', text)}
                            keyboardType='number-pad'
                        />
                        <View style={[styles.input, {justifyContent: 'center'}]}>
                            <DateInput
                                inCheckout={true}
                                onlyNextDates={true}
                                placeholder='Date of expiracy'
                                date={formData.docExp}
                                setDate={(date) => handleChange(index, 'docExp', date)}
                            />
                        </View>
                    </View>
                );
            })}
            <TouchableOpacity style={styles.payButton} onPress={handleSubmit}>
                <Text style={styles.payButtonText}>Pay</Text>
            </TouchableOpacity>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </ScrollView>
    );
};

export default function CartScreen({navigation}) {
    const [cartItems, setCartItems] = useState([]);
    const [userId, setUserId] = useState(null);
    const [expandedCardId, setExpandedCardId] = useState(null);
    const [formDataLists, setFormDataLists] = useState({});
    const [personCounts, setPersonCounts] = useState({});
    const [loading, setLoading] = useState(true);

    const handlePersonCountChange = (flightId, count, formDataList) => {
        setPersonCounts(prevCounts => ({
            ...prevCounts,
            [flightId]: count
        }));
        setFormDataLists(prevLists => ({
            ...prevLists,
            [flightId]: formDataList
        }));
    };

    const calculateTotalPrice = (flight) => {
        return flight.price;
    };

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
        setLoading(false);
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
        } catch (error) {
            console.error('Failed to remove flight from cart', error);
            Alert.alert('Error', 'Failed to remove flight from cart');
        }
    };

    const handleCheckout = (flightId) => {
        setExpandedCardId(expandedCardId === flightId ? null : flightId);
        if (!formDataLists[flightId]) {
            const flight = cartItems.find(item => item.id === flightId);
            setFormDataLists(prevLists => ({
                ...prevLists,
                [flightId]: [
                    ...Array(flight.passengerDetails.adults).fill({type: 'Adult'}),
                    ...Array(flight.passengerDetails.children).fill({type: 'Child'}),
                    ...Array(flight.passengerDetails.infants).fill({type: 'Infant'})
                ].map(passenger => ({
                    ...passenger,
                    firstName: '',
                    lastName: '',
                    middleName: '',
                    birthDate: '',
                    gender: '',
                    passport: '',
                    docExp: ''
                }))
            }));
            setPersonCounts(prevCounts => ({
                ...prevCounts,
                [flightId]: flight.passengers
            }));
        }
    };

    const handlePayment = async (flightId, formData) => {
        const flight = cartItems.find(item => item.id === flightId);
        if (!flight) {
            console.error('Flight not found');
            return;
        }

        const totalPrice = calculateTotalPrice(flight);
        const extendedItem = {
            ...flight,
            totalPrice,
        };

        const persons = formData.map(person => ({
            firstName: person.firstName,
            lastName: person.lastName,
            middleName: person.middleName,
            birthDate: person.birthDate,
            gender: person.gender,
            passport: person.passport,
            docExp: person.docExp
        }));

        const payloadData = {
            price: totalPrice,
            item: JSON.stringify(extendedItem),
            persons: JSON.stringify(persons)
        };

        console.log('Payload data:', JSON.stringify(payloadData, null, 2));

        try {
            const token = await AsyncStorage.getItem('@token');
            if (!token) {
                throw new Error('Authorization token not found');
            }

            const response = await fetch('https://travelcom.online/api/payment/buy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payloadData),
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', JSON.stringify(response.headers, null, 2));

            const responseText = await response.text();
            console.log('Response text:', responseText);

            if (response.status >= 400) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            if (responseText.startsWith('http')) {
                console.log('Opening URL:', responseText);
                navigation.navigate('InAppBrowser', {url: responseText});
            } else {
                try {
                    const data = JSON.parse(responseText);
                    if (data.url) {
                        console.log('Opening URL from JSON:', data.url);
                        navigation.navigate('InAppBrowser', { url: data.url });
                    } else {
                        throw new Error('No URL in JSON response');
                    }
                } catch (parseError) {
                    console.error('Error parsing response:', parseError);
                    Alert.alert('Error', 'Server returned an invalid response. Please try again later.');
                }
            }
        } catch (error) {
            console.error('Payment error:', error);
            Alert.alert('Error', 'Failed to process payment. Please try again later.');
        }
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
                <Text style={styles.titleText}>Shopping cart</Text>
                {
                    cartItems.length === 0 ? (
                        <Text style={[styles.mainText, {paddingBottom: 100, fontFamily: 'Montserrat-Regular'}]}>Your cart is empty</Text>
                    ) : (
                        [...cartItems].reverse().map((flight, index) => (
                            <View key={flight.id || index}>
                                <FlightCard
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
                                    backDepTime={flight.isRoundtrip ? flight.back_ticket?.depTime : undefined}
                                    backDepDate={flight.isRoundtrip ? flight.back_ticket?.depDate : undefined}
                                    backDepAirport={flight.isRoundtrip ? `${flight.back_ticket?.depAirport.title}, ${flight.back_ticket?.depAirport.code}` : undefined}
                                    backDepCity={flight.isRoundtrip ? flight.back_ticket?.depCity.title : undefined}
                                    backArriveTime={flight.isRoundtrip ? flight.back_ticket?.arriveTime : undefined}
                                    backArriveDate={flight.isRoundtrip ? flight.back_ticket?.arriveDate : undefined}
                                    backArriveAirport={flight.isRoundtrip ? `${flight.back_ticket?.arriveAirport.title}, ${flight.back_ticket?.arriveAirport.code}` : undefined}
                                    backArriveCity={flight.isRoundtrip ? flight.back_ticket?.arriveCity.title : undefined}
                                    backFlightTime={flight.isRoundtrip ? `${flight.back_ticket?.duration.flight.hour}h, ${flight.back_ticket?.duration.flight.minute}min` : undefined}
                                    isRoundTrip={flight.isRoundtrip}
                                    baggageInfo={flight.baggage}
                                    btnText="Remove"
                                    onPress={() => removeFromCart(flight.id)}
                                    onCartScreen={true}
                                    onCheckoutPress={() => handleCheckout(flight.id)}
                                    checkoutBtnText={expandedCardId === flight.id ? "Hide Checkout" : "Checkout"}
                                    showFavIcon={false}
                                    personCount={flight.passengers}
                                />
                                {expandedCardId === flight.id && (
                                    <CheckoutForm
                                        onSubmit={(formData) => handlePayment(flight.id, formData)}
                                        onPersonCountChange={(count, formDataList) => handlePersonCountChange(flight.id, count, formDataList)}
                                        initialFormDataList={formDataLists[flight.id]}
                                        initialPassengerCount={flight.passengers}
                                        passengerDetails={flight.passengerDetails}
                                    />
                                )}
                            </View>
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
    formContainer: {
        marginTop: -30,
        paddingHorizontal: 15,
        paddingBottom: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 15
    },
    input: {
        fontSize: 14,
        fontFamily: 'Montserrat-Regular',
        height: 46,
        borderRadius: 10,
        paddingHorizontal: 20,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#207FBF'
    },
    payButton: {
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#207FBF',
        marginTop: 10
    },
    payButtonText: {
        fontFamily: 'Montserrat-Bold',
        color: 'white',
        textAlign: 'center',
    },
    personContainer: {
        marginVertical: 12,
        flexDirection: 'column',
        gap: 10
    },
    personHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingLeft: 5
    },
    removePersonBtn: {
        backgroundColor: '#207FBF',
        width: 26,
        height: 26,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    removePersonBtnText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Montserrat-Medium',
        marginBottom: 2
    },
    errorText: {
        marginTop: 10,
        fontFamily: 'Montserrat-Bold',
        fontSize: 14,
        color: '#c93333',
        textAlign: 'center'
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})
