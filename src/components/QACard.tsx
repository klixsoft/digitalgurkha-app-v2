import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { QACardType } from '../constants/types'
import { useNavigation } from '@react-navigation/native'
import { Avatar, Card, useTheme } from 'react-native-paper'
import { WIDTH } from '../constants'

export default function QACard({item} : {
    item : QACardType
}) {
    const navigation = useNavigation();
    const theme = useTheme();

    return (
        <Card onPress={() => {
            navigation.navigate("SingleQuestion", {
                question_id: item.id
            })
        }} style={{
            marginBottom: 15,
            padding: 15,
            paddingBottom: 10,
            width: WIDTH - 20,
            backgroundColor: theme.dark ? "rgba(48, 55, 63, 1)" : "#fff"
        }}>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <Avatar.Image style={{
                        backgroundColor: theme.dark ? "transparent" : "#fff"
                    }} size={35} source={{ uri: item.author.image }} />
                    <View style={{
                        marginLeft: 10
                    }}>
                        <Text style={{
                            fontWeight: 'bold',
                            fontSize: 14,
                            color: theme.dark ? "#fff" : "#000"
                        }}>{item.author.name}</Text>
                        <Text style={{
                            color: theme.dark ? "#999" : "#555",
                            fontSize: 11
                        }}>{item.publish_ago}</Text>
                    </View>
                </View>

                {item?.count ? <Text style={[{
                    paddingHorizontal: 10,
                    borderRadius: 5,
                    paddingVertical: 4
                }, {
                    backgroundColor: "#ff0000",
                    color: "#fff"
                }]}>{item?.count} Answers</Text> : null}
            </View>

            <Text style={{
                fontSize: 17,
                color: theme.colors.onBackground,
                paddingVertical: 10,
                marginTop: 10
            }}>{item.content}</Text>
        </Card>
    )
}

const styles = StyleSheet.create({})