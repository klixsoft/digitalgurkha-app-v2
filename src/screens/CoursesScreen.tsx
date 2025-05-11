import { Animated, Keyboard, KeyboardEvent, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Button, Modal, Portal, Searchbar, useTheme } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native';
import CoursesPlaceholder from '../components/placeholder/CoursesPlaceholder';
import { ChecboxFilterData, CourseCardType, ErrorType } from '../constants/types';
import axios from 'axios';
import { ExceptionHandler, isCloseToBottom } from '../constants/Functions';
import Error from '../components/Error';
import CourseCard from '../components/courses/CourseCard';
import { CONFIG, HEIGHT } from '../constants';
import ChecboxFilter from '../components/ChecboxFilter';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import CourseBackMenu from '../components/CourseBackMenu';
import { FlashList } from '@shopify/flash-list';
import BackMenu from '../components/BackMenu';
import axiosInstance from '../constants/axiosInstance';

const renderCourseCard = ({ item, index }: {
    item: CourseCardType,
    index: number
}) => {
    return (
        <CourseCard
            course={item}
            half
        />
    )
}

export default function CoursesScreen() {
    const theme = useTheme();
    const navigation = useNavigation();

    const [data, setData] = useState<CourseCardType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<ErrorType>({
        enable: false,
        title: "",
        message: ""
    });
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(false);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [total, setTotal] = useState<number>(0);

    const [showModal, setShowModal] = useState(false);
    const [priceType, setPriceType] = useState<ChecboxFilterData[]>([
        {
            label: "Free",
            value: "free",
            checked: false
        },
        {
            label: "Paid",
            value: "paid",
            checked: false
        }
    ])
    const [labelType, setLabelType] = useState<ChecboxFilterData[]>([
        {
            label: "All Levels",
            value: "all_levels",
            checked: false
        },
        {
            label: "Beginner",
            value: "beginner",
            checked: false
        },
        {
            label: "Intermediate",
            value: "intermediate",
            checked: false
        },
        {
            label: "Expert",
            value: "expert",
            checked: false
        }
    ])
    const [searchValue, setSearchValue] = useState("");
    const animatedHeight = useRef(new Animated.Value(HEIGHT / 1.5)).current;

    const getCheckedValues = (checkboxes: ChecboxFilterData[]) => {
        return checkboxes.filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.value);
    };

    const getLandingPageOnline = async () => {

        const price = getCheckedValues(priceType);
        const level = getCheckedValues(labelType);

        await axiosInstance.post(CONFIG.API.COURSES, {
            page: page,
            search: searchValue,
            price: price,
            level: level
        }).then((res) => {
            if (page == 1) {
                setData(res.data.data);
            } else {
                setData([...data, ...res.data.data]);
            }
            setTotal(res.data.total);
            setLoading(false);
            setHasMore(res.data.has_more);
            setRefreshing(false);
            setLoadingMore(false);
        }).catch((error) => {
            const { title, message } = ExceptionHandler(error);
            setLoading(false);
            if (page == 1) {
                setError({
                    enable: true,
                    title,
                    message
                });
            }
            setRefreshing(false);
            setLoadingMore(false);
        });
    }

    const onRefreshPage = () => {
        setHasMore(false);
        setRefreshing(true);

        if (page == 1) {
            setPage(1);
        } else {
            getLandingPageOnline();
        }
    }

    const onScrollLoadMore = () => {
        if (!loadingMore && hasMore) {
            setLoadingMore(true);
            setPage(page + 1);
        }
    }

    const HeaderPart = () => {
        return (
            <View style={{
                marginHorizontal: 10,
                marginVertical: 5
            }}>
                <Text style={{
                    fontWeight: "500",
                    textAlign: "right",
                    marginRight: 10
                }}>{total} Courses Found</Text>
            </View>
        )
    }

    const loadingMoreCmp = () => {
        return (
            <View style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginVertical: 20
            }}>
                <ActivityIndicator animating size={25} />
            </View>
        )
    }

    useEffect(() => {
        if (page) {
            getLandingPageOnline();
        }
    }, [page])

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
            (e: KeyboardEvent) => {
                animateHeight((HEIGHT - e.endCoordinates.height) / 1.3);
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                animateHeight(HEIGHT / 1.5);
            }
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    return (
        <BackMenu
            title="Courses"
            enableCallback
            onBack={() => navigation.navigate("TabScreen", {
                screen: "Home"
            })}
            // onClickFilter={() => setShowModal(true)}
        >
            <View style={{
                flex: 1
            }}>
                {
                    loading ? <View style={{
                        marginVertical: 10,
                        marginLeft: 10
                    }}>
                        <CoursesPlaceholder />
                        <CoursesPlaceholder />
                        <CoursesPlaceholder />
                    </View> : error.enable ? <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        flex: 1,
                        marginHorizontal: 20
                    }}>
                        <Error
                            title={error.title}
                            message={error.message}
                            button={{
                                text: "Reload",
                                onPress: () => {
                                    setLoading(true);
                                    setError({
                                        ...error,
                                        enable: false
                                    });

                                    if (page == 1) {
                                        getLandingPageOnline();
                                    } else {
                                        setPage(1);
                                    }
                                }
                            }}
                        />
                    </View> : <>
                            <HeaderPart />
                    <FlashList
                        data={data}
                        keyExtractor={(item, index) => `course_${index}_${item.id}`}
                        renderItem={({item}) => <CourseCard
                            course={item}
                            half
                        />}
                        numColumns={2}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefreshPage}
                            />
                        }
                        contentContainerStyle={{
                            padding: 10
                        }}
                        estimatedItemSize={280}
                        onScroll={({ nativeEvent }) => {
                            if (isCloseToBottom(nativeEvent)) {
                                onScrollLoadMore();
                            }
                        }}
                        ListFooterComponent={loadingMore ? loadingMoreCmp : <View style={{ marginVertical: 20 }} />}
                    />
                    </>
                }

                <Portal>
                    <Modal
                        visible={showModal}
                        contentContainerStyle={{
                            backgroundColor: theme.dark ? "rgba(48, 55, 63, 1)" : "#fff",
                            margin: 15,
                            borderRadius: 5
                        }}
                        onDismiss={() => setShowModal(false)}
                    >
                        <Animated.View style={{
                            maxHeight: animatedHeight
                        }}>
                            <View style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                borderBottomWidth: 1,
                                borderBottomColor: "#ccc",
                                paddingHorizontal: 10
                            }}>
                                <View style={{
                                    width: 50
                                }} />

                                <Text style={[styles.heading, {
                                    color: theme.dark ? theme.colors.onBackground : "#000"
                                }]}>Filter Courses</Text>

                                <TouchableOpacity
                                    onPress={() => setShowModal(false)}
                                >
                                    <MaterialCommunityIcons
                                        name="close"
                                        size={27}
                                        color={theme.dark ? theme.colors.onBackground : "#000"}
                                    />
                                </TouchableOpacity>
                            </View>
                            
                            <ScrollView contentContainerStyle={{
                                paddingBottom: 20
                            }}>
                                <Searchbar
                                    placeholder="Search Courses"
                                    value={searchValue}
                                    onChangeText={setSearchValue}
                                    style={{
                                        marginHorizontal: 20,
                                        marginTop: 20,
                                        borderRadius: 5,
                                        borderWidth: 2,
                                        borderColor: "#ccc",
                                        backgroundColor: "transparent"
                                    }}
                                    inputStyle={{
                                        fontSize: 17
                                    }}
                                />

                                <View style={{
                                    padding: 20,
                                    paddingBottom: 0
                                }}>
                                    <Text style={[styles.headingText, {
                                        color: theme.dark ? theme.colors.onBackground : "#000"
                                    }]}>Price</Text>
                                    <ChecboxFilter
                                        data={priceType}
                                        onChange={(value) => setPriceType(value)}
                                    />
                                </View>

                                <View style={{
                                    padding: 20,
                                    paddingBottom: 0
                                }}>
                                    <Text style={[styles.headingText, {
                                        color: theme.dark ? theme.colors.onBackground : "#000"
                                    }]}>Level</Text>
                                    <ChecboxFilter
                                        data={labelType}
                                        onChange={(value) => setLabelType(value)}
                                    />
                                </View>
                            </ScrollView>
                        </Animated.View>

                        <Button
                            mode="contained"
                            style={{
                                borderRadius: 0,
                                borderBottomLeftRadius: 5,
                                borderBottomRightRadius: 5
                            }}
                            labelStyle={{
                                paddingVertical: 5
                            }}
                            onPress={() => {
                                setShowModal(false);
                                setLoading(true);
                                setHasMore(false);
                                setRefreshing(false);
                                if (page == 1) {
                                    getLandingPageOnline();
                                } else {
                                    setPage(1);
                                }
                            }}
                        >Apply Filter</Button>
                    </Modal>
                </Portal>
            </View>
        </BackMenu>
    )
}

const styles = StyleSheet.create({
    heading: {
        fontWeight: "500",
        padding: 15,
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
    }
})