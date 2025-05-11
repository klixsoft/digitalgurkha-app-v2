import { StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, ProgressBar, useTheme } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { FlatList, RefreshControl } from 'react-native-gesture-handler';
import { ErrorType, QACardType } from '../../constants/types';
import { ExceptionHandler, isCloseToBottom } from '../../constants/Functions';
import BackMenu from '../../components/BackMenu';
import Error from '../../components/Error';
import QACard from '../../components/QACard';
import CategoryPlaceHolder from '../../components/placeholder/CategoryPlaceHolder';
import { CONFIG } from '../../constants';
import { FlashList } from '@shopify/flash-list';
import axiosInstance from '../../constants/axiosInstance';

export default function UserQA() {
    const theme = useTheme();
    const navigation = useNavigation();
    
    const [data, setData] = useState<QACardType[]>([]);
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


    const getLandingPageOnline = async (hidesheet = false) => {
        await axiosInstance.post(CONFIG.API.USER_QA, {
            page: page
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
            setRefreshing(false);
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
        <BackMenu title="User Q&A">
            <View style={{
                flex: 1
            }}>
                {
                    loading ? <View style={{
                        marginVertical: 10,
                        marginLeft: 10
                    }}>
                        <CategoryPlaceHolder
                            item={20}
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
                    </View> : <FlashList
                        data={data}
                        keyExtractor={(item, index) => `qa_${index}_${item.id}`}
                        renderItem={(props) => <QACard {...props} />}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefreshPage}
                            />
                        }
                        contentContainerStyle={{
                            padding: 10
                        }}
                        estimatedItemSize={250}
                        onScroll={({ nativeEvent }) => {
                            if (isCloseToBottom(nativeEvent)) {
                                onScrollLoadMore();
                            }
                        }}
                        ListFooterComponent={loadingMore ? loadingMoreCmp : <View style={{ marginVertical: 20 }} />}
                    />
                }
            </View>
        </BackMenu>
    )
}

const styles = StyleSheet.create({
    fabStyle: {
        bottom: 16,
        right: 16,
        position: 'absolute'
    }
})