import { useIsFocused } from '@react-navigation/native';
import React, { useState, useCallback, useEffect } from 'react'
import { KeyboardAvoidingView } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat'

export function Chatting({navigation, route}) {
  const [messages, setMessages] = useState([]);

  const { userID, avatar, nickname, chatKey, chatID, mainUserID, mainUsername, userKey, urlMain, mainFirstName } = route.params;
  const isFocused = useIsFocused()
  const [wsOpen, setWsOpen] = useState(false);
  const [ws, setWs] = useState({});
  const [serverMessages, setServerMessages] = useState([]);
  const [serverState, setServerState] = useState('Loading...');



  useEffect(() => {
    if(!wsOpen){
        var socket = new WebSocket('wss://daily-foto-shot.herokuapp.com/ws/chat/' + chatKey + '/');
        setWs(socket);
        setWsOpen(!wsOpen);
        setServerMessages([]);
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

  useEffect(() => {
    const serverMessagesList = [];
    ws.onopen = () => {
      setServerState('Connected to the server')
    //   setDisableButton(false);
      console.log('Connected!!!!!!!!!!!!!!!')
    };
    ws.onclose = (e) => {
      setServerState('Disconnected. Check internet or server.')
    //   setDisableButton(true);
    };
    ws.onerror = (e) => {
      setServerState(e.message);
    };
    ws.onmessage = (e) => {
      console.log('ONMESSAGE')
    //   let jsonObj = JSON.parse(JSON.stringify(e.data))
      let dat = JSON.parse(e.data);
      if(dat.message.message_type === 'new'){
            serverMessagesList.push({
                _id: mainUserID,
                text: dat.message.messages[i].text,
                createdAt: dat.message.messages[i].date,
                user: {
                    _id: userID,
                    name: nickname,
                    avatar: avatar,
                },
            });
            console.log('OWNER')
            console.log(dat.message.owner)
            setMessages(previousMessages => GiftedChat.append(serverMessagesList))
        }else{
            console.log('ELSE');
            console.log(dat.message.messages[0])
            console.log(dat.message.messages.length);
            for(let i=0 ; i < dat.message.messages.length ; i++){
                serverMessagesList.push({
                    _id: mainUserID,
                    text: dat.message.messages[i].text,
                    createdAt: dat.message.messages[i].date,
                    user: {
                        _id: userID,
                        name: nickname,
                        avatar: avatar,
                    },
                })
                // [dat.message.messages[i].text, dat.message.messages[i].date, dat.message.messages[i].owner, dat.message.messages[i].date_mls]);
        }
        setMessages([...serverMessagesList]);
      }
    };
  }, [ws])

//   useEffect(() => {
//     setMessages([
//       {
//         _id: 1,
//         text: 'Hello developer',
//         createdAt: new Date(),
//         user: {
//           _id: 2,
//           name: 'React Native',
//           avatar: 'https://placeimg.com/140/140/any',
//         },
//       },
//     ])
//   }, [])

  const onSend = useCallback((messages = []) => {
    // setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    ws.send(JSON.stringify({
        'message': messages,
        'initiator_first_name': mainFirstName,
        'initiator_id': mainUserID,
        'receiver_id': userID,
        'chat_id': chatID,
    }));
  }, [])

  return (
          <GiftedChat
            bottomOffset={70}
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
                _id: mainUserID,
            }}
          />
  )
}