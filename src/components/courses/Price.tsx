import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useTheme } from 'react-native-paper'

export default function Price({ sale = 0, price, small=false }: {
    sale: number,
    price: number,
    small?: boolean
}) {
    const theme = useTheme();

    return (
        <View style={{
            flexDirection : "row",
            alignItems : "center"
        }}>
            {
                sale > 0 ? <Text style={{
                    textDecorationLine : "line-through",
                    fontSize: small ? 15 : 18,
                    marginRight:5,
                    color : theme.dark ? theme.colors.onBackground : "rgba(0, 0, 0, 0.3)"
                }}>Rs {sale > 0 ? price : sale}</Text> : null
            }
            
            <Text style={{
                color : theme.colors.primary,
                fontWeight:"bold",
                fontSize: small ? 15 : 18
            }}>{price > 0 ? sale > 0 ? sale : price : "Free"}</Text>
        </View>
    )
}

const styles = StyleSheet.create({})