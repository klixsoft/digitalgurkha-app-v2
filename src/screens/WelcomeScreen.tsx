import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import ProgressImage from '../components/ProgressImage';
import FontAwesome from "react-native-vector-icons/FontAwesome"

export default function WelcomeScreen() {
    const theme = useTheme();
    const navigation = useNavigation();

    return (
        <View style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
            paddingVertical: 40
        }}>
            <View />

            <ProgressImage
                style={{
                    height: 200,
                }}
                resizeMode="contain"
                source={require("../assets/logo.png")}
            />

            <View
                style={{
                    paddingHorizontal: 20,
                    paddingTop: 60,
                    flexDirection: "row",
                    justifyContent : "center",
                    alignItems : "center",
                    flexWrap : "wrap"
                }}
            >
                <Text style={{
                    fontSize:17,
                    fontWeight:"400",
                    textAlign:"center",
                    marginBottom:35,
                    color : "#757373"
                }}>Let's get started</Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate("OnBoarding")}
                    style={{
                        width : "100%",
                        borderRadius:5,
                        flexDirection : "row",
                        alignItems : "center",
                        justifyContent : "center",
                        backgroundColor:theme.colors.primary,
                        paddingVertical:10
                    }}
                    activeOpacity={0.6}
                >
                    <Text style={{
                        color : theme.colors.onPrimary,
                        fontSize:17,
                        marginRight:10
                    }}>Continue</Text>
                    <FontAwesome size={17} color={theme.colors.onPrimary} name="long-arrow-right"  />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({})