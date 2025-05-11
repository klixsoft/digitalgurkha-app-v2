import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import Svg, { Path } from 'react-native-svg';
import { BOTTOMTABDARKCOLOR, BOTTOMTABHEIGHT } from '../../constants/defaults';
import { WIDTH } from '../../constants';

const CustomTabBarButton = (props: BottomTabBarButtonProps & {
    route?: string
}) => {
    const theme = useTheme();
    const { route, children, onPress } = props;

    if (route == "home") {
        return (
            <View style={[styles.btnWrapper, {
                backgroundColor: "transparent"
            }]}>
                <View style={{ flexDirection: 'row', backgroundColor: "transparent" }}>
                    <View style={[styles.svgGapFiller, {
                        backgroundColor : theme.dark ? BOTTOMTABDARKCOLOR : "#fff"
                    }]} />

                    <Svg width={81} height={66} viewBox="0 0 75 61">
                        <Path
                            d="M75.2 0v61H0V0c4.1 0 7.4 3.1 7.9 7.1C10 21.7 22.5 33 37.7 33c15.2 0 27.7-11.3 29.7-25.9.5-4 3.9-7.1 7.9-7.1h-.1z"
                            fill={theme.dark ? BOTTOMTABDARKCOLOR : "#fff"}
                        />
                    </Svg>

                    <View style={[styles.svgGapFiller, {
                        backgroundColor : theme.dark ? BOTTOMTABDARKCOLOR : "#fff"
                    }]} />
                </View>

                <TouchableOpacity
                    activeOpacity={1}
                    onPress={onPress}
                    style={[styles.activeBtn, {
                        backgroundColor: theme.colors.primary
                    }]}>
                    {children}
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={onPress}
            style={[styles.inactiveBtn, {
                borderTopWidth: 0,
                borderTopColor: "#ccc",
                backgroundColor : theme.dark ? BOTTOMTABDARKCOLOR : "#fff",
            }]}
        >
            {children}
        </TouchableOpacity>
    );
};

export default CustomTabBarButton;

const styles = StyleSheet.create({
    btnWrapper: {
        flex: 1,
        alignItems: 'center'
    },
    activeBtn: {
        flex: 1,
        position: 'absolute',
        top: -25,
        width: BOTTOMTABHEIGHT - 5,
        height: BOTTOMTABHEIGHT - 5,
        borderRadius: (BOTTOMTABHEIGHT - 5) / 2,
        backgroundColor: "transaprent",
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 0,
    },
    inactiveBtn: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    svgGapFiller: {
        flex: 1,
        borderTopLeftRadius: 0
    },
});