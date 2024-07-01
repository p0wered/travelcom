import {
    Animated,
    FlatList,
    Image,
    ImageBackground,
    LayoutAnimation,
    Pressable,
    ScrollView,
    StyleSheet,
    Text, TextInput, TouchableOpacity,
    View
} from "react-native";
import Arrow from "../components/icons/arrow-icon";
import {useEffect, useRef, useState} from "react";
import ArrowActive from "../components/icons/arrow-icon-active";
import {SendIcon} from "../components/icons/send-icon";
import {Footer} from "../components/footer";

export default function HomeScreen() {
    const directionSources = {
        'ROME': {
            bg: require('../assets/directions/image-1.png'),
            country: require('../assets/countries/rome.png'),
        },
        'PARIS': {
            bg: require('../assets/directions/image-2.png'),
            country: require('../assets/countries/paris.png'),
        },
        'LONDON': {
            bg: require('../assets/directions/image-3.png'),
            country: require('../assets/countries/london.png'),
        },
        'MALDIVES': {
            bg: require('../assets/directions/image-4.png'),
            country: require('../assets/countries/maldives.png'),
        },
        'BALI': {
            bg: require('../assets/directions/image-5.png'),
            country: require('../assets/countries/bali.png'),
        },
        'RIO DE JANEIRO': {
            bg: require('../assets/directions/image-6.png'),
            country: require('../assets/countries/rio.png'),
        },
    };
    const blogSources = [
        require('../assets/blog/blog-1.png'),
        require('../assets/blog/blog-2.png'),
        require('../assets/blog/blog-3.png'),
        require('../assets/blog/blog-4.png'),
    ];
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
                        <TouchableOpacity activeOpacity={0.8} style={[styles.formBtn, styles.mainBtn]}>
                            <Text style={styles.mainText}>Go to the chat</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
            <View style={styles.directionFlexbox}>
                <View style={styles.directionTitle}>
                    <Text style={[styles.mainText, {textAlign: 'center'}]}>TRENDING DIRECTIONS</Text>
                </View>
                <FlatList
                    data={Object.keys(directionSources)}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                        <DirectionItem title={item} list={directionSources} />
                    )}
                    contentContainerStyle={{gap: 20}}
                />
                <TouchableOpacity activeOpacity={0.8} style={styles.mainBtn}>
                    <Text style={[styles.mainText, {width: 140, textAlign: 'center'}]}>Know more</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.blogFlexbox}>
                <View style={{display: 'flex', alignItems: 'center'}}>
                    <Pressable style={[styles.mainBtn, styles.blogBtn]}>
                        <Text style={[styles.mainText, {color: '#207FBF'}]}>A BLOG FOR INSPIRATION</Text>
                    </Pressable>
                </View>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{marginTop: 18}}>
                    <BlogItem
                        title='SKI RESORTS IN EUROPE'
                        desc='Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                        Accusamus fuga ipsa maxime nostrum.'
                        date='4/05/2024'
                        img={blogSources[0]}
                    />
                    <BlogItem
                        title='THE BEST SUMMER HOUSES IN SANTORINI'
                        desc='Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                        Accusamus fuga ipsa maxime nostrum.'
                        date='29/04/2024'
                        img={blogSources[2]}
                    />
                </ScrollView>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    <BlogItem
                        title='GASTRO GUIDE TO SERBIA'
                        desc='Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                        Accusamus fuga ipsa maxime nostrum.'
                        date='4/05/2024'
                        img={blogSources[1]}
                        small={true}
                    />
                    <BlogItem
                        title='GUIDE TO THE ISLANDS OF GREECE'
                        desc='Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                        Accusamus fuga ipsa maxime nostrum.'
                        date='29/04/2024'
                        img={blogSources[3]}
                        small={true}
                    />
                </ScrollView>
                <View style={{display: 'flex', alignItems: 'center'}}>
                    <TouchableOpacity activeOpacity={0.8} style={[styles.mainBtn, {backgroundColor: 'white'}]}>
                        <Text style={[styles.mainText, {color: '#207FBF', width: 140, textAlign: 'center'}]}>Know more</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.faqFlexbox}>
                <Text style={styles.faqText}>FAQ</Text>
                {accordionItems}
            </View>
            <View style={styles.questionForm}>
                <View style={{marginBottom: 30, marginTop: 15}}>
                    <Text style={styles.questionTitle}>Any other question?</Text>
                    <Text style={styles.questionTitle}>Write to us!</Text>
                </View>
                <View style={{display: 'flex', flexDirection: 'column', gap: 14}}>
                    <TextInput
                        style={styles.questionInput}
                        placeholder='Phone'
                        placeholderTextColor='grey'
                        autoComplete='tel'
                        keyboardType='number-pad'
                    />
                    <TextInput
                        style={styles.questionInput}
                        placeholder='E-mail'
                        placeholderTextColor='grey'
                        autoComplete='email'
                    />
                    <TextInput
                        style={[styles.questionInput, {height: 107}]}
                        placeholder='Your question'
                        placeholderTextColor='grey'
                        multiline = {true}
                        numberOfLines={4}
                    />
                </View>
                <Pressable style={styles.sendBtn}>
                    <Text style={styles.sendBtnText}>SEND</Text>
                    <SendIcon/>
                </Pressable>
            </View>
            <Footer/>
        </ScrollView>
    )
}

function DirectionItem({title, list}){
    return(
        <Pressable style={styles.directionItem}>
            <ImageBackground source={list[title].bg} style={{width: 320, height: 222, padding: 15}}>
                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={styles.mainText}>
                        {title}⠀
                    </Text>
                    <Image source={list[title].country} style={{width: 20, height: 20}}/>
                </View>
            </ImageBackground>
        </Pressable>
    )
}

function BlogItem({title, desc, date, img, small}){
    let imgHeight = small ? 188 : 276;

    return(
        <Pressable style={{width: 300, overflow: 'hidden', marginRight: 12}}>
            <Image source={img} style={[styles.blogImg, {height: imgHeight}]}/>
            <View style={{display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 16}}>
                <Text style={styles.blogSmallText}>{date}</Text>
                <Text style={[styles.mainText, {color: 'white'}]}>{title}</Text>
                <Text style={styles.blogSmallText}>{desc}</Text>
            </View>
        </Pressable>
    )
}

function AccordionItem({ title, content }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [headerHeight, setHeaderHeight] = useState(0);
    const [contentHeight, setContentHeight] = useState(0);
    const animatedHeight = useRef(new Animated.Value(0)).current;
    const animatedOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }, [isExpanded]);

    useEffect(() => {
        if (headerHeight > 0) {
            animatedHeight.setValue(isExpanded ? 1 : 0);
        }
    }, [headerHeight]);

    const toggleAccordion = () => {
        setIsExpanded(!isExpanded);
        Animated.parallel([
            Animated.timing(animatedHeight, {
                toValue: isExpanded ? 0 : 1,
                duration: 150,
                useNativeDriver: false,
            }),
            Animated.timing(animatedOpacity, {
                toValue: isExpanded ? 0 : 1,
                duration: 200,
                useNativeDriver: true,
            })
        ]).start();
    };

    const maxHeight = animatedHeight.interpolate({
        inputRange: [0, 1],
        outputRange: [headerHeight + 33, headerHeight + contentHeight + 33],
    });

    return (
        <Animated.View style={[
            styles.accordionItem,
            isExpanded && styles.accordionItemActive,
            { height: maxHeight }
        ]}>
            <Pressable onPress={toggleAccordion}>
                <View
                    style={styles.accordionInner}
                    onLayout={(event) => {
                        const { height } = event.nativeEvent.layout;
                        setHeaderHeight(height);
                    }}
                >
                    <Text style={[styles.mainText, { color: isExpanded ? 'white' : '#207FBF' }]}>{title}</Text>
                    <View style={styles.arrowContainer}>
                        <Animated.View style={[styles.arrowWrapper, { opacity: animatedOpacity }]}>
                            <ArrowActive color='white' />
                        </Animated.View>
                        <Animated.View style={[styles.arrowWrapper, { opacity: animatedOpacity.interpolate({
                                inputRange: [0, 1],
                                outputRange: [1, 0],
                            }) }]}>
                            <Arrow color={isExpanded ? 'white' : '#207FBF'} />
                        </Animated.View>
                    </View>
                </View>
            </Pressable>
            <View style={{ height: isExpanded ? 'auto' : 0, overflow: 'hidden' }}>
                <View
                    onLayout={(event) => {
                        const { height } = event.nativeEvent.layout;
                        setContentHeight(height);
                    }}
                >
                    <View style={styles.separatorAccordion} />
                    <Text style={{color: isExpanded ? 'white' : '#207FBF', padding: 15}}>{content}</Text>
                </View>
            </View>
        </Animated.View>
    );
}

function generateAccordionItems(faqTitles) {
    return faqTitles.map((title, index) => (
        <AccordionItem
            key={index}
            title={title}
            content='Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
            Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque
            penatibus et magnis dis parturient montes, nascetur ridiculus mus.
            Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.
            Nulla consequat massa quis enim. Donec pede justo, fringilla vel,
            aliquet nec, vulputate eget. '
        />
    ));
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
        top: -40,
        height: 100,
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 20,
        paddingBottom: 20,
        borderRadius: 10,
        backgroundColor: '#207FBF',
    },
    directionItem: {
        width: 320,
        height: 222,
        borderRadius: 10,
        overflow: "hidden"
    },
    directionFlexbox: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 14,
        gap: 20,
        marginBottom: 50
    },
    blogFlexbox: {
        position: 'relative',
        backgroundColor: '#207FBF',
        display: 'flex',
        flexDirection: 'column',
        padding: 14,
        gap: 20
    },
    blogBtn: {
        position: 'absolute',
        backgroundColor: 'white',
        top: -36,
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
    },
    questionForm: {
        padding: 15,
        backgroundColor: '#207FBF'
    },
    questionTitle: {
        fontSize: 20,
        fontFamily: 'Montserrat-Bold',
        color: 'white',
        textTransform: 'uppercase',
        textAlign: 'center'
    },
    questionInput: {
        fontSize: 16,
        fontFamily: 'Montserrat-Bold',
        height: 64,
        paddingHorizontal: 25,
        backgroundColor: 'white',
        borderRadius: 10
    },
    sendBtn: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 10
    },
    sendBtnText: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 16,
        color: 'white'
    }
});