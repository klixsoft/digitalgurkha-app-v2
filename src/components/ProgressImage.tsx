import { ImageProps, StyleProp, StyleSheet } from 'react-native'
import React, { ComponentProps } from 'react'
import { createImageProgress } from 'react-native-image-progress'
import FastImage from 'react-native-fast-image'

const Image:any = createImageProgress(FastImage);

export default function ProgressImage(props: ImageProps | {
    imageStyle : StyleProp<any>
}) {
    return (
        <Image {...props} />
    )
}

const styles = StyleSheet.create({})