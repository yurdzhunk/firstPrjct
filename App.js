import React, {useEffect} from 'react';
import { StyleSheet} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Navbar from './src/Components/Navbar';
import Home from './src/screens/Home';
import Profile from './src/screens/Profile';
import Icon from 'react-native-vector-icons/AntDesign';
import { useFonts } from 'expo-font';
import Main from './src/screens/Main';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddPhoto from './src/screens/AddPhoto';

export default function App() {


const getUserKey = async (key) => {
    try {
        console.log('get')
        const value = await AsyncStorage.getItem(key)
        if(value !== null) {
          console.log('value   ' + value)
        }
      } catch(e) {
        console.log('error read')
      }
}

useEffect(async () => {
    getUserKey('userKey');
}, [])


  const [loaded] = useFonts({
    OpenSans: require('./assets/fonts/OpenSans-ExtraBoldItalic.ttf'),
  });

  const Tab = createBottomTabNavigator();

  const screenOptions = (route, color) => {
    let iconName;
  
    switch (route.name) {
      case 'Main':
        iconName = 'picture';
        break;
      case 'Photo':
        iconName = 'camera';
        break;
      case 'Profile':
        iconName = 'user';
        break;
      default:
        break;
    }
  
    return <Icon name={iconName} color={color} size={24} />;
  };

  const titleOptions = (route) => {
      
    let titleName;

    switch (route.name) {
      case 'Main':
        titleName = 'Photos';
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
          headerTitle: titleOptions(route),
          headerShown: false
      })}

       >
        <Tab.Screen name="Main" component={Main}/>
        <Tab.Screen name="Photo" component={AddPhoto}/>
        <Tab.Screen name="Profile" component={Profile}/>
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
