import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Appbar, useTheme } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../constants/context';
import { ScrollView } from 'react-native-gesture-handler';
import ProgressImage from '../components/ProgressImage';
import { HEIGHT, WIDTH } from '../constants';
import MenuList from '../components/MenuList';

export default function ProfileScreen() {
    const theme = useTheme();
    const navigation = useNavigation();
    const { user } = React.useContext(AppContext);

    

    return (
        <View style={{
            flex: 1
        }}>
            <Appbar>
                <Appbar.BackAction onPress={() => navigation.goBack()} iconColor='#fff' />
                <Appbar.Content titleStyle={{
                    color: "#fff"
                }} title="Profile" />
            </Appbar>

            <ScrollView
                contentContainerStyle={{
                    marginBottom:50
                }}
            >
                <View style={{
                    flexDirection: "column",
                    alignItems: "center",
                    paddingVertical: 25,
                    height: 220
                }}>
                    <ProgressImage
                        source={{
                            uri: user.image
                        }}
                        style={{
                            width: 100,
                            height: 100,
                            marginBottom: 20
                        }}
                        imageStyle={{
                            borderRadius: 100
                        }}
                    />

                    <Text style={{
                        fontSize: 17,
                        fontWeight:"bold"
                    }}>{user.name}</Text>
                    <Text style={{
                        fontSize: 17
                    }}>{user.email}</Text>
                </View>

                <View style={{
                    backgroundColor: theme.dark ? "rgba(48, 55, 63, 1)" : "#e1e1e1",
                    flex : 1,
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30,
                    padding:25
                }}>
                    <MenuList
                        title="Profile"
                        icon="person-outline"
                    />

                    <MenuList
                        title="Enrolled Courses"
                        icon="book-outline"
                        onPress={() => navigation.navigate("UserCourses", {
                            type : "enroll"
                        })}
                    />

                    <MenuList
                        title="Active Courses"
                        icon="school-outline"
                        onPress={() => navigation.navigate("UserCourses", {
                            type : "active"
                        })}
                    />

                    <MenuList
                        title="Completed Courses"
                        icon="cube-outline"
                        onPress={() => navigation.navigate("UserCourses", {
                            type : "completed"
                        })}
                    />

                    <MenuList
                        title="User Points"
                        icon="trophy-outline"
                        onPress={() => navigation.navigate("UserPoints")}
                    />

                    <MenuList
                        title="Course Quiz"
                        icon="podium-outline"
                        onPress={() => navigation.navigate("UserCourseQuiz", {})}
                    />

                    <MenuList
                        title="Question & Answer"
                        icon="help-buoy-outline"
                        onPress={() => navigation.navigate("UserQA")}
                    />

                    <View style={styles.divider} />

                    <MenuList
                        title="Settings"
                        icon="settings-outline"
                        onPress={() => navigation.navigate("UserSettings")}
                    />

                    <MenuList
                        title="Change Password"
                        icon="lock-closed-outline"
                        onPress={() => navigation.navigate("ChangePassword")}
                    />


                    <MenuList
                        title="Logout"
                        icon="log-out-outline"
                    />
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    divider : {
        width : "100%",
        height : 1,
        backgroundColor : "#ccc",
        marginTop:10,
        marginBottom:40
    }
})