import {ScrollView, Text, View, StyleSheet} from "react-native";
import {BlogItem} from "../components/blog-item";
import {Footer} from "../components/footer";

export default function NewsScreen() {
    const blogSources = [
        require('../assets/blog/blog-1.png'),
        require('../assets/blog/blog-2.png'),
        require('../assets/blog/blog-3.png'),
        require('../assets/blog/blog-4.png'),
    ];

    return(
        <ScrollView style={{backgroundColor: 'white'}}>
            <View style={{backgroundColor: '#207FBF', marginBottom: 18}}>
                <Text style={[styles.mainText, styles.titleText]}>A BLOG FOR INSPIRATION</Text>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{marginBottom: 18}}>
                    <BlogItem
                        title='SKI RESORTS IN EUROPE'
                        desc='Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                        Accusamus fuga ipsa maxime nostrum.'
                        date='4/05/2024'
                        textColor='white'
                        img={blogSources[0]}
                    />
                    <BlogItem
                        title='THE BEST SUMMER HOUSES IN SANTORINI'
                        desc='Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                        Accusamus fuga ipsa maxime nostrum.'
                        date='29/04/2024'
                        textColor='white'
                        img={blogSources[2]}
                    />
                </ScrollView>
            </View>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{marginBottom: 18}}>
                <BlogItem
                    title='GASTRO GUIDE TO SERBIA'
                    desc='Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                        Accusamus fuga ipsa maxime nostrum.'
                    date='4/05/2024'
                    img={blogSources[1]}
                    textColor='black'
                    small={true}
                />
                <BlogItem
                    title='GUIDE TO THE ISLANDS OF GREECE'
                    desc='Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                        Accusamus fuga ipsa maxime nostrum.'
                    date='29/04/2024'
                    img={blogSources[3]}
                    textColor='black'
                    small={true}
                />
            </ScrollView>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{marginBottom: 18}}>
                <BlogItem
                    title='SKI RESORTS IN EUROPE'
                    desc='Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                        Accusamus fuga ipsa maxime nostrum.'
                    date='4/05/2024'
                    textColor='black'
                    img={blogSources[0]}
                />
                <BlogItem
                    title='THE BEST SUMMER HOUSES IN SANTORINI'
                    desc='Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                        Accusamus fuga ipsa maxime nostrum.'
                    date='29/04/2024'
                    textColor='black'
                    img={blogSources[2]}
                />
            </ScrollView>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{marginBottom: 18}}>
                <BlogItem
                    title='GASTRO GUIDE TO SERBIA'
                    desc='Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                        Accusamus fuga ipsa maxime nostrum.'
                    date='4/05/2024'
                    img={blogSources[1]}
                    textColor='black'
                    small={true}
                />
                <BlogItem
                    title='GUIDE TO THE ISLANDS OF GREECE'
                    desc='Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                        Accusamus fuga ipsa maxime nostrum.'
                    date='29/04/2024'
                    img={blogSources[3]}
                    textColor='black'
                    small={true}
                />
            </ScrollView>
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
    }
})