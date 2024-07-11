import {Image, Pressable, Text, View, StyleSheet, TouchableOpacity} from "react-native";

export function BlogItem({title, desc, date, img, small, textColor}){
    let imgHeight = small ? 188 : 276;

    return(
        <TouchableOpacity activeOpacity={0.5} style={{width: 300, overflow: 'hidden', marginLeft: 12}}>
            <Image source={img} style={[styles.blogImg, {height: imgHeight}]}/>
            <View style={{display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 16}}>
                <Text style={[styles.blogSmallText, {color: textColor}]}>{date}</Text>
                <Text style={[styles.mainText, {color: textColor}]} numberOfLines={2}>{title}</Text>
                <Text style={[styles.blogSmallText, {color: textColor}]} numberOfLines={2}>{desc}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    mainText: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 14,
        color: 'white'
    },
    blogSmallText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 11,
        color: 'white'
    },
    blogImg: {
        width: 300,
        borderRadius: 10
    },
})