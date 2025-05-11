import { Animated, StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import React from 'react'

type onboradingType = {
    title: string,
    message: string
}

type PaginatorProps = {
    data: onboradingType[],
    scrollX : Animated.Value,
    backgroundColor : string
}

export default function Paginator({
    data,
    scrollX,
    backgroundColor
}: PaginatorProps) {
    const { width } = useWindowDimensions();
    return (
        <View style={{ flexDirection: "row" }}>
            {
                data.map((item, i) => {
                    const inputRange = [(i-1) * width, i * width, (i+1) * width];
                    const dotWidth = scrollX.interpolate({
                        inputRange,
                        outputRange : [7, 15, 7],
                        extrapolate : "clamp"
                    });

                    const opacity = scrollX.interpolate({
                        inputRange,
                        outputRange : [0.3, 1, 0.3],
                        extrapolate : "clamp"
                    });

                    return(
                        <Animated.View style={[styles.dot, {
                            width : dotWidth,
                            opacity,
                            backgroundColor
                        }]} key={i.toString()} />
                    )
                })
            }
        </View>
    )
}

const styles = StyleSheet.create({
    dot : {
        height : 7,
        borderRadius:50,
        marginHorizontal:5
    }
})