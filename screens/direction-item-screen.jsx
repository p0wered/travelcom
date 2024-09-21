import {Image, ScrollView, StyleSheet, Text, useWindowDimensions, View} from "react-native";
import {Footer} from "../components/footer";
import {decode} from "html-entities";
import RenderHtml from "react-native-render-html";

export function DirectionItemScreen({route}) {
    const {item} = route.params;
    const {width} = useWindowDimensions();

    const processHtml = (html) => {
        let processedHtml = decode(html);
        processedHtml = processedHtml.replace(/\n/g, '<br>');
        processedHtml = processedHtml.split('<br>').map(part => {
            part = part.trim();
            if (part && !part.startsWith('<p>') && !part.endsWith('</p>')) {
                return `<p>${part}</p>`;
            }
            return part;
        }).join('');
        processedHtml = processedHtml.replace(/<p>\s*<\/p>/g, '');
        return processedHtml;
    };

    const processedContent = processHtml(item.text);
    const imagesArray = JSON.parse(item.images || '[]');

    return (
        <ScrollView style={{backgroundColor: 'white'}}>
            <View style={styles.newsContainer}>
                <View style={{paddingHorizontal: 10}}>
                    <View style={styles.image}>
                        <Image
                            source={{uri: item.mainImage}}
                            style={{width: '100%', height: 222, borderRadius: 10}}
                        />
                    </View>
                </View>
                <View style={{flexDirection: 'column', paddingHorizontal: 15}}>
                    <Text style={styles.titleText}>{decode(item.name)}</Text>
                </View>
                <View style={{paddingHorizontal: 15}}>
                    <RenderHtml
                        contentWidth={width}
                        source={{html: processedContent}}
                        tagsStyles={{
                            p: { ...styles.regularText, marginTop: 0, marginBottom: 6}
                        }}
                    />
                </View>

                {imagesArray.length > 0 && (
                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        style={styles.imageScroll}
                    >
                        {imagesArray.map((image, index) => (
                            <Image
                                key={index}
                                source={{uri: image}}
                                style={styles.scrollImage}
                            />
                        ))}
                        <View style={{width: 12, height: '100%'}}/>
                    </ScrollView>
                )}
            </View>
            <Footer color='white'/>
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: 222,
        borderRadius: 10,
        overflow: "hidden",
        position: 'relative'
    },
    scrollImage: {
        height: 200,
        width: 300,
        marginLeft: 12,
        borderRadius: 10
    },
    newsContainer: {
        flexDirection: 'column',
        gap: 15
    },
    regularText: {
        fontSize: 14,
        fontFamily: 'Montserrat-Regular'
    },
    titleText: {
        fontSize: 24,
        marginBottom: -10,
        fontFamily: 'Montserrat-Bold',
        textTransform: 'uppercase'
    },
})
