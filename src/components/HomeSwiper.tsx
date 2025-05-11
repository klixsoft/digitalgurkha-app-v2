import { StyleSheet } from 'react-native'
import React from 'react'
import { WIDTH } from '../constants'
import { SliderType } from '../constants/types'
import Carousel from 'react-native-reanimated-carousel'
import { useSharedValue } from 'react-native-reanimated'
import { SBItem } from './swiper/SBItem'

export default function HomeSwiper({ data }: {
    data: SliderType[]
}) {
    const progressValue = useSharedValue<number>(0);
    if (data.length > 0) {
        return (
            <Carousel
                width={WIDTH - 20}
                height={100}
                style={{
                    marginHorizontal:10,
                    borderRadius:10,
                    marginBottom:10
                }}
                loop
                pagingEnabled={true}
                snapEnabled={true}
                autoPlay={true}
                autoPlayInterval={3000}
                onProgressChange={(_, absoluteProgress) =>
                    (progressValue.value = absoluteProgress)
                }
                data={data}
                renderItem={({ index }) => <SBItem item={data[index]} index={index} />}
            />
        )
    }

    return null;
}

const styles = StyleSheet.create({
    wrapper: {
        width: WIDTH - 20,
        height: 200
    }
})