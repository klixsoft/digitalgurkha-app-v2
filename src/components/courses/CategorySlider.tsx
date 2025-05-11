import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { memo, useContext } from 'react'
import { AppTheme, CategoryType } from '../../constants/types'
import { FlatList } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import { useTheme } from 'react-native-paper'
import { AppContext } from '../../constants/context'
import { ToastMessage } from '../../constants/Functions'

const CategorySlider = ({ data }: {
    data: CategoryType[]
}) => {
    const navigation = useNavigation();
    const theme = useTheme<AppTheme>();
    const { hasNetwork } = useContext(AppContext);

    const colorcodes = [
        "#1564CD",
        "#019BFE",
        "#27AC94",
        "#6AC28C",
        "#8ED26B"
    ]

    function getColorAtIndex(index : number) {
        const adjustedIndex = index % colorcodes.length;
        return colorcodes[adjustedIndex];
    }

    return (
        <FlatList
            data={data}
            horizontal
            keyExtractor={(item) => `category_${item.id}`}
            renderItem={({item, index}) => {
                return(
                    <TouchableOpacity 
                        activeOpacity={0.5} 
                        key={item.id} 
                        style={[styles.category, {
                            borderColor : getColorAtIndex(index),
                            backgroundColor : getColorAtIndex(index)
                        }]}
                        onPress={() => {
                            if( hasNetwork ){
                                navigation.navigate("CoursesByCategory", {
                                    category: item
                                })
                            }else{
                                ToastMessage("error", "No Internet Connection");
                            }
                        }}
                    >
                        <Text style={[styles.label, {
                            color : theme.dark ? theme.colors.onSecondaryContainer : "#fff"
                        }]}>{item.name}</Text>
                    </TouchableOpacity>
                )
            }}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
                marginTop:20
            }}
        />
    )
}

const styles = StyleSheet.create({
    category : {
        borderRadius : 10,
        borderWidth:1,
        borderColor:"#fff",
        paddingVertical:7,
        paddingHorizontal:20,
        marginRight:5
    },
    label : {
        color : "#fff"
    }
})

export default memo(CategorySlider);