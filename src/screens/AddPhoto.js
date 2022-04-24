import React, {useState, useEffect, useRef} from 'react';
import {Text, View, Button, StyleSheet, Alert, TouchableOpacity, Dimensions, Image, TextInput, Modal, ScrollView} from 'react-native';
import { Camera } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import Home from "./Home";
import ImagePreview from "./ImagePreview";

const WINDOW_HEIGHT = Dimensions.get('window').height;
const WINDOW_WIDTH = Dimensions.get('window').width;
const CAPTURE_SIZE = Math.floor(WINDOW_HEIGHT * 0.08);

const AddPhoto = ({navigation}) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
    const cam = useRef();
    const [isPreview, setIsPreview] = useState(false);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [image, setImage] = useState(null);
    const nav = useNavigation();
    const [blur, setBlur] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [isShot, setIsShot] = useState(false);
    const [userKey, setUserKey] = useState('');

    useEffect(() => {
        (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
        })();
    }, []);

    useEffect(async () => {
        let auth = await AsyncStorage.getItem('userKey')
        if (auth != null) {
            setUserKey(auth);
        }
    }, [])


    const onCameraReady = () => {
        setIsCameraReady(true);
      }

    const switchCamera = () => {
        if (isPreview) {
            return;
        }
        setCameraType(prevCameraType =>
            prevCameraType === Camera.Constants.Type.back
            ? Camera.Constants.Type.front
            : Camera.Constants.Type.back
        );
    }

    const cancelPreview = async () => {
        console.log('fnadn fljdansl')
        // await cam.current.resumePreview();
        setIsPreview(false);
        setImage(null);
        console.log('resume')
      };


    const takePicture = async () => {

        if (cam.current) {
            const options = { quality: 0.7, base64: true };
            const shot = await cam.current.takePictureAsync(options);
            // const data = shot.base64;
            if (shot) {
              // await cam.current.pausePreview();
              setIsPreview(true);
              setImage(shot.uri);
              setIsShot(true);
            }
          }


        // try {
        //     if (cam.current) {
        //         const shot = await cam.current.takePictureAsync(null);
    
        //         const formData = new FormData();
        //         formData.append('picture_file', shot.blob());
        //         console.log('formdata     ' + formData);
        //         // let auth = await AsyncStorage.getItem('userKey');

        //         // let auth = await AsyncStorage.getItem('userKey');
        //         const response = await fetch(
        //         'https://c23a-2-58-204-26.ngrok.io/pictures/post_new/',
        //         {
        //             method: 'POST',
        //             headers: {
        //             'Accept': 'application/json',
        //             'Authorization': 'Token ' + 'cd2b368c4abad4bcaaed67c01168c243aad86004',
        //             'Content-Type': 'multipart/form-data'
        //             },
        //             body: formData
        //         }
        //         );
        //         const json = await response.json();
        //         console.log(json);
        //         Alert.alert('Picture is saved!');
        //     }

        //     } catch (error) {
        //     console.error('ERROR');
        //     }

    }
    
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
        if (result.cancelled) {
            return
        }
        else {
            setIsPreview(true);
            setIsShot(false);
            console.log(result);

            if (!result.cancelled) {
                setImage(result.uri);
            }
        }
    };

    const addCaption = () => {
        setBlur(10);
        setModalVisible(true);
    }

    const pushPhoto = async () => {

        const formData = new FormData();
        formData.append('picture_file', { uri: image, name: image.toString()});
        const response = await fetch(
            'https://daily-foto-shot.herokuapp.com/pictures/post_new/',
            {
                method: 'POST',
                headers: {
                'Accept': 'application/json',
                'Authorization': 'Token ' + userKey,
                'Content-Type': 'multipart/form-data'
                },
                body: formData
            }
        );
        const json = await response.json();
        console.log(json);
        Alert.alert('Picture is saved!');
    }




    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }
    return (

            <View style={styles.container}>

                    {isPreview && (
                        <View style={styles.container}>
                            <View >
                                <Image source={{ uri: image }} style={isShot ? { minWidth: '100%', minHeight: '100%' } : { minWidth: '100%', minHeight: '50%'}}/>
                            </View>
                                <Modal
                                    animationType="fade"
                                    // transparent={true}
                                    presentationStyle='pageSheet'
                                    visible={modalVisible}
                                    onRequestClose={() => {
                                        setModalVisible(!modalVisible);
                                    }}
                                    onSwipeOut={() => setModalVisible(false)}
                                >   
                                <ScrollView style={{flex:1}}>
                                    <View>
                                        <Image source={{ uri: image }} style={{height: 500, width:WINDOW_WIDTH}}/>
                                    </View>
                                    <View style={{borderWidth: 1, borderColor: 'grey', shadowOpacity:0.7, shadowColor: 'grey', justifyContent: 'flex', alignItems: 'flex', marginHorizontal: 10, marginVertical: 10 , borderRadius: 16}}>
                                        <TextInput placeholder='Type in description...' style={{ height: 100, width: WINDOW_WIDTH, marginHorizontal: 10}} multiline={true}/>
                                    </View>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 30}}>
                                        <TouchableOpacity style={{backgroundColor: 'lightblue', width: '40%', alignItems: 'center', borderRadius: 16, shadowOpacity: 0.3}} onPress={() => postCaption()}>
                                            <Text style={{ fontSize: 30}}>Submit</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{backgroundColor: 'red', width: '40%', alignItems: 'center', borderRadius: 16, shadowOpacity: 0.3}} onPress={() => setModalVisible(false)}>
                                            <Text style={{ fontSize: 30}}>Cancel</Text>
                                        </TouchableOpacity>
                                    </View>
                                </ScrollView>
                                </Modal>
                            <View style={styles.container}>
                                <TouchableOpacity
                                    onPress={() => cancelPreview()}
                                    style={styles.closeButton}
                                    activeOpacity={0.7}
                                >
                                    <AntDesign name='close' size={32} color='#fff' />
                                </TouchableOpacity>
                            </View>
                            <View style={{ alignItems: 'center'}}>
                                <TouchableOpacity style={styles.caption} onPress={() => addCaption()}>
                                    <Text style={{ fontSize: 26, color: 'white'}}>Go!</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.push} onPress={() => pushPhoto()}>
                                    <Text style={{ fontSize: 26, color: 'white'}}>Push</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    {!isPreview && (
                        <View style={styles.container}>
                            <Camera
                                ref={cam}
                                type={cameraType}
                                style={styles.container}
                                onCameraReady={onCameraReady}
                            />
                            <View style={styles.bottomButtonsContainer}>
                                {/*<TouchableOpacity*/}
                                {/*    onPress={() => {nav.navigate('Main')}}*/}
                                {/*    activeOpacity={0.7}*/}
                                {/*    >*/}
                                {/*        <AntDesign name='picture' size={32} color='#fff' />*/}
                                {/*    </TouchableOpacity>*/}
                                <TouchableOpacity
                                    disabled={!isCameraReady}
                                    onPress={() => switchCamera()}
                                    style={{marginLeft: 30}}
                                >
                                    <MaterialIcons name='flip-camera-ios' size={35} color='white' />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    disabled={!isCameraReady}
                                    onPress={() => takePicture()}
                                    style={styles.capture}
                                />
                                <TouchableOpacity
                                    onPress={() => pickImage()}
                                    style={styles.bottomButton}
                                    activeOpacity={0.7}
                                >
                                    <AntDesign name='picture' size={32} color='#fff' />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

            </View>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        ...StyleSheet.absoluteFillObject
      },
      text: {
        color: '#fff'
      },
      bottomButtonsContainer: {
        position: 'absolute',
        flexDirection: 'row',
        bottom: 28,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between'
      },
      capture: {
        backgroundColor: 'silver',
        height: CAPTURE_SIZE,
        width: CAPTURE_SIZE,
        borderRadius: Math.floor(CAPTURE_SIZE / 2),
        marginBottom: 20,
        marginHorizontal: 30,
        opacity: 0.5
      },
      closeButton: {
        position: 'absolute',
        top: 35,
        right: 20,
        height: 50,
        width: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'silver',
        opacity: 0.7
      },
      bottomButton: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 26
      },
    caption: {
        position: "absolute",
        width: '75%',
        backgroundColor: 'silver',
        opacity: 0.7,
        borderRadius: 16,
        paddingHorizontal: 5,
        bottom: 32,
        alignItems: 'center'
    },
    push: {
        position: "absolute",
        width: '75%',
        backgroundColor: 'silver',
        opacity: 0.7,
        borderRadius: 16,
        paddingHorizontal: 5,
        bottom: 72,
        alignItems: 'center'
    },
    captionForm: {
        position: "absolute",
        backgroundColor: 'white',
        opacity: 0.7,
        borderRadius: 16,
        paddingHorizontal: 30,
        paddingVertical: 100,
        alignItems: 'center',
        bottom: '40%',
        left: '15%',
        width: '75%'
    }
})

export default AddPhoto;