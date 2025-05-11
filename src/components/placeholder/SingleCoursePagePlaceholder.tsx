import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'
import { WIDTH } from '../../constants'
import { useTheme } from 'react-native-paper'

export default function SingleCoursePagePlaceholder() {
    const theme = useTheme();
    
    return (
        <SkeletonPlaceholder 
            borderRadius={4}
            backgroundColor={theme.dark ? "rgba(48, 55, 63, 1)" : "#E1E9EE"}
            highlightColor={theme.dark ? "rgba(64, 66, 68, 1)" : "#F2F8FC"}
        >
            <SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item marginBottom={20} width={WIDTH} height={250} />

                <SkeletonPlaceholder.Item margin={20}>
                    <SkeletonPlaceholder.Item marginBottom={15} width={WIDTH-40} height={50} borderRadius={5} />
                    <SkeletonPlaceholder.Item marginBottom={15} width={WIDTH-40} height={20} borderRadius={5} />
                    <SkeletonPlaceholder.Item marginBottom={15} width={WIDTH-40} height={20} borderRadius={5} />

                    <SkeletonPlaceholder.Item marginBottom={15} width={WIDTH-40} height={40} borderRadius={50} />
                    <SkeletonPlaceholder.Item marginBottom={15} width={WIDTH-40} height={40} borderRadius={50} />

                    <SkeletonPlaceholder.Item marginBottom={15} width={WIDTH-40} height={20} borderRadius={5} />
                    <SkeletonPlaceholder.Item marginBottom={15} width={WIDTH-40} height={60} borderRadius={5} />
                    <SkeletonPlaceholder.Item marginBottom={15} width={WIDTH-40} height={60} borderRadius={5} />
                    <SkeletonPlaceholder.Item marginBottom={15} width={WIDTH-40} height={60} borderRadius={5} />
                    <SkeletonPlaceholder.Item marginBottom={15} width={WIDTH-40} height={60} borderRadius={5} />

                    <SkeletonPlaceholder.Item marginBottom={15} width={WIDTH-40} height={20} borderRadius={5} />
                    <SkeletonPlaceholder.Item marginBottom={15} width={WIDTH-40} height={100} borderRadius={5} />
                </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
    )
}

const styles = StyleSheet.create({})