import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { CourseCardType } from '../constants/types';
import CourseCard from './courses/CourseCard';

export default function HomeNewCourseCardList() {
    const [data, setdata] = useState<CourseCardType[]>([
        {
            id : 3,
            name : "Microsoft Excel Course: From Zero to Hero",
            image : "https://digitalgurkha.com/wp-content/uploads/2023/05/ms-excel-1a.jpg",
            instructor : "Apee Regmi",
            saleprice : 300,
            price : 200,
            rating : {
                value : 4.8,
                total : 300
            },
            duration : "2h 47m"
        },
        {
            id : 2,
            name : "Advanced SEO Keyword Research [ Learn All the Secrets]",
            image : "https://digitalgurkha.com/wp-content/uploads/2022/05/keyword-reserach.jpg",
            instructor : "Apee Regmi",
            saleprice : 300,
            price : 200,
            rating : {
                value : 4.8,
                total : 300
            },
            duration : "2h 47m"
        },
        {
            id : 1,
            name : "Content Writing: Write an Article with me in 3 hours",
            image : "https://digitalgurkha.com/wp-content/uploads/2022/03/WhatsApp-Image-2022-03-21-at-10.34.45-PM.jpeg",
            instructor : "Apee Regmi",
            saleprice : 300,
            price : 200,
            rating : {
                value : 4.8,
                total : 300
            },
            duration : "2h 47m"
        }
    ]);

    const renderCourseItem = ({item} : {item : CourseCardType}) => {
        return <CourseCard 
            course={item}
        />
    }

    return (
        <View style={{
            marginTop:20
        }}>
            <Text style={styles.header}>Free Courses</Text>

            <FlatList
                data={data}
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