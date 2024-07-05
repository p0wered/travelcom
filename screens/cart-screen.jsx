import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useState} from "react";
import BookedRoomItem from "../components/booked-room-item";
import {FlightCard} from "../components/flight-cards";
import {Footer} from "../components/footer";

export default function CartScreen() {
    const [selectedType, setSelectedType] = useState('All');
    const types = ['All', 'Flights', 'Hotels'];

    const renderContent = () => {
        switch (selectedType) {
            case 'Flights':
                return <FlightCard btnShown={true}/>;
            case 'Hotels':
                return <BookedRoomItem />;
            case 'All':
                return (
                    <>
                        <FlightCard btnShown={true}/>
                        <BookedRoomItem />
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
                <Text style={styles.titleText}>Shopping Cart</Text>
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