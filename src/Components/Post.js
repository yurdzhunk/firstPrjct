import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { backgroundColor } from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';

const Post = ({post, deletePost}) => {
    return (
        <Pressable 
            onPress={() => console.log(post.id + '   text   ' + post.text)}
            onLongPress={() => deletePost(post)}
            style={({pressed}) => pressed ? styles.pressedPost : styles.normalPost}
        >
                <Text>{post.text}</Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    normalPost: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        borderColor: '#eee',
        borderWidth: 1,
        padding: 5,
        marginVertical: 5,
        backgroundColor: 'white'
    },
    pressedPost: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        borderColor: 'black',
        borderWidth: 1,
        padding: 5,
        marginVertical: 5,
        backgroundColor: 'grey'
    }
})

export default Post;