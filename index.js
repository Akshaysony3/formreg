import bodyParser from "body-parser";
import express from "express";
import {dirname} from "path";
import { fileURLToPath } from "url";
import nodemon from "nodemon";
const __dirname = dirname(fileURLToPath(import.meta.url));
import mongoose from "mongoose";

const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(bodyParser.json());


mongoose.connect("mongodb://0.0.0.0/?directConnection=true",{
    useNewUrlParser:true,
    useUnifiedTopology:true
});

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
    res.sendFile(__dirname + "/public/index.html");
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
    res.sendFile(__dirname+"/public/success.html");
});

app.get("/error",(req,res)=>{
    res.sendFile(__dirname+"/public/error.html");
});

app.listen(port, () => {
    console.log(`Server running on ${port}`);
});

