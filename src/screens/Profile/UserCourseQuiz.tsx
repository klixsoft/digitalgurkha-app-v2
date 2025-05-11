import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { ErrorType, QuizCardType } from '../../constants/types';
import { ExceptionHandler, isCloseToBottom } from '../../constants/Functions';
import { ActivityIndicator } from 'react-native-paper';
import BackMenu from '../../components/BackMenu';
import CategoryPlaceHolder from '../../components/placeholder/CategoryPlaceHolder';
import Error from '../../components/Error';
import { FlatList, RefreshControl } from 'react-native-gesture-handler';
import QuizCard from '../../components/QuizCard';
import { CONFIG } from '../../constants';
import axiosInstance from '../../constants/axiosInstance';

export default function UserCourseQuiz(props : any) {
    const { quiz_id } = props.route.params;
    const [data, setData] = useState<QuizCardType[]>([]);
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
        const REQURL = quiz_id ? CONFIG.API.USER_LESSON_QUIZ_ATTEMPTS : CONFIG.API.USER_LESSON_QUIZ;
        await axiosInstance.post(REQURL, {
            page: page,
            quiz_id : quiz_id
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

        if( page == 1 ){
            getLandingPageOnline();
        }else{
            setPage(1);
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
                paddingHorizontal: 15,
                paddingVertical: 10,
                borderWidth: 1.5,
                borderColor: "#ccc",
                borderRadius: 5,
                margin: 10
            }}>
                <Text>{total} Attempts Found</Text>
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
        getLandingPageOnline();
    }, [page])

    return (
        <BackMenu
            title={quiz_id ? "Lesson Attempts" : "Courses Quiz"}
        >
            {
                loading ? <View style={{
                    marginVertical: 10,
                    marginLeft: 10
                }}>
                    <CategoryPlaceHolder
                        item={10}
                    />
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

                                if( page == 1 ){
                                    getLandingPageOnline();
                                }else{
                                    setPage(1);
                                }
                            }
                        }}
                    />
                </View> : <>{headerPart()}<FlatList
                    data={data}
                    keyExtractor={(item, index) => `course_${index}_${item.id}`}
                    renderItem={(props) => <QuizCard {...props} />}
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
                    ListFooterComponent={loadingMore ? loadingMoreCmp : <View style={{ marginVertical: 20 }} />}
                />
                </>
            }
        </BackMenu>
    )
}

const styles = StyleSheet.create({})