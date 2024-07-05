import {View, StyleSheet, Text, TouchableOpacity} from "react-native";
import {CheckIcon} from "./icons/check-icon";
import {CartIcon} from "./icons/cart-icon";
import {BedIcon} from "./icons/bed-icon";
import {PersonIcon} from "./icons/person-icon";
import {WifiIcon} from "./icons/wifi-icon";
import {ConditionerIcon} from "./icons/conditioner-icon";
import {BathIcon} from "./icons/bath-icon";

export default function BookedRoomItem(){
    return(
        <View style={styles.bookedRoom}>
            <View style={styles.mergerBlock}>
                <View style={{gap: 6}}>
                    <Text style={styles.mainText}>Double Room Standard</Text>
                    <Text style={styles.smGreyText}>6 nights, 2 adults, 1 child</Text>
                </View>
                <Text style={styles.price}>2000€</Text>
            </View>
            <View style={styles.merger}>
                <CheckIcon width={24} height={24} color='#42ac41'/>
                <Text style={styles.smText}>Breakfast</Text>
            </View>
            <View style={styles.merger}>
                <CheckIcon width={24} height={24} color='#42ac41'/>
                <Text style={styles.smText}>Free cancellation until Feb 28th</Text>
            </View>
            <View style={[styles.mergerBlock, {gap: 8}]}>
                <View>
                    <CartIcon/>
                </View>
                <View style={{width: '85%'}}>
                    <TouchableOpacity style={styles.chooseBtn} activeOpacity={0.8}>
                        <Text style={styles.btnText}>Buy</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.merger}>
                <View style={styles.merger}>
                    <BedIcon/>
                    <Text style={styles.smText}>Double bed</Text>
                </View>
                <View style={styles.merger}>
                    <View style={[styles.merger, {gap: 0}]}>
                        <PersonIcon/>
                        <Text style={styles.smBlueText}>+2</Text>
                    </View>
                    <Text style={styles.smText}>Up to 3 people</Text>
                </View>
            </View>
            <View style={styles.separator}/>
            <View style={styles.merger}>
                <WifiIcon/>
                <Text style={styles.smText}>Free Wi-Fi</Text>
            </View>
            <View style={styles.merger}>
                <ConditionerIcon/>
                <Text style={styles.smText}>Conditioner</Text>
            </View>
            <View style={styles.merger}>
                <BathIcon/>
                <Text style={styles.smText}>Own bathroom</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    bookedRoom: {
        position: 'relative',
        borderRadius: 10,
        backgroundColor: 'white',
        padding: 18,
        display: "flex",
        flexDirection: 'column',
        gap: 12,
        overflow: 'hidden'
    },
    mainText: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 15,
        color: 'black'
    },
    price: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 24,
        marginBottom: 5,
        textAlign: 'right'
    },
    smText: {
        fontSize: 12,
        fontFamily: 'Montserrat-Regular'
    },
    smGreyText: {
        fontSize: 11,
        fontFamily: 'Montserrat-Regular',
        color: 'grey',
        textAlign: 'left'
    },
    smBlueText: {
        fontSize: 11,
        fontFamily: 'Montserrat-Bold',
        color: '#207FBF',
        textAlign: 'left'
    },
    merger: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12
    },
    mergerBlock: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    btnText: {
        fontFamily: 'Montserrat-Bold',
        color: 'white',
        textAlign: 'center'
    },
    chooseBtn: {
        paddingHorizontal: 18,
        paddingVertical: 8,
        borderRadius: 10,
        backgroundColor: '#207FBF'
    },
    separator: {
        height: 1,
        backgroundColor: '#cecece'
    }
})