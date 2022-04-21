import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import * as Font from 'expo-font'
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Navbar = () => {

    // const [loaded] = useFonts({
    //     OpenSans: require('../../assets/fonts/OpenSans-ExtraBoldItalic.ttf'),
    //   });


    const navigation = useNavigation();

    useEffect(async () => {
        await Font.loadAsync({
            OpenSans: require('../../assets/fonts/OpenSans-ExtraBoldItalic.ttf')
    })}, []);

    return (
        <View style={styles.navbar}>
            <Text style={styles.text}>fodo</Text>
            <TouchableOpacity style={{position: 'absolute', right: 10}} onPress={() => {navigation.navigate('ChatsScreen')}}>
                <Entypo name="chat" size={30} color="grey" />
            </TouchableOpacity>
            {/* <TouchableOpacity style={{position: 'absolute', right: 100}} onPress={() => {navigation.navigate('Chatting')}}>
                <Entypo name="chat" size={30} color="grey" />
            </TouchableOpacity> */}
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