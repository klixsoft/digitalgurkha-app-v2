import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { memo, useContext } from 'react'
import { CourseCardType } from '../../constants/types'
import ProgressImage from '../ProgressImage'
import Price from './Price'
import { useTheme } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import Rating from '../Rating'
import { WIDTH } from '../../constants'
import { ToastMessage } from '../../constants/Functions'
import { AppContext } from '../../constants/context'

const CourseCard = ({ course, half = false, twohalf=false }: {
    course: CourseCardType,
    half?: boolean,
    twohalf?:boolean
}) => {
    const theme = useTheme();
    const navigation = useNavigation();
    const { hasNetwork } = useContext(AppContext);

    let CARDWIDTH = 200;
    let CARDHEIGHT = 160;

    if(twohalf){
        CARDWIDTH = WIDTH / 2.4 - 10;
        CARDHEIGHT = 185 / 330 * CARDWIDTH;
    }else if( half ){
        CARDWIDTH = WIDTH / 2 - 20;
        CARDHEIGHT = 185 / 330 * CARDWIDTH;
    }
    
    return (
        <TouchableOpacity style={{
            marginRight: twohalf ? 10 : 15,
            marginBottom:10,
            width: CARDWIDTH,
            // backgroundColor: theme.dark ? "rgba(48, 55, 63, 1)" : "#fff",
            borderRadius:7,
            borderWidth:1,
            borderColor:"#ccc"
        }} activeOpacity={1} onPress={() => {
            if( hasNetwork ){
                navigation.navigate("SingleCourse", {
                    slug : course.slug
                })
            }else{
                ToastMessage("error", "No Internet Connection");
            }
        }}>

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
                padding : 10,
                paddingBottom:15
            }}>
                <Text numberOfLines={2} style={[styles.title, {
                    color : theme.colors.onBackground,
                    fontSize: twohalf ? 14 : 15
                }]}>{course.name}</Text>

                <Rating
                    value={course.rating.value}
                    total={course.rating.total}
                    small
                    style={{
                        marginTop:5
                    }}
                />

                {!twohalf && <View style={{
                    flexDirection : "row",
                    alignItems: "center",
                    justifyContent : "space-between",
                    marginVertical:7
                }}>
                    <Text style={{
                        fontSize : half ? 12 : 16
                    }}>{course.instructor}</Text>
                    <Text style={{
                        fontSize : half ? 12 : 16
                    }}>{course.duration}</Text>
                </View>}

                {twohalf && <View style={{
                    marginTop:5
                }} />}
                <Price
                    sale={course.saleprice}
                    price={course.price}
                    small={twohalf}
                />

                <TouchableOpacity
                    style={{
                        borderWidth:1,
                        borderColor : theme.colors.primary,
                        borderRadius:6,
                        marginTop:10,
                        padding: half || twohalf ? 5 : 7
                    }}
                    activeOpacity={1}
                    onPress={() => navigation.navigate("SingleCourse", {
                        slug : course.slug
                    })}
                >
                    <Text style={{
                        color : theme.colors.primary,
                        textAlign:"center",
                        fontSize : half || twohalf ? 13 : 16
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

export default memo(CourseCard);