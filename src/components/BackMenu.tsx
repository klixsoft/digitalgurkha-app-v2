import { Alert, View } from 'react-native'
import React, { JSX } from 'react'
import { Appbar, useTheme } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native';

type Props = {
    title: string;
    enableCallback?: boolean;
    onBack?:() => void;
    children: JSX.Element;
    backgroundColor?:string
};

const BackMenu: React.FC<Props> = ({ title, enableCallback = false, onBack=()=>{}, children, backgroundColor=null }) => {
    const navigation = useNavigation();
    const theme = useTheme();

    return (
        <View style={[{
            flex: 1
        }, backgroundColor ? {
            backgroundColor : backgroundColor
        } : {}]}>
            <Appbar
                mode="center-aligned"
                style={backgroundColor ? {
                    backgroundColor:backgroundColor
                } : {
                    backgroundColor : theme.colors.background
                }}
            >
                <Appbar.BackAction onPress={() => {
                    if (enableCallback) {
                        onBack();
                    } else {
                        navigation.goBack();
                    }
                }} />
                <Appbar.Content title={title} />
            </Appbar>

            {children}
        </View>
    )
}

export default BackMenu;