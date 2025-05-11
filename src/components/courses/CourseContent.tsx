import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { CourseLessonSubTopic, CourseLessonTopic } from '../../constants/types'
import Accordion from '../Accordion'
import { useTheme } from 'react-native-paper'

export default function CourseContent({ 
    data, 
    onPressLesson 
}: { 
    data: CourseLessonTopic[], 
    onPressLesson : (lesson : CourseLessonSubTopic) => void 
}) {
    const theme = useTheme();
    
    return (
        <View style={{
            marginVertical: 30
        }}>
            <Text style={{
                marginBottom: 15,
                fontWeight: "bold",
                color: theme.dark ? theme.colors.onBackground : "#000",
                fontSize: 18,
                textAlign: "center"
            }}>Course Content</Text>

            <Accordion
                data={data}
                onPressLesson={onPressLesson}
            />
        </View>
    )
}

const styles = StyleSheet.create({})