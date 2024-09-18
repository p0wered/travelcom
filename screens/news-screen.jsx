import {ScrollView, Text, View, StyleSheet, ActivityIndicator} from "react-native";
import {BlogItem} from "../components/blog-item";
import {Footer} from "../components/footer";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {decode} from "html-entities";

export default function NewsScreen({navigation}) {
    const [loading, setLoading] = useState(true);
    const [news, setNews] = useState([]);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://travelcom.online/api/news/get-for-main-page');
            setNews(response.data);
        } catch (error) {
            console.error('Error fetching news:', error);
        }
        setLoading(false);
    };

    const processText = (html) => {
        let processedText = decode(html);
        processedText = processedText.replace(/<[^>]+>/g, ' ').replace(/\n/g, ' ');
        processedText = processedText.replace(/\s+/g, ' ').trim();
        return processedText;
    };

    const formatDesc = (item) => {
        const processedText = processText(item.text);
        if (processedText.length > 100) {
            return processedText.slice(0, 100) + '...';
        } else {
            return processedText;
        }
    }

    const firstGroup = news.slice(0, 4);
    const secondGroup = news.slice(4, 8);
    const thirdGroup = news.slice(8, 12);
    const fourthGroup = news.slice(12, 16);

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#207FBF" />
            </View>
        );
    }

    return(
        <ScrollView style={{backgroundColor: 'white'}}>
            <View style={styles.blogFlexbox}>
                <View style={{display: 'flex', alignItems: 'center'}}>
                    <View>
                        <Text style={[styles.mainText, {color: 'white', marginTop: 18}]}>A BLOG FOR INSPIRATION</Text>
                    </View>
                </View>
                {[firstGroup, secondGroup, thirdGroup, fourthGroup].map((group, groupIndex) => (
                    group.length > 0 && (
                        <ScrollView
                            key={groupIndex}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            style={
                                [
                                    {paddingTop: 18, paddingBottom: 18},
                                    groupIndex % 2 === 1 ? {backgroundColor: 'white'} : {backgroundColor: '#207FBF'}
                                ]}
                        >
                            {group.map((item) => (
                                <BlogItem
                                    key={item.id}
                                    item={item}
                                    small={groupIndex % 2 === 1}
                                    title={processText(item.name).toUpperCase()}
                                    desc={formatDesc(item)}
                                    date={new Date(item.created_at).toLocaleDateString()}
                                    textColor={groupIndex % 2 === 1 ? 'black' : 'white'}
                                    img={{uri: item.cover}}
                                    navigation={navigation}
                                />
                            ))}
                            <View style={{width: 12, height: 12}}/>
                        </ScrollView>
                    )
                ))}
            </View>
            <Footer/>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    titleText: {
        textAlign: 'center',
        color: 'white',
        paddingVertical: 25,
        paddingHorizontal: 15
    },
    mainText: {
        fontSize: 15,
        fontFamily: 'Montserrat-Bold'
    },
    blogFlexbox: {
        position: 'relative',
        backgroundColor: '#207FBF',
        display: 'flex',
        flexDirection: 'column',
    },
    blogBtn: {
        position: 'absolute',
        backgroundColor: 'white',
        top: -36,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})
