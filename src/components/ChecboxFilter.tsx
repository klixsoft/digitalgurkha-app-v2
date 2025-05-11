import { StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ChecboxFilterData } from '../constants/types'
import { Checkbox, useTheme } from 'react-native-paper'


type ChecboxFilterProps = {
    data: ChecboxFilterData[],
    onChange : (value : ChecboxFilterData[]) => void
}

export default function ChecboxFilter({
    data,
    onChange
}: ChecboxFilterProps) {
    const [newData, setNewData] = useState<ChecboxFilterData[]>([]);
    const theme = useTheme();

    const handleCheckboxPress = (index: number) => {
        const updatedCheckboxes = [...newData];
        updatedCheckboxes[index].checked = !updatedCheckboxes[index].checked;
        setNewData(updatedCheckboxes);
        onChange(updatedCheckboxes);
    };

    useEffect(() => {
        setNewData(data);
    }, [])
    
    return (
        <View>
            {
                newData.map((item, index) => (
                    <TouchableOpacity
                        key={item.value}
                        onPress={() => handleCheckboxPress(index)}
                        style={styles.checkboxcontainer}
                    >
                        <Text style={{
                            color : theme.dark ? theme.colors.onBackground : "#111"
                        }}>{item.label}</Text>
                        <Checkbox
                            status={item.checked ? "checked" : "unchecked"}
                            key={item.value}
                        />
                    </TouchableOpacity>
                ))
            }
        </View>
    )
}

const styles = StyleSheet.create({
    checkboxcontainer : {
        flexDirection:"row",
        alignItems:"center",
        justifyContent : "space-between"
    }
})