import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AutoHeightWebView from 'react-native-autoheight-webview'
import { WIDTH } from '../constants'
import { ActivityIndicator, Button, useTheme } from 'react-native-paper'

export default function RenderContent({
    content,
    readMore = true
}: {
    content: string,
    readMore?: boolean
}) {
    const [loading, setLoading] = useState(false);
    const [full, setFull] = useState(!readMore);
    const [htmlContent, sethtmlContent] = useState("");
    
    const theme = useTheme();

    const generateHTML = () => {
        const html = `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">
                <style>
                *,
                body{
                    font-size:17px !important;
                    color : ${theme.dark ? theme.colors.onBackground : "#000"} !important; 
                }
                
                ul {
                    list-style: disc;
                    padding-left: 20px;
                }
                
                p{
                    text-indent: inherit !important;
                    margin-bottom:22px !important;
                    text-align:justify !important;
                }
                
                ol {
                    padding-left: 20px;
                }
                
                ul li {
                    list-style: disc;
                    line-height: 1.8;
                    margin-bottom: 5px;
                }

                .content_read_more:not(.open) > div {
                    max-height: 8rem;
                    mask-image: linear-gradient(#ffffff,#ffffff,rgba(255,255,255,0));
                    -webkit-mask-image: linear-gradient(#ffffff,#ffffff,rgba(255,255,255,0));
                    overflow: hidden;
                }
                </style>
                <script>document.body.style.userSelect = 'none';</script>
            </head>
            <body>
                ${readMore ? !full ? '<div class="content_read_more">' : '' : ''}
                <div class="blog-details">${content}</div>
                ${readMore ? !full ? '</div>' : '' : ''}
            </body>
        </html>`;

        sethtmlContent(html);
    }

    useEffect(() => {
        generateHTML();
    }, [content, full])

    return (
        <View style={{
            position : "relative"
        }}>
            {loading ? <ActivityIndicator animating size={10} style={{
                marginVertical: 10
            }} /> : null}

            <View pointerEvents="none">
                <AutoHeightWebView
                    style={{
                        width: WIDTH - 30
                    }}
                    source={{
                        html: htmlContent
                    }}
                    onLoad={() => setLoading(false)}
                />
            </View>
            {readMore ? full ? <Button onPress={() => setFull(false)}>
                Read Less Content
            </Button> : <Button onPress={() => setFull(true)}>
                Read More Content
            </Button> : null} 
        </View>
    )
}

const styles = StyleSheet.create({})