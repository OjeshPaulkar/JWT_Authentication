const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const JWT_SECRET = "ilovemia";
const port = 3000;

const users = [];

app.use(express.json());

function auth(req,res,next)  {
    const { token } = req.headers;
    const decodedToken = jwt.verify(token,JWT_SECRET);
    if(decodedToken.username){
        req.username = decodedToken.username;
        next();
    }else{
        res.status(404).json({msg : "User is not logged In, Please Login first"});
    }
}

app.get("/", (req,res) => {
    res.sendFile(__dirname + "/FrontEnd/index.html");
})


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


app.get("/me", auth,(req,res) => {
    const userInfo = req.username;
    res.json({msg : `Welcome ${userInfo}`});
    console.log(`Logged User is ${userInfo}`);
});


app.use((err,req,res,next) => {
    res.status(404).json({msg : "There was an error in application"})
});


app.listen(port, () => console.log(`Server is Live on Port ${port}`));
