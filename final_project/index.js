const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    const authHeeader = req.headers['authorization'];
    const token = authHeeader && authHeeader.split(' ')[1];

    if(!token){
        return res.status(401).jason({ message: 'Acess token not found'});
    }

    try{
        const decoded = jwt.verify(token, ' ');

        req.user = decoded;

        next();
    } catch (err) {
        return res.status(403).jason({message: 'Invalid access token'})
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
