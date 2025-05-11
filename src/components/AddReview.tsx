import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { Button, Checkbox, TextInput } from 'react-native-paper';
import axios from 'axios';
import { ExceptionHandler, ToastMessage } from '../constants/Functions';
import { CONFIG } from '../constants';
import UserRating from './UserRating';

export default function AddReview({
    onSuccess = () => {},
    course_id
} : {
    onSuccess : () => void,
    course_id : number
}) {
    const [message, setMessage] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [checked, setChecked] = useState(false);
    const [rating, setRating] = useState(5);

    const submitQuestion = async () => {
        if (!checked) {
            ToastMessage("error", "You must accept terms and conditions.");
            return;
        }

        if (message.length <= 0) {
            ToastMessage("error", "Please provide the review.");
            return;
        }

        setLoading(true);
        await axios.post(CONFIG.API.ADD_NEW_REVIEW, {
            message: message,
            course : course_id,
            rating : rating
        }).then((res) => {
            setLoading(false);
            onSuccess();
        }).catch((error) => {
            const { title, message } = ExceptionHandler(error);
            ToastMessage("error", message, title);
            setLoading(false);
        });
    }

    return (
        <View style={{
            padding: 10
        }}>
            <View style={{
                flexDirection : "row",
                alignItems : "center",
                justifyContent : "center",
                marginBottom:10
            }}>
                <UserRating
                    rating={rating}
                    onChange={setRating}
                />
            </View>

            <TextInput
                label="Review"
                value={message}
                onChangeText={text => setMessage(text)}
                multiline
                mode="outlined"
                style={{
                    minHeight: 100,
                    marginBottom: 20
                }}
                disabled={loading}
            />

            <View style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: 10,
                marginBottom: 20
            }}>
                <Checkbox
                    status={checked ? 'checked' : 'unchecked'}
                    onPress={() => {
                        setChecked(!checked);
                    }}
                    disabled={loading}
                />
                <Text>I accept all terms and conditions.</Text>
            </View>

            <Button
                mode="contained"
                disabled={loading}
                loading={loading}
                onPress={submitQuestion}
            >
                {
                    loading ? "Publishing . . ." : "Add Review"
                }
            </Button>
        </View>
    )
}

const styles = StyleSheet.create({})