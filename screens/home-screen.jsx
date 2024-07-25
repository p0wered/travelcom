import {
    FlatList,
    Image,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text, TouchableOpacity,
    View
} from "react-native";
import {Footer} from "../components/footer";
import {BlogItem} from "../components/blog-item";
import {generateAccordionItems} from "../components/accordion-list";
import {QuestionForm} from "../components/question-form";
import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigation} from "@react-navigation/native";
import {decode} from "html-entities";

export default function HomeScreen() {
    const navigation = useNavigation();
    const faqTitles = [
        'How does Travelcom work?',
        'How do you I find and buy air tickets?',
        'How do I book a ticket?',
        'How can I call you?',
        'How do the website and the app work?',
        'I`m afraid of scammers. Am I sure I won`t be tricked with a ticket?',
        'How do I subscribe to the news?'
    ];
    const accordionItems = generateAccordionItems(faqTitles);

    return (
        <ScrollView style={{flex: 1}}>
            <ImageBackground source={require('../assets/main-image.jpg')} style={{width: '100%', height: 620}}>
                <View style={styles.offerTravel}>
                    <View style={styles.offerTitle}>
                        <Text style={styles.offerTitleText}>Knows what you need</Text>
                    </View>
                    <View style={styles.seleneForm}>
                        <Text style={styles.formText}>
                            For travel arrangements, questions about locations and details,
                            you can write in the chat and our managers will help
                        </Text>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={[styles.formBtn, styles.mainBtn]}
                            onPress={() => navigation.navigate('Chat')}
                        >
                            <Text style={styles.mainText}>Go to the chat</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
            <DirectionsList navigation={navigation}/>
            <BlogList navigation={navigation}/>
            <View style={styles.faqFlexbox}>
                <Text style={styles.faqText}>FAQ</Text>
                {accordionItems}
            </View>
            <QuestionForm title='Any other question? Write to us!'/>
            <Footer color='white'/>
        </ScrollView>
    )
}

function DirectionItem({item}) {
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={styles.directionItem}
            onPress={() => navigation.navigate('DirectionItem', { item })}
        >
            <Image source={{uri: `https://travelcom.online/storage/${item.mainImage}`}} style={{width: '100%', height: 222, padding: 15}}/>
            <View style={styles.directionInner}>
                <Text style={[styles.mainText, {textTransform: 'uppercase'}]}>
                    {item.name}⠀
                </Text>
                <Image source={{uri: `https://travelcom.online/storage/${item.icon}`}} style={{width: 20, height: 20}}/>
            </View>
        </TouchableOpacity>
    )
}

function DirectionsList({navigation}) {
    const [directions, setDirections] = useState([]);

    useEffect(() => {
        fetchDirections();
    }, []);

    const fetchDirections = async () => {
        try {
            const response = await axios.get('https://travelcom.online/api/country/get-for-main-page');
            setDirections(response.data);
        } catch (error) {
            console.error('Error fetching directions:', error);
        }
    };

    return (
        <View style={styles.directionFlexbox}>
            <View style={{display: 'flex', alignItems: 'center'}}>
                <View style={styles.directionTitle}>
                    <Text style={[styles.mainText, {textAlign: 'center'}]}>TRENDING DIRECTIONS</Text>
                </View>
            </View>
            <FlatList
                scrollEnabled={false}
                data={directions}
                renderItem={({ item }) => <DirectionItem item={item} />}
                keyExtractor={item => item.id.toString()}
            />
            <TouchableOpacity activeOpacity={0.8} style={styles.mainBtn} onPress={() => navigation.navigate('News')}>
                <Text style={[styles.mainText, {width: 140, textAlign: 'center'}]}>Know more</Text>
            </TouchableOpacity>
        </View>
    );
}

function BlogList({navigation}) {
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

    return (
        <View style={styles.blogFlexbox}>
            <View style={{display: 'flex', alignItems: 'center'}}>
                <View style={[styles.mainBtn, styles.blogBtn]}>
                    <Text style={[styles.mainText, {color: '#207FBF'}]}>A BLOG FOR INSPIRATION</Text>
                </View>
            </View>
            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={{marginBottom: 18 , marginTop: 24}}
            >
                {news.map((item) => (
                    <BlogItem
                        key={item.id}
                        item={item}
                        title={processText(item.name).toUpperCase()}
                        desc={processText(item.text).slice(0, 100) + '...'}
                        date={new Date(item.created_at).toLocaleDateString()}
                        textColor='white'
                        img={{ uri: `https://travelcom.online/storage/${item.mainImage}` }}
                        navigation={navigation}
                    />
                ))}
            </ScrollView>
            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={{marginBottom: 18 , marginTop: 24}}
            >
                {news.map((item) => (
                    <BlogItem
                        key={item.id}
                        item={item}
                        title={processText(item.name).toUpperCase()}
                        desc={processText(item.text).slice(0, 100) + '...'}
                        date={new Date(item.created_at).toLocaleDateString()}
                        textColor='white'
                        img={{ uri: `https://travelcom.online/storage/${item.mainImage}` }}
                        navigation={navigation}
                    />
                ))}
            </ScrollView>
            <View style={{display: 'flex', alignItems: 'center', paddingHorizontal: 10}}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={[styles.mainBtn, {backgroundColor: 'white', width: '100%'}]}
                    onPress={() => navigation.navigate('News')}
                >
                    <Text style={[styles.mainText, {color: '#207FBF', textAlign: 'center'}]}>Know more</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainText: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 14,
        color: 'white'
    },
    offerTravel: {
        paddingTop: 20,
    },
    offerTitle: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
    },
    offerTitleText: {
        fontFamily: 'Montserrat-Bold',
        color: 'white',
        textAlign: 'center',
        fontSize: 32,
        width: 200,
        height: 117,
        textTransform: 'uppercase'
    },
    seleneForm: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingTop: 17,
        paddingLeft: 14,
        paddingRight: 14,
        paddingBottom: 45
    },
    formText: {
        fontSize: 20,
        fontFamily: 'Montserrat-Regular',
        marginTop: 70,
        marginBottom: 70,
        textAlign: 'center',
    },
    mainBtn: {
        padding: 15,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: '#207FBF',
    },
    formBtn: {
        bottom: -22,
        position: 'absolute',
    },
    directionTitle: {
        position: 'absolute',
        width: 200,
        top: -55,
        height: 100,
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 20,
        paddingBottom: 20,
        borderRadius: 10,
        backgroundColor: '#207FBF'
    },
    directionItem: {
        width: '100%',
        height: 222,
        borderRadius: 10,
        overflow: "hidden",
        marginBottom: 15,
        position: 'relative'
    },
    directionInner: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        top: 12,
        left: 12
    },
    directionFlexbox: {
        width: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        padding: 14,
        marginBottom: 50,
    },
    blogFlexbox: {
        position: 'relative',
        backgroundColor: '#207FBF',
        display: 'flex',
        flexDirection: 'column',
        paddingVertical: 14,
    },
    blogBtn: {
        position: 'absolute',
        backgroundColor: 'white',
        top: -36,
    },
    faqText: {
        fontFamily: 'Montserrat-Bold',
        marginBottom: 15,
        fontSize: 30,
        color: '#207FBF',
        textAlign: 'center'
    },
    faqFlexbox: {
        padding: 14
    },
    accordionItem: {
        height: 51,
        borderWidth: 1,
        borderColor: '#207FBF',
        borderRadius: 10,
        marginBottom: 12
    },
    accordionItemActive: {
        height: 'auto',
        backgroundColor: '#207FBF',
    },
    accordionInner: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: 15
    },
    separatorAccordion: {
        width: '100%',
        height: 1,
        backgroundColor: 'white'
    },
    arrowContainer: {
        position: 'relative',
        width: 15,
        height: 15,
    },
    arrowWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
    }
});