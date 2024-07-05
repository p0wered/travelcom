import {Image, Pressable, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {FavoriteIcon} from "./icons/favorite-icon";

export function RoomItem({image, price, name, hotelStars, fromCenter, reviewsScore, reviewsAmount}){
    const parseScore = (score) => {
        return parseFloat(score.toString().replace(',', '.'));
    }
    const score = parseScore(reviewsScore);

    let circleColor;
    if (score >= 4) {
        circleColor = '#42ac41';
    } else if (score < 4 && score >= 3) {
        circleColor = '#ffc400';
    } else {
        circleColor = '#b90d0d';
    }

    return(
        <View style={styles.roomItem}>
            <View style={styles.imageWrap}>
                <Image source={image} style={styles.image}/>
                <Pressable style={styles.iconPos}>
                    <FavoriteIcon color='white' stroke='black'/>
                </Pressable>
                <View style={styles.priceMerger}>
                    <Text style={styles.smallText}>from</Text>
                    <Text style={styles.priceText}>{price}€</Text>
                </View>
            </View>
            <View style={[styles.infoMerger, {marginTop: 8}]}>
                <Text style={styles.hotelName}>{name} ★{hotelStars}</Text>
                <Text style={[styles.smallText, {color: 'black'}]}>{fromCenter} km from the center</Text>
            </View>
            <View style={[styles.infoMerger, {marginBottom: 8}]}>
                <View style={[styles.flexCenter, {gap: 10}]}>
                    <View style={[styles.scoreCircle, {backgroundColor: circleColor}]}>
                        <Text style={styles.mainText}>{reviewsScore}</Text>
                    </View>
                    <Text style={[styles.mainText, {color: 'black'}]}>{reviewsAmount} reviews</Text>
                </View>
                <TouchableOpacity activeOpacity={0.8} style={styles.detailsBtn}>
                    <Text style={styles.btnText}>More detailed</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainText: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 14,
        color: 'white'
    },
    regularText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 14,
        color: 'black'
    },
    smallText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 11,
        color: 'white',
        marginBottom: 3
    },
    flexCenter: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnText: {
        fontFamily: 'Montserrat-Bold',
        color: 'white',
        textAlign: 'center'
    },
    roomItem: {
        width: '100%',
        display: "flex",
        flexDirection: "column",
        justifyContent: 'space-between',
        backgroundColor: 'white',
        overflow: "hidden",
        borderRadius: 10,
        marginBottom: 20
    },
    imageWrap: {
        position: 'relative',
        width: '100%',
        padding: 5
    },
    image: {
        width: '100%',
        height: undefined,
        borderRadius: 8,
        aspectRatio: 4/3,
    },
    priceMerger: {
        position: 'absolute',
        bottom: 0,
        margin: 12,
        display: 'flex',
        flexDirection: 'row',
        alignItems: "flex-end",
        gap: 5
    },
    priceText: {
        fontSize: 20,
        fontFamily: 'Montserrat-Bold',
        color: 'white'
    },
    iconPos: {
        position: 'absolute',
        margin: 12,
        right: 0
    },
    infoMerger: {
        display: 'flex',
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 16,
        paddingHorizontal: 18,
        paddingVertical: 10
    },
    hotelName: {
        fontFamily: 'Montserrat-Bold',
        maxWidth: 150
    },
    hotelNameMerger: {
        display: 'flex'
    },
    detailsBtn: {
        padding: 12,
        borderRadius: 10,
        backgroundColor: '#207FBF',
    },
    scoreCircle: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 30,
        height: 30,
        borderRadius: 100
    }
});