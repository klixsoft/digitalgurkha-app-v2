import { Linking, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import Ionicons from "react-native-vector-icons/Ionicons"
import CustomDrawer from '../components/navigation/CustomDrawer';
import CoursesScreen from '../screens/CoursesScreen';
import ExploreScreen from '../screens/ExploreScreen';
import ProfileScreen from '../screens/ProfileScreen';
import UserCourses from '../screens/Profile/UserCourses';
import UserSettings from '../screens/Profile/UserSettings';
import ChangePassword from '../screens/Profile/ChangePassword';
import UserQA from '../screens/Profile/UserQA';
import UserCourseQuiz from '../screens/Profile/UserCourseQuiz';
import UserPoints from '../screens/Profile/UserPoints';
import { AppContext } from '../constants/context';
import { CheckoutInfoDefault } from '../constants/defaults';
import { useNavigation } from '@react-navigation/native';
import { ExceptionHandler, ToastMessage, openInBrowser } from '../constants/Functions';
import PublicQA from '../screens/PublicQA';
import TabStack from './TabStack';
import axios from 'axios';
import { CONFIG } from '../constants';

const Drawer = createDrawerNavigator();

export default function DrawerStack() {
    const { setCart, updateCheckoutInfo, setSpinner, setSpinnerText } = React.useContext(AppContext);
    const navigation = useNavigation();

    const CustomIcon = (props: {
        name: string,
        color: string,
        size: number
    }) => {
        return (
            <View style={{
                marginRight: -20
            }}>
                <Ionicons
                    {...props}
                />
            </View>
        )
    }

    const handleWebsiteURL = async (url: string) => {
        try {
            let cleanURL = url.replace(/^.*\/\/[^\/]+/, '');
            cleanURL = cleanURL.split('?')[0];

            let cleanURLPart = cleanURL.split('#');
            cleanURL = cleanURLPart[0];

            cleanURL = cleanURL.replace(/\/$/, "");
            cleanURL = cleanURL.substr(cleanURL.indexOf('/') + 1);

            if (cleanURL.length <= 0) {
                return false;
            }

            let urlObj = cleanURL.split("/");
            if (urlObj[0] == "courses") {
                if (urlObj.length > 0) {
                    //navigate to single screen
                    navigation.navigate("SingleCourse", {
                        slug: urlObj[1]
                    });
                } else {
                    //navigate to courses
                    navigation.navigate("TabScreen", {
                        screen: "Courses"
                    });
                }
            } else if(urlObj[0] == 'course-category'){
                if( urlObj.length > 1 ){
                    setSpinnerText("Redirecting . . .");
                    setSpinner(true);

                    await axios.post(CONFIG.API.HANDLE_DEEP_LINK, {
                        category : urlObj[1]
                    }).then((res) => {
                        setSpinner(false);
                        navigation.navigate("CoursesByCategory", {
                            category : res.data
                        });
                    }).catch((error) => {
                        setSpinner(false);
                        const { title, message } = ExceptionHandler(error);
                        ToastMessage("error", message);
                    })
                }else{
                    navigation.navigate("TabScreen", {
                        screen : "Explore"
                    });
                }
            } else if(urlObj[0] == 'dashboard'){
                if( urlObj.length > 1 ){
                    if( urlObj[1] == 'enrolled-courses' ){
                        let courseScreen: "EnrolledCourses" |  "ActiveCourses" | "CompletedCourses" = "EnrolledCourses";
                        try {
                            if( urlObj[2] == 'active-courses' ){
                                courseScreen = 'ActiveCourses';
                            }else if( urlObj[2] == 'completed-courses' ){
                                courseScreen = 'CompletedCourses';
                            }
                        } catch (error) {
                            
                        }

                        navigation.navigate("TabScreen", {
                            screen : courseScreen
                        });
                    }else if( urlObj[1] == 'user-points' ){
                        navigation.navigate("TabScreen", {
                            screen : "UserPoints"
                        });
                    }else if( urlObj[1] == 'settings' ){
                        try {
                            if( urlObj[2] == 'reset-password' ){
                                navigation.navigate("TabScreen", {
                                    screen : "ChangePassword"
                                });
                            }else{
                                throw "error";
                            }
                        } catch (error) {
                            navigation.navigate("TabScreen", {
                                screen : "Settings"
                            });
                        }
                    }else if( urlObj[1] == 'question-answer' ){
                        navigation.navigate("TabScreen", {
                            screen : "QuestionAnswer"
                        });
                    }else if( urlObj[1] == 'question-answer' ){
                        navigation.navigate("TabScreen", {
                            screen : "QuestionAnswer"
                        });
                    }else if( urlObj[1] == 'my-quiz-attempts' ){
                        navigation.navigate("TabScreen", {
                            screen : "UserCourseQuiz"
                        });
                    }
                }
            } else {
                openInBrowser(url, () => {

                })
            }
        } catch (error) {

        }
    }

    const handleDeepLink = (url: string | null) => {
        try {
            if (url != null) {
                if (url.includes("order")) {
                    const urlParts = url.split("/");
                    const status = urlParts[3];
                    const topic = urlParts[5];

                    setCart(CheckoutInfoDefault);
                    updateCheckoutInfo(CheckoutInfoDefault, () => {
                        if (status == "completed") {
                            navigation.navigate("SingleCourse", {
                                slug: topic
                            });
                        }
                    });
                } else {
                    handleWebsiteURL(url);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const linkingSubscription = Linking.addEventListener('url', ({ url }) => handleDeepLink(url));
        Linking.getInitialURL().then(handleDeepLink).catch((e) => { })

        return () => {
            linkingSubscription?.remove();
        }
    }, [])


    return (
        <Drawer.Navigator
            screenOptions={{
                headerShown: false,
                drawerItemStyle: {
                    marginBottom: 0
                }
            }}
            initialRouteName="Home"
            drawerContent={props => <CustomDrawer {...props} />}
        >
            <Drawer.Screen
                name="Home"
                component={TabStack}
                options={{
                    drawerIcon: ({ color }) => (
                        <CustomIcon name="home-outline" size={22} color={color} />
                    ),
                    drawerLabel: "Home"
                }}
            />

            <Drawer.Screen
                name="Courses"
                component={CoursesScreen}
                options={{
                    drawerIcon: ({ color }) => (
                        <CustomIcon name="book-outline" size={22} color={color} />
                    ),
                    drawerLabel: "Courses"
                }}
            />

            <Drawer.Screen
                name="Explore"
                component={ExploreScreen}
                options={{
                    drawerIcon: ({ color }) => (
                        <CustomIcon name="compass-outline" size={22} color={color} />
                    ),
                    drawerLabel: "Categories"
                }}
            />

            <Drawer.Screen
                name="QA"
                component={PublicQA}
                options={{
                    drawerIcon: ({ color }) => (
                        <CustomIcon name="help-circle-outline" size={22} color={color} />
                    ),
                    drawerLabel: "Question & Answer"
                }}
            />

            <Drawer.Screen
                name="EnrolledCourses"
                component={UserCourses}
                options={{
                    drawerIcon: ({ color }) => (
                        <CustomIcon name="book-outline" size={22} color={color} />
                    ),
                    drawerLabel: "Enrolled Courses"
                }}
                initialParams={{
                    type: "enroll"
                }}
            />

            <Drawer.Screen
                name="ActiveCourses"
                component={UserCourses}
                options={{
                    drawerIcon: ({ color }) => (
                        <CustomIcon name="school-outline" size={22} color={color} />
                    ),
                    drawerLabel: "Active Courses"
                }}
                initialParams={{
                    type: "enroll"
                }}
            />

            <Drawer.Screen
                name="CompletedCourses"
                component={UserCourses}
                options={{
                    drawerIcon: ({ color }) => (
                        <CustomIcon name="cube-outline" size={22} color={color} />
                    ),
                    drawerLabel: "Completed Courses"
                }}
                initialParams={{
                    type: "completed"
                }}
            />

            <Drawer.Screen
                name="UserPoints"
                component={UserPoints}
                options={{
                    drawerIcon: ({ color }) => (
                        <CustomIcon name="trophy-outline" size={22} color={color} />
                    ),
                    drawerLabel: "User Points"
                }}
            />

            <Drawer.Screen
                name="UserCourseQuiz"
                component={UserCourseQuiz}
                options={{
                    drawerIcon: ({ color }) => (
                        <CustomIcon name="podium-outline" size={22} color={color} />
                    ),
                    drawerLabel: "Course Quiz"
                }}
                initialParams={{
                    quiz_id : 0
                }}
            />

            <Drawer.Screen
                name="QuestionAnswer"
                component={UserQA}
                options={{
                    drawerIcon: ({ color }) => (
                        <CustomIcon name="help-circle-outline" size={22} color={color} />
                    ),
                    drawerLabel: "Your QA"
                }}
            />

            <Drawer.Screen
                name="Settings"
                component={UserSettings}
                options={{
                    drawerIcon: ({ color }) => (
                        <CustomIcon name="settings-outline" size={22} color={color} />
                    ),
                    drawerLabel: "Settings"
                }}
            />

            <Drawer.Screen
                name="ChangePassword"
                component={ChangePassword}
                options={{
                    drawerIcon: ({ color }) => (
                        <CustomIcon name="lock-closed-outline" size={22} color={color} />
                    ),
                    drawerLabel: "Change Password"
                }}
            />
        </Drawer.Navigator>
    )
}

const styles = StyleSheet.create({})