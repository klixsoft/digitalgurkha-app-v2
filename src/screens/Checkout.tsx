import { Alert, Keyboard, RefreshControl, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button, Card, TextInput, useTheme } from 'react-native-paper';
import { CONFIG } from '../constants';
import BackMenu from '../components/BackMenu';
import { ScrollView } from 'react-native-gesture-handler';
import { AppContext } from '../constants/context';
import { CheckoutInfo, SingleCourseType } from '../constants/types';
import ProgressImage from '../components/ProgressImage';
import { TouchableOpacity } from '@gorhom/bottom-sheet';
import Price from '../components/courses/Price';
import { ExceptionHandler, ToastMessage, openInAuthBrowser } from '../constants/Functions';
import axios from 'axios';
import { CheckoutInfoDefault } from '../constants/defaults';
import Error from '../components/Error';
import { useNavigation } from '@react-navigation/native';
import axiosInstance from '../constants/axiosInstance';

export default function Checkout() {
    const theme = useTheme();
    const navigation = useNavigation();

    const { cart, user, setSpinner, updateCheckoutInfo, setSpinnerText } = React.useContext(AppContext);
    const [coupon, setCoupon] = useState<string>(cart.coupon.text);
    const [paymentMode, setPaymentMode] = useState<string>("");
    const [phone, setPhone] = useState(user.phone);
    const [refreshing, setRefreshing] = useState(false);
    const [processing, setProcessing] = useState(true);
    
    const isCourseInCart = (course: SingleCourseType) => {
        return cart.courses.some((cartItem) => cartItem.id === course.id);
    }

    const removeCourseBtn = async (course: SingleCourseType) => {
        if (isCourseInCart(course)) {
            const updatedCart = { ...cart };
            const itemIndex = updatedCart.courses.findIndex((item) => item.id === course.id);

            if (itemIndex !== -1) {
                updatedCart.courses.splice(itemIndex, 1);

                if (updatedCart.courses.length <= 0) {
                    if (updatedCart.orderid > 0) {
                        await axios.post(CONFIG.API.ORDER_DELETE, {
                            order: updatedCart.orderid
                        }).then((err) => { }).catch((err) => { })
                    }
                    
                    updateCheckoutInfo(CheckoutInfoDefault);
                } else {
                    updateCheckoutInfo(updatedCart);
                }
            }
        }
    }

    const CartCourseCard = ({ course }: {
        course: SingleCourseType
    }) => {
        return (
            <View style={styles.card}>
                <View>
                    <ProgressImage
                        source={{
                            uri: course.image
                        }}
                        style={styles.image}
                    />
                </View>

                <View style={styles.details}>
                    <Text style={[styles.title, {
                        color : theme.colors.onBackground
                    }]}>{course.name}</Text>
                    <Price
                        sale={course.saleprice}
                        price={course.price}
                    />
                    <TouchableOpacity disabled={processing} onPress={() => removeCourseBtn(course)} style={styles.removeButton}>
                        <Text style={styles.removeButtonText}>Remove</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    const validateCoupon = async () => {
        if (coupon.length <= 0) {
            ToastMessage("error", "Please provide coupon!!!", "Error");
            return;
        }

        setSpinnerText("Applying . . .");
        setSpinner(true);
        Keyboard.dismiss();

        const products = cart.courses.map(obj => obj.id);
        await axiosInstance.post(CONFIG.API.VALIDATE_COUPON, {
            coupon: coupon,
            order: cart.orderid,
            products: products,
            phone: phone,
            payment: paymentMode
        }).then((res) => {
            setSpinner(false);

            setCoupon("");
            updateCheckoutInfo({
                ...cart,
                ...res.data,
                recalculate: false
            });
        }).catch((error) => {
            setSpinner(false);
            const { title, message } = ExceptionHandler(error);
            ToastMessage("error", message, title);
        });
    }

    const removeCoupon = async () => {
        if (cart.orderid > 0) {
            setProcessing(true);
            setSpinnerText("Removing . . .");
            setSpinner(true);
            await axios.post(CONFIG.API.REMOVE_COUPON, {
                order: cart.orderid
            }).then((res) => {
                setSpinner(false);

                setCoupon("");
                updateCheckoutInfo({
                    ...cart,
                    ...res.data
                });
                setProcessing(false);
            }).catch((error) => {
                setSpinner(false);
                const { title, message } = ExceptionHandler(error);
                ToastMessage("error", message, title);
                setProcessing(false);
            });
        } else {
            updateCheckoutInfo({
                ...cart,
                coupon: CheckoutInfoDefault.coupon
            }, () => {
                setProcessing(false);
            });
        }
    }

    const createNewOrder = async () => {
        if (phone.length <= 0) {
            ToastMessage("error", "Phone Number is required!!!", "Error");
            return;
        }

        if (paymentMode.length <= 0) {
            ToastMessage("error", "Please select Payment Mode!!!", "Error");
            return;
        }

        setProcessing(true);
        setSpinner(true);
        Keyboard.dismiss();

        const products = cart.courses.map(obj => obj.id);
        await axios.post(CONFIG.API.ORDER_CREATE, {
            products: products,
            coupon: coupon,
            phone: phone,
            payment: paymentMode,
            order: cart.orderid
        }).then((res) => {
            setSpinner(false);
            updateCheckoutInfo({
                ...cart,
                ...res.data
            }, () => {
                const REDIRECT_URL = "digitalgurkha://order/status/";
                openInAuthBrowser(res.data.next_url, REDIRECT_URL, (value, res) => {
                    if( ! value ){
                        setSpinnerText("Preparing Order . . .");
                        setSpinner(true);
                        validateOrder();
                    }
                })
            });
        }).catch((error) => {
            const { title, message } = ExceptionHandler(error);

            ToastMessage("error", message, title);
            setSpinner(false);
            setProcessing(false);
        });
    }

    const validateOrder = async () => {
        const products = cart.courses.map(obj => obj.id);
        await axios.post(CONFIG.API.ORDER_VALIDATE, {
            products: products,
            coupon: coupon,
            phone: phone,
            payment: paymentMode ?? "esewa",
            order: cart.orderid
        }).then((res) => {
            updateCheckoutInfo({
                ...cart,
                ...res.data
            }, () => {
                setSpinner(false);
            });
        }).catch((error) => {
            const { title, message, code } = ExceptionHandler(error);
            if( code == 'completed' ){
                try {
                    if( cart.courses.length > 0 ){
                        updateCheckoutInfo(CheckoutInfoDefault, () => {
                            setSpinner(false);
    
                            navigation.navigate("SingleCourse", {
                                slug : message
                            });
                        });
                    }
                } catch (error) {
                    
                }
            }else if( code == 'hold' ){
                Alert.alert("On hold", message, [
                    {
                        text : "Ok",
                        onPress : () => {
                            try {
                                if( cart.courses.length > 0 ){
                                    setProcessing(true);
                                    updateCheckoutInfo(CheckoutInfoDefault, () => {
                                        setSpinner(false);
                                    });
                                }
                            } catch (error) {
                                
                            }
                        }
                    }
                ])
            }else{
                ToastMessage("error", message, title);
            }
        }).finally(() => {
            setSpinner(false);
            setRefreshing(false);
            setProcessing(false);
        });
    }

    useEffect(() => {
        try {
            if( cart.courses.length > 0 ){
                setSpinnerText("Preparing Order . . .");
                setSpinner(true);
    
                validateOrder();
            }
        } catch (error) {
            
        }
    }, [])

    return (
        <BackMenu
            title="Checkout"
        >
            {
                cart.courses.length > 0 ? <ScrollView
                    contentContainerStyle={{
                        padding: 10
                    }}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => {
                                setProcessing(true);
                                setRefreshing(true);
                                validateOrder();
                            }}
                        />
                    }
                    showsVerticalScrollIndicator={false}
                >
                    {
                        cart.courses.map((item: SingleCourseType) => {
                            return <CartCourseCard
                                course={item}
                                key={item.id}
                            />
                        })
                    }

                    <Card
                        style={{
                            backgroundColor: theme.dark ? "rgba(48, 55, 63, 1)" : "#fff",
                            padding: 15
                        }}
                    >
                        <Text style={{
                            fontWeight: "500",
                            fontSize: 17,
                            marginBottom: 15
                        }}>Billing Details</Text>

                        <TextInput
                            value={user.name}
                            mode="outlined"
                            label="Full Name"
                            outlineColor={theme.colors.primary}
                            outlineStyle={{
                                borderWidth: 2
                            }}
                            disabled
                        />

                        <View style={{
                            marginTop: 20
                        }}>
                            <TextInput
                                value={user.email}
                                mode="outlined"
                                label="Email"
                                outlineColor={theme.colors.primary}
                                outlineStyle={{
                                    borderWidth: 2
                                }}
                                disabled
                            />
                        </View>

                        <View style={{
                            marginTop: 20
                        }}>
                            <TextInput
                                value={phone}
                                mode="outlined"
                                label="Phone Number"
                                outlineColor={theme.colors.primary}
                                outlineStyle={{
                                    borderWidth: 2
                                }}
                                onChangeText={(text) => setPhone(text)}
                            />
                        </View>
                    </Card>

                    <Card
                        style={{
                            backgroundColor: theme.dark ? "rgba(48, 55, 63, 1)" : "#fff",
                            padding: 15,
                            marginTop: 20
                        }}
                    >
                        <Text style={{
                            fontWeight: "500",
                            fontSize: 17,
                            marginBottom: 15
                        }}>Coupon</Text>

                        {
                            cart.coupon.text ?
                                <Button
                                    mode="outlined"
                                    style={{
                                        borderColor: theme.colors.primary,
                                    }}
                                    onPress={removeCoupon}
                                >Remove Coupon - {cart.coupon.text}</Button>
                                :
                                <View>
                                    <TextInput
                                        value={coupon}
                                        mode="outlined"
                                        label="Coupon"
                                        onChangeText={(text) => setCoupon(text)}
                                        outlineColor={theme.colors.primary}
                                        outlineStyle={{
                                            borderWidth: 2
                                        }}
                                    />

                                    <Button
                                        mode="outlined"
                                        onPress={validateCoupon}
                                        style={{
                                            borderColor: theme.colors.primary,
                                            marginTop: 10,
                                            borderWidth: 2,
                                            borderRadius: 5
                                        }}
                                    >Apply Coupon</Button>
                                </View>
                        }
                    </Card>

                    <Card
                        style={{
                            backgroundColor: theme.dark ? "rgba(48, 55, 63, 1)" : "#fff",
                            paddingVertical: 10,
                            paddingHorizontal: 20,
                            marginVertical: 20
                        }}
                    >
                        <Text style={{
                            fontWeight: "500",
                            fontSize: 17,
                            marginBottom: 15
                        }}>Order Overview</Text>

                        <View style={styles.row}>
                            <Text style={[styles.rowleft, {
                                color : theme.colors.onBackground
                            }]}>Sub Total</Text>
                            <Text style={[styles.rowright, {
                                color : theme.colors.onBackground
                            }]}>Rs. {cart.subTotal}</Text>
                        </View>

                        {
                            cart.discount > 0 ? <View style={styles.row}>
                                <Text style={[styles.rowleft, {
                                    color : theme.colors.onBackground
                                }]}>Discount</Text>
                                <Text style={[styles.rowright, {
                                    color : theme.colors.onBackground
                                }]}>- Rs. {cart.discount}</Text>
                            </View> : null
                        }

                        <View style={styles.row}>
                            <Text style={[styles.rowleft, {
                                color : theme.colors.onBackground
                            }]}>Total</Text>
                            <Text style={[styles.rowright, {
                                color : theme.colors.onBackground
                            }]}>Rs. {cart.total}</Text>
                        </View>
                    </Card>

                    {
                        cart.total > 0 ? <>
                            <TouchableOpacity style={[styles.paymentMode, paymentMode == 'esewa' ? {
                                borderColor: theme.colors.primary,
                                backgroundColor: theme.colors.surfaceVariant
                            } : {}]} onPress={() => setPaymentMode("esewa")}>
                                <ProgressImage
                                    source={{
                                        uri: "https://digitalgurkha.com/wp-content/plugins/esewa/assets/images/esewa__.png"
                                    }}
                                    style={{
                                        width: 30,
                                        height: 30
                                    }}
                                />
                                <Text style={{
                                    color : theme.colors.onBackground,
                                    fontWeight: "500"
                                }}>eSewa</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.paymentMode, {
                                marginBottom: 0
                            }, paymentMode == 'khalti' ? {
                                borderColor: theme.colors.primary,
                                backgroundColor: theme.colors.surfaceVariant
                            } : {}]} onPress={() => setPaymentMode("khalti")}>
                                <ProgressImage
                                    source={{
                                        uri: "https://avatars.githubusercontent.com/u/31564639?s=48&v=4"
                                    }}
                                    style={{
                                        width: 30,
                                        height: 30
                                    }}
                                />
                                <Text style={{
                                    color : theme.colors.onBackground,
                                    fontWeight: "500"
                                }}>Khalti</Text>
                            </TouchableOpacity>

                            <Button
                                mode="contained"
                                style={{
                                    marginVertical: 20
                                }}
                                onPress={createNewOrder}
                                disabled={paymentMode.length <= 0 || processing}
                                loading={processing}
                            >Proceed to Pay</Button>
                        </>
                            :
                            <Button
                                mode="contained"
                                style={{
                                    marginVertical: 20
                                }}
                                onPress={createNewOrder}
                                disabled={processing}
                                loading={processing}
                            >Place Order</Button>
                    }
                </ScrollView> : <View style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingHorizontal: 15
                }}>
                    <Error
                        title="No Courses"
                        message="Please add some courses to cart to proceed checkout."
                        button={{
                            text: "Purchase Courses",
                            onPress: () => {
                                navigation.navigate("TabScreen", {
                                    screen: "Courses"
                                });
                            }
                        }}
                    />
                </View>
            }
        </BackMenu>
    )
}

const styles = StyleSheet.create({
    paymentMode: {
        borderRadius: 5,
        borderColor: "#ccc",
        borderWidth: 1.5,
        borderStyle: "solid",
        padding: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 15,
        marginBottom: 15
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
    },
    image: {
        width: 100,
        height: 100,
        marginRight: 16,
        borderRadius: 4,
    },
    details: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: "#000"
    },
    removeButton: {
        backgroundColor: '#ff6347',
        padding: 8,
        borderRadius: 4,
        alignItems: 'center',
        marginTop: 5
    },
    removeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15
    },
    rowleft: {
        color: "#000",
        fontWeight: "500",
        fontSize: 16
    },
    rowright: {
        color: "#000",
        fontSize: 16
    }
})