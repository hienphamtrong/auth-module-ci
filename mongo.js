const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;



mongoose.connect(
    `mongodb+srv://testuser:testpassword123@cluster0.xl1xrws.mongodb.net/?appName=Cluster0`,).then(()=>{
    console.log("Database connection successfull");
	
})
.catch(()=>{
    console.log("Database failed to connect");
});





const UserSchema = new mongoose.Schema({
    name: {
      type:String,
      required: true
    },
    email: {
      type:String,
      required: true
    },
    password: {
      type:String,
      required: true
    },
});

const User = mongoose.model("User", UserSchema);

module.exports=User