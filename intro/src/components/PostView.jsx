import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PostView.css';

const API_URL = 'http://localhost:7070';

function PostView() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState('');
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchPost();
    }, [id]);

    const fetchPost = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/posts/${id}`);
            if (response.data.post) {
                setPost(response.data.post);
                setEditContent(response.data.post.content);
            } else {
                setError('Пост не найден');
            }
        } catch (error) {
            console.error('Error fetching post:', error);
            setError('Ошибка при загрузке поста');
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async () => {
        if (!window.confirm('Вы уверены, что хотите удалить этот пост?')) return;

        try {
            setDeleting(true);
            await axios.delete(`${API_URL}/posts/${id}`);
            navigate('/posts');
        } catch (error) {
            console.error('Error deleting post:', error);
            setDeleting(false);
        }
    }

    const handleSave = async () => {
        if (!editContent.trim()) return;
        try {
            setSaving(true);
            await axios.put(`${API_URL}/posts/${id}`, {
                id: Number(id),
                content: editContent.trim()
            });
            setPost({ ...post, content: editContent.trim() })
            setIsEditing(false);
        } catch (error) {
            console.error('Error deleting post:', error);
        } finally {
            setSaving(false);
        }
    }
    const handleCancelEdit = () => {
        setEditContent(post.content);
        setIsEditing(false);
    }

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleString();
    };

    if (loading) {
        return <div className="loading">Загрузка...</div>;
    }

    if (error || !post) {
        return (
            <div className="error">
                <p>{error || 'Пост не найден'}</p>
                <button onClick={() => navigate('/posts')} className="back-button">
                    Вернуться к списку
                </button>
            </div>
        );
    }
    return (
        <div className="post-view">
            <div className="post-card">
                <div className="post-card-header">
                    <h2>Пост {post.id}</h2>
                    <span className="post-date">{formatDate(post.created)}</span>
                    <button onClick={() => navigate('/posts')} className="back-button">
                        ✕
                    </button>
                </div>

                {!isEditing ? (
                    <>
                        <div className="post-card-content">
                            <p>{post.content}</p>
                        </div>

                        <div className="post-card-footer">
                            <span className="post-author">Автор: Пользователь {post.id}</span>
                            <div className="post-actions">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="edit-button"
                                    disabled={deleting}
                                >
                                    Редактировать
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="delete-button"
                                    disabled={deleting}
                                >
                                    {deleting ? 'Удаление...' : 'Удалить'}
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    // Режим редактирования
                    <>
                        <div className="post-card-content">
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                rows="6"
                                disabled={saving}
                                autoFocus
                            />
                        </div>

                        <div className="post-card-footer">
                            <div className="post-actions">
                                <button
                                    onClick={handleSave}
                                    className="save-button"
                                    disabled={saving || !editContent.trim()}
                                >
                                    {saving ? 'Сохранение...' : 'Сохранить'}
                                </button>
                                <button
                                    onClick={handleCancelEdit}
                                    className="cancel-button"
                                    disabled={saving}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default PostView;