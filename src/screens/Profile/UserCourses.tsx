import { RefreshControl, View } from 'react-native'
import React, { memo, useEffect, useState } from 'react'
import BackMenu from '../../components/BackMenu'
import { ActivityIndicator, useTheme } from 'react-native-paper';
import { AppTheme, CourseCardType, ErrorType } from '../../constants/types';
import { ExceptionHandler, isCloseToBottom } from '../../constants/Functions';
import axios from 'axios';
import Error from '../../components/Error';
import CoursesPlaceholder from '../../components/placeholder/CoursesPlaceholder';
import CourseCardProgress from '../../components/courses/CourseCardProgress';
import { CONFIG } from '../../constants';
import { FlashList } from '@shopify/flash-list';
import { BOTTOMTABHEIGHT } from '../../constants/defaults';
import axiosInstance from '../../constants/axiosInstance';

const renderCourseCard = ({ item, index }: {
    item: CourseCardType,
    index: number
}) => {
    return (
        <CourseCardProgress
            course={item}
            half
        />
    )
}

const UserCourses = (props: any) => {
    const { type } = props.route.params;
    const theme = useTheme<AppTheme>();

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

    const getLandingPageOnline = async () => {
        await axiosInstance.post(CONFIG.API.USER_COURSES, {
            page: page,
            type: type
        }).then((res) => {
            if (page == 1) {
                setData(res.data.data);
            } else {
                setData([...data, ...res.data.data]);
            }
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
            getLandingPageOnline();
        } else {
            setPage(1);
        }
    }

    const onScrollLoadMore = () => {
        if (!loadingMore && hasMore) {
            setLoadingMore(true);
            setPage(page + 1);
        }
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
            title={type == 'enroll' ? "Enrolled Courses" : type == 'active' ? "Active Courses" : "Completed Courses"}
            backgroundColor={theme.colors.background2}
        >
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
                    </View> : <FlashList
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
                            padding: 10,
                            paddingBottom:BOTTOMTABHEIGHT + 20,
                            backgroundColor : theme.colors.background2
                        }}
                        onScroll={({ nativeEvent }) => {
                            if (isCloseToBottom(nativeEvent)) {
                                onScrollLoadMore();
                            }
                        }}
                        estimatedItemSize={320}
                        ListFooterComponent={loadingMore ? loadingMoreCmp : <View style={{ marginVertical: 20 }} />}
                    />
                }
        </BackMenu>
    )
}

export default memo(UserCourses);