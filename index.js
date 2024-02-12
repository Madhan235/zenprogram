import express from "express";
import { MongoClient } from "mongodb";
 import dotenv from 'dotenv';

 dotenv.config();

// app

const app = express();

app.use(express.json());

app.listen(process.env.port,console.log("Server Running on Port")
);

// db

const url = process.env.connectionString;

const connectToDB = async() =>{
    try {
        const client = new MongoClient(url);
       await client.connect();
       console.log("Connected to MongoDB");
       return client;
    } catch (error) {
        
        console.log(error);
    }
}

export const client = await connectToDB();


