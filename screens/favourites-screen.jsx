import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useState} from "react";
import BookedRoomItem from "../components/booked-room-item";
import {FlightCard, TransferFlightCard} from "../components/flight-cards";
import {Footer} from "../components/footer";
import {RoomItem} from "../components/room-item";
import {FlightDirection} from "../components/flight-direction-item";

export default function FavouritesScreen() {
    const [selectedType, setSelectedType] = useState('All');
    const types = ['All', 'Flights', 'Hotels'];

    const renderContent = () => {
        switch (selectedType) {
            case 'Flights':
                return (
                    <>
                        <FlightCard btnShown={true}/>
                        <FlightDirection
                            image={require('../assets/country-image.png')}
                            direction='London - Paris'
                        />
                    </>
                );
            case 'Hotels':
                return (
                    <>
                        <RoomItem
                            image={require('../assets/hotels/room-image-2.png')}
                            name='Hotel Alane'
                            price='1700'
                            fromCenter='8.1'
                            reviewsScore='4.5'
                            reviewsAmount='84'
                            hotelStars='3'
                        />
                        <RoomItem
                            image={require('../assets/hotels/room-image-6.png')}
                            name='Hotel Rapture'
                            price='1700'
                            fromCenter='13.9'
                            reviewsScore='3.9'
                            reviewsAmount='5'
                            hotelStars='2'
                        />
                    </>
                );
            case 'All':
                return (
                    <>
                        <FlightDirection
                            image={require('../assets/country-image.png')}
                            direction='London - Paris'
                        />
                        <RoomItem
                            image={require('../assets/hotels/room-image-2.png')}
                            name='Hotel Alane'
                            price='1700'
                            fromCenter='8.1'
                            reviewsScore='4.5'
                            reviewsAmount='84'
                            hotelStars='3'
                        />
                        <FlightCard btnShown={true}/>
                        <RoomItem
                            image={require('../assets/hotels/room-image-2.png')}
                            name='Hotel Alane'
                            price='1700'
                            fromCenter='8.1'
                            reviewsScore='4.5'
                            reviewsAmount='84'
                            hotelStars='3'
                        />
                    </>
                );
            case 'Awaiting payment':
                return <Text style={styles.mainText}>There is nothing yet</Text>
            default:
                return null;
        }
    };

    return (
        <ScrollView>
            <View style={{padding: 15}}>
                <Text style={styles.titleText}>Favourites</Text>
                <View style={styles.buttonsContainer}>
                    {types.map((type) => (
                        <TouchableOpacity
                            key={type}
                            style={[
                                styles.button,
                                selectedType === type && styles.selectedButton,
                            ]}
                            onPress={() => setSelectedType(type)}
                        >
                            <Text
                                style={[
                                    styles.buttonText,
                                    selectedType === type && styles.selectedButtonText,
                                ]}
                                numberOfLines={2}
                                adjustsFontSizeToFit={true}
                            >
                                {type}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                {renderContent()}
            </View>
            <Footer color='white'/>
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
})