const express = require("express");
const session = require('express-session');
const cookies = require('cookie-parser');
const bodyparser = require("body-parser");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("./mongo")
const ejs = require('ejs');

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;
// Connect to MongoDB database using Mongoose


app.engine('html', ejs.renderFile);
app.set('view engine', 'ejs');
app.set('views', './src')

app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
app.use(cookies());
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false
   }));
app.use(express.static(__dirname + '/static'));

function CheckLogin(req, res) {
    if(req.session.user){
        return true;
    }
    else{
        return false;
    }
}

app.get("/", (req, res) => {
    if(CheckLogin(req, res)){
        res.render("index.html", { user: req.session.user });
    }
    else{
        res.redirect("/login");
    }
})

app.post("/register", async(req, res) => {
    try{
        const {name, email, password} = req.body;

        const alreadyexist = await User.findOne({email : email});

        if(!alreadyexist){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const user = new User({ name , email , password : hashedPassword });
            user.save();
            res.redirect("/");
        }
        else{
            res.status(401).send('<h3 style="text-align:center;color: red;;margin-top: 200px;">User Already Exists, Try giving other email.<br /><br /><br /><a href="/register" style="text-align: center;text-decoration: none;border: 1px solid blue;padding: 10px;">Try again</a></h3><br />');
        }
    }
    catch{
        res.status(401).send('<h3 style="text-align:center;color: red;;margin-top: 200px;">Something Went Wrong.<br /><br /><br /><a href="/register" style="text-align: center;text-decoration: none;border: 1px solid blue;padding: 10px;">Try again</a></h3><br />');
    }
})

app.post("/login", async(req, res) => {
    
    try{
        const {email, password} = req.body;
        const check = await User.findOne({email: email});
        if(check){
            bcrypt.compare(password, check.password, (err, result) => {
                if (result){
                    req.session.user = {
                        name: check.name,
                        email: check.email
                    }
                    res.redirect('/');
                    res.status(200);
                }   
                else{
                    res.status(201).send('<h3 style="text-align:center;color: red;margin-top: 200px;">Invalid Email or password<br /><br /><br /><a href="/" style="text-align: center;text-decoration: none;border: 1px solid blue;padding: 10px;">Try again</a></h3>');
                }
                
            })
        }
        else{
            res.status(201).send('<h3 style="text-align:center;color: red;;margin-top: 200px;">Invalid Email or password<br /><br /><br /><a href="/" style="text-align: center;text-decoration: none;border: 1px solid blue;padding: 10px;">Try again</a></h3><br />');
        }
    }
    catch{
        res.status(401).send('<h3 style="text-align:center;color: red;;margin-top: 200px;">Something Went Wrong.<br /><br /><br /><a href="/" style="text-align: center;text-decoration: none;border: 1px solid blue;padding: 10px;">Try again</a></h3><br />');
    }  
})

app.get("/register", (req, res) => {
    res.render('register.html');
})

app.get("/login", async(req, res) => {
    res.render('login.html');
})

app.get("/logout", (req, res) =>{
    req.session.destroy();
    res.redirect('/login');
})

app.get('*', function(req, res){
    res.render('404.html');
  });

app.listen(port, () =>{
    console.log(`Server is running on port ${port}`);
})