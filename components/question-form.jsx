import {Pressable, Text, TextInput, View, StyleSheet} from "react-native";
import {SendIcon} from "./icons/send-icon";

export function QuestionForm(){
    return(
        <View style={styles.questionForm}>
            <View style={{marginBottom: 30, marginTop: 15}}>
                <Text style={styles.questionTitle}>Any other question?</Text>
                <Text style={styles.questionTitle}>Write to us!</Text>
            </View>
            <View style={{display: 'flex', flexDirection: 'column', gap: 14}}>
                <TextInput
                    style={styles.questionInput}
                    placeholder='Phone'
                    placeholderTextColor='grey'
                    autoComplete='tel'
                    keyboardType='number-pad'
                />
                <TextInput
                    style={styles.questionInput}
                    placeholder='E-mail'
                    placeholderTextColor='grey'
                    autoComplete='email'
                />
                <TextInput
                    style={[styles.questionInput, {height: 107}]}
                    placeholder='Your question'
                    placeholderTextColor='grey'
                    multiline = {true}
                    numberOfLines={4}
                />
            </View>
            <Pressable style={styles.sendBtn}>
                <Text style={styles.sendBtnText}>SEND</Text>
                <SendIcon/>
            </Pressable>
        </View>
    )
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
        textAlign: 'center'
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
    }
})