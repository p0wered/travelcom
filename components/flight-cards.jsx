import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";

export function FlightCard({price, airlinesTitle, airlinesImg, depCity, arrivalCity, depAirport, arrivalAirport,
                               flightTime, depTime, arrivalTime, depDate, arrivalDate, btnText, onPress, onCartScreen,
                               onCheckoutPress, checkoutBtnText})
{
    let btnShow;
    btnText === undefined ? btnShow = false : btnShow = true;

    return(
        <View style={styles.flightsCard}>
            <View style={[styles.cardBlock, {marginBottom: 16}]}>
                <View>
                    <View style={{marginBottom: 10}}>
                        <Text style={styles.mainText}>{depCity} - {arrivalCity}</Text>
                        <Text style={styles.greyText}>{flightTime} on the way</Text>
                    </View>
                    <View style={styles.textMerger}>
                        <Image style={styles.airlinesImg} source={airlinesImg}/>
                        <Text style={styles.smallText}>{airlinesTitle}</Text>
                    </View>
                </View>
                <View>
                    <Text style={styles.largeText}>{price} ₽</Text>
                </View>
            </View>
            <View style={styles.cardBlock}>
                <View style={{display: 'flex', flexDirection: 'row'}}>
                    <View style={{marginRight: 26}}>
                        <View style={{marginBottom: 16}}>
                            <Text style={[styles.mainText, {fontSize: 13}]}>{depTime}</Text>
                            <Text style={styles.greyText}>{depDate}</Text>
                        </View>
                        <View>
                            <Text style={[styles.mainText, {fontSize: 13}]}>{arrivalTime}</Text>
                            <Text style={styles.greyText}>{arrivalDate}</Text>
                        </View>
                    </View>
                    <View>
                        <View style={{marginBottom: 16}}>
                            <Text style={[styles.mainText, {fontSize: 13}]}>{depCity}</Text>
                            <Text style={styles.greyText}>{depAirport}</Text>
                        </View>
                        <View>
                            <Text style={[styles.mainText, {fontSize: 13}]}>{arrivalCity}</Text>
                            <Text style={styles.greyText}>{arrivalAirport}</Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.chooseBtnWrap}>
                <TouchableOpacity
                    style={[styles.chooseBtn, btnShow ? {display: 'flex'} : {display: 'none'}, onCartScreen ? {width: '48%'} : {width: '100%'}]}
                    activeOpacity={0.8}
                    onPress={onPress}
                >
                    <Text style={styles.btnText}>{btnText}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.chooseBtn, onCartScreen ? {display: 'flex'} : {display: 'none'}]}
                    activeOpacity={0.8}
                    onPress={onCheckoutPress}
                >
                    <Text style={styles.btnText}>{checkoutBtnText}</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainText: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 15,
        color: 'black'
    },
    largeText: {
        fontSize: 24,
        fontFamily: 'Montserrat-Bold',
        marginBottom: 14,
        textAlign: 'right'
    },
    smallText: {
        fontSize: 12,
        fontFamily: 'Montserrat-Regular'
    },
    smallTextBlue: {
        fontSize: 12,
        color: '#207FBF',
        fontFamily: 'Montserrat-Bold'
    },
    greyText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 11,
        color: '#B3B3B3'
    },
    flightsInputForm : {
        position: "relative",
        backgroundColor: 'white',
        padding: 15,
        display: 'flex',
        flexDirection: 'column',
        gap: 15
    },
    flexCenter: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectorTextGrey: {
        fontSize: 11,
        fontFamily: 'Montserrat-Regular',
        color: '#9B9B9A'
    },
    btnText: {
        fontSize: 12,
        fontFamily: 'Montserrat-Bold',
        color: 'white',
        textAlign: 'center'
    },
    flightsCard: {
        backgroundColor: 'white',
        paddingVertical: 18,
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 15
    },
    airlinesImg: {
        width: 18,
        height: 18,
        borderRadius: 100
    },
    textMerger: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8
    },
    cardBlock: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 18
    },
    chooseBtn: {
        width: '48%',
        paddingHorizontal: 25,
        paddingVertical: 14,
        borderRadius: 10,
        backgroundColor: '#207FBF'
    },
    chooseBtnWrap: {
        display: 'flex',
        flexDirection: 'row-reverse',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 16,
        paddingHorizontal: 16,
        gap: 10
    }
});