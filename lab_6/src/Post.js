import React from 'react';
import './Post.css';
import { Avatar } from '@mui/material';

const Post = ({username, caption, imageUrl}) => {
    retrun (
        <div className="post">
            <div className="post__header">
                <Avatar 
                className="post__avatar"
                alt={username}
                src='static/images/avatar/1.jpg'
                />
                <h3>{username}</h3>
            </div>
            <img className="post__image" url={imageUrl} alt="React"/>
            <h4 className="post__text"><strong>{username}</strong>{caption}</h4>
        </div>
    )
}

export default Post;
