import React, { Component } from 'react';
import api from '../services/api';
import io from 'socket.io-client';

import './Feed.css';

import more from '../assets/more.svg';
import like from '../assets/like.svg';
import comment from '../assets/comment.svg';
import send from '../assets/send.svg';

class Feed extends Component{
    state = {
        feed:[],
        displayMenu:false,
    };
    
    async componentDidMount(){
        this.registerToSocket();
        

        const response = await api.get('posts');

        this.setState({ feed: response.data});

        this.showDropdownMenu = this.showDropdownMenu.bind(this);
        this.hideDropdownMenu = this.hideDropdownMenu.bind(this);
    }

    registerToSocket = () => {
        const socket = io('http://192.168.1.22:2018');
        //post, like
        socket.on('del', deletePost => {            
            this.setState({
                feed: this.state.feed.filter(post =>
                    post._id !== deletePost._id
                )
            });
        }); 
            

        // socket.on('del', del => {
        //     //const response = api.get('posts');
        //     const x = document.getElementById('post-list');
        //     console.log(x);
        //     const id = del._id;
        //     console.log("id: "+id);
        //    // const y =  document.getElementById();
        //     //console.log(y);
        //     this.setState({
        //     feed: this.state.feed.map(post =>
        //         post._id === del._id ? x.removeChild(id) : post
        //     )
        //     });
        // })            

        socket.on('post', newPost => {
            this.setState({feed: [newPost, ...this.state.feed]});
        });    

        socket.on('like', newLike => {
            console.log(newLike._id )
            this.setState({
                feed: this.state.feed.map(post =>
                    post._id === newLike._id ? newLike : post
                )
            });
        })
    }

    handleLike = id =>{
        api.post(`/posts/${id}/like`);       
    }
    handleDelete = id =>{
        api.post(`/posts/${id}`);
    }
    showDropdownMenu = event => {
        event.preventDefault();
        this.setState({ displayMenu: true }, () => {
        document.addEventListener('click', this.hideDropdownMenu);
        });
      }
    hideDropdownMenu() {
        this.setState({ displayMenu: false }, () => {
          document.removeEventListener('click', this.hideDropdownMenu);
        });
    }

    render(){
        return (
          <section id="post-list">
              {this.state.feed.map(post => (
                <article key={post._id} id={post._id}>
                    <header>
                      <div className="user-info">
                          <span>{post.author}</span>
                          <span className="place">{post.place}</span>
                      </div>
                      <div className="dropdown">
                      <button type="button"  onClick={this.showDropdownMenu}>
                         <img src={more} alt="Mais"/>                       
                      </button>
                         { this.state.displayMenu ? (
                              <ul>
                                <li><span onClick={()=> this.handleDelete(post._id)}>Apagar</span></li>
                              </ul>
                         ) : (null)}
                        </div>
                     </header>
                     <img src={`http://192.168.1.22:2018/files/${post.image}`} alt={post.image}/>
                    <footer>
                        <div className="actions">
                            <button type="button" onClick={() => this.handleLike(post._id)}>
                                <img src={like} alt="Like"/>
                            </button>
                          <img src={comment} alt="Comentarios"/>
                          <img src={send} alt="Enviar"/>
                        </div> 
                        <strong>{post.likes} curtidas</strong>       
                        <p>{post.description}
                          <span>{post.hashtags}</span>
                        </p>
                    </footer>  
                </article>
              )
              )};
          </section>  
        );
    }
}

export default Feed;