import {ActivityIndicator, Image, Platform, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {FavoriteIcon} from "./icons/favorite-icon";
import {CheckIcon} from "./icons/check-icon";

export function FlightCard({price, airlinesTitle, airlinesImg, depCity, arrivalCity, depAirport, arrivalAirport,
                               flightTime, depTime, arrivalTime, depDate, arrivalDate, btnText, onPress, onCartScreen,
                               onCheckoutPress, checkoutBtnText, showFavIcon, favouriteIconPress, favouriteIconColor,
                               isRoundTrip, backDepTime, backDepDate, backArriveTime, backArriveDate, backDepAirport,
                               backArriveAirport, backDepCity, backArriveCity, backFlightTime, personCount, baggageInfo,
                               onOrderScreen})
{
    let btnShow;
    btnText === undefined ? btnShow = false : btnShow = true;

    function renderBaggageInfo(){
        return(
            <>
                <View style={{flexDirection: 'row', gap: 3, justifyContent: 'flex-end', alignItems: 'center', marginTop: 2}}>
                    <Text adjustsFontSizeToFit={true} style={[styles.greyText, {textAlign: 'right'}]}>Carry-on luggage</Text>
                    <CheckIcon color='#207fbf' width={18} height={18}/>
                </View>
                {baggageInfo.piece !== undefined ? (
                    <View style={{flexDirection: 'row', gap: 3, justifyContent: 'flex-end', alignItems: 'center', marginTop: 2}}>
                        <Text adjustsFontSizeToFit={true} style={[styles.greyText, {textAlign: 'right', maxWidth: 128}]}>Baggage</Text>
                        <CheckIcon color={baggageInfo.piece !== 0 && baggageInfo.piece ? '#207fbf' : 'grey'} width={18} height={18}/>
                    </View>
                ) : (<></>)
                }
                {baggageInfo.weight !== null && baggageInfo.weight > 0 ? (
                    <View style={{flexDirection: 'row', gap: 3, justifyContent: 'flex-end', alignItems: 'center', marginTop: 2}}>
                        <Text adjustsFontSizeToFit={true} style={[styles.greyText, {textAlign: 'right', maxWidth: 128}]}>Baggage up to {baggageInfo.weight} kg</Text>
                    </View>
                ) : (<></>)
                }
            </>
        )
    }

    return(
        <View style={styles.flightsCard}>
            <View style={[styles.cardBlock, {marginBottom: 16}]}>
                <View>
                    <View style={{marginBottom: 10}}>
                        <Text style={[styles.mainText, {fontSize: 14}]}>{depCity} - {arrivalCity}</Text>
                        <Text style={[styles.greyText, {marginTop: 5}]}>{flightTime} on the way there</Text>
                    </View>
                    <View style={styles.textMerger}>
                        <Image style={styles.airlinesImg} source={{uri: airlinesImg}}/>
                        <Text style={styles.smallText}>{airlinesTitle}</Text>
                    </View>
                </View>
                <View>
                    <Text style={styles.largeText} adjustsFontSizeToFit={true}>{price} €</Text>
                    {renderBaggageInfo()}
                </View>
            </View>
            <View style={[styles.cardBlock]}>
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
            {isRoundTrip ? (
                <>
                    <View style={styles.separator}/>
                    <Text style={[styles.greyText, {paddingHorizontal: 18, marginBottom: 8}]}>{backFlightTime} on the way back</Text>
                    <View style={styles.cardBlock}>
                        <View style={{display: 'flex', flexDirection: 'row'}}>
                            <View style={{marginRight: 26}}>
                                <View style={{marginBottom: 16}}>
                                    <Text style={[styles.mainText, {fontSize: 13}]}>{backDepTime}</Text>
                                    <Text style={styles.greyText}>{backDepDate}</Text>
                                </View>
                                <View>
                                    <Text style={[styles.mainText, {fontSize: 13}]}>{backArriveTime}</Text>
                                    <Text style={styles.greyText}>{backArriveDate}</Text>
                                </View>
                            </View>
                            <View>
                                <View style={{marginBottom: 16}}>
                                    <Text style={[styles.mainText, {fontSize: 13}]}>{backDepCity}</Text>
                                    <Text style={styles.greyText}>{backDepAirport}</Text>
                                </View>
                                <View>
                                    <Text style={[styles.mainText, {fontSize: 13}]}>{backArriveCity}</Text>
                                    <Text style={styles.greyText}>{backArriveAirport}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </>
            ) : (
                <></>
            )}
            {personCount !== undefined ? (
                <View style={{paddingHorizontal: 18, marginTop: 12}}>
                    <Text style={[styles.greyText, {fontSize: 14}]}>{`For ${personCount} ${personCount === 1 ? 'person' : 'persons'}`}</Text>
                </View>
            ) : (<></>)}
            <View style={styles.chooseBtnWrap}>
                <TouchableOpacity style={[styles.favouriteBtn, showFavIcon ? {display: 'flex'} : {display: 'none'}]} onPress={favouriteIconPress}>
                    <FavoriteIcon color={favouriteIconColor} stroke='black'/>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.chooseBtn, btnShow ? {display: 'flex'} : {display: 'none'}, onCartScreen ? {width: '48%'} : {width: '83%'}]}
                    activeOpacity={0.8}
                    onPress={onPress}
                >
                    {
                        btnText !== 'Loading' ? (
                            <Text style={styles.btnText}>{btnText}</Text>
                        ) : (
                            <ActivityIndicator color="#ffffff"/>
                        )
                    }

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
        fontSize: Platform.OS === 'ios' ? 22 : 19,
        fontFamily: 'Montserrat-Bold',
        textAlign: 'right',
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
        width: 26,
        height: 26,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: '#d6d6d6'
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
        paddingHorizontal: 18,
        gap: 10
    },
    chooseBtn: {
        width: '48%',
        paddingHorizontal: 25,
        paddingVertical: 14,
        borderRadius: 10,
        backgroundColor: '#207FBF',
        maxHeight: 43,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    chooseBtnWrap: {
        display: 'flex',
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
        paddingHorizontal: 16,
        gap: 6
    },
    favouriteBtn: {
        paddingHorizontal: 4,
        paddingVertical: 10
    },
    separator: {
        height: 1,
        marginTop: 18,
        marginBottom: 10,
        marginHorizontal: 18,
        backgroundColor: '#e5e5e5'
    }
});
