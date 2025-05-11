import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Ionicons from "react-native-vector-icons/Ionicons"
import { TouchableOpacity } from 'react-native-gesture-handler'
import { TouchableRipple } from 'react-native-paper'

export default function MenuList({
    title,
    onPress = () => {},
    icon
} : {
    title : string,
    icon : string,
    onPress?: () => void
}) {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.9}
            style={styles.menu}
        >
            <View style={{
                flexDirection : "row",
                alignItems : "center",
                gap : 15
            }}>
                <Ionicons size={22} name={icon}/>
                <Text style={{
                    fontSize : 18
                }}>{title}</Text>
            </View>
            <Ionicons size={25} name="chevron-forward-outline"/>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    menu : {
        flexDirection : "row",
        alignItems : "center",
        justifyContent : "space-between",
        marginBottom:30
    }
})