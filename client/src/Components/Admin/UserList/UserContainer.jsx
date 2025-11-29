import React, { useState } from "react";
import './UserContainer.css';
import avatarImg from '../../../assets/avatar.png'; // Проверьте путь
import api from '../../../api/axios'; // Проверьте путь
import useUserStore from '../../../stores/userStore'; // Проверьте путь

export default function UserContainer({ user, onAction }) {
  const token = useUserStore((state) => state.token);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Delete user ${user.first_name} ${user.last_name}?`)) return;
    setLoading(true);
    try {
      await api.delete(`/user/${user.user_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (onAction) onAction();
    } catch (e) {
      alert('Error deleting user');
    } finally {
      setLoading(false);
    }
  };

  const handleBlock = async () => {
    setLoading(true);
    try {
      if (!user.is_blocked) {
        await api.patch(`/user/${user.user_id}/block`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await api.patch(`/user/${user.user_id}/unblock`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      if (onAction) onAction();
    } catch (e) {
      alert('Error updating user status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-container">
      <div className="user-avatar">
        <img 
            src={user.avatar || avatarImg} 
            alt="avatar" 
            onError={e => { if (e.target.src !== avatarImg) e.target.src = avatarImg; }} 
        />
      </div>
      
      <div className="user-info">
        <div className="user-name">{user.first_name} {user.last_name}</div>
        <div className="user-email">{user.email}</div>
      </div>
      
      <div className="user-actions">
        <button 
            className="user-block-btn" 
            onClick={handleBlock} 
            disabled={loading}
            style={user.is_blocked ? {backgroundColor: '#e3f2fd', color: '#1976d2'} : {}}
        >
          {user.is_blocked ? 'Unblock' : 'Block'}
        </button>
        
        <button 
            className="user-delete-btn" 
            onClick={handleDelete} 
            disabled={loading}
        >
          Delete
        </button>
      </div>
    </div>
  );
}