import React, { useEffect } from 'react';
import { View, Text, StyleSheet} from 'react-native';
import * as Font from 'expo-font'

const Navbar = () => {

    // const [loaded] = useFonts({
    //     OpenSans: require('../../assets/fonts/OpenSans-ExtraBoldItalic.ttf'),
    //   });


    useEffect(async () => {
        await Font.loadAsync({
            OpenSans: require('../../assets/fonts/OpenSans-ExtraBoldItalic.ttf')
    })}, []);

    return (
        <View style={styles.navbar}>
            <Text style={styles.text}>fodo</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    navbar: {
        height: 70,
        alignItems: 'center',
        justifyContent: 'flex-end',
        backgroundColor: '#fff'
    },
    text: {
        color: 'darkred',
        fontSize: 26,
        fontWeight: 'bold'
    }
})


export default Navbar;