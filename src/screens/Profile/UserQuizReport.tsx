import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import BackMenu from '../../components/BackMenu'
import { ScrollView } from 'react-native-gesture-handler'
import { ActivityIndicator, useTheme } from 'react-native-paper'
import { QuizDetailsDefault } from '../../constants/defaults'
import { ErrorType, QuizDetailsType } from '../../constants/types'
import axios from 'axios'
import { ExceptionHandler } from '../../constants/Functions'
import QuizCard, { QuizList } from '../../components/QuizCard'
import Error from '../../components/Error'
import { CONFIG, HEIGHT } from '../../constants'
import axiosInstance from '../../constants/axiosInstance'

export default function UserQuizReport(props: any) {
    const theme = useTheme();
    const { attempt_id } = props.route.params;

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<QuizDetailsType>(QuizDetailsDefault);
    const [error, setError] = useState<ErrorType>({
        enable: false,
        title: "",
        message: ""
    });
    const [refreshing, setRefreshing] = useState(false);

    const getDataFromOnline = async () => {
        await axiosInstance.post(CONFIG.API.USER_SINGLE_LESSON_QUIZ, {
            id: attempt_id
        }).then((res) => {
            setData(res.data);
            setError({
                ...error,
                enable: false
            });
            setLoading(false);
            setRefreshing(false);
        }).catch((error) => {
            const { title, message } = ExceptionHandler(error);
            setError({
                enable: true,
                title,
                message
            });
            setLoading(false);
            setRefreshing(false);
        });
    }

    useEffect(() => {
        if (attempt_id) {
            getDataFromOnline();
        }
    }, [attempt_id])


    return (
        <BackMenu title="Quiz Report">
            <ScrollView
                contentContainerStyle={{
                    padding: 10
                }}
            >
                {
                    loading ? <View style={{
                        height: HEIGHT,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        <ActivityIndicator animating size={20} />
                    </View>
                        : error.enable ? <Error
                            title={error.title}
                            message={error.message}
                            button={{
                                text: "Reload",
                                onPress: () => {
                                    setRefreshing(false);
                                    setError({
                                        ...error,
                                        enable: false
                                    });
                                    setLoading(true);
                                    getDataFromOnline();
                                }
                            }}
                        /> : <>
                            <QuizCard
                                item={data}
                            />

                            <Text style={{
                                fontSize: 18,
                                fontWeight: "bold",
                                marginVertical: 15,
                                color: theme.colors.onBackground
                            }}>Quiz Overview</Text>

                            {
                                data.info.map((quizSingle, index) => {
                                    return (
                                        <View
                                            key={quizSingle.question}
                                            style={{
                                                backgroundColor: theme.dark ? "rgba(48, 55, 63, 1)" : "#fff",
                                                shadowColor: "#000",
                                                shadowOffset: {
                                                    width: 0,
                                                    height: 1,
                                                },
                                                shadowOpacity: 0.25,
                                                shadowRadius: 1.84,
                                                elevation: 2,
                                                marginBottom: 15,
                                                padding: 10,
                                                borderRadius: 8
                                            }}
                                        >
                                            <Text style={{
                                                color: theme.colors.onBackground,
                                                fontWeight: "bold",
                                                padding: 10,
                                                fontSize: 16
                                            }}>QN {index+1}: {quizSingle.question}</Text>

                                            <View style={{
                                                padding: 10
                                            }}>
                                                <QuizList
                                                    lefttext="Given Answer:"
                                                    righttext={quizSingle.given_answer.join(", ")}
                                                />

                                                <QuizList
                                                    lefttext="Correct Answer:"
                                                    righttext={quizSingle.correct_answer.join(", ")}
                                                />

                                                {
                                                    quizSingle.status == 'correct' ? <Text style={[styles.point, {
                                                        color: "#24A148",
                                                        backgroundColor: "rgba(36, 161, 72, 0.15)",
                                                        borderColor: "rgba(36, 161, 72, 0.15)"
                                                    }]}>Correct</Text> : <Text style={[styles.point, {
                                                        color: "#F44337",
                                                        backgroundColor: "rgba(244, 67, 55, 0.15)",
                                                        borderColor: "rgba(244, 67, 55, 0.15)"
                                                    }]}>Incorrect</Text>
                                                }
                                            </View>
                                        </View>
                                    )
                                })
                            }
                        </>
                }
            </ScrollView>
        </BackMenu>
    )
}

const styles = StyleSheet.create({
    point : {
        fontWeight:"500",
        borderWidth:1,
        borderColor:"#333",
        color : "#000",
        backgroundColor : "#ddd",
        borderRadius:30,
        paddingHorizontal : 10,
        paddingVertical:5,
        width : "100%",
        textAlign : "center"
    }
})