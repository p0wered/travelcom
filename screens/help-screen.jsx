import {StyleSheet, ScrollView} from "react-native";
import {Footer} from "../components/footer";
import {QuestionForm} from "../components/question-form";

export default function HelpScreen() {
    return(
        <ScrollView>
            <QuestionForm title='If you have any questions or problems with the registration, please contact us'/>
            <Footer color='white'/>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    questionForm: {
        padding: 15,
        backgroundColor: '#207FBF'
    },
    questionTitle: {
        paddingHorizontal: 30,
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
    },
    merger: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 14
    },
    blueText: {
        fontSize: 15,
        fontFamily: 'Montserrat-Bold',
        color: '#207FBF'
    },
    blueTextSmall: {
        fontSize: 12,
        fontFamily: 'Montserrat-Medium',
        color: '#207FBF',
        maxWidth: 300
    },
    info: {
        padding: 20,
        display: "flex",
        flexDirection: 'column',
        gap: 15,
        backgroundColor: 'white'
    }
})