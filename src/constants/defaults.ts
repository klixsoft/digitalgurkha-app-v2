export const SingleCoursePage = {
    id: 0,
    image: "",
    name: "",
    instructor: "",
    saleprice: 0,
    price: 0,
    rating: {
        value: 0,
        total: 0
    },
    link: "",
    duration: "",
    preview: "",
    desc: "",
    requirements: [],
    materials: [],
    audience: [],
    topics: [],
    buttons : {
        lesson: 0
    },
    instructor_info : {
        id : 0,
        name : "",
        courses : 0,
        students : 0,
        rating : {
            value : 0,
            total : 0
        },
        job : "",
        bio : "",
        image : ""
    },
    thumbnail : {
        type : "image",
        url : ""
    },
    rating_info : {
        rating : [],
        average : 0,
        total : 0
    }
}

export const ReviewsDefault = {
    data: [],
    current_page: 0,
    posts_per_page: 0,
    total_pages: 0,
    total: 0,
    has_more: false,
    is_new: true,
    rating: {
        average: 3,
        total: 2,
        rating : []
    }
}

export const SingleCourseSubTopicDefault = {
    id: 0,
    link: "",
    name: "",
    locked: false,
    video: "",
    completed : false,
    type : "video"
}

export const CourseProgressDefault = {
    completed_percent: 0,
    completed_count: 0,
    total_count: 0
}   

export const UserDefault = {
    id: 0,
    name: "",
    fname : "",
    username: "",
    email: "",
    image: "",
    phone : "",
    courses: {
        enrolled: 0,
        active: 0,
        completed: 0
    },
    points: 0,
    token: "",
    tokens: {
        access_token: "",
        refresh_token: ""
    }
}

export const QuizDetailsDefault = {
    id: 0,
    title: "",
    course: 0,
    quiz: 0,
    summary: {
        total:0,
        answered:0,
        total_marks: 0,
        earned_marks: 0,
        earned_per:0,
        correct: 0,
        incorrect: 0,
        result: true
    },
    info: [],
    course_title : ""
}

export const QuizQuestionDefault = {
    sn: 0,
    question: "",
    options: [],
    id: 0,
    type: "",
    hint: ""
}

export const QAAnswerCardDefault = {
    id: 0,
    content: "",
    author: {
        name: "",
        image: ""
    },
    publish_ago: "",
    publish: "",
    count : 0
}

export const CheckoutInfoDefault = {
    subTotal: 0,
    total: 0,
    coupon: {
        text: "",
        discountby: "per",
        discount: 0
    },
    discount: 0,
    courses : [],
    orderid : 0,
    recalculate : true
}

export const BOTTOMTABHEIGHT = 60;
export const BOTTOMTABDARKCOLOR = "rgb(37, 45, 62)";
export const BOTTOMTABLIGHTCOLOR = "#fff";