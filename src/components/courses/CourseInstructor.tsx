import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { InstructorType } from '../../constants/types'
import { useTheme } from 'react-native-paper'
import ProgressImage from '../ProgressImage'
import Rating from '../Rating'
import RenderContent from '../RenderContent'
import { WIDTH } from '../../constants'

type CourseInstructorProps = {
    instructor: InstructorType
}

export default function CourseInstructor({
    instructor
}: CourseInstructorProps) {
    const theme = useTheme();

    return (
        <View style={{
            marginBottom:25,
            // backgroundColor: theme.dark ? "rgba(48, 55, 63, 1)" : "#fff",
            // padding : theme.dark ? 10 : 0
        }}>
            <Text style={{
                marginBottom: 15,
                fontWeight: "bold",
                color: theme.dark ? theme.colors.onBackground : "#000",
                fontSize: 18,
                textAlign: "center"
            }}>Instructor</Text>

            <View style={{
                flexDirection: "row",
                flexWrap : "wrap",
                gap: 20,
                marginBottom:20
            }}>
                <ProgressImage
                    source={{
                        uri: instructor.image
                    }}
                    imageStyle={{ borderRadius: 6, overflow: 'hidden' }}
                    style={{
                        width: 75,
                        height: 75
                    }}
                    resizeMode="cover"
                />

                <View>
                    <Text style={styles.name}>{instructor.name}</Text>
                    <Text style={styles.job} numberOfLines={1}>{instructor.job.length > 0 ? instructor.job : "Instructor"}</Text>

                    <View style={{
                        flexDirection : "row",
                        alignItems : "center",
                        justifyContent : "space-between",
                        gap : 20
                    }}>
                        <Rating
                            {...instructor.rating}
                            small
                        />

                        <Text>{instructor.students} Students</Text>
                    </View>
                </View>
            </View>

            <RenderContent
                content={instructor.bio}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    name: {
        fontSize: 18,
        marginBottom: 3,
    },
    job: {
        marginBottom: 10,
        flexWrap : "wrap"
    }
})