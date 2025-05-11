import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Divider, Menu, useTheme } from 'react-native-paper'
import ProgressImage from './ProgressImage'
import { openInBrowser } from '../constants/Functions'
import { CONFIG } from '../constants'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import { AppContext } from '../constants/context'
import { BOTTOMTABDARKCOLOR } from '../constants/defaults'
import { storage } from '../constants/storage'

export default function ProfileIcon({
    image
}: {
    image: string
}) {
    const theme = useTheme();

    const { setSpinner, signOut, setSpinnerText } = React.useContext(AppContext);
    const navigation = useNavigation();
    const [open, setOpen] = useState(false);

    const openHelp = () => {
        try {
            openInBrowser(CONFIG.URL + "contact-us/?preview_mode=application");
            setOpen(false);
        } catch (error) {

        }
    }

    const openPrivacy = () => {
        try {
            openInBrowser(CONFIG.URL + "privacy-policy/?preview_mode=application");
            setOpen(false);
        } catch (error) {

        }
    }

    const finalProcessLogout = () => {
        setSpinner(true);
        axios.post(CONFIG.API.LOGOUT).then(() => {
            setSpinnerText("Clearing Data");
        }).catch(() => {}).finally(() => {
            storage.clearAll()
            signOut();
            setSpinner(false);
        })
    }

    const logoutFnc = () => {
        try {
            setOpen(false);
            
            Alert.alert("Confirmation", "Are you sure want to logout?", [
                {
                    text : "Not Now"
                },
                {
                    text : "Logout",
                    onPress : finalProcessLogout
                }
            ])
        } catch (error) {
            
        }
    }

    return (
        <View
            accessibilityLabel="Profile Menu"
        >
            <Menu
                visible={open}
                onDismiss={() => setOpen(false)}
                style={{
                    marginTop: 50
                }}
                contentStyle={{
                    backgroundColor: theme.dark ? BOTTOMTABDARKCOLOR : "#fff"
                }}
                overlayAccessibilityLabel="Hide Profile"
                anchor={
                    <TouchableOpacity
                        style={{
                            padding: 5,
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "row",
                            position: "relative"
                        }}
                        onPress={() => setOpen(!open)}
                        accessibilityLabel="Profile"
                    >
                        <ProgressImage
                            source={{
                                uri: image
                            }}
                            style={{
                                width: 35,
                                height: 35
                            }}
                            imageStyle={{
                                borderRadius: 100
                            }}
                        />
                    </TouchableOpacity>
                }>
                <Menu.Item 
                    leadingIcon="help-circle-outline" 
                    onPress={openHelp} 
                    title="Help & Supports" 
                    accessibilityLabel="Help & Supports"
                />
                <Menu.Item 
                    leadingIcon="cog-outline" 
                    onPress={() => {
                        setOpen(false);
                        navigation.navigate("UserSettings");
                    }} 
                    title="Settings" 
                    accessibilityLabel="Settings" 
                />
                <Menu.Item 
                    leadingIcon="account-lock-outline" 
                    onPress={openPrivacy} 
                    title="Privacy Policy" 
                    accessibilityLabel="Privacy Policy" 
                />
                <Divider />
                <Menu.Item 
                    leadingIcon="logout-variant" 
                    onPress={logoutFnc} 
                    title="Logout" 
                    accessibilityLabel="Logout" 
                />
            </Menu>
        </View>
    )
}

const styles = StyleSheet.create({})