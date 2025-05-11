import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { CourseReviewSingleType } from '../constants/types'
import ProgressImage from './ProgressImage'
import Rating from './Rating'
import { Card, useTheme } from 'react-native-paper'

export default function ReviewCard({ item, index }: {
    item: CourseReviewSingleType,
    index: number
}) {
    const theme = useTheme();

    return (
        <View style={{
            marginBottom:20,
            backgroundColor: theme.dark ? "rgba(48, 55, 63, 1)" : "#fff",
            padding : 10,
            borderRadius:10
        }}>
            <View style={{
                flexDirection : "row",
                alignItems : "flex-start",
                justifyContent : "flex-start",
                gap : 15
            }}>
                <ProgressImage
                    source={{
                        uri : item.image
                    }}
                    style={{
                        width : 50,
                        height : 50
                    }}
                    imageStyle={{
                        borderRadius : 100,
                        overflow : "hidden"
                    }}
                />

                <View style={{
                    width : "80%"
                }}>
                    <Text style={{
                        fontSize:16,
                        fontWeight:"500"
                    }}>{item.name}</Text>
                    <View style={{
                        flexDirection : "row",
                        alignItems : "center",
                        justifyContent : "space-between"
                    }}>
                        <Rating
                            onlyStar
                            value={item.rating}
                            small
                        />
                        <Text>{item.ago}</Text>
                    </View>
                </View>
            </View>

            {item.message && <Text style={{
                marginTop:10,
                fontSize:16
            }}>{item.message}</Text>}
        </View>
    )
}

const styles = StyleSheet.create({})