import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Button, Checkbox, TextInput } from 'react-native-paper';
import { ExceptionHandler, ToastMessage } from '../../constants/Functions';
import { CONFIG } from '../../constants';
import axiosInstance from '../../constants/axiosInstance';

export default function AskQuestion({
    onSuccess = () => {}
} : {
    onSuccess : () => void
}) {
    const [message, setMessage] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [checked, setChecked] = useState(false);

    const submitQuestion = async () => {
        if (!checked) {
            ToastMessage("error", "You must accept terms and conditions.");
            return;
        }

        if (message.length <= 0) {
            ToastMessage("error", "Please provide the question.");
            return;
        }

        setLoading(true);
        await axiosInstance.post(CONFIG.API.QA_PUBLISH_QUESTION, {
            question: message
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
            <TextInput
                label="Question"
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
                    loading ? "Publishing . . ." : "Ask Question"
                }
            </Button>
        </View>
    )
}

const styles = StyleSheet.create({})