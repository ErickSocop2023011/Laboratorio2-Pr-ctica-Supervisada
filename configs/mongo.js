import mongoose from "mongoose"

export const dbconnection = async () => {
    try{
        console.log('error', () =>{
            console.log('MongoDB | could not be connect to MongoDB')
            mongoose.disconnect()
        })
        mongoose.connection.on('connecting', () =>{
            console.log('MongoDB | try connecting')
        })
        mongoose.connection.on('connected', () =>{
            console.log('MongoDB | connected to mongoDB')
        })
        mongoose.connection.on('open', () =>{
            console.log('MongoDB | connecte do DataBase')
        })
        mongoose.connection.on('reconnected', () =>{
            console.log('MongoDB | reconnected to MongoDB')
        })
        mongoose.connection.on('disconnected', () =>{
            console.log('MongoDB | disconnected to MongoDB')
        }) 

        await mongoose.connect(process.env.URI_MONGO,{
            serverSelectionTimeOutMS: 5000,
            maxPoolSize: 50
        })
    }catch(err){
        console.log(`Database connection failed ${err}`)
    }
}