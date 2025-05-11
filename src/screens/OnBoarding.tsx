import { FlatList, StyleSheet, Text, View, Animated, ViewToken, ImageSourcePropType } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { WIDTH } from '../constants';
import LottieView from 'lottie-react-native';
import Paginator from '../components/Paginator';
import { Button, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

type onboradingType = {
    title: string,
    message: string,
    image: any
}

export default function OnBoarding() {
    const theme = useTheme();
    const navigation = useNavigation();

    const slidesRef = useRef<FlatList>(null);
    const data: onboradingType[] = [
        {
            title: "Welcome to Our eLearning Platform!",
            message: "Sign in to your account and discover our courses. Start your educational adventure with us.",
            image: require("../assets/welcome.lottie")
        },
        {
            title: "Discover Courses",
            message: "Explore our courses, discover your areas of interest, and get started with your initial course to access learning opportunities.",
            image: require("../assets/courses.lottie")
        },
        {
            title: "Easy Login Process",
            message: "Log in to your account hassle-free. Start your learning journey with a simple click.",
            image: require("../assets/login.lottie")
        },
        {
            title: "Begin Learning Today",
            message: "Congratulations on your purchase! Immerse yourself in your course materials and learn at your own pace.",
            image: require("../assets/learn.lottie")
        }
    ];
    const [currentIndex, setCurrentIndex] = useState<any>(0);

    const scrollX = useRef(new Animated.Value(0)).current;

    const onBoardItem = ({ item }: {
        item: onboradingType
    }) => {
        return (
            <View style={[styles.container, { width: WIDTH }]}>
                <LottieView
                    source={item.image}
                    style={{
                        width: WIDTH / 1.2,
                        height: WIDTH / 1.2,
                        marginBottom: 25
                    }}
                    autoPlay
                    loop
                />

                <View style={{ flex: 0.3 }}>
                    <Text style={[styles.title, {
                        color: theme.colors.onBackground
                    }]}>{item.title}</Text>
                    <Text style={styles.desc}>{item.message}</Text>
                </View>
            </View>
        )
    }

    const onViewableItemChanged = useRef(({ viewableItems }: {
        viewableItems: ViewToken[]
    }) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    const viewConfig = useRef({
        viewAreaCoveragePercentThreshold: 50
    }).current;

    return (
        <View style={styles.container}>
            <View style={{ flex: 3 }}>
                <FlatList
                    data={data}
                    keyExtractor={(item, index) => `${index}`}
                    renderItem={onBoardItem}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
                        useNativeDriver: false
                    })}
                    onViewableItemsChanged={onViewableItemChanged}
                    viewabilityConfig={viewConfig}
                    ref={slidesRef}
                    scrollEventThrottle={32}
                    onEndReachedThreshold={0.1}
                />
            </View>

            <View style={{
                flexDirection : "row",
                alignItems : "center",
                justifyContent : "space-between",
                width : "100%",
                marginVertical : 20,
                marginHorizontal:30
            }}>
                <View 
                    style={{
                        width : 50
                    }}
                />

                <Paginator
                    data={data}
                    scrollX={scrollX}
                    backgroundColor={theme.colors.primary}
                />

                <Button
                    onPress={() => navigation.navigate("Login")}
                >Skip</Button>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    title: {
        fontWeight: "800",
        fontSize: 28,
        marginBottom: 10,
        textAlign: "center"
    },
    desc: {
        fontSize: 17,
        fontWeight: "500",
        textAlign: "center",
        paddingHorizontal: 30
    }
})