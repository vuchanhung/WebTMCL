import mongoose from 'mongoose';

const postModel=mongoose.Schema({
    caption:String,
    user:String,
    image:String
});

export default mongoose.model('post',postModel);