import React, { useState, useEffect } from "react";

import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import './PostsList.css';

const API_URL = 'http://localhost:7070';

function PostList() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async() => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/posts`);
            setPosts(response.data);
        }catch(error){
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    }

    const formatDate = (timestamp) =>{
        return new Date(timestamp).toLocaleString();
    }
    if(loading){
        return <div className="loading">Загрузка...</div>
    }
    return (
    <div className="posts-list">
      <div className="posts-header">
        <h1>Посты пользователей</h1>
        <Link to="/posts/new" className="create-button">Создать</Link>
      </div>
      
      <div className="posts-grid">
        {posts.map(post => (
          <div 
            key={post.id} 
            className="post-card"
            onClick={() => navigate(`/posts/${post.id}`)}
          >
            <div className="post-card-header">
              <span className="post-id">ID: {post.id}</span>
              <span className="post-date">{formatDate(post.created)}</span>
            </div>
            <div className="post-card-content">
              <p>{post.content}</p>
            </div>
            <div className="post-card-footer">
              <span className="post-author">Автор: Пользователь {post.id}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostList;
