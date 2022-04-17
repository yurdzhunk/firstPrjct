import React, {useEffect, useState} from 'react';
import { StyleSheet, View} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Navbar from './src/Components/Navbar';
import Home from './src/screens/Home';
import StartPage from './src/screens/StartPage';
import Icon from 'react-native-vector-icons/AntDesign';
import { useFonts } from 'expo-font';
import Main from './src/screens/Main';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddPhoto from './src/screens/AddPhoto';
import Album from './src/screens/Album';
import Category from './src/screens/Category';
import Voter from './src/screens/Voter'
import ProfilePage from './src/screens/ProfilePage';
import ChatsScreen from './src/screens/ChatsScreen';
import Chat from './src/screens/Chat';
import { Entypo, Feather, Octicons } from '@expo/vector-icons';
import PushNotification from './src/screens/PushNotification'
import { Chatting } from './src/screens/Chatting';

export default function App() {

  const [userKey, setUserKey] = useState('');
  const [isAuth, setIsAuth] = useState(false);


  // const getUserKey = async (key) => {
  //     try {
  //         console.log('get')
  //         const value = await AsyncStorage.getItem(key)
  //         if(value !== null) {
  //           console.log('value   ' + value)
  //           setUserKey(value);
  //           setIsAuth(true);
  //         }
  //       } catch(e) {
  //         console.log('is not authorized')
  //       }
  // }

  // useEffect(async () => {
  //     getUserKey('userKey');
  // }, [])


  const [loaded] = useFonts({
    OpenSans: require('./assets/fonts/OpenSans-ExtraBoldItalic.ttf'),
  });

  const Tab = createBottomTabNavigator();

  const screenOptions = (route, color) => {
    let iconName;
  
    switch (route.name) {
      case 'Main':
        return <Octicons style={{marginBottom: 5}} name="home" size={32} color={color} />
        break;
        case 'Album':
        iconName = 'picture';
        break;
      case 'Photo':
        return <Feather name="camera" size={32} color={color} />
        break;
      case 'Profile':
        iconName = 'user';
        break;
      default:
        break;
    }
  
    return <Icon name={iconName} color={color} size={32} />;
  };

  const titleOptions = (route) => {
      
    let titleName;

    switch (route.name) {
      case 'Main':
        titleName = 'Photos';
        break;
        case 'Album':
        titleName = 'Album';
        break;
      case 'Photo':
        titleName = 'Add photo';
        break;
      case 'Profile':
        titleName = 'Profile';
        break;
      default:
        break;
    }

    return titleName
  }

 
    return (
      <NavigationContainer>
        <StatusBar style='dark' />
        <Navbar />
        <Tab.Navigator
          screenOptions={({route}) => ({
            tabBarIcon: ({color}) => screenOptions(route, color),
            tabBarHideOnKeyboard: false,
            tabBarStyle: [{display: 'flex'}],
            // headerTitle: titleOptions(route),
            headerShown: false,
            tabBarShowLabel: false,
            tabBarActiveTintColor: 'darkred',
            inactiveTintColor: 'lightgray',
            // tabBarStyle: {
            //   backgroundColor: 'darkred'
            // }
          })}
        >
          <Tab.Screen
              name="StartPage"
              component={StartPage}
              options={{
                tabBarButton: () => null,
                tabBarVisible: false, // if you don't want to see the tab bar
                tabBarStyle: { display: "none" }
              }}
          />
          <Tab.Screen name="Main" component={Main}/>
          <Tab.Screen name="Album" component={Album}/>
          <Tab.Screen name="Photo" component={AddPhoto}/>
          <Tab.Screen name="Profile" component={ProfilePage}/>
          <Tab.Screen
              name="Category"
              component={Category}
              options={{
                tabBarButton: () => null,
                tabBarVisible: false, // if you don't want to see the tab bar
              }}
          />
          <Tab.Screen
              name="Voter"
              component={Voter}
              options={{
                tabBarButton: () => null,
                tabBarVisible: false, // if you don't want to see the tab bar
              }}
          />
           <Tab.Screen
              name="ChatsScreen"
              component={ChatsScreen}
              options={{
                tabBarButton: () => null,
                // tabBarVisible: false, // if you don't want to see the tab bar
                // tabBarStyle: { display: "none" }
              }}
          />
          <Tab.Screen
              name="Chat"
              component={Chat}
              options={{
                tabBarButton: () => null,
                // tabBarVisible: false, // if you don't want to see the tab bar
                // tabBarStyle: { display: "none" }
              }}
          />
          <Tab.Screen
              name="Chatting"
              component={Chatting}
              options={{
                tabBarButton: () => null,
                // tabBarVisible: false, // if you don't want to see the tab bar
                // tabBarStyle: { display: "none" }
              }}
              tabBarHideOnKeyboard={true}
          />
          <Tab.Screen
              name="Noti"
              component={PushNotification}
              options={{
                tabBarButton: () => null,
                // tabBarVisible: false, // if you don't want to see the tab bar
                // tabBarStyle: { display: "none" }
              }}
          />
        </Tab.Navigator>
    </NavigationContainer>
    );
  
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20
  }
});
