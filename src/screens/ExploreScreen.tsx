import { RefreshControl, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Appbar, Searchbar, useTheme } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native';
import { AppTheme, CategoryNewType, ErrorType } from '../constants/types';
import axios from 'axios';
import { ExceptionHandler, ToastMessage } from '../constants/Functions';
import Error from '../components/Error';
import BackMenu from '../components/BackMenu';
import { CONFIG } from '../constants';
import * as RNFS from "react-native-fs"
import { FlashList } from '@shopify/flash-list';
import { AppContext } from '../constants/context';
import { BOTTOMTABHEIGHT } from '../constants/defaults';
import axiosInstance from '../constants/axiosInstance';

const CategorySmallCard = ({
    citem,
    hasNetwork,
    navigation,
    item,
    backgroundColor
} : any) => {
    return (
        <TouchableOpacity
            key={citem.id}
            style={{
                borderColor: backgroundColor,
                borderWidth: 1,
                paddingHorizontal: 10,
                paddingVertical: 8,
                borderRadius: 5,
                backgroundColor: backgroundColor
            }}
            onPress={() => {
                if (hasNetwork) {
                    navigation.navigate("CoursesByCategory", {
                        category: item
                    })
                } else {
                    ToastMessage("error", "No Internet Connection");
                }
            }}
        >
            <Text>{citem.name}</Text>
        </TouchableOpacity>
    )
}

export default function ExploreScreen() {
    const navigation = useNavigation();
    const theme = useTheme<AppTheme>();

    const exploreScreenFile = RNFS.DocumentDirectoryPath + "/explore-screen.json";
    const { hasNetwork } = React.useContext(AppContext);

    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<CategoryNewType[]>([]);
    const [error, setError] = useState<ErrorType>({
        enable: false,
        title: "",
        message: ""
    });
    const [refreshing, setRefreshing] = useState(false);

    const handleOutput = async (content: CategoryNewType[], saveContent = true) => {
        try {
            setData(content);
            setLoading(false);
            setRefreshing(false);

            if (saveContent) {
                await RNFS.writeFile(exploreScreenFile, JSON.stringify(content));
            }
        } catch (error) {

        }
    }

    const getContentOffline = async (error: any) => {
        try {
            const content = await RNFS.readFile(exploreScreenFile);
            if (content == null) {
                throw "error";
            } else {
                handleOutput(JSON.parse(content), false);
            }
        } catch (e) {
            setLoading(false);
            setRefreshing(false);
            const { title, message } = ExceptionHandler(error);
            if (data.length <= 0) {
                setError({
                    enable: true,
                    title,
                    message
                });
            }
        }
    }

    const getCategoriesOnline = async (defaultSearch = false) => {
        await axiosInstance.post(CONFIG.API.CATEGORIES_NEW).then((res) => handleOutput(res.data)).catch((error) => {
            getContentOffline(error);
        });
    }

    useEffect(() => {
        let s = true;
        if (s) {
            getCategoriesOnline();
        }

        return () => {
            s = false;
        }
    }, [])

    const renderCategoryList = ({ item }: {
        item: CategoryNewType
    }) => {
        return (
            <View>
                <Text style={{
                    fontSize: 16,
                    fontWeight: "500",
                    marginBottom: 10
                }}>{item.name}</Text>

                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    flexWrap: "wrap",
                    marginBottom: 25
                }}>
                    {
                        item.child.length > 0 ?
                            item?.child.map((citem) => (
                                <CategorySmallCard
                                    key={citem.id}
                                    citem={citem}
                                    item={item}
                                    navigation={navigation}
                                    hasNetwork={hasNetwork}
                                    backgroundColor={theme.dark ? "rgb(37, 45, 62)" : "#fff"}
                                />
                            ))
                            :
                            <CategorySmallCard
                                key={item.id}
                                citem={item}
                                item={item}
                                navigation={navigation}
                                hasNetwork={hasNetwork}
                                backgroundColor={theme.dark ? "rgb(37, 45, 62)" : "#fff"}
                            />
                    }
                </View>
            </View>
        )
    }

    const refreshPage = () => {
        setLoading(false);
        setRefreshing(true);
        setError({
            ...error,
            enable: false
        });

        getCategoriesOnline();
    }

    const reloadPage = (dsearch = false) => {
        setLoading(true);
        setRefreshing(false);
        setError({
            ...error,
            enable: false
        });

        getCategoriesOnline(dsearch);
    }

    const headerPart = () => {
        return (
            <View>
                <Text style={{
                    fontSize: 15,
                    lineHeight: 22.5,
                    fontWeight: "500"
                }}><Text style={{ fontWeight: "bold" }}>Digital Gurkha</Text> is an Upskilling platform in Nepal that provides recorded online courses, Online Training & Physical Training Classes.</Text>

                <Text style={{
                    fontSize: 16,
                    fontWeight: "500",
                    marginVertical: 30
                }}>OUR COURSES</Text>
            </View>
        )
    }

    return (
        <BackMenu title='Courses' backgroundColor={theme.colors.background2}>
                {
                loading ? <View style={{ justifyContent: "center", alignItems: "center", flex: 1, flexDirection: "row" }}>
                    <ActivityIndicator animating />
                </View> :
                    error.enable ?
                        <View style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            flex: 1
                        }}>
                            <Error
                                title={error.title}
                                message={error.message}
                                button={{
                                    text: "Reload",
                                    onPress: reloadPage
                                }}
                            />
                        </View>
                        :
                        <FlashList
                            data={data}
                            keyExtractor={(item) => `category_${item.id}`}
                            renderItem={renderCategoryList}
                            refreshing={refreshing}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={refreshPage}
                                />
                            }
                            contentContainerStyle={{
                                padding: 15,
                                paddingBottom:BOTTOMTABHEIGHT + 20,
                                backgroundColor : theme.colors.background2
                            }}
                            estimatedItemSize={100}
                            ListHeaderComponent={headerPart}
                        />
            }
        </BackMenu>
    )
}

const styles = StyleSheet.create({})