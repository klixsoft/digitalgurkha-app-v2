import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { Button, ProgressBar, useTheme } from 'react-native-paper'
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { RatingDetailsType } from '../../constants/types'
import { WIDTH } from '../../constants'
import Rating from '../Rating'

type RatingOverViewProps = {
    data: RatingDetailsType
}

type EachRowProps = {
    label: string,
    percentage: number,
    iconColor: string
}

const EachRow = ({
    label,
    percentage,
    iconColor
}: EachRowProps) => {
    return (
        <View style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10
        }}>
            <Text>{label}</Text>
            <MaterialIcons color={iconColor} name={percentage > 0 ? "star" : "star-outline"} />

            <View style={{
                width: WIDTH / 2.3
            }}>
                <ProgressBar
                    indeterminate={false}
                    animatedValue={percentage > 0 ? percentage / 100 : 0}
                    visible
                    color="#fff"
                />
            </View>
        </View>
    )
}

export default function RatingOverView({ data }: RatingOverViewProps) {
    const theme = useTheme();

    return (
        <View style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap"
        }}>
            <View>
                {
                    data.rating.map((item, index) => (
                        <EachRow
                            key={item.label}
                            label={item.label}
                            percentage={item.per}
                            iconColor={theme.colors.primary}
                        />
                    ))
                }
            </View>

            <View style={{
                flexDirection: "column",
                alignItems: "flex-end",
                justifyContent: "flex-end",
                gap: 3
            }}>
                <Text style={styles.reviewLarge}>{data.average}</Text>
                <Rating
                    onlyStar
                    value={data.average}
                    small
                />
                <Text>{data.total} Reviews</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    reviewLarge: {
        fontSize: 30,
        fontWeight: "bold",
        textAlign: "right"
    }
})