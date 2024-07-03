import {Image, Pressable, Text, View, StyleSheet} from "react-native";

export function BlogItem({title, desc, date, img, small, textColor}){
    let imgHeight = small ? 188 : 276;

    return(
        <Pressable style={{width: 300, overflow: 'hidden', marginLeft: 12}}>
            <Image source={img} style={[styles.blogImg, {height: imgHeight}]}/>
            <View style={{display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 16}}>
                <Text style={[styles.blogSmallText, {color: textColor}]}>{date}</Text>
                <Text style={[styles.mainText, {color: textColor}]}>{title}</Text>
                <Text style={[styles.blogSmallText, {color: textColor}]}>{desc}</Text>
            </View>
        </Pressable>
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