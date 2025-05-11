import { getFocusedRouteNameFromRoute, useNavigation, useNavigationState, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Alert, BackHandler, Keyboard, KeyboardEvent } from 'react-native';

export const useKeyboard = () => {
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    useEffect(() => {
        function onKeyboardDidShow(e: KeyboardEvent) { // Remove type here if not using TypeScript
            setKeyboardHeight(e.endCoordinates.height);
        }

        function onKeyboardDidHide() {
            setKeyboardHeight(0);
        }

        const showSubscription = Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
        const hideSubscription = Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);
        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    return keyboardHeight;
};

export const useBackButtonHandler = (screenName : string) => {
    const route = useRoute();
    
    const routes = useNavigationState(state => state)
    const routeName =  routes.routeNames[routes.index];

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if (route.name === screenName) {
                Alert.alert("Exit?", "Are you sure want to exit?" + routeName, [
                    { text: "Not Now" },
                    { text: "Exit Application", onPress: () => BackHandler.exitApp() }
                ]);
                return true;
            }
            return false;
        });

        return () => backHandler.remove()
    }, [route, screenName]);
};
