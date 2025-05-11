import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Appbar, Button, Checkbox, Modal, Portal, RadioButton, TextInput, useTheme } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native';
import CoursesPlaceholder from '../components/placeholder/CoursesPlaceholder';
import { ChecboxFilterData, CourseCardType, ErrorType } from '../constants/types';
import axios from 'axios';
import { ExceptionHandler, isCloseToBottom } from '../constants/Functions';
import { FlatList, RefreshControl } from 'react-native-gesture-handler';
import Error from '../components/Error';
import CourseCard from '../components/courses/CourseCard';
import BackMenu from '../components/BackMenu';
import { CONFIG } from '../constants';
import { FlashList } from '@shopify/flash-list';
import axiosInstance from '../constants/axiosInstance';

const renderCourseCard = ({ item }: {
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

export default function CourseFromLanding(props: any) {
    const { source } = props.route.params;

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

    const getLandingPageOnline = async () => {

        await axiosInstance.post(CONFIG.API.COURSES_LANDING, {
            page: page,
            source: source
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

    const headerPart = () => {
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

    return (
        <BackMenu
            title={source == "featured" ?
                "Featured Courses"
                :
                source == "trending" ?
                    "Trending Courses"
                    :
                    source == "popular" ?
                        "Popular Courses" : "Courses"
            }
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
                    </View> : <>{headerPart()}<FlashList
                        data={data}
                        keyExtractor={(item, index) => `course_${index}_${item.id}`}
                        renderItem={renderCourseCard}
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
                        onScroll={({ nativeEvent }) => {
                            if (isCloseToBottom(nativeEvent)) {
                                onScrollLoadMore();
                            }
                        }}
                        estimatedItemSize={280}
                        ListFooterComponent={loadingMore ? loadingMoreCmp : <View style={{ marginVertical: 20 }} />}
                    />
                    </>
                }
            </View>
        </BackMenu>
    )
}

const styles = StyleSheet.create({})