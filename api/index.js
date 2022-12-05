import express from 'express';
import mongoose from 'mongoose';
import Cors from 'cors';
import Pusher from 'pusher';
import Posts from './models/Posts.js';
import dotenv from 'dotenv';

dotenv.config();
const app =express();
const port = process.env.Port || 9000;
const connection_url=process.env.DB_CONN;

const pusher = new Pusher({
    appID: process.env.PUSHER_ID,
    key:process.env.PUSHER_KEY,
    secret:process.env.PUSHER_SECRET,
    cluster:'ap2',
    useTLS:true
});

app.use(express.json());
app.use(Cors());

mongoose.connect(connection_url,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
});

mongoose.connection.once('open', () => {
    console.log('DB Connected');
    const changeStream =mongoose.connection.collection('posts').watch();
    changeStream.on('change',change => {
        console.log(change)
        if(change.operationType==='insert'){
            console.log('Triggering Pusher');
            pusher.trigger('posts','inserted',{
                change:change
            })
        }else{
            console.log('Error triggering Pusher');
        }
    });
});

app.get('/',(req,res) => res.status(200).send('Hello TheWebDev'));

app.post('/upload',(req,res) => {
    const dbPost = req.body;
    Posts.creat(dbPost, (err,data) => {
        if(err){
            res.status(500).send(err);
        }else{
            res.status(201).send(data);
        }
    });
});

app.get('/sync',(req,res) => {
    Posts.find((err,data) => {
        if(err){
            res.status(500).send(err);
        }else{
            res.status(200).send(data);
        }
    });
});

app.listen(port,() => console.log(`Listening on localhost: ${port}`));