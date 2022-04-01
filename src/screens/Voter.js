import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import image from '../../assets/img.jpeg';
import Carousel from 'react-native-snap-carousel';
import {AntDesign, FontAwesome, Feather, FontAwesome5, Entypo} from "@expo/vector-icons";
import {Swiper} from 'react-native-deck-swiper-renewed';

const Voter = () => {

    const [images, setImages] = useState([]);
    const width = Dimensions.get('window').width;

    useEffect(async () => {

        // let auth = await AsyncStorage.getItem('userKey')
        // if (auth != null) {
        //     setUserKey(auth);
        // }

        const url = 'https://daily-foto-shot.herokuapp.com/pictures/';
        // const data = { userKey: userKey };

        try {
            const response = await fetch(url, {
                method: 'GET', // или 'PUT'
                // body: JSON.stringify(data), // данные могут быть 'строкой' или {объектом}!
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const json = await response.json();
            console.log('Success:', JSON.stringify(json));
            let jsonObj = JSON.parse(JSON.stringify(json))
            setImages(jsonObj.results)
            console.log('images ' + images)
        } catch (error) {
            console.error('Error:', error);
        }

    }, [])

    const renderItem = ({ item, index }) => (
        <View style={{flex: 1, backgroundColor: '#fff'}}>
            <Image style={styles.cardImage} source={{uri: item.thumbnail_big_url}}/>
        </View>
    );



    return (
        <View style={{flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center'}}>
            <Swiper 
                cards={images}
                renderCard={renderItem}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    cardImage: {
        width: '100%',
        height: 500,
        borderRadius: 16
    }
  })

export default Voter;