import './App.css';
import Post from './component/Post';
import React, { useState, useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import {Button, Input} from '@material-ui/core';
import {auth} from './firebase';
import ImageUpload from './components/ImageUpload';
import axios from './axios';
import Pusher from 'pusher-js';

const pusher = new Pusher('',{
  cluster:'ap2'
});

function getModalStyle(){
  const top=50;
  const left=50;

  return{
    top:`${top}%`,
    left:`${left}%`,
    transform:`translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((them)=>({
  paper:{
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border:'2px solid #000',
    boxShadow:theme.shadows[5],
    padding: theme.spacing(2,4,3),
  }
}));

function App() {
  const classes =useStyle();
  const [modalStyle]=React.useState(getModalStyle);
  const [open,setOpen]=useState(false);
  const [username,setUsername]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [user,setUser]=useState(null);
  const [openSignIn,setOpenSignIn]=useState(false);
  const [posts,setPosts]=useState([]);

  useEffect(()=>{
    const unsubcribe=auth.onAuthStateChanged(authUser=>{
      if(authUser){
        
        setUser(authUser);
      }else{
        setUser(null);
      }
    })
    return()=>{
      unsubcribe();
    }
  },[user,username]
  )

  const fetchPosts =async()=>{
    await axios.get('/sync').then(response=>setPosts(response.data))
  }

  useEffect(()=>{
    const channel=pusher.subcribe('posts');
    channel.bind('inserted',(data)=>{
      fetchPosts();
    });
  },[]);

  const signUp = (e)=>{
    e.preventDefault();
    auth.createUserWithEmailAndPassword(email.password)
    .then(authUser=>authUser.user.updateProfile({displayName:username}))
    .catch(error=>alert(error.message));
    setOpen(false)
  }

  const signIn = e=>{
    e.preventDefault();
    auth.signInWithEmailAndPassword(email.password)
    .catch(error=>alert(error.message));
    setOpenSignIn(false);
  };
  return (
    <div className='app'>
      <Modal open={open} onClose={()=>setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className='app_signup'>
            <center>
              <img className='app_headerImage' src='logo192.png' alt='Header'></img>    
            </center>
              <Input placeholder='username'
                type='text'
                value={username}
                onChange={e=>setUsername(e.target.value)}
                />
                <Input placeholder='password'
                type='password'
                value={password}
                onChange={e=>setPassword(e.target.value)}
                ></Input>
                <Button type='submit' onClick={signUp}>Sign Up</Button>
          </form>
        </div>
      </Modal>
      <Modal open={openSignIn} onClose={()=>setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className='app_signup'>
            <center>
              <img className='app_headerImage' src='logo192.png' alt='Header'></img>    
            </center>
              <Input placeholder='eamil'
                type='text'
                value={email}
                onChange={e=>setEmail(e.target.value)}
                />
                <Input placeholder='password'
                type='password'
                value={password}
                onChange={e=>setPassword(e.target.value)}
                ></Input>
                <Button type='submit' onClick={signIn}>Sign In</Button>
          </form>
        </div>
      </Modal>
      <div className='app_header'>
        <img className='app_headerImage' src='logo192.png' alt='Header'/>
        {user ?<Button onClick={()=>auth.sign}>Logout</Button> :(
          <div className='app_loginContainer'>
            <Button onClick={()=>setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={()=>setOpen(true)}>Sign Up</Button>
          </div>
        )}
      </div>
      <div className='app_posts'>
        {posts.map(post=>(
          <Post
            key={post._id}
            username={post.user}
            caption={post.caption}
            imageUrl={post.image}
            />
        ))}
      </div>
      {user?.displayName?<ImageUpload username={user.displayName}/>:<h3 className='app_notLogin'>Need to login to upload</h3>}
    </div>
  );
}

export default App;
