import React, { Component } from 'react';
import axios from 'axios';
import api from '../services/api';
import io from 'socket.io-client';

import { View, Image,StyleSheet, TouchableOpacity, FlatList, Text } from 'react-native';

import camera from '../assets/camera.png';
import more from '../assets/more.png';
import comentario from '../assets/comment.png';
import like from '../assets/like.png';
import send from '../assets/send.png';

export default class Feed extends Component {
    static navigationOptions = ({ navigation }) => ({
        headerRight:(
            <TouchableOpacity style={{ marginRight:20 }} onPress={() => navigation.navigate('New')}>
                <Image source={ camera }/>                
            </TouchableOpacity>
        ),
    });

    state = {
        feed:[],
    };
    
    async componentDidMount() {
        this.registerToSocket();

        const response = await api.get('posts');
        //console.log(response.data);
        this.setState({ feed: response.data});
    }
    registerToSocket = () => {
        const socket = io('http://192.168.1.22:2018');
        //post, like

        socket.on('post', newPost => {
            this.setState({feed: [newPost, ...this.state.feed]});
        });

        socket.on('like', newLike => {
            this.setState({
                feed: this.state.feed.map(post =>
                post._id === newLike._id ? newLike : post
                )});
        });
    }
    handleLike = id =>{
        api.post(`/posts/${id}/like`);       
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList 
                 data={ this.state.feed}
                 keyExtractor={ post => post._id}
                 renderItem={({ item }) => (
                    <View style={styles.feedItem}>
                        <View style={styles.feedItemHeader}>
                            <View style={styles.userInfo}>
                                <Text style={styles.name}>{item.author}</Text>
                                <Text style={styles.place}>{item.place}</Text>
                            </View>
                            <Image source={more}/>
                        </View>
                        <Image style={styles.feedImage} source={{ uri: `http://192.168.1.22:2018/files/${item.image}` }} />
                   
                        <View style={styles.feedFooter}>
                            <View style={styles.actions}>
                                <TouchableOpacity style={styles.action} onPress={() => this.handleLike(item._id) }>
                                    <Image source={like}/>
                                </TouchableOpacity>                                
                                <TouchableOpacity style={styles.action} onPress={() => {}}>
                                    <Image source={comentario}/>
                                </TouchableOpacity>             
                                <TouchableOpacity style={styles.action} onPress={() => {}}>
                                    <Image source={send}/>
                                </TouchableOpacity>                                                   
                            </View>
                            <Text style={styles.likes}>{item.likes}</Text>
                            <Text style={styles.description}>{item.description}</Text>
                            <Text style={styles.hashtags}>{item.hashtags}</Text>
                        </View>
                    </View>                    
                 )} 
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
    },

    feedItem: {
        marginTop: 25,
    },
    feedItemHeader: {
        paddingHorizontal: 20,

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    name: {
        fontSize: 15,
        color: '#000',        
    },
    place: {
        fontSize: 12,
        color: '#666',
        marginTop:2,
        fontStyle: 'italic',
    },
    feedImage: {
        width: '100%',
        height: 400,
        marginVertical: 15,

    },
    feedFooter: {
        paddingHorizontal:15,
    },
    actions: {
        flexDirection: 'row',
    },
    action: {
        marginRight: 10,
    },
    likes: {
        marginTop: 15,
        fontWeight: 'bold',
        color: '#000',
    },
    description: {
        lineHeight: 18,
        color: '#0336ff'
    },  
    hashtags: {
        color: '#7159c1',
    }
});