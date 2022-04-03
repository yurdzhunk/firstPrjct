import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, ImageBackground, Dimensions, TouchableOpacity, Animated, Button} from 'react-native';
import image from '../../assets/img.jpeg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import PagerView from 'react-native-pager-view';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';




const StartPage = ({navigation}) => {

    const fadeAnim = useRef(new Animated.Value(0)).current;

    const fadeIn = Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true
    });

    const fadeOut = Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true
    });
      


    useEffect(() => {
        Animated.loop(
            Animated.sequence([
              fadeIn,
              fadeOut
            ])
          ).start()
    }, [])

    // const fadeIn = () => {
    //     // Will change fadeAnim value to 1 in 5 seconds
    //     Animated.timing(fadeAnim, {
    //       toValue: 1,
    //       duration: 1000,
    //       useNativeDriver: true
    //     }).start();
    //   };
    
    //   const fadeOut = () => {
    //     // Will change fadeAnim value to 0 in 3 seconds
    //     Animated.timing(fadeAnim, {
    //       toValue: 0,
    //       duration: 1000,
    //       useNativeDriver: true
    //     }).start();
    //   };

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [username, setUsername] = useState('');
    const [birthday, setBirthday] = useState('');
    const [agreement, setAgreement] = useState(false);
    const [isAuth, setIsAuth] = useState(false);
    const [urlMain, setUrlMain] = useState('https://c399-46-211-102-100.ngrok.io');

    useEffect(async () => {
        let auth = await AsyncStorage.getItem('userKey')
        if (auth != null) {
            setIsAuth(true);
            navigation.navigate('Main');
        }
        await AsyncStorage.setItem('urlMain', 'https://c399-46-211-102-100.ngrok.io');
    }, [])

    const clickOnCheckbox = () => {
        setAgreement(!agreement);
    }


    const registerUser = async () => {
        try {
            const response = await fetch(
              urlMain + '/api/accounts/register/',
              {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "email": email,
                    "password": password,
                    "name": name,
                    "surname": surname,
                    "username": username,
                    "date_of_birth": birthday,
                    "terms_accepted": agreement
                })
              }
            );
            const json = await response.json();
            console.log(json);
            await AsyncStorage.setItem('userKey', json.key);
            setIsAuth(true);
            navigation.navigate('Main');
          } catch (error) {
            console.error('ERROR');
            }
    }

    const loginUser = async () => {
        try {
            const response = await fetch(
              urlMain + '/api/accounts/login/',
              {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "email": email,
                    "password": password
                })
              }
            );
            const json = await response.json();
            console.log(json);
            await AsyncStorage.setItem('userKey', json.key);
            setIsAuth(true);
            navigation.navigate('Main');
          } catch (error) {
            console.error('ERROR');
            }
    }

    const logOutUser = async () => {
        await AsyncStorage.removeItem('userKey');
        setIsAuth(false);
    }

    return (    
                <View style={styles.rootView}>
                    <ImageBackground source={image} style={{flex: 1}} blurRadius={0}>
                        {/* {isAuth
                        ? <View style={styles.loginForm}>
                            <Text style={{ fontSize: 26, textAlign: 'center', marginBottom: 15, color: 'white', fontWeight: 'bold', textShadowColor: '#000', textShadowRadius: 10}}>Welcome</Text>
                            <TouchableOpacity style={styles.button} onPress={() => logOutUser()}>
                                <Text style={{color: 'white', fontWeight: 'bold'}}>Log out</Text>
                            </TouchableOpacity>
                          </View> */}
                        <PagerView style={styles.pagerView} initialPage={0}>
                            <View key="1">
                                <View style={styles.loginForm} key="1">
                                    <View>
                                        <Text style={{ fontSize: 26, textAlign: 'center', marginBottom: 15, color: 'white', fontWeight: 'bold', textShadowColor: '#000', textShadowRadius: 10}}>Sign in form</Text>
                                    </View>
                                    <View>
                                        <TextInput style={styles.inp} value={email} placeholder='Email or Username' onChangeText={setEmail}/>
                                    </View>
                                    <View>
                                        <TextInput style={styles.inp} value={password} placeholder='Password' onChangeText={setPassword}/>
                                    </View>
                                    <View style={{alignItems: 'center'}}>
                                        <TouchableOpacity style={styles.button} onPress={() => loginUser()}>
                                            <Text style={{color: 'white', fontWeight: 'bold'}}>Sign in</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <Animated.View
                                            style={[
                                            {
                                                // Bind opacity to animated value
                                                opacity: fadeAnim,
                                                marginTop: '120%',
                                                alignItems: 'center',
                                                flexDirection: 'row'
                                            }
                                            ]}
                                        >
                                            <Text style={{color: 'white', fontSize: 26}}>
                                                Swipe for Sign up
                                            </Text>
                                            <AntDesign name='right' size={32} color='#fff' style={{ marginLeft: 26}} />
                                    </Animated.View>
                                </View>
                            </View>
                        <View  key="2">
                            <View style={styles.loginForm} key="1">
                                    <View>
                                        <Text style={{ fontSize: 26, textAlign: 'center', marginBottom: 15, color: 'white', fontWeight: 'bold', textShadowColor: '#000', textShadowRadius: 10}}>Sign up form</Text>
                                    </View>
                                    <View>
                                        <TextInput style={styles.inp} value={email} placeholder='Email' onChangeText={setEmail}/>
                                    </View>
                                    <View>
                                        <TextInput style={styles.inp} value={password} placeholder='Password' onChangeText={setPassword}/>
                                    </View>
                                    <View>
                                        <TextInput style={styles.inp} value={name} placeholder='Name' onChangeText={setName}/>
                                    </View>
                                    <View>
                                        <TextInput style={styles.inp} value={surname} placeholder='Surname' onChangeText={setSurname}/>
                                    </View>
                                    <View>
                                        <TextInput style={styles.inp} value={username} placeholder='Username' onChangeText={setUsername}/>
                                    </View>
                                    <View>
                                        <TextInput style={styles.inp} value={birthday} placeholder='Date of birth' onChangeText={setBirthday}/>
                                    </View>
                                    <BouncyCheckbox
                                        size={25}
                                        fillColor="lightgreen"
                                        unfillColor="#FFFFFF"
                                        text="Agree with terms of usage"
                                        iconStyle={{ borderColor: "grey" }}
                                        textStyle={{ color: 'white',  textShadowColor: '#000', textShadowRadius: 10, textDecorationLine: "none"}}
                                        style={{justifyContent: 'center'}}
                                        onPress={() => clickOnCheckbox()}
                                    />
                                    <View style={{alignItems: 'center'}}>
                                        <TouchableOpacity style={styles.button} onPress={() => registerUser()}>
                                            <Text style={{color: 'white', fontWeight: 'bold'}}>Sign up</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <Animated.View
                                            style={[
                                            {
                                                // Bind opacity to animated value
                                                opacity: fadeAnim,
                                                marginTop: '62%',
                                                alignItems: 'center',
                                                flexDirection: 'row'
                                            }
                                            ]}
                                        >
                                            <AntDesign name='left' size={32} color='#fff' style={{ marginRight: 26}} />
                                            <Text style={{color: 'white', fontSize: 26}}> 
                                                Swipe for Sign in
                                            </Text>
                                    </Animated.View>
                            </View>
                        </View>
                      </PagerView>
                      
                        
                        
                    </ImageBackground>
                </View>
    );
};

const styles = StyleSheet.create({
    loginForm: {
        flex: 1,
        marginHorizontal: '10%',
        marginVertical: '20%',
        borderRadius: 16,
    },
    inp: {
        backgroundColor: '#fff',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 16,
        borderColor: '#000',
        width: '80%',
        height: 30,
        marginVertical: 5,
        marginHorizontal: '12.5%',
        paddingHorizontal: 10,
        textAlign: 'center'
    },
    rootView: {
        flex: 1,
        minHeight: Math.round(Dimensions.get('window').height)
    },
    button: {
        backgroundColor: 'skyblue',
        borderStyle: 'solid',
        borderColor: 'grey',
        borderRadius: 16,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '80%',
        marginTop: 5,
        height: 30,
        width: 100
    },
    pagerView: {
        flex: 1,
      }
})

export default StartPage;