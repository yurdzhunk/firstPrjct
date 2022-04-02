import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Category = ({navigation, route}) => {

    const {category} = route.params;

    const vote = () => {
        navigation.navigate('Voter', {'category': category})
    }

    return (
        <View>
            <View style={{ alignItems: 'center'}}>
                <Text style={{ fontSize: 32, fontWeight: 'bold'}}>{category}</Text>
            </View>
            <TouchableOpacity style={styles.btn} onPress={() => vote()}>
                <View>
                    <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#fff'}}>Vote</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn}>
                <View>
                    <Text style={{ fontSize: 32, fontWeight: 'bold', color: "#fff"}}>Ranks</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.back} onPress={() => navigation.navigate('Album')}>
                <View>
                    <Text style={{ fontSize: 32, fontWeight: 'bold', color: "#fff"}}>Back</Text>
                </View>
            </TouchableOpacity>
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