import mongoose from "mongoose";

const mongoDB = 'mongodb://127.0.0.1:27017/learning'


if(!mongoDB){
    throw new Error("MongoDB connection string is not defined");
}

let cached = global.mongoose

if(!cached){
    cached = global.mongoose = {conn:null,promise:null}
}

async function connectDB(){
    if(cached.conn){
        return cached.conn
    }

    if(!cached.promise){
         cached.promise = mongoose.connect(mongoDB).then((mongoose) => {
            return mongoose
        })
    }

    try{
        cached.conn = await cached.promise
    }
    catch(err){
        cached.promise = null
        throw err
    }
}

export default connectDB;