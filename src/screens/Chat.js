import React, {useState, useEffect, useRef} from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, KeyboardAvoidingView } from 'react-native';
import { AntDesign, Entypo, FontAwesome } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useIsFocused } from '@react-navigation/native'
import { Input } from '@rneui/base';
import useKeyboardHeight from 'react-native-use-keyboard-height';


const Chat = ({navigation, route}) => {

    const h = useKeyboardHeight();

    const { userID, avatar, nickname, chatKey, chatID, mainUserID, mainUsername, userKey, urlMain, mainFirstName } = route.params;
    const [serverState, setServerState] = useState('Loading...');
    const [messageText, setMessageText] = useState('');
    const [disableButton, setDisableButton] = useState(true);
    const [inputFieldEmpty, setInputFieldEmpty] = useState(true);
    const [serverMessages, setServerMessages] = useState([]);
    const [wsOpen, setWsOpen] = useState(false);

    const isFocused = useIsFocused()

    const [ws, setWs] = useState({});

    // const [ws]
    useEffect(() => {
        console.log('CHATKEY!!!!!!!');
        console.log(chatKey);
    }, []);

    // var ws = useRef(new WebSocket('wss://daily-foto-shot.herokuapp.com/ws/chat/' + chatKey + '/')).current;

    useEffect(() => {
        if(!wsOpen){
            var socket = new WebSocket('wss://daily-foto-shot.herokuapp.com/ws/chat/' + chatKey + '/');
            setWs(socket);
            setWsOpen(!wsOpen);
            setServerMessages([]);
        }else{
            ws.close()
            setWsOpen(!wsOpen);
        }
        
        // return () => {
        //     // socket.close() will be called when the component unmounts
        //     // that is when you go back from this screen
        //     socket.close();
        //   };
    }, [isFocused]);
    // useEffect( async () => {
    //     try {
    //         if(urlMain!=null){
    //             const response = await fetch(urlMain + '/chat/init_chat/?acceptor_id=' + userID, {
    //                 method: 'GET', // или 'PUT'
    //                 // body: JSON.stringify(data), // данные могут быть 'строкой' или {объектом}!
    //                 headers: {
    //                     'Accept': 'application/json',
    //                     'Authorization': 'Token ' + userKey,
    //                     'Content-Type': 'application/json'
    //                 }
    //             });
    //             const json = await response.json();
    //             console.log('Success:', JSON.stringify(json));
    //             let jsonObj = JSON.parse(JSON.stringify(json))
    //             setChatKey(jsonObj.key)
    //         }
    //         ///////////////////////
    //     } catch (error) {
    //         console.error('Error:', error);
    //     }
    // }, [userKey, urlMain]);

    // useEffect(() => {
    //     var ws = useRef(new WebSocket('wss://daily-foto-shot.herokuapp.com/ws/chat/' + chatKey + '/')).current;
    // }, [chatKey]);

    useEffect(() => {
        const serverMessagesList = [];
        ws.onopen = () => {
          setServerState('Connected to the server')
          setDisableButton(false);
          console.log('Connected!!!!!!!!!!!!!!!')
        };
        ws.onclose = (e) => {
          setServerState('Disconnected. Check internet or server.')
          setDisableButton(true);
        };
        ws.onerror = (e) => {
          setServerState(e.message);
        };
        ws.onmessage = (e) => {
          console.log('ONMESSAGE')
        //   let jsonObj = JSON.parse(JSON.stringify(e.data))
          let dat = JSON.parse(e.data);
          if(dat.message.message_type === 'new'){
            // if(dat.message.owner!==mainUsername){
                serverMessagesList.push([dat.message.text, dat.message.date, dat.message.owner, dat.message.date_mls]);
                console.log('OWNER')
                console.log(dat.message.owner)
                setServerMessages([...serverMessagesList]);
            // }
          }else{
            console.log('ELSE');
            console.log(dat.message.messages[0])
            console.log(dat.message.messages.length);
            for(let i=0 ; i < dat.message.messages.length ; i++){
                serverMessagesList.push([dat.message.messages[i].text, dat.message.messages[i].date, dat.message.messages[i].owner, dat.message.messages[i].date_mls]);
            }
            setServerMessages([...serverMessagesList]);
          }
        };
      }, [ws, isFocused])


    const submitMessage = () => {
        // let a = [messageText, Date(), mainFirstName, Date.now()]
        // console.log('MESSAGE');
        // console.log(messageText);
        // setServerMessages([a, ...serverMessages]);
        ws.send(JSON.stringify({
            'message': messageText,
            'initiator_first_name': mainFirstName,
            'initiator_id': mainUserID,
            'chat_id': chatID,
        }));
        setMessageText('')
        setInputFieldEmpty(true)
    }

    const renderItem = ({ item }) => {
        if(item[2] === mainFirstName){
            return(
                <View style={{borderRadius: 16, borderColor: 'black', borderWidth: 1, backgroundColor: 'lightgreen', paddingVertical: 3, paddingHorizontal: 10, marginVertical: 5, marginHorizontal: 5, alignSelf: 'flex-end' }}>
                    <Text>{item[0]} <Text style={{color: 'silver'}}>{item[1]}</Text></Text>
                </View>
            )
        }else{
            return(
                <View style={{borderRadius: 16, borderColor: 'black', borderWidth: 1, backgroundColor: 'lightblue', paddingVertical: 3, paddingHorizontal: 10, marginVertical: 5, alignSelf: 'flex-start' }}>
                    <Text>{item[0]} <Text style={{color: 'silver'}}>{item[1]}</Text></Text>
                </View>
            )
        }
    };

    const keyExtractor = (item) => item[3].toString();

    return (
        <View style={{ flex: 1}}>
            <View style={{flexDirection: 'row', backgroundColor: '#fff', justifyContent: 'center'}}>
                <TouchableOpacity style={{position: 'absolute', left: 5, top: 5}} onPress={() => navigation.navigate('ChatsScreen')}>
                    <Text style={{fontSize: 18}}><AntDesign name='left' size={26} color='#000' /> Back</Text>
                </TouchableOpacity>
                <View >
                    <Image style={styles.avatar} source={{uri: avatar}}/>
                </View>
                <View >
                    <Text style={{ fontWeight: 'bold', marginTop: 13, marginLeft: 5}}>{nickname}</Text>
                </View>
            </View>
            <KeyboardAvoidingView
                behavior={'padding'}
                style={{display: 'flex', flex: 9}}
                keyboardVerticalOffset={
                    Platform.select({
                       ios: () => 70,
                       android: () => 200
                    })()
                }
            >
                <View style={{flex: 8}}>
                    <FlatList
                        initialNumToRender={10}
                        inverted
                        data={serverMessages.slice().sort(
                            (a,b) => a[3].valueOf() - b[3].valueOf()
                            ).reverse()}
                        renderItem={renderItem}
                        keyExtractor={keyExtractor}
                    />
                </View>
                <View style={{flex: 1, backgroundColor: '#fff', paddingTop: 5, paddingLeft: 5, flexDirection: 'row'}}>
                    <View style={{flex:9}}>
                        <Input 
                            autoCorrect={false}
                            style={{fontSize: 18}}
                            placeholder='Type message...'
                            value={messageText}
                            onChangeText={value => {
                                setMessageText(value);
                                console.log(value);
                            }}
                        />
                    </View>
                    <View style={{flex:1}}>
                        <TouchableOpacity style={{position: 'absolute', right: 15, top: 10}} onPress={submitMessage}>
                            <FontAwesome name="send" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
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

export default Chat;