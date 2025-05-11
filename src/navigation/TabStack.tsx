import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';

import Ionicons from 'react-native-vector-icons/Ionicons'

import { ActivityIndicator, Card, useTheme } from 'react-native-paper';
import ExploreScreen from '../screens/ExploreScreen';
import { ExceptionHandler, setUpAxiosDefault } from '../constants/Functions';
import axios from 'axios';
import { AppContext } from '../constants/context';
import PublicQA from '../screens/PublicQA';
import UserPoints from '../screens/Profile/UserPoints';
import UserCourses from '../screens/Profile/UserCourses';
import CustomTabBarButton from '../components/navigation/CustomTabBarButton';
import { BOTTOMTABHEIGHT } from '../constants/defaults';
import { AppTheme } from '../constants/types';
import { CONFIG, WIDTH } from '../constants';
import { storage } from '../constants/storage';
import axiosInstance from '../constants/axiosInstance';

const Tab = createBottomTabNavigator();

export default function TabStack() {
    const theme = useTheme<AppTheme>();
    const { setUser, signOut } = React.useContext(AppContext);
    const [loading, setLoading] = useState(true);

    const IconComponent = ({ text = "", icon, focused }: {
        text?: string,
        icon: string,
        focused: boolean
    }) => {
        if (text) {
            return (
                <View style={{ alignItems: "center", justifyContent: "center", minWidth: WIDTH / 5 }}>
                    <Ionicons name={icon} size={22} color={focused ? theme.colors.primary : theme.dark ? "#fff" : "#757373"} />
                    <Text style={{ fontSize: 11, color: focused ? theme.colors.primary : theme.dark ? "#fff" : "#757373" }}>{text}</Text>
                </View>
            )
        }

        return (
            <Ionicons name={icon} size={22} color="#fff" />
        )
    }

    const finalProcessLogout = () => {
        setLoading(true);
        axios.post(CONFIG.API.LOGOUT).then(() => { }).catch(() => { }).finally(() => {
            storage.clearAll()
            signOut();
            setLoading(false);
        })
    }

    const getUserFromOnline = () => {
        axiosInstance.post(CONFIG.API.USER_INFO).then(async (res) => {
            setUser(res.data);
            setUpAxiosDefault(res.data);
            storage.set('userInfo', JSON.stringify(res.data));
            setLoading(false);
        }).catch((err) => {
            const { title, message, code } = ExceptionHandler(err);
            console.log("Error", title, message, code);
            if (code == 'session_expired') {
                finalProcessLogout();
            } else {
                setLoading(false);
            }
        });
    }

    useEffect(() => {
        let subscribed = true;
        if (subscribed) {
            getUserFromOnline();
        }

        return () => {
            subscribed = false;
        }
    }, [])

    if (loading) {
        return (
            <View style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <ActivityIndicator animating size={25} color={theme.colors.primary} />
            </View>
        )
    }

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarShowLabel: false,
                headerShown: false,
                tabBarStyle: [styles.tabbarstyle, {
                    height: BOTTOMTABHEIGHT,
                    backgroundColor: "transparent",
                    elevation: 0
                }]
            }}
            initialRouteName="HomeTab"
        >
            <Tab.Screen
                name="QnaTab"
                component={PublicQA}
                options={{
                    tabBarIcon: ({ focused }) => <IconComponent
                        text="QNA"
                        icon="help-circle-outline"
                        focused={focused}
                    />,
                    tabBarLabel: () => null,
                    tabBarButton: props => <CustomTabBarButton route="qna" {...props} />,
                }}
            />
            <Tab.Screen
                name="CoursesTab"
                component={ExploreScreen}
                options={{
                    tabBarIcon: ({ focused }) => <IconComponent
                        text="Courses"
                        icon="book-outline"
                        focused={focused}
                    />,
                    tabBarLabel: () => null,
                    tabBarButton: props => <CustomTabBarButton route="courses" {...props} />,
                }}
            />

            <Tab.Screen
                name="HomeTab"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ focused }) => <IconComponent
                        icon="home-outline"
                        focused={focused}
                    />,
                    tabBarButton: props => <CustomTabBarButton route="home" {...props} />,
                    tabBarLabel: () => null,
                }}
            />

            <Tab.Screen
                name="MyLearningTab"
                component={UserCourses}
                options={{
                    tabBarButton: props => <CustomTabBarButton route="mylearning" {...props} />,
                    tabBarIcon: ({ focused }) => <IconComponent
                        text="My Learning"
                        icon="play-circle-outline"
                        focused={focused}
                    />,
                    tabBarLabel: () => null,
                }}
                initialParams={{
                    type: "active"
                }}
            />
            <Tab.Screen
                name="PointsTab"
                component={UserPoints}
                options={{
                    tabBarButton: props => <CustomTabBarButton route="points" {...props} />,
                    tabBarIcon: ({ focused }) => <IconComponent
                        text="Points"
                        icon="trophy-outline"
                        focused={focused}
                    />,
                    tabBarLabel: () => null,
                }}
            />
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({
    tabbarstyle: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        borderTopWidth: 0
    }
})