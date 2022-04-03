import React from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import pic from '../../assets/coffee.jpeg';
import { Entypo } from '@expo/vector-icons'; 

const ProfilePage = ({navigation}) => {

    const logOut = async () => {
        await AsyncStorage.removeItem('userKey');
        navigation.navigate('StartPage')
    }

    return (
        <View style={{flex: 1, backgroundColor: '#fff'}}>
            <View style={styles.profileHeader}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 10}}>
                    <View style={{flex: 1}}>
                        <Image style={styles.avatar} source={pic}/>
                    </View>
                    <View style={{flex: 2, flexDirection: 'column'}}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1, alignItems: 'center', paddingHorizontal: 30}}>
                            <Text style={{fontWeight: 'bold'}}>30 photos</Text>
                            <Text style={{fontWeight: 'bold'}}>100 friends</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1, alignItems: 'center', paddingHorizontal: 30}}>
                            <Text><Entypo name="medal" size={24} color="gold" /> 30</Text>
                            <Text><Entypo name="medal" size={24} color="silver" /> 30</Text>
                            <Text><Entypo name="medal" size={24} color="brown" /> 30</Text>
                        </View>
                    </View>
                </View>
                <View>
                    <Text style={{fontWeight: 'bold', marginLeft: 10}}>Valerii Dzhunkovskyi</Text>
                    <Text style={{marginLeft: 10}}>CEO and Founder</Text>
                </View>
            </View>
            <View>
                <Button title='Log out' onPress={() => logOut()} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    profileHeader: {
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