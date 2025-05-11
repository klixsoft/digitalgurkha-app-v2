import { StatusBar, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import BackMenu from '../../components/BackMenu'
import axios from 'axios';
import { ErrorType, QAAnswerCardType, QACardType } from '../../constants/types';
import { QAAnswerCardDefault } from '../../constants/defaults';
import { ExceptionHandler, isCloseToBottom } from '../../constants/Functions';
import { ActivityIndicator, AnimatedFAB, ProgressBar, useTheme } from 'react-native-paper';
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import CategoryPlaceHolder from '../../components/placeholder/CategoryPlaceHolder';
import Error from '../../components/Error';
import { FlatList, RefreshControl } from 'react-native-gesture-handler';
import QACard from '../../components/QACard';
import AddAnswer from './AddAnswer';
import { CONFIG } from '../../constants';
import axiosInstance from '../../constants/axiosInstance';

export default function SingleQuestion(props : any) {
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const theme = useTheme();
    
    const { question_id } = props.route.params;
    const [loading, setLoading] = useState(true);
    const [question, setQuestion] = useState<QACardType>(QAAnswerCardDefault);
    const [answers, setAnswers] = useState<QAAnswerCardType[]>([]);
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

    const getDataOnline = async () => {
        await axiosInstance.post(CONFIG.API.QA_ANSWERS, {
            page : page,
            id : question_id
        }).then((res) => {
            if (page == 1) {
                setAnswers(res.data.data);
            } else {
                setAnswers([...answers, ...res.data.data]);
            }
            setLoading(false);
            setHasMore(res.data.has_more);
            setRefreshing(false);
            setLoadingMore(false);
            setReLoading(false);
            setQuestion(res.data.question);
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
        })
    }

    const onRefreshPage = () => {
        setHasMore(false);
        setRefreshing(true);

        if (page == 1) {
            getDataOnline();
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
            getDataOnline();
        }
    }, [page])

    useEffect(() => {
        if( theme.dark ){
            StatusBar.setBarStyle("light-content");
            StatusBar.setBackgroundColor(theme.colors.background);
        }else{
            StatusBar.setBarStyle("dark-content");
            StatusBar.setBackgroundColor("#fff");
        }
    }, [])
    
    const renderBackdrop = (props : any) => <BottomSheetBackdrop
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior={"close"}
        {...props}
    />;

    const headerPart = () => {
        return(
            <View>
                <QACard item={question} />

                <Text style={{
                    fontWeight:"bold",
                    fontSize:20,
                    color : theme.colors.primary,
                    marginBottom:20,
                    textAlign : "center",
                    backgroundColor : theme.colors.secondaryContainer,
                    borderRadius:5,
                    padding : 10
                }}>Answers</Text>
            </View>
        )
    }

    const emptyComponent = () => {
        return (
            <View>
                <Error
                    title="Not Found"
                    message="We can't find any answer for this question."
                    button={{
                        text : "Reload Answers",
                        onPress : () => {
                            setReLoading(true);
                            getDataOnline();
                        }
                    }}
                />
            </View>
        )
    }
    
    return (
        <BackMenu
            title="Question & Answer"
        >
            <View style={{flex : 1}}>
                <ProgressBar visible={reLoading} indeterminate={true} />

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
                                        getDataOnline();
                                    }else{
                                        setPage(1);
                                    }
                                }
                            }}
                        />
                    </View> : <FlatList
                        data={answers}
                        keyExtractor={(item, index) => `qa_${index}_${item.id}`}
                        renderItem={(props) => <QACard {...props} />}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefreshPage}
                            />
                        }
                        contentContainerStyle={{
                            margin: 10
                        }}
                        ListEmptyComponent={emptyComponent}
                        ListHeaderComponent={headerPart}
                        onScroll={({ nativeEvent }) => {
                            if (isCloseToBottom(nativeEvent)) {
                                onScrollLoadMore();
                            }

                            const currentScrollPosition = Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
                            setIsExtended(currentScrollPosition <= 0);
                        }}
                        ListFooterComponent={loadingMore ? loadingMoreCmp : <View style={{ marginVertical: 20 }} />}
                    />
                }

                <AnimatedFAB
                    icon={'plus'}
                    label={'Add Answer'}
                    extended={isExtended}
                    onPress={() => bottomSheetRef.current?.present()}
                    visible={true}
                    animateFrom={'right'}
                    iconMode={'static'}
                    style={[styles.fabStyle, {
                        backgroundColor: theme.colors.primary
                    }]}
                    color="#fff"
                />

                <BottomSheetModal
                    ref={bottomSheetRef}
                    snapPoints={['50%']}
                    backdropComponent={renderBackdrop}
                    backgroundStyle={{
                        backgroundColor : theme.dark ? "rgba(48, 55, 63, 1)" : "#fff"
                    }}
                >
                    <AddAnswer 
                        onSuccess={() => {
                            setReLoading(true);
                            if( page == 1 ){
                                getDataOnline();
                            }else{
                                setPage(1);
                            }
                            bottomSheetRef.current?.close();
                        }}
                        question_id={question?.id}
                    />
                </BottomSheetModal>
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