import { Alert, Animated, BackHandler, FlatList, Keyboard, KeyboardEvent, ScrollView, StatusBar, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { Card, Icon, MD3Theme, Modal, Portal, Searchbar, useTheme } from 'react-native-paper'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import HomeCourseCardList from '../components/HomeCourseCardList';
import { AppTheme, CourseCardType, ErrorType, landingPageInfoType } from '../constants/types';
import axios from 'axios';
import CourseHorizontalPlaceholder from '../components/placeholder/CourseHorizontalPlaceholder';
import { ExceptionHandler, ToastMessage } from '../constants/Functions';
import HomeSwiper from '../components/HomeSwiper';
import { RefreshControl } from 'react-native-gesture-handler';
import Error from '../components/Error';
import { AppContext } from '../constants/context';
import CategorySlider from '../components/courses/CategorySlider';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { CONFIG, HEIGHT } from '../constants';
import * as RNFS from "react-native-fs"
import ProfileIcon from '../components/ProfileIcon';
import { BOTTOMTABHEIGHT } from '../constants/defaults';
import { storage } from '../constants/storage';
import axiosInstance from '../constants/axiosInstance';

const SuggestionCard = ({ item, theme, onPress }: {
    item: string,
    theme : MD3Theme,
    onPress : (value : string) => void
}) => {
    return (
        <Card style={[styles.searchList, {
            backgroundColor : theme.dark ? theme.colors.background : "#fff"
        }]} elevation={1}>
            <TouchableOpacity style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                padding: 15,
                width : "100%"
            }} onPress={() => onPress(item)}>
                <Icon
                    source="history"
                    size={20}
                    color={theme.dark ? theme.colors.onBackground : "#000"}
                />
                <Text style={[styles.searchListText, {
                    color: theme.dark ? theme.colors.onBackground : "#000",
                    width : "100%"
                }]}>{item}</Text>
            </TouchableOpacity>
        </Card>
    )
}

const CourseSearchCard = ({ item, theme }: {
    item: CourseCardType,
    theme : MD3Theme
}) => {
    return (
        <Card style={[styles.searchList, {
            backgroundColor : theme.dark ? theme.colors.background : "#fff"
        }]} elevation={1}>
            <View style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                padding: 15
            }}>
                <Icon
                    source="book-open-page-variant-outline"
                    size={20}
                    color={theme.dark ? theme.colors.onBackground : "#000"}
                />
                <Text style={[styles.searchListText, {
                    color: theme.dark ? theme.colors.onBackground : "#000",
                    marginRight:20
                }]}>{item.name}</Text>
            </View>
        </Card>
    )
}

export default function HomeScreen() {
    const theme = useTheme<AppTheme>();
    const navigation = useNavigation();

    const homeScreenFile = RNFS.DocumentDirectoryPath + "/landing.json";
    const { user, signOut, setSpinner, setSpinnerText, hasNetwork } = React.useContext(AppContext);
    const [showModal, setShowModal] = useState(false);

    const [data, setData] = useState<landingPageInfoType>({
        courses: [],
        slider: [],
        cats: [],
        suggestions: []
    });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<ErrorType>({
        enable: false,
        title: "",
        message: ""
    });

    const [search, setSearch] = useState("");
    const [searchData, setSearchData] = useState<CourseCardType[]>([]);
    const [showSuggestion, setShowSuggestion] = useState(true);
    const [searchingCourse, setSearchingCourse] = useState(false);
    const animatedHeight = useRef(new Animated.Value(HEIGHT / 1.3)).current;

    const handleOutput = async (content: landingPageInfoType, saveContent = true) => {
        try {
            setData(content);
            setLoading(false);
            setRefreshing(false);

            if (saveContent) {
                await RNFS.writeFile(homeScreenFile, JSON.stringify(content));
            }
        } catch (error) {

        }
    }

    const getContentOffline = async (error: any) => {
        try {
            const content = await RNFS.readFile(homeScreenFile);
            if (content == null) {
                throw "error";
            } else {
                handleOutput(JSON.parse(content), false);
            }
        } catch (e) {
            const { title, message, code } = ExceptionHandler(error);
            if (code == "bad_iss" || code == 'logout') {
                finalProcessLogout();
            }

            if (data.courses.length <= 0) {
                setError({
                    enable: true,
                    title,
                    message
                });
            }

            setLoading(false);
            setRefreshing(false);
        }
    }

    const getLandingPageOnline = async () => {
        try {
            await axiosInstance.post(CONFIG.API.LANDING).then((res) => handleOutput(res.data)).catch(getContentOffline);
        } catch (error) {

        }
    }

    const _onRefresh = () => {
        setLoading(false);
        setRefreshing(true);

        getLandingPageOnline();
    }

    useEffect(() => {
        getLandingPageOnline();
    }, []);

    const finalProcessLogout = () => {
        setSpinner(true);
        axios.post(CONFIG.API.LOGOUT).then(() => {
            setSpinnerText("Clearing Data");
        }).catch(() => {}).finally(() => {
            storage.clearAll()
            signOut();
            setSpinner(false);
        })
    }

    const searchCoursesOnline = () => {
        try {
            setSearchingCourse(true);

            axios.post(CONFIG.API.COURSES, {
                search: search
            }).then((res) => {
                setSearchData(res.data.data);
                setSearchingCourse(false);
                setShowSuggestion(false);
            }).catch((error) => {
                const { title, message } = ExceptionHandler(error);
                ToastMessage("error", message, title);

                setSearchingCourse(false);
                setShowSuggestion(true);
            });
        } catch (error) {
            setSearchingCourse(false);
        }
    }

    const animateHeight = (toValue: any) => {
        Animated.timing(animatedHeight, {
            toValue,
            duration: 800,
            useNativeDriver: false,
        }).start();
    };

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            (e : KeyboardEvent) => {
                animateHeight((HEIGHT - e.endCoordinates.height) / 1.1);
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                animateHeight(HEIGHT / 1.3);
            }
        );
        
        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    return (
        <ScrollView
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={_onRefresh}
                />
            }
            contentContainerStyle={{
                paddingVertical: 10,
                paddingHorizontal: 13,
                paddingBottom:BOTTOMTABHEIGHT + 20,
                backgroundColor : theme.colors.background2
            }}
        >
            <View style={{
                paddingBottom: 0
            }}>
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                    <TouchableOpacity
                        style={{
                            padding: 5,
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "row",
                            position: "relative"
                        }}
                        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                    >
                        <MaterialIcons
                            name="menu"
                            color={theme.colors.onBackground}
                            size={30}
                        />
                    </TouchableOpacity>

                    <ProfileIcon
                        image={user.image}
                    />
                </View>

                <View style={{
                    marginTop: 20,
                    marginBottom: 10
                }}>
                    <TouchableOpacity
                        style={{
                            borderRadius: 10,
                            paddingHorizontal: 14,
                            paddingVertical: 13,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent:"space-between",
                            borderWidth:1,
                            borderColor:theme.dark ? "#fff" : theme.colors.outline
                        }}
                        onPress={() => setShowModal(true)}
                    >
                        <Text style={{
                            fontSize: 15,
                            color:theme.dark ? "#fff" : theme.colors.outline
                        }}>Search Courses</Text>
                        <MaterialIcons size={23} color={theme.dark ? "#fff" : theme.colors.outline} name="search" />

                    </TouchableOpacity>

                    <CategorySlider
                        data={data.cats}
                    />
                </View>
            </View>

            {!error.enable && !loading ? <HomeSwiper
                data={data.slider}
            /> : null}

            <View style={{
                paddingHorizontal: 0,
                marginBottom: 10
            }}>
                {
                    loading ? <View>
                        <CourseHorizontalPlaceholder />
                        <CourseHorizontalPlaceholder />
                        <CourseHorizontalPlaceholder />
                    </View>
                        :
                        <View>
                            {
                                !error.enable ?
                                    data.courses.map((courseList) => {
                                        return (
                                            <HomeCourseCardList
                                                key={courseList.title}
                                                data={courseList}
                                            />
                                        )
                                    })
                                    :
                                    <View style={{
                                        flex: 1,
                                        flexDirection: "row",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}>
                                        <Error
                                            title={error.title}
                                            message={error.message}
                                            button={{
                                                text: "Reload",
                                                onPress: () => {
                                                    setRefreshing(false);
                                                    setLoading(true);
                                                    getLandingPageOnline();
                                                }
                                            }}
                                        />
                                    </View>
                            }
                        </View>
                }

                <Portal>
                    <Modal
                        visible={showModal}
                        contentContainerStyle={{
                            backgroundColor: theme.dark ? "rgba(48, 55, 63, 1)" : "#F5F7F7",
                            margin: 15,
                            borderRadius: 5
                        }}
                        onDismiss={() => setShowModal(false)}
                    >
                        <Animated.View style={{
                            padding: 15,
                            maxHeight: animatedHeight
                        }}>
                            <Searchbar
                                placeholder="Search Courses"
                                value={search}
                                onChangeText={(text) => {
                                    if (!showSuggestion) {
                                        setShowSuggestion(true);
                                    }
                                    setSearch(text);
                                }}
                                accessibilityLabel="Search Courses"
                                loading={searchingCourse}
                                style={{
                                    marginBottom: 10,
                                    borderRadius: 5,
                                    borderWidth: 2,
                                    borderColor: hasNetwork ? theme.dark ? "#ccc" : "#000" : "#ccc",
                                    backgroundColor: "transparent"
                                }}
                                inputStyle={{
                                    fontSize: 17
                                }}
                                readOnly={!hasNetwork}
                                onSubmitEditing={searchCoursesOnline}
                            />

                            <Text style={{
                                fontSize: 17,
                                fontWeight: "500",
                                color: theme.dark ? "#ccc" : "#000",
                                marginTop: 5,
                                paddingBottom: 20
                            }}>{showSuggestion ? "Suggestions:" : "Result:"}</Text>

                            {
                                showSuggestion ?
                                    <FlatList
                                        data={data.suggestions}
                                        keyExtractor={(item) => item}
                                        renderItem={props => <SuggestionCard {...props} theme={theme} onPress={(value) => {
                                            if( hasNetwork ){
                                                setSearch(value);
                                                setSearchingCourse(true);
                                                searchCoursesOnline();
                                            }else{
                                                ToastMessage("error", "No Internet Connection");
                                            }
                                        }} />}
                                        showsVerticalScrollIndicator={false}
                                    />
                                    :
                                    <FlatList
                                        data={searchData}
                                        keyExtractor={(item) => `${item.id}`}
                                        renderItem={props => <CourseSearchCard {...props} theme={theme} />}
                                        showsVerticalScrollIndicator={false}
                                    />
                            }
                        </Animated.View>
                    </Modal>
                </Portal>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    heading: {
        fontWeight: "500",
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        textAlign: "center",
        color: "#000",
        fontSize: 18
    },
    radiogroup: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },
    headingText: {
        fontWeight: "500",
        color: "#000",
        marginTop: 10,
        marginBottom: 5,
        fontSize: 18
    },
    searchList: {
        marginBottom: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 8,
        backgroundColor: "#fff",
        borderRadius: 5
    },
    searchListText: {
        fontSize: 16
    }
})