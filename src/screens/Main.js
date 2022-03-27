import React, {useEffect, useState} from 'react';
import { View, StyleSheet, Text, Image, ScrollView, Pressable, TouchableOpacity, Button, FlatList } from 'react-native';
import Home from "./Home";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {AntDesign, FontAwesome, Feather, FontAwesome5, Entypo} from "@expo/vector-icons";

const Main = () => {

    const [userKey, setUserKey] = useState('');
    const [images, setImages] = useState([]);
    const [liked, setLiked] = useState(false);


    useEffect(async () => {

        let auth = await AsyncStorage.getItem('userKey')
        if (auth != null) {
            setUserKey(auth);
        }

        const url = 'https://536a-46-211-94-172.ngrok.io/pictures/';
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

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Image style={styles.cardImage} source={{uri: item.thumbnail_big_url}}/>
            <View style={{ flexDirection: 'row'}}>
                <TouchableOpacity
                    style={{ marginHorizontal: 12, marginVertical: 12}}
                    onPress={() => setLiked(!liked)}
                    // style={styles.closeButton}
                    // activeOpacity={0.7}
                >
                    {liked
                        ?<FontAwesome name="heart" size={26} color="red" />
                        :<FontAwesome5 name="heart" size={26} color="black" />
                    }
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ marginHorizontal: 12, marginVertical: 13}}
                    // onPress={() => cancelPreview()}
                    // style={styles.closeButton}
                    // activeOpacity={0.7}
                >
                    <FontAwesome5 name="comment-alt" size={25} color="black" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ marginHorizontal: 12, marginVertical: 11}}
                    // onPress={() => cancelPreview()}
                    // style={styles.closeButton}
                    // activeOpacity={0.7}
                >
                    <FontAwesome5 name="share-square" size={25} color="black" />
                </TouchableOpacity>
            </View>
            <View style={{ marginHorizontal: 12}}>
                <Text style={{ fontSize: 18, fontWeight: 'bold'}}>{item.rate} likes</Text>
            </View>
            <Text style={styles.cardText}>
                <Text style={{ fontWeight: 'bold'}}>{item.username}</Text> {item.description}
            </Text>
        </View>
    );


    return (
        <View style={{ flex: 1, backgroundColor: '#fff'}}>
            <FlatList
                data={images}
                renderItem={renderItem}
                keyExtractor={item => String(item.picture_id)}
            />
        </View>
    )
            {/*<Pressable onPress={() => console.log('pressed')}>*/}
            {/*    <View style={styles.container}>*/}
            {/*        <View style={{ flex: 1}}>*/}
            {/*            <Image*/}
            {/*                style={styles.lakeImg}*/}
            {/*                source={require('../../assets/img.jpeg')}*/}
            {/*            />*/}
            {/*        </View>*/}
            {/*        <View style={{ flex: 2, flexDirection: 'column'}}>*/}
            {/*            <View style={{flex: 2}}>*/}
            {/*                <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 16}}>Озеро Картар</Text>*/}
            {/*                <Text style={{ textAlign: 'center', maxHeight:100}} numberOfLines={5}>Спортивна рибалка під Києвом на Озері КарТар – це простір, створений з любов'ю до довкілля та шанувальників відпочинку на природі.</Text>*/}
            {/*            </View>*/}
            {/*            <View style={{ flex: 1}}>*/}
            {/*                <TouchableOpacity*/}
            {/*                    onPress={() => console.log('topacity')}*/}
            {/*                    style={styles.button}*/}
            {/*                >*/}
            {/*                    <Text style={{ fontWeight: 'bold'}}>Детальніше</Text>*/}
            {/*                </TouchableOpacity>*/}
            {/*            </View>*/}
            {/*        </View>*/}
            {/*    </View>*/}
            {/*</Pressable>*/}


};

const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 20,
      paddingVertical: 20,
      backgroundColor: '#fff',
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderBottomColor: 'grey',
      borderBottomWidth: 1,
    },
    lakeImg: {
        height: 150,
        width: 100
    },
    button: {
        backgroundColor: 'lightgreen',
        borderStyle: 'solid',
        borderColor: 'grey',
        borderRadius: 16,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '80%',
        marginTop: 5
    },
    card: {
        backgroundColor: '#fff',
        marginBottom: 10,
        width: '100%',
        // shadowColor: '#000',
        // shadowOpacity: 0.2,
        // shadowRadius: 1,
        // shadowOffset: {
        //     width:3,
        //     height:3
        // }
    },
    cardImage: {
        width: '100%',
        height: 500,
    },
    cardText: {
        padding: 10,
        fontSize: 16,
        marginHorizontal: 3
    }
  });


export default Main;