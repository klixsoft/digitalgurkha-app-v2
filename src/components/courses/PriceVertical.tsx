import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useTheme } from 'react-native-paper'

export default function PriceVertical({ sale = 0, price, small = false }: {
    sale: number,
    price: number,
    small?: boolean
}) {
    const theme = useTheme();

    return (
        <View>
            <Text style={{
                color: "#000",
                fontWeight: "bold",
                fontSize: small ? 18 : 22,
                textAlign:"center",
                margin : 0
            }}>Rs {price > 0 ? sale > 0 ? sale : price : "Free"}</Text>

            {
                sale > 0 ? <Text style={{
                    textDecorationLine: "line-through",
                    fontSize: small ? 15 : 16,
                    marginRight: 5,
                    color: theme.dark ? theme.colors.onBackground : "rgba(0, 0, 0, 0.3)",
                    textAlign:"center",
                    margin : 0
                }}>Rs {sale > 0 ? price : sale}</Text> : null
            }
        </View>
    )
}

const styles = StyleSheet.create({})