import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {CheckIcon} from "./icons/check-icon";
import {FavoriteIcon} from "./icons/favorite-icon";
import {TransferIcon} from "./icons/transfer-icon";

export function FlightCard({price, airlinesTitle, airlinesImg, depCity, arrivalCity, depAirport, arrivalAirport,
                               flightTime, depTime, arrivalTime, depDate, arrivalDate, btnShown})
{
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
                    <Text style={styles.largeText}>{price} €</Text>
                    <View style={styles.textMerger}>
                        <Text style={styles.smallText}>Baggage</Text>
                        <Text style={styles.smallTextBlue}>+50€</Text>
                        <CheckIcon color="grey" width={16} height={16}/>
                    </View>
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
                <View style={[styles.chooseBtnWrap, btnShown ? {display: 'flex'} : {display: 'none'}]}>
                    <FavoriteIcon color='white' stroke='black'/>
                    <TouchableOpacity style={styles.chooseBtn} activeOpacity={0.8}>
                        <Text style={styles.btnText}>Choose</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export function TransferFlightCard({price, transferTime, airlinesTitle1, airlinesTitle2, airlinesImg1, airlinesImg2, depCity1,
                                       arrivalCity1, depAirport1, arrivalAirport1, flightTime1, depTime1, arrivalTime1,
                                       depDate1, arrivalDate1, btnShown, arrivalCity2, arrivalAirport2, depTime2, depDate2, arrivalDate2, arrivalTime2}){
    return(
        <View style={styles.flightsCard}>
            <View style={[styles.cardBlock, {marginBottom: 16}]}>
                <View>
                    <View style={{marginBottom: 10}}>
                        <Text style={styles.mainText}>{depCity1} - {arrivalCity1}</Text>
                        <Text style={styles.greyText}>{flightTime1} on the way</Text>
                    </View>
                    <View style={[styles.textMerger, {marginBottom: 8}]}>
                        <Image style={styles.airlinesImg} source={airlinesImg1}/>
                        <Text style={styles.smallText}>{airlinesTitle1}</Text>
                    </View>
                    <View style={styles.textMerger}>
                        <Image style={styles.airlinesImg} source={airlinesImg2}/>
                        <Text style={styles.smallText}>{airlinesTitle2}</Text>
                    </View>
                </View>
                <View>
                    <Text style={styles.largeText}>{price} €</Text>
                    <View style={styles.textMerger}>
                        <Text style={styles.smallText}>Baggage</Text>
                        <Text style={styles.smallTextBlue}>+50€</Text>
                        <CheckIcon color="grey" width={16} height={16}/>
                    </View>
                </View>
            </View>
            <View style={[styles.cardBlock, {marginBottom: 16}]}>
                <View style={{display: 'flex', flexDirection: 'row'}}>
                    <View style={{marginRight: 26}}>
                        <View style={{marginBottom: 16}}>
                            <Text style={[styles.mainText, {fontSize: 13}]}>{depTime1}</Text>
                            <Text style={styles.greyText}>{depDate1}</Text>
                        </View>
                        <View>
                            <Text style={[styles.mainText, {fontSize: 13}]}>{arrivalTime1}</Text>
                            <Text style={styles.greyText}>{arrivalDate1}</Text>
                        </View>
                    </View>
                    <View>
                        <View style={{marginBottom: 16}}>
                            <Text style={[styles.mainText, {fontSize: 13}]}>{depCity1}</Text>
                            <Text style={styles.greyText}>{depAirport1}</Text>
                        </View>
                        <View>
                            <Text style={[styles.mainText, {fontSize: 13}]}>{arrivalCity1}</Text>
                            <Text style={styles.greyText}>{arrivalAirport1}</Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={[styles.textMerger, styles.transferBlock]}>
                <TransferIcon/>
                <View>
                    <Text style={styles.smallText}>Transfer in {arrivalCity1}</Text>
                    <Text style={styles.greyText}>{transferTime}</Text>
                </View>
            </View>
            <View style={styles.cardBlock}>
                <View style={{display: 'flex', flexDirection: 'row'}}>
                    <View style={{marginRight: 26}}>
                        <View style={{marginBottom: 16}}>
                            <Text style={[styles.mainText, {fontSize: 13}]}>{depTime2}</Text>
                            <Text style={styles.greyText}>{depDate2}</Text>
                        </View>
                        <View>
                            <Text style={[styles.mainText, {fontSize: 13}]}>{arrivalTime2}</Text>
                            <Text style={styles.greyText}>{arrivalDate2}</Text>
                        </View>
                    </View>
                    <View>
                        <View style={{marginBottom: 16}}>
                            <Text style={[styles.mainText, {fontSize: 13}]}>{arrivalCity1}</Text>
                            <Text style={styles.greyText}>{arrivalAirport1}</Text>
                        </View>
                        <View>
                            <Text style={[styles.mainText, {fontSize: 13}]}>{arrivalCity2}</Text>
                            <Text style={styles.greyText}>{arrivalAirport2}</Text>
                        </View>
                    </View>
                </View>
                <View style={[styles.chooseBtnWrap, btnShown ? {display: 'flex'} : {display: 'none'}]}>
                    <FavoriteIcon color='white' stroke='black'/>
                    <TouchableOpacity style={styles.chooseBtn} activeOpacity={0.8}>
                        <Text style={styles.btnText}>Choose</Text>
                    </TouchableOpacity>
                </View>
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
        color: '#B3B3B3',
        maxWidth: 130
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
        fontFamily: 'Montserrat-Bold',
        color: 'white',
        textAlign: 'center'
    },
    flightsCard: {
        backgroundColor: 'white',
        paddingVertical: 18,
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 20
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
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: '#207FBF'
    },
    chooseBtnWrap: {
        gap: 10,
        alignItems: 'flex-end',
        justifyContent: 'flex-end'
    },
    transferBlock: {
        backgroundColor: '#e7e7e7',
        paddingHorizontal: 24,
        paddingVertical: 16,
        marginBottom: 16
    }
});