import { Alert, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { FlatList } from 'react-native-gesture-handler'
import { ActivityIndicator, Button, Card, ProgressBar, useTheme } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native';
import { CourseLessonSubTopic, CourseLessonTopic, CourseProgressType, SingleCourseType } from '../constants/types';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { CourseProgressDefault, SingleCourseSubTopicDefault } from '../constants/defaults';
import { CONFIG, VIDEO_PLAYER_HEIGHT, WIDTH } from '../constants';
import VideoPlayer from '../components/VideoPlayer';
import { AppContext } from '../constants/context';
import { ExceptionHandler, ToastMessage } from '../constants/Functions';
import { QuizList } from '../components/QuizCard';
import BackMenu from '../components/BackMenu';
import { FlashList } from '@shopify/flash-list';
import axiosInstance from '../constants/axiosInstance';

export default function SingleLessonScreen(props: any) {
    const theme = useTheme();
    const navigation = useNavigation();
    const flatListRef = useRef<any>(null);

    const { setSpinner } = React.useContext(AppContext);
    const { course, lesson }: { course: SingleCourseType, lesson: number } = props.route.params;

    const [topics, setTopics] = useState<CourseLessonTopic[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [activeLesson, setActiveLesson] = useState<CourseLessonSubTopic>(SingleCourseSubTopicDefault);
    const [progress, setProgress] = useState<CourseProgressType>(CourseProgressDefault);
    const [modal, setModal] = useState(false);

    const SubTopicCard = ({ data }: {
        data: CourseLessonSubTopic
    }) => {
        return (
            <TouchableOpacity activeOpacity={1} style={[styles.lessonSubTopicCard]} onPress={() => {
                if( course.buttons?.purchase == undefined && ! data.locked ){
                    setActiveLesson(data);
                }else{
                    ToastAndroid.show("Lesson is locked", ToastAndroid.SHORT);
                }
            }}>
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    width: "85%"
                }}>
                    <MaterialCommunityIcons color={activeLesson.id == data.id ? theme.colors.primary : "#aaa"} size={19} name="youtube" />
                    <Text style={[{
                        fontSize: 14,
                        color: theme.dark ? theme.colors.onBackground : "#333"
                    }, activeLesson.id == data.id ? {
                        color: theme.colors.primary,
                        fontWeight: "bold"
                    } : {}]}>{data.name}</Text>
                </View>

                <MaterialCommunityIcons size={20} name={data.completed ? "check-circle" : "checkbox-blank-circle-outline"} color={data.completed ? theme.colors.primary : "#cdcfd5"} />
            </TouchableOpacity>
        )
    }

    const renderTopic = ({ item }: {
        item: CourseLessonTopic
    }) => {

        return (
            <View style={[styles.accordContainer, {
                borderColor : theme.dark ? theme.colors.secondary : '#eff1f6'
            }]}>
                <TouchableOpacity activeOpacity={1} style={[styles.accordHeader, {
                    backgroundColor : theme.dark ? theme.colors.secondary : '#fff',
                    borderColor : theme.dark ? theme.colors.secondary : '#fff'
                }]}>
                    <Text style={styles.accordTitle}>{item.name}</Text>
                </TouchableOpacity>

                <View style={[styles.accordBody, {
                    backgroundColor: theme.dark ? "rgba(48, 55, 63, 1)" : "#fff",
                    borderColor : theme.dark ? theme.colors.secondary : '#eff1f6'
                }]}>
                    {
                        item.sub_topics.map((subtopic, subindex) => {
                            return (
                                <SubTopicCard
                                    data={subtopic}
                                    key={subindex}
                                />
                            )
                        })
                    }
                </View>
            </View>
        )
    }

    const HeaderComponent = () => {
        if (progress && progress.hasOwnProperty("completed_percent")) {
            return (
                <View style={{
                    paddingHorizontal: 15,
                    marginBottom: 10,
                    paddingVertical:5,
                }}>
                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 5
                    }}>
                        <Text style={theme.dark ? {
                            color : theme.colors.onBackground
                        } : {}}>{progress?.completed_percent}% Complete</Text>
                        <Text style={theme.dark ? {
                            color : theme.colors.onBackground
                        } : {}}>{progress?.completed_count}/{progress?.total_count}</Text>
                    </View>

                    <ProgressBar progress={progress?.completed_percent / 100} color={theme.dark ? theme.colors.onBackground : theme.colors.primary} />
                </View>
            )
        }
        return <View style={{
            marginBottom:10
        }} />;
    }

    const analyzeLessonInfo = () => {
        if (lesson) {
            const subtopics = course.topics[0].sub_topics;
            for (let i = 0; i < subtopics.length; i++) {
                if (lesson == subtopics[i].id) {
                    setActiveLesson(subtopics[i]);
                    setLoading(false);
                    break;
                }
            }
        }

        if (activeLesson.id <= 0) {
            setActiveLesson(course.topics[0].sub_topics[0]);
            setLoading(false);
        }
    }

    const RenderQuizPlayer = () => {
        return (
            <View style={{
                width: WIDTH,
                height: VIDEO_PLAYER_HEIGHT + 100,
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <Text style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "#000",
                    marginVertical: 20
                }}>{activeLesson.name}</Text>

                <QuizList
                    lefttext="Questions: "
                    righttext={activeLesson.extra_info?.questions}
                />

                <QuizList
                    lefttext="Total Attempts: "
                    righttext={activeLesson.extra_info?.attempts}
                />

                <QuizList
                    lefttext="Pass Marks: "
                    righttext={activeLesson.extra_info?.passing_grade + "%"}
                />

                {
                    activeLesson.extra_info?.can_attempt ? <Button mode="contained" style={{
                        marginTop: 20
                    }} onPress={() => navigation.navigate("LessonPlayQuiz", {
                        quiz_id: activeLesson.id,
                        quiz_title: activeLesson.name
                    })}>Start Quiz</Button> : null
                }

                {
                    activeLesson.extra_info?.attempted_count > 0 ? <Button mode="contained" style={{
                        marginTop: 20
                    }} onPress={() => navigation.navigate("UserCourseQuiz", {
                        quiz_id: activeLesson.id
                    })}>View All Attempts</Button> : null
                }

            </View>
        )
    }

    useEffect(() => {
        let s = true;
        if (s) {
            setTimeout(() => {
                analyzeLessonInfo();

                if (course.buttons?.enrolled?.progress) {
                    setProgress(course.buttons?.enrolled?.progress);
                }

                if (course.topics) {
                    setTopics(course.topics);
                }
            }, 1000);
        }

        return () => {
            s = false;
        }
    }, [])


    const previousLesson = () => {
        try {
            const flattenedSubTopics = course.topics.flatMap(obj => obj.sub_topics);
            const index = flattenedSubTopics.findIndex(subTopic => subTopic.id === activeLesson.id);

            if (index === -1) {
                return false;
            }

            const previousIndex = (index - 1 + flattenedSubTopics.length) % flattenedSubTopics.length;
            const previousSubTopic = flattenedSubTopics[previousIndex];
            
            if( course.buttons?.purchase == undefined && ! previousSubTopic.locked ){
                setActiveLesson(previousSubTopic);
                flatListRef.current?.scrollToIndex({
                    index: previousIndex,
                    animated: true
                });
            }else{
                ToastAndroid.show("Lesson is locked", ToastAndroid.SHORT);
            }
        } catch (error) {

        }
    }

    const nextLesson = () => {
        try {
            // if( progress.completed_percent >= 100 ){
            //     setModal(true);
            // }

            const flattenedSubTopics = course.topics.flatMap(obj => obj.sub_topics);
            const index = flattenedSubTopics.findIndex(subTopic => subTopic.id === activeLesson.id);

            if (index === -1) {
                return false;
            }

            const nextIndex = (index + 1) % flattenedSubTopics.length;
            const nextSubTopic = flattenedSubTopics[nextIndex];

            if( course.buttons?.purchase == undefined && ! nextSubTopic.locked ){
                setActiveLesson(nextSubTopic);
                flatListRef.current?.scrollToIndex({
                    index: nextIndex,
                    animated: true
                });
            }else{
                ToastAndroid.show("Lesson is locked", ToastAndroid.SHORT);
            }
        } catch (error) {
            console.log(error);

        }
    }

    const markAsComplete = async () => {
        setSpinner(true);
        await axiosInstance.post(CONFIG.API.MARK_COMPLETE, {
            lesson: activeLesson.id,
            course: course.id
        }).then((res) => {
            setProgress(res.data);

            /** Mark lesson tick mark */
            const updatedTopicData = topics.map((topic) => ({
                ...topic,
                sub_topics: topic.sub_topics.map((subTopic) => ({
                    ...subTopic,
                    completed: subTopic.id === activeLesson.id
                })),
            }));
            setTopics(updatedTopicData);
            setActiveLesson({ ...activeLesson, completed: true });

            setSpinner(false);
        }).catch((error) => {
            const { title, message } = ExceptionHandler(error);
            ToastMessage("error", message, title);
            setSpinner(false);
        });
    }

    const RenderContentAccordingToType = () => {
        switch (activeLesson.type) {
            case 'video':
                return <VideoPlayer video={activeLesson.video} />

            case 'quiz':
                return <RenderQuizPlayer />
        }

        return null;
    }

    return (
        <BackMenu title={course.name}>
            {
                loading ?
                    <View style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <ActivityIndicator animating color={theme.colors.primary} />
                    </View>
                    :
                    <View style={{
                        flex : 1
                    }}>
                        <RenderContentAccordingToType />
                        <HeaderComponent />

                        <FlashList
                            ref={flatListRef}
                            data={topics}
                            keyExtractor={(item) => `topic_${item.id}`}
                            renderItem={renderTopic}
                            contentContainerStyle={{
                                paddingBottom:50
                            }}
                            estimatedItemSize={100}
                        />

                        <View style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: 10,
                            backgroundColor: theme.dark ? "rgba(48, 55, 63, 1)" : "#eff1f6",
                            borderTopWidth: 1,
                            borderTopColor: theme.dark ? theme.colors.secondary : "#ccc"
                        }}>
                            <Button onPress={previousLesson}>Previous</Button>

                            {
                                activeLesson.completed || activeLesson.type == 'quiz' ? null : <Button
                                    onPress={markAsComplete}
                                >Mark as Complete</Button>
                            }

                            <Button onPress={nextLesson}>Next</Button>
                        </View>
                    </View>
            }
        </BackMenu>
    )
}

const styles = StyleSheet.create({
    accordContainer: {
        paddingBottom: 4,
        marginHorizontal: 10,
        marginBottom: 15
    },
    accordHeader: {
        paddingHorizontal: 12,
        paddingVertical:12,
        backgroundColor: '#eff1f6',
        color: '#000',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: "#e0e2ea",
        borderRadius: 5,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0
    },
    accordTitle: {
        fontSize: 15,
        color: "#000",
        fontWeight: "500",
        width: "90%"
    },
    accordBody: {
        paddingVertical: 12,
        paddingHorizontal:12,
        borderWidth: 1,
        borderColor: "#e0e2ea",
        borderRadius: 5,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderTopWidth: 0
    },
    lessonSubTopicCard: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 7
    }
});