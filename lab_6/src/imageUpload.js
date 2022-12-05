import React, { useState } from 'react';
import './ImageUpload.css';
import { storage } from "../firebase";
import axios from '../axios';

const ImageUpload = ({username}) => {
    const [image, setImage] = useState(null);
    const [process, setProcess] = useState(0);
    const [caption, setCaption] = useState('');
    const [url, setUrl] = useState('');
    const handleChande = e => {
        if(e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    }    
    
    const handleUpload = () => {
        const ImageTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferref / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                console.log(error);
            },
            () => {
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadUrl()
                    .thenDownloadUrl()
                    .then((url) => {
                        setUrl(url);

                        axios.post('/upload', {
                            caption: caption,
                            user: username,
                            image: url
                        })

                        setProcess(0);
                        setCaption("");
                        setImage(null);
                    }); 
            }
        );
    };

    return (
        <div className="imageUpload">
            <progress className='imageUpload__progress' value={progress} max='100' />
            <input  
                type="text"
                placeholder='Enter a caption ...'
                className='imageUpload__input'
                value={caption}
                onChange={e => setCaption(e.target.value)}
            />
            <input className='imageUpload__file' type="file" onChange={handleChange} />
            <button className='imageUpload__button' onClick={handleUpload}>Upload</button>
        </div>
    )
}