import {ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React, {useEffect, useState} from "react";
import {FlightCard} from "../components/flight-cards";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AirlinesImg from '../assets/airlines.png';
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
                setError('Токен не найден. Пожалуйста, войдите в аккаунт.');
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
                throw new Error('Не удалось получить данные о заказах');
            }

            const data = await response.json();
            const parsedOrders = data.map(order => ({
                ...order,
                item: JSON.parse(order.item)
            }));
            console.log(data)
            setOrders(parsedOrders);
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
                    {`Full Birthday: ${clientData.birthDate}`}
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
            minute: '2-digit',
            second: '2-digit'
        });
    }

    const renderFlightCard = ({ item }) => {
        const flightData = item.item;
        if (!flightData) {
            console.error('Flight data is undefined for item:', item);
            return null;
        }

        const clientsData = Object.keys(flightData)
            .filter(key => !isNaN(parseInt(key)))
            .map(key => flightData[key]);

        return (
            <View style={styles.orderContainer}>
                <FlightCard
                    price={flightData.price}
                    airlinesTitle={flightData.provider?.supplier?.title}
                    airlinesImg={AirlinesImg}
                    depCity={flightData.depCity?.title}
                    arrivalCity={flightData.arriveCity?.title}
                    depAirport={flightData.depAirport?.title}
                    arrivalAirport={flightData.arriveAirport?.title}
                    flightTime={`${flightData.duration?.flight?.hour || 0}h ${flightData.duration?.flight?.minute || 0}m`}
                    depTime={flightData.depTime}
                    arrivalTime={flightData.arriveTime}
                    depDate={flightData.depDate}
                    arrivalDate={flightData.arriveDate}
                    onCartScreen={false}
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
});