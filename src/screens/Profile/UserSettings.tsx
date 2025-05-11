import { StyleSheet, Text, ToastAndroid, View } from 'react-native'
import React, { useState } from 'react'
import BackMenu from '../../components/BackMenu'
import { ScrollView } from 'react-native-gesture-handler'
import { Button, TextInput } from 'react-native-paper'
import { AppContext } from '../../constants/context'
import axios from 'axios'
import { CONFIG } from '../../constants'
import { ExceptionHandler, ToastMessage } from '../../constants/Functions'
import axiosInstance from '../../constants/axiosInstance'

export default function UserSettings() {
    const { user, setUser } = React.useContext(AppContext);

    const [name, setName] = useState<string>(user.name);
    const [phone, setPhone] = useState<string>(user.phone);
    const [skill, setSkill] = useState<string>("");
    const [bio, setBio] = useState<string>("");
    const [updating, setUpdating] = useState(false);

    const updateProfile = async () => {
        if( name.length <= 0 ){
            ToastMessage("error", "Name should not be empty!!!", "Error");
            return false;
        }

        if( phone.length != 10 ){
            ToastMessage("error", "Please enter valid phone number!!!", "Error");
            return false;
        }

        setUpdating(true);
        await axiosInstance.post(CONFIG.API.UPDATE_USER, {
            name : name,
            phone : phone,
            skill : skill,
            bio : bio
        }).then((res) => {
            ToastMessage("success", "User updated successfully!!!");
            setUser(res.data);
        }).catch((error) => {
            const { title, message } = ExceptionHandler(error);
            ToastMessage("error", message, title);
        }).finally(() => {
            setUpdating(false);
        })
    }

    return (
        <BackMenu
            title="Settings"
        >
            <ScrollView contentContainerStyle={{
                padding: 15
            }}>
                <TextInput
                    mode="outlined"
                    value={name}
                    onChangeText={setName}
                    label="Full Name"
                    style={{
                        marginBottom: 20
                    }}
                />

                <TextInput
                    mode="outlined"
                    value={user.email}
                    label="Email"
                    style={{
                        marginBottom: 20
                    }}
                    disabled
                />

                <TextInput
                    mode="outlined"
                    value={phone}
                    onChangeText={setPhone}
                    label="Phone Number"
                    style={{
                        marginBottom: 20
                    }}
                />

                <TextInput
                    mode="outlined"
                    value={skill}
                    onChangeText={setSkill}
                    label="Skill/Occupation"
                    style={{
                        marginBottom: 20
                    }}
                />

                <TextInput
                    mode="outlined"
                    value={bio}
                    onChangeText={setBio}
                    label="Bio"
                    style={{
                        marginBottom: 20,
                        minHeight : 100
                    }}
                    multiline
                />

                <Button disabled={updating} loading={updating} mode="contained" onPress={updateProfile}>{updating ? "Updating . . ." : "Update Profile"}</Button>
            </ScrollView>
        </BackMenu>
    )
}

const styles = StyleSheet.create({})