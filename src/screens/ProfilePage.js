import React, {useState, useEffect} from 'react';
import { View, Text, Button, Image, StyleSheet, FlatList, Modal, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import pic from '../../assets/coffee.jpeg';
import Carousel from 'react-native-snap-carousel';
import {AntDesign, FontAwesome, Feather, FontAwesome5, Entypo} from "@expo/vector-icons";

const ProfilePage = ({navigation}) => {

    const [urlMain, setUrlMain] = useState(null);
    const [userKey, setUserKey] = useState(null);
    const [images, setImages] = useState([]);
    const [listOfLikes, setListOfLikes] = useState({});
    const [liked, setLiked] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);
    const [isCarousel, setIsCarousel] = useState(false);
    const [indexShowInCarousel, setIndexShowInCarousel] = useState(null);
    const width = Dimensions.get('window').width;
    const [profileInfo, setProfileInfo] = useState({friends: [], pictures: []});



    useEffect( async () => {
        let auth = await AsyncStorage.getItem('userKey')
        if (auth != null) {
            setUserKey(auth);
            console.log('USERKEYUSERKEYUSERKEYUSERKEYUSERKEYUSERKEY   ' + auth)
        }
        let url = await AsyncStorage.getItem('urlMain')
        if (url != null) {
            setUrlMain(url);
            console.log('USERKEYUSERKEYUSERKEYUSERKEYUSERKEYUSERKEY   ' + url)
        }
    }, []);

    useEffect(async () => {

        // let auth = await AsyncStorage.getItem('userKey')
        // if (auth != null) {
        //     setUserKey(auth);
        //     console.log('USERKEYUSERKEYUSERKEYUSERKEYUSERKEYUSERKEY   ' + userKey)
        // }
        // const url = await AsyncStorage.getItem('urlMain')
        // const data = { userKey: userKey };

        try {
            if(urlMain!=null && userKey!=null){
                const response = await fetch(urlMain + '/api/accounts/users/my_profile/', {
                    method: 'GET', // или 'PUT'
                    // body: JSON.stringify(data), // данные могут быть 'строкой' или {объектом}!
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'Token ' + userKey,
                        'Content-Type': 'application/json'
                    }
                });
                const json = await response.json();
                console.log('Success:', JSON.stringify(json));
                let jsonObj = JSON.parse(JSON.stringify(json));
                setProfileInfo(jsonObj);
                setImages(jsonObj.pictures);
                console.log('IMAGESIMAGESIMAGESIMAGESIMAGESIMAGESIMAGES ' + images);
                console.log(jsonObj);
                /////////////////
                console.log('images length' + images.length);
                setIsLoaded(!isLoaded);
            }
            ///////////////////////
        } catch (error) {
            console.error('Error:', error);
        }

    }, [urlMain, userKey])

    useEffect(() => {
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
            console.log(images)
        }
    }, [isLoaded]);

    const logOut = async () => {
        await AsyncStorage.removeItem('userKey');
        navigation.navigate('StartPage')
    }

    useEffect(() => {
        if(images !== null){
            console.log('FORMATDATA')
            let numberOfFullRows = Math.round(images.length/3);
            let elementOfLastRow = images.length - (numberOfFullRows*3);
            let a = [...images];
            while(elementOfLastRow !== 3 && elementOfLastRow !== 0){
                a.push({'thumbnail_small_url': 'empty', 'empty': true});
                elementOfLastRow += 1;
            }
            setImages(a);
            }
    }, [isLoaded]);

    // const formatData = (data, numColumns) => {
    //     let numberOfFullRows = Math.round(images.length/3);
    //     let elementOfLastRow = images.length - (numberOfFullRows*3);
    //     let a = [...images];
    //     while(elementOfLastRow !== numColumns && elementOfLastRow !== 0){
    //         a.push({'thumbnail_small_url': 'empty', 'empty': true});
    //         elementOfLastRow += 1;
    //     }
    //     setImages(a);
    // }


    const showInCarousel = (index) => {
        setIndexShowInCarousel(index);
        setIsCarousel(true);
    }

    const likeImage =  (id) => {
        console.log('WORKS')
        console.log(id)
        let a = listOfLikes;
        let b = liked;
        if (b[id]) {
            a[id] = a[id] - 1;
            b[id]=false;
            const response = fetch(
                urlMain + '/pictures/' + id + '/like/',
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
                urlMain + '/pictures/' + id + '/like/',
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

    if(!isCarousel){
        return (
            <View style={{flex: 1, backgroundColor: '#fff'}}>
                <View style={styles.profileBlock}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 10}}>
                        <View style={{flex: 1}}>
                            <Image style={styles.avatar} source={{uri: profileInfo.profile_picture_thumbnail_small}}/>
                        </View>
                        <View style={{flex: 2, flexDirection: 'column'}}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1, alignItems: 'center', paddingHorizontal: 30}}>
                                <Text style={{fontWeight: 'bold'}}>{profileInfo.pictures.length} photos</Text>
                                <Text style={{fontWeight: 'bold'}}>{profileInfo.friends.length} friends</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1, alignItems: 'center', paddingHorizontal: 30}}>
                                <Text><Entypo name="medal" size={24} color="gold" /> 30</Text>
                                <Text><Entypo name="medal" size={24} color="silver" /> 30</Text>
                                <Text><Entypo name="medal" size={24} color="brown" /> 30</Text>
                            </View>
                        </View>
                    </View>
                    <View>
                        <Text style={{fontWeight: 'bold', marginLeft: 10}}>{profileInfo.first_name} {profileInfo.last_name}</Text>
                        <Text style={{marginLeft: 10}}>CEO and Founder</Text>
                    </View>
                </View>
                <View style={styles.profileBlock}>
                    <FlatList
                        data={images}
                        renderItem={({ item, index }) => (
                            <>
                                <TouchableOpacity 
                                    style={{
                                        flex: 1,
                                        flexDirection: 'column',
                                        margin: 1
                                    }}
                                    onPress={() => showInCarousel(index)}
                                >
                                        <Image
                                            source={{ uri: item.thumbnail_small_url }}
                                            style={{height: 130, justifyContent: 'center', alignItems: 'center'}}
                                        />
                                </TouchableOpacity>
                            </>
                        )}
                        //Setting the number of column
                        numColumns={3}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
                <View style={{alignItems: 'center'}}>
                    <TouchableOpacity style={{borderColor: 'black', borderRadius: 16, borderWidth: 1, alignItems: 'center', width: 150, backgroundColor: 'black', marginTop: 3}} onPress={() => logOut()}>
                        <Text style={{fontSize: 32, fontWeight: 'bold', color: '#fff'}}>Log out</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    } else{
        return(
            <View style={{display: 'flex', ...StyleSheet.absoluteFillObject, backgroundColor: '#fff'}}>
                <Carousel
                    firstItem={indexShowInCarousel}
                    data={profileInfo.pictures}
                    renderItem={({item, index}) => (
                        <View style={{flex:1, backgroundColor: '#fff', borderBottomColor: 'grey', borderBottomWidth: 1}}>
                            <Image
                            source={{ uri: item.thumbnail_big_url }}
                            style={{height: 500, justifyContent: 'center', alignItems: 'center'}}
                            />
                            <View style={{flexDirection: 'row'}}>
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
                            <Text style={{ marginTop: 5, marginLeft: 5, fontSize:18}}>{item.description}</Text>
                        </View>
                    )}
                    sliderWidth={width}
                    itemWidth={width}
                    sliderHeight={500}
                    itemHeight={300}
                    layout={'stack'}
                    // layoutCardOffset={`4`}
                />
                <Button title='Back' onPress={() => setIsCarousel(false)}/>
            </View>
        )
    }
};

const styles = StyleSheet.create({
    profileBlock: {
        paddingBottom: 10,
        borderBottomColor: 'grey',
        borderBottomWidth: 1
    },
    avatar: {
        height: 100,
        width: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 3,
        marginLeft: 3
    }
});

export default ProfilePage;