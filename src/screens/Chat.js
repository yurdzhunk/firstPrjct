import React, {useState, useEffect, useRef, useCallback} from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, KeyboardAvoidingView, AppState, TextInput } from 'react-native';
import { AntDesign, Entypo, FontAwesome } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useIsFocused } from '@react-navigation/native'
import { Input } from '@rneui/base';
import useKeyboardHeight from 'react-native-use-keyboard-height';
import PushNotification from './PushNotification';
import * as Notifications from 'expo-notifications';
import gif from '../../assets/writing-hand.gif'


const Chat = ({navigation, route}) => {

    const h = useKeyboardHeight();
    
    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);

    const { userID, avatar, nickname, firstname, chatKey, chatID, mainUserID, mainUsername, userKey, urlMain, mainFirstName } = route.params;
    const [serverState, setServerState] = useState('Loading...');
    const [messageText, setMessageText] = useState('');
    const [disableButton, setDisableButton] = useState(true);
    const [inputFieldEmpty, setInputFieldEmpty] = useState(true);
    const [serverMessages, setServerMessages] = useState([]);
    const [wsOpen, setWsOpen] = useState(false);

    const [showScrollBottomButton, setShowScrollBottomButton] = useState(false)
    const flatlistRef = useRef()

    // const [isTyping, setIsTyping] = useState(false)

    const months = {
        0: 'January',
        1: 'February',
        2: 'March',
        3: 'April',
        4: 'May',
        5: 'June',
        6: 'July',
        7: 'August',
        8: 'September',
        9: 'October',
        10: 'November',
        11: 'December',
    }

    const isFocused = useIsFocused()

    const [ws, setWs] = useState({});

    // const [ws]
    useEffect(() => {
        console.log('CHATKEY!!!!!!!');
        console.log(chatKey);
    }, []);

    // useEffect(() => {
    //     const subscription = AppState.addEventListener("change", nextAppState => {
    //       if (
    //         appState.current.match(/active|foreground/) &&
    //         nextAppState === "inactive"
    //       ) {
    //         console.log("App has come to the background!");
    //         // console.log('CLOSE WS')
    //         // console.log(ws)
    //         // ws.close();
    //       }

    //       if (
    //         appState.current.match(/inactive|background/) &&
    //         nextAppState === "active"
    //       ) {
    //         console.log("App has come to the foreground!");
    //         // console.log('OPEN WS')
    //         // var socket = new WebSocket('wss://daily-foto-shot.herokuapp.com/ws/chat/' + chatKey + '/');
    //         // setWs(socket);
    //       }
    
    //       appState.current = nextAppState;
    //       setAppStateVisible(appState.current);
    //       console.log("AppState", appState.current);
    //     });
    
    //     // return () => {
    //     //   subscription.remove();
    //     // };
    //   }, []);


    useEffect(() => {
        if(!wsOpen){
            var socket = new WebSocket('wss://daily-foto-shot.herokuapp.com/ws/chat/' + chatKey + '/');
            setWs(socket);
            setWsOpen(!wsOpen);
            // setServerMessages([]);
            console.log('ISFOCUSED_OPEN')
        }else{
            console.log('ISFOCUSED_CLOSE')
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
        var isTyping = false;
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
                if(dat.message.owner === 'typing'){
                    console.log('TYPING');
                    if(isTyping === false){
                        console.log('isTYPING')
                        console.log(isTyping)
                        isTyping = true;
                        console.log(isTyping)
                        serverMessagesList.push([dat.message.text, dat.message.date, dat.message.owner, dat.message.date_mls]);
                        setServerMessages([...serverMessagesList]);
                        setTimeout(function() {
                            console.log('TIMEOUT')
                            if(isTyping === true){
                                console.log('TIMEOUT in IF');
                                isTyping = false;
                                serverMessagesList.pop();
                                setServerMessages([...serverMessagesList]);
                            }
                        }
                        , 5000);
                    }
                }else{
                    if(isTyping === true){
                        isTyping = false;
                        serverMessagesList.pop()
                        setServerMessages([...serverMessagesList]);
                    }
                    serverMessagesList.push([dat.message.text, dat.message.date, dat.message.owner, dat.message.date_mls]);
                    console.log('OWNER')
                    console.log(dat.message.owner)
                    setServerMessages([...serverMessagesList]);
                }
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
      }, [ws])


    const submitMessage = () => {
        // let a = [messageText, Date(), mainFirstName, Date.now()]
        // console.log('MESSAGE');
        // console.log(messageText);
        // setServerMessages([a, ...serverMessages]);
        ws.send(JSON.stringify({
            'message': messageText,
            'initiator_first_name': mainFirstName,
            'initiator_id': mainUserID,
            'receiver_id': userID,
            'chat_id': chatID,
        }));
        setMessageText('')
        setInputFieldEmpty(true)
    }

    const onInputChange = () => {
        ws.send(JSON.stringify({
            'message': 'typing',
            'initiator_first_name': mainFirstName,
            'initiator_id': mainUserID,
            'receiver_id': userID,
            'chat_id': chatID,
        }));
    }

    const handleScroll = (event) => {
        let yOffset = event.nativeEvent.contentOffset.y
        if(yOffset > 250){
            setShowScrollBottomButton(true);
        }else{
            setShowScrollBottomButton(false)
        }
    }

    const scrollToBottom = () => {
        flatlistRef.current.scrollToOffset(0);
    }

    const renderItem = ({ item }) => {
        if(item[2] === mainFirstName){
            return(
                <View key={item[3]} style={{flexDirection: 'column'}}>
                    <View style={styles.userMessage}>
                        <Text>{item[0]}</Text>
                    </View>
                    <View style={{alignSelf: 'flex-end', paddingHorizontal: 10}}>
                        <Text style={{color: 'silver', fontSize: 10}}>{item[1]}</Text>
                    </View>
                </View>
            )
        }
        if(item[2] === 'date'){
            return(
                <View style={styles.dateMessage}>
                    <Text>{item[0]}</Text>
                </View>
            )
        }
        if(item[2] === 'typing'){
            return(
                <View style={styles.typingMessage}>
                    <Text style={{color: '#fff'}}>typing...</Text>
                </View>
                // <Image style={{height: 30, width: 40, transform: [{rotateY: '180deg'}], backgroundColor: '#fff'}} source={gif}/>
            )
        }
        if(item[2] === firstname){
            return(
                <View key={item[3]} style={{flexDirection: 'column'}}>
                    <View style={styles.guestMessage}>
                        <Text style={{color: '#fff'}}>{item[0]}</Text>
                    </View>
                    <View style={{alignSelf: 'flex-start', paddingHorizontal: 10}}>
                        <Text style={{color: 'silver', fontSize: 10}}>{item[1]}</Text>
                    </View>
                </View>
            )
        }
    };

    const keyExtractor = (item) => item[3].toString();

    return (
        <View style={{ flex: 1}}>
            <View style={{flexDirection: 'row', backgroundColor: '#fff', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: 'silver'}}>
                <TouchableOpacity style={{position: 'absolute', left: 5, top: 5}} onPress={() => navigation.navigate('Chats')}>
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
                <View style={{flex: 8, paddingBottom: 3}}>
                    <FlatList
                        ref={flatlistRef}
                        style={{backgroundColor: '#fff'}}
                        initialNumToRender={5}
                        maxToRenderPerBatch={10}
                        inverted
                        data={serverMessages.slice().sort(
                            (a,b) => a[3].valueOf() - b[3].valueOf()
                            ).reverse()}
                        renderItem={renderItem}
                        keyExtractor={keyExtractor}
                        onScroll={handleScroll}
                    />
                    {showScrollBottomButton
                    ?<TouchableOpacity style={styles.scrollBottomButton} onPress={scrollToBottom}>
                        <AntDesign name="down" size={24} color="white" />
                     </TouchableOpacity>
                    :<></>
                    }
                </View>
                <View style={{flex: 1, backgroundColor: '#fff', paddingTop: 5, paddingLeft: 5, flexDirection: 'row', borderTopWidth: 1, borderTopColor: 'silver'}}>
                    <View style={{flex:9, paddingTop: 8}}>
                        <TextInput 
                            style={{fontSize: 18, borderRadius: 16, backgroundColor: '#fff', borderWidth: 1, borderColor: 'silver', height: 30, paddingHorizontal: 5}}
                            placeholder='Type message...'
                            value={messageText}
                            onChangeText={value => {
                                onInputChange();
                                setMessageText(value);
                                console.log(value);
                                if(value.length > 0){
                                    setInputFieldEmpty(false)
                                }else{
                                    setInputFieldEmpty(true)
                                }
                            }}
                        />
                    </View>
                    <View style={{flex:1, paddingLeft: 5}}>
                        <TouchableOpacity style={{position: 'absolute', right: 15, top: 10}} onPress={submitMessage} disabled={inputFieldEmpty}>
                            <FontAwesome name="send" size={24} color="black"/>
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
    },
    miniAvatar: {
        height: 20,
        width: 20,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 3,
        marginLeft: 3
    },
    userMessage: {
        borderRadius: 16,
        shadowColor: 'grey',
        shadowOpacity: 0.3,
        backgroundColor: '#FFF8DC', 
        paddingVertical: 3, 
        paddingHorizontal: 10, 
        marginTop: 7 ,
        marginBottom: 3,
        marginHorizontal: 5, 
        alignSelf: 'flex-end'
    },
    guestMessage: {
        borderRadius: 16,
        shadowColor: 'grey',
        shadowOpacity: 0.3,
        backgroundColor: '#6495ED', 
        paddingVertical: 3, 
        paddingHorizontal: 10, 
        marginTop: 7 ,
        marginBottom: 3,
        marginHorizontal: 5, 
        alignSelf: 'flex-start'
    },
    typingMessage: {
        borderRadius: 16,
        shadowColor: 'grey',
        shadowOpacity: 0.3,
        backgroundColor: 'lightgrey', 
        paddingVertical: 3, 
        paddingHorizontal: 10, 
        marginTop: 7 ,
        marginBottom: 3,
        marginHorizontal: 5, 
        alignSelf: 'flex-start'
    },
    dateMessage: {
        alignSelf: 'center',
        backgroundColor: 'silver',
        opacity: 0.3,
        borderRadius: 16,
        marginTop: 7,
        marginBottom: 3,
        paddingVertical: 3, 
        paddingHorizontal: 10
    },
    scrollBottomButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        height: 40,
        width: 40,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'silver',
        opacity: 0.7
    }
})

export default Chat;