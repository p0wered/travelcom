import {ScrollView, Text, View, StyleSheet} from "react-native";
import {BlogItem} from "../components/blog-item";
import {Footer} from "../components/footer";
import {useEffect, useState} from "react";
import axios from "axios";
import {decode} from "html-entities";

export default function NewsScreen({navigation}) {
    const [news, setNews] = useState([]);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const response = await axios.get('https://travelcom.online/api/news/get-for-main-page');
            setNews(response.data);
        } catch (error) {
            console.error('Error fetching news:', error);
        }
    };

    const processText = (html) => {
        let processedText = decode(html);
        processedText = processedText.replace(/<[^>]+>/g, ' ').replace(/\n/g, ' ');
        processedText = processedText.replace(/\s+/g, ' ').trim();
        return processedText;
    };

    const formatDesc = (item) => {
        if (item.text.length > 100) {
            return processText(item.text.slice(0,110) + '...')
        } else {
            return processText(item.text.slice(0,110))
        }
    }

    const firstGroup = news.slice(0, 4);
    const secondGroup = news.slice(4, 8);
    const thirdGroup = news.slice(8, 12);
    const fourthGroup = news.slice(12, 16);

    return(
        <ScrollView style={{backgroundColor: 'white'}}>
            <View style={styles.blogFlexbox}>
                <View style={{display: 'flex', alignItems: 'center'}}>
                    <View>
                        <Text style={[styles.mainText, {color: 'white'}]}>A BLOG FOR INSPIRATION</Text>
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
                                {marginBottom: 18 , marginTop: 24},
                                groupIndex === 0 ? {backgroundColor: '#207FBF'} : {backgroundColor: 'white'}
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
                                    textColor='white'
                                    img={{uri: `https://travelcom.online/storage/${item.mainImage}`}}
                                    navigation={navigation}
                                />
                            ))}
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
        paddingVertical: 14
    },
    blogBtn: {
        position: 'absolute',
        backgroundColor: 'white',
        top: -36,
    },
})