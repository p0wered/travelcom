import {StyleSheet, Text, View} from "react-native";

export default function FlightsScreen() {
    return(
        <View>
            <Text>FLIGHTS SCREEN</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    mainText: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 14,
        color: 'white'
    },
    offerTravel: {
        paddingTop: 20,
    },
    offerTitle: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
    },
    offerTitleText: {
        fontFamily: 'Montserrat-Bold',
        color: 'white',
        textAlign: 'center',
        fontSize: 32,
        width: 200,
        height: 117,
        textTransform: 'uppercase'
    },
    seleneForm: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingTop: 17,
        paddingLeft: 14,
        paddingRight: 14,
        paddingBottom: 45
    },
    formText: {
        fontSize: 20,
        fontFamily: 'Montserrat-Regular',
        marginTop: 70,
        marginBottom: 70,
        textAlign: 'center',
    },
    mainBtn: {
        padding: 15,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: '#207FBF',
    },
    formBtn: {
        bottom: -22,
        position: 'absolute',
    },
    directionTitle: {
        position: 'absolute',
        width: 200,
        top: -40,
        height: 100,
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 20,
        paddingBottom: 20,
        borderRadius: 10,
        backgroundColor: '#207FBF',
    },
    directionItem: {
        width: 320,
        height: 222,
        borderRadius: 10,
        overflow: "hidden"
    },
    directionFlexbox: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 14,
        gap: 20,
        marginBottom: 50
    },
    blogFlexbox: {
        position: 'relative',
        backgroundColor: '#207FBF',
        display: 'flex',
        flexDirection: 'column',
        padding: 14,
        gap: 20
    },
    blogBtn: {
        position: 'absolute',
        backgroundColor: 'white',
        top: -36,
    },
    blogSmallText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 11,
        color: 'white'
    },
    blogImg: {
        width: 300,
        borderRadius: 10
    },
    faqText: {
        fontFamily: 'Montserrat-Bold',
        marginBottom: 15,
        fontSize: 30,
        color: '#207FBF',
        textAlign: 'center'
    },
    faqFlexbox: {
        padding: 14
    },
    accordionItem: {
        height: 51,
        borderWidth: 1,
        borderColor: '#207FBF',
        borderRadius: 10,
        marginBottom: 12
    },
    accordionItemActive: {
        height: 'auto',
        backgroundColor: '#207FBF',
    },
    accordionInner: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: 15
    },
    separatorAccordion: {
        width: '100%',
        height: 1,
        backgroundColor: 'white'
    },
    arrowContainer: {
        position: 'relative',
        width: 15,
        height: 15,
    },
    arrowWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
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
});