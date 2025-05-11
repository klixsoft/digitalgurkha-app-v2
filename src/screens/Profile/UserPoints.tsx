import { Alert, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AppTheme, ErrorType, PointType } from '../../constants/types';
import axios from 'axios';
import { ExceptionHandler, isCloseToBottom } from '../../constants/Functions';
import { ActivityIndicator, Icon, TextInput, useTheme } from 'react-native-paper';
import BackMenu from '../../components/BackMenu';
import CategoryPlaceHolder from '../../components/placeholder/CategoryPlaceHolder';
import Error from '../../components/Error';
import { FlatList, RefreshControl } from 'react-native-gesture-handler';
import Ionicons from "react-native-vector-icons/Ionicons"
import { CONFIG } from '../../constants';
import Clipboard from '@react-native-clipboard/clipboard';
import { FlashList } from '@shopify/flash-list';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { BOTTOMTABDARKCOLOR, BOTTOMTABHEIGHT } from '../../constants/defaults';
import axiosInstance from '../../constants/axiosInstance';


const RenderPointList = ({ item, theme }: {
    item: PointType,
    index?: number,
    theme: AppTheme
}) => {
    return (
        <View style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 10,
            marginBottom: 15,
            backgroundColor: theme.dark ? BOTTOMTABDARKCOLOR : "#fff",
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 1,
            },
            shadowOpacity: 0.20,
            shadowRadius: 1.41,
            elevation: 2,
            padding: 10,
            borderRadius: 10,
        }}>
            <MaterialCommunityIcons color={theme.colors.primary} size={50} name="trophy-award" />
            <View>
                <Text style={{
                    fontWeight: "bold",
                    color: theme.dark ? "#fff" : "#000",
                    marginBottom: 3
                }}>{item.title}</Text>
                <Text>Received -
                    <Text style={{
                        fontWeight: "bold",
                        color: theme.dark ? "#fff" : "#000"
                    }}>{item.point} Points</Text> on {item.date}</Text>
            </View>
        </View>
    )
}

export default function UserPoints() {
    const theme = useTheme<AppTheme>();

    const [data, setData] = useState<PointType[]>([]);
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
    const [referalLink, setReferalLink] = useState<string>("");
    const [referrer_message, setReferrer_message] = useState("");

    const getLandingPageOnline = async () => {
        await axiosInstance.post(CONFIG.API.USER_POINTS, {
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
            setReferalLink(res.data.referal_code);
            setReferrer_message(res.data.referrer_message);
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
        setPage(1);
        setHasMore(false);
        setRefreshing(true);
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
                paddingHorizontal: 15,
                paddingVertical: 10
            }}>
                <View style={{
                    flexDirection:"row",
                    alignItems:"center",
                    justifyContent:"space-between"
                }}>
                    <View>
                        <Text>Points</Text>
                        <Text style={{
                            fontSize:16,
                            fontWeight:"bold",
                            color : theme.dark ? "#ccc" : "#000",
                            marginTop:1
                        }}>Your available reward points:</Text>
                    </View>
                    <TouchableOpacity style={{
                        backgroundColor:theme.colors.primary,
                        paddingHorizontal:15,
                        paddingVertical:5,
                        borderRadius:5
                    }}>
                        <Text style={{
                            color : "#fff",
                            fontSize:20,
                            fontWeight:"bold"
                        }}>150</Text>
                    </TouchableOpacity>
                </View>

                <View style={{
                    flexDirection:"row",
                    justifyContent:"flex-start",
                    alignItems:"center",
                    marginTop:20
                }}>
                    <Text style={{
                        fontSize:20,
                        fontWeight:"bold",
                        color:theme.dark ? "#ccc" : "#000",
                        borderBottomColor:theme.colors.primary,
                        borderBottomWidth:3,
                        maxWidth:80,
                        paddingVertical:5,
                        textAlign:"center"
                    }}>History</Text>
                </View>
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
            title={"My Points"}
            backgroundColor={theme.colors.background2}
        >
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
                                setPage(1);
                                setError({
                                    ...error,
                                    enable: false
                                });
                            }
                        }}
                    />
                </View> : <>
                    <HeaderPart />
                    <FlashList
                        data={data}
                        keyExtractor={(item, index) => `point_${index}_${item.id}`}
                        renderItem={props => <RenderPointList
                            {...props}
                            theme={theme}
                        />}
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
                        estimatedItemSize={80}
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

const styles = StyleSheet.create({
    point: {
        fontWeight: "500",
        borderWidth: 1,
        borderColor: "#333",
        color: "#000",
        backgroundColor: "#ddd",
        borderRadius: 30,
        paddingHorizontal: 10
    },
    pointceil: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd"
    }
})