import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { CourseCardType } from '../../constants/types'
import ProgressImage from '../ProgressImage'
import Price from './Price'
import { useTheme } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import Rating from '../Rating'
import { WIDTH } from '../../constants'
import CourseProgress from './CourseProgress'

export default function CourseCardProgress({ course, half = false }: {
    course: CourseCardType,
    half?: boolean
}) {
    const theme = useTheme();
    const navigation = useNavigation();
    const CARDWIDTH = half ? WIDTH / 2 - 20 : 200;
    const CARDHEIGHT = half ? 185 / 330 * CARDWIDTH : 160;
    
    return (
        <TouchableOpacity style={{
            marginRight: 15,
            marginBottom:15,
            width: CARDWIDTH,
            backgroundColor: theme.dark ? "rgba(48, 55, 63, 1)" : "#fff",
            borderRadius:7,
            borderWidth:1,
            borderColor:"#ccc"
        }} activeOpacity={1} onPress={() => navigation.navigate("SingleCourse", {
            slug : course.slug
        })}>

            <View style={{
                width: CARDWIDTH,
                height: CARDHEIGHT,
                borderRadius:10,
                borderTopLeftRadius : 7,
                borderTopRightRadius: 7
            }}>
                <ProgressImage
                    source={{
                        uri: course.image
                    }}
                    style={{
                        width: CARDWIDTH,
                        height: CARDHEIGHT,
                        borderTopLeftRadius : 7,
                        borderTopRightRadius: 7
                    }}
                    resizeMode="cover"
                    imageStyle={{
                        borderTopLeftRadius : 7,
                        borderTopRightRadius: 7
                    }}
                />
            </View>

            <View style={{
                padding : 10
            }}>
                <Text numberOfLines={2} style={[styles.title, {
                    color : theme.colors.onBackground
                }]}>{course.name}</Text>

                <Rating
                    value={course.rating.value}
                    total={course.rating.total}
                    small
                    style={{
                        marginTop:5
                    }}
                />

                {
                    course?.progress ? <CourseProgress 
                        progress={course?.progress}
                    /> : null
                }

                <TouchableOpacity
                    style={{
                        borderWidth:1,
                        borderColor : theme.colors.primary,
                        borderRadius:6,
                        marginTop:10,
                        padding: half ? 5 : 7,
                        marginBottom:5
                    }}
                    activeOpacity={1}
                    onPress={() => navigation.navigate("SingleCourse", {
                        slug : course.slug
                    })}
                >
                    <Text style={{
                        color : theme.colors.primary,
                        textAlign:"center",
                        fontSize : half ? 12 : 16
                    }}>View Course</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    title : {
        fontSize:15,
        fontWeight:"500",
        color : "#000"
    }
})