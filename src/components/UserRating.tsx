import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome';

export default function UserRating({ rating = 5, onChange=()=>{} } : {
    rating?: number,
    onChange : (value : number) => void
}) {
    const [selectedRating, setSelectedRating] = useState(rating);

    const maxRating = 5;
    const filledStars = Math.floor(selectedRating);
    const emptyStars = maxRating - filledStars;

    const handleRatingPress = (newRating: number) => {
        setSelectedRating(newRating);
        onChange(newRating);
    };

    return (
        <View style={{ flexDirection: 'row' }}>
            <View style={{ flexDirection: 'row', gap : 10 }}>
                {[...Array(filledStars)].map((_, index) => (
                    <TouchableOpacity key={index} onPress={() => handleRatingPress(index + 1)}>
                        <Icon name="star" size={30} color="gold" />
                    </TouchableOpacity>
                ))}
                {[...Array(emptyStars)].map((_, index) => (
                    <TouchableOpacity
                        key={filledStars + index}
                        onPress={() => handleRatingPress(filledStars + index + 1)}
                    >
                        <Icon name="star-o" size={30} color="gold" />
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({})