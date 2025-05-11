import { Alert, View } from 'react-native'
import React from 'react'
import { Appbar, useTheme } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native';

type Props = {
    title: string;
    enableCallback?: boolean;
    onBack?:() => void;
    children: JSX.Element;
    onClickFilter:() => void
};

const CourseBackMenu: React.FC<Props> = ({ title, enableCallback = false, onBack=()=>{}, children, onClickFilter }) => {
    const navigation = useNavigation();

    return (
        <View style={{
            flex: 1
        }}>
            <Appbar
                mode="center-aligned"
            >
                <Appbar.BackAction onPress={() => {
                    if (enableCallback) {
                        onBack();
                    } else {
                        navigation.goBack();
                    }
                }} />
                <Appbar.Content title={title} />
                <Appbar.Action 
                    icon="filter-variant"
                    onPress={onClickFilter}
                />
            </Appbar>

            {children}
        </View>
    )
}

export default CourseBackMenu;