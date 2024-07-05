import React, { useState } from 'react';
import {View, TextInput, FlatList, Text, StyleSheet, ScrollView} from 'react-native';

export function AutoCompleteInput ({airportsData, title}){
    const [inputText, setInputText] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const handleTextChange = (text) => {
        setInputText(text);
        const filteredSuggestions = airportsData.filter((city) =>
            city.toLowerCase().startsWith(text.toLowerCase())
        );
        setSuggestions(filteredSuggestions);
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
                    suggestions.length > 0 ? {borderBottomStartRadius: 10, borderBottomEndRadius: 10,} : {borderRadius: 10}]}
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
                            <Text style={styles.suggestion} onPress={() => handleSuggestionPress(item)}>
                                {item}
                            </Text>
                        )}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    locationInput: {
        color: '#207FBF',
        fontSize: 16,
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
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#207FBF',
    },
    suggestionBox: {
        backgroundColor: 'white',
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#207FBF',
        borderBottomStartRadius: 10,
        borderBottomEndRadius: 10,
        maxHeight: 218,
        overflow: 'hidden'
    }
});