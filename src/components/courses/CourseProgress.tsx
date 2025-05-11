import { StyleProp, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ProgressType } from '../../constants/types'
import { ProgressBar, useTheme } from 'react-native-paper'

export default function CourseProgress({progress, style={}} : {
    progress : ProgressType,
    style?: StyleProp<any>
}) {
    const theme = useTheme();

    return (
        <View style={[styles.container, style]}>
            <View style={styles.header}>
                <Text style={{
                    color : theme.dark ? theme.colors.onBackground : "#000"
                }}>{progress.completed_count} / {progress.total_count}</Text>
                <Text style={{
                    color : theme.dark ? theme.colors.onBackground : "#000"
                }}>{progress.completed_percent}%</Text>
            </View>

            <ProgressBar 
                color={theme.dark ? theme.colors.onBackground : theme.colors.primary}
                progress={progress.completed_percent / 100}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container : {
        marginTop:15,
        marginBottom:10
    },
    header : {
        flexDirection : "row",
        alignItems : "center",
        justifyContent : "space-between",
        marginBottom:8
    }
})