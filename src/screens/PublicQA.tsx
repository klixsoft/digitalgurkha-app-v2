import { StatusBar, StyleSheet, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, AnimatedFAB, ProgressBar, useTheme } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { FlatList, RefreshControl } from 'react-native-gesture-handler';
import { AppTheme, ErrorType, QACardType } from '../constants/types';
import { ExceptionHandler, isCloseToBottom } from '../constants/Functions';
import BackMenu from '../components/BackMenu';
import Error from '../components/Error';
import QACard from '../components/QACard';
import CategoryPlaceHolder from '../components/placeholder/CategoryPlaceHolder';
import { CONFIG } from '../constants';
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import AskQuestion from './QA/AskQuestion';
import { FlashList } from '@shopify/flash-list';
import { AppContext } from '../constants/context';
import { BOTTOMTABHEIGHT } from '../constants/defaults';
import axiosInstance from '../constants/axiosInstance';

export default function PublicQA() {
    const theme = useTheme<AppTheme>();
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const {hasNetwork} = React.useContext(AppContext);

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
    const [reLoading, setReLoading] = useState(false);
    const [isExtended, setIsExtended] = React.useState<boolean>(true);


    const getLandingPageOnline = async (hidesheet = false) => {
        await axiosInstance.post(CONFIG.API.QA, {
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
            setReLoading(false);
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
            setReLoading(false);
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

    const renderBackdrop = (props: any) => <BottomSheetBackdrop
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior={"close"}
        {...props}
    />;

    return (
        <BackMenu
            title="Question & Answers"
            backgroundColor={theme.colors.background2}
        >
            <View style={{
                flex: 1,
                paddingBottom:BOTTOMTABHEIGHT + 20
            }}>
                <ProgressBar visible={reLoading} indeterminate={true} />
                {
                    loading ? <View style={{
                        marginVertical: 10,
                        marginLeft: 10,
                        flex: 1
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
                                    setPage(1);
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
                        keyExtractor={(item, index) => `qa_${index}_${item.id}`}
                        renderItem={(props) => <QACard {...props} />}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefreshPage}
                            />
                        }
                        contentContainerStyle={{
                            padding: 10,
                            paddingBottom:50
                        }}
                        onScroll={({ nativeEvent }) => {
                            if (isCloseToBottom(nativeEvent)) {
                                onScrollLoadMore();
                            }

                            const currentScrollPosition = Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
                            setIsExtended(currentScrollPosition <= 0);
                        }}
                        estimatedItemSize={200}
                        ListFooterComponent={loadingMore ? loadingMoreCmp : <View style={{ marginVertical: 20 }} />}
                    />
                }

                {hasNetwork && <AnimatedFAB
                    icon={'plus'}
                    label={'Ask Question'}
                    extended={isExtended}
                    onPress={() => bottomSheetRef.current?.present()}
                    visible={true}
                    animateFrom={'right'}
                    iconMode={'static'}
                    style={[styles.fabStyle, {
                        backgroundColor: theme.colors.primary
                    }]}
                    color="#fff"
                />}

                <BottomSheetModal
                    ref={bottomSheetRef}
                    snapPoints={['50%']}
                    backdropComponent={renderBackdrop}
                    backgroundStyle={{
                        backgroundColor : theme.dark ? "rgba(48, 55, 63, 1)" : "#fff"
                    }}
                >
                    <AskQuestion
                        onSuccess={() => {
                            setReLoading(true);
                            if (page == 1) {
                                getLandingPageOnline(true);
                            } else {
                                setPage(1);
                            }
                            bottomSheetRef.current?.close();
                        }}
                    />
                </BottomSheetModal>
            </View>
        </BackMenu>
    )
}

const styles = StyleSheet.create({
    fabStyle: {
        bottom: 80,
        right: 16,
        position: 'absolute'
    }
})