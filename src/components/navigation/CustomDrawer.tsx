import React, { useContext } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Linking,
    StyleSheet,
    Share,
    Alert
} from 'react-native';
import {
    DrawerContentScrollView
} from '@react-navigation/drawer';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from 'react-native-paper';
import { openInBrowser } from '../../constants/Functions';
import axios from 'axios';
import { AppContext } from '../../constants/context';
import DrawerItemList from './CustomDrawerItems';
import { CONFIG } from '../../constants';
import { BOTTOMTABDARKCOLOR } from '../../constants/defaults';
import { storage } from '../../constants/storage';

const CustomDrawer = (props: any) => {
    const theme = useTheme();
    const { setSpinner, setSpinnerText, signOut, user } = useContext(AppContext);

    const rateApplication = async () => {
        try {
            await Linking.openURL("https://play.google.com/store/apps/details?id=" + CONFIG.PACKAGE);
        } catch (error) {

        }
    }

    const shareApp = async () => {
        try {
            await Share.share({
                url: "https://play.google.com/store/apps/details?id=" + CONFIG.PACKAGE,
                message: "https://play.google.com/store/apps/details?id=" + CONFIG.PACKAGE,
                title: "Digital Gurkha"
            });
        } catch (error) {

        }
    }

    const finalProcessLogout = () => {
        try {
            setSpinner(true);

            axios.post(CONFIG.API.LOGOUT).then(() => {
                setSpinnerText("Clearing Data");
            }).catch(() => {}).finally(() => {
                storage.clearAll()
                signOut();
                setSpinner(false);
            })
        } catch (error) {
            signOut();
            setSpinner(false);
        }
    }

    const processLogout = () => {
        try {
            Alert.alert("Confirmation", "Are you sure want to logout?", [
                {
                    text: "Not Now"
                },
                {
                    text: "Logout",
                    onPress: finalProcessLogout
                }
            ])
        } catch (error) {

        }
    }

    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView
                {...props}
                contentContainerStyle={{
                    backgroundColor: theme.dark ? BOTTOMTABDARKCOLOR : "#fff"
                }}
                style={{
                    backgroundColor: theme.dark ? BOTTOMTABDARKCOLOR : "#fff"
                }}
            >
                <View
                    style={{
                        paddingVertical: 25,
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        paddingHorizontal: 10,
                        gap: 10,
                        backgroundColor: theme.dark ? BOTTOMTABDARKCOLOR : theme.colors.primary,
                        borderRadius:10
                    }}
                >
                    <Image
                        source={{
                            uri: user.image
                        }}
                        style={{
                            height: 60,
                            width: 60,
                            borderRadius: 100
                        }}
                        resizeMode="cover"
                    />

                    <View>
                        <Text style={{
                            color: "#fff",
                            fontWeight: "500",
                            fontSize: 16
                        }} numberOfLines={1}>{user.name}</Text>
                        <Text style={{
                            color: "#fff",
                            fontSize: 15
                        }} numberOfLines={1}>{user.email}</Text>
                    </View>
                </View>

                <View style={{ flex: 1, backgroundColor: theme.dark ? BOTTOMTABDARKCOLOR : '#fff', paddingTop: 10 }}>
                    <DrawerItemList
                        {...props}
                    />
                </View>

                <View style={[styles.bottomMenus, {
                    backgroundColor: theme.dark ? BOTTOMTABDARKCOLOR : "#fff"
                }]}>
                    <TouchableOpacity onPress={rateApplication} style={{ paddingVertical: 15 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialIcons name="star-outline" size={22} color={theme.dark ? "rgba(230, 225, 229, 0.68)" : 'rgba(28, 27, 31, 0.68)'} />
                            <Text style={[styles.labelStyle, {
                                color: theme.dark ? "rgba(230, 225, 229, 0.68)" : 'rgba(28, 27, 31, 0.68)'
                            }]}>
                                Rate 5 Star
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={shareApp} style={{ paddingVertical: 15 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialIcons name="share" size={22} color={theme.dark ? "rgba(230, 225, 229, 0.68)" : 'rgba(28, 27, 31, 0.68)'} />
                            <Text style={[styles.labelStyle, {
                                color: theme.dark ? "rgba(230, 225, 229, 0.68)" : 'rgba(28, 27, 31, 0.68)'
                            }]}>
                                Tell a Friend
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => openInBrowser("https://digitalgurkha.com/privacy-policy/")} style={{ paddingVertical: 15 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialIcons name="lock-outline" size={22} color={theme.dark ? "rgba(230, 225, 229, 0.68)" : 'rgba(28, 27, 31, 0.68)'} />
                            <Text style={[styles.labelStyle, {
                                color: theme.dark ? "rgba(230, 225, 229, 0.68)" : 'rgba(28, 27, 31, 0.68)'
                            }]}>
                                Privacy Policy
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={processLogout} style={{ paddingVertical: 15 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialIcons name="logout" size={22} color={theme.dark ? "rgba(230, 225, 229, 0.68)" : 'rgba(28, 27, 31, 0.68)'} />
                            <Text style={[styles.labelStyle, {
                                color: theme.dark ? "rgba(230, 225, 229, 0.68)" : 'rgba(28, 27, 31, 0.68)'
                            }]}>
                                Log out
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </DrawerContentScrollView>
        </View>
    );
};

export default CustomDrawer;

const styles = StyleSheet.create({
    labelStyle: {
        fontSize: 14,
        marginLeft: 12,
        fontWeight: "500",
        color: "rgba(28, 27, 31, 0.68)"
    },
    bottomMenus: {
        backgroundColor: "#fff",
        paddingHorizontal: 15,
        marginTop: 0
    }
})