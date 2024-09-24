const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const JWT_SECRET = "ilovemia";
const port = 3000;

const users = [];

app.use(express.json());

app.post("/signup", (req,res) => {
    const { username, password } = req.body;
    if(users.find((un) => un.username==username)){
      return  res.status(403).json({msg:"User with this name already exist"});
    }
    users.push({
        username : username,
        password : password
    });
    res.json({msg : "You Are Sucessfully Signed Up"})
    console.log(users);
});


app.post("/signin", (req,res) => {
    const { username, password } = req.body;
    if(users.find((user) => user.username==username && user.password==password)){
        const token = jwt.sign({
            "username" : username
        }, JWT_SECRET)
        res.json({"token" : token})
    }else{
        res.status(403).json({msg : "user not found"});
    }
    console.log(users);
});

app.get("/me", (req,res) => {
    const { token } = req.headers;
    const decryptedToken = jwt.verify(token, JWT_SECRET);

    if (decryptedToken){
    const userInfo = decryptedToken.username;
    res.json({msg : `Welcome ${userInfo}`});
    }else{
        res.status(403).json({error: "Invalid session"})
    }
    console.log(`Logged User is ${userInfo}`);
});


app.use((err,req,res,next) => {
    res.status(404).json({msg : "There was an error in application"})
});


app.listen(port, () => console.log(`Server is Live on Port ${port}`));
