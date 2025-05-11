import React from "react";
import type {
    StyleProp,
    ViewStyle,
    ImageURISource,
} from "react-native";
import {
    StyleSheet,
    View,
    ActivityIndicator,
    Image,
    Text,
} from "react-native";
import { SliderType } from "../../constants/types";
import { useTheme } from "react-native-paper";

interface Props {
    style?: StyleProp<ViewStyle>
    index?: number
    showIndex?: boolean
    item : SliderType
}

export const SBImageItem: React.FC<Props> = ({
    style,
    index: _index,
    showIndex = true,
    item
}) => {
    const theme = useTheme();

    const index = (_index || 0) + 1;
    const source = React.useRef<ImageURISource>({
        uri: item.image
    }).current;

    return (
        <View style={[styles.container, {
            backgroundColor: theme.dark ? "rgba(48, 55, 63, 1)" : "#fff"
        }, style]}>
            <ActivityIndicator size="small" />
            <Image key={index} style={styles.image} source={source} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        overflow: "hidden",
    },
    image: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        borderRadius:10
    },
});