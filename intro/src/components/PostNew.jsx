import React, { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import './PostNew.css';

const API_URL = 'http://localhost:7070';

function PostNew() {
    const [content, setContent] = useState('');
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        try {
      setSaving(true);
      await axios.post(`${API_URL}/posts`, {
        id: 0,
        content: content.trim()
      });
      navigate('/posts');
    } catch (error) {
      console.error('Error creating post:', error);
      setSaving(false);
    }
    }

    return (
    <div className="post-new">
      <div className="post-card">
        <div className="post-card-header">
          <h2>Создание нового поста</h2>
          <button 
            className="close-button" 
            onClick={() => navigate('/posts')}
            disabled={saving}
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="content">Содержание:</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Введите текст поста..."
              rows="6"
              disabled={saving}
              autoFocus
            />
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-button"
              disabled={saving || !content.trim()}
            >
              {saving ? 'Публикация...' : 'Опубликовать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostNew;