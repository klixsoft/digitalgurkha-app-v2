import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'
import { WIDTH } from '../../constants'
import { useTheme } from 'react-native-paper';

export default function CoursesPlaceholder() {
    const CARDWIDTH = WIDTH / 2 - 20;
    const CARDHEIGHT = 185 / 330 * CARDWIDTH;
    const theme = useTheme();

    return (
        <SkeletonPlaceholder 
            borderRadius={4}
            backgroundColor={theme.dark ? "rgba(48, 55, 63, 1)" : "#E1E9EE"}
            highlightColor={theme.dark ? "rgba(64, 66, 68, 1)" : "#F2F8FC"}
        >
            <SkeletonPlaceholder.Item marginBottom={20}>
                <SkeletonPlaceholder.Item flexDirection="row" alignItems="center" flexWrap="nowrap">
                    <SkeletonPlaceholder.Item flexDirection="column" marginRight={20} alignItems="center">
                        <SkeletonPlaceholder.Item width={CARDWIDTH} height={CARDHEIGHT} borderRadius={4} />
                        <SkeletonPlaceholder.Item marginTop={10}>
                            <SkeletonPlaceholder.Item marginTop={6} width={CARDWIDTH} height={10} />
                            <SkeletonPlaceholder.Item marginTop={6} width={CARDWIDTH} height={10} />
                            <SkeletonPlaceholder.Item marginTop={6} width={CARDWIDTH} height={10} />
                            <SkeletonPlaceholder.Item marginTop={15} width={CARDWIDTH} height={30} borderRadius={30} />
                        </SkeletonPlaceholder.Item>
                    </SkeletonPlaceholder.Item>

                    <SkeletonPlaceholder.Item flexDirection="column" marginRight={20} alignItems="center">
                        <SkeletonPlaceholder.Item width={CARDWIDTH} height={CARDHEIGHT} borderRadius={4} />
                        <SkeletonPlaceholder.Item marginTop={10}>
                            <SkeletonPlaceholder.Item marginTop={6} width={CARDWIDTH} height={10} />
                            <SkeletonPlaceholder.Item marginTop={6} width={CARDWIDTH} height={10} />
                            <SkeletonPlaceholder.Item marginTop={6} width={CARDWIDTH} height={10} />
                            <SkeletonPlaceholder.Item marginTop={15} width={CARDWIDTH} height={30} borderRadius={30} />
                        </SkeletonPlaceholder.Item>
                    </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
    )
}

const styles = StyleSheet.create({})