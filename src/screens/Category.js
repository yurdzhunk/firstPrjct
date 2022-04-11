import React, {useEffect} from 'react';
import { render } from 'react-dom';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';

const Category = ({navigation, route}) => {

    const {category} = route.params;

    const vote = () => {
        navigation.navigate('Voter', {'category': category, 'is_friends': false})
    }

    return (
        <View key={Date.now()}>
            <View style={{ alignItems: 'center'}}>
                <Text style={{ fontSize: 32, fontWeight: 'bold'}}>{category}</Text>
            </View>
            <Animatable.View animation='bounceIn'>
                <TouchableOpacity style={styles.btn} onPress={() => vote()}>
                    <View>
                        <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#fff'}}>Vote</Text>
                    </View>
                </TouchableOpacity>
            </Animatable.View>
            <Animatable.View animation='bounceIn'>
                <TouchableOpacity style={styles.btn}>
                    <Animatable.View animation='bounceIn'>
                        <Text style={{ fontSize: 32, fontWeight: 'bold', color: "#fff"}}>Ranks</Text>
                    </Animatable.View>
                </TouchableOpacity>
            </Animatable.View>
            <Animatable.View animation='bounceIn'>
                <TouchableOpacity style={styles.back} onPress={() => navigation.navigate('Album')}>
                    <View>
                        <Text style={{ fontSize: 32, fontWeight: 'bold', color: "#fff"}}>Back</Text>
                    </View>
                </TouchableOpacity>
            </Animatable.View>
        </View>
    );
};

export default Category;

const styles = StyleSheet.create({
    btn: {
        marginHorizontal: 30,
        marginVertical: 10,
        backgroundColor: 'lightblue',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16
    },
    back: {
        marginHorizontal: 30,
        marginTop: 100,
        backgroundColor: 'silver',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16
    }
})