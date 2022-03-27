import React, {useState} from 'react';
import {Image, StyleSheet, TextInput, View, SafeAreaView} from "react-native";




const ImagePreview = ({img}) => {

    const [inpValue, setInpValue] = useState('');

    return (
        <View style={ styles.container}>
            <View style={{ flex: 3}}>
                <Image source={{ uri: img }} style={{ minWidth: '100%', minHeight: '75%' }} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'white'
    },
    inp: {
        width: '75%',
        borderStyle: 'solid',
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 16,
        paddingHorizontal: 5,
        paddingVertical: 5,
        marginVertical: 5
    }
})

export default ImagePreview;