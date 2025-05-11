import { Alert, Keyboard, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button, TextInput, useTheme } from 'react-native-paper'

import ProgressImage from '../components/ProgressImage';
import { useNavigation } from '@react-navigation/native'
import { ExceptionHandler, ToastMessage, isJson } from '../constants/Functions'
import axios from 'axios'
import { AppContext } from '../constants/context'
import {
    GoogleSignin,
    User,
    statusCodes,
} from '@react-native-google-signin/google-signin';
import { LoginDetailType } from '../constants/types'
import { CONFIG } from '../constants'

export default function LoginScreen() {
    const theme = useTheme();
    const navigation = useNavigation();

    const { signIn, setSpinner, playerID } = React.useContext(AppContext);

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const validateWebsite = (args: LoginDetailType) => {
        setSpinner(true);

        //dismiss the keyboard
        Keyboard.dismiss();

        axios.post(CONFIG.API.LOGIN, args).then((res) => {
            if( isJson( res.data ) ){
                signIn(res.data);
            }else{
                ToastMessage("error", "Something went wrong!!!", "Error");
            }
        }).catch((error) => {
            const { title, message } = ExceptionHandler(error);
            ToastMessage("error", message, title);
        }).finally(() => {
            setSpinner(false);
        })
    }

    const proceedForLogin = () => {
        if (email.length <= 0) {
            ToastMessage("error", "Please provide valid email address!!!", "Error");
            return;
        }

        if (password.length <= 0) {
            ToastMessage("error", "Please provide password!!!", "Error");
            return;
        }

        validateWebsite({
            email: email,
            password: password,
            type: "custom",
            playerID: playerID
        });
    }

    const _signIn = async () => {
        try {
            GoogleSignin.hasPlayServices().then(async (value: boolean) => {
                if (value) {
                    await GoogleSignin.signOut();
                    GoogleSignin.signIn().then((value: User) => {
                        validateWebsite({
                            email: value.user.email,
                            name: value.user.name,
                            type: "google",
                            playerID: playerID,
                            profile: value.user.photo,
                            loginID: value.user.id
                        });
                    }).catch((e) => {
                        if (e.code === statusCodes.SIGN_IN_CANCELLED) {
                            ToastMessage("error", "Unable to continue with Google because user cancel the process.");
                        } else if (e.code === statusCodes.IN_PROGRESS) {
                            ToastMessage("success", "Signing In . . .");
                        } else if (e.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                            ToastMessage("error", "Play Service is not available to complete the process.");
                        } else {
                            ToastMessage("error", "Unable to continue with Google. Try Different method");
                        }
                    });
                } else {
                    Alert.alert("NOT AVAILABLE", "Google Play Services is not available on your device. Please try on another device!!!");
                }
            })
        } catch (error) {
            ToastMessage("error", "Unable to continue with Google. Try Different method");
        }
    };

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: '1094116562067-dkis5kc46eu7o5t38mhkfuguppevg6vu.apps.googleusercontent.com',
            offlineAccess: true,
            forceCodeForRefreshToken: true
        });
    }, [])

    return (
        <ScrollView contentContainerStyle={{
            padding: 20
        }} keyboardShouldPersistTaps="handled">
            <View
                style={{
                    marginVertical: 30
                }}
            >
                <Text
                    style={{
                        fontSize: 20,
                        textAlign: "center",
                        fontWeight: "500",
                        color: theme.colors.onBackground
                    }}
                >Sign In</Text>
            </View>

            <View style={{
                marginBottom: 20
            }}>
                <TextInput
                    value={email}
                    mode="outlined"
                    label="Email"
                    style={{
                        marginBottom: 20
                    }}
                    onChangeText={(text) => setEmail(text)}
                    outlineColor={theme.colors.primary}
                    outlineStyle={{
                        borderWidth: 2
                    }}
                />

                <TextInput
                    value={password}
                    mode="outlined"
                    label="Password"
                    secureTextEntry={!showPassword}
                    onChangeText={(text) => setPassword(text)}
                    right={<TextInput.Icon
                        icon={showPassword ? "eye" : "eye-off"}
                        onPress={() => setShowPassword(!showPassword)}
                    />}
                    outlineColor={theme.colors.primary}
                    outlineStyle={{
                        borderWidth: 2
                    }}
                />
            </View>

            <TouchableOpacity
                onPress={() => navigation.navigate("ForgetPassword")}
                activeOpacity={1}
            >
                <Text
                    style={{
                        fontSize: 16,
                        color: theme.colors.primary,
                        alignSelf: "flex-end",
                    }}
                >
                    Forgot your password ?
                </Text>
            </TouchableOpacity>

            <Text style={{
                fontSize: 17,
                textAlign: "center",
                marginTop: 50
            }}>OR</Text>

            {/* Line */}
            <View style={styles.lineStyle}>
                <View style={{ flex: 1, height: 1, backgroundColor: '#ccc' }} />
                <View>
                    <Text style={{ width: 120, textAlign: 'center', fontSize:17 }}>Sign In using</Text>
                </View>
                <View style={{ flex: 1, height: 1, backgroundColor: '#ccc' }} />
            </View>

            <TouchableOpacity style={{
                flexDirection : "row",
                alignItems : "center",
                justifyContent : "center",
                marginTop:20
            }} onPress={_signIn}>
                <ProgressImage
                    source={require("../assets/google.png")}
                    style={{
                        width: 30,
                        height: 30
                    }}
                />
            </TouchableOpacity>

            <Button
                mode="contained"
                style={{
                    marginTop: 50,
                    borderRadius:5
                }}
                onPress={proceedForLogin}
            >Sign In</Button>

            <View style={{
                flexDirection : "row",
                alignItems:"center",
                justifyContent:"center",
                gap : 5,
                marginTop:20
            }}>
                <Text style={{
                    fontSize:16,
                    fontWeight:"400",
                    color : "#888"
                }}>Need An Account?</Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate("Register")}
                >
                    <Text style={{
                        fontSize:16,
                        fontWeight:"400",
                        color : theme.colors.primary
                    }}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
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
    },
    lineStyle: {
        flexDirection: 'row',
        marginTop: 20,
        marginLeft: 15,
        marginRight: 15,
        alignItems: 'center'
    }
})