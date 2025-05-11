import { SafeAreaProvider } from "react-native-safe-area-context";

import { Appearance, ColorSchemeName, StatusBar, View, useColorScheme } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { DarkThemeFinal, LightThemeFinal, ToastDarkTheme, ToastLightTheme } from "./constants/Theme";
import { Button, PaperProvider } from "react-native-paper";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React, { useCallback, useEffect, useState } from "react";
import { loginReducer } from "./constants";
import { CheckoutInfo, UserType } from "./constants/types";
import { ToastMessage, removeUpAxiosDefault, setUpAxiosDefault } from "./constants/Functions";
import LoginStack from "./navigation/LoginStack";
import AppStack from "./navigation/AppStack";
import { AppContext } from "./constants/context";
import { AlertNotificationRoot } from "react-native-alert-notification";
import Spinner from "./components/Spinner";
import { CheckoutInfoDefault, UserDefault } from "./constants/defaults";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { addEventListener, fetch } from "@react-native-community/netinfo";
import { Text } from "react-native";
import { storage } from "./constants/storage";
import { useMMKVString } from "react-native-mmkv";

export default function App() {

    const colorScheme = useColorScheme();
    const [isDarkTheme, setIsDarkTheme] = useState<boolean>(colorScheme == 'dark');

    const [hasNetwork, setHasNetwork] = useState(true);
    const [spinner, setSpinner] = useState<boolean>(false);
    const [spinnerText, setSpinnerText] = useState<string>("Please Wait");
    const [playerID, setPlayerID] = useState("");
    const [cart, setCart] = useState<CheckoutInfo>(CheckoutInfoDefault);

    const [user, setUser] = useState<UserType>(UserDefault);
    const [accessToken, setAccessToken] = useMMKVString("userToken", storage)
    const theme = isDarkTheme ? DarkThemeFinal : LightThemeFinal;

    const getPrevousUser = () => {
        try {
            const value = storage.getString("userInfo")
            if (value) {
                let userData: UserType = JSON.parse(value);
                setUser(userData);
                setUpAxiosDefault(userData);
            }
        } catch (error) {

        }
    }

    const getCartItems = async () => {
        try {
            const value = storage.getString("checkoutInfo");
            if (value != null) {
                setCart(JSON.parse(value));
            }
        } catch (error) {

        }
    }

    const updateCheckoutInfo = (cartInfo: CheckoutInfo, callback = () => { }) => {
        let enableSpinner = spinner;

        try {
            if (!enableSpinner) {
                setSpinner(true);
            }

            storage.set("checkoutInfo", JSON.stringify(cartInfo))
            setCart({
                ...cartInfo,
                recalculate: true
            });
            if (!enableSpinner) {
                setSpinner(false);
            }
            callback();
        } catch (error) {
            if (!enableSpinner) {
                setSpinner(false);
            }
            setCart(cartInfo);
            callback();
        }
    }

    useEffect(() => {
        if (!spinner) {
            setSpinnerText("Please Wait");
        }
    }, [spinner])


    useEffect(() => {
        let subscribed = true;
        if (subscribed) {
            getPrevousUser();
            getCartItems();
        }

        const unsubscribe = addEventListener((state) => {
            setHasNetwork(state.isConnected == true);
        });

        return () => {
            subscribed = false;
            unsubscribe();
        }
    }, []);

    let initialLoginState = {
        isLoading: true,
        userName: null,
        userToken: null,
    };

    const [loginState, dispatch] = React.useReducer(
        loginReducer,
        initialLoginState,
    );

    const appContextData = {
        signIn: async (foundUser: UserType) => {
            const userName = foundUser.username;
            const userTokens = foundUser?.tokens;

            try {
                setUser(foundUser);
                storage.set('userInfo', JSON.stringify(foundUser));
                setAccessToken(userTokens.access_token);
                storage.set('refreshToken', userTokens.refresh_token);
                setUpAxiosDefault(foundUser);
            } catch (e) {
                console.log("Error", e)
            }
            dispatch({ type: 'LOGIN', id: userName, token: userTokens?.access_token });
        },
        signOut: async () => {
            removeUpAxiosDefault();
            dispatch({ type: 'LOGOUT' });
        },
        toggleTheme: setIsDarkTheme,
        setSpinner: setSpinner,
        setSpinnerText: setSpinnerText,
        spinnerText: spinnerText,
        user: user,
        playerID: playerID,
        cart: cart,
        setCart: setCart,
        setUser: setUser,
        updateCheckoutInfo: updateCheckoutInfo,
        hasNetwork: hasNetwork
    };

    const toggleTheme = useCallback((colorScheme: ColorSchemeName) => {
        const statusBarTheme = colorScheme === 'light' ? 'dark' : 'light';
        setIsDarkTheme(colorScheme == 'dark');
        StatusBar.setBarStyle(`${statusBarTheme}-content`);
    }, []);

    useEffect(() => {
        const appListner = Appearance.addChangeListener(({ colorScheme }) => {
            toggleTheme(colorScheme);
        });

        return () => {
            appListner.remove();
        }
    }, [toggleTheme]);

    useEffect(() => {
        if( accessToken ){
            setUpAxiosDefault(user, accessToken);
            dispatch({ type: 'RETRIEVE_TOKEN', token: accessToken });
        }
    }, [accessToken]);

    return (
        <SafeAreaProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <AlertNotificationRoot
                    theme={theme.dark ? "dark" : "light"}
                    colors={[ToastLightTheme, ToastDarkTheme]}
                >
                    <PaperProvider theme={theme}>
                        <StatusBar
                            backgroundColor={theme.colors.background}
                            barStyle={theme.dark ? "light-content" : "dark-content"}
                        />
                        <AppContext.Provider value={appContextData}>
                            <BottomSheetModalProvider>
                                <NavigationContainer>
                                    {
                                        loginState.userToken == null ? <LoginStack /> : <AppStack />
                                    }
                                </NavigationContainer>
                            </BottomSheetModalProvider>

                            <Spinner visible={spinner} text={spinnerText} />

                            {
                                !hasNetwork && <View style={{
                                    backgroundColor: theme.colors.inverseSurface,
                                    paddingHorizontal: 10,
                                    paddingVertical: 0,
                                    justifyContent: "space-between",
                                    flexDirection: "row",
                                    alignItems: "center"
                                }}>
                                    <Text style={{
                                        color: theme.colors.inverseOnSurface
                                    }}>No Internet Connection</Text>
                                    <Button
                                        labelStyle={{
                                            color: theme.colors.inversePrimary
                                        }}
                                        onPress={() => {
                                            try {
                                                fetch().then((state) => {
                                                    setHasNetwork(state.isConnected == true);
                                                    if (state.isConnected == true) { } else {
                                                        ToastMessage("error", "No Internet Connection");
                                                    }
                                                }).catch(() => { })
                                            } catch (error) {

                                            }
                                        }}
                                    >Refresh</Button>
                                </View>
                            }
                        </AppContext.Provider>
                    </PaperProvider>
                </AlertNotificationRoot>
            </GestureHandlerRootView>
        </SafeAreaProvider>
    );
}