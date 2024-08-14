import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export const DateInput = ({ date, setDate, placeholder, inCheckout }) => {
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
        }
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
            {(showDatePicker || Platform.OS === 'ios') && (
                <DateTimePicker
                    value={date || new Date()}
                    mode="date"
                    display="calendar"
                    onChange={handleDateChange}
                    accentColor="#207fbf"
                    themeVariant="light"
                    maximumDate={inCheckout ? new Date() : undefined}
                    minimumDate={inCheckout ? undefined : new Date()}
                    style={!inCheckout ?
                        {position: 'absolute', right: -20, top: -8, opacity: 0.015} :
                        {position: 'absolute', left: -26, top: -9, opacity: 0.015}}
                />
            )}
        </View>
    );
};
