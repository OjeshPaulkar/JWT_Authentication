const express = require("express");
const port = 3000;
const app = express();

app.use(express.json());

const users = [];

function generateToken() {
    let options = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    let token = "";
    for (let i = 0; i < 32; i++) {
        // use a simple function here
        token += options[Math.floor(Math.random() * options.length)];
    }
    return token;
}

//SignUp Route
app.post("/signup", (req,res) => {
    const { username, password} = req.body;
    users.push({
        username : username,
        password : password
    })
    res.json({mag : "You are Signed Up"});
    console.log(users);
})


//SignIn Route
app.post("/signin", (req,res) => {
    const { username, password} = req.body;

    const signInUser = users.find((user) => user.username===username && user.password===password);

    if(signInUser){
        const token = generateToken();
        signInUser.token = token;
        res.json({token : token});
    }else{
        res.status(403).json("Username or Password is Invalid");
    }
    console.log(users);
})

app.get("/me", (req,res) => {
    const token = req.headers.authorization;
    const me = users.find((user) => user.token===token);
    if(me){
        const name = me.username;
        res.json({msg : `Welcome ${name}`});
    }else{
        res.send(403).json({error : "User is Unauthorized"});
    } 
})

app.use(function(err,req,res,next) {
    res.status(404).json({error : "There was an Error"})
})

app.listen(port, () => {
    console.log("Server is Live");
})