import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { QuizCardType } from '../constants/types'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import { useTheme } from 'react-native-paper'

export const QuizList = ({ lefttext, righttext }: {
    lefttext: string,
    righttext: string | number
}) => {
    return (
        <View style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 10
        }}>
            <Text style={{
                fontSize: 16
            }}>{lefttext}</Text>
            <Text style={{
                fontSize: 16
            }}>{righttext}</Text>
        </View>
    )
}

export default function QuizCard({ item }: {
    item: QuizCardType
}) {
    const theme = useTheme();
    const navigation = useNavigation();
    
    return (
        <TouchableOpacity
            style={{
                backgroundColor: theme.dark ? "rgba(48, 55, 63, 1)" : "#fff",
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
                marginBottom:15,
                padding : 10,
                borderRadius:8
            }}
            onPress={() => navigation.navigate("UserQuizReport", {
                attempt_id : item.id
            })}
            activeOpacity={0.8}
        >
            <Text style={{
                color: theme.colors.onBackground,
                fontWeight: "bold",
                padding: 10,
                fontSize:16
            }}>{item.title} - ( {item.course_title} )</Text>

            <View style={{
                padding: 10
            }}>
                <QuizList
                    lefttext="Total Questions:"
                    righttext={item.summary.total}
                />

                <QuizList
                    lefttext="Total Marks:"
                    righttext={item.summary.total_marks}
                />


                <QuizList
                    lefttext="Answered:"
                    righttext={item.summary.answered}
                />


                <QuizList
                    lefttext="Correct Answer:"
                    righttext={item.summary.correct}
                />


                <QuizList
                    lefttext="Incorrect Answer:"
                    righttext={item.summary.incorrect}
                />

                <QuizList
                    lefttext="Percentage:"
                    righttext={`${item.summary.earned_per}%`}
                />

                <QuizList
                    lefttext="Answered:"
                    righttext={item.summary.answered}
                />

                {
                    item.summary.result ? <Text style={[styles.point, {
                        color : "#24A148",
                        backgroundColor : "rgba(36, 161, 72, 0.15)",
                        borderColor : "rgba(36, 161, 72, 0.15)"
                    }]}>Passed</Text> : <Text style={[styles.point, {
                        color : "#F44337",
                        backgroundColor : "rgba(244, 67, 55, 0.15)",
                        borderColor : "rgba(244, 67, 55, 0.15)"
                    }]}>Failed</Text>
                }
            </View>
        </TouchableOpacity>
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
        padding : 10,
        width : "100%",
        textAlign : "center"
    }
})