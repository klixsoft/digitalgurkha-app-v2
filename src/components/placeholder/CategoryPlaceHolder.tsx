import { View } from 'react-native'
import React from 'react'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { WIDTH } from '../../constants';
import { useTheme } from 'react-native-paper';

type CategoryPlaceHolderType = {
    item?: number
}

export default function CategoryPlaceHolder(props: CategoryPlaceHolderType) {
    const theme = useTheme();
    
    return (
        <View style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap"
        }}>
            {
                Array.apply(null, Array(props.item)).map((item, index) => {
                    return (
                        <View style={{
                            marginBottom:15,
                            paddingHorizontal:10
                        }} key={index}>
                            <SkeletonPlaceholder
                                borderRadius={10} 
                                key={index}
                                backgroundColor={theme.dark ? "rgba(48, 55, 63, 1)" : "#E1E9EE"}
                                highlightColor={theme.dark ? "rgba(64, 66, 68, 1)" : "#F2F8FC"}
                            >
                                <SkeletonPlaceholder.Item width={WIDTH - 40} height={50} />
                            </SkeletonPlaceholder>
                        </View>
                    )
                })
            }
        </View>
    )
}