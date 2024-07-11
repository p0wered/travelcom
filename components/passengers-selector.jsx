import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Arrow from "./icons/arrow-icon";

export function PassengerDropdown ({passengers, setPassengers}){
    const [isOpen, setIsOpen] = useState(false);
    const totalPassengers = Object.values(passengers).reduce((a, b) => a + b, 0);

    const updatePassenger = (type, increment) => {
        setPassengers(prev => ({
            ...prev,
            [type]: Math.max(0, prev[type] + increment)
        }));
    };

    const PassengerType = ({type, label, description}) => (
        <View style={styles.passengerType}>
            <View style={{marginLeft: 5}}>
                <Text style={styles.passengerLabel}>{label}</Text>
                <Text style={styles.passengerDescription}>{description}</Text>
            </View>
            <View style={styles.counter}>
                <TouchableOpacity onPress={() => updatePassenger(type, -1)}>
                    <View style={styles.counterButton}>
                        <Text style={{color: 'white'}}>-</Text>
                    </View>
                </TouchableOpacity>
                <Text style={styles.counterValue}>{passengers[type]}</Text>
                <TouchableOpacity onPress={() => updatePassenger(type, 1)}>
                    <View style={styles.counterButton}>
                        <Text style={{color: 'white'}}>+</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => setIsOpen(!isOpen)} style={styles.header}>
                <Text style={styles.headerText}>{totalPassengers} {totalPassengers === 1 ? 'passenger' : 'passengers'}</Text>
                <Arrow/>
            </TouchableOpacity>
            {isOpen && (
                <View style={styles.dropdown}>
                    <PassengerType type="adults" label="Adults" description="12 years and older" />
                    <PassengerType type="children" label="Children" description="From 2 to 11 years old" />
                    <PassengerType type="infants" label="Infants" description="Under 2 years old, without a place" />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        color: '#207FBF',
        fontSize: 16,
        fontFamily: 'Montserrat-Bold',
        borderRadius: 10,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#207FBF',
        overflow: 'hidden'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 25,
        paddingVertical: 20
    },
    headerText: {
        color: '#207FBF',
        fontFamily: 'Montserrat-Bold'
    },
    dropdown: {
        borderTopWidth: 1,
        borderTopColor: '#207FBF',
    },
    passengerType: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#207FBF',
        height: 70
    },
    passengerLabel: {
        color: '#207FBF',
        fontSize: 14,
        fontFamily: 'Montserrat-Bold'
    },
    passengerDescription: {
        fontSize: 12,
        fontFamily: 'Montserrat-Regular',
        color: '#666',
        maxWidth: 140
    },
    counter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    counterButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 24,
        height: 24,
        backgroundColor: '#207FBF',
        borderRadius: 100,
        marginVertical: 10
    },
    counterValue: {
        fontSize: 18,
        paddingHorizontal: 10,
    },
});