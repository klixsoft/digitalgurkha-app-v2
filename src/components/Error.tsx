import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ProgressImage from './ProgressImage';
import { Button, useTheme } from 'react-native-paper';
import LottieView from 'lottie-react-native';
import { WIDTH } from '../constants';

type ErrorType = {
    title : string;
    message : string;
    button?: {
        text : string;
        onPress : () => void;
    }
}

export default function Error({
    title,
    message,
    button={
        text : "",
        onPress : () => {}
    }
} : ErrorType) {
    const theme = useTheme();

    return (
        <View style={{
            flexDirection : "column",
            alignItems : "center",
            justifyContent: "center"
        }}>
            {/* <ProgressImage
                source={require("../assets/error.png")}
                style={{
                    width : 200,
                    height : 200
                }}
            /> */}
            <LottieView
                source={require("../assets/error.lottie")}
                style={{
                    width : WIDTH / 1.7,
                    height : WIDTH / 1.7
                }}
                autoPlay
                loop
            />

            <Text style={[styles.title, {
                color : theme.dark ? "rgba(255, 255, 255, 0.7)" : "#000"
            }]}>{title}</Text>
            <Text style={styles.message}>{message}</Text>

            {button?.text ? <Button
                mode="contained"
                style={{
                    borderColor : theme.colors.primary,
                    borderRadius:5,
                    marginTop:20,
                    minWidth : "50%"
                }}
                onPress={button?.onPress}
            >{button?.text}</Button> : null}
        </View>
    )
}

const styles = StyleSheet.create({
    title : {
        fontWeight:"bold",
        fontSize:25,
        color : "#000",
        textAlign:"center"
    },
    message : {
        fontSize:18,
        marginVertical:15,
        textAlign:"center"
    }
})