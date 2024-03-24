import bodyParser from "body-parser";
import express from "express";
import {dirname} from "path";
import { fileURLToPath } from "url";
import nodemon from "nodemon";
const __dirname = dirname(fileURLToPath(import.meta.url));
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const name = process.env.USERNAME;
const pwd = process.env.Password;


const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(bodyParser.json());

mongoose.connect(`mongodb+srv://${name}:${pwd}@fromreg.lx16jws.mongodb.net/?retryWrites=true&w=majority&appName=fromreg`);

var db = mongoose.connection;
db.on("error", ()=> {console.log("error");});
db.once("open",()=>{console.log("Connection Established")});
const usersSchema = new mongoose.Schema({
    name :String,
    email:String,
    Password:String
});

const Registration= mongoose.model("RegData",usersSchema);

app.get("/",(req,res)=>{
    res.sendFile(__dirname + "/pages/index.html");
});


app.post("/login",async(req,res)=>{
    try {
        const {name,email,password}= req.body;
        const Existinguser = await Registration.findOne({"name":name},{"email":email});

        if (!Existinguser) {
            Registration({
                "name":name,
                "email":email,
                "Password":password
               }).save();
               res.redirect("/success");
        } else {
            res.redirect("/error");
        }
        
    } catch (error) {
        res.redirect("/error");
    }
});


app.get("/success",(req,res)=>{
    res.sendFile(__dirname+"/pages/success.html");
});

app.get("/error",(req,res)=>{
    res.sendFile(__dirname+"/pages/error.html");
});

app.listen(port, () => {
    console.log(`Server running on ${port}`);
});

