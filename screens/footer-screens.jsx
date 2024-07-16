import {ScrollView, Text, View, StyleSheet} from "react-native";
import {Footer} from "../components/footer";
import {generateAccordionItems} from "../components/accordion-list";
import {QuestionForm} from "../components/question-form";

export function PrivacyScreen(){
    return(
        <ScrollView>
            <Text style={styles.titleText}>Privacy Policy</Text>
            <View style={styles.privacyFlexbox}>
                <Text>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio tempora veritatis laudantium
                    temporibus repellat assumenda sunt enim dolor. Vitae sunt, nihil unde harum earum officiis
                    sequi nisi quae incidunt dolore. Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </Text>
                <Text>
                    Odio tempora veritatis laudantium temporibus repellat assumenda sunt enim dolor. Vitae sunt,
                    nihil unde harum earum officiis sequi nisi quae incidunt dolore.Lorem ipsum dolor sit amet
                    consectetur adipisicing elit.
                </Text>
                <Text>
                    Odio tempora veritatis laudantium temporibus repellat assumenda sunt enim dolor. Vitae sunt,
                    nihil unde harum earum officiis sequi nisi quae incidunt dolore. Lorem ipsum dolor sit amet
                    consectetur adipisicing elit. Odio tempora veritatis laudantium temporibus repellat assumenda
                    sunt enim dolor. Vitae sunt, nihil unde harum earum officiis sequi nisi quae incidunt dolore.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </Text>
                <Text>
                    Tempora veritatis laudantium temporibus repellat assumenda sunt enim dolor. Vitae sunt,
                    nihil unde harum earum officiis sequi nisi quae incidunt dolore.
                </Text>
            </View>
            <Footer/>
        </ScrollView>
    )
}

export function TermsScreen(){
    return(
        <ScrollView>
            <Text style={styles.titleText}>Terms & Conditions</Text>
            <View style={styles.privacyFlexbox}>
                <Text>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio tempora veritatis laudantium
                    temporibus repellat assumenda sunt enim dolor. Vitae sunt, nihil unde harum earum officiis
                    sequi nisi quae incidunt dolore. Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </Text>
                <Text>
                    Odio tempora veritatis laudantium temporibus repellat assumenda sunt enim dolor. Vitae sunt,
                    nihil unde harum earum officiis sequi nisi quae incidunt dolore.Lorem ipsum dolor sit amet
                    consectetur adipisicing elit.
                </Text>
                <Text>
                    Odio tempora veritatis laudantium temporibus repellat assumenda sunt enim dolor. Vitae sunt,
                    nihil unde harum earum officiis sequi nisi quae incidunt dolore. Lorem ipsum dolor sit amet
                    consectetur adipisicing elit. Odio tempora veritatis laudantium temporibus repellat assumenda
                    sunt enim dolor. Vitae sunt, nihil unde harum earum officiis sequi nisi quae incidunt dolore.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </Text>
                <Text>
                    Tempora veritatis laudantium temporibus repellat assumenda sunt enim dolor. Vitae sunt,
                    nihil unde harum earum officiis sequi nisi quae incidunt dolore.
                </Text>
            </View>
            <Footer/>
        </ScrollView>
    )
}

export function RefundsScreen(){
    return(
        <ScrollView>
            <Text style={styles.titleText}>Cancellation & Refunds</Text>
            <View style={styles.privacyFlexbox}>
                <Text>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio tempora veritatis laudantium
                    temporibus repellat assumenda sunt enim dolor. Vitae sunt, nihil unde harum earum officiis
                    sequi nisi quae incidunt dolore. Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </Text>
                <Text>
                    Odio tempora veritatis laudantium temporibus repellat assumenda sunt enim dolor. Vitae sunt,
                    nihil unde harum earum officiis sequi nisi quae incidunt dolore.Lorem ipsum dolor sit amet
                    consectetur adipisicing elit.
                </Text>
                <Text>
                    Odio tempora veritatis laudantium temporibus repellat assumenda sunt enim dolor. Vitae sunt,
                    nihil unde harum earum officiis sequi nisi quae incidunt dolore. Lorem ipsum dolor sit amet
                    consectetur adipisicing elit. Odio tempora veritatis laudantium temporibus repellat assumenda
                    sunt enim dolor. Vitae sunt, nihil unde harum earum officiis sequi nisi quae incidunt dolore.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </Text>
                <Text>
                    Tempora veritatis laudantium temporibus repellat assumenda sunt enim dolor. Vitae sunt,
                    nihil unde harum earum officiis sequi nisi quae incidunt dolore.
                </Text>
            </View>
            <Footer/>
        </ScrollView>
    )
}

export function FaqScreen(){
    const faqTitles = [
        'How does Travelcom work?',
        'How do you I find and buy air tickets?',
        'How do I book a ticket?',
        'How can I call you?',
        'How do the website and the app work?',
        'I`m afraid of scammers. Am I sure I won`t be tricked with a ticket?',
        'How do I subscribe to the news?'
    ];

    const accordionItems = generateAccordionItems(faqTitles)

    return(
        <ScrollView>
            <View style={styles.faqFlexbox}>
                <Text style={styles.faqText}>FAQ</Text>
                {accordionItems}
            </View>
            <QuestionForm title='Any other question? Write to us!'/>
            <Footer color='white'/>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    privacyFlexbox: {
        display: 'flex',
        flexDirection: 'column',
        paddingHorizontal: 15,
        gap: 10
    },
    titleText: {
        fontSize: 20,
        fontFamily: 'Montserrat-Bold',
        color: '#207FBF',
        padding: 15
    },
    faqText: {
        fontFamily: 'Montserrat-Bold',
        marginBottom: 15,
        fontSize: 30,
        color: '#207FBF',
        textAlign: 'center'
    },
    faqFlexbox: {
        padding: 14,
        backgroundColor: 'white'
    },
})