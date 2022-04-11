import React, {useEffect, useState} from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';


const ChatsScreen = () => {

    const [userKey, setUserKey] = useState('');
    const [urlMain, setUrlMain] = useState(null);
    const [usersList, setUsersList] = useState([]);

    const [mainUserID, setMainUserID] = useState('');
    const [mainUsername, setMainUsername] = useState('');
    const [mainUserFirstName, setMainUserFirstName] = useState('');

    const navigation = useNavigation();

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

        // const url = await AsyncStorage.getItem('urlMain')

        try {
            if(urlMain!=null){
                const response = await fetch(urlMain + '/api/accounts/users/chats/', {
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
                let jsonObj = JSON.parse(JSON.stringify(json))
                setUsersList(jsonObj.results)
                console.log('IMAGESIMAGESIMAGESIMAGESIMAGESIMAGESIMAGES ' + usersList)
                /////////////////
                console.log('images length' + usersList.length)
                // if (images != null){
                //     let a = {};
                //     let b = {};
                //     images.map((item, index) => {
                //         a[item.picture_id] = item.rate
                //         b[item.picture_id] = item.is_liked
                //     })
                //     console.log('a    ' + a)
                //     console.log('b    ' + b)
                //     setListOfLikes(a);
                //     setLiked(b);
                //     console.log('listOfLikes ' + listOfLikes);
                // }
            }
            ///////////////////////
        } catch (error) {
            console.error('Error:', error);
        }

    }, [userKey, urlMain])

    useEffect( async () => {
        console.log(usersList)
        if(usersList.length!==0){
            usersList.map((item) => {
                if(item.is_logged_user){
                    setMainUserID(item.id);
                    setMainUsername(item.username);
                    setMainUserFirstName(item.first_name);
                    console.log('FIRSTNAME!')
                    console.log(item.first_name);
                }
            })
        }
    }, [usersList]);



    const renderItem = ({item, index}) => {
        if(!item.is_logged_user){
            return(
            <TouchableOpacity style={{ flexDirection: 'row', paddingVertical: 5}} 
                onPress={() => navigation.navigate('Chat', 
                {'userID': item.id, 
                'avatar': item.profile_picture_thumbnail_small, 
                'nickname': item.username, 
                'chatKey': item.chat_info.key,
                'chatID': item.chat_info.id,
                'mainUserID': mainUserID,
                'mainUsername': mainUsername, 
                'userKey': userKey, 
                'urlMain': urlMain,
                'mainFirstName': mainUserFirstName
                })}
                >
                    <View style={{flex: 1}}>
                        <Image style={styles.avatar} source={{uri: item.profile_picture_thumbnail_small}}/>
                    </View>
                    <View style={{flex: 4, flexDirection: 'column'}}>
                        <Text style={{ fontWeight: 'bold', marginTop: 11}}>{item.username}</Text>
                    </View>
            </TouchableOpacity>)
        }
    }

    return (
        <View style={{flex: 1, backgroundColor: '#fff'}}>
            <View style={{ justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{ fontWeight: 'bold' , fontSize: 32}}>Chats</Text>
            </View>
            <View>
                <FlatList
                    data={usersList}
                    renderItem={renderItem}
                    keyExtractor={item => String(item.id)}
                    // onRefresh={() => refresh()}
                    // refreshing={isFetching}
                    // ref={refFlatList}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    avatar: {
        height: 50,
        width: 50,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 3,
        marginLeft: 3
    }
})

export default ChatsScreen;