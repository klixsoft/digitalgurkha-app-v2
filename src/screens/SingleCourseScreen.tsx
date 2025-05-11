import { Animated, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Appbar, Button, useTheme } from 'react-native-paper'
import VideoPlayer from '../components/VideoPlayer';
import { AppTheme, CourseCardType, ErrorType, SingleCourseType } from '../constants/types';
import { RefreshControl, ScrollView } from 'react-native-gesture-handler';
import Rating from '../components/Rating';
import Price from '../components/courses/Price';
import CourseContent from '../components/courses/CourseContent';
import { ExceptionHandler, ToastMessage } from '../constants/Functions';
import { CheckoutInfoDefault, SingleCoursePage } from '../constants/defaults';
import CourseDescription from '../components/courses/CourseDescription';
import SingleCoursePagePlaceholder from '../components/placeholder/SingleCoursePagePlaceholder';
import { useNavigation } from '@react-navigation/native';
import CourseButtons from '../components/courses/CourseButtons';
import Error from '../components/Error';
import BackMenu from '../components/BackMenu';
import { CONFIG, WIDTH } from '../constants';
import ProgressImage from '../components/ProgressImage';
import CourseInstructor from '../components/courses/CourseInstructor';
import CourseListContent from '../components/courses/CourseListContent';
import RatingOverView from '../components/courses/RatingOverView';
import PriceVertical from '../components/courses/PriceVertical';
import { AppContext } from '../constants/context';
import * as RNFS from "react-native-fs"
import axiosInstance from '../constants/axiosInstance';

export default function SingleCourseScreen(props: any) {
    const { slug } = props.route.params;

    const theme = useTheme<AppTheme>();
    const navigation = useNavigation();
    const reviewsRef = useRef<any>(null);
    const scrollViewRef = useRef<any>(null);
    const courseButtonRef = useRef<View>(null);
    const { cart, updateCheckoutInfo, hasNetwork } = React.useContext(AppContext);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [data, setData] = useState<SingleCourseType>(SingleCoursePage);
    const [error, setError] = useState<ErrorType>({
        enable: false,
        message: "",
        title: ""
    });
    const [isInCart, setIsInCart] = useState(false);

    const [initialHeight, setInitialHeight] = useState(0);
    const scaleAnimate = useRef(new Animated.Value(-80)).current;

    const scrollToReview = () => {
        try {
            if (reviewsRef.current) {
                reviewsRef.current.measureLayout(
                    scrollViewRef.current.getInnerViewNode(),
                    (x: number, y: number) => {
                        scrollViewRef.current.scrollTo({ y: y - 25, animated: true });
                    }
                );
            }
        } catch (error) {

        }
    };

    const handleOutput = async (content: SingleCourseType, saveContent = true) => {
        try {
            setData(content);
            setLoading(false);
            setRefreshing(false);

            setError({
                ...error,
                enable: false
            });

            if (saveContent) {
                await RNFS.writeFile(RNFS.DocumentDirectoryPath + "/course-" + content.id + ".json", JSON.stringify(content));
            }
        } catch (error) {

        }
    }

    const getContentOffline = async (error: any) => {
        try {
            const content = await RNFS.readFile(RNFS.DocumentDirectoryPath + "/course-" + data.id + ".json");
            if (content == null) {
                throw "error";
            } else {
                handleOutput(JSON.parse(content), false);
            }
        } catch (e) {
            const { title, message } = ExceptionHandler(error);
            setLoading(false);
            setRefreshing(false);

            if( data.id <= 0 ){
                setError({
                    enable: true,
                    message,
                    title
                });
            }else{
                ToastMessage("error", message);
            }
        }
    }

    const getCourseInfoOnline = async () => {
        try {
            await axiosInstance.post(CONFIG.API.COURSE_SINGLE, {
                course: slug
            }).then((res) => handleOutput(res.data)).catch(getContentOffline);
        } catch (error) {

        }
    }

    const _onRefresh = () => {
        setRefreshing(true);
        getCourseInfoOnline();
    }

    useEffect(() => {
        getCourseInfoOnline();
    }, [slug])

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        try {
            if (initialHeight > 0) {
                if (event.nativeEvent.contentOffset.y + event.nativeEvent.layoutMeasurement.height > initialHeight &&
                    event.nativeEvent.contentOffset.y < initialHeight) {
                    Animated.timing(scaleAnimate, {
                        toValue: -80,
                        duration: 400,
                        useNativeDriver: false,
                    }).start();
                } else {
                    Animated.timing(scaleAnimate, {
                        toValue: 0,
                        duration: 400,
                        useNativeDriver: false,
                    }).start();
                }
            } else {
                handleLayout();
            }
        } catch (error) {

        }
    };

    const handleLayout = () => {
        if (courseButtonRef.current) {
            courseButtonRef.current.measureLayout(
                scrollViewRef.current.getInnerViewNode(),
                (x: number, y: number, width: number, height: number) => {
                    setInitialHeight(y + height);
                }
            );
        }
    };

    useEffect(() => {
        if (data?.id) {
            const isInCart = cart.courses.some((cartItem) => cartItem.id === data.id);
            setIsInCart(isInCart);
        }
    }, [data, cart])


    const addToCartProceed = () => {
        if (!isInCart) {
            let updatedCart = { ...cart };
            updatedCart.courses = [];
            updatedCart.courses.push({ ...data });
            updateCheckoutInfo(updatedCart);
        }
    }

    return (
        <BackMenu title="Course">
            <View style={{
                flex: 1,
                position: "relative"
            }}>
                {
                    error.enable ? <View style={{
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
                                onPress: () => {
                                    setLoading(true);
                                    setError({
                                        ...error,
                                        enable: false
                                    });
                                    getCourseInfoOnline();
                                }
                            }}
                        />
                    </View>
                        :
                        <ScrollView ref={scrollViewRef} onScroll={handleScroll} contentContainerStyle={theme.dark ? {
                            // backgroundColor : "#fff"
                        } : {
                            backgroundColor: "#f5f4f8"
                        }} refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={_onRefresh}
                            />
                        }>
                            {
                                loading ? <SingleCoursePagePlaceholder /> : <>
                                    {
                                        data.thumbnail.type == "image" ?
                                            <ProgressImage
                                                source={{
                                                    uri: data.thumbnail.url
                                                }}
                                                style={{
                                                    width: WIDTH,
                                                    height: (129 / 203) * WIDTH
                                                }}
                                                resizeMode="cover"
                                            />
                                            :
                                            <VideoPlayer
                                                video={data?.preview}
                                            />
                                    }

                                    <View style={{
                                        padding: 15
                                    }}>
                                        <Text style={{
                                            fontWeight: "bold",
                                            fontSize: 20,
                                            color: theme.dark ? theme.colors.onBackground : "#000",
                                            marginBottom: 5
                                        }}>{data?.name}</Text>

                                        <TouchableOpacity
                                            onPress={scrollToReview}
                                        >
                                            <Rating
                                                value={data?.rating.value}
                                                total={data?.rating.total}
                                            />
                                        </TouchableOpacity>

                                        <Text style={{
                                            color: theme.dark ? theme.colors.onBackground : "#000",
                                            marginVertical: 10,
                                            fontSize: 16
                                        }}>Created by {data?.instructor}</Text>

                                        <Price
                                            sale={data?.saleprice}
                                            price={data?.price}
                                        />

                                        <View ref={courseButtonRef} style={{
                                            marginVertical: 15
                                        }} onLayout={handleLayout}>
                                            <CourseButtons
                                                course={data}
                                                onAddedToCart={() => setIsInCart(true)}
                                                onRemoveFromCart={() => setIsInCart(false)}
                                                onRetakeCourse={getCourseInfoOnline}
                                            />
                                        </View>

                                        <CourseContent
                                            data={data?.topics}
                                            onPressLesson={(lesson) => {
                                                if( hasNetwork ){
                                                    if (!lesson.locked && data.buttons?.purchase == undefined) {
                                                        navigation.navigate("SingleLesson", {
                                                            course: data,
                                                            lesson: lesson.id
                                                        });
                                                    } else {
                                                        ToastMessage("error", "Lesson is locked");
                                                    }
                                                }else{
                                                    ToastMessage("error", "No Internet Connection");
                                                }
                                            }}
                                        />

                                        <CourseInstructor
                                            instructor={data.instructor_info}
                                        />

                                        <CourseDescription content={data.desc} />

                                        <View ref={reviewsRef} style={{
                                            marginBottom: 25
                                        }}>
                                            <Text style={{
                                                marginBottom: 15,
                                                fontWeight: "bold",
                                                color: theme.dark ? theme.colors.onBackground : "#000",
                                                fontSize: 18,
                                                textAlign: "center"
                                            }}>Reviews</Text>

                                            <RatingOverView
                                                data={data.rating_info}
                                            />

                                            <Button
                                                mode="contained"
                                                style={{
                                                    marginTop: 10
                                                }}
                                                onPress={() => navigation.navigate("Reviews", {
                                                    course_id: data.id,
                                                    course_title: data.name
                                                })}
                                            >
                                                All Reviews
                                            </Button>
                                        </View>

                                        <CourseListContent
                                            title="Requirements"
                                            data={data.requirements}
                                            theme={theme}
                                        />

                                        <CourseListContent
                                            title="Audience"
                                            data={data.audience}
                                            theme={theme}
                                        />
                                    </View>
                                </>
                            }
                        </ScrollView>
                }

                {
                    data.buttons?.purchase ?
                        data?.price && !loading ? <Animated.View
                            style={{
                                position: "absolute",
                                bottom: scaleAnimate,
                                width: WIDTH
                            }}
                        >
                            <View style={{
                                backgroundColor: theme.dark ? theme.colors.inversePrimary : "#fff",
                                flexDirection: "row",
                                justifyContent: "flex-start",
                                alignItems: "center",
                                paddingHorizontal: 20,
                                paddingVertical: 5,
                                borderTopWidth: 1,
                                borderTopColor: theme.dark ? theme.colors.inversePrimary : "#ccc"
                            }}>
                                <View style={{
                                    width: 110
                                }}>
                                    <PriceVertical
                                        price={data.price}
                                        sale={data.saleprice}
                                    />
                                </View>

                                {isInCart ? <Button
                                    mode="contained"
                                    style={{
                                        borderRadius: 10,
                                        width: WIDTH - 150
                                    }}
                                    onPress={() => navigation.navigate("Checkout")}
                                    icon="cart-outline"
                                >Proceed to Checkout</Button> : <Button
                                    mode="contained"
                                    style={{
                                        borderRadius: 10,
                                        width: WIDTH - 150
                                    }}
                                    onPress={addToCartProceed}
                                    icon="cart-outline"
                                >Buy Now</Button>}
                            </View>
                        </Animated.View> : null : null
                }
            </View>
        </BackMenu>
    )
}

const styles = StyleSheet.create({})