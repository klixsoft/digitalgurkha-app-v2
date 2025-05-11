import { StyleProp, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { useTheme } from 'react-native-paper'

type RatingType = {
    value: number;
    total?:number;
    small?:boolean;
    style?:StyleProp<any>,
    onlyStar?:boolean
}

export default function Rating({
    value = 5,
    total=0,
    small=false,
    style={},
    onlyStar=false
}: RatingType) {
    const theme = useTheme();

    const renderStars = () => {
        const stars = [];
        const maxStars = 5;

        for (let i = 1; i <= maxStars; i++) {
            let iconName = 'star-outline';

            if (i <= value) {
                iconName = 'star';
            } else if (i === Math.ceil(value) && value % 1 !== 0) {
                iconName = 'star-half';
            }

            stars.push(
                <MaterialIcons
                    key={i}
                    name={iconName}
                    size={small ? 14 : 22}
                    color="gold"
                />
            );
        }

        return stars;
    };

    if( onlyStar ){
        return(
            <View style={styles.starcontainer}>
                {renderStars()}
            </View>
        )
    }

    return (
        <View style={[styles.starcontainer, {
            gap : small ? 3 : 5
        }, style]}>
            <Text style={{
                fontWeight:"bold",
                color : theme.colors.onBackground,
                fontSize : small ? 11 : 16
            }}>{value}</Text>

            <View style={styles.starcontainer}>
                {renderStars()}
            </View>

            {total > 0 ? <Text style={{
                fontWeight:"500",
                color : "#757c8e",
                fontSize : small ? 11 : 16
            }}>({total})</Text> : null}
        </View>
    )
}

const styles = StyleSheet.create({
    starcontainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 0
    }
})