import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, Button } from 'react-native';
import image from '../../assets/img.jpeg';
import Carousel from 'react-native-snap-carousel';
import {AntDesign, FontAwesome, Feather, FontAwesome5, Entypo} from "@expo/vector-icons";
import Swiper from 'react-native-deck-swiper-renewed';

const Voter = ({navigation, route}) => {

    const {category} = route.params;
    const [images, setImages] = useState([]);
    const [thumbnails, setThumbnails] = useState([]);
    const [profilePic, setProfilePic] = useState({});
    const [username, setUsername] = useState({});
    const [description, setDescription] = useState({});
    const width = Dimensions.get('window').width;

    useEffect(async () => {

        // let auth = await AsyncStorage.getItem('userKey')
        // if (auth != null) {
        //     setUserKey(auth);
        // }

        const url = 'https://4d7c-178-95-82-235.ngrok.io/pictures/?category=' + category;
        // const data = { userKey: userKey };
        console.log(category)

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
            console.log(images)
            // let a = []
            // for (var k in images){
            //     console.log(images[k].thumbnail_big_url)
            //     a.push(images[k].thumbnail_big_url)
            // }
            // for (let i = 0; i < images.length; i++){
            //     a.push(images[i].thumbnail_big_url)
            // }
            // setImages([...a])
            // console.log('images ' + images)
        } catch (error) {
            console.error('Error:', error);
        }

    }, [category])




    useEffect(() => {
        console.log('images LENGTH' + images.length)
        let a = []
        let b = {}
        let c = {}
        let d = {}
            for (var k in images){
                console.log(images[k].thumbnail_big_url)
                a.push(images[k].thumbnail_big_url)
                b[images[k].thumbnail_big_url] = images[k].owner.profile_picture_thumbnail_big
                c[images[k].thumbnail_big_url] = images[k].username
                d[images[k].thumbnail_big_url] = images[k].description
            }
        setThumbnails([...a])
        setProfilePic(b)
        setUsername(c)
        setDescription(d);
    }, [images])

    


    const renderItem = (card) => (
        <>
            <Image style={styles.cardImage} source={{uri: card}}/>
            <View style={styles.cardBottom}>
                <View style={{ flexDirection: 'row', marginHorizontal: 5, marginVertical: 5}}>
                    <Image style={styles.avatar} source={{uri: profilePic[card]}}/>
                    <Text style={{ fontWeight: 'bold', marginTop: 11, marginLeft: 5}}>{username[card]}</Text>
                </View>
                <Text style={styles.text}>{description[card]}</Text>
            </View>
        </>
    );



    return (
        <View style={{flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center'}}>
            <Swiper
                key={category + thumbnails}
                cards={thumbnails}
                renderCard={renderItem}
                onSwiped={(cardIndex) => {console.log(cardIndex)}}
                onSwipedAll={() => {console.log('onSwipedAll')}}
                cardIndex={0}
                backgroundColor={'#fff'}
                stackSize={3}
                verticalSwipe={false}
                animateCardOpacity={true}
            >
            </Swiper>
            <Text style={{ position: 'absolute', bottom: 3, left: 3, fontSize:32}}>
                <AntDesign name='left' size={32} color='#000' style={{ marginLeft: 26}} />Nope
            </Text>
            <Text style={{ position: 'absolute', bottom: 3, right: 3, fontSize:32}}>
                Like<AntDesign name='right' size={32} color='#000' style={{ marginLeft: 26}} />
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    cardImage: {
        width: '100%',
        height: 500,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    container: {
        flex: 1,
        backgroundColor: "#F5FCFF"
      },
      card: {
        height: 500,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        borderWidth: 2,
        borderColor: "#E8E8E8",
        justifyContent: "center",
        backgroundColor: 'transparent'
      },
      text: {
        backgroundColor: "transparent",
        marginLeft: 5,
        marginBottom: 5
      },
      avatar: {
        height: 35,
        width: 35,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 3,
        marginLeft: 3
    },
    cardBottom: {
        backgroundColor: '#fff',
        // shadowRadius: 1,
        borderLeftWidth: 1,
        // borderRightWidth: 1,
        // borderBottomColor: '#000',
        borderLeftColor: 'grey',
        // borderRightColor: '#000',
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 1,
        shadowOffset: {
            width:3,
            height:3
        }
    }
  })

export default Voter;