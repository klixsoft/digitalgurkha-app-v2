import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import BackMenu from '../components/BackMenu'
import { ReviewsDefault } from '../constants/defaults';
import { CourseReviewSingleType, CourseReviewsType, ErrorType, RatingDetailsType } from '../constants/types';
import { ActivityIndicator, Button, ProgressBar, useTheme } from 'react-native-paper';
import { CONFIG } from '../constants';
import { ExceptionHandler, isCloseToBottom } from '../constants/Functions';
import { FlatList, RefreshControl } from 'react-native-gesture-handler';
import Error from '../components/Error';
import ReviewsPlaceHolder from '../components/placeholder/ReviewsPlaceHolder';
import ReviewCard from '../components/ReviewCard';
import RatingOverView from '../components/courses/RatingOverView';
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import AddReview from '../components/AddReview';
import { FlashList } from '@shopify/flash-list';
import axiosInstance from '../constants/axiosInstance';

const renderReviewCard = (props: {
    item: CourseReviewSingleType,
    index: number
}) => {
    return (
        <ReviewCard {...props} />
    )
}

export default function Reviews(props: any) {
    const { course_id, course_title } = props.route.params;
    const theme = useTheme();
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    const [data, setData] = useState<CourseReviewSingleType[]>([]);
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
    const [rating, setRating] = useState<RatingDetailsType>(ReviewsDefault.rating);
    const [reLoading, setReLoading] = useState(false);
    const [hasContentAccess, setHasContentAccess] = useState(false);

    const getLandingPageOnline = async () => {

        await axiosInstance.post(CONFIG.API.COURSE_REVIEWS, {
            page: page,
            course: course_id
        }).then((res) => {
            if (page == 1) {
                setData(res.data.data);
            } else {
                setData([...data, ...res.data.data]);
            }

            setRating(res.data.rating);
            setLoading(false);
            setHasMore(res.data.has_more);
            setRefreshing(false);
            setLoadingMore(false);
            setReLoading(false);
            setHasContentAccess(res.data.has_access);
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
            setReLoading(false);
        });
    }

    const onRefreshPage = () => {
        setHasMore(false);
        setReLoading(false);
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
            setReLoading(false);
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

    const headerPart = () => {
        return (
            <View>
                <RatingOverView
                    data={rating}
                />

                <Text style={{
                    fontWeight: "bold",
                    fontSize: 20,
                    color: theme.colors.primary,
                    marginVertical: 20,
                    textAlign: "center",
                    backgroundColor: theme.colors.secondaryContainer,
                    borderRadius: 5,
                    padding: 10
                }}>Reviews</Text>
            </View>
        )
    }

    const renderBackdrop = (props: any) => <BottomSheetBackdrop
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior={"close"}
        {...props}
    />;

    useEffect(() => {
        if (page) {
            getLandingPageOnline();
        }
    }, [page])

    return (
        <BackMenu
            title={course_title}
        >
            <View style={{
                flex: 1
            }}>
                <ProgressBar visible={reLoading} indeterminate />

                {
                    loading ? <View style={{
                        marginVertical: 10,
                        marginLeft: 10
                    }}>
                        <ReviewsPlaceHolder
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

                                    if (page == 1) {
                                        getLandingPageOnline();
                                    } else {
                                        setPage(1);
                                    }
                                }
                            }}
                        />
                    </View> : <>
                        <FlashList
                            data={data}
                            keyExtractor={(item, index) => `course_${index}_${item.id}`}
                            renderItem={renderReviewCard}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefreshPage}
                                />
                            }
                            contentContainerStyle={{
                                padding: 15
                            }}
                            onScroll={({ nativeEvent }) => {
                                if (isCloseToBottom(nativeEvent)) {
                                    onScrollLoadMore();
                                }
                            }}
                            estimatedItemSize={300}
                            ListHeaderComponent={headerPart}
                            ListFooterComponent={loadingMore ? loadingMoreCmp : <View style={{ marginVertical: 20 }} />}
                        />

                        { hasContentAccess && <Button
                            mode="contained"
                            style={{
                                borderRadius: 0
                            }}
                            labelStyle={{
                                paddingVertical: 3
                            }}
                            onPress={() => bottomSheetRef.current?.present()}
                        >Write Review</Button> }
                    </>
                }

                <BottomSheetModal
                    ref={bottomSheetRef}
                    snapPoints={['50%']}
                    backdropComponent={renderBackdrop}
                    backgroundStyle={{
                        backgroundColor: theme.dark ? "rgba(48, 55, 63, 1)" : "#fff"
                    }}
                >
                    <AddReview
                        onSuccess={() => {
                            setReLoading(true);
                            if (page == 1) {
                                getLandingPageOnline();
                            } else {
                                setPage(1);
                            }
                            bottomSheetRef.current?.close();
                        }}
                        course_id={course_id}
                    />
                </BottomSheetModal>
            </View>
        </BackMenu>
    )
}

const styles = StyleSheet.create({})