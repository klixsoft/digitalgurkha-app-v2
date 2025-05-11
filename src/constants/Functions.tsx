import axios, { AxiosError } from "axios";
import { UserType } from "./types";
import { CONFIG, SITE_URL, VERSION } from ".";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { Linking, NativeScrollEvent, ToastAndroid } from "react-native";
import InAppBrowser from "react-native-inappbrowser-reborn";
import { useTheme } from "react-native-paper";

/**
 * This will convert the hexcode to rgba color code
 * 
 * @param {*} hexCode 
 * @param {*} opacity 
 * @returns rgba Color Code
 */
export const convertHexToRGBA = (hexCode : string, opacity : number = 1) : string => {
    let hex = hexCode.replace('#', '');

    if (hex.length === 3) {
        hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    /* Backward compatibility for whole number based opacity values. */
    if (opacity > 1 && opacity <= 100) {
        opacity = opacity / 100;
    }

    return `rgba(${r},${g},${b},${opacity})`;
}

/**
 * This will check whether the string is valid url or not
 * @param {*} str 
 * @returns boolean
 */
export const isValidHttpUrl = (str : string) : boolean => {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}

export function isJson(str : string) {
    try {
        if (typeof str == "string"){
            JSON.parse(str);
        }
    } catch (e) {
        return false;
    }
    return true;
}

/**
 * It will remove all the html tags from string
 * @param {*} content 
 * @returns string
 */
export const removeHTMLTags = (content : string) : string | boolean => {
    if ((content === null) || (content === ''))
        return false;
    else
        content = content.toString();

    content = content.replace(/(<style[\w\W]+style>)/gm, '');
    content = content.replace(/(<script[\w\W]+script>)/gm, '');
    content = content.replace(/<style>(.*)<\/style>/ig, '');
    content = content.replace(/(<([^>]+)>)/ig, '');
    return content.replace(/\s+/g,'');
}

/**
 * Axios Exception Handler
 * @param {*} data 
 * @returns 
 */
export const ExceptionHandler = (error : any) : {
    code : string,
    message : string,
    title : string
} => {
    try {
        let title = "";
        let message = "";
        let code = "error";

        if (error.response) {
            title = "Error";
            message = error.response?.data?.message;
            code = error.response?.data?.code;
        } else if (error.message === 'Network Error') {
            title = "No Internet";
            message = "It seems that you are not connected with internet. Please connect with internet connection!!!";
        } else {
            title = "Something Went Wrong";
            message = `Reason: ${error.message}`;
        }
        return {
            title: title,
            message: message,
            code : code
        }
    } catch (e) {
        return {
            title: "Something Went Wrong",
            message: `Reason: ${error.message}`,
            code : "error"
        }
    }
}

/**
 * Setup axios default values
 * 
 * @since 2.7.6
 */
export const setUpAxiosDefault = async (paramsuser : UserType, token : string="") => {
    try {
        if( 
            axios.defaults.headers.common?.Authorization
        ){
            return true;
        }

        //axios default config
        let axiosAuthToken = "";
        if( token ){
            axiosAuthToken = token;
        }else if( paramsuser?.token ){
            axiosAuthToken = paramsuser?.tokens?.access_token;
        }
        
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + axiosAuthToken;
        axios.defaults.headers.common['VERSION'] = VERSION;

        console.log(axios.defaults.headers.common?.Authorization);
    } catch (error) {
        
    }
}


/**
 * Remove axios default values
 * 
 * @since 2.7.6
 */
 export const removeUpAxiosDefault = async () => {
    try {
        //remove if exists
        if( axios.defaults.headers.common.hasOwnProperty("Authorization")){
            delete axios.defaults.headers.common['Authorization'];
        }
    } catch (error) {

    }
}

/**
 * Send toast message
 */

export const ToastMessage = (type : string = "success", message : string, title : string = "") => {
    let textBodyStyle = {};
    let titleStyle = {};
    let alertType = ALERT_TYPE.SUCCESS;
    if( type == "success" ){
        textBodyStyle = titleStyle = {
            color : "rgb(30, 70, 32)"
        }
    }else if( type == "error" ){
        alertType = ALERT_TYPE.DANGER;
        textBodyStyle = titleStyle = {
            color : "rgb(95, 33, 32)"
        }
    }
    
    Toast.show({
        type : alertType,
        title : title,
        textBody : message,
        autoClose : 2500
    });
}

/**
 * Check whether scroll reached to bottom
 * @param param0 
 * @returns 
 */
export const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize } : NativeScrollEvent) => {
    const paddingToBottom = 700;
    const reached = layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom;
    return reached;
};


export const getRgb = (color : string) : string => {
    try {
        let rgbPattern = /rgb\((\d+), (\d+), (\d+)\)/;
        var match = color.match(rgbPattern);
        if (match) {
            return match.slice(1).join(', ');
        }
    } catch (error) {
        
    }
    return "";
}

export const openInBrowser = async (url : string, callback:(value : boolean) => void = () => {}) => {
    try {
        if( await InAppBrowser.isAvailable() ){
            await InAppBrowser.open(url).then(() => {
                callback(true);
            }).catch(() => {
                callback(false);
            })
        }else{
            await Linking.openURL(url).then(() => {
                callback(true);
            }).catch(() => {
                callback(false);
            });
        }
    } catch (error) {
        callback(false);
    }
}

export const openInAuthBrowser = async (url : string, redirect : string, callback:(value : boolean, res : any) => void = (value, res) => {}) => {
    try {
        if( await InAppBrowser.isAvailable() ){
            await InAppBrowser.openAuth(url, redirect, {
                // iOS Properties
                ephemeralWebSession: false,
                // Android Properties
                showTitle: false,
                enableUrlBarHiding: true,
                enableDefaultShare: false
            }).then((res) => {
                if( res?.type == "cancel" ){
                    callback(false, null);
                    ToastAndroid.show("Payment Cancelled by User", ToastAndroid.SHORT);
                }else{
                    callback(true, res);
                }
            }).catch((error) => {
                callback(false, error);
            })
        }else{
            await Linking.openURL(url + "?redirect_to_app=" + redirect).then(() => {
                callback(true, null);
            }).catch((error) => {
                callback(false, error);
            });
        }
    } catch (error) {
        callback(false, error);
    }
}