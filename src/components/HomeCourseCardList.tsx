import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { CourseCardType, courseListInfo } from '../constants/types';
import CourseCard from './courses/CourseCard';
import { useTheme } from 'react-native-paper';
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { useNavigation } from '@react-navigation/native';

export default function HomeCourseCardList({
    data 
} : {
    data : courseListInfo
}) {
    const navigation = useNavigation();
    const theme = useTheme();

    const renderCourseItem = ({item} : {item : CourseCardType}) => {
        return <CourseCard 
            course={item}
            twohalf
        />
    }

    return (
        <View style={{
            marginTop:10
        }}>
            <View style={{
                flexDirection : "row",
                alignItems : "center",
                justifyContent : "space-between"
            }}>
                <Text style={[styles.header, {
                    color : theme.colors.onBackground
                }]}>{data.title}</Text>

                {data.navigation && <TouchableOpacity style={{
                    flexDirection : "row",
                    alignItems : "center",
                    justifyContent : "flex-start",
                    gap : 0
                }} onPress={() => {
                    if( data.navigation ){
                        navigation.navigate(data.navigation?.screen, data.navigation.args);
                    }
                }}>
                    <Text style={{
                        fontSize:13,
                        fontWeight:"500"
                    }}>View All</Text>
                    <MaterialIcons name="keyboard-arrow-right" size={19} />
                </TouchableOpacity>}
            </View>

            <FlatList
                data={data.courses}
                keyExtractor={(item) => `course_card_${item.id}`}
                renderItem={renderCourseItem}
                horizontal
                contentContainerStyle={{
                    marginTop:15
                }}
                showsHorizontalScrollIndicator={false}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        fontSize: 20,
        color: "#000",
        fontWeight: "500"
    }
})