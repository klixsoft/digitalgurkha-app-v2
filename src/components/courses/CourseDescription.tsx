import { Alert, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import RenderContent from '../RenderContent'
import { useTheme } from 'react-native-paper'

export default function CourseDescription({
    content
} : {
    content : string
}) {
    const theme = useTheme();
    
    return (
        <View style={{
            marginBottom: 30
        }}>
            <Text style={{
                marginBottom: 15,
                fontWeight: "bold",
                color: theme.dark ? theme.colors.onBackground : "#000",
                fontSize: 18,
                textAlign: "center"
            }}>Course Description</Text>
            
            <RenderContent
                content={content}
            />
        </View>
    )
}

const styles = StyleSheet.create({})