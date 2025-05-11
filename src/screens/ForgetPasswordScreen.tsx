import { Alert, Keyboard, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Button, TextInput, useTheme } from 'react-native-paper'
import Ionicons from "react-native-vector-icons/Ionicons"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import FontAwesome6 from "react-native-vector-icons/FontAwesome6"

import ProgressImage from '../components/ProgressImage';
import { CONFIG, WIDTH } from '../constants';
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import { ExceptionHandler, ToastMessage } from '../constants/Functions'
import { AppContext } from '../constants/context'

export default function ForgetPasswordScreen() {
    const theme = useTheme();
    const navigation = useNavigation();

    const { setSpinner } = React.useContext(AppContext);

    const [email, setEmail] = useState<string>("");

    const processForgetPassword = () => {
        if( email.length <= 0 ){
            ToastMessage("error", "Please provide email address!!!", "error");
            return;
        }

        Keyboard.dismiss();
        setSpinner(true);

        axios.post(CONFIG.API.FORGETPASS, {
            email : email
        }).then((res : any) => {
            setSpinner(false);
            Alert.alert("Success", res.data.message, [
                {
                    text : "OK",
                    onPress : () => {
                        setEmail("");
                    }
                }
            ])
        }).catch((error) => {
            const { title, message } = ExceptionHandler(error);
            ToastMessage("error", message, title);
            setSpinner(false);
        })
    }
    
    return (
        <View
            style={{
                padding: 20
            }}
        >
            <MaterialIcons
                name="arrow-back"
                size={30}
                onPress={() => navigation.goBack()}
            />

            <View
                style={{
                    marginVertical: 30
                }}
            >
                <Text
                    style={{
                        fontSize: 30,
                        textAlign: "center",
                        marginBottom:10,
                        color: theme.colors.primary
                    }}
                >Forget Password!</Text>
                <Text
                    style={{
                        fontSize: 17,
                        textAlign: "center",
                    }}
                >Lost your password? Please enter your username or email address. You will receive a link to create a new password via email.</Text>
            </View>
            <View
                style={{
                    marginVertical: 10,
                }}
            >
                <TextInput
                    value={email}
                    mode="outlined"
                    label="Username or Email"
                    focusable
                    style={{
                        marginBottom: 10
                    }}
                    onChangeText={(text) => setEmail(text)}
                    outlineColor={theme.colors.primary}
                    outlineStyle={{
                        borderWidth: 2
                    }}
                />
            </View>

            <Button
                mode="contained"
                labelStyle={{
                    paddingVertical: 5,
                    fontSize: 17
                }}
                style={{
                    borderRadius:5
                }}
                onPress={processForgetPassword}
            >Reset Password</Button>
        </View>
    )
}

const styles = StyleSheet.create({
    socialLoginBtn: {
        padding: 15,
        backgroundColor: "#fff",
        borderRadius: 10 / 2,
        marginHorizontal: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 1.84,
        elevation: 3,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        marginBottom: 15
    },
    socialLoginBtnText: {
        marginLeft: 15,
        fontSize: 19,
        color: "rgba(0, 0, 0, 0.54)",
        fontWeight: "500"
    }
})