import {Button, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import ArrowActive from "../components/icons/arrow-icon-active";
import {SearchIcon} from "../components/icons/search-icon";
import {FilterIcon} from "../components/icons/filter-icon";
import {CheckIcon} from "../components/icons/check-icon";
import {FavoriteIcon} from "../components/icons/favorite-icon";
import {Footer} from "../components/footer";
import {TransferIcon} from "../components/icons/transfer-icon";
import {FlightCard, TransferFlightCard} from "../components/flight-cards";

const airlinesImg = require('../assets/airlines.png');

export default function FlightsScreen() {
    return(
        <ScrollView>
            <View style={styles.flightsInputForm}>
                <TextInput
                    style={styles.locationInput}
                    placeholder='From'
                    placeholderTextColor='#C4E7FA'
                />
                <TextInput
                    style={styles.locationInput}
                    placeholder='Where'
                    placeholderTextColor='#C4E7FA'
                />
                <View style={styles.selector}>
                    <Pressable style={{marginVertical: 7}}>
                        <Text style={styles.selectorText}>2/03/24</Text>
                    </Pressable>
                    <View style={styles.separator}/>
                    <Pressable style={{marginVertical: 7}}>
                        <Text style={styles.selectorText}>16/04/24</Text>
                    </Pressable>
                </View>
                <Pressable style={[styles.selector, {marginBottom: 10}]}>
                    <View>
                        <Text style={styles.selectorText}>1 passenger</Text>
                        <Text style={styles.selectorTextGrey}>Business class</Text>
                    </View>
                    <View style={{transform: 'rotate(-90deg)'}}>
                        <ArrowActive color='#207FBF'/>
                    </View>
                </Pressable>
                <View style={styles.flexCenter}>
                    <TouchableOpacity activeOpacity={0.8} style={[styles.searchBtn, styles.flexCenter]}>
                        <View style={[styles.flexCenter, {gap: 4}]}>
                            <SearchIcon/>
                            <Text style={styles.btnText}>Search</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.flightsList}>
                <Pressable style={{marginTop: 10, marginBottom: 8}}>
                    <FilterIcon/>
                </Pressable>
                <FlightCard/>
                <TransferFlightCard/>
                <FlightCard/>
                <TransferFlightCard/>
                <TouchableOpacity activeOpacity={0.8} style={[styles.showMoreBtn, {paddingVertical: 18}]}>
                    <Text style={styles.btnText}>Show more</Text>
                </TouchableOpacity>
            </View>
            <Footer/>
        </ScrollView>
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
    locationInput: {
        fontSize: 16,
        fontFamily: 'Montserrat-Bold',
        height: 64,
        paddingHorizontal: 25,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#207FBF',
        borderRadius: 10
    },
    selector: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        overflow: "hidden",
        justifyContent: 'space-between',
        height: 64,
        paddingHorizontal: 25,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#207FBF',
        borderRadius: 10
    },
    selectorText: {
        fontFamily: 'Montserrat-Bold',
        color: '#207FBF'
    },
    separator: {
        width: 86,
        height: 1,
        backgroundColor: '#207FBF'
    },
    selectorTextGrey: {
        fontSize: 11,
        fontFamily: 'Montserrat-Regular',
        color: '#9B9B9A'
    },
    searchBtn: {
        position: 'absolute',
        bottom: -38,
        width: 166,
        padding: 12,
        borderRadius: 10,
        backgroundColor: '#207FBF',
    },
    btnText: {
        fontFamily: 'Montserrat-Bold',
        color: 'white',
        textAlign: 'center'
    },
    flightsList: {
        padding: 15,
    },
    showMoreBtn: {
        padding: 12,
        borderRadius: 10,
        backgroundColor: '#207FBF',
    },
});