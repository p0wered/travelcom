import {Text, TouchableOpacity, View} from "react-native";
import {FavoriteIcon} from "../components/icons/favorite-icon";
import Logo from "../components/icons/logo";

export default function AboutScreen() {
    return(
        <View>
            <View style={styles.chatMerger}>
                <View style={styles.logoCircle}>
                    <Logo color='white' width={42} height={42}/>
                </View>
                <Text style={styles.mainText}>Chat with a Travelcom manager</Text>
            </View>
        </View>
    )
}