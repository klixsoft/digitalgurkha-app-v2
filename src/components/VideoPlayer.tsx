import { NativeSyntheticEvent, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { VIDEO_PLAYER_HEIGHT, WIDTH } from '../constants';
import AutoHeightWebView from 'react-native-autoheight-webview';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { Button, useTheme } from 'react-native-paper';
import { WebViewHttpErrorEvent } from 'react-native-webview/lib/RNCWebViewNativeComponent';
import { WebViewHttpError } from 'react-native-webview/lib/WebViewTypes';

export default function VideoPlayer({
    video
}: {
    video: any
}) {
    const webViewRef = useRef<AutoHeightWebView>(null);
    const theme = useTheme();
    const [error, setError] = useState(false);
    const [height, setHeight] = useState(VIDEO_PLAYER_HEIGHT);

    if (error) {
        return (
            <View style={{
                width: WIDTH,
                height: 200,
                backgroundColor: theme.colors.inversePrimary,
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 0
            }}>
                <Text style={{
                    color: theme.colors.primary,
                    fontWeight: "500",
                    fontSize: 16,
                    textAlign: "center",
                    marginBottom: 15,
                    maxWidth: "70%"
                }}>Something went wrong while playing video. Please reload the player.</Text>

                <Button style={{
                    borderRadius: 5
                }} mode="contained" onPress={() => {
                    setError(false);
                }}>Reload Player</Button>
            </View>
        )
    }

    const handleHttpError = (event: NativeSyntheticEvent<WebViewHttpError>) => {
        try {
            const statusCode = event.nativeEvent.statusCode;
            if( statusCode >= 500 ){
                setError(true);
            }
        } catch (error) {

        }
    };

    return (
        <View style={{
            width: WIDTH,
            height: height
        }}>
            <AutoHeightWebView
                ref={webViewRef}
                originWhitelist={['*']}
                source={{
                    uri: video
                }}
                style={{
                    width: WIDTH,
                    backgroundColor : theme.colors.background
                }}
                onSizeUpdated={size => {
                    if (size.height > 0) {
                        setHeight(size.height)
                    }
                }}
                startInLoadingState
                onError={() => setError(true)}
                onLoad={() => setError(false)}
                allowsFullscreenVideo={true}
                scrollEnabled={false}
                viewportContent={'width=device-width, user-scalable=no'}
                onHttpError={handleHttpError}
            />
        </View>
    )
}

const styles = StyleSheet.create({})