import React, {useState} from 'react';
import {View, TextInput, FlatList, Text, StyleSheet, ScrollView, Platform} from 'react-native';

export function AutoCompleteInput({ title, inputText, setInputText, suggestions, setSuggestions}) {
    const fetchSuggestions = async (text) => {
        if (text.length < 2) {
            setSuggestions([]);
            return;
        }
        try {
            const response = await fetch('https://travelcom.online/api/crpo/complete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    req: text
                }),
            });
            const data = await response.json();
            if (data && Array.isArray(data)) {
                setSuggestions(data);
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    };

    const handleTextChange = (text) => {
        setInputText(text);
        fetchSuggestions(text);
    };

    const handleSuggestionPress = (suggestion) => {
        setInputText(suggestion);
        setSuggestions([]);
    };

    return (
        <View>
            <TextInput
                style={[
                    styles.locationInput,
                    suggestions.length > 0 ? {borderBottomStartRadius: 0, borderBottomEndRadius: 0} : {borderRadius: 10}
                ]}
                value={inputText}
                onChangeText={handleTextChange}
                placeholder={title}
                placeholderTextColor='#C4E7FA'
            />
            {suggestions.length > 0 && (
                <View style={styles.suggestionBox}>
                    <FlatList
                        scrollEnabled={false}
                        data={suggestions}
                        keyExtractor={(item) => item}
                        renderItem={({item}) => (
                            <>
                                {Platform.OS === 'ios' ? (
                                    <View style={{height: 1, backgroundColor: '#207fbf'}}/>
                                ) : (<></>)}
                                <Text style={styles.suggestion} onPress={() => handleSuggestionPress(item)}>
                                    {item}
                                </Text>
                            </>
                        )}
                    />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    locationInput: {
        color: '#207FBF',
        fontSize: 15,
        fontFamily: 'Montserrat-Bold',
        height: 64,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        paddingHorizontal: 25,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#207FBF'
    },
    suggestion: {
        fontSize: 11,
        fontFamily: 'Montserrat-Regular',
        padding: 14,
        borderTopWidth: 1,
        borderColor: '#207fbf'
    },
    suggestionBox: {
        backgroundColor: 'white',
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#207FBF',
        borderBottomStartRadius: 10,
        borderBottomEndRadius: 10,
        maxHeight: 216,
        overflow: 'hidden'
    }
});
