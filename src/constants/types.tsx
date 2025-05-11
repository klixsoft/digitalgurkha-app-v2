/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { DarkThemeColors, DarkThemeFinal } from "./Theme";

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList { }
    }
}

export type RootStackParamList = {
    HomeTab: undefined;
    
    Welcome: undefined;
    OnBoarding: undefined;
    Login: undefined;
    Register: undefined;
    ForgetPassword: undefined;
    Home: undefined;
    SingleCourse: {
        slug: string
    };
    SingleLesson: {
        course: SingleCourseType;
        lesson?: number;
    };
    TabScreen: {
        screen?: "Home" | "Courses" | "Explore" | "EnrolledCourses" | "ActiveCourses" | "CompletedCourses" | "UserPoints" | "UserCourseQuiz" | "QuestionAnswer" | "Settings" | "ChangePassword" | "QA";
    };
    CoursesByCategory: {
        category: CategoryType
    };
    UserCourses: {
        type: string;
    };
    UserPoints: undefined;
    Certificate: {
        certificate: CertificateType,
        course_title : string
    };
    UserCourseQuiz: {
        quiz_id?: number;
        course_id?: number;
    };
    UserQA: undefined;
    UserSettings: undefined;
    ChangePassword: undefined;
    UserQuizReport: {
        attempt_id: number
    },
    LessonPlayQuiz: {
        quiz_id: number,
        quiz_title: string
    },
    SingleQuestion: {
        question_id: number
    },
    Checkout: undefined
    Payment: {
        order : number,
        khalti_url?: string
    },
    Reviews : {
        course_id : number,
        course_title : string
    },
    CourseFromLanding : courseListInfoArgs
};

export type ProgressType = {
    completed_percent: number,
    completed_count: number,
    total_count: number
}

export type CourseCardType = {
    id: number;
    slug: string;
    name: string;
    image: string;
    instructor: string;
    saleprice: number;
    price: number;
    link: string;
    rating: {
        value: number,
        total: number
    },
    duration: string;
    desc: string;
    preview: string;
    progress?: ProgressType
}

export type CourseLessonSubTopic = {
    id: number,
    link: string,
    name: string,
    locked: boolean,
    video: string,
    completed: boolean,
    type: string,
    extra_info?: any
}

export type CourseLessonTopic = {
    id: number
    name: string;
    link: string;
    sub_topics: CourseLessonSubTopic[];
}

export type CourseProgressType = {
    completed_percent: number;
    completed_count: number;
    total_count: number;
}

export type CertificateType = {
    url: string,
    hash: string,
    image: string,
    course: string,
    issued_by: string,
    issue_date: string
}

export type InstructorType = {
    id : number,
    name : string,
    courses : number,
    students : number,
    rating : {
        value : number,
        total : number
    },
    job : string,
    bio : string,
    image : string
}

export type RatingDetailsIndividualType = {
    label : string,
    per : number,
    total : number
}

export type RatingDetailsType = {
    rating: RatingDetailsIndividualType[],
    average : number,
    total : number
}

export type CourseReviewSingleType = {
    id : number,
    image : string,
    name : string,
    ago : string,
    message : string,
    rating : number
}

export type CourseReviewsType = {
    data: CourseReviewSingleType[],
    current_page: number,
    posts_per_page: number,
    total_pages: number,
    total: number,
    has_more: boolean,
    is_new: boolean,
    rating: RatingDetailsType
}

export type SingleCourseType = {
    id: number
    image: string;
    name: string;
    instructor: string;
    saleprice: number;
    price: number;
    rating: {
        value: number;
        total: number
    },
    link: string;
    duration: string;
    preview: string;
    desc: string;
    requirements: string[],
    materials: string[],
    audience: string[],
    topics: CourseLessonTopic[],
    buttons: {
        lesson: number,
        enrolled?: {
            progress: CourseProgressType,
            retake?: number;
            continue_learning?: boolean,
            start_learning?: boolean;
            enroll_date: string;
            certificate?: CertificateType;
        },
        enroll?: boolean;
        purchase?: boolean;
    },
    instructor_info : InstructorType,
    thumbnail : {
        type : string,
        url : string
    },
    rating_info : RatingDetailsType
}

export type SliderType = {
    image: string;
    link: string;
}

export type CategoryType = {
    id: number;
    name: string;
    count: number;
}

export type CategoryNewType = CategoryType & {
    child : CategoryNewType[]
}

export type NavigationScreenType = {
    screen : any,
    args : any
}

export type landingPageInfoType = {
    courses: courseListInfo[],
    slider: SliderType[],
    cats: CategoryType[],
    suggestions : string[]
}

export type courseListInfoArgs = {
    source: string,
    number: number,
    category: string
}

export type courseListInfo = {
    courses: CourseCardType[],
    title: string,
    args: courseListInfoArgs,
    navigation : NavigationScreenType | null
}

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
    NativeStackScreenProps<RootStackParamList, Screen>;

export type UserType = {
    id: number;
    name: string;
    fname: string;
    username: string;
    email: string;
    image: string;
    phone: string;
    courses: {
        enrolled: number,
        active: number,
        completed: number
    },
    points: number;
    token: string;
    tokens: {
        access_token: string,
        refresh_token: string
    }
}

export type ErrorType = {
    enable: boolean;
    message: string;
    title: string;
}

export type PointType = {
    id: number,
    point: number,
    title: string,
    date: string
}

export type QuizCardType = {
    id: number,
    title: string,
    course: number,
    quiz: number,
    summary: {
        total: number,
        answered: number,
        total_marks: number,
        earned_marks: number,
        earned_per: number,
        correct: number,
        incorrect: number,
        result: boolean
    },
    course_title: string
}

export type QuizAttemptResultType = {
    status: "correct" | "incorrect",
    question: string,
    given_answer: string[],
    correct_answer: string[]
}

export type QuizDetailsType = QuizCardType & {
    info: QuizAttemptResultType[]
}

export type QuizOptionType = {
    id: number,
    title: string,
    correct: boolean
}

export type QuizQuestionType = {
    sn: number,
    question: string,
    options: QuizOptionType[],
    id: number,
    type: string,
    hint: string,
    selected: string[]
}

export type QAAnswerCardType = {
    id: number,
    content: string,
    author: {
        name: string,
        image: string
    },
    publish_ago: string,
    publish: string
}

export type QACardType = QAAnswerCardType & {
    count?: number
}

export type QASingleCardType = {
    answers: QAAnswerCardType[]
}

export type LoginDetailType = {
    loginID?: string,
    type: "google" | "fb" | "custom",
    email: string,
    name?: string | null,
    response?: any,
    playerID: string,
    password?: string,
    profile?: string | null,
}

export type CheckoutInfo = {
    subTotal: number,
    total: number,
    coupon: {
        text: string,
        discountby: string | "per" | "fixed" | "fixedpd",
        discount: number
    },
    discount: number,
    courses : SingleCourseType[],
    orderid : number,
    recalculate : boolean
}

export type ChecboxFilterData = {
    value : string,
    label : string,
    checked : boolean
}

export type AppTheme = typeof DarkThemeFinal