import React, { useEffect } from 'react'

import { RootStackParamList } from '../constants/types';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SingleCourseScreen from '../screens/SingleCourseScreen';
import SingleLessonScreen from '../screens/SingleLessonScreen';
import CoursesByCategory from '../screens/CoursesByCategory';
import UserCourses from '../screens/Profile/UserCourses';
import UserPoints from '../screens/Profile/UserPoints';
import UserCourseQuiz from '../screens/Profile/UserCourseQuiz';
import UserSettings from '../screens/Profile/UserSettings';
import ChangePassword from '../screens/Profile/ChangePassword';
import UserQuizReport from '../screens/Profile/UserQuizReport';
import LessonPlayQuiz from '../screens/LessonPlayQuiz';
import Certificate from '../screens/Certificate';
import SingleQuestion from '../screens/QA/SingleQuestion';
import UserQA from '../screens/Profile/UserQA';
import Checkout from '../screens/Checkout';
import Reviews from '../screens/Reviews';
import DrawerStack from './DrawerStack';
import CourseFromLanding from '../screens/CourseFromLanding';

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppStack() {

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
            initialRouteName="TabScreen"
        >
            <Stack.Screen name="SingleCourse" component={SingleCourseScreen} />
            <Stack.Screen name="SingleLesson" component={SingleLessonScreen} />
            <Stack.Screen name="TabScreen" component={DrawerStack} />
            <Stack.Screen name="CoursesByCategory" component={CoursesByCategory} />
            <Stack.Screen name="Certificate" component={Certificate} />
            <Stack.Screen name="Checkout" component={Checkout} />
            <Stack.Screen name="UserCourses" component={UserCourses} />
            <Stack.Screen name="UserPoints" component={UserPoints} />
            <Stack.Screen name="UserCourseQuiz" component={UserCourseQuiz} />
            <Stack.Screen name="UserQA" component={UserQA} />
            <Stack.Screen name="UserSettings" component={UserSettings} />
            <Stack.Screen name="ChangePassword" component={ChangePassword} />
            <Stack.Screen name="UserQuizReport" component={UserQuizReport} />
            <Stack.Screen name="LessonPlayQuiz" component={LessonPlayQuiz} />
            <Stack.Screen name="SingleQuestion" component={SingleQuestion} />
            <Stack.Screen name="Reviews" component={Reviews} />
            <Stack.Screen name="CourseFromLanding" component={CourseFromLanding} />
        </Stack.Navigator>
    )
}