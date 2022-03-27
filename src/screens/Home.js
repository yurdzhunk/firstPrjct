import React, {useState} from 'react';
import { Text, FlatList, View, StyleSheet } from 'react-native';
import InputForm from '../Components/InputForm';
import Post from '../Components/Post';

const Home = () => {

    const [postsSet, setPostsSet] = useState([]);

    const addPost = (post) => {
        const newPost = {
        id: Date.now(),
        text: post
        }
        setPostsSet([...postsSet, newPost]);
    }

    const deletePost = (post) => {
        let a = postsSet;
        a.splice(a.indexOf(post), 1)
        setPostsSet([...a])
    }

    return (
        <View style={styles.container}>
            <InputForm addPost={addPost} />
            <FlatList 
            data={postsSet}
            renderItem={({item}) => <Post post={item} deletePost={deletePost}/>}
            keyExtractor={item => item.id.toString()}
            />
      </View>
    );
};


const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 20,
      paddingVertical: 20,
      backgroundColor: '#fff',
      flex: 1
    }
  });

export default Home;