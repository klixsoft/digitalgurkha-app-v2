import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useTheme } from 'react-native-paper'
import { AppTheme } from '../../constants/types'

type CourseListContentProps = {
    title : string,
    data : string[],
    theme : AppTheme
}

export default function CourseListContent({ title, data, theme } : CourseListContentProps) {
    
    if( data.length > 0 ){
        return (
            <View style={{
                marginBottom:20
            }}>
                <Text style={{
                    marginBottom: 15,
                    fontWeight: "bold",
                    color: theme.dark ? theme.colors.onBackground : "#000",
                    fontSize: 18,
                    textAlign: "center"
                }}>{title}</Text>
    
                <View>
                    {data.map((item, index) => (
                        <Text 
                            key={`${title}_${item}_${index}`} 
                            style={[styles.list, {
                                borderBottomWidth : data.length > (index + 1) ? 1 : 0
                            }]}
                        >{item}</Text>
                    ))}
                </View>
            </View>
        )
    }

    return <View />
}

const styles = StyleSheet.create({
    list : {
        fontSize:17,
        marginBottom:15,
        borderBottomWidth:1,
        borderBottomColor:"#555",
        paddingBottom : 15
    }
})