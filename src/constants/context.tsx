import React from 'react';
import { CheckoutInfo, CourseCardType, SingleCourseType, UserType } from './types';
import { CheckoutInfoDefault, UserDefault } from './defaults';

type contextType = {
    signIn : (foundUser : UserType) => void;
    signOut : () => void;
    toggleTheme : (value : boolean) => void;
    setSpinner : (value : boolean) => void;
    setSpinnerText : (value : string) => void;
    spinnerText : string;
    user : UserType;
    playerID : string;
    cart : CheckoutInfo,
    setUser : (user : UserType) => void;
    setCart : (checkoutInfo : CheckoutInfo) => void;
    updateCheckoutInfo : (checkoutInfo : CheckoutInfo, callback?:() => void) => void;
    hasNetwork : boolean
}

const contextValue = {
    signIn : () => {},
    signOut : () => {},
    toggleTheme : () => {},
    setSpinner : () => {},
    setSpinnerText : () => {},
    spinnerText : "Please Wait",
    user : UserDefault,
    playerID : "",
    cart : CheckoutInfoDefault,
    setCart : () => {},
    setUser : () => {},
    updateCheckoutInfo : () => {},
    hasNetwork : true
}

export const AppContext = React.createContext<contextType>(contextValue);