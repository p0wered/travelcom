import {Pressable, Text, TextInput, View, StyleSheet, ActivityIndicator} from "react-native";
import {SendIcon} from "./icons/send-icon";
import axios from "axios";
import React, {useState} from "react";

export function QuestionForm({title, clearErrors}) {
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [question, setQuestion] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        if (clearErrors) {
            setError('');
            setSuccess(false);
        }
    }, [clearErrors]);

    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const response = await axios.post('https://travelcom.online/api/contact/send-question', {
                phone,
                email,
                question
            });

            if (response.status === 200) {
                setSuccess(true);
                setPhone('');
                setEmail('');
                setQuestion('');
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                const firstErrorKey = Object.keys(error.response.data.errors)[0];
                setError(error.response.data.errors[firstErrorKey][0]);
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.questionForm}>
            <View style={styles.titleContainer}>
                <Text style={styles.questionTitle}>{title}</Text>
            </View>
            <View style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <TextInput
                    style={styles.questionInput}
                    placeholder='Phone'
                    placeholderTextColor='grey'
                    autoComplete='tel'
                    keyboardType='number-pad'
                    value={phone}
                    onChangeText={setPhone}
                />
                <TextInput
                    style={styles.questionInput}
                    placeholder='E-mail'
                    placeholderTextColor='grey'
                    autoComplete='email'
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput
                    style={[styles.questionInput, { height: 107 }]}
                    placeholder='Your question'
                    placeholderTextColor='grey'
                    multiline={true}
                    numberOfLines={4}
                    value={question}
                    onChangeText={setQuestion}
                />
            </View>
            <Pressable style={styles.sendBtn} onPress={handleSubmit} disabled={loading}>
                {loading ? (
                    <ActivityIndicator color="#ffffff" />
                ) : (
                    <>
                        <Text style={styles.sendBtnText}>SEND</Text>
                        <SendIcon />
                    </>
                )}
            </Pressable>
            {error !== '' && (
                <Text style={styles.errorText}>{error}</Text>
            )}
            {success && (
                <Text style={styles.successText}>Your question has been sent successfully!</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    questionForm: {
        padding: 15,
        backgroundColor: '#207FBF'
    },
    questionTitle: {
        fontSize: 20,
        fontFamily: 'Montserrat-Bold',
        color: 'white',
        textTransform: 'uppercase',
        textAlign: 'center',
    },
    titleContainer: {
        marginBottom: 30,
        marginTop: 15,
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    questionInput: {
        fontSize: 16,
        fontFamily: 'Montserrat-Bold',
        height: 64,
        paddingHorizontal: 25,
        backgroundColor: 'white',
        borderRadius: 10
    },
    sendBtn: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 10
    },
    sendBtnText: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 16,
        color: 'white'
    },
    errorText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 14,
        fontFamily: 'Montserrat-Medium'
    },
    successText: {
        color: 'white',
        fontSize: 14,
        fontFamily: 'Montserrat-Medium',
        textAlign: 'center'
    },
})
