import React from "react";
import { Dimensions } from "react-native";

export const VERSION = "1.0.2";

export const SKELETON_SPEED = 1500;
export const SKELETON_BG = '#dddddd';
export const SKELETON_HIGHLIGHT = '#e7e7e7';
export const MAX_RATING_DEVIATION = 200;

const { height, width } = Dimensions.get("window");

export const HEIGHT = height;
export const WIDTH = width;

export const VIDEO_PLAYER_HEIGHT = (9 / 16) * width;

export const loginReducer = (prevState : any, action : {
    type : string,
    token?: string,
    id?: string
}) => {
    switch (action.type) {
        case 'RETRIEVE_TOKEN':
            return {
                ...prevState,
                userToken: action.token,
                isLoading: false,
            };
        case 'LOGIN':
            return {
                ...prevState,
                userName: action.id,
                userToken: action.token,
                isLoading: false,
            };
        case 'LOGOUT':
            return {
                ...prevState,
                userName: null,
                userToken: null,
                isLoading: false,
            };
        case 'REGISTER':
            return {
                ...prevState,
                userName: action.id,
                userToken: action.token,
                isLoading: false,
            };
    }
};

export const SITE_URL = "https://digitalgurkha.com/";
export const getAPIURL = (path : string) : string => {
    return SITE_URL + "wp-json/app/v1/" + path;
}

export const CONFIG = {
    URL : SITE_URL,
    BASE_API_URL : getAPIURL(""),
    PACKAGE : "com.digitalgurkha",
    VERSION : VERSION,
    API : {
        LOGIN : getAPIURL("account/login"),
        LOGOUT : getAPIURL("logout/"),
        FORGETPASS : getAPIURL("account/forget-password/"),
        CERTIFICATE_HASH : SITE_URL + `tutor-certificate?regenerate=1&cert_hash=`,
        CHANGE_PASSWORD : getAPIURL("user/change-password/"),
        UPDATE_USER : getAPIURL("user/update/"),
        USER_INFO : getAPIURL("account/details/"),

        USER_LESSON_QUIZ_ATTEMPTS : getAPIURL("user/lesson/quiz/attempts/"),
        USER_LESSON_QUIZ : getAPIURL("user/lesson-quiz/"),
        USER_COURSES : getAPIURL("user/courses/"),
        USER_POINTS : getAPIURL("user/points/"),
        USER_QA : getAPIURL("user/QA/"),
        USER_SINGLE_LESSON_QUIZ : getAPIURL("user/single-lesson-quiz/"),
        
        ORDER_CREATE : getAPIURL("order/create/"),
        ORDER_VALIDATE : getAPIURL("order/validate/"),
        ORDER_DELETE : getAPIURL("order/delete/"),
        VALIDATE_COUPON : getAPIURL("validate/coupon/"),
        REMOVE_COUPON : getAPIURL("remove/coupon/"),
        UPDATE_ORDER : getAPIURL("order/update/"),

        COURSES : getAPIURL("courses/"),
        COURSES_LANDING : getAPIURL("courses/landing/"),
        CATEGORIES : getAPIURL("categories/"),
        CATEGORIES_NEW : getAPIURL("categories/child/"),
        LANDING : getAPIURL("landing/"),
        COURSE_SINGLE : getAPIURL("single/course/"),
        COURSE_ENROLL : getAPIURL("course/enroll/"),
        COURSE_RETAKE : getAPIURL("course/retake/"),

        LESSON_QUIZ : getAPIURL("lesson/quiz/"),
        LESSON_QUIZ_SUBMIT : getAPIURL("lesson/quiz/submit/"),
        MARK_COMPLETE : getAPIURL("lesson/mark-complete/"),

        QA : getAPIURL("qa/"),
        QA_PUBLISH_ANSWER : getAPIURL("qa/publish/answer/"),
        QA_PUBLISH_QUESTION : getAPIURL("qa/publish/question/"),
        QA_ANSWERS : getAPIURL("qa/answers/"),

        COURSE_REVIEWS : getAPIURL("course/reviews/"),
        ADD_NEW_REVIEW : getAPIURL("course/review/add/"),

        HANDLE_DEEP_LINK : getAPIURL("deep/linking/")
    }
}