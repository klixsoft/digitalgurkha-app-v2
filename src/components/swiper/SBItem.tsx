import React from "react";
import type { StyleProp, ViewStyle, ViewProps } from "react-native";
import { LongPressGestureHandler } from "react-native-gesture-handler";
import type { AnimatedProps } from "react-native-reanimated";
import Animated from "react-native-reanimated";

import { SBImageItem } from "./SBImageItem";
import { SliderType } from "../../constants/types";

interface Props extends AnimatedProps<ViewProps> {
    style?: StyleProp<ViewStyle>
    index?: number
    pretty?: boolean
    item : SliderType
}

export const SBItem: React.FC<Props> = (props) => {
    const { style, index, pretty, testID, item, ...animatedViewProps } = props;
    return (
        <LongPressGestureHandler>
            <Animated.View testID={testID} style={{ flex: 1 }} {...animatedViewProps}>
                <SBImageItem item={item} style={style} index={index} showIndex={typeof index === "number"} />
            </Animated.View>
        </LongPressGestureHandler>
    );
};