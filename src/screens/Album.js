import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Animated } from 'react-native';
import PagerView from 'react-native-pager-view';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import breakfast from '../../assets/breakfast.jpeg';
import dinner from '../../assets/dinner.jpeg';
import supper from '../../assets/supper.jpeg';
import coffee from '../../assets/coffee.jpeg';
import sky from '../../assets/sky.jpeg';

const Album = ({navigation}) => {


    // const categories = [{'name': 'Breakfast' , 'image': breakfast},
    //                     {'name': 'Dinner' , 'image': dinner},
    //                     {'name': 'Supper' , 'image': supper},
    //                     {'name': 'Coffee' , 'image': coffee},
    //                     {'name': 'Sky' , 'image': sky}]

    const [categories, setCategories] = useState([]);
    const [categoriesWorld, setCategoriesWorld] = useState([]);
    const [categoriesFriends, setCategoriesFriends] = useState([]);
    const [userKey, setUserKey] = useState('');
    const [urlMain, setUrlMain] = useState(null);


    useEffect( async () => {
        const auth = await AsyncStorage.getItem('userKey')
        if (auth != null) {
            setUserKey(auth);
            console.log('USERKEYUSERKEYUSERKEYUSERKEYUSERKEYUSERKEY   ' + userKey)
        }
        let url = await AsyncStorage.getItem('urlMain')
        if (url != null) {
            setUrlMain(url);
            console.log('USERKEYUSERKEYUSERKEYUSERKEYUSERKEYUSERKEY   ' + url)
        }
    }, []);


    useEffect(async () => {
        
        if(urlMain!=null){
            try {
                const response = await fetch(urlMain + '/categories/', {
                    method: 'GET', // или 'PUT'
                    // body: JSON.stringify(data), // данные могут быть 'строкой' или {объектом}!
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'Token ' + userKey,
                        'Content-Type': 'application/json'
                    }
                }).then((response) => response.json())
                .then((json) => JSON.parse(JSON.stringify(json)))
                .then((obj) => setCategories(obj.results));
                // const json = await response.json();
                // console.log('SuccessCATEGORYSuccessCATEGORYSuccessCATEGORYSuccessCATEGORYSuccessCATEGORY:', JSON.stringify(json));
                // let jsonObj = JSON.parse(JSON.stringify(json))
                // setCategories(jsonObj.results)
            } catch (error) {
                console.error('Error:', error);
            }
        }
    }, [userKey, urlMain])

    useEffect(() => {
        console.log('IMAGESIMAGESIMAGESIMAGESIMAGESIMAGES ' + categories)
        if(categories!=null){
            let a = categories.filter(obj => {
                return obj.is_world === true
                })
            let b = categories.filter(obj => {
                return obj.is_friends === true
            })
            setCategoriesWorld(a);
            setCategoriesFriends(b);
        }
    }, [categories]);





    //Animation//////////////////////
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const fadeIn = Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true
    });

    const fadeOut = Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true
    });
        


    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                fadeIn,
                fadeOut
            ])
            ).start()
    }, [])
    //////////////////////////


    const selectedCategory = (category_id) => {
        navigation.navigate('Category', {'category': category_id})
    }

    return (
        <PagerView style={{ flex: 1 }} initialPage={0}>
            <View key='1' style={styles.container}>
                <View style={{ height: 50, flexDirection: 'row'}}>
                        <Text style={{ fontSize: 32, fontWeight: 'bold' , color: '#000', marginLeft: '35%'}}>WORLD</Text>
                        <Animated.View
                            style={[
                            styles.fadingContainer,
                            {
                                // Bind opacity to animated value
                                opacity: fadeAnim,
                                marginBottom: 10,
                                marginLeft: 30,
                                alignItems: 'center',
                                flexDirection: 'row'
                            },
                            ]}
                        >
                            <AntDesign name='right' size={32} color='#000' style={{ marginLeft: 26}} />
                        </Animated.View>
                </View>
                {
                    categoriesWorld.map((item, index) => {
                        return( 
                                <TouchableOpacity key={index} style={styles.card} onPress={() => selectedCategory(item.category_id)}>
                                    <ImageBackground source={{ uri : item.cover_image_thumbnail_small_url}} style={{flex: 1, resizeMode: 'cover', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
                                        <Text style={{ fontSize: 32, fontWeight: 'bold' , color: 'white', textShadowColor: '#000', textShadowRadius: 10}}>{item.title}</Text>
                                    </ImageBackground>
                                </TouchableOpacity>
                        )
                    })
                }
            </View>
            <View key='2' style={styles.container}>
                <View style={{ height: 50, flexDirection: 'row'}}>
                        <Animated.View
                            style={[
                            styles.fadingContainer,
                            {
                                // Bind opacity to animated value
                                opacity: fadeAnim,
                                marginBottom: 10,
                                marginLeft: 30,
                                alignItems: 'center',
                                flexDirection: 'row'
                            },
                            ]}
                        >
                            <AntDesign name='left' size={32} color='#000' style={{ marginLeft: 26}} />
                        </Animated.View>
                        <Text style={{ fontSize: 32, fontWeight: 'bold' , color: '#000', marginLeft: '10%'}}>FRIENDS</Text>
                </View>
                {
                    categoriesFriends.map((item, index) => {
                        return( 
                                <TouchableOpacity key={index} style={styles.card} onPress={() => selectedCategory(item.category_id)}>
                                    <ImageBackground source={{uri : item.cover_image_thumbnail_small_url}} style={{flex: 1, resizeMode: 'cover', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
                                        <Text style={{ fontSize: 32, fontWeight: 'bold' , color: 'white', textShadowColor: '#000', textShadowRadius: 10}}>{item.title}</Text>
                                    </ImageBackground>
                                </TouchableOpacity>
                        )
                    })
                }
            </View>
        </PagerView>
    );
};

export default Album;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff'
    },
    card: {
        flex:1,
        backgroundColor: '#fff',
        marginBottom: 3,
        width: '100%',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 1,
        shadowOffset: {
            width:3,
            height:3
        },
        justifyContent: 'center',
        alignItems: 'center'
    }
})