import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import BackMenu from '../../components/BackMenu'
import { Button, TextInput, useTheme } from 'react-native-paper'
import { ScrollView } from 'react-native-gesture-handler';
import axios from 'axios';
import { ExceptionHandler, ToastMessage } from '../../constants/Functions';
import { CONFIG } from '../../constants';
import axiosInstance from '../../constants/axiosInstance';

export default function ChangePassword() {
    const theme = useTheme();

    const [currentPassword, setcurrentPassword] = useState<string>("");
    const [currentPasswordShow, setCurrentPasswordShow] = useState<boolean>(false);

    const [newPassword, setNewPassword] = useState<string>("");
    const [newPasswordShow, setNewPasswordShow] = useState<boolean>(false);

    const [cPassword, setCPassword] = useState<string>("");
    const [cPasswordShow, setCPasswordShow] = useState<boolean>(false);

    const [loading, setLoading] = useState(false);

    const changePassword = async () => {
        if( currentPassword.length <= 0 ){
            ToastMessage("error", "Current Password Should not be empty!!!", "Error");
            return;
        }

        if( newPassword.length <= 0 ){
            ToastMessage("error", "New Password Should not be empty!!!", "Error");
            return;
        }

        if( cPassword.length <= 0 ){
            ToastMessage("error", "Confirm Password Should not be empty!!!", "Error");
            return;
        }

        if( cPassword != newPassword ){
            ToastMessage("error", "New and Confirm password doesnot match!!!", "Error");
            return;
        }

        setLoading(true);
        await axiosInstance.post(CONFIG.API.CHANGE_PASSWORD, {
            current_password: currentPassword,
            new_password: newPassword,
            confirm_password: cPassword
        }).then((res) => {
            ToastMessage("success", "Password changed Successfully!!!", "Success");
            setcurrentPassword("");
            setNewPassword("");
            setCPassword("");
            setLoading(false);
        }).catch((error) => {
            const {title, message} = ExceptionHandler(error);
            ToastMessage("error", message, title);
            setLoading(false);
        })
    }

    return (
        <BackMenu
            title="Change Password"
        >
            <ScrollView contentContainerStyle={{
                padding: 15
            }}>
                <TextInput
                    value={currentPassword}
                    mode="outlined"
                    label="Current Password"
                    secureTextEntry={!currentPasswordShow}
                    onChangeText={setcurrentPassword}
                    right={<TextInput.Icon
                        icon={currentPasswordShow ? "eye" : "eye-off"}
                        onPress={() => setCurrentPasswordShow(!currentPasswordShow)}
                    />}
                    outlineColor={theme.colors.primary}
                    outlineStyle={{
                        borderWidth: 2
                    }}
                    style={{
                        marginBottom: 30
                    }}
                    disabled={loading}
                />

                <TextInput
                    value={newPassword}
                    mode="outlined"
                    label="New Password"
                    secureTextEntry={!newPasswordShow}
                    onChangeText={setNewPassword}
                    right={<TextInput.Icon
                        icon={newPasswordShow ? "eye" : "eye-off"}
                        onPress={() => setNewPasswordShow(!newPasswordShow)}
                    />}
                    outlineColor={theme.colors.primary}
                    outlineStyle={{
                        borderWidth: 2
                    }}
                    disabled={loading}
                    style={{
                        marginBottom: 30
                    }}
                />


                <TextInput
                    value={cPassword}
                    mode="outlined"
                    label="Confirm Password"
                    secureTextEntry={!cPasswordShow}
                    onChangeText={setCPassword}
                    right={<TextInput.Icon
                        icon={cPasswordShow ? "eye" : "eye-off"}
                        onPress={() => setCPasswordShow(!cPasswordShow)}
                    />}
                    disabled={loading}
                    outlineColor={theme.colors.primary}
                    outlineStyle={{
                        borderWidth: 2
                    }}
                    style={{
                        marginBottom: 30
                    }}
                />

                <Button
                    mode="contained"
                    onPress={changePassword}
                    disabled={loading}
                    loading={loading}
                >{loading ? "Changing Password . . ." : "Change Password"}</Button>
            </ScrollView>
        </BackMenu>
    )
}

const styles = StyleSheet.create({})