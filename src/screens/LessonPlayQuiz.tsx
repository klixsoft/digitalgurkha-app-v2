import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import BackMenu from '../components/BackMenu'
import { ScrollView } from 'react-native-gesture-handler';
import { ErrorType, QuizOptionType, QuizQuestionType } from '../constants/types';
import { ActivityIndicator, Button, useTheme } from 'react-native-paper';
import { CONFIG, HEIGHT } from '../constants';
import Error from '../components/Error';
import axios from 'axios';
import { ExceptionHandler, ToastMessage } from '../constants/Functions';
import { QuizQuestionDefault } from '../constants/defaults';
import { AppContext } from '../constants/context';
import { useNavigation } from '@react-navigation/native';
import axiosInstance from '../constants/axiosInstance';

interface SelectedOptions {
    [key: number]: string | string[] | number | number[];
}

export default function LessonPlayQuiz(props: any) {
    const theme = useTheme();
    const navigation = useNavigation();

    const { quiz_id, quiz_title } = props.route.params;
    const { setSpinner } = React.useContext(AppContext);

    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<QuizQuestionType[]>([]);;

    const [showPrevBtn, setShowPrevBtn] = useState<boolean>(true);
    const [error, setError] = useState<ErrorType>({
        enable: false,
        title: "",
        message: ""
    });
    const [current, setCurrent] = useState(1);
    const [total, setTotal] = useState(1);

    const [questionids, setQuestionids] = useState<number[]>([]);
    const [answerids, setAnswerids] = useState<SelectedOptions>({});
    const [attempt_id, setAttempt_id] = useState(0);

    const getQuizDataOnline = () => {
        axiosInstance.post(CONFIG.API.LESSON_QUIZ, {
            id: quiz_id
        }).then((res) => {
            setAttempt_id(res.data.attempt_id);
            setQuestionids(res.data.questions);
            setData(res.data.data);
            setTotal(res.data.total);
            setShowPrevBtn(res.data.show_prev_btn);
            setLoading(false);
        }).catch((error) => {
            const { title, message } = ExceptionHandler(error);
            setError({
                enable: true,
                title,
                message
            });
            setLoading(false);
        })
    }

    useEffect(() => {
        console.log(answerids);
    }, [answerids])

    useEffect(() => {
        let s = true;
        if (s) {
            getQuizDataOnline();
        }

        return () => {
            s = false
        }
    }, [])

    const handleAnswer = (answer: QuizOptionType, index: number) => {
        try {
            let curentQuiz = data[current - 1];
            let selectedOptions:SelectedOptions = { ...answerids };

            if (curentQuiz.type == 'single_choice' || curentQuiz.type == 'single_choice') {
                selectedOptions[curentQuiz.id] = answer.id;
            } else if (curentQuiz.type == 'multiple_choice') {
                const currentSelectedOptions:any = answerids[curentQuiz.id] || [];
                if( Array.isArray(currentSelectedOptions) && currentSelectedOptions.includes(answer.id) ){
                    selectedOptions[curentQuiz.id] = currentSelectedOptions.filter(
                        option => option !== answer.id
                    );
                }else{
                    selectedOptions[curentQuiz.id] = [
                        ...currentSelectedOptions,
                        answer.id,
                    ];
                }
            }

            setAnswerids(selectedOptions);
        } catch (error) {

        }
    }

    const isAnswerSelected = (answer : QuizOptionType) => {
        try {
            let curentQuiz = data[current - 1];
            if( answerids.hasOwnProperty(curentQuiz.id) ){
                const selectedAnswerId:any = answerids[curentQuiz.id];
                if( Array.isArray(selectedAnswerId) ){
                    return selectedAnswerId.includes(answer.id);
                }else{
                    return selectedAnswerId == answer.id;
                }
            }
        } catch (error) {
            
        }
        return false;
    }

    const submitQuiz = async () => {
        setSpinner(true);
        const reqData = {
            attempt_id : attempt_id,
            attempt : {
                [attempt_id] : {
                    quiz_question_ids : questionids,
                    quiz_question : answerids
                }
            }
        };
        
        await axios.post(CONFIG.API.LESSON_QUIZ_SUBMIT, reqData).then((res) => {
            setSpinner(false);
            navigation.navigate("UserQuizReport", {
                attempt_id : attempt_id
            });
        }).catch((error) => {
            setSpinner(false);
            const { title, message } = ExceptionHandler(error);
            ToastMessage("error", message, title);
        })
    }

    const QuestionContainer = () => {
        return (
            <View style={{
                margin: 10
            }}>
                <View style={{
                    paddingVertical: 20,
                    position: 'relative'
                }}>
                    <View style={{
                        backgroundColor: theme.colors.secondaryContainer,
                        padding: 10,
                        borderRadius: 10
                    }}>
                        <Text style={{
                            position: "absolute",
                            top: "-10%",
                            backgroundColor: "#fff",
                            paddingHorizontal: 15,
                            paddingVertical: 3,
                            color: theme.colors.primary,
                            fontWeight: 'bold',
                            borderRadius: 5,
                            left: "45%"
                        }}>{current}/{total}</Text>
                        <View style={{
                            paddingTop: 25,
                            paddingBottom: 35
                        }}>
                            <Text style={{
                                fontSize: 16,
                                color: "#000",
                                textAlign: "center"
                            }}>{data[current - 1].question}</Text>
                        </View>
                        <Text style={{
                            position: "absolute",
                            bottom: "-10%",
                            backgroundColor: "#fff",
                            paddingHorizontal: 15,
                            paddingVertical: 3,
                            color: theme.colors.primary,
                            fontWeight: 'bold',
                            borderRadius: 100,
                            left: "45%"
                        }}>?</Text>
                    </View>
                </View>


                <View style={{
                    marginTop: 30
                }}>
                    {
                        data[current - 1].options.map((answer, index) => {
                            return (
                                <TouchableOpacity
                                    onPress={() => handleAnswer(answer, index)}
                                    key={index} style={[styles.answer, {
                                        borderColor: theme.colors.primary
                                    }, isAnswerSelected(answer) ? {
                                        backgroundColor: theme.colors.secondaryContainer
                                    } : {}]}
                                >
                                    <Text style={{
                                        fontSize: 16,
                                        color: "#000"
                                    }}>{answer.title}</Text>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>

                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 10,
                    marginTop: 15
                }}>
                    {
                        showPrevBtn &&
                        <Button
                            mode="outlined"
                            style={[current <= 1 ? {} : {
                                borderColor: theme.colors.primary
                            }]}
                            disabled={current <= 1}
                            onPress={() => setCurrent(current - 1)}
                        >Previous Question</Button>
                    }

                    {
                        current >= total ?
                            <Button
                                mode='contained'
                                onPress={submitQuiz}
                            >Submit Quiz</Button>
                            :
                            <Button
                                mode='contained'
                                disabled={current >= total}
                                onPress={() => setCurrent(current + 1)}
                            >Next Question</Button>
                    }
                </View>
            </View >
        );
    }

    return (
        <BackMenu
            title={quiz_title}
        >
            <ScrollView>
                {
                    loading ? <View style={{
                        height: HEIGHT,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        <ActivityIndicator animating size={30} />
                    </View>
                        : error.enable ? <View style={{
                            height: HEIGHT,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center"
                        }}><Error
                                {...error}
                                button={{
                                    text: "Reload",
                                    onPress: () => {
                                        setLoading(true);
                                        setError({
                                            ...error,
                                            enable: false
                                        });
                                        getQuizDataOnline();
                                    }
                                }}
                            /></View>
                            : <QuestionContainer />
                }
            </ScrollView>
        </BackMenu>
    )
}

const styles = StyleSheet.create({
    answer: {
        borderRadius: 5,
        borderWidth: 2,
        borderColor: "#ccc",
        marginBottom: 15,
        paddingVertical: 5,
        paddingBottom: 15,
        paddingTop: 15,
        paddingLeft: 15
    }
})