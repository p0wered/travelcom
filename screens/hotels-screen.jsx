import {
    FlatList,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import ArrowActive from "../components/icons/arrow-icon-active";
import {StarIcon} from "../components/icons/star-icon";
import {useState} from "react";
import {SearchIcon} from "../components/icons/search-icon";
import {FilterIcon} from "../components/icons/filter-icon";
import {FavoriteIcon} from "../components/icons/favorite-icon";
import {Footer} from "../components/footer";

const roomsSources = [
    require('../assets/hotels/room-image.png'),
    require('../assets/hotels/room-image-2.png'),
    require('../assets/hotels/room-image-3.png'),
    require('../assets/hotels/room-image-4.png'),
    require('../assets/hotels/room-image-5.png'),
    require('../assets/hotels/room-image-6.png'),
    require('../assets/hotels/room-image-7.png'),
    require('../assets/hotels/room-image-8.png'),
    require('../assets/hotels/room-image-9.png'),
]

export default function HotelsScreen() {
    return(
        <ScrollView>
            <View style={styles.hotelsInputForm}>
                <TextInput
                    style={styles.locationInput}
                    placeholder='Location'
                    placeholderTextColor='#C4E7FA'
                />
                <View style={styles.selector}>
                    <Pressable style={{marginVertical: 7}}>
                        <Text style={styles.selectorText}>2/03/24</Text>
                    </Pressable>
                    <Text style={{fontFamily: 'Montserrat-Regular'}}>6 nights</Text>
                    <Pressable style={{marginVertical: 7}}>
                        <Text style={styles.selectorText}>16/04/24</Text>
                    </Pressable>
                </View>
                <Pressable style={styles.selector}>
                    <Text style={styles.selectorText}>1 room, 1 adults, 1 children</Text>
                    <ArrowActive color='#207FBF'/>
                </Pressable>
                <View style={styles.starsList}>
                    <Text style={styles.regularText}>Number of stars</Text>
                    <StarCheck num={2}/>
                    <StarCheck num={3}/>
                    <StarCheck num={4}/>
                    <StarCheck num={5}/>
                </View>
                <View style={styles.flexCenter}>
                    <TouchableOpacity activeOpacity={0.8} style={[styles.searchBtn, styles.flexCenter]}>
                        <View style={[styles.flexCenter, {gap: 4}]}>
                            <SearchIcon/>
                            <Text style={styles.btnText}>Search</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.hotelsList}>
                <Pressable style={{marginTop: 10, marginBottom: 8}}>
                    <FilterIcon/>
                </Pressable>
                <RoomsList/>
                <TouchableOpacity activeOpacity={0.8} style={[styles.detailsBtn, {paddingVertical: 18}]}>
                    <Text style={styles.btnText}>Show more</Text>
                </TouchableOpacity>
            </View>
            <Footer/>
        </ScrollView>
    )
}

function StarCheck({num}) {
    const [checked, setChecked] = useState(false);
    const color = checked ? 'white' : '#207FBF';
    const bgColor = checked ? '#207FBF' : 'white';

    function handleClick() {
        setChecked(!checked);
    }

    return (
        <Pressable onPress={handleClick}
            style={[
                styles.starItem,
                styles.flexCenter,
                {backgroundColor: bgColor}
            ]}
        >
            <Text style={[styles.starText, {color}]}>{num}</Text>
            <StarIcon color='white' stroke={color}/>
        </Pressable>
    )
}

function RoomItem({image, price, name, hotelStars, fromCenter, reviewsScore, reviewsAmount}){
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
                    <FavoriteIcon/>
                </Pressable>
                <View style={styles.priceMerger}>
                    <Text style={styles.smallText}>from</Text>
                    <Text style={styles.priceText}>{price}€</Text>
                </View>
            </View>
            <View style={styles.infoMerger}>
                <Text style={styles.hotelName}>{name} ★{hotelStars}</Text>
                <Text style={[styles.smallText, {color: 'black'}]}>{fromCenter} km from the center</Text>
            </View>
            <View style={styles.infoMerger}>
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

function RoomsList() {
    const renderRoomItem = ({item}) =>
        <RoomItem
            image={item}
            name='Holiday Inn Paris — Gare de Lyon Bastille, an IHG Hotel'
            price='2000'
            fromCenter='4.4'
            reviewsScore='4.8'
            reviewsAmount='29'
            hotelStars='4'
        />;

    return (
        <View>
            <FlatList
                data={roomsSources}
                renderItem={renderRoomItem}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
};

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
    hotelsInputForm : {
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
    starItem: {
        paddingVertical: 2,
        paddingHorizontal: 8,
        borderWidth: 1,
        borderColor: '#207FBF',
        borderRadius: 5,
        gap: 4
    },
    starText: {
        fontSize: 16,
        fontFamily: 'Montserrat-Bold',
        color: '#207FBF'
    },
    starsList: {
        margin: 'auto',
        display: "flex",
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 9,
        flexWrap: "wrap"
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
    hotelsList: {
        padding: 15,
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
    },
    image: {
        width: '100%',
        height: undefined,
        borderRadius: 10,
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
      display: 'flex',

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