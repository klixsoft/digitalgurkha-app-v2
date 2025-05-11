import { Alert, Keyboard, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button, TextInput, useTheme } from 'react-native-paper'
import MaterialIcons from "react-native-vector-icons/MaterialIcons"

import ProgressImage from '../components/ProgressImage';
import { useNavigation } from '@react-navigation/native'
import { LoginDetailType } from '../constants/types'
import { AppContext } from '../constants/context'
import axios from 'axios'
import { ExceptionHandler, ToastMessage } from '../constants/Functions'
import { GoogleSignin, User, statusCodes } from '@react-native-google-signin/google-signin'
import { CONFIG } from '../constants'

export default function RegisterScreen() {
    const theme = useTheme();
    const navigation = useNavigation();

    const [fname, setFname] = useState<string>("");
    const [lname, setLname] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState(false);

    const [cpassword, setCPassword] = useState<string>("");
    const [showCPassword, setShowCPassword] = useState(false);

    const { signIn, setSpinner, playerID } = React.useContext(AppContext);

    const validateWebsite = (args: LoginDetailType) => {
        setSpinner(true);

        //dismiss the keyboard
        Keyboard.dismiss();

        axios.post(CONFIG.API.LOGIN, args).then((res) => {
            signIn(res.data);
        }).catch((error) => {
            const { title, message } = ExceptionHandler(error);
            ToastMessage("error", message, title);
        }).finally(() => {
            setSpinner(false);
        })
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
                            profile: value.user.photo
                        });
                    }).catch((e) => {
                        if (e.code === statusCodes.SIGN_IN_CANCELLED) {
                            ToastMessage("error", "Unable to continue with Google because user cancel the process.", "Error");
                        } else if (e.code === statusCodes.IN_PROGRESS) {
                            ToastMessage("success", "Signing In . . .");
                        } else if (e.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                            ToastMessage("error", "Play Service is not available to complete the process.", "Error");
                        } else {
                            ToastMessage("error", "Unable to continue with Google. Try Different method", "Error");
                        }
                    });
                } else {
                    Alert.alert("NOT AVAILABLE", "Google Play Services is not available on your device. Please try on another device!!!");
                }
            })
        } catch (error) {
            ToastMessage("error", "Unable to continue with Google. Try Different method", "Error");
        }
    };

    const proceedForRegister = () => {
        if (fname.length <= 0) {
            ToastMessage("error", "First Name is Required!!!", "Error");
            return;
        }

        if (email.length <= 0) {
            ToastMessage("error", "Please provide valid email address!!!", "Error");
            return;
        }

        if (password.length <= 0) {
            ToastMessage("error", "Please provide password!!!", "Error");
            return;
        }

        if (cpassword.length <= 0) {
            ToastMessage("error", "Please provide comfirm password!!!", "Error");
            return;
        }

        if (cpassword !== password) {
            ToastMessage("error", "Password doesn't match!!!", "Error");
            return;
        }

        validateWebsite({
            email: email,
            password: password,
            name: fname + " " + lname,
            type: "custom",
            playerID: playerID
        });
    }

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: '1094116562067-dkis5kc46eu7o5t38mhkfuguppevg6vu.apps.googleusercontent.com',
            offlineAccess: true,
            forceCodeForRefreshToken: true
        });
    }, [])

    return (
        <ScrollView
            style={{
                padding: 20
            }}
        >
            <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom:50
            }}>
                <MaterialIcons
                    name="arrow-back"
                    size={28}
                    onPress={() => navigation.goBack()}
                />

                <Text style={{
                    fontSize: 18,
                    fontWeight: "500"
                }}>Sign Up</Text>

                <View />
            </View>

            <View>
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 20
                }}>
                    <TextInput
                        value={fname}
                        mode="outlined"
                        label="First Name"
                        style={{
                            width: "48%"
                        }}
                        onChangeText={(text) => setFname(text)}
                        outlineColor={theme.colors.primary}
                        outlineStyle={{
                            borderWidth: 2
                        }}
                    />

                    <TextInput
                        value={lname}
                        mode="outlined"
                        label="Last Name"
                        style={{
                            width: "48%"
                        }}
                        onChangeText={(text) => setLname(text)}
                        outlineColor={theme.colors.primary}
                        outlineStyle={{
                            borderWidth: 2
                        }}
                    />
                </View>

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
                    style={{
                        marginBottom: 20
                    }}
                />

                <TextInput
                    value={cpassword}
                    mode="outlined"
                    label="Confirm Password"
                    secureTextEntry={!showCPassword}
                    onChangeText={(text) => setCPassword(text)}
                    right={<TextInput.Icon
                        icon={showCPassword ? "eye" : "eye-off"}
                        onPress={() => setShowCPassword(!showCPassword)}
                    />}
                    outlineColor={theme.colors.primary}
                    outlineStyle={{
                        borderWidth: 2
                    }}
                    style={{
                        marginBottom: 20
                    }}
                />
            </View>

            <Text style={{
                fontSize:16,
                lineHeight:24
            }}>By signing up, I agree with the website's <Text style={{
                fontWeight:"500"
            }}>Terms and conditions</Text></Text>

            <Button
                mode="contained"
                labelStyle={{
                    paddingVertical: 5
                }}
                style={{
                    marginVertical: 30,
                    borderRadius:5
                }}
                onPress={proceedForRegister}
            >Create Account</Button>

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
        marginTop: 30,
        marginLeft: 15,
        marginRight: 15,
        alignItems: 'center'
    }
})