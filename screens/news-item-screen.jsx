import {Image, ScrollView, StyleSheet, Text, useWindowDimensions, View} from "react-native";
import {Footer} from "../components/footer";
import {decode} from "html-entities";
import RenderHtml from 'react-native-render-html';

export function NewsItemScreen({ route }) {
    const { newsItem } = route.params;
    const { width } = useWindowDimensions();

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

    const processedContent = processHtml(newsItem.text);
    const imagesArray = JSON.parse(newsItem.images || '[]');

    return (
        <ScrollView style={{backgroundColor: 'white'}}>
            <View style={styles.newsContainer}>
                <View style={styles.image}>
                    <Image
                        source={{ uri: `https://travelcom.online/storage/${newsItem.mainImage}` }}
                        style={{width: '100%', height: 222, borderRadius: 10}}
                    />
                </View>
                <View style={{flexDirection: 'column', gap: 8}}>
                    <Text style={styles.regularText}>
                        {new Date(newsItem.created_at).toLocaleDateString()}
                    </Text>
                    <Text style={styles.titleText}>{decode(newsItem.name)}</Text>
                </View>
                <RenderHtml
                    contentWidth={width}
                    source={{ html: processedContent }}
                    tagsStyles={{
                        p: { ...styles.regularText, marginBottom: 10 }
                    }}
                />

                {imagesArray.length > 0 && (
                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        style={styles.imageScroll}
                    >
                        {imagesArray.map((image, index) => (
                            <Image
                                key={index}
                                source={{ uri: `https://travelcom.online/storage/${image}` }}
                                style={styles.scrollImage}
                            />
                        ))}
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
    newsContainer: {
        padding: 15,
        flexDirection: 'column',
        gap: 15
    },
    regularText: {
        fontSize: 12,
        fontFamily: 'Montserrat-Regular'
    },
    titleText: {
        fontSize: 14,
        fontFamily: 'Montserrat-Bold',
        textTransform: 'uppercase'
    },
    imageScroll: {
        marginTop: 20,
        marginBottom: 20,
    },
    scrollImage: {
        width: 300,
        height: 200,
        borderRadius: 10,
        marginRight: 10,
    }
})