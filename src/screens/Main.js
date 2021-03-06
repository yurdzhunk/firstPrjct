import React, {useEffect, useRef, useState} from 'react';
import { View, StyleSheet, Text, Image, ScrollView, Pressable, TouchableOpacity, Button, FlatList } from 'react-native';
import Home from "./Home";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {AntDesign, FontAwesome, Feather, FontAwesome5, Entypo} from "@expo/vector-icons";
import { useScrollToTop } from '@react-navigation/native';

const Main = () => {

    const [userKey, setUserKey] = useState('');
    const [images, setImages] = useState([]);
    // const [liked, setLiked] = useState(false);
    const [listOfLikes, setListOfLikes] = useState({});
    const [liked, setLiked] = useState({});
    const [isFetching, setIsFetching] = useState(false);
    
    const refFlatList = useRef(null);
    useScrollToTop(refFlatList);


    useEffect(async () => {

        let auth = await AsyncStorage.getItem('userKey')
        if (auth != null) {
            setUserKey(auth);
        }

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

    useEffect( () => {
        console.log('images length' + images.length)
        if (images != null){
            let a = {};
            let b = {};
            images.map((item, index) => {
                a[item.picture_id] = item.rate
                b[item.picture_id] = item.is_liked
            })
            console.log('a    ' + a)
            console.log('b    ' + b)
            setListOfLikes(a);
            setLiked(b);
            console.log('listOfLikes ' + listOfLikes);
        }
    }, [images])


    const likeImage =  (id) => {
        console.log('WORKS')
        console.log(id)
        let a = listOfLikes;
        let b = liked;
        if (b[id]) {
            a[id] = a[id] - 1;
            b[id]=false;
            const response = fetch(
                'https://daily-foto-shot.herokuapp.com/pictures/' + id + '/like/',
                {
                    method: 'POST',
                    headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Token ' + userKey,
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({'is_like': false})
                    
                }
            );
            console.log(response);
        } else {
            a[id] = a[id] + 1;
            b[id] = true;
            const response =  fetch(
                'https://daily-foto-shot.herokuapp.com/pictures/' + id + '/like/',
                {
                    method: 'POST',
                    headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Token ' + userKey,
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({'is_like': true})
                }
            );
            console.log('response')
            console.log(response);
        }
        setListOfLikes({...a});
        setLiked({...b});
    }


    const refresh = async () => {
        setIsFetching(true);

        const url = 'https://daily-foto-shot.herokuapp.com/pictures';
        // const data = { userKey: userKey };

        try {
            const response = await fetch(url, {
                method: 'GET', 

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
        
        setIsFetching(false);
    }






    const renderItem = ({ item, index }) => (
        <View style={styles.card}>
            <View style={{ flexDirection: 'row', marginHorizontal: 5, marginVertical: 5}}>
                <Image style={styles.avatar} source={{uri: item.owner.profile_picture_thumbnail_small}}/>
                <Text style={{ fontWeight: 'bold', marginTop: 11, marginLeft: 5}}>{item.username}</Text>
            </View>
            <Image style={styles.cardImage} source={{uri: item.thumbnail_big_url}}/>
            <View style={{ flexDirection: 'row'}}>
                <TouchableOpacity
                    onPress={() => likeImage(item.picture_id)}
                    style={{ marginHorizontal: 12, marginVertical: 12}}
                >
                    {liked[item.picture_id]
                        ?<FontAwesome name="heart" size={26} color="red" />
                        :<FontAwesome5 name="heart" size={26} color="black" />
                    }
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ marginHorizontal: 12, marginVertical: 13}}
                >
                    <FontAwesome5 name="comment-alt" size={25} color="black" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ marginHorizontal: 12, marginVertical: 11}}
                >
                    <FontAwesome5 name="share-square" size={25} color="black" />
                </TouchableOpacity>
            </View>
            <View style={{ marginHorizontal: 12}}>
                <Text style={{ fontSize: 18, fontWeight: 'bold'}}>{listOfLikes[item.picture_id]} likes</Text>
            </View>
            <Text style={styles.cardText}>
                <Text style={{ fontWeight: 'bold'}}>{item.username}</Text> {item.description} {item.picture_id}
            </Text>
        </View>
    );


    return (
        <View style={{ flex: 1, backgroundColor: '#fff'}}>
            <FlatList
                data={images}
                renderItem={renderItem}
                keyExtractor={item => String(item.picture_id)}
                onRefresh={() => refresh()}
                refreshing={isFetching}
                ref={refFlatList}
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
    },
    avatar: {
        height: 35,
        width: 35,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 3,
        marginLeft: 3
    }
  });


export default Main;