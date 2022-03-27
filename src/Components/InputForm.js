import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Pressable} from 'react-native'; 

const InputForm = ({addPost}) => {

    const [inpValue, setInpValue] = useState('');

    const pressEvent = () => {
        if (inpValue.trim()) {
            addPost(inpValue);
            setInpValue('');
        } else {
            Alert.alert('Input is empty!');
        }
    }

    return (
        <View style={styles.block}>
            <TextInput style={styles.inp} placeholder='Type smth' value={inpValue} onChangeText={setInpValue}/>
                <Button title='Push' onPress={pressEvent}/>
        </View>
    );
};


const styles = StyleSheet.create({
    block: {
        flexDirection: 'row',
        paddingVertical: 5,
        paddingHorizontal: 5,
        justifyContent: 'space-between'
    },
    inp: {
        width: '75%',
        borderStyle: 'solid',
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 16,
        paddingHorizontal: 5

    }
})

export default InputForm;