import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import airlinesImg from "../assets/airlines.png";
import {CheckIcon} from "./icons/check-icon";
import {FavoriteIcon} from "./icons/favorite-icon";
import {TransferIcon} from "./icons/transfer-icon";

export function FlightCard(){
    return(
        <View style={styles.flightsCard}>
            <View style={[styles.cardBlock, {marginBottom: 16}]}>
                <View>
                    <View style={{marginBottom: 10}}>
                        <Text style={styles.mainText}>London - Paris</Text>
                        <Text style={styles.greyText}>5 h, 10 min on the way</Text>
                    </View>
                    <View style={styles.textMerger}>
                        <Image style={styles.airlinesImg} source={airlinesImg}/>
                        <Text style={styles.smallText}>Aegean Airlines</Text>
                    </View>
                </View>
                <View>
                    <Text style={styles.largeText}>200 €</Text>
                    <View style={styles.textMerger}>
                        <Text style={styles.smallText}>Baggage</Text>
                        <Text style={styles.smallTextBlue}>+50€</Text>
                        <CheckIcon/>
                    </View>
                </View>
            </View>
            <View style={styles.cardBlock}>
                <View style={{display: 'flex', flexDirection: 'row'}}>
                    <View style={{marginRight: 26}}>
                        <View style={{marginBottom: 16}}>
                            <Text style={[styles.mainText, {fontSize: 13}]}>11:10</Text>
                            <Text style={styles.greyText}>2/03/24</Text>
                        </View>
                        <View>
                            <Text style={[styles.mainText, {fontSize: 13}]}>13:15</Text>
                            <Text style={styles.greyText}>2/03/24</Text>
                        </View>
                    </View>
                    <View>
                        <View style={{marginBottom: 16}}>
                            <Text style={[styles.mainText, {fontSize: 13}]}>London</Text>
                            <Text style={styles.greyText}>Luton Airport, LTN </Text>
                        </View>
                        <View>
                            <Text style={[styles.mainText, {fontSize: 13}]}>London</Text>
                            <Text style={styles.greyText}>Luton Airport, LTN </Text>
                        </View>
                    </View>
                </View>
                <View style={styles.chooseBtnWrap}>
                    <FavoriteIcon color='white' stroke='black'/>
                    <TouchableOpacity style={styles.chooseBtn} activeOpacity={0.8}>
                        <Text style={styles.btnText}>Choose</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export function TransferFlightCard(){
    return(
        <View style={styles.flightsCard}>
            <View style={[styles.cardBlock, {marginBottom: 16}]}>
                <View>
                    <View style={{marginBottom: 10}}>
                        <Text style={styles.mainText}>London - Paris</Text>
                        <Text style={styles.greyText}>5 h, 10 min on the way</Text>
                    </View>
                    <View style={[styles.textMerger, {marginBottom: 8}]}>
                        <Image style={styles.airlinesImg} source={airlinesImg}/>
                        <Text style={styles.smallText}>Aegean Airlines</Text>
                    </View>
                    <View style={styles.textMerger}>
                        <Image style={styles.airlinesImg} source={airlinesImg}/>
                        <Text style={styles.smallText}>Aegean Airlines</Text>
                    </View>
                </View>
                <View>
                    <Text style={styles.largeText}>200 €</Text>
                    <View style={styles.textMerger}>
                        <Text style={styles.smallText}>Baggage</Text>
                        <Text style={styles.smallTextBlue}>+50€</Text>
                        <CheckIcon/>
                    </View>
                </View>
            </View>
            <View style={[styles.cardBlock, {marginBottom: 16}]}>
                <View style={{display: 'flex', flexDirection: 'row'}}>
                    <View style={{marginRight: 26}}>
                        <View style={{marginBottom: 16}}>
                            <Text style={[styles.mainText, {fontSize: 13}]}>11:10</Text>
                            <Text style={styles.greyText}>2/03/24</Text>
                        </View>
                        <View>
                            <Text style={[styles.mainText, {fontSize: 13}]}>13:15</Text>
                            <Text style={styles.greyText}>2/03/24</Text>
                        </View>
                    </View>
                    <View>
                        <View style={{marginBottom: 16}}>
                            <Text style={[styles.mainText, {fontSize: 13}]}>London</Text>
                            <Text style={styles.greyText}>Luton Airport, LTN </Text>
                        </View>
                        <View>
                            <Text style={[styles.mainText, {fontSize: 13}]}>London</Text>
                            <Text style={styles.greyText}>Luton Airport, LTN </Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={[styles.textMerger, styles.transferBlock]}>
                <TransferIcon/>
                <View>
                    <Text style={styles.smallText}>Transfer to Barcelona</Text>
                    <Text style={styles.greyText}>1 h, 10 min</Text>
                </View>
            </View>
            <View style={styles.cardBlock}>
                <View style={{display: 'flex', flexDirection: 'row'}}>
                    <View style={{marginRight: 26}}>
                        <View style={{marginBottom: 16}}>
                            <Text style={[styles.mainText, {fontSize: 13}]}>11:10</Text>
                            <Text style={styles.greyText}>2/03/24</Text>
                        </View>
                        <View>
                            <Text style={[styles.mainText, {fontSize: 13}]}>19:30</Text>
                            <Text style={styles.greyText}>2/03/24</Text>
                        </View>
                    </View>
                    <View>
                        <View style={{marginBottom: 16}}>
                            <Text style={[styles.mainText, {fontSize: 13}]}>London</Text>
                            <Text style={styles.greyText}>Luton Airport, LTN </Text>
                        </View>
                        <View>
                            <Text style={[styles.mainText, {fontSize: 13}]}>Barcelona</Text>
                            <Text style={styles.greyText}>Roissy-Charles-de-Gaulle, CDG  </Text>
                        </View>
                    </View>
                </View>
                <View style={styles.chooseBtnWrap}>
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
        paddingVertical: 24,
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
        paddingHorizontal: 24
    },
    chooseBtn: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: '#207FBF'
    },
    chooseBtnWrap: {
        display: 'flex',
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