import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Arrow from "./icons/arrow-icon";
import {CheckIcon} from "./icons/check-icon";

export function GenderSelector({gender, setGender}) {
    const [isOpen, setIsOpen] = useState(false);

    const setMale = () => {
        setGender('Male');
        setIsOpen(false);
    }

    const setFemale = () => {
        setGender('Female');
        setIsOpen(false);
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => setIsOpen(!isOpen)} style={[styles.header, {paddingHorizontal: 18, paddingVertical: 15}]}>
                <Text style={styles.genderText}>{gender || 'Gender'}</Text>
            </TouchableOpacity>
            {isOpen && (
                <View style={styles.dropdown}>
                    <TouchableOpacity style={styles.mergerGender} onPress={setMale}>
                        <Text style={styles.mergerText}>Male</Text>
                        <CheckIcon color={gender === 'Male' ? '#207FBF' : 'grey'} width={24} height={24} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.mergerGender} onPress={setFemale}>
                        <Text style={styles.mergerText}>Female</Text>
                        <CheckIcon color={gender === 'Female' ? '#207FBF' : 'grey'} width={24} height={24} />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

export function RoundTripSelector ({roundTrip, setRoundTrip, setBackDate}){
    const [isOpen, setIsOpen] = useState(false);

    const setTrue = () => {
        setRoundTrip(true);
        setBackDate(new Date());
    }

    const setFalse = () => {
        setRoundTrip(false);
        setBackDate(null);
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => setIsOpen(!isOpen)} style={styles.header}>
                <Text style={styles.headerText}>{roundTrip ? 'There and back' : 'One way'}</Text>
                <Arrow/>
            </TouchableOpacity>
            {isOpen && (
                <View style={styles.dropdown}>
                    <TouchableOpacity style={styles.merger} onPress={setFalse}>
                        <Text style={styles.mergerText}>One way</Text>
                        <CheckIcon color={roundTrip ? 'grey' : '#207FBF'} width={24} height={24}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.merger} onPress={setTrue}>
                        <Text style={styles.mergerText}>There and back</Text>
                        <CheckIcon color={roundTrip ? '#207FBF' : 'grey'} width={24} height={24}/>
                    </TouchableOpacity>
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
    genderText: {
        fontFamily: 'Montserrat-Regular'
    },
    dropdown: {
        borderTopWidth: 1,
        borderTopColor: '#207FBF',
    },
    merger: {
        padding: 16,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#207FBF',
        gap: 10
    },
    mergerText: {
        fontSize: 14,
        fontFamily: 'Montserrat-Regular'
    },
    mergerGender: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#207FBF',
        gap: 7
    },
});
