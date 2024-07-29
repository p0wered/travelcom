import React, { useState } from 'react';
import {View, TextInput, TouchableOpacity} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export const DateInput = ({date, setDate, placeholder, inCheckout}) => {
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleDatePicker = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(false);
        setDate(currentDate);
    };

    const formatDate = () => {
        if (date && date instanceof Date) {
            return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        } else {
            return '';
        }
    };

    return (
        <View>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <TextInput
                    style={!inCheckout ? {fontFamily: 'Montserrat-Bold', color: '#207fbf'} : {fontFamily: 'Montserrat-Regular', color: 'black'}}
                    value={formatDate()}
                    placeholder={placeholder}
                    placeholderTextColor="#bebebe"
                    editable={false}
                />
            </TouchableOpacity>
            {showDatePicker && (
                <DateTimePicker
                    value={date || new Date()}
                    mode="date"
                    display="default"
                    onChange={handleDatePicker}
                />
            )}
        </View>
    );
};
