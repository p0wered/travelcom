import {Image, ScrollView, StyleSheet, Text, useWindowDimensions, View} from "react-native";
import {Footer} from "../components/footer";
import {decode} from "html-entities";
import RenderHtml from 'react-native-render-html';
import React from "react";

export function NewsItemScreen({ route }) {
    const {newsItem} = route.params;
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

    const processedContent = processHtml(newsItem.text);
    const imagesArray = JSON.parse(newsItem.images || '[]');

    return (
        <ScrollView style={{backgroundColor: 'white'}}>
            <View style={styles.newsContainer}>
                <View style={styles.image}>
                    <Image
                        source={{uri: newsItem.mainImage}}
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
                        p: { ...styles.regularText, marginBottom: 0}
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
                    <View style={{width: 12}}/>
                </ScrollView>
            )}
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
        flexDirection: 'column'
    },
    regularText: {
        fontSize: 14,
        fontFamily: 'Montserrat-Regular',
        marginTop: 15
    },
    titleText: {
        fontSize: 24,
        fontFamily: 'Montserrat-Bold',
        textTransform: 'uppercase'
    },
    imageScroll: {
        marginBottom: 20,
    },
    scrollImage: {
        width: 340,
        height: 220,
        borderRadius: 10,
        marginLeft: 10,
    }
})
