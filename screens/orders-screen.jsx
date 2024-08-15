import {ActivityIndicator, FlatList, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React, {useEffect, useState} from "react";
import {FlightCard} from "../components/flight-cards";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Footer} from "../components/footer";


export default function OrdersScreen(){
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [displayedItems, setDisplayedItems] = useState(5);

    useEffect(() => {
        fetchOrders();
    }, []);

    const loadMoreItems = () => {
        setDisplayedItems(prevItems => prevItems + 5);
    };

    const renderFooter = () => {
        if (displayedItems >= orders.length) {
            return null;
        }
        return (
            <TouchableOpacity activeOpacity={0.8} style={styles.showMoreBtn} onPress={loadMoreItems}>
                <Text style={styles.btnText}>Show more</Text>
            </TouchableOpacity>
        );
    };

    const fetchOrders = async () => {
        try {
            const token = await AsyncStorage.getItem('@token');
            if (!token) {
                setError('Please log in');
                setLoading(false);
                return;
            }

            const response = await fetch('https://travelcom.online/api/orders/my', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Couldn\'t get orders');
            }

            const data = await response.json();
            const parsedOrders = data.map(order => ({
                ...order,
                item: JSON.parse(order.item)
            }));
            setOrders(parsedOrders);
            console.log(parsedOrders)
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const renderClientInfo = (clientData) => {
        return (
            <View style={styles.clientInfo}>
                <Text style={styles.clientInfoText}>
                    {`${clientData.lastName} ${clientData.firstName} ${clientData.middleName}`}
                </Text>
                <Text style={styles.clientInfoText}>
                    {`Birthday: ${formatDate(clientData.birthDate).slice(0, 10)}`}
                </Text>
                <Text style={styles.clientInfoText}>
                    {`Gender: ${clientData.gender}`}
                </Text>
                <Text style={styles.clientInfoText}>
                    {`Passport: ${clientData.passport}`}
                </Text>
            </View>
        );
    };

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('ru-RU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    const renderFlightCard = ({ item }) => {
        const flightData = item.item;
        const isRoundTrip = flightData.isRoundtrip || false;
        if (!flightData) {
            console.error('Flight data is undefined for item:', item);
            return null;
        }

        const handlePayPress = () => {
            if (item.payment_link) {
                Linking.openURL(item.payment_link).catch(err => console.error("Couldn't open payment link", err));
            }
        };

        const clientsData = Object.keys(flightData)
            .filter(key => !isNaN(parseInt(key)))
            .map(key => flightData[key]);

        const isPaymentDisabled = () => {
            const createdAt = new Date(item.created_at);
            const now = new Date();
            const diffInMinutes = (now - createdAt) / (1000 * 60);
            return diffInMinutes > 20;
        };

        const paymentDisabled = isPaymentDisabled();

        return (
            <View style={styles.orderContainer}>
                <FlightCard
                    key={flightData.id}
                    price={flightData.price}
                    flightTime={`${flightData.duration.flight.hour}h, ${flightData.duration.flight.minute}min`}
                    depCity={flightData.depCity.title}
                    depAirport={`${flightData.depAirport.title}, ${flightData.depAirport.code}`}
                    depTime={flightData.depTime}
                    depDate={flightData.depDate}
                    arrivalCity={flightData.arriveCity.title}
                    arrivalTime={flightData.arriveTime}
                    arrivalDate={flightData.arriveDate}
                    arrivalAirport={`${flightData.arriveAirport.title}, ${flightData.arriveAirport.code}`}
                    airlinesTitle={flightData.provider.supplier.title}
                    airlinesImg={flightData.providerLogo}
                    backDepTime={isRoundTrip ? flightData.back_ticket?.depTime : undefined}
                    backDepDate={isRoundTrip ? flightData.back_ticket?.depDate : undefined}
                    backDepAirport={isRoundTrip ? `${flightData.back_ticket?.depAirport.title}, ${flightData.back_ticket?.depAirport.code}` : undefined}
                    backDepCity={isRoundTrip ? flightData.back_ticket?.depCity.title : undefined}
                    backArriveTime={isRoundTrip ? flightData.back_ticket?.arriveTime : undefined}
                    backArriveDate={isRoundTrip ? flightData.back_ticket?.arriveDate : undefined}
                    backArriveAirport={isRoundTrip ? `${flightData.back_ticket?.arriveAirport.title}, ${flightData.back_ticket?.arriveAirport.code}` : undefined}
                    backArriveCity={isRoundTrip ? flightData.back_ticket?.arriveCity.title : undefined}
                    backFlightTime={isRoundTrip ? `${flightData.back_ticket?.duration.flight.hour}h, ${flightData.back_ticket?.duration.flight.minute}min` : undefined}
                    isRoundTrip={isRoundTrip}
                    onCartScreen={false}
                    showFavIcon={false}
                />
                <View style={styles.clientsContainer}>
                    <Text style={styles.mainText}>Created at:</Text>
                    <Text style={[styles.clientInfoText, {marginBottom: 8}]}>{formatDate(item.created_at)}</Text>
                    {clientsData.map((clientData, index) => (
                        <View style={{marginBottom: 10}} key={index}>
                            <Text style={styles.mainText}>Person {index + 1} Information</Text>
                            <View>
                                {renderClientInfo(clientData)}
                            </View>
                        </View>
                    ))}
                </View>

                <View style={[{paddingHorizontal: 15, paddingBottom: 15}, paymentDisabled ? {display: 'none'} : {display: 'block'}]}>
                    <TouchableOpacity
                        style={styles.chooseBtn}
                        activeOpacity={0.8}
                        onPress={handlePayPress}
                    >
                        <Text style={styles.btnText}>Pay</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#207FBF" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text>{error}</Text>
            </View>
        );
    }

    return (
        <ScrollView>
            <View style={styles.listContent}>
                <Text style={styles.titleText}>Your orders</Text>
                <FlatList
                    scrollEnabled={false}
                    data={orders.slice(0, displayedItems)}
                    renderItem={renderFlightCard}
                    keyExtractor={(item) => item.id.toString()}
                    ListFooterComponent={renderFooter}
                />
            </View>
            <Footer/>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    mainText: {
        fontSize: 15,
        fontFamily: 'Montserrat-Bold',
        marginBottom: 8
    },
    listContent: {
        padding: 15
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    orderContainer: {
        marginBottom: 15,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        overflow: 'hidden',
    },
    clientsContainer: {
        marginTop: -25,
        paddingHorizontal: 15,
        paddingBottom: 10
    },
    clientsHeader: {
        marginBottom: 8,
    },
    clientInfo: {
        flexDirection: 'column',
        gap: 12
    },
    clientInfoText: {
        fontSize: 14,
        fontFamily: 'Montserrat-Regular',
    },
    titleText: {
        fontSize: 20,
        fontFamily: 'Montserrat-Bold',
        color: '#207FBF',
        marginBottom: 15
    },
    showMoreBtn: {
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#207FBF',
    },
    btnText: {
        fontFamily: 'Montserrat-Bold',
        color: 'white',
        textAlign: 'center'
    },
    chooseBtn: {
        width: '100%',
        paddingHorizontal: 25,
        paddingVertical: 14,
        borderRadius: 10,
        backgroundColor: '#207FBF'
    },
});
