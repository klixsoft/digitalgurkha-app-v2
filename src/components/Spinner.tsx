import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, useTheme } from 'react-native-paper'
import { HEIGHT, WIDTH } from '../constants';
import LottieView from 'lottie-react-native';

export default function Spinner({
    visible = false,
    text = "Please Wait"
}: {
    visible: boolean,
    text?: string;
}) {
    if (!visible) return null;
    const theme = useTheme();
    
    return (
        <View style={styles.container}>
            <View style={[styles.waitcontainer, {
                backgroundColor: theme.dark ? "rgba(48, 55, 63, 1)" : "#fff",
                justifyContent : "center",
                flexDirection:"column",
                alignItems:"center"
            }]}>
                <Text style={[styles.waittext, {
                    color : theme.colors.onBackground
                }]}>{text}</Text>

                <LottieView
                    source={require("../assets/loading.lottie")}
                    style={{
                        width : WIDTH / 2,
                        height : 60,
                        marginBottom: 15
                    }}
                    autoPlay
                    loop
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    waittext: {
        textAlign: "center",
        fontSize: 17,
        color: "#000",
        marginBottom: 25,
        fontWeight:"bold",
        textTransform:"uppercase",
        letterSpacing:2
    },
    waitcontainer: {
        flexDirection: "column",
        justifyContent: "center",
        alignContent: "center",
        backgroundColor: "#fff",
        marginHorizontal: 20,
        borderRadius: 10,
        paddingVertical: 20
    },
    container: {
        position: "absolute",
        width: WIDTH,
        height: HEIGHT,
        flex: 1,
        justifyContent: "center",
        alignContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.3)"
    }
})