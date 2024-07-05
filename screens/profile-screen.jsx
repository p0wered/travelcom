import {Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {AvatarIcon} from "../components/icons/avatar-icon";
import {EditProfileIcon} from "../components/icons/edit-profile-icon";
import {OrdersIcon} from "../components/icons/orders-icon";
import {ShoppingCart} from "../components/icons/shopping-cart";
import {FavoriteIcon} from "../components/icons/favorite-icon";
import {NotificationIcon} from "../components/icons/notification-icon";
import ExitIcon from "../components/icons/exit-icon";
import {Footer} from "../components/footer";
import {useNavigation} from "@react-navigation/native";

export default function ProfileScreen({navigation}) {
    const navigate = useNavigation();

    return(
        <ScrollView>
            <View style={styles.profileBlock}>
                <View style={[styles.merger, styles.nameBlock]}>
                    <View style={styles.merger}>
                        <AvatarIcon/>
                        <Text style={styles.mainText}>John Snow</Text>
                    </View>
                    <Pressable style={{padding: 10}}>
                        <EditProfileIcon/>
                    </Pressable>
                </View>
                <View style={{marginBottom: 18}}>
                    <Text style={styles.smallText}>Email</Text>
                    <Text style={styles.regularText}>johnsnow@mail.ru</Text>
                </View>
                <View style={{marginBottom: 12}}>
                    <Text style={styles.smallText}>Phone number</Text>
                    <Text style={styles.regularText}>+456 405 82 58</Text>
                </View>
            </View>
            <View style={{padding: 15}}>
                <View style={styles.profileMenu}>
                    <TouchableOpacity
                        style={styles.menuButton}
                        activeOpacity={0.6}
                        onPress={() => navigation.navigate('Orders')}
                    >
                        <OrdersIcon/>
                        <Text style={styles.mediumText}>Orders</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.menuButton}
                        activeOpacity={0.6}
                        onPress={() => navigation.navigate('Cart')}
                    >
                        <ShoppingCart/>
                        <Text style={styles.mediumText}>Shopping Cart</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.menuButton}
                        activeOpacity={0.6}
                        onPress={() => navigation.navigate('Favourites')}
                    >
                        <View style={styles.favouriteIcon}>
                            <FavoriteIcon color='#207FBF' stroke='#207FBF'/>
                        </View>
                        <Text style={styles.mediumText}>Favourites</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.menuButton}
                        activeOpacity={0.6}
                        onPress={() => navigation.navigate('Notifications')}
                    >
                        <NotificationIcon/>
                        <Text style={styles.mediumText}>Notifications</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity activeOpacity={0.3} style={[styles.merger, {margin: 'auto', paddingVertical: 25}]}>
                    <Text style={styles.mainText}>Log out of profile</Text>
                    <ExitIcon/>
                </TouchableOpacity>
            </View>
            <Footer color='white'/>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    mainText: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 15,
        color: 'black'
    },
    regularText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 15,
        color: 'black'
    },
    mediumText: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 16,
        color: 'black'
    },
    smallText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 13,
        color: '#9B9B9A',
        marginBottom: 3
    },
    profileBlock: {
        padding: 15,
        backgroundColor: 'white',
        borderBottomStartRadius: 10,
        borderBottomEndRadius: 10
    },
    merger: {
        display: 'flex',
        flexDirection: "row",
        alignItems: 'center',
        gap: 16,
    },
    nameBlock: {
        justifyContent: 'space-between',
        marginBottom: 38
    },
    profileMenu: {
        borderRadius: 14,
        backgroundColor: 'white',
        padding: 15,
        display: 'flex',
        flexDirection: 'column',
        gap: 10
    },
    menuButton: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 11,
        paddingHorizontal: 20,
        backgroundColor: '#e8f2f8',
        borderRadius: 10,
        height: 52
    },
    favouriteIcon: {
        width: 30,
        height: 30,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
});