import { Linking, StyleSheet, Text, View } from 'react-native'
import React, { memo, useEffect, useState } from 'react'
import { CheckoutInfo, CourseCardType, SingleCourseType } from '../../constants/types'
import { ActivityIndicator, Button, useTheme } from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import { ExceptionHandler, ToastMessage } from '../../constants/Functions'
import { AppContext } from '../../constants/context'
import { CheckoutInfoDefault } from '../../constants/defaults'
import { CONFIG } from '../../constants'

const CourseButtons = ({
    course,
    onAddedToCart=()=>{},
    onRemoveFromCart=()=>{},
    onRetakeCourse=()=>{}
}: {
    course: SingleCourseType,
    onAddedToCart?: () => void,
    onRemoveFromCart?: () => void
    onRetakeCourse?: () => void
}) => {
    const navigation = useNavigation();
    const theme = useTheme();
    const { cart, updateCheckoutInfo, hasNetwork } = React.useContext(AppContext);

    const [initalLoading, setInitalLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [isInCart, setIsInCart] = useState(false);

    const EnrolledDate = () => {
        return(
            <View style={{
                flexDirection : "row",
                alignItems : "center",
                gap:7,
                marginBottom:10
            }}>
                <MaterialCommunityIcons name="cart-check" size={20} color={theme.colors.primary} />
                <Text style={{
                    fontSize:15
                }}>You enrolled in this course on <Text style={{
                    fontWeight:"bold",
                    color : theme.colors.primary
                }}>{course.buttons.enrolled?.enroll_date}</Text></Text>
            </View>
        )
    }

    const reTakeCourse = async () => {
        setLoading(true);

        await axios.post(CONFIG.API.COURSE_RETAKE, {
            course_id: course.id
        }).then((res) => {
            setLoading(false);
            setInitalLoading(true);
            onRetakeCourse();
        }).catch((error) => {
            const { title, message } = ExceptionHandler(error);
            setLoading(false);
            ToastMessage("error", message, title);
        });
    }

    const continueLearnCourse = () => {
        if( hasNetwork ){
            navigation.navigate("SingleLesson", {
                course : course,
                lesson : course.buttons.lesson
            });
        }else{
            ToastMessage("error", "No Internet Connection");
        }
    }

    const viewCertificate = async () => {
        if( course.buttons.enrolled?.certificate ){
            navigation.navigate("Certificate", {
                certificate : course.buttons.enrolled?.certificate,
                course_title : course.name
            });
        }
    }

    const enrollCourseBtn = async () => {
        setLoading(true);

        await axios.post(CONFIG.API.COURSE_ENROLL, {
            course: course.id
        }).then((res) => {
            setLoading(false);

            navigation.navigate("SingleLesson", {
                course : course
            });
        }).catch((error) => {
            const { title, message } = ExceptionHandler(error);
            setLoading(false);
            ToastMessage("error", message, title);
        });
    }

    const addToCartProceed = () => {
        if( ! isInCart ){
            setIsInCart(true);
            let updatedCart = { ...cart };
            updatedCart.courses = [];
            updatedCart.courses.push({ ...course });

            updateCheckoutInfo(updatedCart);
            onAddedToCart();
        }
    }

    const removeFromCart = async () => {
        if( isInCart ){
            const updatedCart = { ...cart };
            const itemIndex = updatedCart.courses.findIndex((item) => item.id === course.id);

            if (itemIndex !== -1) {
                updatedCart.courses.splice(itemIndex, 1);
                setIsInCart(false);

                if( updatedCart.courses.length <= 0 ){
                    if( updatedCart.orderid > 0 ){
                        await axios.post(CONFIG.API.ORDER_DELETE, {
                            order : updatedCart.orderid
                        }).then((err) => {}).catch((err) => {})
                    }

                    updateCheckoutInfo(CheckoutInfoDefault);
                }else{
                    updateCheckoutInfo(updatedCart);
                }

                onRemoveFromCart();
            }
        }
    }

    const isCourseInCart = () => {
        const isInCart = cart.courses.some((cartItem) => cartItem.id === course.id);
        setIsInCart(isInCart);
    }

    const ShowButtons = () => {
        const buttonsToRender = [];

        if( course.buttons?.enrolled ){
            if( course.buttons.enrolled?.retake ){
                buttonsToRender.push(<Button 
                    key={"retakebtn"}
                    mode="contained"
                    onPress={reTakeCourse}
                    style={{
                        marginBottom:10
                    }}
                    disabled={loading}
                    loading={loading}
                >{loading ? "Preparing . . ." : "Retake Course"}</Button>);
            }

            if( course.buttons.enrolled.continue_learning ){
                buttonsToRender.push(<Button 
                    key={"continuelearnbtn"}
                    onPress={continueLearnCourse}
                    mode="contained"
                    style={{
                        marginBottom:10
                    }}
                >Continue Learning</Button>);
            }else if( course.buttons.enrolled?.start_learning ){
                buttonsToRender.push(<Button
                    key={"startlearnbtn"}
                    onPress={continueLearnCourse}
                    mode="contained"
                    style={{
                        marginBottom:10
                    }}
                >Start Learning</Button>);
            }

            if( course.buttons.enrolled?.certificate ){
                buttonsToRender.push(<Button 
                    key={"certificatebtn"}
                    mode="outlined"
                    style={{
                        borderColor : theme.colors.primary,
                        marginBottom:10
                    }}
                    onPress={viewCertificate}
                >View Certificate</Button>);
            }

            buttonsToRender.push(<EnrolledDate 
                key={"enrolleddate"}
            />);
        }else if( course.buttons?.enroll ){
            buttonsToRender.push(<Button 
                key={"enrollbtn"}
                mode="contained"
                onPress={enrollCourseBtn}
                style={{ marginBottom:15 }}
                disabled={loading}
                loading={loading}
            >{loading ? "Enrolling . . ." : "Enroll Course"}</Button>);
        }else if( course.buttons?.purchase ){
            if( isInCart ){
                buttonsToRender.push(<Button 
                    key={"proceedpaybtn"}
                    mode="contained"
                    onPress={() => navigation.navigate("Checkout")}
                    style={{ marginBottom:15 }}
                    icon="cart-outline"
                >{loading ? "Please Wait . . ." : "Proceed to Checkout"}</Button>);

                buttonsToRender.push(<Button 
                    key={"removeBtn"}
                    mode="outlined"
                    onPress={removeFromCart}
                    style={{ marginBottom:15 }}
                    icon="cart-remove"
                >{loading ? "Please Wait . . ." : "Remove From Cart"}</Button>);
            }else{
                buttonsToRender.push(<Button 
                    key={"buynowbtn"}
                    mode="contained"
                    onPress={addToCartProceed}
                    style={{ marginBottom:15 }}
                    icon="cart-outline"
                >{loading ? "Please Wait . . ." : "Buy Now"}</Button>);
            }
        }

        return buttonsToRender;
    }

    useEffect(() => {
        setInitalLoading(false);
        isCourseInCart(); 
    }, [course, cart])

    if( initalLoading ){
        return(
            <View style={{
                flexDirection :"row",
                alignItems:"center",
                justifyContent:"center",
                marginVertical:15
            }}>
                <ActivityIndicator animating size={20} />
            </View>
        )
    }

    return <ShowButtons />
}

export default memo(CourseButtons);