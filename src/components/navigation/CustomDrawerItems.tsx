import {
    CommonActions,
    DrawerActions,
    DrawerNavigationState,
    ParamListBase
} from '@react-navigation/native';
import * as React from 'react';

import { DrawerItem } from '@react-navigation/drawer';
import { StyleSheet } from 'react-native';
import { View } from 'react-native';

type Props = {
    state: DrawerNavigationState<ParamListBase>;
    navigation: any;
    descriptors: any;
};

/**
 * Component that renders the navigation list in the drawer.
 */
export default function DrawerItemList({
    state,
    navigation,
    descriptors,
}: Props) {
    const focusedRoute = state.routes[state.index];
    const focusedDescriptor = descriptors[focusedRoute.key];
    const focusedOptions = focusedDescriptor.options;

    const {
        drawerActiveTintColor,
        drawerInactiveTintColor,
        drawerActiveBackgroundColor,
        drawerInactiveBackgroundColor,
    } = focusedOptions;

    return state.routes.map((route, i) => {
        const focused = i === state.index;
        const showBorder = i == 3 || i == 6 || i == 9 || i == 11;

        const onPress = () => {
            const event = navigation.emit({
                type: 'drawerItemPress',
                target: route.key,
                canPreventDefault: true,
            });

            if (!event.defaultPrevented) {
                navigation.dispatch({
                    ...(focused
                        ? DrawerActions.closeDrawer()
                        : CommonActions.navigate({ name: route.name, merge: true })),
                    target: state.key,
                });
            }
        };

        const {
            title,
            drawerLabel,
            drawerIcon,
            drawerLabelStyle,
            drawerItemStyle,
            drawerAllowFontScaling,
        } = descriptors[route.key].options;

        return (
            <View
                key={route.key}
            >
                <DrawerItem
                    label={
                        drawerLabel !== undefined
                            ? drawerLabel
                            : title !== undefined
                                ? title
                                : route.name
                    }
                    icon={drawerIcon}
                    focused={focused}
                    activeTintColor={drawerActiveTintColor}
                    inactiveTintColor={drawerInactiveTintColor}
                    activeBackgroundColor={drawerActiveBackgroundColor}
                    inactiveBackgroundColor={drawerInactiveBackgroundColor}
                    allowFontScaling={drawerAllowFontScaling}
                    labelStyle={[drawerLabelStyle, {
                        marginLeft:20
                    }]}
                    style={drawerItemStyle}
                    // to={buildLink(route.name, route.params)}
                    onPress={onPress}
                />

                {
                    showBorder ? <View 
                        style={{
                            borderTopWidth:1,
                            borderTopColor:"#ccc",
                            marginVertical:10
                        }}
                    /> : null
                }
            </View>
        );
    }) as React.ReactNode as React.ReactElement;
}

const styles = StyleSheet.create({
    drawerMenu : {
        borderBottomColor : "#000",
        borderBottomWidth:1
    }
})