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
import {RoomItem} from "../components/room-item";

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
                scrollEnabled={false}
                data={roomsSources}
                renderItem={renderRoomItem}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
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
    detailsBtn: {
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
    }
});