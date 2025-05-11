import React, { useState } from 'react';
import type { PropsWithChildren } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    LayoutAnimation,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { CourseLessonSubTopic, CourseLessonTopic } from '../constants/types';
import { useNavigation } from '@react-navigation/native';

type AccordionItemPros = PropsWithChildren<{
    title: string;
    expanded: boolean;
    onHeaderPress: () => void;
}>;

type AccordionData = {
    title: string;
    content: () => JSX.Element;
    expanded?: boolean;
    onHeaderPress?: (index: number) => void;
};

type AccordionProps = PropsWithChildren<{
    data: CourseLessonTopic[],
    onPressLesson: (lesson : CourseLessonSubTopic) => void
}>;

function AccordionItem({ children, title, expanded, onHeaderPress }: AccordionItemPros): JSX.Element {
    const body = <View style={styles.accordBody}>{children}</View>;
    const theme = useTheme();

    return (
        <View style={styles.accordContainer}>
            <TouchableOpacity activeOpacity={1} style={[styles.accordHeader, expanded ? {

            } : {
                borderBottomLeftRadius:5,
                borderBottomRightRadius:5
            }]} onPress={onHeaderPress}>
                <Text style={[styles.accordTitle, {
                    color : theme.dark ? theme.colors.onBackground : "#000"
                }]}>{title}</Text>
                <MaterialCommunityIcons name={expanded ? 'chevron-up' : 'chevron-down'}
                    size={25} color={theme.colors.primary} />
            </TouchableOpacity>
            {expanded && body}
        </View>
    );
}

const SubTopicCard = ( { data, onPressLesson } : {
    data : CourseLessonSubTopic,
    onPressLesson : (lesson : CourseLessonSubTopic) => void
} ) => {
    const theme = useTheme();

    return(
        <TouchableOpacity 
            activeOpacity={0.7} 
            style={styles.lessonSubTopicCard}
            onPress={() => onPressLesson(data)}
        >
            <View style={{
                flexDirection : "row",
                alignItems : "center",
                gap : 10,
                width : "85%"
            }}>
                <MaterialCommunityIcons size={17} name="youtube" />
                <Text style={{
                    fontSize:16,
                    color : theme.dark ? theme.colors.onBackground : "#333"
                }}>{data.name}</Text>
            </View>
            {
                data.locked ? <MaterialCommunityIcons size={18} name="lock-outline" /> : null
            }
        </TouchableOpacity>
    )
}

export default function Accordion({ data, onPressLesson }: AccordionProps): JSX.Element {

    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    function handleHeaderPress(index : number) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedIndex(expandedIndex === index ? null : index);
    }

    return (
        <>
            {data.map((item : CourseLessonTopic, index : number) => (
                <AccordionItem
                    key={index}
                    title={item.name}
                    expanded={expandedIndex === index}
                    onHeaderPress={() => handleHeaderPress(index)}
                >
                    <View>
                        {
                            item.sub_topics.map((subtopic, subindex) => {
                                return(
                                    <SubTopicCard 
                                        data={subtopic}
                                        key={subindex}
                                        onPressLesson={onPressLesson}
                                    />
                                )
                            })
                        }
                    </View>
                </AccordionItem>
            ))}
        </>
    );
}

const styles = StyleSheet.create({
    accordContainer: {
        paddingBottom: 4,
        marginBottom:10
    },
    accordHeader: {
        padding: 12,
        backgroundColor: 'transparent',
        color: '#000',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth:1,
        borderColor : "#e0e2ea",
        borderRadius:5,
        borderBottomLeftRadius:0,
        borderBottomRightRadius:0
    },
    accordTitle: {
        fontSize: 17,
        color : "#000",
        fontWeight:"500",
        width : "90%"
    },
    accordBody: {
        padding: 12,
        borderWidth:1,
        borderColor : "#e0e2ea",
        borderRadius:5,
        borderTopLeftRadius:0,
        borderTopRightRadius:0,
        borderTopWidth:0
    },
    lessonSubTopicCard : {
        flexDirection : "row",
        alignItems : "center",
        justifyContent : "space-between",
        marginBottom:15
    }
});